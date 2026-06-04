import { unBindEventsAll, autoBindEvents, bindEvent } from "../../../../core/decorator/DataBind";
import TexasGameRoomDataPlayer from "../../../../data/room/texas/TexasGameRoomDataPlayer";
import TexasGameRoomDataPlayerMine from "../../../../data/room/texas/TexasGameRoomDataPlayerMine";
import TexasGameRoomDataSetting from "../../../../data/room/texas/TexasGameRoomDataSetting";
import { ActionLimit, ActionShortcutLimit, Def } from "../../../../protobuf/holdem/define_pb";
import UIComponentBase from "../../../base/UIComponentBase";
import StepSlider from "../../../widget/StepSlider";
import BetButtonsContainer from "./widget/BetButtonContainer";

export type OperationParam = {
    actionsList: ActionLimit.AsObject[];
    shortcutsList: ActionShortcutLimit.AsObject[];
};

class ActionDataInfo {

    // public ActionLimit actionLimit;//只用于raise 或 bet
    public constructor(
        public CallAmount: number = 0,
        public StraddleAmount: number = 0,
        public AllInAmount: number = 0,
        public actionLimit: ActionLimit.AsObject = null
    ) {}
}
const { ccclass, property } = cc._decorator;

@ccclass
export default class Operation extends cc.Component {
    @property({ type: cc.Node, displayName: "加注条大容器" })
    freeBetContainer: cc.Node = null;
    @property({ type: cc.Button, displayName: "FOLD" })
    btnFold: cc.Button = null;
    @property({ type: cc.Button, displayName: "CALL" })
    btnCall: cc.Button = null;
    @property({ type: cc.Button, displayName: "CHECK" })
    btnCheck: cc.Button = null;
    @property({ type: cc.Button, displayName: "RAISE" })
    btnRaise: cc.Button = null;
    @property({ type: cc.Button, displayName: "ALLIN" })
    btnAllIn: cc.Button = null;
    @property({ type: cc.Button, displayName: "自由加CONFIRM" })
    btnRaiseConfirm: cc.Button = null;
    @property({ type: StepSlider, displayName: "自由加注进度条" })
    freeBetSilder: StepSlider = null;
    @property({ type: BetButtonsContainer, displayName: "快捷按钮容器" })
    shortCutContainer: BetButtonsContainer = null;
    @property({ type: cc.Node, displayName: "自由下注信息" })
    freeBetInfoNode: cc.Node = null;
    @property({ type: cc.Label, displayName: "自由下注百分比" })
    freeBetPercent: cc.Label = null;
    @property({ type: cc.Label, displayName: "自由下注数额" })
    freeBetAmount: cc.Label = null;
    private _raiseAmount:number = 0;

    private _seatPlayer: TexasGameRoomDataPlayer = null;
    protected onLoad(): void {
        this.freeBetContainer.active =  false;
        this.freeBetSilder.step = 0;
        this.regiterTouchEvents()
    }

    private _onRaiseClicked: () => void;

    protected regiterTouchEvents(): void {
        // this.setButtonClick(this.buttonCall, this.onClickCall);
        // this.setButtonClick(this.buttonCheck, this.onClickCheck);
        // this.setButtonClick(this.buttonCall0, this.onClickCall0);
        // this.setButtonClick(this.buttonCall1, this.onClickCall1);
        // this.setButtonClick(this.buttonCall2, this.onClickCall2);
        // this.setButtonClick(this.buttonCallLeft, this.onClickCallLeft);
        // this.setButtonClick(this.buttonCallRight, this.onClickCallRight);
        // this.setButtonClick(this.buttonAllin, this.onClickAllin);
        // this.setButtonClick(this.Button_Straddle, this.onClickStraddle);
        // this.setButtonClick(this.buttonFreeCall, this.onClickFreeCall);
        // this.setButtonClick(this.buttonFreeCallConfirm, this.onClickFreeCallConfirm);
        // this.setButtonClick(this.imageFreeCallMask, this.onClickFreeCallMask);
        // this.setButtonClick(this.buttonFold, this.onClickFold);
        this._onRaiseClicked = () => {
            this.freeBetContainer.active = true;
            this.freeBetInfoNode.active = false;
            this.freeBetSilder.progressColor = cc.Color.fromHEX(new cc.Color(), '#ffffff');
            this.freeBetSilder.setProgress(0)
        }
        this.btnRaise.node.on('click', this._onRaiseClicked, this);
    }

