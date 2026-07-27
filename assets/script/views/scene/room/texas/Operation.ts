import { ActionLimit, Def } from '@silenthill/agreement-web';
import { autoBindEvents, bindEvent, unBindEventsAll } from '../../../../core/decorator/DataBind';
import { traceClass, traceMethod } from '../../../../core/decorator/LogTrace';
import soundManager, { SoundEffectKey } from '../../../../core/SoundManager';
import { OperatorMine, OpertionType } from '../../../../data/room/texas/model/Operator';
import texasGamePersonalSettings, { ShortCut, TexasGamePersonalSettings } from '../../../../data/room/texas/TexasGamePersonalSettings';
import TexasGameRoomDataPlayerMine from '../../../../data/room/texas/TexasGameRoomDataPlayerMine';
import { AutoOperationTypeTexas } from '../../../../game/constant/AutoOpertaionType';
import { DiamondConfigType } from '../../../../game/constant/DiamondConfigType';
import { CPErrorCode } from '../../../../i18n/CPErrorCode';
import { UIComfirmDialogType } from '../../../dialog/confirm/UIConfirmDialog';
import viewManager from '../../../UIViewManager';
import UIViewUtil from '../../../util/UIViewUtil';
import ShiningPathTimer from '../../../widget/ShiningPathTimer';
import StepSlider from '../../../widget/StepSlider';
import TexasTableEvent from './events/TexasTableEvent';
import AutoOperation from './operations/AutoOperation';
import BetButtonsContainer, { caculatePotsBet } from './widget/BetButtonContainer';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@traceClass()
@menu('Scene/Room/Texas/Operation')
export default class Operation extends cc.Component {
    @property({ type: cc.Node, displayName: '真正根节点,保证根节点永远不会Disable' })
    rootNode: cc.Node = null;
    @property({ type: ShiningPathTimer, displayName: '倒计时' })
    opTimer: ShiningPathTimer = null;
    @property({ type: cc.Button, displayName: '自由下注背景' })
    freeBetBg: cc.Button = null;
    @property({ type: cc.Node, displayName: '加注条大容器' })
    freeBetContainer: cc.Node = null;
    @property({ type: cc.Button, displayName: 'STRADDLE' })
    btnStraddle: cc.Button = null;
    @property({ type: cc.Label, displayName: 'STRADDLE Amount' })
    btnStraddleAmount: cc.Label = null;
    @property({ type: cc.Button, displayName: 'FOLD' })
    btnFold: cc.Button = null;
    @property({ type: cc.Button, displayName: 'CALL' })
    btnCall: cc.Button = null;
    @property({ type: cc.Label, displayName: 'CALL Amount' })
    btnCallAmount: cc.Label = null;
    @property({ type: cc.Button, displayName: 'CHECK' })
    btnCheck: cc.Button = null;
    @property({ type: cc.Button, displayName: 'RAISE' })
    btnRaise: cc.Button = null;
    @property({ type: cc.Button, displayName: 'ALLIN' })
    btnAllIn: cc.Button = null;
    @property({ type: cc.Button, displayName: 'ALLIN2' })
    btnAllIn2: cc.Button = null;
    @property({ type: cc.Button, displayName: '自由加CONFIRM' })
    btnRaiseConfirm: cc.Button = null;
    @property({ type: StepSlider, displayName: '自由加注进度条' })
    freeBetSilder: StepSlider = null;
    @property({ type: BetButtonsContainer, displayName: '快捷按钮容器' })
    shortCutContainer: BetButtonsContainer = null;
    @property({ type: cc.Node, displayName: '自由下注信息' })
    freeBetInfoNode: cc.Node = null;
    @property({ type: cc.Label, displayName: '自由下注百分比' })
    freeBetPercent: cc.Label = null;
    @property({ type: cc.Label, displayName: '自由下注数额' })
    freeBetAmount: cc.Label = null;
    @property({ type: cc.Node, displayName: '自动操作面板' })
    private autoOpPannelNode: cc.Node = null!;
    @property({ type: cc.Node, displayName: '位置节点UI' })
    private uiNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '位置节点freeCall' })
    private freeCallNode: cc.Node = null;
    @property({ type: cc.Button, displayName: '加时按钮' })
    private addTimeButton: cc.Button = null;
    @property({ type: cc.Label, displayName: '加时Cost' })
    private addTimeCost: cc.Label = null;
    private _delayTimes = 0;
    private _autoOpPanel: AutoOperation = null;
    private _raiseAmount: number = 0;
    private _seatPlayer: TexasGameRoomDataPlayerMine = null;
    private _actionMap: Map<Def.ActionMap[keyof Def.ActionMap], ActionLimit.AsObject> = new Map();
    private _tempData: any = null!;

    protected onLoad(): void {
        this.freeBetContainer.active = false;
        this.freeBetSilder.step = 0;
        //自动操作面板
        this._autoOpPanel = this.autoOpPannelNode.children[0].getComponent(AutoOperation);
        this.regiterTouchEvents();
    }

    protected regiterTouchEvents(): void {
        this.btnFold.node.on('click', this._onFoldClicked, this);
        this.btnCheck.node.on('click', this._onCheckClicked, this);
        this.btnCall.node.on('click', this._onCallClicked, this);
        this.btnAllIn.node.on('click', this._onAllinnClicked, this);
        this.btnAllIn2.node.on('click', this._onAllinnClicked, this);
        this.btnStraddle.node.on('click', this._onStradleClicked, this);
        this.btnRaiseConfirm.node.on('click', this._onFreeBetConfirmed, this);
        this.freeBetBg.node.on('click', this.onFreeBetBgClicked, this);
        this._onRaiseClicked = () => {
            this.btnRaise.node.active = false;
            this.freeBetContainer.active = true;
            this.freeBetInfoNode.active = false;
            this.freeBetSilder.progressColor = cc.Color.fromHEX(new cc.Color(), '#ffffff');
            this.freeBetSilder.setProgress(0);
        };
        this.btnRaise.node.on('click', this._onRaiseClicked, this);
        this.addTimeButton.node.on('click', this._onAddTimeClicked, this);
    }

    private onFreeBetBgClicked: () => void = () => {
        this.freeBetContainer.active = false;
    };
    private _onAddTimeClicked: () => void = () => {
        TexasTableEvent.AddTime(this._seatPlayer, this._delayTimes);
    };
    private _onRaiseClicked: () => void;
    private _onCheckClicked: () => void = () => {
        this.opTimer.stop();
        TexasTableEvent.DoAction(this._seatPlayer, Def.Action.CHECK, 0);
    };
    private _onCallClicked: () => void = () => {
        this.opTimer.stop();
        const action = this._actionMap.get(Def.Action.CALL);
        TexasTableEvent.DoAction(this._seatPlayer, Def.Action.CALL, action.min);
    };
    private _onAllinnClicked: () => void = () => {
        this.opTimer.stop();
        const action = this._actionMap.get(Def.Action.ALLIN);
        TexasTableEvent.DoAction(this._seatPlayer, Def.Action.ALLIN, action.min);
    };
    private _onStradleClicked: () => void = () => {
        this.opTimer.stop();
        const action = this._actionMap.get(Def.Action.STRADDLE);
        TexasTableEvent.DoAction(this._seatPlayer, Def.Action.STRADDLE, action.min);
    };

    private _onFoldClicked(): void {
        if (this._actionMap.has(Def.Action.CHECK)) {
            //如果可以让牌，需要弹窗询问弃牌还是让牌
            viewManager.openDialog('ConfirmOrNotice', {
                diaolgType: UIComfirmDialogType.CONFIRM,
                title: CPErrorCode.LanguageDescription(20037),
                // content = $"你可以让牌而不需要任何记分牌",
                content: CPErrorCode.LanguageDescription(20038),
                // contentCommit = "弃牌",
                commit: CPErrorCode.LanguageDescription(10047),
                // contentCancel = "让牌",
                cancel: CPErrorCode.LanguageDescription(10315),
                commit_click: () => {
                    TexasTableEvent.DoAction(this._seatPlayer, Def.Action.FOLD, 0);
                    this.opTimer.stop();
                },
                cancel_click: () => {
                    TexasTableEvent.DoAction(this._seatPlayer, Def.Action.CHECK, 0);
                    this.opTimer.stop();
                }
            });
            return;
        }
        TexasTableEvent.DoAction(this._seatPlayer, Def.Action.FOLD, 0);
    }

    private _onFreeBetConfirmed: () => void = () => {
        this.opTimer.stop();
        let action: Def.ActionMap[keyof Def.ActionMap] = Def.Action.RAISE;
        if (this._actionMap.has(Def.Action.BET)) {
            action = Def.Action.BET;
        }
        if (this.freeBetSilder.progress == 1) {
            action = Def.Action.ALLIN;
        }
        this.freeBetContainer.active = false;
        TexasTableEvent.DoAction(this._seatPlayer, action, this._raiseAmount);
    };

    public initData(mine: TexasGameRoomDataPlayerMine) {
        this._seatPlayer = mine;
        this._autoOpPanel.initData(mine);
        this._bindEventsAndRefresh();
    }

    public adjustPostion(targeNode: cc.Node, pos: cc.Vec3, scale: number) {
        this.uiNode.scale = scale;
        this.freeCallNode.scale = scale;
        const tpos = UIViewUtil.caculatePostion(this.uiNode, targeNode, pos);
        const height = 210 * scale;
        tpos.y += height;
        this.uiNode.setPosition(tpos);
        const tpos2 = UIViewUtil.caculatePostion(this.freeCallNode, targeNode, pos);
        const height2 = 910 * scale;
        tpos2.y += height2;
        this.freeCallNode.setPosition(tpos2);
        this._autoOpPanel.adjustPostion(targeNode, pos, scale);
        this._autoOpPanel.node.active = true;
    }

    private async _refreshAddTime(alreadlyDelayTimes: number): Promise<void> {
        this._delayTimes = alreadlyDelayTimes;
        const cost = await this._seatPlayer.roomData.basicInfo.getDiamondPrice(alreadlyDelayTimes, DiamondConfigType.DiamondConfigTypeAddTime);
        this.addTimeCost.string = '' + cost;
    }

    private _refreshUI(roundBetEqual: number) {
        this.btnAllIn.node.active = false;
        this.btnAllIn2.node.active = false;
        this.btnCall.node.active = false;
        this.btnStraddle.node.active = false;
        this.btnRaise.node.active = false;
        this.btnCheck.node.active = false;
        this.freeBetContainer.active = false;
        let minRaise = 0;
        this._actionMap.forEach(actionLimit => {
            switch (actionLimit.action) {
                case Def.Action.CHECK:
                    // 有 call的前提下不显示
                    if (this._actionMap.has(Def.Action.CALL)) break;
                    this.btnCheck.node.active = true;
                    break;
                case Def.Action.FOLD:
                    this.btnFold.node.active = true;
                    break;
                case Def.Action.STRADDLE:
                    this.btnStraddleAmount.string = this._seatPlayer.roomData.basicInfo.showNumberWithShowBB(actionLimit.min);
                    this.btnStraddle.node.active = true;
                    break;
                case Def.Action.CALL:
                    this.btnCallAmount.string = this._seatPlayer.roomData.basicInfo.showNumberWithShowBB(actionLimit.min);
                    this.btnCall.node.active = true;
                    break;
                case Def.Action.RAISE:
                case Def.Action.BET:
                    minRaise = actionLimit.min;
                    this.btnRaise.node.active = true;
                    const rangeAmount = actionLimit.max - actionLimit.min + 1; // Raise 是 ALLIN -1
                    this.tracelog.debug(
                        'rangeAmount',
                        rangeAmount,
                        'min',
                        actionLimit.min,
                        'max',
                        actionLimit.max,
                        'allin',
                        this._actionMap.get(Def.Action.ALLIN).max
                    );
                    this.freeBetSilder.onValueChanged = progress => {
                        this.freeBetInfoNode.active = true;
                        this._raiseAmount = Math.min(rangeAmount + actionLimit.min, Math.round(progress * rangeAmount + actionLimit.min));
                        this.freeBetAmount.string = this._seatPlayer.roomData.basicInfo.showNumberWithShowBB(this._raiseAmount);
                        this.freeBetPercent.string = Math.min(100, Math.round(progress * 100)) + '%';
                    };
                    break;
                case Def.Action.ALLIN:
                    // 如果已经有RAISE按钮了就让他自己拉不出现
                    if (this._actionMap.has(Def.Action.RAISE) || this._actionMap.has(Def.Action.BET)) {
                        break;
                    }
                    // 如果已经有check/call 则换个地方显示，这时候必然没有RAISE
                    if (this._actionMap.has(Def.Action.CHECK) || this._actionMap.has(Def.Action.CALL)) {
                        this.btnAllIn2.node.active = true;
                        break;
                    }
                    this.btnAllIn.node.active = true;
                    break;
            }
        });
        this._tempData = {
            roundBetEqual,
            minRaise
        };
        this.tracelog.debug(texasGamePersonalSettings.shortCuts.length);
        const btns = caculatePotsBet(texasGamePersonalSettings.shortCuts, roundBetEqual, minRaise, this._seatPlayer.player);
        this.shortCutContainer.refreshAndLayout(btns, this._seatPlayer.roomData.basicInfo);
    }

    @bindEvent(TexasGamePersonalSettings.SHORTCUTS_CHANGGE, 'setting')
    @traceMethod()
    public onShortCutsChange(shortCuts: ShortCut[]) {
        if (!this.rootNode.active) return;
        if (this._tempData == null) return;
        const btns = caculatePotsBet(shortCuts, this._tempData.roundBetEqual, this._tempData.minRaise, this._seatPlayer.player);
        this.shortCutContainer.refreshAndLayout(btns, this._seatPlayer.roomData.basicInfo);
    }

    @bindEvent(TexasGamePersonalSettings.SHOW_BB, 'setting')
    public updateShowAmount() {
        this.freeBetAmount.string = this._seatPlayer.roomData.basicInfo.showNumberWithShowBB(this._raiseAmount);
    }

    @bindEvent(TexasGameRoomDataPlayerMine.PREPARE_OPERATION_MINE, 'mine')
    @traceMethod()
    private onPrepareActionMine(oper: OperatorMine) {
        if (!oper || oper.opType != OpertionType.NORMAL) {
            this.rootNode.active = false;
            this._tempData = null;
            this.node.stopAllActions();
            return;
        }
        this._actionMap.clear();
        oper.actionLimitList.map(v => this._actionMap.set(v.action, v));
        let actionLimit;
        // 选了自动 则自动操作(不做声音提示)
        if (this._seatPlayer.autoOperationType != AutoOperationTypeTexas.NO) {
            switch (this._seatPlayer.autoOperationType) {
                case AutoOperationTypeTexas.AUTO_FOLD:
                    // 有check优先Check
                    if (this._actionMap.has(Def.Action.CHECK)) {
                        TexasTableEvent.DoAction(this._seatPlayer, Def.Action.CHECK, 0);
                        break;
                    }
                    TexasTableEvent.DoAction(this._seatPlayer, Def.Action.FOLD, 0);
                    break;
                case AutoOperationTypeTexas.AUTO_CHECK:
                    TexasTableEvent.DoAction(this._seatPlayer, Def.Action.CHECK, 0);
                    break;
                case AutoOperationTypeTexas.AUTO_CALL:
                    actionLimit = this._actionMap.get(Def.Action.CALL);
                    if (!actionLimit) {
                        this.tracelog.error('no auto allin option');
                        break;
                    }
                    TexasTableEvent.DoAction(this._seatPlayer, Def.Action.CALL, actionLimit.min);
                    break;
                case AutoOperationTypeTexas.AUTO_ALLIN:
                    actionLimit = this._actionMap.get(Def.Action.ALLIN);
                    if (!actionLimit) {
                        this.tracelog.error('no auto allin option');
                        break;
                    }
                    TexasTableEvent.DoAction(this._seatPlayer, Def.Action.ALLIN, actionLimit.min);
                    break;
            }
            //自动操作过以后立刻重置
            this._seatPlayer.autoOperationType = AutoOperationTypeTexas.NO;
            return;
        }
        // 手动操作(声音提示)
        soundManager.playEffect(SoundEffectKey.MyTurn);
        // 麦序模式
        if (this._seatPlayer.roomData.basicInfo.antiCheatConfig && this._seatPlayer.roomData.basicInfo.antiCheatConfig.isOrderMode) {
            this._seatPlayer.localCameraEnabled = true;
            this._seatPlayer.localMicrophoneEnabled = true;
        }
        // 先把自动操作面板隐藏
        this._seatPlayer.setRightAutoOpPannel(AutoOperationTypeTexas.NO, 0);
        this.rootNode.active = true;
        this.opTimer.startTimer({
            totalTime: oper.totalOpDuration,
            stepInterval: 1,
            onStep: leftTime => {
                // 剩下 1/3 时间提醒下
                if (leftTime == Math.floor(oper.totalOpDuration / 3)) {
                    soundManager.playEffect(SoundEffectKey.ActionAlert);
                }
                if (leftTime == 3) {
                    soundManager.playEffect(SoundEffectKey.CD3S);
                }
            },
            elapsedTime: oper.elapsedTime,
            onComplete: () => {
                this.opTimer.stop();
            }
        });
        this._delayTimes = oper.alreadyDelayTImes;
        this._refreshUI(oper.roundBetEqual);
        this._refreshAddTime(this._delayTimes);
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
        if (this._seatPlayer == null) return;
        autoBindEvents(this, { mine: this._seatPlayer, setting: this._seatPlayer.roomData.setting });
    }
}
