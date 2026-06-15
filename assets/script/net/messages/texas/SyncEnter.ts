import { ServerMessageSyncEnter } from '@silenthill/agreement-web';
import { createLogger } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { applyRoomSnapshot } from './EnterRoom';

const _plog = createLogger('ServerMessageSyncEnter');

// SyncEnter 1025 —— 拉取房间最新快照
// 用途：断线重连 / 未来"每 N 手主动同步"等场景。该 handler 仅负责数据写入，
// 不感知调用者的状态机；完成后由 applyRoomSnapshot 内部 emit 'SNAPSHOT_APPLIED' 通知订阅方。
export function SyncEnter(data: ServerMessageSyncEnter.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (!roomData) {
        _plog.error('no store room data', roomID, matchID);
        return;
    }
    applyRoomSnapshot(roomData, data);
}
