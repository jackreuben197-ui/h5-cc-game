export abstract class BringInProvider {
    public process() {
        this.beforeBind();
        this.autoBind();
        this.afterBind();
    }
    protected abstract beforeBind(): void;
    protected abstract autoBind(): void;
    protected abstract afterBind(): void;
}
