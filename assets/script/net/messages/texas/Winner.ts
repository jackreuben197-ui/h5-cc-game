import { Def, Result, ServerMessageWinner } from '@silenthill/agreement-web';
import { createLogger } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { AnimateDisplayTypeCards, AnimateDisplayTypePlayType } from '../../../game/constant/AnimateDisplayType';
import { DiamondConfigType } from '../../../game/constant/DiamondConfigType';
import { ViewPlayerCardsMode } from '../../../game/constant/ViewPlayerCardsMode';
import { canWatchPlayerCards, canWatchPublicCards } from '../../../game/util/ViewPlayerCardsConfig';
import { UISquidEndItemShowData } from '../../../views/dialog/squidover/UISquidEndItem';
import TexasTableEvent from '../../../views/scene/room/texas/events/TexasTableEvent';

const _plog = createLogger('ServerMessageWinner');

// Winner 1112
export function Winner(data: ServerMessageWinner.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (!roomData) {
        _plog.warn('ignore winner without room data', roomID, matchID, data.handNum);
        return;
    }
    if (roomData.mtt.tableTransferWaiting || data.handNum != roomData.basicInfo.handNum) {
        // Winner 自带 handNum，可严格拦截拆合桌期间延迟到达的上一桌/上一手结算。
        _plog.error('[server_hand_mismatch] ignore stale winner', {
            roomID,
            matchID,
            tableTransferWaiting: roomData.mtt.tableTransferWaiting,
            localHandNum: roomData.basicInfo.handNum,
            serverHandNum: data.handNum
        });
        return;
    }
    roomData.basicInfo.gameStatus = Def.GameStatus.HAND_END;
    let squidEnded = false;
    let squidResult: UISquidEndItemShowData[] = [];
    let maxHv = 0;
    let maxResult: Result.AsObject = null;
    data.resultsList.forEach(result => {
        const seatData = roomData.seatsStateManager.getSeatPlayer(result.seatId);
        seatData.action = Def.Action.NONE; // 清理下状态
        // 已经站起
        if (seatData.userID == 0 || result.standUp) return;
        // 更新筹码
        seatData.chip = result.chip;
        seatData.deposit = result.deposit;
        // Showcards 可能已先揭开完整手牌；Winner 的 0 只是“本包未携带牌面”，
        // 不能把同一手内已经公开的牌重新覆盖成牌背。
        seatData.revealCards(result.myCardsList, AnimateDisplayTypeCards.ShowCards);
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
            // 对齐 Unity _winChips：这里展示本手净收池，不是结算后总余额 result.chip。
            const collectedChips = result.win + result.insuranceWin - result.insurance - result.handBet - result.fee;
            seatData.claimWin(true, result.handValueType, collectedChips);
            if (result.handValueType > maxHv) {
                maxResult = result;
            }
        }
        if (seatData.mine) {
            let mine = seatData.mine;
            mine.totalChips = result.totalChips;
            mine.storeChips = result.storeChips;
            mine.callTimeCount = result.callTimeCount;
            mine.callTimeStay = result.callTimeStay;
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
        roomData.mine.showSquidInButton = false;
        roomData.basicInfo.squiedResultsEmit(squidResult);
    } else if (roomData.basicInfo.squidStatusEnabled) {
        roomData.basicInfo.squidRemainingCountChanged();
    }
    // 战绩面板：按 Unity TexasSituationController.HandResult 增量累加 win/handNum/poolCount/mushroom/jackpot
    roomData.report.applyWinnerResult(data);
    roomData.seatsStateManager.handEnd();
    const mineResult = data.resultsList.find(result => result.seatId == roomData.mine.seatNo);
    const isSeated = roomData.mine.seatNo > 0;
    const canShowPlayerCardsButton = canShowSettlementButton(roomData, mineResult, canWatchPlayerCards(roomData.basicInfo, isSeated));
    if (canShowPlayerCardsButton && roomData.basicInfo.viewPlayerCards !== ViewPlayerCardsMode.CLOSE) {
        TexasTableEvent.ViewPlayerCardsNum(roomData.mine);
    } else {
        roomData.mine.showViewPlayerCardsButton = false;
    }
    const canShowPublicCardsButton = canShowSettlementButton(roomData, mineResult, canWatchPublicCards(roomData.basicInfo, isSeated));
    if (canShowPublicCardsButton && roomData.publicCards.publicCards.length < 5) {
        calculateViewPublicCardsCost(roomData, data.round, roomData.mine.seatNo, roomData.basicInfo.handNum, roomData.publicCards.publicCards.length);
    } else {
        roomData.mine.showViewPublicCardsButton = false;
    }
    // Winner 的牌型、亮牌和高亮处理结束后再通知 MTT，避免休息清理后被本消息重新写回。
    roomData.mtt.handleHandEnd();
}

function canShowSettlementButton(roomData: TexasGameRoomData, mineResult: Result.AsObject | undefined, hasPermission: boolean): boolean {
    if (roomData.basicInfo.isMtt || !hasPermission) return false;
    if (roomData.mine.seatNo === 0) return true;
    return !!roomData.mine.player && !!mineResult && !mineResult.standUp;
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

async function calculateViewPublicCardsCost(
    roomData: TexasGameRoomData,
    round: Def.RoundMap[keyof Def.RoundMap],
    seatNo: number,
    handNum: number,
    publicCardCount: number
) {
    const cost = await roomData.basicInfo.getDiamondPrice(Number(round), DiamondConfigType.DiamondConfigTypeViewPublicCards);
    if (!canShowViewPublicCardsButton(roomData, seatNo, handNum, publicCardCount)) return;
    roomData.mine.viewPublicCardsCost = cost;
    roomData.mine.showViewPublicCardsButton = true;
}
