import { autoBindEvents, bindEvent, unBindEventsAll } from '../../../core/decorator/DataBind';
import { traceClass } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataBasic from '../../../data/room/texas/TexasGameRoomDataBasic';
import TexasGameRoomDataReport, {
    TexasReportInsuranceRecord,
    TexasReportJackpotRecord,
    TexasReportObserver,
    TexasReportPlayerInfo,
    TexasReportRoundMode,
    TexasReportSquidRecord,
    TexasReportSquidRoundSnapshot,
    TexasReportSummary
} from '../../../data/room/texas/TexasGameRoomDataReport';
import { CCViewData } from '../../../data/system/CCViewData';
import userStore from '../../../data/user/UserStore';
import { StringHelper } from '../../../helper/StringHelper';
import TimeHelper from '../../../helper/TimeHelper';
import { i18nLabel } from '../../../i18n/i18nLabel';
import { i18nMgr } from '../../../i18n/i18nMgr';
import UIComponentBaseDialog from '../../base/UIComponentDialogBase';
import TexasReportEvent from '../../scene/room/texas/events/TexasReportEvent';
import viewManager from '../../UIViewManager';
import StepSlider from '../../widget/StepSlider';
import ReportDataItem from './ReportDataItem';
import ReportObserverItem from './ReportObserverItem';
import TexasReportPresentation, { TexasReportMode } from './TexasReportPresentation';

const { ccclass, property, menu } = cc._decorator;

/** 战绩面板入参（由 UITexasMenu 触发 openDialog('TexasReport', ...) 传入）。 */
export type UITexasReportParam = {
    roomID: number;
    matchID: number;
};

type ReportBottomTab = 'battle' | 'insurance' | 'jackpot' | 'mode';

/**
 * 牌桌战绩面板（重构版，对应 pokerqueen UITexasReportComponent）。
 *
 * 设计原则（参考 ARCHITECTURE.md §5.5 自治组件模式）：
 *  - 父组件（UITexasMenu）只调一次 openDialog('TexasReport', { roomID, matchID })。
 *  - 数据驱动：所有列表来自 TexasGameRoomDataReport 上的 @observable 字段。
 *  - 增量更新：服务端 Winner/Seated/Standup/ChipsChange 已在消息层自动写入 report；本面板只 @bindEvent 订阅。
 *  - HTTP 数据（鱿鱼/蘑菇 分页、保险历史）由面板自己发请求并写回 report 同样的子字段，统一在数据层。
 *
 * Prefab 约定：与 pokerqueen 完全一致（layer/bg/$Top + $content/dataList/header 等节点路径），
 * 没有就跳过对应渲染；缺节点不报错。后续视图层补 prefab 时直接复用 pokerqueen 的 UITexasReport.prefab。
 */
