import texasGamePersonalSettings from '../../../data/room/texas/TexasGamePersonalSettings';
import GameplayUtil from '../../../game/util/GameplayUtil';
import AssetManager from '../../loader/AssetManager';

const COLOR_GRAY = cc.color(127, 127, 127);

/**
 * 给普通卡牌节点(自带 cc.Sprite)设置牌面。
 * 老 prefab 的卡牌是裸 Sprite 节点,这里按玩家当前牌面样式取图,
 * 并用 CUSTOM sizeMode 保持 prefab 里排好的节点尺寸。
 */
export function setCardSprite(node: cc.Node, cardNum: number) {
    const sprite = node.getComponent(cc.Sprite) || node.getComponentInChildren(cc.Sprite);
    if (!sprite) return;
    try {
        const sf = AssetManager.getAsset(texasGamePersonalSettings.pokerCardType, GameplayUtil.CardNoToLocalResource(cardNum));
        sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        sprite.spriteFrame = sf;
    } catch (e) {
        console.error(`[HistoryCardHelper] 卡牌资源未预加载 cardNum=${cardNum}`, e);
    }
}

/** 赢牌高亮用的置灰/还原(对齐老版 color 127 实现) */
export function setCardGray(node: cc.Node, gray: boolean) {
    node.color = gray ? COLOR_GRAY : cc.Color.WHITE;
}
