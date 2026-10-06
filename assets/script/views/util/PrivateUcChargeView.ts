export function applyPrivateUcChargeIcon(costLabel: cc.Label, ucIcon: cc.SpriteFrame): void {
    if (!costLabel?.node?.parent || !ucIcon) return;
    const container = costLabel.node.parent;
    const sprite =
        container.getComponent(cc.Sprite) || container.children.map(node => node.getComponent(cc.Sprite)).find(Boolean);
    if (sprite) sprite.spriteFrame = ucIcon;
}
