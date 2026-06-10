import { createLogger } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { StringHelper } from '../../../helper/StringHelper';
import { i18nMgr } from '../../../i18n/i18nMgr';
import viewManager from '../../../views/UIViewManager';
import { ServerMessageBuyInsurance } from '@silenthill/agreement-web';

const _glog = createLogger('ServerMessageBuyInsurance');

function formatBackInsuranceTip(amount: string): string {
    const template = i18nMgr.Get('adaptation20053');
    return template.replace('##', amount);
}

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
    if (seatData.mine) {
        data.buyList?.forEach(buy => {
            if (buy.passiveAmount > 0) {
                viewManager.showToast(formatBackInsuranceTip(StringHelper.GetLongString(buy.passiveAmount)));
            }
        });
    }
    // 如果是自己，操作流程已结束，清空 operator 让面板关闭
    if (seatData.mine && seatData.mine.operator?.opType === 2) {
        seatData.mine.operator = null;
    }
    if (seatData.operator?.opType === 2) {
        seatData.operator = null;
    }
}
