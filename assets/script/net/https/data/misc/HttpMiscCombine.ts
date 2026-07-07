import { WebResponseDataBase } from '../other/WebResponseDataBase';
import { HttpStatsOtherUserStats } from '../stats/HttpStatsOtherUserStats';

export namespace HttpMiscCombine {
    export const API = '/api/misc/combine';
    export type StatsResponse = HttpStatsOtherUserStats.Data | HttpStatsOtherUserStats.ResponseData;
    export class RequestData {
        public api_list: number[] = [];
        public user_stats_by_user_rid_req: HttpStatsOtherUserStats.RequestData = null;
    }
    export class ResponseData extends WebResponseDataBase {
        public data: Data = null;
    }
    export class Data {
        public user_stats_by_user_rid_resp: StatsResponse[] | StatsResponse = null;
    }
}
