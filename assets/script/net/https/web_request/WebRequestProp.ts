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

export class WebPropUserCheckPropInfo extends WebCommon {
    //接口地址
    static API: string = '/api/prop/user/check_prop_info';
    //字段声明
    static RequestParams: {
        prop_id?: number; //道具id
    } | null = null;
    static ResponseData: {
        data: (typeof WebPropUserCheckPropInfo.Data)[];
    } | null = null;
    static Data: {
        is_free_service_charge: number; //是否免服务费
        prop_balance: string; //道具余量
        prop_property_type: number; //1 普通，2 免服务费
        wallet_balance: string; //钱包余额
    } | null = null;

    static Request(param: typeof WebPropUserCheckPropInfo.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebPropUserCheckPropInfo.ResponseData;
    };
}

export class WebRoomCenterMttGetdisCountS extends WebCommon {
    //接口地址
    static API: string = '/api/prop/user_prop/mtt/list';
    //字段声明
    static RequestParams: {} | null = null;
    static ResponseData: {
        data: (typeof WebRoomCenterMttGetdisCountS.Data)[];
    } | null = null;
    static Data: {
        is_free_service_charge: number; //是否免服务费
        prop_balance: string; //道具余量
        prop_property_type: number; //1 普通，2 免服务费
        wallet_balance: string; //钱包余额
    } | null = null;

    static Request(param: typeof WebRoomCenterMttGetdisCountS.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRoomCenterMttGetdisCountS.ResponseData;
    };
}

export class WebPropUserBuyProp extends WebCommon {
    //接口地址
    static API: string = '/api/prop/user/buy_inner_prop';
    //字段声明
    static RequestParams: {
        prop_id?: number; //道具id
        match_id?: number; //比赛id
    } | null = null;
    static ResponseData: {
        data: (typeof WebPropUserBuyProp.Data)[];
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebPropUserBuyProp.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebPropUserBuyProp.ResponseData;
    };
}

export class WebPropTaskList extends WebCommon {
    //接口地址
    static API: string = '/api/prop/task/task_list';
    //字段声明
    // static RequestParams: {
    //     type: number, // 类型ID  任务类型  1；每日任务 2：成就任务
    //     timezone: number, // 时区 0-巴西 1-utc
    //     limit: number,
    //     offset: number,
    // } = null;
}

export class WebBagPendantList extends WebCommon {
    //接口地址
    static API: string = '/api/prop/user_prop/pendant_list';
    //字段声明
    // static RequestParams: {
    //     prop_type: number,
    // } = null;
}

export class WebBagCurrentPendantList extends WebCommon {
    //接口地址
    static API: string = '/api/prop/user_prop/current_pendant_list';
    //字段声明
    // static RequestParams: {
    //     prop_type: number,
    // } = null;
}

export class WebPropUserPropList extends WebCommon {
    //接口地址
    static API: string = '/api/prop/user_prop/list';
    //字段声明
    // static RequestParams: {
    //     prop_type: number,//道具类型(prop_type):0-全部;1-mtt门票，2-实物，3-电话卡，4-购物卡，5-代金卷 6-线下门票 7-免服务费代金券 8-充值代金券 9-金豆券 10-一元购活动券 11-道具代替劵
    //     limit: number,//条目
    //     offset: number,//开始下标。例子（offset=0，limit=10，0-9。）
    // } = null;
    // static ResponseData: {
    // } = null;
}

export class WebBagpandantup extends WebCommon {
    //接口地址
    static API: string = '/api/prop/user_prop/pendant_up';
    //字段声明
    // static RequestParams: {
    //     prop_id: number, //道具id
    // } = null;
    // static ResponseData: {
    // } = null;
}

export class WebBagpAndantDown extends WebCommon {
    //接口地址
    static API: string = '/api/prop/user_prop/pendant_down';
    //字段声明
    // static RequestParams: {
    //     prop_id: number, //道具id
    // } = null;
    // static ResponseData: {
    // } = null;
}

export class WebPropTaskReceIve extends WebCommon {
    //接口地址
    static API: string = '/api/prop/task/task_receive';
    //字段声明
    // static RequestParams: {
    //     task_id: number,
    //     timezone: number,
    // } = null;
    // static ResponseData: {
    // } = null;
}

export class WebMallShopList extends WebCommon {
    static API: string = '/api/prop/shopping/goods_list';
}

export class WebPropUserPropUsed extends WebCommon {
    static API: string = '/api/prop/user_prop/used';
}

