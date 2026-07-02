import { GameConfig } from './config/GameConfig';
import { ITraceLog, traceClass } from './core/decorator/LogTrace';
import ProcedureInit from './game/procedure/ProcedureInit';
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
    /** resize 防抖定时器 */
    private _resizeTimer: number = 0;

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
        // 监听窗口大小变化（F12 开关、窗口拖拽等）
        window.addEventListener('resize', this._onWindowResize.bind(this));
    }

    /**
     * 窗口大小变化时重新适配（防抖 200ms）
     *
     * 引擎已启用 resizeWithBrowserSize(true)，会按新视口自动重新适配 canvas
     * （保持设计分辨率比例，键盘弹出时整体上移而非变形）。
     * 这里只负责按宽高比动态切换 FIXED_WIDTH / FIXED_HEIGHT 适配策略，
     * 并刷新预览模式下未跟随窗口的容器 DOM。
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
                // TG 环境下，键盘适配完全由 H5 层 focusin/focusout 控制，CC 层不调 updateFitMode。
                // 避免 race condition：H5 focusout 后 200ms 标志被清，但 window.resize 可能更晚触发，
                // 导致 CC 误判键盘已收起 → 调 setDesignResolutionSize 污染 cocos 内部状态
                // → 第二次键盘弹出时画面变形。
                const isTelegram = !!(window as any).Telegram?.WebApp;
                if (!isTelegram) {
                    ProcedureInit.updateFitMode();
                }
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
