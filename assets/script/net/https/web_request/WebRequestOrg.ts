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

export class WebOrgClubCreate extends WebCommon {
    //接口地址
    static API: string = '/api/org/club/create';
    // //字段声明
    // static RequestParams: {
    //     area_id: null,
    //     club_name: null,
    //     desc: null,
    //     logo: null,
    // } = null;
}

export class WebOrgClubGet extends WebCommon {
    //接口地址
    static API: string = '/api/org/club/user_club';
    //字段声明
    // static RequestParams: {
    // } = null;
    // static ResponseData: {
    //     // random_id: number,
    //     // club_name: string,
    //     // more_contact: string,
    //     // club_id: number,
    //     // level: number,
    //     // upper_limit: number,
    //     // search_switch: any
    //     // auto_audit_switch: any
    // } = null;
}

export class WebOrgClubPlayerApplyList extends WebCommon {
    //接口地址
    static API: string = '/api/org/club/user/join/list';
}

export class WebOrgClubSearchById extends WebCommon {
    //接口地址
    static API: string = '/api/org/club/info';
    //字段声明
    // static RequestParams: {
    //     club_random_id: null;
    // } = null;
}

export class WebOrgClubJoin extends WebCommon {
    //接口地址
    static API: string = '/api/org/club/user/join/apply';
    //字段声明
    // static RequestPara·ms: {
    //     club_id: null;
    // } = null;
}

export class WebOrgClubCancleJoinClub extends WebCommon {
    //接口地址
    static API: string = '/api/org/club/user/join/cancel';
    //字段声明
    // static RequestParams: {
    //     apply_id: null;
    // } = null;
}

export class WebOrgClubIsManger extends WebCommon {
    //接口地址
    static API: string = '/api/org/club/admin/has';
    //字段声明
    // static RequestParams: {
    //     club_id: null;
    // } = null;
}

export class WebOrgClubApproValJoin extends WebCommon {
    //接口地址
    static API: string = '/api/org/club/user/join/audit';
    //字段声明
    // static RequestParams: {
    //     "apply_id": ''
    //     "audit_op": ''
    // } = null;
}

export class WebOrgClubGetJoinlList extends WebCommon {
    //接口地址
    static API: string = '/api/org/club/join/list';
}

export class WebOrgClubQuit extends WebCommon {
    //接口地址
    static API: string = '/api/org/club/user/quit';
    //字段声明
    // static RequestParams: {
    //     club_id: null;
    // } = null;
}

export class WebOrgMemberList extends WebCommon {
    //接口地址
    static API: string = '/api/org/club/member/list';
    //字段声明
    // static RequestParams: {
    //     club_id: null;
    // } = null;
}

export class WebOrgMangerList extends WebCommon {
    //接口地址
    static API: string = '/api/org/club/admin/list';
}

export class WebClubJoinList extends WebCommon {
    //接口地址
    static API: string = '/api/org/club/user/join/list';
    //字段声明
    // static RequestParams: {
    //     "limit": number,
    //     "offset": number
    // } = null;
}

export class WebLockUser extends WebCommon {
    //接口地址
    static API: string = '/api/org/club/admin/lock/user';
    //字段声明
    // static RequestParams: {
    //     user_id: number;
    // } = null;
}

export class WebUnlockUser extends WebCommon {
    //接口地址
    static API: string = '/api/org/club/admin/unlock/user';
    //字段声明
    // static RequestParams: {
    //     user_id: number;
    // } = null;
}

export class WebDeleleUser extends WebCommon {
    //接口地址
    static API: string = '/api/org/club/admin/delele/user';
    //字段声明
    // static RequestParams: {
    //     user_id: number;
    // } = null;
}

export class WebClubQuitList extends WebCommon {
    //接口地址
    static API: string = '/api/org/club/user/quit/log';
    //字段声明
    // static RequestParams: {
    //     "limit": number,
    //     "offset": number
    // } = null;
}

export class WebOrgClubGold extends WebCommon {
    //接口地址
    static API: string = '/api/org/club/fund/detail';
    //字段声明
    // static RequestParams: {
    //     club_random_id: number
    // } = null;
    // static ResponseData: {
    //     org_id: number, // 公会ID
    //     gold: number, // 公会金豆数
    //     gold_lock: number, // 公会被锁定的金豆数
    //     forbidden: boolean, // 是否冻结 true已冻结，false未冻结
    //     club_name: string,   //公会名字
    // } = null;
}

export class WebOrgTribeSearchById extends WebCommon {
    //接口地址
    static API: string = '/api/org/tribe/info';
}

/**
 * 查询玩家已读新标签次数
 */
export class APIOrgUserNewLabelReadNum extends WebCommon {
    static API: string = '/api/org/user/new_label/read/num';
}

/**
 * 上报玩家已读新标签
 */
export class APIOrgUserNewLabelRead extends WebCommon {
    static API: string = '/api/org/user/new_label/read';
}

/**
 * 获取俱乐部/联盟房间权限
 */
export class APIOrgTribeRoomPermissions extends WebCommon {
    static API: string = '/api/org/tribe/room_permissions';
}

export class WebOrgJoinTrip extends WebCommon {
    //接口地址
    static API: string = '/api/org/tribe/club/join/apply';
}

export class WebOrgchaNgeClubData extends WebCommon {
    //接口地址
    static API: string = '/api/org/club/modify/club_info';
}

export class WebModifyDigitalWalletAddress extends WebCommon {
    //接口地址
    static API: string = '/api/org/club/modify/digital_wallet_address';
}

export class WebOrgClubDelAdmin extends WebCommon {
    public static API: string = '/api/org/club/admin/del_admin';
    //字段声明
    // public static RequestParams: {
    //     user_id: number,  //
    // } = null;
}

export class WebOrgClubCreateRoomChange extends WebCommon {
    public static API: string = '/api/org/club/admin/create_room_switch';
    //字段声明
    // public static RequestParams: {
    //     user_id: number,  //
    //     create_room: number //
    // } = null;
}

