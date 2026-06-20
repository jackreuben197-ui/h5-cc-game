import { Code, Def, InsurancePotLimit, OutsCard, PotInsuranceBuy } from '@silenthill/agreement-web';
import { traceClass } from '../../../core/decorator/LogTrace';
import soundManager, { SoundEffectKey } from '../../../core/SoundManager';
import { OperatorMine, OpertionType } from '../../../data/room/texas/model/Operator';
import texasGamePersonalSettings from '../../../data/room/texas/TexasGamePersonalSettings';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataBasic from '../../../data/room/texas/TexasGameRoomDataBasic';
import TexasGameRoomDataPlayerMine from '../../../data/room/texas/TexasGameRoomDataPlayerMine';
import TexasGameRoomDataPublicCards from '../../../data/room/texas/TexasGameRoomDataPublicCards';
import TexasGameRoomDataSeatsStateManager from '../../../data/room/texas/TexasGameRoomDataSeatsStateManager';
import GameplayUtil from '../../../game/util/GameplayUtil';
import { StringHelper } from '../../../helper/StringHelper';
import { i18nMgr } from '../../../i18n/i18nMgr';
import ProtocolAgency from '../../../net/websocket/ProtocolAgency';
import UIComponentBaseDialog from '../../base/UIComponentDialogBase';
import AssetManager from '../../loader/AssetManager';
import TexasTableEvent from '../../scene/room/texas/events/TexasTableEvent';

const { ccclass, menu } = cc._decorator;

/** 六档投保按钮枚举（仅本组件内部使用） */
enum PoolType {
    NONE = 0,
    MIN_MONEY = 1,
    ALL = 2,
    HALF = 3,
    THIRD = 4,
    FIFTH = 5,
    EIGHTH = 6
}

/** 单张 outs 牌渲染器。 */
class InsuranceCardItem {
    public readonly sprite: cc.Sprite;
    public cardId: number = -1;
    public isOver: boolean = true;

    public constructor(public readonly node: cc.Node) {
        this.sprite = node.getComponent(cc.Sprite) || node.getChildByName('Image_InsuranceCard')?.getComponent(cc.Sprite) || null;
    }

    public get cardReadId(): number {
        return this.cardId % 15;
    }

    public updateItem(cardId: number): void {
        this.cardId = cardId;
        if (this.sprite) {
            const resName = GameplayUtil.CardNoToLocalResource(cardId);
            this.sprite.spriteFrame = AssetManager.getAsset(texasGamePersonalSettings.pokerCardType, resName);
        }
    }
}

/** 玩家行渲染器（自己/其他玩家） */
class PlayerItem {
    private readonly pokerNodes: cc.Sprite[] = [];
    private readonly textNickname: cc.Label = null;
    private readonly textOuts: cc.Label = null;
    private static readonly POKER_POS: Record<number, number[]> = {
        2: [-36.5, 36.5],
        4: [-66, -22, 22, 66],
        5: [-66, -33, 0, 33, 66],
        6: [-66, -40, -13, 13, 40, 66]
    };

    public constructor(public readonly node: cc.Node) {
        const pokerRoot = node.getChildByName('pokers') || node;
        for (let i = 0; i < 6; i++) {
            const n = pokerRoot.getChildByName(`Image_Card${i}`);
            if (n) this.pokerNodes.push(n.getComponent(cc.Sprite));
        }
        this.textNickname = node.getChildByName('Text_Nickname')?.getComponent(cc.Label) || null;
        this.textOuts = node.getChildByName('Text_Outs')?.getComponent(cc.Label) || null;
    }

    public updateItem(cards: number[], nickname: string, outs: number, handCards: number): void {
        const cardCount = Math.min(handCards, this.pokerNodes.length, cards.length);
        const posX = PlayerItem.POKER_POS[handCards] || PlayerItem.POKER_POS[2];
        for (let i = 0; i < this.pokerNodes.length; i++) {
            const sprite = this.pokerNodes[i];
            if (!sprite) continue;
            if (i < cardCount) {
                sprite.node.x = posX[i] ?? sprite.node.x;
                sprite.node.active = true;
                const resName = GameplayUtil.CardNoToLocalResource(cards[i]);
                sprite.spriteFrame = AssetManager.getAsset(texasGamePersonalSettings.pokerCardType, resName);
            } else {
                sprite.node.active = false;
            }
        }
        if (this.textNickname) this.textNickname.string = nickname;
        if (this.textOuts) {
            this.textOuts.string = outs >= 0 ? `${outs}${i18nMgr.Get('UIInsurance_ge')}outs` : i18nMgr.Get('UIInsurance_InsureIn');
        }
    }
}

export type UIGameplaySecuritySettingParam = {
    Operator: OperatorMine;
    Player: TexasGameRoomDataPlayerMine;
};

/**
 * 保险面板（自治组件版）
 *
 * 设计原则（与 Operation 一致）：
 *  - 父组件（UIRoomTexas）只调一次 `initData(mine)`，之后完全不管。
 *  - 脚本节点常驻 active=true，显隐通过 `_setVisible(b)` 切换 $back_click + Image_Dialog 这两个可视子节点，
 *    保证 @bindEvent 监听始终在线 —— 替代了 dialog 模型里 `openDialog/closeDialog` 的命令式开关。
 *  - PREPARE_OPERATION_MINE 是唯一的开关：opType=INSURANCE 时显示并渲染，否则隐藏。
 *
 * 数据来源：
 *  - mine (TexasGameRoomDataPlayerMine)         : operator(opType=INSURANCE/insurancePotLimitList/round/deadline...)
 *  - basicInfo (TexasGameRoomDataBasic)         : insuranceOpduration / insuranceForceBuyRatio / insuranceOdds / handCardNum
 *  - publicCards (TexasGameRoomDataPublicCards) : 顶部公共牌
 *  - seats (TexasGameRoomDataSeatsStateManager) : 玩家名字 / 手牌兜底
 *
 * 与服务端交互（统一走 TexasTableEvent）：
 *  - 购买当前池：CommitBuyInsurance(player, buyList, confirm=false) 进入下一池
 *  - 最后一池/超时/放弃：CommitBuyInsurance(player, buyList, confirm=true) 结束
 *  - 失败由 BuyInsuranceActive 消息处理；成功由 BuyInsurance 消息广播，并触发 mine.operator=null。
 *  - mine.operator=null → @bindEvent 触发 onOperatorChange → 自动隐藏。
 */
