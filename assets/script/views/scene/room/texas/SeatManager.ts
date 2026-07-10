import { autoBindEvents, bindData, bindEvent, unBindEventsAll } from '../../../../core/decorator/DataBind';
import { traceClass, traceMethod } from '../../../../core/decorator/LogTrace';
import roomDataManager from '../../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataSeatsStateManager from '../../../../data/room/texas/TexasGameRoomDataSeatsStateManager';
import ccviewData, { CCViewData } from '../../../../data/system/CCViewData';
import { AnimateDisplayTypeButton } from '../../../../game/constant/AnimateDisplayType';
import { MicrophoneIconState } from '../../../../game/constant/MicrophoneIconState';
import Operation from './Operation';
import SeatPlayer from './SeatPlayer';
import seatPostionCaculator, { SeatPosition } from './widget/SeatPositionCaculator';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('Scene/Room/Texas/SeatManager')
@traceClass()
@bindData()
export default class SeatManager extends cc.Component {
    @property(cc.Prefab)
    private seatPrefab: cc.Prefab = null;
    @property({ type: cc.Node, tooltip: '发牌的起始节点' })
    private dealNode: cc.Node = null;
    @property({ type: cc.Node, tooltip: '底池的起始节点' })
    private potNot: cc.Node = null;
    @property({ type: cc.Node, displayName: '操作面板' })
    private opPannelNode: cc.Node = null!;
    private _opPannel: Operation = null!;
    private _seatManager: TexasGameRoomDataSeatsStateManager;
    private _seatNodes: cc.Node[] = [];
    private _seatNodesMap: Map<number, SeatPlayer> = new Map();

    public initData(roomID: number, matchID: number) {
        const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
        this._seatManager = roomData.seatsStateManager;
        if (this.node.activeInHierarchy) {
            this._bindEventsAndRefresh();
        }
    }

    @bindEvent(CCViewData.FRAME_SIZE_UPDATE, { dataSource: 'ccviewData', initPriority: 20 })
    @traceMethod({ level: 'debug' })
    protected onFrameResize(
        visibleSizeWidth: number,
        visibleSizeHeight: number,
        frameSizeWidth: number,
        frameSizeHeight: number,
        suggestScale: number,
        saveAreaTop: number
    ) {
        this.tracelog.debug(visibleSizeWidth, suggestScale, saveAreaTop);
        const menuHeight = 210 * suggestScale;
        seatPostionCaculator.initWithContainer(visibleSizeWidth, visibleSizeHeight - menuHeight - saveAreaTop - 20 * suggestScale, -saveAreaTop);
        this.node.setPosition(cc.v3(0, 200));
    }

    public onLoad() {
        // 如果绑定点击写这里
        this._opPannel = this.opPannelNode.children[0].getComponent(Operation);
    }

    public onEnable(): void {
        if (!this._seatManager) return;
        this._bindEventsAndRefresh();
    }

    public onDisable(): void {
        unBindEventsAll(this);
    }

    private _bindEventsAndRefresh() {
        autoBindEvents(this, { seats: this._seatManager, ccviewData: ccviewData });
    }

    @bindEvent(TexasGameRoomDataSeatsStateManager.MUSHROOM_POOL_CHANGE, 'seats')
    @traceMethod()
    private onUpdateMushroomPool(prevSeat: number, currentSeat: number, cnt: number, pool: number, bat: AnimateDisplayTypeButton) {
        this._seatNodesMap.forEach(v => {
            v.animateMushroomChange(false, 0, 0);
        });
        if (bat == AnimateDisplayTypeButton.Static) {
            if (prevSeat > 0) {
                const ps = this._seatNodesMap.get(prevSeat);
                ps.animateMushroomChange(false, 0, 0);
            }
            if (currentSeat > 0) {
                const cps = this._seatNodesMap.get(currentSeat);
                this.tracelog.debug(currentSeat, cps, this._seatNodesMap.size);
                cps.animateMushroomChange(true, cnt, pool);
            }
            return;
        }
        if (prevSeat > 0) {
            const ps = this._seatNodesMap.get(prevSeat);
            ps.animateMushroomChange(false, 0, 0);
            if (currentSeat > 0) {
                const cps = this._seatNodesMap.get(currentSeat);
                cps.animateMushroomChange(true, cnt, pool, ps.mushroomNode);
            }
            return;
        }
        if (currentSeat > 0) {
            const cps = this._seatNodesMap.get(currentSeat);
            this.tracelog.debug(currentSeat, cps, this._seatNodesMap.size);
            cps.animateMushroomChange(true, cnt, pool);
        }
    }

