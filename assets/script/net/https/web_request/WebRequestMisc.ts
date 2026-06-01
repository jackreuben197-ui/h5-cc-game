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

export class WebMiscBannerList extends WebCommon {
    //接口地址
    static API: string = '/api/misc/banner/list';
    //字段声明
    static RequestParams: {
        lang?: string; //语言(zh_CN:简体中文,zh_HK:繁体中文,en_US:英文
        type?: number; //1-大厅Banner,2-发现页(公会)Banner
        limit?: number; //条目
        offset?: number; //开始下标。例子（offset=0，limit=10，0-9。）
    } | null = null;
    static ResponseData: {
        limit: number; //条目
        offset: number; //开始下标。例子（offset=0，limit=10，0-9。）
        total: number; //总条数
        list: (typeof WebMiscBannerList.BannerInfo)[]; // Banner列表
    } | null = null;
    static BannerInfo: {
        id: number; //banner id
        lang: string; //语言
        banner_type: number; //1-大厅Banner,2-发现页(公会)Banner
        image_url: string; //Banner图片连接
        redirect_url: string; //跳转连接
        description: string; //描述
    } | null = null;

    static Request(param: typeof WebMiscBannerList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMiscBannerList.ResponseData;
    };
}

export class WebMiscGameRecordRound extends WebCommon {
    static API: string = '/api/misc/game/record_round';
    static RequestParams: {
        id?: number;
        room_id?: number;
        match_id?: number;
        room_unique_id?: string;
        name?: string;
        hand_num?: number;
        change?: number;
        type?: number;
        open?: number;
    } | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebMiscGameRecordRound.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMiscGameRecordRound.ResponseData;
    };
}

export class WebMiscGameRoundList extends WebCommon {
    static API: string = '/api/misc/game/round/list';
    static RequestParams: {
        limit?: number;
        offset?: number;
    } | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebMiscGameRoundList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMiscGameRoundList.ResponseData;
    };
}

export class WebMiscGameRoundStatus extends WebCommon {
    static API: string = '/api/misc/game/get_round_status';
    static RequestParams: {
        room_id?: number;
        room_unique_id?: string;
        hand_num?: number;
    } | null = null;
    static Data: {
        records?: { remove?: number }[];
    } | null = null;
    static ResponseData: {
        data?: typeof WebMiscGameRoundStatus.Data;
    } | null = null;

    static Request(param: typeof WebMiscGameRoundStatus.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMiscGameRoundStatus.ResponseData;
    };
}

export class WebMiscGameRemoveRound extends WebCommon {
    static API: string = '/api/misc/game/remove_round';
    static RequestParams: {
        room_id?: number;
        room_unique_id?: string;
        hand_num?: number;
    } | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebMiscGameRemoveRound.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMiscGameRemoveRound.ResponseData;
    };
}

export class WebMiscReportFeedbackQuestIon extends WebCommon {
    static API: string = '/api/misc/report/feedback_question';
}

export class WebMiscPopupNewer extends WebCommon {
    static API: string = '/api/misc/popup/newer';
}

export class WebMiscAgoraToken extends WebCommon {
    static API: string = '/api/misc/agora/token';
    static RequestParams: {
        channel_name?: string;
        role?: number;
    } | null = null;
    static ResponseData: {
        data?: string;
    } | null = null;

    static Request(param: typeof WebMiscAgoraToken.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMiscAgoraToken.ResponseData;
    };
}

export class WebMiscArtiCleId extends WebCommon {
    static API: string = '/api/misc/article/{id}';
    static RequestParams: {
        limit?: number;
        offset?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebMiscArtiCleId.Data;
    } | null = null;
    static Data: {
        article?: typeof WebMiscArtiCleId.Record;
    } | null = null;
    static Record: {
        content_ex?: (typeof WebMiscArtiCleId.ContentData)[];
    } | null = null;
    static ContentData: {
        type?: string;
        value?: string;
    } | null = null;

    static Request(param: typeof WebMiscArtiCleId.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMiscArtiCleId.ResponseData;
    };
}

