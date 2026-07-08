import { ServerMessageRoomers } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';

// Roomers 1021
export function Roomers(data: ServerMessageRoomers.AsObject, roomID: number, matchID: number) {
    if (!data || (data.status != null && data.status !== 0)) return;
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (!roomData) return;
    roomData.report.applyRoomers(data);
}
