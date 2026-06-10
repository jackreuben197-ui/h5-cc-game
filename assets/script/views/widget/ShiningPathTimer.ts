const { ccclass, property, menu } = cc._decorator;

export enum PathType {
    Circle = 0, // 正圆
    RoundRect = 1, // 圆角矩形
    Custom = 2 // 自定义
}

export interface ITimerOptions {
    totalTime: number; // 倒计时总时长（秒）
    stepInterval?: number; // 步长回调间隔（秒），不传或传 0 则完全关闭
    elapsedTime?: number; // 已经走过的时间（秒），默认 0
    onComplete?: () => void; // 结束回调
    onStep?: (remainingTime: number) => void; // 步长回调
}

@ccclass
@menu('Widget/ShiningPathTimer')
export default class ShiningPathTimer extends cc.Component {
    @property(cc.Sprite)
    public progressBar: cc.Sprite = null;
    @property(cc.Node)
    public handle: cc.Node = null;
    @property(cc.Label)
    public countdownLabel: cc.Label = null;
    @property({
        type: cc.Enum(PathType),
        tooltip: '选择倒计时跑道的几何形状：Circle(正圆), RoundRect(圆角矩形), Custom(自定义)'
    })
    public pathType: PathType = PathType.Circle;
    // 修改：重命名为边框宽度，语义更清晰
    @property({
        type: cc.Float,
        tooltip: 'UI贴图中边框路径的绝对宽度（像素）。代码会自动将圆点居中对齐到该边框的中心线上'
    })
    public pathThickness: number = 0;
    @property({
        type: [cc.Vec2],
        tooltip: '当 pathType 选择为 Custom 时，才会读取此处的自定义标准 100x100 点'
    })
    public standardPoints: cc.Vec2[] = [];
    @property({
        type: cc.Integer,
        tooltip: '指定哪个控制点索引作为起点'
    })
    private _totalTime: number = 15;
    private _stepInterval: number = 1.0;
    private _currentTime: number = 0;
    private _isCounting: boolean = false;
    private _realPoints: cc.Vec2[] = [];
    private _segmentLengths: number[] = [];
    private _totalPathLength: number = 0;
    private _pointProgressRatios: number[] = [];
    private _startProgressOffset: number = 0;
    private _onCompleteCallback: () => void = null;
    private _onStepCallback: (remainingTime: number) => void = null;
    private _nextStepTriggerTime: number = 0;
    private _lastDisplayedSecond: number = -1;

    protected onLoad(): void {
        this.initPathGeometry();
    }

    private generateCirclePoints(): cc.Vec2[] {
        const pts: cc.Vec2[] = [];
        const count = 24;
        for (let i = 0; i < count; i++) {
            let angle = 90 - (i / count) * 360;
            let radian = (angle * Math.PI) / 180;
            let x = Math.round(Math.cos(radian) * 50 * 100) / 100;
            let y = Math.round(Math.sin(radian) * 50 * 100) / 100;
            pts.push(cc.v2(x, y));
        }
        return pts;
    }

    private generateRoundRectPoints(): cc.Vec2[] {
        return [
            cc.v2(0, 50),
            cc.v2(35, 50),
            cc.v2(46, 46),
            cc.v2(50, 35),
            cc.v2(50, -35),
            cc.v2(46, -46),
            cc.v2(35, -50),
            cc.v2(-35, -50),
            cc.v2(-46, -46),
            cc.v2(-50, -35),
            cc.v2(-50, 35),
            cc.v2(-46, 46)
        ];
    }

    private initPathGeometry(): void {
        let activePts: cc.Vec2[] = [];
        if (this.pathType === PathType.Circle) {
            activePts = this.generateCirclePoints();
        } else if (this.pathType === PathType.RoundRect) {
            activePts = this.generateRoundRectPoints();
        } else {
            if (!this.standardPoints || this.standardPoints.length < 2) return;
            activePts = this.standardPoints.slice();
        }
        const firstStd = activePts[0];
        const lastStd = activePts[activePts.length - 1];
        if (!firstStd.equals(lastStd)) {
            activePts.push(cc.v2(firstStd.x, firstStd.y));
        }
        const realWidth = this.node.width;
        const realHeight = this.node.height;
        const scaleX = realWidth / 100;
        const scaleY = realHeight / 100;
        // 计算基于边框厚度的绝对物理缩进量（向中心内缩，所以是负值）
        const calculatedOffset = -this.pathThickness * 0.5;
        this._realPoints = [];
        for (let i = 0; i < activePts.length; i++) {
            let stdPt = activePts[i];
            let realX = stdPt.x * scaleX;
            let realY = stdPt.y * scaleY;
            // 只有当设定了边框宽度时，才应用中心线对齐算法
            if (calculatedOffset !== 0) {
                let dirFromCenter = cc.v2(realX, realY).normalize();
                realX += dirFromCenter.x * calculatedOffset;
                realY += dirFromCenter.y * calculatedOffset;
            }
            this._realPoints.push(cc.v2(realX, realY));
        }
        this._segmentLengths = [];
        this._totalPathLength = 0;
        for (let i = 0; i < this._realPoints.length - 1; i++) {
            let dist = this._realPoints[i].sub(this._realPoints[i + 1]).mag();
            this._segmentLengths.push(dist);
            this._totalPathLength += dist;
        }
        this._pointProgressRatios = [0];
        let accumulatedLength = 0;
        for (let i = 0; i < this._segmentLengths.length; i++) {
            accumulatedLength += this._segmentLengths[i];
            this._pointProgressRatios.push(accumulatedLength / this._totalPathLength);
        }
        this._startProgressOffset = this._pointProgressRatios[0];
        if (this.progressBar) {
            this.progressBar.fillStart = 0;
        }
    }

