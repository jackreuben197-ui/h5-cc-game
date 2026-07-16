import { Def, ServerMessageShowPublicCards } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { AnimateDisplayTypePublicCards } from '../../../game/constant/AnimateDisplayType';
import { DiamondConfigType } from '../../../game/constant/DiamondConfigType';
import { CPErrorCode } from '../../../i18n/CPErrorCode';
import viewManager from '../../../views/UIViewManager';

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
    roomData.publicCards.addPublicCards(data.publicCardsList, AnimateDisplayTypePublicCards.Static);
    if (data.publicCards2List && data.publicCards2List.length > 0) {
        roomData.publicCards.addSecondPublicCards(data.publicCards2List, AnimateDisplayTypePublicCards.Static);
    }
    roomData.mine.caculateHandValueTypeAndHighlight();
    const seatNo = roomData.mine.seatNo;
    const handNum = roomData.basicInfo.handNum;
    const publicCardCount = roomData.publicCards.publicCards.length;
    if (canShowViewPublicCardsButton(roomData, seatNo, handNum, publicCardCount)) {
        roomData.mine.showViewPublicCardsButton = false;
        const cost = await roomData.basicInfo.getDiamondPrice(Number(data.round), DiamondConfigType.DiamondConfigTypeViewPublicCards);
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
        roomData.mine.seatNo > 0 &&
        !!roomData.mine.player &&
        !roomData.basicInfo.isMtt &&
        roomData.publicCards.publicCards.length == publicCardCount &&
        roomData.publicCards.publicCards.length < 5
    );
}
