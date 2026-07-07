import { autoBindEvents, bindEvent, unBindEventsAll } from '../../../core/decorator/DataBind';
import { traceClass } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataReplay, { ReplayHandData } from '../../../data/room/texas/TexasGameRoomDataReplay';
import diamondModel from '../../../data/trade/DiamondModel';
import userStore from '../../../data/user/UserStore';
import { StringHelper } from '../../../helper/StringHelper';
import { CPErrorCode } from '../../../i18n/CPErrorCode';
import {
    WebMiscGameRecordRound,
    WebMiscGameRemoveRound,
    WebMiscGameRoundStatus,
    WebRoomCenterGameWatchNum,
    WebRoomCenterHistoryViewPublicCardsFreeCount,
    WebUserDiamondsWallet,
    WWW
} from '../../../net/https/WebRequest';
import UIComponentBaseDialog from '../../base/UIComponentDialogBase';
import AssetManager, { BUNDLE_RESOURCES } from '../../loader/AssetManager';
import TexasTableEvent from '../../scene/room/texas/events/TexasTableEvent';
import viewManager from '../../UIViewManager';
import StepSlider from '../../widget/StepSlider';
import HistoryPlayerCardItem from './HistoryPlayerCardItem';
import { getPlayerLastAction, getViewPubRound, hasHiddenCards, hasHiddenPublicCards, HistoryHandModel, parseHistoryHand } from './HistoryReplayModel';
import { ScoreRowMode, ScoreSectionView, StreetSectionView } from './HistorySections';

export type UITexasHistoryParam = {
    roomID: number;
    matchID: number;
};

const { ccclass, property, menu } = cc._decorator;

/**
 * 牌谱回放对话框。
 * prefab 迁自 pokerqueen(UITexasHistory.prefab):主节点走 @property 编辑器绑定,
 * 已绑定节点内部的子节点(标题标签/模板/价格标签等)按路径查找;详情区行节点用 prefab 内模板克隆。
 * 翻页滑条为 prefab 内置的通用 StepSlider 节点,编辑器绑定,接线方式对齐 UITexasReport。
 * prefab 精简:$Turn/$River 运行时克隆自 $Flop(改标题、补公牌位),$Showdown2 克隆自 $Showdown,
 * prefab 内不再保留这三个区块;克隆体内部子节点名沿用源区块($Flop_Cards / $Showdown_Childs 等)。
 */
