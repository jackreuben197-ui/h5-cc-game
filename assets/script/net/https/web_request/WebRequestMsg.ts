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

export class WebMsgMessageUnread extends WebCommon {
    //接口地址
    static API: string = '/api/msg/message/unread';
    //字段声明
    static RequestParams: {} | null = null;
    static ResponseData: {
        msg_main_type: number; //消息类型:1-bag,2-club,3-money,4-system,5-tribe,6-带入
        num: number; //未读消息数量
        title: string;
        content: string;
        remark: string;
        msg_type: number; //消息类型 MessageSubType
        create_time: string; //创建时间
    } | null = null;

    static Request(param: typeof WebMsgMessageUnread.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: (typeof WebMsgMessageUnread.ResponseData)[];
    };
}

export class WebMsgMessageUnreadClear extends WebCommon {
    //接口地址
    static API: string = '/api/msg/message/clear_unread';
    //字段声明
    static RequestParams: {} | null = null;
    static ResponseData: {} | null = null;

    static Request(param?: any) {
        this.RequestParams = param;
        return param;
    }

    static Response: { code?: number; message?: string; data?: any };
}

export class WebMsgMessageList extends WebCommon {
    //接口地址
    static API: string = '/api/msg/message/list';
    //字段声明
    // static RequestParams: {
    //     msg_type: number,//消息类型
    //     limit: number,//条目
    //     offset: number,//开始下标。例子（offset=0，limit=10，0-9。）
    // } = null;
    // static ResponseData: {
    //     data?: typeof WebMsgMessageList.Data,
    // } = null;
    // static Data: {
    //     offset: number,//开始下标。例子（offset=0，limit=10，0-9。）
    //     total: number,//总条目数
    //     list: typeof WebMsgMessageList.MsgInfo,
    // } = null;
    // static MsgInfo:
    //     {
    //         msg_main_type: number,//消息类型:1-bag,2-club,3-money,4-system,5-tribe
    //         num: number,//未读消息数量
    //         msg_id: number,//消息ID
    //         title: string,
    //         content: string,
    //         remark: string,
    //         msg_type: number,//消息类型 MessageSubType
    //         create_time: string,//创建时间
    //         game_type: number,//游戏类型
    //         multi_language_id: string,//房间名称key
    //     }
}

export class WebMessageRednum extends WebCommon {
    static API: string = '/api/msg/message/red_num';
}

export class WebMsgMessageRead extends WebCommon {
    static API: string = '/api/msg/message/read';
    static RequestParams: {
        id?: number;
        msg_type?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebMsgMessageRead.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebMsgMessageRead.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMsgMessageRead.ResponseData;
    };
}

export class WebMsgMessageSystemBroadcastNum extends WebCommon {
    static API: string = '/api/msg/message/system/broadcast/num';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: (typeof WebMsgMessageSystemBroadcastNum.MsgInfo)[];
    } | null = null;
    static MsgInfo: {
        msg_main_type?: number;
        num?: number;
        msg_type?: number;
    } | null = null;

    static Request(param: typeof WebMsgMessageSystemBroadcastNum.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMsgMessageSystemBroadcastNum.ResponseData;
    };
}

export class WebMsgMessageTodo extends WebCommon {
    static API: string = '/api/msg/message/todo';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: (typeof WebMsgMessageTodo.Data)[];
    } | null = null;
    static Data: {
        num?: number;
        type?: number;
    } | null = null;

    static Request(param: typeof WebMsgMessageTodo.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMsgMessageTodo.ResponseData;
    };
}

export class WebMsgMessageTodoAllInfo extends WebCommon {
    static API: string = '/api/msg/message/todo/all_info';
    static RequestParams: {
        todo_types?: number[];
    } | null = null;
    static ResponseData: {
        data?: typeof WebMsgMessageTodoAllInfo.Data;
    } | null = null;
    static Data: {
        num_map?: (typeof WebMsgMessageTodoAllInfo.DataElement)[];
        user_order_list?: unknown[];
        club_user_join_list?: unknown[];
        club_share_template_list?: unknown[];
        room_bring_in_list?: unknown[];
        room_delay_list?: unknown[];
        club_join_tribe_list?: unknown[];
        club_order_list?: unknown[];
        unread_msg_list?: unknown[];
    } | null = null;
    static DataElement: {
        num?: number;
        type?: number;
    } | null = null;

    static Request(param: typeof WebMsgMessageTodoAllInfo.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMsgMessageTodoAllInfo.ResponseData;
    };
}
