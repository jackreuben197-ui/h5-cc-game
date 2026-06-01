import { WebCommon } from '../WebRequestBase';
import type {
    WebMessageRednum,
    WebClubUserWallet,
    WebOrgClubGold,
    WebOrgClubIsManger,
    WebOrgClubUserInfo,
    WebClubFundChangeLog,
    WebMiscBannerList,
    WebMsgMessageUnread,
    WebOrgClubGet,
    WebOrgClubSearchById,
    WebStatsOtherUserStats,
    WebStatsUserStats,
    WebMiscPopupNewer,
    WebWalletTotal,
    WebClubDataStatsData,
    WebClubDataStatsDataInfo,
    WebFriendRoomStatsData,
    WebFriendRoomStatsDataInfo,
    WebMiscBannerLobby,
    WebMiscArtiCleList,
    WebMsgMessageSystemBroadcastNum,
    WebPropMallGoodsList,
    WebStatsUserStatsRivalRoomStats,
    WebStatsUserStatsAllin,
    WebStatsUserStatsCardType,
    WebStatsUserGameRecordList,
    WebMiscGameRoundListDataByRoom,
    WebOrgClubMasterSlaveClubList,
    WebOrgClubUserWalletRelationList,
    WebUserSendInfo,
    WebChatSupportChannelList,
    WebUserMuteList,
    WebPropChatPropList,
    WebOrgTribeBlackUserList,
    WebOrgUserSelfProfitUnpayRecords,
    WebPropSignInActivityDetail,
    WebUserActionRemaind,
    WebRoomCenterHistoryViewPublicCardsFreeCount,
    WebRoomCenterGameWatchUnreadList,
    WebCmsExtWheelTemplateList,
    WebConfigUserWhitelistInfo
} from '../WebRequest';

type RequestParamsOf<T extends { RequestParams?: unknown }> = T extends {
    RequestParams: infer R;
}
    ? R
    : Record<string, unknown>;

type ResponseDataOf<T extends { ResponseData?: unknown }> = T extends {
    ResponseData: infer R;
}
    ? R
    : unknown;
// ===== Unity Added APIs (Auto Generated) =====
// count: 319

export class WebGoldChangeLog {
    static User: string = '/api/user/gold_change/log'; //金豆变动记录
    static Club: string = '/api/org/club/fund/gold_change/log'; //联盟金豆变动记录
}

export class WebRateApi {
    static GET_RATE_LIST = '/api/cmsext/exchange/list'; //汇率列表
    static SET_CLUB_RATE = '/api/cmsext/exchange/set'; //设置公会汇率
    static DELETE_CLUB_RATE = '/api/cmsext/exchange/delete'; //删除公会汇率
}

export class WebOrderRcords {
    // 参数：order_type（订单类型(order_type):1-充豆;2-提豆;3-发豆）
    static CLUB_RECORD = '/api/order/club/order_records'; //公会冲提记录
    static CLUB_GRANT = '/api/order/club/grant_log'; //公会发放记录
    // user_type（0-未知,1-普通用户,2-支桌号,3-牌局机器人,4-牛仔机器人）
    static USER_RECORD = '/api/order/user/order_records'; //玩家冲提记录
}

export class WebOrderApply {
    // 订单类型(order_type):1-充豆;2-提豆
    static APPLY_LIST = '/api/order/club/member_order/list';
    // 订单号(order_no)   审计类型(audit_type):1-同意;2-拒绝
    static OPRATION_APPLY = '/api/order/club/audit/member_order';
}

export class WebClubIssueGold {
    // 参数：user_id（用户ID），gold_num（金豆数量）
    static ISSUE = '/api/order/club/grant';
    // 参数：search：成员昵称或ID
    static USER_LIST = '/api/order/club/user_list';
}

