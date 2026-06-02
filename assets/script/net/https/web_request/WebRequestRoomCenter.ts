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

export class WebRoomCenterHistoryHand extends WebCommon {
    //接口地址
    static API: string = '/api/roomcenter/history/hand';
    //字段声明
    // static RequestParams: {
    //     room_id?: number,
    //     match_id?: number,
    //     limit?: number,
    //     offset?: number,
    //     type?: number,
    //     gametype?: number,
    // } = null;
    // static Record: {
    //     id: number,                 //查询replay id
    //     type: number,               //房间类型
    //     room_id: number,            //房间id
    //     match_id: number,           //比赛id
    //     name: string,               //房间名字
    //     user_id: number,            //玩家id
    //     hand_num: number,           //本手手数
    //     open: number,               //0：非公开
    //     change: number,             //筹码变动
    //     create_time: string,        //创建时间
    //     room_unique_id: string,     //房间唯一id
    // } = null;
    // static Data: {
    //     limit: number,
    //     offset: number,
    //     total: number,              //总条数
    //     records: typeof WebRoomCenterHistoryHand.Record,
    // } = null;
    // static ResponseData: {
    //     data?: typeof WebRoomCenterHistoryHand.Data,
    // } = null;
}
/// <summary>
/// 鱿鱼战况轮次数据
/// </summary>
export class WebRoomCenterHistorySquid extends WebCommon {
    static API: string = '/api/roomcenter/history/{id}/squid';
    static RequestParams: {
        round?: number;
    } | null = null;
    static Record: {
        name?: string;
        in_num?: number;
        in_amount?: number;
        out_num?: number;
        out_amount?: number;
        user_random_id?: number;
    } | null = null;
    static ResponseData: {
        round?: number;
        start_hand?: number;
        end_hand?: number;
        total?: number;
        records?: Array<typeof WebRoomCenterHistorySquid.Record>;
    } | null = null;

    static Request(param: typeof WebRoomCenterHistorySquid.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: { code?: number; message?: string; data?: typeof WebRoomCenterHistorySquid.ResponseData };
}
/// <summary>
/// 蘑菇战况轮次数据
/// </summary>
export class WebRoomCenterHistoryMushroom extends WebCommon {
    static API: string = '/api/roomcenter/history/{id}/mushroom';
    static RequestParams: {
        round?: number;
    } | null = null;
    static Record: {
        name?: string;
        in_num?: number;
        in_amount?: number;
        out_num?: number;
        out_amount?: number;
        user_random_id?: number;
    } | null = null;
    static ResponseData: {
        round?: number;
        start_hand?: number;
        end_hand?: number;
        total?: number;
        records?: Array<typeof WebRoomCenterHistoryMushroom.Record>;
    } | null = null;

    static Request(param: typeof WebRoomCenterHistoryMushroom.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: { code?: number; message?: string; data?: typeof WebRoomCenterHistoryMushroom.ResponseData };
}

/** 战况页：鱿鱼轮次记录（稳定对象导出，避免运行态 class 取值异常） */
export const APITexasSituationSquidRound = {
    API: '/api/roomcenter/history/{id}/squid',
    Request(param: { round?: number }) {
        return param;
    },
    Response: {} as { code?: number; message?: string; data?: any }
};

/** 战况页：蘑菇轮次记录（稳定对象导出，避免运行态 class 取值异常） */
export const APITexasSituationMushRound = {
    API: '/api/roomcenter/history/{id}/mushroom',
    Request(param: { round?: number }) {
        return param;
    },
    Response: {} as { code?: number; message?: string; data?: any }
};

export class WebFriendApplyList extends WebCommon {
    //接口地址
    static API: string = '/api/roomcenter/friend/room/apply/user/list';
    //字段声明
    // static RequestParams: {
    //     limit: number,
    //     offset: number,
    //     room_id: number,
    // } = null;
    // static ResponseData: {
    // } = null;
}

export class WebClubApplyList extends WebCommon {
    //接口地址
    static API: string = '/api/roomcenter/club/room/apply/list';
    //字段声明
    static RequestParams: {} | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebClubApplyList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: (typeof WebClubApplyList.ResponseData)[];
    };
}

export class WebClubApplyAudit extends WebCommon {
    //接口地址
    static API: string = '/api/roomcenter/club/room/apply/audit';
}

export class WebRoomCenterGroups extends WebCommon {
    //接口地址
    static API: string = '/api/roomcenter/groups';
    //字段声明
    static RequestParams: {} | null = null;
    static ResponseData: {
        game_type: number; //游戏类型，0 德州，1奥马哈四张，2 奥马哈五张，3 奥马哈六张
        count: number; //房间数量
        player_count: number; //人数
        sub_group: (typeof WebRoomCenterGroups.DataGroupOne)[];
    } | null = null;
    static DataGroupOne: {
        game_type: number; //游戏类型，0 德州，1奥马哈四张，2 奥马哈五张，3 奥马哈六张
        count: number; //房间数量
        poker_type: number; //牌类型 0 长牌，1 短牌
        player_count: number; //人数
        sub_group: (typeof WebRoomCenterGroups.DataGroupTwo)[];
    } | null = null;
    static DataGroupTwo: {
        game_type: number; //游戏类型，0 德州，1奥马哈四张，2 奥马哈五张，3 奥马哈六张
        poker_type: number; //牌类型 0 长牌，1 短牌
        limit_bet_type: number; //下注限制 0 不限制，1 底池限注，2 AOF
        count: number; //房间数量
        player_count: number; //人数
    } | null = null;

    static Request(param: typeof WebRoomCenterGroups.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: (typeof WebRoomCenterGroups.ResponseData)[];
    };
}

export class WebRoomCenterRoomsBlinds extends WebCommon {
    //接口地址
    static API: string = '/api/roomcenter/room_blinds';
    //字段声明
    static RequestParams: {
        game_type: number; //游戏类型
        poker_type: number; //牌类型
    } | null = null;
    static ResponseData: {
        records: (typeof WebRoomCenterRoomsBlinds.DataElement)[];
    } | null = null;
    static DataElement: {
        sb: number; //小盲
        cnt: number; //该条件房间数
    } | null = null;

    static Request(param: typeof WebRoomCenterRoomsBlinds.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterRoomsBlinds.ResponseData;
    };
}

export class WebRoomCenterRooms extends WebCommon {
    //接口地址
    static API: string = '/api/roomcenter/rooms';
    //字段声明
    static RequestParams: {
        limit?: number; //条目
        offset?: number; //开始下标。例子（offset=0，limit=10，0-9。）
        types?: number[];
        sb_min?: number; //小盲
        sb_max?: number;
        ant_min?: number; //前注
        ant_max?: number;
        room_ids?: number[]; //房间id
        game_type?: number[]; //游戏类型
        poker_type?: number[]; //牌类型
        limit_bet_type?: number[]; //下注类型
        order?: string[]; //排序//oneof=id_asc id_desc start_asc start_desc enter_asc enter_desc eseat_asc eseat_desc seat_asc seat_desc sb_asc sb_desc"
    } | null = null;
    static ResponseData: {
        total: number;
        limit: number;
        offset: number;
        records: (typeof WebRoomCenterRooms.DataElement)[];
    } | null = null;
    static DataElement: {
        rid: number; //房间id
        name: string; //房间名称
        room_type: number; //room path 房间类型
        game_type: number; //游戏类型
        poker_type: number; //牌类型
        limit_bet_type: number; //底池限注类型
        status: number; //房间状态  0 未真是创建，1  已创建 未开始，2 进行中，3 强制关闭，4 即将关闭，5 房间关闭 。 RoomStatus
        ante: number; //前注
        sb: number; //小盲
        op_duration: number; //操作时间
        no_user_wait_duration: number; //无用户等待时间
        keep_seat_duration: number; //留座离桌时间
        total_bring_in: number; //总带入
        total_bring_out: number; //总带出
        total_chip: number; //总记分牌
        min_rate: number; //最小带入倍率
        max_rate: number; //最大带入倍率
        min_players: number; //最小人数
        autostart_min_players: number; //最小人数自动开桌
        straddle_on: number; //强制盲注开启。1：开启，0：关闭
        straddle_max: number; //强制盲注最大人数
        insurance_on: number; //保险开启。1：开启，0：关闭
        insurance_op_duration: number; //保险操作时间
        delay_view_card_on: number; //延迟看牌。1：开启，0，关闭
        post_on: number; //补盲开关，1：开启，0，关闭
        muck_on: number; //是否开启盖牌
        limit_ip_on: number; //IP开启
        limit_gps_on: number; //gps开启
        limit_gps_distance: number; //gps 距离
        limit_delay_times: number; //操作延迟次数
        limit_auto_check_times: number; //自动过牌次数
        limit_auto_fold_times: number; //自动弃牌次数
        seat_count: number; //房间座位数量
        empty_seat: number; //剩余空座位
        roomers: number; //房间内人数
        enter_time: string; //允许进入时间
        play_duration: number; //游戏时长
        retain_type: number; //藏钱类型
        retain_min_rate: number; //最小倍率
        schedule_start_time: string; //
        start_time: string; //开始时间
        end_time: string; //结束时间
        hand_num: number; //手数
        tribe_id: number; //联盟id
        end_reason: string; //结束原因
        hc_total_hand_lv: number; //限制总手数胜率
        hc_total_hand: number; //限制总手数
        hc_pool_rate_lv: number; //限制入池率
        hc_pool_rate: number; //限制入池数
        service_id: string; //用于查询IP列表IP Port
        create_time: string; //创建时间
        update_time: string; //
        voiceprint_verify_on: number; //开启声纹验证 0 关闭，1 开启。
        voiceprint_verify_limit_times: number; //该房间次数限制
        voiceprint_verify_duration: number; //被验证倒计时
        voiceprint_verify_interval_duration: number; //被验证间隔时间
        participation_status: number; //参与状态:0 未参与 1: 参与中
    } | null = null;

