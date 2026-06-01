import { WebCommon } from '../WebRequestBase';
import type { WebLogin } from './WebRequestUser';

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

export class WebConfigGlobalConfig extends WebCommon {
    //接口地址
    static API: string = '/api/config/global/config';
    //字段声明
    static RequestParams: {} | null = null;
    static ResponseData: {
        operating_model?: number; //运营模式 1 直营模式 2 公会联盟模式
        recharge_gold?: number; //直营模式下，充豆功能开关 1 开 2 关
        user_special_recharge?: number; //直营模式下 operating_model=1  支桌号功能开关 1 自动充值（平台充值） 2 手动充值（公会充值） ，3 全选
        user_ordinary_recharge?: number; //直营模式下 operating_model=1  普通用户功能开关 1 自动充值（平台充值） 2 手动充值（公会充值） ，3 全选
        normal_room_model?: number; //模式开关
        apple_pay_switch?: number; //苹果支付服务功能开关 1 开 2 关
        user_modify_name_cost?: number; //修改名字花费
        mtt_switch?: number; //MTT功能开关 1 开 2 关
        normal_return_profit_switch?: number; //返水开关屏蔽 1开，2关
        android_mtt_switch?: number; //androidMTT功能开关 1 开 2 关
        android_pay_switch?: number; //android支付功能开关 1 开 2 关
        apple_mtt_switch?: number; //iosMTT功能开关 1 开 2 关
        support_email?: string;
        scoreboard_club_price?: string;
        scoreboard_friend_price?: string;
        user_modify_name_price?: string;
    } | null = null;

    static Request(param: typeof WebLogin.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebConfigGlobalConfig.ResponseData;
    };
}

export class WebConfigMultiLanguageTemplate extends WebCommon {
    //接口地址
    static API: string = '/api/config/multi_language/template';
    //字段声明
    static RequestParams: {} | null = null;
    static ResponseData: {
        template_id: string; //对应房间key
        cn_name: string; //中
        us_name: string; //英
        br_name: string; //葡语
    } | null = null;

    static Request(param: typeof WebConfigMultiLanguageTemplate.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: (typeof WebConfigMultiLanguageTemplate.ResponseData)[];
    };
}

export class WebGetDiamondConfig extends WebCommon {
    static API: string = '/api/config/diamond/config';
    /*request
    --config_type //1 创建牌桌；2 牌桌内加时
    --type_ext // 百位数：创建来源 1 平台，2 联盟，3 公会 4 个人（朋友桌）// 十位数：是否共享牌桌 1 不共享 2 共享 （如果再区分币种，预留 2 USDT桌 3 联盟币）// 个位数：是否比赛 0 不是， 1 是示例：210 （表示联盟创建的内部牌桌）//千位数：0第一次加时，1第二次加时
    */
    /*response data.data
     --id
     --config_type //1 创建牌桌；2 牌桌内加时 3 语音桌 4 人脸识别桌 5 视频桌（全时长)  6 视频桌（随机验证）7 视频桌（麦序）8 延迟看牌
     --status //1 开启； 2 关闭
     --type_ext
     // 千位数：config_type =2  为 0第一次加时，1第二次加时。config_type =8 为 1 PREFLOP 2 FLOP 3 TURN
     // 百位数：创建来源 1 平台，2 联盟，3 公会 4 个人（朋友桌）
     // 十位数：是否共享牌桌 1 不共享 2 共享 （如果再区分币种，预留 2 USDT桌 3 联盟币）
     // 个位数：是否比赛 0 不是， 1 是
     // 示例：210 （表示联盟创建的内部牌桌）       3\4\5\6\7 type_ext为牌桌座位数
     --create_time
     --update_time
     --setting
        --sb //小盲 显示时除以100
        --blind_type //盲注分级 1 微 2 小 3 中 4 大
        --price //原价
        --discount_price //折扣价
    */
}

export class WebConfigBaseConfigCombine extends WebCommon {
    static API: string = '/api/config/base/config/combine';
    static RequestParams: {
        data_types?: number[];
        config_types?: string[];
        last_update_time?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebConfigBaseConfigCombine.Data;
    } | null = null;
    static Data: {
        user_subscriptions?: unknown[];
        user_whitelist_info?: unknown;
    } | null = null;

