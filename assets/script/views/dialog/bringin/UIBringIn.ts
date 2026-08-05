import { autoBindEvents, bindEvent } from '../../../core/decorator/DataBind';
import { traceClass, traceMethod } from '../../../core/decorator/LogTrace';
import { RoomPlayerGC } from '../../../data/room/RoomDataGenericConstraints';
import TexasGameRoomDataPlayerMine from '../../../data/room/texas/TexasGameRoomDataPlayerMine';
import tradeStore, { TradeStore } from '../../../data/trade/TradeStore';
import TradeStoreUtils from '../../../data/trade/TradeStoreUtils';
import userStore, { IWallet } from '../../../data/user/UserStore';
import UserStoreUtils from '../../../data/user/UserStoreUtils';
import type { DialogResultPayload } from '../../../H5MsgMgr';
import h5MessageManager from '../../../H5MsgMgr';
import { StringHelper } from '../../../helper/StringHelper';
import { i18nMgr } from '../../../i18n/i18nMgr';
import { HttpUSDTApplyProtocol } from '../../../net/https/data/usdt/HttpUSDTApplyProtocol';
import { HttpUSDTPriceListProtocol } from '../../../net/https/data/usdt/HttpUSDTPriceListProtocol';
import { HttpUSDTRechargeProtocol } from '../../../net/https/data/usdt/HttpUSDTRechargeProtocol';
import { WebOrderUserUsdtRecharge, WebUserTraderApply, WWW } from '../../../net/https/WebRequest';
import UIComponentBaseDialog from '../../base/UIComponentDialogBase';
import viewManager from '../../UIViewManager';
import UIViewUtil from '../../util/UIViewUtil';
import RemoteSprite from '../../widget/RemoteSprite';
import StepSlider from '../../widget/StepSlider';
import SwitchNode from '../../widget/SwitchNode';
import { UIRechargeDiamondParam } from '../rechargediamond/UIRechargeDiamond';
import { BringInCommitFn, BringInProvider } from './provider/BringInProvider';
import { BringInProviderTexas } from './provider/BringInProviderTexas';
import USDTDiamond from './usdtdiamond/USDTDiamond';
import USDTPaytype, { RateDetail } from './usdtdiamond/USDTPaytype';

const { ccclass, menu, property } = cc._decorator;

/** 标题枚举 */
export enum BringInTabType {
    /** 带入标题 */
    Chips,
    /** 钻石标题 */
    Diamond
}

// 1. 原来的基础定义保持不变
export interface UIBringInParamBase<T extends keyof RoomPlayerGC> {
    GameType: T;
    RoomPlayer: RoomPlayerGC[T];
    CommitFn: BringInCommitFn;
}
// 2. 核心魔法：通过映射，把所有玩法穷举并联合起来
// 展开后等价于：UIBringInParamBase<'Texas'> | UIBringInParamBase<'Omaha'> | ...
export type UIBringInParam = {
    [K in keyof RoomPlayerGC]: UIBringInParamBase<K>;
}[keyof RoomPlayerGC];

/**
 * 核心玩法：带入筹码界面
 */
