import { WebResponseDataBase } from '../other/WebResponseDataBase';
import { HttpStatsOtherUserStats } from '../stats/HttpStatsOtherUserStats';

export namespace HttpMiscCombine {
    export const API = '/api/misc/combine';
    export type StatsResponse = HttpStatsOtherUserStats.Data | HttpStatsOtherUserStats.ResponseData;
    export class RequestData {
        public api_list: number[] = [];
        public user_info_by_rid_req: UserInfoByRidRequest = null;
        public user_stats_by_user_rid_req: HttpStatsOtherUserStats.RequestData = null;
    }
    export class ResponseData extends WebResponseDataBase {
        public data: Data = null;
    }
    export class Data {
        public user_info_by_rid_resp: UserPublicInfo[] = null;
        public user_stats_by_user_rid_resp: StatsResponse[] | StatsResponse = null;
    }
    export class UserInfoByRidRequest {
        public user_random_id: number[] = [];
    }
    export class UserPublicInfo {
        public assist: number = 0;
        public avatar: string = '';
        public device_model: string = '';
        public jump_ip: number = 0;
        public mj_tag_custom: string = '';
        public mj_tag_id: number = 0;
        public nick_name: string = '';
        public random_num: number = 0;
        public remark_desc: string = '';
        public remark_name: string = '';
        public sex: number = 0;
        public simulator: number = 0;
        public subscription_id: number = 0;
        public subscription_logo: string = '';
        public subscription_name: string = '';
        public subscription_rank: number = 0;
        public subscription_type: number = 0;
        public tag_custom: string = '';
        public tag_id: number = 0;
        public user_id: number = 0;
        public video_mask_id: number = 0;
        public vip: number = 0;
    }
}
