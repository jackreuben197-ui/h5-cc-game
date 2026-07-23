import { bindData, pureEvent } from '../../../core/decorator/DataBind';
import { WebRoomCenterHistoryReplay } from '../../../net/https/WebRequest';
import bridgeStorage from '../../BridgeStorage';
import StorageKey from '../../StorageKey';
import userStore from '../../user/UserStore';
import TexasGameRoomData from './TexasGameRoomData';

export type ReplayHandData = typeof WebRoomCenterHistoryReplay.Data & {
    // 发发看揭示的公共牌(HTTP 回包合并进缓存,解析时 overlay 到公共牌数组)
    pub_cards?: string;
    pub_cards2?: string;
    // 本手牌收藏状态(查询/增删收藏后合并进缓存,翻回该页不再请求)
    collected?: boolean;
};

@bindData()
export default class TexasGameRoomDataReplay extends cc.EventTarget {
    public static readonly REPLAY_DATA_CHANGE = 'REPLAY_DATA_CHANGE';
    public static readonly REPLAY_EMPTY = 'REPLAY_EMPTY';
    // 正在等待服务端回包的手数(-1 表示无挂起请求)
    public pendingHandNum: number = -1;
    // 内存缓存(离房随 roomData 一起销毁);持久层在 H5 侧 game_replays 表
    private _cache: Map<number, ReplayHandData> = new Map();
    private _roomData: TexasGameRoomData;

    constructor(rd: TexasGameRoomData) {
        super();
        this._roomData = rd;
    }

    public getCached(handNum: number): ReplayHandData | null {
        return this._cache.get(handNum) ?? null;
    }

    /** 从持久缓存(H5 侧 IndexedDB)读取;命中时同时填入内存缓存 */
    public async loadPersistent(handNum: number): Promise<ReplayHandData | null> {
        const uid = userStore.userRID;
        if (!uid) return null;
        let data = await bridgeStorage.indexedDBGet<ReplayHandData>(
            StorageKey.STORE_GAME_REPLAYS,
            StorageKey.getReplayRoomKey(uid, this._roomData.roomID, handNum)
        );
        if (!data && this._roomData.matchID) {
            data = await bridgeStorage.indexedDBGet<ReplayHandData>(
                StorageKey.STORE_GAME_REPLAYS,
                StorageKey.getReplayMatchKey(uid, this._roomData.matchID, handNum)
            );
        }
        if (data) {
            this._cache.set(handNum, data);
        }
        return data ?? null;
    }

    /** 写入持久缓存(roomKey 为主,MTT 场景加写 matchKey),fire-and-forget */
    public persist(handNum: number, data: ReplayHandData) {
        const uid = userStore.userRID;
        if (!uid || !(handNum > 0)) return;
        bridgeStorage.indexedDBPut(StorageKey.STORE_GAME_REPLAYS, StorageKey.getReplayRoomKey(uid, this._roomData.roomID, handNum), data);
        if (this._roomData.matchID) {
            bridgeStorage.indexedDBPut(StorageKey.STORE_GAME_REPLAYS, StorageKey.getReplayMatchKey(uid, this._roomData.matchID, handNum), data);
        }
    }

    /** 内存 + 持久双写(偷偷看/发发看合并后的回写用) */
    public updateCache(handNum: number, data: ReplayHandData) {
        this._cache.set(handNum, data);
        this.persist(handNum, data);
    }

    /** 合并偷偷看回包的手牌到缓存(同 uid 覆盖),双写并重发数据事件 */
    public mergeWatchedHands(handNum: number, hands: { user_rid: number; data: string }[]) {
        const cached = this._cache.get(handNum);
        if (!cached || !hands || hands.length === 0) return;
        if (!cached.be_watched_user_hands) {
            cached.be_watched_user_hands = [];
        }
        for (const hand of hands) {
            const existing = cached.be_watched_user_hands.find(h => h.user_rid === hand.user_rid);
            if (existing) {
                existing.data = hand.data;
            } else {
                cached.be_watched_user_hands.push({ user_rid: hand.user_rid, data: hand.data });
            }
        }
        this.persist(handNum, cached);
        this.applyReplay(cached);
    }

    /** 合并发发看回包的公共牌到缓存,双写并重发数据事件 */
    public mergeViewedPublicCards(handNum: number, viewData: { pub_cards?: string; pub_cards2?: string }) {
        const cached = this._cache.get(handNum);
        if (!cached || !viewData) return;
        if (viewData.pub_cards) cached.pub_cards = this._mergeViewedCardString(cached.pub_cards, viewData.pub_cards);
        if (viewData.pub_cards2) cached.pub_cards2 = this._mergeViewedCardString(cached.pub_cards2, viewData.pub_cards2);
        this.persist(handNum, cached);
        this.applyReplay(cached);
    }

