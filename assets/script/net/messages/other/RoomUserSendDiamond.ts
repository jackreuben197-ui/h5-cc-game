import { ServerMessageRoomUserSendDiamond } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';

// RoomUserSendDiamond 132
export function RoomUserSendDiamond(data: ServerMessageRoomUserSendDiamond.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    roomData.seatsStateManager.diamondGiftEvent({
        senderID: data.senderRid || data.senderId,
        receiverID: data.recieveRid || data.recieveId,
        amount: data.amount
    });
}
