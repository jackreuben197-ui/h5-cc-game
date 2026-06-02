import { Code } from '../../protobuf/holdem/code_pb';
import { ServerMessageActionAll } from '../../protobuf/holdem/recv_th_action_all_pb';
import { ServerMessageAddTimeOthers } from '../../protobuf/holdem/recv_th_add_time_others_pb';
import { ServerMessageAgreeSecondPcs } from '../../protobuf/holdem/recv_th_agree_second_pcs_pb';
import { ServerMessageAgreeSecondPcsTrigged } from '../../protobuf/holdem/recv_th_agree_second_pcs_trigged_pb';
import { ServerMessageAutoOp } from '../../protobuf/holdem/recv_th_auto_op_pb';
import { ServerMessageBringInOrStoreFail } from '../../protobuf/holdem/recv_th_bring_in_or_store_fail_pb';
import { ServerMessageBuyInsurance } from '../../protobuf/holdem/recv_th_buy_insurance_pb';
import { ServerMessageChipsChange } from '../../protobuf/holdem/recv_th_chips_change_pb';
import { ServerMessageEncryptCards } from '../../protobuf/holdem/recv_th_entrypt_cards_pb';
import { ServerMessageForceVideo } from '../../protobuf/holdem/recv_th_force_video_pb';
import { ServerMessageGetMsg } from '../../protobuf/holdem/recv_th_get_msg_pb';
import { ServerMessageHandClear } from '../../protobuf/holdem/recv_th_hand_clear_pb';
import { ServerMessageInsuranceOutsCards } from '../../protobuf/holdem/recv_th_insurance_outs_cards_pb';
import { ServerMessageInsuranceTrigged } from '../../protobuf/holdem/recv_th_insurance_trigged_pb';
import { ServerMessageJackpotAward } from '../../protobuf/holdem/recv_th_jackpot_award_pb';
import { ServerMessageJackpotGoldChange } from '../../protobuf/holdem/recv_th_jackpot_gold_change_pb';
import { ServerMessageKeepSeat } from '../../protobuf/holdem/recv_th_keep_seat_pb';
import { ServerMessageLeaveNotification } from '../../protobuf/holdem/recv_th_leave_notification_pb';
import { ServerMessageNextChange } from '../../protobuf/holdem/recv_th_next_change_pb';
import { ServerMessagePostStatusChange } from '../../protobuf/holdem/recv_th_post_status_change_pb';
import { ServerMessagePublicCards } from '../../protobuf/holdem/recv_th_public_cards_pb';
import { ServerMessageSeatedOthers } from '../../protobuf/holdem/recv_th_seated_others_pb';
import { ServerMessageShowPublicCardsOthers } from '../../protobuf/holdem/recv_th_show_public_cards_others_pb';
import { ServerMessageShowViewCards } from '../../protobuf/holdem/recv_th_show_view_cards_pb';
import { ServerMessageShowcards } from '../../protobuf/holdem/recv_th_showcards_pb';
import { ServerMessageSidePots } from '../../protobuf/holdem/recv_th_side_pots_pb';
import { ServerMessageSquidIn } from '../../protobuf/holdem/recv_th_squid_in_pb';
import { ServerMessageStandup } from '../../protobuf/holdem/recv_th_stand_up_pb';
import { ServerMessageStartInfo } from '../../protobuf/holdem/recv_th_start_info_pb';
import { ServerMessageSyncHand } from '../../protobuf/holdem/recv_th_sync_hand_pb';
import { ServerMessageUpBlind } from '../../protobuf/holdem/recv_th_up_blind_pb';
import { ServerMessageVideoMaskChange } from '../../protobuf/holdem/recv_th_video_mask_change_pb';
import { ServerMessageWaitCheckAutoAddTime } from '../../protobuf/holdem/recv_th_wait_check_auto_add_time_pb';
import { ServerMessageWinner } from '../../protobuf/holdem/recv_th_winner_pb';
import { ClientMessageAction, ServerMessageAction } from '../../protobuf/holdem/req_th_action_pb';
import { ClientMessageAddOn, ServerMessageAddOn } from '../../protobuf/holdem/req_th_add_on_pb';
import { ClientMessageAddTime, ServerMessageAddTime } from '../../protobuf/holdem/req_th_add_time_pb';
import { ClientMessageAgreePost, ServerMessageAgreePost } from '../../protobuf/holdem/req_th_agree_post_pb';
import { ClientMessageAgreeSecondPcsActive, ServerMessageAgreeSecondPcsActive } from '../../protobuf/holdem/req_th_agree_second_pcs_active_pb';
import { ClientMessageAutoOpActive, ServerMessageAutoOpActive } from '../../protobuf/holdem/req_th_auto_op_active_pb';
import { ClientMessageBringIn, ServerMessageBringIn } from '../../protobuf/holdem/req_th_bring_in_pb';
import { ClientMessageBroadcastMsg, ServerMessageBroadcastMsg } from '../../protobuf/holdem/req_th_broadcast_msg_pb';
import { ClientMessageBuyInsuranceActive, ServerMessageBuyInsuranceActive } from '../../protobuf/holdem/req_th_buy_insurance_active_pb';
import { ClientMessageChatMembers, ServerMessageChatMembers } from '../../protobuf/holdem/req_th_chat_members_pb';
import { ClientMessageEnterRoom, ServerMessageEnterRoom } from '../../protobuf/holdem/req_th_enter_room_pb';
import { ClientMessageKeepSeatActive, ServerMessageKeepSeatActive } from '../../protobuf/holdem/req_th_keep_seat_active_pb';
import { ClientMessageLeave, ServerMessageLeave } from '../../protobuf/holdem/req_th_leave_pb';
import { ClientMessageObservers, ServerMessageObservers } from '../../protobuf/holdem/req_th_observers_pb';
import { ClientMessagePlayerJackpotSummary, ServerMessagePlayerJackpotSummary } from '../../protobuf/holdem/req_th_player_jackpot_summary_pb';
import { ClientMessagePrivateMsg, ServerMessagePrivateMsg } from '../../protobuf/holdem/req_th_private_msg_pb';
import { ClientMessagePublicReplay, ServerMessagePublicReplay } from '../../protobuf/holdem/req_th_replay_pb';
import { ClientMessageRoomInsurance, ServerMessageRoomInsurance } from '../../protobuf/holdem/req_th_room_insurance_pb';
import { ClientMessageRoomers, ServerMessageRoomers } from '../../protobuf/holdem/req_th_roomers_pb';
import { ClientMessageSeated, ServerMessageSeated } from '../../protobuf/holdem/req_th_seated_pb';
import { ClientMessageSetAutoOnTable, ServerMessageSetAutoOnTable } from '../../protobuf/holdem/req_th_set_auto_on_table_pb';
import { ClientMessageShowPublicCards, ServerMessageShowPublicCards } from '../../protobuf/holdem/req_th_show_public_cards_pb';
import { ClientMessageShowdown, ServerMessageShowdown } from '../../protobuf/holdem/req_th_showdown_pb';
import { ClientMessageSquidInActive, ServerMessageSquidInActive } from '../../protobuf/holdem/req_th_squid_in_active_pb';
import { ClientMessageStandupActive, ServerMessageStandupActive } from '../../protobuf/holdem/req_th_stand_up_active_pb';
import { ClientMessageStoreChips, ServerMessageStoreChips } from '../../protobuf/holdem/req_th_store_chips_pb';
import { ClientMessageSyncEnter, ServerMessageSyncEnter } from '../../protobuf/holdem/req_th_sync_enter_pb';
import { ClientMessageViewPlayerCardsNum, ServerMessageViewPlayerCardsNum } from '../../protobuf/holdem/req_th_view_player_cards_num_pb';
import { ClientMessageViewPlayerCards, ServerMessageViewPlayerCards } from '../../protobuf/holdem/req_th_view_player_cards_pb';