    static Request(param: typeof WebConfigBaseConfigCombine.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebConfigBaseConfigCombine.ResponseData;
    };
}

export class WebConfigBeforeLoginConfig extends WebCommon {
    static API: string = '/api/config/before/login/config';
    static RequestParams: {
        no_auth_api_list?: number[];
        global_config_req?: typeof WebConfigBeforeLoginConfig.RequestItem;
        small_blind_ante_req?: typeof WebConfigBeforeLoginConfig.RequestItem;
        get_diamond_configs_req?: typeof WebConfigBeforeLoginConfig.RequestItem;
        multi_language_req?: typeof WebConfigBeforeLoginConfig.RequestItem;
        user_subscription_config_req?: typeof WebConfigBeforeLoginConfig.RequestItem;
        popup_list_req?: typeof WebConfigBeforeLoginConfig.RequestItem;
        banner_list_req?: typeof WebConfigBeforeLoginConfig.RequestItem;
        club_subscription_config_list_req?: typeof WebConfigBeforeLoginConfig.RequestItem;
        room_template_list_req?: typeof WebConfigBeforeLoginConfig.RequestItem;
        maintenance_info_req?: typeof WebConfigBeforeLoginConfig.RequestItem;
        chat_shop_prop_price_req?: typeof WebConfigBeforeLoginConfig.RequestItem;
        geme_prop_list_req?: typeof WebConfigBeforeLoginConfig.RequestItem;
        club_level_benefit_req?: typeof WebConfigBeforeLoginConfig.RequestItem;
    } | null = null;
    static ResponseData: {
        data?: unknown;
    } | null = null;
    static RequestItem: {
        last_update_time?: number;
    } | null = null;

    static Request(param: typeof WebConfigBeforeLoginConfig.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebConfigBeforeLoginConfig.ResponseData;
    };
}

export class WebConfigDiamondOrgConfig extends WebCommon {
    static API: string = '/api/config/diamond/org/config';
    static RequestParams: {
        config_type?: number;
        type_ext?: number;
        club_id?: number;
        tribe_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebConfigDiamondOrgConfig.Data;
    } | null = null;
    static Data: {} | null = null;
    static Config: {
        status?: number;
        setting?: (typeof WebConfigDiamondOrgConfig.Setting)[];
        start_time?: number;
        end_time?: number;
    } | null = null;
    static Setting: {
        sb?: number;
        discount?: number;
        record_floor?: number;
        record_ratio?: number;
        decimal_type?: number;
    } | null = null;

    static Request(param: typeof WebConfigDiamondOrgConfig.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebConfigDiamondOrgConfig.ResponseData;
    };
}

export class WebConfigGamePlayTag extends WebCommon {
    static API: string = '/api/config/gameplay/tag';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: (typeof WebConfigGamePlayTag.Data)[];
    } | null = null;
    static Data: {
        id?: number;
        name?: string;
        logo?: string;
        color?: string;
        status?: number;
        delete_status?: number;
    } | null = null;

    static Request(param: typeof WebConfigGamePlayTag.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebConfigGamePlayTag.ResponseData;
    };
}

export class WebConfigGetOnlinePayTypeUserAddress extends WebCommon {
    static API: string = '/api/config/get_online_pay_type_user_address';
    static RequestParams: {
        pay_type_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebConfigGetOnlinePayTypeUserAddress.Data;
    } | null = null;
    static Data: {
        list?: (typeof WebConfigGetOnlinePayTypeUserAddress.WalletInfo)[];
    } | null = null;
    static WalletInfo: {
        id?: number;
        pay_type_id?: number;
        address?: string;
    } | null = null;

    static Request(param: typeof WebConfigGetOnlinePayTypeUserAddress.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebConfigGetOnlinePayTypeUserAddress.ResponseData;
    };
}

export class WebConfigMaintenance extends WebCommon {
    static API: string = '/api/config/maintenance';
    static RequestParams: {} | null = null;
    static ResponseData: {} | null = null;
    static Data: {
        on?: boolean;
        start_time?: number;
        end_time?: number;
        start_time_str?: string;
        end_time_str?: string;
        msg?: string;
    } | null = null;

