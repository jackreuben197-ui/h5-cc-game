import { ServerMessageJackpotGoldChange } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';

// JackpotGoldChange 1129
export function JackpotGoldChange(data: ServerMessageJackpotGoldChange.AsObject, roomID: number, matchID: number) {
    if (!data) return;
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (!roomData) return;
    const basicInfo = roomData.basicInfo;
    basicInfo.updateJackpotPool(
        data.jackpotId !== undefined ? Number(data.jackpotId || 0) : basicInfo.jackpotID,
        Number(data.jackpotGold || 0),
        Number(data.jackpotParentGold || data.jackpotGold || 0)
    );
}
