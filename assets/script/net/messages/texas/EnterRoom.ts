import { createLogger } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import { Operator, OperatorMine } from '../../../data/room/texas/model/Operator';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import {
    AnimateDisplayTypeAction,
    AnimateDisplayTypeButton,
    AnimateDisplayTypeCards,
    AnimateDisplayTypePosition,
    AnimateDisplayTypePublicCards,
    AnimateDisplayTypeRoundBet
} from '../../../game/constant/AnimateDisplayType';
import { ServerMessageEnterRoom } from '../../../protobuf/holdem/req_th_enter_room_pb';
import viewManager from '../../../views/UIViewManager';

const _plog = createLogger('[TexasEnterRoom]');

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
    viewManager.hidePreloading();
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
            roomData.publicCards.addPublicCards(data.handInfo.publicCardsList, AnimateDisplayTypePublicCards.Static);
            roomData.publicCards.addSecondPublicCards(data.handInfo.secondPublicCardsList, AnimateDisplayTypePublicCards.Static);
        }
        data.playersList.forEach(player => {
            let seatData = roomData.seatsStateManager.getSeatPlayer(player.seatId);
            seatData.name = player.name;
            seatData.userID = player.userRid;
            seatData.avatar = player.avatar;
            seatData.chip = player.chip;
            seatData.setRoundBet(player.roundBet, AnimateDisplayTypeRoundBet.Static);
            seatData.handBet = player.handBet;
            seatData.roundActioned = player.roundActioned;
            seatData.setCards(player.cardsList, AnimateDisplayTypeCards.Static);
            seatData.setAction(player.action, AnimateDisplayTypeAction.Static);
            seatData.deposit = player.deposit;
        });
        if (data.myInfo) {
            if (data.myInfo.seatId > 0) {
                let mine = roomData.seatsStateManager.setMySeat(data.myInfo.seatId, AnimateDisplayTypePosition.Static);
            }
            roomData.mine.storeChips = data.myInfo.storeChips;
        }
        // setTimeout(() => {
        //     let mine = roomData.seatsStateManager.setMySeat(4, AnimateDisplayTypePosition.ToTarget);
        //         //mine.storeChips = data.myInfo.storeChips;
        // }, 3000);
        data.operatorList.forEach(operator => {
            let seatData = roomData.seatsStateManager.getSeatPlayer(operator.seatId);
            if (seatData.mine) {
                //@TODO 本人操作的准备
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
                let seatData = roomData.seatsStateManager.getSeatPlayer(operator.seatId);
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
        });
        _plog.error;
        await viewManager.switchScene('TexasRoom', {
            roomID: roomData.roomID,
            matchID: roomData.matchID
        });
    }
}
