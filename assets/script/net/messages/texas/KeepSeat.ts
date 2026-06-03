import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { ServerMessageKeepSeat } from '../../../protobuf/holdem/recv_th_keep_seat_pb';

// KeepSeat 1111
export function KeepSeat(data: ServerMessageKeepSeat.AsObject, roomID: number, matchID: number) {
    let roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    const seatPlayer = roomData.seatsStateManager.getSeatPlayer(data.seatId);
}
