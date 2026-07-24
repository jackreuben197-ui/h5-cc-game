import { ClientMessageBroadcastMsg, Code, Def } from '@silenthill/agreement-web';
import playerStore, { PlayerBasicData, PlayerDiamondConfig, PlayerStore } from '../../../data/player/PlayerStore';
import PlayerStoreUtils from '../../../data/player/PlayerStoreUtils';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataPlayer from '../../../data/room/texas/TexasGameRoomDataPlayer';
import userStore, { UserPropData, UserStore } from '../../../data/user/UserStore';
import UserStoreUtils from '../../../data/user/UserStoreUtils';
import { AntiCheatType } from '../../../game/constant/AntiCheatType';
import { BroadcastCode, PropsID } from '../../../game/constant/BroadcastCode';
import { GameplayChatPropType } from '../../../game/constant/GameplayChatPropType';
import { RoomOriginType } from '../../../game/constant/RoomOriginType';
import { StringHelper } from '../../../helper/StringHelper';
import { CPErrorCode } from '../../../i18n/CPErrorCode';
import { i18nMgr } from '../../../i18n/i18nMgr';
import agoraManager from '../../../net/agora/AgoraManager';
import { WebResponseDataBase } from '../../../net/https/data/other/WebResponseDataBase';
import { HttpStatsOtherUserStats } from '../../../net/https/data/stats/HttpStatsOtherUserStats';
import TexasVideoMediaHelper from '../../../net/messages/texas/TexasVideoMediaHelper';
import ProtocolAgency from '../../../net/websocket/ProtocolAgency';
import UIComponentBaseDialog from '../../base/UIComponentDialogBase';
import viewManager from '../../UIViewManager';
import { UIComfirmDialogType } from '../confirm/UIConfirmDialog';

const { ccclass, menu, property } = cc._decorator;

const VIEW_MANAGER_MASK_NODE = 'ithinktisinotshouldbedupilcatednodename';

const OTHER_DATA_TAB_Y = -163.5;

export interface UIPlayerInfoParam {
    roomID: number;
    matchID: number;
    player: TexasGameRoomDataPlayer;
    diamondConfig?: PlayerDiamondConfig;
}

interface DataLabelItem {
    node: cc.Node;
    des: cc.Label;
    num: cc.Label;
}

interface ThrowPropDefinition {
    propCode: string;
    type: PropsID;
}

