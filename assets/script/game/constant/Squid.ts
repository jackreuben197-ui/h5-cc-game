/**
 * @module SquidMode
 * @description 鱿鱼模式
 */
export enum SquidMode {
    /** 普通 */
    NORMAL = 0,
    /** 血战模式 */
    XZ = 1
}

/** 1 可以离开 2 不可以离开（一轮结束才可以离开，如果筹码不足没补充就走模式1） */
export enum SquidLeaveMode {
    /** 未知 */
    NONE = 0,
    /** 可以离开 */
    NORMAL = 1,
    /** 不可以离开（一轮结束才可以离开，如果筹码不足没补充就走模式1） */
    ROUNDEND = 2
}
