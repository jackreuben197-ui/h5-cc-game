import { autoBindEvents, bindEvent, unBindEventsAll } from '../../../../../core/decorator/DataBind';
import { traceClass, traceMethod } from '../../../../../core/decorator/LogTrace';
import TexasGameRoomDataPlayerMine from '../../../../../data/room/texas/TexasGameRoomDataPlayerMine';
import TexasGameRoomDataSetting from '../../../../../data/room/texas/TexasGameRoomDataSetting';
import { AutoOperationTypeTexas } from '../../../../../game/constant/AutoOpertaionType';
import ToggleButton from '../../../../widget/ToggleButton';

export type AutoOperationData = {
    callAmount?: number;
};

const { ccclass, property, menu } = cc._decorator;

@ccclass
@traceClass()
@menu('Scene/Room/Texas/Operations/AutoOperation')
export default class AutoOperation extends cc.Component {
    @property({ type: cc.Node, displayName: '显示用根节点' })
    rootNode: cc.Node = null!;
    @property(ToggleButton)
    toggleAutoFold: ToggleButton = null;
    @property(ToggleButton)
    toggleAutoCall: ToggleButton = null;
    @property(ToggleButton)
    toggleAutoAllin: ToggleButton = null;
    @property(ToggleButton)
    toggleAutoCheck: ToggleButton = null;
    textAutoCall: cc.Label = null;
    private _mineData: TexasGameRoomDataPlayerMine = null!;
    // /**
    //  * 声明
    //  */
    // public ParamType: AutoOperationData;
    // LocalCallNum: number = 0;
    protected onLoad() {
        this.toggleAutoFold.onToggleCallback = this.onValueChangeAutoFold.bind(this);
        this.toggleAutoCall.onToggleCallback = this.onValueChangeAutoCall.bind(this);
        this.toggleAutoAllin.onToggleCallback = this.onValueChangeAutoAllin.bind(this);
        this.toggleAutoCheck.onToggleCallback = this.onValueChangeAutoCheck.bind(this);
    }

    public initData(mine: TexasGameRoomDataPlayerMine) {
        this._mineData = mine;
        this._bindEventsAndRefresh();
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
        autoBindEvents(this, { mine: this._mineData, setting: this._mineData.roomData.setting });
    }

    @bindEvent(TexasGameRoomDataSetting.SHOW_BB, 'setting')
    @traceMethod()
    private updateLabels(bb: boolean) {
        if (this.toggleAutoAllin.node.active) {
            let num = this.toggleAutoAllin.getCheckRelatedInfo<number>();
            if (num != null) {
                this.tracelog.debug('atuo allin', num);
                this.toggleAutoAllin.setCheckText(this._mineData.roomData.setting.showNumberWithShowBB(num), num);
            }
        }
        if (this.toggleAutoCall.node.active) {
            let num = this.toggleAutoCall.getCheckRelatedInfo<number>();
            if (num != null) {
                this.tracelog.debug('atuo call', num);
                this.toggleAutoCall.setCheckText(this._mineData.roomData.setting.showNumberWithShowBB(num), num);
            }
        }
    }

    @bindEvent(TexasGameRoomDataPlayerMine.VALID_AUTO_OPERATIONS_CHANGE, 'mine')
    @traceMethod()
    public onUpdateAutoOperationPanel(rightPanel: AutoOperationTypeTexas, amount: number) {
        this.toggleAutoFold.node.active = true;
        this.toggleAutoCheck.node.active = false;
        this.toggleAutoCall.node.active = false;
        this.toggleAutoAllin.node.active = false;
        this.rootNode.active = true;
        switch (rightPanel) {
            case AutoOperationTypeTexas.NO:
                this.rootNode.active = false;
                break;
            case AutoOperationTypeTexas.AUTO_CHECK:
                this.toggleAutoCheck.node.active = true;
                break;
            case AutoOperationTypeTexas.AUTO_CALL:
                this.toggleAutoCall.node.active = true;
                this.toggleAutoCall.setCheckText(this._mineData.roomData.setting.showNumberWithShowBB(amount), amount);
                break;
            case AutoOperationTypeTexas.AUTO_ALLIN:
                this.toggleAutoAllin.setCheckText(this._mineData.roomData.setting.showNumberWithShowBB(amount), amount);
                this.toggleAutoAllin.node.active = true;
                break;
            default:
                this.rootNode.active = false;
                break;
        }
    }

    @bindEvent(TexasGameRoomDataPlayerMine.AUTO_OPERATION_TYPE_CHANGE, 'mine')
    public onUpdateAutoOperationChange(oldOpt: AutoOperationTypeTexas, newOpt: AutoOperationTypeTexas) {
        switch (oldOpt) {
            case AutoOperationTypeTexas.NO:
                break;
            case AutoOperationTypeTexas.AUTO_CHECK:
                this.toggleAutoCheck.check(false);
                break;
            case AutoOperationTypeTexas.AUTO_CALL:
                this.toggleAutoCall.check(false);
                break;
            case AutoOperationTypeTexas.AUTO_ALLIN:
                this.toggleAutoAllin.check(false);
                break;
            case AutoOperationTypeTexas.AUTO_FOLD:
                this.toggleAutoFold.check(false);
                break;
        }
        switch (newOpt) {
            case AutoOperationTypeTexas.NO:
                break;
            case AutoOperationTypeTexas.AUTO_CHECK:
                this.toggleAutoCheck.check(true);
                break;
            case AutoOperationTypeTexas.AUTO_CALL:
                this.toggleAutoCall.check(true);
                break;
            case AutoOperationTypeTexas.AUTO_ALLIN:
                this.toggleAutoAllin.check(true);
                break;
            case AutoOperationTypeTexas.AUTO_FOLD:
                this.toggleAutoFold.check(true);
                break;
        }
    }

    private onValueChangeAutoFold(b: boolean) {
        if (b) {
            this._mineData.autoOperationType = AutoOperationTypeTexas.AUTO_FOLD;
        } else {
            this._mineData.autoOperationType = AutoOperationTypeTexas.NO;
        }
    }

    private onValueChangeAutoCall(b: boolean) {
        if (b) {
            this._mineData.autoOperationType = AutoOperationTypeTexas.AUTO_CALL;
        } else {
            this._mineData.autoOperationType = AutoOperationTypeTexas.NO;
        }
    }

    private onValueChangeAutoAllin(b: boolean) {
        if (b) {
            this._mineData.autoOperationType = AutoOperationTypeTexas.AUTO_ALLIN;
        } else {
            this._mineData.autoOperationType = AutoOperationTypeTexas.NO;
        }
    }

    private onValueChangeAutoCheck(b: boolean) {
        if (b) {
            this._mineData.autoOperationType = AutoOperationTypeTexas.AUTO_CHECK;
        } else {
            this._mineData.autoOperationType = AutoOperationTypeTexas.NO;
        }
    }
}
