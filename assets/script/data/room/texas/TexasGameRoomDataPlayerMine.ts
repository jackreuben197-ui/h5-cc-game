import { bindData, observable, pureEvent } from '../../../core/decorator/DataBind';
import { OperatorMine } from './model/Operator';

@bindData()
export default class TexasGameRoomDataPlayerMine extends cc.EventTarget {
    @observable('STORECHIPS_CHANGE')
    public storeChips: number;
    @observable('PREPARE_OPERATION_MINE')
    public operator: OperatorMine;
    @observable('TOTAL_BRINGIN')
    public totalBringIn: number;
    @observable('TABLE_USER_DEPOSIT')
    public deposit: number;

    @pureEvent('HIGHLIGHT_CARDS')
    public highlightCards(cards: number[]) {
        //this.emit(TexasGameRoomDataPlayerMine.HIGHLIGHT_CARDS, cards);
    }

    // 纯本地记录自动带上桌(wallet)
    public autoOnTable: number;
    // 当前货币的卡包俱乐部ID;
    public currentWalletClubID: number;
    // calltime手数
    public callTimeCount: number;
    // callTimeStay 满足条件了是否必须还得留下
    public callTimeStay: number;
}
