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

export class WebLogin extends WebCommon {
    //接口地址
    static API: string = '/api/user/login';
    //字段声明
    // static RequestParams: {
    //     code?: string,        // 验证码
    //     email?: string,        // 邮箱
    //     phone?: string,        // 手机号
    //     password?: string,        // 密码MD5
    //     area?: string,        // 区号ProtocolCode
    //     device_id?: string,        // 设备唯一id
    //     mac_addr?: string,        // mac地址
    //     is_simulator?: boolean,        // 是否是模拟器
    //     simulator_name?: string,        // 模拟器名称
    //     system_version?: string,        // 系统版本号
    //     user_device_no?: string,        // 设备机型
    // } = null;
    // static ResponseData: {
    //     token?: string,        // 手机号
    //     expire_at?: number,        // 密码MD5
    // } = null;
}

export class WebLoginThirdParty extends WebCommon {
    static API: string = '/api/user/login_third_party';
    // static RequestParams: {
    //     token: string,
    //     source: string,
    //     app_source: number
    // } = null;
    // static ResponseData: {
    //     token?: string,        // 手机号
    //     expire_at?: number,        // 密码MD5
    // } = null;
}

export class WebRefreshToken extends WebCommon {
    //接口地址
    static API: string = '/api/user/refresh';
    //字段声明
    static RequestParams: {} | null = null;
    static ResponseData: {
        token?: string; // 手机号
        expire_at?: number; // 密码MD5
    } | null = null;

    static Request(param: typeof WebRefreshToken.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebRefreshToken.ResponseData;
    };
}

export class WebUserCheckPhone extends WebCommon {
    //接口地址
    static API: string = '/api/user/check_phone';
    //字段声明
    static RequestParams: {
        phone?: string; // 手机号码
        area?: string; // 国家代号
        email?: string; // 邮箱
    } | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebUserCheckPhone.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserCheckPhone.ResponseData;
    };
}

export class WebUserSendCode extends WebCommon {
    //接口地址
    static API: string = '/api/user/sendcode';
    //字段声明
    static RequestParams: {
        phone?: string; // 手机号码
        area?: string; // 国家代号
    } | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebUserSendCode.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserSendCode.ResponseData;
    };
}

export class WebUserModifyPassword extends WebCommon {
    //接口地址
    static API: string = '/api/user/modify/password';
    //字段声明
    static RequestParams: {
        email?: string;
        phone?: string; // 手机号码
        password?: string; // 密码
        area?: string; // 国家代号
        code?: string; // 验证码
    } | null = null;
    static ResponseData: {
        user_id?: number;
        s?: any;
    } | null = null;

    static Request(param: typeof WebUserModifyPassword.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserModifyPassword.ResponseData;
    };
}

export class WebUserModifyUserInfo extends WebCommon {
    //接口地址
    static API: string = '/api/user/modify/user_info';
    //字段声明
    static RequestParams: {
        sex?: number; // 性别
        nick_name?: string; // 名字
        avatar?: string; // 头像
    } | null = null;
    static ResponseData: {
        data?: typeof WebUserModifyUserInfo.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebUserModifyUserInfo.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserModifyUserInfo.ResponseData;
    };
}

export class WebUserCheckNickname extends WebCommon {
    //接口地址
    static API: string = '/api/user/check_nickname';
    //字段声明
    static RequestParams: {
        nickname?: string; // 名字
    } | null = null;
    static ResponseData: {
        data?: typeof WebUserModifyUserInfo.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebUserCheckNickname.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserCheckNickname.ResponseData;
    };
}

export class WebUserRegister extends WebCommon {
    //接口地址
    static API: string = '/api/user/register';
    //字段声明
    static RequestParams: {
        phone?: string; // 手机号码
        password?: string; // 密码
        area?: string; // 国家代号
        code?: string; // 验证码
        email?: string;
        platform?: number; //平台(platform):1-IOS 2-Android 3-Windows 4-OSX 5-Web 6-MiniWeb 7-Linux
    } | null = null;
    static ResponseData: {
        userId: number; // 用户id
    } | null = null;