export class WebMallBuy extends WebCommon {
    static API: string = '/api/prop/shopping/goods_buy';
}

export class WebShareUsable extends WebCommon {
    static API: string = '/api/prop/share/usable';
}

export class WebPropBuy extends WebCommon {
    static API: string = '/api/prop/buy';
    static RequestParams: {
        prop_id?: number;
        valid_date?: number;
        pay_price?: number;
        count?: number;
        fram_mall?: boolean;
    } | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebPropBuy.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebPropBuy.ResponseData;
    };
}

export class WebPropChatPropList extends WebCommon {
    static API: string = '/api/prop/chat/prop/list';
    static RequestParams: {
        limit?: number;
        offset?: number;
        prop_type?: number;
        prop_types?: number[];
        user_type?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebPropChatPropList.Data;
    } | null = null;
    static Data: {
        list?: (typeof WebPropChatPropList.LableData)[];
    } | null = null;
    static LableData: {
        prop_id?: number;
        prop_type?: number;
        price_id?: number;
        prop_code?: string;
        raw_price?: number;
        pay_price?: number;
        start_time?: number;
        end_time?: number;
        subscription_name?: string;
        prop_amount?: number;
        game_prop_id?: number;
    } | null = null;

    static Request(param: typeof WebPropChatPropList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebPropChatPropList.ResponseData;
    };
}

export class WebPropChatPropUsed extends WebCommon {
    static API: string = '/api/prop/chat/prop/used';
    static RequestParams: {
        list?: (typeof WebPropChatPropUsed.Prop)[];
    } | null = null;
    static ResponseData: {} | null = null;
    static Prop: {} | null = null;

    static Request(param: typeof WebPropChatPropUsed.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebPropChatPropUsed.ResponseData;
    };
}

export class WebPropGoldPriceList extends WebCommon {
    static API: string = '/api/prop/gold/price/list';
    static RequestParams: {
        source_type?: number;
        club_id?: number;
        gold_types?: number[];
    } | null = null;
    static ResponseData: {
        data?: typeof WebPropGoldPriceList.Data;
    } | null = null;
    static Data: {
        limit?: number;
        offset?: number;
        total?: number;
        list?: (typeof WebPropGoldPriceList.GoldInfo)[];
        pay_types?: (typeof WebPropGoldPriceList.PayType)[];
    } | null = null;
    static GoldInfo: {
        gold_count?: number;
        pay_price?: number;
        id?: number;
        trader_type?: unknown;
        give_gold_count?: number;
    } | null = null;
    static PayType: {
        id?: number;
        name?: string;
        image?: string;
        rate?: number;
        discount?: number;
        type?: number;
        fee_type?: number;
        fee_rate?: number;
        user_recharge_min?: number;
        user_recharge_max?: number;
        increase_interval?: number;
        price_list?: (typeof WebPropGoldPriceList.GoldInfo)[];
        wallet_addresses?: unknown[];
    } | null = null;

    static Request(param: typeof WebPropGoldPriceList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebPropGoldPriceList.ResponseData;
    };
}

export class WebPropList extends WebCommon {
    static API: string = '/api/prop/list';
    static RequestParams: {
        limit?: number;
        offset?: number;
        prop_type?: number;
        prop_type_category?: number[];
        has_bag_info?: boolean;
        game_type?: number[];
    } | null = null;
    static ResponseData: {
        data?: typeof WebPropList.Data;
    } | null = null;
    static Data: {
        limit?: number;
        offset?: number;
        total?: number;
        category?: (typeof WebPropList.Category)[];
        list?: (typeof WebPropList.Prop)[];
    } | null = null;
    static Category: {
        id?: number;
        name?: string;
    } | null = null;
    static Prop: {
        id?: number;
        prop_name?: string;
        prop_icon?: string;
        price?: (typeof WebPropList.Price)[];
        prop_type_category?: number;
        special_effect_code?: string;
        prop_amount?: number;
        expired_time?: number;
        subscription_status?: number;
        subscription_ids?: number[];
        prop_property_type?: number;
        subscription_name?: string;
    } | null = null;
    static Price: {
        raw_price?: number;
        pay_price?: number;
        valid_date?: number;
    } | null = null;

    static Request(param: typeof WebPropList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebPropList.ResponseData;
    };
}

