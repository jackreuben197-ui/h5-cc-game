const { ccclass, property, executeInEditMode, menu } = cc._decorator;

// 定义刻度模式枚举
enum StepSliderMode {
    UNIFORM = 0, // 均匀步长模式 (原模式)
    CUSTOM_ARRAY = 1 // 自定义非均匀数组模式
}

cc.Enum(StepSliderMode);

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
    // --- 新增：模式切换字段 ---
    @property({ type: StepSliderMode, displayName: '刻度模式', tooltip: 'UNIFORM: 均匀固定步长; CUSTOM_ARRAY: 自定义非均匀数组' })
    mode: StepSliderMode = StepSliderMode.UNIFORM;
    // --- 原模式字段 (仅在 UNIFORM 模式下可见) ---
    @property({
        tooltip: '最小滑动刻度 (0~1)。设置为0代表无缝滑动。',
        visible(this: any) {
            return this.mode === StepSliderMode.UNIFORM;
        }
    })
    step: number = 0.1;
    // --- 新模式字段 (仅在 CUSTOM_ARRAY 模式下可见) ---
    @property({
        type: [cc.Float],
        tooltip: '自定义刻度数组 (0~1)，必须升序排列。例如: [0, 0.1, 0.3, 0.5, 0.75, 1]。',
        visible(this: any) {
            return this.mode === StepSliderMode.CUSTOM_ARRAY;
        }
    })
    steps: number[] = [0, 0.1, 0.3, 0.5, 0.75, 1];
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
    public onValueChanged: (progress: number) => void = null;

    onLoad() {
        this.updateColors();
        if (!CC_EDITOR) {
            this.slider.node.on('slide', this.onSlide, this);
            this.syncVisual(this.slider.progress);
        }
    }

    private updateColors() {
        if (this.bgSprite) {
            this.bgSprite.node.color = this._bgColor;
        }
        if (this.progressBar && this.progressBar.barSprite) {
            this.progressBar.barSprite.node.color = this._progressColor;
        }
    }

    private onSlide(event: cc.Event.EventCustom) {
        let rawProgress = this.slider.progress;
        let finalProgress = this.calculateSnappedProgress(rawProgress);
        this.slider.progress = finalProgress;
        this.syncVisual(finalProgress);
    }

    /**
     * 根据当前模式计算对齐吸附后的进度值
     */
    private calculateSnappedProgress(progress: number): number {
        // 1. 数组模式
        if (this.mode === StepSliderMode.CUSTOM_ARRAY) {
            if (!this.steps || this.steps.length === 0) {
                return Math.min(1, Math.max(0, progress));
            }
            let closest = this.steps[0];
            let minDiff = Math.abs(progress - closest);
            for (let i = 1; i < this.steps.length; i++) {
                let diff = Math.abs(progress - this.steps[i]);
                if (diff < minDiff) {
                    minDiff = diff;
                    closest = this.steps[i];
                }
            }
            return Math.min(1, Math.max(0, closest));
        }
        // 2. 原来的均匀步长模式
        else {
            let finalProgress = progress;
            if (this.step >= 1 || !isFinite(this.step)) {
                finalProgress = 1;
            } else if (this.step > 0) {
                finalProgress = Math.round(progress / this.step) * this.step;
                finalProgress = Math.round(finalProgress * 10000) / 10000;
            }
            if (progress >= 0.999 || finalProgress >= 0.999) {
                finalProgress = 1;
            } else if (progress <= 0.001 || finalProgress <= 0.001) {
                finalProgress = 0;
            } else {
                finalProgress = Math.min(1, Math.max(0, finalProgress));
            }
            return finalProgress;
        }
    }

    private syncVisual(progress: number) {
        if (this.progressBar) {
            this.progressBar.progress = progress;
        }
        if (this.onValueChanged) {
            this.onValueChanged(progress);
        }
    }

    public get progress() {
        return this.progressBar ? this.progressBar.progress : 0;
    }

    public setProgress(progress: number) {
        let p = this.calculateSnappedProgress(progress);
        this.slider.progress = p;
        this.syncVisual(p);
    }
}
