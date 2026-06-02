import { Code } from '../../../protobuf/holdem/code_pb';
import { AdminRoomUserLeave } from './AdminRoomUserLeave';
import { AdminRoomUserStandup } from './AdminRoomUserStandup';
import { AntiCheatRoomVideo } from './AntiCheatRoomVideo';
import { CacheDataUpdate } from './CacheDataUpdate';
import { ClubRoomBringInApplyAudit } from './ClubRoomBringInApplyAudit';
import { ClubRoomBringInApplyToAdmin } from './ClubRoomBringInApplyToAdmin';
import { ClubRoomBringInApplyToUser } from './ClubRoomBringInApplyToUser';
import { ClubRoomDelayApplyAudit } from './ClubRoomDelayApplyAudit';
import { ClubRoomMttSettleNotify } from './ClubRoomMttSettleNotify';
import { ClubUserIsBlocked } from './ClubUserIsBlocked';
import { Error } from './Error';
import { FaceRecognize } from './FaceRecognize';
import { FriendRoomBringInApplyToAdmin } from './FriendRoomBringInApplyToAdmin';
import { FriendRoomBringInApplyToUser } from './FriendRoomBringInApplyToUser';
import { FriendRoomCreatorSettle } from './FriendRoomCreatorSettle';
import { GetMessage } from './GetMessage';
import { Heartbeat } from './Heartbeat';
import { JackpotMarquee } from './JackpotMarquee';
import { JoinMatching } from './JoinMatching';
import { LimitHandNumber } from './LimitHandNumber';
import { MatchingResult } from './MatchingResult';
import { MttAwardNotify } from './MttAwardNotify';
import { MttDetail } from './MttDetail';
import { MttReadyForApply } from './MttReadyForApply';
import { MttSeriesNotify } from './MttSeriesNotify';
import { NotificationMttWillStart } from './NotificationMttWillStart';
import { NotificationRoomReady } from './NotificationRoomReady';
import { NotificationSystemMaintain } from './NotificationSystemMaintain';
import { OfflineTickets } from './OfflineTickets';
import { QuickJoin } from './QuickJoin';
import { Register } from './Register';
import { RoomChangeNotify } from './RoomChangeNotify';
import { RoomDelayApplyToAdmin } from './RoomDelayApplyToAdmin';
import { RoomMttSettleNotify } from './RoomMttSettleNotify';
import { RoomReadyForEnter } from './RoomReadyForEnter';
import { Rooms } from './Rooms';
import { RoomsSimple } from './RoomsSimple';
import { RoomUserSendDiamond } from './RoomUserSendDiamond';
import { SelfProfitPay } from './SelfProfitPay';
import { SnatchTreasureHrl } from './SnatchTreasureHrl';
import { SnatchTreasureWinPopup } from './SnatchTreasureWinPopup';
import { SupportMessage } from './SupportMessage';
import { SystemMessage } from './SystemMessage';
import { TodoList } from './TodoList';
import { TribeBlackUser } from './TribeBlackUser';
import { TribeBlackUserMtt } from './TribeBlackUserMtt';
import { UserBan } from './UserBan';
import { UserClubRoleChange } from './UserClubRoleChange';
import { UserDeviceIsBlocked } from './UserDeviceIsBlocked';
import { UserDiamondChange } from './UserDiamondChange';
import { UserGameWatch } from './UserGameWatch';
import { UserGoldChange } from './UserGoldChange';
import { UserIsBlocked } from './UserIsBlocked';
import { UserIsMute } from './UserIsMute';
import { UserJoinClub } from './UserJoinClub';
import { UserKickedFromClub } from './UserKickedFromClub';
import { UserMttChangeNotify } from './UserMttChangeNotify';
import { UserOrderAudit } from './UserOrderAudit';
import { UserPlaying } from './UserPlaying';
import { UserSngChangeNotify } from './UserSngChangeNotify';
import { UserTraderOrderNotify } from './UserTraderOrderNotify';
import { UserUsdtOrderNotify } from './UserUsdtOrderNotify';
import { UserWheelHandNum } from './UserWheelHandNum';

