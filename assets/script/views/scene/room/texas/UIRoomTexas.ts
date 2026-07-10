import { traceClass, traceMethod } from '../../../../core/decorator/LogTrace';
import storageManager from '../../../../data/LocalStorage';
import roomDataManager from '../../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataPlayerMine from '../../../../data/room/texas/TexasGameRoomDataPlayerMine';
import { StringHelper } from '../../../../helper/StringHelper';
import { i18nMgr } from '../../../../i18n/i18nMgr';
import UIComponentBase from '../../../base/UIComponentBase';
import { UIGuideDialogType } from '../../../dialog/mushroomandcriticalhit/UIGuideDialog';
import viewManager from '../../../UIViewManager';
import TexasTableEvent from './events/TexasTableEvent';
import InsuranceOperation from './InsuranceOperation';
import MorePlayTypeInfo from './MorePlayTypeInfo';
import OtherBindings from './OtherBindings';
import PotsInfo from './PotsInfo';
import PublicCardsInfo from './PublicCardsInfo';
import RoomInfo from './RoomInfo';
import SeatManager from './SeatManager';
import UITexasMenu from './UITexasMenu';

export interface UIRoomTexasEnterParam {
    roomID: number;
    matchID: number;
}

const { ccclass, property, menu } = cc._decorator;

const ADAPTIVE_LIMIT_HEIGHT = 2400;

const ADAPTIVE_MAIN_HEIGHT = 2688;

@ccclass
@menu('Scene/Room/Texas/UIRoomTexas')
@traceClass()
export default class UIRoomTexas extends UIComponentBase<UIRoomTexasEnterParam> {
    @property(RoomInfo)
    private roomInfo: RoomInfo = null;
    @property(PotsInfo)
    private potsInfo: PotsInfo = null;
    @property(SeatManager)
    private seatManager: SeatManager = null;
    @property(PublicCardsInfo)
    private publicCardsInfo: PublicCardsInfo = null;
    @property(cc.Button)
    private sideMenu: cc.Button = null!;
    @property(cc.Node)
    private sideMenuNode: cc.Node = null;
    private _sideMenuTexasMenu: UITexasMenu = null;
    private _onSideMenuClicked: () => void = null!;
    @property({ type: cc.Button, displayName: '战绩按钮' })
    private btnReport: cc.Button = null!;
    @property({ type: cc.Button, displayName: '牌谱按钮' })
    private btnReplay: cc.Button = null!;
    @property({ type: InsuranceOperation, displayName: '保险弹窗触发器' })
    private insuranceOperation: InsuranceOperation = null!;
    @property({ type: MorePlayTypeInfo, displayName: '其他游戏玩法的处理节点' })
    private squidInfo: MorePlayTypeInfo = null;
    @property({ type: cc.Node, displayName: '其他有状态变化的按钮或者空间' })
    private otherBindings: cc.Node = null;
    private _otherBindings: OtherBindings = null;
    // main_menu 底部按钮
    @property({ type: cc.Node, displayName: '表情按钮' })
    private btnEmoji: cc.Node = null;
    @property({ type: cc.Node, displayName: '聊天按钮' })
    private chatBtn: cc.Node = null;
    //数据绑定
    private _mine: TexasGameRoomDataPlayerMine = null;
    @property({ type: cc.Node, displayName: '所有需要缩放的节点位置' })
    private scaleNode: cc.Node = null;

    protected onLoad(): void {
        //菜单项
        this._onSideMenuClicked = () => {
            this._sideMenuTexasMenu.fadeIn(true);
        };
        this.sideMenu.node.on('click', this._onSideMenuClicked, this);
        this._sideMenuTexasMenu = this.sideMenuNode.getComponent(UITexasMenu);
        //战绩按钮
        if (this.btnReport) this.btnReport.node.on('click', this.onClickReport, this);
        //牌谱按钮
        if (this.btnReplay) this.btnReplay.node.on('click', this.onClickReplay, this);
        //其他状态
        this._otherBindings = this.otherBindings.getComponent(OtherBindings);
        // main_menu 按钮事件注册
        this.btnEmoji.on('click', this.onClickBtnEmoji, this);
        this.chatBtn.on('click', this.onClickChatBtn, this);
    }

    private onClickReport = () => {
        if (!this._mine) return;
        viewManager.openDialog('TexasReport', {
            roomID: this._mine.roomData.roomID,
            matchID: this._mine.roomData.matchID
        });
    };
    private onClickReplay = () => {
        if (!this._mine) return;
        viewManager.openDialog('TexasHistory', {
            roomID: this._mine.roomData.roomID,
            matchID: this._mine.roomData.matchID
        });
    };

