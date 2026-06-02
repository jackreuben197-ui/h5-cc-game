import { bindData, IObservableBindings, observable } from '../../core/decorator/DataBind';
import { HttpRoomBringOutProtocol } from '../../net/https/data/room/HttpRoomBringOutProtocol';

interface UserStore extends IObservableBindings<UserStore> {}

@bindData()
class UserStore extends cc.EventTarget {
    // 不变的信息
    // 基础信息
    public userID: number;
    public userRID: number;
    public token: string;
    @observable('DIAMONDS_CHANGE')
    public diamonds: number;
    @observable('NICKNAME_CHANGE')
    public name: string;
    @observable('AVATAR_CHANGE')
    public avatar: string;
    @observable('CLUBS_INFO_CHANGE')
    public clubsData: ClubData[];
    @observable('CLUBS_WALLET_CHANGE')
    public wallets: ClubWallet[];
    @observable('CLUBS_CREDIT_CHANGE')
    public credits: ClubCredit[];
    @observable('FORBID_CHANGE')
    public forbid: boolean;

    public setFullWalletInfo(wallet: HttpRoomBringOutProtocol.Wallet[]) {
        const clubsData: ClubData[] = [];
        const walletsData: ClubWallet[] = [];
        wallet.forEach(v => {
            clubsData.push({
                _clubID: v.club_id,
                clubID: v.club_random_id,
                name: v.club_name,
                logo: v.club_logo,
                tribeID: v.tribe_random_id
            });
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

    @observable('TRADER_EXPIRE_TIME_CHANGE')
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
