import { autoBindEvents, bindEvent, unBindEvents } from '../../core/decorator/DataBind';
import ccviewData, { CCViewData } from '../../data/system/CCViewData';

export default abstract class UIComponentBase<T = any> extends cc.Component {
    // initialize 初始化会被Call的函数
    public abstract initialize(param: T): void;
    // 生命周期
    // instantiate:
    //    onLoad
    // .active: true;
    //    onEnable->start()
    // => initialize()
    // ----UIComponentDialogBase:
    // ----   close() 方法  就是触发.active = false并没有销毁
    // .active: false
    //    onDisable();
    // .destroy()
    //    onDestroy();
    public internalbindCCViewData() {
        autoBindEvents(this, { ccviewData: ccviewData });
    }

    @bindEvent(CCViewData.FRAME_SIZE_UPDATE, { dataSource: 'ccviewData', initPriority: 99 })
    protected onFrameResize(
        visibleSizeWidth: number,
        visibleSizeHeight: number,
        frameSizeWidth: number,
        frameSizeHeight: number,
        suggestScale: number,
        saveAreaTop: number
    ) {}

    /**理论上 子类都会 unBindEvetsAll 这里只是保底做一下处理 */
    protected onDisable(): void {
        unBindEvents(this, 'ccviewData');
    }
}
