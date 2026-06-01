// import { ProtocolCode } from './ProtocolCode';
import { Code } from '../../protobuf/holdem/code_pb';

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
    static _IgnoreShowLog_Codes: Array<(typeof Code)[keyof typeof Code]> = [Code.MSG_D_HEARTBEAT];

    static NeedLog(code: (typeof Code)[keyof typeof Code]): boolean {
        return this._IgnoreShowLog_Codes.indexOf(code) == -1;
    }
}
