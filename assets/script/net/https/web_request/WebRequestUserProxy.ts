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

export class WebUserProxyImAuthUserToken extends WebCommon {
    static API: string = '/api/userproxy/im/auth/user_token';
    static RequestParams: {
        platform?: number;
        operatio_id?: string;
    } | null = null;
    static ResponseData: {} | null = null;
    static Data: {
        userID?: string;
        token?: string;
        expiredTime?: number;
    } | null = null;

    static Request(param: typeof WebUserProxyImAuthUserToken.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserProxyImAuthUserToken.ResponseData;
    };
}
