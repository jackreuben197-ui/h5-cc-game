import { ClientMessageEnterRoom, Code, Def } from '@silenthill/agreement-web';
import { createLogger } from '../core/decorator/LogTrace';
import roomDataManager from '../data/room/RoomDataManager';
import TexasGameRoomData from '../data/room/texas/TexasGameRoomData';
import ProtocolAgency from '../net/websocket/ProtocolAgency';
import viewManager from '../views/UIViewManager';

export interface RoomReconnectContext {
    roomID: number;
    matchID: number;
    roomType: number;
    websocketPort?: number;
    observer?: boolean;
    mttPartialBringIn?: number;
    wantSeat?: Def.WantSeatTypeMap[keyof typeof Def.WantSeatType];
}

const _plog = createLogger('RoomReconnectManager');

class RoomReconnectManager {
    private _currentContext: RoomReconnectContext | null = null;
    private _reconnecting: boolean = false;

    public setCurrentContext(context: RoomReconnectContext): void {
        this._currentContext = {
            ...context,
            observer: context.observer ?? false,
            mttPartialBringIn: context.mttPartialBringIn ?? 0,
            wantSeat: context.wantSeat ?? Def.WantSeatType.WST_BOTH
        };
    }

    public clearCurrentContext(roomID?: number, matchID?: number): void {
        if (roomID !== undefined && matchID !== undefined && this._currentContext) {
            if (this._currentContext.roomID !== roomID || this._currentContext.matchID !== matchID) return;
        }
        this._currentContext = null;
        this._reconnecting = false;
    }

    public get currentContext(): RoomReconnectContext | null {
        return this._currentContext;
    }

    public markReconnecting(): void {
        this._reconnecting = true;
        viewManager.showPrompting();
    }

    public requestReconnect(): void {
        const context = this._currentContext;
        if (!context) {
            _plog.warn('no current room context, ignore reconnect');
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
        const body: ClientMessageEnterRoom.AsObject = {
            room: { roomId: context.roomID, matchId: context.matchID },
            gps: { longitude: '', latitude: '' },
            mttPartialBringIn: context.mttPartialBringIn ?? 0,
            observer: context.observer ?? false,
            wantSeat: context.wantSeat ?? Def.WantSeatType.WST_BOTH
        };
        ProtocolAgency.Send({
            code: Code.MSG_D_ENTER_ROOM,
            roomID: context.roomID,
            matchID: context.matchID,
            body
        });
        _plog.info('re-enter room requested', context.roomID, context.matchID);
    }

    public consumeReconnectFlag(roomID: number, matchID: number): boolean {
        const wasReconnecting = this._reconnecting;
        if (wasReconnecting) {
            this._reconnecting = false;
            viewManager.hidePrompting();
        }
        if (this._currentContext) {
            this._currentContext.roomID = roomID;
            this._currentContext.matchID = matchID;
        }
        return wasReconnecting;
    }

    public failReconnect(reason: string): void {
        this._reconnecting = false;
        viewManager.hidePrompting();
        _plog.warn('reconnect failed', reason);
    }
}

const roomReconnectManager = new RoomReconnectManager();

export default roomReconnectManager;