    public initData(mine: TexasGameRoomDataPlayer, param: OperationParam): void {
        this._seatPlayer = mine;
        const actionMap: Map< Def.ActionMap[keyof Def.ActionMap], ActionLimit.AsObject> = new Map();
        param.actionsList.forEach(v => actionMap.set(v.action, v));
        if (actionMap.has(Def.Action.RAISE)) {
            const actionLimit = actionMap.get(Def.Action.RAISE)
            this.btnRaise.node.active = true;
            const rangeAmount = actionLimit.max - actionLimit.min + 1; // Raise 是 ALLIN -1
            this.freeBetSilder.onValueChanged = progress => {
                this._raiseAmount = Math.min(rangeAmount + actionLimit.min, Math.round(progress * rangeAmount + actionLimit.min));
                this.freeBetAmount.string = this._seatPlayer.roomData.setting.showNumberWithShowBB(this._raiseAmount);
                this.freeBetPercent.string = Math.min(100, Math.round(progress * 100)) + '%';
            };
            this.freeBetInfoNode.active = true;
        }
        this._bindEventsAndRefresh();
    }

    @bindEvent(TexasGameRoomDataSetting.SHOW_BB, 'setting')
    public updateShowAmount() {
        this.freeBetAmount.string = this._seatPlayer.roomData.setting.showNumberWithShowBB(this._raiseAmount);
    }

    protected onEnable(): void {
        this._bindEventsAndRefresh();
    }

    protected onDisable(): void {
        unBindEventsAll(this);
    }

    /**
     * 托管全自动事件激活绑定
     */
    private _bindEventsAndRefresh() {
        if (this._seatPlayer == null || this._seatPlayer.mine == null) return;
        autoBindEvents(this, { player: this._seatPlayer, setting: this._seatPlayer.roomData.setting, mine: this._seatPlayer.mine});
    }

    //点击显示滑竿
    private onClickFreeCall(): void {
        //this.showFreeCall(true);
    }


    // private onClickCall2(): void {
    //     this.callValue = this.callValue2;
    //     this.CheckOpt();
    // }

    // private onClickCall1(): void {
    //     this.callValue = this.callValue1;
    //     this.CheckOpt();
    // }

    // private onClickCall0(): void {
    //     this.callValue = this.callValue0;
    //     this.CheckOpt();
    // }

    // private onClickCallLeft(): void {
    //     this.callValue = this.callValueLeft;
    //     this.CheckOpt();
    // }

    // private onClickCallRight(): void {
    //     this.callValue = this.callValueRight;
    //     this.CheckOpt();
    // }

    // private onClickAllin(): void {
    //     GameCache.Instance.CurGame.OptAction(Def.Action.ALLIN, this.actionDataInfo.AllInAmount);
    // }

    // private onClickStraddle(): void {
    //     GameCache.Instance.CurGame.OptAction(Def.Action.STRADDLE, this.actionDataInfo.StraddleAmount);
    // }

    // private onClickCall(): void {
    //     GameCache.Instance.CurGame.OptAction(Def.Action.CALL, this.actionDataInfo.CallAmount);
    // }

    // private onClickCheck(): void {
    //     GameCache.Instance.CurGame.OptAction(Def.Action.CHECK, 0);
    //     this.isCountDown = false;
    // }

