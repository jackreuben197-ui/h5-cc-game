import { autoBindEvents, bindEvent, unBindEventsAll } from '../../../core/decorator/DataBind';
import { traceClass } from '../../../core/decorator/LogTrace';
import { OperatorMine } from '../../../data/room/texas/model/Operator';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataBasic from '../../../data/room/texas/TexasGameRoomDataBasic';
import TexasGameRoomDataPlayerMine from '../../../data/room/texas/TexasGameRoomDataPlayerMine';
import TexasGameRoomDataPublicCards from '../../../data/room/texas/TexasGameRoomDataPublicCards';
import TexasGameRoomDataSeatsStateManager from '../../../data/room/texas/TexasGameRoomDataSeatsStateManager';
import GameplayUtil from '../../../game/util/GameplayUtil';
import { StringHelper } from '../../../helper/StringHelper';
import { i18nMgr } from '../../../i18n/i18nMgr';
import { Def, InsurancePotLimit, OutsCard, PotInsuranceBuy } from '../../../protobuf/holdem/define_pb';
import UIComponentBaseDialog from '../../base/UIComponentDialogBase';
import { AssetCollectionType } from '../../loader/AssetLoader';
import AssetManager from '../../loader/AssetManager';
import TexasTableEvent from '../../scene/room/texas/events/TexasTableEvent';

const { ccclass, menu } = cc._decorator;

/**
 * 保险面板入参 —— 由 UIRoomTexas 监听到 PREPARE_OPERATION_MINE(opType=2) 后传入。
 */
