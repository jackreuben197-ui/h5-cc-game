import { ServerMessageError } from '@silenthill/agreement-web';

// Error 99
export function Error(data: ServerMessageError.AsObject, roomID: number, matchID: number) {}
