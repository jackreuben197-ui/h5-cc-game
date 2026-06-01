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

export class WebRechargeGold extends WebCommon {
    //接口地址
    static API: string = '/api/order/user/recharge';
    //字段声明
    static RequestParams: {} | null = null;
    static ResponseData: {} | null = null;

    static Request(param: { amount: number }) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRechargeGold.ResponseData;
    };
}

export class WebTiquGold extends WebCommon {
    //接口地址
    static API: string = '/api/order/user/withdraw';
}

export class WebRechargeGoldClub extends WebCommon {
    //接口地址
    static API: string = '/api/order/club/recharge';
    //字段声明
    // static RequestParams: {
    //     amount: number,
    //     gold_type: number // 1 联盟币 2 usdt
    // } = null;
}

export class WebTiquGoldClub extends WebCommon {
    //接口地址
    static API: string = '/api/order/club/withdraw';
    // //字段声明
    // static RequestParams: {
    //     amount: number,
    //     gold_type: number,
    // } = null;
}

export class WebClubFundOrderList extends WebCommon {
    //接口地址
    static API: string = '/api/order/club/order_list';
    //字段声明
    // static RequestParams: {
    //     order_type: number,
    //     limit?: number,
    //     offset?: number
    // } = null;
}

export class WebClubPlayerOrderRecord extends WebCommon {
    public static API: string = '/api/order/user/order_records';
}

export class WebClubPlayerExchange extends WebCommon {
    static API: string = '/api/order/user/exchange';
}

export class WebExchangeRate extends WebCommon {
    public static API: string = '/api/order/club/exchange_rate';
}

export class WebClubFundApplyList extends WebCommon {
    static API: string = '/api/order/club/member_order/list';
}

export class WebClubFundAudit extends WebCommon {
    static API: string = '/api/order/club/audit/member_order';
}

export class WebClubFundExchange extends WebCommon {
    static API: string = '/api/order/club/exchange';
}

export class WebGuildGiveRecyCle extends WebCommon {
    static API: string = '/api/order/club/member/grant';
}

export class WebOrderTribeOrderList extends WebCommon {
    static API: string = '/api/order/tribe/order_list';
    static RequestParams: {
        limit?: number;
        offset?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrderTribeOrderList.Data;
    } | null = null;
    static Data: {
        limit?: number;
        offset?: number;
        total?: number;
        list?: (typeof WebOrderTribeOrderList.ClubInfo)[];
    } | null = null;
    static ClubInfo: {
        club_name?: string;
        club_random_id?: number;
        tribe_name?: string;
        tribe_random_id?: number;
        order_no?: string;
        gold_num?: number;
        club_logo?: string;
        tribe_logo?: string;
        club_subscription_id?: number;
    } | null = null;

    static Request(param: typeof WebOrderTribeOrderList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrderTribeOrderList.ResponseData;
    };
}

export class WebOrderTribeOrderAudit extends WebCommon {
    static API: string = '/api/order/tribe/order/audit';
    static RequestParams: {
        order_no?: string;
        audit_op?: number;
        description?: string;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrderTribeOrderAudit.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebOrderTribeOrderAudit.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrderTribeOrderAudit.ResponseData;
    };
}

export class WebOrderTribeRecharge extends WebCommon {
    static API: string = '/api/order/tribe/recharge';
    static RequestParams: {
        club_id?: number;
        amount?: number;
        gold_type?: number;
        legal_tender?: number;
    } | null = null;
    static ResponseData: {} | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebOrderTribeRecharge.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrderTribeRecharge.ResponseData;
    };
}

export class WebOrderTribeRechargeGold extends WebCommon {
    static API: string = '/api/order/tribe/recharge_gold';
    static RequestParams: {
        price_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrderTribeRechargeGold.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebOrderTribeRechargeGold.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrderTribeRechargeGold.ResponseData;
    };
}

export class WebOrderTribeTransFerDiamondToTribe extends WebCommon {
    static API: string = '/api/order/tribe/transfer_diamond/to_tribe';
    static RequestParams: {
        amount?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrderTribeTransFerDiamondToTribe.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebOrderTribeTransFerDiamondToTribe.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrderTribeTransFerDiamondToTribe.ResponseData;
    };
}

export class WebOrderTribeTransFerDiamondToUser extends WebCommon {
    static API: string = '/api/order/tribe/transfer_diamond/to_user';
    static RequestParams: {
        amount?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrderTribeTransFerDiamondToUser.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebOrderTribeTransFerDiamondToUser.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrderTribeTransFerDiamondToUser.ResponseData;
    };
}

export class WebOrderTribeWithdraw extends WebCommon {
    static API: string = '/api/order/tribe/withdraw';
    static RequestParams: {
        club_id?: number;
        amount?: number;
        gold_type?: number;
        legal_tender?: number;
    } | null = null;
    static ResponseData: {} | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebOrderTribeWithdraw.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrderTribeWithdraw.ResponseData;
    };
}

export class WebOrderUserClubOrderCancel extends WebCommon {
    static API: string = '/api/order/user/club_order/cancel';
    static RequestParams: {
        order_no?: string;
    } | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebOrderUserClubOrderCancel.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrderUserClubOrderCancel.ResponseData;
    };
}

export class WebOrderUserRechargeNo extends WebCommon {
    static API: string = '/api/order/user/recharge_no';
    static RequestParams: {
        amount?: number;
        pay_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrderUserRechargeNo.Data;
    } | null = null;
    static Data: {
        amount?: number;
        used?: boolean;
        price_id?: number;
    } | null = null;

    static Request(param: typeof WebOrderUserRechargeNo.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrderUserRechargeNo.ResponseData;
    };
}

export class WebOrderUserUsdtOrderList extends WebCommon {
    static API: string = '/api/order/user/usdt/order/list';
    static RequestParams: {
        order_no?: string;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrderUserUsdtOrderList.Data;
    } | null = null;
    static Data: {
        list?: (typeof WebOrderUserUsdtOrderList.OrderData)[];
    } | null = null;
    static OrderData: {
        order?: typeof WebOrderUserUsdtOrderList.OrderInfo;
    } | null = null;
    static OrderInfo: {
        status?: number;
    } | null = null;

    static Request(param: typeof WebOrderUserUsdtOrderList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrderUserUsdtOrderList.ResponseData;
    };
}

export class WebOrderUserUsdtRecharge extends WebCommon {
    static API: string = '/api/order/user/usdt/recharge';
    static RequestParams: {
        price_id?: number;
        pay_price?: number;
        pay_id?: number;
        gold_count?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrderUserUsdtRecharge.Data;
    } | null = null;
    static Data: {
        order?: typeof WebOrderUserUsdtRecharge.OrderInfo;
        usdt_address?: typeof WebOrderUserUsdtRecharge.PayInfo;
    } | null = null;
    static PayInfo: {
        address_type?: string;
        address?: string;
        qr_code?: string;
    } | null = null;
    static OrderInfo: {
        gold_num?: number;
        order_no?: string;
        amount?: number;
    } | null = null;

    static Request(param: typeof WebOrderUserUsdtRecharge.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrderUserUsdtRecharge.ResponseData;
    };
}
