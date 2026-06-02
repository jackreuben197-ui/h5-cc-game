import { traceClass } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import { Code } from '../../../protobuf/holdem/code_pb';
import ProtocolAgency from '../../websocket/ProtocolAgency';
import { Action } from './Action';
import { ActionAll } from './ActionAll';
import { AddOn } from './AddOn';
import { AddTime } from './AddTime';
import { AddTimeOthers } from './AddTimeOthers';
import { AgreePost } from './AgreePost';
import { AgreeSecondPcs } from './AgreeSecondPcs';
import { AgreeSecondPcsActive } from './AgreeSecondPcsActive';
import { AgreeSecondPcsTrigged } from './AgreeSecondPcsTrigged';
import { AutoOp } from './AutoOp';
import { AutoOpActive } from './AutoOpActive';
import { BringIn } from './BringIn';
import { BringInOrStoreFail } from './BringInOrStoreFail';
import { BroadcastMsg } from './BroadcastMsg';
import { BuyInsurance } from './BuyInsurance';
import { BuyInsuranceActive } from './BuyInsuranceActive';
import { ChatMembers } from './ChatMembers';
import { ChipsChange } from './ChipsChange';
import { EncryptCards } from './EncryptCards';
import { EnterRoom } from './EnterRoom';
import { ForceVideo } from './ForceVideo';
import { GetMsg } from './GetMsg';
import { HandClear } from './HandClear';
import { InsuranceOutsCards } from './InsuranceOutsCards';
import { InsuranceTrigged } from './InsuranceTrigged';
import { JackpotAward } from './JackpotAward';
import { JackpotGoldChange } from './JackpotGoldChange';
import { KeepSeat } from './KeepSeat';
import { KeepSeatActive } from './KeepSeatActive';
import { Leave } from './Leave';
import { LeaveNotification } from './LeaveNotification';
import { NextChange } from './NextChange';
import { Observers } from './Observers';
import { PlayerJackpotSummary } from './PlayerJackpotSummary';
import { PostStatusChange } from './PostStatusChange';
import { PrivateMsg } from './PrivateMsg';
import { PublicCards } from './PublicCards';
import { PublicReplay } from './PublicReplay';
import { Roomers } from './Roomers';
import { RoomInsurance } from './RoomInsurance';
import { Seated } from './Seated';
import { SeatedOthers } from './SeatedOthers';
import { SetAutoOnTable } from './SetAutoOnTable';
import { Showcards } from './Showcards';
import { Showdown } from './Showdown';
import { ShowPublicCards } from './ShowPublicCards';
import { ShowPublicCardsOthers } from './ShowPublicCardsOthers';
import { ShowViewCards } from './ShowViewCards';
import { SidePots } from './SidePots';
import { SquidIn } from './SquidIn';
import { SquidInActive } from './SquidInActive';
import { Standup } from './Standup';
import { StandupActive } from './StandupActive';
import { StartInfo } from './StartInfo';
import { StoreChips } from './StoreChips';
import { SyncEnter } from './SyncEnter';
import { SyncHand } from './SyncHand';
import { UpBlind } from './UpBlind';
import { VideoMaskChange } from './VideoMaskChange';
import { ViewPlayerCards } from './ViewPlayerCards';
import { ViewPlayerCardsNum } from './ViewPlayerCardsNum';
import { WaitCheckAutoAddTime } from './WaitCheckAutoAddTime';
import { Winner } from './Winner';

