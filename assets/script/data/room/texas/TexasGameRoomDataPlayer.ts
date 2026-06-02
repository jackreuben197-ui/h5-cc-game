import { bindData, IObservableBindings, observable, pureEvent } from '../../../core/decorator/DataBind';
import { traceClass } from '../../../core/decorator/LogTrace';
import {
    AnimateDisplayTypeAction,
    AnimateDisplayTypeCards,
    AnimateDisplayTypePosition,
    AnimateDisplayTypeRoundBet
} from '../../../game/constant/AnimateDisplayType';
import { VideoModel } from '../../../game/constant/VideoModel';
import { Def } from '../../../protobuf/holdem/define_pb';
import { Operator } from './model/Operator';
import TexasGameRoomData from './TexasGameRoomData';
import TexasGameRoomDataPlayerMine from './TexasGameRoomDataPlayerMine';
import { SeatPosition } from './TexasGameRoomDataSeatsStateManager';

type PlayerAnimBindings = {
    action: [AnimateDisplayTypeAction];
    roundBet: [AnimateDisplayTypeRoundBet];
    cards: [AnimateDisplayTypeCards, number?];
    position: [AnimateDisplayTypePosition];
};

/**
 * 核心修正：利用同名接口和类的特性，两边都不要加单独的 export。
 * 这样它们在当前文件内无缝合并。
 */
interface TexasGameRoomDataPlayer extends IObservableBindings<TexasGameRoomDataPlayer, PlayerAnimBindings> {}

@bindData()
@traceClass()
class TexasGameRoomDataPlayer extends cc.EventTarget {
    public static readonly ACTION_CHANGE = 'ACTION_CHANGE';
    public static readonly SEAT_POSITION_CHANGE = 'SEAT_POSITION_CHANGE';
    public static readonly SHOW_CARDS_CHANGE = 'SHOW_CARDS_CHANGE';
    public static readonly NICKNAME_CHANGE = 'NICKNAME_CHANGE';
    public static readonly AVATAR_CHANGE = 'AVATAR_CHANGE';
    public static readonly CHIPS_CHANGE = 'CHIPS_CHANGE';
    public static readonly ROUND_BET_CHANGE = 'ROUND_BET_CHANGE';
    public static readonly PREPARE_OPERATION = 'PREPARE_OPERATION';
    public static readonly EMPTY_SEAT = 'EMPTY_SEAT';
    public static readonly WINNER = 'WINNER';
    private _parentRoomData: TexasGameRoomData;
    public get roomData() {
        return this._parentRoomData;
    }
    public readonly seatNo: number;
    public userID: number;
    public clubID: number;
    public handBet: number;
    public mine: TexasGameRoomDataPlayerMine = null;
    public roundActioned: boolean;
    public deposit: number;

    constructor(seatNo: number, position: SeatPosition, roomData: TexasGameRoomData) {
        super();
        this.seatNo = seatNo;
        this.position = position;
        this._parentRoomData = roomData;
    }

    public get delayViewCard() {
        return this._parentRoomData.basicInfo.delaySeeCard;
    }
    public get directlyViewCard() {
        return this._parentRoomData.basicInfo.gameStatus >= Def.GameStatus.HAND_PREFLOP && this.roundActioned;
    }
    public get needVideoPermision() {
        return this._parentRoomData.basicInfo.videoModel !== VideoModel.NONE;
    }
    // =========================================================================
    // 响应式核心字段拦截配置区域
    // =========================================================================
    @observable(TexasGameRoomDataPlayer.ACTION_CHANGE)
    public action: Def.ActionMap[keyof Def.ActionMap] = Def.Action.NONE;
    @observable(TexasGameRoomDataPlayer.SEAT_POSITION_CHANGE)
    public position: SeatPosition = SeatPosition.Default;
    @observable(TexasGameRoomDataPlayer.SHOW_CARDS_CHANGE)
    public cards: number[] = [];
    @observable(TexasGameRoomDataPlayer.NICKNAME_CHANGE)
    public name: string = '';
    @observable(TexasGameRoomDataPlayer.AVATAR_CHANGE)
    public avatar: string = '';
    @observable(TexasGameRoomDataPlayer.CHIPS_CHANGE)
    public chip: number = 0;
    @observable(TexasGameRoomDataPlayer.ROUND_BET_CHANGE)
    public roundBet: number = 0;
    @observable(TexasGameRoomDataPlayer.PREPARE_OPERATION)
    public operator: Operator = null!;
    // =========================================================================
    // 扑克核心桌面业务方法层实现
    // =========================================================================
    @pureEvent(TexasGameRoomDataPlayer.EMPTY_SEAT)
    public emptySeat() {
        this.muteEvents();
        this.userID = 0;
        this.clubID = 0;
        this.chip = 0;
        this.avatar = '';
        this.name = '';
        this.mine = null;
        this.cards = [];
        this.unmuteEvents();
        // this.emit(TexasGameRoomDataPlayer.EMPTY_SEAT);
    }

    @pureEvent(TexasGameRoomDataPlayer.WINNER)
    public claimWin() {}

    public handClear() {
        if (this.userID > 0) {
            this.setAction(Def.Action.NONE, AnimateDisplayTypeAction.Done);
            this.handBet = 0;
            this.setRoundBet(0, AnimateDisplayTypeRoundBet.Static);
            this.setCards([], AnimateDisplayTypeCards.Static, 0);
            this.roundActioned = false;
        }
    }

    public roundClear() {
        if (this.userID > 0) {
            if (this.action != Def.Action.FOLD && this.action != Def.Action.ALLIN) {
                this.setAction(Def.Action.READY, AnimateDisplayTypeAction.Done);
            }
            this.setRoundBet(0, AnimateDisplayTypeRoundBet.Static);
            this.roundActioned = false;
            this.operator = null;
        }
    }
}

/**
 * 终极导出方式：
 * 直接使用 export default 导出这个合并完 interface 的纯净 class。
 * 这保证了外界既能直接将它当做实例类型声明，也能纽结 new 构造函数实例化。
 */
export default TexasGameRoomDataPlayer;