@ccclass
@menu('Scene/Room/Texas/Insurance/UIInsuranceNewPanel')
@traceClass({ level: 'debug' })
export default class UIInsuranceNewPanel extends UIComponentBaseDialog<UIGameplaySecuritySettingParam> {
    // ─── 数据源句柄 ──────────────────────────────────────
    private _player: TexasGameRoomDataPlayerMine = null;
    private _roomData: TexasGameRoomData = null;
    private _basic: TexasGameRoomDataBasic = null;
    private _publicCards: TexasGameRoomDataPublicCards = null;
    private _seats: TexasGameRoomDataSeatsStateManager = null;
    // ─── 节点缓存（按 prefab 结构 cc.find 一次性查全部） ──
    private backClickNode: cc.Node = null;
    private dialogNode: cc.Node = null;
    private scrollViewRoot: cc.Node = null;
    private scrollView: cc.ScrollView = null;
    private scrollViewport: cc.Node = null;
    private insuranceCardsRoot: cc.Node = null;
    private publicCardSprites: cc.Sprite[] = [];
    private playerMineNode: cc.Node = null;
    private playersContent: cc.Node = null;
    private playersNext: cc.Node = null;
    private playerTemplate: cc.Node = null;
    private multiPoolToggles: cc.Node = null;
    private multiPoolToggleTemplate: cc.Node = null;
    private insuranceCardsOver: cc.Node = null;
    private insuranceCardsSplit: cc.Node = null;
    private insuranceCardsOverContent: cc.Node = null;
    private insuranceCardsSplitContent: cc.Node = null;
    private insuranceCardOverTemplate: cc.Node = null;
    private insuranceCardSplitTemplate: cc.Node = null;
    private sortNumToggle: cc.Toggle = null;
    private sortGraToggle: cc.Toggle = null;
    private textPot: cc.Label = null;
    private textMainPut: cc.Label = null;
    private textInsuranceValue: cc.Label = null;
    private textPayValue: cc.Label = null;
    private textOuts: cc.Label = null;
    private textOddsOver: cc.Label = null;
    private textOddsSplit: cc.Label = null;
    private textCancel: cc.Label = null;
    private classicTurnText: cc.Label = null;
    private textDelayBean: cc.Label = null;
    private countDownImage: cc.Sprite = null;
    private buttonBuy: cc.Node = null;
    private buttonDelay: cc.Node = null;
    private buttonCancel: cc.Node = null;
    private poolButtons: { node: cc.Node; type: PoolType; checked: cc.Node; money: cc.Label }[] = [];
    // ─── 运行时状态 ──────────────────────────────────────
    private readonly _multiToggleNodes: cc.Node[] = [];
    private readonly _playerClones: cc.Node[] = [];
    private readonly _outsOverItems: InsuranceCardItem[] = [];
    private readonly _outsSplitItems: InsuranceCardItem[] = [];
    private readonly _cachedBuyList: PotInsuranceBuy.AsObject[] = [];
    // 该轮次内当前正在编辑的池索引（指向 operator.insurancePotLimitList）
    private _currentPotIndex: number = 0;
    private _currentPool: PoolType = PoolType.THIRD;
    // 当前池里的"反超 outs"对应投保额（分），下次提交时取整
    private _overOutsPayValue: number = 0;
    private _sortByGraphics: boolean = false;
    // 倒计时
    private _countDownEnd: number = 0;
    private _countDownTotal: number = 0;
    private _isCounting: boolean = false;
    private _clickedDelayTimes: number = 0;
    private _isCommitting: boolean = false;
    // ============================================================
    // 生命周期
    // ============================================================
    /**
     * 外部唯一入口：UIRoomTexas 拿到房间数据后调一次，传 mine 引用。
     * 后续显隐与刷新完全由组件自己监听 PREPARE_OPERATION_MINE 决定。
     */
    public initialize(param: UIGameplaySecuritySettingParam): void {
        this._player = param.Player;
        this._roomData = param.Player.roomData;
        this._basic = this._roomData.basicInfo;
        this._publicCards = this._roomData.publicCards;
        this._seats = this._roomData.seatsStateManager;
        const op = param.Operator;
        // this._bindEventsAndRefresh();
        this._cachedBuyList.length = 0;
        this._currentPotIndex = 0;
        this._currentPool = PoolType.THIRD;
        this._clickedDelayTimes = 0;
        this._isCommitting = false;
        // 倒计时
        this._countDownTotal = Math.max(1, op.totalOpDuration || this._basic.insuranceOpduration || 30);
        const now = Date.now() / 1000;
        const remain = op.deadlineTImestamp > 0 ? Math.max(0, op.deadlineTImestamp - now) : Math.max(0, op.leftOpDuration || 0);
        this._countDownEnd = now + remain;
        this._isCounting = remain > 0;
        this._refreshCountDownProgress(remain);
        // 多池切换条
        this._renderMultiPoolToggles();
        // 当前池
        this._refreshCurrentPot();
        this._publicCardsChange();
        this._refreshDelayButton(op.alreadyDelayTImes || 0);
        // 显示
        this._setVisible(true);
    }

    protected onLoad(): void {
        this._bindNodes();
        this._initStaticNodes();
        this._registerClicks();
        // 默认隐藏，等 mine.operator 触发 INSURANCE 时再亮起
        this._setVisible(false);
    }

    protected onEnable(): void {}

    protected onDisable(): void {
        // unBindEventsAll(this);
        this._clearTransientState();
    }