export class WebOrgClubAddAdmin extends WebCommon {
    public static API: string = '/api/org/club/admin/add_admin';
    //字段声明
    // public static RequestParams: {
    //     user_id: number,  //
    // } = null;
}

export class WebOrgClubMember extends WebCommon {
    public static API: string = '/api/org/club/member/ordinary_list';
    //字段声明
    // public static RequestParams: {
    //     club_random_id: number,  //
    // } = null;
}

export class WebOrgClubLevelBenefit extends WebCommon {
    public static API: string = '/api/org/club/level_benefit';
}

export class WebOrgClubLevelInfo extends WebCommon {
    public static API: string = '/api/org/club/level_info';
}

export class WebOrgClubLevelCost extends WebCommon {
    public static API: string = '/api/org/club/level_cost';
}

export class WebOrgClubUpLevel extends WebCommon {
    public static API: string = '/api/org/club/level_up';
}

export class WebOrgClubUserInfo extends WebCommon {
    public static API: string = '/api/org/club/user/info';
}

export class WebOrgClubUserRemaRks extends WebCommon {
    public static API: string = '/api/org/club/user/update';
}

export class WebOrgClubUserRoleChange extends WebCommon {
    public static API: string = '/api/org/club/role_change';
}

export class WebOrgClubApplyTribeList extends WebCommon {
    public static API: string = '/api/org/tribe/club/join/apply_list';
}

export class WebOrgClubCancleJoinTribe extends WebCommon {
    public static API: string = '/api/org/tribe/club/join/cancel_apply';
}

export class WebClubFundChangeLog extends WebCommon {
    //接口地址
    static API: string = '/api/org/club/fund/gold_change/log';
    //字段声明
    // static RequestParams: {
    //     club_random_id: number
    // } = null;
}

export class WebClubAgentList extends WebCommon {
    static API: string = '/api/org/club/agent/list';
}

export class WebClubAgentAdd extends WebCommon {
    static API: string = '/api/org/club/user/add_agent';
}

export class WebClubAgentDel extends WebCommon {
    static API: string = '/api/org/club/user/del_agent';
}

export class WebClubAgentUserList extends WebCommon {
    static API: string = '/api/org/club/agent/user_list';
}

export class WebClubAgentUserListCover extends WebCommon {
    static API: string = '/api/org/club/agent/user_list_cover';
}

export class WebClubUserWallet extends WebCommon {
    static API: string = '/api/org/club/club_user/wallet';
}

export class WebGuildAdminHas extends WebCommon {
    static API: string = '/api/org/club/user/admin/has';
}

export class WebOrgClubId extends WebCommon {
    static API: string = '/api/org/club/{id}';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebOrgClubId.Data;
    } | null = null;
    static Data: {
        club_name?: string;
        logo?: string;
        random_id?: number;
        upper_limit?: number;
        club_members?: number;
        area_id?: string;
        club_type?: number;
        member_type?: number;
        create_time?: string;
        is_official?: number;
        club_status?: number;
    } | null = null;

    static Request(param: typeof WebOrgClubId.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubId.ResponseData;
    };
}

export class WebOrgClubIdJoin extends WebCommon {
    static API: string = '/api/org/club/{id}/join';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebOrgClubIdJoin.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebOrgClubIdJoin.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubIdJoin.ResponseData;
    };
}

export class WebOrgClubAdminPermissionSwitch extends WebCommon {
    static API: string = '/api/org/club/admin/permission_switch';
    static RequestParams: {
        club_id?: number;
        user_id?: number;
        create_room?: number;
        club_manage?: number;
        member_manage?: number;
        fund_manage?: number;
        get_data?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgClubAdminPermissionSwitch.Data;
    } | null = null;
    static Info: {
        create_room?: number;
        club_manage?: number;
        member_manage?: number;
        fund_manage?: number;
        get_data?: number;
    } | null = null;
    static Data: {
        info?: typeof WebOrgClubAdminPermissionSwitch.Info;
    } | null = null;

    static Request(param: typeof WebOrgClubAdminPermissionSwitch.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubAdminPermissionSwitch.ResponseData;
    };
}

export class WebOrgClubAgentCreditBalaNce extends WebCommon {
    static API: string = '/api/org/club/agent/credit/balance';
    static RequestParams: {
        user_id?: number;
        gold_type?: number;
        amount?: number;
        is_reset?: boolean;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgClubAgentCreditBalaNce.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebOrgClubAgentCreditBalaNce.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubAgentCreditBalaNce.ResponseData;
    };
}

export class WebOrgClubAgentCreditLimit extends WebCommon {
    static API: string = '/api/org/club/agent/credit/limit';
    static RequestParams: {
        user_id?: number;
        gold_type?: number;
        amount?: number;
        is_reset?: boolean;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgClubAgentCreditLimit.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebOrgClubAgentCreditLimit.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubAgentCreditLimit.ResponseData;
    };
}

export class WebOrgClubAgentInviTation extends WebCommon {
    static API: string = '/api/org/club/agent/invitation';
    static RequestParams: {
        user_id?: number;
        club_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgClubAgentInviTation.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebOrgClubAgentInviTation.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubAgentInviTation.ResponseData;
    };
}

export class WebOrgClubAgentRatioInfo extends WebCommon {
    static API: string = '/api/org/club/agent/ratio/info';
    static RequestParams: {
        user_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgClubAgentRatioInfo.Data;
    } | null = null;
    static Data: {
        info?: typeof WebOrgClubAgentRatioInfo.Info;
    } | null = null;
    static Info: {
        agent_service_ratio?: number;
        agent_insur_ratio?: number;
        agent_cowboy_ratio?: number;
        agent_mtt_ratio?: number;
        agent_jackpot_ratio?: number;
    } | null = null;

    static Request(param: typeof WebOrgClubAgentRatioInfo.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubAgentRatioInfo.ResponseData;
    };
}

