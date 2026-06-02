import { traceClass, traceMethod } from '../../core/decorator/LogTrace';
import { HttpUSDTPriceListProtocol } from '../../net/https/data/usdt/HttpUSDTPriceListProtocol';
import { WebPropGoldPriceList } from '../../net/https/WebRequest';
import { WWW } from '../../net/https/WebRequestBase';
import tradeStore from './TradeStore';

@traceClass()
export default class TradeStoreUtils {
    @traceMethod()
    public static async prepareTradeItemsAndPaytypes() {
        const result = await WWW.Instance.CommonAPI<HttpUSDTPriceListProtocol.ResponseData>({
            web_class: WebPropGoldPriceList,
            body: {
                source_type: 2, // 玩家
                gold_types: [4],
                pay_gold_types: [],
                trader_type: 0,
                limit: 100,
                offset: 0
            }
        });
        if (result.code != 0) {
            TradeStoreUtils.tracelog.error('get trade list error', result.code);
            return;
        }
        tradeStore.updateTradeItemsAndPayTimes(result.data.list, result.data.pay_types);
    }
}
