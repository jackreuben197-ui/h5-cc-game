import { Code } from '../../protobuf/holdem/code_pb';
import { ClientMessageRegister, ServerMessageRegister } from '../../protobuf/holdem/req_g_register_pb';
import { ClientMessageHeartbeat, ServerMessageHeartbeat } from '../../protobuf/holdem/req_g_heartbeat_pb';
import { ClientMessageUserPlaying, ServerMessageUserPlaying } from '../../protobuf/holdem/req_g_user_playing_pb';
import { ClientMessageRooms, ServerMessageRooms } from '../../protobuf/holdem/req_rpc_rooms_pb';
import { ClientMessageQuickJoin, ServerMessageQuickJoin } from '../../protobuf/holdem/req_rpc_quick_join_pb';
import { ClientMessageMttDetail, ServerMessageMttDetail } from '../../protobuf/holdem/req_rpc_mtt_detail_pb';
import { ClientMessageJoinMatching, ServerMessageJoinMatching } from '../../protobuf/holdem/req_rpc_join_matching_pb';
import { ClientMessageRoomsSimple, ServerMessageRoomsSimple } from '../../protobuf/holdem/req_rpc_rooms_simple_pb';
import { ServerMessageError } from '../../protobuf/holdem/recv_g_error_pb';
import { ServerMessageNotificationRoomReady } from '../../protobuf/holdem/recv_g_notification_room_ready_pb';
import { ServerMessageUserBan } from '../../protobuf/holdem/recv_g_user_ban_pb';
import { ServerMessageNotificationSystemMaintain } from '../../protobuf/holdem/recv_g_notification_system_maintain_pb';
import { ServerMessageRoomReadyForEnter } from '../../protobuf/holdem/recv_g_room_ready_for_enter_pb';
import { ServerMessageMttReadyForApply } from '../../protobuf/holdem/recv_g_mtt_ready_for_apply_pb';
import { ServerMessageUserKickedFromClub } from '../../protobuf/holdem/recv_g_user_kicked_from_club_pb';
import { ServerMessageNotificationMttWillStart } from '../../protobuf/holdem/recv_g_notification_mtt_will_start_pb';
import { ServerMessageSystemMessage } from '../../protobuf/holdem/recv_g_system_message_pb';
import { ServerMessageGetMessage } from '../../protobuf/holdem/recv_g_get_message_pb';
import { ServerMessageUserGameWatch } from '../../protobuf/holdem/recv_g_user_game_watch_pb';
import { ServerMessageFriendRoomBringInApplyToAdmin } from '../../protobuf/holdem/recv_g_friend_room_bring_in_apply_to_admin_pb';
import { ServerMessageFriendRoomBringInApplyToUser } from '../../protobuf/holdem/recv_g_friend_room_bring_in_apply_to_user_pb';
import { ServerMessageClubRoomBringInApplyToAdmin } from '../../protobuf/holdem/recv_g_club_room_bring_in_apply_to_admin_pb';
import { ServerMessageClubRoomBringInApplyToUser } from '../../protobuf/holdem/recv_g_club_room_bring_in_apply_to_user_pb';
import { ServerMessageClubRoomBringInApplyAudit } from '../../protobuf/holdem/recv_g_club_room_bring_in_apply_audit_pb';
import { ServerMessageAdminRoomUserStandup } from '../../protobuf/holdem/recv_g_admin_room_user_standup_pb';
import { ServerMessageAdminRoomUserLeave } from '../../protobuf/holdem/recv_g_admin_room_user_leave_pb';
import { ServerMessageRoomDelayApplyToAdmin } from '../../protobuf/holdem/recv_g_room_delay_apply_to_admin_pb';
import { ServerMessageClubRoomDelayApplyAudit } from '../../protobuf/holdem/recv_g_club_room_delay_apply_audit_pb';
import { ServerMessageUserIsBlocked } from '../../protobuf/holdem/recv_g_user_is_blocked_pb';
import { ServerMessageClubUserIsBlocked } from '../../protobuf/holdem/recv_g_club_user_is_blocked_pb';
import { ServerMessageTodoList } from '../../protobuf/holdem/recv_g_todo_list_pb';
import { ServerMessageUserDeviceIsBlocked } from '../../protobuf/holdem/recv_g_user_device_is_blocked_pb';
import { ServerMessageOfflineTickets } from '../../protobuf/holdem/recv_g_offline_tickets_pb';
import { ServerMessageSnatchTreasureHrl } from '../../protobuf/holdem/recv_g_snatch_treasure_hrl_pb';
import { ServerMessageSnatchTreasureWinPopup } from '../../protobuf/holdem/recv_g_snatch_treasure_win_popup_pb';
import { ServerMessageJackpotMarquee } from '../../protobuf/holdem/recv_g_jackpot_marquee_pb';
import { ServerMessageMatchingResult } from '../../protobuf/holdem/recv_g_matching_result_pb';
import { ServerMessageSelfProfitPay } from '../../protobuf/holdem/recv_g_self_profit_pay_pb';
import { ServerMessageLimitHandNumber } from '../../protobuf/holdem/recv_g_limit_hand_pb';
import { ServerMessageRoomUserSendDiamond } from '../../protobuf/holdem/recv_g_room_user_send_diamond_pb';
import { ServerMessageUserOrderAudit } from '../../protobuf/holdem/recv_g_user_order_audit_pb';
import { ServerMessageUserWheelHandNum } from '../../protobuf/holdem/recv_g_user_wheel_hand_num_pb';
import { ServerMessageCacheDataUpdate } from '../../protobuf/holdem/recv_g_cache_data_update_pb';
import { ServerMessageSupportMessage } from '../../protobuf/holdem/recv_g_support_message_pb';
import { ServerMessageUserIsMute } from '../../protobuf/holdem/recv_g_user_is_mute_pb';
import { ServerMessageUserDiamondChange } from '../../protobuf/holdem/recv_g_user_diamond_change_pb';
import { ServerMessageTribeBlackUserMtt } from '../../protobuf/holdem/recv_g_tribe_black_user_mtt_pb';
import { ServerMessageRoomChangeNotify } from '../../protobuf/holdem/recv_g_room_change_notify_pb';
import { ServerMessageUserGoldChange } from '../../protobuf/holdem/recv_g_user_gold_change_pb';
import { ServerMessageTribeBlackUser } from '../../protobuf/holdem/recv_g_tribe_black_user_pb';
import { ServerMessageUserTraderOrderNotify } from '../../protobuf/holdem/recv_g_user_trader_order_notify_pb';
import { ServerMessageRoomMttSettleNotify } from '../../protobuf/holdem/recv_g_room_mtt_settle_notify_pb';
import { ServerMessageUserUsdtOrderNotify } from '../../protobuf/holdem/recv_g_user_usdt_order_notify_pb';
import { ServerMessageFriendRoomCreatorSettle } from '../../protobuf/holdem/recv_g_friend_room_creator_settle_pb';
import { ServerMessageMttAwardNotify } from '../../protobuf/holdem/recv_g_mtt_award_notify_pb';
import { ServerMessageUserJoinClub } from '../../protobuf/holdem/recv_g_user_join_club_pb';
import { ServerMessageClubRoomMttSettleNotify } from '../../protobuf/holdem/recv_g_club_room_mtt_settle_notify_pb';
import { ServerMessageUserClubRoleChange } from '../../protobuf/holdem/recv_g_user_club_role_change_pb';
import { ServerMessageUserMttChangeNotify } from '../../protobuf/holdem/recv_g_user_mtt_change_notify_pb';
import { ServerMessageUserSngChangeNotify } from '../../protobuf/holdem/recv_g_user_sng_change_notify_pb';
import { ServerMessageMttSeriesNotify } from '../../protobuf/holdem/recv_g_mtt_series_notify_pb';
import { ServerMessageUtilFaceRecognize } from '../../protobuf/holdem/recv_util_face_recognize_pb';
import { ServerMessageUtilAntiCheatRoomVideo } from '../../protobuf/holdem/recv_util_anti_cheat_room_video_pb';

