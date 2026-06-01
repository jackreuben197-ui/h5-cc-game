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
}
