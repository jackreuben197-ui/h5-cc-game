import UIComponentBase from '../../../base/UIComponentBase';
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
    }
}
