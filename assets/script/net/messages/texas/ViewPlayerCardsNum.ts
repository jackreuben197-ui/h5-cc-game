import { Def, ServerMessageViewPlayerCardsNum } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { DiamondConfigType } from '../../../game/constant/DiamondConfigType';
import { ViewPlayerCardsMode } from '../../../game/constant/ViewPlayerCardsMode';

// ViewPlayerCardsNum 1029
export async function ViewPlayerCardsNum(data: ServerMessageViewPlayerCardsNum.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (!roomData || !data) return;
    if (data.status != 0) {
        roomData.mine.showViewPlayerCardsButton = false;
        return;
    }
    const seatNo = roomData.mine.seatNo;
    const handNum = roomData.basicInfo.handNum;
    if (!canShowViewPlayerCardsButton(roomData, seatNo, handNum)) return;
    const cost = await roomData.basicInfo.getDiamondPrice(data.payTimes, DiamondConfigType.DiamondConfigTypePayWatchOtherCardWatchAll);
    if (!canShowViewPlayerCardsButton(roomData, seatNo, handNum)) return;
    roomData.mine.viewPlayerCardsCost = cost;
    roomData.mine.showViewPlayerCardsButton = true;
}

function canShowViewPlayerCardsButton(roomData: TexasGameRoomData, seatNo: number, handNum: number): boolean {
    return (
        roomData.basicInfo.gameStatus == Def.GameStatus.HAND_END &&
        roomData.basicInfo.handNum == handNum &&
        roomData.mine.seatNo == seatNo &&
        roomData.mine.seatNo > 0 &&
        !!roomData.mine.player &&
        !roomData.basicInfo.isMtt &&
        roomData.basicInfo.viewPlayerCards !== ViewPlayerCardsMode.CLOSE
    );
}
