import { traceClass } from '../../../core/decorator/LogTrace';
import storageManager from '../../../data/LocalStorage';
import { SquidMode } from '../../../game/constant/Squid';
import { i18nMgr } from '../../../i18n/i18nMgr';
import UIComponentBaseDialog from '../../base/UIComponentDialogBase';

export type UIDialogSquidParam = {
    squidMode: SquidMode;
    squidBase: number;
    squidHead: boolean;
    squidTail: boolean;
    squidExtraCount: number;
    squidCountRates?: { count: number; rate: number }[];
    seatCount: number;
    noAnimation: boolean;
};

const { property, menu, ccclass } = cc._decorator;

@ccclass
@traceClass({ level: 'debug' })
export default class UIDialogSquid extends UIComponentBaseDialog<UIDialogSquidParam> {
    @property({ type: cc.Button, displayName: '左按钮' })
    private LeftButton: cc.Button = null;
    @property({ type: cc.Button, displayName: '右按钮' })
    private RightButton: cc.Button = null;
    @property({ type: cc.Button, displayName: '提交按钮' })
    private ButtonCommit: cc.Button = null;
    @property({ type: cc.RichText, displayName: '标题' })
    private Text_Title: cc.RichText = null;
    @property({ type: cc.RichText, displayName: '内容' })
    private Text_Content: cc.RichText = null;
    @property({ type: cc.Toggle, displayName: '不在提醒' })
    private NoToggle: cc.Toggle = null;
    @property({ type: [cc.Node], displayName: '页面' })
    private pageNodes: cc.Node[] = [];
    @property({ type: [cc.Node], displayName: '页面条' })
    private pageBars: cc.Node[] = [];
    private currentPage = 0;
    private maxPage = 3;
    private autoLoopStopped = false;
    private autoLoopInterval = 2;
    private squidMode: SquidMode = SquidMode.NORMAL;
    private squidBase = 0;
    private squidHead = false;
    private squidTail = false;
    private squidExtraCount = 0;
    private seatCount = 0;
    private squidCountRates: { count: number; rate: number }[] = [];

    protected onLoad(): void {
        this.regiterTouchEvents();
    }

    protected regiterTouchEvents(): void {
        this.LeftButton.node.on('click', this.OnClickLeftButton, this);
        this.RightButton.node.on('click', this.OnClickRightButton, this);
        this.ButtonCommit.node.on('click', this.OnClickCommit, this);
    }

    public initialize(param: UIDialogSquidParam): void {
        const data = param;
        this.squidMode = data.squidMode;
        this.squidBase = data.squidBase;
        this.squidHead = data.squidHead;
        this.squidTail = data.squidTail;
        this.squidExtraCount = data.squidExtraCount;
        this.seatCount = data.seatCount;
        this.squidCountRates = (data.squidCountRates || [])
            .map(v => ({ count: Number(v.count || 0), rate: Number(v.rate || 0) }))
            .sort((a, b) => a.count - b.count);
        this.maxPage = 3;
        this.currentPage = 0;
        this.autoLoopStopped = false;
        this.Text_Title.string = `${i18nMgr.Get('UIDialogSquid_BloodyTip')} ${i18nMgr.Get('UIDialogSquid_SoonStartTip')}`;
        // this.SetTextValue(this.Text_Commit, i18nMgr.Get('adaptation10012'));
        if (this.NoToggle) {
            this.NoToggle.isChecked = true;
        }
        this.SetPageContent();
        this.StartAutoLoop();
    }

    public override close(): void {
        this.StopAutoLoop();
        super.close();
    }

    private OnClickLeftButton(): void {
        this.StopAutoLoopByUser();
        if (this.currentPage <= 0) {
            this.currentPage = this.maxPage - 1;
        } else {
            this.currentPage -= 1;
        }
        this.SetPageContent();
    }

    private OnClickRightButton(): void {
        this.StopAutoLoopByUser();
        this.AutoNextPage();
    }

    private AutoNextPage(): void {
        this.currentPage = (this.currentPage + 1) % this.maxPage;
        this.SetPageContent();
    }

    private OnClickCommit(): void {
        storageManager.canShowSquidIntroDialog = this.NoToggle.isChecked;
        this.close();
    }

    private StartAutoLoop(): void {
        this.StopAutoLoop();
        if (this.maxPage <= 1) return;
        this.schedule(this.OnAutoLoopTick, this.autoLoopInterval);
    }

    private StopAutoLoop(): void {
        this.unschedule(this.OnAutoLoopTick);
    }

    private StopAutoLoopByUser(): void {
        if (this.autoLoopStopped) return;
        this.autoLoopStopped = true;
        this.StopAutoLoop();
    }

    private OnAutoLoopTick = (): void => {
        if (this.autoLoopStopped) return;
        this.AutoNextPage();
    };

