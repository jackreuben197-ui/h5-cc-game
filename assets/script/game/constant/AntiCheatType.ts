/**
 * @module AntiCheatType
 * @description 防作弊验证类型
 */
export enum AntiCheatType {
    /** 未知 */
    UNKNOWN = 0,
    /** 不开启音视频防作弊 */
    NONE = 1,
    /** 实时语音 */
    AUDIO = 2,
    /** 实时视频 */
    VIDEO = 3,
    /** 人脸验证 */
    FACE_VERIFY = 4
}
