import UIComponentBase from './UIComponentBase';

export default abstract class UIComponentBaseDialog<T = any> extends UIComponentBase<T> {
    private _closeDialog: () => void = () => {};

    /**close 用来关闭当前对话框,如果子类覆写,使用super.close()来关闭窗口 */
    public close(): void {
        this._closeDialog();
    }

    /**  setCloseDialogFunction 让viewManager把关闭事件注入*/
    public setCloseDialogFunction(handler: () => void) {
        this._closeDialog = handler;
    }
}
