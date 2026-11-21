import { ServerMessageAction } from '@silenthill/agreement-web';
import { createLogger } from '../../../core/decorator/LogTrace';
import { CPErrorCode } from '../../../i18n/CPErrorCode';
import viewManager from '../../../views/UIViewManager';

const _plog = createLogger('ServerMessageAction');

// Action 1006
export function Action(data: ServerMessageAction.AsObject, roomID: number, matchID: number) {
    if (data.status != 0) {
        _plog.debug('action error, status:', data.status, CPErrorCode.ServerErrorDescription(data.status));
        viewManager.showToast(CPErrorCode.ServerErrorDescription(data.status));
    }
}
