import { StringHelper } from '../../../helper/StringHelper';
import { i18nMgr } from '../../../i18n/i18nMgr';
import RemoteSprite from '../../widget/RemoteSprite';
import { setCardSprite } from './HistoryCardHelper';
import { getActionNumByName, getCardTypeName, HistoryActionType } from './HistoryReplayModel';

/**
 * 操作动作 i18n key 映射,下标对应 HistoryActionType
 */
const PLAYER_ACTION_I18N_KEYS = [
    '', // 0: 无操作
    'UISB', // 1: small blind → 小盲
    'UIBB', // 2: big blind → 大盲
    'UITexas_call', // 3: call → 跟注
    '', // 4: check → 过牌 (无专用key,直接写)
    '', // 5: straddle → 偷鸡 (直接写)
    'UITexas_Bet', // 6: bet → 下注
    'adaptation10045', // 7: raise → 加注
    '', // 8: 3Bet (组合显示)
    'adaptation30074', // 9: all in → 全下
    'UITexas_fold', // 10: fold → 弃牌
    '' // 11: insure → 保险 (直接写)
];

// ── 私牌排列锚点 (取自 prefab 中 cardS1 / cardS6 的初始 x) ──
const HAND_CARD_LEFT_X = -290.378;

const HAND_CARD_RIGHT_X = -144.331;

const HAND_CARD_Y = 29;

const HAND_CARD_WIDTH = 84;

const HAND_CARD_VISIBLE_GAP = 4;

// ── 公牌位置常量 ──

const PUBLIC_CARD_SINGLE_Y = 29; // 单套公牌 Y (与私牌同行)

const PUBLIC_CARD_UPPER_Y = 65.531; // 双套公牌上排 Y

const PUBLIC_CARD_LOWER_Y = -72.164; // 双套公牌下排 Y
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

    protected onLoad(): void {
        this.playHeadImg = this.headNode.getComponent(RemoteSprite) || this.headNode.addComponent(RemoteSprite);
    }

    public setData(data: HistoryPlayerCardData) {
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

    /**
     * 私牌左对齐紧密排列(无数据显示2张牌背):
     * spacing = min(牌宽+间隙, (rightX-leftX)/(count-1)),牌多时压缩到右边界内
     */
    private _setHandCards(cards: number[]) {
        const showBack = !cards || cards.length === 0;
        const count = showBack ? 2 : cards.length;
        const spacing = count > 1 ? Math.min(HAND_CARD_WIDTH + HAND_CARD_VISIBLE_GAP, (HAND_CARD_RIGHT_X - HAND_CARD_LEFT_X) / (count - 1)) : 0;
        for (let i = 0; i < this.handCardNodes.length; i++) {
            const card = this.handCardNodes[i];
            if (i < count) {
                card.active = true;
                card.x = count === 1 ? HAND_CARD_LEFT_X : HAND_CARD_LEFT_X + i * spacing;
                card.y = HAND_CARD_Y;
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
        this.node.height = isDualBoard ? 300 : 240;
        const upperY = isDualBoard ? PUBLIC_CARD_UPPER_Y : PUBLIC_CARD_SINGLE_Y;
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
                card.y = PUBLIC_CARD_LOWER_Y;
                setCardSprite(card, publicCards2[index]);
            } else {
                card.active = false;
            }
        });
    }

    private _setCardType(cardType: number) {
        let name = getCardTypeName(cardType);
        if (!name) {
            name = i18nMgr.Get('UITexas_fold') || '弃牌';
        }
        this.ctLabel.string = name;
    }

    private _setAction(actName: string, actChip: number, raiseTimes: number) {
        const actNum = getActionNumByName(actName);
        let actionStr = '';
        if (actNum === HistoryActionType.Bet || actNum === HistoryActionType.Raise) {
            if (raiseTimes <= 1) {
                actionStr = this._getActionI18N(actNum);
            } else if (raiseTimes === 2) {
                actionStr = this._getActionI18N(HistoryActionType.Raise);
            } else {
                actionStr = raiseTimes + this._getActionI18N(HistoryActionType.Raise);
            }
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
        switch (actNum) {
            case HistoryActionType.Check:
                return '过牌';
            case HistoryActionType.Straddle:
                return '偷鸡';
            case HistoryActionType.ThreeBet:
                return '3Bet';
            case HistoryActionType.Insure:
                return '保险';
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
