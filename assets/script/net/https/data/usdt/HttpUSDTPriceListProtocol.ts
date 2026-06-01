import { WebResponseDataBase } from '../other/WebResponseDataBase';
import { HttpUSDTRechargeProtocol } from './HttpUSDTRechargeProtocol';
import { USDTTraderType } from './USDTTraderType';

/**
 * USDT商品列表
 */
export namespace HttpUSDTPriceListProtocol {
    export const API = '/api/prop/gold/price/list';
    export class RequestData {
        /** 来源类型：1-联盟，2-玩家 */
        public source_type: number = 0;
        /** 俱乐部ID */
        public club_id: number = 0;
        /** 币种列表 */
        public gold_types: number[] = [];
    }
    export class ResponseData extends WebResponseDataBase {
        /** 业务数据 */
        public data: Data = null;
    }
    export class Data {
        /** 条目数 */
        public limit: number = 0;
        /** 起始下标 */
        public offset: number = 0;
        /** 总条目数 */
        public total: number = 0;
        /** 金币信息列表 */
        public list: GoldInfo[] = [];
        /** 支付方式列表 */
        public pay_types: PayType[] = [];
    }
    export class GoldInfo {
        /** 金币数量 */
        public gold_count: number = 0;
        /** 支付价格 */
        public pay_price: number = 0;
        /** 唯一ID */
        public id: number = 0;
        /** 交易方类型：1-普通玩家，2-批发商 */
        public trader_type: USDTTraderType = null;
        /** 赠送金额 */
        public give_gold_count: number = 0;
    }
    export class PayType {
        /** 唯一ID */
        public id: number = 0;
        /** 名称 */
        public name: string = '';
        /** 图标 */
        public image: string = '';
        /** 汇率（例如：0.0001 表示 1钻石/UC = 0.0001 货币，精确到4位小数） */
        public rate: number = 0;
        /** 折扣优惠（例如：0.0001 表示总额减少 0.01%，精确到4位小数） */
        public discount: number = 0;
        /** 类型：1-数字钱包，2-API 3-客服撮合 */
        public type: number = 0;
        /** 手续费类型：0-无手续费，1-俱乐部出，2-玩家出 */
        public fee_type: number = 0;
        /** 手续费率（精确到0.0001） */
        public fee_rate: number = 0;
        /** 玩家最小充值额度 */
        public user_recharge_min: number = 0;
        /** 玩家最大充值额度 */
        public user_recharge_max: number = 0;
        /** 唯一识别金额，大于0表示开启 */
        public increase_interval: number = 0;
        /** 金币信息列表 */
        public price_list: GoldInfo[] = [];
        /** 钱包地址列表； 这里有用信息的是qr_code, 为的是提前预缓存二维码图片 */
        public wallet_addresses: HttpUSDTRechargeProtocol.PayInfo[] = [];
    }
}
