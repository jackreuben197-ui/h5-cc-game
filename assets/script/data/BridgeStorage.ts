/**
 * BridgeStorage —— Cocos 端持久化的唯一出口(对齐 h5-game ccStorageProxy 协议)。
 *
 * 所有持久化操作经 h5MessageManager 发到 H5 进程,由 H5 落到 user_cache_${userId}
 * (IndexedDB)和 dzpk_cc_* 命名空间下的 localStorage,两端共用同一份存储。
 *
 * IndexedDB:
 *   - get/getAll/put/delete/clear 均是 request/reply:发送 ccStorageOp 携带 requestId,
 *     等 H5 回 ccStorageResult 后 resolve;超时按失败处理(resolve null/空),不悬挂调用方。
 *   - 表名由 H5 端白名单(CC_CACHE_STORES)校验:table_user_base_info / table_user_data_info / game_replays。
 *
 * localStorage:
 *   - Cocos 维护一份内存镜像,保证 getItem 是同步 API。
 *   - 握手完成后 H5 通过 ccStorageSnapshot 把 dzpk_cc_* 命名空间下的全部键值回灌过来。
 *   - 写操作 fire-and-forget:先更新内存,再发 ccStorageOp(set/remove/clear)。
 */
import type { CcIndexedDBOpPayload, CcLocalStorageOpPayload, CcStorageResultPayload, CcStorageSnapshotPayload } from '@silenthill/h5-cc-bridge/cc-side';
import { createLogger } from '../core/decorator/LogTrace';
import h5MessageManager from '../H5MsgMgr';
import StorageKey from './StorageKey';

/** 与 h5-game utils/indexedDB.ts 的 CC_CACHE_STORES 白名单严格对齐 */
export const STORE_TABLE_USER_BASE_INFO = StorageKey.STORE_TABLE_USER_BASE_INFO;

export const STORE_TABLE_USER_DATA_INFO = StorageKey.STORE_TABLE_USER_DATA_INFO;

export const STORE_GAME_REPLAYS = StorageKey.STORE_GAME_REPLAYS;

export type BridgeIndexedDBStore = typeof STORE_TABLE_USER_BASE_INFO | typeof STORE_TABLE_USER_DATA_INFO | typeof STORE_GAME_REPLAYS;

type PendingResolver = (result: CcStorageResultPayload) => void;

const _plog = createLogger('[BridgeStorage]');

export class BridgeStorage {
    /** request/reply 超时(ms):超时按 ok=false 收尾,避免 H5 无响应时调用方永久挂起 */
    private static readonly REQUEST_TIMEOUT = 5000;
    private _installed: boolean = false;
    private _pending: Map<string, PendingResolver> = new Map();
    private _localMirror: Map<string, string> = new Map();
    private _snapshotLoaded: boolean = false;
    private _reqSeq: number = 0;

    /** MainUtils.registerH5Listeners 中调用一次,注册 ccStorageResult / ccStorageSnapshot 监听 */
    public install(): void {
        if (this._installed) return;
        this._installed = true;
        h5MessageManager.on('ccStorageResult', payload => {
            const resp = payload as CcStorageResultPayload;
            if (!resp || !resp.requestId) return;
            const resolver = this._pending.get(resp.requestId);
            if (!resolver) return;
            this._pending.delete(resp.requestId);
            resolver(resp);
        });
        h5MessageManager.on('ccStorageSnapshot', payload => {
            const snap = payload as CcStorageSnapshotPayload;
            this._localMirror.clear();
            const entries = (snap && snap.entries) || {};
            Object.keys(entries).forEach(k => {
                this._localMirror.set(k, entries[k]);
            });
            this._snapshotLoaded = true;
            _plog.info('localStorage snapshot 回灌完成, 共', this._localMirror.size, '项');
        });
    }

    /** 是否已经收到过 localStorage 快照;尚未收到时 localStorageGet 只能返回 null */
    public get snapshotLoaded(): boolean {
        return this._snapshotLoaded;
    }

    // ==================== IndexedDB ====================

