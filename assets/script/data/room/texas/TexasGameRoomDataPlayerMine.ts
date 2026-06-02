import { bindData, observable, pureEvent } from '../../../core/decorator/DataBind';
import { VideoModel } from '../../../game/constant/VideoModel';
import { OperatorMine } from './model/Operator';
import TexasGameRoomData from './TexasGameRoomData';

@bindData()
export default class TexasGameRoomDataPlayerMine extends cc.EventTarget {
    private _roomData: TexasGameRoomData;
    public get roomData() {
        return this._roomData;
    }

    constructor(roomData: TexasGameRoomData) {
        super();
        this._roomData = roomData;
    }

    @observable('STORECHIPS_CHANGE')
    public storeChips: number = 0;
    @observable('PREPARE_OPERATION_MINE')
    public operator: OperatorMine = null;
    @observable('TOTAL_BRINGIN')
    public totalBringIn: number = 0;
    @observable('TABLE_USER_DEPOSIT')
    public deposit: number = 0;

    @pureEvent('HIGHLIGHT_CARDS')
    public highlightCards(cards: number[]) {}

    public get needVideoPermision() {
        return this._roomData.basicInfo.videoModel !== VideoModel.NONE;
    }
    // 如果有座位,座位号 > 0
    public seatNo: number = 0;
    // 纯本地记录自动带上桌(wallet)
    public autoOnTable: number = 0;
    // 当前货币的卡包俱乐部ID;
    public currentWalletClubID: number = 0;
    // calltime手数
    public callTimeCount: number = 0;
    // callTimeStay 满足条件了是否必须还得留下
    public callTimeStay: number = 0;
    public videoMaskId: number = 0;
}
