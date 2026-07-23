import { Def } from '@silenthill/agreement-web';
import { autoBindEvents, bindEvent, unBindEvents, unBindEventsAll } from '../../../../core/decorator/DataBind';
import { traceClass, traceMethod } from '../../../../core/decorator/LogTrace';
import { HandValueType, handValueTypeToString } from '../../../../core/poker/PoerkCard';
import soundManager, { SoundEffectKey } from '../../../../core/SoundManager';
import { Operator, OpertionType } from '../../../../data/room/texas/model/Operator';
import texasGamePersonalSettings, { TexasGamePersonalSettings } from '../../../../data/room/texas/TexasGamePersonalSettings';
import TexasGameRoomDataBasic from '../../../../data/room/texas/TexasGameRoomDataBasic';
import TexasGameRoomDataPlayer from '../../../../data/room/texas/TexasGameRoomDataPlayer';
import TexasGameRoomDataPlayerMine from '../../../../data/room/texas/TexasGameRoomDataPlayerMine';
import {
    AnimateDisplayTypeAction,
    AnimateDisplayTypeCards,
    AnimateDisplayTypePosition,
    AnimateDisplayTypeRoundBet
} from '../../../../game/constant/AnimateDisplayType';
import { ButtonState } from '../../../../game/constant/Constants';
import { MicrophoneIconState } from '../../../../game/constant/MicrophoneIconState';
import { StringHelper } from '../../../../helper/StringHelper';
import { CPErrorCode } from '../../../../i18n/CPErrorCode';
import { i18nLabel } from '../../../../i18n/i18nLabel';
import { i18nMgr } from '../../../../i18n/i18nMgr';
import agoraManager from '../../../../net/agora/AgoraManager';
import AssetManager, { BUNDLE_RESOURCES } from '../../../loader/AssetManager';
import UIViewUtil from '../../../util/UIViewUtil';
import AgoraVideoRender from '../../../widget/AgoraVideoRender';
import CardView from '../../../widget/CardView';
import CountDownLabel from '../../../widget/CountDownLabel';
import { DisplayNode } from '../../../widget/DisplayNode';
import RemoteSprite from '../../../widget/RemoteSprite';
import ShiningPathTimer from '../../../widget/ShiningPathTimer';
import TexasTableEvent from './events/TexasTableEvent';
import SeatAction from './SeatAction';
import seatPostionCaculator, { SeatPosition } from './widget/SeatPositionCaculator';

const { ccclass, property, menu } = cc._decorator;

const redColor = cc.Color.fromHEX(new cc.Color(), '#FA2B4B');

const greenColor = cc.Color.fromHEX(new cc.Color(), '#78E4E4');

const yellowColor = cc.Color.fromHEX(new cc.Color(), '#F9CA9F');

@ccclass
@menu('Scene/Room/Texas/SeatPlayer')
@traceClass()
export default class SeatPlayer extends cc.Component {
    @property(cc.Label)
    private nickName: cc.Label = null!;
    @property(cc.Node)
    private nickNameSplash: cc.Node = null!; // 分割线
    @property(RemoteSprite)
    private avatar: RemoteSprite = null!;
    @property({ type: AgoraVideoRender, displayName: '头像视频渲染组件' })
    private avatarVideoRender: AgoraVideoRender = null;
    @property(cc.Label)
    private chips: cc.Label = null!;
    @property(cc.Button)
    private emptySeat: cc.Button = null!;
    @property({ type: cc.Node, displayName: '真实用户根节点' })
    private userSeat: cc.Node = null!;
    @property({ type: cc.Node, displayName: '庄家图标' })
    public buttonIcon: cc.Node = null!; // 无奈放开吧
    @property({ type: cc.Node, displayName: '小牌显示的容器' })
    private smallCardsContainer: cc.Node = null!;
    // round bet related
    @property(cc.Node)
    private roundBetNode: cc.Node = null!;
    @property(cc.Label)
    private roundBetLabel: cc.Label = null!;
    @property(cc.Node)
    private roudBetIcon: cc.Node = null!;
    @property({ type: cc.Node, displayName: '大牌显示的容器,包括我的' })
    private bigCardsContainer: cc.Node = null!;
    @property(cc.Node)
    private animatingChips: cc.Node = null!;
    @property(SeatAction)
    private seatActionDisplay: SeatAction = null!;
    @property({ type: ShiningPathTimer, displayName: '其他人的倒计时圆圈' })
    private otherPersonActionCountdown: ShiningPathTimer = null!;
    @property({ type: sp.Skeleton, displayName: '获胜动画' })
    private winAnimation: sp.Skeleton = null!;
    @property({ type: sp.Skeleton, displayName: 'ALLIN动画' })
    private allInAnimation: sp.Skeleton = null!;
    @property({ type: sp.Skeleton, displayName: 'ALLIN(other)动画' })
    private allInOtherAnimation: sp.Skeleton = null!;
    @property({ type: ShiningPathTimer, displayName: '留坐的倒计时圆圈' })
    private keepSeatTimer: ShiningPathTimer = null;
    @property({ type: DisplayNode, displayName: '胜率节点' })
    private winPercentNode: DisplayNode = null;
    @property({ type: DisplayNode, displayName: '游戏状态CanPlayStatus' })
    private canPlayStatusNode: DisplayNode = null;
    @property({ type: cc.Button, displayName: '返回游戏按钮' })
    private returnToGameButton: cc.Button = null!;
    @property({ type: i18nLabel, displayName: '返回游戏按钮文本' })
    private returnToGameLabel: i18nLabel = null!;
    @property({ type: DisplayNode, displayName: '牌型节点' })
    private handValueTypeNode: DisplayNode = null!;
    @property({ type: CountDownLabel, displayName: '保险购买中气泡' })
    private insuranceCountdownBubble: CountDownLabel = null!;
    @property({ type: DisplayNode, displayName: '蘑菇节点(文本1：数量，文本2：总数）' })
    public mushroomNode: DisplayNode = null;
    @property({ type: DisplayNode, displayName: '鱿鱼节点' })
    private squidNode: DisplayNode = null;
    @property({ type: cc.Node, displayName: '鱿鱼标记(图标)' })
    private squidMaskNode: cc.Node = null;
    @property({ type: DisplayNode, displayName: '获胜者的筹码牌型' })
    private winBoard: DisplayNode = null!; // text 0 handVuleType 1: chip, node 0 handValue 1: slash 2: space(for no handValue )
    @property({ displayName: '正在说话时显示的喇叭图标', type: cc.SpriteFrame })
    private speakingIcon: cc.SpriteFrame = null;
    @property({ displayName: '麦克风被禁止时显示的图标', type: cc.SpriteFrame })
    private micMutedIcon: cc.SpriteFrame = null;
    // @property({ displayName: '麦克风可以是用的图标', type: cc.SpriteFrame })
    // private soundIcon: cc.SpriteFrame = null;
    @property({ type: cc.Sprite, displayName: '麦克风图标' })
    private micIconSprite: cc.Sprite = null;
    @property({ type: cc.Node, displayName: '道具动画节点' })
    private _throwPropNode: cc.Node = null!;
    @property({ type: cc.Node, displayName: '表情动画节点' })
    private _emojiNode: cc.Node = null!;
    private _seatPlayer: TexasGameRoomDataPlayer = null!;
    /** 保险购买中：此状态下隐藏全下等 action 气泡，只显示【购买中XXs】 */
    private _insuranceBuying = false;
    private _cardBacks: cc.Node[] = [];
    private _bigCards: CardView[] = [];
    // 动画的池的位置（可能是发起，也可能是结尾,计算坐标使用)
    private _potNode: cc.Node = null!;
    // 发牌
    private _dealNode: cc.Node = null!;
    /** 暴露头像节点供视频渲染使用 */
    public get avatarNode(): cc.Node {
        return this.avatar.node;
    }
    public get throwPropNode(): cc.Node {
        return this._throwPropNode;
    }
    public get emojiNode(): cc.Node {
        return this._emojiNode;
    }

