import { Def, ServerMessageSeated } from '@silenthill/agreement-web';
import { createLogger } from '../../../core/decorator/LogTrace';
import PlayerStoreUtils from '../../../data/player/PlayerStoreUtils';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import userStore from '../../../data/user/UserStore';
import UserStoreUtils from '../../../data/user/UserStoreUtils';
import { AnimateDisplayTypePosition } from '../../../game/constant/AnimateDisplayType';
import { AutoOperationTypeTexas } from '../../../game/constant/AutoOpertaionType';
import { BringInMode } from '../../../game/constant/BringInMode';
import { ButtonState } from '../../../game/constant/Constants';
import { CPErrorCode } from '../../../i18n/CPErrorCode';
import viewManager from '../../../views/UIViewManager';
import agoraManager from '../../agora/AgoraManager';
import TexasVideoMediaHelper from './TexasVideoMediaHelper';

const _plog = createLogger('ServerMessageSeated');

// Seated 1003
export async function Seated(data: ServerMessageSeated.AsObject, roomID: number, matchID: number) {
    _plog.info('seated', data, roomID, matchID);
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (data.status != 0) {
        _plog.debug('坐下失败, status:', data.status, CPErrorCode.ServerErrorDescription(data.status));
        viewManager.showToast(CPErrorCode.ServerErrorDescription(data.status));
        return;
    }
    // videoMaskId > 4 时客户端统一归为 1
    if (data.videoMaskId > 4) data.videoMaskId = 1;
    const seatData = roomData.seatsStateManager.setMySeat(data.recvSeatId, AnimateDisplayTypePosition.ToTarget);
    const mine = roomData.mine;
    seatData.userID = userStore.userRID;
    seatData.name = userStore.name;
    seatData.avatar = userStore.avatar;
    seatData.sex = userStore.sex;
    seatData.chip = data.chips;
    seatData.status = data.postStatus;
    // 货币桌,顺带更新下钱包
    if (roomData.basicInfo.bringInType == BringInMode.CURRENCY) {
        UserStoreUtils.updateUserWallet(data.accountChips, roomData.mine.currentWalletClubID);
    }
    seatData.roundBet = 0;
    seatData.handBet = 0;
    seatData.roundActioned = false;
    seatData.deposit = data.deposit;
    // 鱿鱼部分
    seatData.squidIn = data.squidIn;
    if (roomData.basicInfo.squidStatusEnabled) {
        mine.showSquidInButton = !data.squidIn;
    }
    if (data.squidTotalLimit > 0) {
        roomData.basicInfo.squidTotalLimit = data.squidTotalLimit;
    }
    seatData.squidRoundSeated = data.squidRoundSeated;
    // 会员
    seatData.subscriptionID = data.userSubscriptionId;
    seatData.videoMaskId = data.videoMaskId;
    // 留坐
    seatData.keepSeat(data.keepSeatDeadline > 0, data.keepSeatDeadline, Def.KeepSeatReason.KSR_TAKE_SEAT);
    // 我的部分
    mine.storeChips = data.storeChips;
    mine.totalChips = data.chips;
    mine.deposit = data.deposit;
    // 战绩面板：累加本人的总带入（对应 Unity TexasSituationController.SitDown）
    // report 里的玩家统一以随机ID(userRID)为 key,与 Roomers/SeatedOthers 的 userRid 同口径
    roomData.report.applySitDown(userStore.userRID, data.totalBringin || data.chips, data.deposit, userStore.name, userStore.avatar, data.recvSeatId);
    // 操作面板(不显示)
    mine.autoOperationType = AutoOperationTypeTexas.NO;
    mine.setRightAutoOpPannel(AutoOperationTypeTexas.NO, 0);
    PlayerStoreUtils.syncSeatPlayer(seatData, roomData);
    // 自己坐下 → 播放 Jackpot 开场动画（对应 pokerqueen Protocol_Holdem_Seated_Handler）
    roomData.basicInfo.jackpotStartAnimEmit();
    UserStoreUtils.preparePropList().catch(error => _plog.error('prepare prop list failed', error));
    if (roomData.basicInfo.antiCheatConfig) {
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
                mine.player.realShowMaskID = seatedConfig.openPowerSaving
                    ? mine.player.videoMaskId == 0
                        ? 1
                        : mine.player.videoMaskId
                    : 0;
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
            mine.remoteCameraEnabled = seatedConfig.enableCamera ? ButtonState.ON : ButtonState.HIDDEN;
            mine.remoteMicrophoneEnabled = ButtonState.ON;
            roomData.basicInfo.antiCheatConfig.start();
        } catch (e) {
            _plog.error('加入视频桌失败', e);
            viewManager.showToast('无法开启摄像头，请检查浏览器权限后重新入座');
        }
    }
}
