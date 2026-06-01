import { WebCommon } from '../WebRequestBase';

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

export class WebStatsUserStats extends WebCommon {
    //接口地址
    static API: string = '/api/stats/user_stats';
    //字段声明
    static RequestParams: {
        game_type?: number; //游戏类型0-all,1-常规桌，2-OMAHA4，3-OMAHA5，4-OMAHA6,5-mtt
        time_type?: number; //游戏类型1-今日, 2-7天, 3-30天, 4-生涯
        time_long?: number; //客户端时间戳
        room_Type?: number;
    } | null = null;
    static MTTRoomData: {
        user_id: string;
        play_times: number; //参赛次数
        win_times: number; //获奖次数
        frist_times: number; //第一名次数
        second_times: string; //第二名次数
        third_times: number; //第三名次数
    } | null = null;
    static RoomData: {
        id: string;
        user_id: number;
        game_type: number; //游戏类型： 0-常规桌，1-OMAHA4，2-OMAHA5，3-OMAHA6
        data_type: number; //数据类型 1--今日；2--7天；3--30天；4--生涯
        total_game_cnt: string; //总局数
        total_hand: number; //总手数
        total_earn: number; //总盈亏
        aveage_earn: number; //场均战绩
        aveage_earn_hundred: number; //战绩/百手
        vpip: number; //入池率
        wins: number; //入池胜率
        prf: number; //翻牌前加注率
        bet3: number; //翻牌前再加注率
        af: number; //激进程度
        cbet: number; //4Flop持续下注率
        wtsd: number; //摊牌胜率
        allinWins: number; //全下胜率
    } | null = null;
    static Data: {
        mtt_room_data: typeof WebStatsUserStats.MTTRoomData;
        room_data: typeof WebStatsUserStats.RoomData;
    } | null = null;
    static ResponseData: {
        data?: typeof WebStatsUserStats.Data;
    } | null = null;

    static Request(param: typeof WebStatsUserStats.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebStatsUserStats.ResponseData;
    };
}

export class WebRoomCenterHistoryList extends WebCommon {
    //接口地址
    static API: string = '/api/stats/room/history/list';
    // //字段声明
    // static RequestParams: {
    //     group_by?: number,      //1 room 2 mtt 3 mttroom
    //     limit?: number,         //条目
    //     offset?: number,        //开始下标。例子（offset=0，limit=10，0-9。）
    //     game_type?: number,     //游戏类型，对应客户端 枚举 GameType
    // } = null;
    // static Records: {
    //     Name: string,//房间名称
    //     Type: number,//房间类型
    //     MatchID: number,//比赛id
    //     RoomID: number,//房间id
    //     Time: string,//开始时间
    //     Change: number,//筹码变动
    //     Count: number,//总手数
    // } = null;
    // static Data: {
    //     limit: number,
    //     offset: number,
    //     total: number,// //总条数
    //     records: typeof WebRoomCenterHistoryList.Records,
    // } = null;
}

export class WebStatsRoomDetail extends WebCommon {
    //接口地址
    static API: string = '/api/stats/room_detail/{id}';
    //字段声明
    static RequestParams: {
        limit?: number; //条目
        offset?: number; //开始下标。例子（offset=0，limit=10，0-9。）
    } | null = null;
    static UserInfo: {
        is_current_user: boolean; //是否当前用户
        user_id: number; //玩家ID
        user_random_id: number; //玩家随机ID
        nick_name: string; //玩家昵称
        avatar: string; //玩家头像
        bring_in: number; //买入筹码
        bring_out: number; //带出筹码
        user_room_hand_num: number; //玩家手数
        original_results: number; //原始战绩
        gold_deduction: number; //金豆扣减
        finally_game_results: number; //最终战绩
        insurance_buy_in: number; //保险买入
        insurance_profit: number; //保险收入
        insurance_sum: number; //保险合计
        insurance_original: number; //原始保险
    } | null = null;
    static RoomData: {
        limit: number;
        offset: number;
        total: number; //总条数
        game_type: number; //牌局类型(玩法) 游戏类型： 0-常规桌，1-OMAHA4，2-OMAHA5，3-OMAHA6
        game_room_name: string; //牌局名称
        room_id: number; //牌局ID
        ante: number; //前注
        blind: number; //盲注级别	small_blind
        player_duration: number; //牌局时长，单位秒
        all_bring_in: number; //总带入筹码
        room_total_hand_num: number; //本局总手数
        insurance_on: number; //是否开启保险 0-close, 1- open
        insurance_total: number; //牌局保险总计
        end_time: string; //结束时间
        user_list: typeof WebStatsRoomDetail.UserInfo; //玩家列表
    } | null = null;
    static Data: {
        room_data: typeof WebStatsRoomDetail.RoomData;
    } | null = null;
    static ResponseData: {
        data?: typeof WebStatsRoomDetail.Data;
    } | null = null;