    static Request(param: typeof WebRoomCenterRooms.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterRooms.ResponseData;
    };
}

export class WebRoomCenterRoomsBlindsClub {
    //接口地址
    static API: string = '/api/roomcenter/club/room_blinds';
}

export class WebRoomCenterRoomsClub {
    //接口地址
    static API: string = '/api/roomcenter/club/rooms';
}

export class WebRoomCenterMttDetailS extends WebCommon {
    //接口地址
    static API: string = '/api/roomcenter/mtt/{id}';
    //字段声明
    // static RequestParams: {
    // } = null;
    // static ResponseData: {
    //     data: typeof WebRoomCenterMttDetailS.Data[],
    // } = null;
    static Data: {
        alive: number; //存活人数
        state_code: number; //当前玩家的状态 MTTPlayerStatus定义
        mtt: typeof WebRoomCenterMttDetailS.MttDetails; //比赛细节信息
        state: typeof WebRoomCenterMttDetailS.PlayerState; //玩家筹码状态信息
        more: typeof WebRoomCenterMttDetailS.More; //盲注等级和奖励池
        top: number; //最大记分牌
    } | null = null;
    static PlayerState: {
        left_rebuy_times: number; //剩余重购次数
        chip: number; //桌上记分牌
        store: number; //存储记分牌
        init_score: number; //初始化记分牌
        partial_enable: boolean; //是否允许部分带入
    } | null = null;
    static MttDetails: {
        match_id: number; // 比赛id
        name: string; // 比赛名字
        type: number; // 房间类型
        game_type: number; //游戏类型
        poker_type: number; //牌类型
        limit_bet_type: number; //底池限注类型
        rank_type: number; //排名类型
        enter_time: string; //进入时间
        start_time: string; //开始时间
        end_time: string; //结束时间
        hunter_on: number; //猎人赛开启  1：开启，0关闭
        hunter_bonus: number; //0-100  //猎人赛滚雪球比例 0~100 0:杀白丁无收益 1～99 单次收益 100:不滚雪球
        partial_on: number; //部分带入开启  1：开启，0：关闭
        parital_return_bl: number; //部分带入返还金币盲注等级
        straddle_on: number; //强制盲注开启 1：开启，0：关闭
        straddle_max: number; //强制盲注数量
        rooms: number; //房间数量
        max_room_id: number; //最大房间id
        delay_view_card_on: number; //延迟看牌  1：开启，0：关闭
        limit_min: number; //最低参赛人数下限
        limit_delay_times: number; //操作加时次数限制
        limit_auto_check_times: number; //自动过牌次数
        limit_auto_fold_times: number; //自动弃牌次数
        participants: number; //参赛人数
        award_num: number; //奖金
        money_sync: number; //奖励圈同步(截止无法买入以后才会开启)
        status: number; //游戏状态
        seat_count: number; //在座人数
        final_seat_count: number; //最终座位人数
        no_user_wait_duration: number;
        initial_score: number; //初始化记分牌
        blindtable_type: number; //盲注表类型
        upblind_interval: number; //升盲时间间隔
        apply_start_time: string; //报名开始时间
        op_duration: number; //操作时间
        max_delay_apply_bl: number; //延迟报名升盲等级
        rebuy_times: number; //重构次数
        max_rebuy_bl: number; //重购升盲等级
        limit_total_buy_times: number; //最大买入次数上限
        total_buy_times: number; //总买入次数
        total_rebuy_times: number; //总重购次数
        addon_begin_bl: number; //增购开启 升盲等级
        addon_end_bl: number; //增购关闭 升盲等级
        addon_score: number; //增购 记分牌
        total_addon_times: number; //增购次数
        apply_fee_pool: number; //报名费
        apply_fee_service: number; //服务费
        apply_fee_hunter: number; //猎人赛费用
        prize_type: number; //奖励类型
        tribe_id: number; //联盟id
        create_time: string; //创建房间时间
        update_time: string;
        game_icon: string;
        prop_buy_type: number; // 道具使用类型 1: 只能道具 2: 混合 0: 不支持道具
        voiceprint_verify_on: number; //是否开启验证声纹 0 关闭，1 开启。
        voiceprint_verify_duration: number; //验证声纹时长
        buy_prop_id: number; //道具id
        addonplus_m1_on: number; //增购plus 模式一 0 关闭，1 开启
        addonplus_m1_max_times: number; //增购最大次数
        addonplus_m1_limit: number; //增购限制筹码
        total_addonplus_m1_times: number; //总增购次数
        addonplus_m2_on: number; //增购模式2 0 关闭，1 开启
        addonplus_m2_max_times: number; //增购限制最大次数
        addonplus_m2_max_bl: number; //增购 截止盲注
        total_addonplus_m2_times: number; //增购总次数
        buy_ratio: number; //买入倍率
        pre_buyin_bonus: number; //赛前报名多得记分牌
        tablecloth_tag: string; //桌布id
        limit_tag: string; //相同比赛检测tag
        buyin_free_times: number; //报名限免次数
        rebuy_free_times: number; //重购限免次数
        multi_ratio_free_times: number; //多倍率限免次数
        addon_free_times: number; //增购限免次数
        buyin_free_incl_svr: number; //报名限免是否包含服务费，0不包含，1包含
        rebuy_free_incl_svr: number; //重购限免是否包含服务费，0不包含，1包含
        multi_ratio_free_incl_svr: number; //多倍率限免是否包含服务费，0不包含，1包含
        addon_free_incl_svr: number; //增购限免是否包含服务费，0不包含，1包含
    } | null = null;
    static More: {
        ante: number; //当前前注
        nante: number; //下一前注
        bl: number; //当前盲注等级
        nbl: number; //下一盲注等级
        sb: number; //当前小盲
        nsb: number; //下一小盲
        prize_pool: number; //奖池
    } | null = null;
    // static Request(param: typeof WebRoomCenterMttDetailS.RequestParams) {
    //     this.RequestParams = param;
    //     return param;
    // }
    // static Response: { code?: number, message?: string, data?: typeof WebRoomCenterMttDetailS.Data };
}

export class WebRoomCenterMttBuyin extends WebCommon {
    //接口地址
    static API: string = '/api/roomcenter/mtt/{id}/buyin';
}

export class WebRoomCenterMttRebuy extends WebCommon {
    //接口地址
    static API: string = '/api/roomcenter/mtt/{id}/rebuy';
    //字段声明
    // static RequestParams: {
    // } = null;
    // static ResponseData: {
    //     ticket: boolean,//几人池
    //     ratio: number,
    // } = null;
}

export class WebRoomCenterMttRooms extends WebCommon {
    //接口地址
    static API: string = '/api/roomcenter/mtt/{id}/rooms';
    // //字段声明
    // static RequestParams: {
    //     limit: number,//几人池
    //     offset: number,
    // } = null;
    // static ResponseData: {
    //     data: typeof WebRoomCenterMttRooms.Data[],
    // } = null;
    // static Data: {
    //     limit: number,//条目
    //     offset: number,//开始下标。例子（offset=0，limit=10，0-9。）
    //     total: number,//总人数
    //     records: typeof WebRoomCenterMttRooms.DeskListElement[],
    // } = null;
    // static players: {
    //     uid: number,//玩家id
    //     chip: number,//玩家筹码
    //     seat: number,//玩家座位号
    // } = null;
    // static DeskListElement: {
    //     rid: number,//桌号
    //     service_id: number,//用于查询IP列表IP Port
    //     roomers: typeof WebRoomCenterMttRooms.players[],
    // } = null;
}

export class WebRoomCenterMttRealPrize extends WebCommon {
    //接口地址
    static API: string = '/api/roomcenter/mtt/{id}/real_prize';
}

export class WebRoomCenterMttMyawArd extends WebCommon {
    //接口地址
    static API: string = '/api/roomcenter/mtt/{id}/myaward';
    // //字段声明
    // static RequestParams: {
    // } = null;
    // static ResponseData: {
    //     data: typeof WebRoomCenterMttMyawArd.Data,
    // } = null;
    // static Data: {
    //     uid: number,//开始下标。例子（offset=0，limit=10，0-9。）
    //     rank: number,//存活人数
    //     award_gold: number,//总人数
    //     award_goods: typeof WebRoomCenterMttMyawArd.AwardGoods,
    //     hunter_award: number,//
    //     hunter_rank: number,//
    //     hunter_kill: number,//
    //     is_final: boolean,//
    //     awarded: boolean,//
    //     username: string,//
    //     avatar: string,//
    // } = null;
    // static AwardGoods: {
    //     i: number,//道具ID
    //     na: string,//道具名字
    //     v: number,//道具价值
    //     n: number,//道具数量
    // } = null;
}

export class WebUserRoomInsur extends WebCommon {
    //接口地址
    static API: string = '/api/roomcenter/room/{id}/insur';
    // //字段声明
    // static RequestParams: {
    // } = null;
    // static ResponseData: {
    //     pot_user_count: number,//几人池
    //     detail: typeof WebUserRoomInsur.Outs[],
    // } = null;
    // static Outs: {
    //     outs: number,//outs 张数
    //     odds: number,//对应outs张数赔率
    // } = null;
}
// /// <summary>
// /// 房主手动开始牌局
// /// </summary>
// export class WebRoomCenterRoomStart extends WebCommon {
//   static API: string = "/api/roomcenter/room/start";
// }
/// <summary>
/// 查询当前用户是否为该房间管理员
/// </summary>
export class WebRoomCenterIsRoomAdmin extends WebCommon {
    static API: string = '/api/roomcenter/room/is_room_admin';
}

export class WebRoomCenterHistoryReplay extends WebCommon {
    static API: string = '/api/roomcenter/history/replay/{id}';
    public static WatchedUserHand: {
        user_rid: number; //玩家随机ID
        data: string; //手牌数据
    } | null = null;
    public static Data: {
        d: number[]; //自己手牌
        s: typeof WebRoomCenterHistoryReplay.S;
        u: number; //自己用户随机ID
        be_watched_user_hands?: (typeof WebRoomCenterHistoryReplay.WatchedUserHand)[]; //偷偷看手牌数据
    } | null = null;
    //字段声明
    // static RequestParams: {
    // } = null;
    // static ResponseData: {
    //     org_id: number, // 公会ID
    //     gold: number, // 公会金豆数
    //     gold_lock: number, // 公会被锁定的金豆数
    //     forbidden: boolean, // 是否冻结 true已冻结，false未冻结
    //     club_name: string,   //公会名字
    // } = null;
    // public sealed class ResponseData : WebResponseDataBase
    // {
    //     public Data data { get; set; }
    // }
    public static S: {
        result: (typeof WebRoomCenterHistoryReplay.Result)[];
        etime: number; //结束时间戳
        straddle: boolean; //是否开启straddle
        stime: number; //开始时间戳
        hand: number; //手数
        table: typeof WebRoomCenterHistoryReplay.Table; //参与牌局的所有人信息
        name: string; //房间名字
        rid: number; //房间id
        mid: number; //比赛id
        unique: string; //唯一id
        procedure: typeof WebRoomCenterHistoryReplay.Procedure;
    } | null = null;
    public static Result: {
        sn: number; //座位号
        win: number; //赢的筹码
        ins: number; //保险
        fee: number; //服务费
        active: boolean; //是否存活
        maxcard_idx: number[]; //最大牌型数组下标
        card_type: number; //最大牌型
        card: number[]; //玩家手牌
        maxcard_idx2: number[]; //第二套牌，最大牌型数组下标
        card_type2: number; //最大牌型
        sp_detail: (typeof WebRoomCenterHistoryReplay.SpDetail)[]; //第二套牌赢牌详情
    } | null = null;
    public static SpDetail: {
        win: number; //赢得筹码
        is_winner: boolean; //是否赢牌
    } | null = null;
    public static Table: {
        ante: number; //前注
        pl: (typeof WebRoomCenterHistoryReplay.Pl)[];
        sb: typeof WebRoomCenterHistoryReplay.SbAndBb; //小盲注
        bb: typeof WebRoomCenterHistoryReplay.SbAndBb; //大盲注
        straddle: boolean; //强制盲注
        btn: number; //庄位
        seatcount: number; //最大座位号
    } | null = null;
    public static Procedure: {
        ante: typeof WebRoomCenterHistoryReplay.Ante;
        preflop: typeof WebRoomCenterHistoryReplay.Preflop;
        flop: typeof WebRoomCenterHistoryReplay.Flop;
        turn: typeof WebRoomCenterHistoryReplay.Turn;
        river: typeof WebRoomCenterHistoryReplay.Tiver;
    };
    public static Ante: {
        pl: (typeof WebRoomCenterHistoryReplay.ProcedurePl)[];
    };
    public static Pl: {
        sn: number; //座位号
        c: number; //初始筹码
        avatar: string; //头像
        name: string; //名字
        uid: number; //随机id
    };
    public static SbAndBb: {
        sn: number; //座位号
        bet: number; //下注筹码
    };
    public static Preflop: {
        pl: (typeof WebRoomCenterHistoryReplay.ProcedurePl)[];
    };
    public static Flop: {
        pl: (typeof WebRoomCenterHistoryReplay.ProcedurePl)[];
        card: number[]; //公共牌
        showcard: boolean; //是否show牌
    };
    public static Turn: {
        pl: (typeof WebRoomCenterHistoryReplay.ProcedurePl)[];
        card: number[]; //公共牌
        showcard: boolean; //是否show牌
    };
    public static Tiver: {
        pl: (typeof WebRoomCenterHistoryReplay.ProcedurePl)[];
        card: number[]; //公共牌
        showcard: boolean; //是否show牌
        scard: number[]; //第二套公共牌
    };
    public static ProcedurePl: {
        c: number; //剩余筹码
        pot_out: number; //池
        sn: number; //座位号
        act: string; //动作
        act_amt: number; //该动作筹码
        ins: number; //保险
    };
}

export class WebRoomCenterMttList extends WebCommon {
    static API: string = '/api/roomcenter/mtt/list';
    //字段声明
    // static RequestParams: {
    //     limit: number,  // 页码
    //     offset: number,  // 页大小
    //     name: string,  //名字(name)
    //     mine: boolean,  //是否只有我报名(mine)
    //     types: number[], // 类型(types)
    //     hunter: boolean, //猎人模式(hunter)
    //     tribe_id: number, //联盟ID(tribe_id)
    //     start_time_s: number, // 开始时间开始(start_time_s)
    //     start_time_e: number, // 开始时间结束(start_time_e)
    //     enter_time_s: number,  //进入时间开始(enter_time_s)
    //     enter_time_e: number,  //进入时间开始(enter_time_e)
    //     game_type: number[], //游戏类型(game_type)
    //     poker_type: number[], // 牌类型(poker_type)
    //     limit_bet_type: number[],  //下注类型(limit_bet_type)
    //     order: string[], // 排序(order[id_asc,id_desc,start_xxx,enter_xxx])  //asc 正序   //desc 倒序
    //     buyin_min: number, // 最低买入价格(buyin_min),不包括服务费,人头费
    //     buyin_max: number // 最高买入价格(buyin_max),不包括服务费,人头费
    //     status: number[]//0已创建 1正在进行 2已关闭
    // } = null;
    // static ResponseData: {
    //     limit: number,
    //     offset: number,
    //     total: number,
    //     records: typeof WebRoomCenterMttList.RoomListElement[]  // mtt列表
    // } = null;
    // static RoomListElement:
    //     {
    //         match_id: number,//比赛id
    //         name: string,//比赛名称
    //         type: number,//room path 房间类型
    //         game_type: number,//游戏类型
    //         poker_type: number,//牌类型
    //         limit_bet_type: number,//底池限注类型
    //         rank_type: number,//排名类型
    //         enter_time: string,//进入时间
    //         start_time: string,//开始时间
    //         end_time: string,//结束时间
    //         hunter_on: number,//是否猎人赛
    //         hunter_bonus: number,//人头奖金
    //         partial_on: number,//部分带入是否开启 1：开启，0：关闭
    //         parital_return_bl: number,//部分带入返还升盲等级
    //         straddle_on: number,//强制盲注是否打开，1：开启，0：关闭
    //         straddle_max: number,//强制盲注最大次数
    //         rooms: number,//总桌子
    //         max_room_id: number,//最大房间id
    //         delay_view_card_on: number,//延迟看牌。1：开启，0：关闭
    //         limit_min: number,//参赛人数下限
    //         limit_delay_times: number,//玩家操作加时次数限制
    //         limit_auto_check_times: number,//最大check次数
    //         limit_auto_fold_times: number,//最大fold次数
    //         participants: number,//参赛人次
    //         award_num: number,//奖金
    //         money_sync: number,//奖励圈同步(截止无法买入以后才会开启)
    //         status: number,//游戏状态
    //         seat_count: number,//座位总数。9
    //         final_seat_count: number,//最终座位数量
    //         no_user_wait_duration: number,
    //         initial_score: number,//初始记分牌
    //         blindtable_type: number,//盲注表类型
    //         upblind_interval: number,//升盲时间
    //         apply_start_time: string,//报名时间
    //         op_duration: number,//操作时间
    //         max_delay_apply_bl: number,//关闭延迟报名，升盲等级
    //         rebuy_times: number,//重构次数
    //         max_rebuy_bl: number,//关闭重购，升盲等级
    //         limit_total_buy_times: number,//最大重购次数
    //         total_buy_times: number,//总报名次数
    //         total_rebuy_times: number,//总重购次数
    //         addon_begin_bl: number,//增购开始盲注等级
    //         addon_end_bl: number,//增购结束盲注等级
    //         addon_score: number,//增购记分牌
    //         total_addon_times: number,//总增购次数
    //         apply_fee_pool: number,//报名费
    //         apply_fee_service: number,//服务费
    //         apply_fee_hunter: number,//猎人赛人头费
    //         prize_type: number,//奖励类型
    //         prize_base_pool: number,//奖励数量
    //         tribe_id: number,//联盟id
    //         create_time: string,//创建时间
    //         update_time: string,//
    //         bought: number,// 0: 无法报名 , 1: 报名中 , 2: 参与中
    //         alive: number,//存活人数
    //         is_buy_in: boolean,//是否已经买入
    //         prop_buy_type: number,// 道具使用类型 1: 只能道具 2: 混合 0: 不支持道具
    //     } | null = null;
}

export class WebOrgiNvitatIonRoom extends WebCommon {
    //接口地址
    static API: string = '/api/roomcenter/invitation/room';
}

export class WebOrgFriendRoomList extends WebCommon {
    //接口地址
    static API: string = '/api/roomcenter/friend/rooms';
}

export class WebRoomSitApplyRecords extends WebCommon {
    //接口地址’
    static API: string = '/api/roomcenter/friend/room/apply/list';
}

export class WebRoomSitApplyAudit extends WebCommon {
    //接口地址’
    public static API: string = '/api/roomcenter/friend/room/apply/audit';
}

export class WebOrgFriendRoomInfo extends WebCommon {
    //接口地址’
    public static API: string = '/api/roomcenter/room/info';
}

export class WebOrgFriendBringIn extends WebCommon {
    public static API: string = '/api/roomcenter/friend/room/apply/bring_in';
    //字段声明
    // public static RequestParams: {
    //     room_id: number,  // 房间id
    //     bring_in: number // 带入值
    // } = null;
    // public static ResponseData: {
    //     data: typeof WebOrgFriendBringIn.Data
    // } = null;
    // public static Data: {
    //     id: number,
    //     room_creator_id: number,
    //     bring_in: number,
    //     status: number,
    //     op_id: number,
    //     create_time: string,
    //     update_time: string,
    // } = null;
}

export class WebOrgClubRoom extends WebCommon {
    public static API: string = '/api/roomcenter/club/rooms';
}

export class WebRoomCenterHistoryGroup extends WebCommon {
    static API: string = '/api/roomcenter/history/group';
}

export class WebMeApply extends WebCommon {
    static API: string = '/api/roomcenter/user/apply/list';
}

export class WebRoomCenterMttUserWallet extends WebCommon {
    static API: string = '/api/roomcenter/mtt/{id}/user_wallet';
    // public sealed class Data
    // 	{
    // 		public Wallet wallet { get; set; }
    // 	}
    // 	public sealed class Wallet
    // 	{
    // 		public int user_id { get; set; }
    // 		public int club_id { get; set; }
    // 		public int tribe_id { get; set; }
    // 		public long gold { get; set; }
    // 		public int gold_type { get; set; }
    // 		public string club_name { get; set; }
    // 	}
}

export class WebRoomCenterMttHranks extends WebCommon {
    static API: string = '/api/roomcenter/mtt/{id}/hranks';
    /*
            public int uid { get; set; }//玩家id
            public int rank { get; set; }//排名
            public int h { get; set; }//猎头
            public long award { get; set; }//赏金
            public int rid { get; set; }//房间id
            public int seat { get; set; }//座位号
            public string name { get; set; }//名称
            public string avatar { get; set; }//头像
            public int urid { get; set; }//随机id
    */
}

export class WebRoomCenterMttRanks extends WebCommon {
    //接口地址
    static API: string = '/api/roomcenter/mtt/{id}/ranks';
    /*records
    public int rank { get; set; }//排名
    public long chip { get; set; }//记分牌
    public bool alive { get; set; }//是否被淘汰
    public int rid { get; set; }//桌号
    public int urid { get; set; }//玩家随机id
    public int seat { get; set; }//座位号
    public int rebuy { get; set; }//重构次数
    public bool addon { get; set; }//是否重构
    public string name { get; set; }//名字
    */
}

export class WebRoomCenterAutoChageRoom extends WebCommon {
    static API: string = '/api/roomcenter/auto_chage_room';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterAutoChageRoom.Data;
    } | null = null;
    static Data: {
        record?: typeof WebRoomCenterAutoChageRoom.Record;
    } | null = null;
    static Record: {
        room_id?: number;
        room_type?: number;
        anti_cheat_type?: number;
        anti_cheat_video_type?: number;
        bombpot?: number;
    } | null = null;