    public initData(seatPlayer: TexasGameRoomDataPlayer, potNode: cc.Node, dealNode: cc.Node) {
        this._seatPlayer = seatPlayer;
        this._potNode = potNode;
        this._dealNode = dealNode;
        // 一些无法通过init初始化的状态在这里初始化
        this.winBoard.node.active = false;
        // 绑定数据
        if (this.node.activeInHierarchy) {
            this._bindEventsAndRefresh();
        }
    }

    // 防止内存泄露(简单说就是防止this丢失)
    private _clickEmptySeat: () => void = null!;
    private _clickPlayerInfo: () => void = null!;

    protected onLoad() {
        // 如果绑定点击写这里
        for (let i = 0; i < this.bigCardsContainer.children[0].childrenCount; i++) {
            //Cards/l2r/New Node/Image_Card(CardView)
            const node = this.bigCardsContainer.children[0].children[i].children[0].getComponent(CardView);
            if (node) this._bigCards.push(node);
        }
        for (let i = 0; i < this.smallCardsContainer.children[0].childrenCount; i++) {
            const node = this.smallCardsContainer.children[0].children[i];
            if (node) this._cardBacks.push(node);
        }
        this._clickEmptySeat = () => {
            TexasTableEvent.Sitdown(this._seatPlayer.roomData.mine, this._seatPlayer.seatNo);
        };
        this.emptySeat.node.on('click', this._clickEmptySeat, this);
        this._clickPlayerInfo = () => {
            if (this._seatPlayer.seated) {
                TexasTableEvent.OpenPlayerInfo(this._seatPlayer);
            }
        };
        this.avatar.node.on(cc.Node.EventType.TOUCH_END, this._clickPlayerInfo, this);
        this.insuranceCountdownBubble.node.active = false;
        this.returnToGameButton.node.on('click', this._clickReturnToGame, this);
    }

    protected onEnable(): void {
        if (!this._seatPlayer) return;
        this._bindEventsAndRefresh();
    }

    protected onDisable(): void {
        this._insuranceBuying = false;
        this.insuranceCountdownBubble.node.active = false;
        this.avatarVideoRender.stopMask();
        this.avatarVideoRender.stopOverlay();
        this.setMicrophoneIconState(MicrophoneIconState.HIDDEN);
        unBindEventsAll(this);
    }

    protected onDestroy(): void {
        this.emptySeat?.node.targetOff(this);
        this.avatar?.node.targetOff(this);
        this.userSeat?.targetOff(this);
        this.returnToGameButton?.node.targetOff(this);
    }

    /**
     * 托管全自动事件激活绑定
     */
    private _bindEventsAndRefresh() {
        // 统一激活绑定，注入强类型 tag 推导过滤机制
        autoBindEvents(this, { player: this._seatPlayer, basic: this._seatPlayer.roomData.basicInfo, setting: texasGamePersonalSettings });
    }

    /**
     * 设置麦克风图标状态
     * @param state HIDDEN=不显示, SPEAKING=正在说话, MUTED=麦克风被禁止/未开启
     */
    public setMicrophoneIconState(state: MicrophoneIconState, force: boolean = true): void {
        if (!force && this.micIconSprite.spriteFrame === this.micMutedIcon && this.micIconSprite.node.active) {
            return;
        }
        switch (state) {
            case MicrophoneIconState.SPEAKING:
                if (this.speakingIcon) {
                    this.micIconSprite.spriteFrame = this.speakingIcon;
                    this.micIconSprite.node.active = true;
                } else {
                    this.micIconSprite.node.active = false;
                }
                break;
            case MicrophoneIconState.MUTED:
                if (this.micMutedIcon) {
                    this.micIconSprite.spriteFrame = this.micMutedIcon;
                    this.micIconSprite.node.active = true;
                } else {
                    this.micIconSprite.node.active = false;
                }
                break;
            case MicrophoneIconState.HIDDEN:
            default:
                this.micIconSprite.node.active = false;
                break;
        }
    }

