import { WebResponseDataBase } from '../other/WebResponseDataBase';

export namespace HttpUserMuteList {
    export const API = '/api/user/mute/list';
    export class RequestData {
        public club_id?: number;
        public tribe_id?: number;
        public user_ids: number[] = [];
    }
    export class ResponseData extends WebResponseDataBase {
        public data: Data = null;
    }
    export class Data {
        public ids: number[] = [];
    }
}