@ccclass
@menu('Dialog/UIBringIn')
@traceClass()
export default class UIBringIn extends UIComponentBaseDialog<UIBringInParam> {
    private _roomPlayer: RoomPlayerGC[keyof RoomPlayerGC];
    private _provider: BringInProvider = null;
    //标题部分
    @property(cc.Node)
    private titleBarDiamondLine: cc.Node = null;
    @property(cc.Node)
    private titleBarBalanceLine: cc.Node = null;
    // 带入区域（第一行）
    @property({ type: cc.Node, tooltip: '带入区域' })
    private bringInFullArea: cc.Node = null;
    @property(cc.Node)
    private bringInArea: cc.Node = null;
    @property(cc.Label)
    private bringInAreaIntro: cc.Label = null;
    @property(cc.Label)
    private bringInAreaIntroContent: cc.Label = null;
    @property(cc.Node)
    private balanceNode: cc.Node = null;
    @property(cc.Label)
    private textTotalCoinTitle: cc.Label = null;
    @property(cc.Label)
    private textTotalCoin: cc.Label = null;
    @property(cc.Node)
    private creditNode: cc.Node = null;
    @property(cc.Label)
    private textTotalCreditTitle: cc.Label = null;
    @property(cc.Label)
    private textTotalCredit: cc.Label = null;
    @property(cc.Node)
    private diamondNode: cc.Node = null;
    @property(cc.Label)
    private textTotalDiamondTitle: cc.Label = null;
    @property(cc.Label)
    private textTotalDiamond: cc.Label = null;
    //================ 带入区域的子节点(描述和金额) =================
    @property(cc.Label)
    public amountDescriptionTop: cc.Label = null;
    @property(cc.Node)
    public bringInTipButton: cc.Node = null;
    @property(cc.Node)
    public bringTips: cc.Node = null;
    @property(cc.Node)
    public tipsMask: cc.Node = null;
    @property(cc.Node)
    private amountDescriptionTopTipDot: cc.Node = null;
    @property(cc.Label)
    private bringInAmount: cc.Label = null;
    @property(cc.Label)
    public amountDescriptionBottom: cc.Label = null;
    @property({ type: StepSlider, tooltip: '带入滑动条' })
    private bringInSlider: StepSlider = null;
    // 自动充值部分
    @property(cc.Node)
    private autoBringinArea: cc.Node = null;
    @property(SwitchNode)
    private switchAutoBringin: SwitchNode = null;
    @property(cc.Node)
    private autoBringinSliderArea: cc.Node = null;
    @property(StepSlider)
    private autoSlider: StepSlider = null;
    @property(cc.Label)
    private autoSliderAmount: cc.Label = null;
    // 钱包区域
    @property(cc.Node)
    private walletArea: cc.Node = null;
    @property(cc.Prefab)
    private clueItemPrefab: cc.Prefab = null;
    @property(cc.ScrollView)
    private walletScrollView: cc.ScrollView = null;
    @property(cc.Node)
    private emptySelectWallet: cc.Node = null;
    private _walletToggles: cc.Toggle[] = [];
    private _walletSelect: number = 0;
    // 提交区域
    @property(cc.Button)
    private buttonCommit: cc.Button = null;
    @property(cc.Button)
    private buttonCommit2: cc.Button = null;
    private tips: cc.Node = null;
    private recordTipsBtn: cc.Node = null;
    /**
     * 带入筹码描述
     */
    private _cloneNode: cc.Node = null; // 这是用来显示选中状态的node
    /**
     * 选择钱包按钮
     */
    @property(cc.Node)
    private buttonSelectWallet: cc.Node = null;
    @property(cc.Node)
    private arrowDown: cc.Node = null;
    // ========== 钻石相关 ==========
    @property(cc.Node)
    private diamondArea: cc.Node = null;
    // 钻石余额
    @property(cc.Label)
    private diamondAmount: cc.Label = null;
    // 余额Label
    @property(cc.Label)
    private diamondAmountLabel: cc.Label = null;
    // 购买项
    @property(cc.Prefab)
    private diamondItem: cc.Prefab = null;
    @property(cc.Node)
    private diamondBoard: cc.Node = null;
    @property(cc.Label)
    private exchangeRateText: cc.Label = null;
    @property(cc.Prefab)
    private payttypeItem: cc.Prefab = null;
    @property(cc.Node)
    private paytypes: cc.Node = null;
    @property(cc.Label)
    private paynowText: cc.Label = null;
    @property(cc.Button)
    private paynowBtn: cc.Button = null;
    private _toApplyTrader: boolean = false;
    private _rechargeData: HttpUSDTRechargeProtocol.RequestData = null;
    private _payType: number = 0; //1 //2
    private _exchangeRate: number = 0;
    // ========== end 钻石相关 ==========
    /** 带入分段 */
    private _bringInAmount: number = 0;
    private _autoOnTable: number = 0;
    private _autoBringin: boolean = false;
    private _balanceDialogRequestID: string = '';
    private _balanceDialogClubID: number = 0;
    private readonly _onBalanceDialogResult = (payload: DialogResultPayload): void => {
        if (!payload || payload.dialogRequestId !== this._balanceDialogRequestID) return;
        const clubID = this._balanceDialogClubID;
        const recharge = payload.action === 'confirm';
        this._clearBalanceDialogState();
        if (!recharge || clubID <= 0) return;
        this.close();
        h5MessageManager.sendToH5('h5Navigate', 1, {
            path: '/wallet',
            query: {
                clubId: clubID,
                from: 'cocos-table'
            },
            replace: false,
            ensureVisible: true
        });
    };

