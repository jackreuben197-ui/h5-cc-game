import {
    Def,
    PlayerJackpotSummary,
    PlayerSummary,
    Roomer,
    ServerMessagePlayerJackpotSummary,
    ServerMessageRoomers,
    ServerMessageWinner
} from '@silenthill/agreement-web';
import { bindData, observable } from '../../../core/decorator/DataBind';
import { HandValueType } from '../../../core/poker/PoerkCard';
import TexasGameRoomData from './TexasGameRoomData';

/**
 * 战绩面板使用的玩家记录（对应原 ReportPlayer，但保留 raw 字段以便面板自行换算）。
 *
 * 数据来源：Roomers 推送的 PlayerSummary 作为基线 + Winner 推送的增量结算 + 主动 Sitdown/Standup/ChipsChange 的本地累加。
 */
export interface TexasReportPlayerInfo {
    userRid: number;
    name: string;
    avatar: string;
    sex: number;
    isOnline: boolean;
    seatId?: number;
    handNum: number;
    poolCount: number;
    bringInTotal: number;
    bringOutTotal: number;
    storeChips: number;
    deposit: number;
    win: number;
    mushroomCount: number;
    mushroomAmount: number;
    squidInTotal: number;
    squidOutTotal: number;
    squidCount: number;
    squidPunishTotal: number;
    poolRate: number;
}

/** Jackpot 增量记录（对应 Unity TexasSituationController._jackpot 项目）。 */
export interface TexasReportJackpotRecord {
    userRid: number;
    name: string;
    avatar: string;
    sex: number;
    contributeTotal: number;
    awardTotal: number;
    royalFlushCount: number;
    straightFlushCount: number;
    fourOfaKindCount: number;
}

/** 保险面板使用的 HTTP 历史记录条目。 */
export interface TexasReportInsuranceRecord {
    userRid: number;
    name: string;
    handNum: number;
    insurBet: number;
    insurWin: number;
    createTime: number;
}

/** 鱿鱼/蘑菇 HTTP 历史记录的单条数据。 */
export interface TexasReportSquidRecord {
    name: string;
    in_num: number;
    in_amount: number;
    out_num: number;
    out_amount: number;
    user_random_id: number;
}

/** 鱿鱼/蘑菇 历史分页快照（按局聚合）。 */
export interface TexasReportSquidRoundSnapshot {
    totalRound: number;
    startHand: number;
    endHand: number;
    records: TexasReportSquidRecord[];
}

export type TexasReportRoundMode = 'mush' | 'squid';

export type TexasReportObserver = Roomer.AsObject;

export interface TexasReportSummary {
    totalPot: number;
    totalBringin: number;
    totalHand: number;
    insurance: number;
    startTime: number;
}

/**
 * 战绩数据子对象（挂在 TexasGameRoomData.report 上）。
 *
 * 数据驱动设计：
 *  - 服务端 Roomers / Winner / Seated / Standup / ChipsChange / StartInfo 都只调本类的 applyXxx，
 *    内部修改 @observable 字段后由框架自动 emit；UITexasReport 组件只订阅事件，不做协议层逻辑。
 *  - 静态缓存全部迁移到本对象上 —— 不再使用 Map<roomId,_> 静态字段，因为每个房间都有自己的 TexasGameRoomData 实例。
 */