    // private onClickFold(): void {
    //     if (this.buttonCheck.activeInHierarchy) {
    //         //如果可以让牌，需要弹窗询问弃牌还是让牌
    //         this.isShowingDialog = true;
    //         UIComponent.open<UIConfirmDialogParam>(UIDefine.UIConfirmDialog, {
    //             this: this,
    //             // title = $"确定弃牌？",
    //             title: CPErrorCode.LanguageDescription(20037),
    //             // content = $"你可以让牌而不需要任何记分牌",
    //             content: CPErrorCode.LanguageDescription(20038),
    //             // contentCommit = "弃牌",
    //             commit: CPErrorCode.LanguageDescription(10047),
    //             // contentCancel = "让牌",
    //             cancel: CPErrorCode.LanguageDescription(10315),
    //             commit_click: () => {
    //                 GameCache.Instance.CurGame?.OptAction(Def.Action.FOLD, 0);
    //                 this.isCountDown = false;
    //             },
    //             cancel_click: () => {
    //                 GameCache.Instance.CurGame?.OptAction(Def.Action.CHECK, 0);
    //                 this.isCountDown = false;
    //             }
    //         });
    //         return;
    //     }
    //     GameCache.Instance.CurGame.OptAction(Def.Action.FOLD, 0);
    // }

    // /// <summary>
    // /// 自由加注
    // /// </summary>
    // private CheckOpt(): void {
    //     if (this.callValue <= 0) {
    //         return;
    //     }
    //     if (this.callValue >= GameCache.Instance.CurGame.mainPlayer.chips) {
    //         if (this.actionDataInfo.AllInAmount == 0) {
    //             if (GameUtil.JudgeIsPotLimitRoomPath(GameCache.Instance.room_type)) {
    //                 UIComponent.Instance.Toast(i18nMgr.Get('UIOperationComponentTips001'));
    //             } else {
    //                 UIComponent.Instance.Toast(i18nMgr.Get('UIOperationComponentTips002'));
    //             }
    //             return;
    //         }
    //         GameCache.Instance.CurGame.OptAction(Def.Action.ALLIN, this.actionDataInfo.AllInAmount);
    //         return;
    //     } else if (this.callValue >= this.actionDataInfo.actionLimit.max) {
    //         if (this.ActionMap.get(Def.Action.BET) != null) {
    //             GameCache.Instance.CurGame.OptAction(Def.Action.BET, this.actionDataInfo.actionLimit.max);
    //         } else {
    //             GameCache.Instance.CurGame.OptAction(Def.Action.RAISE, this.actionDataInfo.actionLimit.max);
    //         }
    //         return;
    //     }
    //     if (this.ActionMap.get(Def.Action.BET) != null) {
    //         GameCache.Instance.CurGame.OptAction(Def.Action.BET, this.callValue);
    //     } else {
    //         GameCache.Instance.CurGame.OptAction(Def.Action.RAISE, this.callValue);
    //     }
    //     this.isCountDown = false;
    // }

