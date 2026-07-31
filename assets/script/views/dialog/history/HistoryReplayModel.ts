import { ReplayHandData } from '../../../data/room/texas/TexasGameRoomDataReplay';
import { CPErrorCode } from '../../../i18n/CPErrorCode';
import { WebRoomCenterHistoryReplay } from '../../../net/https/WebRequest';

type ProcedurePl = typeof WebRoomCenterHistoryReplay.ProcedurePl;

/** 0 庄家，1 小盲，2 大盲，3 枪口，4 枪口+1，5 中位1，6 中位2，7 劫位，8 关位 */
export const PLAYER_POSITION_ABBR = ['BTN', 'SB', 'BB', 'UTG', 'UTG+1', 'MP1', 'MP2', 'HJ', 'CO'];

/** 0 无，1 小盲，2 大盲，3 跟注，4 让牌，5 强制盲注，6 下注，7 加注，8 3Bet，9 全下，10 弃牌，11 保险 */
export const PLAYER_ACTION_ABBR = ['', 'SB', 'BB', 'C', 'X', 'S', 'B', 'R', '3B', 'A', 'F', 'INS'];

export enum HistoryActionType {
    None = 0,
    SmallBlind = 1,
    BigBlind = 2,
    Call = 3,
    Check = 4,
    Straddle = 5,
    Bet = 6,
    Raise = 7,
    ThreeBet = 8,
    AllIn = 9,
    Fold = 10,
    Insure = 11
}

/** 结算/概览区的单个玩家数据 */
export interface HistoryPlayerInfo {
    playerId: number;
    userName: string;
    headPic: string;
    seatID: number;
    initChip: number;
    playerPosition: number;
    isMine: boolean;
    handCards: number[];
    handBet: number;
    winAnte: number;
    insuranceGain: number;
    maxCardType: number;
    maxCardIndex: number[];
    // 第二套牌(双套牌局)
    maxCardType2: number;
    maxCardIndex2: number[];
    winAnte2: number[];
}

/** 街道行(每个玩家一次动作)数据 */
export interface HistoryActionInfo {
    playerId: number;
    nickName: string;
    headPic: string;
    playerPosition: number;
    action: HistoryActionType;
    actionChip: number;
    leftChips: number;
    raiseTimes: number;
    isMine: boolean;
}

export interface HistoryStreetModel {
    rows: HistoryActionInfo[];
    pot: number;
}

/** 玩家整手牌的最后一次动作(概览卡用),raiseTimes 为该玩家自己累计的 bet/raise 次数 */
export interface HistoryLastAction {
    actName: string;
    actChip: number;
    raiseTimes: number;
}

export interface HistoryHandModel {
    handNum: number;
    playerCount: number;
    hasMe: boolean;
    hasResult: boolean;
    publicCards: number[];
    secondPublicCards: number[];
    haveSecondCard: boolean;
    players: HistoryPlayerInfo[];
    winners: HistoryPlayerInfo[];
    preflop: HistoryStreetModel;
    flop: HistoryStreetModel;
    turn: HistoryStreetModel;
    river: HistoryStreetModel;
    showdownPot: number;
    insurancePool: number;
    /** seatID → 最后动作(解析时一趟预计算,替代逐玩家全量遍历) */
    lastActions: Map<number, HistoryLastAction>;
}

/**
 * bet/raise 的显示规则(概览卡与详情行共用):
 * 首次下注显示动作本身,第二次显示"加注",更多次显示 次数+后缀
 */
export function formatRaiseTimes(raiseTimes: number, firstLabel: string, raiseLabel: string, multiSuffix: string = raiseLabel): string {
    if (raiseTimes <= 1) return firstLabel;
    if (raiseTimes === 2) return raiseLabel;
    return raiseTimes + multiSuffix;
}

