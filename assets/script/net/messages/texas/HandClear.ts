import { ServerMessageHandClear } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';

// HandClear 1119
export function HandClear(data: ServerMessageHandClear.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    roomData.potInfo.handClear();
    roomData.seatsStateManager.handClear();
    roomData.publicCards.handClear();
    roomData.basicInfo.handClear();
}