export default class OtherMessageHandler {
    public static handle(code: number, data: any, roomID: number, matchID: number) {
        switch (code) {
            case Code.MSG_D_REGISTER:
                Register(data, roomID, matchID);
                break; // Register 1
            case Code.MSG_D_HEARTBEAT:
                Heartbeat(data, roomID, matchID);
                break; // Heartbeat 2
            case Code.MSG_D_USER_PLAYING:
                UserPlaying(data, roomID, matchID);
                break; // UserPlaying 201
            case Code.MSG_R_ROOMS:
                Rooms(data, roomID, matchID);
                break; // Rooms 202
            case Code.MSG_R_QUICK_JOIN:
                QuickJoin(data, roomID, matchID);
                break; // QuickJoin 203
            case Code.MSG_R_MTT_DETAIL:
                MttDetail(data, roomID, matchID);
                break; // MttDetail 204
            case Code.MSG_R_JOIN_MATCHING:
                JoinMatching(data, roomID, matchID);
                break; // JoinMatching 205
            case Code.MSG_R_ROOMS_SIMPLE:
                RoomsSimple(data, roomID, matchID);
                break; // RoomsSimple 206
            case Code.MSG_S_ERROR:
                Error(data, roomID, matchID);
                break; // Error 99
            case Code.MSG_S_NOTIFICATION_ROOM_READY:
                NotificationRoomReady(data, roomID, matchID);
                break; // NotificationRoomReady 101
            case Code.MSG_S_USER_BAN:
                UserBan(data, roomID, matchID);
                break; // UserBan 102
            case Code.MSG_S_NOTIFICATION_SYSTEM_MAINTAIN:
                NotificationSystemMaintain(data, roomID, matchID);
                break; // NotificationSystemMaintain 103
            case Code.MSG_S_ROOM_READY_FOR_ENTER:
                RoomReadyForEnter(data, roomID, matchID);
                break; // RoomReadyForEnter 104
            case Code.MSG_S_MTT_READY_FOR_APPLY:
                MttReadyForApply(data, roomID, matchID);
                break; // MttReadyForApply 105
            case Code.MSG_S_USER_KICKED_FROM_CLUB:
                UserKickedFromClub(data, roomID, matchID);
                break; // UserKickedFromClub 106
            case Code.MSG_S_NOTIFICATION_MTT_WILL_START:
                NotificationMttWillStart(data, roomID, matchID);
                break; // NotificationMttWillStart 107
            case Code.MSG_S_SYSTEM_MESSAGE:
                SystemMessage(data, roomID, matchID);
                break; // SystemMessage 108
            case Code.MSG_S_GET_MESSAGE:
                GetMessage(data, roomID, matchID);
                break; // GetMessage 109
            case Code.MSG_S_USER_GAME_WATCH:
                UserGameWatch(data, roomID, matchID);
                break; // UserGameWatch 110
            case Code.MSG_S_FRIEND_ROOM_BRING_IN_APPLY_TO_ADMIN:
                FriendRoomBringInApplyToAdmin(data, roomID, matchID);
                break; // FriendRoomBringInApplyToAdmin 111
            case Code.MSG_S_FRIEND_ROOM_BRING_IN_APPLY_TO_USER:
                FriendRoomBringInApplyToUser(data, roomID, matchID);
                break; // FriendRoomBringInApplyToUser 112
            case Code.MSG_S_CLUB_ROOM_BRING_IN_APPLY_TO_ADMIN:
                ClubRoomBringInApplyToAdmin(data, roomID, matchID);
                break; // ClubRoomBringInApplyToAdmin 113
            case Code.MSG_S_CLUB_ROOM_BRING_IN_APPLY_TO_USER:
                ClubRoomBringInApplyToUser(data, roomID, matchID);
                break; // ClubRoomBringInApplyToUser 114
            case Code.MSG_S_CLUB_ROOM_BRING_IN_APPLY_AUDIT:
                ClubRoomBringInApplyAudit(data, roomID, matchID);
                break; // ClubRoomBringInApplyAudit 116
            case Code.MSG_S_ADMIN_ROOM_USER_STANDUP:
                AdminRoomUserStandup(data, roomID, matchID);
                break; // AdminRoomUserStandup 117
            case Code.MSG_S_ADMIN_ROOM_USER_LEAVE:
                AdminRoomUserLeave(data, roomID, matchID);
                break; // AdminRoomUserLeave 118
            case Code.MSG_S_ROOM_DELAY_APPLY_TO_ADMIN:
                RoomDelayApplyToAdmin(data, roomID, matchID);
                break; // RoomDelayApplyToAdmin 119
            case Code.MSG_S_CLUB_ROOM_DELAY_APPLY_AUDIT:
                ClubRoomDelayApplyAudit(data, roomID, matchID);
                break; // ClubRoomDelayApplyAudit 120
            case Code.MSG_S_USER_IS_BLOCKED:
                UserIsBlocked(data, roomID, matchID);
                break; // UserIsBlocked 121
            case Code.MSG_S_CLUB_USER_IS_BLOCKED:
                ClubUserIsBlocked(data, roomID, matchID);
                break; // ClubUserIsBlocked 122
            case Code.MSG_S_TODO_LIST:
                TodoList(data, roomID, matchID);
                break; // TodoList 123
            case Code.MSG_S_USER_DEVICE_IS_BLOCKED:
                UserDeviceIsBlocked(data, roomID, matchID);
                break; // UserDeviceIsBlocked 124
            case Code.MSG_S_OFFLINE_TICKETS:
                OfflineTickets(data, roomID, matchID);
                break; // OfflineTickets 125
            case Code.MSG_S_SNATCH_TREASURE_HRL:
                SnatchTreasureHrl(data, roomID, matchID);
                break; // SnatchTreasureHrl 126
            case Code.MSG_S_SNATCH_TREASURE_WIN_POPUP:
                SnatchTreasureWinPopup(data, roomID, matchID);
                break; // SnatchTreasureWinPopup 127
            case Code.MSG_S_JACKPOT_MARQUEE:
                JackpotMarquee(data, roomID, matchID);
                break; // JackpotMarquee 128
            case Code.MSG_S_MATCHING_RESULT:
                MatchingResult(data, roomID, matchID);
                break; // MatchingResult 129
            case Code.MSG_S_SELF_PROFIT_PAY:
                SelfProfitPay(data, roomID, matchID);
                break; // SelfProfitPay 130
            case Code.MSG_S_LIMIT_HAND_NUMBER:
                LimitHandNumber(data, roomID, matchID);
                break; // LimitHandNumber 131
            case Code.MSG_S_ROOM_USER_SEND_DIAMOND:
                RoomUserSendDiamond(data, roomID, matchID);
                break; // RoomUserSendDiamond 132
            case Code.MSG_S_USER_ORDER_AUDIT:
                UserOrderAudit(data, roomID, matchID);
                break; // UserOrderAudit 133
            case Code.MSG_S_USER_WHEEL_HAND_NUM:
                UserWheelHandNum(data, roomID, matchID);
                break; // UserWheelHandNum 134
            case Code.MSG_S_CACHE_DATA_UPDATE:
                CacheDataUpdate(data, roomID, matchID);
                break; // CacheDataUpdate 135
            case Code.MSG_S_SUPPORT_MESSAGE:
                SupportMessage(data, roomID, matchID);
                break; // SupportMessage 136
            case Code.MSG_S_USER_IS_MUTE:
                UserIsMute(data, roomID, matchID);
                break; // UserIsMute 137
            case Code.MSG_S_USER_DIAMOND_CHANGE:
                UserDiamondChange(data, roomID, matchID);
                break; // UserDiamondChange 138
            case Code.MSG_S_TRIBE_BLACK_USER_MTT:
                TribeBlackUserMtt(data, roomID, matchID);
                break; // TribeBlackUserMtt 139
            case Code.MSG_S_ROOM_CHANGE_NOTIFY:
                RoomChangeNotify(data, roomID, matchID);
                break; // RoomChangeNotify 140
            case Code.MSG_S_USER_GOLD_CHANGE:
                UserGoldChange(data, roomID, matchID);
                break; // UserGoldChange 141
            case Code.MSG_S_TRIBE_BLACK_USER:
                TribeBlackUser(data, roomID, matchID);
                break; // TribeBlackUser 142
            case Code.MSG_S_USER_TRADER_ORDER_NOTIFY:
                UserTraderOrderNotify(data, roomID, matchID);
                break; // UserTraderOrderNotify 143
            case Code.MSG_S_ROOM_MTT_SETTLE_NOTIFY:
                RoomMttSettleNotify(data, roomID, matchID);
                break; // RoomMttSettleNotify 144
            case Code.MSG_S_USER_USDT_ORDER_NOTIFY:
                UserUsdtOrderNotify(data, roomID, matchID);
                break; // UserUsdtOrderNotify 145
            case Code.MSG_S_FRIEND_ROOM_CREATOR_SETTLE:
                FriendRoomCreatorSettle(data, roomID, matchID);
                break; // FriendRoomCreatorSettle 146
            case Code.MSG_S_MTT_AWARD_NOTIFY:
                MttAwardNotify(data, roomID, matchID);
                break; // MttAwardNotify 147
            case Code.MSG_S_USER_JOIN_CLUB:
                UserJoinClub(data, roomID, matchID);
                break; // UserJoinClub 148
            case Code.MSG_S_CLUB_ROOM_MTT_SETTLE_NOTIFY:
                ClubRoomMttSettleNotify(data, roomID, matchID);
                break; // ClubRoomMttSettleNotify 149
            case Code.MSG_S_USER_CLUB_ROLE_CHANGE:
                UserClubRoleChange(data, roomID, matchID);
                break; // UserClubRoleChange 150
            case Code.MSG_S_USER_MTT_CHANGE_NOTIFY:
                UserMttChangeNotify(data, roomID, matchID);
                break; // UserMttChangeNotify 151
            case Code.MSG_S_USER_SNG_CHANGE_NOTIFY:
                UserSngChangeNotify(data, roomID, matchID);
                break; // UserSngChangeNotify 152
            case Code.MSG_S_MTT_SERIES_NOTIFY:
                MttSeriesNotify(data, roomID, matchID);
                break; // MttSeriesNotify 153
            case Code.MSG_S_UTIL_FACE_RECOGNIZE:
                FaceRecognize(data, roomID, matchID);
                break; // FaceRecognize 901
            case Code.MSG_S_UTIL_ANTI_CHEAT_ROOM_VIDEO:
                AntiCheatRoomVideo(data, roomID, matchID);
                break; // AntiCheatRoomVideo 902
        }
    }
}
