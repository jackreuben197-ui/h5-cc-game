import { HttpUSDTRechargeProtocol } from '../../../../net/https/data/usdt/HttpUSDTRechargeProtocol';
import { StringHelper } from '../../../../helper/StringHelper';
import { i18nMgr } from '../../../../i18n/i18nMgr';

const { ccclass, property, menu } = cc._decorator;

const LN = '[USDTDiamond]';

@ccclass
@menu('CrazyPoker/AddChips/usdtdiamond/USDTDiamond')
export default class USDTDiamond extends cc.Component {
    public onChooseOneCallback: (payData: HttpUSDTRechargeProtocol.RequestData, isSp: boolean, payType: number) => void = null;
    @property(cc.Label)
    private amount: cc.Label = null;
    @property(cc.Label)
    private intro: cc.Label = null;
    @property(cc.Label)
    private usdtAmount: cc.Label = null;
    @property(cc.Button)
    private buyButton: cc.Button = null;
    //专属标记
    @property(cc.Node)
    private sp: cc.Node = null;
    @property(cc.Label)
    private spLabel: cc.Label = null;
    @property(cc.Button)
    private spMark: cc.Button = null;
    @property(cc.Node)
    private spIntroNode: cc.Node = null;
    @property(cc.Label)
    private spIntroText: cc.Label = null;
    private _amountForCaculate: number = 0;
    private _priceID: number = 0;
    private _cost: number = 0;
    private _payID: number = 0;
    private _isSp: boolean = false;
    private _payType: number = 0; // 1 数字钱包 2：API 3：客服撮合 （只有再updateCost以后才会有value)
    public get isSp(): boolean {
        return this._isSp;
    }
    public get payType(): number {
        if (this._payID == 0) {
            console.error(LN, 'updateCost should be called');
            return 0;
        }
        return this._payType;
    }

    public initData(id: number, amount: number, moreAmount: number, isSp: boolean) {
        this._priceID = id;
        this._amountForCaculate = amount;
        this.amount.string = amount.toString();
        if (moreAmount > 0) {
            this.intro.string = StringHelper.FormatString(i18nMgr.Get('UIBuyDiamondMore'), moreAmount);
        } else {
            this.intro.node.active = false;
        }
        this._isSp = isSp;
        if (isSp) {
            this.sp.active = true;
        } else {
            this.sp.active = false;
        }
    }

    private _roundPrice(price: number): number {
        return Math.round(price * 10000) / 10000;
    }

    public updateCost(payID: number, payType: number, rate: number, discount: number): HttpUSDTRechargeProtocol.RequestData {
        this._payID = payID;
        this._payType = payType;
        const totalPrice = this._roundPrice(this._amountForCaculate * rate);
        const discountPrice = discount > 0 ? this._roundPrice(totalPrice * discount) : 0;
        this._cost = this._roundPrice(totalPrice - discountPrice);
        console.log(LN, 'updateCost', 'payID:', payID, 'payType:', payType, 'rate:', rate, 'discount:', discount, 'cost:', this._cost);
        this.usdtAmount.string = StringHelper.GetLongStringLocale(this._cost, 1, 4);
        return {
            price_id: this._priceID,
            pay_price: this._cost,
            pay_id: this._payID,
            gold_count: this._amountForCaculate
        };
    }

    private onChooseOne(toggle: cc.Toggle) {
        if (!toggle.isChecked) return;
        if (this.onChooseOneCallback) {
            this.onChooseOneCallback(
                {
                    price_id: this._priceID,
                    pay_price: this._cost,
                    pay_id: this._payID,
                    gold_count: this._amountForCaculate
                },
                this._isSp,
                this._payType
            );
        }
    }
}
