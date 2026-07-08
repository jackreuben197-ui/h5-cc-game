import { ServerMessageStandup } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';

// Standup 1110
export function Standup(data: ServerMessageStandup.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    const seatData = roomData.seatsStateManager.getSeatPlayer(data.seatId);
    const mine = seatData.mine;
    seatData.setSeated(false, mine);
    if (mine) {
        mine.clearVideoAndAudio();
        mine.clearData();
    }
    seatData.clearData();
}
