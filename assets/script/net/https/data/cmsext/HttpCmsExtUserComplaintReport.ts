import { WebResponseDataBase } from '../other/WebResponseDataBase';

export namespace HttpCmsExtUserComplaintReport {
    export const API = '/api/cmsext/user/complaint/report';
    export class RequestData {
        public type?: number;
        public room_id?: number;
        public match_id?: number;
        public hand_num?: number;
        public room_unique_id?: string;
        public content?: string;
        public user_game_record_id?: number;
    }
    export class ResponseData extends WebResponseDataBase {
        public data: Data = null;
    }
    export class Data {}
}