    protected update(): void {
        if (!this._isCounting) return;
        const now = Date.now() / 1000;
        const remain = Math.max(0, this._countDownEnd - now);
        if (remain == Math.floor(this._countDownTotal / 3)) {
            soundManager.playEffect(SoundEffectKey.ActionAlert);
        }
        if (remain == 3) {
            soundManager.playEffect(SoundEffectKey.CD3S);
        }
        this._refreshCountDownProgress(remain);
        if (remain <= 0) {
            this._isCounting = false;
            // 倒计时归零：把已缓存内容一次性提交并 confirm。
            // 之后服务端会清 mine.operator，组件自己监听到后会切到隐藏态。
            TexasTableEvent.CommitBuyInsurance(this._player, this._cachedBuyList.slice(), true);
            this._finishInsuranceOperation();
        }
    }
    // ============================================================
    // 节点绑定（按 prefab 结构 cc.find 一次性查全部）
    // ============================================================
    private _bindNodes(): void {
        const root = this.node;
        //this.backClickNode = root.getChildByName('$back_click') || root.getChildByName('back_click');
        const dialog = root.getChildByName('Image_Dialog');
        this.dialogNode = dialog;
        this.scrollViewRoot = cc.find('Image_Dialog/ScrollViewRoot', root);
        this.scrollView = this.scrollViewRoot?.getComponent(cc.ScrollView) || null;
        this.scrollViewport = cc.find('Viewport', this.scrollViewRoot);
        this.insuranceCardsRoot = cc.find('Viewport/InsuranceCards', this.scrollViewRoot);
        this.textPot = cc.find('Header/Text_Pot_title/Text_Pot', dialog)?.getComponent(cc.Label) || null;
        this.multiPoolToggles = cc.find('Header/MultiPoolToggles', dialog);
        this.multiPoolToggleTemplate = this.multiPoolToggles?.getChildByName('MultiPoolToggle') || null;
        this.playerMineNode = cc.find('Header/players_Content/Player_Mine', dialog);
        this.playersContent = cc.find('Header/players_Content/Players/view/players_Content', dialog);
        this.playersNext = cc.find('ScrollViewRoot/Viewport/InsuranceCards/Players_Next', dialog);
        this.playerTemplate = this.playersContent?.children.find(c => c.name === 'Player') || null;
        const publicCards = cc.find('Header/PublicCardContent/PublicCards', dialog);
        for (let i = 0; i < 5; i++) {
            const sp = publicCards?.getChildByName(`Image_PublicCard${i}`)?.getComponent(cc.Sprite) || null;
            this.publicCardSprites.push(sp);
        }
        this.insuranceCardsOver = cc.find('ScrollViewRoot/Viewport/InsuranceCards/InsuranceCardsOver', dialog);
        this.insuranceCardsSplit = cc.find('ScrollViewRoot/Viewport/InsuranceCards/InsuranceCardsSplit', dialog);
        this.insuranceCardsOverContent = this.insuranceCardsOver?.getChildByName('insuranceCardOver') || null;
        this.insuranceCardsSplitContent = this.insuranceCardsSplit?.getChildByName('insuranceCardSplit') || null;
        this.insuranceCardOverTemplate = this.insuranceCardsOverContent?.getChildByName('Image_InsuranceCard') || null;
        this.insuranceCardSplitTemplate = this.insuranceCardsSplitContent?.getChildByName('Image_InsuranceCard') || null;
        this.textOddsOver = cc.find('Label/Text_Odds_Over', this.insuranceCardsOver)?.getComponent(cc.Label) || null;
        this.textOddsSplit = cc.find('Label/Text_Odds_Split', this.insuranceCardsSplit)?.getComponent(cc.Label) || null;
        this.sortNumToggle = cc.find('ScrollViewRoot/Viewport/InsuranceCards/SortToggle/NumToggle', dialog)?.getComponent(cc.Toggle) || null;
        this.sortGraToggle = cc.find('ScrollViewRoot/Viewport/InsuranceCards/SortToggle/GraToggle', dialog)?.getComponent(cc.Toggle) || null;
        this.textMainPut = cc.find('ContentPar/Text_MainPut', dialog)?.getComponent(cc.Label) || null;
        this.textInsuranceValue = cc.find('ContentPar/Text_InsuranceValue', dialog)?.getComponent(cc.Label) || null;
        this.textPayValue = cc.find('ContentPar/Text_PayValue', dialog)?.getComponent(cc.Label) || null;
        this.textOuts = cc.find('ContentPar/Text_Outs', dialog)?.getComponent(cc.Label) || null;
        const find = (name: string) => cc.find(`ContentPar/OptionButtons/${name}`, dialog);
        const buildPool = (name: string, checkedName: string, moneyName: string, type: PoolType) => {
            const node = find(name);
            if (!node) return;
            this.poolButtons.push({
                node,
                type,
                checked: node.getChildByName(checkedName),
                money: node.getChildByName(moneyName)?.getComponent(cc.Label) || null
            });
        };
        buildPool('Button_Min', 'Image_Min_checked', 'Text_Min_money', PoolType.MIN_MONEY);
        buildPool('Button_All', 'Image_All_checked', 'Text_All_money', PoolType.ALL);
        buildPool('Button_Half', 'Image_Half_checked', 'Text_Half_money', PoolType.HALF);
        buildPool('Button_Third', 'Image_Third_checked', 'Text_Third_money', PoolType.THIRD);
        buildPool('Button_Fifth', 'Image_Fifth_checked', 'Text_Fifth_money', PoolType.FIFTH);
        buildPool('Button_Eighth', 'Image_Eighth_checked', 'Text_Eighth_money', PoolType.EIGHTH);
        this.buttonDelay = cc.find('SubstratumBut/Button_Delay', dialog);
        this.buttonCancel = cc.find('SubstratumBut/Button_Cancel', dialog);
        this.buttonBuy = cc.find('SubstratumBut/Button_Buy', dialog);
        this.textDelayBean = cc.find('Text_delay_bean', this.buttonDelay)?.getComponent(cc.Label) || null;
        this.countDownImage = cc.find('CountDownImage', this.buttonDelay)?.getComponent(cc.Sprite) || null;
        this.textCancel = cc.find('Text', this.buttonCancel)?.getComponent(cc.Label) || null;
        this.classicTurnText = cc.find('classicTurnText', this.buttonCancel)?.getComponent(cc.Label) || null;
    }

