import { autoBindEvents, bindData, bindEvent, unBindEventsAll } from '../../../../core/decorator/DataBind';
import { traceClass, traceMethod } from '../../../../core/decorator/LogTrace';
import TexasGameRoomDataBasic, { tableBetInfo } from '../../../../data/room/texas/TexasGameRoomDataBasic';
import TexasGameRoomDataPlayerMine from '../../../../data/room/texas/TexasGameRoomDataPlayerMine';
import userStore, { ClubWallet, UserStore } from '../../../../data/user/UserStore';
import { StringHelper } from '../../../../helper/StringHelper';
import { i18nMgr } from '../../../../i18n/i18nMgr';
import { RoomInfo } from '../../../../protobuf/holdem/define_pb';
import UIBringIn, { BringInTabType } from '../UIBringIn';
import { BringInCommitFn, BringInProvider } from './BringInProvider';

@bindData()
@traceClass()
export class BringInProviderTexas extends BringInProvider {
    private _ui: UIBringIn;
    private _data: TexasGameRoomDataPlayerMine;
    private _commitFn: BringInCommitFn;

    constructor(d: TexasGameRoomDataPlayerMine, commitFn: BringInCommitFn, ui: UIBringIn) {
        super();
        this._data = d;
        this._ui = ui;
        this._commitFn = commitFn;
    }

    protected beforeBind(): void {
        this._ui._showBalance(this._data.roomData.basicInfo.bringInType);
        switch (this._data.roomData.basicInfo.bringInType) {
            case 1:
                this._ui._showWalletArea(true);
                this._ui._showBringInArea(false);
                break;
            case 2:
                this._ui._showWalletArea(false);
                this._ui._showBringInArea(true);
                break;
            case 3:
                this._ui._showWalletArea(false);
                this._ui._showBringInArea(true);
                break;
            default:
                break;
        }
        this._ui._changeTab(BringInTabType.Chips);
    }

    protected afterBind(): void {}

    protected autoBind() {
        autoBindEvents(this, {
            roomBasic: this._data.roomData.basicInfo,
            user: userStore
        });
    }

    // 非AOF 和 货币
    private get _needAutoBringIn() {
        return this._data.roomData.basicInfo.bringInType == 1 && this._data.roomData.basicInfo.retainType == 0;
    }

    @bindEvent(TexasGameRoomDataBasic.TABLE_BET_INFO_CHANGE, 'roomBasic')
    private onTableInfoChange(info: tableBetInfo) {
        this._ui._updateBringAreaIntro(
            i18nMgr.Get('UITexas_smallBigBlind'),
            `${StringHelper.GetLongString(info.sb)}/${StringHelper.GetLongString(info.sb * 2)}`
        );
        let needDeposit = this._data.roomData.basicInfo.deposit;
        let totalBringIn = 0;
        needDeposit = needDeposit - this._data.deposit;
        totalBringIn = this._data.totalBringIn;
        let step = info.sb * 2;
        let minAmount = this._data.roomData.basicInfo.curMinRate * step;
        let autoMin = minAmount;
        minAmount += needDeposit;
        const maxAmount = this._data.roomData.basicInfo.curMaxRate * step - totalBringIn;
        if (maxAmount < minAmount) {
            // @TODO 显示不能带入
            return;
        }
        this._ui._setupBringInSider(minAmount, maxAmount, step, needDeposit > 0, this._needAutoBringIn, autoMin);
    }

    @bindEvent(UserStore.CLUBS_WALLET_CHANGE, 'user')
    private onWalletsChange(w: ClubWallet[]) {
        if (w.length == 0) return;
        let wallets = userStore.getWallets();
        if (this._data.currentWalletClubID > 0) {
            wallets = wallets.filter(v => v._clubID == this._data.currentWalletClubID);
        }
        this._ui._setupWalletList(wallets, this._data.tmpCurrentWalletClubID);
    }

    public cleanup(): void {
        unBindEventsAll(this);
    }

    public clubSelected(_clubID: number): void {
        this._data.tmpCurrentWalletClubID = _clubID;
    }

    @traceMethod()
    public commit(bringInAmount: number, autoOnTableAmount: number): void {
        let storeAmount = 0;
        // 手动存钱需要自己设置藏多少
        if (this._data.roomData.basicInfo.retainType == RoomInfo.RetainType.RT_MANUAL) {
            storeAmount = bringInAmount - this._data.roomData.basicInfo.retainMinRate * this._data.roomData.basicInfo.sbante.sb * 2;
        }
        // 鱿鱼/蘑菇模式检查
        // if (this.addChipsData._source == BringInChipsType.SQUID || this.addChipsData._source == BringInChipsType.MUSHROOM) {
        //     let isShowToast = !GameCache.Instance._isRoomManager;
        //     if (isShowToast && GameCache.Instance._friendsTableLimitBringIn) {
        //         viewManager.showToastLanguage('UIWaitManagerAuditTip');
        //     }
        // }
        this._commitFn(bringInAmount, storeAmount, autoOnTableAmount, this._data.tmpCurrentWalletClubID);
    }
}
