import { Def, HandInfo } from '@silenthill/agreement-web';
import { createLogger } from '../../../core/decorator/LogTrace';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';

const _auditLog = createLogger('TexasStateAudit');

type SnapshotSource = 'EnterRoom' | 'SyncEnter' | 'StartInfo' | 'PublicCards';

interface ServerHandSnapshot {
    handNum: number;
    publicCards: number[];
    gameStatus: number;
    source: SnapshotSource;
}

interface SnapshotPlayer {
    seatId: number;
}

interface SnapshotOperator {
    seatId: number;
    isInsurance: boolean;
    isAgreeSecondPc: boolean;
}

const _lastServerSnapshots: Map<string, ServerHandSnapshot> = new Map();

export function auditHandSnapshot(
    source: SnapshotSource,
    roomID: number,
    matchID: number,
    gameStatus: Def.GameStatusMap[keyof Def.GameStatusMap],
    handInfo: HandInfo.AsObject | undefined,
    players: SnapshotPlayer[],
    operators: SnapshotOperator[],
    roomData: TexasGameRoomData
): void {
    const cards = handInfo?.publicCardsList || [];
    const handNum = handInfo?.handNum || 0;
    const expectedCount = source == 'StartInfo' ? null : getExpectedSnapshotCardCount(gameStatus);
    const invalidReasons: string[] = [];

    if (expectedCount != null && cards.length != expectedCount) {
        invalidReasons.push(`gameStatus=${gameStatus} expectedCards=${expectedCount} actualCards=${cards.length}`);
    }
    if (cards.some(card => card <= 0)) invalidReasons.push('publicCards contains card <= 0');
    if (new Set(cards).size != cards.length) invalidReasons.push('publicCards contains duplicate cards');
    if (handInfo && handNum <= 0) invalidReasons.push('handInfo exists but handNum <= 0');

    const playerSeats = new Set<number>();
    players.forEach(player => {
        if (playerSeats.has(player.seatId)) invalidReasons.push(`duplicate player seat=${player.seatId}`);
        playerSeats.add(player.seatId);
    });
    const normalOperators = operators.filter(operator => !operator.isInsurance && !operator.isAgreeSecondPc);
    if (normalOperators.length > 1) invalidReasons.push(`multiple normal operators=${normalOperators.map(v => v.seatId).join(',')}`);
    operators.forEach(operator => {
        if (!playerSeats.has(operator.seatId)) invalidReasons.push(`operator seat=${operator.seatId} is absent from players`);
    });

    const key = `${roomID}-${matchID}`;
    const previousServer = _lastServerSnapshots.get(key);
    let snapshotConsistent = invalidReasons.length == 0;
    if (previousServer && previousServer.handNum == handNum) {
        if (cards.length < previousServer.publicCards.length && isCardPrefix(cards, previousServer.publicCards)) {
            snapshotConsistent = false;
            _auditLog.error('[server_snapshot_regressed]', {
                roomID,
                matchID,
                handNum,
                previous: previousServer,
                current: { source, gameStatus, publicCards: cards }
            });
        } else if (!isCardPrefix(previousServer.publicCards, cards)) {
            snapshotConsistent = false;
            _auditLog.error('[server_snapshot_changed]', {
                roomID,
                matchID,
                handNum,
                previous: previousServer,
                current: { source, gameStatus, publicCards: cards }
            });
        }
    } else if (previousServer && handNum > 0 && handNum < previousServer.handNum) {
        snapshotConsistent = false;
        _auditLog.error('[server_snapshot_hand_regressed]', {
            roomID,
            matchID,
            previous: previousServer,
            current: { source, handNum, gameStatus, publicCards: cards }
        });
    }
    if (invalidReasons.length > 0) {
        _auditLog.error('[server_snapshot_invalid]', {
            source,
            roomID,
            matchID,
            handNum,
            gameStatus,
            publicCards: cards,
            reasons: invalidReasons
        });
    }

    const localCards = roomData.publicCards.publicCards;
    if (!roomData.mtt.tableTransferWaiting && roomData.basicInfo.handNum == handNum && !sameCards(localCards, cards)) {
        _auditLog.warn('[local_cache_drift]', {
            source,
            roomID,
            matchID,
            handNum,
            gameStatus,
            localGameStatus: roomData.basicInfo.gameStatus,
            localPublicCards: localCards,
            serverPublicCards: cards
        });
    }
    // 异常快照不覆盖审计基线，便于后续日志持续保留最后一次可信服务端状态。
    if (snapshotConsistent) {
        _lastServerSnapshots.set(key, { handNum, publicCards: [...cards], gameStatus, source });
    }
}

