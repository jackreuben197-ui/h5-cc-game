import { Def, ServerMessageLeaveNotification } from '@silenthill/agreement-web';
import { createLogger } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { GamePlaySubType } from '../../../game/constant/Constants';
import ProcedureDefine from '../../../game/procedure/ProcedureDefine';
import ProcedureManager from '../../../game/procedure/ProcedureManager';
import { ProcedureReturnNavigateParam } from '../../../game/procedure/ProcedureReturn';
import { i18nMgr } from '../../../i18n/i18nMgr';
import viewManager from '../../../views/UIViewManager';
import TexasVideoMediaHelper from './TexasVideoMediaHelper';

const _glog = createLogger('LeaveNotification', 'debug');

// LeaveNotification 1114
export function LeaveNotification(data: ServerMessageLeaveNotification.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    roomDataManager.clearInternalLeave(roomID, matchID);
    if (roomData) {
        TexasVideoMediaHelper.clearAllMediaStates(roomData);
    } else {
        _glog.debug('leave', data.reason, roomData);
        return;
    }
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
                // MTT 正常结束交给 H5 结算面板展示最终结果。
                roomData.mtt.requestSettlement(false);
            }
            break;
        case Def.LeaveReason.LR_NOCHIP:
            // 淘汰后根据存储筹码和重购资格决定重新进桌或展示结算。
            roomData.mtt.updateLeaveState(data.storeChips, data.rebuyTimes);
            if (data.storeChips > 0) {
                roomData.mtt.requestReenter();
                break;
            }
            roomData.mtt.requestSettlement(roomData.mtt.canRebuy(data.accountChips));
            break;
        case Def.LeaveReason.LR_EXCHANGE:
            // 服务端随后通过 101 通知真实目标 roomID。
            roomData.mtt.setTableTransferWaiting(true);
            break;
        case Def.LeaveReason.LR_AUTO_EXCEED_MAX_TIMES: // 超过最大自动操作次数限制
        case Def.LeaveReason.LR_FORCE: // 强制退出
        case Def.LeaveReason.LR_OFFLINE: // 离线
        default:
            viewManager.showToast(i18nMgr.Get(`LeaveReason${data.reason}`), undefined, () => {
                ProcedureManager.StartProcedure(ProcedureDefine.Return);
            });
            break;
    }
}