    static Request(param: typeof WebStatsRoomDetail.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebStatsRoomDetail.ResponseData;
    };
}

export class WebStatsMttRoomDetail extends WebCommon {
    //接口地址
    static API: string = '/api/stats/mtt_room_detail/{id}';
    //字段声明
    static RequestParams: {
        limit?: number; //条目
        offset?: number; //开始下标。例子（offset=0，limit=10，0-9。）
    } | null = null;
    static Goods: {
        i: number; //道具id
        na: string; //道具名称
        v: number; //价值等价货币
        n: number; //数量
    } | null = null;
    static UserInfo: {
        is_current_user: boolean; //是否当前用户
        user_id: number; //玩家ID
        user_random_id: number; //玩家随机ID
        nick_name: string; //玩家昵称
        avatar: string; //玩家头像
        rank: number; //排名
        hunter_rank: number; //带出筹码
        hunter_kill: number; //玩家手数
        award: number; //原始战绩
        hunter_award: number; //金豆扣减
        buy_in_times: number; //最终战绩
        goods_awrd: typeof WebStatsMttRoomDetail.Goods; //保险买入
    } | null = null;
    static RoomData: {
        game_type: number; //牌局类型(玩法) 游戏类型： 0-常规桌，1-OMAHA4，2-OMAHA5，3-OMAHA6
        game_room_name: string; //牌局名称
        room_id: number; //牌局ID
        start_time: number; //赛事开始时间
        end_time: number; //赛事结束时间
        player_count: number; //参与人数
        buy_in_count: number; //买入次数
        limit: number;
        offset: number;
        total: string; //总条数
        user_list: typeof WebStatsMttRoomDetail.UserInfo; //玩家列表
    } | null = null;
    static Data: {
        room_data: typeof WebStatsMttRoomDetail.RoomData;
    } | null = null;
    static ResponseData: {
        data?: typeof WebStatsMttRoomDetail.Data;
    } | null = null;

    static Request(param: typeof WebStatsMttRoomDetail.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebStatsMttRoomDetail.ResponseData;
    };
}

export class WebStatsOtherUserStats extends WebCommon {
    //接口地址
    static API: string = '/api/stats/other_user_stats/{id}';
    static CacheEnabled: boolean = true;
    static CacheNoRequestTTL: number = 60 * 1000;
    static CacheDataTTL: number = 24 * 60 * 60 * 1000;
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebStatsOtherUserStats.Data; // 用户信息
    } | null = null;
    static MTTRoomData: {
        user_id?: number;
        play_times?: number; //参赛次数
        win_times?: number; //获奖次数
        frist_times?: number; //第一名次数
        second_times?: number; //第二名次数
        third_times?: number; //第三名次数
    } | null = null;
    static RoomData: {
        id?: number;
        user_id?: number;
        game_type?: number; //游戏类型： 0-常规桌，1-OMAHA4，2-OMAHA5，3-OMAHA6
        data_type?: number; //数据类型 1--今日；2--7天；3--30天；4--生涯
        total_game_cnt?: number; //总局数
        total_hand?: number; //总手数
        total_earn?: number; //总盈亏
        aveage_earn?: number; //场均战绩
        aveage_earn_hundred?: number; //战绩/百手
        vpip?: number; //入池率
        wins?: number; //入池胜率
        prf?: number; //翻牌前加注率
        bet3?: number; //翻牌前再加注率
        af?: number; //激进程度
        cbet?: number; //4Flop持续下注率
        wtsd?: number; //摊牌胜率
        allinWins?: number; //全下胜率
    } | null = null;
    static Data: {
        mtt_room_data?: (typeof WebStatsOtherUserStats.MTTRoomData)[]; //mtt数据
        room_data?: (typeof WebStatsOtherUserStats.RoomData)[]; //普通牌局数据
    } | null = null;

    static Request(param: typeof WebStatsOtherUserStats.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static BuildCacheKey(context: { api: string; method: 'GET' | 'POST'; body?: any; headers?: Array<[string, string]> | null }): string {
        const bodyUserId = typeof context.body === 'number' ? context.body : context.body?.user_id;
        const apiMatch = /\/api\/stats\/other_user_stats\/(\d+)/.exec(context.api);
        const apiUserId = apiMatch ? Number(apiMatch[1]) : 0;
        const userId = Number(bodyUserId || apiUserId || 0);
        return ['WebStatsOtherUserStats', context.method, `user:${userId}`, JSON.stringify(context.headers || [])].join('::');
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebStatsOtherUserStats.ResponseData;
    };
}