export function getActionNumByName(actionName: string): HistoryActionType {
    switch (actionName) {
        case 'small blind':
            return HistoryActionType.SmallBlind;
        case 'big blind':
            return HistoryActionType.BigBlind;
        case 'call':
            return HistoryActionType.Call;
        case 'check':
            return HistoryActionType.Check;
        case 'straddle':
            return HistoryActionType.Straddle;
        case 'bet':
            return HistoryActionType.Bet;
        case 'raise':
            return HistoryActionType.Raise;
        case 'all in':
            return HistoryActionType.AllIn;
        case 'fold':
            return HistoryActionType.Fold;
        case 'insure':
            return HistoryActionType.Insure;
        default:
            return HistoryActionType.None;
    }
}

/** 服务端 card_type(1-10) → 多语言牌型名 */
export function getCardTypeName(cardType: number): string {
    if (cardType >= 1 && cardType <= 10) {
        // 10062 高牌 ... 10053 皇家同花顺(与 card_type 反序对应)
        return CPErrorCode.LanguageDescription(10063 - cardType);
    }
    return '';
}

/** 按庄位把所有座位号一趟排序并映射为位置序号(值对应 PLAYER_POSITION_ABBR 下标) */
export function buildPositionMap(seatIds: number[], buttonSeatId: number): Map<number, number> {
    const sorted = [...seatIds].sort((a, b) => a - b);
    const buttonIndex = sorted.indexOf(buttonSeatId);
    const rotated = [...sorted.slice(buttonIndex), ...sorted.slice(0, buttonIndex)];
    const map = new Map<number, number>();
    rotated.forEach((seat, index) => map.set(seat, index));
    return map;
}

function findPlayerBySeat(players: HistoryPlayerInfo[], seatID: number): HistoryPlayerInfo {
    for (const p of players) {
        if (p.seatID === seatID) return p;
    }
    return null;
}

/** be_watched_user_hands(偷偷看)一趟解析成 user_rid → 手牌 的映射(避免逐玩家重复 split) */
function buildWatchedHandsMap(data: ReplayHandData): Map<number, number[]> {
    const map = new Map<number, number[]>();
    const hands = data?.be_watched_user_hands;
    if (!hands) return map;
    for (const h of hands) {
        const cards = h.data
            .split(',')
            .map(s => parseInt(s))
            .filter(n => !isNaN(n));
        if (cards.length > 0) map.set(h.user_rid, cards);
    }
    return map;
}

function overlayViewedPublicCards(target: number[], pubCardsStr: string) {
    if (!pubCardsStr) return;
    const cards = pubCardsStr
        .split(',')
        .map(s => parseInt(s))
        .filter(n => !isNaN(n));
    for (let i = 0; i < cards.length && i < 5; i++) {
        if (cards[i] > 0) target[i] = cards[i];
    }
}

/** 推断发发看轮次 (1=flop, 2=turn, 3=river) */
export function getViewPubRound(publicCards: number[]): number {
    if (!publicCards || publicCards[0] === 0) return 1;
    if (publicCards[3] === 0) return 2;
    return 3;
}

/** 是否还有未发出的公共牌 */
export function hasHiddenPublicCards(publicCards: number[]): boolean {
    if (!publicCards) return false;
    for (let i = 0; i < 5; i++) {
        if (publicCards[i] === 0) return true;
    }
    return false;
}

/** 是否还有未亮出的他人手牌(控制偷偷看按钮) */
export function hasHiddenCards(data: ReplayHandData, model: HistoryHandModel, myRID: number): boolean {
    if (data.s.mid > 0) {
        return false; // 比赛局不支持偷偷看,直接返回 false
    }
    const watchedHands = buildWatchedHandsMap(data);
    for (const result of data.s.result) {
        if (result.card == null || result.card.length === 0 || result.card[0] <= 0) {
            const player = findPlayerBySeat(model.players, result.sn);
            if (player && player.playerId !== myRID) {
                if (!watchedHands.has(player.playerId)) return true;
            }
        }
    }
    return false;
}

