import { Code } from '../../../protobuf/holdem/code_pb';
import { MJAction } from './MJAction';
import { MJActionAll } from './MJActionAll';
import { MJActionFail } from './MJActionFail';
import { MJAddTime } from './MJAddTime';
import { MJAddTimeOthers } from './MJAddTimeOthers';
import { MJAutoOp } from './MJAutoOp';
import { MJAutoOpActive } from './MJAutoOpActive';
import { MJBringIn } from './MJBringIn';
import { MJBringInFail } from './MJBringInFail';
import { MJBroadcastMsg } from './MJBroadcastMsg';
import { MJChatMembers } from './MJChatMembers';
import { MJChipsChange } from './MJChipsChange';
import { MJEnterRoom } from './MJEnterRoom';
import { MJExchangeTiles } from './MJExchangeTiles';
import { MJExchangeTilesComplete } from './MJExchangeTilesComplete';
import { MJFollowDealer } from './MJFollowDealer';
import { MJGetMsg } from './MJGetMsg';
import { MJHandClear } from './MJHandClear';
import { MJKeepSeat } from './MJKeepSeat';
import { MJKeepSeatActive } from './MJKeepSeatActive';
import { MJLeave } from './MJLeave';
import { MJLeaveNotification } from './MJLeaveNotification';
import { MJNeedBringIn } from './MJNeedBringIn';
import { MJNeedBringInComplete } from './MJNeedBringInComplete';
import { MJObservers } from './MJObservers';
import { MJPrepare } from './MJPrepare';
import { MJPrivateMsg } from './MJPrivateMsg';
import { MJRaise } from './MJRaise';
import { MJRaiseComplete } from './MJRaiseComplete';
import { MJRejectBringIn } from './MJRejectBringIn';
import { MJReplay } from './MJReplay';
import { MJResult } from './MJResult';
import { MJRoomers } from './MJRoomers';
import { MJSeated } from './MJSeated';
import { MJSeatedOthers } from './MJSeatedOthers';
import { MJSetAutoOnTable } from './MJSetAutoOnTable';
import { MJStandup } from './MJStandup';
import { MJStandupActive } from './MJStandupActive';
import { MJStartInfo } from './MJStartInfo';
import { MJSyncEnter } from './MJSyncEnter';
import { MJSyncHand } from './MJSyncHand';
import { MJUpBlind } from './MJUpBlind';
import { MJVideoMaskChange } from './MJVideoMaskChange';
import { MJVoidSuit } from './MJVoidSuit';
import { MJVoidSuitComplete } from './MJVoidSuitComplete';
import { MJWaitTurnAction } from './MJWaitTurnAction';

