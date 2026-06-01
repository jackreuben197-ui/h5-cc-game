import { WebResponseDataBase } from '../other/WebResponseDataBase';

export namespace HttpUserSetVideoMaskProtocol {
    export const API = '/api/user/set_video_mask';
    export class RequestData {
        /** 贴纸id */
        public video_mask_id: number = 0;
    }
    export class ResponseData extends WebResponseDataBase {}
}
