import * as MainUtils from './MainUtils';
import ProcedureInit from './game/procedure/ProcedureInit';
import { ITraceLog, traceClass } from './core/decorator/LogTrace';
import DevConfig from './config/DevConfig';
import h5MessageManager from './H5MsgMgr';
import viewManager from './views/UIViewManager';
import SoundComponent from './core/SoundComponent';
import ProcedureManager from './game/procedure/ProcedureManager';

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
    /** resize 防抖定时器 */
    private _resizeTimer: number = 0;

    override async onLoad() {
        // 一键将全局日志级别锁定为 'error'
        // 此时：debug, info, warn 全都自动静音，只有 error 能打出来
        ITraceLog.setGlobalLevel(DevConfig.LOG_LEVEL);
        // 关闭左下角 FPS / DrawCall 统计信息
        cc.debug.setDisplayStats(false);
        // 初始化 Telegram WebApp SDK（必须在最开始）
        // TelegramUtils.Instance;
        // // 输出 Telegram 调试信息（在 log 被禁用之前）
        // if (TelegramUtils.Instance.isInTelegram) {
        //     TelegramUtils.Instance.printDebugInfo();
        // }
        // if (!CCTools.getQueryString('log') && GameConfig.IS_PUBLISHED) {
        //     this.tracelog.info = function () {};
        // }
        this.tracelog.info('游戏启动', cc.sys.os);
        // // UI 节点缓存
        // Main.CacheUI = this.node.parent.getChildByName('Cache_UI - UI缓存');
        // Main.Scene = this.node.parent.getChildByName('Scene - 场景');
        // Main.Marquee = this.node.parent.getChildByName('Marquee - 场景上层');
        // Main.Form = this.node.parent.getChildByName('Form - 窗体层');
        // Main.Board = this.node.parent.getChildByName('Board - 遮挡浮窗层');
        // Main.Dialog = this.node.parent.getChildByName('Dialog - 弹窗层');
        // Main.Alert = this.node.parent.getChildByName('Alert - 提示框');
        // Main.Block = this.node.parent.getChildByName('Block - 遮挡');
        // Main.Prompt = this.node.parent.getChildByName('Prompt - 网络菊花层');
        // Main.Toast = this.node.parent.getChildByName('Toast - 提示层');
        // Main.UIPreloading = Main.Block.getChildByName('UIPreloading');
        // Main.Toast_Node = Main.Toast.getChildByName('Toast_Node');
        // Main.Orientation = this.node.parent.getChildByName('Orientation');
        // Main.Reconnect = this.node.parent.getChildByName('Reconnect - 重连');
        // Main.Diss = this.node.parent.getChildByName('Diss - 出界遮挡');
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
        // //UIComponent.Instance.SetPrefabNode(PrefabUI.UIPreloading, Main.UIPreloading);
        this.scheduleOnce(() => {
            this.tracelog.debug('屏幕分辨率:', cc.view.getFrameSize().toString());
            this.tracelog.debug('逻辑分辨率:', cc.view.getVisibleSize().toString());
            MainUtils.refreshDiss(this.Diss);
        }, 1);
        SoundComponent.Instance.initSound();
        //监听 H5 层（Vue/Vite）通过 bridge.js 发来的消息
        h5MessageManager.init();
        await MainUtils.registerH5Listeners();
        // 启动握手：设置 __CC_READY__，等待 H5 发来 h5Ready，回复 ccAck
        h5MessageManager.startHandshake();
        // 监听窗口大小变化（F12 开关、窗口拖拽等）
        window.addEventListener('resize', this._onWindowResize.bind(this));
    }

    /**
     * 窗口大小变化时重新适配（防抖 200ms）
     *
     * 不使用 resizeWithBrowserSize（会和 Canvas.fitCanvasToWindow 互相覆盖导致 _frameSize 过时），
     * 而是手动更新容器 DOM，直接设置 _frameSize 并调用 setDesignResolutionSize。
     */
    private _onWindowResize(): void {
        clearTimeout(this._resizeTimer);
        this._resizeTimer = window.setTimeout(() => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            this.tracelog.info('[Main] 窗口 resize，重新适配', w, h);
            // 更新容器 DOM（预览模式下容器不会自动跟随窗口）
            const content = document.getElementById('content');
            if (content) {
                content.style.width = w + 'px';
                content.style.height = h + 'px';
            }
            const gameDiv = document.getElementById('GameDiv');
            if (gameDiv) {
                gameDiv.style.width = w + 'px';
                gameDiv.style.height = h + 'px';
            }
            const wraps = document.getElementsByClassName('contentWrap');
            for (let i = 0; i < wraps.length; i++) {
                (wraps[i] as HTMLElement).style.width = w + 'px';
                (wraps[i] as HTMLElement).style.height = h + 'px';
            }
            // 等一帧让 DOM 重排完成，再更新引擎画布
            requestAnimationFrame(() => {
                ProcedureInit.updateFitMode();
                if (this.Diss && this.Diss.isValid) {
                    MainUtils.refreshDiss(this.Diss);
                }
            });
        }, 200);
    }
    // protected override update(dt: number): void {
    //     UpdateComponent.Instance.Update(dt);
    // }
    override start() {
        ProcedureManager.Init();
    }
}
