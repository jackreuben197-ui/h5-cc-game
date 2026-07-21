import { autoBindEvents, bindEvent, unBindEventsAll } from '../../../core/decorator/DataBind';
import { traceClass } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import { CCViewData } from '../../../data/system/CCViewData';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataReplay, { ReplayHandData } from '../../../data/room/texas/TexasGameRoomDataReplay';
import diamondModel, { DiamondConfig } from '../../../data/trade/DiamondModel';
import userStore from '../../../data/user/UserStore';
import { StringHelper } from '../../../helper/StringHelper';
import { CPErrorCode } from '../../../i18n/CPErrorCode';
import { i18nMgr } from '../../../i18n/i18nMgr';
import UIComponentBaseDialog from '../../base/UIComponentDialogBase';
import AssetManager, { BUNDLE_RESOURCES } from '../../loader/AssetManager';
import TexasTableEvent from '../../scene/room/texas/events/TexasTableEvent';
import viewManager from '../../UIViewManager';
import StepSlider from '../../widget/StepSlider';
import HistoryPlayerCardItem from './HistoryPlayerCardItem';
import { getViewPubRound, hasHiddenCards, hasHiddenPublicCards, HistoryHandModel, parseHistoryHand } from './HistoryReplayModel';
import HistoryScoreSection, { ScoreRowMode } from './HistoryScoreSection';
import HistoryStreetSection from './HistoryStreetSection';

export type UITexasHistoryParam = {
    roomID: number;
    matchID: number;
};

const { ccclass, property, menu } = cc._decorator;

/**
 * 牌谱回放对话框。
 * prefab 迁自 pokerqueen(UITexasHistory.prefab):主节点走 @property 编辑器绑定,
 * 已绑定节点内部的子节点(价格标签/箭头等)按路径查找。
 * 详情区块组件化:$Score/$Preflop 是 prefab 常驻节点(编辑器绑定组件),
 * Flop/Turn/River 与 Showdown/Showdown2 由通用区块 prefab 运行时实例化。
 * 翻页滑条为 prefab 内置的通用 StepSlider 节点,编辑器绑定,接线方式对齐 UITexasReport。
 */
