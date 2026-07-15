import { ServerMessageJackpotGoldChange } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';

// JackpotGoldChange 1129
export function JackpotGoldChange(data: ServerMessageJackpotGoldChange.AsObject, roomID: number, matchID: number) {
    if (!data) return;
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (!roomData) return;
    const basicInfo = roomData.basicInfo;
    if (data.jackpotId !== undefined) {
        basicInfo.jackpotID = Number(data.jackpotId || 0);
    }
    basicInfo.jackpotPool = Number(data.jackpotGold || 0);
    basicInfo.jackpotMainPool = Number(data.jackpotParentGold || data.jackpotGold || 0);
    basicInfo.jackpotChangedEmit();
}