export const CodeMessageOtherClientGC = {
    [Code.MSG_D_REGISTER]: [ClientMessageRegister, null! as ClientMessageRegister.AsObject],
    [Code.MSG_D_HEARTBEAT]: [ClientMessageHeartbeat, null! as ClientMessageHeartbeat.AsObject],
    [Code.MSG_D_USER_PLAYING]: [ClientMessageUserPlaying, null! as ClientMessageUserPlaying.AsObject]
} as const;

export type CodeMessageOtherClientGC = typeof CodeMessageOtherClientGC;

export const CodeMessageRpcClientGC = {
    [Code.MSG_R_ROOMS]: [ClientMessageRooms, null! as ClientMessageRooms.AsObject, ServerMessageRooms, null! as ServerMessageRooms.AsObject],
    [Code.MSG_R_QUICK_JOIN]: [
        ClientMessageQuickJoin,
        null! as ClientMessageQuickJoin.AsObject,
        ServerMessageQuickJoin,
        null! as ServerMessageQuickJoin.AsObject
    ],
    [Code.MSG_R_MTT_DETAIL]: [
        ClientMessageMttDetail,
        null! as ClientMessageMttDetail.AsObject,
        ServerMessageMttDetail,
        null! as ServerMessageMttDetail.AsObject
    ],
    [Code.MSG_R_JOIN_MATCHING]: [
        ClientMessageJoinMatching,
        null! as ClientMessageJoinMatching.AsObject,
        ServerMessageJoinMatching,
        null! as ServerMessageJoinMatching.AsObject
    ],
    [Code.MSG_R_ROOMS_SIMPLE]: [
        ClientMessageRoomsSimple,
        null! as ClientMessageRoomsSimple.AsObject,
        ServerMessageRoomsSimple,
        null! as ServerMessageRoomsSimple.AsObject
    ]
} as const;

