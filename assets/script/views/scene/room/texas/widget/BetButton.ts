import { autoBindEvents, bindEvent, unBindEventsAll } from '../../../../../core/decorator/DataBind';
import TexasGameRoomDataSetting from '../../../../../data/room/texas/TexasGameRoomDataSetting';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('Scene/Room/Texas/Widget/BetButton')
export default class BetButton extends cc.Component {
    @property({ type: cc.Label, displayName: '显示标签(如 1/2)' })
    showLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: '金额标签(如 666K)' })
    amountLabel: cc.Label = null;
    // 核心修改：回调里的 amount 改为 number 类型
    private onClickCallback: (amount: number, ratioStr: string) => void = null;
    private _ratioStr: string = '';
    private _amountNum: number = 0; // 内部存成数字
    private _setting: TexasGameRoomDataSetting;

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onButtonClicked, this);
    }

    /**
     * 外部初始化调用接口
     * @param ratioStr 比例文本，如 "1/3"
     * @param amountNum 金额数字，如 666000
     * @param callback 点击时的触发函数 (返回数字类型的金额)
     */
    public initData(ratioStr: string, amountNum: number, settings: TexasGameRoomDataSetting, callback: (amount: number, ratio: string) => void) {
        this._ratioStr = ratioStr;
        this._amountNum = amountNum;
        this.onClickCallback = callback;
        // 1. 刷新比例文本
        if (this.showLabel) this.showLabel.string = ratioStr;
        this._bindAndRefresh();
    }

    private _bindAndRefresh() {
        autoBindEvents(this, { setting: this._setting });
    }

    protected onEnable(): void {
        this._bindAndRefresh();
    }

    protected onDisable(): void {
        unBindEventsAll(this);
    }

    @bindEvent(TexasGameRoomDataSetting.SHOW_BB, 'setting')
    private updateLabels(bb: boolean) {
        this.amountLabel.string = this._setting.showNumberWithShowBB(this._amountNum);
    }

    private onButtonClicked() {
        // 轻微点击动画手感
        cc.tween(this.node)
            .to(0.05, { scale: 0.9 })
            .to(0.05, { scale: 1.0 })
            .call(() => {
                if (this.onClickCallback) {
                    // 抛出干净的 number 类型金额
                    this.onClickCallback(this._amountNum, this._ratioStr);
                }
            })
            .start();
    }
}
