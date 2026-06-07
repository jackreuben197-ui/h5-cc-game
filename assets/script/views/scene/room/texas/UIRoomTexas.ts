import roomDataManager from '../../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataPlayerMine from '../../../../data/room/texas/TexasGameRoomDataPlayerMine';
import UIComponentBase from '../../../base/UIComponentBase';
import UIInsuranceNewPanel from '../../../dialog/insurance/UIInsuranceNewPanel';
import InsuranceOperation from './InsuranceOperation';
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
@menu('Scene/Room/Texas/UIRoomTexas')
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
    @property({ type: cc.Node, displayName: '操作面板' })
    private opPannelNode: cc.Node = null!;
    private _opPannel: Operation = null!;
    @property({ type: InsuranceOperation, displayName: '保险弹窗触发器' })
    private insuranceOperation: InsuranceOperation = null!;
    //数据绑定
    private _mine: TexasGameRoomDataPlayerMine = null;

    protected onLoad(): void {
        //菜单项
        this._onSideMenuClicked = () => {
            this._sideMenuTexasMenu.fadeIn(true);
        };
        this.sideMenu.node.on('click', this._onSideMenuClicked, this);
        this._sideMenuTexasMenu = this.sideMenuNode.getComponent(UITexasMenu);
        //操作面板
        this._opPannel = this.opPannelNode.children[0].getComponent(Operation);
    }

    initialize(param: UIRoomTexasEnterParam) {
        const roomData = roomDataManager.getRoomData<TexasGameRoomData>(param.roomID, param.matchID);
        this._mine = roomData.mine;
        this.roomInfo.initData(param.roomID, param.matchID);
        this.potsInfo.initData(param.roomID, param.matchID);
        this.seatManager.initData(param.roomID, param.matchID);
        this.publicCardsInfo.initData(param.roomID, param.matchID);
        this._sideMenuTexasMenu.initData(param.roomID, param.matchID);
        this._opPannel.initData(this._mine);
        this.insuranceOperation.initData(this._mine);
    }
}
