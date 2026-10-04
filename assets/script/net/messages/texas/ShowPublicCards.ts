import { Def, ServerMessageShowPublicCards } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import globalConfigStore from '../../../data/system/GlobalConfigStore';
import { AnimateDisplayTypePublicCards } from '../../../game/constant/AnimateDisplayType';
import { canWatchPublicCards } from '../../../game/util/ViewPlayerCardsConfig';
import { CPErrorCode } from '../../../i18n/CPErrorCode';
import viewManager from '../../../views/UIViewManager';
import TexasTableEvent from '../../../views/scene/room/texas/events/TexasTableEvent';

// ShowPublicCards 1013
export async function ShowPublicCards(data: ServerMessageShowPublicCards.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (!roomData || !data) return;
    if (data.status != 0) {
        viewManager.showToast(CPErrorCode.ServerErrorDescription(data.status));
        roomData.mine.showViewPublicCardsButton = canShowViewPublicCardsButton(
            roomData,
            roomData.mine.seatNo,
            roomData.basicInfo.handNum,
            roomData.publicCards.publicCards.length
        );
        return;
    }
    // 查看成功后剩余免费次数可能已经变化，下次展示价格时重新向服务端取值。
    roomData.replay.clearViewPubFreeCount();
    roomData.publicCards.addPublicCards(data.publicCardsList, AnimateDisplayTypePublicCards.Static);
    if (data.publicCards2List && data.publicCards2List.length > 0) {
        const needPub = 5 - data.publicCards2List.length;
        const secPcs: number[] = [...roomData.publicCards.publicCards.slice(0, needPub), ...data.publicCards2List];
        roomData.publicCards.addSecondPublicCards(secPcs, AnimateDisplayTypePublicCards.Static);
    }
    roomData.mine.caculateHandValueTypeAndHighlight();
    const seatNo = roomData.mine.seatNo;
    const handNum = roomData.basicInfo.handNum;
    const publicCardCount = roomData.publicCards.publicCards.length;
    if (canShowViewPublicCardsButton(roomData, seatNo, handNum, publicCardCount)) {
        roomData.mine.showViewPublicCardsButton = false;
        const freeCount = globalConfigStore.isChannelDiamondFreeMode && globalConfigStore.viewPublicCards.freeCount > 0
            ? await TexasTableEvent.ReqReplayViewPubFreeCount(roomData)
            : 0;
        const cost = freeCount > 0 ? 0 : await roomData.basicInfo.getViewPublicCardsPrice(Number(data.round));
        if (!canShowViewPublicCardsButton(roomData, seatNo, handNum, publicCardCount)) return;
        roomData.mine.viewPublicCardsCost = cost;
        roomData.mine.showViewPublicCardsButton = true;
    } else {
        roomData.mine.showViewPublicCardsButton = false;
    }
}

function canShowViewPublicCardsButton(roomData: TexasGameRoomData, seatNo: number, handNum: number, publicCardCount: number): boolean {
    return (
        roomData.basicInfo.gameStatus == Def.GameStatus.HAND_END &&
        roomData.basicInfo.handNum == handNum &&
        roomData.mine.seatNo == seatNo &&
        !roomData.basicInfo.isMtt &&
        canWatchPublicCards(roomData.basicInfo, roomData.mine.seatNo > 0) &&
        roomData.publicCards.publicCards.length == publicCardCount &&
        roomData.publicCards.publicCards.length < 5
    );
}
