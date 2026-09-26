import { ClientMessageSyncEnter, Code } from '@silenthill/agreement-web';
import { traceClass } from '../core/decorator/LogTrace';
import roomDataManager from '../data/room/RoomDataManager';
import TexasGameRoomData from '../data/room/texas/TexasGameRoomData';
import ProtocolAgency from '../net/websocket/ProtocolAgency';
import viewManager from '../views/UIViewManager';
import { MTT_MATCH_ENTRY_ROOM_ID } from './constant/Constants';
import ProcedureDefine from './procedure/ProcedureDefine';
import { ProcedureEnterRoomParam } from './procedure/ProcedureEnterRoom';
import ProcedureManager from './procedure/ProcedureManager';

export interface RoomReconnectContext {
    roomID: number;
    matchID: number;
}

interface InternalContext extends RoomReconnectContext {
    failedCount: number;
}

@traceClass()
class RoomReconnectManager {
    private _contexts: InternalContext[] = [];
    private _reconnectMap: Map<string, ReturnType<typeof setTimeout>> = new Map();
    private _resumeSyncTimer: ReturnType<typeof setTimeout> = null;
    private _lifecycleListening: boolean = false;
    private _transportReconnecting: boolean = false;
    private static readonly RECONNECT_TIMEOUT = 10000; //10s
    private static readonly RESUME_SYNC_DELAY = 300;
    // 单 context 连续失败超过该阈值即剔除, 避免对死房间无限重试
    private static readonly MAX_FAILED_COUNT = 3;

    public addContext(context: RoomReconnectContext): void {
        this._ensureLifecycleListening();
        // 1. 同时校验 roomID 和 matchID
        const index = this._contexts.findIndex(c => c.roomID === context.roomID && c.matchID === context.matchID);
        if (index !== -1) {
            // 2. 如果存在完全相同的 context，捞出来
            const [existingContext] = this._contexts.splice(index, 1);
            existingContext.failedCount = 0;
            // 提到最前面
            this._contexts.unshift(existingContext);
        } else {
            // 3. 如果不存在，直接深拷贝一份放入最前面（防止外部对象污染）
            this._contexts.unshift({
                roomID: context.roomID,
                matchID: context.matchID,
                failedCount: 0
            });
        }
    }

    public clearAllContext() {
        this._contexts = [];
        this._transportReconnecting = false;
        if (this._resumeSyncTimer) {
            clearTimeout(this._resumeSyncTimer);
            this._resumeSyncTimer = null;
        }
        this._reconnectMap.forEach(t => clearTimeout(t));
        this._reconnectMap.clear();
        viewManager.hidePrompting();
    }

    private _genKey(roomID: number, matchID: number): string {
        return roomID + '-' + matchID;
    }

    /** 主动离开某个房间可能需要，就是离开房间A，直接跳到房间B，目前用不到 */
    public clearContext(roomID: number, matchID: number): void {
        this._removeContext(roomID, matchID);
        this._updatePromptingForVisible();
    }

    public replaceContext(oldRoomID: number, newRoomID: number, matchID: number): void {
        // 换桌后同步替换重连键，避免继续请求旧牌桌。
        this._removeContext(oldRoomID, matchID);
        this.addContext({ roomID: newRoomID, matchID });
        this._updatePromptingForVisible();
    }

    private _removeContext(roomID: number, matchID: number): void {
        const index = this._contexts.findIndex(c => c.roomID === roomID && c.matchID === matchID);
        // 找到了就从数组中抹去
        if (index !== -1) {
            this._contexts.splice(index, 1);
        }
        const key = this._genKey(roomID, matchID);
        const timer = this._reconnectMap.get(key);
        if (timer) {
            clearTimeout(timer);
            this._reconnectMap.delete(key);
        }
    }

    private _isInRoom(): boolean {
        const proc = ProcedureManager.currProcedure;
        return proc != null && proc.id === ProcedureDefine.EnterRoom;
    }

    /** 当前 procedure 正在展示的房间 (多桌场景下其他 context 不可见) */
    private _getVisibleRoom(): RoomReconnectContext | null {
        const proc = ProcedureManager.currProcedure;
        if (proc?.id !== ProcedureDefine.EnterRoom) return null;
        const param = proc.param as ProcedureEnterRoomParam | null;
        if (!param) return null;
        return { roomID: param.roomID, matchID: param.matchID };
    }

    private _isVisibleRoom(roomID: number, matchID: number): boolean {
        const v = this._getVisibleRoom();
        return v != null && v.roomID === roomID && v.matchID === matchID;
    }

    private _hasContext(roomID: number, matchID: number): boolean {
        return this._contexts.some(c => c.roomID === roomID && c.matchID === matchID);
    }

    /** 仅当可见房间的 sync 还没完成时显示转圈, 后台房间静默处理 */
    private _updatePromptingForVisible(): void {
        const visible = this._getVisibleRoom();
        if (!visible) {
            viewManager.hidePrompting();
            return;
        }
        const key = this._genKey(visible.roomID, visible.matchID);
        if (this._reconnectMap.has(key)) {
            viewManager.showPrompting();
        } else {
            viewManager.hidePrompting();
        }
    }

