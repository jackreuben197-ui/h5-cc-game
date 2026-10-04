export class GlobalConfigStore extends cc.EventTarget {
    public static readonly CONFIG_CHANGED = 'CONFIG_CHANGED';
    private _config: Record<string, unknown> = {};

    public setConfig(config: Record<string, unknown>): void {
        this._config = { ...config };
        this.emit(GlobalConfigStore.CONFIG_CHANGED);
    }

    public get<T = unknown>(key: string): T | undefined {
        return this._config[key] as T | undefined;
    }

    public get isChannelDiamondFreeMode(): boolean {
        const value = this.get<boolean>('channel_package_diamond_free_mode');
        if (typeof value === 'boolean') return value;
        return typeof document !== 'undefined' && document.documentElement.getAttribute('data-channel-package') === '1';
    }

    /** 私域牌桌创建时可选的最大加时次数。 */
    public get privateGameDelayTimes(): number {
        return this._readNonNegativeInteger('private_game_delay_times');
    }

    /** 私域牌桌加时的每日免费次数。 */
    public get privateFreeAddTimeDailyTimes(): number {
        return this._readNonNegativeInteger('private_free_addtime_daily_times');
    }

    /** 当前包使用的查看公共牌规则；1=逐条街查看，2=一次查看全部。 */
    public get viewPublicCards(): { viewType: number; freeCount: number } {
        const isPrivate = this.isChannelDiamondFreeMode;
        let raw = this.get<unknown>(isPrivate ? 'private_view_public_cards' : 'view_public_cards');
        if (typeof raw === 'string') {
            try {
                raw = JSON.parse(raw);
            } catch {
                raw = null;
            }
        }
        if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
            // 与 Unity 一致：官方旧配置缺失时默认逐条街、每日 2 次；私域缺失不赠送次数。
            return { viewType: 1, freeCount: isPrivate ? 0 : 2 };
        }
        const config = raw as Record<string, unknown>;
        return {
            viewType: Number(config.view_type) === 2 ? 2 : 1,
            freeCount: this._toNonNegativeInteger(config.free_count)
        };
    }

    private _readNonNegativeInteger(key: string): number {
        return this._toNonNegativeInteger(this.get(key));
    }

    private _toNonNegativeInteger(value: unknown): number {
        const number = Number(value);
        return Number.isFinite(number) && number >= 0 ? Math.floor(number) : 0;
    }
}

const globalConfigStore = new GlobalConfigStore();

export default globalConfigStore;
