import { Code } from '../../../protobuf/holdem/code_pb';
import { GDAction } from './GDAction';
import { GDActionAll } from './GDActionAll';
import { GDAddTime } from './GDAddTime';
import { GDAddTimeOthers } from './GDAddTimeOthers';
import { GDAutoOp } from './GDAutoOp';
import { GDAutoOpActive } from './GDAutoOpActive';
import { GDBringIn } from './GDBringIn';
import { GDBringInFail } from './GDBringInFail';
import { GDBroadcastMsg } from './GDBroadcastMsg';
import { GDChatMembers } from './GDChatMembers';
import { GDChipsChange } from './GDChipsChange';
import { GDEnterRoom } from './GDEnterRoom';
import { GDGetMsg } from './GDGetMsg';
import { GDHandClear } from './GDHandClear';
import { GDKeepSeat } from './GDKeepSeat';
import { GDKeepSeatActive } from './GDKeepSeatActive';
import { GDLeave } from './GDLeave';
import { GDLeaveNotification } from './GDLeaveNotification';
import { GDObservers } from './GDObservers';
import { GDPrivateMsg } from './GDPrivateMsg';
import { GDReadyStart } from './GDReadyStart';
import { GDReadyStartAll } from './GDReadyStartAll';
import { GDReplay } from './GDReplay';
import { GDResult } from './GDResult';
import { GDRoomers } from './GDRoomers';
import { GDSeated } from './GDSeated';
import { GDSeatedOthers } from './GDSeatedOthers';
import { GDSetAutoOnTable } from './GDSetAutoOnTable';
import { GDStandup } from './GDStandup';
import { GDStandupActive } from './GDStandupActive';
import { GDStartInfo } from './GDStartInfo';
import { GDSyncEnter } from './GDSyncEnter';
import { GDTributeGive } from './GDTributeGive';
import { GDTributeGiveComplete } from './GDTributeGiveComplete';
import { GDTributeReturn } from './GDTributeReturn';
import { GDTributeReturnComplete } from './GDTributeReturnComplete';
import { GDVideoMaskChange } from './GDVideoMaskChange';
import { GDWaitReadyStart } from './GDWaitReadyStart';
import { GDWinrateAdd } from './GDWinrateAdd';
import { GDWinrateAddComplete } from './GDWinrateAddComplete';

