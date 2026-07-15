import { ServerMessageSquidIn } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { i18nMgr } from '../../../i18n/i18nMgr';
import viewManager from '../../../views/UIViewManager';

// SquidIn 1125
export function SquidIn(data: ServerMessageSquidIn.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    const pl = roomData.seatsStateManager.getSeatPlayer(data.seatId);
    pl.squidIn = data.enable;
    if (data.squidTotalLimit > 0) {
        roomData.basicInfo.squidTotalLimit = data.squidTotalLimit;
    }
    if (roomData.basicInfo.squidStatusEnabled) {
        roomData.basicInfo.squidRemainingCountChanged();
    }
    if (pl.mine) {
        pl.mine.showSquidInButton = roomData.basicInfo.squidStatusEnabled && !data.enable;
    }
    if (data.firstIn) {
        viewManager.showToast(i18nMgr.Get('UISquidJoinInNewTips1'));
    }
}
