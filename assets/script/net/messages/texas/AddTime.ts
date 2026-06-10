import { ServerMessageAddTime } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import { OpertionType, OperatorTimeUpdate, updateOperatorAfterAddTime } from '../../../data/room/texas/model/Operator';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataPlayer from '../../../data/room/texas/TexasGameRoomDataPlayer';
import { CPErrorCode } from '../../../i18n/CPErrorCode';
import viewManager from '../../../views/UIViewManager';

export function updateSeatOperatorAfterAddTime(seatPlayer: TexasGameRoomDataPlayer, payload: OperatorTimeUpdate): void {
    if (!seatPlayer?.operator) return;
    seatPlayer.operator = updateOperatorAfterAddTime(seatPlayer.operator, payload);
}

// AddTime 1014
export function AddTime(data: ServerMessageAddTime.AsObject, roomID: number, matchID: number) {
    if (!data) return;
    if (data.status !== 0) {
        viewManager.showToast(CPErrorCode.ServerErrorDescription(data.status));
        return;
    }
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (!roomData?.mine?.player) return;
    const payload: OperatorTimeUpdate = {
        duration: data.duration,
        times: data.times,
        deadline: data.deadline
    };
    updateSeatOperatorAfterAddTime(roomData.mine.player, payload);
    if (roomData.mine.operator && roomData.mine.operator.opType !== OpertionType.INSURANCE) {
        roomData.mine.operator = updateOperatorAfterAddTime(roomData.mine.operator, payload);
    }
}