    // /// <summary>
    // /// 设置 n/m底池加注按钮
    // /// </summary>
    // private setTopCallButtons(): void {
    //     if (this.operationData == null) {
    //         return;
    //     }
    //     let totalChips: number = GameCache.Instance.CurGame.mainPlayer.chips;
    //     let numLeftStr: string = UITexasSettingComponent.GetCurQuickActionNum(0);
    //     let num0Str: string = UITexasSettingComponent.GetCurQuickActionNum(1);
    //     let num1Str: string = UITexasSettingComponent.GetCurQuickActionNum(2);
    //     let num2Str: string = UITexasSettingComponent.GetCurQuickActionNum(3);
    //     let numRightStr: string = UITexasSettingComponent.GetCurQuickActionNum(4);
    //     this.callValueLeft =
    //         numLeftStr == 'Allin'
    //             ? totalChips
    //             : numLeftStr == '0'
    //               ? 0
    //               : this.getPotMutiplierByQuickAction(UITexasSettingComponent.GetCurQuickActionNumValue(0));
    //     this.callValue0 = num0Str == 'Allin' ? totalChips : this.getPotMutiplierByQuickAction(UITexasSettingComponent.GetCurQuickActionNumValue(1));
    //     this.callValue1 = num1Str == 'Allin' ? totalChips : this.getPotMutiplierByQuickAction(UITexasSettingComponent.GetCurQuickActionNumValue(2));
    //     this.callValue2 = num2Str == 'Allin' ? totalChips : this.getPotMutiplierByQuickAction(UITexasSettingComponent.GetCurQuickActionNumValue(3));
    //     this.callValueRight =
    //         numRightStr == 'Allin'
    //             ? totalChips
    //             : numRightStr == '0'
    //               ? 0
    //               : this.getPotMutiplierByQuickAction(UITexasSettingComponent.GetCurQuickActionNumValue(4));
    //     this.textCallTitle0.string = 'POT';
    //     this.textCallTitle1.string = 'POT';
    //     this.textCallTitle2.string = 'POT';
    //     this.textCallPotLeft.string = UITexasSettingComponent.GetCurQuickActionNum(0);
    //     this.textCallPot0.string = UITexasSettingComponent.GetCurQuickActionNum(1);
    //     this.textCallPot1.string = UITexasSettingComponent.GetCurQuickActionNum(2);
    //     this.textCallPot2.string = UITexasSettingComponent.GetCurQuickActionNum(3);
    //     this.textCallPotRight.string = UITexasSettingComponent.GetCurQuickActionNum(4);
    //     //}
    //     // this.textCallPotValue0.string = this.callValue0 <= 0 ? "" : (this.callValue0 < totalChips ? StringHelper.getStringDiv100(this.callValue0) : "All in");
    //     // this.textCallPotValue1.string = this.callValue1 <= 0 ? "" : (this.callValue1 < totalChips ? StringHelper.getStringDiv100(this.callValue1) : "All in");
    //     // this.textCallPotValue2.string = this.callValue2 <= 0 ? "" : (this.callValue2 < totalChips ? StringHelper.getStringDiv100(this.callValue2) : "All in");
    //     // this.textCallPotValueLeft.string = this.callValueLeft <= 0 ? "" : (this.callValueLeft < totalChips ? StringHelper.getStringDiv100(this.callValueLeft) : "All in");
    //     // this.textCallPotValueRight.string = this.callValueRight <= 0 ? "" : (this.callValueRight < totalChips ? StringHelper.getStringDiv100(this.callValueRight) : "All in");
    //     this.UpdateAllValue();
    //     //展示加注按钮和自由加注按钮
    //     this.showRaiseButton();
    // }

    // UpdateAllValue() {
    //     let totalChips: number = GameCache.Instance.CurGame.mainPlayer.chips;
    //     let a = GameUtil.TransBetValue(this.callValue0);
    //     let b = GameUtil.TransBetValue(this.callValue1);
    //     let c = GameUtil.TransBetValue(this.callValue2);
    //     let d = GameUtil.TransBetValue(this.callValueLeft);
    //     let e = GameUtil.TransBetValue(this.callValueRight);
    //     this.textCallPotValue0.string = this.callValue0 <= 0 ? '' : this.callValue0 < totalChips ? a : 'All in';
    //     this.textCallPotValue1.string = this.callValue1 <= 0 ? '' : this.callValue1 < totalChips ? b : 'All in';
    //     this.textCallPotValue2.string = this.callValue2 <= 0 ? '' : this.callValue2 < totalChips ? c : 'All in';
    //     this.textCallPotValueLeft.string = this.callValueLeft <= 0 ? '' : this.callValueLeft < totalChips ? d : 'All in';
    //     this.textCallPotValueRight.string = this.callValueRight <= 0 ? '' : this.callValueRight < totalChips ? e : 'All in';
    // }

    // /// <summary>
    // /// 展示加注按钮和自由加注按钮
    // /// </summary>
    // private showRaiseButton(): void {
    //     this.buttonCall0.active = true;
    //     this.buttonCall1.active = true;
    //     this.buttonCall2.active = true;
    //     this.buttonCallLeft.active = UITexasSettingComponent.GetCurQuickActionNum(0) != '0';
    //     this.buttonCallRight.active = UITexasSettingComponent.GetCurQuickActionNum(4) != '0';
    //     this.buttonFreeCall.active = true;
    // }

