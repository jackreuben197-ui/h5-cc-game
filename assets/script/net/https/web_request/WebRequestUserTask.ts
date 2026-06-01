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

export class WebUserTaskFinishTaskApp extends WebCommon {
    static API: string = '/api/user_task/finish_task/app';
    static RequestParams: {
        action?: number;
    } | null = null;
    static ResponseData: {
        status?: number;
        msg?: string;
        data?: typeof WebUserTaskFinishTaskApp.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebUserTaskFinishTaskApp.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserTaskFinishTaskApp.ResponseData;
    };
}