export class WebMiscArtiCleInfo extends WebCommon {
    static API: string = '/api/misc/article/info';
    static RequestParams: {
        lang?: string;
        type?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebMiscArtiCleInfo.Data;
    } | null = null;
    static Data: {
        article?: typeof WebMiscArtiCleInfo.Article;
    } | null = null;
    static Article: {
        content_ex?: (typeof WebMiscArtiCleInfo.ContentData)[];
    } | null = null;
    static ContentData: {
        value?: string;
    } | null = null;

    static Request(param: typeof WebMiscArtiCleInfo.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMiscArtiCleInfo.ResponseData;
    };
}

export class WebMiscArtiCleList extends WebCommon {
    static API: string = '/api/misc/article/list';
    static RequestParams: {
        type?: number;
        limit?: number;
        offset?: number;
        lang?: string;
    } | null = null;
    static ResponseData: {
        data?: typeof WebMiscArtiCleList.Data;
    } | null = null;
    static Data: {
        limit?: number;
        offset?: number;
        total?: number;
        list?: (typeof WebMiscArtiCleList.Record)[];
    } | null = null;
    static Record: {
        id?: number;
        title?: string;
        publish_time?: string;
        author?: string;
        lang?: string;
        summary?: string;
        banner_url?: string;
        read_num?: number;
        repost_num?: number;
        like_num?: number;
        author_url?: string;
        images_url?: string;
        content?: string;
    } | null = null;
    static ContentData: {
        type?: string;
        value?: string;
    } | null = null;

    static Request(param: typeof WebMiscArtiCleList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMiscArtiCleList.ResponseData;
    };
}

export class WebMiscArtiClenumSet extends WebCommon {
    static API: string = '/api/misc/article/num/set';
    static RequestParams: {
        id?: number;
        read_num?: number;
        repost_num?: number;
        like_num?: number;
    } | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebMiscArtiClenumSet.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMiscArtiClenumSet.ResponseData;
    };
}

export class WebMiscArtiClePushList extends WebCommon {
    static API: string = '/api/misc/article/push/list';
    static RequestParams: {
        types?: number[];
        limit?: number;
        offset?: number;
        lang?: string;
    } | null = null;
    static ResponseData: {
        data?: typeof WebMiscArtiClePushList.Data;
    } | null = null;
    static Data: {
        limit?: number;
        offset?: number;
        total?: number;
        list?: (typeof WebMiscArtiClePushList.Record)[];
    } | null = null;
    static Record: {
        publish_time?: string;
        article_list?: (typeof WebMiscArtiClePushList.ContentData)[];
    } | null = null;
    static ContentData: {
        id?: number;
        title?: string;
        banner_url?: string;
        start_time?: string;
        end_time?: string;
        location?: string;
        award?: string;
        match_status?: number;
    } | null = null;

    static Request(param: typeof WebMiscArtiClePushList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMiscArtiClePushList.ResponseData;
    };
}

export class WebMiscBannerLobby extends WebCommon {
    static API: string = '/api/misc/banner_lobby';
    static RequestParams: {
        lang?: string;
    } | null = null;
    static ResponseData: {
        data?: typeof WebMiscBannerLobby.Data;
    } | null = null;
    static Data: {
        lobby?: typeof WebMiscBannerLobby.BannerInfo;
    } | null = null;
    static BannerInfo: {
        resource_type?: number;
        image_url?: string;
        video_url?: string;
        video_cover_url?: string;
    } | null = null;

    static Request(param: typeof WebMiscBannerLobby.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMiscBannerLobby.ResponseData;
    };
}

export class WebMiscCurrencyDescriptionInfo extends WebCommon {
    static API: string = '/api/misc/currency_description/info';
    static RequestParams: {
        lang?: string;
    } | null = null;
    static ResponseData: {} | null = null;
    static Data: {
        currency_description?: typeof WebMiscCurrencyDescriptionInfo.ContentDetails;
    } | null = null;
    static ContentDetails: {
        status?: number;
    } | null = null;

    static Request(param: typeof WebMiscCurrencyDescriptionInfo.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMiscCurrencyDescriptionInfo.ResponseData;
    };
}

export class WebMiscCurrencyExchAgeRate extends WebCommon {
    static API: string = '/api/misc/currency_exchage_rate';
    static RequestParams: {
        from?: string;
        amount?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebMiscCurrencyExchAgeRate.Data;
    } | null = null;
    static Data: {
        amount?: number;
    } | null = null;

