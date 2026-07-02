import { ServerMessageStandup } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import VideoRoomManager from '../../../net/agora/VideoRoomManager';

// Standup 1110
export function Standup(data: ServerMessageStandup.AsObject, roomID: number, matchID: number) {
    let roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    let seatData = roomData.seatsStateManager.getSeatPlayer(data.seatId);
    // 战绩面板：站起累加带出（对应 Unity TexasSituationController.StandUp）。
    // 在 clearData 之前抓 userID/name/avatar，否则站起后会被清零。
    if (seatData.userID > 0) {
        roomData.report.applyStandUp(seatData.userID, data.bringOut || 0, seatData.name, seatData.avatar);
    }
    //@TODO
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