export const CodeMessageTexasClientGC = {
    [Code.MSG_D_ENTER_ROOM]: [ClientMessageEnterRoom, null! as ClientMessageEnterRoom.AsObject],
    [Code.MSG_D_SEATED]: [ClientMessageSeated, null! as ClientMessageSeated.AsObject],
    [Code.MSG_D_ADD_ON]: [ClientMessageAddOn, null! as ClientMessageAddOn.AsObject],
    [Code.MSG_D_BRING_IN]: [ClientMessageBringIn, null! as ClientMessageBringIn.AsObject],
    [Code.MSG_D_ACTION]: [ClientMessageAction, null! as ClientMessageAction.AsObject],
    [Code.MSG_D_AUTO_OP_ACTIVE]: [ClientMessageAutoOpActive, null! as ClientMessageAutoOpActive.AsObject],
    [Code.MSG_D_SET_AUTO_ON_TABLE]: [ClientMessageSetAutoOnTable, null! as ClientMessageSetAutoOnTable.AsObject],
    [Code.MSG_D_STANDUP_ACTIVE]: [ClientMessageStandupActive, null! as ClientMessageStandupActive.AsObject],
    [Code.MSG_D_LEAVE]: [ClientMessageLeave, null! as ClientMessageLeave.AsObject],
    [Code.MSG_D_KEEP_SEAT_ACTIVE]: [ClientMessageKeepSeatActive, null! as ClientMessageKeepSeatActive.AsObject],
    [Code.MSG_D_SHOWDOWN]: [ClientMessageShowdown, null! as ClientMessageShowdown.AsObject],
    [Code.MSG_D_SHOW_PUBLIC_CARDS]: [ClientMessageShowPublicCards, null! as ClientMessageShowPublicCards.AsObject],
    [Code.MSG_D_ADD_TIME]: [ClientMessageAddTime, null! as ClientMessageAddTime.AsObject],
    [Code.MSG_D_BUY_INSURANCE_ACTIVE]: [ClientMessageBuyInsuranceActive, null! as ClientMessageBuyInsuranceActive.AsObject],
    [Code.MSG_D_AGREE_POST]: [ClientMessageAgreePost, null! as ClientMessageAgreePost.AsObject],
    [Code.MSG_D_STORE_CHIPS]: [ClientMessageStoreChips, null! as ClientMessageStoreChips.AsObject],
    [Code.MSG_D_PUBLIC_REPLAY]: [ClientMessagePublicReplay, null! as ClientMessagePublicReplay.AsObject],
    [Code.MSG_D_BROADCAST_MSG]: [ClientMessageBroadcastMsg, null! as ClientMessageBroadcastMsg.AsObject],
    [Code.MSG_D_PRIVATE_MSG]: [ClientMessagePrivateMsg, null! as ClientMessagePrivateMsg.AsObject],
    [Code.MSG_D_ROOMERS]: [ClientMessageRoomers, null! as ClientMessageRoomers.AsObject],
    [Code.MSG_D_AGREE_SECOND_PCS_ACTIVE]: [ClientMessageAgreeSecondPcsActive, null! as ClientMessageAgreeSecondPcsActive.AsObject],
    [Code.MSG_D_OBSERVERS]: [ClientMessageObservers, null! as ClientMessageObservers.AsObject],
    [Code.MSG_D_SQUID_IN_ACTIVE]: [ClientMessageSquidInActive, null! as ClientMessageSquidInActive.AsObject],
    [Code.MSG_D_SYNC_ENTER]: [ClientMessageSyncEnter, null! as ClientMessageSyncEnter.AsObject],
    [Code.MSG_D_VIEW_PLAYER_CARDS]: [ClientMessageViewPlayerCards, null! as ClientMessageViewPlayerCards.AsObject],
    [Code.MSG_D_PLAYER_JACKPOT_SUMMARY]: [ClientMessagePlayerJackpotSummary, null! as ClientMessagePlayerJackpotSummary.AsObject],
    [Code.MSG_D_CHAT_MEMBERS]: [ClientMessageChatMembers, null! as ClientMessageChatMembers.AsObject],
    [Code.MSG_D_VIEW_PLAYER_CARDS_NUM]: [ClientMessageViewPlayerCardsNum, null! as ClientMessageViewPlayerCardsNum.AsObject],
    [Code.MSG_D_ROOM_INSURANCE]: [ClientMessageRoomInsurance, null! as ClientMessageRoomInsurance.AsObject]
} as const;

