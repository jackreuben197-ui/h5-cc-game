import { ServerMessageAddOn } from '@silenthill/agreement-web';
import { createLogger } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';

const _plog = createLogger('ServerMessageAddOn');

// AddOn 1004
export function AddOn(data: ServerMessageAddOn.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (!roomData) {
        _plog.error('增购回包没有对应的牌桌数据', roomID, matchID, data);
        return;
    }
    // 增购结果只写 RoomData，由 UI 订阅结果事件。
    roomData.mtt.completeAddOn(data.status, data.chips);
}
