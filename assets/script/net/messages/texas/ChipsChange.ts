import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { ServerMessageChipsChange } from '../../../protobuf/holdem/recv_th_chips_change_pb';

// ChipsChange 1107
export function ChipsChange(data: ServerMessageChipsChange.AsObject, roomID: number, matchID: number) {
    let roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    data.changesList.forEach(changeData => {
        let seatData = roomData.seatsStateManager.getSeatPlayer(changeData.seatId);
        seatData.chip = changeData.chips;
        seatData.deposit += changeData.depositChange;
        if (seatData.mine) {
            seatData.mine.storeChips = changeData.storeChips;
        }
    });
}
