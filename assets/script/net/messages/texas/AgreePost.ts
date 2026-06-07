import { createLogger } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { CPErrorCode } from '../../../i18n/CPErrorCode';
import { Def } from '../../../protobuf/holdem/define_pb';
import { ServerMessageAgreePost } from '../../../protobuf/holdem/req_th_agree_post_pb';
import viewManager from '../../../views/UIViewManager';

const _plog = createLogger('ServerMessageAgreePost');

// AgreePost 1016
export function AgreePost(data: ServerMessageAgreePost.AsObject, roomID: number, matchID: number) {
    let roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (data.status != 0) {
        _plog.debug('agree post error, status:', data.status, CPErrorCode.ServerErrorDescription(data.status));
        viewManager.showToast(CPErrorCode.ServerErrorDescription(data.status));
        return;
    }
    const player = roomData.mine.player;
    player.status = Def.CanPlayStatus.AGREE_POST;
}