export class WebClubStandiNgs extends WebCommon {
    //接口地址
    static API: string = '/api/stats/user/standings';
    // //字段声明
    // static RequestParams: {
    //     "user_id": number,
    //     "game_type": number,
    //     "time_type": number,
    //     "time_long": number
    // } = null;
}

export class WebOrgClubEarnIng extends WebCommon {
    public static API: string = '/api/stats/club/profit';
    //字段声明
}

export class WebOrgClubMemberEarnIng extends WebCommon {
    public static API: string = '/api/stats/club/user_profit';
}

export class WebOrgClubUserGameInfo extends WebCommon {
    public static API: string = '/api/stats/club/user/info';
}

export class WebClubAgentFriendInfo extends WebCommon {
    static API: string = '/api/stats/club/agent/friend_info';
}

export class WebClubAgentFriendData extends WebCommon {
    static API: string = '/api/stats/club/agent/friend_data';
}

export class WebStatsUserStatsAll extends WebCommon {
    static API: string = '/api/stats/user_stats/all';
}

export class WebStatsMttRoomDetailApi extends WebCommon {
    static API: string = '/api/stats/mtt_room_detail/{id}';
}

export class WebGuildDataVipInfo extends WebCommon {
    static API: string = '/api/stats/club_data_stats/vip_game';
}

export class WebFriendRoomStats extends WebCommon {
    static API: string = '/api/stats/friend_room_stats';
}

export class WebFriendRoomStatsData extends WebCommon {
    static API: string = '/api/stats/friend_room_stats/data';
}

export class WebFriendRoomStatsDataInfo extends WebCommon {
    static API: string = '/api/stats/friend_room_stats/data_info';
}

export class WebFriendRoomStatsDataDetailInfo extends WebCommon {
    static API: string = '/api/stats/friend_room_stats/data_detail_info';
}

export class WebFriendRoomStatsDataDetail extends WebCommon {
    static API: string = '/api/stats/friend_room_stats/data_detail';
}

export class WebClubDataStatsDataInfo extends WebCommon {
    static API: string = '/api/stats/club_data_stats/data_info';
}

export class WebClubDataStatsData extends WebCommon {
    static API: string = '/api/stats/club_data_stats/data';
}

export class WebClubDataStatsDataDetailInfo extends WebCommon {
    static API: string = '/api/stats/club_data_stats/data_detail_info';
}

export class WebClubDataStatsDataDetail extends WebCommon {
    static API: string = '/api/stats/club_data_stats/data_detail';
}

export class WebStatsRoomInsuranceInfo extends WebCommon {
    static API: string = '/api/stats/room/insurance_info';
}

export class WebStatsClientClickLog extends WebCommon {
    static API: string = '/api/stats/client/click/log';
    static RequestParams: {
        device_id?: string;
        mac_addr?: string;
        is_simulator?: boolean;
        simulator_name?: string;
        system_version?: string;
        user_device_no?: string;
        records?: (typeof WebStatsClientClickLog.RecordData)[];
    } | null = null;
    static ResponseData: {
        data?: typeof WebStatsClientClickLog.Data;
    } | null = null;
    static RecordData: {} | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebStatsClientClickLog.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebStatsClientClickLog.ResponseData;
    };
}

export class WebStatsClubDataStatsDataDetailDownLoad extends WebCommon {
    static API: string = '/api/stats/club_data_stats/data_detail/download';
    static RequestParams: {
        filter_type?: number;
        start_time?: string;
        end_time?: string;
        start_time_unix?: number;
        end_time_unix?: number;
        lang?: string;
        time_zone?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebStatsClubDataStatsDataDetailDownLoad.Data;
    } | null = null;
    static Data: {
        log_id?: number;
        url?: string;
    } | null = null;

    static Request(param: typeof WebStatsClubDataStatsDataDetailDownLoad.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebStatsClubDataStatsDataDetailDownLoad.ResponseData;
    };
}

export class WebStatsClubDataStatsUserDetail extends WebCommon {
    static API: string = '/api/stats/club_data_stats/user_detail';
    static RequestParams: {
        filter_time?: number;
        start_time?: number;
        end_time?: number;
        time_long?: number;
        user_id?: number;
        filter_type?: number;
        time_zone?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebStatsClubDataStatsUserDetail.Data;
    } | null = null;
    static Data: {
        stats_all?: typeof WebStatsClubDataStatsUserDetail.TotalData;
        stats_nlh?: typeof WebStatsClubDataStatsUserDetail.TotalData;
        stats_plo?: typeof WebStatsClubDataStatsUserDetail.TotalData;
        stats_6?: typeof WebStatsClubDataStatsUserDetail.TotalData;
    } | null = null;
    static TotalData: {
        game_num?: number;
        hand_num?: number;
        grant_gold_amount?: number;
        recover_gold_amount?: number;
        recharge_usdt_amount?: number;
        recover_usdt_amount?: number;
        profit?: number;
        fee?: number;
        agent_fee?: number;
        insurance?: number;
        agent_insurance?: number;
    } | null = null;