export class WebMtt {
    static LIST = '/api/roomcenter/mtt/list'; //入口裂变
    static DETAIL = '/api/roomcenter/mtt/{0}'; /// MTT 比赛列表详情
    static ROOMS = '/api/roomcenter/mtt/{0}/rooms'; /// MTT 牌桌信息
    static RANKS = '/api/roomcenter/mtt/{0}/ranks'; /// MTT 该比赛玩家排名信息
    static HRANKS = '/api/roomcenter/mtt/{0}/hranks'; /// MTT 猎人赛排名信息
    static REAL_PRIZE = '/api/roomcenter/mtt/{0}/real_prize'; /// MTT 奖励
    static MYAWARD = '/api/roomcenter/mtt/{0}/myaward'; /// MTT 我的奖励
    static BUYIN = '/api/roomcenter/mtt/{0}/buyin'; /// MTT 报名
    static REBUY = '/api/roomcenter/mtt/{0}/rebuy'; /// MTT 重购
    static AWARDS = '/api/roomcenter/mtt/{0}/awards';
    static MYINFO = '/api/roomcenter/mtt/{0}/myinfo';
    static FREE_REMAIN = '/api/roomcenter/mtt/{0}/free_remain';
    static USER_WALLET = '/api/roomcenter/mtt/{0}/user_wallet'; //用户钱包
}

