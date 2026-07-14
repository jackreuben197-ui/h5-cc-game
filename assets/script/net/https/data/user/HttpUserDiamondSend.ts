import { WebResponseDataBase } from '../other/WebResponseDataBase';

export namespace HttpUserDiamondSend {
    export const API = '/api/user/diamond/send';
    export class RequestData {
        public target_user_id: number = 0;
        public send_type: number = 0;
        public amount: number = 0;
        public room_id: number = 0;
    }
    export class ResponseData extends WebResponseDataBase {
        public data: Data = null;
    }
    export class Data {}
}
