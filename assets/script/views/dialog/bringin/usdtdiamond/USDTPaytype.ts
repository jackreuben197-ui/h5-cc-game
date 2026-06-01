import { StringHelper } from '../../../../helper/StringHelper';
import { i18nMgr } from '../../../../i18n/i18nMgr';
import RemoteSprite from '../../../widget/RemoteSprite';

const { ccclass, property, menu } = cc._decorator;

export interface RateDetail {
    payID: number;
    payType: number;
    rate: number;
    discount: number;
}

@ccclass
@menu('CrazyPoker/AddChips/usdtdiamond/USDTPaytype')
export default class USDTPaytype extends cc.Component {
    public onSelectedCallback: (data: RateDetail) => void = null;
    @property(RemoteSprite)
    private icon: RemoteSprite = null;
    @property(cc.Label)
    private paytypeName: cc.Label = null;
    @property(cc.Node)
    private recomend: cc.Node = null;
    @property(cc.Label)
    private discountLabel: cc.Label = null;
    private _rateDetail: RateDetail = null;

    public initData(id: number, paytype: number, rate: number, discount: number, icon: string, name: string, isrecommend: boolean) {
        this._rateDetail = {
            payType: paytype,
            payID: id,
            rate: rate,
            discount: discount
        };
        if (discount > 0) {
            this.discountLabel.string = i18nMgr.Get('UIMineUSDTSheet_CanSubtractTip') + StringHelper.GetLongString(discount * 100, 1) + '%';
            this.discountLabel.node.parent.active = true;
        } else {
            this.discountLabel.node.parent.active = false;
        }
        this.icon.url = icon;
        this.paytypeName.string = name;
        if (isrecommend) {
            this.recomend.active = true;
        } else {
            this.recomend.active = false;
        }
    }

    private onSelected(toggle: cc.Toggle) {
        if (!toggle.isChecked) return;
        if (this.onSelectedCallback) {
            this.onSelectedCallback(this._rateDetail);
        }
    }
}
