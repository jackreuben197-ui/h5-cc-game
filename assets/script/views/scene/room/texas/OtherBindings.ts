import { autoBindEvents, bindEvent, unBindEventsAll } from '../../../../core/decorator/DataBind';
import { traceClass, traceMethod } from '../../../../core/decorator/LogTrace';
import roomDataManager from '../../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataPlayerMine from '../../../../data/room/texas/TexasGameRoomDataPlayerMine';
import { ButtonState } from '../../../../game/constant/Constants';
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
        this.btnAudio.node.on('click', this._clickBtnAudio, this);
        this.btnCamera.node.on('click', this._clickBtnCamera, this);
        // 远端音视频控制事件注册
        this.muteMicOpenBtn?.on('click', this._clickMuteMicOpen, this);
        this.muteMicCloseBtn?.on('click', this._clickMuteMicClose, this);
        this.hideVideoOpenBtn?.on('click', this._clickHideVideoOpen, this);
        this.hideVideoCloseBtn?.on('click', this._clickHideVideoClose, this);
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

    @bindEvent(TexasGameRoomDataPlayerMine.LOCAL_CAMERA_STATE_CHANGE, 'mine')
    private onLocalCameraStateChanged(val: ButtonState): void {
        if (val == ButtonState.DISABLE) {
            this.hideVideoNode.active = false;
            UIViewUtil.setNodeGray(this.btnCamera.node, true);
            UIViewUtil.setNodeGray(this.btnEffect.node, true);
            this.btnEffectIcon.changeSpriteFrame(1);
            this.btnCameratIcon.changeSpriteFrame(1);
            this.btnEffect.interactable = false;
            this.btnCamera.interactable = false;
            return;
        }
        this.hideVideoNode.active = true;
        UIViewUtil.setNodeGray(this.btnCamera.node, false);
        UIViewUtil.setNodeGray(this.btnEffect.node, false);
        this.btnEffect.interactable = true;
        this.btnCamera.interactable = true;
        if (val == ButtonState.ON) {
            this.btnEffectIcon.changeSpriteFrame(0);
            this.btnCameratIcon.changeSpriteFrame(0);
        } else {
            this.btnEffectIcon.changeSpriteFrame(1);
            this.btnCameratIcon.changeSpriteFrame(1);
        }
    }

    @bindEvent(TexasGameRoomDataPlayerMine.LOCAL_MIC_ENABLED_CHANGE, 'mine')
    @traceMethod({ level: 'debug' })
    private onLocalMicEnabledChanged(val: ButtonState): void {
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
        if (val == ButtonState.ON) {
            this.btnAudioIcon.changeSpriteFrame(0);
        } else {
            this.btnAudioIcon.changeSpriteFrame(1);
        }
    }

    /** 摄像头开关 */
    private _clickBtnCamera() {
        let state = ButtonState.OFF;
        if (this._roomData.mine.localCameraEnabled == ButtonState.OFF) {
            state = ButtonState.ON;
        }
        this._roomData.mine.localCameraEnabled = state;
    }

    /** 麦克风开关 */
    private _clickBtnAudio() {
        let state = ButtonState.OFF;
        if (this._roomData.mine.localMicEnabled == ButtonState.OFF) {
            state = ButtonState.ON;
        }
        this._roomData.mine.localMicEnabled = state;
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
    private _clickMuteMicOpen(): void {
        if (this.muteMicOpenBtn) this.muteMicOpenBtn.active = false;
        if (this.muteMicCloseBtn) this.muteMicCloseBtn.active = true;
        agoraManager.setRemoteAudioEnabled(false);
    }

    /** 远端音频：closeBtn 被点击 → 开启（恢复声音） */
    private _clickMuteMicClose(): void {
        if (this.muteMicCloseBtn) this.muteMicCloseBtn.active = false;
        if (this.muteMicOpenBtn) this.muteMicOpenBtn.active = true;
        agoraManager.setRemoteAudioEnabled(true);
    }

    /** 远端视频：openBtn 被点击 → 关闭（隐藏远端视频） */
    private async _clickHideVideoOpen(): Promise<void> {
        if (this.hideVideoOpenBtn) this.hideVideoOpenBtn.active = false;
        if (this.hideVideoCloseBtn) this.hideVideoCloseBtn.active = true;
        await agoraManager.setRemoteVideoEnabled(false);
    }

    /** 远端视频：closeBtn 被点击 → 开启（恢复远端视频） */
    private async _clickHideVideoClose(): Promise<void> {
        if (this.hideVideoCloseBtn) this.hideVideoCloseBtn.active = false;
        if (this.hideVideoOpenBtn) this.hideVideoOpenBtn.active = true;
        await agoraManager.setRemoteVideoEnabled(true);
    }
}