    @bindEvent(TexasGameRoomDataPlayer.ALLIN_WIN_PERCENT, 'player')
    private updateWinPercentLabel(v: number) {
        if (this._seatPlayer.mine != null) {
            this.winPercentNode.node.active = v >= 0;
            this.winPercentNode.setText(v >= 0 ? StringHelper.GetLongString(v) + '%' : '');
        }
    }

    //(优先于seated执行保证展示正确)
    @bindEvent(TexasGameRoomDataPlayer.SEATED_CHANGE, { dataSource: 'player', initPriority: 10 })
    @traceMethod()
    private onUpdateSeated(b: boolean, mine: TexasGameRoomDataPlayerMine) {
        this.userSeat.active = b;
        this.emptySeat.node.active = !b;
        this.emptySeat.interactable = !b;
        // 本人相关,设置属性
        if (b && mine) {
            autoBindEvents(this, { mine: mine });
            return;
        }
        if (!b) {
            this._insuranceBuying = false;
            this.insuranceCountdownBubble.node.active = false;
            this.avatarVideoRender.stopMask();
            this.avatarVideoRender.stopOverlay();
            this.setMicrophoneIconState(MicrophoneIconState.HIDDEN);
        }
        //解绑(自己站起)
        if (mine) {
            unBindEvents(this, 'mine');
        }
    }

    @bindEvent(TexasGameRoomDataPlayer.REMOTE_VIDEO_VISIBLE_CHANGE, 'player')
    private onRemoteVideoVisibleChanged(visible: boolean) {
        if (this._seatPlayer.mine) return;
        if (!visible || !this._seatPlayer.userID) {
            this.avatarVideoRender.stopOverlay();
            return;
        }
        try {
            let rawTrack = agoraManager.getRemoteVideoTrack(this._seatPlayer.userID);
            this.avatarVideoRender.mirror = false;
            this.avatarVideoRender.targetFps = 15;
            this.avatarVideoRender.switchToOverlay(rawTrack.getMediaStreamTrack());
        } catch (e) {
            this.tracelog.error('agoraManager not supported:', this._seatPlayer.userID);
            this.avatarVideoRender.stopOverlay();
        }
    }

    @bindEvent(TexasGameRoomDataPlayer.VIDEO_MASK_CHANGE, 'player')
    private onVideoMaskChanged(maskId: number) {
        if (this._seatPlayer.userID <= 0) return;
        if (maskId <= 0) {
            this.avatarVideoRender.stopMask();
            return;
        }
        let spriteFrame: cc.SpriteFrame = null;
        try {
            spriteFrame = AssetManager.mustGetLoaded(BUNDLE_RESOURCES, `rc/other/videomask/vm${maskId}`, cc.SpriteFrame);
            this.avatarVideoRender.switchToMask(spriteFrame);
        } catch (err) {
            this.tracelog.warn('窗花纹理加载失败:', maskId, (err as Error)?.message);
        }
    }

    @bindEvent(TexasGameRoomDataPlayer.MICROPHONE_ICON_STATE_CHANGE, 'player')
    private onMicrophoneIconStateChanged(state: MicrophoneIconState): void {
        this.setMicrophoneIconState(state);
    }

    @bindEvent(TexasGameRoomDataPlayerMine.LOCAL_CAMERA_STATE_CHANGE_DELAY, 'mine')
    private onLocalCameraStateChanged(state: ButtonState) {
        if (!this._seatPlayer.mine) return;
        if (state == ButtonState.DISABLE) {
            this.avatarVideoRender.stopOverlay();
            return;
        }
        if (state == ButtonState.OFF) {
            this.avatarVideoRender.stopOverlay();
            return;
        }
        try {
            //await GameplayUtil.waitForCondition( () => !!agoraManager.localVideoTrack, 500, 5000);
            const rawTrack = agoraManager.localVideoTrack.getMediaStreamTrack();
            this.avatarVideoRender.mirror = true;
            this.avatarVideoRender.targetFps = 15;
            this.avatarVideoRender.switchToOverlay(rawTrack);
        } catch (e) {
            this.tracelog.warn('agoraManager render video error', this._seatPlayer.userID, e);
            this.avatarVideoRender.stopOverlay();
        }
    }

    @bindEvent(TexasGameRoomDataPlayer.NICKNAME_CHANGE, 'player')
    private onUpdateNickname(na: string) {
        this.nickName.string = na;
    }

    @bindEvent(TexasGameRoomDataPlayer.AVATAR_CHANGE, 'player')
    private onUpdateAvatar(avatar: string) {
        this.avatar.url = avatar;
    }

    @bindEvent(TexasGameRoomDataPlayer.CHIPS_CHANGE, 'player')
    private onUpdateChip(chip: number) {
        this.chips.string = this._seatPlayer.roomData.basicInfo.showNumberWithShowBB(chip);
    }

    @bindEvent(TexasGamePersonalSettings.SHOW_BB, { dataSource: 'setting', initPriority: 99 })
    private onUpdateShowBB(b: number) {
        this.chips.string = this._seatPlayer.roomData.basicInfo.showNumberWithShowBB(this._seatPlayer.chip);
        this.roundBetLabel.string = this._seatPlayer.roomData.basicInfo.showNumberWithShowBB(this._seatPlayer.roundBet);
    }

    @bindEvent(TexasGameRoomDataPlayer.CANPLAYSTATUS_CHANGE, 'player')
    private onUpdateCanPlayStatus(v: Def.CanPlayStatusMap[keyof Def.CanPlayStatusMap]) {
        switch (v) {
            case Def.CanPlayStatus.AGREE_POST:
            case Def.CanPlayStatus.DISABLE:
                this.canPlayStatusNode.node.active = true;
                this.canPlayStatusNode.setText(i18nMgr.Get('adaptation10177'));
                break;
            case Def.CanPlayStatus.NEED_POST:
                this.canPlayStatusNode.node.active = true;
                if (this._seatPlayer.mine != null) {
                    TexasTableEvent.AgreePost(this._seatPlayer.mine);
                }
                this.canPlayStatusNode.setText(i18nMgr.Get('adaptation10177'));
                break;
            default:
                this.canPlayStatusNode.node.active = false;
                break;
        }
    }

    // =============== 鱿鱼（BEGIN）===========================

