import { traceClass, traceMethod } from '../../core/decorator/LogTrace';
import { GameplayChatPropType } from '../../game/constant/GameplayChatPropType';
import { HttpMiscCombine } from '../../net/https/data/misc/HttpMiscCombine';
import { WebResponseDataBase } from '../../net/https/data/other/WebResponseDataBase';
import { HttpPropChatPropList } from '../../net/https/data/prop/HttpPropChatPropList';
import { HttpUSDTApplyListProtocol } from '../../net/https/data/usdt/HttpUSDTApplyListProtocol';
import { HttpUserInfoProtocol } from '../../net/https/data/user/HttpUserInfoProtocol';
import { WebMiscCombine, WebPropUserPropUsed, WebUserInfo, WebUserTraderApplyList } from '../../net/https/WebRequest';
import { WWW } from '../../net/https/WebRequestBase';
import userStore from './UserStore';

@traceClass()
export default class UserStoreUtils {
    @traceMethod()
    public static async preparePropList(): Promise<void> {
        const propRequest = new HttpPropChatPropList.RequestData();
        propRequest.prop_types = [GameplayChatPropType.CHAT_PROP, GameplayChatPropType.THROW_PROP];
        propRequest.offset = 0;
        propRequest.limit = 100;
        propRequest.user_type = 0;
        const body = new HttpMiscCombine.RequestData();
        body.api_list = [WebMiscCombine.ApiType.CHAT_PROP_LIST];
        body.get_chat_shop_prop_list_req = propRequest;
        let res: HttpMiscCombine.ResponseData;
        try {
            res = await WWW.Instance.CommonAPI<HttpMiscCombine.ResponseData>({
                web_class: WebMiscCombine,
                body,
                juhua: false,
                useCache: true
            });
        } catch (error) {
            if (error === 'timeout') return;
            throw error;
        }
        if (res.code != 0) {
            UserStoreUtils.tracelog.error('get prop list by HttpMiscCombine error', res.code);
            return;
        }
        const now = Date.now() / 1000;
        userStore.propList = (res.data?.get_chat_shop_prop_list_resp?.list || []).map(item => ({
            propID: item.prop_id,
            propType: item.prop_type,
            priceID: item.price_id,
            propCode: item.prop_code,
            rawPrice: item.raw_price,
            payPrice: item.start_time <= now && now <= item.end_time ? item.pay_price : item.raw_price,
            subscriptionName: item.subscription_name,
            propAmount: item.prop_amount,
            gamePropID: item.game_prop_id
        }));
    }

    @traceMethod()
    public static async consumeUserProp(gamePropID: number): Promise<boolean> {
        const res = await WWW.Instance.CommonAPI<WebResponseDataBase>({
            web_class: WebPropUserPropUsed,
            body: {
                prop_id: gamePropID,
                type: 0,
                recipient_contact: '',
                quantity: 1,
                recipient_name: '',
                recipient_address: '',
                prop_bag_id: 0
            },
            juhua: false
        });
        if (res.code != 0) {
            UserStoreUtils.tracelog.error('consume user prop error', res.code);
            return false;
        }
        await UserStoreUtils.preparePropList();
        return true;
    }

    @traceMethod()
    public static async checkIsApplying() {
        const data = await WWW.Instance.CommonAPI<HttpUSDTApplyListProtocol.ResponseData>({
            web_class: WebUserTraderApplyList,
            body: {
                status: 1
            }
        });
        if (data.code != 0) {
            UserStoreUtils.tracelog.error('get HttpUSDTApplyListProtocol error', data.code);
            return;
        }
        userStore.isApplyingTrader = data.data.list.length > 0;
    }

    @traceMethod()
    public static async updateUserInfoBasic() {
        const data = await WWW.Instance.CommonAPI<HttpUserInfoProtocol.ResponseData>({
            web_class: WebUserInfo
        });
        if (data.code != 0) {
            UserStoreUtils.tracelog.error('get HttpUserInfoProtocol error', data.code);
            return;
        }
        // @TODO更新用户信息
        //GC.data.user.info  Update
        userStore.userID = data.data.user.p_u_id;
        userStore.userRID = data.data.user.un_id;
        userStore.diamonds = data.data.user.diamonds;
        userStore.avatar = data.data.user.avatar;
        userStore.name = data.data.user.nickname;
        userStore.sex = data.data.user.sex;
        userStore.forbid = data.data.user.forbid == 0;
    }

    public static updateUserWallet(amount: number, _clubID: number) {
        const a = [...userStore.wallets];
        const target = a.find(item => item._clubID === _clubID);
        target.gold = amount;
        userStore.wallets = a;
    }
}
