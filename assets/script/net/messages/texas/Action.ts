import { Code, ServerMessageAction } from '@silenthill/agreement-web';
import { createLogger } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { CPErrorCode } from '../../../i18n/CPErrorCode';
import viewManager from '../../../views/UIViewManager';
import ProtocolAgency from '../../websocket/ProtocolAgency';

const _plog = createLogger('ServerMessageAction');

// Action 1006
export function Action(data: ServerMessageAction.AsObject, roomID: number, matchID: number) {
    if (data.status != 0) {
        _plog.debug('action error, status:', data.status, CPErrorCode.ServerErrorDescription(data.status));
        viewManager.showToast(CPErrorCode.ServerErrorDescription(data.status));
        // The rejection has no hand or turn ID. Restore legal actions from the
        // room snapshot instead of unlocking whichever turn is now displayed.
        if (roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID)?.mine?.operator?.actionSubmitted) {
            ProtocolAgency.Send({
                code: Code.MSG_D_SYNC_ENTER,
                roomID,
                matchID,
                body: { room: { roomId: roomID, matchId: matchID } }
            });
        }
    }
}