    @bindEvent(TexasGameRoomDataPlayer.SQUID_COUNT, 'player')
    private onSquidCount(b: number) {
        if (b > 0) {
            this.squidNode.node.active = true;
            this.squidNode.setText(b + '');
            return;
        }
        this.squidNode.node.active = false;
    }

    @bindEvent(TexasGameRoomDataPlayer.SQUID_COUNT, 'player')
    @bindEvent(TexasGameRoomDataPlayer.SQUID_IN, 'player')
    @bindEvent(TexasGameRoomDataBasic.SQUID_ENABLED, 'basic')
    private onRefreshSquidMask(): void {
        this.squidMaskNode.active = this._seatPlayer.squidIn && this._seatPlayer.squidCount == 0;
    }
    // =================== 鱿鱼 （END） ====================

    // onUpdatePosition 位置变动导致的动画/位置调整
    @bindEvent(TexasGameRoomDataPlayer.SEAT_POSITION_CHANGE, 'player', AnimateDisplayTypePosition.Static)
    private onUpdatePosition(pos: SeatPosition, pat: AnimateDisplayTypePosition) {
        switch (pos) {
            case SeatPosition.BottomMiddle:
                if (this._seatPlayer.seated && this._seatPlayer.mine) {
                    this.buttonIcon.setPosition(-320, -30);
                    // 筹码位置
                    this.roudBetIcon.setPosition(-25, 0);
                    this.roundBetNode.setPosition(175, 360);
                    // 大牌的显示位置调整,并隐藏
                    this.bigCardsContainer.setPosition(0, 235);
                    this.bigCardsContainer.setScale(1, 1);
                    this._bigCards.forEach(v => (v.node.parent.active = false));
                    //隐藏名字
                    this.nickName.node.active = false;
                    this.nickNameSplash.active = false;
                } else {
                    this.buttonIcon.setPosition(-160, -120);
                    // 筹码位置
                    this.roudBetIcon.setPosition(-25, 0);
                    this.roundBetNode.setPosition(0, 180);
                    // 大牌的显示位置调整,并隐藏
                    this.bigCardsContainer.setPosition(0, 0);
                    this.bigCardsContainer.setScale(0.65, 0.65);
                    this._bigCards.forEach(v => (v.node.parent.active = false));
                    // 显示名字
                    this.nickName.node.active = true;
                    this.nickNameSplash.active = true;
                }
                this.smallCardsContainer.setPosition(-160, 5);
                this.winPercentNode.node.active = false;
                this.mushroomNode.node.setPosition(75, 92);
                this.mushroomNode.node.scaleX = 1;
                this.mushroomNode.getOpNode(0).scaleX = 1;
                this.mushroomNode.getOpNode(1).scaleX = 1;
                this.squidNode.node.setPosition(75, 70);
                this.squidNode.node.scaleX = 1;
                this.squidNode.getOpNode(0).scaleX = 1;
                this.micIconSprite.node.setPosition(90, 0);
                break;
            case SeatPosition.BottomLeft:
            case SeatPosition.MiddleLeft:
            case SeatPosition.TopLeft:
                this.buttonIcon.setPosition(0, -215);
                this.roudBetIcon.setPosition(-25, 0);
                this.roundBetNode.setPosition(190, -70);
                this.smallCardsContainer.setPosition(160, 5);
                this.bigCardsContainer.setPosition(0, 0);
                this.bigCardsContainer.setScale(0.65, 0.65);
                this.mushroomNode.node.setPosition(75, 92);
                this.mushroomNode.node.scaleX = 1;
                this.mushroomNode.getOpNode(0).scaleX = 1;
                this.mushroomNode.getOpNode(1).scaleX = 1;
                this.squidNode.node.setPosition(75, 70);
                this.squidNode.node.scaleX = 1;
                this.squidNode.getOpNode(0).scaleX = 1;
                this.winPercentNode.node.active = false;
                this.micIconSprite.node.setPosition(-90, 0);
                break;
            case SeatPosition.TopMiddleLeft:
                this.buttonIcon.setPosition(65, -220);
                this.roudBetIcon.setPosition(-25, 0);
                this.roundBetNode.setPosition(-65, -215);
                this.smallCardsContainer.setPosition(-160, 5);
                this.bigCardsContainer.setPosition(0, 0);
                this.bigCardsContainer.setScale(0.65, 0.65);
                this.mushroomNode.node.setPosition(75, 92);
                this.mushroomNode.node.scaleX = 1;
                this.mushroomNode.getOpNode(0).scaleX = 1;
                this.mushroomNode.getOpNode(1).scaleX = 1;
                this.squidNode.node.setPosition(75, 70);
                this.squidNode.node.scaleX = 1;
                this.squidNode.getOpNode(0).scaleX = 1;
                this.winPercentNode.node.active = false;
                this.micIconSprite.node.setPosition(-90, 0);
                break;
            case SeatPosition.TopMiddle:
            case SeatPosition.TopMiddleRight:
                this.buttonIcon.setPosition(65, -220);
                this.roudBetIcon.setPosition(133, 0);
                this.roundBetNode.setPosition(-85, -215);
                this.smallCardsContainer.setPosition(-160, 5);
                this.bigCardsContainer.setPosition(0, 0);
                this.bigCardsContainer.setScale(0.65, 0.65);
                this.mushroomNode.node.setPosition(-75, 92);
                this.mushroomNode.node.scaleX = -1; // 先反转
                this.mushroomNode.getOpNode(0).scaleX = -1; // 文本再转回去
                this.mushroomNode.getOpNode(1).scaleX = -1; // 文本再转回去
                this.squidNode.node.setPosition(-75, 70);
                this.squidNode.node.scaleX = -1; // 先反转
                this.squidNode.getOpNode(0).scaleX = -1; // 文本再转回去
                this.winPercentNode.node.active = false;
                this.micIconSprite.node.setPosition(90, 0);
                break;
            case SeatPosition.TopRight:
            case SeatPosition.MiddleRight:
            case SeatPosition.BottomRight:
                this.buttonIcon.setPosition(0, -215);
                this.roudBetIcon.setPosition(133, 0);
                this.roundBetNode.setPosition(-180, -70);
                this.smallCardsContainer.setPosition(-160, 5);
                this.bigCardsContainer.setPosition(0, 0);
                this.bigCardsContainer.setScale(0.65, 0.65);
                this.mushroomNode.node.setPosition(-75, 92);
                this.mushroomNode.node.scaleX = -1; // 先反转
                this.mushroomNode.getOpNode(0).scaleX = -1; // 文本再转回去
                this.mushroomNode.getOpNode(1).scaleX = -1; // 文本再转回去
                this.squidNode.node.setPosition(-75, 70);
                this.squidNode.node.scaleX = -1; // 先反转
                this.squidNode.getOpNode(0).scaleX = -1; // 文本再转回去
                this.winPercentNode.node.active = false;
                this.micIconSprite.node.setPosition(90, 0);
                break;
        }
        const realPos = seatPostionCaculator.getPosition(pos);
        if (pat == AnimateDisplayTypePosition.ToTarget) {
            this.node.opacity = 0;
            cc.tween(this.node)
                .parallel(cc.tween().to(1, { opacity: 255 }), cc.tween().to(1, { position: realPos.position, scale: realPos.scale }, { easing: 'backOut' }))
                .start();
            return;
        }
        this.node.setScale(realPos.scale, realPos.scale);
        this.node.setPosition(realPos.position);
    }

