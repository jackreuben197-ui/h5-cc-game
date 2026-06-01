/**
 * @module RoomOriginType
 * @description 房间来源类型
 * 注意：创建牌桌时，传入的类型3和5，返回的都是3
 */
export enum RoomOriginType {
    UNKNOWN = 0,
    /** 平台（暂未使用） */
    PLATFORM = 1,
    /** 联盟 */
    UNION = 2,
    /** 俱乐部 */
    CLUB = 3,
    /** 朋友桌 */
    FRIEND = 4
}
