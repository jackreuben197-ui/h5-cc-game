import type { PrivateUcFeeType, SyncPrivateUcChargeConfigPayload } from '../../H5MsgMgr';

export interface PrivateUcChargeConfigItemExt {
    feeType: PrivateUcFeeType;
    price: number;
    interval?: number;
    first_free?: 1 | 2;
    tiered_fee_type?: 1 | 2;
    multiple?: number;
    capped?: number;
    user_rake?: number;
    decimal_type?: number;
}

export const PrivateUcFee = {
    ClubName: 1,
    ReplayCollect: 2,
    MttRecord: 3,
    Nickname: 4,
    AddTime: 5,
    ViewPublicCards: 6,
    NormalTableRecord: 7,
    ViewOnePlayer: 8,
    ViewAllPlayers: 9
} as const;

export type PrivateUcFee = (typeof PrivateUcFee)[keyof typeof PrivateUcFee];

class PrivateUcChargeStore {
    private _configs: Partial<Record<PrivateUcFeeType, PrivateUcChargeConfigItemExt>> = {};

    public setFromH5Sync(payload: SyncPrivateUcChargeConfigPayload): void {
        const configs: Partial<Record<PrivateUcFeeType, PrivateUcChargeConfigItemExt>> = {};
        const items = Array.isArray(payload?.items) ? payload.items : [];
        for (const item of items) {
            const feeType = Number(item?.feeType) as PrivateUcFeeType;
            const price = Number(item?.price);
            const validFeeType = Number.isInteger(feeType) && feeType >= 1 && feeType <= 9;
            if (!validFeeType || !Number.isFinite(price) || price < 0) continue;
            const raw = item as PrivateUcChargeConfigItemExt;
            const config: PrivateUcChargeConfigItemExt = { feeType, price };
            const interval = Number(raw.interval);
            const firstFree = Number(raw.first_free);
            const tieredFeeType = Number(raw.tiered_fee_type);
            const multiple = Number(raw.multiple);
            const capped = Number(raw.capped);
            const userRake = Number(raw.user_rake);
            const decimalType = Number(raw.decimal_type);
            if (Number.isFinite(interval) && interval >= 0) config.interval = Math.floor(interval);
            if (firstFree === 1 || firstFree === 2) config.first_free = firstFree;
            if (tieredFeeType === 1 || tieredFeeType === 2) config.tiered_fee_type = tieredFeeType;
            if (Number.isFinite(multiple) && multiple >= 0) config.multiple = Math.floor(multiple);
            if (Number.isFinite(capped) && capped >= 0) config.capped = capped;
            if (Number.isFinite(userRake) && userRake >= 0) config.user_rake = userRake;
            if (Number.isFinite(decimalType) && decimalType >= 0) config.decimal_type = Math.floor(decimalType);
            configs[feeType] = config;
        }
        this._configs = configs;
    }

    public getConfig(feeType: PrivateUcFeeType): PrivateUcChargeConfigItemExt | null {
        return this._configs[feeType] || null;
    }

    public getPrice(feeType: PrivateUcFeeType): number | null {
        const price = this.getConfig(feeType)?.price;
        return typeof price === 'number' ? price : null;
    }

    public getVisiblePrice(feeType: PrivateUcFeeType): number | null {
        const price = this.getPrice(feeType);
        return price !== null && price > 0 ? price : null;
    }

    public has(feeType: PrivateUcFeeType): boolean {
        return this.getVisiblePrice(feeType) !== null;
    }

    /** fee_type=8 的阶梯收费：基础价 * multiple^payTimes，并受 capped 限制。 */
    public applyTieredPrice(feeType: PrivateUcFeeType, basePrice: number, payTimes: number): number {
        const config = this.getConfig(feeType);
        if (!config || config.tiered_fee_type !== 1 || !Number.isFinite(basePrice) || basePrice <= 0) {
            return basePrice;
        }
        const multiple = Number(config.multiple);
        const capped = Number(config.capped);
        const times = Math.max(0, Math.floor(Number(payTimes) || 0));
        const total = basePrice * Math.pow(Number.isFinite(multiple) && multiple >= 0 ? multiple : 1, times);
        if (Number.isFinite(capped) && capped >= 0 && total > capped) return capped;
        return Number.isFinite(total) && total > 0 ? total : 0;
    }
}

const privateUcChargeStore = new PrivateUcChargeStore();

export default privateUcChargeStore;