    private _initStaticNodes(): void {
        if (this.multiPoolToggleTemplate) this.multiPoolToggleTemplate.active = false;
        if (this.playerTemplate) {
            this.playersContent.children.filter(c => c.name === 'Player').forEach(c => (c.active = false));
        }
        if (this.playersNext) this.playersNext.active = false;
        if (this.insuranceCardOverTemplate) this.insuranceCardOverTemplate.active = false;
        if (this.insuranceCardSplitTemplate) this.insuranceCardSplitTemplate.active = false;
        this._hideAllPoolHighlights();
    }

    private _registerClicks(): void {
        //if (this.backClickNode) this.backClickNode.on('click', this._onClickBackdrop, this);
        if (this.buttonBuy) this.buttonBuy.on('click', this._onClickBuy, this);
        if (this.buttonCancel) this.buttonCancel.on('click', this._onClickCancel, this);
        if (this.buttonDelay) this.buttonDelay.on('click', this._onClickDelay, this);
        this.poolButtons.forEach(pb => pb.node.on('click', () => this._onClickPool(pb.type), this));
        if (this.sortNumToggle) {
            this.sortNumToggle.node.on('toggle', () => this.sortNumToggle.isChecked && this._onClickSort(false), this);
        }
        if (this.sortGraToggle) {
            this.sortGraToggle.node.on('toggle', () => this.sortGraToggle.isChecked && this._onClickSort(true), this);
        }
    }

    /**
     * 切换可视部分的显隐。
     * 脚本本身的 node 永远 active=true（这样 @bindEvent 监听不会被 onDisable 拔掉）；
     * 切的是它的两个顶层可视子节点（暗化背景 + 弹框）。
     */
    private _setVisible(b: boolean): void {
        //if (this.backClickNode) this.backClickNode.active = b;
        if (this.dialogNode) this.dialogNode.active = b;
    }
    /**
     * 保险流程的唯一开关：
     *  - opType=INSURANCE：渲染并显示
     *  - 其它（含 null / NORMAL / AGREESECPUB）：隐藏 + 清理临时态
    //  */
    // @bindEvent(TexasGameRoomDataPlayerMine.PREPARE_OPERATION_MINE, 'mine')
    // @traceMethod({ level: 'debug' })
    // private onOperatorChange(op: OperatorMine): void {
    //     if (!op || op.opType !== OpertionType.INSURANCE) {
    //         this._isCounting = false;
    //         this._clearTransientState();
    //         this._setVisible(false);
    //         return;
    //     }
    //     this._cachedBuyList.length = 0;
    //     this._currentPotIndex = 0;
    //     this._currentPool = PoolType.THIRD;
    //     // 倒计时
    //     this._countDownTotal = Math.max(1, op.totalOpDuration || this._basic.insuranceOpduration || 30);
    //     const now = Date.now() / 1000;
    //     const remain =
    //         op.deadlineTImestamp > 0
    //             ? Math.max(0, op.deadlineTImestamp - now)
    //             : Math.max(0, op.leftOpDuration || 0);
    //     this._countDownEnd = now + remain;
    //     this._isCounting = remain > 0;
    //     this._refreshCountDownProgress(remain);
    //     // 多池切换条
    //     this._renderMultiPoolToggles();
    //     // 当前池
    //     this._refreshCurrentPot();
    //     // 显示
    //     this._setVisible(true);
    // }

    private _publicCardsChange(): void {
        const cards = this._publicCards.publicCards || [];
        for (let i = 0; i < this.publicCardSprites.length; i++) {
            const sp = this.publicCardSprites[i];
            if (!sp) continue;
            const cardId = cards[i] ?? 0;
            const resName = GameplayUtil.CardNoToLocalResource(cardId);
            sp.spriteFrame = AssetManager.getAsset(texasGamePersonalSettings.pokerCardType, resName);
        }
    }
    // ============================================================
    // 多池切换
    // ============================================================
    private _renderMultiPoolToggles(): void {
        this._destroyArray(this._multiToggleNodes);
        const pots = this._currentOperator()?.insurancePotLimitList || [];
        const hasMulti = pots.length > 1;
        if (this.multiPoolToggles) this.multiPoolToggles.active = hasMulti;
        if (!hasMulti || !this.multiPoolToggleTemplate) return;
        pots.forEach((_pot, index) => {
            const toggleNode = cc.instantiate(this.multiPoolToggleTemplate);
            toggleNode.name = `Toggle${index}`;
            toggleNode.parent = this.multiPoolToggles;
            toggleNode.active = true;
            const label = toggleNode.getChildByName('Label')?.getComponent(cc.Label);
            if (label) label.string = `${i18nMgr.Get('UIInsurance_zhuchi2')} ${index + 1}`;
            const toggle = toggleNode.getComponent(cc.Toggle);
            const onSelect = () => {
                this._currentPotIndex = index;
                this._refreshCurrentPot();
                this._setToggleVisual(toggleNode, true);
                this._multiToggleNodes.forEach(n => n !== toggleNode && this._setToggleVisual(n, false));
            };
            if (toggle) {
                toggle.isChecked = index === 0;
                toggleNode.on('toggle', () => toggle.isChecked && onSelect(), this);
            } else {
                toggleNode.on('click', onSelect, this);
            }
            this._multiToggleNodes.push(toggleNode);
        });
        const first = this._multiToggleNodes[0];
        if (first) this._setToggleVisual(first, true);
    }