@bindData()
export default class TexasGameRoomDataReport extends cc.EventTarget {
    public static readonly PLAYERS_CHANGE = 'REPORT_PLAYERS_CHANGE';
    public static readonly OBSERVERS_CHANGE = 'REPORT_OBSERVERS_CHANGE';
    public static readonly SUMMARY_CHANGE = 'REPORT_SUMMARY_CHANGE';
    public static readonly JACKPOT_CHANGE = 'REPORT_JACKPOT_CHANGE';
    public static readonly INSURANCE_CHANGE = 'REPORT_INSURANCE_CHANGE';
    public static readonly SQUID_ROUND_CHANGE = 'REPORT_SQUID_ROUND_CHANGE';
    private readonly _roomData: TexasGameRoomData;
    /** 玩家战绩列表 —— 数组实例每次刷新都会替换，触发 @observable emit。*/
    @observable(TexasGameRoomDataReport.PLAYERS_CHANGE, { forceEmit: true })
    public players: TexasReportPlayerInfo[] = [];
    /** 观众列表 */
    @observable(TexasGameRoomDataReport.OBSERVERS_CHANGE, { forceEmit: true })
    public observers: TexasReportObserver[] = [];
    /** 牌桌总览数据（总底池/总带入/总手数/保险池/开桌时间）—— 公共区域。 */
    @observable(TexasGameRoomDataReport.SUMMARY_CHANGE, { forceEmit: true })
    public summary: TexasReportSummary = { totalPot: 0, totalBringin: 0, totalHand: 0, insurance: 0, startTime: 0 };
    /** Jackpot 记录列表（来源：服务端 PlayerJackpotSummary 整表覆盖 + Winner 局部累加）。 */
    @observable(TexasGameRoomDataReport.JACKPOT_CHANGE, { forceEmit: true })
    public jackpotRecords: TexasReportJackpotRecord[] = [];
    /** 保险历史记录（HTTP 拉取），整表替换。 */
    @observable(TexasGameRoomDataReport.INSURANCE_CHANGE, { forceEmit: true })
    public insuranceRecords: TexasReportInsuranceRecord[] = [];
    /** 鱿鱼/蘑菇 按 round 缓存的分页数据。 */
    @observable(TexasGameRoomDataReport.SQUID_ROUND_CHANGE, { forceEmit: true })
    public squidRounds: Map<number, TexasReportSquidRoundSnapshot> = new Map();
    /** 当前分页缓存来自哪个玩法，防止蘑菇和鱿鱼共用 Map 时串数据。 */
    public squidRoundMode: TexasReportRoundMode | null = null;
    /** 标记 Roomers 是否已经从服务端拉过一次。面板根据它决定是否要等首屏数据。 */
    public roomersFetched: boolean = false;
    // 空数组也算拉取成功，记下来后重新打开就不会一直重复请求。
    public jackpotFetched: boolean = false;
    public insuranceFetched: boolean = false;

    constructor(roomData: TexasGameRoomData) {
        super();
        this._roomData = roomData;
    }
    // ============================================================
    // 整表覆盖入口
    // ============================================================

    /** 用 Roomers 推送整表覆盖。匹配 Unity TexasSituationController.HandleRoomersResponse。 */
    public applyRoomers(data: ServerMessageRoomers.AsObject): void {
        this.roomersFetched = true;
        const mushroomBase = this._roomData.basicInfo.mushroomBase || 0;
        const next: TexasReportPlayerInfo[] = (data.playersList || []).map(p => this._fromSummary(p, mushroomBase));
        this.players = next;
        this.observers = (data.observersList || []).slice();
        this.summary = {
            totalPot: Number(data.totalPot || 0),
            totalBringin: Number(data.totalBringin || 0),
            totalHand: Number(data.totalHand || 0),
            insurance: Number(data.insurance || 0),
            startTime: Number(data.startTime || 0)
        };
    }

    /** 用 PlayerJackpotSummary 整表覆盖 Jackpot 列表。 */
    public applyJackpotSummary(data: ServerMessagePlayerJackpotSummary.AsObject): void {
        this.jackpotFetched = true;
        if (!data || Number(data.status || 0) !== 0) {
            this.jackpotRecords = [];
            return;
        }
        const seen = new Map<number, TexasReportJackpotRecord>();
        (data.playersList || []).forEach((p: PlayerJackpotSummary.AsObject) => {
            const userRid = Number(p.userRid || 0);
            if (userRid > 0 && seen.has(userRid)) return;
            const row: TexasReportJackpotRecord = {
                userRid,
                name: `${p.name || ''}`,
                avatar: `${p.avatar || ''}`,
                sex: Number(p.sex || 0),
                contributeTotal: Number(p.contributeTotal || 0),
                awardTotal: Number(p.awardTotal || 0),
                royalFlushCount: Number(p.royalFlushCount || 0),
                straightFlushCount: Number(p.straightFlushCount || 0),
                fourOfaKindCount: Number(p.fourOfaKindCount || 0)
            };
            if (userRid > 0) seen.set(userRid, row);
        });
        const list: TexasReportJackpotRecord[] = [];
        seen.forEach(v => list.push(v));
        this.jackpotRecords = list;
    }

