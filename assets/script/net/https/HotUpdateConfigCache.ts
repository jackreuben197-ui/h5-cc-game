import { GameConfig } from '../../config/GameConfig';
import storageManager from '../../data/LocalStorage';
import StorageKey from '../../data/StorageKey';
import HttpClient from './HttpClient';

interface LegacyConfigEntry {
    legacyApi: string;
    hotApi: string;
    bundlePath: string;
    cacheKey: string;
}

interface CacheEnvelope {
    payload: any;
    lastUpdateTime: number;
    updatedAt: number;
    source: 'bundle' | 'remote';
}

type RequestCtx = {
    api: string;
    request: any;
    headers: any[];
    onSuccess: Function | null;
};

export default class HotUpdateConfigCache {
    private static readonly ENTRIES: LegacyConfigEntry[] = [
        {
            legacyApi: '/api/config/global/config',
            hotApi: '/api/config/hot_update/config',
            bundlePath: 'config/GlobalConfig',
            cacheKey: StorageKey.HOT_UPDATE_GLOBAL_CONFIG_CACHE
        },
        {
            legacyApi: '/api/cmsext/room/template/list',
            hotApi: '/api/cmsext/hot_update/template/list',
            bundlePath: 'config/RoomTemplateListConfig',
            cacheKey: StorageKey.HOT_UPDATE_ROOM_TEMPLATE_CACHE
        }
    ];

    public static async HandleLegacyConfigRequest(ctx: RequestCtx): Promise<boolean> {
        const entry = this.ENTRIES.find(item => item.legacyApi === ctx.api);
        if (!entry) {
            return false;
        }
        const localCache = this.getOrInitCache(entry);
        if (localCache?.payload) {
            this.applyResponse(ctx.request, localCache.payload);
            ctx.onSuccess && ctx.onSuccess(localCache.payload);
            this.syncWithHotApi(entry, localCache.lastUpdateTime, ctx.headers).catch(err => {
                console.warn('Hot config background sync failed:', entry.hotApi, err);
            });
            return true;
        }
        const remote = await this.syncWithHotApi(entry, 0, ctx.headers);
        if (remote?.payload) {
            this.applyResponse(ctx.request, remote.payload);
            ctx.onSuccess && ctx.onSuccess(remote.payload);
            return true;
        }
        return false;
    }

    private static applyResponse(request: any, payload: any) {
        request && (request.Response = payload);
    }

    private static getOrInitCache(entry: LegacyConfigEntry): CacheEnvelope | null {
        const cached = storageManager.getItem(entry.cacheKey, null);
        const normalizedCached = this.normalizeEnvelope(entry, cached);
        if (normalizedCached?.payload) {
            return normalizedCached;
        }
        const bundled = this.readBundled(entry);
        if (!bundled?.payload) {
            return null;
        }
        this.saveCache(entry, bundled);
        return bundled;
    }

    private static readBundled(entry: LegacyConfigEntry): CacheEnvelope | null {
        const asset = cc.resources.get(entry.bundlePath, cc.TextAsset) as cc.TextAsset;
        if (!asset?.text) {
            return null;
        }
        try {
            const parsed = JSON.parse(asset.text);
            const normalized = this.normalizeEnvelope(entry, parsed);
            return normalized;
        } catch (error) {
            console.warn('Parse bundled hot config failed:', entry.bundlePath, error);
            return null;
        }
    }

    private static normalizeEnvelope(entry: LegacyConfigEntry, raw: any): CacheEnvelope | null {
        if (!raw) {
            return null;
        }
        if (raw.payload && typeof raw.lastUpdateTime === 'number') {
            return raw as CacheEnvelope;
        }
        const transformed = this.transformHotToLegacy(entry, raw);
        if (!transformed) {
            return null;
        }
        return {
            payload: transformed.payload,
            lastUpdateTime: transformed.lastUpdateTime,
            updatedAt: Date.now(),
            source: 'bundle'
        };
    }

    private static async syncWithHotApi(entry: LegacyConfigEntry, lastUpdateTime: number, headers: any[]): Promise<CacheEnvelope | null> {
        const host = GameConfig.Network?.WebHost;
        if (!host) {
            return null;
        }
        const body = this.buildHotRequestBody(entry, lastUpdateTime);
        const response = await this.post(host + entry.hotApi, body, headers);
        if (!response || response.code !== 0) {
            return null;
        }
        const transformed = this.transformHotToLegacy(entry, response);
        if (!transformed) {
            return null;
        }
        // 热更接口无变更时通常返回空内容或不带数据，继续沿用本地缓存。
        if (!transformed.hasData) {
            return this.getOrInitCache(entry);
        }
        const envelope: CacheEnvelope = {
            payload: transformed.payload,
            lastUpdateTime: transformed.lastUpdateTime,
            updatedAt: Date.now(),
            source: 'remote'
        };
        this.saveCache(entry, envelope);
        return envelope;
    }

    private static buildHotRequestBody(entry: LegacyConfigEntry, lastUpdateTime: number): any {
        if (entry.legacyApi === '/api/config/global/config') {
            return {
                global_config_req: {
                    last_update_time: lastUpdateTime || 0
                }
            };
        }
        if (entry.legacyApi === '/api/cmsext/room/template/list') {
            return {
                last_update_time: lastUpdateTime || 0
            };
        }
        return {};
    }

    private static transformHotToLegacy(entry: LegacyConfigEntry, response: any): { payload: any; lastUpdateTime: number; hasData: boolean } | null {
        if (entry.legacyApi === '/api/config/global/config') {
            return this.transformGlobalConfig(response);
        }
        if (entry.legacyApi === '/api/cmsext/room/template/list') {
            return this.transformRoomTemplate(response);
        }
        return null;
    }

    private static transformGlobalConfig(response: any): { payload: any; lastUpdateTime: number; hasData: boolean } | null {
        const rootData = response?.data || {};
        const globalResp = rootData.global_config_resp || {};
        const globalConfig = globalResp.global_config || rootData.global_config || rootData.data || null;
        const lastUpdateTime = Number(globalResp.last_update_time || rootData.last_update_time || 0);
        const hasData = !!globalConfig;
        return {
            payload: {
                code: 0,
                message: response?.message || 'ok',
                data: globalConfig || {}
            },
            lastUpdateTime,
            hasData
        };
    }

    private static transformRoomTemplate(response: any): { payload: any; lastUpdateTime: number; hasData: boolean } | null {
        const rootData = response?.data || {};
        const list = Array.isArray(rootData.data) ? rootData.data : Array.isArray(rootData.list) ? rootData.list : [];
        const lastUpdateTime = Number(rootData.last_update_time || 0);
        const hasData = list.length > 0;
        return {
            payload: {
                code: 0,
                message: response?.message || 'ok',
                data: list
            },
            lastUpdateTime,
            hasData
        };
    }

    private static saveCache(entry: LegacyConfigEntry, envelope: CacheEnvelope) {
        storageManager.setItem(entry.cacheKey, envelope);
    }

    private static post(url: string, body: any, headers: any[]): Promise<any> {
        return new Promise(resolve => {
            HttpClient.post({
                url,
                body,
                headers,
                needJuhua: false,
                needConsole: false,
                api: url,
                onSuccess: (res: any) => resolve(res),
                onFailure: () => resolve(null)
            });
        });
    }
}
