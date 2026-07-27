import { ServerMessageMttBreak } from '@silenthill/agreement-web';
import { createLogger } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';

// 休息是低频关键状态，独立放行 info，避免全局 WARN 时无法核对 154 的处理链路。
const _plog = createLogger('ServerMessageMttBreak', 'info');

// MttBreak 154
export function MttBreak(data: ServerMessageMttBreak.AsObject, roomID: number, matchID: number): void {
    // 154 是全局推送，必须用消息内的 matchId 精确定位当前 MTT。
    if (data.matchId <= 0) {
        _plog.error('MTT 休息消息缺少 matchId', roomID, matchID, data);
        return;
    }
    if (matchID > 0 && matchID != data.matchId) {
        _plog.error('MTT 休息消息的包头与消息体 matchId 不一致', matchID, data.matchId);
    }
    const roomData = roomDataManager.findRoomDataByMatchID<TexasGameRoomData>(data.matchId);
    if (!roomData) {
        _plog.error('未找到 MTT 休息消息对应的牌桌数据', data.matchId, roomID);
        return;
    }
    roomData.mtt.applyBreak(data);
}
