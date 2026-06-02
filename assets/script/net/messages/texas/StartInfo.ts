import roomDataManager from '../../../data/room/RoomDataManager';
import { Operator, OperatorMine } from '../../../data/room/texas/model/Operator';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import {
    AnimateDisplayTypeAction,
    AnimateDisplayTypeButton,
    AnimateDisplayTypeCards,
    AnimateDisplayTypePublicCards,
    AnimateDisplayTypeRoundBet
} from '../../../game/constant/AnimateDisplayType';
import { PlayerStartInfo } from '../../../protobuf/holdem/define_pb';
import { ServerMessageStartInfo } from '../../../protobuf/holdem/recv_th_start_info_pb';

// StartInfo 1103
export function StartInfo(data: ServerMessageStartInfo.AsObject, roomID: number, matchID: number) {
    let roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    const defaultHandCards = new Array(roomData.basicInfo.handCardNum).fill(0);
    if (data.handInfo) {
        roomData.basicInfo.handNum = data.handInfo.handNum;
        roomData.potInfo.allPot = data.handInfo.allBet;
        roomData.potInfo.potList = data.handInfo.potsList;
        roomData.potInfo.secPotList = data.handInfo.secondPotsList;
        roomData.seatsStateManager.setButtonPosition(data.handInfo.buSeatId, AnimateDisplayTypeButton.Next);
        roomData.publicCards.addPublicCards(data.handInfo.publicCardsList, AnimateDisplayTypePublicCards.Static);
        roomData.publicCards.addSecondPublicCards(data.handInfo.secondPublicCardsList, AnimateDisplayTypePublicCards.Static);
    }
    const pm: Map<number, PlayerStartInfo.AsObject> = new Map();
    data.playersList.forEach(player => {
        pm.set(player.seatId, player);
    });
    for (let i = 0; i < data.handInfo.dealOrderList.length; i++) {
        const seatData = roomData.seatsStateManager.getSeatPlayer(data.handInfo.dealOrderList[i]);
        const player = pm.get(data.handInfo.dealOrderList[i]);
        seatData.chip = player.chip;
        seatData.setRoundBet(player.roundBet, AnimateDisplayTypeRoundBet.Static);
        seatData.handBet = 0;
        seatData.roundActioned = false;
        if (player.cardsList.length == 0) {
            seatData.setCards([...defaultHandCards], AnimateDisplayTypeCards.Deal, i);
        } else {
            seatData.setCards(player.cardsList, AnimateDisplayTypeCards.Deal, i);
        }
        seatData.setAction(player.action, AnimateDisplayTypeAction.Static);
        seatData.deposit = player.deposit;
        if (seatData.mine) {
            seatData.mine.storeChips = player.storeChips;
        }
    }
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
