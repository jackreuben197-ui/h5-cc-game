import { createLogger } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import { Operator, OperatorMine } from '../../../data/room/texas/model/Operator';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { AnimateDisplayTypeAction, AnimateDisplayTypeCards, AnimateDisplayTypeRoundBet } from '../../../game/constant/AnimateDisplayType';
import { ServerMessageActionAll } from '../../../protobuf/holdem/recv_th_action_all_pb';

const _plog = createLogger('[ServerMessageActionAll]');

// ActionAll 1108
export function ActionAll(data: ServerMessageActionAll.AsObject, roomID: number, matchID: number) {
    _plog.debug('ActionAll data: ', data);
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    const seatPlayer = roomData.seatsStateManager.getSeatPlayer(data.operatorSeatId);
    seatPlayer.setAction(data.action, AnimateDisplayTypeAction.Done);
    seatPlayer.chip = data.leftChips;
    seatPlayer.setRoundBet(seatPlayer.roundBet + data.amount, AnimateDisplayTypeRoundBet.PutNear);
    seatPlayer.operator = null;
    //所有下注
    roomData.potInfo.allPot = data.allBet;
    //当前轮的最大投注
    roomData.roundState.roundBet = data.roundBet;
    if (data.nextOperator) {
        const operator = data.nextOperator;
        let seatData = roomData.seatsStateManager.getSeatPlayer(operator.seatId);
        if (seatData.mine) {
            let op = new OperatorMine();
            op.alreadyDelayTImes = operator.delayTimes;
            op.deadlineTImestamp = operator.opDeadline;
            op.leftOpDuration = operator.leftOpTime;
            op.totalOpDuration = roomData.basicInfo.opDuration;
            op.actionLimitList = operator.actionsList;
            op.insurancePotInvalidList = operator.invalidInsurancePotsList;
            op.insurancePotLimitList = operator.insuranceLimitList;
            op.playerCardsList = operator.playerCardsList;
            if (operator.isInsurance) {
                op.opType = 2;
            } else if (operator.isAgreeSecondPc) {
                op.opType = 3;
            } else {
                op.opType = 1;
            }
            if (operator.cardsList.length > 0) {
                seatData.setCards(operator.cardsList, AnimateDisplayTypeCards.ShowCards);
            }
            seatData.mine.operator = op;
        } else {
            let op = new Operator();
            op.alreadyDelayTImes = operator.delayTimes;
            op.deadlineTImestamp = operator.opDeadline;
            op.leftOpDuration = operator.leftOpTime;
            op.totalOpDuration = roomData.basicInfo.opDuration;
            if (operator.isInsurance) {
                op.opType = 2;
            } else if (operator.isAgreeSecondPc) {
                op.opType = 3;
            } else {
                op.opType = 1;
            }
            seatData.operator = op;
        }
    }
}
