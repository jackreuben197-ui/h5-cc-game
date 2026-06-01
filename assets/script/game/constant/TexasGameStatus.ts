/**
 * @module GameState
 * @description 牌局游戏状态枚举定义
 */
/**
 * 牌局游戏状态
 */
export enum GameState {
    /**
     * 未开始
     */
    NOT_START = 0,
    /**
     * 等待第一手开始（游戏已经开始了）
     */
    WAIT_HAND_START = 1,
    /**
     * 一手开始
     */
    HAND_STARTED = 2,
    /**
     * 翻牌前
     */
    HAND_PRE_FLOP = 3,
    /**
     * 翻牌
     */
    HAND_FLOP = 4,
    /**
     * 转
     */
    HAND_TURN = 5,
    /**
     * 河
     */
    HAND_RIVER = 6,
    /**
     * 一手结束，如果继续转 HandStart，不继续转 Complete
     */
    HAND_END = 7,
    /**
     * 游戏还没开始就取消了
     */
    CANCEL = 8,
    /**
     * 游戏结束
     */
    COMPLETE = 9,
    /**
     * 未知可能是错误信息
     */
    UNKNOWN = 10
}
