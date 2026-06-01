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

export class WebRoomMttUseProp extends WebCommon {
    static API: string = '/api/room/mtt/useProp';
    static RequestParams: {
        propId?: number;
    } | null = null;
    static ResponseData: {
        status?: number;
        data?: typeof WebRoomMttUseProp.Data;
    } | null = null;
    static Data: {
        matchId?: number;
        name?: string;
        startTime?: number;
    } | null = null;

    static Request(param: typeof WebRoomMttUseProp.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomMttUseProp.ResponseData;
    };
}