    private _mergeViewedCardString(cachedCards: string, viewedCards: string): string {
        const cards = cachedCards ? cachedCards.split(',') : [];
        while (cards.length < 5) cards.push('0');
        const viewed = viewedCards.split(',').filter(card => Number(card) > 0);
        let viewedIndex = 0;
        for (let i = 0; i < 5 && viewedIndex < viewed.length; i++) {
            if (Number(cards[i]) !== 0) continue;
            cards[i] = viewed[viewedIndex++];
        }
        return cards.slice(0, 5).join(',');
    }

    /** 收藏状态(合并在手牌缓存记录上,null 表示尚未查询过) */
    public getCollected(handNum: number): boolean | null {
        return this._cache.get(handNum)?.collected ?? null;
    }

    /** 收藏状态写入手牌缓存并持久化(查询回包/收藏增删成功后调用) */
    public setCollected(handNum: number, collected: boolean) {
        const cached = this._cache.get(handNum);
        if (!cached) return;
        cached.collected = collected;
        this.persist(handNum, cached);
    }
    // ==================== 偷看次数 / VIP 免费次数(内存 + H5 IndexedDB 双级缓存) ====================
    // 内存缓存 null 表示未加载;偷偷看/发发看购买成功后 clear,下次取价重新拉取回填
    private _peekTimes: number = null;
    private _viewPubFreeCount: number = null;

    /** 偷偷看已付费次数(房间级),未缓存返回 null */
    public async getPeekTimes(): Promise<number | null> {
        if (this._peekTimes != null) return this._peekTimes;
        const uid = userStore.userRID;
        if (!uid) return null;
        const cached = await bridgeStorage.indexedDBGet<number>(
            StorageKey.STORE_TABLE_USER_DATA_INFO,
            StorageKey.getReplayPeekTimesKey(uid, this._roomData.roomID)
        );
        if (cached != null) this._peekTimes = cached;
        return cached;
    }

    public setPeekTimes(times: number) {
        this._peekTimes = times;
        const uid = userStore.userRID;
        if (!uid) return;
        bridgeStorage.indexedDBPut(StorageKey.STORE_TABLE_USER_DATA_INFO, StorageKey.getReplayPeekTimesKey(uid, this._roomData.roomID), times);
    }

    public clearPeekTimes() {
        this._peekTimes = null;
        const uid = userStore.userRID;
        if (!uid) return;
        bridgeStorage.indexedDBDelete(StorageKey.STORE_TABLE_USER_DATA_INFO, StorageKey.getReplayPeekTimesKey(uid, this._roomData.roomID));
    }

    /** 发发看 VIP 免费剩余次数(用户级),未缓存返回 null */
    public async getViewPubFreeCount(): Promise<number | null> {
        if (this._viewPubFreeCount != null) return this._viewPubFreeCount;
        const uid = userStore.userRID;
        if (!uid) return null;
        const cached = await bridgeStorage.indexedDBGet<number>(StorageKey.STORE_TABLE_USER_DATA_INFO, StorageKey.getReplayViewPubFreeKey(uid));
        if (cached != null) this._viewPubFreeCount = cached;
        return cached;
    }

    public setViewPubFreeCount(count: number) {
        this._viewPubFreeCount = count;
        const uid = userStore.userRID;
        if (!uid) return;
        bridgeStorage.indexedDBPut(StorageKey.STORE_TABLE_USER_DATA_INFO, StorageKey.getReplayViewPubFreeKey(uid), count);
    }

    public clearViewPubFreeCount() {
        this._viewPubFreeCount = null;
        const uid = userStore.userRID;
        if (!uid) return;
        bridgeStorage.indexedDBDelete(StorageKey.STORE_TABLE_USER_DATA_INFO, StorageKey.getReplayViewPubFreeKey(uid));
    }

    @pureEvent(TexasGameRoomDataReplay.REPLAY_DATA_CHANGE)
    public applyReplay(data: ReplayHandData) {
        const handNum = data?.s?.hand;
        if (handNum > 0) {
            this._cache.set(handNum, data);
        }
        this.pendingHandNum = -1;
    }

    @pureEvent(TexasGameRoomDataReplay.REPLAY_EMPTY)
    public applyEmpty() {
        this.pendingHandNum = -1;
    }
}