@ccclass
@menu('Dialog/Report/UITexasReport')
@traceClass()
export default class UITexasReport extends UIComponentBaseDialog<UITexasReportParam> {
    // ============================================================
    // @property —— prefab 模板（从 Assets 拖入）
    // ============================================================
    @property({ type: cc.Prefab, displayName: '观众条目 Prefab', tooltip: 'rc/widget/PeopleItem' })
    private peopleItem: cc.Prefab = null;
    @property({ type: cc.Prefab, displayName: '战绩数据行 Prefab', tooltip: 'rc/scene/room/texas/widget/ReportDataItem' })
    private reportDataItem: cc.Prefab = null;
    // ─── 顶栏（layer/bg/$Top）──────────────────────────
    @property({ type: cc.Label, displayName: '[顶栏] 房间号 room_id' })
    private roomIdLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: '[顶栏] 剩余时间 remain_time' })
    private remainTimeLabel: cc.Label = null;
    @property({ type: cc.Node, displayName: '[顶栏] 切换"只显示在桌玩家" show_player_in_table' })
    private showOnlyTableNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '[顶栏] 复选 - 选中态 checkbox_on' })
    private checkboxOn: cc.Node = null;
    @property({ type: cc.Node, displayName: '[顶栏] 复选 - 未选 checkbox_off' })
    private checkboxOff: cc.Node = null;
    @property({ type: cc.Node, displayName: '[顶栏] 鱿鱼/蘑菇 轮次描述 squidRound' })
    private squidRoundNode: cc.Node = null;
    @property({ type: cc.Label, displayName: '[顶栏] 轮次文案 squidRound/squid_text' })
    private squidRoundText: cc.Label = null;
    @property({ type: cc.Node, displayName: '[顶栏] 蘑菇押金说明容器 mushDir' })
    private mushDirNode: cc.Node = null;
    @property({ type: cc.Label, displayName: '[顶栏] 蘑菇押金说明 mushDir/mushDirText' })
    private mushDirText: cc.Label = null;
    @property({ type: cc.Node, displayName: '[顶栏] 关闭按钮 exit_button' })
    private exitBtn: cc.Node = null;
    @property({ type: cc.Node, displayName: '[蒙层] 外部点击关闭区 bg_click' })
    private bgClickNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '[背景] 内容背景 bg' })
    private bgNode: cc.Node = null;
    @property({ type: cc.ScrollView, displayName: '[自适应列表] 中间区域统一纵向滚动' })
    private unifiedScrollView: cc.ScrollView = null;
    @property({ type: cc.Node, displayName: '[自适应列表] 玩家战绩区域 dataList' })
    private dataListNode: cc.Node = null;
    // ─── 公共统计区（publicArea）──────────────────────
    @property({ type: cc.Label, displayName: '[公共] 总底池 total_money' })
    private totalPotLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: '[公共] 总带入 total_bring' })
    private totalBringLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: '[公共] 当前手数 cur_hand' })
    private curHandLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: '[公共] 场均底池 ver_bottom' })
    private verBottomLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: '[公共] 已用时间 cur_time' })
    private curTimeLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: '[公共] 保险池 insurance_pool' })
    private insurancePoolLabel: cc.Label = null;
    // ─── 列表容器（4 个 tab 的 data_content）──────────
    @property({ type: cc.Node, displayName: '[列表] 战况/保险 容器 reportScrow' })
    private reportScrow: cc.Node = null;
    @property({ type: cc.Node, displayName: '[列表] 战况/保险 内容节点 reportScrow/view/data_content' })
    private battleContent: cc.Node = null;
    @property({ type: cc.Node, displayName: '[列表] 鱿鱼 容器 squidListView' })
    private squidListView: cc.Node = null;
    @property({ type: cc.Node, displayName: '[列表] 鱿鱼 内容节点 squidListView/view/data_content' })
    private squidContent: cc.Node = null;
    @property({ type: cc.Node, displayName: '[列表] 蘑菇 容器 mushRoomListView' })
    private mushRoomListView: cc.Node = null;
    @property({ type: cc.Node, displayName: '[列表] 蘑菇 内容节点 mushRoomListView/view/data_content' })
    private mushContent: cc.Node = null;
    @property({ type: cc.Node, displayName: '[列表] Jackpot 容器 jackpotListView' })
    private jackpotListView: cc.Node = null;
    @property({ type: cc.Node, displayName: '[列表] Jackpot 内容节点 jackpotListView/view/data_content' })
    private jackpotContent: cc.Node = null;
    @property({ type: cc.Node, displayName: '[列表] 无数据提示 noData' })
    private noDataNode: cc.Node = null;
    // ─── 表头（dataList/header）────────────────────────
    @property({ type: cc.Node, displayName: '[表头] 战况通用 ListBar1' })
    private listBar1: cc.Node = null;
    @property({ type: cc.Node, displayName: '[表头] 战况(带 mode) ListBar3' })
    private listBar3: cc.Node = null;
    @property({ type: cc.Node, displayName: '[表头] 战况玩法列 ListBar3/Text_Mode' })
    private listBar3ModeTitleNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '[表头] 鱿鱼 listBarSquid' })
    private listBarSquid: cc.Node = null;
    @property({ type: cc.Node, displayName: '[表头] 蘑菇 listBarMushRoom' })
    private listBarMushRoom: cc.Node = null;
    @property({ type: cc.Node, displayName: '[表头] Jackpot listBarJackpot' })
    private listBarJackpot: cc.Node = null;
    @property({ type: cc.Node, displayName: '[表头] 保险 ListBar4' })
    private listBar4: cc.Node = null;
    // ─── Jackpot 顶栏 ──────────────────────────────────
    @property({ type: cc.Node, displayName: '[Jackpot] 顶部 bar JackpotBar' })
    private jackpotBarNode: cc.Node = null;
    @property({ type: cc.Label, displayName: '[Jackpot] 池子总额标签 JackpotBar/JackpotNumber (Label)' })
    private jackpotTotalLabel: cc.Label = null;
    // ─── 观众（peopleNode / peopleScrow）──────────────
    @property({ type: cc.Label, displayName: '[观众] 数量 peopleNode/peopelNum' })
    private peopleNum: cc.Label = null;
    @property({ type: cc.Node, displayName: '[观众] 内容节点 peopleScrow/view/people_content' })
    private peopleContent: cc.Node = null;
    // ─── 鱿鱼分页（squidPageInfo）─────────────────────
    @property({ type: cc.Node, displayName: '[分页] 容器 squidPageInfo' })
    private pageInfoNode: cc.Node = null;
    @property({ type: cc.Label, displayName: '[分页] 页码 cc_Label$page' })
    private pageText: cc.Label = null;
    @property({ type: cc.Node, displayName: '[分页] 左翻 $left_btn' })
    private leftBtn: cc.Node = null;
    @property({ type: cc.Node, displayName: '[分页] 右翻 $right_btn' })
    private rightBtn: cc.Node = null;
    @property({ type: StepSlider, displayName: '[分页] 滑块 StepSlider' })
    private sliderPlus: StepSlider = null;
    // ─── 底部 tab 切换（bottomToggle）────────────────
    @property({ type: cc.Node, displayName: '[底部] 切换根 bottomToggle' })
    private bottomToggleRoot: cc.Node = null;
    @property({ type: cc.Node, displayName: '[底部] 战况按钮 battleToggle' })
    private battleToggleBtn: cc.Node = null;
    @property({ type: cc.Node, displayName: '[底部] 保险按钮 baoxianToggle' })
    private baoxianToggleBtn: cc.Node = null;
    @property({ type: cc.Node, displayName: '[底部] Jackpot 按钮 JackpotToggle' })
    private jackpotToggleBtn: cc.Node = null;
    @property({ type: cc.Node, displayName: '[底部] 鱿鱼/蘑菇 按钮 squidToggle' })
    private squidToggleBtn: cc.Node = null;
    @property({ type: cc.Node, displayName: '[底部] 战况 选中标记' })
    private battleCheckmark: cc.Node = null;
    @property({ type: cc.Node, displayName: '[底部] 保险 选中标记' })
    private baoxianCheckmark: cc.Node = null;
    @property({ type: cc.Node, displayName: '[底部] Jackpot 选中标记' })
    private jackpotCheckmark: cc.Node = null;
    @property({ type: cc.Node, displayName: '[底部] 鱿鱼/蘑菇 选中标记' })
    private squidCheckmark: cc.Node = null;
    @property({ type: cc.Node, displayName: '[底部] 鱿鱼/蘑菇 文案节点 squidToggle/text' })
    private squidToggleTextNode: cc.Node = null;
    // ─── 数据源 ──────────────────────────────────────
    private _roomData: TexasGameRoomData = null;
    private _report: TexasGameRoomDataReport = null;
    private _subType: TexasReportMode = 'none';
    private _curTab: ReportBottomTab = 'battle';
    private _onlyTablePlayers: boolean = false;
    private _squidCurRound: number = 0;
    // loading 管正在路上的请求，fetched 则放在房间数据里管是否真的拉成功过。
    private _isInsuranceLoading: boolean = false;
    private _isJackpotLoading: boolean = false;
    // 同一轮只发一个请求，避免快速拖分页时重复打接口。
    private _squidPendingRounds: Set<number> = new Set();
    // 每次重新打开都加一代，旧一代的回包回来后直接丢掉。
    private _requestGeneration: number = 0;
    private _dataListMinHeight: number = 0;
    private _dataListContentTop: number = 0;
    private _dataListContentBottom: number = 0;
    private _unifiedListBottom: number = 0;
    private _pendingListLayoutContent: cc.Node = null;
    // ============================================================
    // 生命周期
    // ============================================================
    protected onLoad(): void {
        const click = (n: cc.Node, fn: () => void) => n.on(cc.Node.EventType.TOUCH_END, fn, this);
        click(this.battleToggleBtn, () => this._onClickTab('battle'));
        click(this.squidToggleBtn, () => this._onClickTab('mode'));
        click(this.baoxianToggleBtn, () => this._onClickTab('insurance'));
        click(this.jackpotToggleBtn, () => this._onClickTab('jackpot'));
        click(this.leftBtn, () => this._onClickPage(false));
        click(this.rightBtn, () => this._onClickPage(true));
        click(this.showOnlyTableNode, () => this._onToggleOnlyTablePlayers());
        click(this.exitBtn, () => this.close());
        click(this.bgClickNode, () => this.close());
        this._setupUnifiedList();
    }

    public initialize(param: UITexasReportParam): void {
        this._roomData = roomDataManager.getRoomData<TexasGameRoomData>(param.roomID, param.matchID);
        if (!this._roomData) {
            this.close();
            return;
        }
        this._report = this._roomData.report;
        this._curTab = 'battle';
        this._onlyTablePlayers = false;
        this._squidCurRound = 0;
        this._isInsuranceLoading = false;
        this._isJackpotLoading = false;
        this._squidPendingRounds = new Set();
        this._requestGeneration += 1;
        this._syncSubType();
        this._refreshTopBar();
        this._refreshBottomToggleState();
        this._refreshContentVisible();
        this._refreshTablePlayerToggle();
        this._refreshListBar();
        this._requestRoomers();
        if (this._subType !== 'none') {
            if (this._report.squidRounds.size > 0) {
                this._squidCurRound = TexasReportPresentation.getLatestRound(this._report.squidRounds);
                this._setupSlider();
                this._refreshPageText();
            }
            // 缓存先拿来展示，但最新轮数还是问一次服务端，免得一直停在旧轮次。
            this._fetchSquidRound(0);
        }
    }

    @bindEvent(CCViewData.FRAME_SIZE_UPDATE, { dataSource: 'ccviewData', initPriority: 20 })
    protected onFrameResize(
        visibleSizeWidth: number,
        visibleSizeHeight: number,
        frameSizeWidth: number,
        frameSizeHeight: number,
        suggestScale: number,
        saveAreaTop: number
    ) {
        const bgWidget = this.bgNode.getComponent(cc.Widget);
        bgWidget.top = saveAreaTop;
        bgWidget.updateAlignment();
    }

    protected onEnable(): void {
        if (!this._report) return;
        this._bindEventsAndRefresh();
        this.unifiedScrollView?.scrollToTop(0);
        this._startRemainTimeTick();
    }

    protected onDisable(): void {
        unBindEventsAll(this);
        this.unschedule(this._commitPendingListLayout);
        this._pendingListLayoutContent = null;
        this._stopRemainTimeTick();
    }

    private _bindEventsAndRefresh(): void {
        if (!this._report) return;
        autoBindEvents(this, { report: this._report, basic: this._roomData.basicInfo });
    }
    // ============================================================
    // @bindEvent —— 数据驱动刷新
    // ============================================================
    @bindEvent(TexasGameRoomDataReport.PLAYERS_CHANGE, 'report')
    private _onPlayersChange(_players: TexasReportPlayerInfo[]): void {
        if (this._curTab === 'battle') this._renderBattleList();
    }

    /** 1129 JackpotGoldChange：面板打开期间奖池变化实时刷新顶栏总额（displayPool 由事件参数带入，单位分） */
    @bindEvent(TexasGameRoomDataBasic.JACKPOT_CHANGE, { dataSource: 'basic', initIgnore: true })
    private _onJackpotPoolChange(_hasJackpot: boolean, displayPool: number): void {
        this.jackpotTotalLabel.string = `${Math.floor((displayPool || 0) / 100)}`;
    }

    @bindEvent(TexasGameRoomDataReport.OBSERVERS_CHANGE, 'report')
    private _onObserversChange(observers: TexasReportObserver[]): void {
        this._renderObservers(observers);
    }

    @bindEvent(TexasGameRoomDataReport.SUMMARY_CHANGE, 'report')
    private _onSummaryChange(_summary: TexasReportSummary): void {
        this._renderPublicArea();
    }

    @bindEvent(TexasGameRoomDataReport.JACKPOT_CHANGE, 'report')
    private _onJackpotChange(_records: TexasReportJackpotRecord[]): void {
        this._isJackpotLoading = false;
        if (this._curTab === 'jackpot') this._renderJackpotList();
        this._refreshJackpotTotal();
    }

    @bindEvent(TexasGameRoomDataReport.INSURANCE_CHANGE, 'report')
    private _onInsuranceChange(_records: TexasReportInsuranceRecord[]): void {
        if (this._curTab === 'insurance') this._renderInsuranceList();
    }

    @bindEvent(TexasGameRoomDataReport.SQUID_ROUND_CHANGE, 'report')
    private _onSquidChange(_rounds: Map<number, TexasReportSquidRoundSnapshot>): void {
        if (this._curTab === 'mode') {
            // totalRound 在首屏拉取前是 0，pageInfoNode / squidRoundNode 会被 _refreshContentVisible 隐藏；
            // 数据回来后必须重新判定一次可见性，否则要等到下次切 tab 才看得到分页 slider。
            this._refreshContentVisible();
            this._renderSquidList();
            this._refreshPageText();
        }
    }
    // ============================================================
    // 渲染
    // ============================================================
    private _refreshTopBar(): void {
        this.roomIdLabel.string = `${this._roomData.roomID}-${this._roomData.basicInfo.handNum || 0}`;
        this._refreshRemainTime();
    }

    private _refreshRemainTime(): void {
        const playDuration = this._roomData?.basicInfo.playDuration || 0;
        const startTime = this._report?.summary.startTime || 0;
        if (playDuration > 0 && startTime > 0) {
            const used = Math.floor(Date.now() / 1000) - startTime;
            const remain = Math.max(0, playDuration - used);
            this.remainTimeLabel.string = TimeHelper.ShowRemainingSemicolon(remain);
        } else {
            this.remainTimeLabel.string = '--:--:--';
        }
    }

    private _startRemainTimeTick(): void {
        this._stopRemainTimeTick();
        this.schedule(this._refreshRemainTime, 1);
    }

    private _stopRemainTimeTick(): void {
        this.unschedule(this._refreshRemainTime);
    }

    private _renderPublicArea(): void {
        const s = this._report.summary;
        this.totalPotLabel.string = `${i18nMgr.Get('UISituationTotalPot')} ${StringHelper.GetLongString(s.totalPot)}`;
        this.totalBringLabel.string = `${i18nMgr.Get('UISituationTotalBringIn')} ${StringHelper.GetLongString(s.totalBringin)}`;
        this.curHandLabel.string = `${i18nMgr.Get('UISituationCurHandNum')} ${s.totalHand}`;
        const avgStr =
            s.totalHand > 0
                ? (() => {
                      const avg = s.totalPot / s.totalHand / 100;
                      return Number.isInteger(avg) ? `${avg}` : avg.toFixed(2);
                  })()
                : '0';
        this.verBottomLabel.string = `${i18nMgr.Get('UISituationVerBottom')} ${avgStr}`;
        const used = s.startTime > 0 ? Math.floor(Date.now() / 1000) - s.startTime : 0;
        this.curTimeLabel.string = `${i18nMgr.Get('UISituationCurTime')} ${this._formatDuration(used)}`;
        this.insurancePoolLabel.string = `${i18nMgr.Get('UITexasHistory_insurance')} ${StringHelper.GetLongString(s.insurance)}`;
    }

    private _renderBattleList(): void {
        const content = this._currentDataContent();
        content.removeAllChildren();
        const tableUserIDs = this._getTableUserIDs();
        const list = TexasReportPresentation.filterAndSortPlayers(this._report.players, tableUserIDs, this._onlyTablePlayers);
        for (const p of list) {
            this._createDataItem(content).showPlayer(p, {
                mode: this._subType,
                atTable: tableUserIDs.has(Number(p.userRid)),
                currentUserID: userStore.userRID,
                onClick: player => this._openPlayerInfo(player)
            });
        }
        this._drawColumnDividers(content);
    }

    private _createDataItem(content: cc.Node): ReportDataItem {
        const node = cc.instantiate(this.reportDataItem);
        node.parent = content;
        // Prefab 已经绑好组件，这里直接拿，缺绑定就尽早报出来。
        return node.getComponent(ReportDataItem);
    }

    private _getTableUserIDs(): Set<number> {
        const userIDs = new Set<number>();
        const ssm = this._roomData.seatsStateManager;
        for (let i = 1; i <= (ssm.seatsCount || 0); i++) {
            const seat = ssm.getSeatPlayer(i);
            const userID = Number(seat?.userID || 0);
            if (userID > 0) userIDs.add(userID);
        }
        return userIDs;
    }

    private _renderObservers(observers: TexasReportObserver[]): void {
        this.peopleContent.removeAllChildren();
        this.peopleNum.string = `${observers.length}`;
        for (const ob of observers) {
            const node = cc.instantiate(this.peopleItem);
            node.parent = this.peopleContent;
            // PeopleItem 也一样，只认 Prefab 上已经绑好的组件。
            const item = node.getComponent(ReportObserverItem);
            item.show(ob, observer => this._openPlayerInfoByID(Number(observer.userRid || 0)));
        }
    }

    private _renderJackpotList(): void {
        this.jackpotContent.removeAllChildren();
        const records = this._report.jackpotRecords;
        if (records.length <= 0) {
            this._drawColumnDividers(this.jackpotContent);
            this._updateNoDataState();
            return;
        }
        for (const r of records) {
            this._createDataItem(this.jackpotContent).showJackpot(r, userStore.userRID);
        }
        this._drawColumnDividers(this.jackpotContent);
        this._updateNoDataState();
    }

    private _refreshJackpotTotal(): void {
        // 与旧版一致：优先主奖池 jackpotParentGold，缺省回退模版奖池
        const total = Math.floor((this._roomData.basicInfo.jackpotDisplayPool || 0) / 100);
        this.jackpotTotalLabel.string = `${total}`;
    }

    private _renderInsuranceList(): void {
        this.battleContent.removeAllChildren();
        for (const r of this._report.insuranceRecords) {
            this._createDataItem(this.battleContent).showInsurance(r, userStore.userRID);
        }
        this._drawColumnDividers(this.battleContent);
        this._updateNoDataState();
    }

    private _renderSquidList(): void {
        const content = this._subType === 'squid' ? this.squidContent : this.mushContent;
        content.removeAllChildren();
        const records = this._currentSquidRecords();
        const currentUserNames = [userStore.name, this._roomData.mine.player?.name || ''];
        for (const r of records) {
            this._createDataItem(content).showModeRecord(r, this._subType, userStore.userRID, currentUserNames);
        }
        this._drawColumnDividers(content);
        this._updateNoDataState();
    }
    // ============================================================
    // Tab & Toggle
    // ============================================================
    private _onClickTab(tab: ReportBottomTab): void {
        this._syncSubType();
        if (tab === 'mode' && this._subType === 'none') return;
        if (tab === 'jackpot' && !this._isJackpotEnabled()) return;
        if (tab === 'insurance' && !this._isInsuranceEnabled()) return;
        if (this._curTab === tab) return;
        this._curTab = tab;
        this._refreshBottomToggleState();
        this._refreshContentVisible();
        this._refreshListBar();
        this._refreshCurrentList();
        this.unifiedScrollView?.scrollToTop(0);
        if (tab === 'mode') {
            // 每次切进来都顺手校验最新一轮，鱿鱼和蘑菇走的是同一套逻辑。
            this._fetchSquidRound(0);
            return;
        }
        if (tab === 'jackpot' && !this._report.jackpotFetched) this._requestJackpotSummary();
        if (tab === 'insurance' && !this._report.insuranceFetched) this._fetchInsuranceHistory();
    }

    private _onToggleOnlyTablePlayers(): void {
        this._onlyTablePlayers = !this._onlyTablePlayers;
        this._refreshTablePlayerToggle();
        // battleContent 是战况/保险共用容器；在保险/Jackpot/模式 tab 下不能误覆盖。
        if (this._curTab === 'battle') {
            this._renderBattleList();
            this.unifiedScrollView?.scrollToTop(0);
        }
    }

    private _refreshTablePlayerToggle(): void {
        this.checkboxOn.active = this._onlyTablePlayers;
        this.checkboxOff.active = !this._onlyTablePlayers;
    }

    private _refreshBottomToggleState(): void {
        this._syncSubType();
        this._refreshMushDir();
        this._refreshModeToggleTitle();
        const showMode = this._subType !== 'none';
        const showJackpot = this._isJackpotEnabled();
        const showInsurance = this._isInsuranceEnabled();
        const anyBottom = showMode || showJackpot || showInsurance;
        this.bottomToggleRoot.active = anyBottom;
        this.battleToggleBtn.active = anyBottom;
        this.squidToggleBtn.active = showMode;
        this.baoxianToggleBtn.active = showInsurance;
        this.jackpotToggleBtn.active = showJackpot;
        if (!anyBottom) this._curTab = 'battle';
        else if (this._curTab === 'mode' && !showMode) this._curTab = 'battle';
        else if (this._curTab === 'jackpot' && !showJackpot) this._curTab = showMode ? 'mode' : 'battle';
        else if (this._curTab === 'insurance' && !showInsurance) this._curTab = 'battle';
        this.battleCheckmark.active = this._curTab === 'battle';
        this.baoxianCheckmark.active = showInsurance && this._curTab === 'insurance';
        this.jackpotCheckmark.active = showJackpot && this._curTab === 'jackpot';
        this.squidCheckmark.active = showMode && this._curTab === 'mode';
    }

    private _refreshContentVisible(): void {
        const isBattle = this._curTab === 'battle';
        const isInsurance = this._curTab === 'insurance';
        const isJackpot = this._curTab === 'jackpot';
        const isMode = this._curTab === 'mode';
        this.reportScrow.active = isBattle || isInsurance;
        this.jackpotListView.active = isJackpot;
        this.jackpotBarNode.active = isJackpot;
        this.squidListView.active = isMode && this._subType === 'squid';
        this.mushRoomListView.active = isMode && this._subType === 'mush';
        const totalRound = this._squidTotalRound();
        const showPage = isMode && totalRound > 0;
        this.pageInfoNode.active = showPage;
        this.squidRoundNode.active = showPage;
        this._refreshUnifiedListViewport(showPage);
        if (isJackpot) this._refreshJackpotTotal();
        this._updateNoDataState();
    }

    private _refreshListBar(): void {
        const sub = this._subType;
        [this.listBar1, this.listBar3, this.listBarSquid, this.listBarMushRoom, this.listBarJackpot, this.listBar4].forEach(n => (n.active = false));
        if (this._curTab === 'battle') {
            const useBar3 = sub !== 'none';
            this.listBar1.active = !useBar3;
            this.listBar3.active = useBar3;
            if (useBar3) this._refreshBattleModeHeaderTitle();
        } else if (this._curTab === 'insurance') {
            this.listBar4.active = true;
        } else if (this._curTab === 'mode') {
            if (sub === 'squid') this.listBarSquid.active = true;
            if (sub === 'mush') this.listBarMushRoom.active = true;
        } else if (this._curTab === 'jackpot') {
            this.listBarJackpot.active = true;
        }
    }

    /** ListBar3 两种玩法共用，这里跟着房间类型换成“蘑菇”或“鱿鱼”。 */
    private _refreshBattleModeHeaderTitle(): void {
        const title = this.listBar3ModeTitleNode.getComponent(i18nLabel);
        title.i18NString = this._subType === 'mush' ? 'UIMush' : 'UISquid';
    }

    private _refreshMushDir(): void {
        const isMush = this._subType === 'mush';
        const isSquid = this._subType === 'squid';
        this.mushDirNode.active = isMush || isSquid;
        if (isMush) {
            const tpl = i18nMgr.Get('UIMushYaJinDir');
            const base = this._roomData.basicInfo.mushroomBase || 0;
            this.mushDirText.string = StringHelper.Format(tpl, [StringHelper.GetLongString(base)]);
        } else if (isSquid) {
            const base = this._roomData.basicInfo.squidBase || 0;
            this.mushDirText.string = `${i18nMgr.Get('UISquidYaJin')} ${StringHelper.GetLongString(base)}`;
        }
    }

    /** 蘑菇/鱿鱼模式下，底部 tab 的"鱿鱼记录/蘑菇记录"文案随玩法切换。 */
    private _refreshModeToggleTitle(): void {
        const node = this.squidToggleTextNode;
        const key = this._subType === 'mush' ? 'UITexasReport_MushRoomRecord' : 'UITexasReport_SquidRecord';
        const i18nComp = node.getComponent(i18nLabel);
        if (i18nComp) {
            i18nComp.i18NString = key;
            return;
        }
        const label = node.getComponent(cc.Label);
        if (label) label.string = i18nMgr.Get(key);
    }

    private _refreshCurrentList(): void {
        if (this._curTab === 'battle') this._renderBattleList();
        else if (this._curTab === 'jackpot') this._renderJackpotList();
        else if (this._curTab === 'insurance') this._renderInsuranceList();
        else if (this._curTab === 'mode') this._renderSquidList();
    }
    // ============================================================
    // 分页 (squid/mush)
    // ============================================================
    private _onClickPage(next: boolean): void {
        const total = this._squidTotalRound();
        if (total <= 0) return;
        let nextRound = this._squidCurRound > 0 ? this._squidCurRound : total;
        nextRound = next ? nextRound + 1 : nextRound - 1;
        if (nextRound > total) nextRound = 1;
        if (nextRound < 1) nextRound = total;
        this._squidCurRound = nextRound;
        this.sliderPlus.value = nextRound;
        if (this._report.squidRounds.has(nextRound)) {
            this._refreshPageText();
            this._renderSquidList();
        } else {
            this._fetchSquidRound(nextRound);
        }
    }

    private _refreshPageText(): void {
        const total = this._squidTotalRound();
        this.pageText.string = `${this._squidCurRound > 0 ? this._squidCurRound : 0}/${total}`;
        const snap = this._currentSquidSnapshot();
        if (snap) {
            const tpl = i18nMgr.Get('UITexasReport_WhichRound');
            this.squidRoundText.string = tpl
                .replace('{0}', `${this._squidCurRound || 0}`)
                .replace('{1}', `${snap.startHand || 0}`)
                .replace('{2}', `${snap.endHand || 0}`);
        } else {
            this.squidRoundText.string = '';
        }
    }
    // ============================================================
    // 网络请求
    // ============================================================
    private _requestRoomers(): void {
        if (!this._roomData) return;
        TexasReportEvent.PrefetchRoomers(this._roomData);
    }

    private _requestJackpotSummary(): void {
        if (!this._roomData || this._isJackpotLoading || this._report.jackpotFetched) return;
        this._isJackpotLoading = true;
        TexasReportEvent.RequestJackpotSummary(this._roomData);
    }

    private _fetchSquidRound(round: number): void {
        if (!this._roomData) return;
        const subType = this._resolveSubType();
        if (subType !== 'squid' && subType !== 'mush') return;
        if (this._report.prepareSquidRoundMode(subType)) this._squidCurRound = 0;
        if (this._squidPendingRounds.has(round)) return;
        const requestGeneration = this._requestGeneration;
        const report = this._report;
        const pendingRounds = this._squidPendingRounds;
        const currentRoundWhenRequested = this._squidCurRound;
        const latestRoundWhenRequested = TexasReportPresentation.getLatestRound(report.squidRounds);
        pendingRounds.add(round);
        TexasReportEvent.RequestRound(this._roomData, subType, round).then(result => {
            pendingRounds.delete(round);
            if (!this._isCurrentRequest(requestGeneration, report)) return;
            if (subType !== this._resolveSubType()) return;
            if (!result) {
                this._updateNoDataState();
                return;
            }
            const stillOnRequestedRound = this._squidCurRound === currentRoundWhenRequested;
            const wasLookingAtLatest = currentRoundWhenRequested === 0 || currentRoundWhenRequested === latestRoundWhenRequested;
            // 查最新轮时只有用户没翻页才跟到最新；查普通页时也只接住原来那一页。
            if (stillOnRequestedRound && (round > 0 || wasLookingAtLatest)) this._squidCurRound = result.round;
            report.setSquidRound(subType, result.round, result.snapshot);
            this._setupSlider();
            this._refreshPageText();
        });
    }

    private _fetchInsuranceHistory(): void {
        if (!this._roomData || this._isInsuranceLoading || this._report.insuranceFetched) return;
        const requestGeneration = this._requestGeneration;
        const report = this._report;
        this._isInsuranceLoading = true;
        TexasReportEvent.RequestInsuranceHistory(this._roomData).then(records => {
            if (!this._isCurrentRequest(requestGeneration, report)) return;
            this._isInsuranceLoading = false;
            if (!records) {
                this._updateNoDataState();
                return;
            }
            report.setInsuranceRecords(records);
        });
    }
    // ============================================================
    // StepSlider 接线（对齐 pokerqueen UITexasReportComponent.setupSlider/sliderChange/onSliderTouchEnd）
    // ============================================================
    private _setupSlider(): void {
        const total = this._squidTotalRound();
        if (total <= 0) return;
        this.sliderPlus.show({
            min_value: 1,
            max_value: total,
            step: 1,
            change: (v: number) => this._sliderChange(v),
            touch_end: () => this._onSliderTouchEnd(),
            own: this
        });
        const target = this._squidCurRound > 0 ? this._squidCurRound : total;
        this._squidCurRound = target;
        this.sliderPlus.value = target;
    }

    private _sliderChange(value: number): void {
        const round = Math.round(value);
        if (this._squidCurRound === round) return;
        this._squidCurRound = round;
        this._refreshPageText();
    }

    private _onSliderTouchEnd(): void {
        if (this._curTab !== 'mode') return;
        if (this._report.squidRounds.has(this._squidCurRound)) {
            this._renderSquidList();
        } else {
            this._fetchSquidRound(this._squidCurRound);
        }
    }
    // ============================================================
    // 玩家详情子窗口
    // ============================================================
    private _openPlayerInfo(p: TexasReportPlayerInfo): void {
        viewManager.openDialog('TexasReportPlayerInfo', { userRid: p.userRid, nickName: p.name, avatar: p.avatar });
    }

    private _openPlayerInfoByID(userRid: number): void {
        const ob = this._report.observers.find(o => Number(o.userRid) === userRid);
        viewManager.openDialog('TexasReportPlayerInfo', {
            userRid,
            nickName: ob?.name,
            avatar: ob?.avatar
        });
    }
    // ============================================================
    // 工具函数
    // ============================================================
    private _resolveSubType(): TexasReportMode {
        return TexasReportPresentation.resolveMode(this._roomData.basicInfo);
    }

    private _syncSubType(): void {
        this._subType = this._resolveSubType();
        if (this._subType !== 'squid' && this._subType !== 'mush') return;
        if (this._report.prepareSquidRoundMode(this._subType as TexasReportRoundMode)) this._squidCurRound = 0;
    }

    private _isCurrentRequest(requestGeneration: number, report: TexasGameRoomDataReport): boolean {
        // 房间或打开批次对不上，说明这是过期回包。
        return requestGeneration === this._requestGeneration && report === this._report;
    }

    private _isJackpotEnabled(): boolean {
        return !!this._roomData.basicInfo.jackpot;
    }

    private _isInsuranceEnabled(): boolean {
        return !!this._roomData.basicInfo.hasInsurance;
    }

    private _currentDataContent(): cc.Node {
        if (this._curTab === 'battle' || this._curTab === 'insurance') return this.battleContent;
        if (this._curTab === 'jackpot') return this.jackpotContent;
        if (this._subType === 'squid') return this.squidContent;
        if (this._subType === 'mush') return this.mushContent;
        return this.battleContent;
    }

    private _drawColumnDividers(content: cc.Node): void {
        this._refreshUnifiedListLayout(content);
        this._paintColumnDividers(content);
        this._pendingListLayoutContent = content;
        this.unschedule(this._commitPendingListLayout);
        this.scheduleOnce(this._commitPendingListLayout, 0);
    }

    private _paintColumnDividers(content: cc.Node): void {
        const graphics = content.getComponent(cc.Graphics) || content.addComponent(cc.Graphics);
        graphics.clear();
        graphics.lineWidth = 2;
        graphics.strokeColor = new cc.Color(198, 194, 194, 232);
        content.children.forEach(node => {
            const item = node.getComponent(ReportDataItem);
            if (!item) return;
            const halfHeight = Math.max(24, node.height * 0.3);
            item.getColumnDividerXs().forEach(x => {
                const dividerX = node.x + x * node.scaleX;
                graphics.moveTo(dividerX, node.y - halfHeight);
                graphics.lineTo(dividerX, node.y + halfHeight);
            });
        });
        graphics.stroke();
    }

    private _commitPendingListLayout(): void {
        const content = this._pendingListLayoutContent;
        this._pendingListLayoutContent = null;
        if (!content || !cc.isValid(content)) return;
        this._refreshUnifiedListLayout(content);
        this._paintColumnDividers(content);
    }

    private _setupUnifiedList(): void {
        if (!this.unifiedScrollView || !this.dataListNode) return;
        this._dataListMinHeight = this.dataListNode.height;
        const dataListWidget = this.dataListNode.getComponent(cc.Widget);
        if (dataListWidget) {
            dataListWidget.isAlignTop = false;
            dataListWidget.isAlignBottom = false;
            dataListWidget.updateAlignment();
        }
        const reportWidget = this.reportScrow.getComponent(cc.Widget);
        this._dataListContentTop = reportWidget?.top || 0;
        this._dataListContentBottom = reportWidget?.bottom || 0;
        const unifiedListWidget = this.unifiedScrollView.node.getComponent(cc.Widget);
        this._unifiedListBottom = unifiedListWidget?.bottom || 0;
        [this.reportScrow, this.squidListView, this.mushRoomListView, this.jackpotListView].forEach(node => {
            const scrollView = node.getComponent(cc.ScrollView);
            if (!scrollView) return;
            scrollView.stopAutoScroll();
            scrollView.enabled = false;
        });
        const peopleScrollView = this.peopleContent.parent?.parent?.getComponent(cc.ScrollView);
        if (peopleScrollView) peopleScrollView.enabled = false;
        this._refreshUnifiedListViewportSize();
    }

    private _refreshUnifiedListLayout(content: cc.Node): void {
        if (!this.unifiedScrollView || !this.dataListNode) return;
        const layout = content.getComponent(cc.Layout);
        if (layout) layout.updateLayout();
        const contentHeight = content.childrenCount > 0 ? content.height : 0;
        this.dataListNode.height = Math.max(
            this._dataListMinHeight,
            this._dataListContentTop + contentHeight + this._dataListContentBottom
        );
        this.dataListNode.children.forEach(node => {
            const widget = node.getComponent(cc.Widget);
            if (widget) widget.updateAlignment();
        });
        this._refreshInnerListViewport(content);
        const unifiedContent = this.unifiedScrollView.content;
        const unifiedLayout = unifiedContent?.getComponent(cc.Layout);
        if (unifiedLayout) unifiedLayout.updateLayout();
    }

    private _refreshInnerListViewport(content: cc.Node): void {
        const viewport = content.parent;
        if (!viewport) return;
        const viewportWidget = viewport.getComponent(cc.Widget);
        if (viewportWidget) viewportWidget.updateAlignment();
        const contentWidget = content.getComponent(cc.Widget);
        if (contentWidget) contentWidget.updateAlignment();
    }

    private _refreshUnifiedListViewport(showPage: boolean): void {
        if (!this.unifiedScrollView) return;
        const widget = this.unifiedScrollView.node.getComponent(cc.Widget);
        if (!widget) return;
        const pageWidget = this.pageInfoNode.getComponent(cc.Widget);
        const pageBottom = pageWidget?.bottom || 0;
        const pageAreaBottom = pageBottom + this.pageInfoNode.height;
        widget.bottom = showPage ? Math.max(this._unifiedListBottom, pageAreaBottom) : this._unifiedListBottom;
        widget.updateAlignment();
        this._refreshUnifiedListViewportSize();
    }

    private _refreshUnifiedListViewportSize(): void {
        if (!this.unifiedScrollView) return;
        const viewport = this.unifiedScrollView.node.getChildByName('view');
        if (!viewport) return;
        const viewportWidget = viewport.getComponent(cc.Widget);
        if (viewportWidget) viewportWidget.updateAlignment();
        const contentWidget = this.unifiedScrollView.content?.getComponent(cc.Widget);
        if (contentWidget) contentWidget.updateAlignment();
    }

    private _currentSquidSnapshot(): TexasReportSquidRoundSnapshot | null {
        if (this._squidCurRound > 0) return this._report.squidRounds.get(this._squidCurRound) || null;
        return null;
    }

    private _currentSquidRecords(): TexasReportSquidRecord[] {
        const snap = this._currentSquidSnapshot();
        return snap?.records || [];
    }

    private _squidTotalRound(): number {
        return TexasReportPresentation.getTotalRound(this._report.squidRounds);
    }

    private _updateNoDataState(): void {
        const isMode = this._curTab === 'mode';
        const isJackpot = this._curTab === 'jackpot';
        const isInsurance = this._curTab === 'insurance';
        let noData = false;
        // 只有请求真的回来后才显示“暂无数据”，加载中先不闪空态。
        if (isMode) noData = !!this._currentSquidSnapshot() && this._currentSquidRecords().length <= 0;
        else if (isJackpot) noData = this._report.jackpotFetched && this._report.jackpotRecords.length <= 0;
        else if (isInsurance) noData = this._report.insuranceFetched && this._report.insuranceRecords.length <= 0;
        this.noDataNode.active = (isMode || isJackpot || isInsurance) && noData;
        // 移除“暂无数据”空态里的图标(蘑菇/logo 水印)，只保留文字提示
        const noDataIcon = this.noDataNode.getChildByName('icon_no_data');
        if (noDataIcon) noDataIcon.active = false;
    }

    private _formatDuration(seconds: number): string {
        if (seconds <= 0) return '--';
        if (seconds < 3600) {
            const minutes = Math.round(seconds / 60);
            const tpl = i18nMgr.Get('UITexasReport_Text_MatchZmsysj');
            return tpl ? tpl.replace('{0}', `${minutes}`) : `${minutes}min`;
        }
        const h = Math.floor(seconds / 3600);
        const m = Math.round((seconds % 3600) / 60);
        return m > 0 ? `${h}h${m}min` : `${h}h`;
    }
}
