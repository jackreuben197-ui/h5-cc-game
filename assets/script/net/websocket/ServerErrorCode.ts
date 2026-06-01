/**
 * websocket服务器错误码
 */
export enum ServerErrorCode {
    //#region common 90000+
    Common_Internal = 90001,
    Common_Unknown,
    Common_InvalidArgument,
    Common_NotFound,
    Common_AlreadyExists,
    Common_PermissionDenied,
    Common_Aborted,
    Common_Unimplemented,
    Common_Unavailable,
    Common_Unauthenticated,
    //#endregion
    //#region MTT 10000+
    //ErrCodeMTTNoApply û�б���
    MTT_NoApply = 10000,
    //ErrCodeMTTNotOpen δ��ʼ
    MTT_NotOpen,
    //ErrCodeMTTRoomNotReady ��δ׼����� û��ROOM-- �ͻ�����Ҫ���� �����¿�����/�����˻�δ���£�
    MTT_RoomNotReady,
    //ErrCodeMTTLose ����̭
    MTT_Lose,
    //ErrCodeMTTClosed �����Ѿ�����
    MTT_Closed,
    //ErrCodeMTTCloseBuyin �����ֹ��
    MTT_CloseBuyin,
    //ErrCodeMTTCloseRebuy Rebuy��ֹ��
    MTT_CloseRebuy,
    //ErrCodeMTTCloseAddOn  AddOn��ֹ��
    MTT_CloseAddOn,
    //ErrCodeMTTRoomChanged ����仯��
    MTT_RoomChanged,
    //ErrCodeMTTNoRebuy û���ع�
    MTT_NoRebuy,
    //ErrCodeMTTNoAddOn û�мӹ�
    MTT_NoAddOn,
    //ErrCodeMTTPartialBringInInCorrect ���ִ��������
    MTT_PartialBringInInCorrect,
    //ErrCodeMTTCloseStoreReturn �ϲ��洢�������ȼ��ѹ�,���ܽ���
    MTT_CloseStoreReturn,
    //ErrCodeMTTLoseCanRebuy ��̭�������ع�
    MTT_LoseCanRebuy,
    //ErrCodeMTTAwardIsNotReady ���ս�����������δ׼����
    MTT_AwardIsNotReady,
    //ErrCodeMTTBuyRatioInvalid MTT买入倍率错误
    MTT_BuyRatioInvalid,
    //ErrCodeMTTAddOnInvalidTime 增购时间不对(addon/addonplus1/addonplus2)
    MTT_AddOnInvalidTime,
    //ErrCodeMTTAddOnMoreChip 筹码过多无法增购才10017
    MTT_AddOnMoreChip,
    //ErrCodeMTTAddOnPlusOverLimit 增购超过次数了 10018
    MTT_AddOnPlusOverLimit,
    //ErrCodeMTTSameTagLimit 须打完或被淘汰，才能报下一场相同tag的比赛 10019
    MTT_SameTagLimit,
    //#endregion
    //#region room 20000+
    //ErrCodeRoomUserIsInAnotherRoom �û�������������
    Room_RoomUserIsInAnotherRoom = 20000,
    //ErrCodeRoomNotExist ���䲻����
    Room_RoomNotExist,
    //ErrCodeRoomUserInvalid �û���Ϣ�쳣
    Room_RoomUserInvalid,
    //ErrCodeRoomUserNotExist �û����ٷ�����
    Room_RoomUserNotExistInRoom,
    //ErrCodeRoomUserLessGold �û�Ǯ������
    Room_RoomUserLessGold,
    //ErrCodeRoomUserLessGoldLock �û�����Ľ��㣨�ⶳʱ���ã�
    Room_RoomUserLessGoldLock,
    //ErrCodeRoomStoreGreaterBringIn �洢���ڴ�����
    Room_RoomStoreGreaterBringIn,
    //ErrCodeNoBringOutCanNotReturn û�д����޷�����
    Room_NoBringOutCanNotReturn,
    //ErrCodeReturnLessThanLastBringOut ���ؽ��С���ϴδ���
    Room_ReturnLessThanLastBringOut,
    //ErrCodeUserWalletFobidden �û�Ǯ������
    Room_UserWalletFobidden,
    //ErrCodeUserNeverBringIned �û�û�д����
    Room_UserNeverBringIned,
    //ErrCodeUserBringOuted �û��Ѿ���������
    Room_UserBringOuted,
    //ErrCodeNoRoomFeeSettingFound û���ҵ����������趨
    Room_NoRoomFeeSettingFound,
    //ErrCodeRoomFeeSettingAlreadyExist ���������趨�Ѿ�����
    Room_RoomFeeSettingAlreadyExist,
    //ErrCodeNoFlowExist ��ˮ�˵�������
    Room_NoFlowExist,
    //ErrCodeIsInWithdraw �����в��ܲ���
    Room_IsInWithdraw,
    //ErrCodeRetainIsLessThanMin ��Ǯ���С����С�趨
    Room_RetainIsLessThanMin,
    //ErrCodeAutoOnTableGreaterThanBringIn �Զ����������ڴ���
    Room_AutoOnTableGreaterThanBringIn,
    //ErrCodeBringInLessThanMin ����С����С����
    Room_BringInLessThanMin,
    //用户提豆被禁
    Room_UserWithdrawFobidden,
    // ErrCodeUserLoginFailed 用户登录失败
    Room_UserLoginFaild,
    // ErrCodeUserRechargePayFailManyTimes 用户充值支付失败次数太多
    Room_UserRechargePayFailManyTimes,
    //ErrCodeRoomNotOpenVoiceprintVerify 房间未开启声纹验证
    Room_NotOpenVoiceprintVerify,
    // ErrCodeUserVoiceprintVerifyTimes 用户在此房间的声纹验证次数不足
    Room_UserVoiceprintVerifyTimes,
    // ErrCodeUserVoiceprintVerifyFrequent 用户在此房间发起声纹验证太频繁
    Room_UserVoiceprintVerifyFrequent,
    // ErrCodeUserVoiceprintVerifyVote 用户在此房间已投过票 20025
    Room_UserVoiceprintVerifyVote,
    //#endregion
    //#region gameplay 30000+
    Gameplay_LessChip = 31001,
    Gameplay_NotInBetTime,
    Gameplay_SeatTaken,
    Gameplay_TableIsFull,
    Gameplay_InvalidBetAction,
    Gameplay_InvalidBetNum,
    Gameplay_NotPlaying,
    Gameplay_NoJoin,
    Gameplay_NoSeat,
    Gameplay_InvalidInsurance,
    Gameplay_NotInInsuranceTime,
    Gameplay_CannotPost,
    Gameplay_CannotAgreePost,
    Gameplay_NotStandUp,
    Gameplay_AlreadySeated,
    Gameplay_GameOver,
    Gameplay_DelayTimeOverTimes,
    Gameplay_NotInDelayTime,
    Gameplay_IncorrectInsuranceOutsLen,
    Gameplay_NoOutsSelected,
    Gameplay_ExceedInsuranceLimit,
    Gameplay_ExceedInsuranceMax,
    Gameplay_LessThanMin,
    Gameplay_InvalidGetPublicTime,
    Gameplay_IncorrectShowCardIndex,
    Gameplay_InvalidShowCardTime,
    Gameplay_SeatLimitIP,
    Gameplay_SeatLimitGPS,
    Gameplay_MissHunterKill,
    Gameplay_ExternalPlayableValidateFail,
    Gameplay_BringInExternalValidateFail,
    Gameplay_InsuranceNumPreciousFail,
    Gameplay_InsuranceIncorrectPotIndex,
    Gameplay_UserNotInKeepSeat,
    Gameplay_UserAlreadyKeepSeat,
    Gameplay_KeepSeatOverLimit,
    Gameplay_InvalidBringOutTime,
    Gameplay_BringOutGreatThanYouOwn,
    Gameplay_BringOutedShouldNotHaveChip,
    Gameplay_RoomerOverLimit, // 房间人数超过上限
    Gameplay_NotInAgreeSecondPublicCardsTime, // 不在等待双公共牌确认的时间段内
    Gameplay_AutoSeatReturnToInvalidGame, // 应对后端代理及实体玩家拆合桌问题加入的特殊错误码
    Gameplay_HandClearCanNotShowCard, //本手结束后不允许亮牌
    Gameplay_HandClearCanNotViewPublicCards, //本手结束后不允许查看公共牌
    Gameplay_OvertimeFailure, //加时失败
    //#endregion
    //#region Other 50000+
    Other_InternalGetMaintenanceConfig = 50000, // 获取停机维护表信息失败
    Other_OnMaintenanceTime, // 处于停机维护时间
    Other_InternalGetGameConfig, // 获取游戏配置失败
    Other_GameConfigShutdownClose, // 游戏配置停机维护按钮关闭
    Other_InternalGetWhiteList, // 获取白名单信息失败
    Other_UserShutdownClose, // 用户没有开启停机服务
    Other_GameConfigNoRestrictSimulatorLoginClose, // 游戏配置不限制模拟器登陆开关关闭
    Other_UserNoRestrictSimulatorLoginClose // 用户没有开启不限制模拟器登陆服务
    //#endregion
}
