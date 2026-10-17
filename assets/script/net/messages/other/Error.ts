import { ServerMessageError } from '@silenthill/agreement-web';
import { createLogger } from '../../../core/decorator/LogTrace';

const _plog = createLogger('ServerMessageError', 'warn');

// Error 99
export function Error(data: ServerMessageError.AsObject, roomID: number, matchID: number) {
    _plog.warn('server error:', {
        status: data?.status,
        message: data?.message,
        roomID,
        matchID
    });
}
