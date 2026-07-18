import { ServerMessageAgreeSecondPcsActive } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';

// AgreeSecondPcsActive 1022
export function AgreeSecondPcsActive(data: ServerMessageAgreeSecondPcsActive.AsObject, roomID: number, matchID: number): void {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    roomData.secondPcs.requestResult(data.status);
}
