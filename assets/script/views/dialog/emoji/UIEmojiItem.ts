import UIComponentBase from '../../base/UIComponentBase';

const { ccclass, menu, property } = cc._decorator;

export interface UIEmojiItemParam {
    skeletonData: sp.SkeletonData;
    animation: string;
    showDiamond: boolean;
    diamond?: number;
    onClick: () => void;
}

@ccclass
@menu('CrazyPoker/Texas/Dialog/UIEmojiItem')
export default class UIEmojiItem extends UIComponentBase<UIEmojiItemParam> {
    private static readonly ANIMATION_SAMPLE_COUNT = 12;
    private static readonly PREVIEW_MAX_SIZE = 130;
    @property({ type: sp.Skeleton, displayName: '表情动画' })
    private emojiSkeleton: sp.Skeleton = null;
    @property({ type: cc.Node, displayName: '钻石图标' })
    private diamondNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '钻石数量节点' })
    private numDiamondNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '选中标记' })
    private selectSignNode: cc.Node = null;
    private _animation = '';
    private _onClick: () => void = null;

    /** 静态图版本（图鉴表情 em16-65 的选择器用静态 png，动画在座位上播放） */
    public initializeStatic(param: { spriteFrame: cc.SpriteFrame; showDiamond: boolean; diamond?: number; onClick: () => void }): void {
        this._onClick = param.onClick;
        if (this.emojiSkeleton) {
            try { this.emojiSkeleton.clearTracks(); } catch (e) {}
            this.emojiSkeleton.enabled = false;
            const host = this.emojiSkeleton.node;
            let iconNode = host.parent.getChildByName('StaticEmoji');
            if (!iconNode) {
                iconNode = new cc.Node('StaticEmoji');
                iconNode.parent = host.parent;
                iconNode.setPosition(host.getPosition());
                iconNode.addComponent(cc.Sprite);
            }
            const sprite = iconNode.getComponent(cc.Sprite);
            sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            sprite.spriteFrame = param.spriteFrame;
            const orig = param.spriteFrame.getOriginalSize();
            const scale = UIEmojiItem.PREVIEW_MAX_SIZE / Math.max(orig.width, orig.height);
            iconNode.setContentSize(orig.width * scale, orig.height * scale);
        }
        this.diamondNode.active = param.showDiamond;
        this.numDiamondNode.active = param.showDiamond;
        this.selectSignNode.active = false;
        // 钻石图标改用 pokerqueen 蓝钻(emoji/diamond)。选择器走的是本静态版本，
        // 之前只在 initialize() 里换钻石，导致面板仍显示旧紫钻。此处补上。
        if (param.showDiamond) this._applyBlueDiamond();
        const diamondLabel = this.numDiamondNode.getComponent(cc.Label);
        if (diamondLabel && param.diamond != null) diamondLabel.string = `${param.diamond}`;
    }

    /** 把钻石图标换成 pokerqueen 蓝钻。图标可能挂在 diamondNode 的子节点上。 */
    private _applyBlueDiamond(): void {
        const diamondSprite = this.diamondNode.getComponent(cc.Sprite) || this.diamondNode.getComponentInChildren(cc.Sprite);
        if (!diamondSprite) {
            cc.warn('[UIEmojiItem] diamond sprite not found on diamondNode');
            return;
        }
        cc.resources.load('emoji/diamond', cc.SpriteFrame, (err, sf: cc.SpriteFrame) => {
            if (!err && sf && cc.isValid(diamondSprite.node)) {
                diamondSprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                diamondSprite.spriteFrame = sf;
            }
        });
    }

    public initialize(param: UIEmojiItemParam): void {
        this._animation = param.animation;
        this._onClick = param.onClick;
        const previewCenterY = this.emojiSkeleton.node.y;
        this.emojiSkeleton.skeletonData = param.skeletonData;
        this._fitEmojiAnimation(param.skeletonData, this._animation, previewCenterY);
        this.emojiSkeleton.setAnimation(0, this._animation, true);
        this.diamondNode.active = param.showDiamond;
        this.numDiamondNode.active = param.showDiamond;
        this.selectSignNode.active = false;
        if (param.showDiamond) this._applyBlueDiamond();
        const diamondLabel = this.numDiamondNode.getComponent(cc.Label);
        if (diamondLabel && param.diamond != null) diamondLabel.string = `${param.diamond}`;
    }

    private _fitEmojiAnimation(skeletonData: sp.SkeletonData, animationName: string, previewCenterY: number): void {
        const runtimeData = skeletonData.getRuntimeData();
        const animation = runtimeData.findAnimation(animationName);
        const skeleton = new sp.spine.Skeleton(runtimeData);
        const offset = new sp.spine.Vector2();
        const size = new sp.spine.Vector2();
        let minX = Number.POSITIVE_INFINITY;
        let minY = Number.POSITIVE_INFINITY;
        let maxX = Number.NEGATIVE_INFINITY;
        let maxY = Number.NEGATIVE_INFINITY;
        for (let i = 0; i <= UIEmojiItem.ANIMATION_SAMPLE_COUNT; i++) {
            const time = (animation.duration * i) / UIEmojiItem.ANIMATION_SAMPLE_COUNT;
            skeleton.setToSetupPose();
            animation.apply(skeleton, 0, time, false, [], 1, sp.spine.MixBlend.replace, sp.spine.MixDirection.mixIn);
            skeleton.updateWorldTransform();
            skeleton.getBounds(offset, size, []);
            minX = Math.min(minX, offset.x);
            minY = Math.min(minY, offset.y);
            maxX = Math.max(maxX, offset.x + size.x);
            maxY = Math.max(maxY, offset.y + size.y);
        }
        const scale = UIEmojiItem.PREVIEW_MAX_SIZE / Math.max(maxX - minX, maxY - minY);
        this.emojiSkeleton.node.setScale(scale);
        this.emojiSkeleton.node.setPosition(-((minX + maxX) / 2) * scale, previewCenterY - ((minY + maxY) / 2) * scale);
    }

    protected onLoad(): void {
        if (!this.node.getComponent(cc.Button)) {
            const button = this.node.addComponent(cc.Button);
            button.transition = cc.Button.Transition.NONE;
        }
        this.node.on('click', this.onItemClicked, this);
    }

    protected onDestroy(): void {
        this.node.targetOff(this);
    }

    private onItemClicked(): void {
        this.selectSignNode.active = true;
        if (this._onClick) this._onClick();
    }
}
