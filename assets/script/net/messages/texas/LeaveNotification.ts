import { createLogger } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { GamePlaySubType } from '../../../game/constant/Constants';
import ProcedureDefine from '../../../game/procedure/ProcedureDefine';
import ProcedureManager from '../../../game/procedure/ProcedureManager';
import { ProcedureReturnNavigateParam } from '../../../game/procedure/ProcedureReturn';
import { Def } from '../../../protobuf/holdem/define_pb';
import { ServerMessageLeaveNotification } from '../../../protobuf/holdem/recv_th_leave_notification_pb';

const _glog = createLogger('[LeaveNotification]');

// LeaveNotification 1114
export function LeaveNotification(data: ServerMessageLeaveNotification.AsObject, roomID: number, matchID: number) {
    roomDataManager.clearInternalLeave(roomID, matchID);
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    _glog.debug('leave', data.reason);
    switch (data.reason) {
        case Def.LeaveReason.LR_ACTIVE: // 主动退出
            break;
        case Def.LeaveReason.LR_GAME_END: // 游戏结束
            {
                if (!roomData.basicInfo.isMtt) {
                    const gamePlaySubType = roomData.basicInfo.hasSquid
                        ? GamePlaySubType.SQUID
                        : roomData.basicInfo.hasMushroom
                          ? GamePlaySubType.MUSH
                          : GamePlaySubType.NONE;
                    const param: ProcedureReturnNavigateParam = {
                        routeData: {
                            path: '/tableGameEnd',
                            query: {
                                gamePlaySubType,
                                roomId: roomID,
                                from: 'cocos',
                                reason: data.reason,
                                roomName: roomData.basicInfo.roomName,
                                gameType: roomData.basicInfo.gameType,
                                betType: roomData.basicInfo.betType,
                                pokerType: roomData.basicInfo.pokerType
                            },
                            replace: false,
                            ensureVisible: true
                        }
                    };
                    _glog.info('[game-end] queue h5 navigate after exit cleanup', param);
                    ProcedureManager.StartProcedure(ProcedureDefine.Return, param);
                    break;
                }
                ProcedureManager.StartProcedure(ProcedureDefine.Return);
            }
            break;
        // case Def.LeaveReason.LR_AUTO_EXCEED_MAX_TIMES: // 超过最大自动操作次数限制
        //     break;
        // case Def.LeaveReason.LR_FORCE: // 强制退出
        //     break;
        // case Def.LeaveReason.LR_OFFLINE: // 离线
        //     break;
        default:
            ProcedureManager.StartProcedure(ProcedureDefine.Return);
    }
    //UIComponent.Instance.Toast(i18nMgr.Get(`LeaveReason${data.reason}`));
}