/** 一趟遍历四条街,得出每个座位的最后动作(下标为 seatID) */
function parseLastActions(procedure: typeof WebRoomCenterHistoryReplay.Procedure): Map<number, HistoryLastAction> {
    const lastActions = new Map<number, HistoryLastAction>();
    const raiseCounts = new Map<number, number>();
    const allRounds: ProcedurePl[] = [
        ...(procedure.preflop?.pl ?? []),
        ...(procedure.flop?.pl ?? []),
        ...(procedure.turn?.pl ?? []),
        ...(procedure.river?.pl ?? [])
    ];
    for (const round of allRounds) {
        let raiseCount = raiseCounts.get(round.sn) ?? 0;
        if (round.act === 'bet' || round.act === 'raise') {
            raiseCounts.set(round.sn, ++raiseCount);
        }
        lastActions.set(round.sn, { actName: round.act, actChip: round.act_amt, raiseTimes: raiseCount });
    }
    return lastActions;
}

function parseStreet(pls: ProcedurePl[], playerBySeat: Map<number, HistoryPlayerInfo>, myRID: number, potRef: { pot: number }): HistoryStreetModel {
    const rows: HistoryActionInfo[] = [];
    let raiseTimes = 0;
    for (const pl of pls ?? []) {
        const player = playerBySeat.get(pl.sn);
        if (!player) continue;
        const action = getActionNumByName(pl.act);
        if (action === HistoryActionType.Bet || action === HistoryActionType.Raise) {
            raiseTimes++;
        }
        player.handBet += pl.act_amt;
        if (pl.pot_out > 0) {
            potRef.pot = pl.pot_out;
        }
        rows.push({
            playerId: player.playerId,
            nickName: player.userName,
            headPic: player.headPic,
            // 位置序号在 players 构建时已算好,直接复用避免逐行重排序
            playerPosition: player.playerPosition,
            action,
            actionChip: pl.act_amt,
            leftChips: pl.c,
            raiseTimes: action === HistoryActionType.Bet || action === HistoryActionType.Raise ? raiseTimes : 0,
            isMine: player.playerId === myRID
        });
    }
    return { rows, pot: potRef.pot };
}

/**
 * 把服务端回放 JSON 解析为视图模型(纯函数,不碰 UI)
 * @param data 服务端回放数据(WS 1018 base64 解出 / HTTP replay 接口)
 * @param myRID 自己的随机 ID(userStore.userRID)
 */
