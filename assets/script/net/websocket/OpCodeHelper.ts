// import { ProtocolCode } from './ProtocolCode';
import { Code } from '@silenthill/agreement-web';

export default class OpCodeHelper {
    /**
     * 忽略菊花的WS CODE
     */
    static _IgnoreShowJuhua_Codes: Array<(typeof Code)[keyof typeof Code]> = [Code.MSG_D_HEARTBEAT];

    static NeedJuhua(code: (typeof Code)[keyof typeof Code]): boolean {
        return this._IgnoreShowJuhua_Codes.indexOf(code) == -1;
    }

    /**
     * 忽略打印Log的WS CODE
     */
    private static _IgnoreShowLog_Codes: Array<(typeof Code)[keyof typeof Code]> = [Code.MSG_D_HEARTBEAT];
    private static _NeedLogCodes: Array<(typeof Code)[keyof typeof Code]> = [
        Code.MSG_D_ENTER_ROOM,
        Code.MSG_S_WINNER,
        Code.MSG_S_START_INFO,
        Code.MSG_D_ADD_TIME,
        // 偷偷看失败时需要保留请求、次数查询和成功推送，便于确认服务端状态码。
        Code.MSG_D_VIEW_PLAYER_CARDS,
        Code.MSG_D_VIEW_PLAYER_CARDS_NUM,
        Code.MSG_S_SHOW_VIEW_CARDS,
        // 私域收费由坐下时绑定的钱包俱乐部决定，保留该协议日志用于核对 clubId。
        Code.MSG_D_SEATED,
        Code.MSG_D_SYNC_ENTER,
        Code.MSG_S_UP_BLIND,
        Code.MSG_S_ACTION_ALL,
        Code.MSG_S_STANDUP,
        Code.MSG_S_SEATED_OTHERS,
        Code.MSG_S_LEAVE_NOTIFICATION,
        // 首位玩家依赖 107 补齐开赛倒计时，保留日志便于核对协议时序。
        Code.MSG_S_NOTIFICATION_MTT_WILL_START,
        Code.MSG_S_NEXT_CHANGE,
        Code.MSG_D_ADD_ON,
        // MTT 休息时序问题需要保留完整协议日志。
        Code.MSG_S_MTT_BREAK,
        Code.MSG_S_PUBLIC_CARDS,
        Code.MSG_D_ROOMERS,
        Code.MSG_S_UTIL_ANTI_CHEAT_ROOM_VIDEO,
        Code.MSG_R_ROOMS
    ];

    static NeedLog(code: (typeof Code)[keyof typeof Code]): boolean {
        return OpCodeHelper._IgnoreShowLog_Codes.indexOf(code) == -1 && (OpCodeHelper._NeedLogCodes.length == 0 || OpCodeHelper._NeedLogCodes.includes(code));
    }
}
