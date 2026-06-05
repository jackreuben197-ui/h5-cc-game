import { autoBindEvents, bindEvent, unBindEvents, unBindEventsAll } from '../../../../core/decorator/DataBind';
import { traceClass, traceMethod } from '../../../../core/decorator/LogTrace';
import { Operator, OperatorMine } from '../../../../data/room/texas/model/Operator';
import TexasGameRoomDataPlayer from '../../../../data/room/texas/TexasGameRoomDataPlayer';
import TexasGameRoomDataPlayerMine from '../../../../data/room/texas/TexasGameRoomDataPlayerMine';
import { SeatPosition } from '../../../../data/room/texas/TexasGameRoomDataSeatsStateManager';
import TexasGameRoomDataSetting from '../../../../data/room/texas/TexasGameRoomDataSetting';
import {
    AnimateDisplayTypeAction,
    AnimateDisplayTypeCards,
    AnimateDisplayTypePosition,
    AnimateDisplayTypeRoundBet
} from '../../../../game/constant/AnimateDisplayType';
import { StringHelper } from '../../../../helper/StringHelper';
import { i18nMgr } from '../../../../i18n/i18nMgr';
import { Def } from '../../../../protobuf/holdem/define_pb';
import UIViewUtil from '../../../util/UIViewUtil';
import CardView from '../../../widget/CardView';
import RemoteSprite from '../../../widget/RemoteSprite';
import ShiningPathTimer from '../../../widget/ShiningPathTimer';
import TexasTableEvent from './events/TexasTableEvent';
import Operation from './Operation';
import SeatAction from './SeatAction';

const { ccclass, property, menu } = cc._decorator;

const seatArrange: Record<SeatPosition, cc.Vec3> = {
    [SeatPosition.Default]: cc.v3(0, 0),
    [SeatPosition.BottomMiddle]: cc.v3(0, -2270), // 0 下中
    [SeatPosition.BottomLeft]: cc.v3(-480, -1585), // 1 左下
    [SeatPosition.MiddleLeft]: cc.v3(-480, -1130), // 2 左中
    [SeatPosition.TopLeft]: cc.v3(-480, -730), // 3 左上
    [SeatPosition.TopLeft1]: cc.v3(-165, -440), // 4 上左
    [SeatPosition.TopMiddle]: cc.v3(0, -440), // 5 上中
    [SeatPosition.TopRight1]: cc.v3(165, -440), // 6 上右
    [SeatPosition.TopRight]: cc.v3(480, -730), // 7 右上
    [SeatPosition.MiddleRight]: cc.v3(480, -1130), // 8 右中
    [SeatPosition.BottomRight]: cc.v3(480, -1585), // 9 右下
    [SeatPosition.TopLeft7]: cc.v3(-480, -1065), // 8 7 人桌的修正
    [SeatPosition.TopRight7]: cc.v3(480, -1065) // 9 7 人桌的修正
};

const redColor = cc.Color.fromHEX(new cc.Color(), '#FA2B4B');

const greenColor = cc.Color.fromHEX(new cc.Color(), '#78E4E4');

const yellowColor = cc.Color.fromHEX(new cc.Color(), '#F9CA9F');

@ccclass
@menu('CrazyPoker/Room/Texas/SeatPlayer')
@traceClass()
export default class SeatPlayer extends cc.Component {
    @property(cc.Label)
    private nickName: cc.Label = null!;
    @property(cc.Node)
    private nickNameSplash: cc.Node = null!; // 分割线
    @property(RemoteSprite)
    private avatar: RemoteSprite = null!;
    @property(cc.Label)
    private chips: cc.Label = null!;
    @property(cc.Button)
    private emptySeat: cc.Button = null!;
    @property(cc.Node)
    private userSeat: cc.Node = null!;
    @property(cc.Node)
    public buttonIcon: cc.Node = null!; // 无奈放开吧
    @property(cc.Node)
    private smallCardsContainer: cc.Node = null!;
    // round bet related
    @property(cc.Node)
    private roundBetNode: cc.Node = null!;
    @property(cc.Label)
    private roundBetLabel: cc.Label = null!;
    @property(cc.Node)
    private roudBetIcon: cc.Node = null!;
    @property(cc.Node)
    private bigCardsContainer: cc.Node = null!;
    @property(cc.Node)
    private animatingChips: cc.Node = null!;
    @property(SeatAction)
    private seatActionDisplay: SeatAction = null!;
    @property(ShiningPathTimer)
    private otherPersonActionCountdown: ShiningPathTimer = null!;
    @property(sp.Skeleton)
    private winAnimation: sp.Skeleton = null!;
    @property(ShiningPathTimer)
    private keepSeatTimer: ShiningPathTimer = null;
    @property(cc.Node)
    private winPercent: cc.Node = null!;
    @property(cc.Label)
    private winPercentLabel: cc.Label = null!;
    @property({ type: cc.Node, displayName: '游戏状态CanPlayStatus' })
    private canPlayStatusNode: cc.Node = null;
    private _seatPlayer: TexasGameRoomDataPlayer = null!;
    private _setting: TexasGameRoomDataSetting = null!;
    private _cardBacks: cc.Node[] = [];
    private _bigCards: CardView[] = [];
    // 动画的池的位置（可能是发起，也可能是结尾,计算坐标使用)
    private _potNode: cc.Node = null!;
    // 发牌
    private _dealNode: cc.Node = null!;

