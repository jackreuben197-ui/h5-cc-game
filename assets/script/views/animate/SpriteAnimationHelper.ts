const { ccclass, property } = cc._decorator;

@ccclass
export default class SpriteAnimationHelper extends cc.Component {
    @property(cc.Sprite)
    sprite: cc.Sprite = null;
    @property
    FPS: number = 5;
    @property([cc.SpriteFrame])
    frames: cc.SpriteFrame[] = [];
    @property
    autoPlay: boolean = true;
    @property
    loop: boolean = true;
    toPlay: boolean = false;
    //间隔时间
    stepDuration: number = 0;
    passTime: number = 0;
    frameIndex: number = 0;
    //完成回调
    callback: Function = null;

    override onLoad() {
        this.stepDuration = this.FPS / cc.game.getFrameRate();
        if (this.autoPlay) {
            this.replay();
        }
    }

    //从头播放
    replay(callback?: Function) {
        this.callback = callback;
        this.toPlay = true;
        this.passTime = 0;
        this.frameIndex = 0;
        this.render();
    }

    protected override update(dt: number): void {
        if (this.toPlay) {
            this.passTime += dt;
            while (this.toPlay && this.passTime > this.stepDuration) {
                this.realUpdate();
                this.passTime -= this.stepDuration;
            }
        }
    }

    //真实刷新
    realUpdate() {
        this.frameIndex++;
        if (this.frameIndex == this.frames.length) {
            if (this.loop) {
                this.frameIndex = 0;
            } else {
                this.toPlay = false;
                this.callback && this.callback();
                return;
            }
        }
        this.render();
    }

    protected render(): void {
        this.sprite.spriteFrame = this.frames[this.frameIndex];
    }
}
