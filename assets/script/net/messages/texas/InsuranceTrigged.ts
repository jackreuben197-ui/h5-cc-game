import { Def, InsurancePotInvalid, ServerMessageInsuranceTrigged } from '@silenthill/agreement-web';
import { createLogger } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import { Operator, OperatorMine } from '../../../data/room/texas/model/Operator';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { i18nMgr } from '../../../i18n/i18nMgr';
import viewManager from '../../../views/UIViewManager';

const _glog = createLogger('ServerMessageInsuranceTrigged');

function showInvalidInsuranceTip(invalidPot: InsurancePotInvalid.AsObject): void {
    const prefix = `${i18nMgr.Get('adaptation20005')}${invalidPot.potId + 1}:`;
    switch (invalidPot.reason) {
        case Def.IIReason.IIR_ZERO_OUTS:
        case Def.IIReason.IIR_NO_ODDS_FOUND:
            viewManager.showToast(`${prefix}${i18nMgr.Get('adaptation20017')}`);
            break;
        case Def.IIReason.IIR_NO_ODDS_TABLE_FOUND:
        case Def.IIReason.IIR_LEADER_LIMIT:
            viewManager.showToast(`${prefix}${i18nMgr.Get('UIInsuranceReasonTips2')}`);
            break;
        case Def.IIReason.IIR_EV_LIMIT:
            viewManager.showToast(i18nMgr.Get('UIEVInsuranceTips5'));
            break;
        default:
            viewManager.showToast(i18nMgr.Get('Purchase_insurance'));
            break;
    }
}

function shouldShowEmptyOperatorTip(roomData: TexasGameRoomData): boolean {
    const minePlayer = roomData.mine?.player;
    if (!minePlayer) return false;
    return minePlayer.action !== Def.Action.FOLD;
}

// InsuranceTrigged 1115
export function InsuranceTrigged(data: ServerMessageInsuranceTrigged.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (!roomData) return;
    _glog.debug('insurance trigged round=', data.round, 'operators=', data.operatorList.length);
    if (!data.operatorList || data.operatorList.length === 0) {
        if (!shouldShowEmptyOperatorTip(roomData)) return;
        if (data.invalidPotsList && data.invalidPotsList.length > 0) {
            data.invalidPotsList.forEach(showInvalidInsuranceTip);
        } else {
            viewManager.showToast(i18nMgr.Get('Purchase_insurance'));
        }
        return;
    }
    data.operatorList.forEach(operator => {
        const seatData = roomData.seatsStateManager.getSeatPlayer(operator.seatId);
        if (!seatData) return;
        if (seatData.mine) {
            const op = new OperatorMine();
            op.opType = 2;
            op.leftOpDuration = operator.leftOpTime;
            op.deadlineTImestamp = operator.opDeadline;
            op.alreadyDelayTImes = operator.delayTimes;
            op.totalOpDuration = roomData.basicInfo.insuranceOpduration;
            op.insurancePotLimitList = operator.insuranceLimitList;
            // 服务端在 operator 内 / 顶层 invalidPotsList 都可能下发无法投保的池
            op.insurancePotInvalidList =
                operator.invalidInsurancePotsList && operator.invalidInsurancePotsList.length > 0 ? operator.invalidInsurancePotsList : data.invalidPotsList;
            op.playerCardsList = operator.playerCardsList;
            op.round = data.round;
            seatData.operator = op;
            seatData.mine.operator = op;
        } else {
            const op = new Operator();
            op.opType = 2;
            op.leftOpDuration = operator.leftOpTime;
            op.deadlineTImestamp = operator.opDeadline;
            op.alreadyDelayTImes = operator.delayTimes;
            op.totalOpDuration = roomData.basicInfo.insuranceOpduration;
            seatData.operator = op;
        }
    });
}
