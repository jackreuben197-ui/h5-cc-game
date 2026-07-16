import { WebGetDiamondConfig, WWW } from '../../net/https/WebRequest';

// 存储格式：config_type → { type_ext → item }，与 H5 侧 DiamondConfigMap 规范对齐。
type DiamondTypeMap = Record<number, DiamondConfig>;

export interface DiamondConfig {
    id: number;
    config_type: number;
    status: number;
    type_ext: number;
    setting: DiamondConfigSetting[];
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
}

export interface DiamondConfigSetting {
    sb: number;
    blind_type: number;
    price: number;
    discount_price: number;
    discount: number;
    record_floor?: number;
    record_ratio?: number;
    decimal_type?: number;
}
// type DiamondConfigSetting struct {
// 	SmallBlind    uint64  `json:"sb"`                     // 小盲
// 	BlindTag      int8    `json:"blind_type"`             // 盲注分类 1 微 2 小 3 中 4 大
// 	Price         uint64  `json:"price"`                  // 原价
// 	DiscountPrice uint64  `json:"discount_price"`         // 折扣价，0表示限免
// 	Discount      float64 `json:"discount"`               // 折扣，0表示限免，1表示原价
// 	RecordFloor   uint64  `json:"record_floor,omitempty"` // 保底收取钻石
// 	RecordRatio   float64 `json:"record_ratio,omitempty"` // 收取比例，支持小数点后10位，记录费=玩家带入积分*收取比例
// 	DecimalType   int8    `json:"decimal_type,omitempty"` // 小数点取证类型。1 向下兼容（floor） 2 向上兼容（ceil） 3 四舍五入（round）
// }
// type DiamondConfig struct {
// 	ID         uint64                  `json:"id"`          // 主键ID
// 	ConfigType int8                    `json:"config_type"` // 类型，参考 DiamondConfigType
// 	Status     int8                    `json:"status"`      // 状态 1 开启， 2 关闭
// 	TypeExt    int32                   `json:"type_ext"`    // 类型扩展 参考 DiamondConfigTypeExt
// 	Setting    []*DiamondConfigSetting `json:"setting"`     // 配置
// 	StartDate  string                  `json:"start_date"`  // 折扣开始日期
// 	EndDate    string                  `json:"end_date"`    // 折扣结束日期
// 	StartTime  int64                   `json:"start_time"`  // 折扣开始时间
// 	EndTime    int64                   `json:"end_time"`    // 折扣结束时间
// }

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
    public getDiamondConfig(typeExt: number, configType: number): DiamondConfig {
        const typeMap = this._diamondMap.get(configType);
        if (!typeMap) return null;
        return typeMap[typeExt] ?? null;
    }

    public getDiamondConfigTypeExt(originType: number, share: number, isMTT: boolean, addTimeTimes: number): number {
        const last = isMTT ? 1 : 0;
        // 不区分共享桌的币种
        if (share >= 2) {
            share = 2;
        }
        return 1000 * addTimeTimes + 100 * originType + 10 * share + last;
    }
}

const diamondModel = new DiamondModel();

export default diamondModel;
