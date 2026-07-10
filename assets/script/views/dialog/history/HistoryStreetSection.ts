import { StringHelper } from '../../../helper/StringHelper';
import { ensureRows, refreshTitleCards, setChildLabel } from './HistoryCardHelper';
import { formatRaiseTimes, HistoryActionInfo, HistoryActionType, HistoryStreetModel, PLAYER_ACTION_ABBR, PLAYER_POSITION_ABBR } from './HistoryReplayModel';

// 对齐 h5 UGUIUtil 常量：TEXT_GREEN / TEXT_RED / TEXT_GREEN_DEEP / TEXT_GRAY

const COLOR_GREEN = cc.color(128, 205, 16); // #80CD10

const COLOR_RED = cc.color(255, 67, 104); // #FF4368

const COLOR_TEAL = cc.color(57, 194, 178); // #39C2B2

const COLOR_GRAY = cc.color(157, 157, 157); // #9D9D9D

// Unity Color32(198,198,198,160)：仅用于 AllIn 时 win 标签
const COLOR_GRAY_ALLIN = cc.color(198, 198, 198);

const { ccclass, property, menu } = cc._decorator;

/**
 * 牌谱详情街道区块(Preflop/Flop/Turn/River)。
 * Flop/Turn/River 由 UITexasHistory 用同一 prefab 实例化后 setup() 区分;
 * Preflop 是 UITexasHistory.prefab 内的常驻节点(标题空心牌/无公牌容器),编辑器绑定本组件。
 * 行节点从模板克隆复用,克隆体内部子节点按路径查找。
 */
@ccclass
@menu('Dialog/History/HistoryStreetSection')
export default class HistoryStreetSection extends cc.Component {
    @property({ type: cc.Label, displayName: '标题文字(Title/flag)' })
    private flagLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: '玩家数标签(Title/player/num,Preflop 无则留空)' })
    private playerNumLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: '底池标签(Title/coin/num)' })
    private potLabel: cc.Label = null;
    @property({ type: cc.Node, displayName: '标题公牌容器(Title/$Flop_Cards,Preflop 留空)' })
    private cardsContainer: cc.Node = null;
    @property({ type: cc.Node, displayName: '行容器(Shows/$Flop_Childs)' })
    private rowContainer: cc.Node = null;
    @property({ type: cc.Node, displayName: '行模板(行容器内的模板子节点)' })
    private rowTemplate: cc.Node = null;
    @property({ displayName: '剩余筹码不带 P: 前缀(仅 Preflop,对齐老版)' })
    private stackAsRaw: boolean = false;
    private _rows: cc.Node[] = [];
    private _templateDetached: boolean = false;

    /** 实例化后的标题定制:改标题文字、补公牌位(prefab 默认 Flop 3 张,Turn 4 / River 5) */
    public setup(flagText: string, titleCardCount: number) {
        this.flagLabel.string = flagText;
        while (this.cardsContainer.childrenCount < titleCardCount) {
            const card = cc.instantiate(this.cardsContainer.children[0]);
            card.parent = this.cardsContainer;
        }
    }

    public show(street: HistoryStreetModel, publicCards: number[]) {
        this.node.active = street.rows.length > 0;
        if (this.playerNumLabel) this.playerNumLabel.string = `${street.rows.length}`;
        if (street.rows.length > 0) {
            this.potLabel.string = StringHelper.GetLongString(street.pot);
        }
        // 公牌不受行数限制:全下等场景该街无动作但牌已发出
        refreshTitleCards(this.cardsContainer, publicCards);
        this._detachTemplateOnce();
        ensureRows(this.rowContainer, this.rowTemplate, this._rows, street.rows.length);
        street.rows.forEach((row, i) => this._renderRow(this._rows[i], row));
    }

    /** 模板延迟摘除:区块常驻在未激活的 $content 下,不能依赖 onLoad 时序 */
    private _detachTemplateOnce() {
        if (this._templateDetached) return;
        this._templateDetached = true;
        this.rowTemplate.removeFromParent(false);
    }

    /** 对齐老版 SetPlayerItem */
    private _renderRow(go: cc.Node, row: HistoryActionInfo) {
        setChildLabel(go, 'player_nick', row.nickName);
        const stackStr = StringHelper.GetDecimalN(row.leftChips / 100);
        setChildLabel(go, 'win', this.stackAsRaw ? stackStr : 'P:' + stackStr);
        setChildLabel(go, 'SB/label', PLAYER_POSITION_ABBR[row.playerPosition] ?? '');
        // bet/raise 按加注次数显示 B / R / nB
        let actionStr: string;
        if (row.action === HistoryActionType.Bet || row.action === HistoryActionType.Raise) {
            actionStr = formatRaiseTimes(row.raiseTimes, PLAYER_ACTION_ABBR[row.action], PLAYER_ACTION_ABBR[HistoryActionType.Raise], 'B');
        } else {
            actionStr = PLAYER_ACTION_ABBR[row.action] ?? '';
        }
        setChildLabel(go, 'CC/action', actionStr);
        setChildLabel(go, 'CC/chip', StringHelper.GetLongString(row.actionChip));
        const bg = cc.find('CC/BG', go);
        const actionBadge = cc.find('CC', go);
        // actionBadge (CC 节点 47×47) 自带 Sprite；fold 时 BG opacity<255 会透出小正方形，需同步染色
        let bgColor: cc.Color;
        let isFold = false;
        if (row.action > HistoryActionType.None && row.action < HistoryActionType.Straddle) {
            // SB/BB/C/X → green
            bgColor = COLOR_GREEN;
        } else if (row.action > HistoryActionType.Check && row.action < HistoryActionType.Fold) {
            // S/B/R/3B/A → red
            bgColor = COLOR_RED;
        } else if (row.action === HistoryActionType.Insure) {
            // INS → teal
            bgColor = COLOR_TEAL;
        } else {
            // Fold（或 None）→ gray
            bgColor = COLOR_GRAY;
            isFold = true;
        }
        if (bg) {
            bg.color = bgColor;
            bg.opacity = isFold ? 198 : 255;
        }
        if (actionBadge) {
            actionBadge.color = isFold ? bgColor : cc.Color.WHITE;
        }
        const win = go.getChildByName('win');
        if (win) {
            if (row.action === HistoryActionType.AllIn) {
                win.color = COLOR_GRAY_ALLIN;
                win.opacity = 160;
            } else {
                win.color = cc.Color.WHITE;
                win.opacity = 255;
            }
        }
    }
}
