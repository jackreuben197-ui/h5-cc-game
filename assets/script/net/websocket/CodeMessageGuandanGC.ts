import { Code } from '../../protobuf/holdem/code_pb';
import { ServerMessageGdActionAll } from '../../protobuf/holdem/recv_gd_action_all_pb';
import { ServerMessageGdAddTimeOthers } from '../../protobuf/holdem/recv_gd_add_time_others_pb';
import { ServerMessageGdAutoOp } from '../../protobuf/holdem/recv_gd_auto_op_pb';
import { ServerMessageGdBringInFail } from '../../protobuf/holdem/recv_gd_bring_in_fail_pb';
import { ServerMessageGdChipsChange } from '../../protobuf/holdem/recv_gd_chips_change_pb';
import { ServerMessageGdGetMsg } from '../../protobuf/holdem/recv_gd_get_msg_pb';
import { ServerMessageGdHandClear } from '../../protobuf/holdem/recv_gd_hand_clear_pb';
import { ServerMessageGdKeepSeat } from '../../protobuf/holdem/recv_gd_keep_seat_pb';
import { ServerMessageGdLeaveNotification } from '../../protobuf/holdem/recv_gd_leave_notification_pb';
import { ServerMessageGdReadyStartAll } from '../../protobuf/holdem/recv_gd_ready_start_all_pb';
import { ServerMessageGdResult } from '../../protobuf/holdem/recv_gd_result_pb';
import { ServerMessageGdSeatedOthers } from '../../protobuf/holdem/recv_gd_seated_others_pb';
import { ServerMessageGdStandup } from '../../protobuf/holdem/recv_gd_stand_up_pb';
import { ServerMessageGdStartInfo } from '../../protobuf/holdem/recv_gd_start_info_pb';
import { ServerMessageGdTributeGiveComplete } from '../../protobuf/holdem/recv_gd_tribute_give_complete_pb';
import { ServerMessageGdTributeReturnComplete } from '../../protobuf/holdem/recv_gd_tribute_return_complete_pb';
import { ServerMessageGdVideoMaskChange } from '../../protobuf/holdem/recv_gd_video_mask_change_pb';
import { ServerMessageGdWaitReadyStart } from '../../protobuf/holdem/recv_gd_wait_ready_start_pb';
import { ServerMessageGdWinrateAddComplete } from '../../protobuf/holdem/recv_gd_winrate_add_complete_pb';
import { ClientMessageGdAction, ServerMessageGdAction } from '../../protobuf/holdem/req_gd_action_pb';
import { ClientMessageGdAddTime, ServerMessageGdAddTime } from '../../protobuf/holdem/req_gd_add_time_pb';
import { ClientMessageGdAutoOpActive, ServerMessageGdAutoOpActive } from '../../protobuf/holdem/req_gd_auto_op_active_pb';
import { ClientMessageGdBringIn, ServerMessageGdBringIn } from '../../protobuf/holdem/req_gd_bring_in_pb';
import { ClientMessageGdBroadcastMsg, ServerMessageGdBroadcastMsg } from '../../protobuf/holdem/req_gd_broadcast_msg_pb';
import { ClientMessageGdChatMembers, ServerMessageGdChatMembers } from '../../protobuf/holdem/req_gd_chat_members_pb';
import { ClientMessageGdEnterRoom, ServerMessageGdEnterRoom } from '../../protobuf/holdem/req_gd_enter_room_pb';
import { ClientMessageGdKeepSeatActive, ServerMessageGdKeepSeatActive } from '../../protobuf/holdem/req_gd_keep_seat_active_pb';
import { ClientMessageGdLeave, ServerMessageGdLeave } from '../../protobuf/holdem/req_gd_leave_pb';
import { ClientMessageGdObservers, ServerMessageGdObservers } from '../../protobuf/holdem/req_gd_observers_pb';
import { ClientMessageGdPrivateMsg, ServerMessageGdPrivateMsg } from '../../protobuf/holdem/req_gd_private_msg_pb';
import { ClientMessageGdReadyStart, ServerMessageGdReadyStart } from '../../protobuf/holdem/req_gd_ready_start_pb';
import { ClientMessageGdReplay, ServerMessageGdReplay } from '../../protobuf/holdem/req_gd_replay_pb';
import { ClientMessageGdRoomers, ServerMessageGdRoomers } from '../../protobuf/holdem/req_gd_roomers_pb';
import { ClientMessageGdSeated, ServerMessageGdSeated } from '../../protobuf/holdem/req_gd_seated_pb';
import { ClientMessageGdSetAutoOnTable, ServerMessageGdSetAutoOnTable } from '../../protobuf/holdem/req_gd_set_auto_on_table_pb';
import { ClientMessageGdStandupActive, ServerMessageGdStandupActive } from '../../protobuf/holdem/req_gd_stand_up_active_pb';
import { ClientMessageGdSyncEnter, ServerMessageGdSyncEnter } from '../../protobuf/holdem/req_gd_sync_enter_pb';
import { ClientMessageGdTributeGive, ServerMessageGdTributeGive } from '../../protobuf/holdem/req_gd_tribute_give_pb';
import { ClientMessageGdTributeReturn, ServerMessageGdTributeReturn } from '../../protobuf/holdem/req_gd_tribute_return_pb';
import { ClientMessageGdWinrateAdd, ServerMessageGdWinrateAdd } from '../../protobuf/holdem/req_gd_winrate_add_pb';

