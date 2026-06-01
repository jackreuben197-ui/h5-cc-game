import { WebResponseDataBase } from '../other/WebResponseDataBase';
import { HttpUSDTApplyListProtocol } from './HttpUSDTApplyListProtocol';

/**
 * 用户申请批发商资格
 */
export namespace HttpUSDTApplyProtocol {
    export const API = '/api/user/trader/apply';
    export class RequestData {}
    export class ResponseData extends WebResponseDataBase {
        public data: Data = null;
    }
    export class Data {
        /** 申请列表 */
        public data: HttpUSDTApplyListProtocol.ApplyInfo[] = [];
    }
}
