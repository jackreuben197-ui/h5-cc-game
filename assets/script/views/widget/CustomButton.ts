import { traceClass } from '../../core/decorator/LogTrace';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@traceClass()
@menu('Widget/CustomButton')
export default class CustomButton extends cc.Component {
    @property({ type: cc.Node, displayName: '未选中状态的背景' })
    private uncheckedNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '选中状态的背景' })
    private checkNode: cc.Node = null;
    @property({ displayName: '选中文字颜色' })
    checkedTextColor = new cc.Color().fromHEX('#000000');
    @property({ displayName: '未选中文字颜色' })
    uncheckedTextColor = new cc.Color().fromHEX('#FFFFFF');
    @property({ type: cc.Label, displayName: '按钮文字' })
    label: cc.Label = null!;
    // 开关状态改变时的回调
    public onCheckedCallback: () => void = null;
    public _innerValue: any = null;
    private _groups: CustomButton[] = [];

    onLoad() {
        //this.defaultLabel = this.node.getChildByName('Label');
        this.uncheckedNode.on('click', this.onCheckNodeClicked, this);
        this.checkNode.on('click', this.onCheckNodeClicked, this);
    }

    public set groups(btns: CustomButton[]) {
        this._groups = btns;
    }

    /**
     * 供外部调用的初始化方法（比如从服务器读到了玩家关闭了音效）
     */
    public check(checked: boolean, trigger: boolean = false) {
        this._isChecked = checked;
        this.updateVisual(false);
        if (trigger && checked) {
            if (this.onCheckedCallback) {
                this.onCheckedCallback();
            }
        }
    }

    public getInnerValue<T>() {
        return this._innerValue as T;
    }

    public setText(s: string, innerValue: any = null) {
        this.label.string = s;
        this._innerValue = innerValue;
    }

    private onCheckNodeClicked() {
        if (this._isChecked) return;
        this._isChecked = !this._isChecked; // 状态反转
        // 播放丝滑的切换动画
        this.updateVisual(true);
        // 通知外部业务逻辑
        if (this.onCheckedCallback) {
            this.onCheckedCallback();
        }
    }

    private updateVisual(anmiate: boolean) {
        if (this._isChecked) {
            this.checkNode.active = true;
            this.label.node.color = this.checkedTextColor;
            this.uncheckedNode.active = false;
            this._groups.forEach(v => {
                if (v != this) {
                    v.check(false);
                }
            });
        } else {
            this.checkNode.active = false;
            this.uncheckedNode.active = true;
            this.label.node.color = this.uncheckedTextColor;
        }
    }

    private _isChecked: boolean = false;
    public get isChecked(): boolean {
        return this._isChecked;
    }
}
