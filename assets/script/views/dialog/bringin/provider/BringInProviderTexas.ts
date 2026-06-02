import { autoBindEvents, bindData, bindEvent, unBindEventsAll } from '../../../../core/decorator/DataBind';
import { traceClass, traceMethod } from '../../../../core/decorator/LogTrace';
import { tableBetInfo } from '../../../../data/room/texas/TexasGameRoomDataBasic';
import TexasGameRoomDataPlayerMine from '../../../../data/room/texas/TexasGameRoomDataPlayerMine';
import userStore, { ClubWallet } from '../../../../data/user/UserStore';
import { StringHelper } from '../../../../helper/StringHelper';
import { i18nMgr } from '../../../../i18n/i18nMgr';
import { RoomInfo } from '../../../../protobuf/holdem/define_pb';
import UIBringIn, { BringInTabType } from '../UIBringIn';
import { BringInCommitFn, BringInProvider } from './BringInProvider';

@bindData()
@traceClass({ level: 'debug' })
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

    public override autoBind() {
        autoBindEvents(this, {
            roomBasic: this._data.roomData.basicInfo,
            user: userStore
        });
    }

    // 非AOF 和 货币
    private get _needAutoBringIn() {
        return this._data.roomData.basicInfo.bringInType == 1 && this._data.roomData.basicInfo.retainType == 0;
    }

    @bindEvent('TABLE_BET_INFO_CHANGE', 'roomBasic')
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

    @bindEvent('CLUBS_WALLET_CHANGE', 'user')
    @traceMethod()
    private onWalletsChange(wallets: ClubWallet[]) {
        if (wallets.length == 0) return;
        let selectWalletClubID = 0;
        selectWalletClubID = this._data.currentWalletClubID;
        if (selectWalletClubID == 0 && wallets.length == 1) {
            selectWalletClubID = wallets[0].clubID;
            this._data.currentWalletClubID = selectWalletClubID;
        }
        this._ui._setupWalletList(userStore.getWallets(), selectWalletClubID);
    }

    public cleanup(): void {
        unBindEventsAll(this);
    }

    public clubSelected(clubID: number): void {
        this._data.currentWalletClubID = clubID;
    }

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
        this._commitFn(bringInAmount, storeAmount, autoOnTableAmount, this._data.currentWalletClubID);
    }
}