    static Request(param: typeof WebConfigMaintenance.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebConfigMaintenance.ResponseData;
    };
}

export class WebConfigMaintenanceTf extends WebCommon {
    static API: string = '/api/config/maintenance_tf';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebConfigMaintenanceTf.Data;
    } | null = null;
    static Data: {
        on?: boolean;
        start_time?: number;
        end_time?: number;
        start_time_str?: string;
        end_time_str?: string;
        version?: string;
    } | null = null;

    static Request(param: typeof WebConfigMaintenanceTf.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebConfigMaintenanceTf.ResponseData;
    };
}

export class WebConfigNetworkCheckIp extends WebCommon {
    static API: string = '/api/config/network/checkip';
    static RequestParams: {} | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebConfigNetworkCheckIp.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebConfigNetworkCheckIp.ResponseData;
    };
}

export class WebConfigOnlineWithdrawDescription extends WebCommon {
    static API: string = '/api/config/online_withdraw_description';
    static RequestParams: {
        withdraw_type_id?: number;
        description?: string;
    } | null = null;
    static ResponseData: {
        data?: typeof WebConfigOnlineWithdrawDescription.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebConfigOnlineWithdrawDescription.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebConfigOnlineWithdrawDescription.ResponseData;
    };
}

export class WebConfigOnlineWithdrawTypeList extends WebCommon {
    static API: string = '/api/config/online_withdraw_type_list';
    static RequestParams: {
        club_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebConfigOnlineWithdrawTypeList.Data;
    } | null = null;
    static Data: {
        total?: number;
        list?: (typeof WebConfigOnlineWithdrawTypeList.PayType)[];
    } | null = null;
    static PayType: {
        id?: number;
        name?: string;
        type?: number;
        rate?: number;
        user_description?: string;
        fee_type?: number;
        fee_rate?: number;
        user_withdraw_min?: number;
        user_withdraw_max?: number;
    } | null = null;

    static Request(param: typeof WebConfigOnlineWithdrawTypeList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebConfigOnlineWithdrawTypeList.ResponseData;
    };
}

export class WebConfigRegisterArea extends WebCommon {
    static API: string = '/api/config/register/area';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: (typeof WebConfigRegisterArea.Data)[];
    } | null = null;
    static Data: {
        area?: string;
        country?: string;
    } | null = null;
    static Message: {
        area?: string;
        country?: string;
    } | null = null;

    static Request(param: typeof WebConfigRegisterArea.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebConfigRegisterArea.ResponseData;
    };
}

export class WebConfigUserWhitelistInfo extends WebCommon {
    static API: string = '/api/config/user/whitelist/info';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebConfigUserWhitelistInfo.Data;
    } | null = null;
    static Data: {
        user_whitelist_info?: typeof WebConfigUserWhitelistInfo.UserWhiteListInfo;
    } | null = null;
    static UserWhiteListInfo: {
        cowboy?: number;
        mahjong?: number;
        mahjong_blood_river?: number;
        mahjong_push_down?: number;
        fantasy?: number;
        room_jackpot?: number;
        guandan?: number;
        room_bringin_input?: number;
        room_bringin_equal?: number;
        room_min_chip?: number;
        room_bringin_limit?: number;
        room_random_seat?: number;
        room_force_show_card?: number;
        room_look_hand_card?: number;
        room_check_pool_rate?: number;
        room_only_ios?: number;
        room_calltime?: number;
        room_encrypt_cards?: number;
        room_critical_hit?: number;
        room_random_ante?: number;
        room_limit_hand?: number;
        sng?: number;
        random_enter_unlimit?: number;
    } | null = null;

    static Request(param: typeof WebConfigUserWhitelistInfo.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebConfigUserWhitelistInfo.ResponseData;
    };
}

export class WebConfigWhatsApp extends WebCommon {
    static API: string = '/api/config/whatsapp';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: (typeof WebConfigWhatsApp.Data)[];
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebConfigWhatsApp.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebConfigWhatsApp.ResponseData;
    };
}