    static Request(param: typeof WebRoomCenterAutoChageRoom.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterAutoChageRoom.ResponseData;
    };
}

export class WebRoomCenterClubRoomApplyDelayAllList extends WebCommon {
    static API: string = '/api/roomcenter/club/room/apply/delay/all/list';
    static RequestParams: {
        limit?: number;
        offset?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterClubRoomApplyDelayAllList.Data;
    } | null = null;
    static Data: {
        limit?: number;
        offset?: number;
        total?: number;
        unaudited?: number;
        data?: unknown[];
        delay_room_audit_switch?: number;
    } | null = null;

    static Request(param: typeof WebRoomCenterClubRoomApplyDelayAllList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterClubRoomApplyDelayAllList.ResponseData;
    };
}

export class WebRoomCenterClubRoomApplyDelayAudit extends WebCommon {
    static API: string = '/api/roomcenter/club/room/apply/delay/audit';
    static RequestParams: {
        apply_id?: number;
        audit_op?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterClubRoomApplyDelayAudit.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebRoomCenterClubRoomApplyDelayAudit.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterClubRoomApplyDelayAudit.ResponseData;
    };
}

export class WebRoomCenterDelayTimeBlindLevelQuery extends WebCommon {
    static API: string = '/api/roomcenter/delay_time_blind_level/query';
    static RequestParams: {
        blindtable_type?: number;
        match_type?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterDelayTimeBlindLevelQuery.Data;
    } | null = null;
    static Data: {
        record?: typeof WebRoomCenterDelayTimeBlindLevelQuery.BlindData;
    } | null = null;
    static BlindData: {
        blindtable_type?: number;
        delay_time_type?: number;
        blind_level_delay_time_table?: (typeof WebRoomCenterDelayTimeBlindLevelQuery.BlindLevel)[];
        max_delay_times?: number;
        auto_delay_time?: number;
    } | null = null;
    static BlindLevel: {
        level?: number;
        small_blind?: number;
        ante?: number;
        delay_times?: number;
    } | null = null;