    public startTimer(options: ITimerOptions): void {
        if (this._realPoints.length < 2) return;
        if (this._isCounting) this.stop();
        this.progressBar.node.active = true;
        this.handle.active = true;
        const totalTime = options.totalTime;
        const elapsedTime = options.elapsedTime !== undefined ? options.elapsedTime : 0;
        const stepInterval = options.stepInterval !== undefined ? options.stepInterval : 0;
        if (elapsedTime >= totalTime) {
            if (this.progressBar) this.progressBar.fillRange = 0;
            if (options.onComplete) options.onComplete();
            return;
        }
        this._totalTime = totalTime;
        this._currentTime = totalTime - elapsedTime;
        this._stepInterval = stepInterval;
        this._onCompleteCallback = options.onComplete || null;
        this._onStepCallback = options.onStep || null;
        this.resetStepTrigger();
        this._lastDisplayedSecond = Math.ceil(this._currentTime);
        this.updateCountdownLabel();
        this._isCounting = true;
        this.updateVisual(this._currentTime / this._totalTime);
    }

    public extendTime(extendedSeconds: number): void {
        if (!this._isCounting && this._currentTime <= 0) return;
        const newTotalTime = this._currentTime + extendedSeconds;
        this._totalTime = newTotalTime;
        this._currentTime = newTotalTime;
        this.resetStepTrigger();
        this._lastDisplayedSecond = Math.ceil(this._currentTime);
        this.updateCountdownLabel();
        this.updateVisual(1.0);
    }

    private resetStepTrigger(): void {
        if (this._stepInterval > 0 && this._onStepCallback) {
            this._nextStepTriggerTime = Math.floor(this._currentTime / this._stepInterval) * this._stepInterval;
            this._onStepCallback(Math.ceil(this._currentTime));
        } else {
            this._nextStepTriggerTime = -1;
        }
    }

    public stop(): void {
        this._isCounting = false;
        this.handle.active = false;
        this.progressBar.node.active = false;
        if (this.countdownLabel) {
            this.countdownLabel.string = '';
        }
    }

    public pause(): void {
        this._isCounting = false;
    }

    public resume(): void {
        if (this._isCounting || this._currentTime <= 0) return;
        this._isCounting = true;
    }

    public reset(): void {
        this._isCounting = false;
        this._currentTime = 0;
        this._onCompleteCallback = null;
        this._onStepCallback = null;
        this._lastDisplayedSecond = -1;
        this.updateCountdownLabel();
        if (this.progressBar) {
            this.progressBar.fillRange = 0;
        }
    }

    protected update(dt: number): void {
        if (!this._isCounting) return;
        this._currentTime -= dt;
        if (this._nextStepTriggerTime >= 0 && this._currentTime <= this._nextStepTriggerTime && this._currentTime > 0) {
            if (this._onStepCallback) {
                this._onStepCallback(Math.ceil(this._currentTime));
            }
            this._nextStepTriggerTime -= this._stepInterval;
        }
        if (this._currentTime <= 0) {
            this._currentTime = 0;
            this._isCounting = false;
            if (this._onCompleteCallback) this._onCompleteCallback();
        }
        const currentSecond = Math.ceil(this._currentTime);
        if (currentSecond !== this._lastDisplayedSecond) {
            this._lastDisplayedSecond = currentSecond;
            this.updateCountdownLabel();
        }
        this.updateVisual(this._currentTime / this._totalTime);
    }

    private updateVisual(timeProgress: number): void {
        if (!this.handle || this._realPoints.length < 2) return;
        let rawBallProgress = 1.0 - timeProgress + this._startProgressOffset;
        let finalBallProgress = rawBallProgress % 1.0;
        let rawBarProgress = timeProgress + this._startProgressOffset;
        let finalBarProgress = rawBarProgress % 1.0;
        if (this.progressBar) {
            this.progressBar.fillRange = finalBarProgress;
        }
        let targetLen = finalBallProgress * this._totalPathLength;
        let currentAccumulatedLen = 0;
        for (let i = 0; i < this._segmentLengths.length; i++) {
            let segLen = this._segmentLengths[i];
            if (currentAccumulatedLen + segLen >= targetLen) {
                let segmentProgress = (targetLen - currentAccumulatedLen) / segLen;
                let startPos = this._realPoints[i];
                let endPos = this._realPoints[i + 1];
                let finalX = startPos.x + (endPos.x - startPos.x) * segmentProgress;
                let finalY = startPos.y + (endPos.y - startPos.y) * segmentProgress;
                this.handle.setPosition(finalX, finalY);
                let dir = endPos.sub(startPos).normalize();
                this.handle.angle = (Math.atan2(dir.y, dir.x) * 180) / Math.PI;
                return;
            }
            currentAccumulatedLen += segLen;
        }
    }

    private updateCountdownLabel(): void {
        if (!this.countdownLabel) return;
        this.countdownLabel.string = `${Math.ceil(this._currentTime)}s`;
    }
}
