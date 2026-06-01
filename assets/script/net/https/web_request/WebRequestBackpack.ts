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

export class WebBackpackGoodsChange extends WebCommon {
    static API: string = '/api/backpack/goods/change';
    static RequestParams: {
        gamebagId?: number;
        status?: number;
        toRandomNum?: string;
    } | null = null;
    static ResponseData: {
        status?: number;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebBackpackGoodsChange.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebBackpackGoodsChange.ResponseData;
    };
}