    static Request(param: typeof WebMiscCurrencyExchAgeRate.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMiscCurrencyExchAgeRate.ResponseData;
    };
}

export class WebMiscCurrencyExchAgeRateList extends WebCommon {
    static API: string = '/api/misc/currency_exchage_rate/list';
    static RequestParams: {
        from?: string;
        to?: string;
        amount?: number;
    } | null = null;
    static ResponseData: {
        data?: typeof WebMiscCurrencyExchAgeRateList.Data;
    } | null = null;
    static Data: {
        from_currency?: string;
        exchange_list?: (typeof WebMiscCurrencyExchAgeRateList.Currencies)[];
    } | null = null;
    static Currencies: {
        quotecurrency?: string;
        mid?: number;
    } | null = null;

    static Request(param: typeof WebMiscCurrencyExchAgeRateList.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMiscCurrencyExchAgeRateList.ResponseData;
    };
}

export class WebMiscFaceDetect extends WebCommon {
    static API: string = '/api/misc/face/detect';
    static RequestParams: {} | null = null;
    static ResponseData: {} | null = null;
    static Data: {
        detect_code?: number;
        liveness_type?: number;
    } | null = null;

    static Request(param: typeof WebMiscFaceDetect.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMiscFaceDetect.ResponseData;
    };
}

export class WebMiscFaceLivenessMultiPhoto extends WebCommon {
    static API: string = '/api/misc/face/liveness/multi_photo';
    static RequestParams: {} | null = null;
    static ResponseData: {} | null = null;
    static Data: {
        liveness?: boolean;
    } | null = null;

    static Request(param: typeof WebMiscFaceLivenessMultiPhoto.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMiscFaceLivenessMultiPhoto.ResponseData;
    };
}

export class WebMiscFaceRecog extends WebCommon {
    static API: string = '/api/misc/face/recog';
    static RequestParams: {
        room_id?: number;
        recog_id?: number;
    } | null = null;
    static ResponseData: {} | null = null;
    static Data: {
        recog?: boolean;
    } | null = null;

    static Request(param: typeof WebMiscFaceRecog.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMiscFaceRecog.ResponseData;
    };
}

export class WebMiscFaceRecogCheck extends WebCommon {
    static API: string = '/api/misc/face/recog/check';
    static RequestParams: {
        room_id?: number;
        recog_user_id?: number;
    } | null = null;
    static ResponseData: {} | null = null;
    static Data: {
        can_request?: boolean;
        req_total?: number;
        last_status?: number;
        last_time?: number;
        success_total?: number;
    } | null = null;

    static Request(param: typeof WebMiscFaceRecogCheck.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMiscFaceRecogCheck.ResponseData;
    };
}

export class WebMiscFaceRecogConfirm extends WebCommon {
    static API: string = '/api/misc/face/recog/confirm';
    static RequestParams: {
        recog_id?: number;
        confirm?: boolean;
    } | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebMiscFaceRecogConfirm.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMiscFaceRecogConfirm.ResponseData;
    };
}

export class WebMiscFaceRecogRequest extends WebCommon {
    static API: string = '/api/misc/face/recog/request';
    static RequestParams: {
        room_id?: number;
        recog_user_id?: number;
    } | null = null;
    static ResponseData: {} | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebMiscFaceRecogRequest.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMiscFaceRecogRequest.ResponseData;
    };
}

export class WebMiscFaceRecogResult extends WebCommon {
    static API: string = '/api/misc/face/recog/result';
    static RequestParams: {
        room_id?: number;
        recog_id?: number;
        recog?: boolean;
    } | null = null;
    static ResponseData: {} | null = null;
    static Data: {
        recog?: boolean;
    } | null = null;

    static Request(param: typeof WebMiscFaceRecogResult.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMiscFaceRecogResult.ResponseData;
    };
}

