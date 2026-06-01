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

export class WebTicketCreate extends WebCommon {
    //接口地址
    static API: string = '/api/cmsext/exchange/ticket/create';
    //字段声明
    // static RequestParams: {
    //     user_id: number,// 玩家ID
    //     user_random_id: number,// 玩家randomID
    //     phone: number,// 电话
    //     email: string,// 邮箱
    //     ticket_type: number,// 问题类型
    //     description: string,//  问题描述
    //     img_url: string,//  图片描述
    // } = null;
}

export class WebOrgCreateTemplate extends WebCommon {
    //接口地址
    static API: string = '/api/cmsext/room/template/create';
}

export class WebOrggetTemplate extends WebCommon {
    //接口地址
    static API: string = '/api/cmsext/room/template/list';
}

export class WebOrgTemplateDelete extends WebCommon {
    //接口地址
    static API: string = '/api/cmsext/room/template/delete';
}

export class WebOrgUpdateTemplate extends WebCommon {
    //接口地址
    static API: string = '/api/cmsext/room/template/update';
}

export class WebOrgRoomCreate extends WebCommon {
    //接口地址
    static API: string = '/api/cmsext/room/create';
}

export class WebOrggetRoomConfig extends WebCommon {
    //接口地址
    static API: string = '/api/cmsext/room/fixed/config';
}

export class WebOrgRoomConfigCreate extends WebCommon {
    //接口地址
    static API: string = '/api/cmsext/room/config/create';
}

export class WebOrgClubActivityCreate extends WebCommon {
    public static API: string = '/api/cmsext/activity/club/update';
    //字段声明
    // public static RequestParams: {
    //     club_id: number,  //
    //     activity_type: number,  //
    //     description: string,
    //     img_url: string,
    // } = null;
}

export class WebOrgClubActivityInfo extends WebCommon {
    public static API: string = '/api/cmsext/activity/club/info';
}

export class WebOrgRoomBatchCreate extends WebCommon {
    public static API: string = '/api/cmsext/room/club/batch/create';
}

export class WebOrgRoomClubCreate extends WebCommon {
    public static API: string = '/api/cmsext/room/club/config/create';
}

export class WebOrgClubNoticeUpdate extends WebCommon {
    public static API: string = '/api/cmsext/club/notice_update';
}

export class WebOrgClubNoticeGet extends WebCommon {
    public static API: string = '/api/cmsext/club/notice_get';
}

export class WebOrgClubNotice extends WebCommon {
    public static API: string = '/api/cmsext/club/notice';
}

export class WebOrgClubNoticeIgnore extends WebCommon {
    public static API: string = '/api/cmsext/club/user/notice_ignore';
}

export class WebOrgClubSharePendingList extends WebCommon {
    public static API: string = '/api/cmsext/club/share/pending/list';
}

export class WebOrgClubShareAudit extends WebCommon {
    public static API: string = '/api/cmsext/club/share/audit';
}

export class WebOrgClubShareApplyList extends WebCommon {
    public static API: string = '/api/cmsext/club/share/apply/list';
}

export class WebOrgClubShareApproveList extends WebCommon {
    public static API: string = '/api/cmsext/club/share/approve/list';
}

export class WebMttUserWallet extends WebCommon {
    // let api = GC.language.formatString(WebMtt.USER_WALLET, this.list.select.match_id);
    public static API: string = '/api/cmsext/club/share/approve/list';
}

export class WebCmsExtActivityClubAdd extends WebCommon {
    static API: string = '/api/cmsext/activity/club/add';
    static RequestParams: {
        activity_type?: number;
        description?: string;
        img_url?: string;
        home_img_url?: string;
        start_time?: number;
        end_time?: number;
        sort?: number;
    } | null = null;
    static ResponseData: {} | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebCmsExtActivityClubAdd.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebCmsExtActivityClubAdd.ResponseData;
    };
}

export class WebCmsExtActivityClubAdminList extends WebCommon {
    static API: string = '/api/cmsext/activity/club/admin_list';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebCmsExtActivityClubAdminList.Data;
    } | null = null;
    static Data: {
        list?: (typeof WebCmsExtActivityClubAdminList.Info)[];
    } | null = null;
    static Info: {
        img_url?: string;
        start_time?: string;
        end_time?: string;
        publish?: number;
        home_img_url?: string;
        sort?: number;
        audit_status?: number;
    } | null = null;

    static Request(param: typeof WebCmsExtActivityClubAdminList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebCmsExtActivityClubAdminList.ResponseData;
    };
}

