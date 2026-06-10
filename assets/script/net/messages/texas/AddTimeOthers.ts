import { ServerMessageAddTimeOthers } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import { OperatorTimeUpdate } from '../../../data/room/texas/model/Operator';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { updateSeatOperatorAfterAddTime } from './AddTime';

// AddTimeOthers 1113
export function AddTimeOthers(data: ServerMessageAddTimeOthers.AsObject, roomID: number, matchID: number) {
    if (!data) return;
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    const seatPlayer = roomData?.seatsStateManager.getSeatPlayer(data.seatId);
    if (!seatPlayer) return;
    const payload: OperatorTimeUpdate = {
        duration: data.duration,
        times: data.times,
        deadline: data.deadline
    };
    updateSeatOperatorAfterAddTime(seatPlayer, payload);
}