    static Request(param: typeof WebStatsClubDataStatsUserDetail.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebStatsClubDataStatsUserDetail.ResponseData;
    };
}

export class WebStatsClubDataStatsVipUser extends WebCommon {
    static API: string = '/api/stats/club_data_stats/vip_user';
    static RequestParams: {
        vip_user_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebStatsClubDataStatsVipUser.Data;
    } | null = null;
    static Data: {
        info?: typeof WebStatsClubDataStatsVipUser.TotalData;
    } | null = null;
    static TotalData: {
        user_count?: number;
        user_gold_tribe_total?: number;
        user_gold_usdt_total?: number;
    } | null = null;

    static Request(param: typeof WebStatsClubDataStatsVipUser.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebStatsClubDataStatsVipUser.ResponseData;
    };
}

export class WebStatsClubDataStatsWeeklyReport extends WebCommon {
    static API: string = '/api/stats/club_data_stats/weekly_report';
    static RequestParams: {
        time_zone?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebStatsClubDataStatsWeeklyReport.Data;
    } | null = null;
    static Data: {
        list?: (typeof WebStatsClubDataStatsWeeklyReport.LableData)[];
        total_info?: typeof WebStatsClubDataStatsWeeklyReport.TotalInfo;
    } | null = null;
    static TotalInfo: {
        deposits?: number;
        withdraw?: number;
        hands?: number;
        win?: number;
        fee?: number;
        ins?: number;
        prb?: number;
        crb?: number;
        start_time?: number;
        end_time?: number;
    } | null = null;
    static LableData: {
        name?: string;
        id?: number;
        hands?: number;
        win?: number;
        fee?: number;
        ins?: number;
        prb?: number;
        crb?: number;
    } | null = null;

    static Request(param: typeof WebStatsClubDataStatsWeeklyReport.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebStatsClubDataStatsWeeklyReport.ResponseData;
    };
}

export class WebStatsCowboyHistoryRoomDetail extends WebCommon {
    static API: string = '/api/stats/cowboy/history/room/detail';
    static RequestParams: {
        room_id?: number;
        limit?: number;
        offset?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebStatsCowboyHistoryRoomDetail.DataObj;
    } | null = null;
    static DataObj: {
        records?: (typeof WebStatsCowboyHistoryRoomDetail.PlayerEndDetail)[];
        uroom?: typeof WebStatsCowboyHistoryRoomDetail.PlayerEndRoomInfo;
    } | null = null;
    static PlayerEndDetail: {
        user_win?: number;
        game_num?: number;
        user_random_id?: number;
        user_nick_name?: string;
        user_avatar?: string;
        cb_bet?: number;
    } | null = null;
    static PlayerEndRoomInfo: {
        user_win?: number;
        game_num?: number;
    } | null = null;

    static Request(param: typeof WebStatsCowboyHistoryRoomDetail.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebStatsCowboyHistoryRoomDetail.ResponseData;
    };
}

export class WebStatsFriendRoomStatsUserRoomDetailList extends WebCommon {
    static API: string = '/api/stats/friend_room_stats/user/room_detail/list';
    static RequestParams: {
        _roomIds?: number[];
        _matchIds?: number[];
    } | null = null;
    static ResponseData: {
        _data?: typeof WebStatsFriendRoomStatsUserRoomDetailList.Data;
    } | null = null;
    static Data: {
        _rooms?: unknown[];
        _matches?: unknown[];
    } | null = null;

    static Request(param: typeof WebStatsFriendRoomStatsUserRoomDetailList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebStatsFriendRoomStatsUserRoomDetailList.ResponseData;
    };
}

export class WebStatsFriendRoomStatsUserRoomIdList extends WebCommon {
    static API: string = '/api/stats/friend_room_stats/user/room_id/list';
    static RequestParams: {
        start_time?: number;
        end_time?: number;
    } | null = null;
    static ResponseData: {
        _data?: typeof WebStatsFriendRoomStatsUserRoomIdList.IdListData;
    } | null = null;
    static IdListData: {
        _roomIds?: number[];
        _matchIds?: number[];
    } | null = null;

    static Request(param: typeof WebStatsFriendRoomStatsUserRoomIdList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebStatsFriendRoomStatsUserRoomIdList.ResponseData;
    };
}

