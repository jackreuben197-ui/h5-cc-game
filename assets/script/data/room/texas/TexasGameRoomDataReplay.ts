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
        if (viewData.pub_cards) cached.pub_cards = viewData.pub_cards;
        if (viewData.pub_cards2) cached.pub_cards2 = viewData.pub_cards2;
        this.persist(handNum, cached);
        this.applyReplay(cached);
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