    static Request(param: typeof WebRoomCenterDelayTimeBlindLevelQuery.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterDelayTimeBlindLevelQuery.ResponseData;
    };
}

export class WebRoomCenterDelayTimeBlindLevelSave extends WebCommon {
    static API: string = '/api/roomcenter/delay_time_blind_level/save';
    static RequestParams: {
        blindtable_type?: number;
        match_type?: number;
        max_delay_times?: number;
        auto_delay_time?: number;
        blind_level_delay_time_table?: unknown[];
    } | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterDelayTimeBlindLevelSave.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebRoomCenterDelayTimeBlindLevelSave.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterDelayTimeBlindLevelSave.ResponseData;
    };
}

export class WebRoomCenterFriendRoomApplyDelayAudit extends WebCommon {
    static API: string = '/api/roomcenter/friend/room/apply/delay/audit';
    static RequestParams: {
        apply_id?: number;
        audit_op?: number;
    } | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebRoomCenterFriendRoomApplyDelayAudit.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterFriendRoomApplyDelayAudit.ResponseData;
    };
}

export class WebRoomCenterFriendRoomApplyDelayList extends WebCommon {
    static API: string = '/api/roomcenter/friend/room/apply/delay/list';
    static RequestParams: {
        limit?: number;
        offset?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterFriendRoomApplyDelayList.Data;
    } | null = null;
    static Data: {
        limit?: number;
        offset?: number;
        total?: number;
        unaudited?: number;
        data?: unknown[];
        delay_room_audit_switch?: number;
    } | null = null;

