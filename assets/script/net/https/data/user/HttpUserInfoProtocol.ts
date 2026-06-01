import { WebResponseDataBase } from '../other/WebResponseDataBase';
import { HttpRoomUserMuteProtocol } from '../room/HttpRoomUserMuteProtocol';

/**
 * 请求用户数据
 */
export namespace HttpUserInfoProtocol {
    export const API = '/api/user/info';
    export class RequestData {}
    export class ResponseData extends WebResponseDataBase {
        public data: Data = null;
    }
    export class Data {
        /** 用户信息 */
        public user: UserInfo = null;
        /** 用户禁言列表 */
        public mute_list: HttpRoomUserMuteProtocol.MuteInfo[] = [];
        /** 进入APP的时候判断是否要延迟关闭支付客服浮窗 */
        public close_chat_time: number = 0;
        /** 进入APP的时候判断是否打开支付客服消息悬浮窗 */
        public open_chat: boolean = false;
    }
    export class UserInfo {
        /** 玩家真实id（客户端不用这个id） */
        public p_u_id: number = 0;
        /** 手机号地区 例子：+86 */
        public area: string = '';
        /** 手机号 */
        public phone: string = '';
        /** UC币 */
        public gold: number = 0;
        /** 玩家随机id */
        public un_id: number = 0;
        /** 名字 */
        public nickname: string = '';
        /** 头像 */
        public avatar: string = '';
        /** 性别 */
        public sex: number = 0;
        /** 省会 */
        public province: string = '';
        /** 修改用户[名称]次数 */
        public mnt: number = 0;
        /** 修改用户[头像]次数 */
        public mat: number = 0;
        /** 1 普通用户; 2 支桌号; 3 牌局机器人; 4 牛仔机器人； 5 游客 */
        public ut: number = 0;
        /** 用户限制 1 不限制, 2 限制 */
        public limit: number = 0;
        /** 俱乐部ID */
        public club_id: number = 0;
        /** 是否保存人脸验证，1 是，2否 */
        public save_face: number = 0;
        /** 邮箱 */
        public email: string = '';
        /** 快捷登录 1开 其他关 */
        public quick_login_switch: number = 0;
        /** 带入二级密码 1开 其他关 */
        public bringin_pwd_switch: number = 0;
        /** 快捷登录类型 */
        public quick_login_type: string = '';
        /** 带入二级密码类型 */
        public bringin_pwd_type: number = 0;
        /** 带入二级密码证明类型 */
        public bringin_pwd_verify_type: number = 0;
        /** 数字密码 1开 其他关 */
        public digital_switch: number = 0;
        /** 手势密码 1开 其他关 */
        public gesture_switch: number = 0;
        /** 生物识别 1开 其他关 */
        public biometric_switch: number = 0;
        /** 用户VIP信息 */
        public user_current_subscription: UserVIPInfo = null;
        /** 幸运号 */
        public lucky_num: number = 0;
        /** 用户额外状态 */
        public extra_status: UserExtraStatus = null;
        /** USDT批发商有效期 */
        public trader_expire_time: number = 0;
        /** 今天赠送次数 */
        public user_today_diamond_send_time: number = 0;
        /** 钻石免费次数 */
        public diamond_free_times: number = 0;
        /** 用户钻石余额 */
        public diamonds: number = 0;
        /** 冻结状态 0 被冻结；1 正常 */
        public forbid: number = 0;
        /** 玩家的IP属地 */
        public ip_addr: string = '';
    }
    export class UserExtraStatus {
        /** 是否完成分享引导 */
        public share_table_guide: number = 0;
        /** 是否完成桌布引导 */
        public change_desk_guide: number = 0;
        /** 是不是展示BB 1展示 0不展示 */
        public isShowBB: number = 0;
    }
    export class UserVIPInfo {
        /** 会员ID */
        public subscription_id: number = 0;
        /** 会员名称 */
        public subscription_name: string = '';
        /** 会员Logo */
        public subscription_logo: string = '';
        /** 会员到期时间（时间戳） */
        public subscription_end_time: number = 0;
        /** 免费加时次数 */
        public free_add_time_num: number = 0;
        /** 免费查看翻牌次数 */
        public free_view_card_num: number = 0;
        /** 免费扔道具次数 */
        public free_use_chat_prop_num: number = 0;
        /** 免费使用表情次数 */
        public free_use_chat_emoji_num: number = 0;
        /** 免费使用弹幕框次数 */
        public free_use_chat_bullet_num: number = 0;
        /** 免费使用头像聊天框次数 */
        public free_use_chat_avatar_num: number = 0;
        /** 已免费加时次数 */
        public free_added_time_num: number = 0;
        /** 已免费查看翻牌次数 */
        public free_viewed_card_num: number = 0;
        /** 已免费扔道具次数 */
        public free_used_chat_prop_num: number = 0;
        /** 已免费使用表情次数 */
        public free_used_chat_emoji_num: number = 0;
        /** 已免费使用弹幕框次数 */
        public free_used_chat_bullet_num: number = 0;
        /** 已免费使用头像聊天框次数 */
        public free_used_chat_avatar_num: number = 0;
        /** 价格类型：0=永久，1=30天（月），2=90天（季），3=180天（半年），4=365天（年） */
        public subscription_price_type: number = 0;
        /** 免费收藏牌谱次数 */
        public free_collect_card: number = 0;
        /** 免费修改玩家昵称次数 */
        public free_change_user_name: number = 0;
        /** 免费看手牌次数 */
        public free_watch_card: number = 0;
        /** 已免费使用收藏牌谱次数 */
        public free_used_collect_card: number = 0;
        /** 已免费使用修改玩家昵称次数 */
        public free_used_change_user_name: number = 0;
        /** 已免费使用看手牌次数 */
        public free_used_watch_card: number = 0;
    }
}
