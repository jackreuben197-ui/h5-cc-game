const TABLE_DIALOG_DESIGN_HEIGHT = 2703;

export default class UIViewUtil {
    public static alignTableDialog(panel: cc.Node, visibleHeight: number, safeAreaTop: number, designTop: number): void {
        const widget = panel.getComponent(cc.Widget);
        widget.top = Math.max((visibleHeight * designTop) / TABLE_DIALOG_DESIGN_HEIGHT, safeAreaTop);
        widget.updateAlignment();
        // 面板高度变化后重新对齐页眉、页脚和滚动视口，滚动内容的位置由 ScrollView 管理。
        for (const child of panel.children) {
            child.getComponent(cc.Widget)?.updateAlignment();
            const scrollView = child.getComponent(cc.ScrollView);
            const viewport = scrollView?.content?.parent;
            if (viewport && viewport !== child) {
                viewport.getComponent(cc.Widget)?.updateAlignment();
            }
            scrollView?.verticalScrollBar?.node.getComponent(cc.Widget)?.updateAlignment();
        }
    }

    // caculatePostion 计算任意一个节点TargetNode, 针对当前节点的坐标
    public static caculatePostion(originalNode: cc.Node, targetNode: cc.Node, offset: cc.Vec2 | cc.Vec3 = cc.Vec2.ZERO): cc.Vec2 | cc.Vec3 {
        // 世界坐标
        const worldPos = targetNode.convertToWorldSpaceAR(offset);
        // 转化为本地的
        const localPos = originalNode.parent.convertToNodeSpaceAR(worldPos);
        return localPos;
    }
    // public static caculatePostion(originalNode: cc.Node, targetPos: cc.Vec3): cc.Vec2 {

    // }

    public static parellTweens(tweens: cc.Tween[], complete: () => void): () => void {
        if (!tweens || tweens.length === 0) {
            if (complete) complete();
            return () => {};
        }
        let counter = tweens.length;
        tweens.forEach(t => {
            t.call(() => {
                if (counter == -1) {
                    return;
                }
                counter--;
                if (counter == 0 && complete) {
                    complete();
                }
            }).start();
        });
        return () => {
            counter = -1;
            complete = null;
        };
    }

    public static setNodeGray(node: cc.Node, gray: boolean) {
        const sprite = node.getComponent(cc.Sprite);
        if (sprite) {
            const mat = gray ? cc.Material.getBuiltinMaterial('2d-gray-sprite') : cc.Material.getBuiltinMaterial('2d-sprite');
            sprite.setMaterial(0, mat);
        }
        node.opacity = gray ? 128 : 255;
    }
}