export class WebStatsFriendRoomStatsUserRoomStatsList extends WebCommon {
    static API: string = '/api/stats/friend_room_stats/user/room_stats/list';
    static RequestParams: {
        _roomIds?: number[];
        _matchIds?: number[];
    } | null = null;
    static ResponseData: {
        _data?: typeof WebStatsFriendRoomStatsUserRoomStatsList.Data;
    } | null = null;
    static Data: {
        _rooms?: unknown[];
        _matches?: unknown[];
    } | null = null;

    static Request(param: typeof WebStatsFriendRoomStatsUserRoomStatsList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebStatsFriendRoomStatsUserRoomStatsList.ResponseData;
    };
}

export class WebStatsFriendStatsData extends WebCommon {
    static API: string = '/api/stats/friend_stats/data';
    static RequestParams: {
        start_time?: number;
        end_time?: number;
        game_types?: number[];
        poker_types?: number[];
        offset?: number;
        limit?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebStatsFriendStatsData.Data;
    } | null = null;
    static Data: {
        offset?: number;
        list?: (typeof WebStatsFriendStatsData.MemberInfo)[];
        info?: typeof WebStatsFriendStatsData.Info;
    } | null = null;
    static MemberInfo: {
        user_random_id?: number;
        user_name?: string;
        user_avatar?: string;
        final_result?: number;
    } | null = null;
    static Info: {
        user_num?: number;
        table_num?: number;
        profit?: number;
    } | null = null;

    static Request(param: typeof WebStatsFriendStatsData.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebStatsFriendStatsData.ResponseData;
    };
}

export class WebStatsJackpotAwardLogs extends WebCommon {
    static API: string = '/api/stats/jackpot/award_logs';
    static RequestParams: {
        jackpot_id?: number;
        game_type?: number[];
        poker_type?: number[];
        limit_bet_type?: number[];
        bombpot?: number[];
        start_time?: number;
        end_time?: number;
        limit?: number;
        offset?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebStatsJackpotAwardLogs.Data;
    } | null = null;
    static Data: {
        limit?: number;
        offset?: number;
        items?: (typeof WebStatsJackpotAwardLogs.JackpotConfig)[];
        top_cards_type_data?: typeof WebStatsJackpotAwardLogs.JackpotConfig;
    } | null = null;
    static JackpotConfig: {
        gold_change?: number;
        jackpot_id?: number;
        create_time?: string;
        create_timestamp?: number;
        user_id?: number;
        user_rid?: number;
        user_name?: string;
        src_room_id?: number;
        room_name?: string;
        room_multi_lang_names?: unknown;
        game_type?: number;
        poker_type?: number;
        bombpot?: number;
        cards_type?: number;
        card_data?: string;
        small_blind?: number;
        ante?: number;
        user_avatar?: string;
        mars_earth?: number;
    } | null = null;

    static Request(param: typeof WebStatsJackpotAwardLogs.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebStatsJackpotAwardLogs.ResponseData;
    };
}

export class WebStatsJackpotGoldChangeLogs extends WebCommon {
    static API: string = '/api/stats/jackpot/gold_change_logs';
    static RequestParams: {
        jackpot_id?: number;
        op_codes?: string[];
        limit?: number;
        offset?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebStatsJackpotGoldChangeLogs.Data;
    } | null = null;
    static Data: {
        limit?: number;
        offset?: number;
        items?: unknown[];
    } | null = null;

    static Request(param: typeof WebStatsJackpotGoldChangeLogs.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebStatsJackpotGoldChangeLogs.ResponseData;
    };
}

export class WebStatsMttHistoryList extends WebCommon {
    static API: string = '/api/stats/mtt/history/list';
    static RequestParams: {
        time_type?: number;
        filter_type?: number;
        current_time_str?: string;
        limit?: number;
        offset?: number;
        time_zone?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebStatsMttHistoryList.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebStatsMttHistoryList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebStatsMttHistoryList.ResponseData;
    };
}

export class WebStatsProfitDataStatsDataByDate extends WebCommon {
    static API: string = '/api/stats/profit_data_stats/data_by_date';
    static RequestParams: {
        gold_type?: number;
        start_time?: number;
        end_time?: number;
        search_type?: number;
        limit?: number;
        offset?: number;
        slave_club_id?: number;
        only_master?: boolean;
        game_types?: number[];
        poker_types?: number[];
    } | null = null;
    static ResponseData: {
        data?: typeof WebStatsProfitDataStatsDataByDate.Data;
    } | null = null;
    static Data: {
        date_total?: (typeof WebStatsProfitDataStatsDataByDate.DateTotal)[];
        limit?: number;
        offset?: number;
        total?: number;
    } | null = null;
    static DateTotal: {
        date?: string;
        list?: (typeof WebStatsProfitDataStatsDataByDate.Record)[];
        total_profit?: number;
    } | null = null;
    static Record: {
        game_type?: number;
        poker_type?: number;
        fee?: number;
        game_status?: number;
        start_time_str?: string;
        insurance?: number;
        bombpot?: number;
        mushroom_mode?: number;
        squid_on?: number;
        jackpot_profit?: number;
        mini_profit?: number;
    } | null = null;