export default class GuandanMessageHandler {
    public static handle(code: number, data: any, roomID: number, matchID: number) {
        switch (code) {
            case Code.MSG_D_GD_ENTER_ROOM:
                GDEnterRoom(data, roomID, matchID);
                break; // GDEnterRoom 4001
            case Code.MSG_D_GD_SEATED:
                GDSeated(data, roomID, matchID);
                break; // GDSeated 4002
            case Code.MSG_D_GD_BRING_IN:
                GDBringIn(data, roomID, matchID);
                break; // GDBringIn 4003
            case Code.MSG_D_GD_READY_START:
                GDReadyStart(data, roomID, matchID);
                break; // GDReadyStart 4004
            case Code.MSG_D_GD_WINRATE_ADD:
                GDWinrateAdd(data, roomID, matchID);
                break; // GDWinrateAdd 4005
            case Code.MSG_D_GD_TRIBUTE_GIVE:
                GDTributeGive(data, roomID, matchID);
                break; // GDTributeGive 4006
            case Code.MSG_D_GD_TRIBUTE_RETURN:
                GDTributeReturn(data, roomID, matchID);
                break; // GDTributeReturn 4007
            case Code.MSG_D_GD_ACTION:
                GDAction(data, roomID, matchID);
                break; // GDAction 4008
            case Code.MSG_D_GD_AUTO_OP_ACTIVE:
                GDAutoOpActive(data, roomID, matchID);
                break; // GDAutoOpActive 4009
            case Code.MSG_D_GD_STANDUP_ACTIVE:
                GDStandupActive(data, roomID, matchID);
                break; // GDStandupActive 4010
            case Code.MSG_D_GD_LEAVE:
                GDLeave(data, roomID, matchID);
                break; // GDLeave 4011
            case Code.MSG_D_GD_KEEP_SEAT_ACTIVE:
                GDKeepSeatActive(data, roomID, matchID);
                break; // GDKeepSeatActive 4012
            case Code.MSG_D_GD_ADD_TIME:
                GDAddTime(data, roomID, matchID);
                break; // GDAddTime 4013
            case Code.MSG_D_GD_BROADCAST_MSG:
                GDBroadcastMsg(data, roomID, matchID);
                break; // GDBroadcastMsg 4014
            case Code.MSG_D_GD_PRIVATE_MSG:
                GDPrivateMsg(data, roomID, matchID);
                break; // GDPrivateMsg 4015
            case Code.MSG_D_GD_ROOMERS:
                GDRoomers(data, roomID, matchID);
                break; // GDRoomers 4016
            case Code.MSG_D_GD_SET_AUTO_ON_TABLE:
                GDSetAutoOnTable(data, roomID, matchID);
                break; // GDSetAutoOnTable 4017
            case Code.MSG_D_GD_OBSERVERS:
                GDObservers(data, roomID, matchID);
                break; // GDObservers 4018
            case Code.MSG_D_GD_SYNC_ENTER:
                GDSyncEnter(data, roomID, matchID);
                break; // GDSyncEnter 4019
            case Code.MSG_D_GD_REPLAY:
                GDReplay(data, roomID, matchID);
                break; // GDReplay 4020
            case Code.MSG_D_GD_CHAT_MEMBERS:
                GDChatMembers(data, roomID, matchID);
                break; // GDChatMembers 4021
            case Code.MSG_S_GD_SEATED_OTHERS:
                GDSeatedOthers(data, roomID, matchID);
                break; // GDSeatedOthers 4101
            case Code.MSG_S_GD_START_INFO:
                GDStartInfo(data, roomID, matchID);
                break; // GDStartInfo 4102
            case Code.MSG_S_GD_WINRATE_ADD_COMPLETE:
                GDWinrateAddComplete(data, roomID, matchID);
                break; // GDWinrateAddComplete 4103
            case Code.MSG_S_GD_TRIBUTE_GIVE_COMPLETE:
                GDTributeGiveComplete(data, roomID, matchID);
                break; // GDTributeGiveComplete 4104
            case Code.MSG_S_GD_TRIBUTE_RETURN_COMPLETE:
                GDTributeReturnComplete(data, roomID, matchID);
                break; // GDTributeReturnComplete 4105
            case Code.MSG_S_GD_CHIPS_CHANGE:
                GDChipsChange(data, roomID, matchID);
                break; // GDChipsChange 4106
            case Code.MSG_S_GD_ACTION_ALL:
                GDActionAll(data, roomID, matchID);
                break; // GDActionAll 4107
            case Code.MSG_S_GD_AUTO_OP:
                GDAutoOp(data, roomID, matchID);
                break; // GDAutoOp 4108
            case Code.MSG_S_GD_STANDUP:
                GDStandup(data, roomID, matchID);
                break; // GDStandup 4109
            case Code.MSG_S_GD_KEEP_SEAT:
                GDKeepSeat(data, roomID, matchID);
                break; // GDKeepSeat 4110
            case Code.MSG_S_GD_RESULT:
                GDResult(data, roomID, matchID);
                break; // GDResult 4111
            case Code.MSG_S_GD_ADD_TIME_OTHERS:
                GDAddTimeOthers(data, roomID, matchID);
                break; // GDAddTimeOthers 4112
            case Code.MSG_S_GD_LEAVE_NOTIFICATION:
                GDLeaveNotification(data, roomID, matchID);
                break; // GDLeaveNotification 4113
            case Code.MSG_S_GD_BRING_IN_FAIL:
                GDBringInFail(data, roomID, matchID);
                break; // GDBringInFail 4114
            case Code.MSG_S_GD_HAND_CLEAR:
                GDHandClear(data, roomID, matchID);
                break; // GDHandClear 4115
            case Code.MSG_S_GD_GET_MSG:
                GDGetMsg(data, roomID, matchID);
                break; // GDGetMsg 4116
            case Code.MSG_S_GD_READY_START_ALL:
                GDReadyStartAll(data, roomID, matchID);
                break; // GDReadyStartAll 4117
            case Code.MSG_S_GD_WAIT_READY_START:
                GDWaitReadyStart(data, roomID, matchID);
                break; // GDWaitReadyStart 4118
            case Code.MSG_S_GD_VIDEO_MASK_CHANGE:
                GDVideoMaskChange(data, roomID, matchID);
                break; // GDVideoMaskChange 4119
        }
    }
}
