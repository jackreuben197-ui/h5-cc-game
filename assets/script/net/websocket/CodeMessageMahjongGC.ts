import { Code } from '../../protobuf/holdem/code_pb';
import { ServerMessageMjActionAll } from '../../protobuf/holdem/recv_mj_action_all_pb';
import { ServerMessageMjActionFail } from '../../protobuf/holdem/recv_mj_action_fail_pb';
import { ServerMessageMjAddTimeOthers } from '../../protobuf/holdem/recv_mj_add_time_others_pb';
import { ServerMessageMjAutoOp } from '../../protobuf/holdem/recv_mj_auto_op_pb';
import { ServerMessageMjBringInFail } from '../../protobuf/holdem/recv_mj_bring_in_fail_pb';
import { ServerMessageMjChipsChange } from '../../protobuf/holdem/recv_mj_chips_change_pb';
import { ServerMessageMjExchangeTilesComplete } from '../../protobuf/holdem/recv_mj_exchange_tiles_complete_pb';
import { ServerMessageMjFollowDealer } from '../../protobuf/holdem/recv_mj_follow_dealer_pb';
import { ServerMessageMjGetMsg } from '../../protobuf/holdem/recv_mj_get_msg_pb';
import { ServerMessageMjHandClear } from '../../protobuf/holdem/recv_mj_hand_clear_pb';
import { ServerMessageMjKeepSeat } from '../../protobuf/holdem/recv_mj_keep_seat_pb';
import { ServerMessageMjLeaveNotification } from '../../protobuf/holdem/recv_mj_leave_notification_pb';
import { ServerMessageMjNeedBringInComplete } from '../../protobuf/holdem/recv_mj_need_bring_in_complete_pb';
import { ServerMessageMjNeedBringIn } from '../../protobuf/holdem/recv_mj_need_bring_in_pb';
import { ServerMessageMjPrepare } from '../../protobuf/holdem/recv_mj_prepare_pb';
import { ServerMessageMjRaiseComplete } from '../../protobuf/holdem/recv_mj_raise_complete_pb';
import { ServerMessageMjResult } from '../../protobuf/holdem/recv_mj_result_pb';
import { ServerMessageMjSeatedOthers } from '../../protobuf/holdem/recv_mj_seated_others_pb';
import { ServerMessageMjStandup } from '../../protobuf/holdem/recv_mj_stand_up_pb';
import { ServerMessageMjStartInfo } from '../../protobuf/holdem/recv_mj_start_info_pb';
import { ServerMessageMjSyncHand } from '../../protobuf/holdem/recv_mj_sync_hand_pb';
import { ServerMessageMjUpBlind } from '../../protobuf/holdem/recv_mj_up_blind_pb';
import { ServerMessageMjVideoMaskChange } from '../../protobuf/holdem/recv_mj_video_mask_change.proto_pb';
import { ServerMessageMjVoidSuitComplete } from '../../protobuf/holdem/recv_mj_void_suit_complete_pb';
import { ServerMessageMjWaitTurnAction } from '../../protobuf/holdem/recv_mj_wait_turn_action_pb';
import { ClientMessageMjAction, ServerMessageMjAction } from '../../protobuf/holdem/req_mj_action_pb';
import { ClientMessageMjAddTime, ServerMessageMjAddTime } from '../../protobuf/holdem/req_mj_add_time_pb';
import { ClientMessageMjAutoOpActive, ServerMessageMjAutoOpActive } from '../../protobuf/holdem/req_mj_auto_op_active_pb';
import { ClientMessageMjBringIn, ServerMessageMjBringIn } from '../../protobuf/holdem/req_mj_bring_in_pb';
import { ClientMessageMjBroadcastMsg, ServerMessageMjBroadcastMsg } from '../../protobuf/holdem/req_mj_broadcast_msg_pb';
import { ClientMessageMjChatMembers, ServerMessageMjChatMembers } from '../../protobuf/holdem/req_mj_chat_members_pb';
import { ClientMessageMjEnterRoom, ServerMessageMjEnterRoom } from '../../protobuf/holdem/req_mj_enter_room_pb';
import { ClientMessageMjExchangeTiles, ServerMessageMjExchangeTiles } from '../../protobuf/holdem/req_mj_exchange_tiles_pb';
import { ClientMessageMjKeepSeatActive, ServerMessageMjKeepSeatActive } from '../../protobuf/holdem/req_mj_keep_seat_active_pb';
import { ClientMessageMjLeave, ServerMessageMjLeave } from '../../protobuf/holdem/req_mj_leave_pb';
import { ClientMessageMjObservers, ServerMessageMjObservers } from '../../protobuf/holdem/req_mj_observers_pb';
import { ClientMessageMjPrivateMsg, ServerMessageMjPrivateMsg } from '../../protobuf/holdem/req_mj_private_msg_pb';
import { ClientMessageMjRaise, ServerMessageMjRaise } from '../../protobuf/holdem/req_mj_raise_pb';
import { ClientMessageMjRejectBringIn, ServerMessageMjRejectBringIn } from '../../protobuf/holdem/req_mj_reject_bring_in_pb';
import { ClientMessageMjReplay, ServerMessageMjReplay } from '../../protobuf/holdem/req_mj_replay_pb';
import { ClientMessageMjRoomers, ServerMessageMjRoomers } from '../../protobuf/holdem/req_mj_roomers_pb';
import { ClientMessageMjSeated, ServerMessageMjSeated } from '../../protobuf/holdem/req_mj_seated_pb';
import { ClientMessageMjSetAutoOnTable, ServerMessageMjSetAutoOnTable } from '../../protobuf/holdem/req_mj_set_auto_on_table_pb';
import { ClientMessageMjStandupActive, ServerMessageMjStandupActive } from '../../protobuf/holdem/req_mj_stand_up_active_pb';
import { ClientMessageMjSyncEnter, ServerMessageMjSyncEnter } from '../../protobuf/holdem/req_mj_sync_enter_pb';
import { ClientMessageMjVoidSuit, ServerMessageMjVoidSuit } from '../../protobuf/holdem/req_mj_void_suit_pb';

