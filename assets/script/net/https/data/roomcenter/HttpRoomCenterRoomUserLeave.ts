import { WebResponseDataBase } from '../other/WebResponseDataBase';

export namespace HttpRoomCenterRoomUserLeave {
    export const API = '/api/roomcenter/room/user_leave';
    export class RequestData {
        public room_id: number = 0;
        public user_random_id: number = 0;
    }
    export class ResponseData extends WebResponseDataBase {
        public data: Data = null;
    }
    export class Data {}
}
