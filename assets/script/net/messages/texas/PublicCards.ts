import { Def, ServerMessagePublicCards } from '@silenthill/agreement-web';
import { createLogger } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import { Operator, OperatorMine, OpertionType } from '../../../data/room/texas/model/Operator';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { AnimateDisplayTypeCards, AnimateDisplayTypePublicCards } from '../../../game/constant/AnimateDisplayType';

const _plog = createLogger('ServerMessagePublicCards');

// PublicCards 1104
export function PublicCards(data: ServerMessagePublicCards.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    roomData.secondPcs.finish();
    roomData.publicCards.addPublicCards(data.publicCardsArrayList, AnimateDisplayTypePublicCards.Deal);
    if (data.publicCardsArray2List.length > 0) {
        // 必然5张
        roomData.publicCards.addSecondPublicCards(data.publicCardsArray2List, AnimateDisplayTypePublicCards.Deal);
    } else if (data.extPublicCardsArrayList.length > 0) {
        // 不是必然5张 要用公共牌补充的
        const needPub = 5 - data.extPublicCardsArrayList.length;
        const secPcs: number[] = [...roomData.publicCards.publicCards.slice(0, needPub), ...data.extPublicCardsArrayList];
        roomData.publicCards.addSecondPublicCards(secPcs, AnimateDisplayTypePublicCards.Deal);
    }
    switch (data.rnd) {
        case Def.Round.FLOP:
            roomData.basicInfo.gameStatus = Def.GameStatus.HAND_FLOP;
            break;
        case Def.Round.TURN:
            roomData.basicInfo.gameStatus = Def.GameStatus.HAND_TURN;
            break;
        case Def.Round.RIVER:
            roomData.basicInfo.gameStatus = Def.GameStatus.HAND_RIVER;
            break;
        default:
            _plog.warn('unkonwn round', data.rnd);
            break;
    }
    //回合变更数据清理
    roomData.seatsStateManager.roundReset();
    data.allinUsersList.forEach(v => {
        const seat = roomData.seatsStateManager.getSeatPlayer(v.seatId);
        if (v.leftCardsCount > 0) {
            seat.winPercent100 = Math.min(10000, Math.round((v.winCardsCount * 10000) / v.leftCardsCount));
        }
    });
    roomData.mine.caculateHandValueTypeAndHighlight();
    if (data.nextOperator) {
        const operator = data.nextOperator;
        let seatData = roomData.seatsStateManager.getSeatPlayer(operator.seatId);
        if (seatData.mine) {
            let op = new OperatorMine();
            op.allPot = roomData.potInfo.allPot;
            op.roundBetEqual = 0;
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
            op.allPot = roomData.potInfo.allPot;
            op.roundBetEqual = 0;
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
