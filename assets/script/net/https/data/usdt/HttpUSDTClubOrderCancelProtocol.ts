import { WebResponseDataBase } from '../other/WebResponseDataBase';

/**
 * 取消玩家直充订单
 */
export namespace HttpUSDTClubOrderCancelProtocol {
    export const API = '/api/order/user/club_order/cancel';
    export class RequestData {
        /** 订单号 */
        public order_no: string = '';
    }
    export class ResponseData extends WebResponseDataBase {}
}