    // /// <summary>
    // /// 获取快捷面板底池加注值
    // /// </summary>
    // /// <param name="quickActionStr"></param>
    // /// <returns></returns>
    // private getPotMutiplierByQuickAction(times: number): number {
    //     let valueTmp: number = this.actionDataInfo.actionLimit.min;
    //     if (this.actionDataInfo.actionLimit.action == Def.Action.ALLIN) {
    //         valueTmp = GameCache.Instance.CurGame.mainPlayer.chips;
    //     } else {
    //         if (GameUtil.JudgeIsPotLimitRoomPath(GameCache.Instance.room_type)) {
    //             if (
    //                 this.potMutiplier(times) >= GameCache.Instance.CurGame.mainPlayer.chips &&
    //                 this.potMutiplier(times) <= this.actionDataInfo.actionLimit.max
    //             ) {
    //                 valueTmp = GameCache.Instance.CurGame.mainPlayer.chips;
    //             } else {
    //                 if (this.potMutiplier(times) >= this.actionDataInfo.actionLimit.max) {
    //                     valueTmp = this.actionDataInfo.actionLimit.max;
    //                 } else if (this.potMutiplier(times) <= this.actionDataInfo.actionLimit.min) {
    //                     valueTmp = this.actionDataInfo.actionLimit.min;
    //                 } else {
    //                     valueTmp = this.potMutiplier(times);
    //                 }
    //             }
    //         } else {
    //             if (this.potMutiplier(times) >= GameCache.Instance.CurGame.mainPlayer.chips) {
    //                 valueTmp = GameCache.Instance.CurGame.mainPlayer.chips;
    //             } else {
    //                 if (this.potMutiplier(times) > this.actionDataInfo.actionLimit.min) {
    //                     valueTmp = this.potMutiplier(times);
    //                 } else {
    //                     valueTmp = this.actionDataInfo.actionLimit.min;
    //                 }
    //             }
    //             valueTmp =
    //                 this.potMutiplier(times) >= GameCache.Instance.CurGame.mainPlayer.chips
    //                     ? GameCache.Instance.CurGame.mainPlayer.chips
    //                     : this.potMutiplier(times) >= this.actionDataInfo.actionLimit.min
    //                       ? this.potMutiplier(times)
    //                       : this.actionDataInfo.actionLimit.min;
    //         }
    //     }
    //     if (valueTmp < GameCache.Instance.CurGame.mainPlayer.chips) {
    //         if (Math.ceil(valueTmp / this.calibrationWeight) * this.calibrationWeight >= this.actionDataInfo.actionLimit.max) {
    //             valueTmp = Math.floor(this.actionDataInfo.actionLimit.max / this.calibrationWeight) * this.calibrationWeight;
    //         } else {
    //             valueTmp = Math.ceil(valueTmp / this.calibrationWeight) * this.calibrationWeight;
    //         }
    //     }
    //     console.log(LN, 'times:' + times + '  valueTmp:' + valueTmp + '  potMutiplier(times):' + this.potMutiplier(times));
    //     return valueTmp;
    // }

    // // /// <summary>
    // // /// 通过Action 取得ActionLimit
    // // /// </summary>
    // // /// <param name="action"></param>
    // // /// <returns></returns>
    // // private getActionLimitByAction(action: Def.ActionMap[keyof Def.ActionMap]): ActionLimit.AsObject {
    // //     for (let actionLimit of this.operationData.actionsList) {
    // //         if (actionLimit.action == action) {
    // //             return actionLimit;
    // //         }
    // //     }
    // //     return null;
    // // }
    // /// <summary>
    // /// 计算 n/m池加注 数值
    // /// </summary>
    // /// <param name="times"></param>
    // /// <returns></returns>
    // private potMutiplier(times: number): number {
    //     return this.actionDataInfo.CallAmount + (GameCache.Instance.CurGame.alreadAnte + this.actionDataInfo.CallAmount) * times;
    // }

