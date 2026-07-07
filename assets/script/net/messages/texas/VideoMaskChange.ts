import { ServerMessageVideoMaskChange } from '@silenthill/agreement-web';
import { createLogger } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';

const _plog = createLogger('VideoMaskChange');

// VideoMaskChange 1133 — 窗花变更广播
export function VideoMaskChange(data: ServerMessageVideoMaskChange.AsObject, roomID: number, matchID: number) {
    if (!data) return;
    _plog.info('userRid:', data.userRid, 'videoMaskId:', data.videoMaskId);
    // videoMaskId > 4 时客户端统一归为 1
    let maskId = data.videoMaskId;
    if (maskId > 4) maskId = 1;
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (!roomData) return;
    // 找到对应座位
    const seatData = roomData.seatsStateManager.getSeatPlayerByUserID(data.userRid);
    if (!seatData) {
        _plog.warn('未找到 uid:', data.userRid, '对应座位');
        return;
    }
    // 更新玩家数据
    seatData.videoMaskId = maskId;
    if (seatData.realShowMaskID > 0) {
        seatData.realShowMaskID = maskId;
    }
}
