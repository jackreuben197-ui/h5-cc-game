/** 消息种类(弹幕 表情 声纹等) */
export enum BroadcastCode {
    BroadcastMsg = 1000,
    BroadcastVoiceprint = 1001,
    VerifyCan = 1002, // 用户可以被验证
    VerifyDoNotCan = 1003, // 用户不能被验证
    VerifyTickets = 1004, // 验证门票
    Super1_PMD = 1005, // 一元购开奖中奖_跑马灯消息
    Super1_TC = 1006, // 一元购开奖中奖_弹窗消息
    FaceRecognizeCode = 1007, // 房间人脸识别消息
    SeatFriendApplyRefreshMsgNum = 2001, // 朋友桌房主提示
    SeatFriendBringInApply = 2002, // 朋友桌房主同意坐下
    SeatClubApplyRefreshMsgNum = 2003, // 俱乐部桌房主提示
    SeatClubBringInApply = 2004, // 俱乐部房主同意坐下
    AntiCheatRoomVideoMsgCode = 2005, // 随机触发强制视频
    ClubRoomBringInApplyAuditMsgCode = 2006, // 俱乐部玩家申请带入审核完成，发消息给管理人员
    AdminRoomUserStandupMsgCode = 2007, // 房主强制用户站起
    AdminRoomUserLeaveMsgCode = 2008, // 房主强制用户离桌
    AdminRoomDisMsgCode = 2009, // 房主强制解散房间
    AdminRoomChangeDurationMsgCode = 2010, // 房主延长房间时间，发消息通知用户
    RoomDelayApplyToAdminMsgCode = 2011, // 玩家申请延长房间时间，发消息通知房主
    RoomDelayApplyToUserMsgCode = 2012, // 玩家申请延长房间时间，发消息通知其他用户
    RoomDelayApplyRejectMsgCode = 2013, // 玩家申请延长房间时间被拒绝，发消息通知用户
    ClubRoomDelayApplyAuditMsgCode = 2014, // 俱乐部桌申请延长房间时间审批完成，发消息给俱乐部管理人员
    UserIsBlockedMsgCode = 2015, // 被拉黑，发消息通知用户
    ClubUserIsLockedMsgCode = 2016, // 俱乐部成员被冻结，发消息通知用户
    MSGApplyMainListCode = 2018, // 消息审核界面
    UserDeviceLimitCode = 2019, // 用户设备被限制
    ReplayVideoId = 2020,
    EggRoomTimeAddSuccess = 2024, // 掼蛋房间时间延长成功
    EggRoomTimeAddFail = 2025 // 掼蛋房间时间延长失败
}

export enum PropsID {
    NONE = 0,
    // 文字消息
    MESSAGENORMAL = 2,
    MESSAGECOOL = 3,
    MESSAGECOLOR = 4,
    // 权值
    WEIGHTS = 100,
    // 免费表情
    FREEAUDIENCE = 500,
    FREEHI = 501,
    FREEPROUD = 502,
    FREESPEECH = 503,
    FREESHY = 504,
    FREESOS = 505,
    FREEPITFUL = 506,
    FREESHOW = 507,
    FREEHEARTLESS = 508,
    FREELIKE = 509,
    // 头像扔道具
    PROPSTOMATO = 600, // 番茄
    PROPSFLOWER = 601, // 花环
    PROPSKISS = 602, // 亲吻
    PROPSGOOD = 603, // 大拇指
    PROPSCHEERS = 604, // 干杯
    PROPSTOUCH = 605, // 摸头
    PROPSSHARK = 606, // 鲨鱼
    PROPSCHICKEN = 607, // 抓鸡
    PROPSBOXING = 608, // 拳击
    PROPSMONEY = 609, // 撒钱
    PROPSFISH = 610, // 鱼头
    PROPSBASEBALL = 611, // 棒球
    // 魔法表情
    MAGICANGER = 700,
    MAGICCRY = 701,
    MAGICMONEY = 702,
    MAGICLAUGH = 703,
    MAGICPLAY = 704,
    MAGICLOVE = 705,
    MAGICUNHAPPY = 706,
    MAGICPROUD = 707,
    MAGICCOMEON = 708,
    MAGICBYE = 709,
    MAGICSMOKE = 710,
    MAGICPURPLESMOKE = 711,
    MAGICGUN = 712,
    MAGICSMILE = 713,
    MAGICSHOCK = 714,
    MAGICPOOR = 715,
    MAGICPOKEPANDA = 716,
    MAGICAMAZED = 717,
    MAGICOCTOPUS = 718,
    MAGICHAPPYMOUSE = 719,
    MAGICKNIFEMAN = 720,
    MAGICSADDOG = 721,
    MAGICTOOTHLESSPANDA = 722,
    MAGICWHISTLE = 723,
    MAGICCOOLDOG = 724,
    MAGICSCORN = 725,
    MAGICHAPPY = 726
}

export const THROW_PROP_IDS: PropsID[] = [
    PropsID.PROPSTOMATO,
    PropsID.PROPSFLOWER,
    PropsID.PROPSKISS,
    PropsID.PROPSGOOD,
    PropsID.PROPSCHEERS,
    PropsID.PROPSTOUCH,
    PropsID.PROPSSHARK,
    PropsID.PROPSCHICKEN,
    PropsID.PROPSBOXING,
    PropsID.PROPSMONEY,
    PropsID.PROPSFISH,
    PropsID.PROPSBASEBALL
];

export function getFreeEmojiTypeBase(): number {
    return PropsID.FREEAUDIENCE;
}

export function getMagicEmojiTypeBase(): number {
    return PropsID.MAGICANGER;
}

export function getThrowPropTypeBase(): number {
    return PropsID.PROPSTOMATO;
}

// ===== 图鉴表情（分类选择器 em16-65，与 pokerqueen 对齐）=====
// 广播 type = 免费表情基数(500) + (表情序号 - 1)。em16 → 515, em65 → 564。
export const PICKER_EMOJI_MIN_INDEX = 16;
export const PICKER_EMOJI_MAX_INDEX = 65;

/** 表情序号(16-65) → 广播 type */
export function pickerEmojiTypeFromIndex(index: number): number {
    return PropsID.FREEAUDIENCE + (index - 1);
}

/** 广播 type → 表情序号；不在 em16-65 区间时返回 -1 */
export function pickerEmojiIndexFromType(type: number): number {
    const index = type - PropsID.FREEAUDIENCE + 1;
    return index >= PICKER_EMOJI_MIN_INDEX && index <= PICKER_EMOJI_MAX_INDEX ? index : -1;
}
