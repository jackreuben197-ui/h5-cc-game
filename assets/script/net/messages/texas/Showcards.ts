import { ServerMessageShowcards } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { AnimateDisplayTypeCards } from '../../../game/constant/AnimateDisplayType';

// Showcards 1101
export function Showcards(data: ServerMessageShowcards.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    data.playerCardsList.forEach(v => {
        const seat = roomData.seatsStateManager.getSeatPlayer(v.seatId);
        if (seat.mine && !data.isAll) return;
        seat.setCards(v.cardsList, AnimateDisplayTypeCards.ShowCards);
        if (seat.mine) {
            // 全量亮牌可能晚于公共牌消息到达；手牌更新后重新计算牌型。
            roomData.mine.caculateHandValueTypeAndHighlight();
        }
    });
    data.allinUsersList.forEach(v => {
        const seat = roomData.seatsStateManager.getSeatPlayer(v.seatId);
        if (v.leftCardsCount > 0) {
            seat.winPercent100 = Math.min(10000, Math.round((v.winCardsCount * 10000) / v.leftCardsCount));
        }
    });
}
