import { Code, Def } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataPlayer from '../../../data/room/texas/TexasGameRoomDataPlayer';
import userStore from '../../../data/user/UserStore';
import { AntiCheatType } from '../../../game/constant/AntiCheatType';
import { ChatType } from '../../../game/constant/ChatType';
import { RoomOriginType } from '../../../game/constant/RoomOriginType';
import { StringHelper } from '../../../helper/StringHelper';
import { i18nMgr } from '../../../i18n/i18nMgr';
import { CPErrorCode } from '../../../i18n/CPErrorCode';
import AgoraManager from '../../../net/agora/AgoraManager';
import ProtocolAgency from '../../../net/websocket/ProtocolAgency';
import UIComponentBaseDialog from '../../base/UIComponentDialogBase';
import { UIComfirmDialogType } from '../confirm/UIConfirmDialog';
import viewManager from '../../UIViewManager';
import PlayerInfoProvider, { PlayerInfoBasicData, PlayerInfoDiamondConfig, PlayerInfoPropData } from './PlayerInfoProvider';

const { ccclass, menu, property } = cc._decorator;
const VIEW_MANAGER_MASK_NODE = 'ithinktisinotshouldbedupilcatednodename';

export interface PlayerInfoPermissions {
    isRoomManager?: boolean;
    canStandUp?: boolean;
    canLeave?: boolean;
    canCredit?: boolean;
    canMute?: boolean;
}

export interface UIPlayerInfoParam {
    roomID: number;
    matchID: number;
    player: TexasGameRoomDataPlayer;
    permissions?: PlayerInfoPermissions;
    diamondConfig?: PlayerInfoDiamondConfig;
}

interface DataLabelItem {
    node: cc.Node;
    des: cc.Label;
    num: cc.Label;
}

@ccclass
@menu('CrazyPoker/Texas/Dialog/UIPlayerInfo')
export default class UIPlayerInfo extends UIComponentBaseDialog<UIPlayerInfoParam> {
    @property(cc.SpriteFrame)
    public toggleOnBg: cc.SpriteFrame = null;

    private static readonly PROP_TYPE_BASE = Def.ConsumeType.CT_EMOJI_2 * 100;
    private static readonly PROP_TYPE_MAP: number[] = [602, 609, 608, 605, 600, 610, 611, 603, 604, 607, 601, 606];
    private static readonly shieldUsers: Set<number> = new Set();
    private static readonly savedRemarks: Map<number, string> = new Map();
    private static readonly audioClosedUsers: Set<number> = new Set();
    private static readonly videoClosedUsers: Set<number> = new Set();

    private _param: UIPlayerInfoParam = null;
    private _roomData: TexasGameRoomData = null;
    private _player: TexasGameRoomDataPlayer = null;
    private _permissions: PlayerInfoPermissions = {};
    private _isSelf = false;
    private _dbUserID = 0;
    private _currentRemark = '';
    private _tabIndex = 0;
    private _requestRID = 0;

    private _panelClick: cc.Node = null;
    private _dialogNode: cc.Node = null;
    private _headImgIcon: cc.Node = null;
    private _nickNameLabel: cc.Label = null;
    private _maleNode: cc.Node = null;
    private _femaleNode: cc.Node = null;
    private _playerIDLabel: cc.Label = null;
    private _playerNoteNode: cc.Node = null;
    private _playerNoteLabel: cc.Label = null;
    private _noteEditBox: cc.EditBox = null;
    private _noteBtn: cc.Node = null;
    private _opButtonNode: cc.Node = null;
    private _propOpNode: cc.Node = null;
    private _diamondShowNode: cc.Node = null;
    private _diamondNumNode: cc.Node = null;
    private _dataTabNode: cc.Node = null;
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
    private _diamondConfig: PlayerInfoDiamondConfig = null;
    private _diamondSentCount = 0;
    private _isChatMuted = false;
    private _isShielded = false;
    private _hasAudioTrack = false;
    private _hasVideoTrack = false;
    private _isAudioClosed = false;
    private _isVideoClosed = false;
    private _propListData: PlayerInfoPropData[] = [];

