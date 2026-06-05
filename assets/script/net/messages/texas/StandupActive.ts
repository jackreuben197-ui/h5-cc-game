import { createLogger } from '../../../core/decorator/LogTrace';
import { CPErrorCode } from '../../../i18n/CPErrorCode';
import { ServerMessageStandupActive } from '../../../protobuf/holdem/req_th_stand_up_active_pb';
import viewManager from '../../../views/UIViewManager';

const _plog = createLogger('ServerMessageStandupActive');

// StandupActive 1009
export function StandupActive(data: ServerMessageStandupActive.AsObject, roomID: number, matchID: number) {
    if (data.status != 0) {
        _plog.debug('action error, status:', data.status, CPErrorCode.ServerErrorDescription(data.status));
        viewManager.showToast(CPErrorCode.ServerErrorDescription(data.status));
    }
}
