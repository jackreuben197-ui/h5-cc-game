import { traceClass } from '../../core/decorator/LogTrace';
import {
    WebChatMessageReport,
    WebCmsExtUserComplaIntReport,
    WebMiscCombine,
    WebOrgClubUserRemaRks,
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
import { HttpOrgClubUserUpdate } from '../../net/https/data/org/HttpOrgClubUserUpdate';
import { WebResponseDataBase } from '../../net/https/data/other/WebResponseDataBase';
import { HttpRoomUserMuteProtocol } from '../../net/https/data/room/HttpRoomUserMuteProtocol';
import { HttpRoomCenterRoomUserLeave } from '../../net/https/data/roomcenter/HttpRoomCenterRoomUserLeave';
import { HttpRoomCenterRoomUserStandUp } from '../../net/https/data/roomcenter/HttpRoomCenterRoomUserStandUp';
import { HttpStatsOtherUserStats } from '../../net/https/data/stats/HttpStatsOtherUserStats';
import { HttpUserDiamondSend } from '../../net/https/data/user/HttpUserDiamondSend';
import { HttpUserMuteList } from '../../net/https/data/user/HttpUserMuteList';
import TexasGameRoomData from '../room/texas/TexasGameRoomData';
import TexasGameRoomDataPlayer from '../room/texas/TexasGameRoomDataPlayer';
import playerStore, { PlayerBasicData, PlayerReportParam } from './PlayerStore';

type StatsCombineResult = HttpStatsOtherUserStats.Data | HttpStatsOtherUserStats.ResponseData;

@traceClass()
export default class PlayerStoreUtils {
    public static syncSeatPlayer(player: TexasGameRoomDataPlayer, roomData?: TexasGameRoomData): void {
        PlayerStoreUtils.syncSeatPlayers(roomData, [player]);
    }

    public static syncSeatPlayers(roomData: TexasGameRoomData, players: TexasGameRoomDataPlayer[]): void {
        const userRIDs = PlayerStoreUtils._syncBasicInfoFromSeatPlayers(players);
        if (!roomData || userRIDs.length <= 0) return;
        PlayerStoreUtils._loadPlayerCombineData(roomData, userRIDs).catch(error => {
            PlayerStoreUtils.tracelog.error('sync seat player data error', error);
        });
    }

    public static async getStats(roomData: TexasGameRoomData, userRID: number): Promise<HttpStatsOtherUserStats.Data | null> {
        const cached = playerStore.getStats(userRID);
        if (cached) return cached;
        await PlayerStoreUtils._loadPlayerCombineData(roomData, [userRID]);
        return playerStore.getStats(userRID);
    }

    public static async refreshStats(roomData: TexasGameRoomData, userRID: number): Promise<HttpStatsOtherUserStats.Data | null> {
        await PlayerStoreUtils._loadPlayerCombineData(roomData, [userRID], false);
        return playerStore.getStats(userRID);
    }

    private static _syncBasicInfoFromSeatPlayers(players: TexasGameRoomDataPlayer[]): number[] {
        const userRIDs: number[] = [];
        players.forEach(player => {
            if (!player.seated || !player.userID) return;
            playerStore.updateBasicInfo({
                nick_name: player.name,
                avatar: player.avatar,
                random_num: player.userID,
                sex: player.sex
            });
            userRIDs.push(player.userID);
        });
        return PlayerStoreUtils._uniqueUserRIDs(userRIDs);
    }

    private static async _loadPlayerCombineData(roomData: TexasGameRoomData, userRIDs: number[], useCache = true): Promise<void> {
        const ids = PlayerStoreUtils._uniqueUserRIDs(userRIDs);
        if (ids.length <= 0) return;
        const body = PlayerStoreUtils._createPlayerCombineRequest(roomData, ids);
        const res = await WWW.Instance.CommonAPI<HttpMiscCombine.ResponseData>({
            web_class: WebMiscCombine,
            body,
            juhua: false,
            useCache,
            timeoutRetryCount: 3,
            timeoutRetryIntervalMs: 30000,
            timeoutMs: 10000
        });
        if (res.code != 0) {
            PlayerStoreUtils.tracelog.error('get HttpMiscCombine player data error', res.code);
            return;
        }
        PlayerStoreUtils._applyUserPublicInfoList(res.data?.user_info_by_rid_resp || []);
        PlayerStoreUtils._normalizeStatsList(res.data?.user_stats_by_user_rid_resp).forEach(stats => {
            playerStore.updateStats(stats.user_random_id, stats);
        });
    }

    private static _createPlayerCombineRequest(roomData: TexasGameRoomData, userRIDs: number[]): HttpMiscCombine.RequestData {
        const statsBody = new HttpStatsOtherUserStats.RequestData();
        statsBody.game_type = roomData.basicInfo.gameType;
        statsBody.poker_type = roomData.basicInfo.pokerType;
        statsBody.gold_type = roomData.basicInfo.goldType;
        statsBody.origin_type = roomData.basicInfo.originType;
        statsBody.room_id = roomData.roomID;
        statsBody.user_random_id = userRIDs;
        const userInfoBody = new HttpMiscCombine.UserInfoByRidRequest();
        userInfoBody.user_random_id = userRIDs;
        const body = new HttpMiscCombine.RequestData();
        body.api_list = [WebMiscCombine.ApiType.USER_PUBLIC_INFO, WebMiscCombine.ApiType.OTHER_USER_STATS];
        body.user_info_by_rid_req = userInfoBody;
        body.user_stats_by_user_rid_req = statsBody;
        return body;
    }

    private static _applyUserPublicInfoList(list: HttpMiscCombine.UserPublicInfo[]): void {
        list.forEach(item => {
            if (!item?.random_num) return;
            const data: PlayerBasicData = {
                random_num: item.random_num
            };
            if (item.nick_name != null) data.nick_name = item.nick_name;
            if (item.avatar != null) data.avatar = item.avatar;
            if (item.sex != null) data.sex = item.sex;
            if (item.remark_name != null) data.remark_name = item.remark_name;
            playerStore.updateBasicInfo(data);
        });
    }

    private static _normalizeStatsList(data: HttpMiscCombine.StatsResponse[] | HttpMiscCombine.StatsResponse): HttpStatsOtherUserStats.Data[] {
        const list = Array.isArray(data) ? data : data ? [data] : [];
        const result: HttpStatsOtherUserStats.Data[] = [];
        list.forEach(item => {
            const stats = PlayerStoreUtils._normalizeStatsData(item);
            if (stats?.user_random_id) result.push(stats);
        });
        return result;
    }

    private static _normalizeStatsData(data: StatsCombineResult): HttpStatsOtherUserStats.Data | null {
        if (!data) return null;
        return (data as HttpStatsOtherUserStats.ResponseData).data || (data as HttpStatsOtherUserStats.Data);
    }

    private static _uniqueUserRIDs(userRIDs: number[]): number[] {
        const map: Record<number, boolean> = {};
        const result: number[] = [];
        userRIDs.forEach(userRID => {
            if (!userRID || map[userRID]) return;
            map[userRID] = true;
            result.push(userRID);
        });
        return result;
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

    public static sendDiamond(targetUserRID: number, amount: number, roomID: number): Promise<HttpUserDiamondSend.ResponseData> {
        const body = new HttpUserDiamondSend.RequestData();
        body.target_user_id = targetUserRID;
        body.send_type = 2;
        body.amount = amount;
        body.room_id = roomID;
        return WWW.Instance.CommonAPI<HttpUserDiamondSend.ResponseData>({
            web_class: WebUserDiamondSend,
            body
        });
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
