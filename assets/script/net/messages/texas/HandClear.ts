import { ServerMessageHandClear } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';

// HandClear 1119
export function HandClear(data: ServerMessageHandClear.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    // 常规清手与 MTT 休息共用同一套牌局展示清理逻辑。
    roomData.clearHandPresentation();
    let otherPlayers = 0;
    roomData.seatsStateManager.forEachPlayer(player => {
        if (!player.mine) otherPlayers++;
    });
    // 单桌无人时展示拆合桌等待提示，同时补充手牌结束状态。
    roomData.mtt.handleHandClear(matchID > 0 && roomData.mine.seatNo > 0 && otherPlayers == 0);
}
