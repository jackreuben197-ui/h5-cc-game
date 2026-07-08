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

export function GameTypeToTableCategory(code: GameType): number {
    switch (code) {
        case GameType.HOLDEM:
        case GameType.OMAHA4:
        case GameType.OMAHA5:
        case GameType.OMAHA6:
            return TableCategory.TEXAS;
        case GameType.FANTASY:
            return TableCategory.FANTASY;
        case GameType.COWBOY:
            return TableCategory.COWBOY;
        case GameType.MAHJONG:
            return TableCategory.MAHJONG;
        case GameType.EGG:
            return TableCategory.EGG;
        default:
            return 0;
    }
}

enum TableCategory {
    /// <summary>
    /// 默认, 非法值
    /// </summary>
    UNKNOWN = 0,
    /// <summary>
    /// 德州 (统一表示大类德州玩法, 包括但不限于 普通德州, Omaha, 短牌等)
    /// </summary>
    TEXAS = 1,
    /// <summary>
    /// 12 fantasy
    /// </summary>
    FANTASY,
    /// <summary>
    /// 牛仔
    /// </summary>
    COWBOY,
    /// <summary>
    /// 麻将
    /// </summary>
    MAHJONG,
    /// <summary>
    /// 掼蛋
    /// </summary>
    EGG
}
