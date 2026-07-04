import { ServerMessageGetMsg } from '@silenthill/agreement-web';
import { handleBroadcastExtra } from './BroadcastMsg';

// GetMsg 1121
export function GetMsg(data: ServerMessageGetMsg.AsObject, roomID: number, matchID: number) {
    handleBroadcastExtra(data.extra, roomID, matchID);
}
