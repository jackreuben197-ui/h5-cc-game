import { tableBetInfo } from '../../../../data/room/texas/TexasGameRoomDataBasic';
import TexasGameRoomDataPlayer from '../../../../data/room/texas/TexasGameRoomDataPlayer';
import userStore, { ClubWallet } from '../../../../data/user/UserStore';
import { autoBindEvents, bindData, bindEvent } from '../../../../core/decorator/DataBind';
import { traceClass, traceMethod } from '../../../../core/decorator/LogTrace';
import { StringHelper } from '../../../../helper/StringHelper';
import { i18nMgr } from '../../../../i18n/i18nMgr';
import UIBringIn, { BringInTabType } from '../UIBringIn';
import { BringInProvider } from './BringInProvider';

@bindData()
@traceClass({ level: 'debug' })
export class BringInProviderTexas extends BringInProvider {
    private _ui: UIBringIn;
    private _data: TexasGameRoomDataPlayer;

    constructor(d: TexasGameRoomDataPlayer, ui: UIBringIn) {
        super();
        this._data = d;
        this._ui = ui;
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
            user: userStore,
            userTable: this._data.mine
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
        if (this._data.mine != null) {
            needDeposit = needDeposit - this._data.mine.deposit;
            totalBringIn = this._data.mine.totalBringIn;
        }
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
        if (this._data.mine) {
            selectWalletClubID = this._data.mine.currentWalletClubID;
        } else {
            if (wallets.length == 1) {
                selectWalletClubID = wallets[0].clubID;
            }
        }
        this._ui._setupWalletList(userStore.getWallets(), selectWalletClubID);
    }
}