    @bindEvent(TexasGameRoomDataPlayer.ROUND_BET_CHANGE, 'player', AnimateDisplayTypeRoundBet.Static)
    private onRoundBetChange(amount: number, aat: AnimateDisplayTypeRoundBet) {
        if (amount > 0) {
            this.roundBetNode.active = true;
            if (aat == AnimateDisplayTypeRoundBet.PutNear) {
                soundManager.playEffect(SoundEffectKey.MoveChip);
                this.animatingChips.active = true;
                this.animatingChips.setPosition(0, 0);
                const endPos = UIViewUtil.caculatePostion(this.animatingChips, this.roundBetNode);
                cc.tween(this.animatingChips)
                    .to(0.5, { x: endPos.x, y: endPos.y }, { easing: 'cubicOut' })
                    .call(() => {
                        this.roundBetLabel.string = this._seatPlayer.roomData.basicInfo.showNumberWithShowBB(amount);
                        this.animatingChips.active = false;
                    })
                    .start();
                return;
            }
            this.roundBetLabel.string = this._seatPlayer.roomData.basicInfo.showNumberWithShowBB(amount);
            return;
        }
        this.roundBetNode.active = false;
    }

    // AnimateDisplayTypeCards.Deal 时候还会有order
    @bindEvent(TexasGameRoomDataPlayer.SHOW_CARDS_CHANGE, 'player', AnimateDisplayTypeCards.Static)
    @traceMethod()
    private onUpdateCards(cards: number[], atc: AnimateDisplayTypeCards, order?: number) {
        const l = cards.length;
        if (this._seatPlayer.mine) {
            this.tracelog.debug('up', cards, this._seatPlayer.cards, this._seatPlayer.roundActioned);
        }
        // reset
        if (l == 0) {
            this._bigCards.forEach(v => v.reset());
        }
        if (l > 0 && this._seatPlayer.action == Def.Action.FOLD) {
            this.smallCardsContainer.active = false;
            if (this._seatPlayer.mine) {
                this.bigCardsContainer.active = false;
            }
        } else {
            this.smallCardsContainer.active = true;
            this.bigCardsContainer.active = true;
        }
        const hasShowCard = cards.filter(v => v != 0).length > 0;
        // 如果是显示牌
        if (hasShowCard && (atc == AnimateDisplayTypeCards.Static || atc == AnimateDisplayTypeCards.ShowCards)) {
            // 背面(全部隐藏)
            this._cardBacks.forEach(v => (v.active = false));
            //动作相关隐藏掉
            this.seatActionDisplay.node.active = false;
            if (AnimateDisplayTypeCards.ShowCards == atc) {
                soundManager.playEffect(SoundEffectKey.DealCards);
            }
            //牌面展示
            for (let i = 0; i < this._bigCards.length; i++) {
                //Cards/l2r/New Node/Image_Card(CardView)
                const node = this._bigCards[i];
                if (i < l) {
                    node.node.parent.active = true;
                    node.storeCardNum = cards[i];
                    if (AnimateDisplayTypeCards.ShowCards == atc && cards[i] > 0) {
                        node.animateFlipToFront(node.storeCardNum, 0.6, () => {
                            if (node.delayHighlight) {
                                node.delayHighlight = false;
                                node.highlight(true);
                            }
                        });
                    } else {
                        node.cardNum = cards[i];
                    }
                    continue;
                }
                node.node.parent.active = false;
            }
            return;
        }
        // 以下是把牌正确显示出来, 对应AnimateDisplayTypeCards.Static
        const animateCards: CardView[] = [];
        //其他人
        if (!this._seatPlayer.mine) {
            // 全部显示牌隐藏
            this._bigCards.forEach(v => (v.node.parent.active = false));
            // 背面(显示)
            for (let i = 0; i < this._cardBacks.length; i++) {
                const node = this._cardBacks[i];
                if (i < l) {
                    node.active = true;
                    continue;
                }
                node.active = false;
            }
        } else {
            // 自己
            // 背面(全部隐藏)
            this._cardBacks.forEach(v => (v.active = false));
            // 显示牌先显示背面
            //牌面展示
            if (this._seatPlayer.mine) {
                this.tracelog.debug(cards, this._bigCards.length, this._seatPlayer.seatNo);
            }
            for (let i = 0; i < this._bigCards.length; i++) {
                //Cards/l2r/New Node/Image_Card(CardView)
                const node = this._bigCards[i];
                if (i < l) {
                    node.node.parent.active = true;
                    node.cardNum = 0;
                    node.storeCardNum = cards[i];
                    animateCards.push(node);
                    continue;
                }
                node.node.parent.active = false;
            }
            // 如果是静态就直接展示
            if (atc == AnimateDisplayTypeCards.Static) {
                //动作相关隐藏掉
                this.seatActionDisplay.node.active = false;
                // 直接显示
                animateCards.forEach(nd => {
                    nd.cardNum = nd.storeCardNum;
                });
            }
        }
        // 如果是发牌,则额外做个动画
        if (atc == AnimateDisplayTypeCards.Deal) {
            const currentOrder = order || 0;
            //其他人
            if (!this._seatPlayer.mine) {
                // 转化为本地的
                this._dealNode.active = false;
                this._dealNode.active = false;
                const startPos = UIViewUtil.caculatePostion(this.smallCardsContainer, this._dealNode);
                const endPos = this.smallCardsContainer.position;
                this.smallCardsContainer.setPosition(startPos);
                this.smallCardsContainer.setScale(0.5, 0.5);
                cc.tween(this.smallCardsContainer)
                    .delay(currentOrder * 0.2)
                    .call(() => {
                        soundManager.playEffect(SoundEffectKey.DealCards);
                    })
                    .start();
                cc.tween(this.smallCardsContainer)
                    .delay(currentOrder * 0.2)
                    .to(0.5, { x: endPos.x, y: endPos.y, opacity: 255, scaleX: 1, scaleY: 1 }, { easing: 'cubicOut' })
                    .call(() => {
                        this._dealNode.active = false;
                    })
                    .delay(currentOrder * 0.2)
                    .to(0.5, { x: endPos.x, y: endPos.y, opacity: 255, scaleX: 1, scaleY: 1 }, { easing: 'cubicOut' })
                    .call(() => {
                        this._dealNode.active = false;
                    })
                    .start();
                return;
            }
            // 先获取发牌点的世界坐标
            const startPos = UIViewUtil.caculatePostion(this.bigCardsContainer, this._dealNode);
            const endPos = this.bigCardsContainer.position;
            this.bigCardsContainer.setPosition(startPos);
            this.bigCardsContainer.setScale(0.15, 0.15);
            //延迟发声
            cc.tween(this.bigCardsContainer)
                .delay(currentOrder * 0.2)
                .call(() => {
                    soundManager.playEffect(SoundEffectKey.DealCards);
                })
                .start();
            cc.tween(this.bigCardsContainer)
                .delay(currentOrder * 0.2)
                .to(0.5, { x: endPos.x, y: endPos.y, opacity: 255, scaleX: 1, scaleY: 1 }, { easing: 'cubicOut' })
                .call(() => {
                    this._dealNode.active = false;
                    animateCards.forEach(nd => {
                        // 如果有牌才反转
                        if (nd.storeCardNum > 0) {
                            nd.animateFlipToFront(nd.storeCardNum, 0.6, () => {
                                if (nd.delayHighlight) {
                                    nd.delayHighlight = false;
                                    nd.highlight(true);
                                }
                            });
                        }
                    });
                })
                .start();
        }
    }

