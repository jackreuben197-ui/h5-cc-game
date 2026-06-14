import { ServerMessageSeatedOthers } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';

// SeatedOthers 1102
export function SeatedOthers(data: ServerMessageSeatedOthers.AsObject, roomID: number, matchID: number) {
    if (!data) return;
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (!roomData) return;
    // 战绩面板基线缓存：别人坐下时累加 totalBringin（对应 pokerqueen UITexas.onSeatedOthersUpdate）
    roomData.report.applySitDown(data.userRid, data.totalBringin || data.chips || 0, data.deposit || 0, data.name || '', data.avatar || '');
}