    static Request(param: typeof WebRoomCenterFriendRoomApplyDelayList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterFriendRoomApplyDelayList.ResponseData;
    };
}

export class WebRoomCenterGameWatch extends WebCommon {
    static API: string = '/api/roomcenter/game/watch';
    static RequestParams: {
        room_id?: number;
        room_unique_id?: string;
        hand_num?: number;
        be_watched_user_id?: number;
    } | null = null;
    static ResponseData: {
        be_watched_user_hands?: (typeof WebRoomCenterHistoryReplay.WatchedUserHand)[]; //偷偷看手牌数据
        data?: unknown;
    } | null = null;

    static Request(param: typeof WebRoomCenterGameWatch.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterGameWatch.ResponseData;
    };
}

export class WebRoomCenterGameWatchNum extends WebCommon {
    static API: string = '/api/roomcenter/game/watch/num';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterGameWatchNum.Data;
    } | null = null;
    static Data: {
        pay_times?: number;
    } | null = null;

    static Request(param: typeof WebRoomCenterGameWatchNum.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterGameWatchNum.ResponseData;
    };
}

export class WebRoomCenterGameWatchUnreadList extends WebCommon {
    static API: string = '/api/roomcenter/game/watch/unread/list';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterGameWatchUnreadList.Data;
    } | null = null;
    static Data: {
        records?: (typeof WebRoomCenterGameWatchUnreadList.Record)[];
    } | null = null;
    static Record: {
        room_id?: number;
        club_name?: string;
        diamonds_change?: number;
        hand_num?: number;
        watch_user_name?: string;
    } | null = null;

    static Request(param: typeof WebRoomCenterGameWatchUnreadList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterGameWatchUnreadList.ResponseData;
    };
}

export class WebRoomCenterHistory0Squid extends WebCommon {
    static API: string = '/api/roomcenter/history/{0}/squid';
    static RequestParams: {
        round?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterHistory0Squid.Data;
    } | null = null;
    static Data: {
        round?: number;
        start_hand?: number;
        total?: number;
        end_hand?: number;
        records?: (typeof WebRoomCenterHistory0Squid.SquidInfo)[];
    } | null = null;
    static SquidInfo: {
        name?: string;
        in_num?: number;
        in_amount?: number;
        out_num?: number;
        out_amount?: number;
        user_random_id?: number;
    } | null = null;

    static Request(param: typeof WebRoomCenterHistory0Squid.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterHistory0Squid.ResponseData;
    };
}

export class WebRoomCenterHistoryReplayVideoId extends WebCommon {
    static API: string = '/api/roomcenter/history/replay_video/{id}';
    static RequestParams: {
        language?: string;
        save_video?: boolean;
        title?: string;
        anonymous?: number;
        room_id?: number;
        macht_id?: number;
        hand_num?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterHistoryReplayVideoId.Data;
    } | null = null;
    static Data: {
        h5_url?: string;
        video_url?: string;
    } | null = null;

    static Request(param: typeof WebRoomCenterHistoryReplayVideoId.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterHistoryReplayVideoId.ResponseData;
    };
}

export class WebRoomCenterHistoryViewPublicCards extends WebCommon {
    static API: string = '/api/roomcenter/history/view_public_cards';
    static RequestParams: {
        room_id?: number;
        hand_num?: number;
        round?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterHistoryViewPublicCards.Data;
    } | null = null;
    static Data: {
        pub_cards?: string;
        pub_cards2?: string;
    } | null = null;

    static Request(param: typeof WebRoomCenterHistoryViewPublicCards.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterHistoryViewPublicCards.ResponseData;
    };
}

export class WebRoomCenterHistoryViewPublicCardsFreeCount extends WebCommon {
    static API: string = '/api/roomcenter/history/view_public_cards/free_count';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterHistoryViewPublicCardsFreeCount.Data;
    } | null = null;
    static Data: {
        free_count?: number;
    } | null = null;

    static Request(param: typeof WebRoomCenterHistoryViewPublicCardsFreeCount.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterHistoryViewPublicCardsFreeCount.ResponseData;
    };
}

export class WebRoomCenterMttIdAwards extends WebCommon {
    static API: string = '/api/roomcenter/mtt/{id}/awards';
    static RequestParams: {
        limit?: number;
        offset?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterMttIdAwards.Data;
    } | null = null;
    static Data: {
        limit?: number;
        offset?: number;
        records?: (typeof WebRoomCenterMttIdAwards.Record)[];
        total?: number;
        gold_type?: number;
    } | null = null;
    static Record: {
        uid?: number;
        rank?: number;
        award_gold?: number;
        award_goods?: (typeof WebRoomCenterMttIdAwards.AwardGoods)[];
        username?: string;
        avatar?: string;
    } | null = null;
    static AwardGoods: {
        i?: number;
        na?: string;
        n?: number;
        v?: number;
    } | null = null;

    static Request(param: typeof WebRoomCenterMttIdAwards.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterMttIdAwards.ResponseData;
    };
}

export class WebRoomCenterMttIdClose extends WebCommon {
    static API: string = '/api/roomcenter/mtt/{id}/close';
    static RequestParams: {} | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebRoomCenterMttIdClose.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterMttIdClose.ResponseData;
    };
}

export class WebRoomCenterMttIdDetail extends WebCommon {
    static API: string = '/api/roomcenter/mtt/{id}/detail';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterMttIdDetail.Data;
    } | null = null;
    static More: {
        nu?: number;
        bl?: number;
        nbl?: number;
        nsb?: number;
        sb?: number;
        ante?: number;
        nante?: number;
        prize_pool?: number;
        min_chip?: number;
        avg_chip?: number;
        max_chip?: number;
    } | null = null;
    static Mtt: {
        match_id?: number;
        type?: number;
        start_time?: string;
        limit_min?: number;
        status?: number;
        initial_score?: number;
        upblind_interval?: number;
        total_buyin_times?: number;
        total_rebuy_times?: number;
        apply_fee_pool?: number;
        apply_fee_service?: number;
        apply_fee_hunter?: number;
        prize_base_pool?: number;
        gold_type?: number;
        anti_cheat_type?: number;
        anti_cheat_video_type?: number;
        joker?: number;
        joker_count?: number;
        mj_total_hands?: number;
        mj_blind_up_hands?: number;
        game_icon?: string;
        prizes?: (typeof WebRoomCenterMttIdDetail.Prize)[];
        prize_type?: number;
        is_admin?: boolean;
        is_top?: number;
        invitation_code?: string;
        origin_type?: number;
        name?: string;
        game_type?: number;
        poker_type?: number;
        limit_bet_type?: number;
        rank_type?: number;
        enter_time?: string;
        end_time?: string;
        hunter_on?: number;
        hunter_bonus?: number;
        partial_on?: number;
        parital_return_bl?: number;
        straddle_on?: number;
        straddle_max?: number;
        rooms?: number;
        max_room_id?: number;
        delay_view_card_on?: number;
        limit_delay_times?: number;
        limit_auto_check_times?: number;
        limit_auto_fold_times?: number;
        participants?: number;
        award_num?: number;
        money_sync?: number;
        seat_count?: number;
        final_seat_count?: number;
        no_user_wait_duration?: number;
        blindtable_type?: number;
        apply_start_time?: string;
        op_duration?: number;
        max_delay_apply_bl?: number;
        rebuy_times?: number;
        max_rebuy_bl?: number;
        limit_total_buy_times?: number;
        total_buy_times?: number;
        addon_begin_bl?: number;
        addon_end_bl?: number;
        addon_score?: number;
        total_addon_times?: number;
        tribe_id?: number;
        create_time?: string;
        update_time?: string;
        prop_buy_type?: number;
        buy_prop_id?: number;
        addonplus_m1_on?: number;
        addonplus_m1_max_times?: number;
        addonplus_m1_limit?: number;
        total_addonplus_m1_times?: number;
        addonplus_m2_on?: number;
        addonplus_m2_max_times?: number;
        addonplus_m2_max_bl?: number;
        total_addonplus_m2_times?: number;
        buy_ratio?: number;
        pre_buyin_bonus?: number;
        tablecloth_tag?: string;
        limit_tag?: string;
        buyin_free_times?: number;
        rebuy_free_times?: number;
        multi_ratio_free_times?: number;
        addon_free_times?: number;
        buyin_free_incl_svr?: number;
        rebuy_free_incl_svr?: number;
        multi_ratio_free_incl_svr?: number;
        addon_free_incl_svr?: number;
        rebuy_ticket_limit_times?: number;
        addon_ticket_limit_times?: number;
        share_mtt?: number;
        template_id?: number;
        popup_message?: string;
        anti_cheat_order_type?: number;
        anti_cheat_order_mic_type?: number;
        video_verify_type?: number;
        anti_cheat_timelimit?: number;
        force_video_timing_award?: number;
        force_video_timing_finals?: number;
        force_video_close?: number;
        force_video_close_time?: number;
        force_video_start_time?: string;
        force_close_time?: number;
        blind_level_delay_time_table?: unknown[];
        club_id?: number;
    } | null = null;
    static Prize: {
        award?: number;
        goods?: (typeof WebRoomCenterMttIdDetail.Goods)[];
    } | null = null;
    static Goods: {
        na?: string;
    } | null = null;
    static Real_prize: {
        award?: number;
        award_num?: number;
        participants?: number;
        prizes?: (typeof WebRoomCenterMttIdDetail.Prize)[];
        award_type?: number;
    } | null = null;
    static Data: {
        alive?: number;
        enter_total?: number;
        more?: typeof WebRoomCenterMttIdDetail.More;
        mtt?: typeof WebRoomCenterMttIdDetail.Mtt;
        real_prize?: typeof WebRoomCenterMttIdDetail.Real_prize;
        state?: typeof WebRoomCenterMttIdDetail.State;
        state_code?: number;
    } | null = null;
    static State: {
        left_rebuy_times?: number;
        chip?: number;
        store?: number;
        init_score?: number;
        partial_enable?: boolean;
    } | null = null;

    static Request(param: typeof WebRoomCenterMttIdDetail.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterMttIdDetail.ResponseData;
    };
}

