const { property, ccclass, menu } = cc._decorator;

export enum CountDownFormat {
    MM_SS, // 02:30
    PURE_SEC // 150s
}

export interface ICountDownOptions {
    /** 倒计时秒数 */
    durationSeconds: number;
    /** 显示格式 */
    format?: CountDownFormat;
    /** 文本前缀 */
    prefix?: string;
    /** 自定义整条文案（如多语言模板"购买中##s"按剩余秒数生成）；提供时忽略 format/prefix */
    formatter?: (remainSeconds: number) => string;
    /** 倒计时结束回调 */
    onComplete?: () => void;
}

@ccclass
@menu('Widget/CountDownLabel')
export default class CountDownLabel extends cc.Component {
    private _onTimeUpCallback: () => void = null;
    @property({ type: cc.Label, displayName: '显示的Label,包含显示前缀' })
    public label: cc.Label = null!;
    /** 剩余秒数 */
    private _remainSeconds = 0;
    /** 是否正在倒计时 */
    private _running = false;
    /** 累积 dt */
    private _elapsed = 0;
    /** 显示格式 */
    private _format = CountDownFormat.MM_SS;
    /** 文本前缀 */
    private _prefix = '';
    /** 自定义整条文案 */
    private _formatter: ((remainSeconds: number) => string) | null = null;

    onLoad() {
        // 编辑器已绑定 label（可能是子节点上的）时不能覆盖：
        // 组件常挂在背景 Sprite 节点上，addComponent(cc.Label) 会与 Sprite 渲染冲突导致背景不显示
        if (!this.label) {
            this.label = this.getComponent(cc.Label) || this.addComponent(cc.Label);
        }
    }

    /**
     * 开始倒计时
     */
    public startCountDown(options: ICountDownOptions) {
        const { durationSeconds, format = CountDownFormat.MM_SS, prefix = '', formatter = null, onComplete } = options;
        this._remainSeconds = Math.max(0, Math.floor(durationSeconds));
        this._format = format;
        this._prefix = prefix;
        this._formatter = formatter;
        this._onTimeUpCallback = onComplete ?? null;
        this._elapsed = 0;
        this._running = true;
        this.updateLabelString();
    }

    /**
     * 停止倒计时
     */
    public stop() {
        this._running = false;
    }

    /**
     * 重置剩余时间
     */
    public setRemainSeconds(seconds: number) {
        this._remainSeconds = Math.max(0, Math.floor(seconds));
        this.updateLabelString();
    }

    update(dt: number) {
        if (!this._running) {
            return;
        }
        this._elapsed += dt;
        if (this._elapsed < 1) {
            return;
        }
        const passedSeconds = Math.floor(this._elapsed);
        this._elapsed -= passedSeconds;
        this._remainSeconds -= passedSeconds;
        if (this._remainSeconds <= 0) {
            this._remainSeconds = 0;
            this.updateLabelString();
            this.stop();
            this._onTimeUpCallback?.();
            return;
        }
        this.updateLabelString();
    }

    private updateLabelString() {
        if (!this.label) {
            return;
        }
        if (this._formatter) {
            this.label.string = this._formatter(this._remainSeconds);
            return;
        }
        let text = '';
        switch (this._format) {
            case CountDownFormat.PURE_SEC:
                text = `${this._remainSeconds}s`;
                break;
            case CountDownFormat.MM_SS:
            default: {
                const minutes = Math.floor(this._remainSeconds / 60);
                const seconds = this._remainSeconds % 60;
                const minStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
                const secStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
                text = `${minStr}:${secStr}`;
                break;
            }
        }
        this.label.string = this._prefix + text;
    }

    onDestroy() {
        this._running = false;
        this._onTimeUpCallback = null;
    }
}