    static Request(param: typeof WebUserRegister.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserRegister.ResponseData;
    };
}

export class WebOtherUserInfo extends WebCommon {
    //接口地址
    static API: string = '/api/user/{id}/info';
    static CacheEnabled: boolean = true;
    static CacheNoRequestTTL: number = 24 * 60 * 60 * 1000;
    static CacheDataTTL: number = 24 * 60 * 60 * 1000;
    //字段声明
    static RequestParams: {} | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebOtherUserInfo.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: (typeof WebOtherUserInfo.ResponseData)[];
    };
}

export class WebUserInfo extends WebCommon {
    //接口地址
    static API: string = '/api/user/info';
    static RequestParams: {} | null = null;
    static ResponseData: {
        user?: typeof WebUserInfo.UserInfo; // 用户信息
    } | null = null;
    static UserInfo: {
        area?: string; //手机号地区 例子：+86
        phone?: string; //手机号
        forbid?: number; //0禁止登陆; 1正常登录
        gold?: number; //金豆
        gold_lock?: number; //被锁金豆
        wallet_status?: number; //钱包状态
        un_id?: number; //玩家随机id
        nickname?: string; //名字
        avatar?: string; //头像
        sex?: number; //性别
        birthday?: string; //生日
        country?: string; //国家
        city?: string; //城市
        province?: string; //省会
        mnt?: number; //修改用户[名称]次数
        mat?: number; //修改用户[头像]次数
        ut?: number; //1 普通用户; 2 支桌号; 3 牌局机器人; 4 牛仔机器人
        forbid_withdraw_gold?: number; //提现冻结，1 开启，2 关闭
        forbid_bring_in?: number; //带入冻结，1 开启，2 关闭
        user_id?: number;
        club_id?: number;
        p_u_id?: number;
    } | null = null;

    static Request(param: typeof WebLogin.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserInfo.ResponseData;
    };
}

export class WebChannel extends WebCommon {
    //接口地址
    static API: string = '/api/user/channel';
    //字段声明
    static RequestParams: {} | null = null;
    static ResponseData: {
        port?: number; // socket port
    } | null = null;

    static Request(param: typeof WebLogin.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebChannel.ResponseData;
    };
}

export class WebWs extends WebCommon {
    //接口地址
    static API: string = '/api/user/ws';
    //字段声明
    static RequestParams: {} | null = null;
    static ResponseData: {
        port?: number; // websocket port
    } | null = null;

    static Request(param: typeof WebWs.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebWs.ResponseData;
    };
}

export class WebGoldChangeInsureLog {
    static API: string = '/api/user/gold_insure_change_log';
}

//! 获取玩家房间列表：api/roomcenter/user/rooms/list
export class API_User_Rooms_List extends WebCommon {
    static API: string = '/api/roomcenter/user/rooms/list';
}

export class API_User_Rooms_ids extends WebCommon {
    static API: string = '/api/roomcenter/user/all/room/ids';
}

export class WebUserRoom extends WebCommon {
    //接口地址
    static API: string = '/api/user/room/{id}';
    /*
                "data": {
                    "last_bring_out": {
                        "to_wallet": 0, // 金豆
                        "fee": 0, // 服务费
                        "club_id": 0, // 工会ID
                        "gold_type": 0 // 钱包类型 1:gold(联盟币)  2 usdt
                    },
                    "wallet": [
                        {
                            "w_u_id": 0, // 用户id
                            "club_id": 0, // 工会ID
                            "tribe_id": 0, // 联盟ID
                            "gold": 0, // 金豆
                            "gold_lock": 0,// 锁定金豆
                            "wallet_status": 0, // 状态(1-正常,2-停用, 3提现中)
                            "gold_type": 0, // 钱包类型 1:gold(联盟币)  2 usdt
                            "gold_currency": "", // 币种三字码
                            "club_random_id": 929776, // 公会随机ID
                            "club_name": "峨眉派" // 公会名称
                        }
                    ]
                }
    */
}