    public markReconnecting(): void {
        this._transportReconnecting = true;
        if (!this._isInRoom()) return;
        // 清掉上一轮残留 timer, 否则下一次 requestReconnect 会被 _reconnectMap.has(key) 短路
        this._reconnectMap.forEach(t => clearTimeout(t));
        this._reconnectMap.clear();
        const visible = this._getVisibleRoom();
        if (visible && this._hasContext(visible.roomID, visible.matchID)) {
            viewManager.showPrompting();
        }
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
        // 拷贝一份再迭代，超时回调可能改动 contexts。
        this._requestContexts(this._contexts.slice());
    }

    /** H5 WebSocket 已恢复，放开页面恢复同步并立即拉取权威快照。 */
    public markReconnected(): void {
        this._transportReconnecting = false;
        this.requestReconnect();
    }

    private _onReconnectTimeout(roomID: number, matchID: number): void {
        const key = this._genKey(roomID, matchID);
        this._reconnectMap.delete(key);
        const ctx = this._contexts.find(c => c.roomID === roomID && c.matchID === matchID);
        if (!ctx) {
            this._updatePromptingForVisible();
            return;
        }
        ctx.failedCount++;
        if (ctx.failedCount >= RoomReconnectManager.MAX_FAILED_COUNT) {
            this.tracelog.warn('reconnect retries exhausted, drop context', roomID, matchID, ctx.failedCount);
            const wasVisible = this._isVisibleRoom(roomID, matchID);
            const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
            this._removeContext(roomID, matchID);
            if (wasVisible) {
                viewManager.hidePrompting();
                if (roomData?.basicInfo.isMtt) {
                    // MTT 房间失效后按比赛维度重新向服务端申请当前牌桌。
                    roomDataManager.deleteRoomData(roomID, matchID);
                    ProcedureManager.RestartEnterRoom({
                        roomID: MTT_MATCH_ENTRY_ROOM_ID,
                        matchID,
                        roomType: roomData.basicInfo.roomType,
                        observer: roomData.mtt.observer
                    });
                    return;
                }
                ProcedureManager.StartProcedure(ProcedureDefine.Return);
                return;
            }
        } else {
            this.tracelog.warn('sync enter timeout', roomID, matchID, 'failed', ctx.failedCount);
        }
        this._updatePromptingForVisible();
    }

    /** 正常重连房间结束 */
    public syncEnterComplete(roomID: number, matchID: number) {
        const key = this._genKey(roomID, matchID);
        const timer = this._reconnectMap.get(key);
        if (timer) {
            clearTimeout(timer);
            this._reconnectMap.delete(key);
        }
        const ctx = this._contexts.find(c => c.roomID === roomID && c.matchID === matchID);
        if (ctx) ctx.failedCount = 0;
        this._updatePromptingForVisible();
        this.tracelog.info('sync enter requested(complete)', roomID, matchID);
    }

    /** 清理所有重连房间 */
    public failReconnect(reason: string): void {
        this._transportReconnecting = false;
        this.tracelog.warn('reconnect failed', reason);
        this.clearAllContext();
    }

    private _ensureLifecycleListening(): void {
        if (this._lifecycleListening) return;
        this._lifecycleListening = true;
        cc.game.on(cc.game.EVENT_SHOW, this._onGameShow, this);
    }

    private _onGameShow(): void {
        if (this._resumeSyncTimer) clearTimeout(this._resumeSyncTimer);
        // 给 H5 的 wsReconnecting/wsReconnected 事件留出一小段时间，避免在传输层尚未就绪时发包。
        this._resumeSyncTimer = setTimeout(() => {
            this._resumeSyncTimer = null;
            this._requestVisibleRoomSnapshot();
        }, RoomReconnectManager.RESUME_SYNC_DELAY);
    }

    private _requestVisibleRoomSnapshot(): void {
        if (this._transportReconnecting || !this._isInRoom()) return;
        const visible = this._getVisibleRoom();
        if (!visible || !this._hasContext(visible.roomID, visible.matchID)) return;
        const roomData = roomDataManager.getRoomData<TexasGameRoomData>(visible.roomID, visible.matchID);
        if (!roomData) return;
        if (roomData.basicInfo.isMtt && roomData.mtt.tableTransferWaiting) {
            // 换桌期间由新桌 EnterRoom 快照接管，不再向旧桌/迁移中的房间发 SyncEnter。
            this.tracelog.info('skip resume sync while table transfer is waiting', visible.roomID, visible.matchID);
            return;
        }
        this.tracelog.info('page resumed, request visible room snapshot', visible.roomID, visible.matchID);
        const context = this._contexts.find(c => c.roomID === visible.roomID && c.matchID === visible.matchID);
        if (context) this._requestContexts([context]);
    }

    private _requestContexts(contexts: InternalContext[]): void {
        contexts.forEach(context => {
            const key = this._genKey(context.roomID, context.matchID);
            if (this._reconnectMap.has(key)) return;
            const roomData = roomDataManager.getRoomData(context.roomID, context.matchID);
            if (!roomData) {
                this.tracelog.warn('no room data for reconnect', context.roomID, context.matchID);
                return;
            }
            const timer = setTimeout(() => {
                this._onReconnectTimeout(context.roomID, context.matchID);
            }, RoomReconnectManager.RECONNECT_TIMEOUT);
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
        this._updatePromptingForVisible();
    }
}

const roomReconnectManager = new RoomReconnectManager();

export default roomReconnectManager;
