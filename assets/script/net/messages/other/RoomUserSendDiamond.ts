import { ServerMessageRoomUserSendDiamond } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';

// RoomUserSendDiamond 132
export function RoomUserSendDiamond(data: ServerMessageRoomUserSendDiamond.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    roomData.seatsStateManager.diamondGiftEvent({
        senderID: data.senderId || data.senderRid || 0,
        receiverID: data.recieveId || data.recieveRid || 0,
        amount: data.amount || 0
    });
}
