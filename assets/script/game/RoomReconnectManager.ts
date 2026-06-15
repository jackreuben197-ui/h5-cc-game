import { ClientMessageSyncEnter, Code } from '@silenthill/agreement-web';
import { createLogger } from '../core/decorator/LogTrace';
import roomDataManager from '../data/room/RoomDataManager';
import TexasGameRoomData from '../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataBasic from '../data/room/texas/TexasGameRoomDataBasic';
import ProtocolAgency from '../net/websocket/ProtocolAgency';
import viewManager from '../views/UIViewManager';
import ProcedureDefine from './procedure/ProcedureDefine';
import ProcedureManager from './procedure/ProcedureManager';

export interface RoomReconnectContext {
    roomID: number;
    matchID: number;
}

const _plog = createLogger('RoomReconnectManager');

class RoomReconnectManager {
    private _currentContext: RoomReconnectContext | null = null;
    private _reconnecting: boolean = false;
    // 等待 SyncEnter 回包应用快照时挂在 basicInfo 上的一次性订阅；超时/失败时需要主动拔掉
    private _pendingTarget: cc.EventTarget | null = null;
    private _pendingHandler: (() => void) | null = null;

    public setCurrentContext(context: RoomReconnectContext): void {
        this._currentContext = { roomID: context.roomID, matchID: context.matchID };
    }

    public clearCurrentContext(roomID?: number, matchID?: number): void {
        if (roomID !== undefined && matchID !== undefined && this._currentContext) {
            if (this._currentContext.roomID !== roomID || this._currentContext.matchID !== matchID) return;
        }
        this._currentContext = null;
        this._reconnecting = false;
        this._detachPendingListener();
    }

    public get currentContext(): RoomReconnectContext | null {
        return this._currentContext;
    }

    private isInRoom(): boolean {
        return ProcedureManager.currProcedure?.id === ProcedureDefine.EnterRoom;
    }

    public markReconnecting(): void {
        if (!this.isInRoom()) return;
        this._reconnecting = true;
        viewManager.showPrompting();
    }

    public requestReconnect(): void {
        if (!this.isInRoom()) {
            _plog.info('not in room procedure, skip reconnect');
            viewManager.hidePrompting();
            return;
        }
        const context = this._currentContext;
        if (!context) {
            _plog.warn('no current room context, skip reconnect');
            viewManager.hidePrompting();
            return;
        }
        const roomData = roomDataManager.getRoomData<TexasGameRoomData>(context.roomID, context.matchID);
        if (!roomData) {
            _plog.warn('no room data for reconnect', context.roomID, context.matchID);
            viewManager.hidePrompting();
            return;
        }
        this._reconnecting = true;
        // 订阅一次"快照已应用"事件 —— 收到则视为重连完成。消息层 (SyncEnter.ts) 不再
        // 与本管理器耦合，applyRoomSnapshot 内部 emit 即可。
        this._detachPendingListener();
        const target = roomData.basicInfo;
        const handler = () => {
            this._pendingTarget = null;
            this._pendingHandler = null;
            this._consumeReconnectFlag(context.roomID, context.matchID);
        };
        target.once(TexasGameRoomDataBasic.SNAPSHOT_APPLIED, handler, this);
        this._pendingTarget = target;
        this._pendingHandler = handler;

        const body: ClientMessageSyncEnter.AsObject = {
            room: { roomId: context.roomID, matchId: context.matchID }
        };
        ProtocolAgency.Send({
            code: Code.MSG_D_SYNC_ENTER,
            roomID: context.roomID,
            matchID: context.matchID,
            body
        });
        _plog.info('sync enter requested', context.roomID, context.matchID);
    }

    public failReconnect(reason: string): void {
        this._detachPendingListener();
        this._reconnecting = false;
        viewManager.hidePrompting();
        _plog.warn('reconnect failed', reason);
    }

    private _consumeReconnectFlag(roomID: number, matchID: number): void {
        if (this._reconnecting) {
            this._reconnecting = false;
            viewManager.hidePrompting();
        }
        if (this._currentContext) {
            this._currentContext.roomID = roomID;
            this._currentContext.matchID = matchID;
        }
    }

    private _detachPendingListener(): void {
        if (this._pendingTarget && this._pendingHandler) {
            this._pendingTarget.off(TexasGameRoomDataBasic.SNAPSHOT_APPLIED, this._pendingHandler, this);
        }
        this._pendingTarget = null;
        this._pendingHandler = null;
    }
}

const roomReconnectManager = new RoomReconnectManager();

export default roomReconnectManager;
