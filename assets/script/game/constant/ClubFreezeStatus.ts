/**
 * @module ClubFreezeStatus
 * @description 俱乐部冻结状态
 */
export enum ClubFreezeStatus {
    /** 正常 */
    NONE = 0,
    /** 平台冻结 */
    PLATFORM_FREEZE = 1,
    /** 联盟拉黑 */
    TRIBE_BLACK = 2,
    /** 俱乐部冻结 */
    CLUB_FREEZE = 3
}
