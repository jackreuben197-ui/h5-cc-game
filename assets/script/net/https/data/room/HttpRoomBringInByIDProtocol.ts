import { WebResponseDataBase } from '../other/WebResponseDataBase';

/**
 * 带入时查看玩家使用的钱包信息
 */
export namespace HttpRoomBringInByIDProtocol {
    export const API = '/api/user/room/bringin/{id}';
    export class RequestData {}
    export class ResponseData extends WebResponseDataBase {
        public data: Data = null;
    }
    export class Data {
        /** 钱包id */
        public w_u_id: number = 0;
        /** 俱乐部ID */
        public club_id: number = 0;
        /** 俱乐部名称 */
        public club_name: string = '';
        /** 俱乐部随机 ID */
        public club_random_id: number = 0;
        /** 俱乐部头像 */
        public club_logo: string = '';
        /** 联盟ID */
        public tribe_id: number = 0;
        /** 联盟随机 ID */
        public tribe_random_id: number = 0;
        /** 金额 */
        public gold: number = 0;
        /** 锁定 UC 币 */
        public gold_lock: number = 0;
        /** 钱包类型：1 联盟币 (gold)，2 USDT */
        public gold_type: number = 0;
        /** 币种三字码 */
        public gold_currency: string = '';
        /** 玩家的总带入 */
        public bring_in_total: number = 0;
        /** 充值预付状态：1 开启，2 关闭 */
        public deposit_advance: number = 0;
        public user_status: number = 0;
        public user_type: number = 0;
        public wallet_status: number = 0;
        public wallet_tribe_status: number = 0;
    }
}