export interface UIInsuranceNewPanelParam {
    player: TexasGameRoomDataPlayerMine;
}

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
        this.sprite =
            node.getComponent(cc.Sprite) ||
            node.getChildByName('Image_InsuranceCard')?.getComponent(cc.Sprite) ||
            null;
    }
    public get cardReadId(): number {
        return this.cardId % 15;
    }
    public updateItem(cardId: number): void {
        this.cardId = cardId;
        if (this.sprite) {
            const resName = GameplayUtil.CardNoToLocalResource(cardId);
            this.sprite.spriteFrame = AssetManager.getAsset(AssetCollectionType.SpriteFrameCard, resName);
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
                sprite.spriteFrame = AssetManager.getAsset(AssetCollectionType.SpriteFrameCard, resName);
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

/**
 * 保险面板（新版）
 *
 * 数据来源：
 *   - mine (TexasGameRoomDataPlayerMine)   : operator(opType=2/insurancePotLimitList/round/deadline...)
 *   - basicInfo (TexasGameRoomDataBasic)   : insuranceOpduration / insuranceForceBuyRatio / insuranceOdds 表 / handCardNum
 *   - publicCards (TexasGameRoomDataPublicCards) : 顶部公共牌
 *   - seats (TexasGameRoomDataSeatsStateManager) : 玩家名字 / 手牌（由当前 operator.playerCardsList 决定，必要时也可从 seats 兜底）
 *
 * 与服务端交互（统一走 TexasTableEvent）：
 *   - 购买当前池：CommitBuyInsurance(player, buyList, confirm=false) 进入下一池
 *   - 最后一池/超时/放弃：CommitBuyInsurance(player, buyList, confirm=true) 结束
 *   - 失败由 BuyInsuranceActive 消息处理；成功由 BuyInsurance 消息广播，并触发 mine.operator=null 关闭面板
 */
@ccclass
@menu('Dialog/Insurance/UIInsuranceNewPanel')
@traceClass({ level: 'debug' })
export default class UIInsuranceNewPanel extends UIComponentBaseDialog<UIInsuranceNewPanelParam> {
    // ─── 数据源句柄 ──────────────────────────────────────
    private _player: TexasGameRoomDataPlayerMine = null;
    private _roomData: TexasGameRoomData = null;
    private _basic: TexasGameRoomDataBasic = null;
    private _publicCards: TexasGameRoomDataPublicCards = null;
    private _seats: TexasGameRoomDataSeatsStateManager = null;

    // ─── 节点缓存（运行时按 prefab 结构查找，无需编辑器再次绑定） ──
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
    // 倒计时
    private _countDownEnd: number = 0;
    private _countDownTotal: number = 0;
    private _isCounting: boolean = false;

    // ============================================================
    // 生命周期
    // ============================================================
    public initialize(param: UIInsuranceNewPanelParam): void {
        this._player = param.player;
        this._roomData = param.player.roomData;
        this._basic = this._roomData.basicInfo;
        this._publicCards = this._roomData.publicCards;
        this._seats = this._roomData.seatsStateManager;
        if (this.node.activeInHierarchy) this._bindEventsAndRefresh();
    }

    protected onLoad(): void {
        this._bindNodes();
        this._initStaticNodes();
        this._registerClicks();
    }

    protected onEnable(): void {
        if (!this._player) return;
        this._bindEventsAndRefresh();
    }

    protected onDisable(): void {
        unBindEventsAll(this);
        this._clearTransientState();
    }

    protected update(): void {
        if (!this._isCounting) return;
        const now = Date.now() / 1000;
        const remain = Math.max(0, this._countDownEnd - now);
        this._refreshCountDownProgress(remain);
        if (remain <= 0) {
            this._isCounting = false;
            // 倒计时归零：把已缓存内容一次性提交并 confirm
            TexasTableEvent.CommitBuyInsurance(this._player, this._cachedBuyList.slice(), true);
            this.close();
        }
    }

    // ============================================================
    // 节点绑定（按 prefab 结构 cc.find 一次性查全部）
    // ============================================================
    private _bindNodes(): void {
        const root = this.node;
        this.backClickNode = root.getChildByName('$back_click') || root.getChildByName('back_click');
        const dialog = root.getChildByName('Image_Dialog');
        this.dialogNode = dialog;

        this.scrollViewRoot = cc.find('Image_Dialog/ScrollViewRoot', root);
        this.scrollView = this.scrollViewRoot?.getComponent(cc.ScrollView) || null;
        this.scrollViewport = cc.find('Viewport', this.scrollViewRoot);
        this.insuranceCardsRoot = cc.find('Viewport/InsuranceCards', this.scrollViewRoot);

        this.textPot = cc.find('Header/Text_Pot_title/Text_Pot', dialog)?.getComponent(cc.Label) || null;
        this.multiPoolToggles = cc.find('Header/MultiPoolToggles', dialog);
        this.multiPoolToggleTemplate = this.multiPoolToggles?.getChildByName('MultiPoolToggle') || null;
        this.playerMineNode = cc.find('Header/Player_Mine', dialog);
        this.playersContent =
            cc.find('Header/Players/view/Players_Content', dialog) ||
            cc.find('Header/Players/view/players_Content', dialog);
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
            this.playersContent.children
                .filter(c => c.name === 'Player')
                .forEach(c => (c.active = false));
        }
        if (this.playersNext) this.playersNext.active = false;
        if (this.insuranceCardOverTemplate) this.insuranceCardOverTemplate.active = false;
        if (this.insuranceCardSplitTemplate) this.insuranceCardSplitTemplate.active = false;
        this._hideAllPoolHighlights();
    }

    private _registerClicks(): void {
        if (this.backClickNode) this.backClickNode.on('click', this._onClose, this);
        if (this.buttonBuy) this.buttonBuy.on('click', this._onClickBuy, this);
        if (this.buttonCancel) this.buttonCancel.on('click', this._onClickCancel, this);
        if (this.buttonDelay) this.buttonDelay.on('click', this._onClickDelay, this);
        this.poolButtons.forEach(pb => pb.node.on('click', () => this._onClickPool(pb.type), this));
    }

    // ============================================================
    // 数据绑定 + 首屏对齐
    // ============================================================
    private _bindEventsAndRefresh(): void {
        autoBindEvents(this, {
            mine: this._player,
            publicCards: this._publicCards,
            basic: this._basic
        });
    }

    /** 触发/取消保险 —— operator 变更是唯一开关。opType !== 2 时关闭。 */
    @bindEvent(TexasGameRoomDataPlayerMine.PREPARE_OPERATION_MINE, 'mine')
    private onOperatorChange(op: OperatorMine): void {
        if (!op || op.opType !== 2) {
            this.close();
            return;
        }
        this._cachedBuyList.length = 0;
        this._currentPotIndex = 0;
        this._currentPool = PoolType.THIRD;
        // 倒计时
        this._countDownTotal = Math.max(1, op.totalOpDuration || this._basic.insuranceOpduration || 30);
        const now = Date.now() / 1000;
        const remain =
            op.deadlineTImestamp > 0
                ? Math.max(0, op.deadlineTImestamp - now)
                : Math.max(0, op.leftOpDuration || 0);
        this._countDownEnd = now + remain;
        this._isCounting = remain > 0;
        this._refreshCountDownProgress(remain);
        // 多池切换条
        this._renderMultiPoolToggles();
        // 当前池
        this._refreshCurrentPot();
    }

    /** 公共牌变化 → 顶部公共牌刷新（attr 直接读 publicCards.publicCards 数组） */
    @bindEvent(TexasGameRoomDataPublicCards.PUBLICCARDS_CHANGE, 'publicCards')
    private onPublicCardsChange(): void {
        const cards = this._publicCards.publicCards || [];
        for (let i = 0; i < this.publicCardSprites.length; i++) {
            const sp = this.publicCardSprites[i];
            if (!sp) continue;
            const cardId = cards[i] ?? 0;
            const resName = GameplayUtil.CardNoToLocalResource(cardId);
            sp.spriteFrame = AssetManager.getAsset(AssetCollectionType.SpriteFrameCard, resName);
        }
    }

    @bindEvent(TexasGameRoomDataPublicCards.ALL_PUBLICCARDS_RESET, { dataSource: 'publicCards', initIgnore: true })
    private onPublicCardsReset(): void {
        this.onPublicCardsChange();
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
        // 玩家行
        this._renderPlayers(pot);
        // outs
        this._renderOuts(pot);
        // 顶部数字
        if (this.textPot) this.textPot.string = StringHelper.GetLongString(pot.potAmount);
        if (this.textMainPut) this.textMainPut.string = StringHelper.GetLongString(pot.bet + pot.insuranced);
        // 默认选 1/3
        this._currentPool = PoolType.THIRD;
        // 强制保险 / FLOP 提示
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
        // 自己优先
        if (this.playerMineNode && minePlayer) {
            this.playerMineNode.active = true;
            const cards = (cardMap.get(mineSeatNo) || minePlayer.cards || []).slice(0, handCards);
            new PlayerItem(this.playerMineNode).updateItem(cards, minePlayer.name, -1, handCards);
        }
        // 其他参与池玩家：从 outsDetailList 拿座位
        const otherSeats = (pot.outsDetailList || [])
            .map(uo => uo.seatId)
            .filter(sid => sid !== mineSeatNo);
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
        // 已选 outs（新版默认全选）
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
        // Flop 强制保险：禁用低档位
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
        // 超过 mostAmount 的档位也禁用
        this.poolButtons.forEach(pb => {
            const realPay = Math.floor(this._realPayAmount(pot, pb.type) * 100);
            if (realPay > pot.max) this._setPoolBtnEnabled(pb, false);
        });
        // 选首个可点档位
        const order = [PoolType.ALL, PoolType.HALF, PoolType.THIRD, PoolType.FIFTH, PoolType.EIGHTH, PoolType.MIN_MONEY];
        const found = order.find(t => {
            const pb = this.poolButtons.find(p => p.type === t);
            return pb && pb.node.getComponent(cc.Button)?.interactable;
        });
        if (found !== undefined) this._onClickPool(found);
        // FLOP 强制保险提示
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
        const pot = this._currentPot();
        if (!pot) return;
        if (!this._cacheCurrentPotBuy(pot, false)) return;
        this._advanceOrCommit();
    }

    private _onClickCancel(): void {
        const pot = this._currentPot();
        if (!pot) return;
        // Flop 强制保险时，放弃也要按 min 缓存一笔
        const ratio = this._basic.insuranceForceBuyRatio || 0;
        const isFlop = this._currentOperator()?.round === Def.Round.FLOP;
        if (isFlop && ratio > 0) this._cacheCurrentPotBuy(pot, true);
        this._advanceOrCommit();
    }

    private _onClickDelay(): void {
        // 加时按钮：当前重构暂不接入钻石折扣 UI，留待后续完善
        // 服务端协议在 AddTime.ts 已经实现，需要时通过 ProtocolAgency.Send(MSG_D_ADD_TIME, ...) 走一次
    }

    private _onClose(): void {
        // 关闭等同于放弃整体保险
        TexasTableEvent.CommitBuyInsurance(this._player, this._cachedBuyList.slice(), true);
        this.close();
    }

    private _advanceOrCommit(): void {
        const operator = this._currentOperator();
        const pots = operator?.insurancePotLimitList || [];
        if (this._currentPotIndex < pots.length - 1) {
            // 还有下一池：提交当前累计，并切换 UI
            TexasTableEvent.CommitBuyInsurance(this._player, this._cachedBuyList.slice(), false);
            this._currentPotIndex += 1;
            this._refreshCurrentPot();
            // 切换多池切换条的可视态
            const node = this._multiToggleNodes[this._currentPotIndex];
            if (node) {
                this._multiToggleNodes.forEach(n => this._setToggleVisual(n, n === node));
            }
            return;
        }
        // 最后一池：确认提交并关闭
        TexasTableEvent.CommitBuyInsurance(this._player, this._cachedBuyList.slice(), true);
        this.close();
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
        // Flop 强制保险：命中目标档位时直接用 pot.min（leastAmount）
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
        if (!useMinAsActiveAmount && (!overOuts.length || this._overOutsPayValue <= 0)) {
            return false;
        }
        const activeAmount = useMinAsActiveAmount
            ? pot.min
            : Math.max(this._overOutsPayValue, pot.min);
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
        this._isCounting = false;
        this._cachedBuyList.length = 0;
        this._currentPotIndex = 0;
        this._destroyArray(this._multiToggleNodes);
        this._destroyArray(this._playerClones);
        this._destroyOutsItems();
        if (this.playersNext) this.playersNext.active = false;
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

    private _floorTrim(value: number): string {
        if (!Number.isFinite(value)) return '0';
        return value
            .toFixed(2)
            .replace(/\.00$/, '')
            .replace(/(\.\d)0$/, '$1');
    }
}
