const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('CrazyPoker/Room/Texas/SeatPart/SeatAction')
export default class SeatAction extends cc.Component {
    @property(cc.Label)
    private actionLabel: cc.Label = null;
    @property(cc.Label)
    private actionFoldLabel: cc.Label = null;

    public showAction(c: string, color: cc.Color) {
        this.actionLabel.string = c;
        this.actionLabel.node.parent.active = true;
        this.actionLabel.node.parent.color = color;
        this.actionFoldLabel.node.parent.active = false;
    }

    public fold(c: string) {
        this.actionFoldLabel.string = c;
        this.actionFoldLabel.node.parent.active = true;
        this.actionLabel.node.parent.active = false;
    }
}
