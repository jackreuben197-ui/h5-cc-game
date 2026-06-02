import { Code } from '../../protobuf/holdem/code_pb';
import { ServerMessageCbChatOthers } from '../../protobuf/holdem/recv_cb_chat_other_pb';
import { ServerMessageCbEncryptCards } from '../../protobuf/holdem/recv_cb_encrypt_cards_pb';
import { ServerMessageCbGamePlayEnd } from '../../protobuf/holdem/recv_cb_game_play_end_pb';
import { ServerMessageCbGamePlayInfo } from '../../protobuf/holdem/recv_cb_game_play_info_pb';
import { ServerMessageCbGameResult } from '../../protobuf/holdem/recv_cb_game_result_pb';
import { ServerMessageCbGameStart } from '../../protobuf/holdem/recv_cb_game_start_pb';
import { ServerMessageCbLeaveNotification } from '../../protobuf/holdem/recv_cb_leave_notification_pb';
import { ServerMessageCbRoomClose } from '../../protobuf/holdem/recv_cb_room_close_pb';
import { ServerMessageCbStandupNotification } from '../../protobuf/holdem/recv_cb_standup_notification_pb';
import { ServerMessageCbWaymapUpdate } from '../../protobuf/holdem/recv_cb_waymap_update_pb';
import { ClientMessageCbBringIn, ServerMessageCbBringIn } from '../../protobuf/holdem/req_cb_bring_in_pb';
import { ClientMessageCbCancelPlay, ServerMessageCbCancelPlay } from '../../protobuf/holdem/req_cb_cancel_play_pb';
import { ClientMessageCbChat, ServerMessageCbChat } from '../../protobuf/holdem/req_cb_chat_pb';
import { ClientMessageCbEnterRoom, ServerMessageCbEnterRoom } from '../../protobuf/holdem/req_cb_enter_room_pb';
import { ClientMessageCbLastGames, ServerMessageCbLastGames } from '../../protobuf/holdem/req_cb_last_games_pb';
import { ClientMessageCbLeave, ServerMessageCbLeave } from '../../protobuf/holdem/req_cb_leave_pb';
import { ClientMessageCbOnline, ServerMessageCbOnline } from '../../protobuf/holdem/req_cb_online_pb';
import { ClientMessageCbPlay, ServerMessageCbPlay } from '../../protobuf/holdem/req_cb_play_pb';
import { ClientMessageCbSyncEnter, ServerMessageCbSyncEnter } from '../../protobuf/holdem/req_cb_sync_enter_pb';
import { ClientMessageCbTop, ServerMessageCbTop } from '../../protobuf/holdem/req_cb_top_pb';
import { ClientMessageCbWaymap, ServerMessageCbWaymap } from '../../protobuf/holdem/req_cb_waymap_pb';
import { ClientMessageCbWaymapSpec, ServerMessageCbWaymapSpec } from '../../protobuf/holdem/req_cb_waymap_spec_pb';

export const CodeMessageCowboyClientGC = {
    [Code.MSG_D_CB_ENTER_ROOM]: [ClientMessageCbEnterRoom, null! as ClientMessageCbEnterRoom.AsObject],
    [Code.MSG_D_CB_PLAY]: [ClientMessageCbPlay, null! as ClientMessageCbPlay.AsObject],
    [Code.MSG_D_CB_CANCEL_PLAY]: [ClientMessageCbCancelPlay, null! as ClientMessageCbCancelPlay.AsObject],
    [Code.MSG_D_CB_LEAVE]: [ClientMessageCbLeave, null! as ClientMessageCbLeave.AsObject],
    [Code.MSG_D_CB_CHAT]: [ClientMessageCbChat, null! as ClientMessageCbChat.AsObject],
    [Code.MSG_D_CB_TOP]: [ClientMessageCbTop, null! as ClientMessageCbTop.AsObject],
    [Code.MSG_D_CB_WAYMAP]: [ClientMessageCbWaymap, null! as ClientMessageCbWaymap.AsObject],
    [Code.MSG_D_CB_LAST_GAMES]: [ClientMessageCbLastGames, null! as ClientMessageCbLastGames.AsObject],
    [Code.MSG_D_CB_BRING_IN]: [ClientMessageCbBringIn, null! as ClientMessageCbBringIn.AsObject],
    [Code.MSG_D_CB_WAYMAP_SPEC]: [ClientMessageCbWaymapSpec, null! as ClientMessageCbWaymapSpec.AsObject],
    [Code.MSG_D_CB_ONLINE]: [ClientMessageCbOnline, null! as ClientMessageCbOnline.AsObject],
    [Code.MSG_D_CB_SYNC_ENTER]: [ClientMessageCbSyncEnter, null! as ClientMessageCbSyncEnter.AsObject]
} as const;

export type CodeMessageCowboyClientGC = typeof CodeMessageCowboyClientGC;

export const CodeMessageCowboyServerGC = {
    [Code.MSG_D_CB_ENTER_ROOM]: ServerMessageCbEnterRoom,
    [Code.MSG_D_CB_PLAY]: ServerMessageCbPlay,
    [Code.MSG_D_CB_CANCEL_PLAY]: ServerMessageCbCancelPlay,
    [Code.MSG_D_CB_LEAVE]: ServerMessageCbLeave,
    [Code.MSG_D_CB_CHAT]: ServerMessageCbChat,
    [Code.MSG_D_CB_TOP]: ServerMessageCbTop,
    [Code.MSG_D_CB_WAYMAP]: ServerMessageCbWaymap,
    [Code.MSG_D_CB_LAST_GAMES]: ServerMessageCbLastGames,
    [Code.MSG_D_CB_BRING_IN]: ServerMessageCbBringIn,
    [Code.MSG_D_CB_WAYMAP_SPEC]: ServerMessageCbWaymapSpec,
    [Code.MSG_D_CB_ONLINE]: ServerMessageCbOnline,
    [Code.MSG_D_CB_SYNC_ENTER]: ServerMessageCbSyncEnter,
    [Code.MSG_S_CB_GAME_START]: ServerMessageCbGameStart,
    [Code.MSG_S_CB_GAME_PLAY_INFO]: ServerMessageCbGamePlayInfo,
    [Code.MSG_S_CB_GAME_PLAY_END]: ServerMessageCbGamePlayEnd,
    [Code.MSG_S_CB_GAME_RESULT]: ServerMessageCbGameResult,
    [Code.MSG_S_CB_WAYMAP_UPDATE]: ServerMessageCbWaymapUpdate,
    [Code.MSG_S_CB_ROOM_CLOSE]: ServerMessageCbRoomClose,
    [Code.MSG_S_CB_CHAT_OTHERS]: ServerMessageCbChatOthers,
    [Code.MSG_S_CB_LEAVE_NOTIFICATION]: ServerMessageCbLeaveNotification,
    [Code.MSG_S_CB_STANDUP_NOTIFICATION]: ServerMessageCbStandupNotification,
    [Code.MSG_S_CB_ENCRYPT_CARDS]: ServerMessageCbEncryptCards
} as const;

export type CodeMessageCowboyServerGC = typeof CodeMessageCowboyServerGC;
