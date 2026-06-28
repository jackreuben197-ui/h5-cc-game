import { traceClass } from '../../core/decorator/LogTrace';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@traceClass()
@menu('Widget/ToggleButton')
export default class ToggleButton extends cc.Component {
    @property({ type: cc.Node, displayName: '未选中状态的节点' })
    private uncheckedNode: cc.Node = null;
    @property({ type: cc.Label, displayName: '未选中状态的需要修改的文字' })
    private uncheckedLabel: cc.Label = null;
    @property({ type: cc.Node, displayName: '选中状态的节点' })
    private checkNode: cc.Node = null;
    @property({ type: cc.Label, displayName: '选中状态的需要修改的文字' })
    private checkedlabel: cc.Label = null;
    // 开关状态改变时的回调
    public onToggleCallback: (isOn: boolean) => void = null;

    onLoad() {
        //this.defaultLabel = this.node.getChildByName('Label');
        this.uncheckedNode.on('click', this.onCheckNodeClicked, this);
        this.checkNode.on('click', this.onCheckNodeClicked, this);
        this.check(false);
    }

    /**
     * 供外部调用的初始化方法（比如从服务器读到了玩家关闭了音效）
     */
    public check(checked: boolean, triggerCallback: boolean = false) {
        this._isChecked = checked;
        this.updateVisual(false);
        if (triggerCallback && this.onToggleCallback) {
            this.onToggleCallback(this._isChecked);
        }
    }

    private _uncheckRelatedInfo: any = null;
    private _checkRelateInfo: any = null;

    public getUncheckRelatedInfo<T>() {
        return this._uncheckRelatedInfo as T;
    }

    public getCheckRelatedInfo<T>() {
        return this._checkRelateInfo as T;
    }

    public setUncheckText(s: string, relatedInfo: any = null) {
        if (this.uncheckedLabel) {
            this.uncheckedLabel.string = s;
            this._uncheckRelatedInfo = relatedInfo;
        } else {
            this.tracelog.warn('no unchecked label binding', s);
        }
    }

    public setCheckText(s: string, relatedInfo: any = null) {
        if (this.checkedlabel) {
            this.checkedlabel.string = s;
            this._checkRelateInfo = relatedInfo;
        } else {
            this.tracelog.warn('no unchecked label binding', s);
        }
    }

    private onCheckNodeClicked() {
        this._isChecked = !this._isChecked; // 状态反转
        // 播放丝滑的切换动画
        this.updateVisual(true);
        // 通知外部业务逻辑
        if (this.onToggleCallback) {
            this.onToggleCallback(this._isChecked);
        }
    }

    private updateVisual(anmiate: boolean) {
        if (this._isChecked) {
            this.checkNode.active = true;
            this.uncheckedNode.active = false;
        } else {
            this.checkNode.active = false;
            this.uncheckedNode.active = true;
        }
    }

    private _isChecked: boolean = false;
    public get isChecked(): boolean {
        return this._isChecked;
    }
}