export class WebRoomCenterMttIdFreeRemain extends WebCommon {
    static API: string = '/api/roomcenter/mtt/{id}/free_remain';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterMttIdFreeRemain.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebRoomCenterMttIdFreeRemain.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterMttIdFreeRemain.ResponseData;
    };
}

export class WebRoomCenterMttIdQuit extends WebCommon {
    static API: string = '/api/roomcenter/mtt/{id}/quit';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterMttIdQuit.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebRoomCenterMttIdQuit.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterMttIdQuit.ResponseData;
    };
}

export class WebRoomCenterMttIdUpdateTop extends WebCommon {
    static API: string = '/api/roomcenter/mtt/{id}/update_top';
    static RequestParams: {
        is_top?: number;
    } | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebRoomCenterMttIdUpdateTop.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterMttIdUpdateTop.ResponseData;
    };
}

export class WebRoomCenterMttAllserIes extends WebCommon {
    static API: string = '/api/roomcenter/mtt/all_series';
    static RequestParams: {
        ticket?: boolean;
        ratio?: number;
        use_free?: boolean;
        club_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterMttAllserIes.Data;
    } | null = null;
    static Data: {
        tribe_name?: string;
    } | null = null;

    static Request(param: typeof WebRoomCenterMttAllserIes.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterMttAllserIes.ResponseData;
    };
}

export class WebRoomCenterMttFriendList extends WebCommon {
    static API: string = '/api/roomcenter/mtt/friend/list';
    static RequestParams: {
        limit?: number;
        offset?: number;
        order?: string[];
        status?: number[];
        club_id?: number;
        result_type?: number;
        game_type?: number[];
        poker_type?: number[];
    } | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterMttFriendList.Data;
    } | null = null;
    static Data: {
        limit?: number;
        offset?: number;
        total?: number;
        records?: unknown[];
    } | null = null;

    static Request(param: typeof WebRoomCenterMttFriendList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterMttFriendList.ResponseData;
    };
}

export class WebRoomCenterPatrolClubRoomBlinds extends WebCommon {
    static API: string = '/api/roomcenter/patrol/club/room_blinds';
    static RequestParams: {
        game_type?: number[];
        poker_type?: number[];
    } | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterPatrolClubRoomBlinds.Data;
    } | null = null;
    static Data: {
        records?: unknown[];
    } | null = null;

    static Request(param: typeof WebRoomCenterPatrolClubRoomBlinds.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterPatrolClubRoomBlinds.ResponseData;
    };
}

export class WebRoomCenterPatrolClubRooms extends WebCommon {
    static API: string = '/api/roomcenter/patrol/club/rooms';
    static RequestParams: {
        limit?: number;
        offset?: number;
        sb_min?: number;
        sb_max?: number;
        sb_filters?: (typeof WebRoomCenterPatrolClubRooms.SbFilters)[];
        game_type?: number[];
        poker_type?: number[];
        order?: string[];
        enter_room_type?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterPatrolClubRooms.Data;
    } | null = null;
    static SbFilters: {
        game_type?: number;
        poker_type?: number;
        small_blind?: number;
        bombpot?: number;
    } | null = null;
    static Data: {
        limit?: number;
        offset?: number;
        records?: unknown[];
    } | null = null;

    static Request(param: typeof WebRoomCenterPatrolClubRooms.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterPatrolClubRooms.ResponseData;
    };
}

export class WebRoomCenterPatrolClubUsers extends WebCommon {
    static API: string = '/api/roomcenter/patrol/club/users';
    static RequestParams: {
        limit?: number;
        offset?: number;
        search?: string;
    } | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterPatrolClubUsers.Data;
    } | null = null;
    static Data: {
        limit?: number;
        offset?: number;
        records?: (typeof WebRoomCenterPatrolClubUsers.Record)[];
    } | null = null;
    static Record: {
        user_id?: number;
        user_random_id?: number;
        user_name?: string;
        avatar?: string;
        rooms?: (typeof WebRoomCenterPatrolClubUsers.TableRoomInfo)[];
    } | null = null;
    static TableRoomInfo: {
        rid?: number;
        room_type?: number;
        game_type?: number;
        poker_type?: number;
        limit_bet_type?: number;
        ante?: number;
        sb?: number;
        insurance_on?: number;
        origin_type?: number;
        share_table?: number;
        private_room?: number;
        anti_cheat_type?: number;
        anti_cheat_video_type?: number;
        bombpot?: number;
        personal_type?: number;
        seated_messaging?: number;
        mushroom_mode?: number;
        jackpot?: number;
        squid_on?: number;
        random_ante?: string;
        cowboy_config?: unknown;
        critical_hit?: number;
        call_time?: number;
        is_patrol?: boolean;
    } | null = null;

    static Request(param: typeof WebRoomCenterPatrolClubUsers.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterPatrolClubUsers.ResponseData;
    };
}

export class WebRoomCenterPatrolRoom extends WebCommon {
    static API: string = '/api/roomcenter/patrol/room';
    static RequestParams: {
        room_id?: number;
        club_id?: number;
        tribe_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterPatrolRoom.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebRoomCenterPatrolRoom.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterPatrolRoom.ResponseData;
    };
}

export class WebRoomCenterRandomEnter extends WebCommon {
    static API: string = '/api/roomcenter/random_enter';
    static RequestParams: {
        antes?: number[];
        small_blinds?: number[];
        ex_club_id?: number;
        insurance_on?: number[];
        game_type?: number[];
        poker_type?: number[];
        limit_bet_type?: number[];
        anti_cheat_type?: number[];
        limit?: number;
        detail?: boolean;
        seated_messaging?: number[];
        personal_type?: number[];
        mushroom_mode?: number[];
        squid_on?: number[];
        random_seat?: number[];
        force_show_card?: number[];
        only_ios?: number[];
        limit_ip_on?: number[];
        limit_gps_on?: number[];
        jackpot?: number[];
        tribe_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterRandomEnter.Data;
    } | null = null;
    static Data: {
        records?: (typeof WebRoomCenterRandomEnter.Records)[];
    } | null = null;
    static Records: {
        room_id?: number;
        room_type?: number;
        anti_cheat_type?: number;
        anti_cheat_video_type?: number;
        bombpot?: number;
    } | null = null;

    static Request(param: typeof WebRoomCenterRandomEnter.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterRandomEnter.ResponseData;
    };
}

export class WebRoomCenterRandomRoomTotal extends WebCommon {
    static API: string = '/api/roomcenter/random_room/total';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterRandomRoomTotal.Data;
    } | null = null;
    static Data: {
        total_info?: typeof WebRoomCenterRandomRoomTotal.RoomTotalInfo;
    } | null = null;
    static RoomTotalInfo: {
        RoomCount?: number;
        PlayerCount?: number;
    } | null = null;

    static Request(param: typeof WebRoomCenterRandomRoomTotal.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterRandomRoomTotal.ResponseData;
    };
}

export class WebRoomCenterRoomApplyDelay extends WebCommon {
    static API: string = '/api/roomcenter/room/apply/delay';
    static RequestParams: {
        room_id?: number;
        hands?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterRoomApplyDelay.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebRoomCenterRoomApplyDelay.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterRoomApplyDelay.ResponseData;
    };
}

export class WebRoomCenterRoomDelay extends WebCommon {
    static API: string = '/api/roomcenter/room/delay';
    static RequestParams: {
        room_id?: number;
        duration?: number;
        hands?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterRoomDelay.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebRoomCenterRoomDelay.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterRoomDelay.ResponseData;
    };
}

export class WebRoomCenterRoomDisbAnd extends WebCommon {
    static API: string = '/api/roomcenter/room/disband';
    static RequestParams: {
        room_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterRoomDisbAnd.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebRoomCenterRoomDisbAnd.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterRoomDisbAnd.ResponseData;
    };
}

