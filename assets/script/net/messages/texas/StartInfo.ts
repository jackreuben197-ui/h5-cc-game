import { createLogger } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import { Operator, OperatorMine, OpertionType } from '../../../data/room/texas/model/Operator';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import {
    AnimateDisplayTypeAction,
    AnimateDisplayTypeButton,
    AnimateDisplayTypeCards,
    AnimateDisplayTypePublicCards,
    AnimateDisplayTypeRoundBet
} from '../../../game/constant/AnimateDisplayType';
import { Def, PlayerStartInfo } from '../../../protobuf/holdem/define_pb';
import { ServerMessageStartInfo } from '../../../protobuf/holdem/recv_th_start_info_pb';
import { AutoOperationTypeTexas } from './AutoOpertaionType';

const _plog = createLogger('ServerMessageStartInfo', 'debug');

// StartInfo 1103
export function StartInfo(data: ServerMessageStartInfo.AsObject, roomID: number, matchID: number) {
    let roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    roomData.basicInfo.gameStatus = Def.GameStatus.HAND_PREFLOP;
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
    const myOp = data.nextOperator?.seatId == roomData.mine.seatNo;
    for (let i = 0; i < data.handInfo.dealOrderList.length; i++) {
        const seatData = roomData.seatsStateManager.getSeatPlayer(data.handInfo.dealOrderList[i]);
        const player = pm.get(data.handInfo.dealOrderList[i]);
        //@PROBLEM(S) 这是自己修改状态服务端没给
        seatData.status = Def.CanPlayStatus.NORMAL;
        //@PROBLEM(E)
        seatData.chip = player.chip;
        seatData.setRoundBet(player.roundBet, AnimateDisplayTypeRoundBet.Static);
        seatData.handBet = 0;
        seatData.roundActioned = false;
        // 自己
        if (player.seatId == roomData.mine.seatNo) {
            //如果是延迟看牌也先不传信息,给服务端修正 (延迟看牌,但是不是我操作)
            if (!myOp && roomData.basicInfo.delaySeeCard) {
                seatData.setCards([...defaultHandCards], AnimateDisplayTypeCards.Deal, i);
            } else {
                seatData.setCards(player.cardsList, AnimateDisplayTypeCards.Deal, i);
            }
        } else {
            if (player.cardsList.length > 0) {
                seatData.setCards(player.cardsList, AnimateDisplayTypeCards.Deal, i);
            } else {
                seatData.setCards([...defaultHandCards], AnimateDisplayTypeCards.Deal, i);
            }
        }
        seatData.setAction(player.action, AnimateDisplayTypeAction.Static);
        seatData.deposit = player.deposit;
        if (seatData.mine) {
            // _plog.debug('can operation', seatData.canOpearate, roomData.basicInfo.gameStatus >= Def.GameStatus.HAND_STARTED , roomData.basicInfo.gameStatus < Def.GameStatus.HAND_END);
            if (seatData.canOpearate) {
                // 操作面板(不显示)
                seatData.mine.autoOperationType = AutoOperationTypeTexas.NO;
                if (!myOp) {
                    seatData.mine.caculateValidAutoOperationType(data.handInfo.roundBet);
                }
            }
            seatData.mine.storeChips = player.storeChips;
        }
    }
    if (data.nextOperator) {
        const operator = data.nextOperator;
        let seatData = roomData.seatsStateManager.getSeatPlayer(operator.seatId);
        if (seatData.mine) {
            let op = new OperatorMine();
            op.allPot = data.handInfo.allBet;
            op.roundBetEqual = data.handInfo.roundBet;
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
            seatData.mine.operator = op;
        } else {
            let op = new Operator();
            op.allPot = data.handInfo.allBet;
            op.roundBetEqual = data.handInfo.roundBet;
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
