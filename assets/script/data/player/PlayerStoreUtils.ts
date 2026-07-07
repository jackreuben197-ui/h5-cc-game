import { traceClass, traceMethod } from '../../core/decorator/LogTrace';
import TexasGameRoomData from '../room/texas/TexasGameRoomData';
import TexasGameRoomDataPlayer from '../room/texas/TexasGameRoomDataPlayer';
import {
    WebChatMessageReport,
    WebCmsExtUserComplaIntReport,
    WebMiscCombine,
    WebOrgClubUserRemaRks,
    WebPropChatPropList,
    WebRoomCenterRoomUserLeave,
    WebRoomCenterRoomUserStandUp,
    WebUserDiamondSend,
    WebUserMute,
    WebUserMuteList,
    WWW
} from '../../net/https/WebRequest';
import { HttpChatMessageReport } from '../../net/https/data/chat/HttpChatMessageReport';
import { HttpCmsExtUserComplaintReport } from '../../net/https/data/cmsext/HttpCmsExtUserComplaintReport';
import { HttpMiscCombine } from '../../net/https/data/misc/HttpMiscCombine';
import { WebResponseDataBase } from '../../net/https/data/other/WebResponseDataBase';
import { HttpOrgClubUserUpdate } from '../../net/https/data/org/HttpOrgClubUserUpdate';
import { HttpPropChatPropList } from '../../net/https/data/prop/HttpPropChatPropList';
import { HttpRoomUserMuteProtocol } from '../../net/https/data/room/HttpRoomUserMuteProtocol';
import { HttpRoomCenterRoomUserLeave } from '../../net/https/data/roomcenter/HttpRoomCenterRoomUserLeave';
import { HttpRoomCenterRoomUserStandUp } from '../../net/https/data/roomcenter/HttpRoomCenterRoomUserStandUp';
import { HttpStatsOtherUserStats } from '../../net/https/data/stats/HttpStatsOtherUserStats';
import { HttpUserDiamondSend } from '../../net/https/data/user/HttpUserDiamondSend';
import { HttpUserMuteList } from '../../net/https/data/user/HttpUserMuteList';
import playerStore, { PlayerReportParam, PlayerPropData } from './PlayerStore';

const CONSUME_TYPE_EMOJI_2 = 6;
type StatsCombineResult = HttpStatsOtherUserStats.Data | HttpStatsOtherUserStats.ResponseData;

@traceClass()
export default class PlayerStoreUtils {
    public static syncSeatPlayer(player: TexasGameRoomDataPlayer): void {
        if (!player.seated || !player.userID) return;
        playerStore.updateBasicInfo({
            nick_name: player.name,
            avatar: player.avatar,
            random_num: player.userID
        });
    }

    public static async getStats(roomData: TexasGameRoomData, userRID: number): Promise<HttpStatsOtherUserStats.Data | null> {
        const statsBody = new HttpStatsOtherUserStats.RequestData();
        statsBody.game_type = roomData.basicInfo.gameType;
        statsBody.poker_type = roomData.basicInfo.pokerType;
        statsBody.gold_type = roomData.basicInfo.goldType;
        statsBody.origin_type = roomData.basicInfo.originType;
        statsBody.room_id = roomData.roomID;
        statsBody.user_random_id = [userRID];
        const body = new HttpMiscCombine.RequestData();
        body.api_list = [WebMiscCombine.ApiType.OTHER_USER_STATS];
        body.user_stats_by_user_rid_req = statsBody;
        const res = await WWW.Instance.CommonAPI<HttpMiscCombine.ResponseData>({
            web_class: WebMiscCombine,
            body,
            juhua: false,
            useCache: true
        });
        if (res.code != 0) {
            PlayerStoreUtils.tracelog.error('get HttpMiscCombine other user stats error', res.code);
            return null;
        }
        const data = res.data.user_stats_by_user_rid_resp;
        const first = Array.isArray(data) ? data[0] : data;
        return PlayerStoreUtils._normalizeStatsData(first);
    }

    private static _normalizeStatsData(data: StatsCombineResult): HttpStatsOtherUserStats.Data | null {
        if (!data) return null;
        return (data as HttpStatsOtherUserStats.ResponseData).data || (data as HttpStatsOtherUserStats.Data);
    }

    public static async saveRemark(roomData: TexasGameRoomData, dbUserID: number, remark: string): Promise<HttpOrgClubUserUpdate.ResponseData> {
        const body = new HttpOrgClubUserUpdate.RequestData();
        body.club_id = roomData.basicInfo.clubID || 0;
        body.user_id = dbUserID;
        body.remark_name = remark;
        body.remark_desc = '';
        return WWW.Instance.CommonAPI<HttpOrgClubUserUpdate.ResponseData>({
            web_class: WebOrgClubUserRemaRks,
            body
        });
    }