export class WebUserRoomSettleDetail extends WebCommon {
    //接口地址
    static API: string = '/api/user/room_settle/detail/{id}';
    //字段声明
    // static RequestParams: {
    // } = null;
    // static ResponseData: {
    //     list: typeof WebUserRoomSettleDetail.UsersInfo[],
    //     self_settle: typeof WebUserRoomSettleDetail.SelfSettle
    // } = null;
    // static SelfSettle:
    //     {
    //         user_random_id: number,
    //         nick_name: string,//昵称
    //         avatar: string,//头像
    //         user_hand_num: number,//手数
    //         bring_in: number,//带入
    //         bring_out: number,//带出
    //     } | null = null;
    // static UsersInfo:
    //     {
    //         user_random_id: number,//user id
    //         nick_name: string,//昵称
    //         avatar: string,//头像
    //         user_hand_num: number,//手数
    //         bring_in: number,//带入
    //         bring_out: number,//带出
    //     }
}

export class WebIsPhoneUser extends WebCommon {
    //接口地址
    static API: string = '/api/user/isPhoneUser';
}

export class WebGoldChangeLogApi extends WebCommon {
    //接口地址
    static API: string = '/api/user/gold_change/log';
}

export class WebSendEmailCode extends WebCommon {
    public static API: string = '/api/user/send_email_code';
    //字段声明
    // public static RequestParams: {
    //     lang: number,
    //     email: string,
    // } = null;
}

export class WebEmailExist extends WebCommon {
    public static API: string = '/api/user/check_email';
    //字段声明
    // public static RequestParams: {
    //     email: string,
    // } = null;
}

export class WebGetBlindStatus extends WebCommon {
    public static API: string = '/api/user/bind_status';
}

export class WebBindEmail extends WebCommon {
    public static API: string = '/api/user/bind_email';
    //字段声明
    // public static RequestParams: {
    //     email: string,
    //     code: string,
    //     password: string,
    // } = null;
}

export class WebBindPhone extends WebCommon {
    public static API: string = '/api/user/bind_phone';
    //字段声明
    // public static RequestParams: {
    //     phone: string,
    //     code: string,
    //     area: string,
    //     password: string,
    // } = null;
}

export class WebBindThrid extends WebCommon {
    public static API: string = '/api/user/bind_third_party';
}

export class WebUserDiamondsWallet extends WebCommon {
    static API: string = '/api/user/user_diamonds_wallet';
}

export class WebWalletTotal extends WebCommon {
    static API: string = '/api/user/wallet_total';
}

export class WebUserRoomBringin extends WebCommon {
    static API: string = '/api/user/room/bringin/{id}';
}

export class WebUserDelete extends WebCommon {
    static API: string = '/api/user/delete';
}

export class WebUserActionRemaind extends WebCommon {
    static API: string = '/api/user/action/remaind';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebUserActionRemaind.Data;
    } | null = null;
    static Data: {
        addtime_free_count?: number;
    } | null = null;

    static Request(param: typeof WebUserActionRemaind.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserActionRemaind.ResponseData;
    };
}

export class WebUserAgentDiamondsGrant extends WebCommon {
    static API: string = '/api/user/agent/diamonds/grant';
    static RequestParams: {
        amount?: number;
        user_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebUserAgentDiamondsGrant.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebUserAgentDiamondsGrant.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserAgentDiamondsGrant.ResponseData;
    };
}

export class WebUserAgentGoldGrant extends WebCommon {
    static API: string = '/api/user/agent/gold/grant';
    static RequestParams: {
        user_id?: number;
        amount?: number;
        op_type?: number;
        legal_tender?: number;
    } | null = null;
    static ResponseData: {} | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebUserAgentGoldGrant.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserAgentGoldGrant.ResponseData;
    };
}

