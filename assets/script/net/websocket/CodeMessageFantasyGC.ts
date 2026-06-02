import { Code } from '../../protobuf/holdem/code_pb';
import { ServerMessageFtActionAll } from '../../protobuf/holdem/recv_ft_action_all_pb';
import { ServerMessageFtAddTimeOthers } from '../../protobuf/holdem/recv_ft_add_time_others_pb';
import { ServerMessageFtAutoOp } from '../../protobuf/holdem/recv_ft_auto_op_pb';
import { ServerMessageFtBringInFail } from '../../protobuf/holdem/recv_ft_bring_in_fail_pb';
import { ServerMessageFtChipsChange } from '../../protobuf/holdem/recv_ft_chips_change_pb';
import { ServerMessageFtGetMsg } from '../../protobuf/holdem/recv_ft_get_msg_pb';
import { ServerMessageFtHandClear } from '../../protobuf/holdem/recv_ft_hand_clear_pb';
import { ServerMessageFtKeepSeat } from '../../protobuf/holdem/recv_ft_keep_seat_pb';
import { ServerMessageFtLeaveNotification } from '../../protobuf/holdem/recv_ft_leave_notification_pb';
import { ServerMessageFtPairAll } from '../../protobuf/holdem/recv_ft_pair_all_pb';
import { ServerMessageFtPublicCards } from '../../protobuf/holdem/recv_ft_public_cards_pb';
import { ServerMessageFtSeatedOthers } from '../../protobuf/holdem/recv_ft_seated_others_pb';
import { ServerMessageFtStandup } from '../../protobuf/holdem/recv_ft_stand_up_pb';
import { ServerMessageFtStartInfo } from '../../protobuf/holdem/recv_ft_start_info_pb';
import { ServerMessageFtVideoMaskChange } from '../../protobuf/holdem/recv_ft_video_mask_change_pb';
import { ServerMessageFtWinner } from '../../protobuf/holdem/recv_ft_winner_pb';
import { ClientMessageFtAction, ServerMessageFtAction } from '../../protobuf/holdem/req_ft_action_pb';
import { ClientMessageFtAddTime, ServerMessageFtAddTime } from '../../protobuf/holdem/req_ft_add_time_pb';
import { ClientMessageFtAutoOpActive, ServerMessageFtAutoOpActive } from '../../protobuf/holdem/req_ft_auto_op_active_pb';
import { ClientMessageFtBringIn, ServerMessageFtBringIn } from '../../protobuf/holdem/req_ft_bring_in_pb';
import { ClientMessageFtBroadcastMsg, ServerMessageFtBroadcastMsg } from '../../protobuf/holdem/req_ft_broadcast_msg_pb';
import { ClientMessageFtChatMembers, ServerMessageFtChatMembers } from '../../protobuf/holdem/req_ft_chat_members_pb';
import { ClientMessageFtEnterRoom, ServerMessageFtEnterRoom } from '../../protobuf/holdem/req_ft_enter_room_pb';
import { ClientMessageFtKeepSeatActive, ServerMessageFtKeepSeatActive } from '../../protobuf/holdem/req_ft_keep_seat_active_pb';
import { ClientMessageFtLeave, ServerMessageFtLeave } from '../../protobuf/holdem/req_ft_leave_pb';
import { ClientMessageFtObservers, ServerMessageFtObservers } from '../../protobuf/holdem/req_ft_observers_pb';
import { ClientMessageFtPair, ServerMessageFtPair } from '../../protobuf/holdem/req_ft_pair_pb';
import { ClientMessageFtPrivateMsg, ServerMessageFtPrivateMsg } from '../../protobuf/holdem/req_ft_private_msg_pb';
import { ClientMessageFtPublicReplay, ServerMessageFtPublicReplay } from '../../protobuf/holdem/req_ft_replay_pb';
import { ClientMessageFtRoomers, ServerMessageFtRoomers } from '../../protobuf/holdem/req_ft_roomers_pb';
import { ClientMessageFtSeated, ServerMessageFtSeated } from '../../protobuf/holdem/req_ft_seated_pb';
import { ClientMessageFtSetAutoOnTable, ServerMessageFtSetAutoOnTable } from '../../protobuf/holdem/req_ft_set_auto_on_table_pb';
import { ClientMessageFtStandupActive, ServerMessageFtStandupActive } from '../../protobuf/holdem/req_ft_stand_up_active_pb';
import { ClientMessageFtSyncEnter, ServerMessageFtSyncEnter } from '../../protobuf/holdem/req_ft_sync_enter_pb';

