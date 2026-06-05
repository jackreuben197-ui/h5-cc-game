import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { ServerMessagePostStatusChange } from '../../../protobuf/holdem/recv_th_post_status_change_pb';

// PostStatusChange 1117
export function PostStatusChange(data: ServerMessagePostStatusChange.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
}
