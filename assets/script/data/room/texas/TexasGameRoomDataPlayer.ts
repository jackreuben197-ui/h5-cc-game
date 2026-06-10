import { Def, PotInsuranceBuy } from '@silenthill/agreement-web';
import { bindData, IObservableBindings, observable, pureEvent } from '../../../core/decorator/DataBind';
import { traceClass } from '../../../core/decorator/LogTrace';
import {
    AnimateDisplayTypeAction,
    AnimateDisplayTypeCards,
    AnimateDisplayTypePosition,
    AnimateDisplayTypeRoundBet
} from '../../../game/constant/AnimateDisplayType';
import { Operator } from './model/Operator';
import TexasGameRoomData from './TexasGameRoomData';
import TexasGameRoomDataPlayerMine from './TexasGameRoomDataPlayerMine';
import { SeatPosition } from './TexasGameRoomDataSeatsStateManager';

type PlayerAnimBindings = {
    seated: [TexasGameRoomDataPlayerMine];
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
    public static readonly SEATED_CHANGE = 'SEATED_CHANGE';
    public static readonly ACTION_CHANGE = 'ACTION_CHANGE';
    public static readonly SEAT_POSITION_CHANGE = 'SEAT_POSITION_CHANGE';
    public static readonly SHOW_CARDS_CHANGE = 'SHOW_CARDS_CHANGE';
    public static readonly NICKNAME_CHANGE = 'NICKNAME_CHANGE';
    public static readonly AVATAR_CHANGE = 'AVATAR_CHANGE';
    public static readonly CHIPS_CHANGE = 'CHIPS_CHANGE';
    public static readonly ROUND_BET_CHANGE = 'ROUND_BET_CHANGE';
    public static readonly PREPARE_OPERATION = 'PREPARE_OPERATION';
    public static readonly CANPLAYSTATUS_CHANGE = 'CANPLAYSTATUS_CHANGE';
    public static readonly KEEPSEAT_CHANGE = 'KEEPSEAT_CHANGE';
    public static readonly ALLIN_WIN_PERCENT = 'ALLIN_WIN_PERCENT';
    public static readonly WINNER = 'WINNER';
    private _parentRoomData: TexasGameRoomData;
    public get roomData() {
        return this._parentRoomData;
    }
    public readonly seatNo: number;
    public userID: number;
    public clubID: number;
    public handBet: number;
    public get mine(): TexasGameRoomDataPlayerMine | null {
        if (this.roomData.mine.seatNo == 0) return null;
        if (this.roomData.mine.seatNo == this.seatNo) {
            return this.roomData.mine;
        }
        return null;
    }
    public roundActioned: boolean;
    public deposit: number = 0;
    public isAuto: boolean = false;
    public vip: boolean = false;
    public subscriptionID: number = 0; // 订阅/会员ID
    //Mushroom
    public inMushroom: boolean = false;
    public costMushroom: number = 0;
    //Suqid
    @observable(TexasGameRoomDataPlayer.CANPLAYSTATUS_CHANGE)
    public status: Def.CanPlayStatusMap[keyof Def.CanPlayStatusMap] = Def.CanPlayStatus.NORMAL;
    //保险
    public buyInsuranceStep: number = 0;
    public buyInsuranceList: Array<PotInsuranceBuy.AsObject> = [];
    //留坐
    private _keepSeatDeadline: number = 0;
    public get keepSeatDeadline() {
        return this._keepSeatDeadline;
    }
    private _keepSeatReason: Def.KeepSeatReasonMap[keyof Def.KeepSeatReasonMap] = Def.KeepSeatReason.KSR_NONE;

    @pureEvent(TexasGameRoomDataPlayer.KEEPSEAT_CHANGE, {
        initParams() {
            return [this._keepSeatDeadline > 0, this._keepSeatDeadline, this._keepSeatReason];
        }
    })
    public keepSeat(b: boolean, deadline: number, reason: Def.KeepSeatReasonMap[keyof Def.KeepSeatReasonMap]) {
        this._keepSeatDeadline = deadline;
        this._keepSeatReason = reason;
    }

    //MTT
    public mttHunterHeadValue: number = 0;
    public mttHunterKill: number = 0;
    public mttHunterKillAward: number = 0;
    public mttHunterKillAwardOther: number = 0;
    //SQUID
    public squidIn: boolean = false; // 是否加入鱿鱼
    public squidTotalLimit: number = 0; // 鱿鱼上限
    public squidRoundSeated: boolean = false; // 鱿鱼轮是否已经坐下
    public squidEscaped: boolean = false; // 鱿鱼是否已经标记
    public squidCount: number = 0;
    //videoMaskId
    public videoMaskId: number = 0;
    //ALLIN胜率(目前只考虑第一套把) (0-10000)
    @observable(TexasGameRoomDataPlayer.ALLIN_WIN_PERCENT)
    public winPercent100: number = -1;

    constructor(seatNo: number, position: SeatPosition, roomData: TexasGameRoomData) {
        super();
        this.seatNo = seatNo;
        this.position = position;
        this._parentRoomData = roomData;
    }

    @observable(TexasGameRoomDataPlayer.SEATED_CHANGE, {
        initParams() {
            return [this.mine];
        }
    })
    public seated: boolean = false;
    // =========================================================================
    // 响应式核心字段拦截配置区域
    // =========================================================================
    @observable(TexasGameRoomDataPlayer.ACTION_CHANGE)
    public action: Def.ActionMap[keyof Def.ActionMap] = Def.Action.NONE;
    @observable(TexasGameRoomDataPlayer.SEAT_POSITION_CHANGE)
    public position: SeatPosition = SeatPosition.Default;
    @observable(TexasGameRoomDataPlayer.SHOW_CARDS_CHANGE)
    public cards: number[] = [];
    public get canOpearate() {
        return (
            this.roomData.basicInfo.gameStatus >= Def.GameStatus.HAND_STARTED &&
            this.roomData.basicInfo.gameStatus < Def.GameStatus.HAND_END &&
            this.cards.length > 0 &&
            this.action != Def.Action.FOLD &&
            this.action != Def.Action.ALLIN
        );
    }
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
    public clearData() {
        this.muteEvents();
        this.userID = 0;
        this.clubID = 0;
        this.chip = 0;
        this.avatar = '';
        this.name = '';
        this.cards = [];
        this.status = undefined;
        this.unmuteEvents();
        // this.emit(TexasGameRoomDataPlayer.EMPTY_SEAT);
    }

    @pureEvent(TexasGameRoomDataPlayer.WINNER)
    public claimWin() {}

    public roundReset() {
        if (this.userID > 0) {
            if (this.action != Def.Action.FOLD && this.action != Def.Action.ALLIN) {
                this.setAction(Def.Action.READY, AnimateDisplayTypeAction.Done);
            }
            this.setRoundBet(0, AnimateDisplayTypeRoundBet.Static);
            this.roundActioned = false;
            this.operator = null;
            if (this.mine) {
                this.mine.roundReset();
            }
        }
    }

    public handEnd() {
        if (this.userID > 0) {
            if (this.mine) {
                this.mine.handEnd();
            }
        }
    }

    public handClear() {
        if (this.userID > 0) {
            this.setAction(Def.Action.NONE, AnimateDisplayTypeAction.Done);
            this.handBet = 0;
            this.setRoundBet(0, AnimateDisplayTypeRoundBet.Static);
            this.setCards([], AnimateDisplayTypeCards.Static, 0);
            this.roundActioned = false;
            this.winPercent100 = -1;
            if (this.mine) {
                this.mine.handClear();
            }
        }
    }
}

/**
 * 终极导出方式：
 * 直接使用 export default 导出这个合并完 interface 的纯净 class。
 * 这保证了外界既能直接将它当做实例类型声明，也能纽结 new 构造函数实例化。
 */
export default TexasGameRoomDataPlayer;