export class WebRoomCenterRoomIsRoomAdmin extends WebCommon {
    static API: string = '/api/roomcenter/room/is_room_admin';
    static RequestParams: {
        room_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterRoomIsRoomAdmin.Data;
    } | null = null;
    static Data: {
        is_admin?: boolean;
    } | null = null;

    static Request(param: typeof WebRoomCenterRoomIsRoomAdmin.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterRoomIsRoomAdmin.ResponseData;
    };
}

export class WebRoomCenterRoomStart extends WebCommon {
    static API: string = '/api/roomcenter/room/start';
    static RequestParams: {
        room_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterRoomStart.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebRoomCenterRoomStart.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterRoomStart.ResponseData;
    };
}

export class WebRoomCenterRoomUserLeave extends WebCommon {
    static API: string = '/api/roomcenter/room/user_leave';
    static RequestParams: {
        room_id?: number;
        user_random_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterRoomUserLeave.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebRoomCenterRoomUserLeave.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterRoomUserLeave.ResponseData;
    };
}

export class WebRoomCenterRoomUserStandUp extends WebCommon {
    static API: string = '/api/roomcenter/room/user_stand_up';
    static RequestParams: {
        room_id?: number;
        user_random_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterRoomUserStandUp.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebRoomCenterRoomUserStandUp.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterRoomUserStandUp.ResponseData;
    };
}

export class WebRoomCenterRoomUserGeetEstList extends WebCommon {
    static API: string = '/api/roomcenter/room/user/geetest/list';
    static RequestParams: {
        room_id?: number;
        offset?: number;
        limit?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterRoomUserGeetEstList.Data;
    } | null = null;
    static Data: {
        limit?: number;
        offset?: number;
        total?: number;
        records?: (typeof WebRoomCenterRoomUserGeetEstList.GeeInfo)[];
    } | null = null;
    static GeeInfo: {
        id?: number;
        user_id?: number;
        user_name?: string;
        user_random_id?: number;
        avatar?: string;
        room_id?: number;
        room_club_id?: number;
        room_tribe_id?: number;
        geetest_risk_list?: (typeof WebRoomCenterRoomUserGeetEstList.GeeData)[];
        device_model?: string;
        min_distance?: number;
    } | null = null;
    static GeeData: {
        id?: number;
        name?: string;
        pass_status?: number;
        risk_code_list?: string;
    } | null = null;

    static Request(param: typeof WebRoomCenterRoomUserGeetEstList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterRoomUserGeetEstList.ResponseData;
    };
}

export class WebRoomCenterRoomsAndMttList extends WebCommon {
    static API: string = '/api/roomcenter/rooms_and_mtt/list';
    static RequestParams: {
        room_ids?: number[];
        match_ids?: number[];
    } | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterRoomsAndMttList.Data;
    } | null = null;
    static Data: {
        records?: (typeof WebRoomCenterRoomsAndMttList.Record)[];
    } | null = null;
    static Record: {
        room_id?: number;
        match_id?: number;
        room_type?: number;
        name?: string;
        multi_lang_names_obj?: unknown;
        bombpot?: number;
        sb?: number;
        ante?: number;
        apply_fee_pool?: number;
        apply_fee_service?: number;
        apply_fee_hunter?: number;
    } | null = null;

    static Request(param: typeof WebRoomCenterRoomsAndMttList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterRoomsAndMttList.ResponseData;
    };
}

export class WebRoomCenterSngIdBuyin extends WebCommon {
    static API: string = '/api/roomcenter/sng/{id}/buyin';
    static RequestParams: {
        club_id?: number;
        ratio?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterSngIdBuyin.Data;
    } | null = null;
    static Data: {
        mtt?: unknown;
    } | null = null;

    static Request(param: typeof WebRoomCenterSngIdBuyin.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterSngIdBuyin.ResponseData;
    };
}

export class WebRoomCenterSngIdClose extends WebCommon {
    static API: string = '/api/roomcenter/sng/{id}/close';
    static RequestParams: {
        sng_id?: number;
    } | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebRoomCenterSngIdClose.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterSngIdClose.ResponseData;
    };
}

export class WebRoomCenterSngIdDetail extends WebCommon {
    static API: string = '/api/roomcenter/sng/{id}/detail';
    static RequestParams: {
        sng_id?: number;
    } | null = null;
    static ResponseData: {} | null = null;
    static Data: {} | null = null;
    static SngData: {
        anti_cheat_type?: number;
        anti_cheat_video_type?: number;
        apply_fee_pool?: number;
        apply_fee_service?: number;
        blindtable_type?: number;
        buy_status?: number;
        club_id?: number;
        game_icon?: string;
        gold_type?: number;
        initial_score?: number;
        invitation_code?: string;
        limit_participants?: number;
        name?: string;
        prize_type?: number;
        sng_id?: number;
        tribe_id?: number;
        type?: number;
        upblind_interval?: number;
        prizes?: unknown[];
        is_admin?: boolean;
    } | null = null;

    static Request(param: typeof WebRoomCenterSngIdDetail.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterSngIdDetail.ResponseData;
    };
}

export class WebRoomCenterSngIdMttList extends WebCommon {
    static API: string = '/api/roomcenter/sng/{id}/mtt_list';
    static RequestParams: {
        id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterSngIdMttList.Data;
    } | null = null;
    static Data: {
        records?: (typeof WebRoomCenterSngIdMttList.Record)[];
    } | null = null;
    static Record: {
        match_id?: number;
        name?: string;
        alive?: number;
        ranks?: (typeof WebRoomCenterSngIdMttList.Rank)[];
    } | null = null;
    static Rank: {
        name?: string;
        rank?: number;
        chip?: number;
    } | null = null;

    static Request(param: typeof WebRoomCenterSngIdMttList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterSngIdMttList.ResponseData;
    };
}

export class WebRoomCenterSngIdQuit extends WebCommon {
    static API: string = '/api/roomcenter/sng/{id}/quit';
    static RequestParams: {
        sng_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterSngIdQuit.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebRoomCenterSngIdQuit.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterSngIdQuit.ResponseData;
    };
}

export class WebRoomCenterSngIdUserWallet extends WebCommon {
    static API: string = '/api/roomcenter/sng/{id}/user_wallet';
    static RequestParams: {
        sng_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterSngIdUserWallet.Data;
    } | null = null;
    static Data: {
        wallet?: (typeof WebRoomCenterSngIdUserWallet.Wallet)[];
    } | null = null;
    static Wallet: {
        club_id?: number;
        gold?: number;
        gold_type?: number;
        club_name?: string;
        club_random_id?: number;
        club_logo?: string;
    } | null = null;

    static Request(param: typeof WebRoomCenterSngIdUserWallet.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterSngIdUserWallet.ResponseData;
    };
}

export class WebRoomCenterSngApplyFees extends WebCommon {
    static API: string = '/api/roomcenter/sng/apply_fees';
    static RequestParams: {
        club_id?: number;
        status?: number[];
        tribe_id?: number;
        game_type?: number[];
        poker_type?: number[];
    } | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterSngApplyFees.Data;
    } | null = null;
    static Data: {
        records?: (typeof WebRoomCenterSngApplyFees.RecordData)[];
    } | null = null;
    static RecordData: {
        apply_fee?: number;
    } | null = null;

    static Request(param: typeof WebRoomCenterSngApplyFees.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterSngApplyFees.ResponseData;
    };
}

export class WebRoomCenterSngFriendList extends WebCommon {
    static API: string = '/api/roomcenter/sng/friend/list';
    static RequestParams: {
        limit?: number;
        offset?: number;
        status?: number[];
    } | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterSngFriendList.Data;
    } | null = null;
    static Data: {
        limit?: number;
        offset?: number;
        records?: (typeof WebRoomCenterSngFriendList.RecordData)[];
        total?: number;
    } | null = null;
    static RecordData: {
        anti_cheat_type?: number;
        anti_cheat_video_type?: number;
        apply_fee_pool?: number;
        apply_fee_service?: number;
        bombpot?: number;
        buy_status?: number;
        game_type?: number;
        limit_bet_type?: number;
        limit_participants?: number;
        name?: string;
        origin_type?: number;
        poker_type?: number;
        sng_id?: number;
        currency?: string;
    } | null = null;

    static Request(param: typeof WebRoomCenterSngFriendList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterSngFriendList.ResponseData;
    };
}

export class WebRoomCenterSngList extends WebCommon {
    static API: string = '/api/roomcenter/sng/list';
    static RequestParams: {
        club_id?: number;
        limit?: number;
        offset?: number;
        status?: number[];
        tribe_id?: number;
        order?: string[];
        game_type?: number[];
        poker_type?: number[];
        apply_fee?: number[];
        only_club_room?: boolean;
    } | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebRoomCenterSngList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterSngList.ResponseData;
    };
}

