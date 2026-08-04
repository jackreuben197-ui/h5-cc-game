import { ServerMessageUtilAntiCheatRoomVideo } from '@silenthill/agreement-web';
import { createLogger } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import globalConfigStore from '../../../data/system/GlobalConfigStore';
import { VideoModel } from '../../../game/constant/VideoModel';

const _plog = createLogger('AntiCheatRoomVideo');

const DEFAULT_COUNTDOWN_SECONDS = 5;

const DEFAULT_OVERTIME_SECONDS = 30;

interface RandomVideoConfig {
    random_countdown?: number;
    time_limit?: number;
}

// AntiCheatRoomVideo 902 — 随机视频验证
export function AntiCheatRoomVideo(data: ServerMessageUtilAntiCheatRoomVideo.AsObject, roomID: number, matchID: number) {
    if (!data) return;
    _plog.info('status:', data.status, 'roomType:', data.roomType);
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (!roomData) return;
    const antiCheatConfig = roomData.basicInfo.antiCheatConfig;
    if (!antiCheatConfig || antiCheatConfig.mode != VideoModel.RANDOM) {
        _plog.warn('当前不是随机验证模式，忽略');
        return;
    }
    const mine = roomData.mine;
    if (mine.randomVideoStartTime > 0 || mine.randomVideoActive) {
        _plog.info('已在验证中，忽略重复消息');
        return;
    }
    // 如果没入座，无需验证
    if (mine.seatNo === 0) {
        _plog.info('未入座，跳过');
        return;
    }
    const timing = _getRandomVideoTiming(matchID);
    const startTime = Date.now() + timing.countdown * 1000;
    mine.randomVideoEndTime = startTime + timing.overtime * 1000;
    mine.randomVideoStartTime = startTime;
    _plog.debug('将在', timing.countdown, '秒后开始随机视频验证，持续', timing.overtime, '秒');
}

function _getRandomVideoTiming(matchID: number): { countdown: number; overtime: number } {
    const raw = (matchID > 0 ? globalConfigStore.get('anti_cheat_video_config_mtt') : undefined) || globalConfigStore.get('anti_cheat_video_config');
    let videoConfig: RandomVideoConfig | null = null;
    try {
        const value = typeof raw === 'string' ? JSON.parse(raw) : raw;
        if (value && typeof value === 'object') {
            videoConfig = value as RandomVideoConfig;
        }
    } catch {
        _plog.warn('anti_cheat_video_config 解析失败');
    }
    const countdown = Number(videoConfig && videoConfig.random_countdown) || DEFAULT_COUNTDOWN_SECONDS;
    const overtime = Number(videoConfig && videoConfig.time_limit) || DEFAULT_OVERTIME_SECONDS;
    return { countdown, overtime };
}
