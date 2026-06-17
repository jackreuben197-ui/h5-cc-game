import { ServerMessageBringIn } from '@silenthill/agreement-web';
import { createLogger } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { CPErrorCode } from '../../../i18n/CPErrorCode';
import { i18nMgr } from '../../../i18n/i18nMgr';
import viewManager from '../../../views/UIViewManager';

const _plog = createLogger('ServerMessageEnterRoom');

// BringIn 1005
export function BringIn(data: ServerMessageBringIn.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (data.status != 0) {
        _plog.error(
            'bring err',
            data.status,
            'deposit',
            roomData.basicInfo.deposit,
            'min',
            roomData.basicInfo.curMinRate * roomData.basicInfo.sbante.sb * 2,
            'max',
            roomData.basicInfo.curMaxRate * roomData.basicInfo.sbante.sb * 2,
            'ret',
            data.totalChips,
            'mine',
            roomData.mine.totalChips
        );
        viewManager.showToast(CPErrorCode.ServerErrorDescription(data.status));
        return;
    }
    //还在游戏中提示
    if (roomData.basicInfo.isPlaying) {
        viewManager.showToast(i18nMgr.Get('UIGameplay_UCRechargeBringinAfter'));
    }
    roomData.mine.totalChips = data.totalChips;
}
