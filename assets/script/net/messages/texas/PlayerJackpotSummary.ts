import { ServerMessagePlayerJackpotSummary } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';

// PlayerJackpotSummary 1027
export function PlayerJackpotSummary(data: ServerMessagePlayerJackpotSummary.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (!roomData) return;
    roomData.report.applyJackpotSummary(data);
}