    // protected update(dt: number): void {
    //     if (!this._isCheckCountDown && !this._isFoldCountDown) {
    //         return;
    //     }
    //     if (this._isCheckCountDown) {
    //         this.optCurTime -= dt;
    //         this.imageCheckCountDown.fillRange = this.optCurTime / this.optTotalTime;
    //         if (this.imageCheckCountDown.fillRange <= 0.02) {
    //             GameCache.Instance.CurGame.HideBtnDelay(false);
    //         }
    //         if (this.imageCheckCountDown.fillRange <= 0) {
    //             this.isCountDown = false;
    //             this.Check_CountDown.active = false;
    //             this._isCheckCountDown = false;
    //             if (this.isShowingDialog) UIComponent.close(UIDefine.UIDialogComponent);
    //             this.isShowingDialog = false;
    //             //如需客户端倒计时结束发送让牌，在这里做
    //             if (!GameCache.Instance.CurGame.ClickAddTime) {
    //                 GameCache.Instance.CurGame.HideOperationPanel();
    //             }
    //         }
    //     }
    //     if (this._isFoldCountDown) {
    //         this.optCurTime -= dt;
    //         this.imageFoldCountDown.fillRange = this.optCurTime / this.optTotalTime;
    //         if (this.imageFoldCountDown.fillRange <= 0.02) {
    //             GameCache.Instance.CurGame.HideBtnDelay(false);
    //         }
    //         if (this.imageFoldCountDown.fillRange <= 0) {
    //             this.isCountDown = false;
    //             this.Fold_CountDown.active = false;
    //             this._isFoldCountDown = false;
    //             if (this.isShowingDialog) UIComponent.close(UIDefine.UIDialogComponent);
    //             this.isShowingDialog = false;
    //             //如需客户端倒计时结束发送弃牌，在这里做
    //             if (!GameCache.Instance.CurGame.ClickAddTime) {
    //                 GameCache.Instance.CurGame.HideOperationPanel();
    //             }
    //         }
    //     }
    //     if (this.optCurTime < 6.1 && this.optCurTime > 6 && !this.hadAlertSound) {
    //         //剩余5秒音效
    //         GC.sound.Play('sfx_action_alert');
    //         this.hadAlertSound = true;
    //     }
    // }

    // protected regiterDispatchEvent(): void {
    //     super.regiterDispatchEvent();
    //     this.listen(ProtocolCode.Protocol_Holdem_AddTime, this.HANDLER_REQ_ADD_TIME); // 操作加时
    // }

    // protected HANDLER_REQ_ADD_TIME(rec: ServerMessageAddTime.AsObject): void {
    //     if (rec == null) {
    //         return;
    //     }
    //     if (rec.status != 0) {
    //         GameCache.Instance.CurGame.ClickAddTime = false;
    //         return;
    //     }
    //     if (rec.status == 0) {
    //         this.optCurTime += rec.duration;
    //         this.optTotalTime = this.optCurTime;
    //         // 加时成功后，如果倒计时已停（归零等待加时响应），重新激活
    //         if (!this._isCheckCountDown && !this._isFoldCountDown) {
    //             // 根据 Check/Fold 按钮判断恢复哪个倒计时
    //             if (this.buttonCheck && this.buttonCheck.activeInHierarchy) {
    //                 this._isCheckCountDown = true;
    //                 this.Check_CountDown.active = true;
    //             } else {
    //                 this._isFoldCountDown = true;
    //                 this.Fold_CountDown.active = true;
    //             }
    //             this.isCountDown = true;
    //             this.hadAlertSound = false;
    //             this.imageCheckCountDown.fillRange = 1;
    //             this.imageFoldCountDown.fillRange = 1;
    //         }
    //         // 倒计时恢复后才能安全解除加时保护
    //         GameCache.Instance.CurGame.ClickAddTime = false;
    //     }
    // }

    // /// <summary>
    // /// 用于关闭操作面板时初始化按钮显示
    // /// </summary>
    // private hideAllOperationButton(): void {
    //     this.buttonCall0.active = false;
    //     this.buttonCall1.active = false;
    //     this.buttonCall2.active = false;
    //     this.buttonCallLeft.active = false;
    //     this.buttonCallRight.active = false;
    //     this.buttonFreeCall.active = false;
    //     this.buttonCheck.active = false;
    //     this.buttonCall.active = false;
    //     this.buttonAllin.active = false;
    //     this.slider.node.active = false;
    //     this.buttonFreeCallConfirm.active = false;
    //     this.Button_Straddle.active = false;
    //     this.Check_CountDown.active = false;
    //     this.Fold_CountDown.active = false;
    // }

