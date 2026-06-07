import { createLogger } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import { Operator, OperatorMine } from '../../../data/room/texas/model/Operator';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { ServerMessageInsuranceTrigged } from '../../../protobuf/holdem/recv_th_insurance_trigged_pb';

const _glog = createLogger('ServerMessageInsuranceTrigged');

// InsuranceTrigged 1115
export function InsuranceTrigged(data: ServerMessageInsuranceTrigged.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (!roomData) return;
    _glog.debug('insurance trigged round=', data.round, 'operators=', data.operatorList.length);
    data.operatorList.forEach(operator => {
        const seatData = roomData.seatsStateManager.getSeatPlayer(operator.seatId);
        if (!seatData) return;
        if (seatData.mine) {
            const op = new OperatorMine();
            op.opType = 2;
            op.leftOpDuration = operator.leftOpTime;
            op.deadlineTImestamp = operator.opDeadline;
            op.alreadyDelayTImes = operator.delayTimes;
            op.totalOpDuration = roomData.basicInfo.insuranceOpduration;
            op.insurancePotLimitList = operator.insuranceLimitList;
            // 服务端在 operator 内 / 顶层 invalidPotsList 都可能下发无法投保的池
            op.insurancePotInvalidList =
                operator.invalidInsurancePotsList && operator.invalidInsurancePotsList.length > 0 ? operator.invalidInsurancePotsList : data.invalidPotsList;
            op.playerCardsList = operator.playerCardsList;
            op.round = data.round;
            seatData.mine.operator = op;
        } else {
            const op = new Operator();
            op.opType = 2;
            op.leftOpDuration = operator.leftOpTime;
            op.deadlineTImestamp = operator.opDeadline;
            op.alreadyDelayTImes = operator.delayTimes;
            op.totalOpDuration = roomData.basicInfo.insuranceOpduration;
            seatData.operator = op;
        }
    });
}