    @bindEvent(TexasGameRoomDataPlayer.ACTION_CHANGE, 'player', AnimateDisplayTypeAction.Static)
    private onUpdateAction(action: Def.ActionMap[keyof Def.ActionMap], aat: AnimateDisplayTypeAction) {
        // if (this._seatPlayer.mine) {
        //     this.tracelog.debug(action, aat, this._seatPlayer.seatNo);
        // }
        // 操作结束直接不倒计时
        if (aat == AnimateDisplayTypeAction.Done) {
            this.otherPersonActionCountdown.stop();
            this.otherPersonActionCountdown.node.active = false;
        }
        switch (action) {
            case Def.Action.BET:
                this.seatActionDisplay.node.active = true;
                this.seatActionDisplay.showAction(i18nMgr.Get('UITexas_Bet'), greenColor);
                break;
            case Def.Action.CALL:
                this.seatActionDisplay.node.active = true;
                this.seatActionDisplay.showAction(i18nMgr.Get('adaptation10044'), yellowColor);
                break;
            case Def.Action.FOLD:
                this.seatActionDisplay.node.active = true;
                // 投入的筹码池也隐藏把
                this.roundBetNode.active = false;
                this.seatActionDisplay.fold(i18nMgr.Get('adaptation10047'));
                if (aat == AnimateDisplayTypeAction.Done) {
                    soundManager.playEffect(SoundEffectKey.Fold);
                    if (this._seatPlayer.mine) {
                        const startPos = this.bigCardsContainer.position;
                        const endPos = UIViewUtil.caculatePostion(this.bigCardsContainer, this._dealNode);
                        cc.tween(this.bigCardsContainer)
                            .to(0.8, { x: endPos.x, y: endPos.y, scaleX: 0, scaleY: 0 }, { easing: 'cubicOut' })
                            .call(() => {
                                this.bigCardsContainer.setScale(1, 1);
                                this.bigCardsContainer.setPosition(startPos);
                                this.bigCardsContainer.opacity = 255;
                                this.bigCardsContainer.active = false;
                            })
                            .start();
                        break;
                    }
                    const startPos = this.smallCardsContainer.position;
                    const endPos = UIViewUtil.caculatePostion(this.smallCardsContainer, this._dealNode);
                    cc.tween(this.smallCardsContainer)
                        .to(0.8, { x: endPos.x, y: endPos.y, scaleX: 0, scaleY: 0, opacity: 0 }, { easing: 'cubicInOut' })
                        .call(() => {
                            this.smallCardsContainer.setScale(1, 1);
                            this.smallCardsContainer.setPosition(startPos);
                            this.smallCardsContainer.opacity = 255;
                            this.smallCardsContainer.active = false;
                        })
                        .start();
                }
                break;
            case Def.Action.CHECK:
                if (aat == AnimateDisplayTypeAction.Done) {
                    soundManager.playEffect(SoundEffectKey.Check);
                }
                this.seatActionDisplay.node.active = true;
                this.seatActionDisplay.showAction(i18nMgr.Get('adaptation10046'), yellowColor);
                break;
            case Def.Action.RAISE:
                // if (aat == AnimateDisplayTypeAction.Done) {
                //     soundManager.playEffect(SoundEffectKey.RaiseBetCallPost);
                // }
                this.seatActionDisplay.node.active = true;
                this.seatActionDisplay.showAction(i18nMgr.Get('adaptation10045'), greenColor);
                break;
            case Def.Action.ALLIN:
                if (aat == AnimateDisplayTypeAction.Done) {
                    soundManager.playEffect(SoundEffectKey.AllIn);
                    if (this._seatPlayer.mine) {
                        this.allInAnimation.node.active = true;
                        this.allInAnimation.setAnimation(0, 'animation', false);
                        this.allInAnimation.setCompleteListener(() => {
                            //cc.log("动画结束");
                            this.allInAnimation.node.active = false;
                            this._showAllinAction();
                        });
                        break;
                    }
                    this.allInOtherAnimation.node.active = true;
                    this.allInOtherAnimation.setAnimation(0, 'animation', false);
                    this.allInOtherAnimation.setCompleteListener(() => {
                        //cc.log("动画结束");
                        this.allInOtherAnimation.node.active = false;
                        this._showAllinAction();
                    });
                    break;
                }
                this._showAllinAction();
                break;
            case Def.Action.POST:
            case Def.Action.POSTANTE:
                // if (aat == AnimateDisplayTypeAction.Done) {
                //     soundManager.playEffect(SoundEffectKey.RaiseBetCallPost);
                // }
                this.seatActionDisplay.node.active = true;
                this.seatActionDisplay.showAction(i18nMgr.Get('UITexas_addBlind'), yellowColor);
                break;
            case Def.Action.SB:
                if (aat == AnimateDisplayTypeAction.Done) {
                    soundManager.playEffect(SoundEffectKey.SB);
                }
                break;
            case Def.Action.BB:
                if (aat == AnimateDisplayTypeAction.Done) {
                    soundManager.playEffect(SoundEffectKey.BB);
                }
                break;
            default:
                this.seatActionDisplay.node.active = false;
                break;
        }
    }

