import { createLogger } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { ServerMessageBuyInsurance } from '@silenthill/agreement-web';

const _glog = createLogger('ServerMessageBuyInsurance');

// BuyInsurance 1116 —— 服务端广播某座位实际买入保险后的成交明细
export function BuyInsurance(data: ServerMessageBuyInsurance.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (!roomData) return;
    const seatData = roomData.seatsStateManager.getSeatPlayer(data.seatId);
    if (!seatData) {
        _glog.warn('seat not found', data.seatId);
        return;
    }
    seatData.buyInsuranceList = data.buyList || [];
    seatData.buyInsuranceStep = data.round;
    // 如果是自己，操作流程已结束，清空 operator 让面板关闭
    if (seatData.mine && seatData.mine.operator?.opType === 2) {
        seatData.mine.operator = null;
    }
}
