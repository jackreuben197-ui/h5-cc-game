import { bindData, observable, pureEvent } from '../../../core/decorator/DataBind';
import { VideoModel } from '../../../game/constant/VideoModel';
import { OperatorMine } from './model/Operator';
import TexasGameRoomData from './TexasGameRoomData';

@bindData()
export default class TexasGameRoomDataPlayerMine extends cc.EventTarget {
    public static readonly STORECHIPS_CHANGE = 'STORECHIPS_CHANGE';
    public static readonly PREPARE_OPERATION_MINE = 'PREPARE_OPERATION_MINE';
    public static readonly TOTAL_BRINGIN = 'TOTAL_BRINGIN';
    public static readonly TABLE_USER_DEPOSIT = 'TABLE_USER_DEPOSIT';
    public static readonly HIGHLIGHT_CARDS = 'HIGHLIGHT_CARDS';
    private _roomData: TexasGameRoomData;
    public get roomData() {
        return this._roomData;
    }

    constructor(roomData: TexasGameRoomData) {
        super();
        this._roomData = roomData;
    }

    @observable(TexasGameRoomDataPlayerMine.STORECHIPS_CHANGE)
    public storeChips: number = 0;
    @observable(TexasGameRoomDataPlayerMine.PREPARE_OPERATION_MINE)
    public operator: OperatorMine = null;
    @observable(TexasGameRoomDataPlayerMine.TOTAL_BRINGIN)
    public totalBringIn: number = 0;
    @observable(TexasGameRoomDataPlayerMine.TABLE_USER_DEPOSIT)
    public deposit: number = 0;

    @pureEvent(TexasGameRoomDataPlayerMine.HIGHLIGHT_CARDS)
    public highlightCards(cards: number[]) {}

    public get needVideoPermision() {
        return this._roomData.basicInfo.videoModel !== VideoModel.NONE;
    }
    // 如果有座位,座位号 > 0
    public seatNo: number = 0;
    // 纯本地记录自动带上桌(wallet)
    public autoOnTableLocal: number = 0;
    // 当前货币的卡包俱乐部ID(真实ID,非RID)
    public currentWalletClubID: number = 0;
    // calltime手数
    public callTimeCount: number = 0;
    // callTimeStay 满足条件了是否必须还得留下
    public callTimeStay: number = 0;
    public videoMaskId: number = 0;
}
