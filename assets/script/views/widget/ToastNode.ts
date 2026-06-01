const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('Widget/ToastNode')
export default class ToastNode extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null!;
    posY: number;
    //记录渐入浅出起始时间
    markFadeOriTime: number;

    setLabel(content: string) {
        // this.label.getComponent(cc.Label).string = content;
        this.label.string = content;
        //@ts-ignore
        //this.label._forceUpdateRenderData();
        // let layout = this.node.getComponent(cc.Layout);
        // layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
        // layout.updateLayout();
    }

    reset() {
        this.node.stopAllActions();
        this.node.opacity = 255;
    }
}
