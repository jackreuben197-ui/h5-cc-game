import { ServerMessagePublicReplay } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { ReplayHandData } from '../../../data/room/texas/TexasGameRoomDataReplay';
import PublicHelper from '../../../helper/PublicHelper';

// PublicReplay 1018
export function PublicReplay(data: ServerMessagePublicReplay.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    // 非本端挂起请求的回包(如预取残留)直接忽略
    if (roomData.replay.pendingHandNum < 0) {
        return;
    }
    if (!data.data || data.data.length === 0) {
        roomData.replay.applyEmpty();
        return;
    }
    let replayData: ReplayHandData = null;
    try {
        // protobuf bytes 字段 toObject 后是 base64 字符串
        const base64 = typeof data.data === 'string' ? data.data : PublicHelper.Uint8ArrayToString(data.data);
        replayData = JSON.parse(PublicHelper.Base64ToJsonString(base64));
    } catch (e) {
        roomData.replay.applyEmpty();
        return;
    }
    // 新鲜回包写入持久缓存(缓存命中路径不会走到这里)
    roomData.replay.persist(replayData.s?.hand ?? roomData.replay.pendingHandNum, replayData);
    roomData.replay.applyReplay(replayData);
}