export type CodeMessageRpcClientGC = typeof CodeMessageRpcClientGC;

export const CodeMessageOtherServerGC = {
    [Code.MSG_D_REGISTER]: ServerMessageRegister,
    [Code.MSG_D_HEARTBEAT]: ServerMessageHeartbeat,
    [Code.MSG_D_USER_PLAYING]: ServerMessageUserPlaying,
    [Code.MSG_R_ROOMS]: ServerMessageRooms,
    [Code.MSG_R_QUICK_JOIN]: ServerMessageQuickJoin,
    [Code.MSG_R_MTT_DETAIL]: ServerMessageMttDetail,
    [Code.MSG_R_JOIN_MATCHING]: ServerMessageJoinMatching,
    [Code.MSG_R_ROOMS_SIMPLE]: ServerMessageRoomsSimple,
    [Code.MSG_S_ERROR]: ServerMessageError,
    [Code.MSG_S_NOTIFICATION_ROOM_READY]: ServerMessageNotificationRoomReady,
    [Code.MSG_S_USER_BAN]: ServerMessageUserBan,
    [Code.MSG_S_NOTIFICATION_SYSTEM_MAINTAIN]: ServerMessageNotificationSystemMaintain,
    [Code.MSG_S_ROOM_READY_FOR_ENTER]: ServerMessageRoomReadyForEnter,
    [Code.MSG_S_MTT_READY_FOR_APPLY]: ServerMessageMttReadyForApply,
    [Code.MSG_S_USER_KICKED_FROM_CLUB]: ServerMessageUserKickedFromClub,
    [Code.MSG_S_NOTIFICATION_MTT_WILL_START]: ServerMessageNotificationMttWillStart,
    [Code.MSG_S_SYSTEM_MESSAGE]: ServerMessageSystemMessage,
    [Code.MSG_S_GET_MESSAGE]: ServerMessageGetMessage,
    [Code.MSG_S_USER_GAME_WATCH]: ServerMessageUserGameWatch,
    [Code.MSG_S_FRIEND_ROOM_BRING_IN_APPLY_TO_ADMIN]: ServerMessageFriendRoomBringInApplyToAdmin,
    [Code.MSG_S_FRIEND_ROOM_BRING_IN_APPLY_TO_USER]: ServerMessageFriendRoomBringInApplyToUser,
    [Code.MSG_S_CLUB_ROOM_BRING_IN_APPLY_TO_ADMIN]: ServerMessageClubRoomBringInApplyToAdmin,
    [Code.MSG_S_CLUB_ROOM_BRING_IN_APPLY_TO_USER]: ServerMessageClubRoomBringInApplyToUser,
    [Code.MSG_S_CLUB_ROOM_BRING_IN_APPLY_AUDIT]: ServerMessageClubRoomBringInApplyAudit,
    [Code.MSG_S_ADMIN_ROOM_USER_STANDUP]: ServerMessageAdminRoomUserStandup,
    [Code.MSG_S_ADMIN_ROOM_USER_LEAVE]: ServerMessageAdminRoomUserLeave,
    [Code.MSG_S_ROOM_DELAY_APPLY_TO_ADMIN]: ServerMessageRoomDelayApplyToAdmin,
    [Code.MSG_S_CLUB_ROOM_DELAY_APPLY_AUDIT]: ServerMessageClubRoomDelayApplyAudit,
    [Code.MSG_S_USER_IS_BLOCKED]: ServerMessageUserIsBlocked,
    [Code.MSG_S_CLUB_USER_IS_BLOCKED]: ServerMessageClubUserIsBlocked,
    [Code.MSG_S_TODO_LIST]: ServerMessageTodoList,
    [Code.MSG_S_USER_DEVICE_IS_BLOCKED]: ServerMessageUserDeviceIsBlocked,
    [Code.MSG_S_OFFLINE_TICKETS]: ServerMessageOfflineTickets,
    [Code.MSG_S_SNATCH_TREASURE_HRL]: ServerMessageSnatchTreasureHrl,
    [Code.MSG_S_SNATCH_TREASURE_WIN_POPUP]: ServerMessageSnatchTreasureWinPopup,
    [Code.MSG_S_JACKPOT_MARQUEE]: ServerMessageJackpotMarquee,
    [Code.MSG_S_MATCHING_RESULT]: ServerMessageMatchingResult,
    [Code.MSG_S_SELF_PROFIT_PAY]: ServerMessageSelfProfitPay,
    [Code.MSG_S_LIMIT_HAND_NUMBER]: ServerMessageLimitHandNumber,
    [Code.MSG_S_ROOM_USER_SEND_DIAMOND]: ServerMessageRoomUserSendDiamond,
    [Code.MSG_S_USER_ORDER_AUDIT]: ServerMessageUserOrderAudit,
    [Code.MSG_S_USER_WHEEL_HAND_NUM]: ServerMessageUserWheelHandNum,
    [Code.MSG_S_CACHE_DATA_UPDATE]: ServerMessageCacheDataUpdate,
    [Code.MSG_S_SUPPORT_MESSAGE]: ServerMessageSupportMessage,
    [Code.MSG_S_USER_IS_MUTE]: ServerMessageUserIsMute,
    [Code.MSG_S_USER_DIAMOND_CHANGE]: ServerMessageUserDiamondChange,
    [Code.MSG_S_TRIBE_BLACK_USER_MTT]: ServerMessageTribeBlackUserMtt,
    [Code.MSG_S_ROOM_CHANGE_NOTIFY]: ServerMessageRoomChangeNotify,
    [Code.MSG_S_USER_GOLD_CHANGE]: ServerMessageUserGoldChange,
    [Code.MSG_S_TRIBE_BLACK_USER]: ServerMessageTribeBlackUser,
    [Code.MSG_S_USER_TRADER_ORDER_NOTIFY]: ServerMessageUserTraderOrderNotify,
    [Code.MSG_S_ROOM_MTT_SETTLE_NOTIFY]: ServerMessageRoomMttSettleNotify,
    [Code.MSG_S_USER_USDT_ORDER_NOTIFY]: ServerMessageUserUsdtOrderNotify,
    [Code.MSG_S_FRIEND_ROOM_CREATOR_SETTLE]: ServerMessageFriendRoomCreatorSettle,
    [Code.MSG_S_MTT_AWARD_NOTIFY]: ServerMessageMttAwardNotify,
    [Code.MSG_S_USER_JOIN_CLUB]: ServerMessageUserJoinClub,
    [Code.MSG_S_CLUB_ROOM_MTT_SETTLE_NOTIFY]: ServerMessageClubRoomMttSettleNotify,
    [Code.MSG_S_USER_CLUB_ROLE_CHANGE]: ServerMessageUserClubRoleChange,
    [Code.MSG_S_USER_MTT_CHANGE_NOTIFY]: ServerMessageUserMttChangeNotify,
    [Code.MSG_S_USER_SNG_CHANGE_NOTIFY]: ServerMessageUserSngChangeNotify,
    [Code.MSG_S_MTT_SERIES_NOTIFY]: ServerMessageMttSeriesNotify,
    [Code.MSG_S_UTIL_FACE_RECOGNIZE]: ServerMessageUtilFaceRecognize,
    [Code.MSG_S_UTIL_ANTI_CHEAT_ROOM_VIDEO]: ServerMessageUtilAntiCheatRoomVideo
} as const;

export type CodeMessageOtherServerGC = typeof CodeMessageOtherServerGC;
