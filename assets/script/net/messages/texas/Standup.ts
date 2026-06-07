import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { ServerMessageStandup } from '../../../protobuf/holdem/recv_th_stand_up_pb';

// Standup 1110
export function Standup(data: ServerMessageStandup.AsObject, roomID: number, matchID: number) {
    let roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    let seatData = roomData.seatsStateManager.getSeatPlayer(data.seatId);
    //@TODO
    seatData.setSeated(false, seatData.mine);
    if (seatData.mine) {
        seatData.mine.clearData();
    }
    seatData.clearData();
}
