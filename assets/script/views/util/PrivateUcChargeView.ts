import { StringHelper } from '../../helper/StringHelper';

const INLINE_UC_ICON_NODE_NAME = '__privateUcChargeIcon';

const INLINE_UC_ICON_WIDTH = 35;

const INLINE_UC_ICON_HEIGHT = 30;

const INLINE_UC_FONT_SIZE = 28;

export function applyPrivateUcChargeIcon(costLabel: cc.Label, ucIcon: cc.SpriteFrame): void {
    if (!costLabel?.node?.parent || !ucIcon) return;
    const container = costLabel.node.parent;
    const sprite = container.getComponent(cc.Sprite) || container.children.map(node => node.getComponent(cc.Sprite)).find(Boolean);
    if (sprite) sprite.spriteFrame = ucIcon;
}

/** pay_price uses the smallest UC unit; convert it to the amount shown to the player. */
export function formatPrivateUcChargePrice(price: number): string {
    return StringHelper.GetLongString(price);
}

/**
 * The prop price asset contains both the diamond and its background, so replacing that sprite
 * would cover the amount. Hide it and render the UC icon beside the existing label instead.
 */
export function applyInlinePrivateUcChargeIcon(costLabel: cc.Label, ucIcon: cc.SpriteFrame): void {
    if (!costLabel?.node?.parent || !ucIcon) return;
    const container = costLabel.node.parent;
    const defaultSprite = container.getComponent(cc.Sprite);
    if (defaultSprite) defaultSprite.enabled = false;
    costLabel.fontSize = INLINE_UC_FONT_SIZE;
    costLabel.lineHeight = INLINE_UC_FONT_SIZE;
    costLabel.node.y = 0;
    let iconNode = container.getChildByName(INLINE_UC_ICON_NODE_NAME);
    if (!iconNode) {
        iconNode = new cc.Node(INLINE_UC_ICON_NODE_NAME);
        iconNode.parent = container;
    }
    iconNode.active = true;
    iconNode.setContentSize(INLINE_UC_ICON_WIDTH, INLINE_UC_ICON_HEIGHT);
    iconNode.x = container.width / 2 - INLINE_UC_ICON_WIDTH / 2;
    iconNode.y = 0;
    const sprite = iconNode.getComponent(cc.Sprite) || iconNode.addComponent(cc.Sprite);
    sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
    sprite.spriteFrame = ucIcon;
}
