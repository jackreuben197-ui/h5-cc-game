
import UIComponentBase from '../../../base/UIComponentBase';

export type AutoOperationData = {
    callAmount?: number;
};
const { ccclass } = cc._decorator;

@ccclass
export default class AutoOperation extends UIComponentBase<any> {
    public initialize(param: any): void {
        throw new Error('Method not implemented.');
    }
    // /**
    //  * 组件绑定
    //  */
    // toggleAutoFold: ToggleButton = null;
    // toggleAutoCall: ToggleButton = null;
    // toggleAutoAllin: ToggleButton = null;
    // toggleAutoCheck: ToggleButton = null;
    // textAutoCall: cc.Label = null;
    // UI: cc.Node = null;
    // /**
    //  * 声明
    //  */
    // public ParamType: AutoOperationData;
    // LocalCallNum: number = 0;

    // protected lateLoad(): void {
    //     super.lateLoad();
    //     this.toggleAutoFold = this.getChildNodeOrComponent('Toggle_AutoFold', ToggleButton);
    //     this.toggleAutoCall = this.getChildNodeOrComponent('Toggle_AutoCall', ToggleButton);
    //     this.toggleAutoAllin = this.getChildNodeOrComponent('Toggle_AutoAllin', ToggleButton);
    //     this.toggleAutoCheck = this.getChildNodeOrComponent('Toggle_AutoCheck', ToggleButton);
    //     this.textAutoCall = this.getChildNodeOrComponent('Text_AutoCall', cc.Label);
    //     this.UI = this.getChildNodeOrComponent('UI');
    // }

    // onShow(param?: any): void {
    //     super.onShow(param);
    //     let autoOperationData: AutoOperationData = param as AutoOperationData;
    //     if (null == autoOperationData) return;
    //     let enumRoomType: RoomType = GameCache.Instance.room_type;
    //     if (
    //         enumRoomType == RoomType.TexasHoldemStandardAof ||
    //         enumRoomType == RoomType.TexasHoldemSixPlusFixedAof ||
    //         enumRoomType == RoomType.Omaha4StandardAof ||
    //         enumRoomType == RoomType.Omaha4SixPlusFixedAof ||
    //         enumRoomType == RoomType.Omaha5SixPlusFixedAof ||
    //         enumRoomType == RoomType.Omaha5StandardAof ||
    //         enumRoomType == RoomType.Omaha6SixPlusFixedAof ||
    //         enumRoomType == RoomType.Omaha6StandardAof
    //     ) {
    //         //必下场，只显示Allin和Fold
    //         autoOperationData.callAmount = GameCache.Instance.CurGame.mainPlayer.chips;
    //     }
    //     this.toggleAutoFold.isOn = GameCache.Instance.CurGame.autoFold;
    //     this.toggleAutoCall.isOn = GameCache.Instance.CurGame.autoCall;
    //     this.toggleAutoAllin.isOn = GameCache.Instance.CurGame.autoAllin;
    //     this.toggleAutoCheck.isOn = GameCache.Instance.CurGame.autoCheck;
    //     if (autoOperationData.callAmount == 0) {
    //         this.toggleAutoCheck.node.active = true;
    //         this.toggleAutoCall.node.active = false;
    //         this.toggleAutoAllin.node.active = false;
    //     } else if (autoOperationData.callAmount < GameCache.Instance.CurGame.mainPlayer.chips) {
    //         this.toggleAutoCheck.node.active = false;
    //         this.toggleAutoCall.node.active = true;
    //         this.toggleAutoAllin.node.active = false;
    //         if (this.LocalCallNum < autoOperationData.callAmount) {
    //             this.toggleAutoCall.isOn = false;
    //             GameCache.Instance.CurGame.autoCall = false;
    //             GameCache.Instance.CurGame.autoCheck = false;
    //         }
    //         this.LocalCallNum = autoOperationData.callAmount;
    //         this.textAutoCall.string = StringHelper.GetLongString(autoOperationData.callAmount);
    //     } else if (autoOperationData.callAmount >= GameCache.Instance.CurGame.mainPlayer.chips) {
    //         GameCache.Instance.CurGame.autoCall = false;
    //         GameCache.Instance.CurGame.autoCheck = false;
    //         this.toggleAutoCheck.node.active = false;
    //         this.toggleAutoCall.node.active = false;
    //         this.toggleAutoAllin.node.active = true;
    //     }
    // }

    // protected regiterTouchEvents(): void {
    //     this.toggleAutoFold.onValueChanged(this.onValueChangeAutoFold.bind(this));
    //     this.toggleAutoCall.onValueChanged(this.onValueChangeAutoCall.bind(this));
    //     this.toggleAutoAllin.onValueChanged(this.onValueChangeAutoAllin.bind(this));
    //     this.toggleAutoCheck.onValueChanged(this.onValueChangeAutoCheck.bind(this));
    // }

    // static AutoOperationData(callAmount: number): AutoOperationData {
    //     return {
    //         callAmount: callAmount
    //     };
    // }

    // //设置UI位置
    // public SetUIPos(pos: cc.Vec2) {
    //     this.UI.setPosition(pos);
    // }

    // onValueChangeAutoFold(boo: boolean) {
    //     GameCache.Instance.CurGame.autoFold = boo;
    //     if (boo) {
    //         this.toggleAutoCall.isOn = false;
    //         this.toggleAutoAllin.isOn = false;
    //         this.toggleAutoCheck.isOn = false;
    //     }
    // }

    // onValueChangeAutoCall(boo: boolean) {
    //     GameCache.Instance.CurGame.autoCall = boo;
    //     if (boo) {
    //         this.toggleAutoFold.isOn = false;
    //         this.toggleAutoAllin.isOn = false;
    //         this.toggleAutoCheck.isOn = false;
    //     }
    // }

    // onValueChangeAutoAllin(boo: boolean) {
    //     GameCache.Instance.CurGame.autoAllin = boo;
    //     if (boo) {
    //         this.toggleAutoCall.isOn = false;
    //         this.toggleAutoFold.isOn = false;
    //         this.toggleAutoCheck.isOn = false;
    //     }
    // }

    // onValueChangeAutoCheck(boo: boolean) {
    //     GameCache.Instance.CurGame.autoCheck = boo;
    //     if (boo) {
    //         this.toggleAutoCall.isOn = false;
    //         this.toggleAutoAllin.isOn = false;
    //         this.toggleAutoFold.isOn = false;
    //     }
    // }
}
