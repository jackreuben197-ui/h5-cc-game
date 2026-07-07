import { Code } from '@silenthill/agreement-web';
import { autoBindEvents, bindEvent, unBindEventsAll } from '../../../core/decorator/DataBind';
import { traceClass } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataReport, {
    TexasReportInsuranceRecord,
    TexasReportJackpotRecord,
    TexasReportPlayerInfo,
    TexasReportSquidRecord,
    TexasReportSquidRoundSnapshot
} from '../../../data/room/texas/TexasGameRoomDataReport';
import userStore from '../../../data/user/UserStore';
import { StringHelper } from '../../../helper/StringHelper';
import TimeHelper from '../../../helper/TimeHelper';
import { i18nLabel } from '../../../i18n/i18nLabel';
import { i18nMgr } from '../../../i18n/i18nMgr';
// 走 WebRequest 总入口（不直接 import 子路径），让已有的依赖初始化顺序生效，避免循环依赖陷阱
import { APITexasSituationMushRound, APITexasSituationSquidRound, WebStatsRoomInsuranceData, WWW } from '../../../net/https/WebRequest';
import ProtocolAgency from '../../../net/websocket/ProtocolAgency';
import UIComponentBaseDialog from '../../base/UIComponentDialogBase';
import viewManager from '../../UIViewManager';
import StepSlider from '../../widget/StepSlider';

const { ccclass, property, menu } = cc._decorator;

/** 战绩面板入参（由 UITexasMenu 触发 openDialog('TexasReport', ...) 传入）。 */
export type UITexasReportParam = {
    roomID: number;
    matchID: number;
};

