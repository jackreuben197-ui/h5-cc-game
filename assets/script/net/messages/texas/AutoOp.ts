import { ServerMessageAutoOp } from '@silenthill/agreement-web';
import { createLogger } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';

const _plog = createLogger('ServerMessageAutoOp');

// AutoOp 1109
export function AutoOp(data: ServerMessageAutoOp.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (!roomData) {
        _plog.error('托管状态推送没有对应的牌桌数据', roomID, matchID, data);
        return;
    }
    const player = roomData.seatsStateManager.getSeatPlayer(data.seatId);
    if (player) {
        // 服务端托管状态写入座位数据，驱动头像和取消托管按钮。
        player.isAuto = data.enable;
        roomData.mtt.refresh();
    } else {
        _plog.error('托管状态推送的座位不存在', roomID, matchID, data.seatId);
    }
}
