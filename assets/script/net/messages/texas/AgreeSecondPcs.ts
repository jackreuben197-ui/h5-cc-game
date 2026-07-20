import { ServerMessageAgreeSecondPcs } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';

// AgreeSecondPcs 1123
export function AgreeSecondPcs(data: ServerMessageAgreeSecondPcs.AsObject, roomID: number, matchID: number): void {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    roomData.secondPcs.vote(data.seatId, data.result);
}
