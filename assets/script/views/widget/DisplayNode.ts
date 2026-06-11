import { traceClass } from '../../core/decorator/LogTrace';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@traceClass()
@menu('Widget/DisplayNode')
export class DisplayNode extends cc.Component {
    @property({
        displayName: '组件用途说明',
        tooltip: '请务必在这里写下这个通用组件是干嘛用的'
    })
    componentDesc: string = ''; // 只要这里初始化为字符串即可
    // 2.4 里必须明确告诉 cc 这是一个 cc.Label 的数组
    @property({
        type: [cc.Label],
        displayName: '拖入多个Label节点'
    })
    labels: cc.Label[] = [];
    @property({
        type: [cc.Sprite],
        displayName: '可能要操作的多个图片精灵'
    })
    sprites: cc.Sprite[] = [];
    @property({
        type: [cc.Node],
        displayName: '可能要操作的多个节点'
    })
    innerNodes: cc.Node[] = [];

    protected onLoad(): void {
        if (this.componentDesc == '') {
            this.tracelog.warn('节点说明必须加上便于后期维护');
        }
    }

    /** 获取某个图片精灵 */
    public getSpriteNode(index: number): cc.Sprite {
        const sp = this.sprites[index];
        if (!sp) {
            this.tracelog.error(this.componentDesc, '节点没有绑定图片精灵', index);
            return null;
        }
        return sp;
    }

    /** 获取某个节点 */
    public getOpNode(index: number): cc.Node {
        const sp = this.innerNodes[index];
        if (!sp) {
            this.tracelog.error(this.componentDesc, '节点没有绑定操作的节点', index);
            return null;
        }
        return sp;
    }

    /**
     * 外层只负责无脑填文字，不需要关心内层结构
     */
    public setText(...texts: string[]): void {
        let textIndex = 0;
        for (let i = 0; i < this.labels.length; i++) {
            const label = this.labels[i];
            // 遇到没绑定的 None 槽位，直接跳过
            if (!label) {
                this.tracelog.error(this.componentDesc, '节点没有绑定文字节点', i);
                continue;
            }
            // 按有效顺序依次填入文本
            if (textIndex < texts.length) {
                label.string = texts[textIndex];
                label.node.active = true;
                textIndex++;
            } else {
                // 没分到文字的 Label 自动隐藏
                label.node.active = false;
            }
        }
    }
}
