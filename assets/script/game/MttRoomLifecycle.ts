import { ClientMessageEnterRoom, Code, Def, ServerMessageEnterRoom } from '@silenthill/agreement-web';
import { createLogger } from '../core/decorator/LogTrace';
import roomDataManager from '../data/room/RoomDataManager';
import TexasGameRoomData from '../data/room/texas/TexasGameRoomData';
import h5MessageManager, { PanelEventPayload } from '../H5MsgMgr';
import { CPErrorCode } from '../i18n/CPErrorCode';
import { i18nMgr } from '../i18n/i18nMgr';
import ProtocolAgency from '../net/websocket/ProtocolAgency';
import viewManager from '../views/UIViewManager';
import { MTT_MATCH_ENTRY_ROOM_ID } from './constant/Constants';
import ProcedureDefine from './procedure/ProcedureDefine';
import ProcedureManager from './procedure/ProcedureManager';
import roomReconnectManager from './RoomReconnectManager';

const _plog = createLogger('MttRoomLifecycle');

const MTT_SETTLEMENT_PANEL = 'mttSettlement';

const PANEL_RETURN_EVENTS = ['returnLobby', 'confirm', 'done', 'close'];

const FULL_MTT_BRING_IN = 0;

const OBSERVED_ROOM_DISSOLVED_TIP_SECONDS = 2;

class MttRoomLifecycle {
    private _panelRequestId: string = '';
    private _settlementRoomData: TexasGameRoomData = null;
    private _observerRoomData: TexasGameRoomData = null;
    private _observerEnterSent: boolean = false;
    private _settlementProps: Record<string, unknown> = null;
    private _canContinueWatching: boolean = false;
    private _watchingPending: boolean = false;
    private _listening: boolean = false;

    public async showSettlement(roomData: TexasGameRoomData, rebuy: boolean): Promise<void> {
        if (this._settlementRoomData === roomData || roomData.mtt.eliminatedObserver) return;
        this._ensureListening();
        this._settlementRoomData = roomData;
        // 观战快照可能不带本人重购信息，结算继续使用淘汰时的快照。
        this._settlementProps = {
            matchId: roomData.matchID,
            matchName: roomData.mtt.matchName || roomData.basicInfo.roomName,
            startTime: roomData.mtt.startTime,
            isRebuy: rebuy,
            currentBlindLevel: roomData.mtt.blindLevel,
            maxRebuyBlindLevel: roomData.mtt.maxRebuyBlindLevel,
            remainRebuyTimes: roomData.mtt.remainRebuyTimes,
            clubId: roomData.basicInfo.clubID,
            inTable: true
        };
        this._canContinueWatching = false;
        this._watchingPending = !roomData.closed;
        roomReconnectManager.clearContext(roomData.roomID, roomData.matchID);
        const player = roomData.mine.player;
        if (player) {
            player.setSeated(false, roomData.mine);
            player.clearData();
        }
        roomData.mine.clearData();
        roomData.mine.clearVideoAndAudio().catch(error => _plog.error('淘汰后清理音视频失败', error));
        if (!roomData.closed) {
            roomData.mtt.observer = true;
            roomData.mtt.eliminatedObserver = true;
            this._observerRoomData = roomData;
            this._observerEnterSent = false;
        }
        roomData.mtt.refresh();
        this._showSettlementPanel();
        if (roomData.closed) return;
        // LR_NOCHIP 离桌通知表示服务端已移除原订阅，直接向原桌重新申请观战。
        try {
            // 保留当前场景，用原桌 roomID 重新订阅观战，不走 roomID=0 的参赛分桌入口。
            const responsePromise = ProtocolAgency.waitForMessage<ServerMessageEnterRoom.AsObject>(
                Code.MSG_D_ENTER_ROOM,
                (data, roomID, matchID) => roomID == roomData.roomID && matchID == roomData.matchID && (data.status != 0 || !data.myInfo?.seatId)
            );
            this._observerEnterSent = true;
            ProtocolAgency.Send({
                code: Code.MSG_D_ENTER_ROOM,
                roomID: roomData.roomID,
                matchID: roomData.matchID,
                body: {
                    room: { roomId: roomData.roomID, matchId: roomData.matchID },
                    gps: { longitude: '', latitude: '' },
                    mttPartialBringIn: FULL_MTT_BRING_IN,
                    observer: true,
                    wantSeat: Def.WantSeatType.WST_NO
                }
            });
            const response = await responsePromise;
            if (!this._isActiveObserver(roomData)) return;
            if (response.body.status != 0) {
                viewManager.showToast(CPErrorCode.ServerErrorDescription(response.body.status));
                this.stopWatching(roomData);
                return;
            }
            this._watchingPending = false;
            this._canContinueWatching = true;
            this._showSettlementPanel();
        } catch (error) {
            if (!this._isActiveObserver(roomData)) return;
            _plog.error('MTT 淘汰后进入原桌观战失败', roomData.roomID, roomData.matchID, error);
            viewManager.showToast(i18nMgr.Get('error999'));
            this.stopWatching(roomData);
        }
    }

