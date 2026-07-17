import { ServerMessageShowViewCards } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { AnimateDisplayTypeCards } from '../../../game/constant/AnimateDisplayType';

// ShowViewCards 1127
export function ShowViewCards(data: ServerMessageShowViewCards.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (!roomData || !data || !data.playerCardsList) return;
    data.playerCardsList.forEach(card => {
        if (card.seatId == 0 || card.seatId == roomData.mine.seatNo) return;
        const seat = roomData.seatsStateManager.getSeatPlayer(card.seatId);
        if (!seat || seat.userID == 0) return;
        seat.setCards(card.cardsList, AnimateDisplayTypeCards.ShowCards);
    });
}