export class WebCmsExtActivityClubMyList extends WebCommon {
    static API: string = '/api/cmsext/activity/club/my_list';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebCmsExtActivityClubMyList.Data;
    } | null = null;
    static Data: {
        list?: (typeof WebCmsExtActivityClubMyList.Info)[];
    } | null = null;
    static Info: {
        description?: string;
        img_url?: string;
        start_time?: string;
        end_time?: string;
        publish?: number;
        home_img_url?: string;
        sort?: number;
        audit_status?: number;
    } | null = null;

    static Request(param: typeof WebCmsExtActivityClubMyList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebCmsExtActivityClubMyList.ResponseData;
    };
}

export class WebCmsExtClubShare0List extends WebCommon {
    static API: string = '/api/cmsext/club/share/{0}/list';
    static RequestParams: {
        limit?: number;
        offset?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebCmsExtClubShare0List.Data;
    } | null = null;
    static Data: {
        data?: (typeof WebCmsExtClubShare0List.ShareTableData)[];
        limit?: number;
        offset?: number;
        total?: number;
    } | null = null;
    static ShareTableData: {
        id?: number;
        create_time?: string;
        apply_club_random_id?: number;
        apply_club_name?: string;
        apply_club_logo?: string;
        share_club_name?: string;
        share_club_logo?: string;
        sb?: number;
        private_room?: number;
        ante?: number;
        seat_count?: number;
        play_duration?: number;
        game_type?: number;
        poker_type?: number;
        squid_base?: number;
        mushroom_base?: number;
    } | null = null;

    static Request(param: typeof WebCmsExtClubShare0List.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebCmsExtClubShare0List.ResponseData;
    };
}

export class WebCmsExtHotUpdateTemplateList extends WebCommon {
    static API: string = '/api/cmsext/hot_update/template/list';
    static RequestParams: {
        last_update_time?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebCmsExtHotUpdateTemplateList.Data;
    } | null = null;
    static Data: {
        data?: unknown[];
        last_update_time?: number;
    } | null = null;

    static Request(param: typeof WebCmsExtHotUpdateTemplateList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebCmsExtHotUpdateTemplateList.ResponseData;
    };
}

export class WebCmsExtImServiceLink extends WebCommon {
    static API: string = '/api/cmsext/im/service/link';
    static RequestParams: {
        im_service_no?: string;
        language?: string;
        im_service_type?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebCmsExtImServiceLink.Data;
    } | null = null;
    static Data: {
        im_link?: string;
    } | null = null;

    static Request(param: typeof WebCmsExtImServiceLink.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebCmsExtImServiceLink.ResponseData;
    };
}

export class WebCmsExtImServiceList extends WebCommon {
    static API: string = '/api/cmsext/im/service/list';
    static RequestParams: {
        im_service_type?: number;
    } | null = null;
    static ResponseData: {
        data?: (typeof WebCmsExtImServiceList.Data)[];
    } | null = null;
    static Data: {
        im_service_no?: string;
        service_begin_time?: number;
        service_end_time?: number;
    } | null = null;

    static Request(param: typeof WebCmsExtImServiceList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebCmsExtImServiceList.ResponseData;
    };
}

export class WebCmsExtMiniGameClubConfigCreate extends WebCommon {
    static API: string = '/api/cmsext/mini_game/club/config/create';
    static RequestParams: {
        name?: string;
        room_config?: unknown;
    } | null = null;
    static ResponseData: {
        data?: typeof WebCmsExtMiniGameClubConfigCreate.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebCmsExtMiniGameClubConfigCreate.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebCmsExtMiniGameClubConfigCreate.ResponseData;
    };
}

export class WebCmsExtMiniGameConfigCreate extends WebCommon {
    static API: string = '/api/cmsext/mini_game/config/create';
    static RequestParams: {
        name?: string;
        room_config?: unknown;
    } | null = null;
    static ResponseData: {
        data?: typeof WebCmsExtMiniGameConfigCreate.Data;
    } | null = null;
    static Data: {
        room_id?: number;
        room_config?: unknown;
    } | null = null;

    static Request(param: typeof WebCmsExtMiniGameConfigCreate.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebCmsExtMiniGameConfigCreate.ResponseData;
    };
}

export class WebCmsExtMiniGameTribeConfigCreate extends WebCommon {
    static API: string = '/api/cmsext/mini_game/tribe/config/create';
    static RequestParams: {
        name?: string;
        room_config?: unknown;
    } | null = null;
    static ResponseData: {
        data?: typeof WebCmsExtMiniGameTribeConfigCreate.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebCmsExtMiniGameTribeConfigCreate.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebCmsExtMiniGameTribeConfigCreate.ResponseData;
    };
}

