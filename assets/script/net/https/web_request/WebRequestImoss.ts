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

export class WebImossGameClientUploadAudio extends WebCommon {
    static API: string = '/api/imoss/game_client/upload/audio';
    static RequestParams: {} | null = null;
    static ResponseData: {} | null = null;
    static Data: {
        fileUrl?: string;
    } | null = null;

    static Request(param: typeof WebImossGameClientUploadAudio.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebImossGameClientUploadAudio.ResponseData;
    };
}

export class WebImossGameClientUploadImage extends WebCommon {
    static API: string = '/api/imoss/game_client/upload/image';
    static RequestParams: {} | null = null;
    static ResponseData: {} | null = null;
    static Data: {
        fileUrl?: string;
    } | null = null;

    static Request(param: typeof WebImossGameClientUploadImage.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebImossGameClientUploadImage.ResponseData;
    };
}