export const CodeMessageMahjongClientGC = {
    [Code.MSG_D_MJ_ENTER_ROOM]: [ClientMessageMjEnterRoom, null! as ClientMessageMjEnterRoom.AsObject],
    [Code.MSG_D_MJ_SEATED]: [ClientMessageMjSeated, null! as ClientMessageMjSeated.AsObject],
    [Code.MSG_D_MJ_BRING_IN]: [ClientMessageMjBringIn, null! as ClientMessageMjBringIn.AsObject],
    [Code.MSG_D_MJ_EXCHANGE_TILES]: [ClientMessageMjExchangeTiles, null! as ClientMessageMjExchangeTiles.AsObject],
    [Code.MSG_D_MJ_VOID_SUIT]: [ClientMessageMjVoidSuit, null! as ClientMessageMjVoidSuit.AsObject],
    [Code.MSG_D_MJ_ACTION]: [ClientMessageMjAction, null! as ClientMessageMjAction.AsObject],
    [Code.MSG_D_MJ_AUTO_OP_ACTIVE]: [ClientMessageMjAutoOpActive, null! as ClientMessageMjAutoOpActive.AsObject],
    [Code.MSG_D_MJ_STANDUP_ACTIVE]: [ClientMessageMjStandupActive, null! as ClientMessageMjStandupActive.AsObject],
    [Code.MSG_D_MJ_LEAVE]: [ClientMessageMjLeave, null! as ClientMessageMjLeave.AsObject],
    [Code.MSG_D_MJ_KEEP_SEAT_ACTIVE]: [ClientMessageMjKeepSeatActive, null! as ClientMessageMjKeepSeatActive.AsObject],
    [Code.MSG_D_MJ_ADD_TIME]: [ClientMessageMjAddTime, null! as ClientMessageMjAddTime.AsObject],
    [Code.MSG_D_MJ_BROADCAST_MSG]: [ClientMessageMjBroadcastMsg, null! as ClientMessageMjBroadcastMsg.AsObject],
    [Code.MSG_D_MJ_PRIVATE_MSG]: [ClientMessageMjPrivateMsg, null! as ClientMessageMjPrivateMsg.AsObject],
    [Code.MSG_D_MJ_ROOMERS]: [ClientMessageMjRoomers, null! as ClientMessageMjRoomers.AsObject],
    [Code.MSG_D_MJ_SET_AUTO_ON_TABLE]: [ClientMessageMjSetAutoOnTable, null! as ClientMessageMjSetAutoOnTable.AsObject],
    [Code.MSG_D_MJ_OBSERVERS]: [ClientMessageMjObservers, null! as ClientMessageMjObservers.AsObject],
    [Code.MSG_D_MJ_SYNC_ENTER]: [ClientMessageMjSyncEnter, null! as ClientMessageMjSyncEnter.AsObject],
    [Code.MSG_D_MJ_REPLAY]: [ClientMessageMjReplay, null! as ClientMessageMjReplay.AsObject],
    [Code.MSG_D_MJ_CHAT_MEMBERS]: [ClientMessageMjChatMembers, null! as ClientMessageMjChatMembers.AsObject],
    [Code.MSG_D_MJ_RAISE]: [ClientMessageMjRaise, null! as ClientMessageMjRaise.AsObject],
    [Code.MSG_D_MJ_REJECT_BRING_IN]: [ClientMessageMjRejectBringIn, null! as ClientMessageMjRejectBringIn.AsObject]
} as const;

export type CodeMessageMahjongClientGC = typeof CodeMessageMahjongClientGC;

