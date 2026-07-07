const { ccclass, property } = cc._decorator;

@ccclass
export default class SpriteSwitcher extends cc.Component {
    // 1. 绑定要切换的 Sprite 组件
    @property(cc.Sprite)
    targetSprite: cc.Sprite = null;
    // 2. 定义一个 SpriteFrame 数组，存放需要切换的图片
    @property([cc.SpriteFrame])
    frames: cc.SpriteFrame[] = [];
    // 记录当前显示的图片索引
    private currentIndex: number = 0;

    /**
     * 主动调用：根据下标切换图片
     */
    public changeSpriteFrame(index: number) {
        if (!this.frames || this.frames.length === 0) return;
        if (index < 0 || index >= this.frames.length) {
            cc.warn('索引超出图片数组范围！');
            return;
        }
        this.currentIndex = index;
        // 核心：直接赋值给组件的 spriteFrame
        this.targetSprite.spriteFrame = this.frames[index];
    }

    /**
     * 辅助方法：循环切换到下一张
     */
    public nextSpriteFrame() {
        if (this.frames.length === 0) return;
        let nextIndex = (this.currentIndex + 1) % this.frames.length;
        this.changeSpriteFrame(nextIndex);
    }
}
