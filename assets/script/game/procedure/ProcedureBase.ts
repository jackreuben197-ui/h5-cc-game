import { traceClass } from '../../core/decorator/LogTrace';
import ProcedureDefine from './ProcedureDefine';

@traceClass()
export default class ProcedureBase {
    Name: string = 'ProcedureBase';
    param: any = null;

    constructor(public id: ProcedureDefine) {}

    //ignoreEnter 跳过进入的处理,特殊回退进程用到
    Enter(param?: any) {
        this.tracelog.debug(this.Name, 'Enter()', 'param:', param);
        this.param = param;
        // if (param?.ignoreEnter) {
        //     return;
        // }
        this.lateEnter(param);
    }

    Leave() {
        this.tracelog.debug(this.Name, 'Leave()');
    }

    protected lateEnter(param?: any) {}
}
