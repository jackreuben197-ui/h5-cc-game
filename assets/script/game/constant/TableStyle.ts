/**
 * @module TableStyle
 * @description 德州牌桌风格
 */
export enum TableStyle {
    NONE = -1,
    /** NP */
    NP = 0,
    /** GG */
    GG = 1,
    /**
     * 潮玩
     * 只有视频桌才有的，需要注意
     * 属于是NP样式下的一种样式，所以设计到的UI为止与NP相同
     */
    STYLISH = 2,
    /** WPK */
    WPK = 3
}
