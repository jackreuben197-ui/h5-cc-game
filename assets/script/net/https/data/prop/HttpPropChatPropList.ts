import { WebResponseDataBase } from '../other/WebResponseDataBase';

export namespace HttpPropChatPropList {
    export const API = '/api/prop/chat/prop/list';
    export class RequestData {
        public limit: number = 0;
        public offset: number = 0;
        public prop_type: number = 0;
        public prop_types: number[] = []; // 道具类型：1 表情，2 弹幕，3 聊天框，4 互动道具
        public user_type?: number; // 用户类型排序方式： 0 默认（创建时间倒序） 1 常用 2 最近使用 3 创建时间正序 4 价格正序 5 价格倒序
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
        public raw_price: number = 0; // 原价
        public pay_price: number = 0; // 折扣价格
        public start_time: number = 0; // 折扣开始时间
        public end_time: number = 0; // 折扣结束时间
        public subscription_name: string = '';
        public prop_amount: number = 0;
        public game_prop_id: number = 0;
        public prop_type_category: number = 0; // 道具类型子分类ID
        public prop_type_category_name: string = ''; // 道具类型子分类名称
        public prop_type_category_icon: string = ''; // 道具类型子分类图标
    }
}
