import { bindData, observable } from '../../../core/decorator/DataBind';
import { StringHelper } from '../../../helper/StringHelper';
import TexasGameRoomData from './TexasGameRoomData';

@bindData()
export default class TexasGameRoomDataSetting extends cc.EventTarget {
    private _roomData: TexasGameRoomData;
    public static readonly SHOW_BB = 'SHOW_BB';
    // 用BB显示
    @observable(TexasGameRoomDataSetting.SHOW_BB)
    public showBB: boolean = false;

    constructor(rd: TexasGameRoomData) {
        super();
        this._roomData = rd;
    }

    public showNumberWithShowBB(value: number): string {
        let base = this._roomData.basicInfo.sbante.sb * 2;
        let ratio = this.showBB ? base : 100;
        let ex: string = this.showBB ? 'BB' : '';
        return `${StringHelper.GetDecimalN(value / ratio)}${ex}`;
    }
}