export class WebOrgClubAgentRatioUpdate extends WebCommon {
    static API: string = '/api/org/club/agent/ratio/update';
    static RequestParams: {
        user_id?: number;
        agent_service_ratio?: number;
        agent_insur_ratio?: number;
        agent_cowboy_ratio?: number;
        agent_mtt_ratio?: number;
        agent_jackpot_ratio?: number;
    } | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebOrgClubAgentRatioUpdate.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubAgentRatioUpdate.ResponseData;
    };
}

export class WebOrgClubCloneApply extends WebCommon {
    static API: string = '/api/org/club/clone/apply';
    static RequestParams: {
        club_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgClubCloneApply.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebOrgClubCloneApply.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubCloneApply.ResponseData;
    };
}

export class WebOrgClubClubWalletStats extends WebCommon {
    static API: string = '/api/org/club/club_wallet/stats';
    static RequestParams: {
        gold_type?: number;
        start_time?: number;
        end_time?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgClubClubWalletStats.Data;
    } | null = null;
    static Data: {
        gold_before?: number;
        gold_after?: number;
        to_user?: number;
        recover_user?: number;
        to_club?: number;
        recover_club?: number;
        room_profit?: number;
        mtt_profit?: number;
        insurance?: number;
        sng_profit?: number;
        jackpot_profit?: number;
        mini_game_profit?: number;
    } | null = null;

    static Request(param: typeof WebOrgClubClubWalletStats.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubClubWalletStats.ResponseData;
    };
}

export class WebOrgClubCreateIsFirst extends WebCommon {
    static API: string = '/api/org/club/create/is_first';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebOrgClubCreateIsFirst.Data;
    } | null = null;
    static Data: {
        is_first?: number;
    } | null = null;

    static Request(param: typeof WebOrgClubCreateIsFirst.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubCreateIsFirst.ResponseData;
    };
}

export class WebOrgClubCreditBalaNce extends WebCommon {
    static API: string = '/api/org/club/credit/balance';
    static RequestParams: {
        user_id?: number;
        gold_type?: number;
        amount?: number;
        is_reset?: boolean;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgClubCreditBalaNce.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebOrgClubCreditBalaNce.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubCreditBalaNce.ResponseData;
    };
}

export class WebOrgClubCreditLimit extends WebCommon {
    static API: string = '/api/org/club/credit/limit';
    static RequestParams: {
        user_id?: number;
        gold_type?: number;
        amount?: number;
        is_reset?: boolean;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgClubCreditLimit.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebOrgClubCreditLimit.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubCreditLimit.ResponseData;
    };
}

export class WebOrgClubCreditLog extends WebCommon {
    static API: string = '/api/org/club/credit/log';
    static RequestParams: {
        limit?: number;
        offset?: number;
        gold_type?: number;
        op_codes?: string[];
        start_time?: number;
        end_time?: number;
        sort_type?: number;
        order_type?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgClubCreditLog.Data;
    } | null = null;
    static Data: {
        limit?: number;
        total?: number;
        offset?: number;
        data?: (typeof WebOrgClubCreditLog.CreditData)[];
        credit_info?: typeof WebOrgClubCreditLog.CreditInfo;
    } | null = null;
    static CreditInfo: {
        club_credit_limit_total?: number;
        club_credit_limit_increase_total?: number;
        club_credit_limit_decrease_total?: number;
        club_credit_total?: number;
        club_credit_increase_total?: number;
        club_credit_decrease_total?: number;
    } | null = null;
    static CreditData: {
        credit_change?: number;
        credit_after?: number;
        create_time?: string;
        op_code?: string;
        credit_limit?: number;
        user_random_id?: number;
        user_name?: string;
    } | null = null;

    static Request(param: typeof WebOrgClubCreditLog.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubCreditLog.ResponseData;
    };
}

export class WebOrgClubDelayRoomAuditSwitchUpdate extends WebCommon {
    static API: string = '/api/org/club/delay_room_audit_switch/update';
    static RequestParams: {
        delay_room_audit_switch?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgClubDelayRoomAuditSwitchUpdate.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebOrgClubDelayRoomAuditSwitchUpdate.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubDelayRoomAuditSwitchUpdate.ResponseData;
    };
}

export class WebOrgClubDisbAnd extends WebCommon {
    static API: string = '/api/org/club/disband';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebOrgClubDisbAnd.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebOrgClubDisbAnd.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubDisbAnd.ResponseData;
    };
}

export class WebOrgClubInviTation extends WebCommon {
    static API: string = '/api/org/club/invitation';
    static RequestParams: {
        club_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgClubInviTation.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebOrgClubInviTation.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubInviTation.ResponseData;
    };
}

export class WebOrgClubJackpotRecharge extends WebCommon {
    static API: string = '/api/org/club/jackpot/recharge';
    static RequestParams: {
        jackpot_id?: number;
        amount?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgClubJackpotRecharge.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebOrgClubJackpotRecharge.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubJackpotRecharge.ResponseData;
    };
}

export class WebOrgClubJackpotTemplateCreate extends WebCommon {
    static API: string = '/api/org/club/jackpot/template/create';
    static RequestParams: {
        name?: string;
        gold?: number;
        nlh_switch?: number;
        nlh_setting?: typeof WebOrgClubJackpotTemplateCreate.JackpotSetting;
        plo_switch?: number;
        plo_setting?: typeof WebOrgClubJackpotTemplateCreate.JackpotSetting;
        six_plus_switch?: number;
        six_plus_setting?: typeof WebOrgClubJackpotTemplateCreate.JackpotSetting;
        bombpot_switch?: number;
        bombpot_setting?: typeof WebOrgClubJackpotTemplateCreate.JackpotSetting;
        aof_switch?: number;
        aof_setting?: typeof WebOrgClubJackpotTemplateCreate.JackpotSetting;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgClubJackpotTemplateCreate.Data;
    } | null = null;
    static JackpotSetting: {
        game_play_ratio?: number;
        blind_setting?: (typeof WebOrgClubJackpotTemplateCreate.BlindsSetting)[];
        royal_flush_switch?: number;
        royal_flush_ratio?: number;
        straight_flush_switch?: number;
        straight_flush_ratio?: number;
        four_ofa_kind_switch?: number;
        four_ofa_kind_ratio?: number;
    } | null = null;
    static BlindsSetting: {
        sb?: number;
        status?: number;
        blind_type?: number;
        prize_ratio?: number;
        contribute_pot_switch?: number;
        contribute_pot_limit?: number;
        award_bet_switch?: number;
        award_bet_limit?: number;
        award_other_switch?: number;
        award_other_ratio?: number;
        award_round_type?: number;
        contribute_type?: number;
        contribute_fixed_limit?: number;
        contribute_fixed_rate?: number;
        contribute_ratio?: number;
        contribute_pot_ratio?: number;
        mars_earth_ratio?: number;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebOrgClubJackpotTemplateCreate.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubJackpotTemplateCreate.ResponseData;
    };
}

