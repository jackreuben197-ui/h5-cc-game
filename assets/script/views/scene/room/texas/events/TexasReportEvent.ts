import { Code } from '@silenthill/agreement-web';
import TexasGameRoomData from '../../../../../data/room/texas/TexasGameRoomData';
import { TexasReportInsuranceRecord, TexasReportSquidRecord, TexasReportSquidRoundSnapshot } from '../../../../../data/room/texas/TexasGameRoomDataReport';
import { APITexasSituationMushRound, APITexasSituationSquidRound, WebStatsRoomInsuranceData, WWW } from '../../../../../net/https/WebRequest';
import ProtocolAgency from '../../../../../net/websocket/ProtocolAgency';

export type TexasReportRoundResult = {
    round: number;
    snapshot: TexasReportSquidRoundSnapshot;
};

type ReportHistoryMode = 'mush' | 'squid';

type SquidRoundResponse = {
    round?: number;
    start_hand?: number;
    end_hand?: number;
    total?: number;
    records?: Partial<TexasReportSquidRecord>[];
};

type InsuranceResponse = {
    list?: Array<{
        user_rid?: number;
        nick_name?: string;
        hand_num?: number;
        insur_bet?: number;
        insur_win?: number;
        create_time?: number;
    }>;
};

// 战绩相关的请求都从这里走，Dialog 只关心拿到什么数据。
export default class TexasReportEvent {
    private static readonly ROOMERS_HISTORY_LIMIT = 1000;
    private static readonly INSURANCE_HISTORY_LIMIT = 200;

    // 进桌先把完整玩家名单拉回来，打开面板时就不用干等。
    public static PrefetchRoomers(roomID: number, matchID: number): void {
        if (!roomID) return;
        ProtocolAgency.Send({
            code: Code.MSG_D_ROOMERS,
            roomID,
            matchID,
            body: {
                room: { roomId: roomID, matchId: matchID },
                history: true,
                historyOffset: 0,
                historyLimit: this.ROOMERS_HISTORY_LIMIT
            }
        });
    }

    public static RequestJackpotSummary(roomData: TexasGameRoomData): void {
        ProtocolAgency.Send({
            code: Code.MSG_D_PLAYER_JACKPOT_SUMMARY,
            roomID: roomData.roomID,
            matchID: roomData.matchID,
            body: {
                room: { roomId: roomData.roomID, matchId: roomData.matchID }
            }
        });
    }

    // HTTP 的原始字段在这里转成页面统一使用的结构。
    public static async RequestRound(roomData: TexasGameRoomData, mode: ReportHistoryMode, round: number): Promise<TexasReportRoundResult | null> {
        const webClass = mode === 'mush' ? APITexasSituationMushRound : APITexasSituationSquidRound;
        try {
            const response = await WWW.Instance.CommonAPI<unknown>({
                web_class: webClass,
                api_id: roomData.roomID,
                club_id: roomData.basicInfo.clubID,
                body: { round },
                juhua: false
            });
            return this._parseRoundResponse(response, round);
        } catch (_error) {
            return null;
        }
    }

    public static async RequestInsuranceHistory(roomData: TexasGameRoomData): Promise<TexasReportInsuranceRecord[] | null> {
        try {
            const response = await WWW.Instance.CommonAPI<unknown>({
                web_class: WebStatsRoomInsuranceData,
                club_id: roomData.basicInfo.clubID,
                body: {
                    room_id: roomData.roomID,
                    limit: this.INSURANCE_HISTORY_LIMIT,
                    offset: 0
                },
                juhua: false
            });
            return this._parseInsuranceResponse(response);
        } catch (_error) {
            return null;
        }
    }

    private static _parseRoundResponse(response: unknown, requestedRound: number): TexasReportRoundResult | null {
        const data = this._unwrapResponseData<SquidRoundResponse>(response);
        if (!data) return null;
        const totalRound = Number(data.total || 0);
        const responseRound = Number(data.round || 0);
        const round = responseRound > 0 ? responseRound : requestedRound > 0 ? requestedRound : totalRound > 0 ? totalRound : 1;
        const records = (data.records || []).map(record => ({
            name: `${record.name || ''}`,
            in_num: Number(record.in_num || 0),
            in_amount: Number(record.in_amount || 0),
            out_num: Number(record.out_num || 0),
            out_amount: Number(record.out_amount || 0),
            user_random_id: Number(record.user_random_id || 0)
        }));
        return {
            round,
            snapshot: {
                totalRound,
                startHand: Number(data.start_hand || 0),
                endHand: Number(data.end_hand || 0),
                records
            }
        };
    }

    private static _parseInsuranceResponse(response: unknown): TexasReportInsuranceRecord[] | null {
        const data = this._unwrapResponseData<InsuranceResponse>(response);
        if (!data) return null;
        return (data.list || []).map(record => ({
            userRid: Number(record.user_rid || 0),
            name: `${record.nick_name || ''}`,
            handNum: Number(record.hand_num || 0),
            insurBet: Number(record.insur_bet || 0),
            insurWin: Number(record.insur_win || 0),
            createTime: Number(record.create_time || 0)
        }));
    }

    private static _unwrapResponseData<T>(response: unknown): T | null {
        // 新旧接口有 data 和 data.data 两种包法，这里统一拆一层。
        if (!response || typeof response !== 'object') return null;
        const firstLevel = (response as { data?: unknown }).data;
        if (!firstLevel || typeof firstLevel !== 'object') return null;
        const secondLevel = (firstLevel as { data?: unknown }).data;
        return (secondLevel && typeof secondLevel === 'object' ? secondLevel : firstLevel) as T;
    }
}