export class WebUserBuysubScriptIon extends WebCommon {
    static API: string = '/api/user/buy_subscription';
    static RequestParams: {
        subscription_id?: number;
        price_type?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebUserBuysubScriptIon.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebUserBuysubScriptIon.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserBuysubScriptIon.ResponseData;
    };
}

export class WebUserClubCreaTorGrant extends WebCommon {
    static API: string = '/api/user/club/creator/grant';
    static RequestParams: {
        amount?: number;
        user_ids?: number[];
    } | null = null;
    static ResponseData: {
        data?: typeof WebUserClubCreaTorGrant.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebUserClubCreaTorGrant.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserClubCreaTorGrant.ResponseData;
    };
}

export class WebUserDelayRoomAuditSwitchUpdate extends WebCommon {
    static API: string = '/api/user/delay_room_audit_switch/update';
    static RequestParams: {
        delay_room_audit_switch?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebUserDelayRoomAuditSwitchUpdate.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebUserDelayRoomAuditSwitchUpdate.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserDelayRoomAuditSwitchUpdate.ResponseData;
    };
}

export class WebUserDiamondRelation extends WebCommon {
    static API: string = '/api/user/diamond/relation';
    static RequestParams: {
        limit?: number;
        offset?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebUserDiamondRelation.Data;
    } | null = null;
    static Data: {
        list?: (typeof WebUserDiamondRelation.GiveData)[];
    } | null = null;
    static GiveData: {
        nick_name?: string;
        remark_name?: string;
        avatar?: string;
        random_num?: number;
    } | null = null;

    static Request(param: typeof WebUserDiamondRelation.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserDiamondRelation.ResponseData;
    };
}

export class WebUserDiamondSend extends WebCommon {
    static API: string = '/api/user/diamond/send';
    static RequestParams: {
        target_user_id?: number;
        send_type?: number;
        amount?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebUserDiamondSend.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebUserDiamondSend.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserDiamondSend.ResponseData;
    };
}

export class WebUserExtraStatusUpdate extends WebCommon {
    static API: string = '/api/user/extra_status/update';
    static RequestParams: {
        key?: string;
        value?: number;
    } | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebUserExtraStatusUpdate.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserExtraStatusUpdate.ResponseData;
    };
}

export class WebUserFreeZePublicList extends WebCommon {
    static API: string = '/api/user/freeze/public/list';
    static RequestParams: {
        limit?: number;
        offset?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebUserFreeZePublicList.Data;
    } | null = null;
    static Data: {
        limit?: number;
        offset?: number;
        list?: (typeof WebUserFreeZePublicList.Record)[];
    } | null = null;
    static Record: {
        create_time?: string;
        user_random_id?: number;
        user_nick_name?: string;
        user_avatar?: string;
    } | null = null;

    static Request(param: typeof WebUserFreeZePublicList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserFreeZePublicList.ResponseData;
    };
}

export class WebUserGetaVatars extends WebCommon {
    static API: string = '/api/user/get_avatars';
    static RequestParams: {
        sex?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebUserGetaVatars.Data;
    } | null = null;
    static Data: {
        list?: (typeof WebUserGetaVatars.Avatar)[];
    } | null = null;
    static Avatar: {
        url?: string;
        avatar_type?: number;
    } | null = null;

    static Request(param: typeof WebUserGetaVatars.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserGetaVatars.ResponseData;
    };
}