    static Request(param: typeof WebStatsProfitDataStatsDataByDate.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebStatsProfitDataStatsDataByDate.ResponseData;
    };
}

export class WebStatsProfitDataStatsDataInfo extends WebCommon {
    static API: string = '/api/stats/profit_data_stats/data_info';
    static RequestParams: {
        gold_type?: number;
        start_time?: number;
        end_time?: number;
        search_type?: number;
        slave_club_id?: number;
        only_master?: boolean;
        game_types?: number[];
        poker_types?: number[];
    } | null = null;
    static ResponseData: {
        data?: typeof WebStatsProfitDataStatsDataInfo.Data;
    } | null = null;
    static Data: {
        info?: typeof WebStatsProfitDataStatsDataInfo.TotalData;
    } | null = null;
    static TotalData: {
        total_profit?: number;
        fee?: number;
        insurence?: number;
        jackpot?: number;
        mini_game?: number;
    } | null = null;

    static Request(param: typeof WebStatsProfitDataStatsDataInfo.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebStatsProfitDataStatsDataInfo.ResponseData;
    };
}

export class WebStatsProfitDataStatsUserByDate extends WebCommon {
    static API: string = '/api/stats/profit_data_stats/user_by_date';
    static RequestParams: {
        gold_type?: number;
        start_time?: number;
        end_time?: number;
        search_type?: number;
        limit?: number;
        offset?: number;
        slave_club_id?: number;
        only_master?: boolean;
        game_types?: number[];
        poker_types?: number[];
        time_zone?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebStatsProfitDataStatsUserByDate.Data;
    } | null = null;
    static Data: {
        date_total?: (typeof WebStatsProfitDataStatsUserByDate.DateTotal)[];
        limit?: number;
        offset?: number;
        total?: number;
    } | null = null;
    static DateTotal: {
        date?: string;
        list?: (typeof WebStatsProfitDataStatsUserByDate.Record)[];
        total_profit?: number;
    } | null = null;
    static Record: {
        user_random_id?: number;
        nick_name?: string;
        avatar?: string;
        fee?: number;
        insurance?: number;
        jackpot_profit?: number;
        mini_profit?: number;
    } | null = null;

    static Request(param: typeof WebStatsProfitDataStatsUserByDate.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebStatsProfitDataStatsUserByDate.ResponseData;
    };
}

export class WebStatsRoomInsuranceData extends WebCommon {
    static API: string = '/api/stats/room/insurance_data';
    static RequestParams: {
        room_id?: number;
        limit?: number;
        offset?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebStatsRoomInsuranceData.Data;
    } | null = null;
    static Data: {
        limit?: number;
        offset?: number;
        list?: (typeof WebStatsRoomInsuranceData.Record)[];
    } | null = null;
    static Record: {
        nick_name?: string;
        hand_num?: number;
        user_rid?: number;
        insur_bet?: number;
        insur_win?: number;
        create_time?: number;
    } | null = null;

    static Request(param: typeof WebStatsRoomInsuranceData.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebStatsRoomInsuranceData.ResponseData;
    };
}

export class WebStatsTribeStatsCurrent extends WebCommon {
    static API: string = '/api/stats/tribe/stats/current';
    static RequestParams: {
        time_zone?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebStatsTribeStatsCurrent.Data;
    } | null = null;
    static Data: {
        yesterday_balance?: number;
        current_balance?: number;
        current_recharge?: number;
        current_withdrawal?: number;
        current_profit?: number;
        current_add_member?: number;
        current_active_count?: number;
        current_hands_count?: number;
        seven_day_profit?: (typeof WebStatsTribeStatsCurrent.SevenDataCurve)[];
        seven_day_new_user?: (typeof WebStatsTribeStatsCurrent.SevenDataCurve)[];
        seven_day_active_user?: (typeof WebStatsTribeStatsCurrent.SevenDataCurve)[];
        seven_day_hand_num?: (typeof WebStatsTribeStatsCurrent.SevenDataCurve)[];
        apply_count?: number;
    } | null = null;
    static SevenDataCurve: {
        x?: string;
        y?: string;
    } | null = null;

    static Request(param: typeof WebStatsTribeStatsCurrent.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebStatsTribeStatsCurrent.ResponseData;
    };
}

