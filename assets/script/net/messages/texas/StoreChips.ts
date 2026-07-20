import { ServerMessageStoreChips } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';

// StoreChips 1017
export function StoreChips(data: ServerMessageStoreChips.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (data.status === 0) {
        roomData.mine.player.chip = data.chips;
    }
    roomData.mine.storeChipsResult(data.status);
}