    private _setToggleVisual(node: cc.Node, isOn: boolean): void {
        if (!node) return;
        const toggle = node.getComponent(cc.Toggle);
        if (toggle) toggle.isChecked = isOn;
        const checkmark = node.getChildByName('checkmark') || node.getChildByName('Checkmark');
        if (checkmark) checkmark.active = isOn;
        const bg = node.getChildByName('Background');
        if (bg) bg.opacity = isOn ? 255 : 180;
    }
    // ============================================================
    // 单池刷新（主流程）
    // ============================================================
    private _refreshCurrentPot(): void {
        const pot = this._currentPot();
        if (!pot) return;
        this._renderPlayers(pot);
        this._renderOuts(pot);
        if (this.textPot) this.textPot.string = StringHelper.GetLongString(pot.potAmount);
        if (this.textMainPut) this.textMainPut.string = StringHelper.GetLongString(pot.bet + pot.insuranced);
        this._currentPool = PoolType.THIRD;
        this._applyForceBuyConstraint(pot);
        this._refreshPoolMoney(pot);
        this._refreshSelectedPool(pot);
        this._refreshCancelButton(pot);
    }

    private _renderPlayers(pot: InsurancePotLimit.AsObject): void {
        this._destroyArray(this._playerClones);
        if (this.playersNext) this.playersNext.active = false;
        const handCards = this._basic.handCardNum || 2;
        const mineSeatNo = this._player.seatNo;
        const minePlayer = this._seats.getSeatPlayer(mineSeatNo);
        const operator = this._currentOperator();
        const cardMap = new Map<number, number[]>(); // seatId → cards
        (operator?.playerCardsList || []).forEach(pc => cardMap.set(pc.seatId, pc.cardsList || []));
        if (this.playerMineNode && minePlayer) {
            this.playerMineNode.active = true;
            const cards = (cardMap.get(mineSeatNo) || minePlayer.cards || []).slice(0, handCards);
            new PlayerItem(this.playerMineNode).updateItem(cards, minePlayer.name, -1, handCards);
        }
        const otherSeats = (pot.outsDetailList || []).map(uo => uo.seatId).filter(sid => sid !== mineSeatNo);
        otherSeats.forEach((seatId, index) => {
            if (!this.playerTemplate) return;
            const parent = index < 2 ? this.playersContent : this.playersNext;
            if (!parent) return;
            if (parent === this.playersNext) this.playersNext.active = true;
            const clone = cc.instantiate(this.playerTemplate);
            clone.parent = parent;
            clone.active = true;
            this._playerClones.push(clone);
            const seat = this._seats.getSeatPlayer(seatId);
            const name = seat?.name || '';
            const cards = (cardMap.get(seatId) || seat?.cards || []).slice(0, handCards);
            const detail = pot.outsDetailList.find(uo => uo.seatId === seatId);
            const outsCount = detail ? detail.outsCardsList.length : 0;
            new PlayerItem(clone).updateItem(cards, name, outsCount, handCards);
        });
    }

    private _renderOuts(pot: InsurancePotLimit.AsObject): void {
        this._destroyOutsItems();
        const { overOuts, equalOuts } = this._splitOuts(pot);
        this._sortCards(overOuts);
        this._sortCards(equalOuts);
        if (this.insuranceCardsOver) this.insuranceCardsOver.active = overOuts.length > 0;
        if (this.insuranceCardsSplit) this.insuranceCardsSplit.active = equalOuts.length > 0;
        const overOdd = this._oddsFor(pot, overOuts.length);
        const equalOdd = this._oddsFor(pot, equalOuts.length);
        if (this.textOddsOver) this.textOddsOver.string = this._formatOdds(overOdd);
        if (this.textOddsSplit) this.textOddsSplit.string = this._formatOdds(equalOdd);
        overOuts.forEach((cardId, index) => {
            if (!this.insuranceCardOverTemplate) return;
            const clone = cc.instantiate(this.insuranceCardOverTemplate);
            clone.name = `over_${index}`;
            clone.parent = this.insuranceCardsOverContent || this.insuranceCardsOver;
            clone.active = true;
            const item = new InsuranceCardItem(clone);
            item.isOver = true;
            item.updateItem(cardId);
            this._outsOverItems.push(item);
        });
        equalOuts.forEach((cardId, index) => {
            if (!this.insuranceCardSplitTemplate) return;
            const clone = cc.instantiate(this.insuranceCardSplitTemplate);
            clone.name = `split_${index}`;
            clone.parent = this.insuranceCardsSplitContent || this.insuranceCardsSplit;
            clone.active = true;
            const item = new InsuranceCardItem(clone);
            item.isOver = false;
            item.updateItem(cardId);
            this._outsSplitItems.push(item);
        });
        const totalOuts = overOuts.length + equalOuts.length;
        if (this.textOuts) {
            this.textOuts.string = `${totalOuts}${i18nMgr.Get('UIInsurance_zhang')}`;
        }
    }

