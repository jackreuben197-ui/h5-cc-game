import { ServerMessageHandClear } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { VideoModel } from '../../../game/constant/VideoModel';
import VideoRoomManager from '../../../net/agora/VideoRoomManager';

// HandClear 1119
export function HandClear(data: ServerMessageHandClear.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    roomData.potInfo.handClear();
    roomData.seatsStateManager.handClear();
    roomData.publicCards.handClear();
    roomData.basicInfo.handClear();
    // 麦序模式：手牌结束后隐藏所有视频（无操作者）
    if (roomData.basicInfo.videoModel === VideoModel.SEQUENCE) {
        VideoRoomManager.Instance.sequenceSyncRemoteVideos(0);
    }
}
