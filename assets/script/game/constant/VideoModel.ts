/**
 * @module VideoModel
 * @description 视频桌模式
 */
export enum VideoModel {
    /** 未开启视频桌 */
    NONE = 0,
    /** 全时长 */
    FULL_TIME = 1,
    /** 随机验证 */
    RANDOM = 2,
    /** 麦序 */
    SEQUENCE = 3,
    /** MTT强制验证 */
    MTT_FORCE_VIDEO = 4
}