export type CodeMessageTexasClientGC = typeof CodeMessageTexasClientGC;

export const CodeMessageTexasServerGC = {
    [Code.MSG_D_ENTER_ROOM]: ServerMessageEnterRoom,
    [Code.MSG_D_SEATED]: ServerMessageSeated,
    [Code.MSG_D_ADD_ON]: ServerMessageAddOn,
    [Code.MSG_D_BRING_IN]: ServerMessageBringIn,
    [Code.MSG_D_ACTION]: ServerMessageAction,
    [Code.MSG_D_AUTO_OP_ACTIVE]: ServerMessageAutoOpActive,
    [Code.MSG_D_SET_AUTO_ON_TABLE]: ServerMessageSetAutoOnTable,
    [Code.MSG_D_STANDUP_ACTIVE]: ServerMessageStandupActive,
    [Code.MSG_D_LEAVE]: ServerMessageLeave,
    [Code.MSG_D_KEEP_SEAT_ACTIVE]: ServerMessageKeepSeatActive,
    [Code.MSG_D_SHOWDOWN]: ServerMessageShowdown,
    [Code.MSG_D_SHOW_PUBLIC_CARDS]: ServerMessageShowPublicCards,
    [Code.MSG_D_ADD_TIME]: ServerMessageAddTime,
    [Code.MSG_D_BUY_INSURANCE_ACTIVE]: ServerMessageBuyInsuranceActive,
    [Code.MSG_D_AGREE_POST]: ServerMessageAgreePost,
    [Code.MSG_D_STORE_CHIPS]: ServerMessageStoreChips,
    [Code.MSG_D_PUBLIC_REPLAY]: ServerMessagePublicReplay,
    [Code.MSG_D_BROADCAST_MSG]: ServerMessageBroadcastMsg,
    [Code.MSG_D_PRIVATE_MSG]: ServerMessagePrivateMsg,
    [Code.MSG_D_ROOMERS]: ServerMessageRoomers,
    [Code.MSG_D_AGREE_SECOND_PCS_ACTIVE]: ServerMessageAgreeSecondPcsActive,
    [Code.MSG_D_OBSERVERS]: ServerMessageObservers,
    [Code.MSG_D_SQUID_IN_ACTIVE]: ServerMessageSquidInActive,
    [Code.MSG_D_SYNC_ENTER]: ServerMessageSyncEnter,
    [Code.MSG_D_VIEW_PLAYER_CARDS]: ServerMessageViewPlayerCards,
    [Code.MSG_D_PLAYER_JACKPOT_SUMMARY]: ServerMessagePlayerJackpotSummary,
    [Code.MSG_D_CHAT_MEMBERS]: ServerMessageChatMembers,
    [Code.MSG_D_VIEW_PLAYER_CARDS_NUM]: ServerMessageViewPlayerCardsNum,
    [Code.MSG_D_ROOM_INSURANCE]: ServerMessageRoomInsurance,
    [Code.MSG_S_SHOW_PUBLIC_CARDS_OTHERS]: ServerMessageShowPublicCardsOthers,
    [Code.MSG_S_SHOWCARDS]: ServerMessageShowcards,
    [Code.MSG_S_SEATED_OTHERS]: ServerMessageSeatedOthers,
    [Code.MSG_S_START_INFO]: ServerMessageStartInfo,
    [Code.MSG_S_PUBLIC_CARDS]: ServerMessagePublicCards,
    [Code.MSG_S_SIDE_POTS]: ServerMessageSidePots,
    [Code.MSG_S_CHIPS_CHANGE]: ServerMessageChipsChange,
    [Code.MSG_S_ACTION_ALL]: ServerMessageActionAll,
    [Code.MSG_S_AUTO_OP]: ServerMessageAutoOp,
    [Code.MSG_S_STANDUP]: ServerMessageStandup,
    [Code.MSG_S_KEEP_SEAT]: ServerMessageKeepSeat,
    [Code.MSG_S_WINNER]: ServerMessageWinner,
    [Code.MSG_S_ADD_TIME_OTHERS]: ServerMessageAddTimeOthers,
    [Code.MSG_S_LEAVE_NOTIFICATION]: ServerMessageLeaveNotification,
    [Code.MSG_S_INSURANCE_TRIGGED]: ServerMessageInsuranceTrigged,
    [Code.MSG_S_BUY_INSURANCE]: ServerMessageBuyInsurance,
    [Code.MSG_S_POST_STATUS_CHANGE]: ServerMessagePostStatusChange,
    [Code.MSG_S_BRING_IN_OR_STORE_FAIL]: ServerMessageBringInOrStoreFail,
    [Code.MSG_S_HAND_CLEAR]: ServerMessageHandClear,
    [Code.MSG_S_UP_BLIND]: ServerMessageUpBlind,
    [Code.MSG_S_GET_MSG]: ServerMessageGetMsg,
    [Code.MSG_S_AGREE_SECOND_PCS_TRIGGED]: ServerMessageAgreeSecondPcsTrigged,
    [Code.MSG_S_AGREE_SECOND_PCS]: ServerMessageAgreeSecondPcs,
    [Code.MSG_S_SYNC_HAND]: ServerMessageSyncHand,
    [Code.MSG_S_SQUID_IN]: ServerMessageSquidIn,
    [Code.MSG_S_NEXT_CHANGE]: ServerMessageNextChange,
    [Code.MSG_S_SHOW_VIEW_CARDS]: ServerMessageShowViewCards,
    [Code.MSG_S_ENCRYPT_CARDS]: ServerMessageEncryptCards,
    [Code.MSG_S_JACKPOT_GOLD_CHANGE]: ServerMessageJackpotGoldChange,
    [Code.MSG_S_JACKPOT_AWARD]: ServerMessageJackpotAward,
    [Code.MSG_S_INSURANCE_OUTS_CARDS]: ServerMessageInsuranceOutsCards,
    [Code.MSG_S_FORCE_VIDEO]: ServerMessageForceVideo,
    [Code.MSG_S_VIDEO_MASK_CHANGE]: ServerMessageVideoMaskChange,
    [Code.MSG_S_WAIT_CHECK_AUTO_ADD_TIME]: ServerMessageWaitCheckAutoAddTime
} as const;

export type CodeMessageTexasServerGC = typeof CodeMessageTexasServerGC;
