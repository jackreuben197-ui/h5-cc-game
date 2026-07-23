import { ServerMessageStandup } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';

// Standup 1110
export function Standup(data: ServerMessageStandup.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    const seatData = roomData.seatsStateManager.getSeatPlayer(data.seatId);
    if (!seatData) return;
    const mine = seatData.mine;
    // clearData 前先把身份留住，战绩里还要把这位玩家标成离桌。
    if (seatData.userID > 0) {
        roomData.report.applyStandUp(seatData.userID, data.bringOut || 0, seatData.name, seatData.avatar);
    }
    seatData.setSeated(false, mine);
    if (mine) {
        mine.clearVideoAndAudio();
        mine.clearData();
    }
    seatData.clearData();
}
