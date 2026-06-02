/**
 * @module BringInChipsType
 * @description 带入筹码类型
 */
export enum BringInChipsType {
    /** 带入 */
    BRING_IN = 0,
    /** 补充筹码 */
    SUPPLEMENT = 1,
    /** 自动充值 */
    AUTO_RECHARGE = 2,
    /** 蘑菇补充筹码 */
    MUSHROOM = 3,
    /** 鱿鱼补充筹码 */
    SQUID = 4,
    /** 匹配界面 */
    MATCH = 5
}

export enum BringInMode {
    CURRENCY = 1,
    DIAMOND = 2,
    CREDIT = 3
}
