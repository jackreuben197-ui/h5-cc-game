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
import playerStore, { PlayerReportParam, PlayerPropData } from './PlayerStore';

const CONSUME_TYPE_EMOJI_2 = 6;

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

    public static async getStats(roomData: TexasGameRoomData, userRID: number): Promise<any | null> {
        const res: any = await WWW.Instance.CommonAPI({
            web_class: WebMiscCombine,
            body: {
                api_list: [WebMiscCombine.ApiType.OTHER_USER_STATS],
                user_stats_by_user_rid_req: {
                    game_type: roomData.basicInfo.gameType,
                    poker_type: roomData.basicInfo.pokerType,
                    gold_type: roomData.basicInfo.goldType,
                    origin_type: roomData.basicInfo.originType,
                    room_id: roomData.roomID,
                    user_random_id: [userRID]
                }
            },
            juhua: false
        });
        const list = res?.data?.user_stats_by_user_rid_resp;
        if (Array.isArray(list)) return list[0] || null;
        return list || null;
    }

    public static async saveRemark(roomData: TexasGameRoomData, dbUserID: number, remark: string): Promise<any> {
        return WWW.Instance.CommonAPI({
            web_class: WebOrgClubUserRemaRks,
            body: {
                club_id: roomData.basicInfo.clubID || 0,
                user_id: dbUserID,
                remark_name: remark,
                remark_desc: ''
            }
        });
    }

    public static async getMuteState(roomData: TexasGameRoomData, userRID: number): Promise<boolean> {
        if (!roomData.basicInfo.clubID && !roomData.basicInfo.tribeID) return false;
        const res: any = await WWW.Instance.CommonAPI({
            web_class: WebUserMuteList,
            body: {
                club_id: roomData.basicInfo.clubID || undefined,
                tribe_id: roomData.basicInfo.tribeID || undefined,
                user_ids: [userRID]
            },
            juhua: false
        });
        const ids: number[] = res?.data?.ids || [];
        return ids.indexOf(userRID) >= 0;
    }

    public static setMuteState(roomData: TexasGameRoomData, userRID: number, mute: boolean): Promise<any> {
        return WWW.Instance.CommonAPI({
            web_class: WebUserMute,
            body: {
                club_id: roomData.basicInfo.clubID || undefined,
                tribe_id: roomData.basicInfo.tribeID || undefined,
                user_id: userRID,
                mute
            }
        });
    }

    public static sendDiamond(targetUserRID: number, amount: number): Promise<any> {
        return WWW.Instance.CommonAPI({
            web_class: WebUserDiamondSend,
            body: {
                target_user_id: targetUserRID,
                send_type: 2,
                amount
            }
        });
    }

    @traceMethod()
    public static async preparePropList(): Promise<void> {
        const res: any = await WWW.Instance.CommonAPI({
            web_class: WebPropChatPropList,
            body: {
                prop_type: 4,
                prop_types: [4],
                offset: 0,
                limit: 20
            },
            juhua: false
        });
        const list: any[] = res?.data?.list || [];
        const propList: PlayerPropData[] = list.map(item => ({
            payPrice: item?.pay_price || 0,
            priceID: item?.price_id || CONSUME_TYPE_EMOJI_2
        }));
        playerStore.updatePropList(propList);
    }

    public static standUp(roomData: TexasGameRoomData, userRID: number): Promise<any> {
        return WWW.Instance.CommonAPI({
            web_class: WebRoomCenterRoomUserStandUp,
            body: {
                room_id: roomData.roomID,
                user_random_id: userRID
            }
        });
    }

    public static leaveRoom(roomData: TexasGameRoomData, userRID: number): Promise<any> {
        return WWW.Instance.CommonAPI({
            web_class: WebRoomCenterRoomUserLeave,
            body: {
                room_id: roomData.roomID,
                user_random_id: userRID
            }
        });
    }

    public static report(param: PlayerReportParam): Promise<any> {
        if ((param.type || 1) === 1) {
            return WWW.Instance.CommonAPI({
                web_class: WebChatMessageReport,
                body: {
                    room_id: param.roomID,
                    msg_user_rid: param.userRID,
                    report_type: param.reportType,
                    other: param.other || ''
                }
            });
        }
        return WWW.Instance.CommonAPI({
            web_class: WebCmsExtUserComplaIntReport,
            body: {
                type: param.type,
                room_id: param.roomID,
                match_id: param.matchID,
                hand_num: param.handNum,
                room_unique_id: param.roomUniqueID,
                content: param.reportType + (param.other ? '|' + param.other : ''),
                user_game_record_id: param.userGameRecordID
            }
        });
    }
}