export class WebUserGradeDetail extends WebCommon {
    static API: string = '/api/user/grade_detail';
    static RequestParams: {
        user_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebUserGradeDetail.Data;
    } | null = null;
    static Data: {
        online_time_chart_data?: typeof WebUserGradeDetail.OnlineTimeChartData;
        hand_number_chart_data?: typeof WebUserGradeDetail.HandNumberChartData;
        recharge_amount_chart_data?: typeof WebUserGradeDetail.RechargeAmountChartData;
        game_type_pie_chart?: (typeof WebUserGradeDetail.GameTypeData)[];
        online_time_hourly_chart?: (typeof WebUserGradeDetail.OnlineTimeHourlyData)[];
    } | null = null;
    static OnlineTimeChartData: {
        user_data?: (typeof WebUserGradeDetail.OnlineTimeData)[];
        club_average_data?: (typeof WebUserGradeDetail.OnlineTimeData)[];
    } | null = null;
    static OnlineTimeData: {
        date?: string;
        online_time_daily?: number;
    } | null = null;
    static HandNumberChartData: {
        user_data?: (typeof WebUserGradeDetail.HandNumberData)[];
        club_average_data?: (typeof WebUserGradeDetail.HandNumberData)[];
    } | null = null;
    static HandNumberData: {
        date?: string;
        hand_number_daily?: number;
    } | null = null;
    static RechargeAmountChartData: {
        user_data?: (typeof WebUserGradeDetail.RechargeAmountData)[];
        club_average_data?: (typeof WebUserGradeDetail.RechargeAmountData)[];
    } | null = null;
    static RechargeAmountData: {
        date?: string;
        recharge_amount_daily?: number;
    } | null = null;
    static GameTypeData: {
        game_name?: string;
        hand_count?: number;
        blind_levels?: (typeof WebUserGradeDetail.BlindLevels)[];
    } | null = null;
    static BlindLevels: {
        blind_level?: number;
        hand_count?: number;
    } | null = null;
    static OnlineTimeHourlyData: {
        hour?: number;
        online_time?: number;
    } | null = null;

    static Request(param: typeof WebUserGradeDetail.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserGradeDetail.ResponseData;
    };
}

export class WebUserGs extends WebCommon {
    static API: string = '/api/user/gs';
    static RequestParams: {} | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebUserGs.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserGs.ResponseData;
    };
}

export class WebUserGuestLogin2 extends WebCommon {
    static API: string = '/api/user/guest/login2';
    static RequestParams: {
        gee_token?: string;
        invite_code?: string;
        unique_id?: string;
        platform?: number;
        gps_latitude?: string;
        gps_longitude?: string;
        client_language?: string;
        system_language?: string;
        device_id?: string;
        mac_addr?: string;
        system_version?: string;
        user_device_no?: string;
        is_simulator?: boolean;
    } | null = null;
    static ResponseData: {
        data?: typeof WebUserGuestLogin2.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebUserGuestLogin2.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserGuestLogin2.ResponseData;
    };
}

export class WebUserLoginSyncInfo extends WebCommon {
    static API: string = '/api/user/login_sync_info';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebUserLoginSyncInfo.Data;
    } | null = null;
    static Data: {
        port?: number;
    } | null = null;

    static Request(param: typeof WebUserLoginSyncInfo.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserLoginSyncInfo.ResponseData;
    };
}

export class WebUserLogin2 extends WebCommon {
    static API: string = '/api/user/login2';
    static RequestParams: {
        area?: string;
        phone?: string;
        email?: string;
        password?: string;
        code?: string;
        device_id?: string;
        mac_addr?: string;
        is_simulator?: boolean;
        simulator_name?: string;
        system_version?: string;
        user_device_no?: string;
        client_language?: string;
        system_language?: string;
        pwd_type?: number;
        user_random_id?: number;
        gps_latitude?: string;
        gps_longitude?: string;
        device_timestamp?: number;
        lot_number?: string;
        captcha_output?: string;
        pass_token?: string;
        gen_time?: string;
        check_captcha?: boolean;
    } | null = null;
    static ResponseData: {
        data?: typeof WebUserLogin2.Data;
    } | null = null;
    static Data: {
        token?: string;
        expire_at?: number;
        login_country?: string;
    } | null = null;

    static Request(param: typeof WebUserLogin2.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserLogin2.ResponseData;
    };
}