    /** 显示【全下】气泡；保险购买中不显示（只显示【购买中XXs】气泡） */
    private _showAllinAction(): void {
        if (this._insuranceBuying) return;
        this.seatActionDisplay.node.active = true;
        this.seatActionDisplay.showAction(i18nMgr.Get('adaptation30074'), redColor);
    }

    /** 退出保险购买态：隐藏保险气泡，若玩家仍处于全下则恢复【全下】气泡 */
    private _exitInsuranceBuying(): void {
        if (!this._insuranceBuying) return;
        this._insuranceBuying = false;
        this.insuranceCountdownBubble.stop();
        this.insuranceCountdownBubble.node.active = false;
        if (this._seatPlayer?.action === Def.Action.ALLIN) {
            this._showAllinAction();
        }
    }

    @bindEvent(TexasGameRoomDataPlayer.PREPARE_OPERATION, 'player')
    private onPrepareAction(oper: Operator) {
        // this.tracelog.debug(oper, this._seatPlayer.seatNo);
        if (!oper) {
            this.otherPersonActionCountdown.stop();
            this.otherPersonActionCountdown.node.active = false;
            this._exitInsuranceBuying();
            this.insuranceCountdownBubble.stop();
            this.insuranceCountdownBubble.node.active = false;
            return;
        }
        if (oper.opType === OpertionType.INSURANCE) {
            // 购买保险状态：隐藏全下等 action 气泡，只显示【购买中XXs】
            this._insuranceBuying = true;
            this.seatActionDisplay.node.active = false;
            this.insuranceCountdownBubble.node.active = true;
            this.insuranceCountdownBubble.startCountDown({
                durationSeconds: oper.leftOpDuration,
                // 多语言模板 adaptation20062=购买中##s，## 为剩余秒数占位符
                formatter: s => CPErrorCode.LanguageDescription(20062, [String(s)]),
                onComplete: () => {
                    this._exitInsuranceBuying();
                }
            });
        } else {
            this._exitInsuranceBuying();
        }
        this.otherPersonActionCountdown.node.active = true;
        this.otherPersonActionCountdown.startTimer({
            totalTime: oper.totalOpDuration,
            elapsedTime: oper.elapsedTime,
            onComplete: () => {
                this.otherPersonActionCountdown.stop();
                this.otherPersonActionCountdown.node.active = false;
            }
        });
    }

    @bindEvent(TexasGameRoomDataPlayer.WINNER, { dataSource: 'player', initIgnore: true })
    private onWin(play: boolean, handValueType: number, chip: number) {
        if (!play) {
            this.winBoard.node.active = false;
            return;
        }
        this.winBoard.node.active = true;
        if (handValueType != 0) {
            this.winBoard.getOpNode(0).active = true; //hv
            this.winBoard.getOpNode(1).active = true; //slash
            this.winBoard.getOpNode(2).active = false; // space
            const hv = handValueType as HandValueType;
            this.winBoard.setText(handValueTypeToString(hv), this._seatPlayer.roomData.basicInfo.showNumberWithShowBB(chip));
        } else {
            this.winBoard.getOpNode(0).active = false; //hv
            this.winBoard.getOpNode(1).active = false; //slash
            this.winBoard.getOpNode(2).active = true; // space
            this.winBoard.setText('', this._seatPlayer.roomData.basicInfo.showNumberWithShowBB(chip));
        }
        soundManager.playEffect(SoundEffectKey.MoveChip);
        this.animatingChips.active = true;
        const startPos = UIViewUtil.caculatePostion(this.animatingChips, this._potNode);
        const endPos = new cc.Vec3(0, 0, 0);
        this.animatingChips.setPosition(startPos);
        this.animatingChips.setScale(1.5, 1.5);
        cc.tween(this.animatingChips)
            .to(1.0, { x: endPos.x, y: endPos.y, scaleX: 1, scaleY: 1 }, { easing: 'cubicOut' })
            .call(() => {
                this.animatingChips.active = false;
            })
            .start();
        this.winAnimation.node.active = true;
        this.winAnimation.setAnimation(0, 'animation', false);
        this.winAnimation.setCompleteListener(() => {
            //cc.log("动画结束");
            this.winAnimation.node.active = false;
        });
    }