export const CodeMessageGuandanClientGC = {
    [Code.MSG_D_GD_ENTER_ROOM]: [ClientMessageGdEnterRoom, null! as ClientMessageGdEnterRoom.AsObject],
    [Code.MSG_D_GD_SEATED]: [ClientMessageGdSeated, null! as ClientMessageGdSeated.AsObject],
    [Code.MSG_D_GD_BRING_IN]: [ClientMessageGdBringIn, null! as ClientMessageGdBringIn.AsObject],
    [Code.MSG_D_GD_READY_START]: [ClientMessageGdReadyStart, null! as ClientMessageGdReadyStart.AsObject],
    [Code.MSG_D_GD_WINRATE_ADD]: [ClientMessageGdWinrateAdd, null! as ClientMessageGdWinrateAdd.AsObject],
    [Code.MSG_D_GD_TRIBUTE_GIVE]: [ClientMessageGdTributeGive, null! as ClientMessageGdTributeGive.AsObject],
    [Code.MSG_D_GD_TRIBUTE_RETURN]: [ClientMessageGdTributeReturn, null! as ClientMessageGdTributeReturn.AsObject],
    [Code.MSG_D_GD_ACTION]: [ClientMessageGdAction, null! as ClientMessageGdAction.AsObject],
    [Code.MSG_D_GD_AUTO_OP_ACTIVE]: [ClientMessageGdAutoOpActive, null! as ClientMessageGdAutoOpActive.AsObject],
    [Code.MSG_D_GD_STANDUP_ACTIVE]: [ClientMessageGdStandupActive, null! as ClientMessageGdStandupActive.AsObject],
    [Code.MSG_D_GD_LEAVE]: [ClientMessageGdLeave, null! as ClientMessageGdLeave.AsObject],
    [Code.MSG_D_GD_KEEP_SEAT_ACTIVE]: [ClientMessageGdKeepSeatActive, null! as ClientMessageGdKeepSeatActive.AsObject],
    [Code.MSG_D_GD_ADD_TIME]: [ClientMessageGdAddTime, null! as ClientMessageGdAddTime.AsObject],
    [Code.MSG_D_GD_BROADCAST_MSG]: [ClientMessageGdBroadcastMsg, null! as ClientMessageGdBroadcastMsg.AsObject],
    [Code.MSG_D_GD_PRIVATE_MSG]: [ClientMessageGdPrivateMsg, null! as ClientMessageGdPrivateMsg.AsObject],
    [Code.MSG_D_GD_ROOMERS]: [ClientMessageGdRoomers, null! as ClientMessageGdRoomers.AsObject],
    [Code.MSG_D_GD_SET_AUTO_ON_TABLE]: [ClientMessageGdSetAutoOnTable, null! as ClientMessageGdSetAutoOnTable.AsObject],
    [Code.MSG_D_GD_OBSERVERS]: [ClientMessageGdObservers, null! as ClientMessageGdObservers.AsObject],
    [Code.MSG_D_GD_SYNC_ENTER]: [ClientMessageGdSyncEnter, null! as ClientMessageGdSyncEnter.AsObject],
    [Code.MSG_D_GD_REPLAY]: [ClientMessageGdReplay, null! as ClientMessageGdReplay.AsObject],
    [Code.MSG_D_GD_CHAT_MEMBERS]: [ClientMessageGdChatMembers, null! as ClientMessageGdChatMembers.AsObject]
} as const;

