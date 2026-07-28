import { ServerMessageNotificationMttWillStart } from '@silenthill/agreement-web';
import { createLogger } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';

const _plog = createLogger('NotificationMttWillStart');

// NotificationMttWillStart 107
export function NotificationMttWillStart(data: ServerMessageNotificationMttWillStart.AsObject, roomID: number, matchID: number): void {
    if (data.matchId <= 0 || data.startTime <= 0) {
        _plog.error('MTT 开赛倒计时消息字段无效', roomID, matchID, data);
        return;
    }
    // 107 是全局推送，按消息体 matchId 更新当前已经进入的 MTT 牌桌。
    const roomData = roomDataManager.findRoomDataByMatchID<TexasGameRoomData>(data.matchId);
    if (roomData) {
        roomData.mtt.applyWillStart(data.startTime);
    }
}