export function auditPublicCardsIncrement(
    roomID: number,
    matchID: number,
    handNum: number,
    round: Def.RoundMap[keyof Def.RoundMap],
    currentCards: number[],
    incomingCards: number[]
): boolean {
    const expectedIncomingCount = round == Def.Round.FLOP ? 3 : round == Def.Round.TURN || round == Def.Round.RIVER ? 1 : 0;
    const expectedCurrentCount = round == Def.Round.FLOP ? 0 : round == Def.Round.TURN ? 3 : round == Def.Round.RIVER ? 4 : -1;
    const reasons: string[] = [];
    if (expectedIncomingCount == 0 || incomingCards.length != expectedIncomingCount) {
        reasons.push(`round=${round} expectedIncoming=${expectedIncomingCount} actualIncoming=${incomingCards.length}`);
    }
    if (currentCards.length != expectedCurrentCount) {
        reasons.push(`round=${round} expectedCurrent=${expectedCurrentCount} actualCurrent=${currentCards.length}`);
    }
    if (incomingCards.some(card => card <= 0)) reasons.push('incoming cards contains card <= 0');
    const combined = [...currentCards, ...incomingCards];
    if (new Set(combined).size != combined.length) reasons.push('incoming cards duplicates current board');
    if (reasons.length > 0) {
        _auditLog.error('[server_increment_invalid]', {
            roomID,
            matchID,
            handNum,
            round,
            currentCards,
            incomingCards,
            reasons
        });
        return false;
    }

    const key = `${roomID}-${matchID}`;
    const previousServer = _lastServerSnapshots.get(key);
    const incrementConsistent = !previousServer || previousServer.handNum != handNum || isCardPrefix(previousServer.publicCards, combined);
    if (!incrementConsistent) {
        _auditLog.error('[server_increment_changed]', {
            roomID,
            matchID,
            handNum,
            previous: previousServer,
            current: { source: 'PublicCards', round, publicCards: combined }
        });
    }
    if (incrementConsistent) {
        _lastServerSnapshots.set(key, {
            handNum,
            publicCards: combined,
            gameStatus: getGameStatusForRound(round),
            source: 'PublicCards'
        });
    }
    return true;
}

function getExpectedSnapshotCardCount(gameStatus: Def.GameStatusMap[keyof Def.GameStatusMap]): number | null {
    switch (gameStatus) {
        case Def.GameStatus.NOT_START:
        case Def.GameStatus.WAIT_HAND_START:
        case Def.GameStatus.HAND_STARTED:
        case Def.GameStatus.HAND_PREFLOP:
            return 0;
        case Def.GameStatus.HAND_FLOP:
            return 3;
        case Def.GameStatus.HAND_TURN:
            return 4;
        case Def.GameStatus.HAND_RIVER:
            return 5;
        default:
            // HAND_END 可能在翻牌前结束，不限定牌数。
            return null;
    }
}

function getGameStatusForRound(round: Def.RoundMap[keyof Def.RoundMap]): number {
    switch (round) {
        case Def.Round.FLOP:
            return Def.GameStatus.HAND_FLOP;
        case Def.Round.TURN:
            return Def.GameStatus.HAND_TURN;
        case Def.Round.RIVER:
            return Def.GameStatus.HAND_RIVER;
        default:
            return Def.GameStatus.HAND_STARTED;
    }
}

function sameCards(a: number[], b: number[]): boolean {
    return a.length == b.length && a.every((card, index) => card == b[index]);
}

function isCardPrefix(prefix: number[], cards: number[]): boolean {
    return prefix.length <= cards.length && prefix.every((card, index) => card == cards[index]);
}
