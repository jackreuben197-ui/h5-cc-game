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
    // 是否可以重连
    private _valid: boolean = false;

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
    }

    private _genKey(roomID: number, matchID: number): string {
        return roomID + '-' + matchID;
    }

    public clearContext(roomID: number, matchID: number): void {
        const index = this._contexts.findIndex(c => c.roomID === roomID && c.matchID === matchID);
        // 找到了就从数组中抹去
        if (index !== -1) {
            this._contexts.splice(index, 1);
        }
        this._reconnectMap.delete(this._genKey(roomID, matchID));
    }

    private isInRoom(): boolean {
        return ProcedureManager.currProcedure?.id === ProcedureDefine.EnterRoom;
    }

    public markReconnecting(): void {
        if (!this.isInRoom()) return;
        viewManager.showPrompting();
    }

    public requestReconnect(): void {
        if (!this.isInRoom()) {
            this.tracelog.info('not in room procedure, skip reconnect');
            viewManager.hidePrompting();
            return;
        }
        if (this._contexts.length == 0) {
            this.tracelog.info('no room context, skip reconnect');
            viewManager.hidePrompting();
            return;
        }
        // 调用这个时候是 wsConnected 必然是可以的
        this._valid = true;
        this._contexts.forEach(context => {
            const roomData = roomDataManager.getRoomData(context.roomID, context.matchID);
            const key = this._genKey(context.roomID, context.matchID);
            // 上次重连还没结束
            if (this._reconnectMap.has(key)) {
                return;
            }
            // 超时清理
            const timer = setTimeout(() => this._reconnectMap.delete(key), RoomReconnectManager.RECCONECT_TIMEOUT);
            this._reconnectMap.set(key, timer);
            if (!roomData) {
                this.tracelog.warn('no room data for reconnect', context.roomID, context.matchID);
                viewManager.hidePrompting();
                return;
            }
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
            this.tracelog.info('sync enter requested', context.roomID, context.matchID);
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
    }

    /** 清理所有重连房间 */
    public failReconnect(reason: string): void {
        this._valid = false;
        viewManager.hidePrompting();
        this.tracelog.warn('reconnect failed', reason);
    }
}

const roomReconnectManager = new RoomReconnectManager();

export default roomReconnectManager;
