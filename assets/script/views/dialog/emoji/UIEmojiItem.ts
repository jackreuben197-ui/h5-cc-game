import UIComponentBase from '../../base/UIComponentBase';
import { formatPrivateUcChargePrice } from '../../util/PrivateUcChargeView';

const { ccclass, menu, property } = cc._decorator;

export interface UIEmojiItemParam {
    skeletonLoading: Promise<sp.SkeletonData>;
    animation: string;
    showCharge: boolean;
    isPrivateUc: boolean;
    chargeAmount?: number;
    ucChargeIcon?: cc.SpriteFrame;
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
    @property({ type: cc.Node, displayName: '动画加载状态节点' })
    private loadingNode: cc.Node = null;
    private _animation = '';
    private _onClick: () => void = null;
    private _loaded = false;
    private _button: cc.Button = null;

    public initialize(param: UIEmojiItemParam): void {
        this._prepareComponents();
        this._animation = param.animation;
        this._onClick = param.onClick;
        this._loaded = false;
        this.emojiSkeleton.node.active = false;
        this.loadingNode.active = true;
        this.loadingNode.angle = 0;
        this.loadingNode.opacity = 255;
        cc.Tween.stopAllByTarget(this.loadingNode);
        cc.tween(this.loadingNode).by(0.8, { angle: -360 }).repeatForever().start();
        this._button.interactable = false;
        this.chargeIcon.node.active = param.showCharge;
        this.chargeAmount.node.active = param.showCharge;
        this.selectSignNode.active = false;
        if (param.showCharge && param.isPrivateUc && param.ucChargeIcon) {
            this.chargeIcon.spriteFrame = param.ucChargeIcon;
            this.chargeIcon.node.setContentSize(UIEmojiItem.PRIVATE_UC_ICON_SIZE, UIEmojiItem.PRIVATE_UC_ICON_SIZE);
        }
        if (param.chargeAmount != null) {
            this.chargeAmount.string = param.isPrivateUc ? formatPrivateUcChargePrice(param.chargeAmount) : `${param.chargeAmount}`;
        }
        param.skeletonLoading
            .then(skeletonData => this._showAnimation(skeletonData))
            .catch(() => {
                if (!cc.isValid(this.node)) return;
                cc.Tween.stopAllByTarget(this.loadingNode);
                this.loadingNode.opacity = 120;
                this.emojiSkeleton.node.active = false;
            });
    }

    private _showAnimation(skeletonData: sp.SkeletonData): void {
        if (!cc.isValid(this.node)) return;
        const previewCenterY = this.emojiSkeleton.node.y;
        this.emojiSkeleton.skeletonData = skeletonData;
        this.emojiSkeleton.node.active = true;
        this.emojiSkeleton.setAnimation(0, this._animation, true);
        cc.Tween.stopAllByTarget(this.loadingNode);
        this.loadingNode.active = false;
        this._loaded = true;
        this._button.interactable = true;
        try {
            this._fitEmojiAnimation(skeletonData, this._animation, previewCenterY);
        } catch (error) {
            cc.warn('[UIEmojiItem] fit animation failed', this._animation, error);
        }
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
        this._prepareComponents();
        this.node.on('click', this.onItemClicked, this);
    }

    private _prepareComponents(): void {
        this._button = this.node.getComponent(cc.Button) || this.node.addComponent(cc.Button);
        this._button.transition = cc.Button.Transition.NONE;
        const graphics = this.loadingNode.getComponent(cc.Graphics) || this.loadingNode.addComponent(cc.Graphics);
        graphics.clear();
        graphics.lineWidth = 6;
        graphics.lineCap = cc.Graphics.LineCap.ROUND;
        graphics.strokeColor = cc.color(160, 160, 160, 255);
        graphics.arc(0, 0, 24, 0, Math.PI * 1.5, false);
        graphics.stroke();
    }

    protected onDestroy(): void {
        cc.Tween.stopAllByTarget(this.loadingNode);
        this.node.targetOff(this);
    }

    private onItemClicked(): void {
        if (!this._loaded) return;
        this.selectSignNode.active = true;
        if (this._onClick) this._onClick();
    }
}
