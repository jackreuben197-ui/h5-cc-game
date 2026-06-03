import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { AnimateDisplayTypeCards } from '../../../game/constant/AnimateDisplayType';
import { ServerMessageShowcards } from '../../../protobuf/holdem/recv_th_showcards_pb';

// Showcards 1101
export function Showcards(data: ServerMessageShowcards.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    data.playerCardsList.forEach(v => {
        const seat = roomData.seatsStateManager.getSeatPlayer(v.seatId);
        seat.setCards(v.cardsList, AnimateDisplayTypeCards.ShowCards);
    });
    data.allinUsersList.forEach(v => {
        const seat = roomData.seatsStateManager.getSeatPlayer(v.seatId);
        if (v.leftCardsCount > 0) {
            seat.winPercent100 = Math.min(100, Math.round((v.winCardsCount * 100) / v.leftCardsCount));
        }
    });
}
