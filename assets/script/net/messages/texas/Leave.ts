import { ServerMessageLeave } from '@silenthill/agreement-web';
import { createLogger } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import ProcedureDefine from '../../../game/procedure/ProcedureDefine';
import ProcedureManager from '../../../game/procedure/ProcedureManager';
import TexasVideoMediaHelper from './TexasVideoMediaHelper';

const _glog = createLogger('ServerMessageLeave');

// Leave 1010
export function Leave(data: ServerMessageLeave.AsObject, roomID: number, matchID: number) {
    if (data.status != 0) {
        _glog.error('active Leave error', data.status);
    }
    // 视频房间：离房前清理 Agora 频道
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    TexasVideoMediaHelper.clearAllMediaStates(roomData);
    ProcedureManager.StartProcedure(ProcedureDefine.Return);
}
