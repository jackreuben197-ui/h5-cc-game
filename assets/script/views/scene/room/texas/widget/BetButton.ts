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
    private onClickCallback: (amount: number, ratioStr: string) => void = null;
    private _ratioStr: string = '';
    private _amountNum: number = 0;
    private _basicInfo: TexasGameRoomDataBasic;

    onLoad() {
        this.realButton.node.on('click', this.onButtonClicked, this);
    }

    public initData(ratioStr: string, amountNum: number, basicInfo: TexasGameRoomDataBasic, callback: (amount: number, ratio: string) => void) {
        this._ratioStr = ratioStr;
        this._amountNum = amountNum;
        this._basicInfo = basicInfo;
        this.onClickCallback = callback;
        if (this.showLabel) this.showLabel.string = ratioStr;
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
        unBindEventsAll(this);
    }

    @bindEvent(TexasGamePersonalSettings.SHOW_BB, 'setting')
    private updateLabels(bb: boolean) {
        this.amountLabel.string = this._basicInfo.showNumberWithShowBB(this._amountNum);
    }

    private onButtonClicked() {
        cc.tween(this.node)
            .to(0.05, { scale: 0.9 })
            .to(0.05, { scale: 1.0 })
            .call(() => {
                if (this.onClickCallback) {
                    this.onClickCallback(this._amountNum, this._ratioStr);
                }
            })
            .start();
    }
}