    /** 用 HTTP 保险历史回填。整表覆盖。 */
    public setInsuranceRecords(records: TexasReportInsuranceRecord[]): void {
        this.insuranceFetched = true;
        this.insuranceRecords = (records || []).slice();
    }

    public prepareSquidRoundMode(mode: TexasReportRoundMode): boolean {
        if (this.squidRoundMode === mode) return false;
        this.squidRoundMode = mode;
        // 玩法换了就把旧页丢掉，不能拿蘑菇回包冒充鱿鱼。
        this.squidRounds = new Map();
        return true;
    }

    /** 用 HTTP 鱿鱼/蘑菇分页结果写入指定 round 缓存。 */
    public setSquidRound(mode: TexasReportRoundMode, round: number, snapshot: TexasReportSquidRoundSnapshot): void {
        const next = this.squidRoundMode === mode ? new Map(this.squidRounds) : new Map<number, TexasReportSquidRoundSnapshot>();
        this.squidRoundMode = mode;
        next.set(round, snapshot);
        this.squidRounds = next;
    }
    // ============================================================
    // 增量更新入口（对应 Unity TexasSituationController.*）
    // ============================================================

    /**
     * Winner 结算后由 Winner.ts 调用，模拟 Unity TexasSituationController.CalculateWinner 增量更新。
     * 不发网络请求 —— 缓存直接增量。
     */
    public applyWinnerResult(response: ServerMessageWinner.AsObject): void {
        if (!response) return;
        // 先拷贝再改，避免把上一份数据里的玩家对象一起改掉。
        const players = this.players.map(player => ({ ...player }));
        let totalPot = this.summary.totalPot;
        let totalHand = response.handNum || this.summary.totalHand;
        const mushroomBase = this._roomData.basicInfo.mushroomBase || 0;
        for (const winner of response.resultsList || []) {
            const seat = this._roomData.seatsStateManager.getSeatPlayer(winner.seatId);
            const userID = Number(seat?.userID || 0);
            // 座位会换人，先按玩家 ID 找，避免把新玩家的输赢算到上一位身上。
            let player = userID > 0 ? players.find(p => Number(p.userRid) === userID) : null;
            if (!player && userID <= 0) {
                player = players.find(p => p.seatId != null && p.seatId === winner.seatId);
            }
            if (!player && userID > 0) {
                // 极端消息时序下名单还没补到，先用座位资料把这一行接住。
                player = this._emptyPlayer(userID, seat?.name || '', seat?.avatar || '');
                player.sex = Number(seat?.sex || 0);
                players.push(player);
            }
            if (!player) continue;
            player.seatId = winner.seatId;
            player.poolCount = (player.poolCount || 0) + (winner.inPool ? 1 : 0);
            player.handNum = (player.handNum || 0) + 1;
            player.isOnline = true;
            // Unity CalculateWinner: 赢了扣手续费和奖池费，输了只算输额，再叠加保险
            let win: number;
            if ((winner.win || 0) > (winner.handBet || 0)) {
                win = (winner.win || 0) - (winner.handBet || 0) - (winner.fee || 0) - (winner.jackpotFee || 0);
            } else {
                win = (winner.win || 0) - (winner.handBet || 0);
            }
            win += (winner.insuranceWin || 0) - (winner.insurance || 0);
            player.win = (player.win || 0) + win;
            // Unity: roomers.TotalPot += winner.Win（原始 win）
            totalPot += winner.win || 0;
            // 蘑菇增量
            for (const ehc of winner.ehcsList || []) {
                if (ehc.ehcType !== Def.EHCType.EHC_MUSHROOM) continue;
                const amount = ehc.pb_in || 0;
                player.mushroomAmount = (player.mushroomAmount || 0) + amount;
                player.mushroomCount = (player.mushroomCount || 0) + (mushroomBase > 0 ? Math.floor(amount / mushroomBase) : 0);
            }
            // Jackpot 增量
            if ((winner.jackpotFee || 0) > 0) {
                this._applyJackpotContribute(player.userRid, player.name, player.avatar, player.sex, winner.jackpotFee);
            }
            if ((winner.jawd || 0) > 0) {
                this._applyJackpotAward(player.userRid, player.name, player.avatar, player.sex, winner.jawd, winner.handValueType);
            }
            player.poolRate = player.handNum > 0 ? Math.floor((player.poolCount * 1000) / player.handNum) : 0;
        }
        this.players = players;
        this.summary = { ...this.summary, totalPot, totalHand };
        this.jackpotRecords = this.jackpotRecords.slice();
    }

