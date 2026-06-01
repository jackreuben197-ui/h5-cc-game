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

export class WebMttRoomMttApplyConfirm extends WebCommon {
    static API: string = '/api/mttroom/mttApplyConfirm';
    static RequestParams: {
        msgId?: string;
    } | null = null;
    static ResponseData: {
        status?: number;
        msg?: string;
        data?: typeof WebMttRoomMttApplyConfirm.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebMttRoomMttApplyConfirm.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMttRoomMttApplyConfirm.ResponseData;
    };
}
