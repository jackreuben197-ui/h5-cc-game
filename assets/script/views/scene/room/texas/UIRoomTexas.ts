import { autoBindEvents, bindEvent } from '../../../../core/decorator/DataBind';
import roomDataManager from '../../../../data/room/RoomDataManager';
import { OperatorMine } from '../../../../data/room/texas/model/Operator';
import TexasGameRoomData from '../../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataPlayerMine from '../../../../data/room/texas/TexasGameRoomDataPlayerMine';
import UIComponentBase from '../../../base/UIComponentBase';
import viewManager from '../../../UIViewManager';
import PotsInfo from './PotsInfo';
import PublicCardsInfo from './PublicCardsInfo';
import RoomInfo from './RoomInfo';
import SeatManager from './SeatManager';
import UITexasMenu from './UITexasMenu';

export interface UIRoomTexasEnterParam {
    roomID: number;
    matchID: number;
}

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('CrazyPoker/Room/Texas/UIRoomTexas')
export default class UIRoomTexas extends UIComponentBase<UIRoomTexasEnterParam> {
    @property(RoomInfo)
    private roomInfo: RoomInfo = null;
    @property(PotsInfo)
    private potsInfo: PotsInfo = null;
    @property(SeatManager)
    private seatManager: SeatManager = null;
    @property(PublicCardsInfo)
    private publicCardsInfo: PublicCardsInfo = null;
    @property(cc.Button)
    private sideMenu: cc.Button = null!;
    @property(cc.Node)
    private sideMenuNode: cc.Node = null;
    private _sideMenuTexasMenu: UITexasMenu = null;
    private _onSideMenuClicked: () => void = null!;
    private _mine: TexasGameRoomDataPlayerMine = null;
    private _insuranceOpen: boolean = false;

    protected onLoad(): void {
        this._onSideMenuClicked = () => {
            this._sideMenuTexasMenu.fadeIn(true);
        };
        this.sideMenu.node.on('click', this._onSideMenuClicked, this);
        this._sideMenuTexasMenu = this.sideMenuNode.getComponent(UITexasMenu);
    }

    initialize(param: UIRoomTexasEnterParam) {
        this.roomInfo.initData(param.roomID, param.matchID);
        this.potsInfo.initData(param.roomID, param.matchID);
        this.seatManager.initData(param.roomID, param.matchID);
        this.publicCardsInfo.initData(param.roomID, param.matchID);
        this._sideMenuTexasMenu.initData(param.roomID, param.matchID);
        const roomData = roomDataManager.getRoomData<TexasGameRoomData>(param.roomID, param.matchID);
        this._mine = roomData.mine;
        this._bindEventsAndRefresh();
    }

    private _bindEventsAndRefresh() {
        // 监听 mine 上"我"的操作分发：opType=2 → 保险面板; opType=3 → 二套牌(暂未实现)
        // autoBindEvents 内置重绑保护账本, 场景切回来再次 initialize 也不会泄漏。
        autoBindEvents(this, { mine: this._mine });
    }

    // 由 @bindEvent 装饰器登记, 运行时由 autoBindEvents 挂到 mine.on(PREPARE_OPERATION_MINE)。
    // IDE 的"查找引用"看不到调用点是正常现象 —— SeatPlayer / PotsInfo 等组件里所有 @bindEvent 回调都一样。
    @bindEvent(TexasGameRoomDataPlayerMine.PREPARE_OPERATION_MINE, 'mine')
    private onMineOperator(op: OperatorMine) {
        if (op && op.opType === 2) {
            if (this._insuranceOpen) return;
            this._insuranceOpen = true;
            viewManager.openDialog('Insurance', { player: this._mine });
            return;
        }
        if (this._insuranceOpen) {
            this._insuranceOpen = false;
            viewManager.closeDialog('Insurance');
        }
    }
}
