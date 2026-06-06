import { traceClass } from '../../core/decorator/LogTrace';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('Widget/Mask')
@traceClass()
export default class Mask extends cc.Component {
    @property(cc.Button)
    private button: cc.Button = null!;
    public closeCallback: () => void = null!;

    private onButtonClick() {
        if (this.closeCallback) {
            this.closeCallback();
        }
    }

    protected onLoad() {
        this.button.node.on('click', this.onButtonClick, this);
    }

    protected onDestroy() {
        // 直接暴力移除该节点上所有的点击事件监听
        this.button.node.targetOff(this);
        this.button.node.off('click');
    }
}
