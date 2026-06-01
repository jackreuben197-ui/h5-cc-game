export default class UIViewUtil {
    // caculatePostion 计算任意一个节点TargetNode, 针对当前节点的坐标
    public static caculatePostion(originalNode: cc.Node, targetNode: cc.Node): cc.Vec2 {
        // 世界坐标
        const worldPos = targetNode.convertToWorldSpaceAR(cc.Vec2.ZERO);
        // 转化为本地的
        const localPos = originalNode.parent.convertToNodeSpaceAR(worldPos);
        return localPos;
    }

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
}
