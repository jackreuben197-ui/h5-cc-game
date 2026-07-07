import { autoBindEvents, bindEvent, unBindEventsAll } from '../../../../core/decorator/DataBind';
import { traceClass } from '../../../../core/decorator/LogTrace';
import roomDataManager from '../../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataPlayerMine from '../../../../data/room/texas/TexasGameRoomDataPlayerMine';
import { ButtonState } from '../../../../game/constant/Constants';
import { MicrophoneIconState } from '../../../../game/constant/MicrophoneIconState';
import agoraManager from '../../../../net/agora/AgoraManager';
import { WebUserSetVideoMask, WWW } from '../../../../net/https/WebRequest';
import UIViewUtil from '../../../util/UIViewUtil';
import SpriteSwitcher from '../../../widget/SpriteSwitcher';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('Scene/Room/Texas/OtherBindings')
@traceClass()
export default class OtherBindings extends cc.Component {
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
    private _roomData: TexasGameRoomData;

    public initData(roomID: number, matchID: number) {
        this._roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
        if (this.node.activeInHierarchy) {
            this._bindEventsAndRefresh();
        }
    }

    public onLoad() {
        // 如果绑定点击写这里
        this.btnEffect.node.on('click', this._clickBtnEffect, this);
        this.btnAudio.node.on('click', this.onClickLocalMicrophoneBtn, this);
        this.btnCamera.node.on('click', this.onClickLocalCameraBtn, this);
        // 远端音视频控制事件注册
        this.muteMicOpenBtn?.on('click', this.onClickRemoteMicrophoneOn, this);
        this.muteMicCloseBtn?.on('click', this.onClickReomteMicrophoneOff, this);
        this.hideVideoOpenBtn?.on('click', this.onClickRemoteCameraOn, this);
        this.hideVideoCloseBtn?.on('click', this.onClickRemoteCameraOff, this);
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
            mine: this._roomData.mine
        });
    }

    /** 响应本地相机的开关（功能处理配合头像上的处理delayed开关）分开2个开关 */
    @bindEvent(TexasGameRoomDataPlayerMine.LOCAL_CAMERA_STATE_CHANGE, 'mine')
    private async onLocalCameraStateChanged(val: ButtonState): Promise<void> {
        if (val == ButtonState.DISABLE) {
            this.hideVideoNode.active = false;
            UIViewUtil.setNodeGray(this.btnCamera.node, true);
            UIViewUtil.setNodeGray(this.btnEffect.node, true);
            this.btnEffectIcon.changeSpriteFrame(1);
            this.btnCameratIcon.changeSpriteFrame(1);
            this.btnEffect.interactable = false;
            this.btnCamera.interactable = false;
            this._roomData.mine.localCameraEnabledDelayed = val;
            return;
        }
        this.hideVideoNode.active = true;
        UIViewUtil.setNodeGray(this.btnCamera.node, false);
        UIViewUtil.setNodeGray(this.btnEffect.node, false);
        this.btnEffect.interactable = true;
        this.btnCamera.interactable = true;
        let muted: boolean;
        if (val == ButtonState.ON) {
            muted = false;
            this.btnEffectIcon.changeSpriteFrame(0);
            this.btnCameratIcon.changeSpriteFrame(0);
        } else {
            muted = true;
            this.btnEffectIcon.changeSpriteFrame(1);
            this.btnCameratIcon.changeSpriteFrame(1);
        }
        if (agoraManager.localVideoTrack) {
            if (muted) {
                // 先关 再静音
                this._roomData.mine.localCameraEnabledDelayed = val;
                await agoraManager.localVideoTrack.setMuted(muted);
            } else {
                // 先开, 再展示
                await agoraManager.localVideoTrack.setMuted(muted);
                this._roomData.mine.localCameraEnabledDelayed = val;
            }
        } else if (!muted) {
            // 先开, 再展示
            await agoraManager.publishVidio();
            this._roomData.mine.localCameraEnabledDelayed = val;
        }
    }

    @bindEvent(TexasGameRoomDataPlayerMine.LOCAL_MICROPHONE_ENABLED_CHANGE, 'mine')
    private onLocalMicrophoneEnabledChanged(val: ButtonState): Promise<void> {
        if (val == ButtonState.DISABLE) {
            this.muteMicNode.active = false;
            UIViewUtil.setNodeGray(this.btnAudio.node, true);
            this.btnAudio.interactable = false;
            this.btnAudioIcon.changeSpriteFrame(1);
            return;
        }
        this.muteMicNode.active = true;
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
        if (agoraManager.localAudioTrack) {
            agoraManager.localAudioTrack.setMuted(muted);
        } else if (!muted) {
            agoraManager.publishAudio();
        }
    }

    /** 响应远程相机开关 */
    @bindEvent(TexasGameRoomDataPlayerMine.REMOTE_CAMERA_STATE_CHANGE, 'mine')
    private async onRemoteCameraChanged(b: boolean): Promise<void> {
        const pubUsersMap = agoraManager.getRemoteUserMap();
        if (b) {
            this._roomData.seatsStateManager.forEachPlayer(async player => {
                const user = pubUsersMap.get(player.userID);
                if (!user || !user.hasVideo) {
                    player.remoteVideoVisible = false;
                    return;
                }
                if (!user.videoTrack) {
                    // 订阅后, user.videoTrack就存在了，可以renderFrame了
                    await agoraManager.subscribeOrUnsubscribeRemoteVideo(true, user);
                    player.remoteVideoVisible = true;
                }
            });
            return;
        }
        this._roomData.seatsStateManager.forEachPlayer(async player => {
            const user = pubUsersMap.get(player.userID);
            // 如果没有视频，且没有订阅直接隐藏
            if (!user || !user.hasVideo || !user.videoTrack) {
                player.remoteVideoVisible = false;
                return;
            }
            //先影藏，再关闭
            player.remoteVideoVisible = false;
            await agoraManager.subscribeOrUnsubscribeRemoteVideo(false, user);
        });
    }

    /** 响应远程相机开关 */
    @bindEvent(TexasGameRoomDataPlayerMine.REMOTE_MICROPHONE_ENABLED_CHANGE, 'mine')
    private async onRemoteMicrophoneChanged(b: boolean): Promise<void> {
        const pubUsersMap = agoraManager.getRemoteUserMap();
        if (b) {
            this._roomData.seatsStateManager.forEachPlayer(async player => {
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
        if (this._roomData.mine.localCameraEnabled == ButtonState.OFF) {
            state = ButtonState.ON;
        }
        this._roomData.mine.localCameraEnabled = state;
    }

    /** 麦克风开关 */
    private onClickLocalMicrophoneBtn() {
        let state = ButtonState.OFF;
        let muted = true;
        if (this._roomData.mine.localMicrophoneEnabled == ButtonState.OFF) {
            muted = false;
            state = ButtonState.ON;
        }
        if (this._roomData.mine.player) {
            this._roomData.mine.player.micIconState = muted ? MicrophoneIconState.MUTED : MicrophoneIconState.HIDDEN;
        }
        this._roomData.mine.localMicrophoneEnabled = state;
    }

    /** 窗花效果切换 */
    private async _clickBtnEffect(): Promise<void> {
        const mine = this._roomData.mine.player;
        if (!mine) return;
        // videoMaskId 循环 +1，大于4回到1
        const oldMaskId = mine.videoMaskId || 0;
        let newMaskId = oldMaskId + 1;
        if (newMaskId > 4) newMaskId = 1;
        // 乐观更新本地数据和窗花显示
        mine.videoMaskId = newMaskId;
        // 请求服务器广播
        try {
            const response: any = await WWW.Instance.CommonAPI({
                web_class: WebUserSetVideoMask,
                body: { video_mask_id: newMaskId }
            });
            if (response?.code !== 0) {
                // 失败回滚
                mine.videoMaskId = oldMaskId;
            }
        } catch {
            // 异常回滚
            mine.videoMaskId = oldMaskId;
        }
    }

    /** 远端音频：openBtn 被点击 → 关闭（静音远端） */
    private onClickRemoteMicrophoneOn(): void {
        if (this.muteMicOpenBtn) this.muteMicOpenBtn.active = false;
        if (this.muteMicCloseBtn) this.muteMicCloseBtn.active = true;
        this._roomData.mine.remoteMicrophoneEnabled = false;
    }

    /** 远端音频：closeBtn 被点击 → 开启（恢复声音） */
    private onClickReomteMicrophoneOff(): void {
        if (this.muteMicCloseBtn) this.muteMicCloseBtn.active = false;
        if (this.muteMicOpenBtn) this.muteMicOpenBtn.active = true;
        this._roomData.mine.remoteMicrophoneEnabled = true;
    }

    /** 远端视频：openBtn 被点击 → 关闭（隐藏远端视频） */
    private onClickRemoteCameraOn(): void {
        if (this.hideVideoOpenBtn) this.hideVideoOpenBtn.active = false;
        if (this.hideVideoCloseBtn) this.hideVideoCloseBtn.active = true;
        this._roomData.mine.remoteCameraEnabled = false;
    }

    /** 远端视频：closeBtn 被点击 → 开启（恢复远端视频） */
    private onClickRemoteCameraOff(): void {
        if (this.hideVideoCloseBtn) this.hideVideoCloseBtn.active = false;
        if (this.hideVideoOpenBtn) this.hideVideoOpenBtn.active = true;
        this._roomData.mine.remoteCameraEnabled = true;
    }
}
