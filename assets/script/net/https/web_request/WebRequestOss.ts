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

export class WebOrgClubUploadIcon extends WebCommon {
    //接口地址
    static API: string = '/api/oss/upload/avatar';
}

export class WebOssUploadAudio extends WebCommon {
    static API: string = '/api/oss/upload/audio';
    static RequestParams: {} | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebOssUploadAudio.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOssUploadAudio.ResponseData;
    };
}

export class WebOssUploadChatAudio extends WebCommon {
    static API: string = '/api/oss/upload/chat_audio';
    static RequestParams: {} | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebOssUploadChatAudio.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOssUploadChatAudio.ResponseData;
    };
}

export class WebOssUploadImage extends WebCommon {
    static API: string = '/api/oss/upload/image';
    static RequestParams: {} | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebOssUploadImage.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOssUploadImage.ResponseData;
    };
}

export class WebOssUploadLog extends WebCommon {
    static API: string = '/api/oss/upload/log';
    static RequestParams: {} | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebOssUploadLog.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOssUploadLog.ResponseData;
    };
}
