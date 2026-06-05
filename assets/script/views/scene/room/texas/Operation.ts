import { unBindEventsAll, autoBindEvents, bindEvent } from '../../../../core/decorator/DataBind';
import { traceClass, traceMethod } from '../../../../core/decorator/LogTrace';
import { OperatorMine } from '../../../../data/room/texas/model/Operator';
import TexasGameRoomDataPlayer from '../../../../data/room/texas/TexasGameRoomDataPlayer';
import TexasGameRoomDataPlayerMine from '../../../../data/room/texas/TexasGameRoomDataPlayerMine';
import TexasGameRoomDataSetting from '../../../../data/room/texas/TexasGameRoomDataSetting';
import { CPErrorCode } from '../../../../i18n/CPErrorCode';
import { ActionLimit, ActionShortcutLimit, Def } from '../../../../protobuf/holdem/define_pb';
import UIComponentBase from '../../../base/UIComponentBase';
import { UIComfirmDialogType } from '../../../dialog/confirm/UIConfirmDialog';
import viewManager from '../../../UIViewManager';
import ShiningPathTimer from '../../../widget/ShiningPathTimer';
import StepSlider from '../../../widget/StepSlider';
import TexasTableEvent from './events/TexasTableEvent';
import BetButtonsContainer, { caculatePotsBet } from './widget/BetButtonContainer';

const { ccclass, property } = cc._decorator;

@ccclass
@traceClass()
export default class Operation extends cc.Component {
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
    private _raiseAmount: number = 0;
    private _seatPlayer: TexasGameRoomDataPlayerMine = null;
    private _actionMap: Map<Def.ActionMap[keyof Def.ActionMap], ActionLimit.AsObject> = new Map();

    protected onLoad(): void {
        this.freeBetContainer.active = false;
        this.freeBetSilder.step = 0;
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
            this.freeBetContainer.active = true;
            this.freeBetInfoNode.active = false;
            this.freeBetSilder.progressColor = cc.Color.fromHEX(new cc.Color(), '#ffffff');
            this.freeBetSilder.setProgress(0);
        };
        this.btnRaise.node.on('click', this._onRaiseClicked, this);
    }

    private onFreeBetBgClicked:() => void = () => {
        this.freeBetContainer.active = false;
    }

    private _onRaiseClicked: () => void;

    private _onCheckClicked: () => void = () => {
        this.opTimer.stop();
        TexasTableEvent.DoAction(this._seatPlayer, Def.Action.CHECK, 0);
    };

    private _onCallClicked: () => void = () => {
        this.opTimer.stop();
        const action = this._actionMap.get(Def.Action.CALL)
        TexasTableEvent.DoAction(this._seatPlayer, Def.Action.CALL, action.min);
    };

    private _onAllinnClicked: () => void = () => {
        this.opTimer.stop();
        const action = this._actionMap.get(Def.Action.ALLIN)
        TexasTableEvent.DoAction(this._seatPlayer, Def.Action.ALLIN,action.min);
    };

    private _onStradleClicked: () => void = () => {
        this.opTimer.stop();
        const action = this._actionMap.get(Def.Action.STRADDLE)
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
        let action:Def.ActionMap[keyof Def.ActionMap] = Def.Action.RAISE;
        if (this._actionMap.has(Def.Action.BET)) {
            action = Def.Action.BET;
        }
        if (this.freeBetSilder.progress == 1) {
            action = Def.Action.ALLIN;
        }
        this.freeBetContainer.active = false;
        TexasTableEvent.DoAction(this._seatPlayer, action, this._raiseAmount);
    };

    public startOperation(param: OperatorMine, mine: TexasGameRoomDataPlayerMine): void {
        this.tracelog.info(param.actionLimitList);
        const seatPlayer = mine.roomData.seatsStateManager.getSeatPlayer(mine.seatNo);
        if (!seatPlayer) return;
        this._seatPlayer = mine;
        this.opTimer.startTimer({
            totalTime: param.totalOpDuration,
            elapsedTime: param.totalOpDuration - param.leftOpDuration,
            onComplete: () => {
                this.opTimer.stop();
            }
        });
        this._refreshUI(param.actionLimitList, param.roundBetEqual, seatPlayer);
        this._bindEventsAndRefresh();
    }

    private _refreshUI(actionsList: ActionLimit.AsObject[] ,roundBetEqual:number,  seatPlayer: TexasGameRoomDataPlayer) {
        this.btnAllIn.node.active = false;
        this.btnAllIn2.node.active = false;
        this.btnCall.node.active = false;
        this.btnStraddle.node.active = false;
        this.btnRaise.node.active = false;
        this.btnCheck.node.active = false;
        this.freeBetContainer.active = false;
        this._actionMap.clear();
        actionsList.map(v => this._actionMap.set(v.action, v));
        let minRaise = 0;
        actionsList.forEach(actionLimit => {
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
                this.btnStraddleAmount.string = this._seatPlayer.roomData.setting.showNumberWithShowBB(actionLimit.min);
                this.btnStraddle.node.active = true;
                break;
            case Def.Action.CALL:
                this.btnCallAmount.string = this._seatPlayer.roomData.setting.showNumberWithShowBB(actionLimit.min);
                this.btnCall.node.active = true;
                break;
            case Def.Action.RAISE:
            case Def.Action.BET:
                minRaise = actionLimit.min;
                this.btnRaise.node.active = true;
                const rangeAmount = actionLimit.max - actionLimit.min + 1; // Raise 是 ALLIN -1
                this.tracelog.debug('rangeAmount', rangeAmount, 'min', actionLimit.min, 'max',actionLimit.max, 'allin', this._actionMap.get(Def.Action.ALLIN).max);
                this.freeBetSilder.onValueChanged = progress => {
                    this.freeBetInfoNode.active = true;
                    this._raiseAmount = Math.min(rangeAmount + actionLimit.min, Math.round(progress * rangeAmount + actionLimit.min));
                    this.freeBetAmount.string = this._seatPlayer.roomData.setting.showNumberWithShowBB(this._raiseAmount);
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
        const btns = caculatePotsBet(roundBetEqual, minRaise, seatPlayer);
        this.shortCutContainer.refreshAndLayout(btns, seatPlayer.mine.roomData.setting);
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
        if (this._seatPlayer == null) return;
        autoBindEvents(this, { setting: this._seatPlayer.roomData.setting });
    }

}