    private _showSettlementPanel(): void {
        if (!this._settlementRoomData) return;
        this._panelRequestId = h5MessageManager.sendToH5('showPanel', 1, {
            panelType: MTT_SETTLEMENT_PANEL,
            props: {
                ...this._settlementProps,
                canContinueWatching: this._canContinueWatching,
                watchingPending: this._watchingPending
            },
            closeOnClickOverlay: false,
            ensureVisible: false,
            showH5Bg: false
        });
    }

    public stopWatching(roomData: TexasGameRoomData): void {
        roomData.closed = true;
        roomReconnectManager.clearContext(roomData.roomID, roomData.matchID);
        if (this._settlementRoomData === roomData) {
            // 尚未读完结算时保留弹窗，但不再允许进入已经失效的观战桌。
            this._canContinueWatching = false;
            this._watchingPending = false;
            this._showSettlementPanel();
            return;
        }
        this.returnToLobby();
    }

    public observedRoomDissolved(roomData: TexasGameRoomData): void {
        if (roomData.closed || !this._isCurrentRoom(roomData)) return;
        roomData.closed = true;
        roomReconnectManager.clearContext(roomData.roomID, roomData.matchID);
        if (this._observerRoomData === roomData) {
            // 服务端已经移除观战订阅，离开这个已解散的房间无需再发主动 Leave。
            this._observerEnterSent = false;
        }
        if (this._settlementRoomData === roomData) {
            // 结算仍打开时先关闭 H5 遮罩，让牌桌上的提示可见。
            h5MessageManager.sendToH5('closePanel', 1, { requestId: this._panelRequestId, panelType: MTT_SETTLEMENT_PANEL });
            this._clearPanelState();
        }
        viewManager.showToast(i18nMgr.Get('UIMTT_ObservedRoomDissolved'), { stayDuration: OBSERVED_ROOM_DISSOLVED_TIP_SECONDS }, () => {
            // 提示期间可能已主动离开或进入其他牌桌，不能覆盖新的导航。
            if (!this._isCurrentRoom(roomData)) return;
            ProcedureManager.StartProcedure(ProcedureDefine.Return, {
                routeData: { name: 'mtt-list', replace: true, ensureVisible: true }
            });
        });
    }

    public returnToLobby(): void {
        ProcedureManager.StartProcedure(ProcedureDefine.Return, {
            routeData: { name: 'lobby', replace: true, ensureVisible: true }
        });
    }

    public openRegistration(roomData: TexasGameRoomData): void {
        ProcedureManager.StartProcedure(ProcedureDefine.Return, {
            routeData: { name: 'mtt-detail', query: { id: String(roomData.matchID) }, replace: true, ensureVisible: true }
        });
    }

    public reset(): void {
        const roomData = this._observerRoomData;
        // 玩家主动离开观战时，清理已经发起的观战订阅。
        if (roomData && this._observerEnterSent) {
            this._sendObserverLeave(roomData);
        }
        if (this._panelRequestId) {
            h5MessageManager.sendToH5('closePanel', 1, { requestId: this._panelRequestId, panelType: MTT_SETTLEMENT_PANEL });
        }
        this._observerRoomData = null;
        this._observerEnterSent = false;
        this._clearPanelState();
    }

    private _sendObserverLeave(roomData: TexasGameRoomData): void {
        roomDataManager.markSilentLeave(roomData.roomID, roomData.matchID);
        ProtocolAgency.Send({
            code: Code.MSG_D_LEAVE,
            roomID: roomData.roomID,
            matchID: roomData.matchID,
            body: { room: { roomId: roomData.roomID, matchId: roomData.matchID } }
        });
    }

    private _isActiveObserver(roomData: TexasGameRoomData): boolean {
        return this._observerRoomData === roomData && !roomData.closed && this._isCurrentRoom(roomData);
    }

    private _isCurrentRoom(roomData: TexasGameRoomData): boolean {
        return roomDataManager.existRoomData(roomData.roomID, roomData.matchID) && roomDataManager.getRoomData(roomData.roomID, roomData.matchID) === roomData;
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
        if (roomData.mtt.observer) {
            this.observedRoomDissolved(roomData);
            return;
        }
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
        if (payload.event == 'continueWatching') {
            if (!this._canContinueWatching || !this._isActiveObserver(this._settlementRoomData)) return;
            this._clearPanelState();
            h5MessageManager.sendToH5('h5Hide', 1);
            return;
        }
        if (payload.event == 'rebuy') {
            this.openRegistration(this._settlementRoomData);
            return;
        }
        if (PANEL_RETURN_EVENTS.indexOf(payload.event) >= 0) {
            this.returnToLobby();
        }
    }

    private _clearPanelState(): void {
        this._panelRequestId = '';
        this._settlementRoomData = null;
        this._settlementProps = null;
        this._canContinueWatching = false;
        this._watchingPending = false;
    }
}

const mttRoomLifecycle = new MttRoomLifecycle();

export default mttRoomLifecycle;
