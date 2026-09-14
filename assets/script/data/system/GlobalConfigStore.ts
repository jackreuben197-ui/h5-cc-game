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
}

const globalConfigStore = new GlobalConfigStore();

export default globalConfigStore;
