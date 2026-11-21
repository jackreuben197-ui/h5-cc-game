import { autoBindEvents, bindEvent, unBindEventsAll } from '../../../../../core/decorator/DataBind';
import texasGamePersonalSettings, { TexasGamePersonalSettings } from '../../../../../data/room/texas/TexasGamePersonalSettings';
import TexasGameRoomDataBasic from '../../../../../data/room/texas/TexasGameRoomDataBasic';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('Scene/Room/Texas/Widget/BetButton')
export default class BetButton extends cc.Component {
    @property({ type: cc.Label, displayName: '显示标签(如 1/2)' })
    showLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: '金额标签(如 666K)' })
    amountLabel: cc.Label = null;
    @property({ type: cc.Button, displayName: '按钮实体' })
    realButton: cc.Button = null!;
    private onClickCallback: () => void = null;
    private pressedCallback: () => void = null;
    private _amountNum: number = 0;
    private _basicInfo: TexasGameRoomDataBasic;

    onLoad() {
        this.realButton.node.on(cc.Node.EventType.TOUCH_START, this.onPressStarted, this);
        this.realButton.node.on('click', this.onButtonClicked, this);
    }

    public initData(ratioStr: string, amountNum: number, basicInfo: TexasGameRoomDataBasic, callback: () => void) {
        this._amountNum = amountNum;
        this._basicInfo = basicInfo;
        this.onClickCallback = callback;
        if (this.showLabel) this.showLabel.string = ratioStr;
        if (this.amountLabel) this.amountLabel.string = this._basicInfo.showNumberWithShowBB(this._amountNum);
        this._bindAndRefresh();
    }

    private _bindAndRefresh() {
        if (!this._basicInfo) return;
        autoBindEvents(this, { setting: texasGamePersonalSettings });
    }

    protected onEnable(): void {
        this._bindAndRefresh();
    }

    protected onDisable(): void {
        this.pressedCallback = null;
        unBindEventsAll(this);
    }

    @bindEvent(TexasGamePersonalSettings.SHOW_BB, 'setting')
    private updateLabels(bb: boolean) {
        this.amountLabel.string = this._basicInfo.showNumberWithShowBB(this._amountNum);
    }

    private onPressStarted() {
        this.pressedCallback = this.onClickCallback;
    }

    private onButtonClicked() {
        const submit = this.pressedCallback;
        this.pressedCallback = null;
        // A pooled button can be rebound between press and release.
        if (!submit || submit !== this.onClickCallback) return;
        submit();
        cc.tween(this.node)
            .to(0.05, { scale: 0.9 })
            .to(0.05, { scale: 1.0 })
            .start();
    }
}
