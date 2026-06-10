// message Operator {
//   int32 seat_id = 1;                                         // 操作人座位号
//   repeated ActionLimit actions = 2;                          // 可以操作的类型(非当前人没有这个)
//   repeated InsurancePotLimit insurance_limit = 3;            // 买保险的操作信息(非当前操作者没有这个)
//   int64 left_op_time = 4;                                    // 剩余操作时间(逐渐要废弃,因为不准)
//   int32 delay_times = 5;                                     // 已经加时次数
//   repeated ActionShortcutLimit shortcuts = 6;                // 面板快捷方式
//   bool is_insurance = 7;                                     // 是否是保险操作
//   bool is_agree_second_pc = 8;                               // 是否是允许第2套公共牌操作
//   int64 op_deadline = 9;                                     // 操作截止时间(服务器时间,要逐渐替换left_op_time)
//   repeated InsurancePotInvalid invalid_insurance_pots = 10;  // 无法购买保险的池信息(非当前操作者看不到)
//   repeated int32 cards = 11;                                 // 底牌完整数组 自己操作时能看到,配合delayViewCard
//   repeated PlayerCards player_cards = 12;                    // 所有用户底牌（非当前操作者看不到，包含已弃牌玩家的，低水保险模式才返回）
// }
import { ActionLimit,Def, InsurancePotInvalid, InsurancePotLimit, PlayerCards } from '@silenthill/agreement-web';

export enum OpertionType {
    NORMAL = 1,
    INSURANCE = 2,
    AGREESECPUB = 3
}

export class Operator {
    /** 1: NORMAL 2: INSURANCE 3: AGREESECPUB  */
    public opType: OpertionType;
    public leftOpDuration: number;
    public alreadyDelayTImes: number;
    public deadlineTImestamp: number;
    public totalOpDuration: number; // 房间配置
    public allPot: number;
    public roundBetEqual: number; // 本轮CALL平的RoundBet
}

export type OperatorTimeUpdate = {
    duration: number;
    times: number;
    deadline: number;
};

function cloneOperator<T extends Operator>(oper: T): T {
    const next = oper instanceof OperatorMine ? new OperatorMine() : new Operator();
    Object.assign(next, oper);
    return next as T;
}

export function updateOperatorAfterAddTime<T extends Operator>(oper: T, payload: OperatorTimeUpdate): T {
    const next = cloneOperator(oper);
    const now = Date.now() / 1000;
    const duration = Math.max(0, payload.duration || 0);
    const currentEndTime =
        next.deadlineTImestamp > 0 ? next.deadlineTImestamp : now + Math.max(0, next.leftOpDuration || 0);
    const nextEndTime = payload.deadline > 0 ? payload.deadline : Math.max(currentEndTime, now) + duration;
    const leftTime = Math.max(0, nextEndTime - now);
    const currentTotal = Math.max(1, next.totalOpDuration || 0, next.leftOpDuration || 0);
    next.alreadyDelayTImes = payload.times;
    next.deadlineTImestamp = nextEndTime;
    next.leftOpDuration = leftTime;
    next.totalOpDuration = Math.max(1, currentTotal + duration, leftTime);
    return next;
}

export class OperatorMine extends Operator {
    // 正常
    public actionLimitList?: ActionLimit.AsObject[];
    // 保险
    public insurancePotLimitList?: InsurancePotLimit.AsObject[];
    public insurancePotInvalidList?: InsurancePotInvalid.AsObject[];
    public playerCardsList: PlayerCards.AsObject[];
    // 保险触发的轮次（FLOP 时配合 basicInfo.insuranceForceBuyRatio 用作强制保险判断）
    public round?: Def.RoundMap[keyof Def.RoundMap];
}
