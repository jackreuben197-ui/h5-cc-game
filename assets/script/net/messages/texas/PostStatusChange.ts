import { ServerMessagePostStatusChange } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';

// PostStatusChange 1117
export function PostStatusChange(data: ServerMessagePostStatusChange.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    data.changesList.forEach(v => {
        const seat = roomData.seatsStateManager.getSeatPlayer(v.seatId);
        seat.status = v.currentPostStatus;
    });
}
