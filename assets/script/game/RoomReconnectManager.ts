import { ClientMessageSyncEnter, Code } from '@silenthill/agreement-web';
import { traceClass } from '../core/decorator/LogTrace';
import roomDataManager from '../data/room/RoomDataManager';
import TexasGameRoomData from '../data/room/texas/TexasGameRoomData';
import ProtocolAgency from '../net/websocket/ProtocolAgency';
import viewManager from '../views/UIViewManager';
import ProcedureDefine from './procedure/ProcedureDefine';
import ProcedureManager from './procedure/ProcedureManager';

export interface RoomReconnectContext {
    roomID: number;
    matchID: number;
}

@traceClass()
class RoomReconnectManager {
    private _contexts: RoomReconnectContext[] = [];
    private _reconnectMap: Map<string, number> = new Map();
    private static readonly RECCONECT_TIMEOUT = 10000; //10s

    public addContext(context: RoomReconnectContext): void {
        // 1. 同时校验 roomID 和 matchID
        const index = this._contexts.findIndex(c => c.roomID === context.roomID && c.matchID === context.matchID);
        if (index !== -1) {
            // 2. 如果存在完全相同的 context，捞出来
            const [existingContext] = this._contexts.splice(index, 1);
            // 提到最前面
            this._contexts.unshift(existingContext);
        } else {
            // 3. 如果不存在，直接深拷贝一份放入最前面（防止外部对象污染）
            this._contexts.unshift({
                roomID: context.roomID,
                matchID: context.matchID
            });
        }
    }

    public clearAllContext() {
        this._contexts = [];
        this._reconnectMap.forEach(v => {
            clearInterval(v);
        });
        this._reconnectMap.clear();
        viewManager.hidePrompting();
    }

    private _genKey(roomID: number, matchID: number): string {
        return roomID + '-' + matchID;
    }

    /** 主动离开某个房间可能需要，就是离开房间A，直接跳到房间B，目前用不到 */
    public clearContext(roomID: number, matchID: number): void {
        const index = this._contexts.findIndex(c => c.roomID === roomID && c.matchID === matchID);
        // 找到了就从数组中抹去
        if (index !== -1) {
            this._contexts.splice(index, 1);
        }
        this._reconnectMap.delete(this._genKey(roomID, matchID));
    }

    private _isInRoom(): boolean {
        return ProcedureManager.currProcedure?.id === ProcedureDefine.EnterRoom;
    }

    public markReconnecting(): void {
        if (!this._isInRoom()) return;
        viewManager.showPrompting();
    }

    public requestReconnect(): void {
        if (!this._isInRoom()) {
            this.tracelog.info('not in room procedure, skip reconnect');
            viewManager.hidePrompting();
            return;
        }
        if (this._contexts.length == 0) {
            this.tracelog.info('no room context, skip reconnect');
            viewManager.hidePrompting();
            return;
        }
        // 如果上次重连没结束, 继续操作, 也许可以选择清理全部,重新开始，这里可以做逻辑就是，
        // 如果多次这样的重连,最后弹出窗口，
        // 让用户到网络稳定后手动选择重连（@TODO）优化项目
        if (this._reconnectMap.size > 0) {
            this.tracelog.warn('last reconnect is not complete, ignore, continue');
        }
        // 调用这个时候是 wsConnected 必然是可以的
        this._contexts.forEach(context => {
            const key = this._genKey(context.roomID, context.matchID);
            // 上次重连还没结束
            if (this._reconnectMap.has(key)) {
                return;
            }
            const roomData = roomDataManager.getRoomData(context.roomID, context.matchID);
            if (!roomData) {
                this.tracelog.warn('no room data for reconnect', context.roomID, context.matchID);
                viewManager.hidePrompting();
                return;
            }
            // 超时清理(超时时间可以优化到以后阶梯处理5，10，20，30，60等)
            const timer = setTimeout(() => {
                this._reconnectMap.delete(key);
                if (this._reconnectMap.size == 0) {
                    viewManager.hidePrompting();
                }
            }, RoomReconnectManager.RECCONECT_TIMEOUT);
            // 设置重连房间锁（不要重复请求)
            this._reconnectMap.set(key, timer);
            if (roomData instanceof TexasGameRoomData) {
                const body: ClientMessageSyncEnter.AsObject = {
                    room: { roomId: context.roomID, matchId: context.matchID }
                };
                ProtocolAgency.Send({
                    code: Code.MSG_D_SYNC_ENTER,
                    roomID: context.roomID,
                    matchID: context.matchID,
                    body
                });
            }
            this.tracelog.info('sync enter requested(start)', context.roomID, context.matchID);
        });
    }

    /** 正常重连房间结束 */
    public syncEnterCompete(roomID: number, matchID: number) {
        const key = this._genKey(roomID, matchID);
        const timer = this._reconnectMap.get(key);
        if (timer) {
            clearInterval(timer);
            this._reconnectMap.delete(key);
        }
        if (this._reconnectMap.size == 0) {
            viewManager.hidePrompting();
        }
        this.tracelog.info('sync enter requested(complete)', roomID, matchID);
    }

    /** 清理所有重连房间 */
    public failReconnect(reason: string): void {
        viewManager.hidePrompting();
        this.tracelog.warn('reconnect failed', reason);
    }
}

const roomReconnectManager = new RoomReconnectManager();

export default roomReconnectManager;
