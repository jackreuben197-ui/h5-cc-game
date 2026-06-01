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

export class WebGcCowboyRoomList extends WebCommon {
    static API: string = '/api/gc/cowboy/room/list';
    static RequestParams: {
        limit?: number;
        offset?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebGcCowboyRoomList.Data;
    } | null = null;
    static Data: {
        records?: (typeof WebGcCowboyRoomList.RoomInfo)[];
    } | null = null;
    static RoomInfo: {
        room_id?: number;
    } | null = null;

    static Request(param: typeof WebGcCowboyRoomList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebGcCowboyRoomList.ResponseData;
    };
}