    @traceMethod()
    protected onLoad(): void {
        // 初始化一个节点
        const targetIndex = this.buttonSelectWallet.getSiblingIndex();
        const cnd = cc.instantiate(this.clueItemPrefab);
        this.buttonSelectWallet.parent.insertChild(cnd, targetIndex);
        cnd.name = 'cloneWalletItem';
        cnd.active = false;
        this._cloneNode = cnd;
        // 初始化
        this.buttonCommit.node.parent.active = false;
        this.buttonCommit2.node.parent.active = false;
        // 货币显示
        this.balanceNode.active = false;
        this.creditNode.active = false;
        this.diamondNode.active = false;
        this.textTotalCoinTitle.string = i18nMgr.Get('UIClub_CreateRoom31');
        this.textTotalDiamondTitle.string = i18nMgr.Get('UIClub_CreateRoom31');
        this.textTotalCreditTitle.string = i18nMgr.Get('UIClubCreditLimit2');
        this.tipsMask.active = false;
        this.bringTips.active = false;
        this.regiterTouchEvents();
    }

    public initialize(param: UIBringInParam): void {
        this._roomPlayer = param.RoomPlayer;
        if (this._roomPlayer instanceof TexasGameRoomDataPlayerMine) {
            this._provider = new BringInProviderTexas(this._roomPlayer, param.CommitFn, this);
        }
        this._provider.process();
        this.initDiamond();
    }

    protected override onFrameResize(
        visibleSizeWidth: number,
        visibleSizeHeight: number,
        frameSizeWidth: number,
        frameSizeHeight: number,
        suggestScale: number,
        saveAreaTop: number
    ): void {
        const maxHeight = 2290;
        if (visibleSizeHeight < maxHeight) {
            const scale = visibleSizeHeight / maxHeight;
            this.node.setScale(scale, scale);
        }
    }

    private onClickBringInTip() {
        if (this.tipsMask) this.tipsMask.active = true;
        if (this.bringTips) this.bringTips.active = true;
    }

    protected regiterTouchEvents(): void {
        this.titleBarDiamondLine.parent.on('click', this.onClickDiamond, this);
        this.titleBarBalanceLine.parent.on('click', this.onClickBalance, this);
        this.buttonCommit.node.on('click', this.onClickCommit, this);
        this.buttonCommit2.node.on('click', this.onClickCommit, this);
        this.buttonSelectWallet.on('click', this.onClickWalletBtn, this);
        this.tipsMask.on('click', this.onClickTipsMask, this);
        // this.setButtonClick(this.recordTipsBtn, () => {
        //     if (this.tips) this.tips.active = true;
        //     if (this.tipsMask) this.tipsMask.active = true;
        // });
        this.bringInTipButton.on('click', this.onClickBringInTip, this);
        this.paynowBtn.node.on('click', () => {
            this.onPayNowOrApplyTraderClicked(this._toApplyTrader, this._payType, this._rechargeData);
        });
        this.switchAutoBringin.onSwitchCallback = isOn => {
            this.autoBringinSliderArea.active = isOn;
            this._autoBringin = isOn;
        };
    }