export const CodeMessageFantasyClientGC = {
    [Code.MSG_D_FT_ENTER_ROOM]: [ClientMessageFtEnterRoom, null! as ClientMessageFtEnterRoom.AsObject],
    [Code.MSG_D_FT_SEATED]: [ClientMessageFtSeated, null! as ClientMessageFtSeated.AsObject],
    [Code.MSG_D_FT_BRING_IN]: [ClientMessageFtBringIn, null! as ClientMessageFtBringIn.AsObject],
    [Code.MSG_D_FT_ACTION]: [ClientMessageFtAction, null! as ClientMessageFtAction.AsObject],
    [Code.MSG_D_FT_AUTO_OP_ACTIVE]: [ClientMessageFtAutoOpActive, null! as ClientMessageFtAutoOpActive.AsObject],
    [Code.MSG_D_FT_STANDUP_ACTIVE]: [ClientMessageFtStandupActive, null! as ClientMessageFtStandupActive.AsObject],
    [Code.MSG_D_FT_LEAVE]: [ClientMessageFtLeave, null! as ClientMessageFtLeave.AsObject],
    [Code.MSG_D_FT_KEEP_SEAT_ACTIVE]: [ClientMessageFtKeepSeatActive, null! as ClientMessageFtKeepSeatActive.AsObject],
    [Code.MSG_D_FT_ADD_TIME]: [ClientMessageFtAddTime, null! as ClientMessageFtAddTime.AsObject],
    [Code.MSG_D_FT_PUBLIC_REPLAY]: [ClientMessageFtPublicReplay, null! as ClientMessageFtPublicReplay.AsObject],
    [Code.MSG_D_FT_BROADCAST_MSG]: [ClientMessageFtBroadcastMsg, null! as ClientMessageFtBroadcastMsg.AsObject],
    [Code.MSG_D_FT_PRIVATE_MSG]: [ClientMessageFtPrivateMsg, null! as ClientMessageFtPrivateMsg.AsObject],
    [Code.MSG_D_FT_ROOMERS]: [ClientMessageFtRoomers, null! as ClientMessageFtRoomers.AsObject],
    [Code.MSG_D_FT_SET_AUTO_ON_TABLE]: [ClientMessageFtSetAutoOnTable, null! as ClientMessageFtSetAutoOnTable.AsObject],
    [Code.MSG_D_FT_PAIR]: [ClientMessageFtPair, null! as ClientMessageFtPair.AsObject],
    [Code.MSG_D_FT_OBSERVERS]: [ClientMessageFtObservers, null! as ClientMessageFtObservers.AsObject],
    [Code.MSG_D_FT_SYNC_ENTER]: [ClientMessageFtSyncEnter, null! as ClientMessageFtSyncEnter.AsObject],
    [Code.MSG_D_FT_CHAT_MEMBERS]: [ClientMessageFtChatMembers, null! as ClientMessageFtChatMembers.AsObject]
} as const;

export type CodeMessageFantasyClientGC = typeof CodeMessageFantasyClientGC;

export const CodeMessageFantasyServerGC = {
    [Code.MSG_D_FT_ENTER_ROOM]: ServerMessageFtEnterRoom,
    [Code.MSG_D_FT_SEATED]: ServerMessageFtSeated,
    [Code.MSG_D_FT_BRING_IN]: ServerMessageFtBringIn,
    [Code.MSG_D_FT_ACTION]: ServerMessageFtAction,
    [Code.MSG_D_FT_AUTO_OP_ACTIVE]: ServerMessageFtAutoOpActive,
    [Code.MSG_D_FT_STANDUP_ACTIVE]: ServerMessageFtStandupActive,
    [Code.MSG_D_FT_LEAVE]: ServerMessageFtLeave,
    [Code.MSG_D_FT_KEEP_SEAT_ACTIVE]: ServerMessageFtKeepSeatActive,
    [Code.MSG_D_FT_ADD_TIME]: ServerMessageFtAddTime,
    [Code.MSG_D_FT_PUBLIC_REPLAY]: ServerMessageFtPublicReplay,
    [Code.MSG_D_FT_BROADCAST_MSG]: ServerMessageFtBroadcastMsg,
    [Code.MSG_D_FT_PRIVATE_MSG]: ServerMessageFtPrivateMsg,
    [Code.MSG_D_FT_ROOMERS]: ServerMessageFtRoomers,
    [Code.MSG_D_FT_SET_AUTO_ON_TABLE]: ServerMessageFtSetAutoOnTable,
    [Code.MSG_D_FT_PAIR]: ServerMessageFtPair,
    [Code.MSG_D_FT_OBSERVERS]: ServerMessageFtObservers,
    [Code.MSG_D_FT_SYNC_ENTER]: ServerMessageFtSyncEnter,
    [Code.MSG_D_FT_CHAT_MEMBERS]: ServerMessageFtChatMembers,
    [Code.MSG_S_FT_SEATED_OTHERS]: ServerMessageFtSeatedOthers,
    [Code.MSG_S_FT_START_INFO]: ServerMessageFtStartInfo,
    [Code.MSG_S_FT_PUBLIC_CARDS]: ServerMessageFtPublicCards,
    [Code.MSG_S_FT_CHIPS_CHANGE]: ServerMessageFtChipsChange,
    [Code.MSG_S_FT_ACTION_ALL]: ServerMessageFtActionAll,
    [Code.MSG_S_FT_AUTO_OP]: ServerMessageFtAutoOp,
    [Code.MSG_S_FT_STANDUP]: ServerMessageFtStandup,
    [Code.MSG_S_FT_KEEP_SEAT]: ServerMessageFtKeepSeat,
    [Code.MSG_S_FT_WINNER]: ServerMessageFtWinner,
    [Code.MSG_S_FT_ADD_TIME_OTHERS]: ServerMessageFtAddTimeOthers,
    [Code.MSG_S_FT_LEAVE_NOTIFICATION]: ServerMessageFtLeaveNotification,
    [Code.MSG_S_FT_BRING_IN_FAIL]: ServerMessageFtBringInFail,
    [Code.MSG_S_FT_HAND_CLEAR]: ServerMessageFtHandClear,
    [Code.MSG_S_FT_GET_MSG]: ServerMessageFtGetMsg,
    [Code.MSG_S_FT_PAIR_ALL]: ServerMessageFtPairAll,
    [Code.MSG_S_FT_VIDEO_MASK_CHANGE]: ServerMessageFtVideoMaskChange
} as const;

export type CodeMessageFantasyServerGC = typeof CodeMessageFantasyServerGC;
