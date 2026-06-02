const { ccclass, property } = cc._decorator;

@ccclass
export default class DynamicScrollView extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;
    @property
    itemHeight: number = 80; // 单行的高度
    @property
    spacing: number = 10; // Layout 组件里的间距
    @property
    paddingTop: number = 10; // Layout 组件里的顶部内边距
    @property
    paddingBottom: number = 10; // Layout 组件里的底部内边距

    start() {
        // 监听 content 的尺寸变化
        this.content.on(cc.Node.EventType.SIZE_CHANGED, this.updateViewHeight, this);
        this.updateViewHeight();
    }

    updateViewHeight() {
        // 计算高度阈值
        const minH = this.itemHeight + this.paddingTop + this.paddingBottom;
        const maxH = this.itemHeight * 4 + this.spacing * 3 + this.paddingTop + this.paddingBottom;
        // 获取当前 content 的实际高度
        let currentContentHeight = this.content.height;
        // 核心逻辑：限制 ScrollView 节点的高度
        let finalHeight = currentContentHeight;
        if (currentContentHeight < minH) {
            finalHeight = minH;
        } else if (currentContentHeight > maxH) {
            finalHeight = maxH;
        }
        // 修改 ScrollView 节点的高度
        this.node.height = finalHeight;
    }
}