    public _showBalance(te: number) {
        switch (te) {
            case 1:
                this.balanceNode.active = true;
                this.creditNode.active = false;
                this.diamondNode.active = false;
                this.textTotalCoin.string = StringHelper.GetLongStringLocale(0);
                break;
            case 2:
                this.balanceNode.active = false;
                this.creditNode.active = false;
                this.diamondNode.active = true;
                this.textTotalDiamond.string = StringHelper.GetLongStringLocale(0, 1, 0);
                break;
            case 3:
                this.balanceNode.active = false;
                this.creditNode.active = true;
                this.diamondNode.active = false;
                this.textTotalCredit.string = StringHelper.GetLongStringLocale(0, 1, 0);
                break;
        }
    }

    public _showWalletArea(b: boolean) {
        this.walletArea.active = b;
        // 显示钱包选择，则保证一般确认按钮显示
        if (b) {
            this.buttonCommit2.node.parent.active = false;
        } else {
            this.buttonCommit2.node.parent.active = true;
        }
    }

    public _showBringInArea(b: boolean) {
        this.bringInArea.active = b;
        this.switchAutoBringin.onoff(false, true);
    }

    public _updateBringAreaIntro(startText: string, endText: string) {
        this.bringInAreaIntro.string = startText;
        this.bringInAreaIntroContent.string = endText;
    }

    @traceMethod()
    public _setupBringInSider(minAmount: number, maxAmount: number, stepAmount: number, showTip: boolean, needAutoBringIn: boolean, autoMin?: number) {
        const rangeAmount = maxAmount - minAmount;
        let step = 1;
        if (rangeAmount > 0) {
            if (rangeAmount > stepAmount) {
                step = 1 / ((maxAmount - minAmount) / stepAmount);
            } else {
                step = 0;
            }
        }
        this.tracelog.debug('bring in slider', 'min', minAmount, 'max', maxAmount, 'step', stepAmount, 'mystep', step, rangeAmount);
        this.autoBringinArea.active = needAutoBringIn;
        this.bringInSlider.step = Math.round(step * 10000) / 10000;
        this.bringInSlider.onValueChanged = (progress: number) => {
            // 注意精度
            const amount = Math.min(rangeAmount + minAmount, Math.round((progress * rangeAmount) / stepAmount) * stepAmount + minAmount);
            this._bringInAmount = amount;
            this.bringInAmount.string = StringHelper.GetLongString(amount);
            if (needAutoBringIn) {
                const autoMax = rangeAmount + minAmount - amount;
                if (autoMax >= autoMin) {
                    this.autoBringinArea.active = true;
                    this._setUpAutoOnTableSlider(autoMin, autoMax, stepAmount);
                } else {
                    this.autoBringinArea.active = false;
                    this._autoOnTable = 0;
                }
            }
        };
        this._bringInAmount = 0;
        this._setCoinTipText(showTip);
        this.bringInSlider.setProgress(0);
    }

    // _setUpAutoOnTableSlider 设置自动买筹码的滑动条
    private _setUpAutoOnTableSlider(minAmount: number, maxAmount: number, stepAmount: number) {
        const range = maxAmount - minAmount;
        let step = 1;
        if (range > 0) {
            if (range > stepAmount) {
                step = 1 / (range / stepAmount);
            } else {
                step = 0;
            }
        }
        this.autoSlider.step = Math.round(step * 10000) / 10000;
        this.autoSlider.onValueChanged = (progress: number) => {
            // 注意精度
            const amount = Math.min(range + minAmount, Math.round((progress * range) / stepAmount) * stepAmount + minAmount);
            this._autoOnTable = amount;
            this.autoSliderAmount.string = StringHelper.GetLongString(amount);
        };
        this._autoOnTable = 0;
        this.autoSlider.setProgress(0);
    }

