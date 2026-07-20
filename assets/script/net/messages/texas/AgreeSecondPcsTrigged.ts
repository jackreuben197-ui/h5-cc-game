import { ServerMessageAgreeSecondPcsTrigged } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';

// AgreeSecondPcsTrigged 1122
export function AgreeSecondPcsTrigged(data: ServerMessageAgreeSecondPcsTrigged.AsObject, roomID: number, matchID: number): void {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    const operator = data.operatorList.find(item => item.seatId == roomData.mine.seatNo && item.isAgreeSecondPc);
    if (!operator) return;
    const participantSeatIds = data.operatorList.filter(item => item.isAgreeSecondPc).map(item => item.seatId);
    const deadline = operator.opDeadline > 0 ? operator.opDeadline : Date.now() / 1000 + operator.leftOpTime;
    roomData.secondPcs.start(participantSeatIds, deadline);
}
