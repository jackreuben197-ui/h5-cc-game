/**
 * 玩法类型枚举
 */
export enum GameType {
    /**
     * 未知(非法值)
     */
    UNKNOWN = -1,
    /**
     * 德州扑克
     */
    HOLDEM = 0,
    /**
     * 奥马哈4张
     */
    OMAHA4 = 1,
    /**
     * 奥马哈5张
     */
    OMAHA5 = 2,
    /**
     * 奥马哈6张
     */
    OMAHA6 = 3,
    /**
     * 范特西
     */
    FANTASY = 4,
    /**
     * 牛仔
     */
    COWBOY = 5,
    /**
     * 麻将
     */
    MAHJONG = 6,
    /**
     * 掼蛋
     */
    EGG = 7
}

/**
 * 德州玩法细分类型
 */
export enum PokerType {
    /**
     * 普通
     */
    NORMAL = 0,
    /**
     * 短牌(6+)
     */
    SIX_PLUS = 2
}
