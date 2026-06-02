import { bindData, IObservableBindings, observable } from '../../core/decorator/DataBind';
import { HttpRoomBringOutProtocol } from '../../net/https/data/room/HttpRoomBringOutProtocol';

export interface UserStore extends IObservableBindings<UserStore> {}

@bindData()
export class UserStore extends cc.EventTarget {
    public static readonly DIAMONDS_CHANGE = 'DIAMONDS_CHANGE';
    public static readonly NICKNAME_CHANGE = 'NICKNAME_CHANGE';
    public static readonly AVATAR_CHANGE = 'AVATAR_CHANGE';
    public static readonly CLUBS_INFO_CHANGE = 'CLUBS_INFO_CHANGE';
    public static readonly CLUBS_WALLET_CHANGE = 'CLUBS_WALLET_CHANGE';
    public static readonly CLUBS_CREDIT_CHANGE = 'CLUBS_CREDIT_CHANGE';
    public static readonly FORBID_CHANGE = 'FORBID_CHANGE';
    public static readonly TRADER_EXPIRE_TIME_CHANGE = 'TRADER_EXPIRE_TIME_CHANGE';
    // 不变的信息
    // 基础信息
    public userID: number;
    public userRID: number;
    public token: string;
    @observable(UserStore.DIAMONDS_CHANGE)
    public diamonds: number = 0;
    @observable(UserStore.NICKNAME_CHANGE)
    public name: string = '';
    @observable(UserStore.AVATAR_CHANGE)
    public avatar: string;
    @observable(UserStore.CLUBS_INFO_CHANGE)
    public clubsData: ClubData[] = [];
    @observable(UserStore.CLUBS_WALLET_CHANGE)
    public wallets: ClubWallet[] = [];
    @observable(UserStore.CLUBS_CREDIT_CHANGE)
    public credits: ClubCredit[] = [];
    @observable(UserStore.FORBID_CHANGE)
    public forbid: boolean = false;

    public fillWalletInfo(wallet: HttpRoomBringOutProtocol.Wallet[]) {
        let clubsData:ClubData[] = [];
        let walletsData:ClubWallet[] = [];
        // 简单处理多个钱包就当全量,单个钱包当更新
        if (wallet.length == 1) {
            clubsData = [...this.clubsData];
            walletsData = [...this.wallets];
        } 
        let clubDataMap = new Map(this.clubsData.map(item => [item._clubID, item]));
        let walletMap = new Map(this.wallets.map(item => [item._clubID, item]));
        wallet.forEach(v => {
            if (clubDataMap.has(v.club_id)) {
                let item = clubDataMap.get(v.club_id);
                item._clubID = v.club_id;
                item.clubID = v.club_random_id;
                item.name = v.club_name;
                item.logo = v.club_logo;
                item.tribeID = v.tribe_random_id;
            } else {
                clubsData.push({
                    _clubID: v.club_id,
                    clubID: v.club_random_id,
                    name: v.club_name,
                    logo: v.club_logo,
                    tribeID: v.tribe_random_id
                });
            }
            if (walletMap.has(v.club_id)) {
                let item = walletMap.get(v.club_id);
                item._clubID = v.club_id;
                item.clubID = v.club_random_id;
                item.status = v.user_status;
                item.tribeStatus = v.wallet_tribe_status;
                item.goldType = v.gold_type;
                item.goldCurrency = v.gold_currency;
                item.id = v.w_u_id;
                item.gold = v.gold;
                item.goldLock = v.gold_lock;
            } else {
                walletsData.push({
                    _clubID: v.club_id,
                    clubID: v.club_random_id,
                    status: v.user_status,
                    tribeStatus: v.wallet_tribe_status,
                    goldType: v.gold_type,
                    goldCurrency: v.gold_currency,
                    id: v.w_u_id,
                    gold: v.gold,
                    goldLock: v.gold_lock
                });
            }
        });
        this.muteEvents();
        this.clubsData = clubsData;
        this.unmuteEvents();
        this.wallets = walletsData;
    }

    public getCredit(_clubID: number) {
        let l = this.credits.filter(v => v._clubID == _clubID);
        if (l.length == 1) {
            return l[0].credits;
        }
        this.tracelog.warn('no credits for club', _clubID);
        return 0;
    }

    public getWallet(_clubID: number): ClubWallet {
        let l = this.wallets.filter(v => v._clubID == _clubID);
        if (l.length == 1) {
            return l[0];
        }
        this.tracelog.warn('no wallet for club', _clubID);
        return null;
    }

    public getClub(_clubID: number): ClubData {
        let l = this.clubsData.filter(v => v._clubID == _clubID);
        if (l.length == 1) {
            return l[0];
        }
        this.tracelog.warn('no club for club', _clubID);
        return null;
    }

    public getWallets(): IWallet[] {
        const wallets: IWallet[] = [];
        this.wallets.forEach(v => {
            let cb = this.getClub(v._clubID);
            wallets.push({
                _clubID: cb._clubID,
                tribeID: cb.tribeID,
                clubID: cb.clubID,
                id: v.id,
                gold: v.gold,
                name: cb.name,
                logo: cb.logo
            });
        });
        return wallets;
    }

    @observable(UserStore.TRADER_EXPIRE_TIME_CHANGE)
    public traderExpireTime: number;
    public get isTrader(): boolean {
        return Date.now() < this.traderExpireTime * 1000;
    }
    public isApplyingTrader: boolean;
}

export class ClubData {
    public _clubID: number;
    public clubID: number;
    public name: string;
    public logo: string;
    public tribeID: number;
}

export class ClubWallet {
    _clubID: number;
    clubID: number;
    /** 钱包状态 */
    status: number;
    /** 钱包联盟状态 */
    tribeStatus: number;
    /** 钱包类型：1 联盟币 (gold)，2 USDT */
    goldType: number;
    /** 币种三字码 */
    goldCurrency: string;
    /** 钱包 ID */
    id: number;
    /** 钱包金额 */
    gold: number;
    /** 被锁定金额 */
    goldLock: number;
}

export class ClubCredit {
    _clubID: number;
    clubID: number;
    /** 金额 */
    credits: number;
}

export interface IWallet {
    _clubID: number;
    tribeID: number;
    clubID: number;
    /** 钱包 ID */
    id: number;
    /** 钱包金额 */
    gold: number;
    name: string;
    logo: string;
}

const userStore = new UserStore();

export default userStore;