    public indexedDBGet<T>(store: BridgeIndexedDBStore, key: IDBValidKey): Promise<T | null> {
        return this._sendIndexedDB({ store, op: 'get', key }).then(resp => {
            if (!resp.ok) return null;
            return (resp.value as T | undefined) ?? null;
        });
    }

    public indexedDBGetAll<T>(store: BridgeIndexedDBStore): Promise<T[]> {
        return this._sendIndexedDB({ store, op: 'getAll' }).then(resp => {
            if (!resp.ok) return [];
            return Array.isArray(resp.value) ? (resp.value as T[]) : [];
        });
    }

    public indexedDBPut<T>(store: BridgeIndexedDBStore, key: IDBValidKey, value: T): Promise<void> {
        return this._sendIndexedDB({ store, op: 'put', key, value }).then((): void => undefined);
    }

    public indexedDBDelete(store: BridgeIndexedDBStore, key: IDBValidKey): Promise<void> {
        return this._sendIndexedDB({ store, op: 'delete', key }).then((): void => undefined);
    }

    public indexedDBClear(store: BridgeIndexedDBStore): Promise<void> {
        return this._sendIndexedDB({ store, op: 'clear' }).then((): void => undefined);
    }
    // ==================== localStorage ====================

    /** 同步读:来自内存镜像;握手前/未推 snapshot 时返回 null */
    public localStorageGet(key: string): string | null {
        if (!key) return null;
        const v = this._localMirror.get(key);
        return v === undefined ? null : v;
    }

    /** 写:先改内存镜像,再发 fire-and-forget 请求到 H5,无需等回包 */
    public localStorageSet(key: string, value: string): void {
        if (!key) return;
        const v = value == null ? '' : String(value);
        this._localMirror.set(key, v);
        const payload: CcLocalStorageOpPayload = {
            storage: 'localstorage',
            op: 'set',
            key,
            value: v
        };
        h5MessageManager.sendToH5('ccStorageOp', 1, payload);
    }

    public localStorageRemove(key: string): void {
        if (!key) return;
        this._localMirror.delete(key);
        const payload: CcLocalStorageOpPayload = {
            storage: 'localstorage',
            op: 'remove',
            key
        };
        h5MessageManager.sendToH5('ccStorageOp', 1, payload);
    }

    public localStorageClear(): void {
        this._localMirror.clear();
        const payload: CcLocalStorageOpPayload = {
            storage: 'localstorage',
            op: 'clear'
        };
        h5MessageManager.sendToH5('ccStorageOp', 1, payload);
    }

    // ==================== 内部 ====================

    private _nextRequestId(): string {
        this._reqSeq = (this._reqSeq + 1) | 0;
        return `cc_storage_${Date.now()}_${this._reqSeq}_${Math.random().toString(36).slice(2, 8)}`;
    }

    private _sendIndexedDB(args: {
        store: BridgeIndexedDBStore;
        op: CcIndexedDBOpPayload['op'];
        key?: IDBValidKey;
        value?: unknown;
    }): Promise<CcStorageResultPayload> {
        const requestId = this._nextRequestId();
        const payload: CcIndexedDBOpPayload = {
            requestId,
            storage: 'indexeddb',
            store: args.store,
            op: args.op
        };
        if (args.key !== undefined) payload.key = args.key;
        if (args.value !== undefined) payload.value = args.value;
        return new Promise<CcStorageResultPayload>(resolve => {
            const timer = setTimeout(() => {
                if (this._pending.delete(requestId)) {
                    _plog.warn('ccStorageOp 超时', args.op, args.store, requestId);
                    resolve({ requestId, ok: false, error: 'timeout' });
                }
            }, BridgeStorage.REQUEST_TIMEOUT);
            this._pending.set(requestId, resp => {
                clearTimeout(timer);
                resolve(resp);
            });
            h5MessageManager.sendToH5('ccStorageOp', 1, payload);
        });
    }
}

const bridgeStorage = new BridgeStorage();

export default bridgeStorage;
