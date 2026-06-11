import { ServerMessageKeepSeat } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';

// KeepSeat 1111
export function KeepSeat(data: ServerMessageKeepSeat.AsObject, roomID: number, matchID: number) {
    let roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    const seatPlayer = roomData.seatsStateManager.getSeatPlayer(data.seatId);
    let deadline = data.deadline;
    if (data.leftTime == 0) {
        deadline = 0;
    }
    if (data.keep) {
        seatPlayer.keepSeat(true, deadline, data.keepSeatReason);
    } else {
        seatPlayer.keepSeat(false, 0, 0);
    }
}
