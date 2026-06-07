import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { AnimateDisplayTypeCards } from '../../../game/constant/AnimateDisplayType';
import { Def } from '../../../protobuf/holdem/define_pb';
import { ServerMessageWinner } from '../../../protobuf/holdem/recv_th_winner_pb';

// Winner 1112
export function Winner(data: ServerMessageWinner.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    roomData.basicInfo.gameStatus = Def.GameStatus.HAND_END;
    data.resultsList.forEach(result => {
        const seatData = roomData.seatsStateManager.getSeatPlayer(result.seatId);
        // 已经站起
        if (seatData.userID == 0 || result.standUp) return;
        // 更新筹码
        seatData.chip = result.chip;
        seatData.deposit = result.deposit;
        seatData.setCards(result.myCardsList, AnimateDisplayTypeCards.ShowCards);
        if (result.win - result.handBet > 0) {
            seatData.claimWin();
        }
        if (seatData.mine) {
            let mine = seatData.mine;
            mine.totalChips = result.totalChips;
            mine.storeChips = result.storeChips;
            let pubH: number[] = [];
            let pub2H: number[] = [];
            let myCardsH: number[] = [];
            result.winCardsList.forEach(v => {
                if (v.isPublic) {
                    pubH.push(v.card);
                } else {
                    myCardsH.push(v.card);
                }
            });
            result.winCards2List.forEach(v => {
                if (v.isPublic) {
                    pub2H.push(v.card);
                }
            });
            mine.highlightCards(myCardsH);
            roomData.publicCards.higlightPublicards(pubH);
        }
    });
}
