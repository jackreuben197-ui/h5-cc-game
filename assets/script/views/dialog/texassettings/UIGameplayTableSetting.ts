import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { GameType, PokerType } from '../../../game/constant/LogicTypeConf';
import { StringHelper } from '../../../helper/StringHelper';
import { i18nMgr } from '../../../i18n/i18nMgr';
import { APIOrgTribeRoomPermissions, APIOrgUserNewLabelReadNum, APIOrgUserNewLabelRead, WebConfigGlobalConfig } from '../../../net/https/WebRequest';
import { WWW } from '../../../net/https/WebRequestBase';
import { Def } from '../../../protobuf/holdem/define_pb';
import UIComponentBaseDialog from '../../base/UIComponentDialogBase';

export type UIGameplayTableSettingParam = {
    isFromBringIn?: boolean;
    roomID: number;
    matchID: number;
    bringInAct?: () => void;
    roomPermissions?: Record<string, number>;
    noAnimation?: boolean;
};

const { ccclass, property } = cc._decorator;

const TRACKABLE_NEW_MARKS = new Set<string>([
    'room_random_seat',
    'auto_change_room',
    'room_bringin_equal',
    'room_min_chip',
    'room_bringin_limit',
    'room_force_show_card',
    'room_look_hand_card',
    'room_check_pool_rate',
    'room_only_ios',
    'room_jackpot',
    'room_critical_hit',
    'room_random_ante',
    'room_encrypt_cards',
    'room_settle_per_hand',
    'room_settle_per_game',
    'room_settle_by_ratio',
    'room_settle_by_fixed',
    'room_settle_preflop_free',
    'room_settle_thr_discount',
    'room_settle_minpot_free',
    'room_hc_total_hands'
]);

@ccclass
export default class UIGameplayTableSetting extends UIComponentBaseDialog<UIGameplayTableSettingParam> {
    @property(cc.Node)
    private Button_Commit: cc.Node = null;
    // @property(cc.Node)
    // private Button_Close: cc.Node = null;
    @property(cc.Node)
    private itemNormalTemplate: cc.Node = null;
    @property(cc.Node)
    private itemAndTipsTemplate: cc.Node = null;
    @property(cc.Node)
    private itemAndTipsAndDetailTemplate: cc.Node = null;
    @property(cc.Node)
    private jackpotTemplate: cc.Node = null;
    @property(cc.Node)
    private tipsMask: cc.Node = null;
    @property(cc.Node)
    private tipsContent: cc.Node = null;
    @property(cc.Node)
    private warningTips: cc.Node = null;
    private contentRoot: cc.Node = null;
    private itemNormalCache: cc.Node[] = [];
    private itemAndTipsCache: cc.Node[] = [];
    private itemAndTipsAndDetailCache: cc.Node[] = [];
    private jackpotCache: cc.Node[] = [];
    private normalIndex = 0;
    private andTipsIndex = 0;
    private andTipsAndDetailIndex = 0;
    private jackpotIndex = 0;
    private isFromBringIn = false;
    private _roomData: TexasGameRoomData = null!;
    private bringInAct: (() => void) | null = null;
    private roomPermissions: Record<string, number> = {};
    private roomPermissionsNumber: Record<string, number> | null = null;
    private lookTimeMarkSet: Set<string> = new Set<string>();
    private tribeId = 0;

    /** 组件初始化：缓存节点与模板 */
    override onLoad(): void {
        // this.Button_Commit = this.getChildNodeOrComponent('Button_Commit');
        // this.Button_Close = this.getChildNodeOrComponent('Button_Close');
        // // 节点有重名（如 Jackpot/itemNormal），必须用路径拿模板，避免被同名覆盖
        // this.itemNormalTemplate = cc.find('main/gameSettingView/view/content/itemNormal', this.node) || this.getChildNodeOrComponent('itemNormal');
        // this.itemAndTipsTemplate = cc.find('main/gameSettingView/view/content/itemAndTips', this.node) || this.getChildNodeOrComponent('itemAndTips');
        // this.itemAndTipsAndDetailTemplate =
        //     cc.find('main/gameSettingView/view/content/itemAndTipsAndDetail', this.node) || this.getChildNodeOrComponent('itemAndTipsAndDetail');
        // this.jackpotTemplate = cc.find('main/gameSettingView/view/content/Jackpot', this.node) || this.getChildNodeOrComponent('Jackpot');
        // this.tipsMask = this.getChildNodeOrComponent('tipsMask');
        // this.tipsContent = this.getChildNodeOrComponent('tipsContent');
        // this.warningTips = this.getChildNodeOrComponent('Tip');
        this.contentRoot =
            this.itemNormalTemplate?.parent ||
            this.itemAndTipsTemplate?.parent ||
            this.itemAndTipsAndDetailTemplate?.parent ||
            this.jackpotTemplate?.parent ||
            null;
        if (this.itemNormalTemplate) this.itemNormalTemplate.active = false;
        if (this.itemAndTipsTemplate) this.itemAndTipsTemplate.active = false;
        if (this.itemAndTipsAndDetailTemplate) this.itemAndTipsAndDetailTemplate.active = false;
        if (this.jackpotTemplate) this.jackpotTemplate.active = false;
        if (this.tipsMask) this.tipsMask.active = false;
        if (this.tipsContent) this.tipsContent.active = false;
        this.regiterTouchEvents();
    }

    /** 注册点击事件 */
    protected regiterTouchEvents(): void {
        this.Button_Commit.on('click', this.OnClickCommit, this);
        // this.Button_Close.on('click', this.OnClickClose, this);
        this.tipsMask.on('click', this.OnClickTipsMask, this);
    }

