import { WebResponseDataBase } from '../other/WebResponseDataBase';

export namespace HttpPropChatPropList {
    export const API = '/api/prop/chat/prop/list';
    export class RequestData {
        public limit: number = 0;
        public offset: number = 0;
        public prop_type: number = 0;
        public prop_types: number[] = [];
        public user_type?: number;
    }
    export class ResponseData extends WebResponseDataBase {
        public data: Data = null;
    }
    export class Data {
        public list: PropData[] = [];
    }
    export class PropData {
        public prop_id: number = 0;
        public prop_type: number = 0;
        public price_id: number = 0;
        public prop_code: string = '';
        public raw_price: number = 0;
        public pay_price: number = 0;
        public start_time: number = 0;
        public end_time: number = 0;
        public subscription_name: string = '';
        public prop_amount: number = 0;
        public game_prop_id: number = 0;
    }
}
