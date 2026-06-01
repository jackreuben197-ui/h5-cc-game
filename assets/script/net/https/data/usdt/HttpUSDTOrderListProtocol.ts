import { WebResponseDataBase } from '../other/WebResponseDataBase';

/**
 * 玩家充值钻石申请列表
 */
export namespace HttpUSDTOrderListProtocol {
    export const API = '/api/order/user/usdt/order/list';
    export class RequestData {
        /** 订单号 */
        public order_no: string = '';
    }
    export class ResponseData extends WebResponseDataBase {
        /** 业务数据 */
        public data: Data = null;
    }
    export class Data {
        /** 订单列表 */
        public list: OrderData[] = [];
    }
    export class OrderData {
        /** 订单详情 */
        public order: OrderInfo = null;
    }
    export class OrderInfo {
        /** 审核状态 1 - 申请中 2 - 成功 3 - 拒绝 4 - 取消 5 - 超时 */
        public status: number = 0;
    }
}