    public static async getMuteState(roomData: TexasGameRoomData, userRID: number): Promise<boolean> {
        if (!roomData.basicInfo.clubID && !roomData.basicInfo.tribeID) return false;
        const body = new HttpUserMuteList.RequestData();
        if (roomData.basicInfo.clubID) body.club_id = roomData.basicInfo.clubID;
        if (roomData.basicInfo.tribeID) body.tribe_id = roomData.basicInfo.tribeID;
        body.user_ids = [userRID];
        const res = await WWW.Instance.CommonAPI<HttpUserMuteList.ResponseData>({
            web_class: WebUserMuteList,
            body,
            juhua: false
        });
        if (res.code != 0) {
            PlayerStoreUtils.tracelog.error('get HttpUserMuteList error', res.code);
            return false;
        }
        const ids = res.data?.ids || [];
        return ids.indexOf(userRID) >= 0;
    }

    public static setMuteState(roomData: TexasGameRoomData, userRID: number, mute: boolean): Promise<HttpRoomUserMuteProtocol.ResponseData> {
        const body = new HttpRoomUserMuteProtocol.RequestData();
        if (roomData.basicInfo.clubID) body.club_id = roomData.basicInfo.clubID;
        if (roomData.basicInfo.tribeID) body.tribe_id = roomData.basicInfo.tribeID;
        body.user_id = userRID;
        body.mute = mute;
        return WWW.Instance.CommonAPI<HttpRoomUserMuteProtocol.ResponseData>({
            web_class: WebUserMute,
            body
        });
    }

    public static sendDiamond(targetUserRID: number, amount: number): Promise<HttpUserDiamondSend.ResponseData> {
        const body = new HttpUserDiamondSend.RequestData();
        body.target_user_id = targetUserRID;
        body.send_type = 2;
        body.amount = amount;
        return WWW.Instance.CommonAPI<HttpUserDiamondSend.ResponseData>({
            web_class: WebUserDiamondSend,
            body
        });
    }

    @traceMethod()
    public static async preparePropList(): Promise<void> {
        const body = new HttpPropChatPropList.RequestData();
        body.prop_type = 4;
        body.prop_types = [4];
        body.offset = 0;
        body.limit = 20;
        const res = await WWW.Instance.CommonAPI<HttpPropChatPropList.ResponseData>({
            web_class: WebPropChatPropList,
            body,
            juhua: false
        });
        if (res.code != 0) {
            PlayerStoreUtils.tracelog.error('get HttpPropChatPropList error', res.code);
            return;
        }
        const list = res.data?.list || [];
        const propList: PlayerPropData[] = list.map(item => ({
            payPrice: item.pay_price || 0,
            priceID: item.price_id || CONSUME_TYPE_EMOJI_2
        }));
        playerStore.updatePropList(propList);
    }

    public static standUp(roomData: TexasGameRoomData, userRID: number): Promise<HttpRoomCenterRoomUserStandUp.ResponseData> {
        const body = new HttpRoomCenterRoomUserStandUp.RequestData();
        body.room_id = roomData.roomID;
        body.user_random_id = userRID;
        return WWW.Instance.CommonAPI<HttpRoomCenterRoomUserStandUp.ResponseData>({
            web_class: WebRoomCenterRoomUserStandUp,
            body
        });
    }

    public static leaveRoom(roomData: TexasGameRoomData, userRID: number): Promise<HttpRoomCenterRoomUserLeave.ResponseData> {
        const body = new HttpRoomCenterRoomUserLeave.RequestData();
        body.room_id = roomData.roomID;
        body.user_random_id = userRID;
        return WWW.Instance.CommonAPI<HttpRoomCenterRoomUserLeave.ResponseData>({
            web_class: WebRoomCenterRoomUserLeave,
            body
        });
    }

    public static report(param: PlayerReportParam): Promise<WebResponseDataBase> {
        if ((param.type || 1) === 1) {
            const body = new HttpChatMessageReport.RequestData();
            body.room_id = param.roomID;
            body.msg_user_rid = param.userRID;
            body.report_type = param.reportType;
            body.other = param.other || '';
            return WWW.Instance.CommonAPI<HttpChatMessageReport.ResponseData>({
                web_class: WebChatMessageReport,
                body
            });
        }
        const body = new HttpCmsExtUserComplaintReport.RequestData();
        body.type = param.type;
        body.room_id = param.roomID;
        body.match_id = param.matchID;
        body.hand_num = param.handNum;
        body.room_unique_id = param.roomUniqueID;
        body.content = param.reportType + (param.other ? '|' + param.other : '');
        body.user_game_record_id = param.userGameRecordID;
        return WWW.Instance.CommonAPI<HttpCmsExtUserComplaintReport.ResponseData>({
            web_class: WebCmsExtUserComplaIntReport,
            body
        });
    }
}