export class WebStatsTribeStatsDataByDate extends WebCommon {
    static API: string = '/api/stats/tribe/stats/data_by_date';
    static RequestParams: {
        filter_type?: number;
        current_time_str?: string;
        start_time?: number;
        end_time?: number;
        limit?: number;
        offset?: number;
        club_id?: number;
        game_types?: number[];
        time_zone?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebStatsTribeStatsDataByDate.Data;
    } | null = null;
    static Data: {
        date_total?: (typeof WebStatsTribeStatsDataByDate.DateTotal)[];
        offset?: number;
    } | null = null;
    static DateTotal: {
        date?: string;
        list?: (typeof WebStatsTribeStatsDataByDate.Record)[];
        tribe_service_profit_total?: number;
        tribe_insurance_profit_total?: number;
    } | null = null;
    static Record: {
        room_id?: number;
        match_id?: number;
        game_type?: number;
        poker_type?: number;
        sb?: number;
        buy_in?: number;
        buy_in_times?: number;
        fee?: number;
        game_status?: number;
        match_player_num?: number;
        is_match?: number;
        start_time_str?: string;
        insurance?: number;
        ante?: number;
        name?: string;
        multi_lang_names_obj?: unknown;
        bombpot?: number;
        club_name?: string;
        club_remark_name?: string;
        club_remark_color?: string;
    } | null = null;

    static Request(param: typeof WebStatsTribeStatsDataByDate.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebStatsTribeStatsDataByDate.ResponseData;
    };
}

export class WebStatsTribeStatsDataDetail extends WebCommon {
    static API: string = '/api/stats/tribe/stats/data_detail';
    static RequestParams: {
        club_id?: number;
        room_id?: number;
        match_id?: number;
        limit?: number;
        offset?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebStatsTribeStatsDataDetail.Data;
    } | null = null;
    static Data: {
        list?: unknown[];
        offset?: number;
    } | null = null;

    static Request(param: typeof WebStatsTribeStatsDataDetail.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebStatsTribeStatsDataDetail.ResponseData;
    };
}

export class WebStatsTribeStatsDataDetailInfo extends WebCommon {
    static API: string = '/api/stats/tribe/stats/data_detail_info';
    static RequestParams: {
        club_id?: number;
        room_id?: number;
        match_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebStatsTribeStatsDataDetailInfo.Data;
    } | null = null;
    static Data: {
        info?: unknown;
    } | null = null;

    static Request(param: typeof WebStatsTribeStatsDataDetailInfo.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebStatsTribeStatsDataDetailInfo.ResponseData;
    };
}

export class WebStatsTribeStatsDataInfo extends WebCommon {
    static API: string = '/api/stats/tribe/stats/data_info';
    static RequestParams: {
        filter_type?: number;
        current_time_str?: string;
        start_time?: number;
        end_time?: number;
        club_id?: number;
        game_types?: number[];
        time_zone?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebStatsTribeStatsDataInfo.Data;
    } | null = null;
    static Data: {
        info?: typeof WebStatsTribeStatsDataInfo.TotalData;
    } | null = null;
    static TotalData: {
        game_num?: number;
        hand_num?: number;
        tribe_service_profit_total?: number;
        tribe_insurance_profit_total?: number;
    } | null = null;

    static Request(param: typeof WebStatsTribeStatsDataInfo.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebStatsTribeStatsDataInfo.ResponseData;
    };
}

export class WebStatsTribeStatsDownLoad extends WebCommon {
    static API: string = '/api/stats/tribe/stats/download';
    static RequestParams: {
        filter_type?: number;
        start_time?: string;
        end_time?: string;
        start_time_unix?: number;
        end_time_unix?: number;
        lang?: string;
        time_zone?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebStatsTribeStatsDownLoad.Data;
    } | null = null;
    static Data: {
        url?: string;
    } | null = null;

    static Request(param: typeof WebStatsTribeStatsDownLoad.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebStatsTribeStatsDownLoad.ResponseData;
    };
}

export class WebStatsUserStatsAllin extends WebCommon {
    static API: string = '/api/stats/user_stats/allin';
    static RequestParams: {
        gold_type?: number;
        end_time?: number;
        start_time?: number;
        aof_type?: number;
        club_id?: number;
        game_types?: number[];
        poker_types?: number[];
    } | null = null;
    static ResponseData: {
        data?: typeof WebStatsUserStatsAllin.Data;
    } | null = null;
    static Data: {
        stats?: typeof WebStatsUserStatsAllin.Stats;
    } | null = null;
    static Stats: {
        hand_count?: number;
        loss_count?: number;
        profit_count?: number;
        profit_total?: number;
        active_count?: number;
        passive_count?: number;
        ahead_count?: number;
        behind_count?: number;
        active_profit_count?: number;
        passive_profit_count?: number;
        ahead_profit_count?: number;
        behind_profit_count?: number;
    } | null = null;