    // 设置带入筹码Text
    private _setCoinTipText(showDepositTip: boolean): void {
        if (this.amountDescriptionTop) {
            this.amountDescriptionTop.string = showDepositTip
                ? `${i18nMgr.Get('UITexas_AddChips')}+${i18nMgr.Get('UIFantasy_dairuyajin')}`
                : i18nMgr.Get('UITexas_AddChips');
            this.amountDescriptionBottom.string = i18nMgr.Get('UITexas_AddChips');
        }
        if (this.bringInTipButton) {
            this.bringInTipButton.active = showDepositTip;
            const newPos = UIViewUtil.caculatePostion(this.amountDescriptionTopTipDot, this.bringInTipButton.children[0]);
            this.amountDescriptionTopTipDot.setPosition(newPos.x + 100, newPos.y - 53);
            // this.amountDescriptionTopTipDot.setPosition(newPos);
        }
    }

    // onPayNowOrApplyTraderClicked 点击立即支付或者申请批发商
    private async onPayNowOrApplyTraderClicked(apply: boolean, payType: number, data: HttpUSDTRechargeProtocol.RequestData) {
        //console.log(LN, apply, payType, data);
        if (apply) {
            viewManager.openDialog('ConfirmOrNotice', {
                content:
                    '1、钻石批发商申请费为<color=#05E7AE>1000</color>钻石，审核被拒后退还；\n2、申请通过后，需在60天内购买批发商专属钻石，否则资格将失效；\n3、批发商资格失效或者审批被拒需重新付费<color=#05E7AE>1000</color>钻石申请；\n4、申请后，我们将通过系统消息联系您，请留意消息',
                ok: '支付1000钻石',
                ok_click: () => {
                    this._applyForTrader();
                }
            });
            return;
        }
        try {
            const resp = await WWW.Instance.CommonAPI<HttpUSDTRechargeProtocol.ResponseData>({
                web_class: WebOrderUserUsdtRecharge,
                body: data
            });
            if (resp.code != 0) {
                this.tracelog.error('recharge request error', resp.code);
                return;
            }
            const rechargeDiamondParam: UIRechargeDiamondParam = {
                exchangeRate: this._exchangeRate,
                amount: data.pay_price,
                qrcode: resp.data.usdt_address.qr_code,
                address: resp.data.usdt_address.address,
                addressType: resp.data.usdt_address.address_type,
                onConfirm: () => {}
            };
            // 正常渠道支付
            if (payType == 1) {
                viewManager.openDialog('RechargeDiamond', rechargeDiamondParam);
                return;
            }
            if (payType == 2) {
                viewManager.showToast(i18nMgr.Get('UIMine_Setting108'));
                return;
            }
        } catch (e) {
            this.tracelog.error('recharge request exception', e);
            return;
        }
    }

    // _applyForTrader 申请批发商
    private async _applyForTrader() {
        try {
            const resp = await WWW.Instance.CommonAPI<HttpUSDTApplyProtocol.ResponseData>({
                web_class: WebUserTraderApply
            });
            if (resp.code != 0) {
                this.tracelog.error('apply trader error', resp.code);
                return;
            }
            const btn = this.paynowBtn;
            userStore.isApplyingTrader = true;
            btn.node.color = cc.Color.fromHEX(new cc.Color(), '#777777');
            this._rechargeData = null;
            this.paynowText.string = i18nMgr.Get('roomError171_5');
            btn.interactable = false;
            return;
        } catch (e) {
            this.tracelog.error('apply trader exception', e);
            return;
        }
    }

    // _callbackForChooseOne 选择购买项后的回调
    private _callbackForChooseOne(payData: HttpUSDTRechargeProtocol.RequestData, isSp: boolean, payType: number) {
        const btn = this.paynowBtn;
        // 批发商的，但是你在申请中
        if (isSp && userStore.isApplyingTrader) {
            btn.node.color = cc.Color.fromHEX(new cc.Color(), '#777777');
            this._rechargeData = null;
            this.paynowText.string = i18nMgr.Get('roomError171_5');
            btn.interactable = false;
            return;
        }
        // 批发商选项，且你不是批发商
        btn.interactable = true;
        btn.node.color = cc.Color.fromHEX(new cc.Color(), '#FFFFFF');
        if (isSp && !userStore.isTrader) {
            this._toApplyTrader = true;
            this.paynowText.string = i18nMgr.Get('OpCodeString_TRADERAPPLYFEE');
            return;
        }
        this._rechargeData = payData;
        this._payType = payType;
        this.paynowText.string = StringHelper.FormatString(i18nMgr.Get('Wallet_PayNow'), StringHelper.GetLongString(payData.pay_price, 1, 4));
    }

