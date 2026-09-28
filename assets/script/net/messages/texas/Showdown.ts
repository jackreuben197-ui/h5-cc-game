import { ServerMessageShowdown } from '@silenthill/agreement-web';
import { CPErrorCode } from '../../../i18n/CPErrorCode';
import viewManager from '../../../views/UIViewManager';

// Showdown 1012
export function Showdown(data: ServerMessageShowdown.AsObject, roomID: number, matchID: number) {
    if (!data || data.status == 0) return;
    viewManager.showToast(CPErrorCode.ServerErrorDescription(data.status));
}
