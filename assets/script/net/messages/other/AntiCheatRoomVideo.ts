import { ServerMessageUtilAntiCheatRoomVideo } from '@silenthill/agreement-web';
import { createLogger } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { VideoModel } from '../../../game/constant/VideoModel';
import VideoRoomManager from '../../../net/agora/VideoRoomManager';
import viewManager from '../../../views/UIViewManager';

const _plog = createLogger('AntiCheatRoomVideo');

const DEFAULT_OVERTIME_SECONDS = 30;

// AntiCheatRoomVideo 902 — 随机视频验证
export function AntiCheatRoomVideo(data: ServerMessageUtilAntiCheatRoomVideo.AsObject, roomID: number, matchID: number) {
    if (!data) return;
    _plog.info('status:', data.status, 'roomType:', data.roomType);
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (!roomData) return;
    // 仅随机验证模式处理
    if (roomData.basicInfo.videoModel !== VideoModel.RANDOM) {
        _plog.warn('当前不是随机验证模式，忽略');
        return;
    }
    const mine = roomData.mine;
    // 如果已经在验证中，不重复触发
    if (mine.randomVideoActive) {
        _plog.info('已在验证中，忽略重复消息');
        return;
    }
    // 如果没入座，无需验证
    if (mine.seatNo === 0) {
        _plog.info('未入座，跳过');
        return;
    }
    const overtime = roomData.basicInfo.antiCheatTimeLimit > 0 ? roomData.basicInfo.antiCheatTimeLimit : DEFAULT_OVERTIME_SECONDS;
    // 标记开始验证
    mine.randomVideoActive = true;
    mine.randomVideoEndTime = Date.now() + overtime * 1000;
    _plog.info('开始随机视频验证，持续', overtime, '秒');
    // Toast 提示
    viewManager.showToast(`视频验证已开启，请保持摄像头开启 ${overtime} 秒`);
    // 强制开启摄像头并渲染到自己的头像
    const avatarNode = VideoRoomManager.Instance.getSeatAvatarNode(mine.seatNo);
    if (avatarNode) {
        VideoRoomManager.Instance.renderLocalVideoOnMySeat(avatarNode).then(ok => {
            if (!ok) {
                _plog.warn('随机验证渲染本地视频失败');
            }
        });
    }
    // 设置超时自动结束验证
    setTimeout(() => {
        if (mine.randomVideoActive) {
            mine.randomVideoActive = false;
            mine.randomVideoEndTime = 0;
            _plog.info('随机视频验证结束');
        }
    }, overtime * 1000);
}
