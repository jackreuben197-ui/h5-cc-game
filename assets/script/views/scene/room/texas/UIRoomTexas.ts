import { autoBindEvents, bindEvent, unBindEventsAll } from '../../../../core/decorator/DataBind';
import roomDataManager from '../../../../data/room/RoomDataManager';
import { OperatorMine, OpertionType } from '../../../../data/room/texas/model/Operator';
import TexasGameRoomData from '../../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataPlayerMine from '../../../../data/room/texas/TexasGameRoomDataPlayerMine';
import UIComponentBase from '../../../base/UIComponentBase';
import Operation from './Operation';
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
    @property({ type: cc.Node, displayName: '操作面板' })
    private opPannelNode: cc.Node = null!;
    private _opPannel: Operation = null!;
    private _sideMenuTexasMenu: UITexasMenu = null;
    private _onSideMenuClicked: () => void = null!;
    private _mine: TexasGameRoomDataPlayerMine = null;

    protected onLoad(): void {
        this._onSideMenuClicked = () => {
            this._sideMenuTexasMenu.fadeIn(true);
        };
        this.sideMenu.node.on('click', this._onSideMenuClicked, this);
        this._sideMenuTexasMenu = this.sideMenuNode.getComponent(UITexasMenu);
        this._opPannel = this.opPannelNode.children[0].getComponent(Operation);
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

    protected onEnable(): void {
        this._bindEventsAndRefresh();
    }

    protected onDisable(): void {
        unBindEventsAll(this);
    }

    /**
     * 托管全自动事件激活绑定
     */
    private _bindEventsAndRefresh() {
        // 统一激活绑定，注入强类型 tag 推导过滤机制
        if (!this._mine) return;
        autoBindEvents(this, { mine: this._mine });
    }

    @bindEvent(TexasGameRoomDataPlayerMine.PREPARE_OPERATION_MINE, 'mine')
    private onPrepareActionMine(oper: OperatorMine) {
        if (!oper) {
            this.opPannelNode.active = false;
            this._opPannel.node.stopAllActions();
            return;
        }
        switch(oper.opType) {
        case OpertionType.INSURANCE:
            this.tracelog.warn('NOT SUPPORTED inusurance op')
            break;
        case OpertionType.AGREESECPUB:
            this.tracelog.warn('NOT SUPPORTED agrees secp op')
            break;
        default:
            this.opPannelNode.active = true;
            this._opPannel.startOperation(oper, this._mine);
        } 
    }
}