@ccclass
@traceClass()
@menu('Dialog/History/UITexasHistory')
export default class UITexasHistory extends UIComponentBaseDialog<UITexasHistoryParam> {
    // ==================== 编辑器绑定(prefab 内对应老节点名) ====================
    @property({ type: cc.Node, displayName: '内容背景节点(bg)' })
    private bgNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '背景点击关闭节点($bg_click)' })
    private bgClickNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '顶部全屏遮挡(top_block,onLoad 禁用其 BlockInputEvents)' })
    private topBlockNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '顶部房间信息($Top,含 room_name_label 等子标签与 exit_button)' })
    private topNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '总滚动容器($content,首包前隐藏)' })
    private contentNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '概览卡容器($Dashboard,运行时填 HistoryPlayerCardItem)' })
    private dashboardNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '详情展开按钮($DetailsBtn,含 Background/arrowsp 箭头)' })
    private detailsBtnNode: cc.Node = null;
    @property({ type: HistoryScoreSection, displayName: 'Score结算区组件($Score)' })
    private scoreSection: HistoryScoreSection = null;
    @property({ type: HistoryStreetSection, displayName: 'Preflop区组件($Preflop)' })
    private preflopSection: HistoryStreetSection = null;
    @property({ type: cc.Node, displayName: 'Preflop标题空心牌容器($Preflop_title_childs)' })
    private preflopTitleCards: cc.Node = null;
    @property({ type: cc.Prefab, displayName: '街道区块Prefab(实例化Flop/Turn/River)', tooltip: 'rc/scene/room/texas/widget/HistoryStreetSection' })
    private streetSectionPrefab: cc.Prefab = null;
    @property({ type: cc.Prefab, displayName: '结算区块Prefab(实例化Showdown/Showdown2)', tooltip: 'rc/scene/room/texas/widget/HistoryScoreSection' })
    private scoreSectionPrefab: cc.Prefab = null;
    @property({ type: StepSlider, displayName: '翻页滑条(StepSlider)' })
    private pageSlider: StepSlider = null;
    @property({ type: cc.Label, displayName: '页码标签(cc_Label$page)' })
    private pageLabel: cc.Label = null;
    @property({ type: cc.Node, displayName: '上一手按钮($left_btn)' })
    private leftBtnNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '下一手按钮($right_btn)' })
    private rightBtnNode: cc.Node = null;
    @property({ type: cc.Label, displayName: '钻石余额标签($DiamondNum)' })
    private diamondNumLabel: cc.Label = null;
    @property({ type: cc.Node, displayName: '偷偷看按钮($PeekButton,含 diamondIcon/$PeekCost 价格子标签)' })
    private peekBtnNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '发发看按钮($ViewPubButton,含 diamondIcon/$ViewPubCost 价格子标签)' })
    private viewPubBtnNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '收藏按钮($favoBtn,含 Background/$star 星星子节点)' })
    private favoBtnNode: cc.Node = null;
    // ==================== 已绑定节点内部的子节点(onLoad 路径查找) ====================
    private detailsArrow: cc.Node = null;
    private peekCostLabel: cc.Label = null;
    private viewPubCostLabel: cc.Label = null;
    private favoStar: cc.Node = null;
    // ==================== 运行时实例化的详情区块 ====================
    private flopSection: HistoryStreetSection = null;
    private turnSection: HistoryStreetSection = null;
    private riverSection: HistoryStreetSection = null;
    private showdownSection: HistoryScoreSection = null;
    private showdown2Section: HistoryScoreSection = null;
    // ==================== 私有状态 ====================
    private _roomData: TexasGameRoomData = null;
    private _currentData: ReplayHandData = null;
    private _model: HistoryHandModel = null;
    private _currentPage: number = 0;
    private _totalPage: number = 0;
    private _detailsExpanded: boolean = false;
    private _isCollected: boolean = false;
    private _dashboardItems: HistoryPlayerCardItem[] = [];
    private _playerCardPrefab: cc.Prefab = null;
    private static readonly COLLECTED_STAR_COLOR = cc.color(255, 200, 50);
    // 偷偷看阶梯收费: config_type=30, type_ext = 11 + 10 * 次数(最多4次)
    private static readonly DIAMOND_CONFIG_PEEK = 30;
    // 发发看: config_type=8, type_ext 千位 = 轮次(1 flop / 2 turn / 3 river)
    private static readonly DIAMOND_CONFIG_VIEW_PUB = 8;

    protected onLoad(): void {
        this._resolveChildNodes();
        this._buildSections();
        this._registerTouchEvents();
        this._loadPrefabs();
    }
    // ====================================================
    // 已绑定节点内部的子节点解析
    // ====================================================

    private _resolveChildNodes() {
        // top_block 的 BlockInputEvents 覆盖全屏会拦截滚动拖拽,禁用(对齐老版)
        const blockComp = this.topBlockNode?.getComponent(cc.BlockInputEvents);
        if (blockComp) blockComp.enabled = false;
        this.detailsArrow = cc.find('Background/arrowsp', this.detailsBtnNode);
        this.peekCostLabel = cc.find('diamondIcon/$PeekCost', this.peekBtnNode)?.getComponent(cc.Label);
        this.viewPubCostLabel = cc.find('diamondIcon/$ViewPubCost', this.viewPubBtnNode)?.getComponent(cc.Label);
        this.favoStar = cc.find('Background/$star', this.favoBtnNode);
    }

    /**
     * Flop/Turn/River 与 Showdown/Showdown2 用通用区块 prefab 实例化;
     * $content 里 $Preflop 是最后一个常驻区块,顺序追加即可保持 Layout 纵向顺序。
     * 标题公牌显示数量由子节点数决定(prefab 默认 3 张,Turn 4 / River 5)
     */
    private _buildSections() {
        const container = this.preflopSection.node.parent;
        const makeStreet = (flagText: string, titleCardCount: number) => {
            const node = cc.instantiate(this.streetSectionPrefab);
            node.parent = container;
            const section = node.getComponent(HistoryStreetSection);
            section.setup(flagText, titleCardCount);
            return section;
        };
        this.flopSection = makeStreet('Flop', 3);
        this.turnSection = makeStreet('Turn', 4);
        this.riverSection = makeStreet('River', 5);
        const makeScore = () => {
            const node = cc.instantiate(this.scoreSectionPrefab);
            node.parent = container;
            return node.getComponent(HistoryScoreSection);
        };
        this.showdownSection = makeScore();
        this.showdown2Section = makeScore();
    }

    private _registerTouchEvents() {
        this.bgClickNode.on('click', this.onCloseClicked, this);
        const exitBtn = this.topNode.getChildByName('exit_button');
        if (exitBtn) exitBtn.on(cc.Node.EventType.TOUCH_END, this.onCloseClicked, this);
        this.detailsBtnNode.on('click', this.onDetailsClicked, this);
        this.leftBtnNode.on('click', this.onPrevPageClicked, this);
        this.rightBtnNode.on('click', this.onNextPageClicked, this);
        this.peekBtnNode.on('click', this.onPeekClicked, this);
        this.viewPubBtnNode.on('click', this.onViewPubClicked, this);
        this.favoBtnNode.on('click', this.onCollectClicked, this);
    }

    private async _loadPrefabs() {
        const cardPrefab = await AssetManager.getOrLoad(BUNDLE_RESOURCES, 'rc/scene/room/texas/widget/HistoryPlayerCardItem', cc.Prefab);
        if (!cc.isValid(this.node)) return;
        this._playerCardPrefab = cardPrefab;
        // 首包比 prefab 先到时补渲染
        if (this._model) {
            this._renderDashboard();
        }
    }
    // ====================================================
    // 生命周期
    // ====================================================

    public initialize(param: UITexasHistoryParam): void {
        this._roomData = roomDataManager.getRoomData<TexasGameRoomData>(param.roomID, param.matchID);
        this._currentData = null;
        this._model = null;
        this._detailsExpanded = false;
        this._isCollected = false;
        this._bindEventsAndRefresh();
        this._initTopInfo();
        this._reqDiamondBalance();
        this._reqPeekPrice();
        // 第一手没打完不请求
        this._totalPage = Math.max(0, this._roomData.basicInfo.handNum - 1);
        this._currentPage = this._totalPage;
        this._refreshPageLabel();
        this._applySliderState();
        if (this._totalPage > 0) {
            TexasTableEvent.RequestReplay(this._roomData, this._currentPage);
        }
    }

    protected onEnable(): void {
        this._bindEventsAndRefresh();
    }

    @bindEvent(CCViewData.FRAME_SIZE_UPDATE, { dataSource: 'ccviewData', initPriority: 20 })
    protected onFrameResize(
        visibleSizeWidth: number,
        visibleSizeHeight: number,
        frameSizeWidth: number,
        frameSizeHeight: number,
        suggestScale: number,
        saveAreaTop: number
    ): void {
        const bgWidget = this.bgNode.getComponent(cc.Widget);
        bgWidget.top = saveAreaTop;
        bgWidget.updateAlignment();
    }

    protected onDisable(): void {
        unBindEventsAll(this);
    }

    private _bindEventsAndRefresh() {
        if (!this._roomData) return;
        autoBindEvents(this, { replay: this._roomData.replay });
    }
    // ====================================================
    // 数据订阅
    // ====================================================

    @bindEvent(TexasGameRoomDataReplay.REPLAY_DATA_CHANGE, { dataSource: 'replay', initIgnore: true })
    private onReplayData(data: ReplayHandData) {
        if (!data?.s) return;
        // 只渲染当前页的数据(缓存命中/服务端回包/偷偷看发发看合并统一走这里)
        if (data.s.hand !== this._currentPage) return;
        this._currentData = data;
        this._render();
    }

    @bindEvent(TexasGameRoomDataReplay.REPLAY_EMPTY, { dataSource: 'replay', initIgnore: true })
    private onReplayEmpty() {
        this.tracelog.warn('回放数据为空', this._currentPage);
    }
    // ====================================================
    // 翻页(StepSlider:拖动只刷页码,松手才请求;对齐 UITexasReport 的接线方式)
    // ====================================================

    /** 用绝对值区间 1~totalPage 初始化滑条,并把滑块摆到当前页 */
    private _applySliderState() {
        if (this._totalPage <= 0) {
            this.pageSlider.setProgress(0);
            return;
        }
        this.pageSlider.show({
            min_value: 1,
            max_value: this._totalPage,
            step: 1,
            change: (v: number) => this._onSliderChange(v),
            touch_end: () => this._onSliderTouchEnd(),
            own: this
        });
        this.pageSlider.value = this._currentPage;
    }

    private _onSliderChange(value: number) {
        const page = Math.round(value);
        if (page === this._currentPage) return;
        this._currentPage = page;
        this._refreshPageLabel();
    }

    /** 缓存命中时数据层直接回发 REPLAY_DATA_CHANGE;页码没动且已是当前数据时不再重复请求/重渲染 */
    private _onSliderTouchEnd() {
        if (this._totalPage <= 0 || !this._roomData) return;
        if (this._currentData?.s?.hand === this._currentPage) return;
        TexasTableEvent.RequestReplay(this._roomData, this._currentPage);
    }

    /** 左右按钮换页:同步滑块位置后直接请求(程序设值不会触发 touch_end) */
    private _gotoPage(page: number) {
        this._currentPage = page;
        this._refreshPageLabel();
        this.pageSlider.value = page;
        TexasTableEvent.RequestReplay(this._roomData, page);
    }

    private onPrevPageClicked() {
        if (this._currentPage - 1 > 0) {
            this._gotoPage(this._currentPage - 1);
        }
    }

    private onNextPageClicked() {
        if (this._currentPage + 1 <= this._totalPage) {
            this._gotoPage(this._currentPage + 1);
        }
    }

    private _refreshPageLabel() {
        this.pageLabel.string = `${this._currentPage}/${this._totalPage}`;
    }
    // ====================================================
    // 渲染
    // ====================================================

    private _setTopLabel(name: string, text: string) {
        const label = this.topNode.getChildByName(name)?.getComponent(cc.Label);
        if (label) label.string = text;
    }

    private _initTopInfo() {
        const basicInfo = this._roomData.basicInfo;
        this._setTopLabel('room_name_label', basicInfo.roomName ?? '');
        const sb = basicInfo.sbante?.sb ?? 0;
        const ante = basicInfo.sbante?.ante ?? 0;
        // 对齐老版:有前注时显示 sb/bb(ante)
        let blindStr = `${StringHelper.GetLongString(sb)}/${StringHelper.GetLongString(sb * 2)}`;
        if (ante > 0) {
            blindStr += `(${StringHelper.GetLongString(ante)})`;
        }
        this._setTopLabel('room_bb_label', blindStr);
        this._setTopLabel('player_count_label', '0');
        this._setTopLabel('room_id_label', `${this._roomData.roomID}-0`);
        this.contentNode.active = false;
        // Preflop 标题空心牌数量按手牌数显示(奥马哈4/5/6张)
        this.preflopTitleCards.children.forEach((item, index) => {
            item.active = index < basicInfo.handCardNum;
        });
        this._applyDetailsVisibility();
    }

    private _render() {
        const data = this._currentData;
        this._model = parseHistoryHand(data, userStore.userRID);
        const model = this._model;
        const basicInfo = this._roomData.basicInfo;
        this.contentNode.active = true;
        this._setTopLabel('player_count_label', `${model.playerCount}/${basicInfo.seatsCount}`);
        this._setTopLabel('room_id_label', `${this._roomData.roomID}-${this._currentPage}`);
        this._renderDashboard();
        this._renderSections();
        this._refreshPeekButton();
        this._refreshViewPubButton();
        // 收藏态随牌谱一起缓存(replay.collected):命中缓存直接同步点亮,避免"先置白再异步点亮"的闪烁;
        // 仅未缓存过(null)才发起查询兜底
        const cachedCollected = this._roomData.replay.getCollected(this._currentPage);
        this._refreshCollectShow(cachedCollected ?? false);
        if (cachedCollected == null) {
            this._reqCollectStatus();
        }
    }

    private _renderDashboard() {
        if (!this._playerCardPrefab) return;
        const model = this._model;
        while (this._dashboardItems.length < model.players.length) {
            const node = cc.instantiate(this._playerCardPrefab);
            node.parent = this.dashboardNode;
            node.active = true;
            this._dashboardItems.push(node.getComponent(HistoryPlayerCardItem));
        }
        this._dashboardItems.forEach((item, index) => {
            if (index >= model.players.length) {
                item.node.active = false;
                return;
            }
            const player = model.players[index];
            const lastAct = model.lastActions.get(player.seatID) ?? { actName: '', actChip: 0, raiseTimes: 0 };
            item.node.active = true;
            item.setData({
                userName: player.userName,
                headPic: player.headPic,
                handCards: player.handCards ?? [],
                publicCards: model.publicCards,
                publicCards2: model.haveSecondCard ? model.secondPublicCards : undefined,
                cardType: player.maxCardType,
                actName: lastAct.actName,
                actChip: lastAct.actChip,
                raiseTimes: lastAct.raiseTimes,
                winAnte: player.winAnte,
                winAnte2: model.haveSecondCard && player.winAnte2?.length > 1 ? player.winAnte2[1] : undefined,
                isMine: player.isMine
            });
        });
    }

    private _renderSections() {
        const model = this._model;
        const cardCount = this._roomData.basicInfo.handCardNum;
        // 双套牌局 Score/Showdown/Showdown2 各显示半池(对齐老版)
        const showdownPot = model.haveSecondCard ? model.showdownPot / 2 : model.showdownPot;
        this.scoreSection.show({
            players: model.hasResult ? model.players : [],
            model,
            cardCount,
            mode: model.haveSecondCard ? ScoreRowMode.DualBoard : ScoreRowMode.FirstBoard,
            titleCards: model.publicCards,
            pot: showdownPot
        });
        this.preflopSection.show(model.preflop, []);
        this.flopSection.show(model.flop, model.publicCards);
        this.turnSection.show(model.turn, model.publicCards);
        this.riverSection.show(model.river, model.publicCards);
        const winners = model.hasResult ? model.winners : [];
        this.showdownSection.show({
            players: winners,
            model,
            cardCount,
            mode: ScoreRowMode.FirstBoard,
            titleCards: model.publicCards,
            pot: showdownPot
        });
        if (model.haveSecondCard) {
            this.showdown2Section.show({
                players: winners,
                model,
                cardCount,
                mode: ScoreRowMode.SecondBoard,
                titleCards: model.secondPublicCards,
                pot: showdownPot
            });
        } else {
            // 从双套牌局切到单套时清掉残留
            this.showdown2Section.clearLabels();
            this.showdown2Section.node.active = false;
        }
        this._applyDetailsVisibility();
    }

    /** 详情区显隐 = 展开状态 && 该区有数据;箭头方向跟随展开状态(对话框池化复用后重开也一致) */
    private _applyDetailsVisibility() {
        if (this.detailsArrow) {
            this.detailsArrow.scaleY = Math.abs(this.detailsArrow.scaleY) * (this._detailsExpanded ? -1 : 1);
        }
        const sections = [
            this.scoreSection,
            this.preflopSection,
            this.flopSection,
            this.turnSection,
            this.riverSection,
            this.showdownSection,
            this.showdown2Section
        ];
        if (!this._detailsExpanded) {
            sections.forEach(s => {
                if (s) s.node.active = false;
            });
            return;
        }
        const model = this._model;
        if (!model) return;
        this.scoreSection.node.active = model.hasResult;
        this.preflopSection.node.active = model.preflop.rows.length > 0;
        this.flopSection.node.active = model.flop.rows.length > 0;
        this.turnSection.node.active = model.turn.rows.length > 0;
        this.riverSection.node.active = model.river.rows.length > 0;
        this.showdownSection.node.active = model.hasResult;
        this.showdown2Section.node.active = model.hasResult && model.haveSecondCard;
        this._relayoutContent();
    }

    /**
     * 首次展开详情时,内层区块(Score/街道/结算)的 Layout 冷启动会晚一帧算高度,
     * 导致 $content 先按旧高度排、下一帧再回弹(视觉上"向上凸一下")。
     * 这里在激活后立即从内到外强制重排,消除首帧跳变。
     */
    private _relayoutContent() {
        // getComponentsInChildren 深度优先(父在前),逆序让内层子 Layout 先算好尺寸,外层再据此重排
        const layouts = this.contentNode.getComponentsInChildren(cc.Layout);
        for (let i = layouts.length - 1; i >= 0; i--) {
            if (layouts[i].node.activeInHierarchy) layouts[i].updateLayout();
        }
    }

    private onDetailsClicked() {
        this._detailsExpanded = !this._detailsExpanded;
        this._applyDetailsVisibility();
    }

    private onCloseClicked() {
        this.close();
    }
    // ====================================================
    // 偷偷看
    // ====================================================

    private _setButtonEnabled(btnNode: cc.Node, enabled: boolean) {
        const btn = btnNode.getComponent(cc.Button);
        if (btn) btn.interactable = enabled;
        btnNode.opacity = enabled ? 255 : 128;
    }

    private _refreshPeekButton() {
        const hasHidden = hasHiddenCards(this._currentData, this._model, userStore.userRID);
        this._setButtonEnabled(this.peekBtnNode, hasHidden);
        if (hasHidden) this._reqPeekPrice();
    }

    private async onPeekClicked() {
        if (!this._currentData) return;
        this._setButtonEnabled(this.peekBtnNode, false);
        // 合并写数据在 TexasTableEvent → replay 数据层,视图经 REPLAY_DATA_CHANGE 自动刷新
        const result = await TexasTableEvent.PeekReplayHands(this._roomData, this._currentPage);
        if (!cc.isValid(this.node)) return;
        if (result.code === 0) {
            // 成功后合并数据已同步触发 REPLAY_DATA_CHANGE → _refreshPeekButton,
            // 按是否还有未亮牌决定按钮态(全看完则保持置灰),此处不再强制恢复高亮
            this._reqPeekPrice();
            this._reqDiamondBalance();
        } else {
            this._setButtonEnabled(this.peekBtnNode, true);
            viewManager.showToast(CPErrorCode.ServerErrorDescription(result.code));
        }
    }

    /** 偷偷看价格(阶梯收费,按已偷看次数取档) */
    private async _reqPeekPrice() {
        try {
            const peekCount = await TexasTableEvent.ReqReplayPeekTimes(this._roomData);
            const times = Math.min(peekCount, 4);
            const typeExt = 11 + 10 * times;
            await diamondModel.reqDiamondConfig(UITexasHistory.DIAMOND_CONFIG_PEEK);
            const config = diamondModel.getDiamondConfig(typeExt, UITexasHistory.DIAMOND_CONFIG_PEEK);
            if (!cc.isValid(this.node)) return;
            this.peekCostLabel.string = `${this._getPriceFromConfig(config)}`;
        } catch (e) {
            this.tracelog.warn('_reqPeekPrice failed', e);
        }
    }

    /** 从钻石配置中按小盲档位匹配价格 */
    private _getPriceFromConfig(diamondConfig: DiamondConfig): number {
        if (!diamondConfig?.setting) return 0;
        const sb = this._roomData.basicInfo.sbante?.sb || 0;
        for (const item of diamondConfig.setting) {
            if (item.sb === sb) {
                return item.price || 0;
            }
        }
        return diamondConfig.setting.length > 0 ? diamondConfig.setting[0].price || 0 : 0;
    }
    // ====================================================
    // 发发看
    // ====================================================

    private _refreshViewPubButton() {
        const model = this._model;
        const riverRevealed = model.publicCards[4] !== 0;
        const canView = !riverRevealed && model.hasMe;
        const hasHidden = canView && hasHiddenPublicCards(model.publicCards);
        this._setButtonEnabled(this.viewPubBtnNode, hasHidden);
        if (hasHidden) this._reqViewPubPrice();
    }

    private async onViewPubClicked() {
        if (!this._currentData) return;
        this._setButtonEnabled(this.viewPubBtnNode, false);
        const round = getViewPubRound(this._model.publicCards);
        // 合并写数据在 TexasTableEvent → replay 数据层,视图经 REPLAY_DATA_CHANGE 自动刷新
        const result = await TexasTableEvent.RevealReplayPublicCards(this._roomData, this._currentPage, round);
        if (!cc.isValid(this.node)) return;
        if (result.code === 0) {
            // 成功后合并数据已同步触发 REPLAY_DATA_CHANGE → _refreshViewPubButton 决定按钮态,此处不强制恢复高亮
            this._reqDiamondBalance();
        } else if (result.code === 90003) {
            // 该手牌尚未同步到历史记录(无专用 i18n key,用通用"服务器正忙,请稍后再试")
            this._setButtonEnabled(this.viewPubBtnNode, true);
            viewManager.showToast(i18nMgr.Get('error997'));
        } else {
            this._setButtonEnabled(this.viewPubBtnNode, true);
            viewManager.showToast(CPErrorCode.ServerErrorDescription(result.code));
        }
    }

    /** 发发看价格(VIP 免费次数优先,否则按轮次取钻石配置) */
    private async _reqViewPubPrice() {
        try {
            const freeCount = await TexasTableEvent.ReqReplayViewPubFreeCount(this._roomData);
            if (!cc.isValid(this.node)) return;
            if (freeCount > 0) {
                this.viewPubCostLabel.string = `${i18nMgr.Get('UIMIneVIPFreeTip')} ${freeCount}`;
                return;
            }
            const round = getViewPubRound(this._model.publicCards);
            const typeExt = round * 1000;
            await diamondModel.reqDiamondConfig(UITexasHistory.DIAMOND_CONFIG_VIEW_PUB);
            const config = diamondModel.getDiamondConfig(typeExt, UITexasHistory.DIAMOND_CONFIG_VIEW_PUB);
            if (!cc.isValid(this.node)) return;
            this.viewPubCostLabel.string = `${this._getPriceFromConfig(config)}`;
        } catch (e) {
            this.tracelog.warn('_reqViewPubPrice failed', e);
        }
    }
    // ====================================================
    // 收藏
    // ====================================================

    private onCollectClicked() {
        if (!this._model?.hasMe) return;
        if (this._isCollected) {
            this._reqRemoveCollect();
        } else {
            this._reqAddCollect();
        }
    }

    private _collectParamsBase() {
        const s = this._currentData?.s;
        return {
            room_id: s?.rid || this._roomData.roomID,
            room_unique_id: s?.unique || this._roomData.basicInfo.roomUniqueID || '',
            hand_num: s?.hand || this._currentPage
        };
    }

    private async _reqCollectStatus() {
        const params = this._collectParamsBase();
        if (!params.room_id || !params.hand_num) return;
        const isCollected = await TexasTableEvent.ReqReplayCollectStatus(this._roomData, params);
        if (!cc.isValid(this.node)) return;
        this._refreshCollectShow(isCollected);
    }

    private async _reqAddCollect() {
        const base = this._collectParamsBase();
        this._setButtonEnabled(this.favoBtnNode, false);
        const result = await TexasTableEvent.ReqReplayAddCollect(this._roomData, {
            id: 0,
            room_id: base.room_id,
            match_id: this._currentData?.s?.mid || this._roomData.matchID || 0,
            room_unique_id: base.room_unique_id,
            name: this._roomData.basicInfo.roomName || '',
            hand_num: base.hand_num,
            change: 0,
            type: 0,
            open: 0
        });
        if (!cc.isValid(this.node)) return;
        if (result.code === 0) {
            this._refreshCollectShow(true);
            viewManager.showToast(i18nMgr.Get('Collection_success'));
        } else {
            this._refreshCollectShow(this._isCollected);
            viewManager.showToast(CPErrorCode.ServerErrorDescription(result.code));
        }
    }

    private async _reqRemoveCollect() {
        const result = await TexasTableEvent.ReqReplayRemoveCollect(this._roomData, this._collectParamsBase());
        if (!cc.isValid(this.node)) return;
        if (result.code === 0) {
            this._refreshCollectShow(false);
            viewManager.showToast(i18nMgr.Get('adaptation10211'));
        } else {
            viewManager.showToast(CPErrorCode.ServerErrorDescription(result.code));
        }
    }

    /** 收藏按钮状态:参与过这手牌才可收藏;已收藏时星星点亮 */
    private _refreshCollectShow(isCollected: boolean) {
        this._isCollected = isCollected;
        const canCollect = !!this._model?.hasMe;
        this._setButtonEnabled(this.favoBtnNode, canCollect);
        if (this.favoStar) {
            this.favoStar.color = canCollect && isCollected ? UITexasHistory.COLLECTED_STAR_COLOR : cc.Color.WHITE;
        }
    }
    // ====================================================
    // 钻石余额(仅展示,不回写 store)
    // ====================================================

    private async _reqDiamondBalance() {
        const diamonds = await TexasTableEvent.ReqDiamondBalance();
        if (!cc.isValid(this.node)) return;
        if (diamonds != null) {
            this.diamondNumLabel.string = diamonds.toLocaleString('en-US');
        }
    }
}
