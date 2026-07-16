/**
 * @module DiamondConfigType
 * @description 钻石配置代号
 */
export enum DiamondConfigType {
    DiamondConfigTypeCreateRoom = 1, // 创建房间
    DiamondConfigTypeAddTime, //延时
    DiamondConfigTypeAudio, //语音桌
    DiamondConfigTypeFace, //人脸识别桌
    DiamondConfigTypeVideoFull, //视频桌（全时长）
    DiamondConfigTypeVideoRandom, //视频桌（随机验证）
    DiamondConfigTypeVideoOrder, //视频桌（麦序）
    DiamondConfigTypeViewPublicCards, //查看公共牌
    DiamondConfigTypeRecordFee, //记录费
    DiamondConfigTypeRoomChat, //牌桌聊天室
    DiamondConfigTypeCreateMtt, //创建MTT
    DiamondConfigTypeMttVideoFull, //mtt视频（全时长）
    DiamondConfigTypeMttVideoRandom, //mtt视频（随机验证）
    DiamondConfigTypeMttVideoOrder, //mtt视频（麦序）
    DiamondConfigTypePayWatchOtherCard = 17, // 付费看手牌(看单人)
    DiamondConfigTypeEncryptCards, // 加密洗牌/切牌
    DiamondConfigTypeCreateMahjongRoom, // 创建麻将房间
    DiamondConfigTypeCreatGuandanRoom, // 创建掼蛋房间
    DiamondConfigTypeTribePayWatchCard, // 联盟付费看手牌
    DiamondConfigTypeRoomInsurance, // 牌桌保险
    DiamondConfigTypeRoomLimitIP, // 牌桌IP限制
    DiamondConfigTypeRoomLimitGPS, // 牌桌gps限制
    DiamondConfigTypeRoomCriticalHit, // 牌桌暴击
    DiamondConfigTypeRoomMushroom, // 牌桌蘑菇
    DiamondConfigTypeRoomSquid, // 牌桌鱿鱼
    DiamondConfigTypeRoomJackpot, // 牌桌jackpot
    DiamondConfigTypeCreateCowboyRoom, // 创建牛仔房间
    DiamondConfigTypePayWatchOtherCardWatchAll, // 付费看手牌（看全部）
    DiamondConfigTypeViewPublicCardsAll, // 查看公共牌(全看)
    DiamondConfigTypeMahjongAudio, // 麻将语音桌
    DiamondConfigTypeMahjongVideoFull, // 麻将视频桌（全时长）
    DiamondConfigTypeMahjongVideoRandom, // 麻将视频桌（随机验证）
    DiamondConfigTypeMahjongVideoOrder, // 麻将视频桌（麦序）
    DiamondConfigTypeMTTChat, // MTT牌桌聊天收费（十位数是座位数，个位数是货币类型）
    DiamondConfigTypeMttAudio, // MTT语音桌
    DiamondConfigTypeMJCreateMtt, //创建麻将MTT
    DiamondConfigTypeMJMttVideoFull, //麻将mtt视频（全时长）
    DiamondConfigTypeMJMttVideoRandom, //麻将mtt视频（随机验证）
    DiamondConfigTypeMJMttVideoOrder //麻将mtt视频（麦序）
}
