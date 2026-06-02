import { bindData, observable } from '../../../core/decorator/DataBind';
import { SidePot } from '../../../protobuf/holdem/define_pb';

@bindData()
export default class TexasGameRoomDataPotInfo extends cc.EventTarget {
    public static readonly ALLPOTS_CHANGE = 'ALLPOTS_CHANGE';
    public static readonly POTLIST_CHANGE = 'POTLIST_CHANGE';
    public static readonly SEC_POTLIST_CHANGE = 'SEC_POTLIST_CHANGE';
    // 全筹码
    @observable(TexasGameRoomDataPotInfo.ALLPOTS_CHANGE)
    public allPot: number;
    // _pots
    @observable(TexasGameRoomDataPotInfo.POTLIST_CHANGE)
    public potList: SidePot.AsObject[];
    // _pots
    @observable(TexasGameRoomDataPotInfo.SEC_POTLIST_CHANGE)
    public secPotList: SidePot.AsObject[];

    public handClear() {
        this.secPotList = [];
        this.potList = [];
        this.allPot = 0;
    }
}
