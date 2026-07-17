import { RoomInfo } from '@silenthill/agreement-web';
import { autoBindEvents, bindData, bindEvent, unBindEventsAll } from '../../../../core/decorator/DataBind';
import { traceClass, traceMethod } from '../../../../core/decorator/LogTrace';
import TexasGameRoomDataBasic, { tableBetInfo } from '../../../../data/room/texas/TexasGameRoomDataBasic';
import TexasGameRoomDataPlayerMine from '../../../../data/room/texas/TexasGameRoomDataPlayerMine';
import userStore, { ClubWallet, UserStore } from '../../../../data/user/UserStore';
import { StringHelper } from '../../../../helper/StringHelper';
import { CPErrorCode } from '../../../../i18n/CPErrorCode';
import { i18nMgr } from '../../../../i18n/i18nMgr';
import viewManager from '../../../UIViewManager';
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

    @traceMethod({ level: 'debug' })
    protected beforeBind(): void {
        this._ui._showBalance(this._data.roomData.basicInfo.bringInType);
        this.tracelog.debug('bringType', this._data.roomData.basicInfo.bringInType);
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
    @traceMethod()
    private onTableInfoChange(info: tableBetInfo) {
        this._ui._updateBringAreaIntro(
            i18nMgr.Get('UITexas_smallBigBlind'),
            `${StringHelper.GetLongString(info.sb)}/${StringHelper.GetLongString(info.sb * 2)}`
        );
        const { minAmount, maxAmount, step, needDeposit } = this._data.caculateCanBringMinMax();
        if (maxAmount < minAmount) {
            //外层应该已经拦截了
            // 显示不能带入
            this.tracelog.warn('cant bring more', 'canMax', maxAmount, 'min', minAmount);
            viewManager.showToast(CPErrorCode.ServerErrorDescription(20058));
            // 这次操作是在UIBringIn的initialize里，所以需要下一帧关闭;
            this._ui.scheduleOnce(this._ui.close);
            return;
        }
        this._ui._setupBringInSider(minAmount, maxAmount, step, needDeposit, this._needAutoBringIn, minAmount);
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
