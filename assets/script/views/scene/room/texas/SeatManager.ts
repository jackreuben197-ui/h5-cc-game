import { autoBindEvents, bindData, bindEvent } from '../../../../core/decorator/DataBind';
import { traceClass, traceMethod } from '../../../../core/decorator/LogTrace';
import roomDataManager from '../../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataSeatsStateManager from '../../../../data/room/texas/TexasGameRoomDataSeatsStateManager';
import { AnimateDisplayTypeButton } from '../../../../game/constant/AnimateDisplayType';
import SeatPlayer from './SeatPlayer';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('CrazyPoker/Room/Texas/SeatManager')
@traceClass()
@bindData()
export default class SeatManager extends cc.Component {
    @property(cc.Prefab)
    private seatPrefab: cc.Prefab = null;
    @property({ type: cc.Node, tooltip: '发牌的起始节点' })
    private dealNode: cc.Node = null;
    @property({ type: cc.Node, tooltip: '底池的起始节点' })
    private potNot: cc.Node = null;
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

    public onLoad() {
        // 如果绑定点击写这里
    }

    public onEnable(): void {
        if (!this._seatManager) return;
        this._bindEventsAndRefresh();
    }

    public onDisable(): void {
        if (this._seatManager) {
            this._seatManager.targetOff(this);
            this._seatManager = null;
        }
    }

    private _bindEventsAndRefresh() {
        autoBindEvents(this, { seats: this._seatManager });
    }

    @bindEvent(TexasGameRoomDataSeatsStateManager.BUTTON_CHANGE, 'seats')
    private onUpdateButton(prevSeat: number, currentSeat: number, bat: AnimateDisplayTypeButton) {
        if (bat == AnimateDisplayTypeButton.Static) {
            if (prevSeat > 0) {
                const ps = this._seatNodesMap.get(prevSeat);
                ps.animateButtonChange(false);
            }
            if (currentSeat > 0) {
                const cps = this._seatNodesMap.get(currentSeat);
                this.tracelog.debug(cps);
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
            this.tracelog.debug(cps);
            cps.animateButtonChange(true);
        }
    }

    // onUpdateSeats 座位数调整, 这个优先度必须提前要创建座位的Node
    @bindEvent(TexasGameRoomDataSeatsStateManager.SEATS_CHANGE, { dataSource: 'seats', initPriority: 10 })
    @traceMethod()
    private onUpdateSeats(count: number) {
        this._seatNodesMap.clear();
        if (this._seatNodes.length != count) {
            for (let i = 0; i < count; i++) {
                let nd = cc.instantiate(this.seatPrefab);
                nd.parent = this.node;
                this._seatNodes.push(nd);
                this._seatNodesMap.set(i + 1, nd.getComponent(SeatPlayer));
            }
        }
        this._seatNodesMap.forEach((comp, seatNo) => {
            const seatData = this._seatManager.getSeatPlayer(seatNo);
            comp.initData(seatData, this.potNot, this.dealNode);
        });
    }
}