export type CodeMessageGuandanClientGC = typeof CodeMessageGuandanClientGC;

export const CodeMessageGuandanServerGC = {
    [Code.MSG_D_GD_ENTER_ROOM]: ServerMessageGdEnterRoom,
    [Code.MSG_D_GD_SEATED]: ServerMessageGdSeated,
    [Code.MSG_D_GD_BRING_IN]: ServerMessageGdBringIn,
    [Code.MSG_D_GD_READY_START]: ServerMessageGdReadyStart,
    [Code.MSG_D_GD_WINRATE_ADD]: ServerMessageGdWinrateAdd,
    [Code.MSG_D_GD_TRIBUTE_GIVE]: ServerMessageGdTributeGive,
    [Code.MSG_D_GD_TRIBUTE_RETURN]: ServerMessageGdTributeReturn,
    [Code.MSG_D_GD_ACTION]: ServerMessageGdAction,
    [Code.MSG_D_GD_AUTO_OP_ACTIVE]: ServerMessageGdAutoOpActive,
    [Code.MSG_D_GD_STANDUP_ACTIVE]: ServerMessageGdStandupActive,
    [Code.MSG_D_GD_LEAVE]: ServerMessageGdLeave,
    [Code.MSG_D_GD_KEEP_SEAT_ACTIVE]: ServerMessageGdKeepSeatActive,
    [Code.MSG_D_GD_ADD_TIME]: ServerMessageGdAddTime,
    [Code.MSG_D_GD_BROADCAST_MSG]: ServerMessageGdBroadcastMsg,
    [Code.MSG_D_GD_PRIVATE_MSG]: ServerMessageGdPrivateMsg,
    [Code.MSG_D_GD_ROOMERS]: ServerMessageGdRoomers,
    [Code.MSG_D_GD_SET_AUTO_ON_TABLE]: ServerMessageGdSetAutoOnTable,
    [Code.MSG_D_GD_OBSERVERS]: ServerMessageGdObservers,
    [Code.MSG_D_GD_SYNC_ENTER]: ServerMessageGdSyncEnter,
    [Code.MSG_D_GD_REPLAY]: ServerMessageGdReplay,
    [Code.MSG_D_GD_CHAT_MEMBERS]: ServerMessageGdChatMembers,
    [Code.MSG_S_GD_SEATED_OTHERS]: ServerMessageGdSeatedOthers,
    [Code.MSG_S_GD_START_INFO]: ServerMessageGdStartInfo,
    [Code.MSG_S_GD_WINRATE_ADD_COMPLETE]: ServerMessageGdWinrateAddComplete,
    [Code.MSG_S_GD_TRIBUTE_GIVE_COMPLETE]: ServerMessageGdTributeGiveComplete,
    [Code.MSG_S_GD_TRIBUTE_RETURN_COMPLETE]: ServerMessageGdTributeReturnComplete,
    [Code.MSG_S_GD_CHIPS_CHANGE]: ServerMessageGdChipsChange,
    [Code.MSG_S_GD_ACTION_ALL]: ServerMessageGdActionAll,
    [Code.MSG_S_GD_AUTO_OP]: ServerMessageGdAutoOp,
    [Code.MSG_S_GD_STANDUP]: ServerMessageGdStandup,
    [Code.MSG_S_GD_KEEP_SEAT]: ServerMessageGdKeepSeat,
    [Code.MSG_S_GD_RESULT]: ServerMessageGdResult,
    [Code.MSG_S_GD_ADD_TIME_OTHERS]: ServerMessageGdAddTimeOthers,
    [Code.MSG_S_GD_LEAVE_NOTIFICATION]: ServerMessageGdLeaveNotification,
    [Code.MSG_S_GD_BRING_IN_FAIL]: ServerMessageGdBringInFail,
    [Code.MSG_S_GD_HAND_CLEAR]: ServerMessageGdHandClear,
    [Code.MSG_S_GD_GET_MSG]: ServerMessageGdGetMsg,
    [Code.MSG_S_GD_READY_START_ALL]: ServerMessageGdReadyStartAll,
    [Code.MSG_S_GD_WAIT_READY_START]: ServerMessageGdWaitReadyStart,
    [Code.MSG_S_GD_VIDEO_MASK_CHANGE]: ServerMessageGdVideoMaskChange
} as const;

export type CodeMessageGuandanServerGC = typeof CodeMessageGuandanServerGC;
