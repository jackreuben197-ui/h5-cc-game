import { ServerMessageSquidIn } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';

// SquidIn 1125
export function SquidIn(data: ServerMessageSquidIn.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    const pl = roomData.seatsStateManager.getSeatPlayer(data.seatId);
    pl.squidIn = data.enable;
    if (roomData.mine.player) {
        roomData.mine.showSquidInButton = !data.enable;
    }
}
