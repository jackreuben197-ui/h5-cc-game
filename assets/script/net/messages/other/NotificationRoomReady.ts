import { ServerMessageNotificationRoomReady } from '@silenthill/agreement-web';
import { createLogger } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';

const _plog = createLogger('ServerMessageNotificationRoomReady');

// NotificationRoomReady 101
export function NotificationRoomReady(data: ServerMessageNotificationRoomReady.AsObject, roomID: number, matchID: number) {
    // 换桌通知以消息体的 room 为唯一依据，避免包头旧 roomID 覆盖真实目标。
    const newRoomID = data.room?.roomId;
    const targetMatchID = data.room?.matchId;
    if (!data.room || newRoomID <= 0 || targetMatchID <= 0) {
        _plog.error('换桌通知缺少目标房间', roomID, matchID, data);
        return;
    }
    const roomData = roomDataManager.findRoomDataByMatchID<TexasGameRoomData>(targetMatchID);
    if (!roomData) {
        _plog.error('换桌通知没有对应的 MTT RoomData', targetMatchID, newRoomID);
        return;
    }
    if (!roomData.mtt.tableTransferWaiting) {
        _plog.error('收到换桌目标房间时牌桌未处于换桌状态', targetMatchID, newRoomID);
        return;
    }
    roomData.mtt.roomReady(newRoomID);
}
