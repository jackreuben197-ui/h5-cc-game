import type { PrivateUcFeeType, SyncPrivateUcChargeConfigPayload } from '../../H5MsgMgr';

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
    private _prices: Partial<Record<PrivateUcFeeType, number>> = {};

    public setFromH5Sync(payload: SyncPrivateUcChargeConfigPayload): void {
        const prices: Partial<Record<PrivateUcFeeType, number>> = {};
        const items = Array.isArray(payload?.items) ? payload.items : [];
        for (const item of items) {
            const feeType = Number(item?.feeType) as PrivateUcFeeType;
            const price = Number(item?.price);
            const validFeeType = Number.isInteger(feeType) && feeType >= 1 && feeType <= 9;
            if (!validFeeType || !Number.isFinite(price) || price < 0) continue;
            prices[feeType] = price;
        }
        this._prices = prices;
    }

    public getPrice(feeType: PrivateUcFeeType): number | null {
        const price = this._prices[feeType];
        return typeof price === 'number' ? price : null;
    }

    public getVisiblePrice(feeType: PrivateUcFeeType): number | null {
        const price = this.getPrice(feeType);
        return price !== null && price > 0 ? price : null;
    }

    public has(feeType: PrivateUcFeeType): boolean {
        return this.getVisiblePrice(feeType) !== null;
    }
}

const privateUcChargeStore = new PrivateUcChargeStore();

export default privateUcChargeStore;
