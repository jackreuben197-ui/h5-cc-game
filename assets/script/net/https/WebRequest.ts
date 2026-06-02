export * from './WebRequestBase';

export * from './web_request/WebRequestBackpack';

export * from './web_request/WebRequestChat';

export * from './web_request/WebRequestChromedp';

export * from './web_request/WebRequestCmsExt';

export * from './web_request/WebRequestConfig';

export * from './web_request/WebRequestMiscCombine';

export * from './web_request/WebRequestDataStat';

export * from './web_request/WebRequestFunction';

export * from './web_request/WebRequestGc';

export * from './web_request/WebRequestImoss';

export * from './web_request/WebRequestMisc';

export * from './web_request/WebRequestMsg';

export * from './web_request/WebRequestMttRoom';

export * from './web_request/WebRequestOrder';

export * from './web_request/WebRequestOrg';

export * from './web_request/WebRequestOss';

export * from './web_request/WebRequestPay';

export * from './web_request/WebRequestProp';

export * from './web_request/WebRequestRecord';

export * from './web_request/WebRequestRoom';

export * from './web_request/WebRequestRoomCenter';

export * from './web_request/WebRequestStats';

export * from './web_request/WebRequestUser';

export * from './web_request/WebRequestUserTask';

export * from './web_request/WebRequestUserProxy';
import { WebConfigGlobalConfig, WebConfigMultiLanguageTemplate } from './web_request/WebRequestConfig';
import { WebMiscBannerList } from './web_request/WebRequestMisc';
import { WebMsgMessageUnread } from './web_request/WebRequestMsg';
import {
    WebOrgClubApproValJoin,
    WebOrgClubCancleJoinClub,
    WebOrgClubCreate,
    WebOrgClubGet,
    WebOrgClubGetJoinlList,
    WebOrgClubIsManger,
    WebOrgClubJoin,
    WebOrgClubPlayerApplyList,
    WebOrgClubQuit,
    WebOrgClubSearchById
} from './web_request/WebRequestOrg';
import { WebRoomCenterGroups, WebRoomCenterMttList, WebRoomCenterRooms, WebRoomCenterRoomsBlinds } from './web_request/WebRequestRoomCenter';
import { API_User_Rooms_ids, API_User_Rooms_List, WebChannel, WebLogin, WebUserInfo, WebUserRoom, WebUserRoomSettleDetail } from './web_request/WebRequestUser';

/**
 * 注册全局访问
 */
(window as any).WebLogin = WebLogin;

(window as any).WebUserInfo = WebUserInfo;

(window as any).WebChannel = WebChannel;

(window as any).WebConfigGlobalConfig = WebConfigGlobalConfig;

(window as any).WebConfigMultiLanguageTemplate = WebConfigMultiLanguageTemplate;

(window as any).WebMiscBannerList = WebMiscBannerList;

(window as any).WebRoomCenterGroups = WebRoomCenterGroups;

(window as any).WebMsgMessageUnread = WebMsgMessageUnread;

(window as any).WebRoomCenterRoomsBlinds = WebRoomCenterRoomsBlinds;

(window as any).WebRoomCenterRooms = WebRoomCenterRooms;

(window as any).WebOrgClubCreate = WebOrgClubCreate;

(window as any).WebOrgClubGet = WebOrgClubGet;

(window as any).WebOrgClubPlayerApplyList = WebOrgClubPlayerApplyList;

(window as any).WebOrgClubSearchById = WebOrgClubSearchById;

(window as any).WebOrgClubJoin = WebOrgClubJoin;

(window as any).WebOrgClubCancleJoinClub = WebOrgClubCancleJoinClub;

(window as any).WebOrgClubApproValJoin = WebOrgClubApproValJoin;

(window as any).WebOrgClubGetJoinlList = WebOrgClubGetJoinlList;

(window as any).WebOrgClubQuit = WebOrgClubQuit;

(window as any).WebOrgClubIsManger = WebOrgClubIsManger;

(window as any).WebUserRoomSettleDetail = WebUserRoomSettleDetail;

(window as any).WebRoomCenterMttList = WebRoomCenterMttList;

(window as any).WebUserRoom = WebUserRoom;

//! 获取牌桌相关的信息：
(window as any).API_User_Rooms_List = API_User_Rooms_List;

(window as any).API_User_Rooms_ids = API_User_Rooms_ids;
