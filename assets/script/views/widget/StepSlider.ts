const { ccclass, property, executeInEditMode, menu } = cc._decorator;

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
    @property({ tooltip: '最小滑动刻度 (0~1)。设置为0代表无缝滑动。' })
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
        let finalProgress = rawProgress;
        if (this.step >= 1 || !isFinite(this.step)) {
            finalProgress = 1;
        } else if (this.step > 0) {
            finalProgress = Math.round(rawProgress / this.step) * this.step;
            finalProgress = Math.round(finalProgress * 10000) / 10000;
        }
        if (rawProgress >= 0.999 || finalProgress >= 0.999) {
            finalProgress = 1;
        } else if (rawProgress <= 0.001 || finalProgress <= 0.001) {
            finalProgress = 0;
        } else {
            // 中间范围的值，做一次常规的安全限制
            finalProgress = Math.min(1, Math.max(0, finalProgress));
        }
        finalProgress = Math.min(1, Math.max(0, finalProgress));
        this.slider.progress = finalProgress;
        this.syncVisual(finalProgress);
    }

    private syncVisual(progress: number) {
        if (this.progressBar) {
            this.progressBar.progress = progress;
        }
        if (this.onValueChanged) {
            this.onValueChanged(progress);
        }
    }

    public setProgress(progress: number) {
        let p = Math.min(1, Math.max(0, progress));
        if (this.step > 0) {
            p = Math.round(p / this.step) * this.step;
        }
        this.slider.progress = p;
        this.syncVisual(p);
    }
}