export class WebPropMallGoodsBuy extends WebCommon {
    static API: string = '/api/prop/mall/goods/buy';
    static RequestParams: {
        goods_id?: number;
        days?: number;
        count?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebPropMallGoodsBuy.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebPropMallGoodsBuy.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebPropMallGoodsBuy.ResponseData;
    };
}

export class WebPropMallGoodsDetail extends WebCommon {
    static API: string = '/api/prop/mall/goods/detail';
    static RequestParams: {
        goods_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebPropMallGoodsDetail.Data;
    } | null = null;
    static Data: {
        detail?: typeof WebPropMallGoodsDetail.Goods;
        items?: (typeof WebPropMallGoodsDetail.Item)[];
    } | null = null;
    static Goods: {
        id?: number;
        banner_picture?: string;
        price?: (typeof WebPropMallGoodsDetail.Price)[];
    } | null = null;
    static Item: {
        prop_type?: number;
        id?: number;
        chat_prop_id?: number;
        subscription_ids?: number[];
        special_effect_code?: string;
        num?: number;
        valid_date?: number;
        prop_icon?: string;
        chat_prop_code?: string;
    } | null = null;
    static Price: {
        raw_price?: number;
        pay_price?: number;
        valid_date?: number;
    } | null = null;

    static Request(param: typeof WebPropMallGoodsDetail.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebPropMallGoodsDetail.ResponseData;
    };
}

export class WebPropMallGoodsList extends WebCommon {
    static API: string = '/api/prop/mall/goods/list';
    static RequestParams: {
        goods_type?: number;
        recommend?: number;
        limit?: number;
        offset?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebPropMallGoodsList.Data;
    } | null = null;
    static Data: {
        limit?: number;
        offset?: number;
        total?: number;
        list?: (typeof WebPropMallGoodsList.Goods)[];
    } | null = null;
    static Goods: {
        id?: number;
        banner_picture?: string;
        name?: string;
        goods_type?: number;
        price?: (typeof WebPropMallGoodsList.Price)[];
        subscription_status?: number;
    } | null = null;
    static Price: {
        raw_price?: number;
        pay_price?: number;
    } | null = null;

    static Request(param: typeof WebPropMallGoodsList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebPropMallGoodsList.ResponseData;
    };
}

export class WebPropMallPrettyIdBuy extends WebCommon {
    static API: string = '/api/prop/mall/pretty_id/buy';
    static RequestParams: {
        goods_id?: number;
        club_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebPropMallPrettyIdBuy.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebPropMallPrettyIdBuy.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebPropMallPrettyIdBuy.ResponseData;
    };
}

export class WebPropMallPrettyIdList extends WebCommon {
    static API: string = '/api/prop/mall/pretty_id/list';
    static RequestParams: {
        pretty_type?: number;
        limit?: number;
        offset?: number;
        length_type?: number;
        search?: string;
    } | null = null;
    static ResponseData: {
        data?: typeof WebPropMallPrettyIdList.Data;
    } | null = null;
    static Data: {
        list?: (typeof WebPropMallPrettyIdList.Info)[];
        limit?: number;
        offset?: number;
        total?: number;
    } | null = null;
    static Info: {
        id?: number;
        pretty_id?: number;
        pay_price?: number;
    } | null = null;

    static Request(param: typeof WebPropMallPrettyIdList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebPropMallPrettyIdList.ResponseData;
    };
}

export class WebPropMallPrettyIdTotal extends WebCommon {
    static API: string = '/api/prop/mall/pretty_id/total';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebPropMallPrettyIdTotal.Data;
    } | null = null;
    static Data: {
        list?: (typeof WebPropMallPrettyIdTotal.Item)[];
    } | null = null;
    static Item: {
        length_type?: number;
    } | null = null;

    static Request(param: typeof WebPropMallPrettyIdTotal.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebPropMallPrettyIdTotal.ResponseData;
    };
}

export class WebPropShareContEnt extends WebCommon {
    static API: string = '/api/prop/share/content';
    static RequestParams: {
        entry_type?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebPropShareContEnt.Data;
    } | null = null;
    static Data: {
        url?: string;
        type?: string;
    } | null = null;

    static Request(param: typeof WebPropShareContEnt.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebPropShareContEnt.ResponseData;
    };
}

export class WebPropShareDone extends WebCommon {
    static API: string = '/api/prop/share/done';
    static RequestParams: {
        entry_type?: number;
    } | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebPropShareDone.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebPropShareDone.ResponseData;
    };
}

