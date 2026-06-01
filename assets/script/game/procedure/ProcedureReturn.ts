import ProcedureBase from './ProcedureBase';
import H5MsgMgr, { H5NavigatePayload } from '../../H5MsgMgr';

export interface ProcedureReturnNavigateParam {
    routeData?: H5NavigatePayload;
}

/**
 * 回到H5
 */

export default class ProcedureReturn extends ProcedureBase {
    override Name: string = 'ProcedureReturn';

    override lateEnter(param: ProcedureReturnNavigateParam) {
        if (param && param.routeData) {
            H5MsgMgr.sendToH5('h5Navigate', 1, param.routeData);
            return;
        }
        // 通知 H5 层恢复显示
        H5MsgMgr.sendToH5('h5Show', 1);
    }

    override Leave() {
        super.Leave();
    }
}
