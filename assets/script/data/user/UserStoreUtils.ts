import { traceClass, traceMethod } from '../../core/decorator/LogTrace';
import { WebUserInfo, WebUserTraderApplyList } from '../../net/https/WebRequest';
import { WWW } from '../../net/https/WebRequestBase';
import { HttpUSDTApplyListProtocol } from '../../net/https/data/usdt/HttpUSDTApplyListProtocol';
import { HttpUserInfoProtocol } from '../../net/https/data/user/HttpUserInfoProtocol';
import userStore from './UserStore';

@traceClass()
export default class UserStoreUtils {
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