export class WebOrgClubJackpotTemplateDel extends WebCommon {
    static API: string = '/api/org/club/jackpot/template/del';
    static RequestParams: {
        jackpot_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgClubJackpotTemplateDel.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebOrgClubJackpotTemplateDel.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubJackpotTemplateDel.ResponseData;
    };
}

export class WebOrgClubJackpotTemplateList extends WebCommon {
    static API: string = '/api/org/club/jackpot/template/list';
    static RequestParams: {
        nlh_switch?: number;
        plo_switch?: number;
        six_plus_switch?: number;
        bombpot_switch?: number;
        aof_switch?: number;
        limit?: number;
        offset?: number;
        ids?: number[];
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgClubJackpotTemplateList.Data;
    } | null = null;
    static Data: {
        limit?: number;
        offset?: number;
        items?: unknown[];
    } | null = null;

    static Request(param: typeof WebOrgClubJackpotTemplateList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubJackpotTemplateList.ResponseData;
    };
}

export class WebOrgClubJackpotTemplateUpdate extends WebCommon {
    static API: string = '/api/org/club/jackpot/template/update';
    static RequestParams: {
        name?: string;
        jackpot_id?: number;
        nlh_switch?: number;
        nlh_setting?: unknown;
        plo_switch?: number;
        plo_setting?: unknown;
        six_plus_switch?: number;
        six_plus_setting?: unknown;
        bombpot_switch?: number;
        bombpot_setting?: unknown;
        aof_switch?: number;
        aof_setting?: unknown;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgClubJackpotTemplateUpdate.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebOrgClubJackpotTemplateUpdate.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubJackpotTemplateUpdate.ResponseData;
    };
}

export class WebOrgClubJackpotWithdraw extends WebCommon {
    static API: string = '/api/org/club/jackpot/withdraw';
    static RequestParams: {
        jackpot_id?: number;
        amount?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgClubJackpotWithdraw.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebOrgClubJackpotWithdraw.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubJackpotWithdraw.ResponseData;
    };
}

export class WebOrgClubList extends WebCommon {
    static API: string = '/api/org/club/list';
    static RequestParams: {
        club_random_ids?: string;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgClubList.Data;
    } | null = null;
    static Data: {} | null = null;
    static ClubData: {
        club_name?: string;
        logo?: string;
    } | null = null;

    static Request(param: typeof WebOrgClubList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubList.ResponseData;
    };
}

export class WebOrgClubMasterSlaveClubList extends WebCommon {
    static API: string = '/api/org/club/master/slave_club/list';
    static RequestParams: {
        search?: string;
        sort_type?: number;
        order_type?: number;
        limit?: number;
        offset?: number;
        filter_type?: number;
        club_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgClubMasterSlaveClubList.Data;
    } | null = null;
    static Data: {
        limit?: number;
        offset?: number;
        total?: number;
        total_info?: typeof WebOrgClubMasterSlaveClubList.TotalInfo;
        data?: (typeof WebOrgClubMasterSlaveClubList.Record)[];
    } | null = null;
    static Record: {
        club_id?: number;
        club_name?: string;
        logo?: string;
        random_id?: number;
        club_members?: number;
        master_service_ratio?: number;
        master_insur_ratio?: number;
        master_mtt_ratio?: number;
        master_jackpot_ratio?: number;
        remark_name?: string;
        profit_total?: number;
        club_gold?: number;
        user_gold?: number;
        remark_desc?: string;
        slave_create_time?: string;
        club_subscription_id?: number;
    } | null = null;
    static TotalInfo: {
        member_total?: number;
        profit_total?: number;
        total_gold?: number;
    } | null = null;

    static Request(param: typeof WebOrgClubMasterSlaveClubList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubMasterSlaveClubList.ResponseData;
    };
}

export class WebOrgClubMasterSlaveClubRatio extends WebCommon {
    static API: string = '/api/org/club/master/slave_club/ratio';
    static RequestParams: {
        slave_club_id?: number;
        master_service_ratio?: number;
        master_insur_ratio?: number;
        master_mtt_ratio?: number;
        master_jackpot_ratio?: number;
    } | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebOrgClubMasterSlaveClubRatio.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubMasterSlaveClubRatio.ResponseData;
    };
}

export class WebOrgClubMasterSlaveClubRemark extends WebCommon {
    static API: string = '/api/org/club/master/slave_club/remark';
    static RequestParams: {
        slave_club_id?: number;
        remark_name?: string;
        remark_desc?: string;
    } | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebOrgClubMasterSlaveClubRemark.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubMasterSlaveClubRemark.ResponseData;
    };
}

export class WebOrgClubMemberRakeBack extends WebCommon {
    static API: string = '/api/org/club/member/rake_back';
    static RequestParams: {
        gold_type?: number;
        limit?: number;
        offset?: number;
        sort_type?: number;
        order_type?: number;
        start_time?: number;
        end_time?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgClubMemberRakeBack.Data;
    } | null = null;
    static Data: {
        limit?: number;
        offset?: number;
        total?: number;
        data?: (typeof WebOrgClubMemberRakeBack.Wallet)[];
        total_info?: typeof WebOrgClubMemberRakeBack.TotalInfo;
    } | null = null;
    static TotalInfo: {
        rake_back_all?: number;
        rake_back_payed?: number;
        rake_back_unpay?: number;
    } | null = null;
    static Wallet: {
        random_num?: number;
        nick_name?: string;
        remark_name?: string;
        total_room_game_results?: number;
        total_service_profit?: number;
        freeze_status?: number;
        user_service_ratio?: number;
        user_mtt_ratio?: number;
        rb?: number;
        club_name?: string;
        club_remark_name?: string;
        club_remark_color?: string;
        rb_type?: number;
        rb_interval_type?: number;
        rb_interval_no?: number;
        unpay_rb?: number;
        payed_rb?: number;
    } | null = null;

