type AnyJson = Record<string, any> | any[] | string | number | boolean | null;

export type WebApiCacheContext = {
    api: string;
    method: 'GET' | 'POST';
    url: string;
    body?: AnyJson;
    headers?: Array<[string, string]> | null;
    requestClassName?: string;
};

export type WebApiCacheRecord = {
    key: string;
    hash: string;
    response: AnyJson;
    updatedAt: number;
    createdAt: number;
};

export default class WebApiCacheCenter {
    private static readonly _memory = new Map<string, WebApiCacheRecord>();
    static readonly DEFAULT_SKIP_REQUEST_TTL_MS = 60 * 1000;
    static readonly DEFAULT_DATA_TTL_MS = 24 * 60 * 60 * 1000;

    static get(key: string, ttlMs: number = 0): WebApiCacheRecord | null {
        const record = this._memory.get(key);
        if (!record) return null;
        if (ttlMs > 0 && Date.now() - record.updatedAt > ttlMs) {
            this._memory.delete(key);
            return null;
        }
        return {
            ...record,
            response: this.deepClone(record.response)
        };
    }

    static set(key: string, response: AnyJson, hash?: string): WebApiCacheRecord {
        const safeResponse = this.deepClone(response);
        const nextHash = hash || this.hashFromJson(safeResponse);
        const previous = this._memory.get(key);
        const record: WebApiCacheRecord = {
            key,
            hash: nextHash,
            response: safeResponse,
            updatedAt: Date.now(),
            createdAt: previous?.createdAt || Date.now()
        };
        this._memory.set(key, record);
        return {
            ...record,
            response: this.deepClone(record.response)
        };
    }

    static touch(key: string): WebApiCacheRecord | null {
        const record = this._memory.get(key);
        if (!record) return null;
        const next: WebApiCacheRecord = {
            ...record,
            updatedAt: Date.now()
        };
        this._memory.set(key, next);
        return {
            ...next,
            response: this.deepClone(next.response)
        };
    }

    static ageMs(record: WebApiCacheRecord): number {
        return Math.max(0, Date.now() - record.updatedAt);
    }

    static isWithin(record: WebApiCacheRecord, ttlMs: number): boolean {
        if (ttlMs <= 0) return false;
        return this.ageMs(record) <= ttlMs;
    }

    static buildDefaultKey(ctx: WebApiCacheContext): string {
        return [ctx.requestClassName || 'WebCommon', ctx.method, ctx.api, this.stableStringify(ctx.body || {}), this.stableStringify(ctx.headers || [])].join(
            '::'
        );
    }

    static hashFromJson(payload: AnyJson): string {
        const content = this.stableStringify(payload);
        let hash = 5381;
        for (let i = 0; i < content.length; i += 1) {
            hash = (hash * 33) ^ content.charCodeAt(i);
        }
        return (hash >>> 0).toString(16);
    }

    static deepClone<T>(value: T): T {
        if (value == null) return value;
        return JSON.parse(JSON.stringify(value));
    }

    static stableStringify(value: any): string {
        return JSON.stringify(this.sortValue(value));
    }

    private static sortValue(value: any): any {
        if (Array.isArray(value)) {
            return value.map(item => this.sortValue(item));
        }
        if (value && typeof value === 'object') {
            const output: Record<string, any> = {};
            Object.keys(value)
                .sort()
                .forEach(key => {
                    output[key] = this.sortValue(value[key]);
                });
            return output;
        }
        return value;
    }
}