export const CodeMessageMahjongServerGC = {
    [Code.MSG_D_MJ_ENTER_ROOM]: ServerMessageMjEnterRoom,
    [Code.MSG_D_MJ_SEATED]: ServerMessageMjSeated,
    [Code.MSG_D_MJ_BRING_IN]: ServerMessageMjBringIn,
    [Code.MSG_D_MJ_EXCHANGE_TILES]: ServerMessageMjExchangeTiles,
    [Code.MSG_D_MJ_VOID_SUIT]: ServerMessageMjVoidSuit,
    [Code.MSG_D_MJ_ACTION]: ServerMessageMjAction,
    [Code.MSG_D_MJ_AUTO_OP_ACTIVE]: ServerMessageMjAutoOpActive,
    [Code.MSG_D_MJ_STANDUP_ACTIVE]: ServerMessageMjStandupActive,
    [Code.MSG_D_MJ_LEAVE]: ServerMessageMjLeave,
    [Code.MSG_D_MJ_KEEP_SEAT_ACTIVE]: ServerMessageMjKeepSeatActive,
    [Code.MSG_D_MJ_ADD_TIME]: ServerMessageMjAddTime,
    [Code.MSG_D_MJ_BROADCAST_MSG]: ServerMessageMjBroadcastMsg,
    [Code.MSG_D_MJ_PRIVATE_MSG]: ServerMessageMjPrivateMsg,
    [Code.MSG_D_MJ_ROOMERS]: ServerMessageMjRoomers,
    [Code.MSG_D_MJ_SET_AUTO_ON_TABLE]: ServerMessageMjSetAutoOnTable,
    [Code.MSG_D_MJ_OBSERVERS]: ServerMessageMjObservers,
    [Code.MSG_D_MJ_SYNC_ENTER]: ServerMessageMjSyncEnter,
    [Code.MSG_D_MJ_REPLAY]: ServerMessageMjReplay,
    [Code.MSG_D_MJ_CHAT_MEMBERS]: ServerMessageMjChatMembers,
    [Code.MSG_D_MJ_RAISE]: ServerMessageMjRaise,
    [Code.MSG_D_MJ_REJECT_BRING_IN]: ServerMessageMjRejectBringIn,
    [Code.MSG_S_MJ_SEATED_OTHERS]: ServerMessageMjSeatedOthers,
    [Code.MSG_S_MJ_START_INFO]: ServerMessageMjStartInfo,
    [Code.MSG_S_MJ_EXCHANGE_TILES_COMPLETE]: ServerMessageMjExchangeTilesComplete,
    [Code.MSG_S_MJ_VOID_SUIT_COMPLETE]: ServerMessageMjVoidSuitComplete,
    [Code.MSG_S_MJ_CHIPS_CHANGE]: ServerMessageMjChipsChange,
    [Code.MSG_S_MJ_ACTION_ALL]: ServerMessageMjActionAll,
    [Code.MSG_S_MJ_AUTO_OP]: ServerMessageMjAutoOp,
    [Code.MSG_S_MJ_STANDUP]: ServerMessageMjStandup,
    [Code.MSG_S_MJ_KEEP_SEAT]: ServerMessageMjKeepSeat,
    [Code.MSG_S_MJ_RESULT]: ServerMessageMjResult,
    [Code.MSG_S_MJ_ADD_TIME_OTHERS]: ServerMessageMjAddTimeOthers,
    [Code.MSG_S_MJ_LEAVE_NOTIFICATION]: ServerMessageMjLeaveNotification,
    [Code.MSG_S_MJ_BRING_IN_FAIL]: ServerMessageMjBringInFail,
    [Code.MSG_S_MJ_HAND_CLEAR]: ServerMessageMjHandClear,
    [Code.MSG_S_MJ_GET_MSG]: ServerMessageMjGetMsg,
    [Code.MSG_S_MJ_WAIT_TURN_ACTION]: ServerMessageMjWaitTurnAction,
    [Code.MSG_S_MJ_ACTION_FAIL]: ServerMessageMjActionFail,
    [Code.MSG_S_MJ_PREPARE]: ServerMessageMjPrepare,
    [Code.MSG_S_MJ_RAISE_COMPLETE]: ServerMessageMjRaiseComplete,
    [Code.MSG_S_MJ_FOLLOW_DEALER]: ServerMessageMjFollowDealer,
    [Code.MSG_S_MJ_NEED_BRING_IN]: ServerMessageMjNeedBringIn,
    [Code.MSG_S_MJ_NEED_BRING_IN_COMPLETE]: ServerMessageMjNeedBringInComplete,
    [Code.MSG_S_MJ_VIDEO_MASK_CHANGE]: ServerMessageMjVideoMaskChange,
    [Code.MSG_S_MJ_UP_BLIND]: ServerMessageMjUpBlind,
    [Code.MSG_S_MJ_SYNC_HAND]: ServerMessageMjSyncHand
} as const;

export type CodeMessageMahjongServerGC = typeof CodeMessageMahjongServerGC;
