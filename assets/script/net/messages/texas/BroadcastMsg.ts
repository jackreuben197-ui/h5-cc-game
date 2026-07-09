import { ServerMessageBroadcastMsg } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';

// BroadcastMsg 1019：本人广播发送结果确认（聊天成功后把 pending 消息落进聊天记录）
export function BroadcastMsg(data: ServerMessageBroadcastMsg.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (!roomData) return;
    roomData.chat.confirmPendingMessage(data.status);
}
