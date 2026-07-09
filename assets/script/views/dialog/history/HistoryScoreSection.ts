import { StringHelper } from '../../../helper/StringHelper';
import { ensureRows, layoutDetailHandCards, refreshTitleCards, setCardGray, setCardSprite, setChildLabel } from './HistoryCardHelper';
import { getCardTypeName, HistoryHandModel, HistoryPlayerInfo, PLAYER_POSITION_ABBR } from './HistoryReplayModel';

const { ccclass, property, menu } = cc._decorator;

/** 结算行渲染模式 */
export enum ScoreRowMode {
    /** 单套牌局行(Score 单套 / Showdown):第一套盈亏+公牌+高亮,用单套模板 */
    FirstBoard = 0,
    /** 双套牌局的 Score 行:两个盈亏+两排公牌+两套高亮,用双套模板 */
    DualBoard = 1,
    /** 双套牌局的 Showdown2 行:第二套盈亏+第二套公牌+高亮,用单套模板 */
    SecondBoard = 2
}

export interface ScoreSectionShowOptions {
    players: HistoryPlayerInfo[];
    model: HistoryHandModel;
    cardCount: number;
    mode: ScoreRowMode;
    titleCards: number[];
    pot: number;
}

/** 行手牌排列锚点,从模板节点初始位置读出(prefab 是唯一数据源) */
type HandAnchor = { leftX: number; rightX: number };

/**
 * 牌谱详情结算区块(Score/Showdown/Showdown2)。
 * Showdown/Showdown2 由 UITexasHistory 用同一 prefab 实例化(仅单套模板);
 * Score 是 UITexasHistory.prefab 内的常驻节点(带双套模板),编辑器绑定本组件。
 * 行节点从模板克隆复用,克隆体内部子节点按路径查找。
 */
@ccclass
@menu('Dialog/History/HistoryScoreSection')
export default class HistoryScoreSection extends cc.Component {
    @property({ type: cc.Label, displayName: '玩家数标签(Title/player/num)' })
    private playerNumLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: '底池标签(Title/coin/num)' })
    private potLabel: cc.Label = null;
    @property({ type: cc.Node, displayName: '标题公牌容器(Title/$Xxx_PublicCards)' })
    private cardsContainer: cc.Node = null;
    @property({ type: cc.Node, displayName: '行容器(Shows/$Xxx_Childs)' })
    private rowContainer: cc.Node = null;
    @property({ type: cc.Node, displayName: '保险行(Shows/insurance)' })
    private insuranceNode: cc.Node = null;
    @property({ type: cc.Label, displayName: '保险金额标签(Shows/insurance/value)' })
    private insuranceValueLabel: cc.Label = null;
    @property({ type: cc.Node, displayName: '单套行模板(行容器内)' })
    private singleTemplate: cc.Node = null;
    @property({ type: cc.Node, displayName: '双套行模板(行容器内,仅 Score 区需要)' })
    private dualTemplate: cc.Node = null;
    private _singleRows: cc.Node[] = [];
    private _dualRows: cc.Node[] = [];
    private _templatesDetached: boolean = false;
    private _singleAnchor: HandAnchor = null;
    private _dualAnchor: HandAnchor = null;

    public show(opts: ScoreSectionShowOptions) {
        const { players, model, cardCount, mode, titleCards, pot } = opts;
        this.node.active = players.length > 0;
        this.playerNumLabel.string = `${players.length}`;
        this.potLabel.string = StringHelper.GetLongString(pot);
        this.refreshCards(titleCards);
        this._renderInsurance(model.insurancePool);
        this._detachTemplatesOnce();
        const useDual = mode === ScoreRowMode.DualBoard;
        const activeRows = useDual ? this._dualRows : this._singleRows;
        const hiddenRows = useDual ? this._singleRows : this._dualRows;
        hiddenRows.forEach(n => (n.active = false));
        ensureRows(this.rowContainer, useDual ? this.dualTemplate : this.singleTemplate, activeRows, players.length);
        players.forEach((player, i) => {
            const go = activeRows[i];
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

    /** 发发看揭示公牌后单独刷新标题公牌 */
    public refreshCards(titleCards: number[]) {
        refreshTitleCards(this.cardsContainer, titleCards);
    }

    /** 单套切换残留清理:清空标题标签(对齐老版 Showdown2 残留修复) */
    public clearLabels() {
        this.playerNumLabel.string = '';
        this.potLabel.string = '';
    }

    /** 模板延迟摘除+锚点读取:区块常驻在未激活的 $content 下,不能依赖 onLoad 时序 */
    private _detachTemplatesOnce() {
        if (this._templatesDetached) return;
        this._templatesDetached = true;
        this._singleAnchor = this._readHandAnchor(this.singleTemplate);
        this.singleTemplate.removeFromParent(false);
        if (this.dualTemplate) {
            this._dualAnchor = this._readHandAnchor(this.dualTemplate);
            this.dualTemplate.removeFromParent(false);
        }
    }

    private _readHandAnchor(template: cc.Node): HandAnchor {
        const cards = cc.find('cards_position/hand_cards', template).children;
        return { leftX: cards[0].x, rightX: cards[cards.length - 1].x };
    }

    private _renderInsurance(insurancePool: number) {
        this.insuranceNode.active = insurancePool !== 0;
        this.insuranceValueLabel.string = StringHelper.GetSignedLongString(insurancePool);
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
        layoutDetailHandCards(
            handCards,
            cardCount,
            this._singleAnchor.leftX,
            this._singleAnchor.rightX,
            player.handCards?.length > 0 ? player.handCards : null
        );
        refreshTitleCards(publicCards, model.publicCards);
        this._applyHighlight(handCards, publicCards, player.maxCardIndex);
    }

    /** 对齐老版 SetShowdown2CardItem(第二套结算,用单套模板渲染第二套数据) */
    private _renderSecondBoardRow(go: cc.Node, player: HistoryPlayerInfo, model: HistoryHandModel, cardCount: number) {
        this._renderRowCommon(go, player);
        setChildLabel(go, 'win', player.winAnte2?.length > 1 ? StringHelper.GetLongString(player.winAnte2[1]) : '');
        setChildLabel(go, 'pai_type', player.maxCardType2 != null ? getCardTypeName(player.maxCardType2) : '');
        const handCards = cc.find('cards_position/hand_cards', go);
        const publicCards = cc.find('cards_position/public_cards', go);
        layoutDetailHandCards(
            handCards,
            cardCount,
            this._singleAnchor.leftX,
            this._singleAnchor.rightX,
            player.handCards?.length > 0 ? player.handCards : null
        );
        refreshTitleCards(publicCards, model.secondPublicCards);
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
        layoutDetailHandCards(handCards, cardCount, this._dualAnchor.leftX, this._dualAnchor.rightX, player.handCards?.length > 0 ? player.handCards : null);
        // 两排公牌显隐都由第一套是否发出决定,牌面各取各的(对齐老版)
        for (let i = 0; i < 5; i++) {
            const card1 = publicCards1.children[i];
            const card2 = publicCards2.children[i];
            if (!card1 || !card2) continue;
            const visible = model.publicCards[i] > 0;
            card1.active = visible;
            card2.active = visible;
            if (visible) {
                setCardSprite(card1, model.publicCards[i]);
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
