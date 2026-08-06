import { Code } from '@silenthill/agreement-web';
import { autoBindEvents, bindEvent, unBindEventsAll } from '../../../core/decorator/DataBind';
import { traceClass } from '../../../core/decorator/LogTrace';
import TexasGameRoomDataPlayerMine from '../../../data/room/texas/TexasGameRoomDataPlayerMine';
import { StringHelper } from '../../../helper/StringHelper';
import { CPErrorCode } from '../../../i18n/CPErrorCode';
import ProtocolAgency from '../../../net/websocket/ProtocolAgency';
import UIComponentBaseDialog from '../../base/UIComponentDialogBase';
import viewManager from '../../UIViewManager';
import StepSlider from '../../widget/StepSlider';

const { ccclass, menu, property } = cc._decorator;

export interface UIBringOutParam {
    RoomPlayer: TexasGameRoomDataPlayerMine;
}

@ccclass
@menu('Dialog/UIBringOut')
@traceClass()
export default class UIBringOut extends UIComponentBaseDialog<UIBringOutParam> {
    @property({ type: cc.Label, displayName: '带出金额文本' })
    private amountLabel: cc.Label = null;
    @property({ type: StepSlider, displayName: '带出金额滑块' })
    private amountSlider: StepSlider = null;
    @property({ type: cc.Button, displayName: '确认带出按钮' })
    private commitButton: cc.Button = null;
    @property({ type: cc.Button, displayName: '关闭按钮' })
    private closeButton: cc.Button = null;
    private _roomPlayer: TexasGameRoomDataPlayerMine = null;
    private _amount: number = 0;
    private _submitting: boolean = false;

    protected onLoad(): void {
        this.commitButton.node.on('click', this.onCommitClicked, this);
        this.closeButton.node.on('click', this.onCloseClicked, this);
    }

    public initialize(param: UIBringOutParam): void {
        this._roomPlayer = param.RoomPlayer;
        this._submitting = false;
        autoBindEvents(this, { mine: this._roomPlayer });
        const minimumOnTable = this._roomPlayer.roomData.basicInfo.retainMinRate * this._roomPlayer.roomData.basicInfo.sbante.sb * 2;
        const maximumAmount = Math.max(0, this._roomPlayer.player.chip - minimumOnTable);
        const minimumAmount = Math.min(minimumOnTable, maximumAmount);
        const enabled = maximumAmount > 0;
        this.commitButton.interactable = enabled;
        const minAmount = enabled ? minimumAmount : 0;
        const maxAmount = enabled ? maximumAmount : 0;
        const rangeAmount = maxAmount - minAmount;
        const stepAmount = this._roomPlayer.roomData.basicInfo.sbante.sb * 2;
        let step = 1;
        if (rangeAmount > 0) {
            step = rangeAmount > stepAmount ? 1 / (rangeAmount / stepAmount) : 0;
        }
        this.amountSlider.step = Math.round(step * 10000) / 10000;
        this.amountSlider.onValueChanged = (progress: number) => {
            const amount = Math.min(maxAmount, Math.round((progress * rangeAmount) / stepAmount) * stepAmount + minAmount);
            this._amount = amount;
            this.amountLabel.string = StringHelper.GetLongString(amount);
        };
        this.amountSlider.setProgress(0);
    }

    public override close(): void {
        if (this._roomPlayer) this._roomPlayer.bringOutDialogOpen = false;
        super.close();
    }

    protected onDisable(): void {
        unBindEventsAll(this);
        super.onDisable();
    }

    @bindEvent(TexasGameRoomDataPlayerMine.STORE_CHIPS_RESULT, { dataSource: 'mine', initIgnore: true })
    private onStoreChipsResult(status: number): void {
        if (status !== 0) {
            this._submitting = false;
            this.commitButton.interactable = true;
            viewManager.showToast(CPErrorCode.ServerErrorDescription(status));
            return;
        }
        this.close();
    }

    private onCommitClicked(): void {
        if (this._amount === 0 || this._submitting) return;
        this._submitting = true;
        this.commitButton.interactable = false;
        ProtocolAgency.Send({
            code: Code.MSG_D_STORE_CHIPS,
            roomID: this._roomPlayer.roomData.roomID,
            matchID: this._roomPlayer.roomData.matchID,
            body: {
                room: {
                    roomId: this._roomPlayer.roomData.roomID,
                    matchId: this._roomPlayer.roomData.matchID
                },
                store: this._amount
            }
        });
    }

    private onCloseClicked(): void {
        this.close();
    }
}
