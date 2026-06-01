import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { ServerMessageHandClear } from '../../../protobuf/holdem/recv_th_hand_clear_pb';

// HandClear 1119
export function HandClear(data: ServerMessageHandClear.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    roomData.potInfo.handClear();
    roomData.seatsStateManager.handClear();
    roomData.publicCards.handClear();
    roomData.basicInfo.handClear();
}
