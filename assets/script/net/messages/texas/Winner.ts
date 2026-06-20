import { Def, Result, ServerMessageWinner } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { AnimateDisplayTypeCards, AnimateDisplayTypePlayType } from '../../../game/constant/AnimateDisplayType';
import { UISquidEndItemShowData } from '../../../views/dialog/squidover/UISquidEndItem';

// Winner 1112
export function Winner(data: ServerMessageWinner.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    roomData.basicInfo.gameStatus = Def.GameStatus.HAND_END;
    let squidEnded = false;
    let squidResult: UISquidEndItemShowData[] = [];
    let maxHv = 0;
    let maxResult: Result.AsObject = null;
    data.resultsList.forEach(result => {
        const seatData = roomData.seatsStateManager.getSeatPlayer(result.seatId);
        // 已经站起
        if (seatData.userID == 0 || result.standUp) return;
        // 更新筹码
        seatData.chip = result.chip;
        seatData.deposit = result.deposit;
        seatData.setCards(result.myCardsList, AnimateDisplayTypeCards.ShowCards);
        // SQUID
        seatData.squidCount = result.squidCount;
        seatData.squidEscaped = result.squidEscaped;
        if (result.ehcsList.length > 0 && result.ehcsList.filter(v => v.ehcType == Def.EHCType.EHC_SQUID).length > 0) {
            squidEnded = true;
            const res = result.ehcsList.filter(v => v.ehcType == Def.EHCType.EHC_SQUID)[0];
            squidResult.push({
                userID: seatData.userID,
                nick: seatData.name,
                avatar: seatData.avatar,
                money: res.pb_in - res.out,
                squidNum: result.squidCount,
                rate: roomData.basicInfo.getSquidCountRate(result.squidCount),
                isPunish: false
            });
        }
        if (result.win - result.handBet > 0) {
            seatData.claimWin(true, result.handValueType, result.chip);
            if (result.handValueType > maxHv) {
                maxResult = result;
            }
        }
        if (seatData.mine) {
            let mine = seatData.mine;
            mine.totalChips = result.totalChips;
            mine.storeChips = result.storeChips;
            let pubH: number[] = [];
            let pub2H: number[] = [];
            let myCardsH: number[] = [];
            result.winCardsList.forEach(v => {
                if (v.isPublic) {
                    pubH.push(v.card);
                } else {
                    myCardsH.push(v.card);
                }
            });
            result.winCards2List.forEach(v => {
                if (v.isPublic) {
                    pub2H.push(v.card);
                }
            });
            mine.highlightCards(myCardsH);
            roomData.publicCards.higlightPublicards(pubH);
        }
    });
    if (maxResult != null) {
        let pubH: number[] = [];
        let myCardsH: number[] = [];
        maxResult.winCardsList.forEach(v => {
            if (v.isPublic) {
                pubH.push(v.card);
            } else {
                myCardsH.push(v.card);
            }
        });
        const player = roomData.seatsStateManager.getSeatPlayer(maxResult.seatId);
        player.popupCards(myCardsH);
        roomData.publicCards.popUpPublicards(pubH);
        data.resultsList.forEach(result => {
            const seatData = roomData.seatsStateManager.getSeatPlayer(result.seatId);
            if (seatData.userID == 0 || result.standUp) return;
            if (result.handValueType > 0 && maxResult.seatId != result.seatId) {
                seatData.popupCards([]);
            }
        });
    }
    data.pools?.squidDetailsList.forEach(v => {
        squidResult.push({
            userID: v.userRid,
            nick: v.name,
            avatar: v.avatar,
            money: v.punishFee,
            squidNum: 0,
            rate: 0,
            isPunish: true
        });
    });
    if (squidEnded) {
        roomData.basicInfo.setSquidStatusEnabled(false, AnimateDisplayTypePlayType.Start);
        roomData.basicInfo.squiedResultsEmit(squidResult);
    }
    roomData.seatsStateManager.handEnd();
}
