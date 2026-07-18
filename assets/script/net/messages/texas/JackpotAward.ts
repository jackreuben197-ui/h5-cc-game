import { ServerMessageJackpotAward } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';

// JackpotAward 1130
export function JackpotAward(data: ServerMessageJackpotAward.AsObject, roomID: number, matchID: number) {
    if (!data?.awardUsersList?.length) return;
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (!roomData) return;
    roomData.basicInfo.jackpotAwardEmit(data.awardUsersList);
}
