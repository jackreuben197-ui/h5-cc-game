import { trace } from 'console';
import { autoBindEvents, bindEvent, unBindEventsAll } from '../../../../core/decorator/DataBind';
import { traceClass, traceMethod } from '../../../../core/decorator/LogTrace';
import TexasGameRoomDataPlayerMine from '../../../../data/room/texas/TexasGameRoomDataPlayerMine';
import { AutoOperationTypeTexas } from '../../../../net/messages/texas/AutoOpertaionType';
import UIComponentBase from '../../../base/UIComponentBase';
import ToggleButton from '../../../widget/ToggleButton';
import TexasGameRoomDataSetting from '../../../../data/room/texas/TexasGameRoomDataSetting';
import { OperatorMine, OpertionType } from '../../../../data/room/texas/model/Operator';
import viewManager from '../../../UIViewManager';

export type AutoOperationData = {
    callAmount?: number;
};

const { ccclass, property, menu } = cc._decorator;

@ccclass
@traceClass()
@menu('Scene/Room/Texas/Operations/InsuranceOperation')
export default class InsuranceOperation extends cc.Component {
    private _mineData: TexasGameRoomDataPlayerMine = null!;
    // /**
    //  * 声明
    //  */
    // public ParamType: AutoOperationData;
    // LocalCallNum: number = 0;
    protected onLoad() {}

    public initData(mine: TexasGameRoomDataPlayerMine) {
        this._mineData = mine;
        this._bindEventsAndRefresh();
    }

    @bindEvent(TexasGameRoomDataPlayerMine.PREPARE_OPERATION_MINE, 'mine')
    @traceMethod({ level: 'debug' })
    private onPrepareActionMine(oper: OperatorMine) {
        if (!oper || oper.opType != OpertionType.INSURANCE) {
            return;
        }
        viewManager.openDialog('BuyInsurance', {
            Operator: oper,
            Player: this._mineData
        });
    }

    protected onEnable(): void {
        this._bindEventsAndRefresh();
    }

    protected onDisable(): void {
        this.tracelog.debug('autoop is disable unbind');
        unBindEventsAll(this);
    }

    private _bindEventsAndRefresh() {
        if (!this._mineData) return;
        autoBindEvents(this, { mine: this._mineData });
    }
}