    async initialize(param: UIRoomTexasEnterParam) {
        const roomData = roomDataManager.getRoomData<TexasGameRoomData>(param.roomID, param.matchID);
        this._mine = roomData.mine;
        this.roomInfo.initData(param.roomID, param.matchID);
        this.potsInfo.initData(param.roomID, param.matchID);
        this.seatManager.initData(param.roomID, param.matchID);
        this.publicCardsInfo.initData(param.roomID, param.matchID);
        this._sideMenuTexasMenu.initData(param.roomID, param.matchID);
        this.insuranceOperation.initData(this._mine);
        this.squidInfo.initData(this._mine);
        // 入桌即拉一次 Roomers 填战绩缓存：后续 Seated/Standup/ChipsChange/Winner 在消息层做增量。
        // 对应 pokerqueen UITexas.requestRoomersForCache（history=true 包含已离桌玩家）。
        TexasTableEvent.PrefetchhReportRoomers(param.roomID, param.matchID);
        this._otherBindings.initData(param.roomID, param.matchID);
        //展示介绍对话框
        await this._showSquidIntroDialog(roomData);
        await this._showMushroomIntroDialog(roomData);
        await this._showCriticalHitIntroDialog(roomData);
    }

    @traceMethod({ level: 'debug' })
    protected onFrameResize(
        visibleSizeWidth: number,
        visibleSizeHeight: number,
        frameSizeWidth: number,
        frameSizeHeight: number,
        suggestScale: number,
        saveAreaTop: number
    ) {
        this.tracelog.debug(visibleSizeWidth, suggestScale, saveAreaTop);
        const widget = this.scaleNode.getComponent(cc.Widget);
        widget.top = saveAreaTop;
        widget.updateAlignment();
        this.scaleNode.setScale(suggestScale, suggestScale);
    }

    private async _showSquidIntroDialog(roomData: TexasGameRoomData): Promise<boolean> {
        if (!roomData.basicInfo.hasSquid) return false;
        if (!storageManager.canShowSquidIntroDialog) return false;
        return new Promise<boolean>(resovle => {
            viewManager.openDialog('SquidIntroduction', {
                squidMode: roomData.basicInfo.squidMode,
                squidBase: roomData.basicInfo.squidBase,
                squidHead: roomData.basicInfo.squidHead,
                squidTail: roomData.basicInfo.squidTail,
                squidExtraCount: roomData.basicInfo.squidExtraCount,
                seatCount: roomData.seatsStateManager.seatsCount,
                squidCountRates: roomData.basicInfo.squidCountRateList,
                noAnimation: true,
                closeAction: () => {
                    resovle(true);
                }
            });
        });
    }

    private async _showMushroomIntroDialog(roomData: TexasGameRoomData): Promise<boolean> {
        if (!roomData.basicInfo.hasMushroom) return false;
        if (!storageManager.canShowMushroomIntroDialog) return false;
        const color = '#FFC706';
        const content = StringHelper.Format(i18nMgr.Get('UIMushroom_StartGameTips'), [
            StringHelper.GetColorText(StringHelper.GetLongString(roomData.basicInfo.mushroomBase), color)
        ]);
        return new Promise<boolean>(resovle => {
            viewManager.openDialog('MushroomIntroduction', {
                title: i18nMgr.Get('UIMushroomGameTitle'),
                guideType: UIGuideDialogType.Mushroom,
                content: content,
                closeAction: () => {
                    resovle(true);
                }
            });
        });
    }

    private async _showCriticalHitIntroDialog(roomData: TexasGameRoomData): Promise<boolean> {
        if (!roomData.basicInfo.hasCriticalHit) return false;
        if (!storageManager.canSHowCriticalHitIntroDialog) return false;
        const content = `${roomData.basicInfo.getCriticalHitAnte(100)}(${roomData.basicInfo.getCriticalHitAnte(roomData.basicInfo.sbante.sb * 2)}BB)`;
        const color = '#FFC706';
        const popupContent =
            StringHelper.Format(i18nMgr.Get('UICriticalHit_StartGameTips'), [StringHelper.GetColorText(`${roomData.basicInfo.criticalHitWaitRounds}`, color)]) +
            StringHelper.GetColorText(content, color);
        return new Promise<boolean>(resovle => {
            viewManager.openDialog('CriticalHitIntroduction', {
                title: i18nMgr.Get('UIHitGameTitle'),
                guideType: UIGuideDialogType.CriticalHit,
                content: popupContent,
                closeAction: () => {
                    resovle(true);
                }
            });
        });
    }

    /** 表情按钮（桩实现，后续接入弹幕/表情系统） */
    private onClickBtnEmoji(): void {
        // TODO: 接入表情/弹幕系统
    }

    /** 聊天按钮（桩实现，后续接入聊天系统） */
    private onClickChatBtn(): void {
        // TODO: 接入聊天系统
    }
}
