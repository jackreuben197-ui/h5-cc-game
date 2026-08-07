import TimeHelper from '../../../helper/TimeHelper';
import UIComponentBaseDialog from '../../base/UIComponentDialogBase';
import UISquidEndItem, { UISquidEndItemShowData } from './UISquidEndItem';

export interface UISquidEndShowData {
    rows: UISquidEndItemShowData[];
}

const { property, menu, ccclass } = cc._decorator;

@ccclass
export default class UISquidEnd extends UIComponentBaseDialog<UISquidEndShowData> {
    @property({ type: cc.Node, displayName: '内容节点' })
    private content: cc.Node = null;
    @property({ type: cc.Node, displayName: '条目模板节点' })
    private itemTemplate: cc.Node = null;
    private itemPool: cc.Node[] = [];
    private activeItems: cc.Node[] = [];
    private showToken: number = 0;

    public onLoad(): void {
        // this.content = cc.find('squidEndDataList/view/content', this.node);
        // this.itemTemplate = cc.find('squidEndDataList/view/content/SquidEndData', this.node);
        if (this.itemTemplate) {
            this.itemTemplate.active = false;
            this.GetItemComp(this.itemTemplate);
        }
    }

    public initialize(param: UISquidEndShowData): void {
        this.StartShowRows(param.rows);
        this.StartAutoCloseTimer();
    }

    public override close(): void {
        this.showToken++;
        this.unscheduleAllCallbacks();
        this.RecycleActiveItems();
        super.close();
    }

    private async StartShowRows(rows: UISquidEndItemShowData[]): Promise<void> {
        const token = ++this.showToken;
        this.RecycleActiveItems();
        if (!this.content || !this.itemTemplate) {
            return;
        }
        for (let i = 0; i < rows.length; i++) {
            const node = this.GetItemNode();
            node.parent = this.content;
            node.active = false;
            this.GetItemComp(node).Refresh(rows[i]);
            this.activeItems.push(node);
        }
        this.content?.getComponent(cc.Layout)?.updateLayout();
        for (let i = 0; i < this.activeItems.length; i++) {
            if (token !== this.showToken || !this.node?.isValid) {
                return;
            }
            this.activeItems[i].active = true;
            this.content?.getComponent(cc.Layout)?.updateLayout();
            await TimeHelper.Sleep(66);
        }
    }

    private StartAutoCloseTimer(): void {
        this.unschedule(this.OnAutoClose);
        this.scheduleOnce(this.OnAutoClose, 5);
    }

    private readonly OnAutoClose = () => {
        this.close();
    };

    private GetItemNode(): cc.Node {
        if (this.itemPool.length > 0) {
            const node = this.itemPool.shift();
            if (node) {
                return node;
            }
        }
        if (!this.itemTemplate) {
            return new cc.Node('SquidEndData');
        }
        return cc.instantiate(this.itemTemplate);
    }

    private RecycleActiveItems(): void {
        while (this.activeItems.length > 0) {
            const node = this.activeItems.shift();
            if (!node || !node.isValid) {
                continue;
            }
            node.active = false;
            node.removeFromParent(false);
            this.itemPool.push(node);
        }
    }

    private GetItemComp(node: cc.Node): UISquidEndItem {
        let comp = node.getComponent(UISquidEndItem);
        if (!comp) {
            comp = node.addComponent(UISquidEndItem);
        }
        return comp;
    }
}