@ccclass
@menu('CrazyPoker/Texas/Dialog/UIPlayerInfo')
export default class UIPlayerInfo extends UIComponentBaseDialog<UIPlayerInfoParam> {
    @property({ type: cc.SpriteFrame, displayName: '开关选中背景' })
    public toggleOnBg: cc.SpriteFrame = null;
    @property({ type: cc.Node, displayName: '关闭触摸遮罩' })
    private panelClick: cc.Node = null;
    @property({ type: cc.Node, displayName: '弹窗主体' })
    private dialogNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '头像信息根节点' })
    private headImgNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '头像图片节点' })
    private headImgIcon: cc.Node = null;
    @property({ type: cc.Label, displayName: '昵称文本' })
    private nickNameLabel: cc.Label = null;
    @property({ type: cc.Node, displayName: '男性图标' })
    private maleNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '女性图标' })
    private femaleNode: cc.Node = null;
    @property({ type: cc.Label, displayName: '玩家ID文本' })
    private playerIDLabel: cc.Label = null;
    @property({ type: cc.Node, displayName: '备注根节点' })
    private noteNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '备注显示节点' })
    private playerNoteNode: cc.Node = null;
    @property({ type: cc.Label, displayName: '备注文本' })
    private playerNoteLabel: cc.Label = null;
    @property({ type: cc.EditBox, displayName: '备注输入框' })
    private noteEditBox: cc.EditBox = null;
    @property({ type: cc.Node, displayName: '备注编辑按钮' })
    private noteBtn: cc.Node = null;
    @property({ type: cc.Node, displayName: '操作按钮根节点' })
    private opButtonNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '道具操作根节点' })
    private propOpNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '钻石余额根节点' })
    private diamondShowNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '钻石余额文本节点' })
    private diamondNumNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '数据页签根节点' })
    private dataTabNode: cc.Node = null;
    private static readonly PROP_DEFINITIONS: ThrowPropDefinition[] = [
        { propCode: 'kiss_Button', type: PropsID.PROPSKISS },
        { propCode: 'money_Button', type: PropsID.PROPSMONEY },
        { propCode: 'boxing_Button', type: PropsID.PROPSBOXING },
        { propCode: 'touch_Button', type: PropsID.PROPSTOUCH },
        { propCode: 'tomato_Button', type: PropsID.PROPSTOMATO },
        { propCode: 'fish_Button', type: PropsID.PROPSFISH },
        { propCode: 'baseball_Button', type: PropsID.PROPSBASEBALL },
        { propCode: 'good_Button', type: PropsID.PROPSGOOD },
        { propCode: 'cheers_Button', type: PropsID.PROPSCHEERS },
        { propCode: 'chicken_Button', type: PropsID.PROPSCHICKEN },
        { propCode: 'flower_Button', type: PropsID.PROPSFLOWER },
        { propCode: 'shark_Button', type: PropsID.PROPSSHARK }
    ];
    private static readonly shieldUsers: Set<number> = new Set();
    private static readonly audioClosedUsers: Set<number> = new Set();
    private static readonly videoClosedUsers: Set<number> = new Set();
    private _param: UIPlayerInfoParam = null;
    private _roomData: TexasGameRoomData = null;
    private _player: TexasGameRoomDataPlayer = null;
    private _isSelf = false;
    private _dbUserID = 0;
    private _currentRemark = '';
    private _tabIndex = 0;
    private _requestRID = 0;
    private _tabNodes: cc.Node[] = [];
    private _underlineNodes: cc.Node[] = [];
    private _contentNodes: cc.Node[] = [];
    private _dataLabels: DataLabelItem[] = [];
    private _allInLabels: DataLabelItem[] = [];
    private _radarNode: cc.Node = null;
    private _radarGfx: cc.Graphics = null;
    private _radarSize = 80;
    private _diamondNodes: Array<{ node: cc.Node; amount: number }> = [];
    private _noticeLabel: cc.Label = null;
    private _diamondConfig: PlayerDiamondConfig = null;
    private _diamondSentCount = 0;
    private _isChatMuted = false;
    private _isShielded = false;
    private _hasAudioTrack = false;
    private _hasVideoTrack = false;
    private _isAudioClosed = false;
    private _isVideoClosed = false;
    private _propListData: Map<PropsID, UserPropData> = new Map();

    public initialize(param: UIPlayerInfoParam): void {
        this._param = param;
        this._roomData = roomDataManager.getRoomData<TexasGameRoomData>(param.roomID, param.matchID);
        this._player = param.player;
        this._diamondConfig = param.diamondConfig || null;
        this._diamondSentCount = param.diamondConfig?.sentCount || 0;
        this._requestRID = this._player.userID;
        this._isSelf = this._requestRID === userStore.userRID || this._requestRID === userStore.userID;
        this._applyTargetLayout();
        this._resetView();
        this._refreshBasicInfo({
            nick_name: this._player.name || '',
            avatar: this._player.avatar || '',
            random_num: this._requestRID,
            sex: this._player.sex || 1
        });
        const cachedBasicInfo = playerStore.getBasicInfo(this._requestRID);
        if (cachedBasicInfo) this._refreshBasicInfo(cachedBasicInfo);
        playerStore.targetOff(this);
        playerStore.on(PlayerStore.BASIC_INFO_CHANGE, this._onStoreBasicInfoChange, this);
        playerStore.on(PlayerStore.STATS_CHANGE, this._onStoreStatsChange, this);
        this._refreshSelfState();
        this._refreshOpButtons();
        this._switchTab(0);
        this._loadAsyncData();
    }

    protected onLoad(): void {
        this._bindStaticEvents();
        this._initTabs();
        this._initDataNodes();
        this._initAllInNodes();
        this._initDiamondNodes();
        this._initPropNodes();
        if (this._param) this.initialize(this._param);
    }

    protected override onFrameResize(
        visibleSizeWidth: number,
        visibleSizeHeight: number,
        frameSizeWidth: number,
        frameSizeHeight: number,
        suggestScale: number,
        saveAreaTop: number
    ): void {
        const maxHeight = 2290;
        if (visibleSizeHeight < maxHeight) {
            const scale = visibleSizeHeight / maxHeight;
            this.node.setScale(scale, scale);
        }
    }

    protected onDestroy(): void {
        this.node.targetOff(this);
        this.dialogNode.targetOff(this);
        this._tabNodes.forEach(node => node.targetOff(this));
        this._diamondNodes.forEach(item => item.node.targetOff(this));
        this.propOpNode.children.forEach(node => node.targetOff(this));
        this.noteEditBox.node.targetOff(this);
        userStore.targetOff(this);
        playerStore.targetOff(this);
    }

    private _bindStaticEvents(): void {
        this._bindClick(this.panelClick, this.close);
        this.dialogNode.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => event.stopPropagation(), this);
        this.dialogNode.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => event.stopPropagation(), this);
        this._bindClick(this.noteBtn, this._clickEditNote);
        this._bindClick(this.playerNoteNode, this._clickEditNote);
        this.noteEditBox.node.on('editing-did-ended', this._onNoteEditEnded, this);
        this._bindOpButton('StandUpBtn', this._clickStandUp);
        this._bindOpButton('DissolveBtn', this._clickLeave);
        this._bindOpButton('CreditBtn', this._clickCredit);
        this._bindOpButton('chatCloseToggle', this._clickChatClose);
        this._bindOpButton('audioCloseToggle', this._clickAudioClose);
        this._bindOpButton('videoCloseToggle', this._clickVideoClose);
        // this._bindOpButton('shieldToggle', this._clickShield);
        // this._bindOpButton('ReportBtn', this._clickReport);
        userStore.on(UserStore.DIAMONDS_CHANGE, this._refreshDiamondBalance, this);
        userStore.on(UserStore.PROP_LIST_CHANGE, this._refreshPropList, this);
    }

    private _resetView(): void {
        this.noteEditBox.node.active = false;
        this.playerNoteNode.active = true;
        this.noteBtn.active = true;
        this._refreshDataDescriptions();
        this._refreshAllInPanel(null);
        this._isChatMuted = false;
        this._hasAudioTrack = false;
        this._hasVideoTrack = false;
        this._isAudioClosed = UIPlayerInfo.audioClosedUsers.has(this._requestRID);
        this._isVideoClosed = UIPlayerInfo.videoClosedUsers.has(this._requestRID);
        this._refreshToggleVisual('chatCloseToggle', false);
        // this._refreshToggleVisual('shieldToggle', UIPlayerInfo.shieldUsers.has(this._requestRID));
        this._refreshDiamondNotice();
    }

    private async _loadAsyncData(): Promise<void> {
        const rid = this._requestRID;
        if (!this._isSelf) {
            this._loadMuteState();
            this._loadAudioVideoState();
        }
        if (this._canGiftDiamond()) {
            this._loadDiamondBalance();
        }
        try {
            const data = playerStore.getBasicInfo(rid);
            const statsRID = data?.random_num || rid;
            const cachedStats = playerStore.getStats(statsRID);
            if (cachedStats) {
                this._refreshDataPanel(cachedStats);
            }
            const stats = await PlayerStoreUtils.refreshStats(this._roomData, statsRID);
            if (!cachedStats && this._isCurrentRequest(rid) && stats) this._refreshDataPanel(stats);
        } catch (error) {
            cc.warn('[UIPlayerInfo] load player info failed', error);
        }
    }

    private _onStoreBasicInfoChange(userRID: number, data: PlayerBasicData): void {
        if (!this._isCurrentRequest(userRID)) return;
        this._refreshBasicInfo(data);
    }

    private _onStoreStatsChange(userRID: number, data: HttpStatsOtherUserStats.Data): void {
        if (!this._isCurrentRequest(userRID)) return;
        this._refreshDataPanel(data);
    }

    private _refreshBasicInfo(data: PlayerBasicData): void {
        const rid = data.random_num || this._requestRID;
        if (data.avatar) this._loadRemoteSprite(this.headImgIcon, data.avatar);
        this.nickNameLabel.string = StringHelper.LengthNick(data.nick_name, 16);
        this.maleNode.active = data.sex !== 1;
        this.femaleNode.active = data.sex === 1;
        this.playerIDLabel.string = `${rid || ''}`;
        if (data.random_num) this._dbUserID = data.random_num;
        const remark = data.remark_name || '';
        this._currentRemark = remark;
        this.playerNoteLabel.string = remark || i18nMgr.Get('UIUserRemarks_7S612w03');
    }

    private _refreshSelfState(): void {
        const canUseProp = !this._isSelf && !!this._requestRID && !!this._roomData.mine.seatNo;
        const canGiftDiamond = this._canGiftDiamond();
        this.propOpNode.active = canUseProp;
        this.diamondShowNode.active = canGiftDiamond;
        this.noteNode.active = !this._isSelf;
        if (this._tabNodes[2]) this._tabNodes[2].active = canGiftDiamond;
        if (!canGiftDiamond && this._tabIndex === 2) this._switchTab(0);
        this._refreshDialogLayout();
    }

    private _initTabs(): void {
        const tabNode = this.dataTabNode.getChildByName('tabNode');
        const tabNames = ['Data', 'allIn', 'Gift'];
        this._tabNodes = [];
        this._underlineNodes = [];
        for (let i = 0; i < tabNames.length; i++) {
            const node = tabNode.getChildByName(tabNames[i]);
            this._tabNodes.push(node);
            this._bindClick(node, () => this._switchTab(i));
            const underline = new cc.Node('underline');
            const gfx = underline.addComponent(cc.Graphics);
            gfx.strokeColor = cc.Color.WHITE;
            gfx.lineWidth = 8;
            const width = node.width;
            gfx.moveTo(-width / 2, 0);
            gfx.lineTo(width / 2, 0);
            gfx.stroke();
            underline.y = -40;
            underline.active = false;
            node.addChild(underline);
            this._underlineNodes.push(underline);
        }
        this._contentNodes = [
            this.dataTabNode.getChildByName('dataNode'),
            this.dataTabNode.getChildByName('allInNode'),
            this.dataTabNode.getChildByName('diamondNode')
        ];
    }

    private _switchTab(index: number): void {
        if ((this._isSelf || !this._tabNodes[2].active) && index === 2) index = 0;
        this._tabIndex = index;
        for (let i = 0; i < this._underlineNodes.length; i++) {
            this._underlineNodes[i].active = i === index;
        }
        for (let i = 0; i < this._contentNodes.length; i++) {
            this._contentNodes[i].active = i === index;
        }
    }

    private _initDataNodes(): void {
        const dataNode = this.dataTabNode.getChildByName('dataNode');
        this._dataLabels = [];
        for (let i = 1; i <= 6; i++) {
            const node = dataNode.getChildByName('LabelNode' + i);
            if (!node) continue;
            this._dataLabels.push({
                node,
                des: node.getChildByName('dataDes').getComponent(cc.Label),
                num: node.getChildByName('dataNum').getComponent(cc.Label)
            });
        }
    }

    private _initAllInNodes(): void {
        const allInNode = this.dataTabNode.getChildByName('allInNode');
        const labelNames = ['LabelPositive', 'LabelPassive', 'LabelBehind', 'LabelLeading'];
        this._allInLabels = [];
        labelNames.forEach(name => {
            const node = allInNode.getChildByName(name);
            if (!node) return;
            this._allInLabels.push({
                node,
                des: node.getChildByName('des').getComponent(cc.Label),
                num: node.getChildByName('num').getComponent(cc.Label)
            });
        });
        this._radarNode = allInNode.getChildByName('radarChartNode');
        if (this._radarNode) {
            this._radarGfx = this._radarNode.getComponent(cc.Graphics) || this._radarNode.addComponent(cc.Graphics);
            this._radarSize = (Math.min(this._radarNode.width, this._radarNode.height) / 2) * 0.85 || 80;
        }
    }

    private _initDiamondNodes(): void {
        const diamondNode = this.dataTabNode.getChildByName('diamondNode');
        this._noticeLabel = diamondNode.getChildByName('notice').getComponent(cc.Label);
        this._diamondNodes = [];
        diamondNode.children.forEach(node => {
            const match = node.name.match(/^diamond(\d+)$/);
            if (!match) return;
            const amount = parseInt(match[1], 10);
            const label = node.getChildByName('diamondNum').getComponent(cc.Label);
            if (label) label.string = `${amount}`;
            this._bindClick(node, () => this._clickSendDiamond(amount, node));
            this._diamondNodes.push({ node, amount });
        });
    }

    private _initPropNodes(): void {
        UIPlayerInfo.PROP_DEFINITIONS.forEach((definition, index) => {
            const node = this.propOpNode.getChildByName('$propOp_' + (index + 1));
            this._bindClick(node, () => this._clickProp(definition, node));
        });
        this._refreshPropList(userStore.propList);
    }

    private _applyTargetLayout(): void {
        this.node.setPosition(0, 0);
        this.node.setContentSize(1242, 2688);
        const mask = this.node.getChildByName(VIEW_MANAGER_MASK_NODE);
        if (mask) {
            mask.setPosition(0, 0);
            mask.setContentSize(1242, 2688);
            mask.opacity = 190;
        }
        this.panelClick.setPosition(0, 0);
        this.panelClick.setContentSize(1242, 2688);
        this.panelClick.opacity = 0;
        this.dialogNode.setPosition(0, 0);
        this.dialogNode.setContentSize(1088, 2280);
        this.dialogNode.opacity = 255;
        this.headImgNode.setPosition(0, 987.5);
        this.opButtonNode.setPosition(0, 577);
        this.opButtonNode.setContentSize(1000, 556);
        this.dataTabNode.setPosition(0, OTHER_DATA_TAB_Y);
        this.dataTabNode.setContentSize(1000, 905);
        this.diamondShowNode.setPosition(0, -1070);
        this.diamondShowNode.active = this._canGiftDiamond();
        this.propOpNode.setPosition(0, -823);
        this.propOpNode.setContentSize(1000, 394);
    }

    private _refreshDialogLayout(): void {
        const opLayout = this.opButtonNode.getComponent(cc.Layout);
        if (opLayout) opLayout.updateLayout();
        const dataLayout = this.dataTabNode.getComponent(cc.Layout);
        if (dataLayout) dataLayout.updateLayout();
        const propLayout = this.propOpNode.getComponent(cc.Layout);
        if (propLayout) propLayout.updateLayout();
        const dialogLayout = this.dialogNode.getComponent(cc.Layout);
        if (dialogLayout) dialogLayout.updateLayout();
    }

    private _refreshDataDescriptions(): void {
        if (!this._dataLabels.length) return;
        const isMTT = !!this._roomData?.basicInfo?.isMtt;
        const descs = isMTT
            ? [
                  i18nMgr.Get('UIData_YGvXd5iXr_006'),
                  i18nMgr.Get('UIData_YGvXd5iXr_007'),
                  i18nMgr.Get('UIData_YGvXd5iXr_008'),
                  i18nMgr.Get('UIData_YGvXd5iXr_005'),
                  i18nMgr.Get('UITexasInfo_wincount')
              ]
            : [
                  i18nMgr.Get('UITexasInfo_games'),
                  i18nMgr.Get('UITexasInfo_poolrate'),
                  i18nMgr.Get('UITexasInfo_flop'),
                  i18nMgr.Get('UITexasInfo_allhands'),
                  i18nMgr.Get('UITexasInfo_poolwin'),
                  i18nMgr.Get('UIPlayerInfo_TablePoolRate')
              ];
        for (let i = 0; i < this._dataLabels.length; i++) {
            const item = this._dataLabels[i];
            item.node.active = i < descs.length;
            if (item.des) item.des.string = descs[i] || '';
            if (item.num) item.num.string = isMTT ? '0' : '-';
        }
    }

    private _refreshDataPanel(data: HttpStatsOtherUserStats.Data): void {
        if (this._roomData?.basicInfo?.isMtt) {
            this._refreshMTTData(data);
        } else {
            this._refreshRegularData(data);
        }
        this._refreshAllInPanel(data);
    }

    private _refreshMTTData(data: HttpStatsOtherUserStats.Data): void {
        const mtt = data.mtt_room_data;
        if (!mtt) return;
        const items = [mtt.frist_times || 0, mtt.second_times || 0, mtt.third_times || 0, mtt.play_times || 0, mtt.win_times || 0];
        for (let i = 0; i < this._dataLabels.length; i++) {
            const item = this._dataLabels[i];
            item.node.active = i < items.length;
            if (item.num) item.num.string = `${items[i] || 0}`;
        }
    }

    private _refreshRegularData(data: HttpStatsOtherUserStats.Data): void {
        const roomStats = data.room_data;
        if (!roomStats) return;
        const items = [
            `${roomStats.total_game_cnt || 0}`,
            `${roomStats.vpip || 0}%`,
            `${roomStats.prf || 0}%`,
            `${roomStats.total_hand || 0}`,
            `${roomStats.wins || 0}%`,
            `${((data.pool_rate / 1000) * 100).toFixed(0)}%`
        ];
        for (let i = 0; i < this._dataLabels.length; i++) {
            const item = this._dataLabels[i];
            item.node.active = i < items.length;
            if (item.num) item.num.string = items[i] || '-';
        }
    }

    private _refreshAllInPanel(data: HttpStatsOtherUserStats.Data | null): void {
        const allIn = data?.allin_data;
        const items = [
            { count: allIn?.active_count || 0, profit: allIn?.active_profit_count || 0 },
            { count: allIn?.passive_count || 0, profit: allIn?.passive_profit_count || 0 },
            { count: allIn?.behind_count || 0, profit: allIn?.behind_profit_count || 0 },
            { count: allIn?.ahead_count || 0, profit: allIn?.ahead_profit_count || 0 }
        ];
        const percents: number[] = [];
        for (let i = 0; i < this._allInLabels.length; i++) {
            const item = items[i];
            const pct = item.count > 0 ? Math.trunc((item.profit / item.count) * 100) : 0;
            if (this._allInLabels[i].num) this._allInLabels[i].num.string = `${pct}%`;
            percents.push(pct / 100);
        }
        this._drawRadarChart(percents);
    }

    private _drawRadarChart(percents: number[]): void {
        if (!this._radarGfx) return;
        const gfx = this._radarGfx;
        const r = this._radarSize;
        const drawOrder = [0, 2, 3, 1];
        const angles = [90, 0, 270, 180];
        const axisPoints = angles.map(angle => {
            const rad = (angle * Math.PI) / 180;
            return cc.v2(Math.cos(rad) * r, Math.sin(rad) * r);
        });
        gfx.clear();
        gfx.strokeColor = cc.Color.WHITE;
        for (let g = 1; g <= 4; g++) {
            const scale = g / 4;
            gfx.lineWidth = g === 4 ? 6 : 3;
            gfx.moveTo(axisPoints[0].x * scale, axisPoints[0].y * scale);
            for (let i = 1; i < axisPoints.length; i++) gfx.lineTo(axisPoints[i].x * scale, axisPoints[i].y * scale);
            gfx.close();
            gfx.stroke();
        }
        gfx.lineWidth = 3;
        axisPoints.forEach(point => {
            gfx.moveTo(0, 0);
            gfx.lineTo(point.x, point.y);
            gfx.stroke();
        });
        const dataPoints = axisPoints.map((point, index) => cc.v2(point.x * (percents[drawOrder[index]] || 0), point.y * (percents[drawOrder[index]] || 0)));
        gfx.fillColor = new cc.Color(200, 200, 200, 160);
        gfx.moveTo(dataPoints[0].x, dataPoints[0].y);
        for (let i = 1; i < dataPoints.length; i++) gfx.lineTo(dataPoints[i].x, dataPoints[i].y);
        gfx.close();
        gfx.fill();
        gfx.strokeColor = cc.Color.WHITE;
        gfx.lineWidth = 6;
        gfx.moveTo(dataPoints[0].x, dataPoints[0].y);
        for (let i = 1; i < dataPoints.length; i++) gfx.lineTo(dataPoints[i].x, dataPoints[i].y);
        gfx.close();
        gfx.stroke();
        gfx.fillColor = new cc.Color(114, 135, 255, 255);
        dataPoints.forEach(point => {
            gfx.circle(point.x, point.y, 3);
            gfx.fill();
        });
    }

    private _refreshOpButtons(): void {
        const basic = this._roomData.basicInfo;
        const mine = this._roomData.mine;
        this._setButtonActive('StandUpBtn', !this._isSelf && mine.isRoomManager && mine.canAdminStandUp);
        this._setButtonActive('DissolveBtn', !this._isSelf && mine.isRoomManager && mine.canAdminLeave);
        this._setButtonActive('CreditBtn', !this._isSelf && mine.isRoomManager && basic.originType === RoomOriginType.CLUB && basic.goldType === 3);
        this._setButtonActive('chatCloseToggle', !this._isSelf && mine.isRoomManager);
        this._setButtonActive(
            'audioCloseToggle',
            !this._isSelf && (basic.antiCheatType === AntiCheatType.AUDIO || basic.antiCheatType === AntiCheatType.VIDEO)
        );
        this._setButtonActive('videoCloseToggle', !this._isSelf && basic.antiCheatType === AntiCheatType.VIDEO);
        // this._setButtonActive('shieldToggle', !this._isSelf && basic.antiCheatType < AntiCheatType.FACE_VERIFY && basic.chatType !== ChatType.CLOSE);
        // this._setButtonActive('ReportBtn', !this._isSelf);
        this.opButtonNode.active = this.opButtonNode.children.some(node => node.active);
        this._refreshDialogLayout();
    }

    private async _loadMuteState(): Promise<void> {
        if (!this._roomData.mine.isRoomManager) return;
        try {
            this._isChatMuted = await PlayerStoreUtils.getMuteState(this._roomData, this._requestRID);
            if (this._isCurrentRequest(this._requestRID)) this._refreshToggleVisual('chatCloseToggle', this._isChatMuted);
        } catch (error) {
            cc.warn('[UIPlayerInfo] load mute state failed', error);
        }
    }

    private _loadAudioVideoState(): void {
        const agora = agoraManager;
        if (!agora.isJoined) {
            this._hasAudioTrack = false;
            this._hasVideoTrack = false;
            this._updateAudioVideoVisuals();
            return;
        }
        const remote = agora.getRemoteUserMap().get(this._requestRID);
        this._hasAudioTrack = !!remote?.hasAudio || UIPlayerInfo.audioClosedUsers.has(this._requestRID);
        this._hasVideoTrack = !!remote?.hasVideo || UIPlayerInfo.videoClosedUsers.has(this._requestRID);
        this._isAudioClosed = UIPlayerInfo.audioClosedUsers.has(this._requestRID);
        this._isVideoClosed = UIPlayerInfo.videoClosedUsers.has(this._requestRID);
        this._updateAudioVideoVisuals();
    }

    private _updateAudioVideoVisuals(): void {
        this._updateMediaButton('audioCloseToggle', this._hasAudioTrack, this._isAudioClosed, '打开音频', '关闭音频');
        this._updateMediaButton('videoCloseToggle', this._hasVideoTrack, this._isVideoClosed, '打开视频', '关闭视频');
    }

    private _updateMediaButton(name: string, hasTrack: boolean, closed: boolean, openText: string, closeText: string): void {
        const node = this.opButtonNode.getChildByName(name);
        node.opacity = hasTrack ? 255 : 128;
        this._setToggleBg(node, hasTrack && closed);
        this._setNodeLabelString(node, closed ? openText : closeText);
    }

    private async _loadDiamondBalance(): Promise<void> {
        this._refreshDiamondBalance();
    }

    private _refreshDiamondBalance(): void {
        const label = this.diamondNumNode.getComponent(cc.Label);
        label.string = userStore.diamonds.toLocaleString('en-US');
    }

    private _refreshDiamondNotice(): void {
        if (!this._diamondConfig) {
            this._noticeLabel.string = '';
            return;
        }
        const remaining = Math.max(0, this._diamondConfig.limit_time_pre_day - this._diamondSentCount);
        const text = i18nMgr.Get('GiftDiamondsTips');
        this._noticeLabel.string = text.replace('{0}', `${remaining}`).replace('{1}', `${this._diamondConfig.fee_rate}%`);
    }

    private _refreshPropList(list: UserPropData[]): void {
        const propList = list.filter(item => item.propType === GameplayChatPropType.THROW_PROP);
        this._propListData.clear();
        UIPlayerInfo.PROP_DEFINITIONS.forEach((definition, index) => {
            const data = propList.find(item => item.propCode === definition.propCode) || null;
            const propNode = this.propOpNode.getChildByName('$propOp_' + (index + 1));
            propNode.active = !!data;
            if (!data) return;
            this._propListData.set(definition.type, data);
            const diamondCost = propNode.getChildByName('diamondCost');
            diamondCost.active = !userStore.isPropFree(data);
            diamondCost.getChildByName('costNum').getComponent(cc.Label).string = `${data.payPrice}`;
        });
    }

    private _clickEditNote(): void {
        this.playerNoteNode.active = false;
        this.noteBtn.active = false;
        this.noteEditBox.node.active = true;
        this.noteEditBox.string = this._currentRemark;
        this.noteEditBox.focus();
    }

    private _onNoteEditEnded(editBox: cc.EditBox): void {
        editBox.node.active = false;
        this.playerNoteNode.active = true;
        this.noteBtn.active = true;
        const text = editBox.string.trim();
        if (text === this._currentRemark) return;
        this._saveUserRemark(text);
    }

    private async _saveUserRemark(text: string): Promise<void> {
        const rid = this._requestRID;
        const targetUserID = this._dbUserID || rid;
        try {
            const res = await PlayerStoreUtils.saveRemark(this._roomData, targetUserID, text);
            if (!this._isCurrentRequest(rid)) return;
            if (res.code === 0) {
                this._currentRemark = text;
                playerStore.updateRemark(rid, text);
                this.playerNoteLabel.string = text || i18nMgr.Get('UIUserRemarks_7S612w03');
                viewManager.showToast('备注修改成功');
                return;
            }
            viewManager.showToast(res.message || '备注修改失败');
        } catch (error) {
            if (this._isCurrentRequest(rid)) viewManager.showToast('备注修改失败');
        }
        this.playerNoteLabel.string = this._currentRemark || i18nMgr.Get('UIUserRemarks_7S612w03');
    }

    private _clickStandUp(): void {
        this._confirmAndRun(i18nMgr.Get('UITexasRoomManagerOpTips7') || '确认让该玩家站起？', () => PlayerStoreUtils.standUp(this._roomData, this._requestRID));
    }

    private _clickLeave(): void {
        this._confirmAndRun(i18nMgr.Get('UITexasRoomManagerOpTips8') || '确认踢出该玩家？', () => PlayerStoreUtils.leaveRoom(this._roomData, this._requestRID));
    }

    private _clickCredit(): void {
        viewManager.showToast('当前版本暂未接入发放额度面板');
    }

    private async _confirmAndRun(content: string, action: () => Promise<WebResponseDataBase>): Promise<void> {
        const name = this._player.name || '';
        viewManager.openDialog('ConfirmOrNotice', {
            content: content.replace('{0}', name),
            diaolgType: UIComfirmDialogType.CONFIRM,
            commit_click: async () => {
                const res = await action();
                if (res.code === 0) {
                    this.close();
                    return;
                }
                viewManager.showToast(res.message || CPErrorCode.ServerErrorDescription(res.code) || '操作失败');
            }
        });
    }

    private async _clickChatClose(): Promise<void> {
        if (!this._roomData.mine.isRoomManager) return;
        if (!this._roomData.basicInfo.clubID && !this._roomData.basicInfo.tribeID) {
            viewManager.showToast('当前房间不支持禁言操作');
            return;
        }
        const next = !this._isChatMuted;
        this._isChatMuted = next;
        this._refreshToggleVisual('chatCloseToggle', next);
        try {
            const res = await PlayerStoreUtils.setMuteState(this._roomData, this._requestRID, next);
            if (res.code !== 0) throw new Error(res.message || '禁言失败');
        } catch (error) {
            this._isChatMuted = !next;
            this._refreshToggleVisual('chatCloseToggle', this._isChatMuted);
            viewManager.showToast((error as Error).message || '禁言失败');
        }
    }

    private _clickShield(): void {
        this._isShielded = !this._isShielded;
        if (this._isShielded) {
            UIPlayerInfo.shieldUsers.add(this._requestRID);
        } else {
            UIPlayerInfo.shieldUsers.delete(this._requestRID);
        }
        this._refreshToggleVisual('shieldToggle', this._isShielded);
    }

    private async _clickSendDiamond(amount: number, clickNode: cc.Node): Promise<void> {
        if (!this._canGiftDiamond()) return;
        if (this._diamondConfig && this._diamondSentCount >= this._diamondConfig.limit_time_pre_day) {
            viewManager.showToast(i18nMgr.Get('GiftDiamondError') || '赠送失败');
            return;
        }
        this._playClickScale(clickNode, false);
        try {
            const res = await PlayerStoreUtils.sendDiamond(this._requestRID, amount, this._roomData.roomID);
            if (res.code === 0) {
                this._diamondSentCount++;
                this._refreshDiamondNotice();
                this._loadDiamondBalance();
                this.close();
                this._roomData.seatsStateManager.diamondGiftEvent({
                    senderID: userStore.userRID,
                    receiverID: this._requestRID,
                    amount
                });
                return;
            }
            if (res.code === 20124) {
                this._diamondSentCount = this._diamondConfig?.limit_time_pre_day || 999;
                this._refreshDiamondNotice();
            }
            viewManager.showToast(res.message || i18nMgr.Get('GiftDiamondError') || '赠送失败');
        } catch (error) {
            viewManager.showToast(i18nMgr.Get('GiftDiamondError') || '赠送失败');
        }
    }

    private _canGiftDiamond(): boolean {
        return !this._isSelf && !!this._requestRID && !!this._roomData?.mine?.seatNo;
    }

    private _clickAudioClose(): void {
        if (!this._hasAudioTrack) return;
        this._isAudioClosed = !this._isAudioClosed;
        TexasVideoMediaHelper.setRemoteAudioStatus(this._roomData, !this._isAudioClosed, this._requestRID);
        this._setSetMember(UIPlayerInfo.audioClosedUsers, this._requestRID, this._isAudioClosed);
        this._updateAudioVideoVisuals();
    }

    private _clickVideoClose(): void {
        if (!this._hasVideoTrack) return;
        this._isVideoClosed = !this._isVideoClosed;
        TexasVideoMediaHelper.setRemoteVideoStatus(this._roomData, !this._isVideoClosed, this._requestRID);
        this._setSetMember(UIPlayerInfo.videoClosedUsers, this._requestRID, this._isVideoClosed);
        this._updateAudioVideoVisuals();
    }

    private _clickProp(definition: ThrowPropDefinition, clickNode: cc.Node): void {
        this._playClickScale(clickNode, true);
        const propData = this._propListData.get(definition.type);
        const consume = (userStore.isPropFree(propData) ? Def.ConsumeType.CT_NONE : propData.priceID) as ClientMessageBroadcastMsg.AsObject['consume'];
        this._roomData.seatsStateManager.setPendingThrowProp({
            type: definition.type,
            userID: userStore.userRID,
            targetUserID: this._requestRID
        });
        const inner = JSON.stringify({
            name: userStore.name,
            target_user_id: this._requestRID,
            user_id: userStore.userRID,
            type: definition.type
        });
        const extra = JSON.stringify({ code: BroadcastCode.BroadcastMsg, data: inner });
        const body: ClientMessageBroadcastMsg.AsObject = {
            room: {
                roomId: this._roomData.roomID,
                matchId: this._roomData.matchID
            },
            consume,
            message: '',
            extra: this._stringToBytes(extra),
            msgType: this._getThrowPropMsgType()
        };
        ProtocolAgency.Send({
            code: Code.MSG_D_BROADCAST_MSG,
            roomID: this._roomData.roomID,
            matchID: this._roomData.matchID,
            body: body
        });
        if (propData.propAmount > 0) {
            UserStoreUtils.consumeUserProp(propData.gamePropID).catch(error => cc.warn('[UIPlayerInfo] consume user prop failed', error));
        }
    }

    private _getThrowPropMsgType(): Def.BroadcastMsgTypeMap[keyof Def.BroadcastMsgTypeMap] {
        return Def.BroadcastMsgType.BC_MSG_THROW;
    }

    private _clickReport(): void {
        viewManager.openDialog('PlayerReport', {
            roomID: this._roomData.roomID,
            matchID: this._roomData.matchID,
            userRID: this._requestRID,
            randomNum: this._requestRID,
            sendName: this._player.name || '',
            type: 1
        });
    }

    private _refreshToggleVisual(name: string, isOn: boolean): void {
        const node = this.opButtonNode.getChildByName(name);
        if (name === 'chatCloseToggle' || name === 'shieldToggle') {
            const isMute = name === 'chatCloseToggle';
            this._setNodeLabelString(node, isOn ? (isMute ? '取消禁言' : '取消屏蔽') : isMute ? '禁言' : '屏蔽名字');
            this._setToggleBg(node, isOn);
            return;
        }
        node.opacity = isOn ? 255 : 150;
    }

    private _setToggleBg(node: cc.Node, isOn: boolean): void {
        const bg = node.getChildByName('background') || node;
        const sprite = bg.getComponent(cc.Sprite);
        if (!sprite) return;
        const anySprite = sprite as any;
        if (isOn && this.toggleOnBg) {
            if (!anySprite._playerInfoOrigFrame) anySprite._playerInfoOrigFrame = sprite.spriteFrame;
            sprite.spriteFrame = this.toggleOnBg;
            sprite.type = cc.Sprite.Type.SLICED;
        } else if (anySprite._playerInfoOrigFrame) {
            sprite.spriteFrame = anySprite._playerInfoOrigFrame;
            anySprite._playerInfoOrigFrame = null;
        }
    }

    private _playClickScale(node: cc.Node, closeAfter: boolean): void {
        if (!node || !node.isValid) return;
        const scale = node.scale;
        cc.tween(node)
            .to(0.075, { scale: scale * 1.2 })
            .to(0.075, { scale })
            .call(() => {
                if (closeAfter) this.close();
            })
            .start();
    }

    private _loadRemoteSprite(node: cc.Node, url: string): void {
        const sprite = node.getComponent(cc.Sprite);
        if (!url) return;
        const requestURL = url;
        (node as any)._playerInfoRemoteURL = requestURL;
        cc.assetManager.loadRemote(requestURL, { ext: '.png' }, (err, texture: cc.Texture2D) => {
            if (err || !cc.isValid(node) || (node as any)._playerInfoRemoteURL !== requestURL) return;
            if (texture) texture.packable = false;
            sprite.spriteFrame = new cc.SpriteFrame(texture);
        });
    }

    private _bindOpButton(name: string, handler: () => void): void {
        this._bindClick(this.opButtonNode.getChildByName(name), handler);
    }

    private _bindClick(node: cc.Node, handler: () => void): void {
        if (!node.getComponent(cc.Button)) {
            const button = node.addComponent(cc.Button);
            button.transition = cc.Button.Transition.NONE;
        }
        node.on('click', handler, this);
    }

    private _setButtonActive(name: string, active: boolean): void {
        const node = this.opButtonNode.getChildByName(name);
        node.active = active;
    }

    private _setNodeLabelString(node: cc.Node, text: string): void {
        const label = node.getComponent(cc.Label) || node.getComponentInChildren(cc.Label);
        if (label) label.string = text;
    }

    private _setSetMember(set: Set<number>, value: number, included: boolean): void {
        if (included) {
            set.add(value);
        } else {
            set.delete(value);
        }
    }

    private _isCurrentRequest(rid: number): boolean {
        return cc.isValid(this.node) && this.node.activeInHierarchy && this._requestRID === rid;
    }

    private _stringToBytes(str: string): Uint8Array {
        const encoded = unescape(encodeURIComponent(str));
        const bytes = new Uint8Array(encoded.length);
        for (let i = 0; i < encoded.length; i++) bytes[i] = encoded.charCodeAt(i);
        return bytes;
    }
}
