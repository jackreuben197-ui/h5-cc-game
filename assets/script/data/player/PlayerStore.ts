import { bindData, IObservableBindings, pureEvent } from '../../core/decorator/DataBind';
import { HttpStatsOtherUserStats } from '../../net/https/data/stats/HttpStatsOtherUserStats';

export interface PlayerStore extends IObservableBindings<PlayerStore> {}

export interface PlayerBasicData {
    nick_name?: string;
    avatar?: string;
    sex?: number;
    random_num?: number;
    remark_name?: string;
}

export interface PlayerDiamondConfig {
    fee_rate: number;
    limit_time_pre_day: number;
    sentCount?: number;
}

export interface PlayerReportParam {
    roomID: number;
    matchID?: number;
    userRID?: number;
    reportType: string;
    other?: string;
    type?: number;
    handNum?: number;
    roomUniqueID?: string;
    userGameRecordID?: number;
}

export type PlayerStatsData = HttpStatsOtherUserStats.Data;

@bindData()
export class PlayerStore extends cc.EventTarget {
    public static readonly BASIC_INFO_CHANGE = 'BASIC_INFO_CHANGE';
    public static readonly STATS_CHANGE = 'STATS_CHANGE';
    private readonly _basicInfoMap: Map<number, PlayerBasicData> = new Map();
    private readonly _statsMap: Map<number, PlayerStatsData> = new Map();

    public getBasicInfo(userRID: number): PlayerBasicData {
        return this._basicInfoMap.get(userRID) || null;
    }

    public updateBasicInfo(data: PlayerBasicData): void {
        const userRID = data.random_num;
        if (!userRID) return;
        const oldData = this._basicInfoMap.get(userRID) || {};
        const newData = { ...oldData, ...data };
        this._basicInfoMap.set(userRID, newData);
        this._sendBasicInfoChangeEvent(userRID, newData);
    }

    public updateRemark(userRID: number, remark: string): void {
        const oldData = this._basicInfoMap.get(userRID) || { random_num: userRID };
        const newData = { ...oldData, remark_name: remark };
        this._basicInfoMap.set(userRID, newData);
        this._sendBasicInfoChangeEvent(userRID, newData);
    }

    public getStats(userRID: number): PlayerStatsData {
        return this._statsMap.get(userRID) || null;
    }

    public updateStats(userRID: number, data: PlayerStatsData): void {
        if (!userRID || !data) return;
        this._statsMap.set(userRID, data);
        this._sendStatsChangeEvent(userRID, data);
    }

    @pureEvent(PlayerStore.BASIC_INFO_CHANGE)
    private _sendBasicInfoChangeEvent(userRID: number, data: PlayerBasicData): void {}

    @pureEvent(PlayerStore.STATS_CHANGE)
    private _sendStatsChangeEvent(userRID: number, data: PlayerStatsData): void {}
}

const playerStore = new PlayerStore();

export default playerStore;