@traceClass()
export default class TexasMessageHandler {
    public static handle(code: number, data: any, roomID: number, matchID: number) {
        if (code != Code.MSG_D_ENTER_ROOM && code != Code.MSG_D_LEAVE && code != Code.MSG_S_LEAVE_NOTIFICATION) {
            // 已经主动离开了不管
            if (roomDataManager.isInternalLeaving(roomID, matchID)) {
                return;
            }
            if (!roomDataManager.existRoomData(roomID, matchID)) {
                this.tracelog.warn('no room data return', roomID, matchID);
                //@TODO 注释掉先不退出
                console.log(12222222222221);
                ProtocolAgency.Send({
                    code: Code.MSG_D_LEAVE,
                    roomID: roomID,
                    matchID: matchID,
                    body: {
                        room: {
                            roomId: roomID,
                            matchId: matchID
                        }
                    }
                });
                roomDataManager.startInternalLeaveLock(roomID, matchID);
                return;
            }
        }
        switch (code) {
            case Code.MSG_D_ENTER_ROOM:
                EnterRoom(data, roomID, matchID);
                break; // EnterRoom 1002
            case Code.MSG_D_SEATED:
                Seated(data, roomID, matchID);
                break; // Seated 1003
            case Code.MSG_D_ADD_ON:
                AddOn(data, roomID, matchID);
                break; // AddOn 1004
            case Code.MSG_D_BRING_IN:
                BringIn(data, roomID, matchID);
                break; // BringIn 1005
            case Code.MSG_D_ACTION:
                Action(data, roomID, matchID);
                break; // Action 1006
            case Code.MSG_D_AUTO_OP_ACTIVE:
                AutoOpActive(data, roomID, matchID);
                break; // AutoOpActive 1007
            case Code.MSG_D_SET_AUTO_ON_TABLE:
                SetAutoOnTable(data, roomID, matchID);
                break; // SetAutoOnTable 1008
            case Code.MSG_D_STANDUP_ACTIVE:
                StandupActive(data, roomID, matchID);
                break; // StandupActive 1009
            case Code.MSG_D_LEAVE:
                Leave(data, roomID, matchID);
                break; // Leave 1010
            case Code.MSG_D_KEEP_SEAT_ACTIVE:
                KeepSeatActive(data, roomID, matchID);
                break; // KeepSeatActive 1011
            case Code.MSG_D_SHOWDOWN:
                Showdown(data, roomID, matchID);
                break; // Showdown 1012
            case Code.MSG_D_SHOW_PUBLIC_CARDS:
                ShowPublicCards(data, roomID, matchID);
                break; // ShowPublicCards 1013
            case Code.MSG_D_ADD_TIME:
                AddTime(data, roomID, matchID);
                break; // AddTime 1014
            case Code.MSG_D_BUY_INSURANCE_ACTIVE:
                BuyInsuranceActive(data, roomID, matchID);
                break; // BuyInsuranceActive 1015
            case Code.MSG_D_AGREE_POST:
                AgreePost(data, roomID, matchID);
                break; // AgreePost 1016
            case Code.MSG_D_STORE_CHIPS:
                StoreChips(data, roomID, matchID);
                break; // StoreChips 1017
            case Code.MSG_D_PUBLIC_REPLAY:
                PublicReplay(data, roomID, matchID);
                break; // PublicReplay 1018
            case Code.MSG_D_BROADCAST_MSG:
                BroadcastMsg(data, roomID, matchID);
                break; // BroadcastMsg 1019
            case Code.MSG_D_PRIVATE_MSG:
                PrivateMsg(data, roomID, matchID);
                break; // PrivateMsg 1020
            case Code.MSG_D_ROOMERS:
                Roomers(data, roomID, matchID);
                break; // Roomers 1021
            case Code.MSG_D_AGREE_SECOND_PCS_ACTIVE:
                AgreeSecondPcsActive(data, roomID, matchID);
                break; // AgreeSecondPcsActive 1022
            case Code.MSG_D_OBSERVERS:
                Observers(data, roomID, matchID);
                break; // Observers 1023
            case Code.MSG_D_SQUID_IN_ACTIVE:
                SquidInActive(data, roomID, matchID);
                break; // SquidInActive 1024
            case Code.MSG_D_SYNC_ENTER:
                SyncEnter(data, roomID, matchID);
                break; // SyncEnter 1025
            case Code.MSG_D_VIEW_PLAYER_CARDS:
                ViewPlayerCards(data, roomID, matchID);
                break; // ViewPlayerCards 1026
            case Code.MSG_D_PLAYER_JACKPOT_SUMMARY:
                PlayerJackpotSummary(data, roomID, matchID);
                break; // PlayerJackpotSummary 1027
            case Code.MSG_D_CHAT_MEMBERS:
                ChatMembers(data, roomID, matchID);
                break; // ChatMembers 1028
            case Code.MSG_D_VIEW_PLAYER_CARDS_NUM:
                ViewPlayerCardsNum(data, roomID, matchID);
                break; // ViewPlayerCardsNum 1029
            case Code.MSG_D_ROOM_INSURANCE:
                RoomInsurance(data, roomID, matchID);
                break; // RoomInsurance 1030
            case Code.MSG_S_SHOW_PUBLIC_CARDS_OTHERS:
                ShowPublicCardsOthers(data, roomID, matchID);
                break; // ShowPublicCardsOthers 1100
            case Code.MSG_S_SHOWCARDS:
                Showcards(data, roomID, matchID);
                break; // Showcards 1101
            case Code.MSG_S_SEATED_OTHERS:
                SeatedOthers(data, roomID, matchID);
                break; // SeatedOthers 1102
            case Code.MSG_S_START_INFO:
                StartInfo(data, roomID, matchID);
                break; // StartInfo 1103
            case Code.MSG_S_PUBLIC_CARDS:
                PublicCards(data, roomID, matchID);
                break; // PublicCards 1104
            case Code.MSG_S_SIDE_POTS:
                SidePots(data, roomID, matchID);
                break; // SidePots 1105
            case Code.MSG_S_CHIPS_CHANGE:
                ChipsChange(data, roomID, matchID);
                break; // ChipsChange 1107
            case Code.MSG_S_ACTION_ALL:
                ActionAll(data, roomID, matchID);
                break; // ActionAll 1108
            case Code.MSG_S_AUTO_OP:
                AutoOp(data, roomID, matchID);
                break; // AutoOp 1109
            case Code.MSG_S_STANDUP:
                Standup(data, roomID, matchID);
                break; // Standup 1110
            case Code.MSG_S_KEEP_SEAT:
                KeepSeat(data, roomID, matchID);
                break; // KeepSeat 1111
            case Code.MSG_S_WINNER:
                Winner(data, roomID, matchID);
                break; // Winner 1112
            case Code.MSG_S_ADD_TIME_OTHERS:
                AddTimeOthers(data, roomID, matchID);
                break; // AddTimeOthers 1113
            case Code.MSG_S_LEAVE_NOTIFICATION:
                LeaveNotification(data, roomID, matchID);
                break; // LeaveNotification 1114
            case Code.MSG_S_INSURANCE_TRIGGED:
                InsuranceTrigged(data, roomID, matchID);
                break; // InsuranceTrigged 1115
            case Code.MSG_S_BUY_INSURANCE:
                BuyInsurance(data, roomID, matchID);
                break; // BuyInsurance 1116
            case Code.MSG_S_POST_STATUS_CHANGE:
                PostStatusChange(data, roomID, matchID);
                break; // PostStatusChange 1117
            case Code.MSG_S_BRING_IN_OR_STORE_FAIL:
                BringInOrStoreFail(data, roomID, matchID);
                break; // BringInOrStoreFail 1118
            case Code.MSG_S_HAND_CLEAR:
                HandClear(data, roomID, matchID);
                break; // HandClear 1119
            case Code.MSG_S_UP_BLIND:
                UpBlind(data, roomID, matchID);
                break; // UpBlind 1120
            case Code.MSG_S_GET_MSG:
                GetMsg(data, roomID, matchID);
                break; // GetMsg 1121
            case Code.MSG_S_AGREE_SECOND_PCS_TRIGGED:
                AgreeSecondPcsTrigged(data, roomID, matchID);
                break; // AgreeSecondPcsTrigged 1122
            case Code.MSG_S_AGREE_SECOND_PCS:
                AgreeSecondPcs(data, roomID, matchID);
                break; // AgreeSecondPcs 1123
            case Code.MSG_S_SYNC_HAND:
                SyncHand(data, roomID, matchID);
                break; // SyncHand 1124
            case Code.MSG_S_SQUID_IN:
                SquidIn(data, roomID, matchID);
                break; // SquidIn 1125
            case Code.MSG_S_NEXT_CHANGE:
                NextChange(data, roomID, matchID);
                break; // NextChange 1126
            case Code.MSG_S_SHOW_VIEW_CARDS:
                ShowViewCards(data, roomID, matchID);
                break; // ShowViewCards 1127
            case Code.MSG_S_ENCRYPT_CARDS:
                EncryptCards(data, roomID, matchID);
                break; // EncryptCards 1128
            case Code.MSG_S_JACKPOT_GOLD_CHANGE:
                JackpotGoldChange(data, roomID, matchID);
                break; // JackpotGoldChange 1129
            case Code.MSG_S_JACKPOT_AWARD:
                JackpotAward(data, roomID, matchID);
                break; // JackpotAward 1130
            case Code.MSG_S_INSURANCE_OUTS_CARDS:
                InsuranceOutsCards(data, roomID, matchID);
                break; // InsuranceOutsCards 1131
            case Code.MSG_S_FORCE_VIDEO:
                ForceVideo(data, roomID, matchID);
                break; // ForceVideo 1132
            case Code.MSG_S_VIDEO_MASK_CHANGE:
                VideoMaskChange(data, roomID, matchID);
                break; // VideoMaskChange 1133
            case Code.MSG_S_WAIT_CHECK_AUTO_ADD_TIME:
                WaitCheckAutoAddTime(data, roomID, matchID);
                break; // WaitCheckAutoAddTime 1134
        }
    }
}