export class WebUserModifyBringinPasswordSwitch extends WebCommon {
    static API: string = '/api/user/modify/bringin/password/switch';
    static RequestParams: {
        bringin_pwd_switch?: number;
        bringin_pwd_type?: number;
        bringin_pwd_verify_type?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebUserModifyBringinPasswordSwitch.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebUserModifyBringinPasswordSwitch.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserModifyBringinPasswordSwitch.ResponseData;
    };
}

export class WebUserModifyQuickLoginSwitch extends WebCommon {
    static API: string = '/api/user/modify/quick/login/switch';
    static RequestParams: {
        quick_login_switch?: number;
        quick_login_type?: string;
    } | null = null;
    static ResponseData: {
        data?: typeof WebUserModifyQuickLoginSwitch.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebUserModifyQuickLoginSwitch.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserModifyQuickLoginSwitch.ResponseData;
    };
}

export class WebUserMute extends WebCommon {
    static API: string = '/api/user/mute';
    static RequestParams: {
        club_id?: number;
        tribe_id?: number;
        user_id?: number;
        mute?: boolean;
    } | null = null;
    static ResponseData: {
        data?: typeof WebUserMute.Data;
    } | null = null;
    static Data: {
        list?: (typeof WebUserMute.MuteInfo)[];
    } | null = null;
    static MuteInfo: {
        user_id?: number;
        user_random_id?: number;
        club_id?: number;
        tribe_id?: number;
    } | null = null;

    static Request(param: typeof WebUserMute.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserMute.ResponseData;
    };
}

export class WebUserMuteList extends WebCommon {
    static API: string = '/api/user/mute/list';
    static RequestParams: {
        club_id?: number;
        tribe_id?: number;
        user_ids?: number[];
    } | null = null;
    static ResponseData: {
        data?: typeof WebUserMuteList.Data;
    } | null = null;
    static Data: {
        ids?: number[];
    } | null = null;

    static Request(param: typeof WebUserMuteList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserMuteList.ResponseData;
    };
}

export class WebUserMyWalletS extends WebCommon {
    static API: string = '/api/user/my_wallets';
    static RequestParams: {
        gold_type?: number;
        origin_type?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebUserMyWalletS.Data;
    } | null = null;
    static Data: {
        amount?: number;
        wallet?: (typeof WebUserMyWalletS.Wallet)[];
    } | null = null;
    static Wallet: {
        gold?: number;
        club_name?: string;
    } | null = null;

    static Request(param: typeof WebUserMyWalletS.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserMyWalletS.ResponseData;
    };
}

export class WebUserPublicInfo extends WebCommon {
    static API: string = '/api/user/public_info';
    static RequestParams: {
        randomId?: string;
        userId?: number;
    } | null = null;
    static ResponseData: {
        status?: number;
        data?: typeof WebUserPublicInfo.Data;
    } | null = null;
    static Data: {
        nickName?: string;
    } | null = null;

    static Request(param: typeof WebUserPublicInfo.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserPublicInfo.ResponseData;
    };
}

export class WebUserQuickPasswordModify extends WebCommon {
    static API: string = '/api/user/quick_password/modify';
    static RequestParams: {
        user_pwd_type?: number;
        switch_status?: number;
        password?: string;
    } | null = null;
    static ResponseData: {
        data?: typeof WebUserQuickPasswordModify.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebUserQuickPasswordModify.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserQuickPasswordModify.ResponseData;
    };
}

export class WebUserQuickPasswordVerify extends WebCommon {
    static API: string = '/api/user/quick_password/verify';
    static RequestParams: {
        user_pwd_type?: number;
        password?: string;
    } | null = null;
    static ResponseData: {
        data?: typeof WebUserQuickPasswordVerify.Data;
    } | null = null;
    static Data: {
        verify?: boolean;
        failed_count?: number;
    } | null = null;

    static Request(param: typeof WebUserQuickPasswordVerify.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserQuickPasswordVerify.ResponseData;
    };
}

