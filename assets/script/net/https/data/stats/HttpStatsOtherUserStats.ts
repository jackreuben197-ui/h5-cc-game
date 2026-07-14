import { WebResponseDataBase } from '../other/WebResponseDataBase';

export namespace HttpStatsOtherUserStats {
    export const API = '/api/stats/other_user_stats/{id}';
    export class RequestData {
        /** 游戏类型 */
        public game_type?: number;
        /** 牌类型 */
        public poker_type?: number;
        /** 货币类型 */
        public gold_type?: number;
        /** 来源类型 */
        public origin_type?: number;
        /** 房间ID */
        public room_id?: number;
        /** 玩家随机ID列表 */
        public user_random_id?: number[];
    }
    export class ResponseData extends WebResponseDataBase {
        /** 用户信息 */
        public data: Data = null;
    }
    export class Data {
        /** mtt数据 */
        public mtt_room_data: MTTRoomData = null;
        /** 普通牌局数据 */
        public room_data: RoomData = null;
        /** SNG 数据 */
        public sng_room_data: MTTRoomData = null;
        /** Fantasy 数据 */
        public fantasy_data: FantasyData = null;
        /** 入池率 */
        public pool_rate: number = 0;
        /** All-in 数据 */
        public allin_data: AllInData = null;
        /** 麻将数据 */
        public mahjong_data: MahjongData = null;
        /** 掼蛋数据 */
        public guandan_data: GuandanData = null;
        /** 玩家随机Id */
        public user_random_id: number = 0;
        /** 房间入池手数 */
        public room_in_pool_cnt: number = 0;
        /** 房间总手数 */
        public room_total_hand: number = 0;
    }
    export class MTTRoomData {
        /** 用户ID */
        public user_id: number = 0;
        /** 参赛次数 */
        public play_times: number = 0;
        /** 获奖次数 */
        public win_times: number = 0;
        /** 第一名次数 */
        public frist_times: number = 0;
        /** 第二名次数 */
        public second_times: number = 0;
        /** 第三名次数 */
        public third_times: number = 0;
    }
    export class RoomData {
        public id: number = 0;
        public user_id: number = 0;
        /** 游戏类型： 0-常规桌，1-OMAHA4，2-OMAHA5，3-OMAHA6 */
        public game_type: number = 0;
        /** 数据类型 1--今日；2--7天；3--30天；4--生涯 */
        public data_type: number = 0;
        /** 总局数 */
        public total_game_cnt: number = 0;
        /** 总手数 */
        public total_hand: number = 0;
        /** 总盈亏 */
        public total_earn: number = 0;
        /** 场均战绩 */
        public aveage_earn: number = 0;
        /** 战绩/百手 */
        public aveage_earn_hundred: number = 0;
        /** 入池率 */
        public vpip: number = 0;
        /** 入池胜率 */
        public wins: number = 0;
        /** 翻牌前加注率 */
        public prf: number = 0;
        /** 翻牌前再加注率 */
        public bet3: number = 0;
        /** 激进程度 */
        public af: number = 0;
        /** 4Flop持续下注率 */
        public cbet: number = 0;
        /** 摊牌胜率 */
        public wtsd: number = 0;
        /** 全下胜率 */
        public allinWins: number = 0;
        /** 服务费收益 */
        public service_profit: number = 0;
        /** 道具收益 */
        public prop_profit: number = 0;
        /** 玩家昵称 */
        public user_name: number = 0;
        /** 坚果次数 */
        public nuts: number = 0;
        /** Fantasy 次数 */
        public fantasy_count: number = 0;
        /** 全胜次数 */
        public full_win: number = 0;
        /** 最大牌型 */
        public max_card_type: number = 0;
        /** 最大牌型数据 */
        public max_card_data: string = '';
        /** 麻将自摸次数 */
        public mj_win_self_draw_count: number = 0;
        /** 麻将点炮胡次数 */
        public mj_win_discard_count: number = 0;
        /** 麻将点炮输次数 */
        public mj_lose_discard_count: number = 0;
        /** 麻将暗杠次数 */
        public mj_concealed_kong_count: number = 0;
        /** 麻将明杠次数 */
        public mj_exposed_kong_count: number = 0;
        /** 麻将杠上输次数 */
        public mj_lose_kong_count: number = 0;
        /** 短牌胜率 */
        public cb_wins: number = 0;
        /** 短牌下注率 */
        public cb_bet: number = 0;
        /** 掼蛋第一名次数 */
        public gd_rank1: number = 0;
        /** 掼蛋第二名次数 */
        public gd_rank2: number = 0;
        /** 掼蛋第三名次数 */
        public gd_rank3: number = 0;
        /** 掼蛋第四名次数 */
        public gd_rank4: number = 0;
        /** 掼蛋第一名率 */
        public gd_rank1_rate: number = 0;
        /** 玩家游戏天数 */
        public user_play_days: number = 0;
        /** 玩家游戏总时长 */
        public user_play_duration_total: number = 0;
        /** 入池手数 */
        public in_pool_cnt: number = 0;
        /** 入池赢牌手数 */
        public in_pool_win_cnt: number = 0;
        /** 翻牌前加注手数 */
        public prf_cnt: number = 0;
        /** 翻牌前再加注手数 */
        public bet3_cnt: number = 0;
        /** 激进下注手数 */
        public af_bet_cnt: number = 0;
        /** 激进加注手数 */
        public af_raise_cnt: number = 0;
        /** 激进跟注手数 */
        public af_call_cnt: number = 0;
        /** 4Flop持续下注手数 */
        public cbet_cnt: number = 0;
        /** 摊牌手数 */
        public wtsd_cnt: number = 0;
        /** 全下赢牌手数 */
        public all_in_win_cnt: number = 0;
    }
    export class FantasyData {
        /** 总局数 */
        public total_game_cnt: number = 0;
        /** 坚果次数 */
        public nuts: number = 0;
        /** 胜率 */
        public wins: number = 0;
        /** Fantasy 次数 */
        public fantasy_count: number = 0;
        /** 全胜次数 */
        public full_win: number = 0;
        /** 坚果数 */
        public nut: number = 0;
        /** 胜局数 */
        public win: number = 0;
    }
    export class AllInData {
        /** 总手数 */
        public hand_count: number = 0;
        /** 亏损次数 */
        public loss_count: number = 0;
        /** 盈利次数 */
        public profit_count: number = 0;
        /** 盈利总额 */
        public profit_total: number = 0;
        /** 主动次数 */
        public active_count: number = 0;
        /** 主动盈利次数 */
        public active_profit_count: number = 0;
        /** 被动次数 */
        public passive_count: number = 0;
        /** 被动盈利次数 */
        public passive_profit_count: number = 0;
        /** 落后次数 */
        public behind_count: number = 0;
        /** 落后盈利次数 */
        public behind_profit_count: number = 0;
        /** 领先次数 */
        public ahead_count: number = 0;
        /** 领先盈利次数 */
        public ahead_profit_count: number = 0;
    }
    export class MahjongData {
        /** 总手数 */
        public total_hand_cnt: number = 0;
        /** 总胜局 */
        public total_wins: number = 0;
        /** 手数 */
        public hand_cnt: number = 0;
        /** 自摸次数 */
        public mj_win_self_draw_count: number = 0;
        /** 点炮胡次数 */
        public mj_win_discard_count: number = 0;
        /** 点炮输次数 */
        public mj_lose_discard_count: number = 0;
        /** 暗杠次数 */
        public mj_concealed_kong_count: number = 0;
        /** 明杠次数 */
        public mj_exposed_kong_count: number = 0;
        /** 杠上输次数 */
        public mj_lose_kong_count: number = 0;
        /** 总胡牌次数 */
        public mj_total_win_count: number = 0;
        /** 胡牌次数 */
        public mj_win_count: number = 0;
        /** 胜率 */
        public wins: number = 0;
    }
    export class GuandanData {
        /** 总手数 */
        public total_hand_cnt: number = 0;
        /** 第一名次数 */
        public gd_rank1: number = 0;
        /** 第二名次数 */
        public gd_rank2: number = 0;
        /** 第三名次数 */
        public gd_rank3: number = 0;
        /** 第四名次数 */
        public gd_rank4: number = 0;
        /** 第一名率 */
        public gd_rank1_rate: number = 0;
        /** 第二名率 */
        public gd_rank2_rate: number = 0;
        /** 是否双倍 */
        public is_double: number = 0;
        /** 首次次数 */
        public first_times: number = 0;
        /** 双倍次数 */
        public double_cnt: number = 0;
        /** 首次计数 */
        public first_time_cnt: number = 0;
    }
}
