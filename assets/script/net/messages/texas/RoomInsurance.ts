import { ServerMessageRoomInsurance } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';

// RoomInsurance 1030
export function RoomInsurance(data: ServerMessageRoomInsurance.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (!roomData) return;
    roomData.report.applyRoomInsurance(data);
}
