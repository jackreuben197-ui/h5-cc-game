import { WebResponseDataBase } from '../other/WebResponseDataBase';

/**
 * USDT充值钻石申请
 */
export namespace HttpUSDTRechargeProtocol {
    export const API = '/api/order/user/usdt/recharge';
    export class RequestData {
        /** 价格配置ID */
        public price_id: number = 0;
        /** 支付金额，用来校验最终结果 */
        public pay_price: number = 0;
        /** 支付渠道ID */
        public pay_id: number = 0;
        /** 购买数量 */
        public gold_count: number = 0;
    }
    export class ResponseData extends WebResponseDataBase {
        /** 业务数据 */
        public data: Data = null;
    }
    export class Data {
        /** 订单信息 */
        public order: OrderInfo = null;
        /** USDT 收款地址信息 */
        public usdt_address: PayInfo = null;
    }
    export class PayInfo {
        /** 地址类型，例如 ERC、TRC */
        public address_type: string = '';
        /** 钱包地址 */
        public address: string = '';
        /** 收款二维码 */
        public qr_code: string = '';
    }
    export class OrderInfo {
        /** 金币数量 */
        public gold_num: number = 0;
        /** 订单号 */
        public order_no: string = '';
        /** 支付金额 */
        public amount: number = 0;
    }
}