    /** 把 outsDetailList 中的 OutsCard 按 isEqual 分组并去重。 */
    private _splitOuts(pot: InsurancePotLimit.AsObject): { overOuts: number[]; equalOuts: number[] } {
        const overSet = new Set<number>();
        const equalSet = new Set<number>();
        (pot.outsDetailList || []).forEach(userOuts => {
            (userOuts.outsCardsList || []).forEach((c: OutsCard.AsObject) => {
                if (c.isEqual) equalSet.add(c.card);
                else overSet.add(c.card);
            });
        });
        return { overOuts: Array.from(overSet), equalOuts: Array.from(equalSet) };
    }
    // ============================================================
    // 档位（六档）逻辑
    // ============================================================
    private _applyForceBuyConstraint(pot: InsurancePotLimit.AsObject): void {
        const ratio = this._basic.insuranceForceBuyRatio || 0;
        const isFlop = this._currentOperator()?.round === Def.Round.FLOP;
        const forceType = isFlop && ratio > 0 ? this._ratioToPool(ratio) : PoolType.NONE;
        this.poolButtons.forEach(pb => this._setPoolBtnEnabled(pb, true));
        switch (forceType) {
            case PoolType.FIFTH:
                this._disablePool(PoolType.EIGHTH);
                break;
            case PoolType.THIRD:
                this._disablePool(PoolType.EIGHTH);
                this._disablePool(PoolType.FIFTH);
                break;
            case PoolType.HALF:
                this._disablePool(PoolType.EIGHTH);
                this._disablePool(PoolType.FIFTH);
                this._disablePool(PoolType.THIRD);
                break;
            case PoolType.ALL:
                this._disablePool(PoolType.EIGHTH);
                this._disablePool(PoolType.FIFTH);
                this._disablePool(PoolType.THIRD);
                this._disablePool(PoolType.HALF);
                break;
            default:
                break;
        }
        this.poolButtons.forEach(pb => {
            if (!this._canPayFromPoolType(pot, pb.type)) this._setPoolBtnEnabled(pb, false);
        });
        const order = [PoolType.ALL, PoolType.HALF, PoolType.THIRD, PoolType.FIFTH, PoolType.EIGHTH, PoolType.MIN_MONEY];
        const found = order.find(t => {
            const pb = this.poolButtons.find(p => p.type === t);
            return pb && pb.node.getComponent(cc.Button)?.interactable;
        });
        if (found !== undefined) this._onClickPool(found);
        if (this.classicTurnText) {
            if (isFlop && ratio > 0) {
                const v = this._floorTrim(pot.min / 100);
                this.classicTurnText.node.active = true;
                this.classicTurnText.string = `${i18nMgr.Get('UITexasIns_InsAmount')}(${v})`;
            } else {
                this.classicTurnText.node.active = false;
            }
        }
    }

    private _refreshPoolMoney(pot: InsurancePotLimit.AsObject): void {
        this.poolButtons.forEach(pb => {
            if (pb.money) pb.money.string = this._floorTrim(this._realPayAmount(pot, pb.type));
        });
    }

    private _refreshSelectedPool(pot: InsurancePotLimit.AsObject): void {
        this._hideAllPoolHighlights();
        const cur = this.poolButtons.find(pb => pb.type === this._currentPool);
        if (cur?.checked) cur.checked.active = true;
        this._overOutsPayValue = this._overOutsPay(pot, this._currentPool);
        if (this.textPayValue) this.textPayValue.string = this._floorTrim(this._compensateAmount(pot, this._currentPool));
        if (this.textInsuranceValue) this.textInsuranceValue.string = this._floorTrim(this._realPayAmount(pot, this._currentPool));
    }

    private _refreshCancelButton(pot: InsurancePotLimit.AsObject): void {
        if (!this.textCancel) return;
        this.textCancel.string = i18nMgr.Get('UIInsurance_GiveUp');
        if (pot.insuranced > 0) {
            const v = this._floorTrim(this._riverForcePayAmount(pot) / 100);
            this.textCancel.string = `${i18nMgr.Get('UIInsurance_GiveUp')}\n${i18nMgr.Get('UITexasIns_InsAmount')}(${v})`;
        }
    }

    private _hideAllPoolHighlights(): void {
        this.poolButtons.forEach(pb => pb.checked && (pb.checked.active = false));
    }

    private _setPoolBtnEnabled(pb: { node: cc.Node }, enabled: boolean): void {
        const btn = pb.node.getComponent(cc.Button);
        if (btn) btn.interactable = enabled;
        pb.node.opacity = enabled ? 255 : 160;
    }

    private _disablePool(type: PoolType): void {
        const pb = this.poolButtons.find(p => p.type === type);
        if (pb) this._setPoolBtnEnabled(pb, false);
    }

    private _ratioToPool(ratio: number): PoolType {
        switch (ratio) {
            case 125:
                return PoolType.EIGHTH;
            case 200:
                return PoolType.FIFTH;
            case 333:
                return PoolType.THIRD;
            case 500:
                return PoolType.HALF;
            case 1000:
                return PoolType.ALL;
            default:
                return PoolType.NONE;
        }
    }
    // ============================================================
    // 用户交互
    // ============================================================
    private _onClickPool(type: PoolType): void {
        const pb = this.poolButtons.find(p => p.type === type);
        if (!pb) return;
        const btn = pb.node.getComponent(cc.Button);
        if (btn && !btn.interactable) return;
        this._currentPool = type;
        const pot = this._currentPot();
        if (pot) this._refreshSelectedPool(pot);
    }

    private _onClickBuy(): void {
        if (this._isCommitting) return;
        const pot = this._currentPot();
        if (!pot) return;
        if (!this._cacheCurrentPotBuy(pot, false)) {
            this.tracelog?.warn('buy insurance ignored: no valid over outs or pay value', {
                potId: pot.potId,
                overOutsPayValue: this._overOutsPayValue
            });
            return;
        }
        this._advanceOrCommit();
    }

    private _onClickCancel(): void {
        if (this._isCommitting) return;
        const pot = this._currentPot();
        if (!pot) return;
        const ratio = this._basic.insuranceForceBuyRatio || 0;
        const isFlop = this._currentOperator()?.round === Def.Round.FLOP;
        if (isFlop && ratio > 0) this._cacheCurrentPotBuy(pot, true);
        this._advanceOrCommit();
    }

    private _onClickDelay(): void {
        if (this._isCommitting) return;
        if (!this._player?.roomData) return;
        const op = this._currentOperator();
        const delayCount = op?.alreadyDelayTImes || 0;
        if (this._clickedDelayTimes > 1 || delayCount >= 2) {
            this._refreshDelayButton(delayCount);
            return;
        }
        const consume = this._nextDelayConsumeType(delayCount);
        ProtocolAgency.Send({
            code: Code.MSG_D_ADD_TIME,
            roomID: this._player.roomData.roomID,
            matchID: this._player.roomData.matchID,
            body: {
                room: {
                    roomId: this._player.roomData.roomID,
                    matchId: this._player.roomData.matchID
                },
                consume,
                directConsume: false
            }
        });
        const now = Date.now() / 1000;
        const addSeconds = delayCount === 0 ? 30 : 20;
        this._countDownEnd = Math.max(this._countDownEnd, now) + addSeconds;
        this._countDownTotal += addSeconds;
        if (op) op.alreadyDelayTImes = (op.alreadyDelayTImes || 0) + 1;
        this._clickedDelayTimes += 1;
        this._refreshDelayButton(op?.alreadyDelayTImes || delayCount + 1);
    }

