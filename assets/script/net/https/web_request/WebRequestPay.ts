import { WebCommon } from '../WebRequestBase';

type RequestParamsOf<T extends { RequestParams?: unknown }> = T extends {
    RequestParams: infer R;
}
    ? R
    : Record<string, unknown>;

type ResponseDataOf<T extends { ResponseData?: unknown }> = T extends {
    ResponseData: infer R;
}
    ? R
    : unknown;
// ===== Unity Added APIs (Auto Generated) =====
// count: 319

export class WebPayAppleOrderRecharge extends WebCommon {
    static API: string = '/api/pay/apple/order/recharge';
    static RequestParams: {
        product_id?: string;
        amount?: number;
        gold_num?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebPayAppleOrderRecharge.Data;
    } | null = null;
    static Data: {
        recharge_data?: typeof WebPayAppleOrderRecharge.RechargeData;
    } | null = null;
    static RechargeData: {
        product_id?: string;
        order_no?: string;
        gold_num?: number;
        pay_amount?: number;
        receipt_md5?: string;
        transaction_no?: string;
    } | null = null;

    static Request(param: typeof WebPayAppleOrderRecharge.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebPayAppleOrderRecharge.ResponseData;
    };
}
