/*
 * @Author: xfj
 * @Date: 2022-08-22 00:32:52
 * @description:
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-02-24 18:55:43
 * @FilePath: /pokerqueen/assets/script/net/https/WebHelper.ts
 */
import * as WebRequestApis from './WebRequest';

export default class WebHelper {
    // 统一暴露 web_request 全量接口，方便外部按名字动态访问
    static readonly WebApis = WebRequestApis;
    // 仅保留带 API 常量的接口类映射
    static readonly WebApiClassMap: Record<string, any> = Object.freeze(
        Object.keys(WebRequestApis).reduce(
            (acc, key) => {
                const value: any = (WebRequestApis as any)[key];
                if (value && typeof value === 'function' && typeof value.API === 'string') {
                    acc[key] = value;
                }
                return acc;
            },
            {} as Record<string, any>
        )
    );
    /**
     * 忽略菊花的Web API接口
     */
    static _IgnoreShowJuhua_APIS = [
        //Web_Chat_Messages.API,
        //Web_Chat.API,
        //Web_Send_Messages.API,
        //Web_User_Voiceprint_suspect.API,
        //WebConfigGlobalConfig.API,
        WebRequestApis.WebMsgMessageUnread.API,
        WebRequestApis.WebRoomCenterGroups.API,
        // WebMiscBannerList.API,
        WebRequestApis.WebOrgClubCreate.API,
        WebRequestApis.WebOrgClubGet.API,
        WebRequestApis.WebOrgClubPlayerApplyList.API,
        WebRequestApis.WebOrgClubPlayerApplyList.API,
        WebRequestApis.WebOrgClubSearchById.API,
        WebRequestApis.WebOrgClubJoin.API,
        WebRequestApis.WebOrgClubCancleJoinClub.API,
        WebRequestApis.WebOrgClubApproValJoin.API,
        WebRequestApis.WebOrgClubGetJoinlList.API,
        WebRequestApis.WebOrgClubQuit.API,
        WebRequestApis.WebOrgClubShareAudit.API,
        WebRequestApis.WebOrgClubShareApproveList.API,
        WebRequestApis.WebOrgClubSharePendingList.API,
        WebRequestApis.WebOrgClubShareApplyList.API,
        WebRequestApis.WebStatsOtherUserStats.API
        //Web_Pay_Apple_Order_Recharge.API,
        //Web_Pay_Apple_Order_Verifyreceipt.API,
    ];

    private static IsApiMatched(patternApi: string, actualApi: string): boolean {
        if (patternApi === actualApi) return true;
        if (patternApi.indexOf('{') === -1) return false;
        const escaped = patternApi.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const wildcardPattern = escaped.replace(/\\\{[^}]+\\\}/g, '[^/]+');
        return new RegExp(`^${wildcardPattern}$`).test(actualApi);
    }

    static NeedJuhua(api: string): boolean {
        for (let i = 0; i < this._IgnoreShowJuhua_APIS.length; i += 1) {
            if (this.IsApiMatched(this._IgnoreShowJuhua_APIS[i], api)) {
                return false;
            }
        }
        return true;
    }

    //忽略打印信息的接口
    static _IgnoreConsole_APIS = [WebRequestApis.WebConfigMultiLanguageTemplate.API];

    static NeedConsole(api: string) {
        return this._IgnoreConsole_APIS.indexOf(api) == -1;
    }
}
