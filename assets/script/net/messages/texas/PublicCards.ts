import roomDataManager from '../../../data/room/RoomDataManager';
import { Operator, OperatorMine } from '../../../data/room/texas/model/Operator';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { AnimateDisplayTypePublicCards } from '../../../game/constant/AnimateDisplayType';
import { ServerMessagePublicCards } from '../../../protobuf/holdem/recv_th_public_cards_pb';

// PublicCards 1104
export function PublicCards(data: ServerMessagePublicCards.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    roomData.publicCards.addPublicCards(data.publicCardsArrayList, AnimateDisplayTypePublicCards.Deal);
    if (data.publicCardsArray2List.length > 0) {
        roomData.publicCards.addSecondPublicCards(data.publicCardsArray2List, AnimateDisplayTypePublicCards.Deal);
    } else if (data.extPublicCardsArrayList.length > 0) {
        roomData.publicCards.addSecondPublicCards(data.extPublicCardsArrayList, AnimateDisplayTypePublicCards.Deal);
    }
    roomData.seatsStateManager.roundClear();
    data.allinUsersList.forEach(v => {
        const seat = roomData.seatsStateManager.getSeatPlayer(v.seatId);
        if (v.leftCardsCount > 0) {
            seat.winPercent100 = Math.min(100, Math.round((v.winCardsCount * 100) / v.leftCardsCount));
        }
    });
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
