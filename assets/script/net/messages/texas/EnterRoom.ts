import { createLogger } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import { Operator, OperatorMine, OpertionType } from '../../../data/room/texas/model/Operator';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import userStore from '../../../data/user/UserStore';
import {
    AnimateDisplayTypeAction,
    AnimateDisplayTypeButton,
    AnimateDisplayTypeCards,
    AnimateDisplayTypePosition,
    AnimateDisplayTypePublicCards,
    AnimateDisplayTypeRoundBet
} from '../../../game/constant/AnimateDisplayType';
import { Def } from '../../../protobuf/holdem/define_pb';
import { ServerMessageEnterRoom } from '../../../protobuf/holdem/req_th_enter_room_pb';
import viewManager from '../../../views/UIViewManager';

const _plog = createLogger('ServerMessageEnterRoom', 'debug');

// EnterRoom 1002
export async function EnterRoom(data: ServerMessageEnterRoom.AsObject, roomID: number, matchID: number): Promise<void> {
    let roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (!roomData && matchID > 0) {
        roomData = roomDataManager.getRoomData<TexasGameRoomData>(0, matchID);
        if (roomData) {
            roomData.roomID = roomID;
            roomDataManager.deleteRoomData(0, matchID);
            roomDataManager.setRoomData(roomID, matchID, roomData);
        }
    }
    if (!roomData) {
        _plog.error('no store room data');
        return;
    }
    const defaultHandCards = new Array(roomData.basicInfo.handCardNum).fill(0);
    if (data.status == 0) {
        roomData.basicInfo.sbante = { sb: data.roomInfo.smallBlind, ante: data.roomInfo.ante };
        roomData.basicInfo.gameStatus = data.gameStatus;
        roomData.basicInfo.deposit = data.roomInfo.deposit;
        roomData.basicInfo.opDuration = data.roomInfo.opDuration;
        roomData.basicInfo.sbante = { sb: data.roomInfo.smallBlind, ante: data.roomInfo.ante };
        if (data.handInfo) {
            roomData.basicInfo.handNum = data.handInfo.handNum;
            roomData.potInfo.allPot = data.handInfo.allBet;
            roomData.potInfo.potList = data.handInfo.potsList;
            roomData.potInfo.secPotList = data.handInfo.secondPotsList;
            roomData.seatsStateManager.setButtonPosition(data.handInfo.buSeatId, AnimateDisplayTypeButton.Static);
            roomData.publicCards.publicCards = data.handInfo.publicCardsList;
            roomData.publicCards.secondPublicCards = data.handInfo.secondPublicCardsList;
        }
        data.playersList.forEach(player => {
            let seatData = roomData.seatsStateManager.getSeatPlayer(player.seatId);
            //操作重置
            seatData.operator = null;
            //坐下
            seatData.seated = true;
            seatData.userID = player.userRid;
            seatData.setAction(player.action, AnimateDisplayTypeAction.Static);
            // 延迟看牌做个修正,目前服务端逻辑异常
            if (data.myInfo?.seatId > 0 && player.cardsList.length > 0 && !(data.gameStatus >= Def.GameStatus.HAND_PREFLOP && player.roundActioned)) {
                seatData.setCards([...defaultHandCards], AnimateDisplayTypeCards.Static);
            }else{
                seatData.setCards(player.cardsList, AnimateDisplayTypeCards.Static);
            }
            seatData.setCards(player.cardsList, AnimateDisplayTypeCards.Static);
            seatData.name = player.name;
            seatData.avatar = player.avatar;
            seatData.chip = player.chip;
            seatData.handBet = player.handBet;
            seatData.setRoundBet(player.roundBet, AnimateDisplayTypeRoundBet.Static);
            seatData.status = player.status;
            seatData.keepSeat(player.keepSeatDeadline > 0, player.keepSeatDeadline, player.keepSeatReason);
            seatData.deposit = player.deposit;
            seatData.buyInsuranceStep = player.buyInsuranceStep;
            seatData.buyInsuranceList = player.buyInsuranceList;
            seatData.roundActioned = player.roundActioned;
            seatData.isAuto = player.isAutoop;
            //MTT
            seatData.mttHunterKill = player.hunterKill;
            seatData.mttHunterKillAward = player.hunterKillAward;
            seatData.mttHunterKillAwardOther = player.hunterKillAwardOther;
            seatData.mttHunterHeadValue = player.hunterHeadValue;
            //vip
            seatData.vip = player.vip > 0;
            seatData.subscriptionID = player.userSubscriptionId;
            //mushroom
            seatData.inMushroom = player.inMushroom;
            seatData.costMushroom = player.costMushroom;
            //squid
            seatData.squidIn = player.inSquid;
            seatData.squidEscaped = player.squidEscaped;
            seatData.squidCount = player.squidCount;
            //视频
            seatData.videoMaskId = player.videoMaskId;
            //获胜卡牌
            if (player.winCardsInfo) {
                seatData.winPercent100 = Math.min(10000, Math.round((player.winCardsInfo.wcCount * 10000) / player.winCardsInfo.lcCount));
            }
        });
        if (data.myInfo) {
            roomData.seatsStateManager.setMySeat(data.myInfo.seatId, AnimateDisplayTypePosition.Static);
            roomData.mine.storeChips = data.myInfo.storeChips;
            roomData.mine.totalChips = data.myInfo.totalChips;
        }
        // setTimeout(() => {
        //     let seat = roomData.seatsStateManager.getSeatPlayer(4);
        //     if (seat.seated) {
        //         seat.seated = false;
        //     }else{
        //         seat = roomData.seatsStateManager.setMySeat(4, AnimateDisplayTypePosition.ToTarget);
        //         seat.setCards([0, 0], AnimateDisplayTypeCards.Static, 0);
        //         seat.setAction(Def.Action.ALLIN, AnimateDisplayTypeAction.Done);
        //         seat.userID = userStore.userID;
        //         seat.name = userStore.name;
        //         seat.avatar= userStore.avatar;
        //     }
        // }, 3000);
        // setTimeout(() => {
        //     let seat = roomData.seatsStateManager.getSeatPlayer(4);
        //     if (seat.seated) {
        //         seat.seated = false;
        //     }else{
        //         seat = roomData.seatsStateManager.setMySeat(4, AnimateDisplayTypePosition.ToTarget);
        //         seat.setCards([0, 0], AnimateDisplayTypeCards.Static, 0);
        //         seat.setAction(Def.Action.ALLIN, AnimateDisplayTypeAction.Done);
        //         seat.userID = userStore.userID;
        //         seat.name = userStore.name;
        //         seat.avatar= userStore.avatar;
        //     }
        // }, 6000);
        // setTimeout(() => {
        //     let seat = roomData.seatsStateManager.getSeatPlayer(6);
        //     if (seat.seated) {
        //         seat.seated = false;
        //     }else{
        //         seat.seated = true;
        //         seat.setCards([0, 0], AnimateDisplayTypeCards.Static, 0);
        //         seat.setAction(Def.Action.ALLIN, AnimateDisplayTypeAction.Done);
        //         seat.userID = userStore.userID;
        //         seat.name = userStore.name;
        //         seat.avatar= userStore.avatar;
        //     }
        // }, 9000);
        //  setTimeout(() => {
        //     let seat = roomData.seatsStateManager.getSeatPlayer(6);
        //     if (seat.seated) {
        //         seat.seated = false;
        //     }else{
        //         seat.seated = true;
        //         seat.setCards([0, 0], AnimateDisplayTypeCards.Static, 0);
        //         seat.setAction(Def.Action.ALLIN, AnimateDisplayTypeAction.Done);
        //         seat.userID = userStore.userID;
        //         seat.name = userStore.name;
        //         seat.avatar= userStore.avatar;
        //     }
        // }, 12000);
        data.operatorList.forEach(operator => {
            let seatData = roomData.seatsStateManager.getSeatPlayer(operator.seatId);
            if (seatData.mine) {
                //@TODO 本人操作的准备
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
                let seatData = roomData.seatsStateManager.getSeatPlayer(operator.seatId);
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
        });
        await viewManager.switchScene('TexasRoom', {
            roomID: roomData.roomID,
            matchID: roomData.matchID
        });
    }
}