    /**
     * 对应 Unity TexasSituationController.SitDown。已存在则更新带入/在线状态。
     */
    public applySitDown(userRid: number, totalBringIn: number, deposit: number, name: string, avatar: string, seatId?: number): void {
        const players = this.players.map(player => ({ ...player }));
        const mushroomBase = this._roomData.basicInfo.mushroomBase || 0;
        const existing = players.find(p => Number(p.userRid) === Number(userRid));
        if (existing) {
            existing.isOnline = true;
            if (name) existing.name = name;
            if (avatar) existing.avatar = avatar;
            if (seatId != null && seatId > 0) existing.seatId = seatId;
            existing.bringInTotal = totalBringIn;
            existing.deposit = mushroomBase > 0 ? mushroomBase : deposit;
            const totalBringin = players.reduce((s, p) => s + (p.bringInTotal || 0), 0);
            this.players = players;
            this.summary = { ...this.summary, totalBringin };
            return;
        }
        const player: TexasReportPlayerInfo = this._emptyPlayer(userRid, name, avatar);
        if (seatId != null && seatId > 0) player.seatId = seatId;
        player.bringInTotal = totalBringIn;
        player.deposit = mushroomBase > 0 ? mushroomBase : deposit;
        player.isOnline = true;
        players.push(player);
        this.players = players;
        this.summary = { ...this.summary, totalBringin: this.summary.totalBringin + totalBringIn };
    }

    /** 对应 Unity TexasSituationController.StandUp。累加带出，置为离线。 */
    public applyStandUp(userRid: number, bringOut: number, name: string, avatar: string): void {
        const players = this.players.map(player => ({ ...player }));
        const mushroomBase = this._roomData.basicInfo.mushroomBase || 0;
        const existing = players.find(p => Number(p.userRid) === Number(userRid));
        if (existing) {
            existing.bringOutTotal = (existing.bringOutTotal || 0) + bringOut;
            existing.isOnline = false;
            // 人已经离座，这个座位号不能再拿去匹配后面的赢家。
            existing.seatId = undefined;
            if (mushroomBase > 0) existing.deposit = 0;
            this.players = players;
            return;
        }
        // 兜底：服务端未先发 Sitdown 的情况
        const player = this._emptyPlayer(userRid, name, avatar);
        player.bringOutTotal = bringOut;
        player.isOnline = false;
        if (mushroomBase > 0) player.deposit = 0;
        players.push(player);
        this.players = players;
    }

    /**
     * 对应 Unity TexasSituationController.ChipChange。
     * 调用方应只在 ChipChangeReason == CC_NONE 时调用（消息层负责过滤）。
     */
    public applyChipChange(userRid: number, newBringIn: number, name: string, avatar: string): void {
        const players = this.players.map(player => ({ ...player }));
        const mushroomBase = this._roomData.basicInfo.mushroomBase || 0;
        const existing = players.find(p => Number(p.userRid) === Number(userRid));
        if (existing) {
            existing.isOnline = true;
            existing.bringInTotal = (existing.bringInTotal || 0) + newBringIn;
            if (mushroomBase > 0) existing.deposit = mushroomBase;
            this.players = players;
            this.summary = { ...this.summary, totalBringin: this.summary.totalBringin + newBringIn };
            return;
        }
        const player = this._emptyPlayer(userRid, name, avatar);
        player.bringInTotal = newBringIn;
        player.isOnline = true;
        player.deposit = mushroomBase > 0 ? mushroomBase : 0;
        players.push(player);
        this.players = players;
        this.summary = { ...this.summary, totalBringin: this.summary.totalBringin + newBringIn };
    }

