import { createLogger } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import userStore from '../../../data/user/UserStore';
import UserStoreUtils from '../../../data/user/UserStoreUtils';
import { AnimateDisplayTypeAction, AnimateDisplayTypeCards, AnimateDisplayTypePosition } from '../../../game/constant/AnimateDisplayType';
import { BringInMode } from '../../../game/constant/BringInChipsType';
import { CPErrorCode } from '../../../i18n/CPErrorCode';
import { Def } from '../../../protobuf/holdem/define_pb';
import { ServerMessageSeated } from '../../../protobuf/holdem/req_th_seated_pb';
import viewManager from '../../../views/UIViewManager';

const _plog = createLogger('ServerMessageSeated', 'debug');

// Seated 1003
export function Seated(data: ServerMessageSeated.AsObject, roomID: number, matchID: number) {
    _plog.info('seated', data, roomID, matchID);
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (data.status != 0) {
        _plog.debug('坐下失败, status:', data.status, CPErrorCode.ServerErrorDescription(data.status));
        viewManager.showToast(CPErrorCode.ServerErrorDescription(data.status));
        return;
    }
    _plog.info('自己坐下, videoMaskId:', data.videoMaskId);
    // videoMaskId > 4 时客户端统一归为 1
    if (data.videoMaskId > 4) data.videoMaskId = 1;
    const seatData = roomData.seatsStateManager.setMySeat(data.recvSeatId, AnimateDisplayTypePosition.ToTarget);
    const mine = roomData.mine;
    seatData.userID = userStore.userID;
    seatData.name = userStore.name;
    seatData.avatar = userStore.avatar;
    seatData.chip = data.chips;
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
    seatData.squidTotalLimit = data.squidTotalLimit;
    seatData.squidRoundSeated = data.squidRoundSeated;
    // 会员
    seatData.subscriptionID = data.userSubscriptionId;
    seatData.videoMaskId = data.videoMaskId;
    // 留坐
    seatData.keepSeat(data.keepSeatDeadline > 0, data.keepSeatDeadline, Def.KeepSeatReason.KSR_TAKE_SEAT);
    // 我的部分
    mine.storeChips = data.storeChips;
    mine.totalBringIn = data.totalBringin;
    mine.deposit = data.deposit;
    // this.game.mainPlayer.chips = data.chips;
    // this.game.mainPlayer.leavelChips = data.accountChips;
    // // GameCache.Instance.gold = data.accountChips;
    // GC.data.user.info.gold = data.accountChips;
    // this.game.mainPlayer.cacheStoreChips = data.storeChips;
    // this.game.mainPlayer.actionStatus = Def.Action.NONE;
    // this.game.mainPlayer.canPlayStatus = data.postStatus;
    // this.game.mainPlayer.IsAutoOp = false;
    // this.game.mainPlayer.ante = 0;
    // this.game.mainPlayer.anteNumber = 0;
    // this.game.mainPlayer.cards = this.game.GetEmptyHandCards();
    // this.game.mainPlayer.inSquid = rec.squidIn || false;
    // this.game.mainPlayer.squidRoundSeated = rec.squidRoundSeated || this.game.mainPlayer.inSquid;
    // this.game.mainPlayer.squidEscaped = false;
    // this.game.mainPlayer.squidCount = 0;
    // this.game.mainPlayer.videoMaskId = rec.videoMaskId || 0;
    // this.game.squidTotalLimit = rec.squidTotalLimit || this.game.squidTotalLimit;
    // this.game.mainPlayer.KeepSeatLeftTime = rec.keepSeatLeftTime;
    // if (rec.keepSeatLeftTime > 0) {
    //     UIComponent.Instance.Toast(`${i18nMgr.Get('UITexas_FriendtableapplyBringinTips001')}${rec.keepSeatLeftTime}s`);
    //     //记录这个需要申请审核的房间
    //     GameCache.Instance.BringCheckRoomIdMap[GameCache.Instance.room_id] = true;
    // }
    // let seat: Seat = null;
    // //服务器记录的id
    // let me_seat_id: number = this.game.GetLocalSeatID(rec.recvSeatId);
    // seat = this.game.GetSeatByLocalSeatID(me_seat_id);
    // if (null == seat) return;
    // //设置自己的座位id
    // this.game.mainPlayer.seatID = me_seat_id;
    // seat.Player = this.game.mainPlayer;
    // seat.isBank = false;
    // if (!this.game.mainPlayer.isParticipateInTheGame) {
    //     seat.UpdateWaiteNextTips(true);
    // }
    // this.game.HideWaitBlindBtn();
    // if (seat.Player.chips > this.game.GetMinPlayChips() && seat.seatID == this.game.mainPlayer.seatID) {
    //     if (this.game.mainPlayer.canPlayStatus == Def.CanPlayStatus.NEED_POST) {
    //         // 需要补盲
    //         this.game.ShowWaitBlindBtn();
    //         seat.FsmLogicComponent.SM.ChangeState(SeatWaitBlind.Instance);
    //     }
    //     // else {
    //     //     mSeat.FsmLogicComponent.SM.ChangeState(SeatWaitStart.Instance);
    //     // }
    // }
    // //翻转动画
    // seat.FsmLogicComponent.SM.ChangeState(SeatSitAnimation.Instance);
    // // todo 这里要搞十分十分十分酷炫的动画，把自己位移到最下方，0号位
    // //判断自己的方位id不在最下方,进行位移动画
    // // if (seat.ClientSeatId > 0) {
    // //     this.game.ResetSeatUIInfo(seat.ClientSeatId);
    // // }
    // this.game.ResetSeatUIInfo(seat.ClientSeatId);
    // this.game.uirc.refreshViewOnSitAndStandup(true);
    // if (this.game.squidEnabled) {
    //     this.game.RefreshSquidMarks();
    //     this.game.UpdateRoomDes();
    // }
    // if (GameCache.Instance.Vip == 1) {
    //     //ShowVipSeatDownTips(GameCache.Instance.nick);
    // }
    // 视频房间：坐下后渲染本地摄像头到自己的头像
    // if (GameCache.Instance._videoModel !== VideoModel.NONE) {
    //     const agora = AgoraManager.Instance;
    //     if (agora.isJoined) {
    //         // 频道已加入，直接渲染
    //         this.renderLocalVideoOnMySeat().then(ok => {
    //             if (!ok) {
    //                 ToastManager.Instance.createToast('无法开启摄像头，请检查浏览器权限后重新入座');
    //                 setTimeout(() => {
    //                     this.game.TexasGameUtils.LeaveRoom();
    //                 }, 3000);
    //             }
    //         });
    //     }
    //     // 频道还没加入时不弹 toast，等 JoinVideoChannelIfNeed 完成后自动补渲染
    // }
    //房间坐下时时添加firebase事件触发
    // Dictionary < string, string > paramMap = new Dictionary<string, string>();
    // paramMap.Add("game_type", GameCache.Instance.game_type + "");//游戏类型
    // paramMap.Add("roomId", GameCache.Instance.room_id + "");//房间id
    // paramMap.Add("roomName", GameCache.Instance.roomName + "");//房间名称
    // paramMap.Add("room_type", GameCache.Instance.room_type + "");//房间类型
    // GoogleFirebaseHelper.LevelStartEvent(paramMap);
    // //添加到appsFlyer统计进入金币房间消息
    // Dictionary < string, string > valuesMap = new Dictionary<string, string>();
    // valuesMap.Add("game_type", GameCache.Instance.game_type + "");//游戏类型
    // valuesMap.Add("roomId", GameCache.Instance.room_id + "");//房间id
    // valuesMap.Add("roomName", GameCache.Instance.roomName + "");//房间名称
    // valuesMap.Add("room_type", GameCache.Instance.room_type + "");//房间类型
    // AppsFlyerHelper.GameEnterEvent(valuesMap);
    // this.game.UpdateStartGameState();
    // // 刷新麦克风图标（自己坐下后更新静音/喇叭状态）
    // this._refreshAllMicIcons();
}
