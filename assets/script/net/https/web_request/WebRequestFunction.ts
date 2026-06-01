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

export class WebFunctionQueryFunctionOpen extends WebCommon {
    static API: string = '/api/function/query_function_open';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: (typeof WebFunctionQueryFunctionOpen.DataElement)[];
    } | null = null;
    static DataElement: {
        functionCode?: number;
        open?: boolean;
        value?: string;
    } | null = null;

    static Request(param: typeof WebFunctionQueryFunctionOpen.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebFunctionQueryFunctionOpen.ResponseData;
    };
}