export class WebCmsExtMttConfigCreate extends WebCommon {
    static API: string = '/api/cmsext/mtt/config/create';
    static RequestParams: {
        template?: unknown;
        enter_before?: number;
        start_time?: number;
        apply_time?: number;
        create_mtt?: boolean;
    } | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebCmsExtMttConfigCreate.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebCmsExtMttConfigCreate.ResponseData;
    };
}

export class WebCmsExtMttCreate extends WebCommon {
    static API: string = '/api/cmsext/mtt/create';
    static RequestParams: {
        template_id?: number;
        enter_before?: number;
        start_time?: number;
        apply_time?: number;
    } | null = null;
    static ResponseData: {} | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebCmsExtMttCreate.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebCmsExtMttCreate.ResponseData;
    };
}

export class WebCmsExtMttTemplateCreate extends WebCommon {
    static API: string = '/api/cmsext/mtt/template/create';
    static RequestParams: {
        template?: unknown;
        enter_before?: number;
        start_time?: number;
        apply_time?: number;
        create_mtt?: boolean;
    } | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebCmsExtMttTemplateCreate.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebCmsExtMttTemplateCreate.ResponseData;
    };
}

export class WebCmsExtMttTemplateDeleteId extends WebCommon {
    static API: string = '/api/cmsext/mtt/template/delete/{id}';
    static RequestParams: {} | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebCmsExtMttTemplateDeleteId.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebCmsExtMttTemplateDeleteId.ResponseData;
    };
}

export class WebCmsExtMttTemplateList extends WebCommon {
    static API: string = '/api/cmsext/mtt/template/list';
    static RequestParams: {
        limit?: number;
        offset?: number;
        game_type?: number[];
        poker_type?: number[];
        origin_type?: number;
        search?: string;
        week_switch?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebCmsExtMttTemplateList.Data;
    } | null = null;
    static Data: {
        limit?: number;
        offset?: number;
        total?: number;
        templates?: unknown[];
    } | null = null;

    static Request(param: typeof WebCmsExtMttTemplateList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebCmsExtMttTemplateList.ResponseData;
    };
}

export class WebCmsExtMttTemplateUpdate extends WebCommon {
    static API: string = '/api/cmsext/mtt/template/update';
    static RequestParams: {
        template?: unknown;
        enter_before?: number;
        start_time?: number;
        apply_time?: number;
        create_mtt?: boolean;
    } | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebCmsExtMttTemplateUpdate.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebCmsExtMttTemplateUpdate.ResponseData;
    };
}

export class WebCmsExtMttTemplateWeekSwitchUpdate extends WebCommon {
    static API: string = '/api/cmsext/mtt/template/week_switch/update';
    static RequestParams: {
        template_id?: number;
        week_switch?: number;
    } | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebCmsExtMttTemplateWeekSwitchUpdate.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebCmsExtMttTemplateWeekSwitchUpdate.ResponseData;
    };
}

export class WebCmsExtRoomSmallBlindAnte extends WebCommon {
    static API: string = '/api/cmsext/room/small_blind/ante';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: (typeof WebCmsExtRoomSmallBlindAnte.Data)[];
    } | null = null;
    static Data: {
        key?: number;
        value?: number[];
    } | null = null;

    static Request(param: typeof WebCmsExtRoomSmallBlindAnte.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebCmsExtRoomSmallBlindAnte.ResponseData;
    };
}

export class WebCmsExtRoomTemplate0 extends WebCommon {
    static API: string = '/api/cmsext/room/template/{0}';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebCmsExtRoomTemplate0.Data;
    } | null = null;
    static Data: {
        data?: unknown;
    } | null = null;

    static Request(param: typeof WebCmsExtRoomTemplate0.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebCmsExtRoomTemplate0.ResponseData;
    };
}

export class WebCmsExtRoomTemplateStatus extends WebCommon {
    static API: string = '/api/cmsext/room/template/status';
    static RequestParams: {
        id?: number;
        status?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebCmsExtRoomTemplateStatus.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebCmsExtRoomTemplateStatus.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebCmsExtRoomTemplateStatus.ResponseData;
    };
}

