export type BringInCommitFn = (amount: number, store: number, autoOnTable: number, clubID: number) => void;

export interface BringInWalletBalance {
    clubID: number;
    balance: number;
}

export abstract class BringInProvider {
    // 初始化流程
    public process() {
        this.beforeBind();
        this.autoBind();
        this.afterBind();
    }
    // 清理工作
    public abstract cleanup(): void;
    // 独立实现
    protected abstract beforeBind(): void;
    protected abstract autoBind(): void;
    protected abstract afterBind(): void;
    // 被选中以后数据的传送,便于内部数据的更新(真实ID)
    public abstract clubSelected(_clubID: number): void;
    public abstract getSelectedWalletBalance(): BringInWalletBalance | null;
    // 提交带入金额
    public abstract commit(bringInAmount: number, autoOnTableAmount: number): void;
}
