import { ServerMessageRegister } from '@silenthill/agreement-web';
import { createLogger } from '../../../core/decorator/LogTrace';

const _plog = createLogger('ServerMessageRegister', 'info');

// Register 1
export function Register(data: ServerMessageRegister.AsObject, roomID: number, matchID: number) {
    const details = {
        status: data?.status,
        timestamp: data?.timestamp,
        roomID,
        matchID
    };
    if (data?.status === 0) {
        _plog.info('REGISTER ack:', details);
        return;
    }
    _plog.warn('REGISTER rejected:', details);
}
