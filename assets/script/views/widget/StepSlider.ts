const { ccclass, property, executeInEditMode, menu } = cc._decorator;

/** 绝对值区间配置：用真实业务数值（而非 0~1 归一化）驱动滑块 */
export type SliderData = {
    min_value: number;
    max_value: number;
    step: number;
    change?: (value: number, count?: number) => void;
    touch_start?: () => void;
    touch_end?: () => void;
    own?: any;
};

@ccclass
@executeInEditMode
@menu('Widget/StepSlider')
export default class StepSlider extends cc.Component {
    @property(cc.Slider)
    slider: cc.Slider = null;
    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;
    @property(cc.Sprite)
    bgSprite: cc.Sprite = null;
    @property({ tooltip: '最小滑动刻度 (0~1)。设置为 0 代表无缝滑动。' })
    step: number = 0.1;

    @property({ visible: false })
    private _bgColor: cc.Color = cc.Color.GRAY;
    @property({ type: cc.Color, displayName: '底槽背景色' })
    get bgColor(): cc.Color {
        return this._bgColor;
    }
    set bgColor(val: cc.Color) {
        this._bgColor = val;
        this.updateColors();
    }

    @property({ visible: false })
    private _progressColor: cc.Color = cc.Color.fromHEX(new cc.Color(), '#f9ca24');
    @property({ type: cc.Color, displayName: '进度条亮色' })
    get progressColor(): cc.Color {
        return this._progressColor;
    }
    set progressColor(val: cc.Color) {
        this._progressColor = val;
        this.updateColors();
    }

    /** 归一化进度回调 (0~1)，供 Operation / BringIn 按比例自行换算金额 */
    public onValueChanged: (progress: number) => void = null;

    // ─── 绝对值区间模式（可选，show() 后启用）─────────────
    private _data: SliderData = null;
    private _curValue: number = 0;

    onLoad() {
        this.updateColors();
        if (CC_EDITOR) return;
        // 拖拽/手势/几何全部交给原生 cc.Slider，这里只消费它的 progress
        this.slider.node.on('slide', this.onSlide, this);
        this.slider.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.slider.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.slider.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.syncVisual(this.slider.progress);
    }

    private updateColors() {
        if (this.bgSprite) this.bgSprite.node.color = this._bgColor;
        if (this.progressBar?.barSprite) this.progressBar.barSprite.node.color = this._progressColor;
    }

    /** 把任意 progress 吸附到 step 刻度并夹紧到 [0,1] */
    private snap(progress: number): number {
        let p = Math.min(1, Math.max(0, progress));
        if (this.step >= 1 || !isFinite(this.step)) return 1;
        if (this.step > 0) p = Math.round(p / this.step) * this.step;
        if (p >= 0.999) return 1;
        if (p <= 0.001) return 0;
        return Math.min(1, Math.max(0, p));
    }

    private onSlide() {
        const p = this.snap(this.slider.progress);
        this.slider.progress = p;
        this.syncVisual(p, true);
    }

    private onTouchStart() {
        this._data?.touch_start?.call(this._data.own);
    }

    private onTouchEnd() {
        this._data?.touch_end?.call(this._data.own);
    }

    private syncVisual(progress: number, fromUser: boolean = false) {
        if (this.progressBar) this.progressBar.progress = progress;
        this.onValueChanged?.(progress);
        // 绝对值层：由归一化 progress 反推当前值，仅用户拖动时回调 change
        if (this._data) {
            this._curValue = this.progressToValue(progress);
            if (fromUser) {
                this._data.change?.call(this._data.own, this._curValue, this.valueToCount(this._curValue));
            }
        }
    }

    // ─── 归一化 progress ↔ 绝对值 换算 ────────────────────
    private progressToValue(progress: number): number {
        const d = this._data;
        const range = d.max_value - d.min_value;
        if (range <= 0 || d.step <= 0) return d.min_value;
        const count = Math.round((progress * range) / d.step);
        return Math.min(d.max_value, Math.max(d.min_value, d.min_value + count * d.step));
    }

    private valueToCount(value: number): number {
        const d = this._data;
        return d.step <= 0 ? 0 : Math.round((value - d.min_value) / d.step);
    }

    public get progress(): number {
        return this.progressBar.progress;
    }

    public setProgress(progress: number) {
        const p = this.snap(progress);
        this.slider.progress = p;
        this.syncVisual(p);
    }

    /** 用绝对值区间初始化滑块（启用绝对值模式） */
    public show(data: SliderData) {
        this._data = data;
        const range = data.max_value - data.min_value;
        this.step = range > 0 && data.step > 0 ? data.step / range : 0;
        this._curValue = data.min_value;
        this.setProgress(0);
    }

    /** 当前绝对值（仅绝对值模式有意义） */
    public get value(): number {
        return this._curValue;
    }

    public set value(v: number) {
        const d = this._data;
        const k = !d || d.max_value === d.min_value ? 0 : (v - d.min_value) / (d.max_value - d.min_value);
        this.setProgress(k); // 内部按 progress 反推并刷新 _curValue
        d?.change?.call(d.own, this._curValue);
    }
}
