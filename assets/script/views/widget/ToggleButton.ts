const { ccclass, property } = cc._decorator;

@ccclass
export default class ToggleButton extends cc.Component {
    @property(cc.Node)
    bg_node: cc.Node = null;
    @property(cc.Node)
    check_node: cc.Node = null;
    @property(cc.Label)
    content_label: cc.Label = null;
    defaultLabel: cc.Node = null;
    callback: Function = null;

    onLoad() {
        this.defaultLabel = this.node.getChildByName('Label');
        this.bg_node.on('click', this.bgClick, this);
        this.check_node.on('click', this.checkClick, this);
    }

    onShow() {
        this.uncheck();
    }

    bgClick() {
        this.check();
    }

    checkClick() {
        this.uncheck();
    }

    check() {
        this.check_node.active = true;
        if (this.content_label) {
            this.defaultLabel.active = false;
            this.content_label.node.active = true;
        }
        this.callback?.(true);
    }

    uncheck() {
        this.check_node.active = false;
        if (this.content_label) {
            this.defaultLabel.active = true;
            this.content_label.node.active = false;
        }
        this.callback?.(false);
    }

    set content(value: string) {
        this.content_label.string = '';
    }

    set isOn(bool: boolean) {
        this.check_node.active = bool;
    }

    get isOn(): boolean {
        return this.check_node.active;
    }

    onValueChanged(callback: Function) {
        this.callback = callback;
    }
}
