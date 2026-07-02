import { Code } from '@silenthill/agreement-web';
import { traceClass } from '../../../../core/decorator/LogTrace';
import storageManager from '../../../../data/LocalStorage';
import roomDataManager from '../../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataPlayerMine from '../../../../data/room/texas/TexasGameRoomDataPlayerMine';
import { VideoModel } from '../../../../game/constant/VideoModel';
import { StringHelper } from '../../../../helper/StringHelper';
import { i18nMgr } from '../../../../i18n/i18nMgr';
import ProtocolAgency from '../../../../net/websocket/ProtocolAgency';
import AgoraManager from '../../../../net/agora/AgoraManager';
import AgoraVideoRender from '../../../../net/agora/AgoraVideoRender';
import VideoRoomManager from '../../../../net/agora/VideoRoomManager';
import { WebUserSetVideoMask, WWW } from '../../../../net/https/WebRequest';
import UIComponentBase from '../../../base/UIComponentBase';
import { UIGuideDialogType } from '../../../dialog/mushroomandcriticalhit/UIGuideDialog';
import viewManager from '../../../UIViewManager';
import InsuranceOperation from './InsuranceOperation';
import MorePlayTypeInfo from './MorePlayTypeInfo';
import Operation from './Operation';
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
    @property({ type: cc.Button, displayName: '战绩按钮 (side_btns/main_menu/btn_report)' })
    private btnReport: cc.Button = null!;
    @property({ type: cc.Node, displayName: '操作面板' })
    private opPannelNode: cc.Node = null!;
    private _opPannel: Operation = null!;
    @property({ type: InsuranceOperation, displayName: '保险弹窗触发器' })
    private insuranceOperation: InsuranceOperation = null!;
    @property({ type: MorePlayTypeInfo, displayName: '其他游戏玩法的处理节点' })
    private squidInfo: MorePlayTypeInfo = null;
    // main_menu 底部按钮
    @property({ type: cc.Node, displayName: '表情按钮' })
    private btnEmoji: cc.Node = null;
    @property({ type: cc.Node, displayName: '窗花按钮' })
    private btnEffect: cc.Node = null;
    @property({ type: cc.Node, displayName: '麦克风按钮' })
    private btnAudio: cc.Node = null;
    @property({ type: cc.Node, displayName: '摄像头按钮' })
    private btnCamera: cc.Node = null;
    @property({ type: cc.Node, displayName: '聊天按钮' })
    private chatBtn: cc.Node = null;
    // 远端音视频控制节点
    @property({ type: cc.Node, displayName: '远端音频控制节点' })
    private muteMicNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '远端视频控制节点' })
    private hideVideoNode: cc.Node = null;
    //数据绑定
    private _mine: TexasGameRoomDataPlayerMine = null;
    // 视频控制按钮状态
    private _cameraOn: boolean = false;
    private _micOn: boolean = false;
    // 远端控制子按钮引用
    private _muteMicOpenBtn: cc.Node = null;
    private _muteMicCloseBtn: cc.Node = null;
    private _hideVideoOpenBtn: cc.Node = null;
    private _hideVideoCloseBtn: cc.Node = null;

    protected onLoad(): void {
        // 兜底：prefab 未在编辑器绑定按钮属性时，按路径从节点树查找
        // 这些按钮/控制节点都在 side_btns/main_menu 下
        const _menuRoot = cc.find('side_btns/main_menu', this.node);
        if (_menuRoot) {
            if (!this.btnCamera) this.btnCamera = _menuRoot.getChildByName('btn_camera');
            if (!this.btnAudio) this.btnAudio = _menuRoot.getChildByName('btn_audio');
            if (!this.btnEffect) this.btnEffect = _menuRoot.getChildByName('btn_effect');
            if (!this.btnEmoji) this.btnEmoji = _menuRoot.getChildByName('btn_emoji');
            if (!this.chatBtn) this.chatBtn = _menuRoot.getChildByName('chatBtn');
            if (!this.muteMicNode) this.muteMicNode = _menuRoot.getChildByName('muteMicNode');
            if (!this.hideVideoNode) this.hideVideoNode = _menuRoot.getChildByName('hideVideoNode');
        }
        //菜单项
        this._onSideMenuClicked = () => {
            this._sideMenuTexasMenu.fadeIn(true);
        };
        this.sideMenu.node.on('click', this._onSideMenuClicked, this);
        this._sideMenuTexasMenu = this.sideMenuNode.getComponent(UITexasMenu);
        //操作面板
        this._opPannel = this.opPannelNode.children[0].getComponent(Operation);
        //战绩按钮
        if (this.btnReport) this.btnReport.node.on('click', this._onClickReport, this);
        //远端音视频控制子按钮
        if (this.muteMicNode) {
            const muteBg = this.muteMicNode.getChildByName('background');
            this._muteMicOpenBtn = muteBg?.getChildByName('openBtn');
            this._muteMicCloseBtn = muteBg?.getChildByName('closeBtn');
        }
        if (this.hideVideoNode) {
            const hideBg = this.hideVideoNode.getChildByName('background');
            this._hideVideoOpenBtn = hideBg?.getChildByName('openBtn');
            this._hideVideoCloseBtn = hideBg?.getChildByName('closeBtn');
        }
        // main_menu 按钮事件注册
        this.btnEmoji?.on('click', this._clickBtnEmoji, this);
        this.btnEffect?.on('click', this._clickBtnEffect, this);
        this.btnAudio?.on('click', this._clickBtnAudio, this);
        this.btnCamera?.on('click', this._clickBtnCamera, this);
        this.chatBtn?.on('click', this._clickChatBtn, this);
        // 远端音视频控制事件注册
        this._muteMicOpenBtn?.on('click', this._clickMuteMicOpen, this);
        this._muteMicCloseBtn?.on('click', this._clickMuteMicClose, this);
        this._hideVideoOpenBtn?.on('click', this._clickHideVideoOpen, this);
        this._hideVideoCloseBtn?.on('click', this._clickHideVideoClose, this);
    }

    private _onClickReport = () => {
        if (!this._mine) return;
        viewManager.openDialog('TexasReport', {
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
        this._opPannel.initData(this._mine);
        this.insuranceOperation.initData(this._mine);
        this.squidInfo.initData(this._mine);
        // 入桌即拉一次 Roomers 填战绩缓存：后续 Seated/Standup/ChipsChange/Winner 在消息层做增量。
        // 对应 pokerqueen UITexas.requestRoomersForCache（history=true 包含已离桌玩家）。
        this._prefetchReportRoomers(param.roomID, param.matchID);
        //展示介绍对话框
        await this._showSquidIntroDialog(roomData);
        await this._showMushroomIntroDialog(roomData);
        await this._showCriticalHitIntroDialog(roomData);
        //初始化视频按钮
        this._initVideoButtons();
    }

    private _prefetchReportRoomers(roomID: number, matchID: number): void {
        if (!roomID) return;
        ProtocolAgency.Send({
            code: Code.MSG_D_ROOMERS,
            roomID,
            matchID,
            body: {
                room: { roomId: roomID, matchId: matchID },
                history: true,
                historyOffset: 0,
                historyLimit: 1000
            }
        });
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
    // ==================== 视频按钮 ====================

    /** 初始化视频按钮状态 */
    private _initVideoButtons(): void {
        const videoModel = this._mine.roomData.basicInfo.videoModel;
        const isVideoRoom = videoModel !== VideoModel.NONE;
        if (this.muteMicNode) this.muteMicNode.active = isVideoRoom;
        if (this.hideVideoNode) this.hideVideoNode.active = isVideoRoom;
        this._cameraOn = false;
        this._micOn = false;
        this._syncVideoButtonVisuals();
        this._initRemoteMediaButtons();
        // 订阅本地视频渲染异常停止回调，保持按钮状态同步
        VideoRoomManager.Instance.onLocalVideoStopped = () => {
            this.syncVideoButtonsFromAgora();
        };
    }

    /** 同步摄像头/麦克风/窗花按钮的视觉状态 */
    private _syncVideoButtonVisuals(): void {
        const setGray = (node: cc.Node, gray: boolean) => {
            if (!node) return;
            const sprite = node.getComponent(cc.Sprite);
            if (sprite) {
                const mat = gray ? cc.Material.getBuiltinMaterial('2d-gray-sprite') : cc.Material.getBuiltinMaterial('2d-sprite');
                sprite.setMaterial(0, mat);
            }
            node.opacity = gray ? 128 : 255;
        };
        setGray(this.btnCamera, !this._cameraOn);
        setGray(this.btnAudio, !this._micOn);
        // 窗花按钮：视频房间 + 节能模式开启 + 本地视频正在渲染
        if (this.btnEffect) {
            const roomData = this._mine.roomData;
            const videoModel = roomData.basicInfo.videoModel;
            const videoPowerSaving = roomData.basicInfo.videoPowerSaving ?? 0;
            const mySeatNo = this._mine.seatNo;
            const headNode = VideoRoomManager.Instance.getSeatAvatarNode(mySeatNo);
            const vr = headNode?.getComponent(AgoraVideoRender);
            const effectEnabled = videoModel !== VideoModel.NONE && videoPowerSaving === 1 && vr?.isRendering === true;
            setGray(this.btnEffect, !effectEnabled);
        }
    }

    /** 初始化远端音频/视频控制按钮的显隐状态 */
    private _initRemoteMediaButtons(): void {
        const videoModel = this._mine.roomData.basicInfo.videoModel;
        const isVideoRoom = videoModel !== VideoModel.NONE;
        if (this.muteMicNode) this.muteMicNode.active = isVideoRoom;
        if (this.hideVideoNode) this.hideVideoNode.active = isVideoRoom;
        if (!isVideoRoom) return;
        const agora = AgoraManager.Instance;
        const audioOn = !agora.isRemoteAudioMuted;
        if (this._muteMicOpenBtn) this._muteMicOpenBtn.active = audioOn;
        if (this._muteMicCloseBtn) this._muteMicCloseBtn.active = !audioOn;
        const videoOn = !agora.isRemoteVideoMuted;
        if (this._hideVideoOpenBtn) this._hideVideoOpenBtn.active = videoOn;
        if (this._hideVideoCloseBtn) this._hideVideoCloseBtn.active = !videoOn;
    }

    /** 摄像头开关 */
    private async _clickBtnCamera(): Promise<void> {
        if (!this._mine?.roomData) return;
        const videoModel = this._mine.roomData.basicInfo.videoModel;
        if (videoModel === VideoModel.NONE) {
            viewManager.showToast(i18nMgr.Get('UIEffectNoVideo'));
            return;
        }
        if (videoModel === VideoModel.FULL_TIME) {
            viewManager.showToast(i18nMgr.Get('UIVideoModelverifyFullTime02'));
            return;
        }
        // 麦序模式：不允许手动切换摄像头
        if (videoModel === VideoModel.SEQUENCE) {
            viewManager.showToast(i18nMgr.Get('UICantOpenVideoOnMicSeq'));
            return;
        }
        // 随机视频验证期间不允许手动切换
        if (this._mine.randomVideoActive) {
            const remainSec = Math.max(0, Math.ceil((this._mine.randomVideoEndTime - Date.now()) / 1000));
            viewManager.showToast(i18nMgr.Get('UIVideoModelverifyRandom02').replace('{0}', String(remainSec)));
            return;
        }
        const agora = AgoraManager.Instance;
        if (!agora.isJoined) return;
        const mySeatNo = this._mine.seatNo;
        if (mySeatNo <= 0) {
            viewManager.showToast(i18nMgr.Get('UISitdownFirst'));
            return;
        }
        const headNode = VideoRoomManager.Instance.getSeatAvatarNode(mySeatNo);
        const vr = headNode?.getComponent(AgoraVideoRender);
        const actuallyRendering = vr?.isRendering === true;
        this._cameraOn = actuallyRendering;
        if (this._cameraOn) {
            if (vr) vr.stopRender();
            await agora.disableCamera();
            this._cameraOn = false;
        } else {
            await VideoRoomManager.Instance.renderLocalVideoOnMySeat(headNode);
            this._cameraOn = !!agora.localVideoTrack;
        }
        this._syncVideoButtonVisuals();
    }

    /** 麦克风开关 */
    private async _clickBtnAudio(): Promise<void> {
        const videoModel = this._mine.roomData.basicInfo.videoModel;
        if (videoModel === VideoModel.NONE) {
            viewManager.showToast(i18nMgr.Get('UIRoomNotOpenAudio'));
            return;
        }
        if (this._mine.seatNo <= 0) {
            viewManager.showToast(i18nMgr.Get('UISitdownFirst'));
            return;
        }
        const agora = AgoraManager.Instance;
        if (!agora.isJoined) return;
        if (this._micOn) {
            agora.setMicMuted(true);
            this._micOn = false;
        } else {
            if (!agora.localAudioTrack) {
                const ok = await agora.enableMic();
                this._micOn = ok;
            } else {
                agora.setMicMuted(false);
                this._micOn = true;
            }
        }
        this._syncVideoButtonVisuals();
        // TODO: 调用 refreshMicIcons() 刷新所有座位的麦克风图标（待 SeatManager 支持 setMicIconState）
    }

    /** 窗花效果切换 */
    private async _clickBtnEffect(): Promise<void> {
        const roomData = this._mine.roomData;
        const videoModel = roomData.basicInfo.videoModel;
        if (videoModel === VideoModel.NONE) {
            viewManager.showToast(i18nMgr.Get('UIEffectNoVideo'));
            return;
        }
        const videoPowerSaving = roomData.basicInfo.videoPowerSaving ?? 0;
        if (videoPowerSaving !== 1) {
            viewManager.showToast(i18nMgr.Get('UIEffectNoPowerSaving'));
            return;
        }
        const mySeatNo = this._mine.seatNo;
        if (mySeatNo <= 0) {
            viewManager.showToast(i18nMgr.Get('UISitdownFirst'));
            return;
        }
        const headNode = VideoRoomManager.Instance.getSeatAvatarNode(mySeatNo);
        const vr = headNode?.getComponent(AgoraVideoRender);
        if (!vr?.isRendering) {
            viewManager.showToast(i18nMgr.Get('UIEffectNoCamera'));
            return;
        }
        // videoMaskId 循环 +1，大于4回到1
        const oldMaskId = this._mine.player.videoMaskId || 0;
        let newMaskId = oldMaskId + 1;
        if (newMaskId > 4) newMaskId = 1;
        // 乐观更新本地数据和窗花显示
        this._mine.player.videoMaskId = newMaskId;
        if (headNode?.isValid && vr) vr.setVideoMaskId(newMaskId);
        // 请求服务器广播
        try {
            const response: any = await WWW.Instance.CommonAPI({
                web_class: WebUserSetVideoMask,
                body: { video_mask_id: newMaskId }
            });
            if (response?.code !== 0) {
                // 失败回滚
                this._mine.player.videoMaskId = oldMaskId;
                if (headNode?.isValid) {
                    const vrNow = headNode.getComponent(AgoraVideoRender);
                    if (vrNow) vrNow.setVideoMaskId(oldMaskId);
                }
            }
        } catch {
            // 异常回滚
            this._mine.player.videoMaskId = oldMaskId;
            if (headNode?.isValid) {
                const vrNow = headNode.getComponent(AgoraVideoRender);
                if (vrNow) vrNow.setVideoMaskId(oldMaskId);
            }
        }
    }

    /** 表情按钮（桩实现，后续接入弹幕/表情系统） */
    private _clickBtnEmoji(): void {
        // TODO: 接入表情/弹幕系统
    }

    /** 聊天按钮（桩实现，后续接入聊天系统） */
    private _clickChatBtn(): void {
        // TODO: 接入聊天系统
    }

    /** 远端音频：openBtn 被点击 → 关闭（静音远端） */
    private _clickMuteMicOpen(): void {
        if (this._muteMicOpenBtn) this._muteMicOpenBtn.active = false;
        if (this._muteMicCloseBtn) this._muteMicCloseBtn.active = true;
        AgoraManager.Instance.setRemoteAudioEnabled(false);
    }

    /** 远端音频：closeBtn 被点击 → 开启（恢复声音） */
    private _clickMuteMicClose(): void {
        if (this._muteMicCloseBtn) this._muteMicCloseBtn.active = false;
        if (this._muteMicOpenBtn) this._muteMicOpenBtn.active = true;
        AgoraManager.Instance.setRemoteAudioEnabled(true);
    }

    /** 远端视频：openBtn 被点击 → 关闭（隐藏远端视频） */
    private async _clickHideVideoOpen(): Promise<void> {
        if (this._hideVideoOpenBtn) this._hideVideoOpenBtn.active = false;
        if (this._hideVideoCloseBtn) this._hideVideoCloseBtn.active = true;
        await AgoraManager.Instance.setRemoteVideoEnabled(false);
    }

    /** 远端视频：closeBtn 被点击 → 开启（恢复远端视频） */
    private async _clickHideVideoClose(): Promise<void> {
        if (this._hideVideoCloseBtn) this._hideVideoCloseBtn.active = false;
        if (this._hideVideoOpenBtn) this._hideVideoOpenBtn.active = true;
        await AgoraManager.Instance.setRemoteVideoEnabled(true);
    }

    /** 从 AgoraManager 实际状态同步按钮（由外部调用） */
    public syncVideoButtonsFromAgora(): void {
        const agora = AgoraManager.Instance;
        this._cameraOn = !!agora.localVideoTrack;
        this._micOn = !!agora.localAudioTrack;
        this._syncVideoButtonVisuals();
    }

    /** 重置视频按钮状态（离开房间时调用） */
    public resetVideoButtons(): void {
        this._cameraOn = false;
        this._micOn = false;
        this._syncVideoButtonVisuals();
        this._initRemoteMediaButtons();
    }
}