export class WebRoomCenterTribeRoomBlinds extends WebCommon {
    static API: string = '/api/roomcenter/tribe/room_blinds';
    static RequestParams: {
        game_type?: number[];
        poker_type?: number[];
        status?: number[];
        hide_full?: boolean;
    } | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterTribeRoomBlinds.Data;
    } | null = null;
    static Data: {
        records?: unknown[];
    } | null = null;

    static Request(param: typeof WebRoomCenterTribeRoomBlinds.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterTribeRoomBlinds.ResponseData;
    };
}

export class WebRoomCenterTribeRooms extends WebCommon {
    static API: string = '/api/roomcenter/tribe/rooms';
    static RequestParams: {
        name?: string;
        ante_min?: number;
        ante_max?: number;
        sb_min?: number;
        sb_max?: number;
        tribe_id?: number;
        start_time_s?: number;
        start_time_e?: number;
        enter_time_s?: number;
        enter_time_e?: number;
        game_type?: number[];
        poker_type?: number[];
        limit_bet_type?: number[];
        small_blinds?: number[];
        hide_full?: boolean;
        limit?: number;
        offset?: number;
        sb_filters?: unknown[];
        enter_room_type?: number;
        order?: string[];
    } | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebRoomCenterTribeRooms.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterTribeRooms.ResponseData;
    };
}

export class WebRoomCenterUserAllMttSngIds extends WebCommon {
    static API: string = '/api/roomcenter/user/all/mtt/sng/ids';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterUserAllMttSngIds.Data;
    } | null = null;
    static Data: {
        mtt_id_list?: (typeof WebRoomCenterUserAllMttSngIds.MttIdInfo)[];
        sng_id_list?: (typeof WebRoomCenterUserAllMttSngIds.SngIdInfo)[];
        mtt_series_list?: unknown[];
    } | null = null;
    static MttIdInfo: {
        match_id?: number;
        origin_type?: number;
        relate_club_ids?: number[];
        relate_tribe_club_list?: unknown[];
    } | null = null;
    static SngIdInfo: {
        sng_id?: number;
        origin_type?: number;
        relate_club_ids?: number[];
        relate_tribe_club_list?: unknown[];
    } | null = null;

    static Request(param: typeof WebRoomCenterUserAllMttSngIds.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterUserAllMttSngIds.ResponseData;
    };
}

export class WebRoomCenterUserAllRoomIds extends WebCommon {
    static API: string = '/api/roomcenter/user/all/room/ids';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterUserAllRoomIds.Data;
    } | null = null;
    static Data: {
        records?: (typeof WebRoomCenterUserAllRoomIds.RecordItem)[];
    } | null = null;
    static RecordItem: {
        rid?: number;
        origin_type?: number;
        relate_club_ids?: number[];
        relate_tribe_club_list?: unknown[];
    } | null = null;

    static Request(param: typeof WebRoomCenterUserAllRoomIds.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterUserAllRoomIds.ResponseData;
    };
}

export class WebRoomCenterUserAllRooms extends WebCommon {
    static API: string = '/api/roomcenter/user/all/rooms';
    static RequestParams: {} | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebRoomCenterUserAllRooms.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterUserAllRooms.ResponseData;
    };
}

export class WebRoomCenterUserApplyDelayList extends WebCommon {
    static API: string = '/api/roomcenter/user/apply/delay/list';
    static RequestParams: {
        limit?: number;
        offset?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterUserApplyDelayList.Data;
    } | null = null;
    static Data: {
        limit?: number;
        offset?: number;
        total?: number;
        unaudited?: number;
        data?: unknown[];
    } | null = null;

    static Request(param: typeof WebRoomCenterUserApplyDelayList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterUserApplyDelayList.ResponseData;
    };
}

export class WebRoomCenterUserContrAstRooms extends WebCommon {
    static API: string = '/api/roomcenter/user/contrast/rooms';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterUserContrAstRooms.Data;
    } | null = null;
    static Data: {
        records?: unknown[];
        contrast_rooms?: (typeof WebRoomCenterUserContrAstRooms.ContrastRoomInfo)[];
    } | null = null;
    static ContrastRoomInfo: {
        rid?: number;
        status?: number;
        hand_num?: number;
        empty_seat?: number;
        users?: unknown[];
        relate_club_ids?: number[];
        relate_tribe_club_list?: unknown[];
    } | null = null;

    static Request(param: typeof WebRoomCenterUserContrAstRooms.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterUserContrAstRooms.ResponseData;
    };
}

export class WebRoomCenterUserMttSngRoomsList extends WebCommon {
    static API: string = '/api/roomcenter/user/mtt/sng/rooms/list';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebRoomCenterUserMttSngRoomsList.Data;
    } | null = null;
    static Data: {
        mtt_change_list?: (typeof WebRoomCenterUserMttSngRoomsList.ContrastMttInfo)[];
        sng_change_list?: (typeof WebRoomCenterUserMttSngRoomsList.ContrastSngInfo)[];
        mtt_list?: (typeof WebRoomCenterUserMttSngRoomsList.MttInfo)[];
        sng_list?: (typeof WebRoomCenterUserMttSngRoomsList.SngInfo)[];
    } | null = null;
    static SngInfo: {
        anti_cheat_type?: number;
        anti_cheat_video_type?: number;
        apply_fee_pool?: number;
        apply_fee_service?: number;
        bombpot?: number;
        buy_status?: number;
        game_type?: number;
        limit_bet_type?: number;
        limit_participants?: number;
        name?: string;
        origin_type?: number;
        poker_type?: number;
        sng_id?: number;
        currency?: string;
        blindtable_type?: number;
        club_id?: number;
        game_icon?: string;
        gold_type?: number;
        initial_score?: number;
        invitation_code?: string;
        is_admin?: boolean;
        prize_type?: number;
        prizes?: (typeof WebRoomCenterUserMttSngRoomsList.Prize)[];
        relate_club_ids?: number[];
        relate_tribe_club_list?: unknown[];
        status?: number;
        tribe_id?: number;
        type?: number;
        upblind_interval?: number;
    } | null = null;
    static MttInfo: {
        origin_type?: number;
        relate_club_ids?: number[];
        relate_tribe_club_list?: unknown[];
        match_id?: number;
        start_time?: string;
        status?: number;
        name?: string;
        game_type?: number;
        poker_type?: number;
        hunter_on?: number;
        participants?: number;
        alive?: number;
        upblind_interval?: number;
        apply_start_time?: string;
        max_delay_apply_bl?: number;
        rebuy_times?: number;
        total_rebuy_times?: number;
        addon_begin_bl?: number;
        addon_end_bl?: number;
        apply_fee_pool?: number;
        apply_fee_service?: number;
        apply_fee_hunter?: number;
        prize_type?: number;
        prize_base_pool?: number;
        prop_buy_type?: number;
        buyin_free_times?: number;
        rebuy_free_times?: number;
        multi_ratio_free_times?: number;
        addon_free_times?: number;
        buyin_free_incl_svr?: number;
        rebuy_free_incl_svr?: number;
        multi_ratio_free_incl_svr?: number;
        addon_free_incl_svr?: number;
        gold_type?: number;
        anti_cheat_type?: number;
        anti_cheat_timelimit?: number;
        anti_cheat_video_type?: number;
        video_verify_type?: number;
        anti_cheat_order_type?: number;
        anti_cheat_order_mic_type?: number;
        bought?: number;
        mtt_buy?: number;
        mtt_banner_url?: string;
        force_close_time?: number;
        game_icon?: string;
        initial_score?: number;
        is_admin?: boolean;
        is_top?: number;
        joker?: number;
        joker_count?: number;
        limit_min?: number;
        mj_blind_up_hands?: number;
        mj_total_hands?: number;
        prizes?: (typeof WebRoomCenterUserMttSngRoomsList.Prize)[];
        state_code?: number;
        total_buyin_times?: number;
        type?: number;
        stage_name?: string;
        stage_father_id?: number;
        stage_blind_level?: number;
        stage_remain_rate?: number;
        stage_final_score_type?: number;
    } | null = null;
    static Prize: {
        award_ratio?: number;
        rank_max?: number;
        rank_min?: number;
        award?: number;
    } | null = null;
    static ContrastMttInfo: {
        match_id?: number;
        bought?: number;
        mtt_buy?: number;
        status?: number;
        participants?: number;
        state_code?: number;
    } | null = null;
    static ContrastSngInfo: {
        sng_id?: number;
        buy_status?: number;
        status?: number;
    } | null = null;

    static Request(param: typeof WebRoomCenterUserMttSngRoomsList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterUserMttSngRoomsList.ResponseData;
    };
}

export class WebRoomCenterUserRoomsList extends WebCommon {
    static API: string = '/api/roomcenter/user/rooms/list';
    static RequestParams: {} | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebRoomCenterUserRoomsList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterUserRoomsList.ResponseData;
    };
}
