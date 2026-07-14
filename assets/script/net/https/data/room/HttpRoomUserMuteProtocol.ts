import { WebResponseDataBase } from '../other/WebResponseDataBase';

/**
 * 禁言
 */
export namespace HttpRoomUserMuteProtocol {
    export const API = '/api/user/mute';
    export class RequestData {
        /** 俱乐部ID */
        public club_id?: number;
        /** 联盟ID */
        public tribe_id?: number;
        /** 用户ID */
        public user_id: number = 0;
        /** 是否禁言 true = 禁言，false = 解除禁言 */
        public mute: boolean = false;
    }
    export class ResponseData extends WebResponseDataBase {
        /** 返回的业务数据 */
        public data: Data = null;
    }
    export class Data {
        /** 禁言信息列表 */
        public list: MuteInfo[] = [];
    }
    export class MuteInfo {
        /** 用户ID */
        public user_id: number = 0;
        /** 用户长ID */
        public user_random_id: number = 0;
        /** 俱乐部ID */
        public club_id: number = 0;
        /** 联盟ID */
        public tribe_id: number = 0;
    }
}
