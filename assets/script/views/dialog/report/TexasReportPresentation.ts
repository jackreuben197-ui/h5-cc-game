import TexasGameRoomDataBasic from '../../../data/room/texas/TexasGameRoomDataBasic';
import { TexasReportPlayerInfo, TexasReportSquidRoundSnapshot } from '../../../data/room/texas/TexasGameRoomDataReport';

export type TexasReportMode = 'none' | 'mush' | 'squid';

// 只做页面展示需要的计算，不碰节点，也不发请求。
export default class TexasReportPresentation {
    // 两套配置可能同时残留，牌桌其它流程也是鱿鱼优先，这里保持同一口径。
    public static resolveMode(basicInfo: TexasGameRoomDataBasic): TexasReportMode {
        if (basicInfo.hasSquid || (basicInfo.squidBase || 0) > 0 || basicInfo.squidStatusEnabled) return 'squid';
        if ((basicInfo.mushroomMode || 0) > 0 || basicInfo.mushroomStatusEnabled) return 'mush';
        return 'none';
    }

    public static getPlayerScore(player: TexasReportPlayerInfo): number {
        return (player.win || 0) + (player.storeChips || 0);
    }

    // 在线玩家排前面，每组里再按战绩从高到低排。
    public static filterAndSortPlayers(players: TexasReportPlayerInfo[], tableUserIDs: Set<number>, onlyTablePlayers: boolean): TexasReportPlayerInfo[] {
        const filtered = onlyTablePlayers ? players.filter(player => tableUserIDs.has(Number(player.userRid))) : players.slice();
        const compareScore = (a: TexasReportPlayerInfo, b: TexasReportPlayerInfo) => this.getPlayerScore(b) - this.getPlayerScore(a);
        return filtered
            .filter(player => player.isOnline)
            .sort(compareScore)
            .concat(filtered.filter(player => !player.isOnline).sort(compareScore));
    }

    public static getLatestRound(rounds: Map<number, TexasReportSquidRoundSnapshot>): number {
        let latestRound = 0;
        rounds.forEach((_snapshot, round) => {
            latestRound = Math.max(latestRound, round);
        });
        return latestRound;
    }

    // 当前页可能还没拉到，用已有缓存里的总轮数兜住分页。
    public static getTotalRound(rounds: Map<number, TexasReportSquidRoundSnapshot>): number {
        let totalRound = 0;
        rounds.forEach(snapshot => {
            totalRound = Math.max(totalRound, snapshot.totalRound || 0);
        });
        return totalRound;
    }
}
