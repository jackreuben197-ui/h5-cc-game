import { Def } from '@silenthill/agreement-web';
import { autoBindEvents, bindEvent, unBindEventsAll } from '../../../../core/decorator/DataBind';
import { traceClass } from '../../../../core/decorator/LogTrace';
import roomDataManager from '../../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataPlayerMine from '../../../../data/room/texas/TexasGameRoomDataPlayerMine';
import ccviewData, { CCViewData } from '../../../../data/system/CCViewData';
import { AntiCheatType } from '../../../../game/constant/AntiCheatType';
import { ButtonState } from '../../../../game/constant/Constants';
import { MicrophoneIconState } from '../../../../game/constant/MicrophoneIconState';
import agoraManager from '../../../../net/agora/AgoraManager';
import { WebUserSetVideoMask, WWW } from '../../../../net/https/WebRequest';
import viewManager from '../../../UIViewManager';
import UIViewUtil from '../../../util/UIViewUtil';
import SpriteSwitcher from '../../../widget/SpriteSwitcher';
import TexasTableEvent from './events/TexasTableEvent';
import menuItemCaculator, { MenuItemLayout, MenuItemLayoutType } from './widget/MenuItemCaculator';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('Scene/Room/Texas/OtherBindings')
@traceClass()
export default class OtherBindings extends cc.Component {
    @property({ type: cc.Button, displayName: '表情按钮' })
    private btnEmoji: cc.Button = null;
    @property({ type: cc.Button, displayName: '战绩按钮' })
    private btnReport: cc.Button = null!;
    @property({ type: cc.Button, displayName: '牌谱按钮' })
    private btnReplay: cc.Button = null!;
    @property({ type: cc.Node, displayName: '认证LOGO' })
    private certlogo: cc.Node = null!;
    @property({ type: cc.Button, displayName: '窗花按钮' })
    private btnEffect: cc.Button = null;
    @property({ type: SpriteSwitcher, displayName: '窗花按钮图标' })
    private btnEffectIcon: SpriteSwitcher = null;
    @property({ type: cc.Button, displayName: '麦克风按钮' })
    private btnAudio: cc.Button = null;
    @property({ type: SpriteSwitcher, displayName: '麦克风按钮图标' })
    private btnAudioIcon: SpriteSwitcher = null;
    @property({ type: cc.Button, displayName: '摄像头按钮' })
    private btnCamera: cc.Button = null;
    @property({ type: SpriteSwitcher, displayName: '摄像头按钮图标' })
    private btnCameratIcon: SpriteSwitcher = null;
    // 远端音视频控制节点
    @property({ type: cc.Node, displayName: '远端音频控制节点' })
    private muteMicNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '远端音频控制节点(open)' })
    private muteMicOpenBtn: cc.Node = null;
    @property({ type: cc.Node, displayName: '远端音频控制节点(close)' })
    private muteMicCloseBtn: cc.Node = null;
    @property({ type: cc.Node, displayName: '远端视频控制节点' })
    private hideVideoNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '远端视频控制节点(open)' })
    private hideVideoOpenBtn: cc.Node = null;
    @property({ type: cc.Node, displayName: '远端视频控制节点(close)' })
    private hideVideoCloseBtn: cc.Node = null;
    @property({ type: cc.Button, displayName: '偷偷看' })
    private viewPlayerCards: cc.Button = null;
    @property({ type: cc.Label, displayName: '偷偷看花费' })
    private viewPlayerCardsCost: cc.Label = null;
    @property({ type: cc.Button, displayName: '发发看' })
    private viewPublicCards: cc.Button = null;
    @property({ type: cc.Label, displayName: '发发看花费' })
    private viewPublicCardsCost: cc.Label = null;
    private _roomData: TexasGameRoomData;

    public initData(roomID: number, matchID: number) {
        this._roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
        if (this.node.activeInHierarchy) {
            this._bindEventsAndRefresh();
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
        let layout: MenuItemLayout;
        if (!this._roomData.basicInfo.antiCheatConfig) {
            layout = menuItemCaculator.caculate(visibleSizeWidth, suggestScale, MenuItemLayoutType.ThreeButtons);
            this.btnEffect.node.active = false;
            this.btnAudio.node.active = false;
            this.btnCamera.node.active = false;
            this.btnReport.node.setPosition(layout.buttons[0].position);
            this.btnReplay.node.setPosition(layout.buttons[1].position);
            this.btnEmoji.node.setPosition(layout.buttons[2].position);
        } else if (this._roomData.basicInfo.antiCheatConfig.antiCheatType == AntiCheatType.AUDIO) {
            layout = menuItemCaculator.caculate(visibleSizeWidth, suggestScale, MenuItemLayoutType.FourButtons);
            this.btnEffect.node.active = false;
            this.btnAudio.node.active = true;
            this.btnCamera.node.active = false;
            this.btnReport.node.setPosition(layout.buttons[0].position);
            this.btnReplay.node.setPosition(layout.buttons[1].position);
            this.btnEmoji.node.setPosition(layout.buttons[2].position);
            this.btnAudio.node.setPosition(layout.buttons[3].position);
        } else {
            layout = menuItemCaculator.caculate(visibleSizeWidth, suggestScale, MenuItemLayoutType.SixButtons);
            this.btnEffect.node.active = true;
            this.btnAudio.node.active = true;
            this.btnCamera.node.active = true;
            this.btnReport.node.setPosition(layout.buttons[0].position);
            this.btnReplay.node.setPosition(layout.buttons[1].position);
            this.btnEmoji.node.setPosition(layout.buttons[2].position);
            this.btnEffect.node.setPosition(layout.buttons[3].position);
            this.btnAudio.node.setPosition(layout.buttons[4].position);
            this.btnCamera.node.setPosition(layout.buttons[5].position);
        }
        this.certlogo.setPosition(layout.logo.position);
    }

    public onLoad() {
        //战绩按钮
        if (this.btnReport) this.btnReport.node.on('click', this.onClickReport, this);
        //牌谱按钮
        if (this.btnReplay) this.btnReplay.node.on('click', this.onClickReplay, this);
        if (this.btnEmoji) this.btnEmoji.node.on('click', this.onClickBtnEmoji, this);
        // 如果绑定点击写这里
        this.btnEffect.node.on('click', this.onClickMaskBtn, this);
        this.btnAudio.node.on('click', this.onClickLocalMicrophoneBtn, this);
        this.btnCamera.node.on('click', this.onClickLocalCameraBtn, this);
        // 远端音视频控制事件注册
        this.muteMicOpenBtn.on('click', this.onClickRemoteMicrophoneOn, this);
        this.muteMicCloseBtn.on('click', this.onClickReomteMicrophoneOff, this);
        this.hideVideoOpenBtn.on('click', this.onClickRemoteCameraOn, this);
        this.hideVideoCloseBtn.on('click', this.onClickRemoteCameraOff, this);
        //
        this.viewPlayerCards.node.on('click', this.onCLickViewPlayerCards, this);
        this.viewPublicCards.node.on('click', this.onClickViewPublicCards, this);
    }

    public onEnable(): void {
        this._bindEventsAndRefresh();
    }

    public onDisable(): void {
        unBindEventsAll(this);
    }

    private _bindEventsAndRefresh() {
        if (!this._roomData) return;
        autoBindEvents(this, {
            mine: this._roomData.mine,
            ccviewData: ccviewData
        });
    }

    @bindEvent(TexasGameRoomDataPlayerMine.SHOW_VIEW_PLAYER_CARDS_BUTTON, 'mine')
    private onShowViewPlayerCardsButtonChanged(show: boolean): void {
        this.viewPlayerCards.node.active = show;
        this.viewPlayerCards.interactable = show;
    }

    @bindEvent(TexasGameRoomDataPlayerMine.VIEW_PLAYER_CARDS_COST, 'mine')
    private onUpdateViewPlayerCardsCost(cost: number): void {
        this.viewPlayerCardsCost.string = cost + '';
    }

    @bindEvent(TexasGameRoomDataPlayerMine.SHOW_VIEW_PUBLIC_CARDS_BUTTON, 'mine')
    private onShowViewPublicCardsButtonChanged(show: boolean): void {
        this.viewPublicCards.node.active = show;
        this.viewPublicCards.interactable = show;
    }

    @bindEvent(TexasGameRoomDataPlayerMine.VIEW_PUBLIC_CARDS_COST, 'mine')
    private onUpdateViewPublicCardsCost(cost: number): void {
        this.viewPublicCardsCost.string = cost + '';
    }

    @bindEvent(TexasGameRoomDataPlayerMine.LOCAL_CAMERA_STATE_CHANGE, 'mine')
    private async onEnableDisableCamaera(enable: boolean) {
        if (!this._roomData.basicInfo.antiCheatConfig && this._roomData.mine) {
            this._roomData.mine.localCameraEnabledDelayed = false;
            return;
        }
        const muted = !enable;
        if (agoraManager.localVideoTrack) {
            if (muted) {
                // 先关 再静音
                this._roomData.mine.localCameraEnabledDelayed = enable;
                await agoraManager.localVideoTrack.setMuted(muted);
            } else {
                // 先开, 再展示
                await agoraManager.localVideoTrack.setMuted(muted);
                this._roomData.mine.localCameraEnabledDelayed = enable;
            }
        } else if (!muted) {
            // 先开, 再展示
            await agoraManager.publishVideo();
            this._roomData.mine.localCameraEnabledDelayed = enable;
        }
    }

    /** 响应本地相机的开关*/
    @bindEvent(TexasGameRoomDataPlayerMine.LOCAL_CAMERA_BTN_STATE_CHANGE, 'mine')
    private onLocalCameraStateChanged(val: ButtonState): Promise<void> {
        if (val == ButtonState.DISABLE) {
            UIViewUtil.setNodeGray(this.btnCamera.node, true);
            this.btnCameratIcon.changeSpriteFrame(1);
            this.btnCamera.interactable = false;
            return;
        }
        UIViewUtil.setNodeGray(this.btnCamera.node, false);
        this.btnCamera.interactable = true;
        let muted: boolean;
        if (val == ButtonState.ON) {
            muted = false;
            this.btnCameratIcon.changeSpriteFrame(0);
            if (this._roomData.basicInfo.antiCheatConfig.getSeatedSetting().canSwitchPowerSaving) {
                this._roomData.mine.player.realShowMaskID = this._roomData.mine.player.videoMaskId == 0 ? 1 : this._roomData.mine.player.videoMaskId;
                this._roomData.mine.maskBtnState = ButtonState.ON;
            }
        } else {
            muted = true;
            this.btnCameratIcon.changeSpriteFrame(1);
            if (this._roomData.basicInfo.antiCheatConfig.getSeatedSetting().canSwitchPowerSaving) {
                this._roomData.mine.player.realShowMaskID = 0;
            }
            this._roomData.mine.maskBtnState = ButtonState.DISABLE;
        }
        this._roomData.mine.localCameraEnabled = !muted;
    }

    @bindEvent(TexasGameRoomDataPlayerMine.VIDEO_MASK_BTN_STATE_CHAGE, 'mine')
    private onMaskBtnState(val: ButtonState) {
        if (val == ButtonState.DISABLE) {
            UIViewUtil.setNodeGray(this.btnEffect.node, true);
            this.btnEffectIcon.changeSpriteFrame(1);
            this.btnEffect.interactable = false;
            return;
        }
        UIViewUtil.setNodeGray(this.btnEffect.node, false);
        this.btnEffect.interactable = true;
        if (val == ButtonState.ON) {
            this.btnEffectIcon.changeSpriteFrame(0);
        } else {
            this.btnEffectIcon.changeSpriteFrame(1);
        }
    }

    @bindEvent(TexasGameRoomDataPlayerMine.LOCAL_MICROPHONE_STATE_CHANGE, 'mine')
    private async onEnableDisableMicrophone(enable: boolean) {
        const minePlayer = this._roomData.mine.player;
        if (!this._roomData.basicInfo.antiCheatConfig) {
            if (minePlayer) {
                minePlayer.micIconState = MicrophoneIconState.HIDDEN;
            }
            return;
        }
        const muted = !enable;
        if (agoraManager.localAudioTrack) {
            agoraManager.localAudioTrack.setMuted(muted);
        } else if (!muted) {
            agoraManager.publishAudio();
        }
        if (minePlayer) {
            minePlayer.micIconState = muted ? MicrophoneIconState.MUTED : MicrophoneIconState.HIDDEN;
        }
    }

    @bindEvent(TexasGameRoomDataPlayerMine.LOCAL_MICROPHONE_BTN_STATE_CHANGE, 'mine')
    private onLocalMicrophoneEnabledChanged(val: ButtonState): Promise<void> {
        if (val == ButtonState.DISABLE) {
            UIViewUtil.setNodeGray(this.btnAudio.node, true);
            this.btnAudio.interactable = false;
            this.btnAudioIcon.changeSpriteFrame(1);
            return;
        }
        UIViewUtil.setNodeGray(this.btnAudio.node, false);
        this.btnAudio.interactable = true;
        let muted: boolean;
        if (val == ButtonState.ON) {
            muted = false;
            this.btnAudioIcon.changeSpriteFrame(0);
        } else {
            muted = true;
            this.btnAudioIcon.changeSpriteFrame(1);
        }
        this._roomData.mine.localMicrophoneEnabled = !muted;
    }

    /** 响应远程相机开关 */
    @bindEvent(TexasGameRoomDataPlayerMine.REMOTE_CAMERA_STATE_CHANGE, 'mine')
    private async onRemoteCameraChanged(st: ButtonState): Promise<void> {
        if (st == ButtonState.HIDDEN) {
            this.hideVideoNode.active = false;
            return;
        }
        this.hideVideoNode.active = true;
        const pubUsersMap = agoraManager.getRemoteUserMap();
        if (st == ButtonState.ON) {
            this._roomData.seatsStateManager.forEachPlayer(async player => {
                if (player.mine) return;
                const user = pubUsersMap.get(player.userID);
                if (!user || !user.hasVideo) {
                    player.remoteVideoVisible = false;
                    player.realShowMaskID = 0;
                    return;
                }
                if (!user.videoTrack) {
                    // 订阅后, user.videoTrack就存在了，可以renderFrame了
                    await agoraManager.subscribeOrUnsubscribeRemoteVideo(true, user);
                }
                player.remoteVideoVisible = true;
                if (this._roomData.basicInfo.antiCheatConfig && this._roomData.basicInfo.antiCheatConfig.getSeatedSetting().canSwitchPowerSaving) {
                    player.realShowMaskID = player.videoMaskId == 0 ? 1 : player.videoMaskId;
                } else {
                    player.realShowMaskID = 0;
                }
            });
            return;
        }
        this._roomData.seatsStateManager.forEachPlayer(async player => {
            if (player.mine) return;
            const user = pubUsersMap.get(player.userID);
            // 如果没有视频，且没有订阅直接隐藏
            if (!user || !user.hasVideo || !user.videoTrack) {
                player.remoteVideoVisible = false;
                player.realShowMaskID = 0;
                return;
            }
            //先影藏，再关闭
            player.remoteVideoVisible = false;
            player.realShowMaskID = 0;
            await agoraManager.subscribeOrUnsubscribeRemoteVideo(false, user);
        });
    }

    /** 响应远程相机开关 */
    @bindEvent(TexasGameRoomDataPlayerMine.REMOTE_MICROPHONE_ENABLED_CHANGE, 'mine')
    private async onRemoteMicrophoneChanged(st: ButtonState): Promise<void> {
        if (st == ButtonState.HIDDEN) {
            this.muteMicNode.active = false;
            return;
        }
        this.muteMicNode.active = true;
        const pubUsersMap = agoraManager.getRemoteUserMap();
        if (st == ButtonState.ON) {
            this._roomData.seatsStateManager.forEachPlayer(async player => {
                if (player.mine) return;
                const user = pubUsersMap.get(player.userID);
                if (!user) {
                    player.micIconState = MicrophoneIconState.HIDDEN;
                    return;
                }
                if (!user.hasAudio) {
                    player.micIconState = MicrophoneIconState.MUTED;
                    return;
                }
                if (!user.audioTrack) {
                    // 订阅后, user.videoTrack就存在了，可以renderFrame了
                    const track = await agoraManager.subscribeOrUnsubscribeRemoteAudio(true, user);
                    track.play();
                    track.setVolume(100);
                    player.micIconState = MicrophoneIconState.HIDDEN;
                    return;
                }
                user.audioTrack.setVolume(100);
                player.micIconState = MicrophoneIconState.HIDDEN;
            });
            return;
        }
        this._roomData.seatsStateManager.forEachPlayer(async player => {
            if (player.mine) return;
            const user = pubUsersMap.get(player.userID);
            if (!user) {
                player.micIconState = MicrophoneIconState.HIDDEN;
                return;
            }
            if (!user.hasAudio || !user.audioTrack) {
                player.micIconState = MicrophoneIconState.MUTED;
                return;
            }
            //先影藏，再关闭
            player.micIconState = MicrophoneIconState.MUTED;
            user.audioTrack.setVolume(0);
        });
    }

    /** 摄像头开关 */
    private onClickLocalCameraBtn() {
        let state = ButtonState.OFF;
        if (this._roomData.mine.localCameraBtnState == ButtonState.OFF) {
            state = ButtonState.ON;
        }
        this._roomData.mine.localCameraBtnState = state;
    }

    /** 麦克风开关 */
    private onClickLocalMicrophoneBtn() {
        let state = ButtonState.OFF;
        let muted = true;
        if (this._roomData.mine.localMicrophoneBtnState == ButtonState.OFF) {
            muted = false;
            state = ButtonState.ON;
        }
        this._roomData.mine.localMicrophoneBtnState = state;
    }

    /** 窗花效果切换 */
    private async onClickMaskBtn(): Promise<void> {
        const mine = this._roomData.mine.player;
        if (!mine) return;
        // videoMaskId 循环 +1，大于4回到1
        const oldMaskId = mine.videoMaskId || 0;
        let newMaskId = oldMaskId + 1;
        if (newMaskId > 4) newMaskId = 1;
        // 乐观更新本地数据和窗花显示
        mine.videoMaskId = newMaskId;
        if (mine.realShowMaskID > 0) {
            mine.realShowMaskID = newMaskId;
        }
        // 请求服务器广播
        try {
            const response: any = await WWW.Instance.CommonAPI({
                web_class: WebUserSetVideoMask,
                body: { video_mask_id: newMaskId }
            });
            if (response?.code !== 0) {
                // 失败回滚
                mine.videoMaskId = oldMaskId;
                if (mine.realShowMaskID > 0) {
                    mine.realShowMaskID = oldMaskId;
                }
                return;
            }
            //确定更换
            if (mine.realShowMaskID > 0) {
                mine.realShowMaskID = newMaskId;
            }
        } catch {
            // 异常回滚
            mine.videoMaskId = oldMaskId;
            if (mine.realShowMaskID > 0) {
                mine.realShowMaskID = oldMaskId;
            }
        }
    }

    private onClickBtnEmoji(): void {
        const mine = this._roomData.mine;
        if (!mine || !mine.player || mine.player.seatNo == 0) return;
        viewManager.openDialog('Emoji', {
            roomID: mine.roomData.roomID,
            matchID: mine.roomData.matchID
        });
    }

    private onClickReport = () => {
        const mine = this._roomData.mine;
        viewManager.openDialog('TexasReport', {
            roomID: mine.roomData.roomID,
            matchID: mine.roomData.matchID
        });
    };
    private onClickReplay = () => {
        const mine = this._roomData.mine;
        viewManager.openDialog('TexasHistory', {
            roomID: mine.roomData.roomID,
            matchID: mine.roomData.matchID
        });
    };

    private onCLickViewPlayerCards() {
        if (!this._roomData || !this._roomData.mine.showViewPlayerCardsButton) return;
        this.viewPlayerCards.interactable = false;
        TexasTableEvent.ViewPlayerCards(this._roomData.mine);
    }

    private onClickViewPublicCards() {
        if (!this._roomData || !this._roomData.mine.showViewPublicCardsButton) return;
        const publicCardCount = this._roomData.publicCards.publicCards.length;
        if (publicCardCount >= 5) {
            this._roomData.mine.showViewPublicCardsButton = false;
            return;
        }
        let round: Def.RoundMap[keyof Def.RoundMap];
        if (publicCardCount == 0) {
            round = Def.Round.PREFLOP;
        } else if (publicCardCount == 3) {
            round = Def.Round.FLOP;
        } else if (publicCardCount == 4) {
            round = Def.Round.TURN;
        } else {
            this._roomData.mine.showViewPublicCardsButton = false;
            return;
        }
        this.viewPublicCards.interactable = false;
        TexasTableEvent.ShowPublicCards(this._roomData.mine, round);
    }

    /** 远端音频：openBtn 被点击 → 关闭（静音远端） */
    private onClickRemoteMicrophoneOn(): void {
        if (this.muteMicOpenBtn) this.muteMicOpenBtn.active = false;
        if (this.muteMicCloseBtn) this.muteMicCloseBtn.active = true;
        this._roomData.mine.remoteMicrophoneEnabled = ButtonState.OFF;
    }

    /** 远端音频：closeBtn 被点击 → 开启（恢复声音） */
    private onClickReomteMicrophoneOff(): void {
        if (this.muteMicCloseBtn) this.muteMicCloseBtn.active = false;
        if (this.muteMicOpenBtn) this.muteMicOpenBtn.active = true;
        this._roomData.mine.remoteMicrophoneEnabled = ButtonState.ON;
    }

    /** 远端视频：openBtn 被点击 → 关闭（隐藏远端视频） */
    private onClickRemoteCameraOn(): void {
        if (this.hideVideoOpenBtn) this.hideVideoOpenBtn.active = false;
        if (this.hideVideoCloseBtn) this.hideVideoCloseBtn.active = true;
        this._roomData.mine.remoteCameraEnabled = ButtonState.OFF;
    }

    /** 远端视频：closeBtn 被点击 → 开启（恢复远端视频） */
    private onClickRemoteCameraOff(): void {
        if (this.hideVideoCloseBtn) this.hideVideoCloseBtn.active = false;
        if (this.hideVideoOpenBtn) this.hideVideoOpenBtn.active = true;
        this._roomData.mine.remoteCameraEnabled = ButtonState.ON;
    }
}