    static Request(param: typeof WebOrgClubMemberRakeBack.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubMemberRakeBack.ResponseData;
    };
}

export class WebOrgClubModifyClubDesc extends WebCommon {
    static API: string = '/api/org/club/modify/club_desc';
    static RequestParams: {
        club_id?: number;
        desc?: string;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgClubModifyClubDesc.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebOrgClubModifyClubDesc.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubModifyClubDesc.ResponseData;
    };
}

export class WebOrgClubMyCreateClubs extends WebCommon {
    static API: string = '/api/org/club/my_create_clubs';
    static RequestParams: {
        club_random_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgClubMyCreateClubs.Data;
    } | null = null;
    static Data: {
        list?: (typeof WebOrgClubMyCreateClubs.Info)[];
    } | null = null;
    static Info: {
        club_logo?: string;
        club_id?: number;
        random_id?: number;
        club_name?: string;
        pretty_id?: number;
    } | null = null;

    static Request(param: typeof WebOrgClubMyCreateClubs.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubMyCreateClubs.ResponseData;
    };
}

export class WebOrgClubSearchInfo extends WebCommon {
    static API: string = '/api/org/club/search_info';
    static RequestParams: {
        club_random_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgClubSearchInfo.Data;
    } | null = null;
    static Data: {
        club_id?: number;
        club_name?: string;
        logo?: string;
        random_id?: number;
        club_members?: number;
        user_status?: number;
        pretty_id?: number;
        club_subscription_id?: number;
    } | null = null;

    static Request(param: typeof WebOrgClubSearchInfo.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubSearchInfo.ResponseData;
    };
}

export class WebOrgClubSetTimeZone extends WebCommon {
    static API: string = '/api/org/club/set/time_zone';
    static RequestParams: {
        time_zone?: number;
    } | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebOrgClubSetTimeZone.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubSetTimeZone.ResponseData;
    };
}

export class WebOrgClubSetUserUcadvaNce extends WebCommon {
    static API: string = '/api/org/club/set/user/uc_advance';
    static RequestParams: {
        user_id?: number;
        status?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgClubSetUserUcadvaNce.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebOrgClubSetUserUcadvaNce.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubSetUserUcadvaNce.ResponseData;
    };
}

export class WebOrgClubSubscrIptionBuy extends WebCommon {
    static API: string = '/api/org/club/subscription/buy';
    static RequestParams: {
        subscription_id?: number;
        price_type?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgClubSubscrIptionBuy.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebOrgClubSubscrIptionBuy.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubSubscrIptionBuy.ResponseData;
    };
}

export class WebOrgClubSubscrIptionList extends WebCommon {
    static API: string = '/api/org/club/subscription/list';
    static RequestParams: {
        subscription_id?: number;
        subscription_status?: number;
        equity_comparison?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgClubSubscrIptionList.Data;
    } | null = null;
    static Data: {
        list?: (typeof WebOrgClubSubscrIptionList.VIPEquityData)[];
    } | null = null;
    static VIPEquityData: {
        id?: number;
        name?: string;
        logo?: string;
        price_configs?: (typeof WebOrgClubSubscrIptionList.PriceConfigs)[];
        subscription_type?: number;
        status?: number;
        equity_comparison?: number;
        top_club_level?: number;
        max_slave_club_num?: number;
        max_club_agent_num?: number;
        max_share_table_num?: number;
        max_table_template_num?: number;
        create_max_table_num?: number;
        im_service_permission?: number;
        timing_download_permission?: number;
        manager_patrol_table_permission?: number;
        welcome_message_permission?: number;
        pop_window_permission?: number;
        photo_announce_permission?: number;
        join_club_auto_audit_permission?: number;
        free_anti_cheating_audio?: number;
        free_anti_cheating_video?: number;
        free_anti_cheating_face?: number;
        free_up_table_num?: number;
        game_limit_ip_permission?: number;
        game_limit_gps_permission?: number;
        game_limit_safe_permission?: number;
        self_game_permission?: number;
        aof_permission?: number;
        auto_shut_table_permission?: number;
        straddle_permission?: number;
        second_public_card_permission?: number;
        insurance_permission?: number;
    } | null = null;
    static PriceConfigs: {
        price_type?: number;
        raw_price?: number;
        pay_price?: number;
    } | null = null;

    static Request(param: typeof WebOrgClubSubscrIptionList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubSubscrIptionList.ResponseData;
    };
}

export class WebOrgClubUserPageActive extends WebCommon {
    static API: string = '/api/org/club/user/page/active';
    static RequestParams: {} | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebOrgClubUserPageActive.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubUserPageActive.ResponseData;
    };
}

export class WebOrgClubUserWalletRelationGrant extends WebCommon {
    static API: string = '/api/org/club/user/wallet/relation/grant';
    static RequestParams: {
        user_ids?: number[];
        amount?: number;
        gold_type?: number;
    } | null = null;
    static ResponseData: {} | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebOrgClubUserWalletRelationGrant.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubUserWalletRelationGrant.ResponseData;
    };
}

export class WebOrgClubUserWalletRelationList extends WebCommon {
    static API: string = '/api/org/club/user/wallet/relation/list';
    static RequestParams: {
        limit?: number;
        offset?: number;
        club_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgClubUserWalletRelationList.Data;
    } | null = null;
    static Data: {
        data?: (typeof WebOrgClubUserWalletRelationList.UserData)[];
    } | null = null;
    static UserData: {} | null = null;

