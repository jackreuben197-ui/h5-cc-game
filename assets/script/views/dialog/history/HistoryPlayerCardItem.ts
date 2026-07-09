import { StringHelper } from '../../../helper/StringHelper';
import { i18nMgr } from '../../../i18n/i18nMgr';
import RemoteSprite from '../../widget/RemoteSprite';
import { setCardSprite } from './HistoryCardHelper';
import { formatRaiseTimes, getActionNumByName, getCardTypeName, HistoryActionType } from './HistoryReplayModel';

/**
 * 操作动作 i18n key 映射,下标对应 HistoryActionType(对齐 Unity UITexasReplay 系列的取词)
 */
const PLAYER_ACTION_I18N_KEYS = [
    '', // 0: 无操作
    'UISB', // 1: small blind → 小盲
    'UIBB', // 2: big blind → 大盲
    'UITexas_call', // 3: call → 跟注
    'adaptation10315', // 4: check → 让牌
    '', // 5: straddle (无专用key,用通用术语字面量)
    'UITexas_Bet', // 6: bet → 下注
    'adaptation10045', // 7: raise → 加注
    '', // 8: 3Bet (通用术语字面量)
    'adaptation30074', // 9: all in → 全下
    'UITexas_fold', // 10: fold → 弃牌
    'adaptation10179' // 11: insure → 保险
];

const HAND_CARD_VISIBLE_GAP = 4;

// 单套牌局的行高(双套行高取 prefab 根节点默认高度)
const SINGLE_BOARD_HEIGHT = 240;

const COLOR_WIN = cc.color(255, 80, 80);

const COLOR_LOSE = cc.color(80, 160, 255);

const COLOR_MINE = cc.color(220, 186, 130);

/**
 * 牌谱概览 - 单个玩家行数据
 */
export interface HistoryPlayerCardData {
    userName: string;
    headPic: string;
    handCards: number[];
    publicCards: number[];
    publicCards2?: number[];
    cardType: number;
    cardType2?: number;
    actName: string;
    actChip: number;
    raiseTimes: number;
    winAnte: number;
    winAnte2?: number;
    isMine: boolean;
}

const { ccclass, property, menu } = cc._decorator;

/**
 * 牌谱概览卡(prefab 迁自 pokerqueen playerCardNode,裸 Sprite 结构),主节点走 @property 编辑器绑定。
 * 头像 RemoteSprite 在 onLoad 运行时挂到头像节点上(prefab 里只有普通 Sprite)。
 * 卡牌排列锚点(私牌左右界/公牌两排 Y)首次 setData 时从 prefab 初始位置读出,不在代码里写死。
 */