    private _onClickSort(byGraphics: boolean): void {
        this._sortByGraphics = byGraphics;
        const pot = this._currentPot();
        if (pot) this._renderOuts(pot);
    }
    /** 点击半透明背景：等同于放弃整体保险。 */
    // private _onClickBackdrop(): void {
    //     TexasTableEvent.CommitBuyInsurance(this._player, this._cachedBuyList.slice(), true);
    //     // 立即隐藏给用户反馈；之后服务端 BuyInsuranceActive/BuyInsurance 会清空 mine.operator
    //     // → 自己再触发一次 onOperatorChange 把状态归零。
    //     this._isCounting = false;
    //     this._setVisible(false);
    // }
    public override close(): void {
        if (!this._isCommitting && this._player) {
            TexasTableEvent.CommitBuyInsurance(this._player, this._cachedBuyList.slice(), true);
        }
        this._finishInsuranceOperation();
    }

    private _advanceOrCommit(): void {
        if (this._isCommitting) return;
        const operator = this._currentOperator();
        const pots = operator?.insurancePotLimitList || [];
        if (this._currentPotIndex < pots.length - 1) {
            // 还有下一池：提交当前累计，并切换 UI
            TexasTableEvent.CommitBuyInsurance(this._player, this._cachedBuyList.slice(), false);
            this._currentPotIndex += 1;
            this._refreshCurrentPot();
            const node = this._multiToggleNodes[this._currentPotIndex];
            if (node) {
                this._multiToggleNodes.forEach(n => this._setToggleVisual(n, n === node));
            }
            return;
        }
        // 最后一池：确认提交后先本地关闭，服务端回包再更新 operator/成交明细。
        this._isCommitting = true;
        this._setActionButtonsEnabled(false);
        TexasTableEvent.CommitBuyInsurance(this._player, this._cachedBuyList.slice(), true);
        this._finishInsuranceOperation();
    }
    // ============================================================
    // 数值计算（对齐老版逻辑：先按池档算赔付目标，再反推保费）
    // ============================================================
    private _compensateAmount(pot: InsurancePotLimit.AsObject, type: PoolType): number {
        const potLeaderCount = Math.max(1, pot.potLeaderCount);
        let value = 0;
        switch (type) {
            case PoolType.MIN_MONEY:
                value = (pot.bet + pot.insuranced) / 100;
                break;
            case PoolType.ALL:
                value = pot.potAmount / 100;
                break;
            case PoolType.HALF:
                value = pot.potAmount / 100 / 2;
                break;
            case PoolType.THIRD:
                value = (pot.potAmount / 100) * 0.333;
                break;
            case PoolType.FIFTH:
                value = pot.potAmount / 100 / 5;
                break;
            case PoolType.EIGHTH:
                value = pot.potAmount / 100 / 8;
                break;
        }
        if (type !== PoolType.MIN_MONEY) value /= potLeaderCount;
        return value;
    }

    private _overOutsPay(pot: InsurancePotLimit.AsObject, type: PoolType): number {
        const overOdd = this._oddsFor(pot, this._splitOuts(pot).overOuts.length);
        if (overOdd <= 0) return 0;
        let maxPay = 0;
        if (type === PoolType.MIN_MONEY) {
            maxPay = Math.floor((pot.bet + pot.insuranced) / overOdd);
        } else {
            maxPay = Math.floor(pot.potAmount / Math.max(1, pot.potLeaderCount) / overOdd);
        }
        let overValue = 0;
        switch (type) {
            case PoolType.MIN_MONEY:
            case PoolType.ALL:
                overValue = maxPay;
                break;
            case PoolType.HALF:
                overValue = maxPay / 2;
                break;
            case PoolType.THIRD:
                overValue = maxPay * 0.333;
                break;
            case PoolType.FIFTH:
                overValue = maxPay / 5;
                break;
            case PoolType.EIGHTH:
                overValue = maxPay / 8;
                break;
        }
        const ratio = this._basic.insuranceForceBuyRatio || 0;
        const isFlop = this._currentOperator()?.round === Def.Round.FLOP;
        if (isFlop && ratio > 0) {
            const targetByRatio: Record<number, PoolType> = {
                125: PoolType.EIGHTH,
                200: PoolType.FIFTH,
                333: PoolType.THIRD,
                500: PoolType.HALF,
                1000: PoolType.ALL
            };
            if (targetByRatio[ratio] === type) return pot.min;
        }
        return Math.floor(overValue);
    }

    private _equalOutsPay(pot: InsurancePotLimit.AsObject, overValue: number): number {
        const { equalOuts } = this._splitOuts(pot);
        if (!equalOuts.length) return 0;
        const equalOdd = this._oddsFor(pot, equalOuts.length);
        if (equalOdd <= 0) return 0;
        return Math.floor(overValue / equalOdd);
    }

    private _realPayAmount(pot: InsurancePotLimit.AsObject, type: PoolType): number {
        const over = this._overOutsPay(pot, type);
        const equal = this._equalOutsPay(pot, over);
        return (over + equal) / 100;
    }

    private _riverForcePayAmount(pot: InsurancePotLimit.AsObject): number {
        const last = pot.insuranced || 0;
        if (last <= 0) return 0;
        const { overOuts, equalOuts } = this._splitOuts(pot);
        const overOdd = this._oddsFor(pot, overOuts.length) || 1;
        const equalOdd = this._oddsFor(pot, equalOuts.length);
        const overValue = last / overOdd;
        const equalValue = equalOdd > 0 ? overValue / equalOdd : 0;
        return overValue + equalValue;
    }