    static Request(param: typeof WebStatsUserStatsAllin.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebStatsUserStatsAllin.ResponseData;
    };
}

export class WebStatsUserStatsCardType extends WebCommon {
    static API: string = '/api/stats/user_stats/card_type';
    static RequestParams: {
        gold_type?: number;
        aof_type?: number;
        start_time?: number;
        end_time?: number;
        club_id?: number;
        order_type?: number;
        limit?: number;
        offset?: number;
        game_types?: number[];
        poker_types?: number[];
    } | null = null;
    static ResponseData: {
        data?: typeof WebStatsUserStatsCardType.Data;
    } | null = null;
    static Data: {
        total?: number;
        limit?: number;
        offset?: number;
        records?: (typeof WebStatsUserStatsCardType.Record)[];
    } | null = null;
    static Record: {
        hand_card_type?: string;
        hand_count?: number;
        loss_count?: number;
        profit_count?: number;
        profit_total?: number;
        profit_ratio?: number;
    } | null = null;

    static Request(param: typeof WebStatsUserStatsCardType.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebStatsUserStatsCardType.ResponseData;
    };
}

export class WebStatsUserStatsRivalRoomStats extends WebCommon {
    static API: string = '/api/stats/user_stats/rival_room_stats';
    static RequestParams: {
        gold_type?: number;
        start_time?: number;
        end_time?: number;
        order_type?: number;
        club_id?: number;
        limit?: number;
        offset?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebStatsUserStatsRivalRoomStats.Data;
    } | null = null;
    static Data: {
        total?: number;
        limit?: number;
        offset?: number;
        records?: (typeof WebStatsUserStatsRivalRoomStats.Record)[];
    } | null = null;
    static Record: {
        user_id?: number;
        nickname?: string;
        avatar?: string;
        hand_count?: number;
        loss_count?: number;
        profit_count?: number;
        profit_total?: number;
    } | null = null;

    static Request(param: typeof WebStatsUserStatsRivalRoomStats.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebStatsUserStatsRivalRoomStats.ResponseData;
    };
}

export class WebStatsUserGameRecordList extends WebCommon {
    static API: string = '/api/stats/user/game/record/list';
    static RequestParams: {
        filter_type?: number;
        room_type?: number;
        current_time_str?: string;
        club_id?: number;
        limit?: number;
        offset?: number;
        game_types?: number[];
        poker_types?: number[];
        start_time?: number;
        time_zone?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebStatsUserGameRecordList.Data;
    } | null = null;
    static Data: {
        total?: number;
        limit?: number;
        offset?: number;
        records?: (typeof WebStatsUserGameRecordList.Map)[];
    } | null = null;
    static Map: {
        total?: number;
        room_record?: typeof WebStatsUserGameRecordList.Room_record;
        user_game_records?: (typeof WebStatsUserGameRecordList.Record)[];
    } | null = null;
    static Room_record: {
        name?: string;
        room_id?: number;
        small_blind?: number;
        game_type?: number;
        poker_type?: number;
        gold_type?: number;
        random_ante?: string;
    } | null = null;
    static Record: {
        id?: number;
        type?: number;
        room_id?: number;
        match_id?: number;
        name?: string;
        multi_lang_names_obj?: unknown;
        user_id?: number;
        hand_num?: number;
        open?: number;
        change?: number;
        room_unique_id?: string;
        data?: string;
        replay?: unknown;
        replay_ft?: unknown;
        bet_pot?: number;
        encrypt_cards?: unknown;
        gold_type?: number;
        jackpot_award?: number;
    } | null = null;

    static Request(param: typeof WebStatsUserGameRecordList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebStatsUserGameRecordList.ResponseData;
    };
}

export class WebStatsUserRoomMatchIdList extends WebCommon {
    static API: string = '/api/stats/user/room/match/id/list';
    static RequestParams: {
        start_time?: number;
        end_time?: number;
    } | null = null;
    static ResponseData: {
        _data?: typeof WebStatsUserRoomMatchIdList.IdListData;
    } | null = null;
    static IdListData: {
        _matchIds?: number[];
        _roomIds?: number[];
    } | null = null;

    static Request(param: typeof WebStatsUserRoomMatchIdList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebStatsUserRoomMatchIdList.ResponseData;
    };
}

export class WebStatsUserRoomMatchList extends WebCommon {
    static API: string = '/api/stats/user/room/match/list';
    static RequestParams: {
        _roomIds?: number[];
        _matchIds?: number[];
    } | null = null;
    static ResponseData: {
        _recordData?: unknown;
    } | null = null;

    static Request(param: typeof WebStatsUserRoomMatchList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebStatsUserRoomMatchList.ResponseData;
    };
}
