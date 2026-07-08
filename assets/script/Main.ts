import { GameConfig } from './config/GameConfig';
import { ITraceLog, traceClass } from './core/decorator/LogTrace';
import ProcedureManager from './game/procedure/ProcedureManager';
import h5MessageManager from './H5MsgMgr';
import * as MainUtils from './MainUtils';
import viewManager from './views/UIViewManager';

///////////////////////////////////////////////
cc.macro.ENABLE_TRANSPARENT_CANVAS = false;

const { ccclass, property, menu } = cc._decorator;

@ccclass
@traceClass()
@menu('Scripts/Main')
export default class Main extends cc.Component {
    @property(cc.Node)
    private CacheLayer: cc.Node = null;
    @property(cc.Node)
    private Scene: cc.Node = null;
    @property(cc.Node)
    private Dialog: cc.Node = null;
    @property(cc.Node)
    private ToastContainer: cc.Node = null;
    @property(cc.Prefab)
    private ToastPrefab: cc.Prefab = null!;
    @property(cc.Prefab)
    private MaskPrefab: cc.Prefab = null!;
    @property(cc.Node)
    private Prompt: cc.Node = null!;
    //横屏提示
    // static Orientation: cc.Node = null;
    // //重连提示
    // static Reconnect: cc.Node = null;
    @property(cc.Node)
    private Diss: cc.Node = null;
    @property(cc.Node)
    private Preload: cc.Node = null;
    // ////////////////////////////////////调试开关
    // static ShowSeatID: number; //显示seat id
    override async onLoad() {
        // 一键将全局日志级别锁定为 'error'
        // 此时：debug, info, warn 全都自动静音，只有 error 能打出来
        ITraceLog.setGlobalLevel(GameConfig.LOG_LEVEL);
        // 关闭左下角 FPS / DrawCall 统计信息
        cc.debug.setDisplayStats(false);
        this.tracelog.info('游戏启动', cc.sys.os);
        viewManager.init({
            dialogLayer: this.Dialog,
            cacheLayer: this.CacheLayer,
            sceneLayer: this.Scene,
            toastLayer: this.ToastContainer,
            toastPrefab: this.ToastPrefab,
            maskPrefab: this.MaskPrefab,
            preload: this.Preload,
            prompt: this.Prompt
        });
        this.scheduleOnce(() => {
            this.tracelog.debug('屏幕分辨率:', cc.view.getFrameSize().toString());
            this.tracelog.debug('逻辑分辨率:', cc.view.getVisibleSize().toString());
            MainUtils.refreshDiss(this.Diss);
        }, 1);
        //监听 H5 层（Vue/Vite）通过 bridge.js 发来的消息
        h5MessageManager.init();
        await MainUtils.registerH5Listeners();
        // 启动握手：设置 __CC_READY__，等待 H5 发来 h5Ready，回复 ccAck
        h5MessageManager.startHandshake();
    }
    // protected override update(dt: number): void {
    //     UpdateComponent.Instance.Update(dt);
    // }
    override start() {
        ProcedureManager.Init();
    }
}