    static Request(param: typeof WebOrgClubUserWalletRelationList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgClubUserWalletRelationList.ResponseData;
    };
}

export class WebOrgJackpotTemplateInfo extends WebCommon {
    static API: string = '/api/org/jackpot/template/info';
    static RequestParams: {
        jackpot_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgJackpotTemplateInfo.Data;
    } | null = null;
    static CombineData: {
        total?: number;
        items?: unknown[];
    } | null = null;
    static Data: {
        item?: unknown;
    } | null = null;

    static Request(param: typeof WebOrgJackpotTemplateInfo.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgJackpotTemplateInfo.ResponseData;
    };
}

export class WebOrgTribeApplyList extends WebCommon {
    static API: string = '/api/org/tribe/apply_list';
    static RequestParams: {
        limit?: number;
        offset?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgTribeApplyList.Data;
    } | null = null;
    static Data: {
        offset?: number;
        total?: number;
        list?: (typeof WebOrgTribeApplyList.ClubInfo)[];
    } | null = null;
    static ClubInfo: {
        id?: number;
        club_name?: string;
        club_random_id?: number;
        tribe_name?: string;
        club_logo?: string;
        tribe_random_id?: number;
        club_subscription_id?: number;
    } | null = null;

    static Request(param: typeof WebOrgTribeApplyList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgTribeApplyList.ResponseData;
    };
}

export class WebOrgTribeApplyUpgrAde extends WebCommon {
    static API: string = '/api/org/tribe/apply_upgrade';
    static RequestParams: {
        tribe_phone_area?: string;
        tribe_phone?: string;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgTribeApplyUpgrAde.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebOrgTribeApplyUpgrAde.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgTribeApplyUpgrAde.ResponseData;
    };
}

export class WebOrgTribeAuditApply extends WebCommon {
    static API: string = '/api/org/tribe/audit/apply';
    static RequestParams: {
        id?: number;
        audit_op?: number;
        description?: string;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgTribeAuditApply.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebOrgTribeAuditApply.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgTribeAuditApply.ResponseData;
    };
}

export class WebOrgTribeBlackUserList extends WebCommon {
    static API: string = '/api/org/tribe/black/user/list';
    static RequestParams: {
        offset?: number;
        limit?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgTribeBlackUserList.Data;
    } | null = null;
    static Data: {
        offset?: number;
        total?: number;
        data?: (typeof WebOrgTribeBlackUserList.Info)[];
    } | null = null;
    static Info: {
        id?: number;
        create_time?: string;
        public_reason?: string;
        user_random_id?: number;
        user_name?: string;
        user_avatar?: string;
    } | null = null;

    static Request(param: typeof WebOrgTribeBlackUserList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgTribeBlackUserList.ResponseData;
    };
}

export class WebOrgTribeCheckUpgrAde extends WebCommon {
    static API: string = '/api/org/tribe/check_upgrade';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebOrgTribeCheckUpgrAde.Data;
    } | null = null;
    static Data: {
        config?: typeof WebOrgTribeCheckUpgrAde.Config;
        check_club_count?: number;
        check_member_count?: number;
        check_room_count?: number;
        tribe_phone_area?: string;
        tribe_phone?: string;
        tribe_phone_create_time?: string;
    } | null = null;
    static Config: {
        upgrade_switch?: number;
        club_count?: number;
        member_count?: number;
        day_count?: number;
        room_count?: number;
        hand_count?: number;
    } | null = null;

    static Request(param: typeof WebOrgTribeCheckUpgrAde.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgTribeCheckUpgrAde.ResponseData;
    };
}

export class WebOrgTribeClubFundGoldChangeLog extends WebCommon {
    static API: string = '/api/org/tribe/club/fund/gold_change/log';
    static RequestParams: {
        limit?: number;
        offset?: number;
        club_id?: number;
        gold_type?: number;
        op_codes?: string[];
        start_time?: number;
        end_time?: number;
        sort_type?: number;
        order_type?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgTribeClubFundGoldChangeLog.Data;
    } | null = null;
    static Data: {
        offset?: number;
        list?: (typeof WebOrgTribeClubFundGoldChangeLog.Record)[];
        total_info?: typeof WebOrgTribeClubFundGoldChangeLog.TotalInfo;
    } | null = null;
    static TotalInfo: {
        grant_amount?: number;
        recover_amount?: number;
        profit_amount?: number;
        change_amount?: number;
    } | null = null;
    static Record: {
        gold_change?: number;
        gold_after?: number;
        create_time?: string;
        op_code?: string;
        name?: string;
        user_random_num?: number;
        user_nick_name?: string;
        src_room_id?: number;
        src_match_id?: number;
        admin_nick_name?: string;
        multi_lang_names_obj?: unknown;
    } | null = null;

    static Request(param: typeof WebOrgTribeClubFundGoldChangeLog.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgTribeClubFundGoldChangeLog.ResponseData;
    };
}

export class WebOrgTribeClubKickOut extends WebCommon {
    static API: string = '/api/org/tribe/club/kickout';
    static RequestParams: {
        club_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgTribeClubKickOut.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebOrgTribeClubKickOut.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgTribeClubKickOut.ResponseData;
    };
}

export class WebOrgTribeClubList extends WebCommon {
    static API: string = '/api/org/tribe/club/list';
    static RequestParams: {
        search?: string;
        sort_type?: number;
        order_type?: number;
        limit?: number;
        offset?: number;
        filter_type?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgTribeClubList.Data;
    } | null = null;
    static Data: {
        limit?: number;
        offset?: number;
        total?: number;
        total_info?: typeof WebOrgTribeClubList.TotalInfo;
        data?: (typeof WebOrgTribeClubList.Record)[];
    } | null = null;
    static Record: {
        club_id?: number;
        club_name?: string;
        logo?: string;
        random_id?: number;
        club_members?: number;
        club_status?: number;
        room_game_ratio?: number;
        room_insur_ratio?: number;
        room_mtt_ratio?: number;
        jackpot_ratio?: number;
        profit_total?: number;
        club_gold?: number;
        user_gold?: number;
        tribe_create_time?: string;
        club_subscription_id?: number;
    } | null = null;
    static TotalInfo: {
        member_total?: number;
        profit_total?: number;
        total_gold?: number;
    } | null = null;