    @bindEvent(TexasGameRoomDataSeatsStateManager.SPEAKING_CHANGE, 'seats')
    private onUpdateSpeaking(prevSeat: number, currentSeat: number) {
        if (prevSeat > 0) {
            const ps = this._seatNodesMap.get(prevSeat);
            ps.setMicrophoneIconState(MicrophoneIconState.HIDDEN, false);
        }
        if (currentSeat > 0) {
            const ps = this._seatNodesMap.get(currentSeat);
            ps.setMicrophoneIconState(MicrophoneIconState.SPEAKING, false);
        }
        // 初始化
        if (currentSeat == 0 && prevSeat == 0) {
            this._seatNodesMap.forEach(v => {
                v.setMicrophoneIconState(MicrophoneIconState.HIDDEN, false);
            });
        }
    }

    @bindEvent(TexasGameRoomDataSeatsStateManager.BUTTON_CHANGE, 'seats')
    private onUpdateButton(prevSeat: number, currentSeat: number, bat: AnimateDisplayTypeButton) {
        this._seatNodesMap.forEach(v => {
            v.animateButtonChange(false);
        });
        if (bat == AnimateDisplayTypeButton.Static) {
            if (prevSeat > 0) {
                const ps = this._seatNodesMap.get(prevSeat);
                ps.animateButtonChange(false);
            }
            if (currentSeat > 0) {
                const cps = this._seatNodesMap.get(currentSeat);
                this.tracelog.debug(currentSeat, cps, this._seatNodesMap.size);
                cps.animateButtonChange(true);
            }
            return;
        }
        if (prevSeat > 0) {
            const ps = this._seatNodesMap.get(prevSeat);
            ps.animateButtonChange(false);
            if (currentSeat > 0) {
                const cps = this._seatNodesMap.get(currentSeat);
                cps.animateButtonChange(true, ps.buttonIcon);
            }
            return;
        }
        if (currentSeat > 0) {
            const cps = this._seatNodesMap.get(currentSeat);
            this.tracelog.debug(currentSeat, cps, this._seatNodesMap.size);
            cps.animateButtonChange(true);
        }
    }

    // onUpdateSeats 座位数调整, 这个优先度必须提前要创建座位的Node
    @bindEvent(TexasGameRoomDataSeatsStateManager.SEATS_CHANGE, { dataSource: 'seats', initPriority: 10 })
    @traceMethod()
    private onUpdateSeats(count: number) {
        seatPostionCaculator.arrageSeatPositions(count);
        const pos = seatPostionCaculator.getPosition(SeatPosition.BottomMiddle);
        this._opPannel.adjustPostion(this.node, pos.position, pos.scale);
        if (this._seatNodes.length < count) {
            for (let i = this._seatNodes.length; i < count; i++) {
                let nd = cc.instantiate(this.seatPrefab);
                nd.parent = this.node;
                this._seatNodes.push(nd);
                const comp = nd.getComponent(SeatPlayer);
                this._seatNodesMap.set(i + 1, comp);
            }
        }
        const cl = this._seatNodes.length;
        for (let i = 0; i < cl; i++) {
            let node = this._seatNodes[i];
            node.active = false;
            if (i < count) {
                const seatData = this._seatManager.getSeatPlayer(i + 1);
                let comp = this._seatNodesMap.get(i + 1);
                comp.initData(seatData, this.potNot, this.dealNode);
                node.active = true;
            }
        }
    }
}
