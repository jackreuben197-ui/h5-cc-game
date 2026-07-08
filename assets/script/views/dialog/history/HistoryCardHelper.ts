import { createLogger } from '../../../core/decorator/LogTrace';
import texasGamePersonalSettings from '../../../data/room/texas/TexasGamePersonalSettings';
import GameplayUtil from '../../../game/util/GameplayUtil';
import AssetManager from '../../loader/AssetManager';

const COLOR_GRAY = cc.color(127, 127, 127);

const CARD_VISIBLE_GAP = 4;

const tracelog = createLogger('HistoryCardHelper');

/**
 * 给普通卡牌节点(自带 cc.Sprite)设置牌面。
 * 老 prefab 的卡牌是裸 Sprite 节点,这里按玩家当前牌面样式取图,
 * 并用 CUSTOM sizeMode 保持 prefab 里排好的节点尺寸。
 */
export function setCardSprite(node: cc.Node, cardNum: number) {
    const sprite = node.getComponent(cc.Sprite);
    if (!sprite) return;
    try {
        const sf = AssetManager.getAsset(texasGamePersonalSettings.pokerCardType, GameplayUtil.CardNoToLocalResource(cardNum));
        sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        sprite.spriteFrame = sf;
    } catch (e) {
        tracelog.error(`卡牌资源未预加载 cardNum=${cardNum}`, e);
    }
}

/** 赢牌高亮用的置灰/还原(对齐老版 color 127 实现) */
export function setCardGray(node: cc.Node, gray: boolean) {
    node.color = gray ? COLOR_GRAY : cc.Color.WHITE;
}

/** 按路径查子 Label 并赋值(行模板克隆体内部无法编辑器绑定,保留路径查找) */
export function setChildLabel(root: cc.Node, path: string, text: string) {
    const node = cc.find(path, root);
    const label = node?.getComponent(cc.Label);
    if (label) label.string = text;
}

/** 标题区公牌刷新:card 子节点按牌值显隐+换图 */
export function refreshTitleCards(container: cc.Node, cards: number[]) {
    if (!container) return;
    container.children.forEach((item, index) => {
        const cardVal = cards?.[index] ?? 0;
        item.active = cardVal > 0;
        if (cardVal > 0) setCardSprite(item, cardVal);
    });
}

/**
 * 详情行手牌紧密排列(对齐老版 layoutDetailHandCards):
 * spacing = min(牌宽+间隙, (rightX-leftX)/(count-1));cards 为 null 显示牌背。
 * leftX/rightX 为排列锚点,由调用方从模板节点初始位置读出(prefab 是唯一数据源)
 */
export function layoutDetailHandCards(handCardsNode: cc.Node, cardCount: number, leftX: number, rightX: number, cards: number[] | null) {
    const children = handCardsNode.children;
    const cardWidth = children[0]?.width ?? 0;
    const spacing = cardCount > 1 ? Math.min(cardWidth + CARD_VISIBLE_GAP, (rightX - leftX) / (cardCount - 1)) : 0;
    for (let i = 0; i < children.length; i++) {
        const item = children[i];
        // 牌位置由代码按牌数动态排布,禁用 prefab 残留的 cc.Widget:
        // 否则克隆行首次激活时 Widget 会按设计位(密排)整一次,覆盖代码间距 → 首次两张手牌挤在一起
        const widget = item.getComponent(cc.Widget);
        if (widget) widget.enabled = false;
        if (i < cardCount) {
            item.active = true;
            item.x = cardCount === 1 ? leftX : leftX + i * spacing;
            item.zIndex = i;
            setCardSprite(item, cards ? cards[i] || 0 : 0);
        } else {
            item.active = false;
        }
    }
}

/** 行容器的克隆复用:不足则从模板克隆,多余隐藏 */
export function ensureRows(container: cc.Node, template: cc.Node, rows: cc.Node[], count: number) {
    while (rows.length < count) {
        const node = cc.instantiate(template);
        node.parent = container;
        rows.push(node);
    }
    rows.forEach((node, i) => (node.active = i < count));
}