    static Request(param: typeof WebOrgTribeClubList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgTribeClubList.ResponseData;
    };
}

export class WebOrgTribeClubListAll extends WebCommon {
    static API: string = '/api/org/tribe/club/list/all';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebOrgTribeClubListAll.Data;
    } | null = null;
    static Data: {
        data?: (typeof WebOrgTribeClubListAll.Record)[];
    } | null = null;
    static Record: {
        club_id?: number;
        club_name?: string;
    } | null = null;

    static Request(param: typeof WebOrgTribeClubListAll.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgTribeClubListAll.ResponseData;
    };
}

export class WebOrgTribeClubLock extends WebCommon {
    static API: string = '/api/org/tribe/club/lock';
    static RequestParams: {
        club_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgTribeClubLock.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebOrgTribeClubLock.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgTribeClubLock.ResponseData;
    };
}

export class WebOrgTribeClubRemark extends WebCommon {
    static API: string = '/api/org/tribe/club/remark';
    static RequestParams: {
        club_id?: number;
        remark_name?: string;
        remark_desc?: string;
    } | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebOrgTribeClubRemark.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgTribeClubRemark.ResponseData;
    };
}

export class WebOrgTribeClubRemarkList extends WebCommon {
    static API: string = '/api/org/tribe/club/remark/list';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebOrgTribeClubRemarkList.Data;
    } | null = null;
    static Data: {
        list?: (typeof WebOrgTribeClubRemarkList.Info)[];
    } | null = null;
    static Info: {
        club_id?: number;
        remark_name?: string;
        remark_desc?: string;
    } | null = null;

    static Request(param: typeof WebOrgTribeClubRemarkList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgTribeClubRemarkList.ResponseData;
    };
}

export class WebOrgTribeClubUnlock extends WebCommon {
    static API: string = '/api/org/tribe/club/unlock';
    static RequestParams: {
        club_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgTribeClubUnlock.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebOrgTribeClubUnlock.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgTribeClubUnlock.ResponseData;
    };
}

export class WebOrgTribeCreate extends WebCommon {
    static API: string = '/api/org/tribe/create';
    static RequestParams: {
        tribe_name?: string;
        logo?: string;
        currency?: string;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgTribeCreate.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebOrgTribeCreate.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgTribeCreate.ResponseData;
    };
}

export class WebOrgTribeCreateIsFirst extends WebCommon {
    static API: string = '/api/org/tribe/create/is_first';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebOrgTribeCreateIsFirst.Data;
    } | null = null;
    static Data: {
        is_first?: number;
    } | null = null;

    static Request(param: typeof WebOrgTribeCreateIsFirst.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgTribeCreateIsFirst.ResponseData;
    };
}

export class WebOrgTribeFundGoldChangeLog extends WebCommon {
    static API: string = '/api/org/tribe/fund/gold_change/log';
    static RequestParams: {
        limit?: number;
        offset?: number;
        gold_type?: number;
        op_codes?: string[];
        start_time?: number;
        end_time?: number;
        sort_type?: number;
        order_type?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgTribeFundGoldChangeLog.Data;
    } | null = null;
    static Data: {
        limit?: number;
        offset?: number;
        total?: number;
        list?: (typeof WebOrgTribeFundGoldChangeLog.Record)[];
        total_info?: typeof WebOrgTribeFundGoldChangeLog.TotalInfo;
        diamond_info?: typeof WebOrgTribeFundGoldChangeLog.Diamondinfo;
        ratio_info?: typeof WebOrgTribeFundGoldChangeLog.RatioInfo;
        random_id?: number;
    } | null = null;
    static Diamondinfo: {
        consume_amount?: number;
        trans_to_tribe_amount?: number;
        trans_to_user_amount?: number;
    } | null = null;
    static TotalInfo: {
        grant_amount?: number;
        recover_amount?: number;
        profit_amount?: number;
    } | null = null;
    static RatioInfo: {
        service_ratio?: number;
        insur_ratio?: number;
    } | null = null;
    static Record: {
        gold_change?: number;
        gold_after?: number;
        create_time?: string;
        op_code?: string;
        name?: string;
        club_name?: string;
        club_random_num?: number;
        user_random_num?: number;
        user_nick_name?: string;
        src_room_id?: number;
        src_match_id?: number;
    } | null = null;

    static Request(param: typeof WebOrgTribeFundGoldChangeLog.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgTribeFundGoldChangeLog.ResponseData;
    };
}

export class WebOrgTribeInfoByClub extends WebCommon {
    static API: string = '/api/org/tribe/info_by_club';
    static RequestParams: {
        tribe_random_id?: number;
        club_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgTribeInfoByClub.Data;
    } | null = null;
    static Data: {
        tribe_base?: typeof WebOrgTribeInfoByClub.Info;
        club_relation?: number;
    } | null = null;
    static Info: {
        name?: string;
        random_id?: number;
        logo?: string;
    } | null = null;

    static Request(param: typeof WebOrgTribeInfoByClub.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgTribeInfoByClub.ResponseData;
    };
}

export class WebOrgTribeList extends WebCommon {
    static API: string = '/api/org/tribe/list';
    static RequestParams: {
        tribe_random_id?: number;
        sort_type?: number;
        order_type?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgTribeList.Data;
    } | null = null;
    static Data: {
        list?: (typeof WebOrgTribeList.CommunityData)[];
    } | null = null;
    static CommunityData: {
        id?: number;
        random_id?: number;
        name?: string;
        logo?: string;
        pretty_id?: number;
        members?: number;
        room_count?: number;
    } | null = null;

    static Request(param: typeof WebOrgTribeList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgTribeList.ResponseData;
    };
}

