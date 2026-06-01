import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { ServerMessageSidePots } from '../../../protobuf/holdem/recv_th_side_pots_pb';

// SidePots 1105
export function SidePots(data: ServerMessageSidePots.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    roomData.potInfo.potList = data.potsList;
}