@ccclass
@menu('Dialog/History/HistoryPlayerCardItem')
export default class HistoryPlayerCardItem extends cc.Component {
    @property({ type: cc.Node, displayName: '头像节点(playHeadImg,运行时挂 RemoteSprite)' })
    private headNode: cc.Node = null;
    @property({ type: cc.Label, displayName: '玩家昵称(playHeadImg/playerName)' })
    private playerName: cc.Label = null;
    @property({ type: [cc.Node], displayName: '私牌节点(cardS1~cardS6 顺序拖入)' })
    private handCardNodes: cc.Node[] = [];
    @property({ type: [cc.Node], displayName: '第一套公牌节点(cardP1~cardP5 顺序拖入)' })
    private publicCardNodes: cc.Node[] = [];
    @property({ type: [cc.Node], displayName: '第二套公牌节点(cardP1_b~cardP5_b 顺序拖入)' })
    private publicCardNodesB: cc.Node[] = [];
    @property({ type: cc.Label, displayName: '牌型名称(cardType/ctLabel)' })
    private ctLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: '最后操作动作(opAction)' })
    private opAction: cc.Label = null;
    @property({ type: cc.Label, displayName: '最后操作筹码(opNum)' })
    private opNum: cc.Label = null;
    @property({ type: cc.Label, displayName: '第一套盈亏(profit)' })
    private profit: cc.Label = null;
    @property({ type: cc.Label, displayName: '第二套盈亏(profit_b)' })
    private profitB: cc.Label = null;
    private playHeadImg: RemoteSprite = null;
    // ==================== 排列锚点(首次 setData 从 prefab 初始位置读取) ====================
    private _anchorsReady: boolean = false;
    private _handLeftX: number = 0;
    private _handRightX: number = 0;
    private _handY: number = 0;
    private _handCardWidth: number = 0;
    private _pubUpperY: number = 0;
    private _pubLowerY: number = 0;
    private _dualBoardHeight: number = 0;

    protected onLoad(): void {
        this.playHeadImg = this.headNode.getComponent(RemoteSprite) || this.headNode.addComponent(RemoteSprite);
        this._disableCardWidgets();
    }

    /**
     * 卡牌位置全部由代码按牌数动态排布,但 prefab 卡牌节点残留了 cc.Widget(alignMode=ON_WINDOW_RESIZE):
     * 首次激活时它会按设计位(6 张密排)整一次,覆盖代码排好的间距,导致首次进入时手牌叠在一起
     * (翻页后 Widget 不再重整,代码间距才生效)。禁用这些 Widget 让代码坐标始终唯一有效。
     */
    private _disableCardWidgets() {
        const nodes = [...this.handCardNodes, ...this.publicCardNodes, ...this.publicCardNodesB];
        for (const node of nodes) {
            const widget = node?.getComponent(cc.Widget);
            if (widget) widget.enabled = false;
        }
    }

    public setData(data: HistoryPlayerCardData) {
        this._initAnchorsOnce();
        this.playerName.string = StringHelper.LengthNick(data.userName);
        if (data.headPic) {
            this.playHeadImg.url = data.headPic;
        }
        this._setHandCards(data.handCards);
        this._setPublicCards(data.publicCards, data.publicCards2);
        this._setCardType(data.cardType);
        this._setAction(data.actName, data.actChip, data.raiseTimes);
        this._setProfit(data.winAnte, data.isMine, data.publicCards2, data.winAnte2);
    }

    /** 锚点必须在任何布局改写前读取;不用 onLoad 是因为节点可能挂在未激活的容器下 */
    private _initAnchorsOnce() {
        if (this._anchorsReady) return;
        this._anchorsReady = true;
        const firstHand = this.handCardNodes[0];
        this._handLeftX = firstHand.x;
        this._handRightX = this.handCardNodes[this.handCardNodes.length - 1].x;
        this._handY = firstHand.y;
        this._handCardWidth = firstHand.width;
        this._pubUpperY = this.publicCardNodes[0].y;
        this._pubLowerY = this.publicCardNodesB[0].y;
        this._dualBoardHeight = this.node.height;
    }

    /**
     * 私牌左对齐紧密排列(无数据显示2张牌背):
     * spacing = min(牌宽+间隙, (rightX-leftX)/(count-1)),牌多时压缩到右边界内
     */
    private _setHandCards(cards: number[]) {
        const showBack = !cards || cards.length === 0;
        const count = showBack ? 2 : cards.length;
        const spacing = count > 1 ? Math.min(this._handCardWidth + HAND_CARD_VISIBLE_GAP, (this._handRightX - this._handLeftX) / (count - 1)) : 0;
        for (let i = 0; i < this.handCardNodes.length; i++) {
            const card = this.handCardNodes[i];
            if (i < count) {
                card.active = true;
                card.x = count === 1 ? this._handLeftX : this._handLeftX + i * spacing;
                card.y = this._handY;
                card.zIndex = i;
                setCardSprite(card, showBack ? 0 : cards[i] || 0);
            } else {
                card.active = false;
            }
        }
    }

    /**
     * 单套牌局: 上排公牌 Y 移到与私牌同行,下排隐藏,容器高度收窄
     * 双套牌局: 上下两排各归原位
     */
    private _setPublicCards(publicCards: number[], publicCards2?: number[]) {
        const isDualBoard = publicCards2 && publicCards2.length > 0;
        this.node.height = isDualBoard ? this._dualBoardHeight : SINGLE_BOARD_HEIGHT;
        const upperY = isDualBoard ? this._pubUpperY : this._handY;
        this.publicCardNodes.forEach((card, index) => {
            if (publicCards && publicCards[index] > 0) {
                card.active = true;
                card.y = upperY;
                setCardSprite(card, publicCards[index]);
            } else {
                card.active = false;
            }
        });
        this.publicCardNodesB.forEach((card, index) => {
            if (isDualBoard && publicCards2[index] > 0) {
                card.active = true;
                card.y = this._pubLowerY;
                setCardSprite(card, publicCards2[index]);
            } else {
                card.active = false;
            }
        });
    }

    private _setCardType(cardType: number) {
        let name = getCardTypeName(cardType);
        if (!name) {
            name = i18nMgr.Get('UITexas_fold');
        }
        this.ctLabel.string = name;
    }

    private _setAction(actName: string, actChip: number, raiseTimes: number) {
        const actNum = getActionNumByName(actName);
        let actionStr: string;
        if (actNum === HistoryActionType.Bet || actNum === HistoryActionType.Raise) {
            actionStr = formatRaiseTimes(raiseTimes, this._getActionI18N(actNum), this._getActionI18N(HistoryActionType.Raise));
        } else {
            actionStr = this._getActionI18N(actNum);
        }
        if (actNum === HistoryActionType.Fold) {
            this.opAction.node.active = false;
            this.opNum.node.active = false;
        } else {
            this.opAction.node.active = true;
            this.opNum.node.active = true;
            this.opAction.string = actionStr;
            this.opNum.string = actChip > 0 ? StringHelper.GetLongString(actChip) : '';
        }
    }

    private _getActionI18N(actNum: number): string {
        const key = PLAYER_ACTION_I18N_KEYS[actNum];
        if (key) {
            return i18nMgr.Get(key) || '';
        }
        // 无专用 i18n key 的扑克通用术语(对齐 Unity 明细区缩写方案)
        switch (actNum) {
            case HistoryActionType.Straddle:
                return 'Straddle';
            case HistoryActionType.ThreeBet:
                return '3Bet';
            default:
                return '';
        }
    }

    private _setProfit(winAnte: number, isMine: boolean, publicCards2?: number[], winAnte2?: number) {
        const isDualBoard = publicCards2 && publicCards2.length > 0;
        this.profit.string = StringHelper.GetSignedLongString(winAnte);
        if (winAnte > 0) {
            this.profit.node.color = COLOR_WIN;
        } else if (winAnte < 0) {
            this.profit.node.color = COLOR_LOSE;
        } else {
            this.profit.node.color = cc.Color.WHITE;
        }
        if (isDualBoard && winAnte2 != null) {
            this.profitB.node.active = true;
            this.profitB.string = StringHelper.GetSignedLongString(winAnte2);
            if (winAnte2 > 0) {
                this.profitB.node.color = COLOR_WIN;
            } else if (winAnte2 < 0) {
                this.profitB.node.color = COLOR_LOSE;
            }
        } else {
            this.profitB.node.active = false;
        }
        if (isMine) {
            this.playerName.node.color = COLOR_MINE;
            this.profit.node.color = COLOR_MINE;
            if (this.profitB.node.active) {
                this.profitB.node.color = COLOR_MINE;
            }
        } else {
            this.playerName.node.color = cc.Color.WHITE;
        }
    }
}