export function parseHistoryHand(data: ReplayHandData, myRID: number): HistoryHandModel {
    const s = data.s;
    const procedure = s.procedure;
    // ---------- 公共牌 ----------
    const publicCards = [0, 0, 0, 0, 0];
    if (procedure.flop?.card) {
        for (let i = 0; i < procedure.flop.card.length && i < 5; i++) {
            publicCards[i] = procedure.flop.card[i];
        }
    }
    if (procedure.turn?.card?.length > 0) {
        publicCards[3] = procedure.turn.card[0];
    }
    if (procedure.river?.card?.length > 0) {
        publicCards[4] = procedure.river.card[0];
    }
    // 发发看已揭示的公共牌(缓存回写字段)
    overlayViewedPublicCards(publicCards, data.pub_cards);
    // ---------- 第二套公共牌(双套牌局) ----------
    let secondPublicCards: number[] = [];
    let haveSecondCard = false;
    const scard = procedure.river?.scard;
    if (scard?.length > 0) {
        haveSecondCard = true;
        secondPublicCards = [0, 0, 0, 0, 0];
        if (scard.length < publicCards.length) {
            for (let i = 0; i < publicCards.length - scard.length; i++) {
                secondPublicCards[i] = publicCards[i];
            }
            for (let i = 0; i < scard.length; i++) {
                secondPublicCards[publicCards.length - scard.length + i] = scard[i];
            }
        } else {
            for (let i = 0; i < scard.length; i++) {
                secondPublicCards[i] = scard[i];
            }
        }
        overlayViewedPublicCards(secondPublicCards, data.pub_cards2);
    }
    // ---------- 参与玩家 ----------
    // 座位→位置序号 / 座位→玩家 / user_rid→偷看手牌 都在此一趟建好,后续查表 O(1)
    const positionBySeat = buildPositionMap(
        s.table.pl.map(p => p.sn),
        s.table.btn
    );
    const watchedHands = buildWatchedHandsMap(data);
    let hasMe = false;
    const players: HistoryPlayerInfo[] = s.table.pl.map(pl => {
        const isMine = pl.uid === myRID;
        if (isMine) hasMe = true;
        return {
            playerId: pl.uid,
            userName: pl.name,
            headPic: pl.avatar,
            seatID: pl.sn,
            initChip: pl.c,
            playerPosition: positionBySeat.get(pl.sn) ?? -1,
            isMine,
            handCards: isMine && data.d != null ? data.d : [],
            handBet: 0,
            winAnte: 0,
            insuranceGain: 0,
            maxCardType: 0,
            maxCardIndex: null as number[],
            maxCardType2: 0,
            maxCardIndex2: null as number[],
            winAnte2: null as number[]
        };
    });
    const playerBySeat = new Map<number, HistoryPlayerInfo>();
    for (const player of players) {
        playerBySeat.set(player.seatID, player);
    }
    // ---------- 结算结果写入玩家(含偷偷看手牌回填) ----------
    let insurancePool = 0;
    for (const result of s.result) {
        insurancePool -= result.ins;
        const player = playerBySeat.get(result.sn);
        if (!player) continue;
        if (!player.isMine) {
            player.handCards = result.card ?? [];
            if (!player.handCards.length || player.handCards[0] <= 0) {
                const watched = watchedHands.get(player.playerId);
                if (watched) player.handCards = watched;
            }
        }
        player.maxCardType = result.card_type;
        player.winAnte = result.win;
        player.insuranceGain = result.ins;
        player.maxCardIndex = result.maxcard_idx;
    }
    // ---------- 各街道 ----------
    const potRef = { pot: 0 };
    if (procedure.ante?.pl) {
        for (const pl of procedure.ante.pl) {
            const player = playerBySeat.get(pl.sn);
            if (!player) continue;
            player.handBet += pl.act_amt;
            if (pl.pot_out > 0) potRef.pot = pl.pot_out;
        }
    }
    const preflop = parseStreet(procedure.preflop?.pl, playerBySeat, myRID, potRef);
    const flop = parseStreet(procedure.flop?.pl, playerBySeat, myRID, potRef);
    const turn = parseStreet(procedure.turn?.pl, playerBySeat, myRID, potRef);
    const river = parseStreet(procedure.river?.pl, playerBySeat, myRID, potRef);
    // ---------- Showdown / 双套结算 ----------
    const winners: HistoryPlayerInfo[] = [];
    for (const result of s.result) {
        const player = playerBySeat.get(result.sn);
        if (!player) continue;
        if (haveSecondCard && result.sp_detail?.length > 1) {
            const isWin1 = result.sp_detail[0].is_winner;
            const isWin2 = result.sp_detail[1].is_winner;
            const win1 = result.sp_detail[0].win;
            const win2 = result.sp_detail[1].win;
            const fee = result.fee;
            let fee1 = 0;
            let fee2 = 0;
            if (isWin1 && isWin2) {
                if (fee !== 0) {
                    fee1 = (win1 * fee) / (win1 + win2);
                    fee2 = fee - fee1;
                }
            } else {
                fee1 = isWin1 ? fee : 0;
                fee2 = isWin2 ? fee : 0;
            }
            const handBet1 = player.handBet / 2;
            const handBet2 = player.handBet - handBet1;
            player.winAnte2 = [win1 - fee1 - handBet1, win2 - fee2 - handBet2];
            player.maxCardType2 = result.card_type2;
            player.maxCardIndex2 = result.maxcard_idx2;
        }
        winners.push(player);
    }
    return {
        handNum: s.hand,
        playerCount: s.table.pl.length,
        hasMe,
        hasResult: s.result.length > 0,
        publicCards,
        secondPublicCards,
        haveSecondCard,
        players,
        winners,
        preflop,
        flop,
        turn,
        river,
        showdownPot: potRef.pot,
        insurancePool,
        lastActions: parseLastActions(procedure)
    };
}
