import { bindData, IObservableBindings, pureEvent } from '../../core/decorator/DataBind';
import GameplayUtil from '../../game/util/GameplayUtil';
import { HttpUSDTPriceListProtocol } from '../../net/https/data/usdt/HttpUSDTPriceListProtocol';

interface TradeStore extends IObservableBindings<TradeStore> {}

@bindData()
class TradeStore extends cc.EventTarget {
    private _tradeItems: HttpUSDTPriceListProtocol.GoldInfo[] = [];
    private _payTypes: HttpUSDTPriceListProtocol.PayType[] = [];

    public updateTradeItemsAndPayTimes(trs: HttpUSDTPriceListProtocol.GoldInfo[], pts: HttpUSDTPriceListProtocol.PayType[]) {
        if (GameplayUtil.isArraySame(this._tradeItems, trs) && GameplayUtil.isArraySame(this._payTypes, pts)) {
            return false;
        }
        this._tradeItems = trs;
        this._payTypes = pts;
        this._sendTradeItemsAndPayTimesChangeEvent(this._tradeItems, this._payTypes);
    }

    @pureEvent('TRADEITEMS_AND_PAYTYPES_CHANGE', {
        initParams() {
            return [this._tradeItems, this._payTypes];
        }
    })
    private _sendTradeItemsAndPayTimesChangeEvent(trs: HttpUSDTPriceListProtocol.GoldInfo[], pts: HttpUSDTPriceListProtocol.PayType[]) {}
}

const tradeStore = new TradeStore();

export default tradeStore;
