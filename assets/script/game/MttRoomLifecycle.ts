import { ClientMessageEnterRoom, Code, Def, ServerMessageEnterRoom } from '@silenthill/agreement-web';
import { createLogger } from '../core/decorator/LogTrace';
import roomDataManager from '../data/room/RoomDataManager';
import TexasGameRoomData from '../data/room/texas/TexasGameRoomData';
import h5MessageManager, { PanelEventPayload } from '../H5MsgMgr';
import { CPErrorCode } from '../i18n/CPErrorCode';
import ProtocolAgency from '../net/websocket/ProtocolAgency';
import viewManager from '../views/UIViewManager';
import { MTT_MATCH_ENTRY_ROOM_ID } from './constant/Constants';
import ProcedureDefine from './procedure/ProcedureDefine';
import ProcedureManager from './procedure/ProcedureManager';
import roomReconnectManager from './RoomReconnectManager';

const _plog = createLogger('MttRoomLifecycle');

const MTT_SETTLEMENT_PANEL = 'mttSettlement';

// 淘汰弹窗只负责把玩家送回 H5；真正的重购由赛事详情页完成。
const PANEL_RETURN_EVENTS = ['rebuy', 'confirm', 'done', 'close'];

const FULL_MTT_BRING_IN = 0;

class MttRoomLifecycle {
    private _panelRequestId: string = '';
    private _settlementRoomData: TexasGameRoomData = null;
    private _listening: boolean = false;

    public async showSettlement(roomData: TexasGameRoomData, rebuy: boolean): Promise<void> {
        // 先保存面板需要的快照；Return 会清理 RoomData 和当前牌桌场景。
        const panelProps = {
            matchId: roomData.matchID,
            matchName: roomData.mtt.matchName || roomData.basicInfo.roomName,
            startTime: roomData.mtt.startTime,
            isRebuy: rebuy,
            currentBlindLevel: roomData.mtt.blindLevel,
            maxRebuyBlindLevel: roomData.mtt.maxRebuyBlindLevel,
            remainRebuyTimes: roomData.mtt.remainRebuyTimes,
            clubId: roomData.basicInfo.clubID
        };
        this._ensureListening();
        this._settlementRoomData = roomData;
        // 不能只依赖 H5 DOM 覆盖牌桌：先完成 Cocos 场景退出，再展示结算面板。
        try {
            await ProcedureManager.StartProcedure(ProcedureDefine.Return);
        } catch (error) {
            // 即使场景清理出现异常，也必须让玩家看到结算面板，不能继续卡在牌桌。
            _plog.error('MTT 结算前退出牌桌失败', panelProps.matchId, error);
        }
        this._panelRequestId = h5MessageManager.sendToH5('showPanel', 1, {
            panelType: MTT_SETTLEMENT_PANEL,
            props: panelProps,
            closeOnClickOverlay: false,
            ensureVisible: true,
            showH5Bg: true
        });
    }

    public reenter(roomData: TexasGameRoomData): void {
        // 重购成功后以比赛维度重新申请服务端分配的牌桌。
        const param = {
            roomID: MTT_MATCH_ENTRY_ROOM_ID,
            matchID: roomData.matchID,
            roomType: roomData.basicInfo.roomType,
            observer: roomData.mtt.observer
        };
        roomReconnectManager.clearContext(roomData.roomID, roomData.matchID);
        roomDataManager.deleteRoomData(roomData.roomID, roomData.matchID);
        h5MessageManager.sendToH5('h5Hide', 1);
        ProcedureManager.RestartEnterRoom(param);
    }

    public exchangeRoom(roomData: TexasGameRoomData, newRoomID: number): void {
        if (newRoomID <= 0) {
            _plog.error('换桌通知缺少有效 roomID', roomData.matchID, newRoomID);
            return;
        }
        if (!roomData.mtt.tableTransferWaiting) {
            _plog.error('未进入换桌状态却收到新牌桌通知', roomData.matchID, newRoomID);
            return;
        }
        const oldRoomID = roomData.roomID;
        // RoomData 会继续复用给新牌桌，迁移键之前先清掉旧桌本手，避免旧公牌和动画进入新桌。
        roomData.clearHandPresentation();
        // 先原子迁移 RoomData 和重连键，再向新牌桌发送 EnterRoom。
        const movedRoomData = roomDataManager.moveRoomData(oldRoomID, newRoomID, roomData.matchID);
        if (!movedRoomData) {
            _plog.error('换桌时未找到旧牌桌数据', oldRoomID, newRoomID, roomData.matchID);
            return;
        }
        roomReconnectManager.replaceContext(oldRoomID, newRoomID, roomData.matchID);
        ProcedureManager.RefreshEnterRoomID(roomData.matchID, newRoomID);
        const body: ClientMessageEnterRoom.AsObject = {
            room: { roomId: newRoomID, matchId: roomData.matchID },
            gps: { longitude: '', latitude: '' },
            mttPartialBringIn: FULL_MTT_BRING_IN,
            observer: roomData.mtt.observer,
            wantSeat: Def.WantSeatType.WST_NO
        };
        const responsePromise = ProtocolAgency.waitForMessage<ServerMessageEnterRoom.AsObject>(
            Code.MSG_D_ENTER_ROOM,
            (_data, roomID, matchID) => roomID == newRoomID && matchID == roomData.matchID
        );
        ProtocolAgency.Send({
            code: Code.MSG_D_ENTER_ROOM,
            roomID: newRoomID,
            matchID: roomData.matchID,
            body
        });
        responsePromise
            .then(response => {
                if (response.body.status != 0) {
                    _plog.error('进入换桌后的新牌桌失败', newRoomID, roomData.matchID, response.body.status);
                    viewManager.showToast(CPErrorCode.ServerErrorDescription(response.body.status));
                    return;
                }
                roomData.chat.resetHistory();
            })
            .catch(error => {
                // 保留新 roomID 和换桌状态，后续重连仍能按真实牌桌继续排查和恢复。
                _plog.error('等待新牌桌 EnterRoom 回包失败', newRoomID, roomData.matchID, error);
            });
    }

    private _ensureListening(): void {
        if (this._listening) return;
        this._listening = true;
        h5MessageManager.on('panelEvent', payload => {
            this._onPanelEvent(payload);
        });
    }

    private _onPanelEvent(payload: PanelEventPayload): void {
        if (!payload || payload.panelRequestId != this._panelRequestId || !this._settlementRoomData) return;
        if (PANEL_RETURN_EVENTS.indexOf(payload.event) >= 0) {
            // showSettlement 正常路径已经进入 Return；再次调用作为旧版本/异常时序的兜底。
            this._clearPanelState();
            ProcedureManager.StartProcedure(ProcedureDefine.Return);
        }
    }

    private _clearPanelState(): void {
        this._panelRequestId = '';
        this._settlementRoomData = null;
    }
}

const mttRoomLifecycle = new MttRoomLifecycle();

export default mttRoomLifecycle;
