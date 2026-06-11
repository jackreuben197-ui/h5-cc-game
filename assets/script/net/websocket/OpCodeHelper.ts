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
    private static _NeedLogCodes: Array<(typeof Code)[keyof typeof Code]> = [Code.MSG_D_ENTER_ROOM, Code.MSG_S_WINNER, Code.MSG_S_START_INFO];

    static NeedLog(code: (typeof Code)[keyof typeof Code]): boolean {
        return OpCodeHelper._IgnoreShowLog_Codes.indexOf(code) == -1 && (OpCodeHelper._NeedLogCodes.length == 0 || OpCodeHelper._NeedLogCodes.includes(code));
    }
}