export default class MahjongMessageHandler {
    public static handle(code: number, data: any, roomID: number, matchID: number) {
        switch (code) {
            case Code.MSG_D_MJ_ENTER_ROOM:
                MJEnterRoom(data, roomID, matchID);
                break; // MJEnterRoom 3001
            case Code.MSG_D_MJ_SEATED:
                MJSeated(data, roomID, matchID);
                break; // MJSeated 3002
            case Code.MSG_D_MJ_BRING_IN:
                MJBringIn(data, roomID, matchID);
                break; // MJBringIn 3003
            case Code.MSG_D_MJ_EXCHANGE_TILES:
                MJExchangeTiles(data, roomID, matchID);
                break; // MJExchangeTiles 3004
            case Code.MSG_D_MJ_VOID_SUIT:
                MJVoidSuit(data, roomID, matchID);
                break; // MJVoidSuit 3005
            case Code.MSG_D_MJ_ACTION:
                MJAction(data, roomID, matchID);
                break; // MJAction 3006
            case Code.MSG_D_MJ_AUTO_OP_ACTIVE:
                MJAutoOpActive(data, roomID, matchID);
                break; // MJAutoOpActive 3007
            case Code.MSG_D_MJ_STANDUP_ACTIVE:
                MJStandupActive(data, roomID, matchID);
                break; // MJStandupActive 3008
            case Code.MSG_D_MJ_LEAVE:
                MJLeave(data, roomID, matchID);
                break; // MJLeave 3009
            case Code.MSG_D_MJ_KEEP_SEAT_ACTIVE:
                MJKeepSeatActive(data, roomID, matchID);
                break; // MJKeepSeatActive 3010
            case Code.MSG_D_MJ_ADD_TIME:
                MJAddTime(data, roomID, matchID);
                break; // MJAddTime 3011
            case Code.MSG_D_MJ_BROADCAST_MSG:
                MJBroadcastMsg(data, roomID, matchID);
                break; // MJBroadcastMsg 3012
            case Code.MSG_D_MJ_PRIVATE_MSG:
                MJPrivateMsg(data, roomID, matchID);
                break; // MJPrivateMsg 3013
            case Code.MSG_D_MJ_ROOMERS:
                MJRoomers(data, roomID, matchID);
                break; // MJRoomers 3014
            case Code.MSG_D_MJ_SET_AUTO_ON_TABLE:
                MJSetAutoOnTable(data, roomID, matchID);
                break; // MJSetAutoOnTable 3015
            case Code.MSG_D_MJ_OBSERVERS:
                MJObservers(data, roomID, matchID);
                break; // MJObservers 3016
            case Code.MSG_D_MJ_SYNC_ENTER:
                MJSyncEnter(data, roomID, matchID);
                break; // MJSyncEnter 3017
            case Code.MSG_D_MJ_REPLAY:
                MJReplay(data, roomID, matchID);
                break; // MJReplay 3018
            case Code.MSG_D_MJ_CHAT_MEMBERS:
                MJChatMembers(data, roomID, matchID);
                break; // MJChatMembers 3019
            case Code.MSG_D_MJ_RAISE:
                MJRaise(data, roomID, matchID);
                break; // MJRaise 3020
            case Code.MSG_D_MJ_REJECT_BRING_IN:
                MJRejectBringIn(data, roomID, matchID);
                break; // MJRejectBringIn 3021
            case Code.MSG_S_MJ_SEATED_OTHERS:
                MJSeatedOthers(data, roomID, matchID);
                break; // MJSeatedOthers 3051
            case Code.MSG_S_MJ_START_INFO:
                MJStartInfo(data, roomID, matchID);
                break; // MJStartInfo 3052
            case Code.MSG_S_MJ_EXCHANGE_TILES_COMPLETE:
                MJExchangeTilesComplete(data, roomID, matchID);
                break; // MJExchangeTilesComplete 3053
            case Code.MSG_S_MJ_VOID_SUIT_COMPLETE:
                MJVoidSuitComplete(data, roomID, matchID);
                break; // MJVoidSuitComplete 3054
            case Code.MSG_S_MJ_CHIPS_CHANGE:
                MJChipsChange(data, roomID, matchID);
                break; // MJChipsChange 3055
            case Code.MSG_S_MJ_ACTION_ALL:
                MJActionAll(data, roomID, matchID);
                break; // MJActionAll 3056
            case Code.MSG_S_MJ_AUTO_OP:
                MJAutoOp(data, roomID, matchID);
                break; // MJAutoOp 3057
            case Code.MSG_S_MJ_STANDUP:
                MJStandup(data, roomID, matchID);
                break; // MJStandup 3058
            case Code.MSG_S_MJ_KEEP_SEAT:
                MJKeepSeat(data, roomID, matchID);
                break; // MJKeepSeat 3059
            case Code.MSG_S_MJ_RESULT:
                MJResult(data, roomID, matchID);
                break; // MJResult 3060
            case Code.MSG_S_MJ_ADD_TIME_OTHERS:
                MJAddTimeOthers(data, roomID, matchID);
                break; // MJAddTimeOthers 3061
            case Code.MSG_S_MJ_LEAVE_NOTIFICATION:
                MJLeaveNotification(data, roomID, matchID);
                break; // MJLeaveNotification 3062
            case Code.MSG_S_MJ_BRING_IN_FAIL:
                MJBringInFail(data, roomID, matchID);
                break; // MJBringInFail 3063
            case Code.MSG_S_MJ_HAND_CLEAR:
                MJHandClear(data, roomID, matchID);
                break; // MJHandClear 3064
            case Code.MSG_S_MJ_GET_MSG:
                MJGetMsg(data, roomID, matchID);
                break; // MJGetMsg 3065
            case Code.MSG_S_MJ_WAIT_TURN_ACTION:
                MJWaitTurnAction(data, roomID, matchID);
                break; // MJWaitTurnAction 3066
            case Code.MSG_S_MJ_ACTION_FAIL:
                MJActionFail(data, roomID, matchID);
                break; // MJActionFail 3067
            case Code.MSG_S_MJ_PREPARE:
                MJPrepare(data, roomID, matchID);
                break; // MJPrepare 3068
            case Code.MSG_S_MJ_RAISE_COMPLETE:
                MJRaiseComplete(data, roomID, matchID);
                break; // MJRaiseComplete 3069
            case Code.MSG_S_MJ_FOLLOW_DEALER:
                MJFollowDealer(data, roomID, matchID);
                break; // MJFollowDealer 3070
            case Code.MSG_S_MJ_NEED_BRING_IN:
                MJNeedBringIn(data, roomID, matchID);
                break; // MJNeedBringIn 3071
            case Code.MSG_S_MJ_NEED_BRING_IN_COMPLETE:
                MJNeedBringInComplete(data, roomID, matchID);
                break; // MJNeedBringInComplete 3072
            case Code.MSG_S_MJ_VIDEO_MASK_CHANGE:
                MJVideoMaskChange(data, roomID, matchID);
                break; // MJVideoMaskChange 3073
            case Code.MSG_S_MJ_UP_BLIND:
                MJUpBlind(data, roomID, matchID);
                break; // MJUpBlind 3074
            case Code.MSG_S_MJ_SYNC_HAND:
                MJSyncHand(data, roomID, matchID);
                break; // MJSyncHand 3075
        }
    }
}