    // lateClose(param?: any): void {
    //     super.lateClose();
    //     this.isCountDown = false;
    //     this._isCheckCountDown = false;
    //     this._isFoldCountDown = false;
    //     //this.imageCheckCountDown.node.active = false;
    //     //this.imageFoldCountDown.node.active = false;
    //     this.Check_CountDown.active = false;
    //     this.Fold_CountDown.active = false;
    //     this.hideAllOperationButton();
    // }

    // ///////////////////////////////滑动条////////////////////////////////
    // //设置比例值
    // private SetCalibrationWeight(): void {
    //     //this.calibrationWeight = GameCache.Instance.CurGame.smallBlind < 100 ? 10 : 100;
    //     this.slider_ab = GameCache.Instance.CurGame.smallBlind < 100 ? 10 : 100;
    //     console.log(LN, 'slider_ab', this.slider_ab);
    // }

    // //点击滑动条下确定按钮
    // onClickFreeCallConfirm() {
    //     console.log(LN, 'value :: ', this.slider.value);
    //     if (this.slider_allin) {
    //         this.callValue = this.actionDataInfo.AllInAmount;
    //     } else {
    //         this.callValue = this.slider.value;
    //     }
    //     this.CheckOpt();
    //     this.showFreeCall(false);
    // }

    // refreshSliderMaxLabel() {
    //     this.label_slider_max.string = GameUtil.TransBetValue(this.slider_max_value);
    // }

    // private show(actions: ActionLimit.AsObject[]): void {
    //     this.ActionMap.clear();
    //     actions.forEach(action => {
    //         this.ActionMap.set(action.action, action);
    //     });
    //     actions.forEach(action => {
    //         //this.ActionMap.set(action.action, action);
    //         switch (action.action) {
    //             case Def.Action.STRADDLE: //4
    //                 this.showStraddle(action);
    //                 break;
    //             case Def.Action.BET: //5
    //                 this.showBet(action);
    //                 break;
    //             case Def.Action.CALL: //6
    //                 this.showCall(action);
    //                 break;
    //             case Def.Action.FOLD: //7
    //                 this.showFold(action);
    //                 break;
    //             case Def.Action.CHECK: //8
    //                 this.showCheck(action);
    //                 break;
    //             case Def.Action.RAISE: // 9 筹码条上下拖动
    //                 this.showBet(action);
    //                 break;
    //             case Def.Action.ALLIN: //10
    //                 if (
    //                     this.ActionMap.get(Def.Action.BET) == null &&
    //                     this.ActionMap.get(Def.Action.RAISE) == null &&
    //                     this.ActionMap.get(Def.Action.CALL) != null
    //                 ) {
    //                     this.showAllInRaise(action);
    //                 } else if (
    //                     this.ActionMap.get(Def.Action.BET) == null &&
    //                     this.ActionMap.get(Def.Action.RAISE) == null &&
    //                     this.ActionMap.get(Def.Action.CHECK) != null
    //                 ) {
    //                     this.showAllInRaise(action);
    //                 } else {
    //                     this.showAllin(action);
    //                 }
    //                 break;
    //             default:
    //                 console.warn(LN, `cannot recognize action: ${action.action}`);
    //                 break;
    //         }
    //     });
    // }

    // //4 观
    // private showStraddle(action: ActionLimit.AsObject): void {
    //     console.log(LN, '+ showStraddle');
    //     this.Button_Straddle.active = true;
    //     this.actionDataInfo.StraddleAmount = action.min;
    //     this.Text_Straddle.string = StringHelper.GetLongString(action.min);
    // }