export class WebMiscFaceRecogRoomLast extends WebCommon {
    static API: string = '/api/misc/face/recog/room_last';
    static RequestParams: {
        room_type?: number;
        match_id?: number;
        room_id?: number;
    } | null = null;
    static ResponseData: {
        data?: (typeof WebMiscFaceRecogRoomLast.Data)[];
    } | null = null;
    static Data: {
        id?: number;
        room_type?: number;
        match_id?: number;
        room_id?: number;
        request_user_rid?: number;
        recog_user_rid?: number;
        status?: number;
        request_user_name?: string;
        recog_user_name?: string;
        timeout_stamp?: number;
    } | null = null;

    static Request(param: typeof WebMiscFaceRecogRoomLast.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMiscFaceRecogRoomLast.ResponseData;
    };
}

export class WebMiscFaceSave extends WebCommon {
    static API: string = '/api/misc/face/save';
    static RequestParams: {} | null = null;
    static ResponseData: {} | null = null;

    static Request(param: typeof WebMiscFaceSave.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMiscFaceSave.ResponseData;
    };
}

export class WebMiscFaceSaveLimit extends WebCommon {
    static API: string = '/api/misc/face/save/limit';
    static RequestParams: {} | null = null;
    static ResponseData: {
        data?: typeof WebMiscFaceSaveLimit.Data;
    } | null = null;
    static Data: {
        global_limit?: number;
        user_used?: number;
    } | null = null;

    static Request(param: typeof WebMiscFaceSaveLimit.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMiscFaceSaveLimit.ResponseData;
    };
}

export class WebMiscFaceSeatCancelRecog extends WebCommon {
    static API: string = '/api/misc/face/seat_cancel_recog';
    static RequestParams: {
        room_id?: number;
    } | null = null;
    static ResponseData: {} | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebMiscFaceSeatCancelRecog.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMiscFaceSeatCancelRecog.ResponseData;
    };
}

export class WebMiscFaceSeatRecog extends WebCommon {
    static API: string = '/api/misc/face/seat_recog';
    static RequestParams: {
        room_id?: number;
    } | null = null;
    static ResponseData: {} | null = null;
    static Data: {
        recog?: boolean;
    } | null = null;

    static Request(param: typeof WebMiscFaceSeatRecog.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMiscFaceSeatRecog.ResponseData;
    };
}

export class WebMiscGameRoundListDataByRoom extends WebCommon {
    static API: string = '/api/misc/game/round/list/data_by_room';
    static RequestParams: {
        club_id?: number;
        tribe_id?: number;
        limit?: number;
        offset?: number;
        game_types?: number[];
        poker_types?: number[];
    } | null = null;
    static ResponseData: {
        data?: typeof WebMiscGameRoundListDataByRoom.Data;
    } | null = null;
    static Data: {
        limit?: number;
        offset?: number;
        total?: number;
        list?: (typeof WebMiscGameRoundListDataByRoom.Record)[];
    } | null = null;
    static RoomRecord: {
        small_blind?: number;
        room_id?: number;
        name?: string;
        gold_type?: number;
        game_type?: number;
        poker_type?: number;
        random_ante?: string;
    } | null = null;
    static UserGameRecord: {
        id?: number;
        type?: number;
        room_id?: number;
        match_id?: number;
        name?: string;
        multi_lang_names_obj?: unknown;
        user_id?: number;
        hand_num?: number;
        open?: number;
        change?: number;
        create_time?: string;
        room_unique_id?: string;
        data?: string;
        replay?: unknown;
        replay_ft?: unknown;
        bet_pot?: number;
        encrypt_cards?: unknown;
        gold_type?: number;
        jackpot_award?: number;
    } | null = null;
    static Record: {
        room_record?: typeof WebMiscGameRoundListDataByRoom.RoomRecord;
        user_game_records?: (typeof WebMiscGameRoundListDataByRoom.UserGameRecord)[];
        total?: number;
    } | null = null;

    static Request(param: typeof WebMiscGameRoundListDataByRoom.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMiscGameRoundListDataByRoom.ResponseData;
    };
}

export class WebMiscTranslate extends WebCommon {
    static API: string = '/api/misc/translate';
    static RequestParams: {
        text?: string;
        target?: string;
    } | null = null;
    static ResponseData: {
        data?: string;
    } | null = null;
    static Data: {} | null = null;

    static Request(param: typeof WebMiscTranslate.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebMiscTranslate.ResponseData;
    };
}