    @bindEvent(TradeStore.TRADEITEMS_AND_PAYTYPES_CHANGE, 'trade')
    private onUpdateTradeItemsAndPayTimes(items: HttpUSDTPriceListProtocol.GoldInfo[], paytypes: HttpUSDTPriceListProtocol.PayType[]) {
        this.diamondBoard.removeAllChildren();
        // 先初始化所有购买选项
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const node = cc.instantiate(this.diamondItem);
            node.parent = this.diamondBoard;
            const nsdtDiamond = node.getComponent(USDTDiamond);
            nsdtDiamond.initData(item.id, item.gold_count, item.give_gold_count, item.trader_type == 2);
            nsdtDiamond.onChooseOneCallback = (p, t, y) => {
                this._callbackForChooseOne(p, t, y);
            };
        }
        this.paytypes.removeAllChildren();
        // 初始化所有渠道，并触发第一个选中
        for (let i = 0; i < paytypes.length; i++) {
            const pt = paytypes[i];
            const node = cc.instantiate(this.payttypeItem);
            node.parent = this.paytypes;
            const paytype = node.getComponent(USDTPaytype);
            paytype.initData(pt.id, pt.type, pt.rate, pt.discount, pt.image, pt.name, i == 0);
            paytype.onSelectedCallback = (data: RateDetail) => {
                this.diamondBoard.children.forEach((nd: cc.Node) => {
                    nd.getComponent(USDTDiamond).updateCost(data.payID, data.payType, data.rate, data.discount);
                });
                this._exchangeRate = Math.max(1, Math.round(1 / data.rate));
                this.exchangeRateText.string = StringHelper.FormatString(
                    i18nMgr.Get('UIBuyDiamondExchangeRate'),
                    StringHelper.GetLongString(this._exchangeRate, 1, 0)
                );
            };
            // 以下是处理默认选中状态时候的处理，因为限制导致默认情况无法触发callback，所以只能在这里处理一次
            let toggle = node.getComponent(cc.Toggle);
            if (toggle) {
                if (i == 0) {
                    toggle.isChecked = true;
                    this.diamondBoard.children.forEach((nd: cc.Node, index: number) => {
                        const usdtdiamond = nd.getComponent(USDTDiamond);
                        let payData = usdtdiamond.updateCost(pt.id, pt.type, pt.rate, pt.discount);
                        let toggleChoice = nd.getComponent(cc.Toggle);
                        if (toggleChoice) {
                            if (index == 0) {
                                toggle.isChecked = true;
                                this._callbackForChooseOne(payData, usdtdiamond.isSp, usdtdiamond.payType);
                            } else {
                                toggle.isChecked = false;
                            }
                        }
                    });
                    this._exchangeRate = Math.max(1, Math.round(1 / pt.rate));
                    this.exchangeRateText.string = StringHelper.FormatString(
                        i18nMgr.Get('UIBuyDiamondExchangeRate'),
                        StringHelper.GetLongString(this._exchangeRate, 1, 0)
                    );
                    continue;
                }
                toggle.isChecked = false;
            }
        }
    }

    // initDiamond 初始化钻石购买界面
    private async initDiamond(): Promise<void> {
        this.diamondAmountLabel.string = i18nMgr.Get('UISend_diamondsNum') + ':';
        this.diamondAmount.string = StringHelper.GetLongStringLocale(userStore.diamonds);
        autoBindEvents(this, { trade: tradeStore });
        let promises = [];
        promises.push(TradeStoreUtils.prepareTradeItemsAndPaytypes());
        // 如果不是批发商，还需要请求是否在申请批发商中
        if (!userStore.isTrader) {
            promises.push(UserStoreUtils.checkIsApplying());
        }
        Promise.all(promises);
    }

    /** 点击带入Tab*/
    private onClickBalance(obj: cc.Node): void {
        this._changeTab(BringInTabType.Chips);
    }

    /** 点击钻石Tab*/
    private onClickDiamond(obj: cc.Node): void {
        this._changeTab(BringInTabType.Diamond);
    }

    /*** 切换TAB*/
    public _changeTab(titleType: BringInTabType): void {
        const diamondStatus = titleType == BringInTabType.Diamond;
        const balanceStatus = titleType == BringInTabType.Chips;
        this.titleBarDiamondLine.active = diamondStatus;
        this.titleBarBalanceLine.active = balanceStatus;
        this.bringInFullArea.active = balanceStatus;
        this.diamondArea.active = diamondStatus;
    }

    private onClickCommit(): void {
        const wallet = this._provider.getSelectedWalletBalance();
        if (wallet && wallet.balance < this._bringInAmount) {
            this._showBalanceInsufficientDialog(wallet.clubID);
            return;
        }
        this._provider.commit(this._bringInAmount, this._autoBringin ? this._autoOnTable : 0);
        this.close();
    }

    private _showBalanceInsufficientDialog(clubID: number): void {
        if (this._balanceDialogRequestID) return;
        this._balanceDialogClubID = clubID;
        this._balanceDialogRequestID = h5MessageManager.sendToH5('showDialog', 1, {
            message: i18nMgr.Get('ServerErrorCode_20004'),
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: i18nMgr.Get('Wallet_Cancel'),
            confirmButtonText: i18nMgr.Get('UIHappyShop_ToRechange'),
            closeOnClickOverlay: false
        });
        h5MessageManager.on('dialogResult', this._onBalanceDialogResult);
    }

    private _clearBalanceDialogState(): void {
        if (!this._balanceDialogRequestID) return;
        this._balanceDialogRequestID = '';
        this._balanceDialogClubID = 0;
        h5MessageManager.off('dialogResult');
    }

    // 点击选择钱包按钮
    private onClickWalletBtn(): void {
        if (!this.buttonSelectWallet?.getComponent(cc.Button)?.interactable) {
            return;
        }
        if (this.walletScrollView) {
            this.walletScrollView.node.active = !this.walletScrollView.node.active;
        }
        if (this.arrowDown && this.walletScrollView) {
            if (this.walletScrollView.node.active) {
                this.arrowDown.angle = -180;
            } else {
                this.arrowDown.angle = -0;
            }
        }
        // 更新钱包列表选择状态
        if (this._walletToggles != null && this._walletToggles.length > 0) {
            for (let i = 0; i < this._walletToggles.length; i++) {
                this._walletToggles[i].isChecked = this._walletSelect == i;
            }
        }
    }

    // 点击提示遮罩(押金说明部分)
    private onClickTipsMask(): void {
        if (this.tips) this.tips.active = false;
        if (this.tipsMask) this.tipsMask.active = false;
        if (this.bringTips) this.bringTips.active = false;
    }

    // 设置钱包列表
    public _setupWalletList(wallets: IWallet[], selectWalletClubID: number): void {
        if (wallets.length == 1) {
            this._updateTotalCoinAndWalletChoosen(false, wallets[0]);
            return;
        }
        // 如果已经有选中状态，要恢复状态
        this._cloneNode.active = false;
        this.emptySelectWallet.active = true;
        this.walletScrollView.node.active = false;
        let button = this.buttonSelectWallet.getComponent(cc.Button);
        button.interactable = true;
        this.walletScrollView.content.removeAllChildren();
        // 创建钱包列表项
        for (let i = 0; i < wallets.length; i++) {
            let walletItem = wallets[i];
            let temp = cc.instantiate(this.clueItemPrefab);
            temp.parent = this.walletScrollView.content;
            this._setClubItemData(walletItem, temp, i != wallets.length - 1);
            let toggle = temp.getComponent(cc.Toggle);
            let index = i;
            // // 处理选中状态
            if (selectWalletClubID == walletItem._clubID) {
                toggle.isChecked = true;
                let bgNode = cc.find('bg', temp);
                if (bgNode) bgNode.active = true;
                this._walletSelect = index;
                this._updateTotalCoinAndWalletChoosen(true, wallets[index]);
            }
            // 添加Toggle监听
            toggle.node.on('toggle', (sender: cc.Toggle) => {
                let bgNode = cc.find('bg', temp);
                if (bgNode) bgNode.active = sender.isChecked;
                if (!sender.isChecked) return;
                this._walletSelect = index;
                this._updateTotalCoinAndWalletChoosen(true, wallets[index]);
            });
        }
        // 设置滚动视图高度
        if (wallets.length > 0 && this.walletScrollView) {
            let itemHeight = 60;
            let sep = 10;
            let delta = 60;
            let viewHeight = itemHeight * wallets.length + (wallets.length - 1) * sep + delta;
            // 设置滚动视图高度
            let scrollRT = this.walletScrollView.getComponent(cc.ScrollView);
            if (scrollRT && scrollRT.content) {
                scrollRT.content.height = viewHeight;
            }
        }
    }

    // _setClubItemData 设置俱乐部数据
    private _setClubItemData(walletItem: IWallet, temp: cc.Node, addLine?: boolean): void {
        // 设置头像
        let headImage = cc.find('cnamegrp/spriteClubIcon', temp).getComponent(RemoteSprite);
        headImage.url = walletItem.logo;
        // WebImageHelper.SetHeadImage(headImage, walletItem.club_logo);
        // 设置名称
        let nameLabel = cc.find('cnamegrp/labelClubName', temp).getComponent(cc.Label);
        if (nameLabel) nameLabel.string = walletItem.name;
        // 设置ID
        let idLabel = cc.find('labelClubId', temp).getComponent(cc.Label);
        if (idLabel) idLabel.string = walletItem.clubID.toString();
        // 设置余额标题
        let labelBalanceTitle = cc.find('overlay/balance/labelBalanceTitle', temp).getComponent(cc.Label);
        if (labelBalanceTitle) {
            labelBalanceTitle.string = i18nMgr.Get('UIClub_CreateRoom31');
        }
        let numLabel = cc.find('overlay/balance/labelBalance', temp).getComponent(cc.Label);
        if (numLabel) numLabel.string = StringHelper.GetLongStringLocale(walletItem.gold);
        let line = cc.find('overlay2', temp);
        line.active = addLine;
    }

    // _updateTotalCoinAndWalletChoosen 刷新金币和钱包选择状态
    @traceMethod()
    private _updateTotalCoinAndWalletChoosen(isEnable: boolean, wallet: IWallet): void {
        if (this.textTotalCoin) this.textTotalCoin.string = StringHelper.GetLongStringLocale(wallet.gold);
        let button = this.buttonSelectWallet.getComponent(cc.Button);
        button.interactable = isEnable;
        this.emptySelectWallet.active = false;
        this.buttonCommit.node.parent.active = true;
        this._cloneNode.active = true; // 显出出来
        this._setClubItemData(wallet, this._cloneNode, false);
        // 选择区域禁止选择
        this.walletScrollView.node.active = false;
        // 恢复箭头
        this.arrowDown.angle = -0;
        // 显示筹码滑块
        this.bringInArea.active = true;
        this._provider.clubSelected(wallet._clubID);
    }

    protected onDisable(): void {
        super.onDisable();
        this._clearBalanceDialogState();
        if (this._provider) {
            this._provider.cleanup();
            this._provider = null;
        }
    }
}
