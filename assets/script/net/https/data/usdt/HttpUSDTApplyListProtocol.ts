import { WebResponseDataBase } from '../other/WebResponseDataBase';

/**
 * 用户申请批发商列表
 */
export namespace HttpUSDTApplyListProtocol {
    export const API = '/api/user/trader/apply/list';
    export class RequestData {
        /** 订单状态 1-申请中 2-成功 3-拒绝 4-取消 5-超时 */
        public status: number = 0;
    }
    export class ResponseData extends WebResponseDataBase {
        /** 业务数据 */
        public data: Data = null;
    }
    export class Data {
        /** 申请列表 */
        public list: ApplyInfo[] = [];
    }
    export class ApplyInfo {
        /** 订单号 */
        public order_no: string = '';
        /** 订单状态 1-申请中 2-成功 3-拒绝 4-取消 5-超时 */
        public status: number = 0;
        /** 拒绝理由 */
        public reject_reason: string = '';
        /** 已读状态 */
        public read_status: number = 0;
        /** 审核时间 */
        public audit_time: string = '';
        /** 更新时间 */
        public update_time: string = '';
        /** 创建时间 */
        public create_time: string = '';
    }
}