export class WebPropShopPingAppleVerifyReceIpt extends WebCommon {
    static API: string = '/api/prop/shopping/apple/verifyreceipt';
    static RequestParams: {
        receipt_data?: string;
        order_id?: string;
        transaction_id?: string;
    } | null = null;
    static ResponseData: {
        data?: typeof WebPropShopPingAppleVerifyReceIpt.Data;
    } | null = null;
    static Data: {
        data?: boolean;
    } | null = null;

    static Request(param: typeof WebPropShopPingAppleVerifyReceIpt.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebPropShopPingAppleVerifyReceIpt.ResponseData;
    };
}

export class WebPropShopPingGoogleVerifyOrder extends WebCommon {
    static API: string = '/api/prop/shopping/google/verifyorder';
    static RequestParams: {
        product_id?: string;
        order_id?: string;
        purchase_token?: string;
    } | null = null;
    static ResponseData: {
        data?: typeof WebPropShopPingGoogleVerifyOrder.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebPropShopPingGoogleVerifyOrder.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebPropShopPingGoogleVerifyOrder.ResponseData;
    };
}

export class WebPropSignInActivityDetail extends WebCommon {
    static API: string = '/api/prop/sign_in/activity/detail';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebPropSignInActivityDetail.Data;
    } | null = null;
    static Data: {
        sign_in_activity?: typeof WebPropSignInActivityDetail.SignInActivity;
        user_sign_in_log?: (typeof WebPropSignInActivityDetail.UserSignInLog)[];
    } | null = null;
    static UserSignInLog: {
        activity_id?: number;
        activity_day?: number;
        sign_in_day?: number;
        sign_in_time?: number;
        user_sign_in_status?: unknown;
    } | null = null;
    static SignInActivity: {} | null = null;
    static ActivityDetail: {} | null = null;
    static Prop: {
        prop_name?: string;
        quantity?: number;
        prop_icon?: string;
        multi_lang_names_obj?: unknown;
    } | null = null;

    static Request(param: typeof WebPropSignInActivityDetail.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebPropSignInActivityDetail.ResponseData;
    };
}

export class WebPropSignInActivitySignIn extends WebCommon {
    static API: string = '/api/prop/sign_in/activity/sign_in';
    static RequestParams: {
        activity_id?: number;
        activity_day?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebPropSignInActivitySignIn.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebPropSignInActivitySignIn.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebPropSignInActivitySignIn.ResponseData;
    };
}

export class WebPropTestSignInActivityReset extends WebCommon {
    static API: string = '/api/prop/test/sign_in/activity/reset';
    static RequestParams: {
        activity_id?: number;
        begin_date?: string;
        signin_day?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebPropTestSignInActivityReset.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebPropTestSignInActivityReset.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebPropTestSignInActivityReset.ResponseData;
    };
}

export class WebPropTribeGoldPriceList extends WebCommon {
    static API: string = '/api/prop/tribe_gold/price/list';
    static RequestParams: {
        limit?: number;
        offset?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebPropTribeGoldPriceList.Data;
    } | null = null;
    static Data: {
        list?: (typeof WebPropTribeGoldPriceList.Info)[];
        total?: number;
        limit?: number;
        offset?: number;
    } | null = null;
    static Info: {
        price_id?: number;
        gold_count?: number;
        raw_price?: number;
        pay_price?: number;
    } | null = null;

    static Request(param: typeof WebPropTribeGoldPriceList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebPropTribeGoldPriceList.ResponseData;
    };
}

export class WebPropUserPropGroupList extends WebCommon {
    static API: string = '/api/prop/user_prop/group/list';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebPropUserPropGroupList.Data;
    } | null = null;
    static Data: {} | null = null;
    static PropInfo: {
        prop_type?: number;
        bag_num?: number;
    } | null = null;

    static Request(param: typeof WebPropUserPropGroupList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebPropUserPropGroupList.ResponseData;
    };
}

export class WebPropUserOfflInetIckets extends WebCommon {
    static API: string = '/api/prop/user/offline_tickets';
    static RequestParams: {
        prop_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebPropUserOfflInetIckets.Data;
    } | null = null;
    static Data: {
        prop_name?: string;
        offline_tickets?: typeof WebPropUserOfflInetIckets.Offline_tickets_Datails;
    } | null = null;
    static Offline_tickets_Datails: {
        google_addr?: string;
        waze_addr?: string;
        site?: string;
        area?: string;
        phone?: string;
        entry_certificate?: typeof WebPropUserOfflInetIckets.Entry_certificate;
        announcements?: string;
        sectional_seat_list?: (typeof WebPropUserOfflInetIckets.Sectional_seat)[];
    } | null = null;
    static Entry_certificate: {
        cpf?: boolean;
        id?: boolean;
        phone_num?: boolean;
    } | null = null;
    static Sectional_seat: {
        id?: number;
        sectional?: string;
        seat?: number;
        use_seat?: number;
        start_time?: string;
        enter_time?: string;
    } | null = null;