export class WebOrgTribeRoomPermissionS extends WebCommon {
    static API: string = '/api/org/tribe/room_permissions';
    static RequestParams: {
        club_id?: number;
        tribe_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgTribeRoomPermissionS.Data;
    } | null = null;
    static Data: {
        room_permissions?: unknown;
    } | null = null;

    static Request(param: typeof WebOrgTribeRoomPermissionS.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgTribeRoomPermissionS.ResponseData;
    };
}

export class WebOrgTribeSetTimeZone extends WebCommon {
    static API: string = '/api/org/tribe/set/time_zone';
    static RequestParams: {
        time_zone?: number;
    } | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebOrgTribeSetTimeZone.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgTribeSetTimeZone.ResponseData;
    };
}

export class WebOrgTribeSettIngClubProfitRatio extends WebCommon {
    static API: string = '/api/org/tribe/setting/club_profit_ratio';
    static RequestParams: {
        club_id?: number;
        room_game_ratio?: number;
        room_insur_ratio?: number;
        room_mtt_ratio?: number;
    } | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebOrgTribeSettIngClubProfitRatio.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgTribeSettIngClubProfitRatio.ResponseData;
    };
}

export class WebOrgTribeWallet extends WebCommon {
    static API: string = '/api/org/tribe/wallet';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebOrgTribeWallet.Data;
    } | null = null;
    static Data: {
        gold?: number;
        gold_lock?: number;
        forbidden?: boolean;
        usdt?: number;
        usdt_lock?: number;
        diamonds?: number;
        diamonds_lock?: number;
        random_id?: number;
    } | null = null;

    static Request(param: typeof WebOrgTribeWallet.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgTribeWallet.ResponseData;
    };
}

export class WebOrgUserAdminFavorIte extends WebCommon {
    static API: string = '/api/org/user/admin/favorite';
    static RequestParams: {
        club_id?: number;
        tribe_id?: number;
        favorite?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgUserAdminFavorIte.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebOrgUserAdminFavorIte.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgUserAdminFavorIte.ResponseData;
    };
}

export class WebOrgUserCheckOrg extends WebCommon {
    static API: string = '/api/org/user/check/org';
    static RequestParams: {
        club_id?: number;
        tribe_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgUserCheckOrg.Data;
    } | null = null;
    static Data: {
        is_in_club?: boolean;
        is_in_tribe?: boolean;
    } | null = null;

    static Request(param: typeof WebOrgUserCheckOrg.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgUserCheckOrg.ResponseData;
    };
}

export class WebOrgUserClubAdminList extends WebCommon {
    static API: string = '/api/org/user/club/admin/list';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebOrgUserClubAdminList.Data;
    } | null = null;
    static Data: {
        clubs?: (typeof WebOrgUserClubAdminList.ClubData)[];
    } | null = null;
    static ClubData: {
        id?: number;
        club_name?: string;
        logo?: string;
        random_id?: number;
        club_members?: number;
        tribe_id?: number;
        tribe_random_id?: number;
        user_level?: number;
        favorite?: number;
    } | null = null;

    static Request(param: typeof WebOrgUserClubAdminList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgUserClubAdminList.ResponseData;
    };
}

export class WebOrgUserNewLabelRead extends WebCommon {
    static API: string = '/api/org/user/new_label/read';
    static RequestParams: {
        tribe_id?: number;
    } | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebOrgUserNewLabelRead.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgUserNewLabelRead.ResponseData;
    };
}

export class WebOrgUserNewLabelReadNum extends WebCommon {
    static API: string = '/api/org/user/new_label/read/num';
    static RequestParams: {
        tribe_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebOrgUserNewLabelReadNum.Data;
    } | null = null;
    static Data: {
        user_new_label_num?: unknown;
    } | null = null;

    static Request(param: typeof WebOrgUserNewLabelReadNum.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgUserNewLabelReadNum.ResponseData;
    };
}

export class WebOrgUserSelfProfitBillNotifyConfim extends WebCommon {
    static API: string = '/api/org/user/self_profit/bill_notify/confim';
    static RequestParams: {
        bill_ids?: number[];
    } | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebOrgUserSelfProfitBillNotifyConfim.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgUserSelfProfitBillNotifyConfim.ResponseData;
    };
}

export class WebOrgUserSelfProfitBillUnnotIfy extends WebCommon {
    static API: string = '/api/org/user/self_profit/bill_unnotify';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebOrgUserSelfProfitBillUnnotIfy.Data;
    } | null = null;
    static Data: {
        data?: (typeof WebOrgUserSelfProfitBillUnnotIfy.BillData)[];
    } | null = null;
    static BillData: {
        amount?: number;
        bill_id?: number;
    } | null = null;

    static Request(param: typeof WebOrgUserSelfProfitBillUnnotIfy.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgUserSelfProfitBillUnnotIfy.ResponseData;
    };
}

export class WebOrgUserSelfProfitUnpayRecords extends WebCommon {
    static API: string = '/api/org/user/self_profit/unpay_records';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebOrgUserSelfProfitUnpayRecords.Data;
    } | null = null;
    static Data: {
        data?: (typeof WebOrgUserSelfProfitUnpayRecords.Record)[];
        amount_total_uc?: number;
        latest_pay_time?: number;
    } | null = null;
    static Record: {
        amount?: number;
        pay_time?: number;
        club_name?: string;
        club_rid?: number;
        club_logo?: string;
    } | null = null;

    static Request(param: typeof WebOrgUserSelfProfitUnpayRecords.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgUserSelfProfitUnpayRecords.ResponseData;
    };
}

export class WebOrgUserTribeAdminList extends WebCommon {
    static API: string = '/api/org/user/tribe/admin/list';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebOrgUserTribeAdminList.Data;
    } | null = null;
    static Data: {
        tribes?: (typeof WebOrgUserTribeAdminList.CommunityData)[];
    } | null = null;
    static CommunityData: {
        id?: number;
        random_id?: number;
        name?: string;
        club_count?: number;
        logo?: string;
        favorite?: number;
    } | null = null;

    static Request(param: typeof WebOrgUserTribeAdminList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebOrgUserTribeAdminList.ResponseData;
    };
}
