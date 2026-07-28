import { Def, Player, ServerMessageSyncEnter } from '@silenthill/agreement-web';
import { createLogger } from '../../../core/decorator/LogTrace';
import PlayerStoreUtils from '../../../data/player/PlayerStoreUtils';
import roomDataManager from '../../../data/room/RoomDataManager';
import { Operator, OperatorMine, OpertionType } from '../../../data/room/texas/model/Operator';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataPlayer from '../../../data/room/texas/TexasGameRoomDataPlayer';
import {
    AnimateDisplayTypeAction,
    AnimateDisplayTypeButton,
    AnimateDisplayTypeCards,
    AnimateDisplayTypeMushroomPool,
    AnimateDisplayTypePlayType,
    AnimateDisplayTypePosition,
    AnimateDisplayTypeRoundBet
} from '../../../game/constant/AnimateDisplayType';
import { AutoOperationTypeTexas } from '../../../game/constant/AutoOpertaionType';
import roomReconnectManager from '../../../game/RoomReconnectManager';

const _plog = createLogger('ServerMessageSyncEnter');

// SyncEnter 1025 —— 拉取房间最新快照
export function SyncEnter(data: ServerMessageSyncEnter.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (!roomData) {
        _plog.error('no store room data', roomID, matchID);
        return;
    }
    const myseat = data.myInfo?.seatId || 0;
    const seatCount = roomData.seatsStateManager.seatsCount;
    const myOp = myseat > 0 && data.operatorList.filter(v => v.seatId == myseat && !v.isAgreeSecondPc && !v.isInsurance).length > 0;
    const defaultHandCards = new Array(roomData.basicInfo.handCardNum).fill(0);
    roomData.basicInfo.sbante = { sb: data.roomInfo.smallBlind, ante: data.roomInfo.ante };
    if (matchID > 0) {
        roomData.mtt.applySnapshot(data.mttInfo, data.mttProgress, data.myInfo);
        //已经设置过了
        const sbante = roomData.basicInfo.sbante;
        if (data.mttProgress) {
            if (data.mttProgress.blindLevel > 0 && data.mttProgress.upBlindLeftTime == 0) {
                roomData.basicInfo.updateMttUpblind(0, sbante, null);
            }
            if (data.mttProgress.blindLevel > 0 && data.mttProgress.upBlindLeftTime > 0) {
                roomData.basicInfo.updateMttUpblind(data.mttProgress.upBlindLeftTime, sbante, {
                    sb: data.mttProgress.nextSmallBlind,
                    ante: data.mttProgress.nextAnte
                });
            }
            if (data.mttProgress.blindLevel == 0) {
                roomData.basicInfo.updateMttUpblind(0, sbante, null);
            }
        } else {
            roomData.basicInfo.updateMttUpblind(0, sbante, null);
        }
    }
    roomData.basicInfo.roomUniqueID = data.roomInfo.uniqueId || '';
    roomData.basicInfo.gameStatus = data.gameStatus;
    if (matchID > 0) {
        // 重连快照必须同步当前手牌状态，避免休息浮层误判为空闲。
        roomData.mtt.syncHandState(data.gameStatus);
    }
    roomData.basicInfo.deposit = data.roomInfo.deposit;
    roomData.basicInfo.squidTotalLimit = data.roomInfo.squidTotalLimit;
    roomData.basicInfo.opDuration = data.roomInfo.opDuration;
    if (data.handInfo) {
        if (data.handInfo.pools) {
            roomData.basicInfo.mushroomStatusPool = data.handInfo.pools.mushroomPool;
            if (roomData.basicInfo.mushroomStatusPool > 0) {
                roomData.basicInfo.setMushroomStatusEnabled(true, AnimateDisplayTypePlayType.Staic);
                roomData.seatsStateManager.setMushroomPoolChange(
                    data.handInfo.buSeatId,
                    data.handInfo.pools.mushroomPool,
                    AnimateDisplayTypeMushroomPool.Static
                );
            }
        }
        roomData.basicInfo.handNum = data.handInfo.handNum;
        roomData.roundState.roundBet = data.handInfo.roundBet; // 当前轮Call平的数值
        roomData.potInfo.allPot = data.handInfo.allBet;
        roomData.potInfo.potList = data.handInfo.potsList;
        roomData.potInfo.secPotList = data.handInfo.secondPotsList;
        roomData.seatsStateManager.setButtonPosition(data.handInfo.buSeatId, AnimateDisplayTypeButton.Static);
        roomData.publicCards.publicCards = data.handInfo.publicCardsList;
        roomData.publicCards.secondPublicCards = data.handInfo.secondPublicCardsList;
        roomData.basicInfo.currentConfigContinueRounds = data.handInfo.conRounds;
        //Critial
        roomData.basicInfo.setCriticalHitStatusEnabled(data.handInfo.criticalHitOpen, AnimateDisplayTypePlayType.Staic);
        //Squid
        roomData.basicInfo.setSquidStatusEnabled(data.handInfo.inSquid, AnimateDisplayTypePlayType.Staic);
        //BombPot
        roomData.basicInfo.setSquidStatusEnabled(data.handInfo.inSquid, AnimateDisplayTypePlayType.Staic);
        if (data.roomInfo.ignorePreflop && data.roomInfo.isAlwaysSecondPcs) {
            roomData.basicInfo.setBombpotStatusEnabled(true, AnimateDisplayTypePlayType.Staic);
        } else {
            roomData.basicInfo.setBombpotStatusEnabled(true, AnimateDisplayTypePlayType.Staic);
        }
    }
    const playerMap: Map<number, Player.AsObject> = new Map();
    data.playersList.map(v => playerMap.set(v.seatId, v));
    if (data.myInfo) {
        roomData.mine.clearData();
        roomData.seatsStateManager.setMySeat(data.myInfo.seatId, AnimateDisplayTypePosition.Static);
    }
    const seatedPlayers: TexasGameRoomDataPlayer[] = [];
    for (let seat = 1; seat <= seatCount; seat++) {
        let seatData = roomData.seatsStateManager.getSeatPlayer(seat);
        let player = playerMap.get(seat);
        if (player) {
            //操作重置
            seatData.operator = null;
            //坐下
            seatData.seated = true;
            seatData.userID = player.userRid;
            seatData.setAction(player.action, AnimateDisplayTypeAction.Static);
            // 延迟看牌做个修正,目前服务端逻辑异常
            // 非自己操作 && 手牌有内容 && 起手轮前且未行动过 && 非ALLIN
            if (myseat == player.seatId) {
                if (
                    data.roomInfo.delaySeeCard &&
                    !myOp &&
                    player.cardsList.length > 0 &&
                    data.gameStatus <= Def.GameStatus.HAND_PREFLOP &&
                    !player.roundActioned &&
                    player.action != Def.Action.ALLIN
                ) {
                    seatData.setCards([...defaultHandCards], AnimateDisplayTypeCards.Static);
                } else {
                    seatData.setCards(player.cardsList, AnimateDisplayTypeCards.Static);
                }
            } else {
                seatData.setCards(player.cardsList, AnimateDisplayTypeCards.Static);
            }
            seatData.name = player.name;
            seatData.avatar = player.avatar;
            seatData.chip = player.chip;
            seatData.handBet = player.handBet;
            seatData.setRoundBet(player.roundBet, AnimateDisplayTypeRoundBet.Static);
            seatData.status = player.status;
            seatData.keepSeat(player.keepSeatDeadline > 0, player.keepSeatDeadline, player.keepSeatReason);
            seatData.deposit = player.deposit;
            seatData.buyInsuranceStep = player.buyInsuranceStep;
            seatData.buyInsuranceList = player.buyInsuranceList;
            seatData.roundActioned = player.roundActioned;
            seatData.isAuto = player.isAutoop;
            //MTT
            seatData.mttHunterKill = player.hunterKill;
            seatData.mttHunterKillAward = player.hunterKillAward;
            seatData.mttHunterKillAwardOther = player.hunterKillAwardOther;
            seatData.mttHunterHeadValue = player.hunterHeadValue;
            //vip
            seatData.vip = player.vip > 0;
            seatData.subscriptionID = player.userSubscriptionId;
            //mushroom
            seatData.inMushroom = player.inMushroom;
            seatData.costMushroom = player.costMushroom;
            //squid
            seatData.squidIn = player.inSquid;
            seatData.squidEscaped = player.squidEscaped;
            seatData.squidCount = player.squidCount;
            //视频
            seatData.videoMaskId = player.videoMaskId;
            //获胜卡牌
            if (player.winCardsInfo) {
                seatData.winPercent100 = Math.min(10000, Math.round((player.winCardsInfo.wcCount * 10000) / player.winCardsInfo.lcCount));
            }
            seatedPlayers.push(seatData);
        } else {
            seatData.seated = false;
            seatData.clearData();
        }
    }
    PlayerStoreUtils.syncSeatPlayers(roomData, seatedPlayers);
    if (data.myInfo) {
        const player = roomData.seatsStateManager.getSeatPlayer(data.myInfo.seatId);
        if (player) {
            player.mine.autoOperationType = AutoOperationTypeTexas.NO;
            //有牌
            if (player.canOpearate) {
                player.mine.caculateValidAutoOperationType(data.handInfo.roundBet);
            } else {
                roomData.mine.setRightAutoOpPannel(AutoOperationTypeTexas.NO, 0);
            }
            if (roomData.basicInfo.squidStatusEnabled) {
                roomData.mine.showSquidInButton = !player.squidIn;
            }
        }
        roomData.mine.storeChips = data.myInfo.storeChips;
        roomData.mine.totalChips = data.myInfo.totalChips;
        roomData.mine.callTimeCount = data.myInfo.callTimeCount;
        roomData.mine.callTimeStay = data.myInfo.callTimeStay;
        roomData.mine.caculateHandValueTypeAndHighlight();
    }
    data.operatorList.forEach(operator => {
        let seatData = roomData.seatsStateManager.getSeatPlayer(operator.seatId);
        if (seatData.mine) {
            //@TODO 本人操作的准备
            let op = new OperatorMine();
            op.allPot = data.handInfo.allBet;
            op.roundBetEqual = data.handInfo.roundBet;
            op.alreadyDelayTImes = operator.delayTimes;
            op.deadlineTImestamp = operator.opDeadline;
            op.leftOpDuration = operator.leftOpTime;
            op.totalOpDuration = roomData.basicInfo.opDuration;
            op.actionLimitList = operator.actionsList;
            op.insurancePotInvalidList = operator.invalidInsurancePotsList;
            op.insurancePotLimitList = operator.insuranceLimitList;
            op.playerCardsList = operator.playerCardsList;
            if (operator.isInsurance) {
                op.opType = OpertionType.INSURANCE;
            } else if (operator.isAgreeSecondPc) {
                op.opType = OpertionType.AGREESECPUB;
            } else {
                op.opType = OpertionType.NORMAL;
            }
            seatData.mine.operator = op;
        } else {
            let seatData = roomData.seatsStateManager.getSeatPlayer(operator.seatId);
            let op = new Operator();
            op.allPot = data.handInfo.allBet;
            op.roundBetEqual = data.handInfo.roundBet;
            op.alreadyDelayTImes = operator.delayTimes;
            op.deadlineTImestamp = operator.opDeadline;
            op.leftOpDuration = operator.leftOpTime;
            op.totalOpDuration = roomData.basicInfo.opDuration;
            if (operator.isInsurance) {
                op.opType = OpertionType.INSURANCE;
            } else if (operator.isAgreeSecondPc) {
                op.opType = OpertionType.AGREESECPUB;
            } else {
                op.opType = OpertionType.NORMAL;
            }
            seatData.operator = op;
        }
    });
    // 通知重连结束了
    roomReconnectManager.syncEnterComplete(roomID, matchID);
}