    public initialize(param: UIPlayerInfoParam): void {
        this._param = param;
        this._roomData = roomDataManager.getRoomData<TexasGameRoomData>(param.roomID, param.matchID);
        this._player = param.player;
        this._permissions = param.permissions || {};
        this._diamondConfig = param.diamondConfig || null;
        this._diamondSentCount = param.diamondConfig?.sentCount || 0;
        this._requestRID = this._player?.userID || 0;
        this._isSelf = this._requestRID === userStore.userRID || this._requestRID === userStore.userID;
        this._applyTargetLayout();
        this._resetView();
        this._refreshBasicInfo({
            nick_name: this._player?.name || '',
            avatar: this._player?.avatar || '',
            random_num: this._requestRID
        });
        this._refreshSelfState();
        this._refreshOpButtons();
        this._switchTab(0);
        this._loadAsyncData();
    }

    protected onLoad(): void {
        this._cacheNodes();
        this._bindStaticEvents();
        this._initTabs();
        this._initDataNodes();
        this._initAllInNodes();
        this._initDiamondNodes();
        this._initPropNodes();
        if (this._param) this.initialize(this._param);
    }

    protected onDestroy(): void {
        this.node.targetOff(this);
        this._dialogNode?.targetOff(this);
        this._tabNodes.forEach(node => node?.targetOff(this));
        this._diamondNodes.forEach(item => item.node?.targetOff(this));
        this._propOpNode?.children.forEach(node => node.targetOff(this));
        this._noteEditBox?.node.targetOff(this);
    }

    private _cacheNodes(): void {
        this._panelClick = this._findNode('$panel_click');
        this._dialogNode = this._findNode('PlayerInfoDlg');
        this._headImgIcon = this._findNode('$HeadImgIcon');
        this._nickNameLabel = this._findNode('cc_Label$NickName')?.getComponent(cc.Label);
        const nickNode = this._findNode('$nickNameNode');
        this._maleNode = nickNode?.getChildByName('male');
        this._femaleNode = nickNode?.getChildByName('female');
        this._playerIDLabel = this._findNode('playerid')?.getComponent(cc.Label);
        const noteNode = this._findNode('noteNode');
        this._noteBtn = noteNode?.getChildByName('noteBtn');
        this._playerNoteNode = noteNode?.getChildByName('playerNote');
        this._playerNoteLabel = this._playerNoteNode?.getComponent(cc.Label);
        this._noteEditBox = noteNode?.getChildByName('noteEditBox')?.getComponent(cc.EditBox);
        this._opButtonNode = this._findNode('$OpButtonNode');
        this._propOpNode = this._findNode('$PropOpNode');
        this._diamondShowNode = this._findNode('$DiamondShow');
        this._diamondNumNode = this._findNode('$diamondNum');
        this._dataTabNode = this._findNode('$dataTabNode');
    }