export class WebCmsExtRoomTribeConfigCreate extends WebCommon {
    static API: string = '/api/cmsext/room/tribe/config/create';
    static RequestParams: {
        name?: string;
        room_config?: unknown;
    } | null = null;
    static ResponseData: {
        data?: typeof WebCmsExtRoomTribeConfigCreate.Data;
    } | null = null;
    static Data: {
        room_id?: number;
        room_config?: unknown;
    } | null = null;

    static Request(param: typeof WebCmsExtRoomTribeConfigCreate.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebCmsExtRoomTribeConfigCreate.ResponseData;
    };
}

export class WebCmsExtRoomUserBatchCreate extends WebCommon {
    static API: string = '/api/cmsext/room/user/batch/create';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: number;
    } | null = null;
    static Info: {
        template_id?: number;
        count?: number;
    } | null = null;

    static Request(param: typeof WebCmsExtRoomUserBatchCreate.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebCmsExtRoomUserBatchCreate.ResponseData;
    };
}

export class WebCmsExtRoomUserTemplateList extends WebCommon {
    static API: string = '/api/cmsext/room/user/template/list';
    static RequestParams: {
        mode?: number;
        limit?: number;
        offset?: number;
        bombpot?: number[];
        game_type_arr?: number[];
        poker_type?: number[];
    } | null = null;
    static ResponseData: {
        data?: typeof WebCmsExtRoomUserTemplateList.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebCmsExtRoomUserTemplateList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebCmsExtRoomUserTemplateList.ResponseData;
    };
}

export class WebCmsExtSngClubConfigCreate extends WebCommon {
    static API: string = '/api/cmsext/sng/club/config/create';
    static RequestParams: {} | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebCmsExtSngClubConfigCreate.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebCmsExtSngClubConfigCreate.ResponseData;
    };
}

export class WebCmsExtSngConfigCreate extends WebCommon {
    static API: string = '/api/cmsext/sng/config/create';
    static RequestParams: {
        name?: string;
        anti_cheat_order_mic_type?: number;
        anti_cheat_order_type?: number;
        anti_cheat_type?: number;
        anti_cheat_video_type?: number;
        apply_fee_hunter?: number;
        apply_fee_pool?: number;
        apply_fee_service?: number;
        blindtable_type?: number;
        end_time?: number;
        game_icon?: string;
        game_play_type?: number;
        game_type?: number;
        initial_score?: number;
        limit_auto_check_times?: number;
        limit_auto_fold_times?: number;
        limit_buy_in?: number;
        limit_delay_times?: number;
        limit_participants?: number;
        op_duration?: number;
        plo_game_type?: number;
        prize_type?: number;
        prizes?: (typeof WebCmsExtSngConfigCreate.Prize)[];
        start_time?: number;
        upblind_interval?: number;
        video_verify_type?: number;
        blind_level_delay_time_table?: unknown[];
        delay_time_type?: number;
        max_delay_times?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebCmsExtSngConfigCreate.Data;
    } | null = null;
    static Prize: {
        award_ratio?: number;
        rank_max?: number;
        rank_min?: number;
        award?: number;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebCmsExtSngConfigCreate.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebCmsExtSngConfigCreate.ResponseData;
    };
}

export class WebCmsExtSngTribeConfigCreate extends WebCommon {
    static API: string = '/api/cmsext/sng/tribe/config/create';
    static RequestParams: {} | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebCmsExtSngTribeConfigCreate.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebCmsExtSngTribeConfigCreate.ResponseData;
    };
}

export class WebCmsExtUserComplaIntReport extends WebCommon {
    static API: string = '/api/cmsext/user/complaint/report';
    static RequestParams: {
        type?: number;
        room_id?: number;
        match_id?: number;
        hand_num?: number;
        room_unique_id?: string;
        content?: string;
        user_game_record_id?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebCmsExtUserComplaIntReport.Data;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebCmsExtUserComplaIntReport.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebCmsExtUserComplaIntReport.ResponseData;
    };
}

export class WebCmsExtWheelTemplateList extends WebCommon {
    static API: string = '/api/cmsext/wheel/template/list';
    static RequestParams: {
        limit?: number;
        offset?: number;
        ids?: number[];
        status?: number;
        club_id?: number;
        tribe_id?: number;
        all_room_template?: number;
        all_manual_room?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebCmsExtWheelTemplateList.Data;
    } | null = null;
    static Data: {
        data?: unknown[];
        limit?: number;
        offset?: number;
        total?: number;
    } | null = null;

    static Request(param: typeof WebCmsExtWheelTemplateList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebCmsExtWheelTemplateList.ResponseData;
    };
}