    private _clickReturnToGame() {
        if (this._onReturnGameCallback) {
            this._onReturnGameCallback();
        }
    }

    private _onReturnGameCallback: () => void = null!;

    @traceMethod()
    private createReturnToGameClick(r: Def.KeepSeatReasonMap[keyof Def.KeepSeatReasonMap]): () => void {
        if (r == Def.KeepSeatReason.KSR_NONE) {
            this.returnToGameButton.node.active = false;
        } else {
            this.returnToGameButton.node.active = true;
        }
        this.tracelog.debug('ksr', r);
        return () => {
            switch (r) {
                case Def.KeepSeatReason.KSR_NONE:
                    break;
                case Def.KeepSeatReason.KSR_TAKE_SEAT:
                case Def.KeepSeatReason.KSR_ACTIVE:
                case Def.KeepSeatReason.KSR_DELAY_LEAVE:
                    if (this._seatPlayer.chip > 0) {
                        TexasTableEvent.CancelKeepSeat(this._seatPlayer.mine);
                        break;
                    }
                    TexasTableEvent.BringIn(this._seatPlayer.mine);
                    break;
                case Def.KeepSeatReason.KSR_NOCHIP:
                    TexasTableEvent.BringIn(this._seatPlayer.mine);
                    break;
            }
        };
    }

    @bindEvent(TexasGameRoomDataPlayer.POPUP_CARDS, { dataSource: 'player', initIgnore: true })
    private onPopupCards(cardsNum: number[]) {
        const mp: Set<number> = new Set(cardsNum);
        this._bigCards.forEach(cd => {
            if (mp.has(cd.storeCardNum)) {
                cd.popUp(new cc.Vec2(0, 10));
            } else {
                cd.gray(true);
            }
        });
    }

    @bindEvent(TexasGameRoomDataPlayer.KEEPSEAT_CHANGE, 'player')
    @traceMethod()
    private onKeepSeatStart(b: boolean, deadline: number, reason: Def.KeepSeatReasonMap[keyof Def.KeepSeatReasonMap]) {
        if (b) {
            this.returnToGameLabel.i18NString = reason == Def.KeepSeatReason.KSR_DELAY_LEAVE ? 'UIDelayLeave' : 'UITesas_Leave';
            this.keepSeatTimer.node.active = true;
            if (deadline > Date.now() / 1000) {
                this.keepSeatTimer.startTimer({
                    totalTime: Math.ceil(deadline - Date.now() / 1000),
                    onComplete: () => {
                        this.keepSeatTimer.stop();
                        this.keepSeatTimer.node.active = false;
                    }
                });
            } else {
                this.keepSeatTimer.stop();
            }
            this.tracelog.debug(this._seatPlayer.seatNo, this._seatPlayer.mine);
            if (this._seatPlayer.mine) {
                this._onReturnGameCallback = this.createReturnToGameClick(reason);
            }
            return;
        }
        this.returnToGameLabel.i18NString = 'UITesas_Leave';
        this.keepSeatTimer.stop();
        this.keepSeatTimer.node.active = false;
    }

    @bindEvent(TexasGameRoomDataPlayerMine.STORECHIPS_CHANGE, 'mine')
    private onStoreChipChange(v: number) {}

    @bindEvent(TexasGameRoomDataPlayerMine.HAND_VALUE_TYPE_CHANGE, 'mine')
    @traceMethod()
    private onHadnValueChange(v: string) {
        if (v != '') {
            this.handValueTypeNode.node.active = true;
            this.handValueTypeNode.setText(v);
            return;
        }
        this.handValueTypeNode.node.active = false;
        this.handValueTypeNode.setText('');
    }

    @bindEvent(TexasGameRoomDataPlayerMine.HIGHLIGHT_CARDS, { dataSource: 'mine', initIgnore: true })
    private onHighlightCards(cardsNum: number[]) {
        const mp: Set<number> = new Set(cardsNum);
        this._bigCards.forEach(cd => {
            if (mp.has(cd.storeCardNum)) {
                if (cd.cardNum == cd.storeCardNum) {
                    cd.highlight(true);
                } else {
                    cd.delayHighlight = true;
                }
            } else {
                cd.highlight(false);
            }
        });
    }

    public animateButtonChange(enable: boolean, positionFromNode?: cc.Node) {
        this.buttonIcon.active = enable;
        if (enable && positionFromNode) {
            const startPos = UIViewUtil.caculatePostion(this.buttonIcon, positionFromNode);
            const endPos = this.buttonIcon.position;
            this.buttonIcon.setPosition(startPos);
            cc.tween(this.buttonIcon).to(0.6, { x: endPos.x, y: endPos.y }, { easing: 'cubicOut' }).start();
        }
    }

    public animateMushroomChange(enable: boolean, mushroomCount: number, amount: number, positionFromNode?: DisplayNode) {
        this.mushroomNode.node.active = enable;
        if (enable && positionFromNode) {
            const startPos = UIViewUtil.caculatePostion(this.mushroomNode.node, positionFromNode.node);
            const startScaleX = positionFromNode.node.scaleX;
            const endPos = this.mushroomNode.node.position;
            const endScaleX = this.mushroomNode.node.scaleX;
            this.mushroomNode.node.setPosition(startPos);
            this.mushroomNode.node.setScale(startScaleX, 1);
            this.mushroomNode.getOpNode(0).opacity = 0;
            this.mushroomNode.getOpNode(1).opacity = 0;
            this.mushroomNode.setText(mushroomCount + '', StringHelper.GetLongString(amount));
            cc.tween(this.mushroomNode.node)
                .to(0.6, { x: endPos.x, y: endPos.y, scaleX: endScaleX, scaleY: 1 }, { easing: 'cubicOut' })
                .call(() => {
                    this.mushroomNode.getOpNode(0).opacity = 255;
                    this.mushroomNode.getOpNode(1).opacity = 255;
                })
                .start();
        } else if (enable) {
            this.mushroomNode.setText(mushroomCount + '', StringHelper.GetLongString(amount));
        }
    }
}
