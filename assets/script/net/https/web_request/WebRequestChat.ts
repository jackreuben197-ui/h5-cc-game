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

export class WebSetmsgTemplate extends WebCommon {
    //接口地址
    static API: string = '/api/chat/club/inform/template/set';
    //字段声明
    // static RequestParams: {
    //     template_name: string, //名称,
    //     content: string, //内容
    // } = null;
    // static ResponseData: {
    // } = null;
}

export class WebGetmsgList extends WebCommon {
    //接口地址
    static API: string = '/api/chat/club/inform/template/list';
}

export class WebDelmsgTemplate extends WebCommon {
    //接口地址
    static API: string = '/api/chat/club/inform/template/del';
    //字段声明
    // static RequestParams: {
    //     id: number
    // } = null;
    // static ResponseData: {
    // } = null;
}

export class WebSendMsg extends WebCommon {
    public static API: string = '/api/chat/club/send_messages';
    //字段声明
    // public static RequestParams: {
    //     "content": string,
    //     "message_type": number,  // 消息类型 1 普通消息 2 会长公告 3 战绩分享 4 牌谱分享
    //     "standings_user_id": number, // 消息类型为 3战绩分享 时，分享的玩家ID
    //     "game_round_id": number,// 消息类型为 4牌谱分享 时，牌谱ID
    //     "amount": number
    // } = null;
}

export class WebOrgSendMess extends WebCommon {
    public static API: string = '/api/chat/club/send_messages';
    //字段声明
    // public static RequestParams: {
    //     "content": string,
    //     "message_type": number,  // 消息类型 1 普通消息 2 会长公告 3 战绩分享 4 牌谱分享
    //     "standings_user_id": number, // 消息类型为 3战绩分享 时，分享的玩家ID
    //     "game_round_id": number// 消息类型为 4牌谱分享 时，牌谱ID
    // } = null;
}

export class WebOrggetMessList extends WebCommon {
    public static API: string = '/api/chat/club/messages';
    //字段声明
    // public static RequestParams: {
    //     "history_id": number, // 查历史，小于此ID的消息
    //     "last_id": number, // 查最新，大于此ID的消息
    //     "limit": 10,
    //     "offset": 0
    // } = null;
}

export class WebOrggetNewMessNum extends WebCommon {
    public static API: string = '/api/chat/club/messages/new_count';
    //字段声明
    // public static RequestParams: {
    //     "msg_id": number
    // } = null;
}

export class WebChatMessageReport extends WebCommon {
    static API: string = '/api/chat/message/report';
    static RequestParams: {
        room_id?: number;
        msg_user_rid?: number;
        report_type?: string;
        other?: string;
        messages?: (typeof WebChatMessageReport.ChaMessage)[];
    } | null = null;
    static ResponseData: {} | null = null;
    static ChaMessage: {
        msg_user_rid?: number;
        content?: string;
        msg_time?: number;
    } | null = null;

    static Request(param: typeof WebChatMessageReport.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebChatMessageReport.ResponseData;
    };
}

export class WebChatRoomMessageSync extends WebCommon {
    static API: string = '/api/chat/room/message/sync';
    static RequestParams: {
        room_id?: number;
        block_user_random_ids?: string[];
        is_cowboy?: number;
        msg_types?: number[];
    } | null = null;
    static ResponseData: {
        data?: typeof WebChatRoomMessageSync.Data;
    } | null = null;
    static Data: {
        data?: (typeof WebChatRoomMessageSync.ChatData)[];
    } | null = null;
    static ChatData: {
        extra?: string;
    } | null = null;

    static Request(param: typeof WebChatRoomMessageSync.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebChatRoomMessageSync.ResponseData;
    };
}

export class WebChatSupportChannelList extends WebCommon {
    static API: string = '/api/chat/support/channel/list';
    static RequestParams: {
        limit?: number;
        offset?: number;
        order?: number;
        im_service_types?: number[];
    } | null = null;
    static ResponseData: {
        data?: typeof WebChatSupportChannelList.Data;
    } | null = null;
    static Data: {
        limit?: number;
        offset?: number;
        total?: number;
        list?: (typeof WebChatSupportChannelList.ServiceData)[];
    } | null = null;
    static ServiceData: {
        club_id?: number;
        tribe_id?: number;
        user_id?: number;
        support_user_id?: number;
        user_nickname?: string;
        user_avatar?: string;
        club_name?: string;
        club_logo?: string;
        unread_count?: number;
        im_service_type?: number;
    } | null = null;

    static Request(param: typeof WebChatSupportChannelList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebChatSupportChannelList.ResponseData;
    };
}

export class WebChatSupportMessageList extends WebCommon {
    static API: string = '/api/chat/support/message/list';
    static RequestParams: {
        limit?: number;
        offset?: number;
        tribe_id?: number;
        club_id?: number;
        to_user_id?: number;
        from?: number;
        asc?: boolean;
        set_read?: boolean;
        im_service_type?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebChatSupportMessageList.Data;
    } | null = null;
    static Data: {
        limit?: number;
        offset?: number;
        more?: boolean;
        list?: (typeof WebChatSupportMessageList.ChatData)[];
    } | null = null;
    static ChatData: {
        channel?: string;
        club_id?: number;
        tribe_id?: number;
        user_id?: number;
        support_user_id?: number;
        text?: string;
        url?: string;
        file_name?: string;
        file_size?: number;
        thumb_url?: string;
        duration?: number;
        local_time?: number;
        time_token?: number;
        status?: number;
        msg_type?: number;
        user_send?: boolean;
        sub_type?: number;
        extra?: string;
    } | null = null;
    static MatchRechargeOrder: {
        user_info?: string;
        amount?: number;
        pay_price?: number;
        type_name?: string;
        order_no?: string;
        timestamp?: number;
    } | null = null;
    static MatchWithdrawOrder: {
        user_info?: string;
        amount?: number;
        pay_price?: number;
        type_name?: string;
        order_no?: string;
        timestamp?: number;
        address?: string;
    } | null = null;

    static Request(param: typeof WebChatSupportMessageList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebChatSupportMessageList.ResponseData;
    };
}

export class WebChatSupportMessageRead extends WebCommon {
    static API: string = '/api/chat/support/message/read';
    static RequestParams: {
        club_id?: number;
        to_user_id?: number;
        time_token?: number;
        im_service_type?: number;
    } | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebChatSupportMessageRead.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebChatSupportMessageRead.ResponseData;
    };
}

export class WebChatSupportMessageSend extends WebCommon {
    static API: string = '/api/chat/support/message/send';
    static RequestParams: {
        tribe_id?: number;
        club_id?: number;
        to_user_id?: number;
        msg_type?: number;
        text?: string;
        url?: string;
        file_name?: string;
        file_size?: number;
        thumb_url?: string;
        duration?: number;
        im_service_type?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebChatSupportMessageSend.Data;
    } | null = null;
    static Data: {
        time_token?: number;
    } | null = null;

    static Request(param: typeof WebChatSupportMessageSend.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebChatSupportMessageSend.ResponseData;
    };
}
