import { Code } from '../../../protobuf/holdem/code_pb';
import { FTAction } from './FTAction';
import { FTActionAll } from './FTActionAll';
import { FTAddTime } from './FTAddTime';
import { FTAddTimeOthers } from './FTAddTimeOthers';
import { FTAutoOp } from './FTAutoOp';
import { FTAutoOpActive } from './FTAutoOpActive';
import { FTBringIn } from './FTBringIn';
import { FTBringInFail } from './FTBringInFail';
import { FTBroadcastMsg } from './FTBroadcastMsg';
import { FTChatMembers } from './FTChatMembers';
import { FTChipsChange } from './FTChipsChange';
import { FTEnterRoom } from './FTEnterRoom';
import { FTGetMsg } from './FTGetMsg';
import { FTHandClear } from './FTHandClear';
import { FTKeepSeat } from './FTKeepSeat';
import { FTKeepSeatActive } from './FTKeepSeatActive';
import { FTLeave } from './FTLeave';
import { FTLeaveNotification } from './FTLeaveNotification';
import { FTObservers } from './FTObservers';
import { FTPair } from './FTPair';
import { FTPairAll } from './FTPairAll';
import { FTPrivateMsg } from './FTPrivateMsg';
import { FTPublicCards } from './FTPublicCards';
import { FTPublicReplay } from './FTPublicReplay';
import { FTRoomers } from './FTRoomers';
import { FTSeated } from './FTSeated';
import { FTSeatedOthers } from './FTSeatedOthers';
import { FTSetAutoOnTable } from './FTSetAutoOnTable';
import { FTStandup } from './FTStandup';
import { FTStandupActive } from './FTStandupActive';
import { FTStartInfo } from './FTStartInfo';
import { FTSyncEnter } from './FTSyncEnter';
import { FTVideoMaskChange } from './FTVideoMaskChange';
import { FTWinner } from './FTWinner';

export default class FantasyMessageHandler {
    public static handle(code: number, data: any, roomID: number, matchID: number) {
        switch (code) {
            case Code.MSG_D_FT_ENTER_ROOM:
                FTEnterRoom(data, roomID, matchID);
                break; // FTEnterRoom 1202
            case Code.MSG_D_FT_SEATED:
                FTSeated(data, roomID, matchID);
                break; // FTSeated 1203
            case Code.MSG_D_FT_BRING_IN:
                FTBringIn(data, roomID, matchID);
                break; // FTBringIn 1204
            case Code.MSG_D_FT_ACTION:
                FTAction(data, roomID, matchID);
                break; // FTAction 1205
            case Code.MSG_D_FT_AUTO_OP_ACTIVE:
                FTAutoOpActive(data, roomID, matchID);
                break; // FTAutoOpActive 1206
            case Code.MSG_D_FT_STANDUP_ACTIVE:
                FTStandupActive(data, roomID, matchID);
                break; // FTStandupActive 1207
            case Code.MSG_D_FT_LEAVE:
                FTLeave(data, roomID, matchID);
                break; // FTLeave 1208
            case Code.MSG_D_FT_KEEP_SEAT_ACTIVE:
                FTKeepSeatActive(data, roomID, matchID);
                break; // FTKeepSeatActive 1209
            case Code.MSG_D_FT_ADD_TIME:
                FTAddTime(data, roomID, matchID);
                break; // FTAddTime 1210
            case Code.MSG_D_FT_PUBLIC_REPLAY:
                FTPublicReplay(data, roomID, matchID);
                break; // FTPublicReplay 1211
            case Code.MSG_D_FT_BROADCAST_MSG:
                FTBroadcastMsg(data, roomID, matchID);
                break; // FTBroadcastMsg 1212
            case Code.MSG_D_FT_PRIVATE_MSG:
                FTPrivateMsg(data, roomID, matchID);
                break; // FTPrivateMsg 1213
            case Code.MSG_D_FT_ROOMERS:
                FTRoomers(data, roomID, matchID);
                break; // FTRoomers 1214
            case Code.MSG_D_FT_SET_AUTO_ON_TABLE:
                FTSetAutoOnTable(data, roomID, matchID);
                break; // FTSetAutoOnTable 1215
            case Code.MSG_D_FT_PAIR:
                FTPair(data, roomID, matchID);
                break; // FTPair 1216
            case Code.MSG_D_FT_OBSERVERS:
                FTObservers(data, roomID, matchID);
                break; // FTObservers 1217
            case Code.MSG_D_FT_SYNC_ENTER:
                FTSyncEnter(data, roomID, matchID);
                break; // FTSyncEnter 1218
            case Code.MSG_D_FT_CHAT_MEMBERS:
                FTChatMembers(data, roomID, matchID);
                break; // FTChatMembers 1219
            case Code.MSG_S_FT_SEATED_OTHERS:
                FTSeatedOthers(data, roomID, matchID);
                break; // FTSeatedOthers 1301
            case Code.MSG_S_FT_START_INFO:
                FTStartInfo(data, roomID, matchID);
                break; // FTStartInfo 1302
            case Code.MSG_S_FT_PUBLIC_CARDS:
                FTPublicCards(data, roomID, matchID);
                break; // FTPublicCards 1303
            case Code.MSG_S_FT_CHIPS_CHANGE:
                FTChipsChange(data, roomID, matchID);
                break; // FTChipsChange 1304
            case Code.MSG_S_FT_ACTION_ALL:
                FTActionAll(data, roomID, matchID);
                break; // FTActionAll 1305
            case Code.MSG_S_FT_AUTO_OP:
                FTAutoOp(data, roomID, matchID);
                break; // FTAutoOp 1306
            case Code.MSG_S_FT_STANDUP:
                FTStandup(data, roomID, matchID);
                break; // FTStandup 1307
            case Code.MSG_S_FT_KEEP_SEAT:
                FTKeepSeat(data, roomID, matchID);
                break; // FTKeepSeat 1308
            case Code.MSG_S_FT_WINNER:
                FTWinner(data, roomID, matchID);
                break; // FTWinner 1309
            case Code.MSG_S_FT_ADD_TIME_OTHERS:
                FTAddTimeOthers(data, roomID, matchID);
                break; // FTAddTimeOthers 1310
            case Code.MSG_S_FT_LEAVE_NOTIFICATION:
                FTLeaveNotification(data, roomID, matchID);
                break; // FTLeaveNotification 1311
            case Code.MSG_S_FT_BRING_IN_FAIL:
                FTBringInFail(data, roomID, matchID);
                break; // FTBringInFail 1313
            case Code.MSG_S_FT_HAND_CLEAR:
                FTHandClear(data, roomID, matchID);
                break; // FTHandClear 1314
            case Code.MSG_S_FT_GET_MSG:
                FTGetMsg(data, roomID, matchID);
                break; // FTGetMsg 1315
            case Code.MSG_S_FT_PAIR_ALL:
                FTPairAll(data, roomID, matchID);
                break; // FTPairAll 1316
            case Code.MSG_S_FT_VIDEO_MASK_CHANGE:
                FTVideoMaskChange(data, roomID, matchID);
                break; // FTVideoMaskChange 1317
        }
    }
}
