class GlobalConfigStore {
    private _config: Record<string, unknown> = {};

    public setConfig(config: Record<string, unknown>): void {
        this._config = { ...config };
    }

    public get<T = unknown>(key: string): T | undefined {
        return this._config[key] as T | undefined;
    }
}

const globalConfigStore = new GlobalConfigStore();

export default globalConfigStore;
