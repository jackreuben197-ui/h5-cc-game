import { ServerMessageSyncHand } from '@silenthill/agreement-web';
import { createLogger } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';

const _plog = createLogger('ServerMessageSyncHand');

// SyncHand 1124
export function SyncHand(data: ServerMessageSyncHand.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (!roomData) {
        _plog.error('泡沫期同步消息没有对应的牌桌数据', roomID, matchID, data);
        return;
    }
    // MTT 同步手牌时展示泡沫期等待提示。
    roomData.mtt.setBubbleWaiting(true);
}
