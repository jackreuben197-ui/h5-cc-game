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
export class WebChromedpQrCodeVideoFile extends WebCommon {
    static API: string = '/api/chromedp/qrcode/video_file';
    static RequestParams: {
        room_id?: number;
        qr_code_content?: string;
    } | null = null;
    static ResponseData: {
        data?: typeof WebChromedpQrCodeVideoFile.Data;
    } | null = null;
    static Data: {
        video_url?: string;
    } | null = null;

    static Request(param: typeof WebChromedpQrCodeVideoFile.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebChromedpQrCodeVideoFile.ResponseData;
    };
}