export class WebMiscCombine extends WebCommon {
    static API: string = '/api/misc/combine';
    static ApiType = {
        POPUP_NEWER: 1,
        BANNER_LOBBY: 2,
        ARTICLE_LIST: 3,
        UNNOTIFY_PROFIT_BILL: 4,
        UNREAD_MESSAGE: 5,
        USER_WALLET_TOTAL: 6,
        UNREAD_BROADCAST_NUM: 7,
        MESSAGE_TODO_NUM: 8,
        USER_UNPAY_PROFIT_RECORDS: 9,
        MESSAGE_RED_DOT_NUM: 10,
        CLUB_IM_SERVICE_LIST: 11,
        BANNER_LIST: 12,
        CLUB_POPUP_NOTICE: 13,
        CLUB_USER_WALLET: 14,
        CLUB_USER_INFO: 15,
        SINGLE_CLUB_INFO: 16,
        CLUB_FUND_DETAIL: 17,
        JACKPOT_TEMPLATE_LIST: 18,
        CAREER_ALL: 19,
        CAREER_GAME_TOTAL: 20,
        MALL_GOODS_LIST: 21,
        SIGN_IN_ACTIVITY_DETAIL: 22,
        MTT_HOME_SUMMARY: 23,
        USER_PUBLIC_INFO: 24,
        OTHER_USER_STATS: 25,
        FRIEND_ROOM_STATS_LIST: 26,
        FRIEND_ROOM_STATS_INFO: 27,
        CAREER_STATS: 28,
        CAREER_HISTORY_LIST: 29,
        MTT_HISTORY_LIST_BY_DATE: 30,
        RIVAL_ROOM_STATS: 31,
        USER_ALLIN_STATS: 32,
        USER_CARD_TYPE_STATS: 33,
        CURRENCY_DESCRIPTION_INFO: 34,
        COLLECT_POKER_LIST_BY_ROOM: 35,
        SLAVE_CLUB_LIST: 36,
        CLUB_ADMIN_CHECK: 38,
        CLUB_GOLD_CHANGE_LOG: 39,
        CLUB_DATA_STATS_INFO: 40,
        USER_RECENT_POKER_RECORD: 42,
        CLUB_DATA_STATS_LIST: 43,
        CLUB_USER_WALLET_RELATION_LIST: 44,
        USER_GOLD_CHANGE_LOG: 45,
        USDT_PRICE_LIST: 46,
        ALLIANCE_WITHDRAW_TYPE_LIST: 47,
        USER_WALLET_ADDRESS_LIST: 48,
        USER_WHITELIST_INFO: 49,
        USER_INFO: 50,
        USER_CHANNEL: 51,
        USER_SEND_INFO: 52,
        USER_ACTION_REMAIND: 53,
        VIEW_PUBLIC_CARDS_FREE_COUNT: 54,
        GAME_WATCH_UNREAD_LIST: 55,
        CHAT_SUPPORT_CHANNEL_LIST: 56,
        USER_CLUB: 57,
        MY_WALLETS: 58,
        JACKPOT_TEMPLATE: 59,
        WHEEL_TEMPLATE_LIST: 60,
        USER_MUTE_LIST: 61,
        CHAT_PROP_LIST: 62,
        TRIBE_BLACK_USER_LIST: 63,
        USER_CLUB_INFO_REQ: 64,
        USER_CLUB_ADMINS: 75
    } as const;
    static RequestParams: {
        api_list?: Array<(typeof WebMiscCombine.ApiType)[keyof typeof WebMiscCombine.ApiType]>;
        popup_newer_req?: RequestParamsOf<typeof WebMiscPopupNewer>;
        banner_lobby_req?: RequestParamsOf<typeof WebMiscBannerLobby>;
        article_list_req?: RequestParamsOf<typeof WebMiscArtiCleList>;
        msg_unread_req?: RequestParamsOf<typeof WebMsgMessageUnread>;
        msg_broadcast_num_req?: RequestParamsOf<typeof WebMsgMessageSystemBroadcastNum>;
        msg_red_num_req?: RequestParamsOf<typeof WebMessageRednum>;
        user_info_by_rid_req?: {
            user_id?: number;
        };
        user_stats_by_user_rid_req?: RequestParamsOf<typeof WebStatsOtherUserStats>;
        banner_list_req?: RequestParamsOf<typeof WebMiscBannerList>;
        club_notice_req?: {
            club_id?: number;
        };
        club_user_wallet_req?: RequestParamsOf<typeof WebClubUserWallet>;
        club_user_info_req?: RequestParamsOf<typeof WebOrgClubUserInfo>;
        club_info_req?: RequestParamsOf<typeof WebOrgClubSearchById>;
        club_fund_detail_req?: RequestParamsOf<typeof WebOrgClubGold>;
        mall_goods_list_req?: RequestParamsOf<typeof WebPropMallGoodsList>;
        friend_room_stats_data_req?: RequestParamsOf<typeof WebFriendRoomStatsData>;
        friend_room_stats_data_info_req?: RequestParamsOf<typeof WebFriendRoomStatsDataInfo>;
        stats_user_stats_req?: RequestParamsOf<typeof WebStatsUserStats>;
        user_rival_room_stats_req?: RequestParamsOf<typeof WebStatsUserStatsRivalRoomStats>;
        user_allin_room_stats_req?: RequestParamsOf<typeof WebStatsUserStatsAllin>;
        user_card_type_room_stats_req?: RequestParamsOf<typeof WebStatsUserStatsCardType>;
        club_data_stats_data_info_req?: RequestParamsOf<typeof WebClubDataStatsDataInfo>;
        club_data_stats_data_req?: RequestParamsOf<typeof WebClubDataStatsData>;
        user_game_record_list_req?: RequestParamsOf<typeof WebStatsUserGameRecordList>;
        game_round_list_data_by_room_req?: RequestParamsOf<typeof WebMiscGameRoundListDataByRoom>;
        master_slave_club_list_req?: RequestParamsOf<typeof WebOrgClubMasterSlaveClubList>;
        club_admin_has_req?: RequestParamsOf<typeof WebOrgClubIsManger>;
        club_gold_change_log_req?: RequestParamsOf<typeof WebClubFundChangeLog>;
        club_user_wallet_relation_req?: RequestParamsOf<typeof WebOrgClubUserWalletRelationList>;
        save_client_info_req?: RequestParamsOf<typeof WebUserSendInfo>;
        support_channel_list_req?: RequestParamsOf<typeof WebChatSupportChannelList>;
        user_club_req?: RequestParamsOf<typeof WebOrgClubGet>;
        get_user_mute_list_req?: RequestParamsOf<typeof WebUserMuteList>;
        get_chat_shop_prop_list_req?: RequestParamsOf<typeof WebPropChatPropList>;
        get_tribe_black_user_list_req?: RequestParamsOf<typeof WebOrgTribeBlackUserList>;
        user_club_info_req?: RequestParamsOf<typeof WebOrgClubSearchById>;
    } | null = null;
    static ResponseData: {
        data?: typeof WebMiscCombine.Data;
    } | null = null;
    static Data: {
        popup?: ResponseDataOf<typeof WebMiscPopupNewer>;
        banner_lobby_resp?: ResponseDataOf<typeof WebMiscBannerLobby>;
        article_list_resp?: ResponseDataOf<typeof WebMiscArtiCleList>;
        msg_unread_resp?: typeof WebMiscCombine.MsgUnreadResp;
        msg_broadcast_num_resp?: typeof WebMiscCombine.BroadcastNumResp;
        msg_todo_num_resp?: typeof WebMiscCombine.MsgTodoNumResp;
        org_self_profit_unpay_record_resp?: ResponseDataOf<typeof WebOrgUserSelfProfitUnpayRecords>;
        msg_red_num_resp?: ResponseDataOf<typeof WebMessageRednum>;
        org_self_profit_unnotify_resp?: unknown;
        user_wallet_total_resp?: ResponseDataOf<typeof WebWalletTotal>;
        mtt_platform_stats_resp?: typeof WebMiscCombine.MTTData;
        user_info_by_rid_resp?: unknown[];
        user_stats_by_user_rid_resp?: ResponseDataOf<typeof WebStatsOtherUserStats>;
        banner_list_resp?: ResponseDataOf<typeof WebMiscBannerList>;
        club_notice_resp?: unknown;
        club_user_wallet_resp?: ResponseDataOf<typeof WebClubUserWallet>;
        club_user_info_resp?: ResponseDataOf<typeof WebOrgClubUserInfo>;
        club_info_resp?: ResponseDataOf<typeof WebOrgClubSearchById>;
        club_fund_detail_resp?: ResponseDataOf<typeof WebOrgClubGold>;
        mall_goods_list_resp?: ResponseDataOf<typeof WebPropMallGoodsList>;
        sign_in_activity_resp?: ResponseDataOf<typeof WebPropSignInActivityDetail>;
        friend_room_stats_data_resp?: ResponseDataOf<typeof WebFriendRoomStatsData>;
        friend_room_stats_data_info_resp?: ResponseDataOf<typeof WebFriendRoomStatsDataInfo>;
        stats_user_stats_resp?: ResponseDataOf<typeof WebStatsUserStats>;
        user_rival_room_stats_resp?: ResponseDataOf<typeof WebStatsUserStatsRivalRoomStats>;
        user_allin_room_stats_resp?: ResponseDataOf<typeof WebStatsUserStatsAllin>;
        user_card_type_room_stats_resp?: ResponseDataOf<typeof WebStatsUserStatsCardType>;
        club_data_stats_data_info_resp?: ResponseDataOf<typeof WebClubDataStatsDataInfo>;
        club_data_stats_data_resp?: ResponseDataOf<typeof WebClubDataStatsData>;
        user_game_record_list_resp?: ResponseDataOf<typeof WebStatsUserGameRecordList>;
        game_round_list_data_by_room_resp?: ResponseDataOf<typeof WebMiscGameRoundListDataByRoom>;
        master_slave_club_list_resp?: ResponseDataOf<typeof WebOrgClubMasterSlaveClubList>;
        club_admin_has_resp?: ResponseDataOf<typeof WebOrgClubIsManger>;
        club_gold_change_log_resp?: ResponseDataOf<typeof WebClubFundChangeLog>;
        club_user_wallet_relation_resp?: ResponseDataOf<typeof WebOrgClubUserWalletRelationList>;
        user_white_list_info_resp?: typeof WebMiscCombine.UserWhiteListInfoResp;
        user_action_remaind_resp?: ResponseDataOf<typeof WebUserActionRemaind>;
        get_view_public_cards_free_count_resp?: ResponseDataOf<typeof WebRoomCenterHistoryViewPublicCardsFreeCount>;
        user_game_watch_pay_record_notice_resp?: ResponseDataOf<typeof WebRoomCenterGameWatchUnreadList>;
        support_channel_list_resp?: ResponseDataOf<typeof WebChatSupportChannelList>;
        user_club_resp?: ResponseDataOf<typeof WebOrgClubGet>;
        user_jackpot_template_resp?: unknown;
        user_wheel_template_list_resp?: ResponseDataOf<typeof WebCmsExtWheelTemplateList>;
        get_user_mute_list_resp?: ResponseDataOf<typeof WebUserMuteList>;
        get_chat_shop_prop_list_resp?: ResponseDataOf<typeof WebPropChatPropList>;
        get_tribe_black_user_list_resp?: ResponseDataOf<typeof WebOrgTribeBlackUserList>;
        user_club_info_resp?: ResponseDataOf<typeof WebOrgClubSearchById>;
        user_club_admin_resp?: unknown;
    } | null = null;
    static UserWhiteListInfoResp: {
        data?: ResponseDataOf<typeof WebConfigUserWhitelistInfo>;
    } | null = null;
    static MTTData: {
        match_count?: number;
        running_count?: number;
        sign_up_count?: number;
        alive?: number;
        prize_base_pool?: number;
    } | null = null;
    static MsgTodoNumResp: {
        todo_num_list?: unknown[];
    } | null = null;
    static BroadcastNumResp: {
        broadcast_num_list?: unknown[];
    } | null = null;
    static MsgUnreadResp: {
        unreade_list?: ResponseDataOf<typeof WebMsgMessageUnread>[];
    } | null = null;

    static Request(param: typeof WebMiscCombine.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMiscCombine.ResponseData;
    };
}
