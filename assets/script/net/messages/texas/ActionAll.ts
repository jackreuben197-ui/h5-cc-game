import { ServerMessageActionAll } from '@silenthill/agreement-web';
import { createLogger } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import { Operator, OperatorMine, OpertionType } from '../../../data/room/texas/model/Operator';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { AnimateDisplayTypeAction, AnimateDisplayTypeCards, AnimateDisplayTypeRoundBet } from '../../../game/constant/AnimateDisplayType';
import { AutoOperationTypeTexas } from '../../../game/constant/AutoOpertaionType';

const _plog = createLogger('ServerMessageActionAll', 'debug');

// ActionAll 1108
export function ActionAll(data: ServerMessageActionAll.AsObject, roomID: number, matchID: number) {
    _plog.debug('ActionAll data: ', data);
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    const seatPlayer = roomData.seatsStateManager.getSeatPlayer(data.operatorSeatId);
    seatPlayer.setAction(data.action, AnimateDisplayTypeAction.Done);
    seatPlayer.roundActioned = true;
    seatPlayer.chip = data.leftChips;
    seatPlayer.setRoundBet(seatPlayer.roundBet + data.amount, AnimateDisplayTypeRoundBet.PutNear);
    seatPlayer.operator = null;
    if (roomData.mine.seatNo > 0) {
        // 计算自动操作面板的变动
        const minePlayer = roomData.mine.player;
        if (minePlayer.canOpearate) {
            roomData.mine.caculateValidAutoOperationType(data.roundBet);
        } else {
            //不显示
            roomData.mine.setRightAutoOpPannel(AutoOperationTypeTexas.NO, 0);
        }
    }
    if (seatPlayer.mine) {
        seatPlayer.mine.operator = null;
        //麦序关闭
        if (roomData.basicInfo.antiCheatConfig && roomData.basicInfo.antiCheatConfig.isOrderMode) {
            seatPlayer.mine.localCameraEnabled = false;
            seatPlayer.mine.localMicrophoneEnabled = false;
        }
    }
    //所有下注
    roomData.potInfo.allPot = data.allBet;
    //当前轮的最大投注
    roomData.roundState.roundBet = data.roundBet;
    if (data.nextOperator) {
        const operator = data.nextOperator;
        let seatData = roomData.seatsStateManager.getSeatPlayer(operator.seatId);
        if (seatData.mine) {
            let op = new OperatorMine();
            op.allPot = data.allBet;
            op.roundBetEqual = data.roundBet;
            op.alreadyDelayTImes = operator.delayTimes;
            op.deadlineTImestamp = operator.opDeadline;
            op.leftOpDuration = operator.leftOpTime;
            op.totalOpDuration = roomData.basicInfo.opDuration;
            op.actionLimitList = operator.actionsList;
            op.insurancePotInvalidList = operator.invalidInsurancePotsList;
            op.insurancePotLimitList = operator.insuranceLimitList;
            op.playerCardsList = operator.playerCardsList;
            if (operator.isInsurance) {
                op.opType = OpertionType.INSURANCE;
            } else if (operator.isAgreeSecondPc) {
                op.opType = OpertionType.AGREESECPUB;
            } else {
                op.opType = OpertionType.NORMAL;
            }
            if (operator.cardsList.length > 0) {
                seatData.setCards(operator.cardsList, AnimateDisplayTypeCards.ShowCards);
                roomData.mine.caculateHandValueTypeAndHighlight();
            }
            seatData.mine.operator = op;
        } else {
            let op = new Operator();
            op.allPot = data.allBet;
            op.roundBetEqual = data.roundBet;
            op.alreadyDelayTImes = operator.delayTimes;
            op.deadlineTImestamp = operator.opDeadline;
            op.leftOpDuration = operator.leftOpTime;
            op.totalOpDuration = roomData.basicInfo.opDuration;
            if (operator.isInsurance) {
                op.opType = OpertionType.INSURANCE;
            } else if (operator.isAgreeSecondPc) {
                op.opType = OpertionType.AGREESECPUB;
            } else {
                op.opType = OpertionType.NORMAL;
            }
            seatData.operator = op;
        }
    }
}
