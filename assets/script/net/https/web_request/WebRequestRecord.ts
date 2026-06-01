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

export class WebRecordCowboyDetailList extends WebCommon {
    static API: string = '/api/record/cowboy_detail_list';
    static RequestParams: {
        nextTime?: number;
        roomId?: number;
    } | null = null;
    static ResponseData: {
        status?: number;
    } | null = null;

    static Request(param: typeof WebRecordCowboyDetailList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRecordCowboyDetailList.ResponseData;
    };
}
