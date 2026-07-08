import { WebGetDiamondConfig, WWW } from '../../net/https/WebRequest';

// 存储格式：config_type → { type_ext → item }，与 H5 侧 DiamondConfigMap 规范对齐。
type DiamondTypeMap = Record<number, any>;

export class DiamondModel {
    // 钻石配置表：主键 config_type，值为以 type_ext 为键的对象。
    private _diamondMap: Map<number, DiamondTypeMap> = new Map();

    // 将原始数组（API / H5 同步）按 type_ext 索引后写入指定 config_type。
    private _storeItems(configType: number, items: any[]): void {
        if (!Array.isArray(items) || items.length === 0) return;
        const typeMap: DiamondTypeMap = {};
        for (const item of items) {
            const typeExt = item?.type_ext;
            if (typeExt != null) {
                typeMap[typeExt] = item;
            }
        }
        this._diamondMap.set(configType, typeMap);
    }
    // H5 bridge 预填：直接接收已转换的 typeMap（{[type_ext]: item}），无需再做分组。
    // 仅在本地尚无该 config_type 数据时写入，避免覆盖已有缓存。
    public setFromH5Sync(configType: number, typeMap: DiamondTypeMap): void {
        if (this._diamondMap.has(configType)) return;
        this._diamondMap.set(configType, typeMap);
    }

    // 按需拉取指定 config_type 的配置；已有缓存时直接 resolve，不发网络请求。
    public reqDiamondConfig(type: number): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this._diamondMap.has(type)) {
                return resolve();
            }
            WWW.Instance.CommonAPI({
                web_class: WebGetDiamondConfig,
                body: { config_type: type }
            }).then(
                (res: any) => {
                    this._storeItems(type, res?.data?.data);
                    resolve();
                },
                (res: any) => {
                    reject(res);
                }
            );
        });
    }

    // 查找指定 config_type + type_ext 的配置项。
    public getDiamondConfig(typeExt: number, configType: number = 0): any {
        const typeMap = this._diamondMap.get(configType);
        if (!typeMap) return null;
        return typeMap[typeExt] ?? null;
    }
}

const diamondModel = new DiamondModel();

export default diamondModel;
