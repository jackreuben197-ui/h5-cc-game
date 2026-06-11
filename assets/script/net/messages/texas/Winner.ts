import { Def, ServerMessageWinner } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { AnimateDisplayTypeCards, AnimateDisplayTypePlayType } from '../../../game/constant/AnimateDisplayType';

// Winner 1112
export function Winner(data: ServerMessageWinner.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    roomData.basicInfo.gameStatus = Def.GameStatus.HAND_END;
    let squidEnded = false;
    data.resultsList.forEach(result => {
        const seatData = roomData.seatsStateManager.getSeatPlayer(result.seatId);
        // 已经站起
        if (seatData.userID == 0 || result.standUp) return;
        // 更新筹码
        seatData.chip = result.chip;
        seatData.deposit = result.deposit;
        seatData.setCards(result.myCardsList, AnimateDisplayTypeCards.ShowCards);
        // SQUID
        seatData.squidCount = result.squidCount;
        seatData.squidEscaped = result.squidEscaped;
        if (result.ehcsList.length > 0 && result.ehcsList.filter(v => v.ehcType == Def.EHCType.EHC_SQUID).length > 0) {
            squidEnded = true;
        }
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
    if (squidEnded) {
        roomData.basicInfo.setSquidStatusEnabled(false, AnimateDisplayTypePlayType.Start);
    }
    roomData.seatsStateManager.handEnd();
}
