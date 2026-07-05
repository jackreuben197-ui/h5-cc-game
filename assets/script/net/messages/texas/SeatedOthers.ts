import { Def, ServerMessageSeatedOthers } from '@silenthill/agreement-web';
import { createLogger } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';

const _plog = createLogger('ServerMessageSeatedOthers');

// SeatedOthers 1102
export function SeatedOthers(data: ServerMessageSeatedOthers.AsObject, roomID: number, matchID: number) {
    _plog.info('seatedOthers', data, roomID, matchID);
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (!roomData) return;
    // videoMaskId > 4 时客户端统一归为 1
    let videoMaskId = data.videoMaskId;
    if (videoMaskId > 4) videoMaskId = 1;
    const seatId = data.seatId;
    const seatData = roomData.seatsStateManager.getSeatPlayer(seatId);
    if (!seatData) {
        _plog.warn('未找到座位, seatId:', seatId);
        return;
    }
    const userRid = data.userRid;
    // 清理旧数据
    seatData.clearData();
    // 填充新玩家数据
    seatData.userID = userRid;
    seatData.name = data.name;
    seatData.avatar = data.avatar;
    seatData.chip = data.chips;
    seatData.deposit = data.deposit;
    seatData.vip = data.vip > 0;
    seatData.subscriptionID = data.userSubscriptionId;
    seatData.squidIn = data.squidIn;
    seatData.videoMaskId = videoMaskId;
    // MTT
    seatData.mttHunterHeadValue = data.hunterHeadValue;
    seatData.mttHunterKill = data.hunterKill;
    seatData.mttHunterKillAward = data.hunterKillAward;
    seatData.mttHunterKillAwardOther = data.hunterKillAwardOther;
    // 留坐
    const keepSeatDeadline = data.keepSeatDeadline;
    if (keepSeatDeadline > 0) {
        seatData.keepSeat(true, keepSeatDeadline, Def.KeepSeatReason.KSR_TAKE_SEAT);
    }
    // 标记入座
    seatData.setSeated(true, null);
}