    static Request(param: typeof WebPropUserOfflInetIckets.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebPropUserOfflInetIckets.ResponseData;
    };
}

export class WebPropUserOfflInetIcketsGain extends WebCommon {
    static API: string = '/api/prop/user/offline_tickets/gain';
    static RequestParams: {
        prop_id?: number;
        sectional_seat_id?: number;
        certificate_type?: number;
        certificate?: string;
    } | null = null;
    static ResponseData: {
        data?: typeof WebPropUserOfflInetIcketsGain.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebPropUserOfflInetIcketsGain.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebPropUserOfflInetIcketsGain.ResponseData;
    };
}

export class WebPropUserOfflInetIcketsTransFer extends WebCommon {
    static API: string = '/api/prop/user/offline_tickets/transfer';
    static RequestParams: {
        prop_id?: number;
        transfer_user_random_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebPropUserOfflInetIcketsTransFer.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebPropUserOfflInetIcketsTransFer.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebPropUserOfflInetIcketsTransFer.ResponseData;
    };
}

export class WebPropUserPropInfo extends WebCommon {
    static API: string = '/api/prop/user/prop_info';
    static RequestParams: {
        prop_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebPropUserPropInfo.Data;
    } | null = null;
    static Data: {
        info?: typeof WebPropUserPropInfo.Info;
        prop_amount?: number;
    } | null = null;
    static Info: {
        prop_name?: string;
    } | null = null;

    static Request(param: typeof WebPropUserPropInfo.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebPropUserPropInfo.ResponseData;
    };
}

export class WebPropWheelLottEry extends WebCommon {
    static API: string = '/api/prop/wheel/lottery';
    static RequestParams: {
        wheel_template_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebPropWheelLottEry.Data;
    } | null = null;
    static Data: {
        win_prop?: typeof WebPropWheelLottEry.PropInfo;
    } | null = null;
    static PropInfo: {
        prop_type?: number;
    } | null = null;

    static Request(param: typeof WebPropWheelLottEry.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebPropWheelLottEry.ResponseData;
    };
}

export class WebPropWheelLottEryList extends WebCommon {
    static API: string = '/api/prop/wheel/lottery/list';
    static RequestParams: {
        wheel_template_id?: number;
        scope_type?: number;
        limit?: number;
        offset?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebPropWheelLottEryList.Data;
    } | null = null;
    static Data: {
        list?: (typeof WebPropWheelLottEryList.Record)[];
        limit?: number;
        offset?: number;
        total?: number;
        isDirty?: boolean;
    } | null = null;
    static Record: {
        user_name?: string;
        u_random_id?: number;
        id?: number;
        wheel_template_id?: number;
        avatar?: string;
        prop_type?: number;
        create_time?: string;
    } | null = null;

    static Request(param: typeof WebPropWheelLottEryList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebPropWheelLottEryList.ResponseData;
    };
}

export class WebPropWheelUserHandNum extends WebCommon {
    static API: string = '/api/prop/wheel/user/handnum';
    static RequestParams: {
        wheel_template_id?: number;
        club_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebPropWheelUserHandNum.Data;
    } | null = null;
    static Data: {
        hand_num?: number;
        participate_state?: number;
        wheel_template?: typeof WebPropWheelUserHandNum.TemplateInfo;
    } | null = null;
    static TemplateInfo: {
        id?: number;
        club_id?: number;
        tribe_id?: number;
        status?: number;
        reset_type?: number;
        all_room_template?: number;
        all_manual_room?: number;
        name?: string;
        lottery_hande_num?: number;
        start_time?: number;
        end_time?: number;
        wheel_props?: (typeof WebPropWheelUserHandNum.RewardData)[];
    } | null = null;
    static RewardData: {
        prop_type?: number;
        prop_icon?: string;
        prop_value?: number;
    } | null = null;

    static Request(param: typeof WebPropWheelUserHandNum.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebPropWheelUserHandNum.ResponseData;
    };
}
