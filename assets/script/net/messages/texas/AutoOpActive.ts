import { ServerMessageAutoOpActive } from '@silenthill/agreement-web';
import { createLogger } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';

const _plog = createLogger('ServerMessageAutoOpActive');

// AutoOpActive 1007
export function AutoOpActive(data: ServerMessageAutoOpActive.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (!roomData) {
        _plog.error('托管操作回包没有对应的牌桌数据', roomID, matchID, data);
        return;
    }
    // 操作结果经 RoomData 事件交给 UI 提示。
    roomData.mtt.autoOpResult(data.status);
}
