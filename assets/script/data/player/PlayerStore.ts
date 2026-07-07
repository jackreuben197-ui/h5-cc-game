import { bindData, IObservableBindings, pureEvent } from '../../core/decorator/DataBind';

export interface PlayerStore extends IObservableBindings<PlayerStore> {}

export interface PlayerBasicData {
    nick_name?: string;
    nickname?: string;
    avatar?: string;
    sex?: number;
    random_num?: number;
    remark_name?: string;
    remark_desc?: string;
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

export interface PlayerPropData {
    payPrice: number;
    priceID: number;
}

@bindData()
export class PlayerStore extends cc.EventTarget {
    public static readonly BASIC_INFO_CHANGE = 'BASIC_INFO_CHANGE';
    public static readonly PROP_LIST_CHANGE = 'PROP_LIST_CHANGE';

    private readonly _basicInfoMap: Map<number, PlayerBasicData> = new Map();
    private _propList: PlayerPropData[] = [];

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

    public getPropList(): PlayerPropData[] {
        return this._propList;
    }

    public updatePropList(list: PlayerPropData[]): void {
        this._propList = list;
        this._sendPropListChangeEvent(this._propList);
    }

    @pureEvent(PlayerStore.BASIC_INFO_CHANGE)
    private _sendBasicInfoChangeEvent(userRID: number, data: PlayerBasicData): void {}

    @pureEvent(PlayerStore.PROP_LIST_CHANGE, {
        initParams() {
            return [this._propList];
        }
    })
    private _sendPropListChangeEvent(list: PlayerPropData[]): void {}
}

const playerStore = new PlayerStore();

export default playerStore;