    /** 对应 Unity TexasSituationController.OnStartInfo。仅当未设置 startTime 时补写一次。 */
    public applyStartInfo(): void {
        if ((this.summary.startTime || 0) > 0) return;
        this.summary = { ...this.summary, startTime: Math.floor(Date.now() / 1000) };
    }

    /** 离开房间时清空（外部从 LeaveNotification / Leave 流程统一调用，可选）。*/
    public clear(): void {
        this.players = [];
        this.observers = [];
        this.summary = { totalPot: 0, totalBringin: 0, totalHand: 0, insurance: 0, startTime: 0 };
        this.jackpotRecords = [];
        this.insuranceRecords = [];
        this.squidRounds = new Map();
        this.squidRoundMode = null;
        this.roomersFetched = false;
        this.jackpotFetched = false;
        this.insuranceFetched = false;
    }
    // ============================================================
    // 内部辅助
    // ============================================================

    private _fromSummary(p: PlayerSummary.AsObject, mushroomBase: number): TexasReportPlayerInfo {
        return {
            userRid: Number(p.userRid || 0),
            name: `${p.name || ''}`,
            avatar: `${p.avatar || ''}`,
            sex: Number(p.sex || 0),
            isOnline: !!p.isOnline,
            handNum: Number(p.handNum || 0),
            poolCount: Number(p.poolCount || 0),
            bringInTotal: Number(p.bringInTotal || 0),
            bringOutTotal: Number(p.bringOutTotal || 0),
            storeChips: Number(p.storeChips || 0),
            deposit: Number(p.deposit || 0),
            win: Number(p.win || 0),
            mushroomCount: Number(p.mushroomCount || 0),
            mushroomAmount: Number(p.mushroomAmount || 0),
            squidInTotal: Number(p.squidInTotal || 0),
            squidOutTotal: Number(p.squidOutTotal || 0),
            squidCount: Number(p.squidCount || 0),
            squidPunishTotal: Number(p.squidPunishTotal || 0),
            // Unity: 优先按 handNum 计算入池率（PoolCount * 1000 / HandNum），否则用服务端给的 poolRate
            poolRate: Number(p.handNum || 0) > 0 ? Math.floor((Number(p.poolCount || 0) * 1000) / Number(p.handNum)) : Number(p.poolRate || 0)
        };
    }

    private _emptyPlayer(userRid: number, name: string, avatar: string): TexasReportPlayerInfo {
        return {
            userRid,
            name: name || '',
            avatar: avatar || '',
            sex: 0,
            isOnline: true,
            handNum: 0,
            poolCount: 0,
            bringInTotal: 0,
            bringOutTotal: 0,
            storeChips: 0,
            deposit: 0,
            win: 0,
            mushroomCount: 0,
            mushroomAmount: 0,
            squidInTotal: 0,
            squidOutTotal: 0,
            squidCount: 0,
            squidPunishTotal: 0,
            poolRate: 0
        };
    }

    private _applyJackpotContribute(userRid: number, name: string, avatar: string, sex: number, fee: number): void {
        const rec = this._findOrCreateJackpotRecord(userRid, name, avatar, sex);
        rec.contributeTotal += fee;
    }

    private _applyJackpotAward(userRid: number, name: string, avatar: string, sex: number, jawd: number, handValueType: number): void {
        const rec = this._findOrCreateJackpotRecord(userRid, name, avatar, sex);
        rec.awardTotal += jawd;
        if (handValueType === HandValueType.HVRoyalFlush) rec.royalFlushCount += 1;
        else if (handValueType === HandValueType.HVStraightFlush) rec.straightFlushCount += 1;
        else if (handValueType === HandValueType.HVFourOfAKind) rec.fourOfaKindCount += 1;
    }

    private _findOrCreateJackpotRecord(userRid: number, name: string, avatar: string, sex: number): TexasReportJackpotRecord {
        let rec = this.jackpotRecords.find(r => r.userRid === userRid);
        if (!rec) {
            rec = { userRid, name, avatar, sex, contributeTotal: 0, awardTotal: 0, royalFlushCount: 0, straightFlushCount: 0, fourOfaKindCount: 0 };
            this.jackpotRecords.push(rec);
        }
        return rec;
    }
}
