/**
 * loadng 菊花|文字 效果组件 延迟显示
 */
import UIComponentBase from '../base/UIComponentBase';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('Scene/UIPromptComponent')
export default class UIPromptComponent extends UIComponentBase<void> {
    //状态
    statusType = {
        Idle: 0,
        WaitShow: 1,
        Showing: 2
    };
    //延时显示
    private showDelay: number = 2;
    //超时时间
    private timeout: number = 10;
    protected mask_opacitys: number[] = [1, 60];
    @property(cc.Node)
    mask: cc.Node = null;
    @property(cc.Node)
    loading: cc.Node = null;
    waitShow: boolean = false;
    isShow: boolean = false;
    showStartTime: number = 0;
    //当前状态
    status: number = 0;

    protected onLoad() {
        this.translateStatus(this.statusType.Idle);
    }

    initialize() {
        this.showStartTime = new Date().getTime();
        this.translateStatus(this.statusType.WaitShow);
    }

    protected update(dt: number): void {
        switch (this.status) {
            //case this.statusType.Idle:
            //return;
            case this.statusType.Showing:
                if ((new Date().getTime() - this.showStartTime) / 1000 > this.timeout) {
                    //ToastManager.Instance.createToast("adaptation10126");
                    this.node.active = false;
                }
                break;
            case this.statusType.WaitShow:
                if ((new Date().getTime() - this.showStartTime) / 1000 > this.showDelay) {
                    this.translateStatus(this.statusType.Showing);
                }
                break;
        }
    }

    //切换状态
    translateStatus(status: number) {
        this.status = status;
        if (status == this.statusType.Showing) {
            this.loading.active = true;
            this.mask.opacity = this.mask_opacitys[1];
        } else {
            this.loading.active = false;
            this.mask.opacity = this.mask_opacitys[0];
        }
    }
}
