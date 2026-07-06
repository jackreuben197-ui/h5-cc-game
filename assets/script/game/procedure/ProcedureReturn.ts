import soundManager from '../../core/SoundManager';
import { default as h5MessageManager, default as H5MsgMgr, H5NavigatePayload } from '../../H5MsgMgr';
import viewManager from '../../views/UIViewManager';
import roomReconnectManager from '../RoomReconnectManager';
import ProcedureBase from './ProcedureBase';

export interface ProcedureReturnNavigateParam {
    routeData?: H5NavigatePayload;
}

/**
 * 回到H5
 */

export default class ProcedureReturn extends ProcedureBase {
    override Name: string = 'ProcedureReturn';

    override lateEnter(param: ProcedureReturnNavigateParam) {
        // 主动离桌 / 被踢 / 服务端关闭都会归到这里，统一清掉重连上下文
        roomReconnectManager.clearAllContext();
        soundManager.volumeOnOff(false);
        viewManager.showPreloadingLayer();
        if (param && param.routeData) {
            H5MsgMgr.sendToH5('h5Navigate', 1, param.routeData);
            return;
        }
        // 通知 H5 层恢复显示
        H5MsgMgr.sendToH5('h5Show', 1);
    }

    override Leave() {
        super.Leave();
        h5MessageManager.sendToH5('h5Hide', 1);
    }
}
