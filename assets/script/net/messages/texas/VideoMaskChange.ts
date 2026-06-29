import { ServerMessageVideoMaskChange } from '@silenthill/agreement-web';
import { createLogger } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import userStore from '../../../data/user/UserStore';
import AgoraVideoRender from '../../../net/agora/AgoraVideoRender';
import VideoRoomManager from '../../../net/agora/VideoRoomManager';

const _plog = createLogger('VideoMaskChange');

// VideoMaskChange 1133 — 窗花变更广播
export function VideoMaskChange(data: ServerMessageVideoMaskChange.AsObject, roomID: number, matchID: number) {
    if (!data) return;
    _plog.info('userRid:', data.userRid, 'videoMaskId:', data.videoMaskId);
    // 自己的变更已在请求时本地处理，跳过
    if (data.userRid === userStore.userRID) return;
    // videoMaskId > 4 时客户端统一归为 1
    let maskId = data.videoMaskId || 0;
    if (maskId > 4) maskId = 1;
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (!roomData) return;
    // 找到对应座位
    const seatData = roomData.seatsStateManager.findSeatByUserId(data.userRid);
    if (!seatData) {
        _plog.warn('未找到 uid:', data.userRid, '对应座位');
        return;
    }
    // 更新玩家数据
    seatData.videoMaskId = maskId;
    // 如果该座位的视频正在渲染，刷新窗花显示
    const avatarNode = VideoRoomManager.Instance.getSeatAvatarNode(seatData.seatNo);
    if (avatarNode?.isValid) {
        const vr = avatarNode.getComponent(AgoraVideoRender);
        if (vr?.isRendering) {
            vr.setVideoMaskId(maskId);
        }
    }
}
