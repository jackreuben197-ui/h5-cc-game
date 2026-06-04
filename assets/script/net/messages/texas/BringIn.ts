import { createLogger } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { ServerMessageBringIn } from '../../../protobuf/holdem/req_th_bring_in_pb';

const _plog = createLogger('ServerMessageEnterRoom');

// BringIn 1005
export function BringIn(data: ServerMessageBringIn.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (data.status != 0) {
        _plog.error('bring err', data.status);
        // 你没有选中任何俱乐部
        roomData.mine.currentWalletClubID = 0;
    }
}
