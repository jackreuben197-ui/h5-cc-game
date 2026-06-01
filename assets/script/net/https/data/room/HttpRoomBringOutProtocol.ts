import { WebResponseDataBase } from '../other/WebResponseDataBase';

/**
 * 查询在该房间带出信息
 */
export namespace HttpRoomBringOutProtocol {
    export const API = '/api/user/room/{id}';
    export const CowboyAPI = '/api/user/cowboy/{id}';
    /**
     * 请求数据
     */
    export class RequestData {
        /** GPS 纬度 */
        public gps_latitude: string = '';
        /** GPS 经度 */
        public gps_longitude: string = '';
    }
    /**
     * 响应数据
     */
    export class ResponseData extends WebResponseDataBase {
        public data: Data = null;
    }
    /**
     * 带出信息
     */
    export class BringOut {
        /** 带出金额（减去服务费后的金额） */
        public to_wallet: number = 0;
        /** 服务费 */
        public fee: number = 0;
        /** 俱乐部 ID */
        public club_id: number = 0;
    }
    /**
     * 钱包数据
     */
    export class Wallet {
        /** 俱乐部 ID */
        public club_id: number = 0;
        /** 联盟 ID */
        public tribe_id: number = 0;
        /** 钱包类型：1 联盟币 (gold)，2 USDT */
        public gold_type: number = 0;
        /** 币种三字码 */
        public gold_currency: string = '';
        /** 钱包 ID */
        public w_u_id: number = 0;
        /** 钱包金额 */
        public gold: number = 0;
        /** 被锁定金额 */
        public gold_lock: number = 0;
        /** 俱乐部名称 */
        public club_name: string = '';
        /** 俱乐部随机 ID */
        public club_random_id: number = 0;
        /** 俱乐部头像 */
        public club_logo: string = '';
        /** 充值预付状态：1 开启，2 关闭 */
        public deposit_advance: number = 0;
        /** 联盟随机 ID */
        public tribe_random_id: number = 0;
        public user_status: number = 0;
        public user_type: number = 0;
        public wallet_status: number = 0;
        public wallet_tribe_status: number = 0;
    }
    /**
     * 响应数据体
     */
    export class Data {
        /** 上一次带出信息 */
        public last_bring_out: BringOut = null;
        /** 钱包列表 */
        public wallet: Wallet[] = [];
        /** 免费限制 */
        public free: FreeLimit = null;
        /** 是否返场（true 是，false 否） */
        public return_table: boolean = false;
        /** 待审核的申请带入筹码 */
        public apply_bring_in: number = 0;
        /** 玩家的总带入 */
        public bring_in_total: number = 0;
        /** 授信额度 */
        public user_club_gold_credit: number = 0;
    }
    /**
     * 免费限制
     */
    export class FreeLimit {
        /** 剩余免费买入次数 */
        public buyin: number = 0;
        /** 剩余免费重购次数 */
        public rebuy: number = 0;
        /** 剩余免费增购次数 */
        public addon: number = 0;
        /** 剩余免费多倍买入次数 */
        public multi: number = 0;
    }
}