    private SetPageContent(): void {
        for (let i = 0; i < this.pageNodes.length; i++) {
            const pageNode = this.pageNodes[i];
            if (!pageNode) continue;
            pageNode.active = i < this.maxPage && i === this.currentPage;
        }
        const isListPage = this.currentPage === 3 && this.maxPage === 4;
        if (this.Text_Content?.node) {
            this.Text_Content.node.active = !isListPage;
        }
        if (!isListPage) {
            this.Text_Content.string = this.GetCurrentPageText();
        }
        this.UpdatePageBars();
    }

    private UpdatePageBars(): void {
        for (let i = 0; i < this.pageBars.length; i++) {
            const bar = this.pageBars[i];
            if (!bar) continue;
            bar.active = i < this.maxPage;
            if (!bar.active) continue;
            this.SetBarSelected(bar, i === this.currentPage);
        }
    }

    private SetBarSelected(bar: cc.Node, selected: boolean): void {
        const onNode = bar.getChildByName('Select') || bar.getChildByName('On');
        const offNode = bar.getChildByName('Normal') || bar.getChildByName('Off');
        if (onNode) onNode.active = selected;
        if (offNode) offNode.active = !selected;
        if (!onNode && !offNode) {
            bar.opacity = selected ? 255 : 120;
        }
    }

    private GetCurrentPageText(): string {
        if (this.currentPage === 0) {
            return this.squidMode === 1 ? i18nMgr.Get('UIDialogSquid_BloodyPage1') : i18nMgr.Get('UIDialogSquid_NormalPage1');
        }
        if (this.currentPage === 1) {
            return this.squidMode === 1 ? i18nMgr.Get('UIDialogSquid_Tips1') : i18nMgr.Get('UIDialogSquid_Tips2');
        }
        if (this.currentPage === 2) {
            return i18nMgr.Get('UIDialogSquid_BloodyPage3');
        }
        return '';
    }
    // private BuildRewardItems(): void {
    //     if (!this.rewardList || !this.rewardItemTemplate) {
    //         return;
    //     }
    //     this.rewardItemCache.forEach(item => item && item.isValid && item.destroy());
    //     this.rewardItemCache = [];
    //     const count = Math.max(0, this.seatCount + this.squidExtraCount + (this.squidHead? 1 : 0) + (this.squidTail? 1 : 0));
    //     for (let i = 0; i < count; i++) {
    //         const clone = cc.instantiate(this.rewardItemTemplate);
    //         clone.active = true;
    //         clone.parent = this.rewardItemTemplate.parent;
    //         clone.setSiblingIndex(this.rewardItemTemplate.getSiblingIndex() + i + 1);
    //         const contentRoot = clone.getChildByName('Item') || clone;
    //         this.SetItemText(contentRoot, ['Text_Index', 'Text_Num', 'Num'], `${i + 1}`);
    //         const rate = this.GetSquidMultiple(i + 1);
    //         const bonus = Math.floor((this.squidBase * (i + 1) * rate) / 100);
    //         this.SetItemText(contentRoot, ['Text_Bonus', 'Text_bonus', 'Text_Value', 'Bonus'], `${bonus}`);
    //         this.rewardItemCache.push(clone);
    //     }
    // }

    private GetSquidMultiple(index: number): number {
        if (!this.squidCountRates || this.squidCountRates.length === 0) {
            return 1;
        }
        const sorted = this.squidCountRates.slice().sort((a, b) => a.count - b.count);
        if (index < sorted[0].count) {
            return 1;
        }
        if (index >= sorted[sorted.length - 1].count) {
            return sorted[sorted.length - 1].rate;
        }
        let rate = sorted[0].rate;
        for (let i = 0; i < sorted.length; i++) {
            const cfg = sorted[i];
            if (index === cfg.count) {
                return cfg.rate;
            }
            if (index < cfg.count) {
                return rate;
            }
            rate = cfg.rate;
        }
        return Math.max(1, rate);
    }

    private SetItemText(root: cc.Node, names: string[], value: string): void {
        const target = this.FindNodeByNames(root, names);
        if (!target) return;
        const label = target.getComponent(cc.Label);
        if (label) {
            label.string = value;
            return;
        }
        const rich = target.getComponent(cc.RichText);
        if (rich) {
            rich.string = value;
        }
    }

    private FindNodeByNames(root: cc.Node, names: string[]): cc.Node | null {
        if (!root || !names || names.length === 0) return null;
        for (let i = 0; i < names.length; i++) {
            const direct = root.getChildByName(names[i]);
            if (direct) return direct;
        }
        const queue: cc.Node[] = [];
        root.children.forEach(child => queue.push(child));
        while (queue.length > 0) {
            const node = queue.shift();
            if (!node) continue;
            if (names.indexOf(node.name) >= 0) {
                return node;
            }
            node.children.forEach(child => queue.push(child));
        }
        return null;
    }
    // private SetTextValue(textComp: cc.Label | cc.RichText, value: string): void {
    //     if (!textComp) return;
    //     textComp.string = value || '';
    // }
}