    public initData(seatPlayer: TexasGameRoomDataPlayer, potNode: cc.Node, dealNode: cc.Node) {
        this._seatPlayer = seatPlayer;
        this._setting = seatPlayer.roomData.setting;
        this._potNode = potNode;
        this._dealNode = dealNode;
        if (this.node.activeInHierarchy) {
            this._bindEventsAndRefresh();
        }
    }

    // 防止内存泄露(简单说就是防止this丢失)
    private _clickEmptySeat: () => void = null!;

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
    }

    protected onEnable(): void {
        if (!this._seatPlayer) return;
        this._bindEventsAndRefresh();
    }

    protected onDisable(): void {
        unBindEventsAll(this);
    }

    /**
     * 托管全自动事件激活绑定
     */
    private _bindEventsAndRefresh() {
        // 统一激活绑定，注入强类型 tag 推导过滤机制
        autoBindEvents(this, { player: this._seatPlayer, setting: this._setting });
    }

    @bindEvent(TexasGameRoomDataPlayer.ALLIN_WIN_PERCENT, 'player')
    private updateWinPercentLabel(v: number) {
        if (this._seatPlayer.mine != null) {
            this.winPercent.active = v >= 0;
            this.winPercentLabel.string = v >= 0 ? StringHelper.GetLongString(v) + '%' : '';
        }
    }

    //(优先于seated执行保证展示正确)
    @bindEvent(TexasGameRoomDataPlayer.SEATED_CHANGE, { dataSource: 'player', initPriority: 10 })
    private onUpdateSeated(b: boolean, mine: TexasGameRoomDataPlayer) {
        this.userSeat.active = b;
        this.emptySeat.node.active = !b;
        this.emptySeat.interactable = !b;
        // 本人相关,设置属性
        if (b && mine) {
            autoBindEvents(this, { mine: mine });
            return;
        }
        //解绑(自己站起)
        if (mine) {
            unBindEvents(this, 'mine');
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
        this.chips.string = this._setting.showNumberWithShowBB(chip);
    }

    @bindEvent(TexasGameRoomDataSetting.SHOW_BB, { dataSource: 'setting', initPriority: 99 })
    private onUpdateShowBB(b: number) {
        this.chips.string = this._setting.showNumberWithShowBB(this._seatPlayer.chip);
        this.roundBetLabel.string = this._setting.showNumberWithShowBB(this._seatPlayer.roundBet);
    }

    @bindEvent(TexasGameRoomDataPlayer.CANPLAYSTATUS_CHANGE, 'player')
    private onUpdateCanPlayStatus(v: Def.CanPlayStatusMap[keyof Def.CanPlayStatusMap]) {
        switch (v) {
            case Def.CanPlayStatus.DISABLE:
        }
    }

    // onUpdatePosition 位置变动导致的动画/位置调整
    @bindEvent(TexasGameRoomDataPlayer.SEAT_POSITION_CHANGE, 'player', AnimateDisplayTypePosition.Static)
    private onUpdatePosition(pos: SeatPosition, pat: AnimateDisplayTypePosition) {
        switch (pos) {
            case SeatPosition.BottomMiddle:
                if (this._seatPlayer.seated && this._seatPlayer.mine) {
                    this.buttonIcon.setPosition(-320, -30);
                    // 筹码位置
                    this.roudBetIcon.setPosition(-25, 0);
                    this.roundBetNode.setPosition(135, 345);
                    // 大牌的显示位置调整,并隐藏
                    this.bigCardsContainer.setPosition(0, 220);
                    this.bigCardsContainer.setScale(1, 1);
                    this._bigCards.forEach(v => (v.node.parent.active = false));
                    //隐藏名字
                    this.nickName.node.active = false;
                    this.nickNameSplash.active = false;
                } else {
                    this.winPercent.active = false;
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
                this.roundBetNode.setPosition(0, 180);
                this.winPercent.active = false;
                break;
            case SeatPosition.BottomLeft:
            case SeatPosition.MiddleLeft:
            case SeatPosition.TopLeft:
            case SeatPosition.TopLeft7:
                this.buttonIcon.setPosition(0, -215);
                this.roudBetIcon.setPosition(-25, 0);
                this.roundBetNode.setPosition(190, -70);
                this.smallCardsContainer.setPosition(160, 5);
                this.bigCardsContainer.setPosition(0, 0);
                this.bigCardsContainer.setScale(0.65, 0.65);
                this.winPercent.active = false;
                break;
            case SeatPosition.TopLeft1:
                this.buttonIcon.setPosition(65, -220);
                this.roudBetIcon.setPosition(-25, 0);
                this.roundBetNode.setPosition(-65, -215);
                this.smallCardsContainer.setPosition(-160, 5);
                this.bigCardsContainer.setPosition(0, 0);
                this.bigCardsContainer.setScale(0.65, 0.65);
                this.winPercent.active = false;
                break;
            case SeatPosition.TopMiddle:
            case SeatPosition.TopRight1:
                this.buttonIcon.setPosition(65, -220);
                this.roudBetIcon.setPosition(133, 0);
                this.roundBetNode.setPosition(-85, -215);
                this.smallCardsContainer.setPosition(-160, 5);
                this.bigCardsContainer.setPosition(0, 0);
                this.bigCardsContainer.setScale(0.65, 0.65);
                this.winPercent.active = false;
                break;
            case SeatPosition.TopRight:
            case SeatPosition.MiddleRight:
            case SeatPosition.BottomRight:
            case SeatPosition.TopRight7:
                this.buttonIcon.setPosition(0, -215);
                this.roudBetIcon.setPosition(133, 0);
                this.roundBetNode.setPosition(-180, -70);
                this.smallCardsContainer.setPosition(-160, 5);
                this.bigCardsContainer.setPosition(0, 0);
                this.bigCardsContainer.setScale(0.65, 0.65);
                this.winPercent.active = false;
                break;
        }
        const realPos = seatArrange[pos];
        if (pat == AnimateDisplayTypePosition.ToTarget) {
            this.node.opacity = 0;
            cc.tween(this.node)
                .parallel(cc.tween().to(1, { opacity: 255 }), cc.tween().to(1, { position: realPos }, { easing: 'backOut' }))
                .start();
            return;
        }
        this.node.setPosition(realPos);
    }

    @bindEvent(TexasGameRoomDataPlayer.ROUND_BET_CHANGE, 'player', AnimateDisplayTypeRoundBet.Static)
    private onRoundBetChange(amount: number, aat: AnimateDisplayTypeRoundBet) {
        if (amount > 0) {
            this.roundBetNode.active = true;
            if (aat == AnimateDisplayTypeRoundBet.PutNear) {
                this.animatingChips.active = true;
                this.animatingChips.setPosition(0, 0);
                const endPos = UIViewUtil.caculatePostion(this.animatingChips, this.roundBetNode);
                cc.tween(this.animatingChips)
                    .to(0.5, { x: endPos.x, y: endPos.y }, { easing: 'cubicOut' })
                    .call(() => {
                        this.roundBetLabel.string = this._setting.showNumberWithShowBB(amount);
                        this.animatingChips.active = false;
                    })
                    .start();
                return;
            }
            this.roundBetLabel.string = this._setting.showNumberWithShowBB(amount);
            return;
        }
        this.roundBetNode.active = false;
    }

    // AnimateDisplayTypeCards.Deal 时候还会有order
    @bindEvent(TexasGameRoomDataPlayer.SHOW_CARDS_CHANGE, 'player', AnimateDisplayTypeCards.Static)
    private onUpdateCards(cards: number[], atc: AnimateDisplayTypeCards, order?: number) {
        const l = cards.length;
        // reset
        if (l == 0) {
            this._bigCards.forEach(v => v.highlight(false));
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
            //牌面展示
            for (let i = 0; i < this._bigCards.length; i++) {
                //Cards/l2r/New Node/Image_Card(CardView)
                const node = this._bigCards[i];
                if (i < l) {
                    node.node.parent.active = true;
                    if (AnimateDisplayTypeCards.ShowCards == atc && cards[i] > 0) {
                        node.animateFlipToFront(cards[i], 0.6);
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
                // 等后面操作
                if (!this._seatPlayer.directlyViewCard) return;
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
            this.bigCardsContainer.setScale(0.5, 0.5);
            cc.tween(this.bigCardsContainer)
                .delay(currentOrder * 0.2)
                .to(0.5, { x: endPos.x, y: endPos.y, opacity: 255, scaleX: 1, scaleY: 1 }, { easing: 'cubicOut' })
                .call(() => {
                    this._dealNode.active = false;
                    if (this._seatPlayer.delayViewCard) return;
                    animateCards.forEach(nd => {
                        nd.animateFlipToFront(nd.storeCardNum, 0.6);
                    });
                })
                .start();
        }
    }

    @bindEvent(TexasGameRoomDataPlayer.ACTION_CHANGE, 'player', AnimateDisplayTypeAction.Static)
    private onUpdateAction(action: Def.ActionMap[keyof Def.ActionMap], aat: AnimateDisplayTypeAction) {
        if (this._seatPlayer.mine) {
            this.tracelog.debug(action, aat, this._seatPlayer.seatNo);
        }
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
                this.seatActionDisplay.fold(i18nMgr.Get('adaptation10047'));
                if (aat == AnimateDisplayTypeAction.Done) {
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
                this.seatActionDisplay.node.active = true;
                this.seatActionDisplay.showAction(i18nMgr.Get('adaptation10046'), yellowColor);
                break;
            case Def.Action.RAISE:
                this.seatActionDisplay.node.active = true;
                this.seatActionDisplay.showAction(i18nMgr.Get('adaptation10045'), greenColor);
                break;
            case Def.Action.ALLIN:
                this.seatActionDisplay.node.active = true;
                this.seatActionDisplay.showAction(i18nMgr.Get('adaptation30074'), redColor);
                break;
            default:
                this.seatActionDisplay.node.active = false;
        }
    }

    @bindEvent(TexasGameRoomDataPlayer.PREPARE_OPERATION, 'player')
    private onPrepareAction(oper: Operator) {
        // this.tracelog.debug(oper, this._seatPlayer.seatNo);
        if (!oper) {
            this.otherPersonActionCountdown.stop();
            this.otherPersonActionCountdown.node.active = false;
            return;
        }
        this.otherPersonActionCountdown.node.active = true;
        this.otherPersonActionCountdown.startTimer({
            totalTime: oper.totalOpDuration,
            elapsedTime: oper.totalOpDuration - oper.leftOpDuration,
            onComplete: () => {
                this.otherPersonActionCountdown.stop();
                this.otherPersonActionCountdown.node.active = false;
            }
        });
    }

    @bindEvent(TexasGameRoomDataPlayer.WINNER, { dataSource: 'player', initIgnore: true })
    private onWin() {
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

    @bindEvent(TexasGameRoomDataPlayerMine.HIGHLIGHT_CARDS, { dataSource: 'player', initIgnore: true })
    private onHighlightCards(cardsNum: number[]) {
        const mp: Set<number> = new Set();
        cardsNum.forEach(v => mp.add(v));
        this._bigCards.forEach(cd => {
            if (mp.has(cd.cardNum)) {
                cd.highlight(true);
            } else {
                cd.highlight(false);
            }
        });
    }

    @bindEvent(TexasGameRoomDataPlayer.KEEPSEAT_CHANGE, 'player')
    private onKeepSeatStart(b: boolean, deadline: number, reason: Def.KeepSeatReasonMap[keyof Def.KeepSeatReasonMap]) {
        if (b) {
            this.keepSeatTimer.node.active = true;
            this.keepSeatTimer.startTimer({
                totalTime: Math.ceil(deadline - Date.now() / 1000),
                onComplete: () => {
                    this.keepSeatTimer.stop();
                    this.keepSeatTimer.node.active = false;
                }
            });
            return;
        }
        this.keepSeatTimer.stop();
        this.keepSeatTimer.node.active = false;
    }

    @bindEvent(TexasGameRoomDataPlayerMine.STORECHIPS_CHANGE, 'mine')
    @traceMethod({ level: 'debug' })
    private onStoreChipChange(v: number) {}

    public animateButtonChange(enable: boolean, positionFromNode?: cc.Node) {
        this.buttonIcon.active = enable;
        if (enable && positionFromNode) {
            const startPos = UIViewUtil.caculatePostion(this.buttonIcon, positionFromNode);
            const endPos = this.buttonIcon.position;
            this.buttonIcon.setPosition(startPos);
            cc.tween(this.buttonIcon).to(0.6, { x: endPos.x, y: endPos.y }, { easing: 'cubicOut' }).start();
        }
    }
}
