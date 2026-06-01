const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('CrazyPoker/Common/CountDownLabel')
export default class CountDownLabel extends cc.Component {
    // 倒计时结束时的强类型回调
    public onTimeUpCallback: () => void = null;
    private _label: cc.Label = null;

    private _totalSeconds: number = 0; // 剩余总秒数

    onLoad() {
        this._label = this.getComponent(cc.Label);
        if (!this._label) {
            this._label = this.addComponent(cc.Label);
        }
    }

    /**
     * 启动倒计时
     * @param durationSeconds 倒计时秒数，默认 900 秒（15 分钟）
     */
    public startCountDown(durationSeconds: number = 900) {
        // 1. 计算总秒数
        this._totalSeconds = durationSeconds;
        // 2. 先手动刷新一下初始视觉，防止闪烁默认文本
        this.updateLabelString();
        // 3. 安全防御：先取消之前可能存在的定时器，防止叠加
        this.unschedule(this.countDownTicker);
        // 4. 开启定时器：每 1 秒执行一次，不停循环
        this.schedule(this.countDownTicker, 1);
    }

    /**
     * 停止倒计时（比如玩家提前完成了支付、或者中途关闭了弹窗）
     */
    public stopCountDown() {
        this.unschedule(this.countDownTicker);
    }

    /**
     * 每秒执行的核心计时器
     */
    private countDownTicker() {
        if (this._totalSeconds <= 0) {
            this.stopCountDown();
            // 触发时间到了的回调（比如自动关闭订单、或者弹窗提示超时）
            if (this.onTimeUpCallback) {
                this.onTimeUpCallback();
            }
            return;
        }
        this._totalSeconds--;
        this.updateLabelString();
    }

    /**
     * 将秒数格式化为 00:00 并刷新 Label
     */
    private updateLabelString() {
        if (!this._label) return;
        let minutes = Math.floor(this._totalSeconds / 60);
        let seconds = this._totalSeconds % 60;
        // 补零算法：保证永远是 "15:00", "09:05" 这种规整格式
        let minStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
        let secStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
        this._label.string = `${minStr}:${secStr}`;
    }

    // 严密防御：节点被销毁时自动清理定时器，防止垃圾回收泄露
    onDestroy() {
        this.unschedule(this.countDownTicker);
        this.onTimeUpCallback = null;
    }
}