    /** 弹窗展示入口 */
    public initialize(param: UIGameplayTableSettingParam): void {
        this.isFromBringIn = !!param?.isFromBringIn;
        this.bringInAct = param?.bringInAct || null;
        this.roomPermissions = this.ParsePermissions(param?.roomPermissions);
        this.tribeId = this.ResolveTribeId();
        this.lookTimeMarkSet.clear();
        this.ResolveRoomPermissionsAndRefresh();
        this._roomData = roomDataManager.getRoomData(param.roomID, param.matchID);
    }

    /** Unity 对齐：俱乐部/联盟桌走 club permission，其它走全局权限 */
    private async ResolveRoomPermissionsAndRefresh(): Promise<void> {
        const clubId = this._roomData.basicInfo.clubID;
        const tribeId = this._roomData.basicInfo.tribeID;
        this.tribeId = tribeId;
        if (clubId !== 0 || tribeId > 1) {
            try {
                const resp: any = await WWW.Instance.CommonAPI({
                    web_class: APIOrgTribeRoomPermissions,
                    body: {
                        club_id: clubId,
                        tribe_id: tribeId
                    },
                    juhua: false
                });
                const roomPermissions = this.ParsePermissions(resp?.data?.room_permissions);
                if (Object.keys(roomPermissions).length > 0) {
                    this.roomPermissions = roomPermissions;
                }
                const respTribeId = Number(resp?.data?.tribe_id ?? (resp?.data?.room_permissions as any)?.tribe_id ?? 0);
                if (this.tribeId <= 0 && respTribeId > 0) {
                    this.tribeId = respTribeId;
                }
                if (this.tribeId <= 0) {
                    this.tribeId = this.ResolveTribeId();
                }
                this.RefreshUI();
                if (this.tribeId > 0) {
                    await this.RequestUserNewLabelNum();
                }
                return;
            } catch (err) {
                cc.warn('[UIGameplayTableSetting] request club room permissions failed', err);
            }
        }
        this.roomPermissions = this.GetGlobalRoomPermissions();
        this.tribeId = this.ResolveTribeId();
        this.RefreshUI();
    }

    /** Unity GetRoomPermissions(false) 对齐：只取全局 room_permissions */
    private GetGlobalRoomPermissions(): Record<string, number> {
        const cfg: any = WebConfigGlobalConfig?.Response?.data || null;
        if (!cfg) return {};
        return this.ParsePermissions(cfg.room_permissions);
    }

