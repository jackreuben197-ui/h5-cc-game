import { ServerMessageStandup } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import VideoRoomManager from '../../../net/agora/VideoRoomManager';

// Standup 1110
export function Standup(data: ServerMessageStandup.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    const seatData = roomData.seatsStateManager.getSeatPlayer(data.seatId);
    seatData.setSeated(false, seatData.mine);
    // 视频清理：停止该座位的视频渲染
    const videoMgr = VideoRoomManager.Instance;
    if (videoMgr.isVideoRoom) {
        const avatarNode = videoMgr.getSeatAvatarNode(seatData.seatNo);
        if (avatarNode) {
            videoMgr.stopLocalVideo(avatarNode);
        }
    }
    if (seatData.mine) {
        seatData.mine.clearData();
    }
    seatData.clearData();
}