    /** 取赔率：优先用 basicInfo.insuranceOdds 表查 (potUserCount, outs)，查不到回退 pot.odds。 */
    private _oddsFor(pot: InsurancePotLimit.AsObject, selectedOuts: number): number {
        if (selectedOuts <= 0) return 0;
        const table = this._basic.insuranceOdds || [];
        const bucket = table.find(t => t.potUserCount === pot.potUserCount);
        if (bucket) {
            const hit = bucket.oddsList.find(o => o.outs === selectedOuts);
            if (hit && Number.isFinite(hit.odds) && hit.odds > 0) return hit.odds;
        }
        return Number.isFinite(pot.odds) ? pot.odds : 0;
    }
    // ============================================================
    // 提交缓存
    // ============================================================
    private _cacheCurrentPotBuy(pot: InsurancePotLimit.AsObject, useMinAsActiveAmount: boolean): boolean {
        const { overOuts } = this._splitOuts(pot);
        this._sortCards(overOuts);
        if (!useMinAsActiveAmount && (!overOuts.length || this._overOutsPayValue <= 0)) {
            return false;
        }
        const activeAmount = useMinAsActiveAmount ? pot.min : Math.max(this._overOutsPayValue, pot.min);
        const operator = this._currentOperator();
        const buy: PotInsuranceBuy.AsObject = {
            activeAmount,
            activeOutsList: overOuts.slice(),
            round: operator?.round as Def.RoundMap[keyof Def.RoundMap],
            potId: pot.potId,
            passiveAmount: 0,
            passiveOutsList: [],
            insurEv: 0
        };
        this._cachedBuyList.push(buy);
        return true;
    }
    // ============================================================
    // 倒计时
    // ============================================================
    private _refreshCountDownProgress(remain: number): void {
        if (!this.countDownImage) return;
        const ratio = this._countDownTotal > 0 ? remain / this._countDownTotal : 0;
        this.countDownImage.fillRange = Math.max(0, Math.min(1, ratio));
    }
    // ============================================================
    // 工具
    // ============================================================
    private _currentOperator(): OperatorMine | null {
        return (this._player?.operator as OperatorMine) || null;
    }

    private _currentPot(): InsurancePotLimit.AsObject | null {
        const op = this._currentOperator();
        return op?.insurancePotLimitList?.[this._currentPotIndex] || null;
    }

    private _clearTransientState(): void {
        this._cachedBuyList.length = 0;
        this._currentPotIndex = 0;
        this._overOutsPayValue = 0;
        this._clickedDelayTimes = 0;
        this._isCommitting = false;
        this._destroyArray(this._multiToggleNodes);
        this._destroyArray(this._playerClones);
        this._destroyOutsItems();
        if (this.playersNext) this.playersNext.active = false;
        this._setActionButtonsEnabled(true);
    }

    private _destroyArray(nodes: cc.Node[]): void {
        while (nodes.length) nodes.pop()?.destroy();
    }

    private _destroyOutsItems(): void {
        this._outsOverItems.forEach(i => i.node.destroy());
        this._outsSplitItems.forEach(i => i.node.destroy());
        this._outsOverItems.length = 0;
        this._outsSplitItems.length = 0;
    }

    private _formatOdds(odd: number): string {
        return `1:${Number.isFinite(odd) && odd > 0 ? odd : 0}`;
    }

    private _sortCards(cards: number[]): void {
        cards.sort((a, b) => {
            const ar = a % 15;
            const br = b % 15;
            if (!this._sortByGraphics) return ar - br;
            const as = Math.floor(a / 15);
            const bs = Math.floor(b / 15);
            return as === bs ? ar - br : as - bs;
        });
    }

    private _nextDelayConsumeType(delayCount: number): Def.ConsumeTypeMap[keyof Def.ConsumeTypeMap] {
        return (delayCount === 0 ? Def.ConsumeType.CT_DELAY_2 : Def.ConsumeType.CT_DELAY_3) as Def.ConsumeTypeMap[keyof Def.ConsumeTypeMap];
    }

    private _setDelayButtonEnabled(enabled: boolean): void {
        const btn = this.buttonDelay?.getComponent(cc.Button);
        if (btn) btn.interactable = enabled;
        if (this.buttonDelay) this.buttonDelay.opacity = enabled ? 255 : 178;
        if (!enabled && this.textDelayBean) this.textDelayBean.string = '0';
    }

    private _refreshDelayButton(delayCount: number): void {
        const enabled = this._clickedDelayTimes <= 1 && delayCount < 2 && !this._isCommitting;
        this._setDelayButtonEnabled(enabled);
        if (this.textDelayBean) {
            this.textDelayBean.string = enabled ? `${2 * Math.pow(2, delayCount)}` : '0';
        }
    }

    private _setActionButtonsEnabled(enabled: boolean): void {
        [this.buttonBuy, this.buttonCancel].forEach(node => {
            const btn = node?.getComponent(cc.Button);
            if (btn) btn.interactable = enabled;
            if (node) node.opacity = enabled ? 255 : 178;
        });
        if (!enabled) this._setDelayButtonEnabled(false);
    }

    private _finishInsuranceOperation(): void {
        this._isCounting = false;
        if (this._player?.player?.operator?.opType === OpertionType.INSURANCE) {
            this._player.player.operator = null;
        }
        if (this._player?.operator) {
            this._player.operator = null;
        }
        super.close();
    }

    private _canPayFromPoolType(pot: InsurancePotLimit.AsObject, type: PoolType): boolean {
        const realPay = Math.floor(this._realPayAmount(pot, type) * 100);
        if (realPay <= 0) return false;
        return realPay <= pot.max;
    }

    private _floorTrim(value: number): string {
        if (!Number.isFinite(value)) return '0';
        return value
            .toFixed(2)
            .replace(/\.00$/, '')
            .replace(/(\.\d)0$/, '$1');
    }
}