    private _bindStaticEvents(): void {
        this._bindClick(this._panelClick, this.close);
        if (this._dialogNode) {
            this._dialogNode.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => event.stopPropagation(), this);
            this._dialogNode.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => event.stopPropagation(), this);
        }
        this._bindClick(this._noteBtn, this._clickEditNote);
        this._bindClick(this._playerNoteNode, this._clickEditNote);
        this._noteEditBox?.node.on('editing-did-ended', this._onNoteEditEnded, this);
        this._bindOpButton('StandUpBtn', this._clickStandUp);
        this._bindOpButton('DissolveBtn', this._clickLeave);
        this._bindOpButton('CreditBtn', this._clickCredit);
        this._bindOpButton('chatCloseToggle', this._clickChatClose);
        this._bindOpButton('audioCloseToggle', this._clickAudioClose);
        this._bindOpButton('videoCloseToggle', this._clickVideoClose);
        this._bindOpButton('shieldToggle', this._clickShield);
        this._bindOpButton('ReportBtn', this._clickReport);
    }

    private _resetView(): void {
        if (this._noteEditBox) this._noteEditBox.node.active = false;
        if (this._playerNoteNode) this._playerNoteNode.active = true;
        if (this._noteBtn) this._noteBtn.active = true;
        this._refreshDataDescriptions();
        this._refreshAllInPanel(null);
        this._isChatMuted = false;
        this._hasAudioTrack = false;
        this._hasVideoTrack = false;
        this._isAudioClosed = UIPlayerInfo.audioClosedUsers.has(this._requestRID);
        this._isVideoClosed = UIPlayerInfo.videoClosedUsers.has(this._requestRID);
        this._refreshToggleVisual('chatCloseToggle', false);
        this._refreshToggleVisual('shieldToggle', UIPlayerInfo.shieldUsers.has(this._requestRID));
        this._refreshDiamondNotice();
    }

    private async _loadAsyncData(): Promise<void> {
        const rid = this._requestRID;
        if (!this._roomData || !rid) return;
        if (!this._isSelf) {
            this._loadMuteState();
            this._loadAudioVideoState();
            this._loadDiamondBalance();
        }
        try {
            const data = await PlayerInfoProvider.getBasicInfo(rid);
            if (!this._isCurrentRequest(rid) || !data) return;
            this._refreshBasicInfo(data);
            const statsRID = data.random_num || data.un_id || rid;
            const stats = await PlayerInfoProvider.getStats(this._roomData, statsRID);
            if (this._isCurrentRequest(rid) && stats) this._refreshDataPanel(stats);
        } catch (error) {
            cc.warn('[UIPlayerInfo] load player info failed', error);
        }
    }

    private _refreshBasicInfo(data: PlayerInfoBasicData): void {
        const rid = data.random_num || data.un_id || this._requestRID;
        if (data.avatar) this._loadRemoteSprite(this._headImgIcon, data.avatar);
        if (this._nickNameLabel) {
            this._nickNameLabel.string = StringHelper.LengthNick(data.nick_name || data.nickname || this._player?.name || '', 16);
        }
        if (this._maleNode) this._maleNode.active = data.sex !== 1;
        if (this._femaleNode) this._femaleNode.active = data.sex === 1;
        if (this._playerIDLabel) this._playerIDLabel.string = `${rid || ''}`;
        if (data.user_id) this._dbUserID = data.user_id;
        let remark = UIPlayerInfo.savedRemarks.get(rid);
        if (remark === undefined) remark = data.remark_name || '';
        this._currentRemark = remark;
        if (this._playerNoteLabel) this._playerNoteLabel.string = remark || '点击添加备注';
    }

    private _refreshSelfState(): void {
        if (this._propOpNode) this._propOpNode.active = false;
        if (this._diamondShowNode) this._diamondShowNode.active = !this._isSelf;
        if (this._tabNodes[2]) this._tabNodes[2].active = false;
    }

    private _initTabs(): void {
        const tabNode = this._dataTabNode?.getChildByName('tabNode');
        if (!tabNode) return;
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
            const width = node?.width || 100;
            gfx.moveTo(-width / 2, 0);
            gfx.lineTo(width / 2, 0);
            gfx.stroke();
            underline.y = -40;
            underline.active = false;
            node?.addChild(underline);
            this._underlineNodes.push(underline);
        }
        this._contentNodes = [
            this._dataTabNode.getChildByName('dataNode'),
            this._dataTabNode.getChildByName('allInNode'),
            this._dataTabNode.getChildByName('diamondNode')
        ];
    }

    private _switchTab(index: number): void {
        if ((this._isSelf || !this._tabNodes[2]?.active) && index === 2) index = 0;
        this._tabIndex = index;
        for (let i = 0; i < this._underlineNodes.length; i++) {
            if (this._underlineNodes[i]) this._underlineNodes[i].active = i === index;
        }
        for (let i = 0; i < this._contentNodes.length; i++) {
            if (this._contentNodes[i]) this._contentNodes[i].active = i === index;
        }
    }

    private _initDataNodes(): void {
        const dataNode = this._dataTabNode?.getChildByName('dataNode');
        if (!dataNode) return;
        this._dataLabels = [];
        for (let i = 1; i <= 6; i++) {
            const node = dataNode.getChildByName('LabelNode' + i);
            if (!node) continue;
            this._dataLabels.push({
                node,
                des: node.getChildByName('dataDes')?.getComponent(cc.Label),
                num: node.getChildByName('dataNum')?.getComponent(cc.Label)
            });
        }
    }

    private _initAllInNodes(): void {
        const allInNode = this._dataTabNode?.getChildByName('allInNode');
        if (!allInNode) return;
        const labelNames = ['LabelPositive', 'LabelPassive', 'LabelBehind', 'LabelLeading'];
        this._allInLabels = [];
        labelNames.forEach(name => {
            const node = allInNode.getChildByName(name);
            if (!node) return;
            this._allInLabels.push({
                node,
                des: node.getChildByName('des')?.getComponent(cc.Label),
                num: node.getChildByName('num')?.getComponent(cc.Label)
            });
        });
        this._radarNode = allInNode.getChildByName('radarChartNode');
        if (this._radarNode) {
            this._radarGfx = this._radarNode.getComponent(cc.Graphics) || this._radarNode.addComponent(cc.Graphics);
            this._radarSize = (Math.min(this._radarNode.width, this._radarNode.height) / 2) * 0.85 || 80;
        }
    }

    private _initDiamondNodes(): void {
        const diamondNode = this._dataTabNode?.getChildByName('diamondNode');
        if (!diamondNode) return;
        this._noticeLabel = diamondNode.getChildByName('notice')?.getComponent(cc.Label);
        this._diamondNodes = [];
        diamondNode.children.forEach(node => {
            const match = node.name.match(/^diamond(\d+)$/);
            if (!match) return;
            const amount = parseInt(match[1], 10);
            const label = node.getChildByName('diamondNum')?.getComponent(cc.Label);
            if (label) label.string = `${amount}`;
            this._bindClick(node, () => this._clickSendDiamond(amount, node));
            this._diamondNodes.push({ node, amount });
        });
    }

    private _initPropNodes(): void {
        if (!this._propOpNode) return;
        for (let i = 1; i <= 12; i++) {
            const node = this._propOpNode.getChildByName('$propOp_' + i);
            if (!node) continue;
            this._bindClick(node, () => this._clickProp(i, node));
        }
        this._loadPropList();
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
        if (this._panelClick) {
            this._panelClick.setPosition(0, 0);
            this._panelClick.setContentSize(1242, 2688);
            this._panelClick.opacity = 0;
        }
        this._disableLayout(this._dialogNode);
        this._disableLayout(this._opButtonNode);
        this._disableLayout(this._dataTabNode);

        if (this._dialogNode) {
            this._dialogNode.setPosition(0, 0);
            this._dialogNode.setContentSize(1088, 1600);
            this._dialogNode.opacity = 255;
        }
        this._findNode('$HeadImgNode')?.setPosition(0, 610);
        if (this._opButtonNode) {
            this._opButtonNode.setPosition(0, 350);
            this._opButtonNode.setContentSize(1000, 120);
        }
        this._opButtonNode?.getChildByName('shieldToggle')?.setPosition(-250, 0);
        this._opButtonNode?.getChildByName('ReportBtn')?.setPosition(250, 0);
        if (this._dataTabNode) {
            this._dataTabNode.setPosition(0, -180);
            this._dataTabNode.setContentSize(1000, 760);
        }
        this._dataTabNode?.getChildByName('tabNode')?.setPosition(0, 310);
        this._dataTabNode?.getChildByName('dataNode')?.setPosition(0, -80);
        this._dataTabNode?.getChildByName('allInNode')?.setPosition(0, -80);
        this._dataTabNode?.getChildByName('diamondNode')?.setPosition(0, -80);
        this._dataTabNode?.getChildByName('tabNode')?.getChildByName('Data')?.setPosition(-340, 0);
        this._dataTabNode?.getChildByName('tabNode')?.getChildByName('allIn')?.setPosition(-90, 0);
        this._dataTabNode?.getChildByName('tabNode')?.getChildByName('Gift')?.setPosition(260, 0);
        if (this._diamondShowNode) {
            this._diamondShowNode.setPosition(0, -720);
            this._diamondShowNode.active = !this._isSelf;
        }
        if (this._propOpNode) {
            this._propOpNode.active = false;
        }
    }

    private _disableLayout(node: cc.Node): void {
        const layout = node?.getComponent(cc.Layout);
        if (layout) layout.enabled = false;
    }

    private _refreshDataDescriptions(): void {
        if (!this._dataLabels.length) return;
        const isMTT = !!this._roomData?.basicInfo?.isMtt;
        const descs = isMTT
            ? [
                  i18nMgr.Get('UIData_YGvXd5iXr_006') || '冠军',
                  i18nMgr.Get('UIData_YGvXd5iXr_007') || '亚军',
                  i18nMgr.Get('UIData_YGvXd5iXr_008') || '季军',
                  i18nMgr.Get('UIData_YGvXd5iXr_005') || '参赛',
                  i18nMgr.Get('UITexasInfo_wincount') || '获奖'
              ]
            : [
                  i18nMgr.Get('UITexasInfo_games') || '局数',
                  i18nMgr.Get('UITexasInfo_poolrate') || '入池率',
                  i18nMgr.Get('UITexasInfo_flop') || '翻前加注',
                  i18nMgr.Get('UITexasInfo_allhands') || '总手数',
                  i18nMgr.Get('UITexasInfo_poolwin') || '入池胜率',
                  i18nMgr.Get('UITexasInfo_loss') || '百手盈利'
              ];
        for (let i = 0; i < this._dataLabels.length; i++) {
            const item = this._dataLabels[i];
            item.node.active = i < descs.length;
            if (item.des) item.des.string = descs[i] || '';
            if (item.num) item.num.string = isMTT ? '0' : '-';
        }
    }

    private _refreshDataPanel(data: any): void {
        if (this._roomData?.basicInfo?.isMtt) {
            this._refreshMTTData(data);
        } else {
            this._refreshRegularData(data);
        }
        this._refreshAllInPanel(data);
    }

    private _refreshMTTData(data: any): void {
        let mtt = data?.mtt_room_data;
        if (Array.isArray(mtt)) mtt = mtt[0];
        if (!mtt) return;
        const items = [mtt.frist_times || 0, mtt.second_times || 0, mtt.third_times || 0, mtt.play_times || 0, mtt.win_times || 0];
        for (let i = 0; i < this._dataLabels.length; i++) {
            const item = this._dataLabels[i];
            item.node.active = i < items.length;
            if (item.num) item.num.string = `${items[i] || 0}`;
        }
    }

    private _refreshRegularData(data: any): void {
        let roomStats = data?.room_data;
        if (Array.isArray(roomStats)) {
            const gameType = this._roomData?.basicInfo?.gameType ?? 0;
            roomStats =
                roomStats.find((item: any) => item.game_type === gameType && item.data_type === 4) ||
                roomStats.find((item: any) => item.game_type === gameType) ||
                roomStats[0];
        }
        if (!roomStats) return;
        const items = [
            `${roomStats.total_game_cnt || 0}`,
            `${roomStats.vpip || 0}%`,
            `${roomStats.prf || 0}%`,
            `${roomStats.total_hand || 0}`,
            `${roomStats.wins || 0}%`,
            `${(roomStats.aveage_earn_hundred || 0) / 100}`
        ];
        for (let i = 0; i < this._dataLabels.length; i++) {
            const item = this._dataLabels[i];
            item.node.active = i < items.length;
            if (item.num) item.num.string = items[i] || '-';
        }
    }

    private _refreshAllInPanel(data: any): void {
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
        if (!this._opButtonNode || !this._roomData) return;
        const basic = this._roomData.basicInfo;
        const isManager = !!this._permissions.isRoomManager;
        this._setButtonActive('StandUpBtn', !this._isSelf && isManager && !!this._permissions.canStandUp);
        this._setButtonActive('DissolveBtn', !this._isSelf && isManager && !!this._permissions.canLeave);
        this._setButtonActive(
            'CreditBtn',
            !this._isSelf && isManager && !!this._permissions.canCredit && basic.originType === RoomOriginType.CLUB && basic.goldType === 3
        );
        this._setButtonActive('chatCloseToggle', !this._isSelf && isManager && !!this._permissions.canMute);
        this._setButtonActive('audioCloseToggle', !this._isSelf && (basic.antiCheatType === AntiCheatType.AUDIO || basic.antiCheatType === AntiCheatType.VIDEO));
        this._setButtonActive('videoCloseToggle', !this._isSelf && basic.antiCheatType === AntiCheatType.VIDEO);
        this._setButtonActive('shieldToggle', !this._isSelf && basic.antiCheatType < AntiCheatType.FACE_VERIFY && basic.chatType !== ChatType.CLOSE);
        this._setButtonActive('ReportBtn', !this._isSelf);
    }

    private async _loadMuteState(): Promise<void> {
        if (!this._permissions.canMute || !this._permissions.isRoomManager) return;
        try {
            this._isChatMuted = await PlayerInfoProvider.getMuteState(this._roomData, this._requestRID);
            if (this._isCurrentRequest(this._requestRID)) this._refreshToggleVisual('chatCloseToggle', this._isChatMuted);
        } catch (error) {
            cc.warn('[UIPlayerInfo] load mute state failed', error);
        }
    }

    private _loadAudioVideoState(): void {
        const agora = AgoraManager.Instance;
        if (!agora.isJoined) {
            this._hasAudioTrack = false;
            this._hasVideoTrack = false;
            this._updateAudioVideoVisuals();
            return;
        }
        const remote = agora.getRemoteUsers().find(item => item.uid === this._requestRID);
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
        const node = this._opButtonNode?.getChildByName(name);
        if (!node) return;
        node.opacity = hasTrack ? 255 : 128;
        this._setToggleBg(node, hasTrack && closed);
        this._setNodeLabelString(node, closed ? openText : closeText);
    }

    private async _loadDiamondBalance(): Promise<void> {
        const label = this._diamondNumNode?.getComponent(cc.Label);
        if (!label) return;
        try {
            const diamonds = await PlayerInfoProvider.getDiamondBalance();
            if (this._isCurrentRequest(this._requestRID)) label.string = diamonds.toLocaleString('en-US');
        } catch (error) {
            cc.warn('[UIPlayerInfo] load diamond balance failed', error);
        }
    }

    private _refreshDiamondNotice(): void {
        if (!this._noticeLabel) return;
        if (!this._diamondConfig) {
            this._noticeLabel.string = '';
            return;
        }
        const remaining = Math.max(0, this._diamondConfig.limit_time_pre_day - this._diamondSentCount);
        const text = i18nMgr.Get('GiftDiamondsTips') || '今日还可赠送 {0} 次，手续费 {1}';
        this._noticeLabel.string = text.replace('{0}', `${remaining}`).replace('{1}', `${this._diamondConfig.fee_rate}%`);
    }

    private async _loadPropList(): Promise<void> {
        try {
            this._propListData = await PlayerInfoProvider.getPropList();
            if (!this._propOpNode) return;
            this._propListData.forEach((item, index) => {
                const propNode = this._propOpNode.getChildByName('$propOp_' + (index + 1));
                const label = propNode ? cc.find('diamondCost/costNum', propNode)?.getComponent(cc.Label) : null;
                if (label && item.payPrice > 0) label.string = `${item.payPrice}`;
            });
        } catch (error) {
            cc.warn('[UIPlayerInfo] load prop list failed', error);
        }
    }

    private _clickEditNote(): void {
        if (!this._noteEditBox) return;
        if (this._playerNoteNode) this._playerNoteNode.active = false;
        if (this._noteBtn) this._noteBtn.active = false;
        this._noteEditBox.node.active = true;
        this._noteEditBox.string = this._currentRemark;
        this._noteEditBox.focus();
    }

    private _onNoteEditEnded(editBox: cc.EditBox): void {
        editBox.node.active = false;
        if (this._playerNoteNode) this._playerNoteNode.active = true;
        if (this._noteBtn) this._noteBtn.active = true;
        const text = editBox.string.trim();
        if (text === this._currentRemark) return;
        this._saveUserRemark(text);
    }

    private async _saveUserRemark(text: string): Promise<void> {
        const rid = this._requestRID;
        const targetUserID = this._dbUserID || rid;
        try {
            const res: any = await PlayerInfoProvider.saveRemark(this._roomData, targetUserID, text);
            if (!this._isCurrentRequest(rid)) return;
            if (res?.code === 0) {
                this._currentRemark = text;
                UIPlayerInfo.savedRemarks.set(rid, text);
                if (this._playerNoteLabel) this._playerNoteLabel.string = text || '点击添加备注';
                viewManager.showToast('备注修改成功');
                return;
            }
            viewManager.showToast(res?.message || '备注修改失败');
        } catch (error) {
            if (this._isCurrentRequest(rid)) viewManager.showToast('备注修改失败');
        }
        if (this._playerNoteLabel) this._playerNoteLabel.string = this._currentRemark || '点击添加备注';
    }

    private _clickStandUp(): void {
        this._confirmAndRun(i18nMgr.Get('UITexasRoomManagerOpTips7') || '确认让该玩家站起？', () => PlayerInfoProvider.standUp(this._roomData, this._requestRID));
    }

    private _clickLeave(): void {
        this._confirmAndRun(i18nMgr.Get('UITexasRoomManagerOpTips8') || '确认踢出该玩家？', () => PlayerInfoProvider.leaveRoom(this._roomData, this._requestRID));
    }

    private _clickCredit(): void {
        viewManager.showToast('当前版本暂未接入发放额度面板');
    }

    private async _confirmAndRun(content: string, action: () => Promise<any>): Promise<void> {
        const name = this._player?.name || '';
        viewManager.openDialog('ConfirmOrNotice', {
            content: content.replace('{0}', name),
            diaolgType: UIComfirmDialogType.CONFIRM,
            commit_click: async () => {
                const res: any = await action();
                if (res?.code === 0) {
                    this.close();
                    return;
                }
                viewManager.showToast(res?.message || CPErrorCode.ServerErrorDescription(res?.code) || '操作失败');
            }
        });
    }

    private async _clickChatClose(): Promise<void> {
        if (!this._permissions.isRoomManager || !this._permissions.canMute) return;
        if (!this._roomData.basicInfo.clubID && !this._roomData.basicInfo.tribeID) {
            viewManager.showToast('当前房间不支持禁言操作');
            return;
        }
        const next = !this._isChatMuted;
        this._isChatMuted = next;
        this._refreshToggleVisual('chatCloseToggle', next);
        try {
            const res: any = await PlayerInfoProvider.setMuteState(this._roomData, this._requestRID, next);
            if (res?.code !== 0) throw new Error(res?.message || '禁言失败');
        } catch (error: any) {
            this._isChatMuted = !next;
            this._refreshToggleVisual('chatCloseToggle', this._isChatMuted);
            viewManager.showToast(error?.message || '禁言失败');
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
        if (this._diamondConfig && this._diamondSentCount >= this._diamondConfig.limit_time_pre_day) {
            viewManager.showToast(i18nMgr.Get('GiftDiamondError') || '赠送失败');
            return;
        }
        this._playClickScale(clickNode, false);
        try {
            const res: any = await PlayerInfoProvider.sendDiamond(this._requestRID, amount);
            if (res?.code === 0) {
                this._diamondSentCount++;
                this._refreshDiamondNotice();
                this._loadDiamondBalance();
                return;
            }
            if (res?.code === 20124) {
                this._diamondSentCount = this._diamondConfig?.limit_time_pre_day || 999;
                this._refreshDiamondNotice();
            }
            viewManager.showToast(res?.message || i18nMgr.Get('GiftDiamondError') || '赠送失败');
        } catch (error) {
            viewManager.showToast(i18nMgr.Get('GiftDiamondError') || '赠送失败');
        }
    }

    private _clickAudioClose(): void {
        if (!this._hasAudioTrack) return;
        this._isAudioClosed = !this._isAudioClosed;
        AgoraManager.Instance.setRemoteAudioEnabled(!this._isAudioClosed, this._requestRID);
        this._setSetMember(UIPlayerInfo.audioClosedUsers, this._requestRID, this._isAudioClosed);
        this._updateAudioVideoVisuals();
    }

    private _clickVideoClose(): void {
        if (!this._hasVideoTrack) return;
        this._isVideoClosed = !this._isVideoClosed;
        AgoraManager.Instance.setRemoteVideoEnabled(!this._isVideoClosed, this._requestRID);
        this._setSetMember(UIPlayerInfo.videoClosedUsers, this._requestRID, this._isVideoClosed);
        this._updateAudioVideoVisuals();
    }

    private _clickProp(propIndex: number, clickNode: cc.Node): void {
        if (!this._roomData || !this._requestRID) return;
        this._playClickScale(clickNode, true);
        const consume = this._propListData[propIndex - 1]?.priceID || Def.ConsumeType.CT_EMOJI_2;
        const propType = UIPlayerInfo.PROP_TYPE_MAP[propIndex - 1] || UIPlayerInfo.PROP_TYPE_BASE;
        const inner = JSON.stringify({
            name: userStore.name,
            target_user_id: this._requestRID,
            user_id: userStore.userRID,
            type: propType,
            msgType: 1,
            time: Math.floor(Date.now() / 1000),
            headUrl: userStore.avatar
        });
        const extra = JSON.stringify({ code: 10001, data: inner });
        ProtocolAgency.Send({
            code: Code.MSG_D_BROADCAST_MSG,
            roomID: this._roomData.roomID,
            matchID: this._roomData.matchID,
            body: {
                room: {
                    roomId: this._roomData.roomID,
                    matchId: this._roomData.matchID
                },
                consume,
                message: '',
                extra: this._stringToBytes(extra),
                msgType: Def.BroadcastMsgType.BC_MSG_THROW
            } as any
        } as any);
    }

    private _clickReport(): void {
        if (!this._roomData || !this._requestRID) return;
        viewManager.openDialog('PlayerReport', {
            roomID: this._roomData.roomID,
            matchID: this._roomData.matchID,
            userRID: this._requestRID,
            randomNum: this._requestRID,
            sendName: this._player?.name || '',
            type: 1
        });
    }

    private _refreshToggleVisual(name: string, isOn: boolean): void {
        const node = this._opButtonNode?.getChildByName(name);
        if (!node) return;
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
        const sprite = node?.getComponent(cc.Sprite);
        if (!sprite || !url) return;
        const requestURL = url;
        (node as any)._playerInfoRemoteURL = requestURL;
        cc.assetManager.loadRemote(requestURL, { ext: '.png' }, (err, texture: cc.Texture2D) => {
            if (err || !cc.isValid(node) || (node as any)._playerInfoRemoteURL !== requestURL) return;
            if (texture) texture.packable = false;
            sprite.spriteFrame = new cc.SpriteFrame(texture);
        });
    }

    private _bindOpButton(name: string, handler: () => void): void {
        this._bindClick(this._opButtonNode?.getChildByName(name), handler);
    }

    private _bindClick(node: cc.Node, handler: () => void): void {
        if (!node) return;
        if (!node.getComponent(cc.Button)) {
            const button = node.addComponent(cc.Button);
            button.transition = cc.Button.Transition.NONE;
        }
        node.on('click', handler, this);
    }

    private _setButtonActive(name: string, active: boolean): void {
        const node = this._opButtonNode?.getChildByName(name);
        if (node) node.active = active;
    }

    private _setNodeLabelString(node: cc.Node, text: string): void {
        const label = node?.getComponent(cc.Label) || node?.getComponentInChildren(cc.Label);
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
        const bytes = new Uint8Array(str.length);
        for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
        return bytes;
    }

    private _findNode(name: string): cc.Node {
        return this._findNodeRecursive(this.node, name);
    }

    private _findNodeRecursive(root: cc.Node, name: string): cc.Node {
        if (!root) return null;
        if (root.name === name) return root;
        for (let i = 0; i < root.childrenCount; i++) {
            const child = this._findNodeRecursive(root.children[i], name);
            if (child) return child;
        }
        return null;
    }
}
