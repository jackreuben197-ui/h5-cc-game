import { WebResponseDataBase } from '../other/WebResponseDataBase';

/**
 * Http接口：我的钱包列表
 */
export namespace HttpUserWalletProtocol {
    export const API = '/api/user/my_wallets';
    export class RequestData {
        /** 货币类型： 1 = UC， 2 = GC， 3 = 记分牌， 4 = 钻石 */
        public gold_type: number = 0;
        /** 记分牌来源（仅在 gold_type=3 时使用）： 3 = 俱乐部桌， 4 = 朋友桌 */
        public origin_type: number = 0;
    }
    export class ResponseData extends WebResponseDataBase {
        public data: Data = null;
    }
    export class Data {
        /** 金额 */
        public amount: number = 0;
        /** 钱包列表 */
        public wallet: Wallet[] = [];
    }
    export class Wallet {
        /** 金额 */
        public gold: number = 0;
        /** 俱乐部名称 */
        public club_name: string = '';
    }
}