export class WebUserRemaRks extends WebCommon {
    static API: string = '/api/user/remarks';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebUserRemaRks.Data;
    } | null = null;
    static Data: {
        list?: (typeof WebUserRemaRks.LabelData)[];
    } | null = null;
    static LabelData: {
        user_id?: number;
        user_random_id?: number;
        remark_name?: string;
        remark_desc?: string;
        tag_id?: number;
        tag_custom?: string;
    } | null = null;

    static Request(param: typeof WebUserRemaRks.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserRemaRks.ResponseData;
    };
}

export class WebUserSendInfo extends WebCommon {
    static API: string = '/api/user/send_info';
    static RequestParams: {
        gps_latitude?: string;
        gps_longitude?: string;
        save_type?: number;
        device_id?: string;
        mac_addr?: string;
        is_simulator?: boolean;
        simulator_name?: string;
        system_version?: string;
        user_device_no?: string;
        system_language?: string;
        client_language?: string;
        match_id?: number;
        room_id?: number;
        extra_data?: string;
    } | null = null;
    static ResponseData: {} | null = null;
    static ExtraData: {
        gyro?: number;
    } | null = null;

    static Request(param: typeof WebUserSendInfo.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserSendInfo.ResponseData;
    };
}

export class WebUserSendVerifyCode extends WebCommon {
    static API: string = '/api/user/send_verify_code';
    static RequestParams: {
        area?: string;
        phone?: string;
        email?: string;
        lang?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebUserSendVerifyCode.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebUserSendVerifyCode.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserSendVerifyCode.ResponseData;
    };
}

export class WebUserSetLuckyNum extends WebCommon {
    static API: string = '/api/user/set_lucky_num';
    static RequestParams: {
        lucky_num?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebUserSetLuckyNum.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebUserSetLuckyNum.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserSetLuckyNum.ResponseData;
    };
}

export class WebUserSetVideoMask extends WebCommon {
    static API: string = '/api/user/set_video_mask';
    static RequestParams: {
        video_mask_id?: number;
    } | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebUserSetVideoMask.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserSetVideoMask.ResponseData;
    };
}

export class WebUserTraderApply extends WebCommon {
    static API: string = '/api/user/trader/apply';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebUserTraderApply.Data;
    } | null = null;
    static Data: {
        data?: unknown[];
    } | null = null;

    static Request(param: typeof WebUserTraderApply.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserTraderApply.ResponseData;
    };
}

export class WebUserTraderApplyList extends WebCommon {
    static API: string = '/api/user/trader/apply/list';
    static RequestParams: {
        status?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebUserTraderApplyList.Data;
    } | null = null;
    static Data: {
        list?: (typeof WebUserTraderApplyList.ApplyInfo)[];
    } | null = null;
    static ApplyInfo: {
        order_no?: string;
        status?: number;
        reject_reason?: string;
        read_status?: number;
        audit_time?: string;
        update_time?: string;
        create_time?: string;
    } | null = null;

    static Request(param: typeof WebUserTraderApplyList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserTraderApplyList.ResponseData;
    };
}

export class WebUserTraderApplyRead extends WebCommon {
    static API: string = '/api/user/trader/apply/read';
    static RequestParams: {
        order_nos?: string[];
    } | null = null;
    static ResponseData: {
        data?: typeof WebUserTraderApplyRead.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebUserTraderApplyRead.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserTraderApplyRead.ResponseData;
    };
}

