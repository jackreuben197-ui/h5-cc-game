import { Def, ServerMessageViewPlayerCards } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { ViewPlayerCardsMode } from '../../../game/constant/ViewPlayerCardsMode';
import { CPErrorCode } from '../../../i18n/CPErrorCode';
import { i18nMgr } from '../../../i18n/i18nMgr';
import viewManager from '../../../views/UIViewManager';

// ViewPlayerCards 1026
export function ViewPlayerCards(data: ServerMessageViewPlayerCards.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (!roomData || !data) return;
    if (data.status != 0) {
        viewManager.showToast(CPErrorCode.ServerErrorDescription(data.status));
        roomData.mine.showViewPlayerCardsButton =
            roomData.basicInfo.gameStatus == Def.GameStatus.HAND_END &&
            roomData.mine.seatNo > 0 &&
            !!roomData.mine.player &&
            !roomData.basicInfo.isMtt &&
            roomData.basicInfo.viewPlayerCards !== ViewPlayerCardsMode.CLOSE;
        return;
    }
    viewManager.showToast(i18nMgr.Get('UITexas_LookCardFlipSuccessTips'));
    roomData.mine.showViewPlayerCardsButton = false;
}
