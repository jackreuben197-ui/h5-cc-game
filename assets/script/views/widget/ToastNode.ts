const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('Widget/ToastNode')
export default class ToastNode extends cc.Component {
    private static readonly MAX_TEXT_WIDTH = 1000;
    private static readonly HORIZONTAL_PADDING = 100;
    private static readonly VERTICAL_PADDING = 40;

    @property(cc.Label)
    label: cc.Label = null!;
    posY: number;
    //记录渐入浅出起始时间
    markFadeOriTime: number;

    setLabel(content: string) {
        const bg = this.label.node.parent;
        const widget = this.node.getComponent(cc.Widget);
        const rootLayout = this.node.getComponent(cc.Layout);
        const bgLayout = bg?.getComponent(cc.Layout);

        // Toast 的宽高由文案决定，避免 prefab 上的 Widget/Layout 将其重新拉伸为固定宽度。
        if (widget) widget.enabled = false;
        if (rootLayout) rootLayout.enabled = false;
        if (bgLayout) bgLayout.enabled = false;

        this.label.string = content;
        this.label.overflow = cc.Label.Overflow.NONE;
        this._forceUpdateLabel();

        const textWidth = Math.min(this.label.node.width, ToastNode.MAX_TEXT_WIDTH);
        this.label.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
        this.label.node.width = textWidth;
        this._forceUpdateLabel();

        const width = textWidth + ToastNode.HORIZONTAL_PADDING * 2;
        const height = this.label.node.height + ToastNode.VERTICAL_PADDING * 2;
        if (bg) bg.setContentSize(width, height);
        this.node.setContentSize(width, height);
        this.node.x = 0;
    }

    reset() {
        this.node.stopAllActions();
        this.node.opacity = 255;
    }

    private _forceUpdateLabel(): void {
        const label = this.label as cc.Label & { _forceUpdateRenderData?: () => void };
        label._forceUpdateRenderData?.();
    }
}