export class WebUserUserSubscrIptionConfig extends WebCommon {
    static API: string = '/api/user/user_subscription_config';
    static RequestParams: {
        subscription_id?: number;
        subscription_status?: number;
        equity_comparison?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebUserUserSubscrIptionConfig.Data;
    } | null = null;
    static Data: {
        list?: (typeof WebUserUserSubscrIptionConfig.VIPEquityData)[];
    } | null = null;
    static VIPEquityData: {
        id?: number;
        name?: string;
        logo?: string;
        price_configs?: (typeof WebUserUserSubscrIptionConfig.PriceConfigs)[];
        subscription_type?: number;
        prop_emoji_permission?: number;
        prop_bullet_permission?: number;
        prop_frame_permission?: number;
        prop_throw_permission?: number;
        avatar_permission?: number;
        career_record_permission?: number;
        equity_comparison?: number;
        create_max_club_num?: number;
        create_max_tribe_num?: number;
        free_add_time_num?: number;
        free_view_card_num?: number;
        free_use_chat_prop_num?: number;
        free_use_chat_emoji_num?: number;
        free_use_chat_bullet_num?: number;
        free_use_chat_avatar_num?: number;
        free_video_special_effect_hour?: number;
        free_dynamic_table_theme_hour?: number;
        free_static_table_theme_hour?: number;
        free_avatar_hour?: number;
        display_benefits?: string;
    } | null = null;
    static PriceConfigs: {
        price_type?: number;
        raw_price?: number;
        pay_price?: number;
    } | null = null;

    static Request(param: typeof WebUserUserSubscrIptionConfig.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserUserSubscrIptionConfig.ResponseData;
    };
}

export class WebUserVerifyCodeVerify extends WebCommon {
    static API: string = '/api/user/verify_code/verify';
    static RequestParams: {
        area?: string;
        phone?: string;
        email?: string;
        code?: string;
    } | null = null;
    static ResponseData: {
        data?: typeof WebUserVerifyCodeVerify.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebUserVerifyCodeVerify.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserVerifyCodeVerify.ResponseData;
    };
}

export class WebUserWalletSlog extends WebCommon {
    static API: string = '/api/user/wallets_log';
    static RequestParams: {
        gold_type?: number;
        origin_type?: number;
        limit?: number;
        offset?: number;
        user_id?: number;
        op_codes?: string[];
        sort_type?: number;
        order_type?: number;
        start_time?: number;
        end_time?: number;
        club_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebUserWalletSlog.Data;
    } | null = null;
    static Data: {
        limit?: number;
        offset?: number;
        total?: number;
        list?: (typeof WebUserWalletSlog.Wallet)[];
        total_info?: typeof WebUserWalletSlog.TotalInfo;
    } | null = null;
    static TotalInfo: {
        grant_amount?: number;
        recover_amount?: number;
        bring_amount?: number;
        self_profit_amount?: number;
        change_amount?: number;
    } | null = null;
    static Wallet: {
        gold_change?: number;
        gold_after?: number;
        create_time?: string;
        op_code?: string;
        gold_type?: number;
        club_name?: string;
        src_type?: number;
        src_room_id?: number;
        name?: string;
        room_info?: typeof WebUserWalletSlog.Room_info;
        date?: string;
        memeber_array?: (typeof WebUserWalletSlog.Member)[];
        memeber_count?: number;
        tribe_name?: string;
        nick_name?: string;
        user_random_id?: number;
        op_nick_name?: string;
        op_random_id?: number;
        multi_lang_names_obj?: unknown;
        src_match_id?: number;
        match_tribe_name?: string;
        src_nick_name?: string;
        src_random_id?: number;
    } | null = null;
    static Room_info: {
        club_name?: string;
        creator_name?: string;
        bring_in_amount?: number;
        bring_out_amount?: number;
        origin_type?: number;
        share_table?: number;
        records?: (typeof WebUserWalletSlog.Record)[];
        self_profit_amount?: number;
        game_type?: number;
        ante?: number;
        poker_type?: number;
    } | null = null;
    static Record: {
        gold_change?: number;
        op_code?: string;
        create_time?: string;
    } | null = null;
    static Member: {
        nick_name?: string;
        gold_change?: number;
        create_time?: string;
    } | null = null;

    static Request(param: typeof WebUserWalletSlog.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebUserWalletSlog.ResponseData;
    };
}
