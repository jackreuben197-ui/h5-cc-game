import { StringHelper } from '../../../helper/StringHelper';
import { setCardGray, setCardSprite } from './HistoryCardHelper';
import {
    getCardTypeName,
    HistoryActionInfo,
    HistoryActionType,
    HistoryHandModel,
    HistoryPlayerInfo,
    HistoryStreetModel,
    PLAYER_ACTION_ABBR,
    PLAYER_POSITION_ABBR
} from './HistoryReplayModel';

/**
 * 牌谱详情区视图(纯类,非组件)。
 * 老 prefab(UITexasHistory.prefab)的区块结构:
 *   $Xxx/Title/player/num、Title/coin/num、Title/$Xxx_Cards(card×n)
 *   $Xxx/Shows/$Xxx_Childs + 模板子节点($Xxx_Child / $Score_Second_Child)
 * 由 UITexasHistory 在 onLoad 时按节点名解析注入,行节点用模板 cc.instantiate 克隆复用。
 */
const COLOR_GREEN = cc.color(86, 181, 87);

const COLOR_RED = cc.color(230, 68, 85);

const COLOR_YELLOW = cc.color(255, 184, 83);

const COLOR_GRAY = cc.color(198, 198, 198);

// Score_Child 模板手牌锚点(prefab 中 card[0]/card[5] 的 x)
const SCORE_HAND_LEFT_X = -477;

const SCORE_HAND_RIGHT_X = -331.32;

// Score_Second_Child 模板手牌锚点
const SCORE2_HAND_LEFT_X = -222;

const SCORE2_HAND_RIGHT_X = -79.566;

const CARD_WIDTH = 84;

const CARD_VISIBLE_GAP = 4;
// Score_Child prefab cards_position 默认 X=-142;
// Score_Second_Child prefab cards_position 默认 X=-367.499,补偿差值
const CARDS_POSITION_X = -142;

const CARDS_POSITION_SECOND_OFFSET = -225.499;

function setChildLabel(root: cc.Node, path: string, text: string) {
    const node = cc.find(path, root);
    const label = node?.getComponent(cc.Label);
    if (label) label.string = text;
}

/** 标题区公牌刷新:card 子节点按牌值显隐+换图 */
function refreshTitleCards(container: cc.Node, cards: number[]) {
    if (!container) return;
    container.children.forEach((item, index) => {
        const cardVal = cards?.[index] ?? 0;
        item.active = cardVal > 0;
        if (cardVal > 0) setCardSprite(item, cardVal);
    });
}

/**
 * 详情行手牌紧密排列(对齐老版 layoutDetailHandCards):
 * spacing = min(牌宽+间隙, (rightX-leftX)/(count-1));cards 为 null 显示牌背
 */
