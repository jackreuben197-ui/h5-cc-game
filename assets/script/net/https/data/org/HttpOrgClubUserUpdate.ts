import { WebResponseDataBase } from '../other/WebResponseDataBase';

export namespace HttpOrgClubUserUpdate {
    export const API = '/api/org/club/user/update';
    export class RequestData {
        public club_id: number = 0;
        public user_id: number = 0;
        public remark_name: string = '';
        public remark_desc: string = '';
    }
    export class ResponseData extends WebResponseDataBase {
        public data: Data = null;
    }
    export class Data {}
}
