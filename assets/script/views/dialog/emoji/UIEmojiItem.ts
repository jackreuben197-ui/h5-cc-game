import UIComponentBase from '../../base/UIComponentBase';

const { ccclass, menu, property } = cc._decorator;

export interface UIEmojiItemParam {
    spriteFrame: cc.SpriteFrame;
    index: number;
    showDiamond: boolean;
    diamond?: number;
    onClick: (index: number) => void;
}

@ccclass
@menu('CrazyPoker/Texas/Dialog/UIEmojiItem')
export default class UIEmojiItem extends UIComponentBase<UIEmojiItemParam> {
    @property({ type: cc.Sprite, displayName: '表情图片' })
    private emojiSprite: cc.Sprite = null;
    @property({ type: cc.Node, displayName: '钻石图标' })
    private diamondNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '钻石数量节点' })
    private numDiamondNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '选中标记' })
    private selectSignNode: cc.Node = null;
    private _emojiIndex = 0;
    private _onClick: (index: number) => void = null;

    public initialize(param: UIEmojiItemParam): void {
        this._emojiIndex = param.index;
        this._onClick = param.onClick;
        this.emojiSprite.spriteFrame = param.spriteFrame;
        this.diamondNode.active = param.showDiamond;
        this.numDiamondNode.active = param.showDiamond;
        this.selectSignNode.active = false;
        const diamondLabel = this.numDiamondNode.getComponent(cc.Label);
        if (diamondLabel && param.diamond != null) diamondLabel.string = `${param.diamond}`;
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
        if (this._onClick) this._onClick(this._emojiIndex);
    }
}