function layoutDetailHandCards(handCardsNode: cc.Node, cardCount: number, leftX: number, rightX: number, cards: number[] | null) {
    const spacing = cardCount > 1 ? Math.min(CARD_WIDTH + CARD_VISIBLE_GAP, (rightX - leftX) / (cardCount - 1)) : 0;
    const children = handCardsNode.children;
    for (let i = 0; i < children.length; i++) {
        const item = children[i];
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
function ensureRows(container: cc.Node, template: cc.Node, rows: cc.Node[], count: number) {
    while (rows.length < count) {
        const node = cc.instantiate(template);
        node.parent = container;
        rows.push(node);
    }
    rows.forEach((node, i) => (node.active = i < count));
}

// ==================== 街道区(Preflop/Flop/Turn/River) ====================

export class StreetSectionView {
    private _node: cc.Node;
    private _cardsContainer: cc.Node;
    private _rowContainer: cc.Node;
    private _template: cc.Node;
    private _rows: cc.Node[] = [];
    private _stackAsRaw: boolean;

    /**
     * @param sectionNode 区块根节点($Preflop 等)
     * @param cardsContainerName 标题公牌容器名($Flop_Cards 等,Preflop 传 null)
     * @param childsName 行容器名($Preflop_Childs 等)
     * @param templateName 行模板名($Preflop_Child 等)
     * @param stackAsRaw 剩余筹码不带 P: 前缀(仅 Preflop,对齐老版)
     */
    constructor(sectionNode: cc.Node, cardsContainerName: string, childsName: string, templateName: string, stackAsRaw: boolean = false) {
        this._node = sectionNode;
        this._stackAsRaw = stackAsRaw;
        this._cardsContainer = cardsContainerName ? cc.find(`Title/${cardsContainerName}`, sectionNode) : null;
        this._rowContainer = cc.find(`Shows/${childsName}`, sectionNode);
        this._template = this._rowContainer.getChildByName(templateName);
        this._template.removeFromParent(false);
    }

    public get node(): cc.Node {
        return this._node;
    }

    public show(street: HistoryStreetModel, publicCards: number[]) {
        this._node.active = street.rows.length > 0;
        setChildLabel(this._node, 'Title/player/num', `${street.rows.length}`);
        if (street.rows.length > 0) {
            setChildLabel(this._node, 'Title/coin/num', StringHelper.GetLongString(street.pot));
        }
        // 公牌不受行数限制:全下等场景该街无动作但牌已发出
        this.refreshCards(publicCards);
        ensureRows(this._rowContainer, this._template, this._rows, street.rows.length);
        street.rows.forEach((row, i) => this._renderRow(this._rows[i], row));
    }

    /** 发发看揭示公牌后单独刷新标题公牌 */
    public refreshCards(publicCards: number[]) {
        refreshTitleCards(this._cardsContainer, publicCards);
    }

    /** 对齐老版 SetPlayerItem */
    private _renderRow(go: cc.Node, row: HistoryActionInfo) {
        setChildLabel(go, 'player_nick', row.nickName);
        const stackStr = StringHelper.GetDecimalN(row.leftChips / 100);
        setChildLabel(go, 'win', this._stackAsRaw ? stackStr : 'P:' + stackStr);
        setChildLabel(go, 'SB/label', PLAYER_POSITION_ABBR[row.playerPosition] ?? '');
        // bet/raise 按加注次数显示 B / R / nB
        let actionStr: string;
        if (row.action === HistoryActionType.Bet || row.action === HistoryActionType.Raise) {
            if (row.raiseTimes === 1) {
                actionStr = PLAYER_ACTION_ABBR[row.action];
            } else if (row.raiseTimes === 2) {
                actionStr = PLAYER_ACTION_ABBR[HistoryActionType.Raise];
            } else {
                actionStr = row.raiseTimes + 'B';
            }
        } else {
            actionStr = PLAYER_ACTION_ABBR[row.action] ?? '';
        }
        setChildLabel(go, 'CC/action', actionStr);
        setChildLabel(go, 'CC/chip', StringHelper.GetLongString(row.actionChip));
        const bg = cc.find('CC/BG', go);
        if (bg) {
            if (row.action > HistoryActionType.None && row.action < HistoryActionType.Straddle) {
                bg.color = COLOR_GREEN;
                bg.opacity = 255;
            } else if (row.action > HistoryActionType.Check && row.action < HistoryActionType.Fold) {
                bg.color = COLOR_RED;
                bg.opacity = 255;
            } else if (row.action === HistoryActionType.Insure) {
                bg.color = COLOR_YELLOW;
                bg.opacity = 255;
            } else {
                bg.color = COLOR_GRAY;
                bg.opacity = 198;
            }
        }
        const win = go.getChildByName('win');
        if (win) {
            if (row.action === HistoryActionType.AllIn) {
                win.color = COLOR_GRAY;
                win.opacity = 160;
            } else {
                win.color = cc.Color.WHITE;
                win.opacity = 255;
            }
        }
    }
}
// ==================== 结算区(Score/Showdown/Showdown2) ====================

/** 结算行渲染模式 */
export enum ScoreRowMode {
    /** 单套牌局行(Score 单套 / Showdown):第一套盈亏+公牌+高亮,用 Score_Child 模板 */
    FirstBoard = 0,
    /** 双套牌局的 Score 行:两个盈亏+两排公牌+两套高亮,用 Score_Second_Child 模板 */
    DualBoard = 1,
    /** 双套牌局的 Showdown2 行:第二套盈亏+第二套公牌+高亮,用 Score_Child 模板 */
    SecondBoard = 2
}

export class ScoreSectionView {
    private _node: cc.Node;
    private _cardsContainer: cc.Node;
    private _rowContainer: cc.Node;
    private _singleTemplate: cc.Node;
    private _dualTemplate: cc.Node;
    private _singleRows: cc.Node[] = [];
    private _dualRows: cc.Node[] = [];

    /**
     * @param sectionNode 区块根节点($Score / $Showdown / $Showdown2)
     * @param cardsContainerName 标题公牌容器名
     * @param childsName 行容器名
     * @param singleTemplate 单套行模板($Score_Child,三个区共用)
     * @param dualTemplate 双套行模板($Score_Second_Child,仅 Score 区需要)
     */
    constructor(sectionNode: cc.Node, cardsContainerName: string, childsName: string, singleTemplate: cc.Node, dualTemplate: cc.Node = null) {
        this._node = sectionNode;
        this._cardsContainer = cc.find(`Title/${cardsContainerName}`, sectionNode);
        this._rowContainer = cc.find(`Shows/${childsName}`, sectionNode);
        this._singleTemplate = singleTemplate;
        this._dualTemplate = dualTemplate;
    }

    public get node(): cc.Node {
        return this._node;
    }

    public show(players: HistoryPlayerInfo[], model: HistoryHandModel, cardCount: number, mode: ScoreRowMode, titleCards: number[], pot: number) {
        this._node.active = players.length > 0;
        setChildLabel(this._node, 'Title/player/num', `${players.length}`);
        setChildLabel(this._node, 'Title/coin/num', StringHelper.GetLongString(pot));
        this.refreshCards(titleCards);
        this._renderInsurance(model.insurancePool);
        const useDual = mode === ScoreRowMode.DualBoard;
        const activeRows = useDual ? this._dualRows : this._singleRows;
        const hiddenRows = useDual ? this._singleRows : this._dualRows;
        hiddenRows.forEach(n => (n.active = false));
        ensureRows(this._rowContainer, useDual ? this._dualTemplate : this._singleTemplate, activeRows, players.length);
        players.forEach((player, i) => {
            const go = activeRows[i];
            // 模板 cards_position 原点不同,双套模板需要补偿(对齐老版)
            const posNode = go.getChildByName('cards_position');
            if (posNode) posNode.x = CARDS_POSITION_X + (useDual ? CARDS_POSITION_SECOND_OFFSET : 0);
            switch (mode) {
                case ScoreRowMode.DualBoard:
                    this._renderDualRow(go, player, model, cardCount);
                    break;
                case ScoreRowMode.SecondBoard:
                    this._renderSecondBoardRow(go, player, model, cardCount);
                    break;
                default:
                    this._renderSingleRow(go, player, model, cardCount);
                    break;
            }
        });
    }

    /** 发发看揭示公牌后单独刷新(标题公牌+每行公牌) */
    public refreshCards(titleCards: number[]) {
        refreshTitleCards(this._cardsContainer, titleCards);
    }

    /** 单套切换残留清理:清空标题标签(对齐老版 Showdown2 残留修复) */
    public clearLabels() {
        setChildLabel(this._node, 'Title/player/num', '');
        setChildLabel(this._node, 'Title/coin/num', '');
    }

    private _renderInsurance(insurancePool: number) {
        const insurance = cc.find('Shows/insurance', this._node);
        if (!insurance) return;
        insurance.active = insurancePool !== 0;
        setChildLabel(insurance, 'value', StringHelper.GetSignedLongString(insurancePool));
    }

    private _renderRowCommon(go: cc.Node, player: HistoryPlayerInfo) {
        setChildLabel(go, 'cards_position/nick/label', StringHelper.LengthNick(player.userName));
        setChildLabel(go, 'SB/label', PLAYER_POSITION_ABBR[player.playerPosition] ?? '');
        setChildLabel(go, 'score', player.insuranceGain !== 0 ? StringHelper.GetSignedLongString(player.insuranceGain) : '');
    }

    /** 对齐老版 SetPlayerCardItem(单套) */
    private _renderSingleRow(go: cc.Node, player: HistoryPlayerInfo, model: HistoryHandModel, cardCount: number) {
        this._renderRowCommon(go, player);
        setChildLabel(go, 'win', StringHelper.GetLongString(player.winAnte));
        setChildLabel(go, 'pai_type', getCardTypeName(player.maxCardType));
        const handCards = cc.find('cards_position/hand_cards', go);
        const publicCards = cc.find('cards_position/public_cards', go);
        layoutDetailHandCards(handCards, cardCount, SCORE_HAND_LEFT_X, SCORE_HAND_RIGHT_X, player.handCards?.length > 0 ? player.handCards : null);
        publicCards.children.forEach((item, index) => {
            item.active = model.publicCards[index] > 0;
            if (item.active) setCardSprite(item, model.publicCards[index]);
        });
        this._applyHighlight(handCards, publicCards, player.maxCardIndex);
    }

    /** 对齐老版 SetShowdown2CardItem(第二套结算,用单套模板渲染第二套数据) */
    private _renderSecondBoardRow(go: cc.Node, player: HistoryPlayerInfo, model: HistoryHandModel, cardCount: number) {
        this._renderRowCommon(go, player);
        setChildLabel(go, 'win', player.winAnte2?.length > 1 ? StringHelper.GetLongString(player.winAnte2[1]) : '');
        setChildLabel(go, 'pai_type', player.maxCardType2 != null ? getCardTypeName(player.maxCardType2) : '');
        const handCards = cc.find('cards_position/hand_cards', go);
        const publicCards = cc.find('cards_position/public_cards', go);
        layoutDetailHandCards(handCards, cardCount, SCORE_HAND_LEFT_X, SCORE_HAND_RIGHT_X, player.handCards?.length > 0 ? player.handCards : null);
        publicCards.children.forEach((item, index) => {
            const cardVal = model.secondPublicCards[index] || 0;
            item.active = cardVal > 0;
            if (item.active) setCardSprite(item, cardVal);
        });
        this._applyHighlight(handCards, publicCards, player.maxCardIndex2);
    }

    /** 对齐老版 SetPlayerSecondCardItem(双套 Score 行:两排公牌+两套高亮) */
    private _renderDualRow(go: cc.Node, player: HistoryPlayerInfo, model: HistoryHandModel, cardCount: number) {
        this._renderRowCommon(go, player);
        setChildLabel(go, 'win1', StringHelper.GetDecimalN((player.winAnte2?.[0] ?? 0) / 100));
        setChildLabel(go, 'win2', StringHelper.GetDecimalN((player.winAnte2?.[1] ?? 0) / 100));
        setChildLabel(go, 'pai_type', getCardTypeName(player.maxCardType));
        const handCards = cc.find('cards_position/hand_cards', go);
        const publicCards1 = cc.find('cards_position/public_cards/cards1', go);
        const publicCards2 = cc.find('cards_position/public_cards/cards2', go);
        layoutDetailHandCards(handCards, cardCount, SCORE2_HAND_LEFT_X, SCORE2_HAND_RIGHT_X, player.handCards?.length > 0 ? player.handCards : null);
        for (let i = 0; i < 5; i++) {
            const card1 = publicCards1.children[i];
            const card2 = publicCards2.children[i];
            if (!card1 || !card2) continue;
            if (model.publicCards[i] === 0) {
                card1.active = false;
                card2.active = false;
            } else {
                card1.active = true;
                setCardSprite(card1, model.publicCards[i]);
                card2.active = true;
                setCardSprite(card2, model.secondPublicCards[i]);
            }
        }
        // 两套高亮合并处理(避免第二套被第一套覆盖,对齐老版修复)
        const hasHighlight1 = player.maxCardIndex?.length > 0;
        const hasHighlight2 = player.maxCardIndex2?.length > 0;
        const allNodes = [...handCards.children, ...publicCards1.children, ...publicCards2.children];
        if (!hasHighlight1 && !hasHighlight2) {
            allNodes.forEach(n => setCardGray(n, false));
            return;
        }
        allNodes.forEach(n => setCardGray(n, true));
        if (hasHighlight1) this._lightUp(player.maxCardIndex, handCards, publicCards1);
        if (hasHighlight2) this._lightUp(player.maxCardIndex2, handCards, publicCards2);
    }

    /** 赢牌高亮:索引>=5 是手牌(减5),否则是公牌下标 */
    private _applyHighlight(handCards: cc.Node, publicCards: cc.Node, maxCardIndex: number[]) {
        const allNodes = [...handCards.children, ...publicCards.children];
        if (!(maxCardIndex?.length > 0)) {
            allNodes.forEach(n => setCardGray(n, false));
            return;
        }
        allNodes.forEach(n => setCardGray(n, true));
        this._lightUp(maxCardIndex, handCards, publicCards);
    }

    private _lightUp(indexes: number[], handCards: cc.Node, publicCards: cc.Node) {
        for (const idx of indexes) {
            const child = idx >= 5 ? handCards.children[idx - 5] : publicCards.children[idx];
            if (child) setCardGray(child, false);
        }
    }
}