/** 战绩面板支持的子表（与 pokerqueen 保持一致：常规 / 鱿鱼/蘑菇）。*/
type ReportSubType = 'none' | 'mush' | 'squid';

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
@traceClass({ level: 'debug' })
export default class UITexasReport extends UIComponentBaseDialog<UITexasReportParam> {
    // ============================================================
    // @property —— prefab 模板（从 Assets 拖入）
    // ============================================================
    @property({ type: cc.Prefab, displayName: '观众条目 Prefab', tooltip: 'rc/widget/PeopleItem' })
    private peopleItem: cc.Prefab = null;
    @property({ type: cc.Prefab, displayName: '战绩数据行 Prefab', tooltip: 'rc/scene/room/texas/widget/ReportDataItem' })
    private reportDataItem: cc.Prefab = null;
    // ─── 顶栏（layer/bg/$Top）──────────────────────────
    @property({ type: cc.Label, displayName: '[顶栏] 时间标签 time_text' })
    private timeText: cc.Label = null;
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
    // ─── 公共统计区（publicArea）──────────────────────
    @property({ type: cc.Node, displayName: '[公共] 容器 publicArea' })
    private publicAreaNode: cc.Node = null;
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
    @property({ type: cc.Node, displayName: '[观众] 容器 peopleNode' })
    private peopleNode: cc.Node = null;
    @property({ type: cc.Label, displayName: '[观众] 数量 peopleNode/peopelNum' })
    private peopleNum: cc.Label = null;
    @property({ type: cc.Node, displayName: '[观众] 滚动容器 peopleScrow' })
    private peopleScrow: cc.Node = null;
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
    private _subType: ReportSubType = 'none';
    private _curTab: ReportBottomTab = 'battle';
    private _onlyTablePlayers: boolean = false;
    private _squidCurRound: number = 0;
    private _isInsuranceFetched: boolean = false;
    private _isJackpotFetched: boolean = false;
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
        this._isInsuranceFetched = false;
        this._isJackpotFetched = false;
        this._subType = this._resolveSubType();
        this._refreshTopBar();
        this._refreshBottomToggleState();
        this._refreshContentVisible();
        this._refreshTablePlayerToggle();
        this._refreshListBar();
        this._refreshMushDir();
        this._refreshTablePlayerToggle();
        this._bindEventsAndRefresh();
        // 缓存为空才补发 Roomers；正常路径下 UIRoomTexas 入桌时已经预拉过，本次直接走 report 增量。
        if (!this._report.roomersFetched) {
            this._requestRoomers();
        }
        // 进面板就拉一次鱿鱼/蘑菇（若房间开启了对应玩法），不等切 tab；
        // 已有缓存就把 _squidCurRound 复位到最新一轮，避免重复请求/Slider 空数据。
        // 对应 pokerqueen UITexasReportComponent.onShow → SendSquidData(0)。
        if (this._subType !== 'none') {
            if (this._report.squidRounds.size === 0) {
                this._fetchSquidRound(0);
            } else {
                let latest = 0;
                this._report.squidRounds.forEach((_, k) => {
                    if (k > latest) latest = k;
                });
                this._squidCurRound = latest;
                this._setupSlider();
                this._refreshPageText();
            }
        }
        this._startRemainTimeTick();
    }

    protected onEnable(): void {
        if (this._report) this._bindEventsAndRefresh();
        if (this._report) this._startRemainTimeTick();
    }

    protected onDisable(): void {
        unBindEventsAll(this);
        this._stopRemainTimeTick();
    }

    private _bindEventsAndRefresh(): void {
        if (!this._report) return;
        autoBindEvents(this, { report: this._report });
    }
    // ============================================================
    // @bindEvent —— 数据驱动刷新
    // ============================================================
    @bindEvent(TexasGameRoomDataReport.PLAYERS_CHANGE, 'report')
    private _onPlayersChange(_players: TexasReportPlayerInfo[]): void {
        if (this._curTab === 'battle') this._renderBattleList();
    }

    @bindEvent(TexasGameRoomDataReport.OBSERVERS_CHANGE, 'report')
    private _onObserversChange(observers: any[]): void {
        this._renderObservers(observers);
    }

    @bindEvent(TexasGameRoomDataReport.SUMMARY_CHANGE, 'report')
    private _onSummaryChange(_s: any): void {
        this._renderPublicArea();
    }

    @bindEvent(TexasGameRoomDataReport.JACKPOT_CHANGE, 'report')
    private _onJackpotChange(_records: TexasReportJackpotRecord[]): void {
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
        const list = this._filteredAndSortedPlayers();
        for (const p of list) {
            const el = cc.instantiate(this.reportDataItem);
            el.parent = content;
            this._renderPlayerRow(el, p);
        }
    }

    private _filteredAndSortedPlayers(): TexasReportPlayerInfo[] {
        const players = this._report.players.slice();
        const filtered = this._onlyTablePlayers ? players.filter(p => this._isAtTable(p.userRid)) : players;
        const online: TexasReportPlayerInfo[] = [];
        const offline: TexasReportPlayerInfo[] = [];
        for (const p of filtered) {
            const score = (p.win || 0) + (p.storeChips || 0);
            (p.isOnline ? online : offline).push({ ...p, _score: score } as any);
        }
        const sortByScore = (a: any, b: any) => Number(b._score || 0) - Number(a._score || 0);
        online.sort(sortByScore);
        offline.sort(sortByScore);
        return online.concat(offline);
    }

    private _isAtTable(userRid: number): boolean {
        // 在 h5-cc-game 中：从座位列表里查 userID 匹配
        const target = Number(userRid || 0);
        if (target <= 0) return false;
        const ssm = this._roomData.seatsStateManager;
        for (let i = 1; i <= (ssm.seatsCount || 0); i++) {
            const seat = ssm.getSeatPlayer(i);
            if (seat && Number(seat.userID || 0) === target) return true;
        }
        return false;
    }

    private _renderPlayerRow(root: cc.Node, p: TexasReportPlayerInfo): void {
        const info1 = root.getChildByName('item_info1');
        const info3 = root.getChildByName('item_info3');
        const useInfo3 = this._subType !== 'none';
        if (info1) info1.active = !useInfo3;
        if (info3) info3.active = useInfo3;
        const ele = useInfo3 ? info3 : info1;
        if (!ele) return;
        const atTable = this._isAtTable(p.userRid);
        ele.opacity = atTable && p.isOnline ? 255 : 150;
        const setLbl = (name: string, value: string) => {
            const lbl = ele.getChildByName(name)?.getComponent(cc.Label);
            if (lbl) lbl.string = value;
        };
        setLbl('Text_Name', StringHelper.LengthNick(p.name || ''));
        setLbl('Text_Num', `${p.handNum || 0}`);
        const textAllCol = ele.getChildByName('Text_All_Col');
        if (textAllCol) {
            const allLbl = textAllCol.getChildByName('Text_All')?.getComponent(cc.Label);
            const all1Lbl = textAllCol.getChildByName('Text_All1');
            if (allLbl) allLbl.string = StringHelper.GetLongString(p.bringInTotal);
            if (all1Lbl) {
                if (p.storeChips) {
                    all1Lbl.getComponent(cc.Label).string = StringHelper.GetLongString(p.storeChips);
                } else {
                    all1Lbl.active = false;
                }
            }
        }
        const score = (p.win || 0) + (p.storeChips || 0);
        this._setSignedText(ele.getChildByName('Text_Count'), score);
        const poolNode = ele.getChildByName('Text_Pool');
        if (poolNode) {
            const poolLabel = poolNode.getComponent(cc.Label);
            if (poolLabel) poolLabel.string = `(${(p.poolRate / 10).toFixed(1)}%)`;
        }
        if (useInfo3) {
            setLbl('Text_Deposit', StringHelper.GetLongString(p.deposit || 0));
            this._applyMushSquid(ele, p);
        }
        const own = ele.getChildByName('own');
        if (own) own.active = p.userRid === userStore.userID;
        // 点击行 → 打开玩家详情子窗口
        root.off(cc.Node.EventType.TOUCH_END, undefined, this);
        root.on(cc.Node.EventType.TOUCH_END, () => this._openPlayerInfo(p), this);
    }

    private _applyMushSquid(parent: cc.Node, p: TexasReportPlayerInfo): void {
        const mushNode = parent.getChildByName('mush');
        const squidNode = parent.getChildByName('Text_Squid');
        if (mushNode) mushNode.active = this._subType === 'mush';
        if (squidNode) squidNode.active = this._subType === 'squid';
        if (this._subType === 'mush' && mushNode) {
            const mushNum = mushNode.getChildByName('mushNum')?.getComponent(cc.Label);
            const mushChips = mushNode.getChildByName('mushChips')?.getComponent(cc.Label);
            if (p.mushroomAmount > 0) {
                if (mushNum) mushNum.string = '+' + StringHelper.FormatToString('{0:N0}', p.mushroomCount || 0);
                if (mushChips) {
                    mushChips.string = `(+${StringHelper.GetLongString(p.mushroomAmount || 0)})`;
                    mushChips.node.active = true;
                }
            } else {
                if (mushNum) mushNum.string = '-';
                if (mushChips) mushChips.node.active = false;
            }
        }
        if (this._subType === 'squid' && squidNode) {
            const net = (p.squidInTotal || 0) - (p.squidOutTotal || 0) - (p.squidPunishTotal || 0);
            this._setSignedText(squidNode, net);
        }
    }

    private _renderObservers(observers: any[]): void {
        this.peopleContent.removeAllChildren();
        this.peopleNum.string = `${observers.length}`;
        for (const ob of observers) {
            const item = cc.instantiate(this.peopleItem);
            item.parent = this.peopleContent;
            const nameLbl = item.getChildByName('Text_Name')?.getComponent(cc.Label);
            if (nameLbl) nameLbl.string = StringHelper.LengthNick(ob.name || '');
            // 头像加载由 prefab 自带的 RemoteSprite 组件处理（与项目其它头像一致），此处只填 sprite frame data
            item.off(cc.Node.EventType.TOUCH_END, undefined, this);
            item.on(cc.Node.EventType.TOUCH_END, () => this._openPlayerInfoByID(ob.userRid), this);
        }
    }

    private _renderJackpotList(): void {
        this.jackpotContent.removeAllChildren();
        const records = this._report.jackpotRecords;
        if (records.length <= 0) {
            this._updateNoDataState();
            return;
        }
        for (const r of records) {
            const el = cc.instantiate(this.reportDataItem);
            this._renderJackpotRow(el, r);
            el.parent = this.jackpotContent;
        }
        this._updateNoDataState();
    }

    private _renderJackpotRow(root: cc.Node, r: TexasReportJackpotRecord): void {
        const jp = root.getChildByName('room_scrollview_jackpot');
        if (!jp) return;
        ['item_info1', 'item_info3', 'room_scrollview_sqiud', 'room_scrollview_mushRoom', 'room_scrollview_insurance'].forEach(n => {
            const node = root.getChildByName(n);
            if (node) node.active = false;
        });
        jp.active = true;
        const nameLbl = jp.getChildByName('Text_Name')?.getComponent(cc.Label);
        const numLbl = jp.getChildByName('Text_Num')?.getComponent(cc.Label);
        if (nameLbl) nameLbl.string = StringHelper.LengthNick(r.name || '', 20);
        if (numLbl) numLbl.string = StringHelper.GetLongString(r.contributeTotal || 0);
        this._setSignedText(jp.getChildByName('Text_All'), r.awardTotal || 0);
        this._setCardText(jp.getChildByName('Text_Card'), this._jackpotCardDesc(r));
        const own = jp.getChildByName('own');
        if (own) own.active = r.userRid === userStore.userID;
    }

    private _jackpotCardDesc(r: TexasReportJackpotRecord): string {
        const list: string[] = [];
        if ((r.royalFlushCount || 0) > 0) list.push(i18nMgr.Get('UIJackPotInfo_huangjia'));
        if ((r.straightFlushCount || 0) > 0) list.push(i18nMgr.Get('UIJackPotInfo_tonghuashun'));
        if ((r.fourOfaKindCount || 0) > 0) list.push(i18nMgr.Get('UIJackPotInfo_shitiao'));
        return list.join('\n');
    }

    private _refreshJackpotTotal(): void {
        const total = Math.floor((this._roomData.basicInfo.jackpotPool || 0) / 100);
        this.jackpotTotalLabel.string = `${total}`;
    }

    private _renderInsuranceList(): void {
        this.battleContent.removeAllChildren();
        for (const r of this._report.insuranceRecords) {
            const el = cc.instantiate(this.reportDataItem);
            this._renderInsuranceRow(el, r);
            el.parent = this.battleContent;
        }
        this._updateNoDataState();
    }

    private _renderInsuranceRow(root: cc.Node, r: TexasReportInsuranceRecord): void {
        ['item_info1', 'item_info3', 'room_scrollview_sqiud', 'room_scrollview_mushRoom', 'room_scrollview_jackpot'].forEach(n => {
            const node = root.getChildByName(n);
            if (node) node.active = false;
        });
        const ins = root.getChildByName('room_scrollview_insurance');
        if (!ins) return;
        ins.active = true;
        const nameLbl = ins.getChildByName('Text_Name')?.getComponent(cc.Label);
        const numLbl = ins.getChildByName('Text_Num')?.getComponent(cc.Label);
        const allLbl = ins.getChildByName('Text_All')?.getComponent(cc.Label);
        if (nameLbl) nameLbl.string = StringHelper.LengthNick(r.name || '', 20);
        if (numLbl) {
            numLbl.string = r.createTime > 0 ? TimeHelper.TimeToString(r.createTime * 1000, 'MM/dd HH:mm') : '--';
        }
        if (allLbl) allLbl.string = StringHelper.GetLongString(r.insurBet || 0);
        this._setSignedText(ins.getChildByName('Text_Card'), -(r.insurWin || 0));
        const own = ins.getChildByName('own');
        if (own) own.active = r.userRid === userStore.userID;
    }

    private _renderSquidList(): void {
        const content = this._subType === 'squid' ? this.squidContent : this.mushContent;
        content.removeAllChildren();
        const records = this._currentSquidRecords();
        for (const r of records) {
            const el = cc.instantiate(this.reportDataItem);
            this._renderSquidRow(el, r);
            el.parent = content;
        }
        this._updateNoDataState();
    }

    private _renderSquidRow(root: cc.Node, r: TexasReportSquidRecord): void {
        const itemInfo1 = root.getChildByName('item_info1');
        const itemInfo3 = root.getChildByName('item_info3');
        const squidNode = root.getChildByName('room_scrollview_sqiud');
        const mushNode = root.getChildByName('room_scrollview_mushRoom');
        if (itemInfo1) itemInfo1.active = false;
        if (itemInfo3) itemInfo3.active = false;
        if (squidNode) squidNode.active = this._subType === 'squid';
        if (mushNode) mushNode.active = this._subType === 'mush';
        if (this._subType === 'squid' && squidNode) {
            const nameTxt = squidNode.getChildByName('Text_Name')?.getComponent(cc.Label);
            if (nameTxt) nameTxt.string = StringHelper.LengthNick(r.name || '', 20);
            const squidNum = squidNode.getChildByName('Text_Squid');
            if (squidNum) {
                const lbl = squidNum.getComponent(cc.Label);
                const rich = squidNum.getComponent(cc.RichText);
                if (rich) rich.string = `${r.in_num || 0}`;
                if (lbl) lbl.string = `${r.in_num || 0}`;
            }
            const amount = (r.in_amount || 0) !== 0 ? r.in_amount || 0 : -Math.abs(r.out_amount || 0);
            this._setSignedText(squidNode.getChildByName('SelfGo'), amount);
            const own = squidNode.getChildByName('own');
            if (own) own.active = r.user_random_id === userStore.userID;
        }
        if (this._subType === 'mush' && mushNode) {
            const nameTxt = mushNode.getChildByName('Text_Name')?.getComponent(cc.Label);
            if (nameTxt) nameTxt.string = StringHelper.LengthNick(r.name || '', 20);
            const outMush = mushNode.getChildByName('out_mush')?.getComponent(cc.Label);
            const inMush = mushNode.getChildByName('in_mush')?.getComponent(cc.Label);
            if (outMush) outMush.string = `${r.out_num || 0}`;
            if (inMush) inMush.string = (r.in_num || 0) !== 0 ? `${r.in_num}` : '-';
            const inCoinNode = mushNode.getChildByName('in_coin');
            if ((r.in_amount || 0) !== 0) {
                this._setSignedText(inCoinNode, r.in_amount || 0);
            } else {
                this._setSignedText(inCoinNode, null, '-');
            }
            this._setSignedText(mushNode.getChildByName('out_coin'), r.out_amount || 0);
            const own = mushNode.getChildByName('own');
            if (own) own.active = r.user_random_id === userStore.userID;
        }
    }
    // ============================================================
    // Tab & Toggle
    // ============================================================
    private _onClickTab(tab: ReportBottomTab): void {
        this._subType = this._resolveSubType();
        if (tab === 'mode' && this._subType === 'none') return;
        if (tab === 'jackpot' && !this._isJackpotEnabled()) return;
        if (tab === 'insurance' && !this._isInsuranceEnabled()) return;
        if (this._curTab === tab) return;
        this._curTab = tab;
        this._refreshBottomToggleState();
        this._refreshContentVisible();
        this._refreshListBar();
        this._refreshCurrentList();
        if (tab === 'mode' && this._currentSquidRecords().length === 0) {
            this._fetchSquidRound(this._squidCurRound || 0);
            return;
        }
        if (tab === 'jackpot' && !this._isJackpotFetched) this._requestJackpotSummary();
        if (tab === 'insurance' && !this._isInsuranceFetched) this._fetchInsuranceHistory();
    }

    private _onToggleOnlyTablePlayers(): void {
        this._onlyTablePlayers = !this._onlyTablePlayers;
        this._refreshTablePlayerToggle();
        // battleContent 是战况/保险共用容器；在保险/Jackpot/模式 tab 下不能误覆盖。
        if (this._curTab === 'battle') this._renderBattleList();
    }

    private _refreshTablePlayerToggle(): void {
        this.checkboxOn.active = this._onlyTablePlayers;
        this.checkboxOff.active = !this._onlyTablePlayers;
    }

    private _refreshBottomToggleState(): void {
        this._subType = this._resolveSubType();
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
        } else if (this._curTab === 'insurance') {
            this.listBar4.active = true;
        } else if (this._curTab === 'mode') {
            if (sub === 'squid') this.listBarSquid.active = true;
            if (sub === 'mush') this.listBarMushRoom.active = true;
        } else if (this._curTab === 'jackpot') {
            this.listBarJackpot.active = true;
        }
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
        }
    }
    // ============================================================
    // 网络请求
    // ============================================================
    private _requestRoomers(): void {
        if (!this._roomData) return;
        ProtocolAgency.Send({
            code: Code.MSG_D_ROOMERS,
            roomID: this._roomData.roomID,
            matchID: this._roomData.matchID,
            body: {
                room: { roomId: this._roomData.roomID, matchId: this._roomData.matchID },
                // history=true 与 UIRoomTexas 入桌预拉保持一致，包含已离桌玩家。
                history: true,
                historyOffset: 0,
                historyLimit: 1000
            }
        });
    }

    private _requestJackpotSummary(): void {
        if (!this._roomData) return;
        this._isJackpotFetched = true;
        ProtocolAgency.Send({
            code: Code.MSG_D_PLAYER_JACKPOT_SUMMARY,
            roomID: this._roomData.roomID,
            matchID: this._roomData.matchID,
            body: {
                room: { roomId: this._roomData.roomID, matchId: this._roomData.matchID }
            }
        });
    }

    private _fetchSquidRound(round: number): void {
        if (!this._roomData) return;
        const subType = this._resolveSubType();
        if (subType !== 'squid' && subType !== 'mush') return;
        const web_class = subType === 'mush' ? APITexasSituationMushRound : APITexasSituationSquidRound;
        WWW.Instance.CommonAPI({
            web_class,
            api_id: this._roomData.roomID,
            club_id: this._roomData.basicInfo.clubID,
            body: { round },
            juhua: false
        } as any).then(
            (resp: any) => {
                const data = resp?.data;
                if (!data) {
                    this._updateNoDataState();
                    return;
                }
                const total = Number(data.total || 0);
                const r = Number(data.round || 0);
                const records = (data.records || []) as TexasReportSquidRecord[];
                if (this._squidCurRound === 0) {
                    this._squidCurRound = total > 0 ? total : r > 0 ? r : 1;
                } else if (r > 0) {
                    this._squidCurRound = r;
                }
                const saveRound = this._squidCurRound > 0 ? this._squidCurRound : 1;
                this._report.setSquidRound(saveRound, {
                    totalRound: total,
                    startHand: Number(data.start_hand || 0),
                    endHand: Number(data.end_hand || 0),
                    records
                });
                this._setupSlider();
                this._refreshPageText();
            },
            () => this._updateNoDataState()
        );
    }

    private _fetchInsuranceHistory(): void {
        if (!this._roomData) return;
        this._isInsuranceFetched = true;
        WWW.Instance.CommonAPI({
            web_class: WebStatsRoomInsuranceData,
            club_id: this._roomData.basicInfo.clubID,
            body: { room_id: this._roomData.roomID, limit: 200, offset: 0 },
            juhua: false
        } as any).then(
            (resp: any) => {
                const list: any[] = (resp?.data?.list || []) as any[];
                const records: TexasReportInsuranceRecord[] = list.map(item => ({
                    userRid: Number(item.user_rid || 0),
                    name: `${item.nick_name || ''}`,
                    handNum: Number(item.hand_num || 0),
                    insurBet: Number(item.insur_bet || 0),
                    insurWin: Number(item.insur_win || 0),
                    createTime: Number(item.create_time || 0)
                }));
                this._report.setInsuranceRecords(records);
            },
            () => this._updateNoDataState()
        );
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
    private _resolveSubType(): ReportSubType {
        // 注意：mushroomBase 可能在鱿鱼桌上仍有残留配置；以 mushroomMode（0=未开启）判断玩法是否真启用，
        // 否则鱿鱼桌会被误判为蘑菇模式，导致 listBarMushRoom 显示、玩家行渲染蘑菇列、mushDirText 走蘑菇文案。
        const b = this._roomData.basicInfo;
        const mushOn = (b.mushroomMode || 0) > 0 || b.mushroomStatusEnabled;
        if (mushOn) return 'mush';
        const squidOn = b.hasSquid || (b.squidBase || 0) > 0 || b.squidStatusEnabled;
        if (squidOn) return 'squid';
        return 'none';
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

    private _currentSquidSnapshot(): TexasReportSquidRoundSnapshot | null {
        if (this._squidCurRound > 0) return this._report.squidRounds.get(this._squidCurRound) || null;
        return null;
    }

    private _currentSquidRecords(): TexasReportSquidRecord[] {
        const snap = this._currentSquidSnapshot();
        return snap?.records || [];
    }

    private _squidTotalRound(): number {
        const snap = this._currentSquidSnapshot();
        return snap?.totalRound || 0;
    }

    private _updateNoDataState(): void {
        const isMode = this._curTab === 'mode';
        const isJackpot = this._curTab === 'jackpot';
        const isInsurance = this._curTab === 'insurance';
        let noData = false;
        if (isMode) noData = this._currentSquidRecords().length <= 0;
        else if (isJackpot) noData = this._report.jackpotRecords.length <= 0;
        else if (isInsurance) noData = this._isInsuranceFetched && this._report.insuranceRecords.length <= 0;
        this.noDataNode.active = (isMode || isJackpot || isInsurance) && noData;
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

    private _setSignedText(node: cc.Node, value: number | null, emptyText?: string): void {
        if (!node) return;
        const rich = node.getComponent(cc.RichText);
        const label = node.getComponent(cc.Label);
        if (value == null) {
            if (rich) rich.string = emptyText || '';
            if (label) label.string = emptyText || '';
            return;
        }
        const text = StringHelper.GetSignedLongString(value);
        const color = value > 0 ? '#B0FFAE' : value < 0 ? '#FF7C7C' : '#FFFFFF';
        if (rich) {
            rich.string = `<color=${color}>${text}</color>`;
            return;
        }
        if (label) {
            label.string = text;
            label.node.color = cc.Color.BLACK.fromHEX(color);
        }
    }

    private _setCardText(node: cc.Node, text: string): void {
        if (!node) return;
        const rich = node.getComponent(cc.RichText);
        if (rich) {
            rich.string = text || '';
            return;
        }
        const label = node.getComponent(cc.Label);
        if (label) label.string = text || '';
    }
}
