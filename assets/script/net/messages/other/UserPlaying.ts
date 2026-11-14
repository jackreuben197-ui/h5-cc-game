import { Code, ServerMessageUserPlaying } from '@silenthill/agreement-web';
import h5MessageManager, { DialogResultPayload } from '../../../H5MsgMgr';
import { i18nMgr } from '../../../i18n/i18nMgr';
import ProcedureDefine from '../../../game/procedure/ProcedureDefine';
import ProcedureManager from '../../../game/procedure/ProcedureManager';
import { createLogger } from '../../../core/decorator/LogTrace';
import TexasTableEvent from '../../../views/scene/room/texas/events/TexasTableEvent';

const _plog = createLogger('ServerMessageUserPlaying', 'info');

type RecoverableRoom = {
    roomID: number;
    matchID: number;
    roomType: number;
};

let pendingRoom: RecoverableRoom | null = null;
let pendingDialogRequestID = '';

const leavePendingRoom = (room: RecoverableRoom | null): void => {
    if (room) {
        TexasTableEvent.SendLeaveRoomById(room.roomID, room.matchID);
    }
    void ProcedureManager.StartProcedure(ProcedureDefine.Return);
};

const onDialogResult = (payload: DialogResultPayload): void => {
    if (!payload || payload.dialogRequestId !== pendingDialogRequestID) return;

    const room = pendingRoom;
    pendingRoom = null;
    pendingDialogRequestID = '';
    h5MessageManager.off('dialogResult');

    if (payload.action !== 'confirm') {
        leavePendingRoom(room);
        return;
    }
    if (!room) return;
    void ProcedureManager.StartProcedure(ProcedureDefine.EnterRoom, {
        roomID: room.roomID,
        matchID: room.matchID,
        roomType: room.roomType,
        observer: false
    });
};

// UserPlaying 201
export function UserPlaying(data: ServerMessageUserPlaying.AsObject, roomID: number, matchID: number): void {
    if (data?.status !== 0 || pendingDialogRequestID) return;
    if (ProcedureManager.prevProcedure?.id === ProcedureDefine.EnterRoom) return;

    const room = data.roomsMttsList?.find(item => {
        return Number.isFinite(item?.roomId) && item.roomId > 0 && Number.isFinite(item?.roomType);
    });
    if (!room) return;

    pendingRoom = {
        roomID: room.roomId,
        matchID: Number.isFinite(room.matchId) ? room.matchId : 0,
        roomType: room.roomType
    };
    pendingDialogRequestID = h5MessageManager.sendToH5('showDialog', 1, {
        message: i18nMgr.Get('UIMultiTable_EnterTableTips'),
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: i18nMgr.Get('adaptation10013'),
        confirmButtonText: i18nMgr.Get('adaptation10012'),
        closeOnClickOverlay: true,
        ensureVisible: true
    });
    h5MessageManager.on('dialogResult', onDialogResult);
    _plog.info('current playing room found, prompt enter', pendingRoom, { roomID, matchID, code: Code.MSG_D_USER_PLAYING });
}
