import UIComponentBase from '../../base/UIComponentBase';
import { formatPrivateUcChargePrice } from '../../util/PrivateUcChargeView';

const { ccclass, menu, property } = cc._decorator;

interface UIEmojiChargeParam {
    showCharge: boolean;
    isPrivateUc: boolean;
    chargeAmount?: number;
    ucChargeIcon?: cc.SpriteFrame;
}

export interface UIEmojiItemParam extends UIEmojiChargeParam {
    skeletonData: sp.SkeletonData;
    animation: string;
    onClick: () => void;
}

export interface UIEmojiItemStaticParam extends UIEmojiChargeParam {
    spriteFrame: cc.SpriteFrame;
    onClick: () => void;
}

@ccclass
@menu('CrazyPoker/Texas/Dialog/UIEmojiItem')
export default class UIEmojiItem extends UIComponentBase<UIEmojiItemParam> {
    private static readonly ANIMATION_SAMPLE_COUNT = 12;
    private static readonly PREVIEW_MAX_SIZE = 130;
    private static readonly PRIVATE_UC_ICON_SIZE = 32;
    @property({ type: sp.Skeleton, displayName: '表情动画' })
    private emojiSkeleton: sp.Skeleton = null;
    @property({ type: cc.Sprite, displayName: '收费图标' })
    private chargeIcon: cc.Sprite = null;
    @property({ type: cc.Label, displayName: '收费金额' })
    private chargeAmount: cc.Label = null;
    @property({ type: cc.Node, displayName: '选中标记' })
    private selectSignNode: cc.Node = null;
    private _animation = '';
    private _onClick: () => void = null;

    /** 静态图版本（图鉴表情 em16-65 的选择器用静态 png，动画在座位上播放） */
    public initializeStatic(param: UIEmojiItemStaticParam): void {
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
        this.selectSignNode.active = false;
        this._applyCharge(param);
    }

    private _applyCharge(param: UIEmojiChargeParam): void {
        this.chargeIcon.node.active = param.showCharge;
        this.chargeAmount.node.active = param.showCharge;
        if (param.showCharge) {
            if (param.isPrivateUc && param.ucChargeIcon) {
                this.chargeIcon.spriteFrame = param.ucChargeIcon;
                this.chargeIcon.node.setContentSize(UIEmojiItem.PRIVATE_UC_ICON_SIZE, UIEmojiItem.PRIVATE_UC_ICON_SIZE);
            } else {
                this._applyBlueDiamond();
            }
        }
        if (param.chargeAmount != null) {
            this.chargeAmount.string = param.isPrivateUc ? formatPrivateUcChargePrice(param.chargeAmount) : `${param.chargeAmount}`;
        }
    }

    /** 把钻石图标换成 pokerqueen 蓝钻。 */
    private _applyBlueDiamond(): void {
        const diamondSprite = this.chargeIcon;
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
        this.selectSignNode.active = false;
        this._applyCharge(param);
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