    // //5 , 9
    // private showBet(action: ActionLimit.AsObject): void {
    //     console.log(LN, '+ showBet');
    //     this.buttonFreeCall.active = true;
    //     this.actionDataInfo.actionLimit = action;
    //     //相同
    //     if (action.max == action.min) {
    //         this.slider_min_value = action.max;
    //         this.slider_max_value = action.max;
    //         this.slider.show({
    //             min_value: this.slider_min_value,
    //             max_value: this.slider_max_value,
    //             step: 0,
    //             change: this.sliderChange,
    //             own: this,
    //             scale: 100
    //         });
    //         this.slider_allin = true;
    //     } else {
    //         if (GameUtil.JudgeIsPotLimitRoomPath(GameCache.Instance.room_type)) {
    //             this.slider_max_value = action.max;
    //         } else {
    //             this.slider_max_value = action.max + 1;
    //         }
    //         this.slider_min_value = action.min;
    //         if (this.slider_min_value >= this.slider_max_value) {
    //             this.slider.show({
    //                 min_value: this.slider_max_value,
    //                 max_value: this.slider_max_value,
    //                 step: 0,
    //                 change: this.sliderChange,
    //                 own: this,
    //                 scale: 100
    //             });
    //             this.slider_allin = true;
    //         } else {
    //             this.slider.show({
    //                 min_value: this.slider_min_value,
    //                 max_value: this.slider_max_value,
    //                 step: this.slider_ab,
    //                 change: this.sliderChange,
    //                 own: this,
    //                 scale: 100
    //             });
    //             this.slider_allin = false;
    //         }
    //     }
    //     this.refreshSliderMaxLabel();
    //     //this.sliderChange(min_value);
    //     console.log(LN, ' >> slider = > ', this.slider_min_value, this.slider_max_value, this.slider_ab);
    //     this.setTopCallButtons();
    // }

    // // 6
    // private showCall(action: ActionLimit.AsObject): void {
    //     console.log(LN, '+ showCall');
    //     this.buttonCall.active = true;
    //     this.actionDataInfo.CallAmount = action.min;
    //     this.textCall.string = StringHelper.GetLongString(action.min);
    // }

    // // 7
    // private showFold(action: ActionLimit.AsObject): void {
    //     console.log(LN, '+ showFold');
    //     this.buttonFold.active = true;
    //     if (this.ActionMap.get(Def.Action.CHECK) != null) {
    //         return;
    //     }
    //     this._isFoldCountDown = true;
    //     this.Fold_CountDown.active = true;
    //     this.imageFoldCountDown.fillRange = 1;
    // }

    // // 8
    // private showCheck(action: ActionLimit.AsObject): void {
    //     console.log(LN, '+ showCheck');
    //     this.buttonCheck.active = true;
    //     //this.imageCheckCountDown.node.active = true;
    //     this._isCheckCountDown = true;
    //     this.Check_CountDown.active = true;
    //     this.imageCheckCountDown.fillRange = 1;
    // }

    // //10-1
    // private showAllInRaise(action: ActionLimit.AsObject): void {
    //     console.log(LN, '+ showRaise');
    //     this.buttonFreeCall.active = true;
    //     this.actionDataInfo.AllInAmount = action.min;
    //     this.actionDataInfo.actionLimit = action;
    //     this.slider_max_value = action.max;
    //     this.refreshSliderMaxLabel();
    //     this.setTopCallButtons();
    //     this.slider_allin = true;
    //     this.slider.show({
    //         min_value: action.max,
    //         max_value: action.max,
    //         step: 0,
    //         change: this.sliderChange,
    //         own: this,
    //         scale: 100
    //     });
    // }

    // //10-2
    // private showAllin(actionLimit: ActionLimit.AsObject) {
    //     console.log(LN, '+ showAllin');
    //     this.buttonAllin.active = true;
    //     this.actionDataInfo.AllInAmount = actionLimit.min;
    // }

    // //显示或者隐藏 自由加注条
    // private showFreeCall(show: boolean): void {
    //     if (show) {
    //         this.imageFreeCallMask.active = true;
    //         //this.sliderFreeCall.node.active = true;
    //         this.slider.node.active = true;
    //         this.buttonFreeCallConfirm.active = true;
    //         this.buttonFreeCall.active = false;
    //         this.buttonCall0.active = false;
    //         this.buttonCall1.active = false;
    //         this.buttonCall2.active = false;
    //         this.buttonCallLeft.active = false;
    //         this.buttonCallRight.active = false;
    //         this.slider.reset();
    //         this.refreshSliderValueStr();
    //     } else {
    //         this.imageFreeCallMask.active = false;
    //         //this.sliderFreeCall.node.active = false;
    //         this.slider.node.active = false;
    //         this.buttonFreeCallConfirm.active = false;
    //         this.buttonFreeCall.active = true;
    //         this.showRaiseButton();
    //     }
    // }
}