@ccclass
@traceClass()
@menu('Dialog/History/UITexasHistory')
export default class UITexasHistory extends UIComponentBaseDialog<UITexasHistoryParam> {
    // ==================== 编辑器绑定(prefab 内对应老节点名) ====================
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
    @property({ type: cc.Node, displayName: 'Score结算区($Score)' })
    private scoreNode: cc.Node = null;
    @property({ type: cc.Node, displayName: 'Preflop区($Preflop)' })
    private preflopNode: cc.Node = null;
    @property({ type: cc.Node, displayName: 'Preflop标题空心牌容器($Preflop_title_childs)' })
    private preflopTitleCards: cc.Node = null;
    @property({ type: cc.Node, displayName: 'Flop区($Flop,Turn/River 运行时克隆自此)' })
    private flopNode: cc.Node = null;
    @property({ type: cc.Node, displayName: 'Showdown结算区($Showdown,Showdown2 运行时克隆自此)' })
    private showdownNode: cc.Node = null;
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
    // ==================== 详情区视图 ====================
    private scoreSection: ScoreSectionView = null;
    private preflopSection: StreetSectionView = null;
    private flopSection: StreetSectionView = null;
    private turnSection: StreetSectionView = null;
    private riverSection: StreetSectionView = null;
    private showdownSection: ScoreSectionView = null;
    private showdown2Section: ScoreSectionView = null;
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
        // top_block 的 BlockInputEvents 覆盖全屏会拦截 Scroller 拖动,禁用(对齐老版)
        const blockComp = this.topBlockNode?.getComponent(cc.BlockInputEvents);
        if (blockComp) blockComp.enabled = false;
        // Scroller 的 ScrollView 在代码里接线(迁移的 prefab 里 content 引用缺失,不依赖编辑器绑定)
        const scrollerNode = this.contentNode.parent?.parent;
        const scrollView = scrollerNode?.getComponent(cc.ScrollView) ?? scrollerNode?.addComponent(cc.ScrollView);
        if (scrollView) {
            scrollView.content = this.contentNode;
            scrollView.vertical = true;
            scrollView.horizontal = false;
        }
        this.detailsArrow = cc.find('Background/arrowsp', this.detailsBtnNode);
        this.peekCostLabel = cc.find('diamondIcon/$PeekCost', this.peekBtnNode)?.getComponent(cc.Label);
        this.viewPubCostLabel = cc.find('diamondIcon/$ViewPubCost', this.viewPubBtnNode)?.getComponent(cc.Label);
        this.favoStar = cc.find('Background/$star', this.favoBtnNode);
    }

    private _buildSections() {
        // Turn/River/Showdown2 区块运行时克隆(prefab 只保留 $Flop/$Showdown 一份);
        // 必须在 StreetSectionView 构造前克隆,构造器会把行模板从容器中摘除
        const turnNode = this._cloneStreetNode('Turn', 4, 1);
        const riverNode = this._cloneStreetNode('River', 5, 2);
        const showdown2Node = cc.instantiate(this.showdownNode);
        showdown2Node.name = '$Showdown2';
        showdown2Node.parent = this.showdownNode.parent;
        showdown2Node.setSiblingIndex(this.showdownNode.getSiblingIndex() + 1);
        // Score 区行模板(单套/双套),Showdown/Showdown2 共用单套模板
        const scoreChilds = cc.find('Shows/$Score_Childs', this.scoreNode);
        const singleTemplate = scoreChilds.getChildByName('$Score_Child');
        const dualTemplate = scoreChilds.getChildByName('$Score_Second_Child');
        singleTemplate.removeFromParent(false);
        dualTemplate.removeFromParent(false);
        this.scoreSection = new ScoreSectionView(this.scoreNode, '$Score_PublicCards', '$Score_Childs', singleTemplate, dualTemplate);
        this.preflopSection = new StreetSectionView(this.preflopNode, null, '$Preflop_Childs', '$Preflop_Child', true);
        this.flopSection = new StreetSectionView(this.flopNode, '$Flop_Cards', '$Flop_Childs', '$Flop_Child');
        this.turnSection = new StreetSectionView(turnNode, '$Flop_Cards', '$Flop_Childs', '$Flop_Child');
        this.riverSection = new StreetSectionView(riverNode, '$Flop_Cards', '$Flop_Childs', '$Flop_Child');
        this.showdownSection = new ScoreSectionView(this.showdownNode, '$Showdown_PublicCards', '$Showdown_Childs', singleTemplate);
        this.showdown2Section = new ScoreSectionView(showdown2Node, '$Showdown_PublicCards', '$Showdown_Childs', singleTemplate);
    }

    /**
     * 从 $Flop 克隆街道区块:改标题文字、补公牌位(标题公牌显示数量由子节点数决定,Flop 3 / Turn 4 / River 5),
     * 插到 $content 中 $Flop 之后,保持 Layout 纵向顺序
     */
    private _cloneStreetNode(flagText: string, titleCardCount: number, siblingOffset: number): cc.Node {
        const node = cc.instantiate(this.flopNode);
        node.name = `$${flagText}`;
        node.parent = this.flopNode.parent;
        node.setSiblingIndex(this.flopNode.getSiblingIndex() + siblingOffset);
        const flagLabel = cc.find('Title/flag', node)?.getComponent(cc.Label);
        if (flagLabel) flagLabel.string = flagText;
        const cardsContainer = cc.find('Title/$Flop_Cards', node);
        while (cardsContainer.childrenCount < titleCardCount) {
            const card = cc.instantiate(cardsContainer.children[0]);
            card.parent = cardsContainer;
        }
        return node;
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
        const cardPrefab = await AssetManager.getOrLoad(BUNDLE_RESOURCES, 'rc/dialog/history/HistoryPlayerCardItem', cc.Prefab);
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
        if (!this.pageSlider) return;
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

    /** 缓存命中时数据层直接回发 REPLAY_DATA_CHANGE,重复请求无副作用 */
    private _onSliderTouchEnd() {
        if (this._totalPage <= 0 || !this._roomData) return;
        TexasTableEvent.RequestReplay(this._roomData, this._currentPage);
    }

    /** 左右按钮换页:同步滑块位置后直接请求(程序设值不会触发 touch_end) */
    private _gotoPage(page: number) {
        this._currentPage = page;
        this._refreshPageLabel();
        if (this.pageSlider) this.pageSlider.value = page;
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
        this._refreshCollectShow(false);
        this._reqCollectStatus();
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
            const lastAct = getPlayerLastAction(player.seatID, this._currentData);
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
        this.scoreSection.show(
            model.hasResult ? model.players : [],
            model,
            cardCount,
            model.haveSecondCard ? ScoreRowMode.DualBoard : ScoreRowMode.FirstBoard,
            model.publicCards,
            showdownPot
        );
        this.preflopSection.show(model.preflop, []);
        this.flopSection.show(model.flop, model.publicCards);
        this.turnSection.show(model.turn, model.publicCards);
        this.riverSection.show(model.river, model.publicCards);
        this.showdownSection.show(model.hasResult ? model.winners : [], model, cardCount, ScoreRowMode.FirstBoard, model.publicCards, showdownPot);
        if (model.haveSecondCard) {
            this.showdown2Section.show(model.hasResult ? model.winners : [], model, cardCount, ScoreRowMode.SecondBoard, model.secondPublicCards, showdownPot);
        } else {
            // 从双套牌局切到单套时清掉残留
            this.showdown2Section.clearLabels();
            this.showdown2Section.node.active = false;
        }
        this._applyDetailsVisibility();
    }

    /** 详情区显隐 = 展开状态 && 该区有数据 */
    private _applyDetailsVisibility() {
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
    }

    private onDetailsClicked() {
        this._detailsExpanded = !this._detailsExpanded;
        this._applyDetailsVisibility();
        if (this.detailsArrow) {
            this.detailsArrow.scaleY *= -1;
        }
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
        this._setButtonEnabled(this.peekBtnNode, true);
        if (result.code === 0) {
            this._reqPeekPrice();
            this._reqDiamondBalance();
        } else {
            viewManager.showToast(CPErrorCode.ServerErrorDescription(result.code));
        }
    }

    /** 偷偷看价格(阶梯收费,按已偷看次数取档) */
    private async _reqPeekPrice() {
        try {
            const peekCount = await this._reqWatchNum();
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

    private _reqWatchNum(): Promise<number> {
        return new Promise(resolve => {
            WWW.Instance.CommonAPI({
                web_class: WebRoomCenterGameWatchNum,
                body: WebRoomCenterGameWatchNum.Request({ room_id: this._roomData.roomID })
            }).then(
                (res: any) => resolve(res?.data?.pay_times || 0),
                () => resolve(0)
            );
        });
    }

    /** 从钻石配置中按小盲档位匹配价格 */
    private _getPriceFromConfig(diamondConfig: any): number {
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
        this._setButtonEnabled(this.viewPubBtnNode, true);
        if (result.code === 0) {
            this._reqDiamondBalance();
        } else if (result.code === 90003) {
            viewManager.showToast('该手牌尚未同步到历史记录，请稍后再试');
        } else {
            viewManager.showToast(CPErrorCode.ServerErrorDescription(result.code));
        }
    }

    /** 发发看价格(VIP 免费次数优先,否则按轮次取钻石配置) */
    private async _reqViewPubPrice() {
        try {
            const freeCount = await this._reqViewPubFreeCount();
            if (!cc.isValid(this.node)) return;
            if (freeCount > 0) {
                this.viewPubCostLabel.string = `VIP免费 ${freeCount}`;
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

    private _reqViewPubFreeCount(): Promise<number> {
        return new Promise(resolve => {
            WWW.Instance.CommonAPI({
                web_class: WebRoomCenterHistoryViewPublicCardsFreeCount
            }).then(
                (res: any) => resolve(res?.data?.free_count ?? res?.data?.data?.free_count ?? 0),
                () => resolve(0)
            );
        });
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

    private _reqCollectStatus() {
        const params = this._collectParamsBase();
        if (!params.room_id || !params.hand_num) return;
        WWW.Instance.CommonAPI({
            web_class: WebMiscGameRoundStatus,
            body: WebMiscGameRoundStatus.Request(params)
        }).then((res: any) => {
            if (!cc.isValid(this.node)) return;
            const records = res?.data?.data?.records ?? res?.data?.records;
            const isCollected = res?.code === 0 && records?.length > 0 && records[0].remove === 0;
            this._refreshCollectShow(isCollected);
        });
    }

    private _reqAddCollect() {
        const base = this._collectParamsBase();
        this._setButtonEnabled(this.favoBtnNode, false);
        WWW.Instance.CommonAPI({
            web_class: WebMiscGameRecordRound,
            body: WebMiscGameRecordRound.Request({
                id: 0,
                room_id: base.room_id,
                match_id: this._currentData?.s?.mid || this._roomData.matchID || 0,
                room_unique_id: base.room_unique_id,
                name: this._roomData.basicInfo.roomName || '',
                hand_num: base.hand_num,
                change: 0,
                type: 0,
                open: 0
            })
        }).then(
            (res: any) => {
                if (!cc.isValid(this.node)) return;
                if (res?.code === 0) {
                    this._refreshCollectShow(true);
                    viewManager.showToast('收藏成功');
                } else {
                    this._refreshCollectShow(this._isCollected);
                    viewManager.showToast(CPErrorCode.ServerErrorDescription(res?.code));
                }
            },
            (err: any) => {
                if (!cc.isValid(this.node)) return;
                this._refreshCollectShow(this._isCollected);
                viewManager.showToast(CPErrorCode.ServerErrorDescription(err?.code));
            }
        );
    }

    private _reqRemoveCollect() {
        WWW.Instance.CommonAPI({
            web_class: WebMiscGameRemoveRound,
            body: WebMiscGameRemoveRound.Request(this._collectParamsBase())
        }).then((res: any) => {
            if (!cc.isValid(this.node)) return;
            if (res?.code === 0) {
                this._refreshCollectShow(false);
                viewManager.showToast('已取消收藏');
            } else {
                viewManager.showToast(CPErrorCode.ServerErrorDescription(res?.code));
            }
        });
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

    private _reqDiamondBalance() {
        WWW.Instance.CommonAPI({
            web_class: WebUserDiamondsWallet
        }).then((res: any) => {
            if (!cc.isValid(this.node)) return;
            const diamonds = res?.data?.diamonds_wallet?.diamonds;
            if (diamonds != null) {
                this.diamondNumLabel.string = diamonds.toLocaleString('en-US');
            }
        });
    }
}