    private ParsePermissions(raw: any): Record<string, number> {
        if (!raw) return {};
        let obj: any = raw;
        if (typeof raw === 'string') {
            try {
                obj = JSON.parse(raw);
            } catch (err) {
                cc.warn('[UIGameplayTableSetting] parse room permissions failed', err);
                return {};
            }
        }
        if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
            return {};
        }
        const ret: Record<string, number> = {};
        Object.keys(obj).forEach(k => {
            ret[k] = Number(obj[k] || 0);
        });
        return ret;
    }

    /** 刷新整页玩法配置展示 */
    private RefreshUI(): void {
        this.ResetRows();
        this.lookTimeMarkSet.clear();
        const callTime = this._roomData.basicInfo.hasCallTime;
        const roomName = this._roomData.basicInfo.roomName || '-';
        this.FillData('room_name', this.L('UIClub_RoomCreat_0HvQkjkd'), roomName, '#FFFFFF');
        this.FillData('game_type', this.L('UIData_game'), this.GetTableTypeName(), '#FFFFFF');
        const smallBlind = this._roomData.basicInfo.sbante.sb;
        const bigBlind = smallBlind * 2;
        const sixPlusAndBombpot =
            (this._roomData.basicInfo.gameType === GameType.HOLDEM && this._roomData.basicInfo.pokerType === PokerType.SIX_PLUS) ||
            this._roomData.basicInfo.hasBombPot;
        if (!sixPlusAndBombpot) {
            this.FillData(
                'blind',
                this.L('UITexas_smallBigBlind'),
                `${StringHelper.GetLongString(smallBlind)}/${StringHelper.GetLongString(bigBlind)}`,
                '#FFFFFF'
            );
        } else {
            this.FillData('blind', this.L('UIMatchFilter_ALmevl'), StringHelper.GetLongString(smallBlind * 2), '#FFFFFF');
        }
        const currentMinRate = this._roomData.basicInfo.curMinRate || 0;
        const currentMaxRate = this._roomData.basicInfo.curMaxRate || this._roomData.basicInfo.curMinRate;
        const bringMin = currentMinRate * bigBlind;
        const bringMax = Math.max(currentMaxRate, currentMinRate) * bigBlind;
        this.FillData(
            'bring_value',
            this.L('UITableSetting_bringValue'),
            `${StringHelper.GetLongString(bringMin)}-${StringHelper.GetLongString(bringMax)}`,
            '#FFFFFF'
        );
        if (this.IsPermitted('room_jackpot')) {
            const jackpotOpen = this._roomData.basicInfo.jackpot;
            this.FillJackpotData(
                jackpotOpen ? this.L('6digit_password_opened') : this.L('UIMine_AccountNotOpen'),
                jackpotOpen ? '#7ED27E' : '#FF6666',
                this._roomData.basicInfo.jackpotConfig
            );
        }
        if (this.IsPermitted('room_bringin_equal')) {
            const value = Number(this._roomData.basicInfo.bringinEqualLeaderPercent || 0);
            this.FillData(
                'room_bringin_equal',
                this.L('UICreateTable_chipinLeader'),
                value === 0 ? this.L('UIClub_CreateRoom23') : `${value}%`,
                '#FFFFFF',
                this.L('UICreateTable_chipinLeaderTips')
            );
        }
        if (this.IsPermitted('room_min_chip')) {
            const value = Number(this._roomData.basicInfo.minPlayerChipRate || 0);
            this.FillData(
                'room_min_chip',
                this.L('UICreateTable_chipinMinChip'),
                value === 0 ? this.L('UIClub_CreateRoom23') : StringHelper.GetLongString(value),
                '#FFFFFF',
                this.L('UICreateTable_chipinMinChipTips')
            );
        }
        if (this.IsPermitted('room_bringin_limit')) {
            const value = Number(this._roomData.basicInfo.maxBringinTotalRate || 0);
            this.FillData(
                'room_bringin_limit',
                this.L('UICreateTable_chipinMaxChip'),
                value === 0 ? this.L('UIClub_CreateRoom23') : StringHelper.GetLongString(value),
                '#FFFFFF',
                this.L('UICreateTable_chipinMaxChipTips')
            );
        }
        const criticalHitEnabled = this._roomData.basicInfo.hasCriticalHit;
        if (this.IsPermitted('room_critical_hit')) {
            if (criticalHitEnabled) {
                const criticalHitRound = this._roomData.basicInfo.critialHitRounds;
                const subAnteBB = this._roomData.basicInfo.getCriticalHitAnte(bigBlind);
                this.FillTipsAndDetailData(
                    'room_critical_hit',
                    this.L('UIHitGamePlayTips1'),
                    this.L('6digit_password_opened'),
                    '#7ED27E',
                    this.L('UIHitGamePlayTips6'),
                    StringHelper.Format(this.L('UIHitGamePlayTips2'), [criticalHitRound, subAnteBB])
                );
            } else {
                this.FillData('room_critical_hit', this.L('UIHitGamePlayTips1'), this.L('UIMine_AccountNotOpen'), '#FF6666', this.L('UIHitGamePlayTips6'));
            }
        }
        if (this.IsPermitted('room_random_ante')) {
            const randomAnteEnabled = this._roomData.basicInfo.randomAnte.length > 0;
            if (randomAnteEnabled) {
                const detail = this.BuildRandomAnteDetail(this._roomData.basicInfo.randomAnte);
                this.FillTipsAndDetailData(
                    'room_random_ante',
                    this.L('UIAnteRandomJump1'),
                    this.L('6digit_password_opened'),
                    '#7ED27E',
                    this.L('UIAnteRandomJump6'),
                    detail
                );
            } else {
                this.FillData('room_random_ante', this.L('UIAnteRandomJump1'), this.L('UIMine_AccountNotOpen'), '#FF6666', this.L('UIAnteRandomJump6'));
            }
        }
        if (this.IsPermitted('auto_change_room')) {
            const autoChangeTable = this._roomData.basicInfo.autoChangeTableLimitHand;
            const isAutoChangeTable = this._roomData.basicInfo.isAutoChangeTable;
            if (isAutoChangeTable) {
                const num = `<color=#FFC706>${autoChangeTable}</color>`;
                this.FillTipsAndDetailData(
                    'auto_change_room',
                    this.L('UIAutoChangeTable4'),
                    this.L('6digit_password_opened'),
                    '#7ED27E',
                    this.L('UIAutoChangeTable2'),
                    StringHelper.Format(this.L('UIAutoChangeTable3'), [num])
                );
            } else {
                this.FillData('auto_change_room', this.L('UIAutoChangeTable4'), this.L('UIMine_AccountNotOpen'), '#FF6666', this.L('UIAutoChangeTable2'));
            }
        }
        this.FillDataByOpen('AOF', false);
        if (this.IsPermitted('room_encrypt_cards')) {
            const blockchain = this._roomData.basicInfo.encryptCards;
            this.FillData(
                'room_encrypt_cards',
                this.L('UIBlockchain'),
                this.L(blockchain ? '6digit_password_opened' : 'UIMine_AccountNotOpen'),
                blockchain ? '#7ED27E' : '#FF6666'
            );
        }
        const squidEnabled = !!this._roomData.basicInfo.squidEnabled;
        this.FillDataByLanguageOpen('UISquid', squidEnabled);
        if (squidEnabled) {
            this.FillData('squid_open_number', this.L('UICreateTableSquidOpenNumTip'), String(this._roomData.basicInfo.squidPlayerCountLimit || 0), '#FFFFFF');
            this.FillData('squid_round', this.L('UISquidGameRounds'), String(this._roomData.basicInfo.squidRounds || 0), '#FFFFFF');
            this.FillData('squid_base', this.L('UIGameTableSquidShow'), StringHelper.GetLongString(Number(this._roomData.basicInfo.squidBase || 0)), '#FFFFFF');
            this.FillData('squid_max_count', this.L('UISquidGetCap'), String(this._roomData.basicInfo.squidMax || 0), '#FFFFFF');
            if (Number(this._roomData.basicInfo.squidMostGet || 0) === 1) {
                this.FillDataByLanguageOpen('UISquidAll', true);
            }
            if (Number(this._roomData.basicInfo.squidBetGet || 0) === 1) {
                this.FillDataByLanguageOpen('UISquidNothing', true);
            }
            if (Number(this._roomData.basicInfo.squidHead || 0) === 1) {
                this.FillDataByLanguageOpen('UISquidHeadDouble', true);
            }
            if (Number(this._roomData.basicInfo.squidTail || 0) === 1) {
                this.FillDataByLanguageOpen('UISquidTailDouble', true);
            }
        }
        const mushroomEnabled = !!this._roomData.basicInfo.mushroomEnabled;
        this.FillDataByLanguageOpen('UITableSetting_mushRoom', mushroomEnabled);
        if (mushroomEnabled) {
            const mushroomBase = Number(this._roomData.basicInfo.mushroomBase || 0);
            const mushroomMode = Number(this._roomData.basicInfo.mushroomMode || 0);
            this.FillData('mush_mode', this.L('UIMushMoneyMode'), StringHelper.GetLongString(mushroomBase * mushroomMode), '#FFFFFF');
            this.FillData('mush_rule', this.L('UIMushMoneyRule'), StringHelper.GetLongString(mushroomBase), '#FFFFFF');
        }
        const isLimitIP = this._roomData.basicInfo.limitIP;
        const isLimitGPS = this._roomData.basicInfo.limitGPS;
        const isAntiCheatOpen = this._roomData.basicInfo.antiCheatType > 1;
        const isSafeRoom = this._roomData.basicInfo.seatedMessage;
        this.FillDataByLanguageOpen('UIClub_RoomCreat_noh7zoAE', isLimitIP);
        this.FillDataByLanguageOpen('UIClub_RoomCreat_OMKEvaor', isLimitGPS);
        this.FillDataByOpen('Safe', isSafeRoom);
        if (this.IsPermitted('room_force_show_card')) {
            const forceShowCard = Number(this._roomData.basicInfo.forceShowCard || 0) === 1;
            this.FillDataByLanguageOpen('UICreateTable_FouceShowCard', forceShowCard, 'UICreateTable_FouceShowCardTips');
        }
        if (this.IsPermitted('room_random_seat')) {
            const randomSeat = this._roomData.basicInfo.randomSeated;
            this.FillDataByLanguageOpen('UICreateTable_randSeat', randomSeat, 'UICreateTable_randSeatTips');
        }
        this.FillDataByLanguageOpen('adaptation20088', !!this._roomData.basicInfo.delaySeeCard);
        if (this.IsPermitted('room_only_ios')) {
            const onlyIOS = this._roomData.basicInfo.onlyIOS;
            this.FillDataByLanguageOpen('UICreateTable_iosTitle', onlyIOS, 'UICreateTable_iosTitleTips');
        }
        if (this.IsPermitted('room_check_pool_rate')) {
            const poolRate = Number(this._roomData.basicInfo.hcPoolRate || 0);
            const title = this.TrimTailColon(this.L('UIClub_CreateRoom20'));
            this.FillData(
                'room_check_pool_rate',
                title,
                poolRate === 0 ? this.L('UIClub_CreateRoom23') : `${poolRate}%`,
                '#FFFFFF',
                this.L('UICreateTable_poolRules')
            );
        }
        if (callTime) {
            this.FillData('call_time', 'CallTime', this.L('6digit_password_opened'), '#7ED27E', this.L('UICreateRoomCallTimeTip'));
        }
        const antiCheatOpen = Number(this._roomData.basicInfo.antiCheatType || 0) > 1;
        this.FillDataByLanguageOpen('UISecuritySetting_limitVideo', antiCheatOpen);
        const insuranceMode = Number(this._roomData.basicInfo.insuranceMode || 0);
        const insuranceOpen = !!this._roomData.basicInfo.hasInsurance;
        this.FillData(
            'insurance',
            this.L('UIMatchFilter_CfZdLJ'),
            insuranceOpen ? this.GetInsuranceModeText(insuranceMode) : this.L('UIMine_AccountNotOpen'),
            insuranceOpen ? '#7ED27E' : '#FF6666'
        );
        const secondPcsOn = !!this._roomData.basicInfo.secondPcsOn;
        this.FillDataByLanguageOpen('UIGuildcreateroomtoggledoublecard', secondPcsOn);
        if (this.IsPermitted('room_look_hand_card')) {
            const lookHandCard = this._roomData.basicInfo.viewPlayerCards;
            this.FillData(
                'room_look_hand_card',
                this.L('UICreateTable_PayShowCard'),
                lookHandCard === 0
                    ? this.L('UICreateTable_PayShowCardClose')
                    : lookHandCard === 1
                      ? this.L('UICreateTable_PayShowCardAll')
                      : this.L('UICreateTable_PayShowCardSingle'),
                lookHandCard === 0 ? '#FF6666' : '#7ED27E',
                this.L('UICreateTable_PayShowCardTips')
            );
        }
        const chatType = Number(this._roomData.basicInfo.chatType ?? 1);
        this.FillData('chat_type', this.L('UITableSetting_chat'), chatType === 0 ? this.L('UIClub_CreateRoom7') : this.L('UIOpen'), '#7ED27E');
        const straddle = Number(this._roomData.basicInfo.straddle || 0);
        const straddleMax = Number(this._roomData.basicInfo.straddleMax || 2);
        this.FillData('straddle', 'Straddle', straddle === 1 ? String(straddleMax) : this.L('UIClub_CreateRoom7'), '#7ED27E');
        const randomSeatEnabled = this._roomData.basicInfo.randomSeated;
        if (this.warningTips) {
            this.warningTips.active = !(randomSeatEnabled && !!this._roomData.basicInfo.delaySeeCard && isLimitIP && isLimitGPS && antiCheatOpen && isSafeRoom);
        }
        this.RefreshContentLayout();
    }

    /** 拉取用户新标签已读次数 */
    private async RequestUserNewLabelNum(): Promise<void> {
        if (this.tribeId <= 0) {
            this.tribeId = this.ResolveTribeId();
        }
        if (this.tribeId <= 0) {
            this.roomPermissionsNumber = null;
            return;
        }
        try {
            const resp: any = await WWW.Instance.CommonAPI({
                web_class: APIOrgUserNewLabelReadNum,
                body: { tribe_id: this.tribeId },
                juhua: false
            });
            const marks = resp?.data?.user_new_label_num;
            this.roomPermissionsNumber = marks && typeof marks === 'object' ? marks : null;
            this.RefreshUI();
        } catch (err) {
            cc.warn('[UIGameplayTableSetting] RequestUserNewLabelNum failed', err);
        }
    }

    /** 上报本次已查看的新标签 */
    private async ReportReadNewLabels(): Promise<void> {
        if (this.lookTimeMarkSet.size <= 0) {
            return;
        }
        const tribeId = this.tribeId > 0 ? this.tribeId : this.ResolveTribeId();
        if (tribeId <= 0) {
            return;
        }
        const labels = Array.from(this.lookTimeMarkSet);
        try {
            await WWW.Instance.CommonAPI({
                web_class: APIOrgUserNewLabelRead,
                body: {
                    tribe_id: tribeId,
                    user_read_labels: labels
                },
                juhua: false
            });
            this.tribeId = tribeId;
            this.RecordLocalReadNewLabels(labels);
            this.lookTimeMarkSet.clear();
        } catch (err) {
            cc.warn('[UIGameplayTableSetting] ReportReadNewLabels failed', err);
        }
    }

    /** Unity RecordNewMark 对齐：本地递增已读次数，避免本次会话重复显示 */
    private RecordLocalReadNewLabels(labels: string[]): void {
        if (!labels || labels.length <= 0) return;
        if (!this.roomPermissionsNumber) {
            this.roomPermissionsNumber = {};
        }
        for (let i = 0; i < labels.length; i++) {
            const key = labels[i];
            if (!key) continue;
            const current = Number((this.roomPermissionsNumber as any)[key] || 0);
            (this.roomPermissionsNumber as any)[key] = current + 1;
        }
    }

    /** 重置列表状态（隐藏已生成项） */
    private ResetRows(): void {
        if (this.tipsMask) this.tipsMask.active = false;
        if (this.tipsContent) this.tipsContent.active = false;
        this.normalIndex = 0;
        this.andTipsIndex = 0;
        this.andTipsAndDetailIndex = 0;
        this.jackpotIndex = 0;
        this.itemNormalCache.forEach(node => node && (node.active = false));
        this.itemAndTipsCache.forEach(node => node && (node.active = false));
        this.itemAndTipsAndDetailCache.forEach(node => node && (node.active = false));
        this.jackpotCache.forEach(node => node && (node.active = false));
    }

    /** 用“开/关”状态填充一行 */
    private FillDataByOpen(title: string, open: boolean, tipsKey = ''): void {
        this.FillData(
            title,
            this.L(title),
            this.L(open ? '6digit_password_opened' : 'UIMine_AccountNotOpen'),
            open ? '#7ED27E' : '#FF6666',
            tipsKey ? this.L(tipsKey) : ''
        );
    }

    /** 用多语言标题+开关状态填充一行 */
    private FillDataByLanguageOpen(titleKey: string, open: boolean, tipsKey = ''): void {
        this.FillData(
            titleKey,
            this.L(titleKey),
            this.L(open ? '6digit_password_opened' : 'UIMine_AccountNotOpen'),
            open ? '#7ED27E' : '#FF6666',
            tipsKey ? this.L(tipsKey) : ''
        );
    }

    /** 填充普通项 / 带 tips 项 */
    private FillData(newMarkName: string, title: string, state: string, stateColor: string, tips = ''): void {
        const titleText = title || this.L(newMarkName);
        if (!tips) {
            const item = this.GetNormalItem(this.normalIndex++);
            if (!item) return;
            this.SetTextByPath(item, 'titleContent/title', titleText);
            this.SetStateByPath(item, 'state', state, stateColor);
            this.SetNewMarkActive(item, 'titleContent/Image', newMarkName);
            this.MoveToLast(item);
            item.active = true;
            return;
        }
        const item = this.GetAndTipsItem(this.andTipsIndex++);
        if (!item) return;
        this.SetTextByPath(item, 'titleContent/title', titleText);
        this.SetStateByPath(item, 'state', state, stateColor);
        this.SetNewMarkActive(item, 'titleContent/Image', newMarkName);
        this.BindTipsButton(item, 'titleContent/Button', tips);
        this.MoveToLast(item);
        item.active = true;
    }

    /** 填充带 tips + 详情描述项 */
    private FillTipsAndDetailData(newMarkName: string, title: string, state: string, stateColor: string, tips: string, detail: string): void {
        const item = this.GetAndTipsAndDetailItem(this.andTipsAndDetailIndex++);
        if (!item) {
            this.FillData(newMarkName, title, state, stateColor, tips);
            return;
        }
        this.SetTextByPath(item, 'titleContent/title', title);
        this.SetStateByPath(item, 'state', state, stateColor);
        this.SetTextByPath(item, 'detail', detail);
        this.SetNewMarkActive(item, 'titleContent/Image', newMarkName);
        this.BindTipsButton(item, 'titleContent/Button', tips);
        this.MoveToLast(item);
        item.active = true;
    }

    /** 填充 Jackpot 模块 */
    private FillJackpotData(state: string, stateColor: string, jackpotConfig: any): void {
        const item = this.GetJackpotItem(this.jackpotIndex++);
        if (!item) {
            this.FillData('room_jackpot', 'Jackpot', state, stateColor);
            return;
        }
        this.SetStateByPath(item, 'itemNormal/state', state, stateColor);
        this.SetNewMarkActive(item, 'itemNormal/titleContent/Image', 'room_jackpot');
        const cfg = this.ResolveJackpotConfig(jackpotConfig) || {};
        const jackpotOpen = stateColor === '#7ED27E';
        this.SetActiveByPath(item, 'Min', false);
        this.SetActiveByPath(item, 'Put', false);
        this.SetActiveByPath(item, 'AllTable', false);
        this.SetActiveByPath(item, 'ProfitTr', false);
        this.SetActiveByPath(item, 'TrProfit', false);
        this.SetActiveByPath(item, 'PotGold', false);
        this.SetActiveByPath(item, 'AwardRoundType', false);
        if (jackpotOpen) {
            const contributePotSwitch = this.ReadJackpotNum(cfg, ['contributePotSwitch', 'contribute_pot_switch', 'ContributePotSwitch']);
            if (contributePotSwitch === 1) {
                const contributePotLimit = this.ReadJackpotNum(cfg, ['contributePotLimit', 'contribute_pot_limit', 'ContributePotLimit']);
                this.SetTextByPath(item, 'Min/titleContent/title', StringHelper.Format(this.L('UITexasTableSetting_JackpotMin'), [contributePotLimit]));
                this.BindTipsButton(item, 'Min/titleContent/Button', this.L('UICreateClubJackpotTemplate_JackpotMinWhy'));
                this.SetActiveByPath(item, 'Min', true);
            }
            const awardBetSwitch = this.ReadJackpotNum(cfg, ['awardBetSwitch', 'award_bet_switch', 'AwardBetSwitch']);
            if (awardBetSwitch === 1) {
                const awardBetLimit = this.ReadJackpotNum(cfg, ['awardBetLimit', 'award_bet_limit', 'AwardBetLimit']);
                this.SetTextByPath(item, 'Put/titleContent/title', StringHelper.Format(this.L('UITexasTableSetting_JackpotPut'), [awardBetLimit]));
                this.BindTipsButton(item, 'Put/titleContent/Button', this.L('UICreateClubJackpotTemplate_JackpotPutWhy'));
                this.SetActiveByPath(item, 'Put', true);
            }
            const awardOtherSwitch = this.ReadJackpotNum(cfg, ['awardOtherSwitch', 'award_other_switch', 'AwardOtherSwitch']);
            if (awardOtherSwitch === 1) {
                this.BindTipsButton(item, 'AllTable/titleContent/Button', this.L('UICreateClubJackpotTemplate_AllTableWhy'));
                this.SetActiveByPath(item, 'AllTable', true);
            }
            const contributeType = this.ReadJackpotNum(cfg, ['contributeType', 'contribute_type', 'ContributeType']);
            if (contributeType === 2) {
                const contributeRatio = this.ReadJackpotNum(cfg, ['contributeRatio', 'contribute_ratio', 'ContributeRatio']);
                this.SetTextByPath(item, 'TrProfit/titleContent/title', StringHelper.Format(this.L('UITexasTableSetting_TrProfit'), [contributeRatio / 10]));
                this.SetActiveByPath(item, 'TrProfit', true);
            } else if (contributeType === 3) {
                const contributePotRatio = this.ReadJackpotNum(cfg, ['contributePotRatio', 'contribute_pot_ratio', 'ContributePotRatio']);
                this.SetTextByPath(
                    item,
                    'PotGold/titleContent/title',
                    StringHelper.Format(this.L('UITexasTableSetting_Jackpot_PotGold'), [contributePotRatio / 10])
                );
                this.SetActiveByPath(item, 'PotGold', true);
            } else {
                const contributeFixedLimit = this.ReadJackpotNum(cfg, ['contributeFixedLimit', 'contribute_fixed_limit', 'ContributeFixedLimit']);
                const contributeFixedRate = this.ReadJackpotNum(cfg, ['contributeFixedRate', 'contribute_fixed_rate', 'ContributeFixedRate']);
                this.SetTextByPath(
                    item,
                    'ProfitTr/titleContent/title',
                    StringHelper.Format(this.L('UITexasTableSetting_ProfitTr'), [contributeFixedLimit, contributeFixedRate])
                );
                this.SetActiveByPath(item, 'ProfitTr', true);
            }
            const awardRoundType = this.ReadJackpotNum(cfg, ['awardRoundType', 'award_round_type', 'AwardRoundType']);
            if (awardRoundType === 1) {
                this.SetTextByPath(item, 'AwardRoundType/titleContent/title', this.L('UICreateClubJackpotTemplate_jackpot_PlayCards'));
                this.BindTipsButton(item, 'AwardRoundType/titleContent/Button', this.L('UICreateClubJackpotTemplate_jackpot_PlayCards_why'));
                this.SetActiveByPath(item, 'AwardRoundType', true);
            } else if (awardRoundType === 2) {
                this.SetTextByPath(item, 'AwardRoundType/titleContent/title', this.L('UICreateClubJackpotTemplate_jackpot_Flop'));
                this.BindTipsButton(item, 'AwardRoundType/titleContent/Button', this.L('UICreateClubJackpotTemplate_jackpot_Flop_why'));
                this.SetActiveByPath(item, 'AwardRoundType', true);
            }
        }
        this.MoveToLast(item);
        item.active = true;
    }

    private ResolveJackpotConfig(raw: any): any {
        if (!raw) return null;
        if (typeof raw === 'string') {
            try {
                return JSON.parse(raw);
            } catch {
                return null;
            }
        }
        return raw;
    }

    private ReadJackpotNum(cfg: any, keys: string[]): number {
        if (!cfg || !keys || keys.length <= 0) return 0;
        for (let i = 0; i < keys.length; i++) {
            const v = cfg[keys[i]];
            if (v !== undefined && v !== null) {
                const n = Number(v);
                return Number.isFinite(n) ? n : 0;
            }
        }
        return 0;
    }

    private _onClickTips: () => void;

    /** 绑定 tips 按钮（点击显示全局 tips） */
    private BindTipsButton(root: cc.Node, buttonPath: string, tips: string): void {
        const btn = cc.find(buttonPath, root);
        if (!btn) return;
        this._onClickTips = () => this.ShowTips(tips, btn);
        btn.targetOff(this);
        btn.on('click', this._onClickTips, this);
        const titleContent = btn.parent;
        if (titleContent) {
            titleContent.targetOff(this);
            titleContent.on('click', this._onClickTips, this);
        }
    }

    /** 显示 tips 文案 */
    private ShowTips(tips: string, followNode?: cc.Node): void {
        if (this.tipsContent) {
            this.SetTextByPath(this.tipsContent, 'tips/Text', tips);
            if (followNode && this.tipsContent.parent) {
                const worldPos = followNode.convertToWorldSpaceAR(cc.v2(0, 0));
                const localPos = this.tipsContent.parent.convertToNodeSpaceAR(worldPos);
                this.tipsContent.setPosition(this.tipsContent.x, localPos.y + 100);
            }
            this.tipsContent.active = true;
        }
        if (this.tipsMask) {
            this.tipsMask.active = true;
        }
    }

    /** 关闭 tips 蒙层 */
    private OnClickTipsMask(): void {
        if (this.tipsContent) {
            this.tipsContent.active = false;
        }
        if (this.tipsMask) {
            this.tipsMask.active = false;
        }
    }

    /** 确认：上报新标签并继续带入流程 */
    private OnClickCommit(): void {
        void this.ReportReadNewLabels();
        if (this.isFromBringIn) {
            // this._roomData.basicInfo.SetSecuritySettingRoom(this._roomData.basicInfo.room_id);
        }
        this.close();
        if (this.isFromBringIn) {
            this.bringInAct?.();
        }
    }

    /** 关闭面板 */
    private OnClickClose(): void {
        this.close();
    }

    /** 判断某条配置是否有权限显示 */
    private IsPermitted(key: string): boolean {
        const value = this.roomPermissions?.[key];
        if (value === undefined || value === null) return false;
        return Number(value) === 1;
    }

    /** 更新新标签显示状态，并记录本次已查看字段 */
    private SetNewMarkActive(root: cc.Node, path: string, markKey: string): void {
        const node = cc.find(path, root);
        if (!node) return;
        const shouldShow = this.ShouldShowNewMark(markKey);
        node.active = shouldShow;
        if (shouldShow) {
            this.lookTimeMarkSet.add(markKey);
        }
    }

    /** 是否显示新标签 */
    private ShouldShowNewMark(markKey: string): boolean {
        if (!markKey || !TRACKABLE_NEW_MARKS.has(markKey)) {
            return false;
        }
        const maxCount = this.GetNewMarkMaxViewCount();
        const viewedCount = this.GetViewedNewMarkCount(markKey);
        return viewedCount < maxCount;
    }

    /** 新标签最大展示次数（来自全局配置，兜底 3 次） */
    private GetNewMarkMaxViewCount(): number {
        // const cacheMax = Number(this._roomData.basicInfo.newLabelsMaxNumber || 0);
        // if (cacheMax > 0) return cacheMax;
        // const cfg: any = WebConfigGlobalConfig?.Response?.data || null;
        // const globalMax = Number(cfg?.tribe_permission_new_label_view_num ?? cfg?.tribePermissionNewLabelViewNum ?? 0);
        // return globalMax > 0 ? globalMax : 3;
        return 3;
    }

    private GetViewedNewMarkCount(markKey: string): number {
        const marks = this.roomPermissionsNumber;
        if (!marks) return 0;
        const direct = Number((marks as any)[markKey]);
        if (Number.isFinite(direct) && direct > 0) return direct;
        const camel = markKey.replace(/_([a-z])/g, (_, ch: string) => ch.toUpperCase());
        const camelValue = Number((marks as any)[camel]);
        if (Number.isFinite(camelValue) && camelValue > 0) return camelValue;
        return 0;
    }

    /** 获取牌桌类型文案 */
    private GetTableTypeName(): string {
        if (this._roomData.basicInfo.gameType === GameType.HOLDEM && this._roomData.basicInfo.pokerType === 0) {
            return this.L('adaptation10022');
        }
        if (
            this._roomData.basicInfo.gameType >= GameType.OMAHA4 &&
            this._roomData.basicInfo.gameType <= GameType.OMAHA6 &&
            this._roomData.basicInfo.pokerType === 0
        ) {
            return this.L('UIFriendsTable_Create_PLO');
        }
        if (this._roomData.basicInfo.gameType === GameType.HOLDEM && this._roomData.basicInfo.pokerType === 2) {
            return this.L('UIGame_Type6p');
        }
        return this.L('UITexasTotalResult');
    }

    /** 构建随机前注详情文本 */
    private BuildRandomAnteDetail(values: number[]): string {
        if (!values) return this.L('UIAnteRandomJump7');
        const min = (values[0] / 100).toFixed(1);
        const max = (values[1] / 100).toFixed(1);
        const interval = (values[2] / 100).toFixed(1);
        return StringHelper.Format(this.L('UIAnteRandomJump7'), [min, max, interval]);
    }
    // /** 解析随机前注配置串 */
    // private ParseRandomAnteConfig(configStr: string): number[] | null {
    //     if (!configStr) return null;
    //     const str = configStr.trim();
    //     if (!str) return null;
    //     const normalized = str.replace(/^\[/, '').replace(/\]$/, '');
    //     const arr = normalized.split(',').map(v => Number(v.trim()));
    //     if (arr.length < 3 || arr.some(v => !Number.isFinite(v))) return null;
    //     return arr;
    // }
    /** 保险模式文案 */
    private GetInsuranceModeText(mode: number): string {
        switch (mode) {
            case Def.IsuranceMode.IM_NORMAL:
                return this.L('UICreateClassicInsurances');
            case Def.IsuranceMode.IM_WPK:
                return this.L('UICreateTable_LowWaterIns');
            case Def.IsuranceMode.IM_EV:
                return this.L('UIEVInsurance');
            case Def.IsuranceMode.IM_NEW_NORMAL:
                return this.L('UICreateClassicInsurancesNew');
            default:
                return this.L('UICreateClassicInsurances');
        }
    }

    /** 去掉标题尾部冒号 */
    private TrimTailColon(text: string): string {
        if (!text) return '';
        if (text.endsWith('：') || text.endsWith(':')) {
            return text.slice(0, text.length - 1);
        }
        return text;
    }

    /** 获取/创建普通项实例 */
    private GetNormalItem(index: number): cc.Node | null {
        if (!this.itemNormalTemplate) return null;
        if (index < this.itemNormalCache.length) return this.itemNormalCache[index];
        const node = cc.instantiate(this.itemNormalTemplate);
        node.parent = this.itemNormalTemplate.parent;
        node.active = false;
        this.itemNormalCache.push(node);
        return node;
    }

    /** 获取/创建带 tips 项实例 */
    private GetAndTipsItem(index: number): cc.Node | null {
        if (!this.itemAndTipsTemplate) return null;
        if (index < this.itemAndTipsCache.length) return this.itemAndTipsCache[index];
        const node = cc.instantiate(this.itemAndTipsTemplate);
        node.parent = this.itemAndTipsTemplate.parent;
        node.active = false;
        this.itemAndTipsCache.push(node);
        return node;
    }

    /** 获取/创建带 tips+detail 项实例 */
    private GetAndTipsAndDetailItem(index: number): cc.Node | null {
        if (!this.itemAndTipsAndDetailTemplate) return null;
        if (index < this.itemAndTipsAndDetailCache.length) return this.itemAndTipsAndDetailCache[index];
        const node = cc.instantiate(this.itemAndTipsAndDetailTemplate);
        node.parent = this.itemAndTipsAndDetailTemplate.parent;
        node.active = false;
        this.itemAndTipsAndDetailCache.push(node);
        return node;
    }

    /** 获取/创建 Jackpot 项实例 */
    private GetJackpotItem(index: number): cc.Node | null {
        if (!this.jackpotTemplate) return null;
        if (index < this.jackpotCache.length) return this.jackpotCache[index];
        const node = cc.instantiate(this.jackpotTemplate);
        node.parent = this.jackpotTemplate.parent;
        node.active = false;
        this.jackpotCache.push(node);
        return node;
    }

    /** 设置节点文本（Label/RichText） */
    private SetTextByPath(root: cc.Node, path: string, text: string): void {
        const node = cc.find(path, root);
        if (!node) return;
        const label = node.getComponent(cc.Label);
        if (label) {
            label.string = text || '';
            return;
        }
        const rich = node.getComponent(cc.RichText);
        if (rich) {
            rich.string = text || '';
        }
    }

    /** 设置状态文本与颜色 */
    private SetStateByPath(root: cc.Node, path: string, text: string, color: string): void {
        const node = cc.find(path, root);
        if (!node) return;
        const label = node.getComponent(cc.Label);
        if (label) {
            label.string = text || '';
            label.node.color = cc.color().fromHEX(color);
            return;
        }
        const rich = node.getComponent(cc.RichText);
        if (rich) {
            rich.string = text || '';
            rich.node.color = cc.color().fromHEX(color);
        }
    }

    /** 设置节点显隐 */
    private SetActiveByPath(root: cc.Node, path: string, active: boolean): void {
        const node = cc.find(path, root);
        if (!node) return;
        node.active = active;
    }

    /** 把节点移动到容器最后 */
    private MoveToLast(node: cc.Node | null): void {
        if (!node || !node.parent) return;
        node.setSiblingIndex(node.parent.childrenCount - 1);
    }

    /** 刷新列表布局 */
    private RefreshContentLayout(): void {
        if (!this.contentRoot) return;
        const layout = this.contentRoot.getComponent(cc.Layout);
        if (!layout) return;
        layout.updateLayout();
    }

    /** 多语言取值（缺失时回退 key） */
    private L(key: string): string {
        const text = i18nMgr.Get(key);
        if (!text || text.indexOf('缺少字段') >= 0) return key;
        return text;
    }

    /** tribeId 兜底：房间 -> 俱乐部缓存 */
    private ResolveTribeId(): number {
        return Number(this._roomData.basicInfo.tribeID || 0);
    }
}
