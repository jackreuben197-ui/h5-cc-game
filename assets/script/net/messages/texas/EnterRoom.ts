import { Def, Player, ServerMessageEnterRoom } from '@silenthill/agreement-web';
import { createLogger } from '../../../core/decorator/LogTrace';
import soundManager from '../../../core/SoundManager';
import roomDataManager from '../../../data/room/RoomDataManager';
import { Operator, OperatorMine, OpertionType } from '../../../data/room/texas/model/Operator';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
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
import { ButtonState } from '../../../game/constant/Constants';
import roomReconnectManager from '../../../game/RoomReconnectManager';
import viewManager from '../../../views/UIViewManager';
import agoraManager from '../../agora/AgoraManager';
import TexasVideoMediaHelper from './TexasVideoMediaHelper';

const _plog = createLogger('ServerMessageEnterRoom');

// EnterRoom 1002
export async function EnterRoom(data: ServerMessageEnterRoom.AsObject, roomID: number, matchID: number): Promise<void> {
    let roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (!roomData && matchID > 0) {
        // MTT 首次进桌：客户端用 (0, matchID) 发的请求，服务端回来已分配了真实 roomID
        roomData = roomDataManager.getRoomData<TexasGameRoomData>(0, matchID);
        if (roomData) {
            roomData.roomID = roomID;
            roomDataManager.deleteRoomData(0, matchID);
            roomDataManager.setRoomData(roomID, matchID, roomData);
        }
    }
    if (!roomData) {
        _plog.error('no store room data');
        return;
    }
    if (data.status != 0) return;
    // 声音处理
    soundManager.volumeOnOff(roomData.setting.soundOn);
    soundManager.playBGM();
    roomReconnectManager.addContext({
        roomID: roomID,
        matchID: matchID
    });
    const myseat = data.myInfo.seatId;
    const seatCount = roomData.seatsStateManager.seatsCount;
    const myOp = myseat > 0 && data.operatorList.filter(v => v.seatId == myseat && !v.isAgreeSecondPc && !v.isInsurance).length > 0;
    const defaultHandCards = new Array(roomData.basicInfo.handCardNum).fill(0);
    {
        roomData.basicInfo.sbante = { sb: data.roomInfo.smallBlind, ante: data.roomInfo.ante };
        roomData.basicInfo.roomUniqueID = data.roomInfo.uniqueId || '';
        roomData.basicInfo.gameStatus = data.gameStatus;
        roomData.basicInfo.deposit = data.roomInfo.deposit;
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
                seatData.realShowMaskID = 0;
                //获胜卡牌
                if (player.winCardsInfo) {
                    seatData.winPercent100 = Math.min(10000, Math.round((player.winCardsInfo.wcCount * 10000) / player.winCardsInfo.lcCount));
                }
            } else {
                seatData.seated = false;
                seatData.clearData();
            }
        }
        if (data.myInfo) {
            roomData.mine.clearData();
            const player = roomData.seatsStateManager.setMySeat(data.myInfo.seatId, AnimateDisplayTypePosition.Static);
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
    }
    roomData.mine.localCameraBtnState = ButtonState.DISABLE;
    roomData.mine.localCameraEnabled = false;
    roomData.mine.localCameraEnabledDelayed = false;
    roomData.mine.localMicrophoneBtnState = ButtonState.DISABLE;
    roomData.mine.localMicrophoneEnabled = false;
    roomData.mine.maskBtnState = ButtonState.DISABLE;
    roomData.mine.remoteCameraEnabled = ButtonState.HIDDEN;
    roomData.mine.remoteMicrophoneEnabled = ButtonState.HIDDEN;
    roomData.mine.randomVideoActive = false;
    roomData.mine.randomVideoEndTime = 0;
    roomData.seatsStateManager.resetVideoAndAudioStates();
    // 视频房间：入房后加入 Agora 频道
    if (roomData.mine.seatNo > 0 && roomData.basicInfo.antiCheatConfig) {
        const seatedConfig = roomData.basicInfo.antiCheatConfig.getSeatedSetting();
        const promise = [];
        try {
            if (seatedConfig.enableCamera) {
                promise.push(agoraManager.enableCamera());
            }
            promise.push(agoraManager.enableMicrophone());
            promise.push(TexasVideoMediaHelper.joinAgoraVideoChannelIfNeed(roomID, matchID));
            await Promise.all(promise);
            // 如果能操作摄像头,则根据状态变更
            if (seatedConfig.canOpCamera) {
                //能操作交给按钮操作
                roomData.mine.localCameraBtnState = seatedConfig.openCamera ? ButtonState.ON : ButtonState.OFF;
            } else {
                roomData.mine.localCameraBtnState = ButtonState.DISABLE;
                // 不能按钮操作 强制操作
                roomData.mine.localCameraEnabled = seatedConfig.openCamera;
            }
            if (seatedConfig.canOpMicrophone) {
                roomData.mine.localMicrophoneBtnState = seatedConfig.openMicrophone ? ButtonState.ON : ButtonState.OFF;
            } else {
                roomData.mine.localMicrophoneBtnState = ButtonState.DISABLE;
                roomData.mine.localMicrophoneEnabled = seatedConfig.openMicrophone;
            }
            if (seatedConfig.enableCamera && seatedConfig.canSwitchPowerSaving) {
                roomData.mine.maskBtnState = seatedConfig.openPowerSaving ? ButtonState.ON : ButtonState.DISABLE;
            } else if (seatedConfig.enableCamera && !seatedConfig.canSwitchPowerSaving) {
                roomData.mine.maskBtnState = ButtonState.DISABLE;
                if (seatedConfig.openPowerSaving) {
                    roomData.seatsStateManager.forEachPlayer(p => {
                        p.realShowMaskID = p.videoMaskId == 0 ? 1 : p.videoMaskId;
                    });
                } else {
                    roomData.seatsStateManager.forEachPlayer(p => {
                        p.realShowMaskID = 0;
                    });
                }
            }
            roomData.mine.remoteCameraEnabled = seatedConfig.enableCamera ? ButtonState.ON : ButtonState.HIDDEN;
            roomData.mine.remoteMicrophoneEnabled = ButtonState.ON;
        } catch (e) {
            _plog.error('加入视频桌失败', e);
            viewManager.showToast('无法开启摄像头，请检查浏览器权限后重新入座');
        }
    }
    await viewManager.switchScene('TexasRoom', {
        roomID: roomData.roomID,
        matchID: roomData.matchID
    });
}
