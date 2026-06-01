const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('Widget/SwitchNode')
export default class SwitchNode extends cc.Component {
    @property(cc.Node)
    handleNode: cc.Node = null; // 拖入圆形滑块节点
    @property(cc.Node)
    bgNode: cc.Node = null; // 拖入底槽轨道节点
    @property
    slideDistance: number = 30; // 滑块偏离中心的距离（比如向右移30，向左移-30）
    @property({ tooltip: '关闭状态的底槽颜色' })
    disabledColor: cc.Color = cc.Color.fromHEX(new cc.Color(), '#555555');
    @property({ tooltip: '开启状态的底槽颜色' })
    enabledColor: cc.Color = cc.Color.fromHEX(new cc.Color(), '#f9ca24');
    // 开关状态改变时的回调
    public onSwitchCallback: (isOn: boolean) => void = null;
    private _isOn: boolean = false;
    public get isOn(): boolean {
        return this._isOn;
    }

    onLoad() {
        // 监听自身的点击事件
        this.node.on('click', this.onSwitchClicked, this);
        // 初始化时不播动画，直接就位
        this.updateVisual(false);
    }

    /**
     * 供外部调用的初始化方法（比如从服务器读到了玩家关闭了音效）
     */
    public onoff(isOn: boolean, triggerCallback: boolean = false) {
        this._isOn = isOn;
        this.updateVisual(false);
        if (triggerCallback && this.onSwitchCallback) {
            this.onSwitchCallback(this._isOn);
        }
    }

    private onSwitchClicked() {
        this._isOn = !this._isOn; // 状态反转
        // 播放丝滑的切换动画
        this.updateVisual(true);
        // 通知外部业务逻辑
        if (this.onSwitchCallback) {
            this.onSwitchCallback(this._isOn);
        }
    }

    private updateVisual(withAnim: boolean) {
        // 计算目标位置（开：靠右；关：靠左）
        let targetX = this._isOn ? this.slideDistance : -this.slideDistance;
        // 计算目标颜色（开：扑克风金色/绿色；关：暗灰色）
        let targetBgColor = this._isOn ? this.enabledColor : this.disabledColor;
        if (withAnim) {
            // 停止之前的动画防止乱轴
            cc.tween(this.handleNode).stop();
            cc.tween(this.bgNode).stop();
            // 0.2秒的弹性滑动
            cc.tween(this.handleNode).to(0.2, { x: targetX }, { easing: 'sineOut' }).start();
            // 0.2秒的底图颜色渐变 (Cocos 2.4 支持对 color 进行 tween)
            cc.tween(this.bgNode).to(0.2, { color: targetBgColor }).start();
        } else {
            // 没有动画，瞬间就位
            this.handleNode.x = targetX;
            this.bgNode.color = targetBgColor;
        }
    }
}
