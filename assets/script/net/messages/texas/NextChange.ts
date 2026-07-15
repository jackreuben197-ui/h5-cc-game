import { ServerMessageNextChange } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';

// NextChange 1126
export function NextChange(data: ServerMessageNextChange.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (data.squidTotalLimit > 0){
        roomData.basicInfo.squidTotalLimit = data.squidTotalLimit;
    }
    roomData.basicInfo.squidStatusEnabled = data.squidOpen;
    if (!data.squidOpen) {
        roomData.mine.showSquidInButton = false;
    }
}
