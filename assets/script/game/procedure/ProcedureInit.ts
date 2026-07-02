import { GameConfig } from '../../config/GameConfig';
import { traceClass } from '../../core/decorator/LogTrace';
import dlTexasRoomBackground from '../../data/room/texas/load/DLTexasRoomBacground';
import texasGamePersonalSettings from '../../data/room/texas/TexasGamePersonalSettings';
import h5MessageManager from '../../H5MsgMgr';
import { i18nMgr } from '../../i18n/i18nMgr';
import * as MainUtils from '../../MainUtils';
import { DynamicLoadDefinition, PreloadDefinitionGame, PreloadDefinitionSound } from '../../views/loader/AssetManager';
import viewManager from '../../views/UIViewManager';
import ProcedureBase from './ProcedureBase';

@traceClass()
export default class ProcedureInit extends ProcedureBase {
    Name: string = 'ProcedureInit';
    private _resolveDone: (v: any) => void;
    private _waitLoadingCompletePromise = new Promise(resolve => (this._resolveDone = resolve));

    async lateEnter(param?: any) {
        super.lateEnter(param);
        this.setCCC();
        this.setFit();
        //解析 语言配置
        i18nMgr.initLanguage();
        await i18nMgr.loadAndRefreshConfig();
        // 已加载过牌桌资源则隐藏首次加载提示
        // if (GC.localStore.getItem(StorageKey.TextureResourceLoaded) === 1) {
        //     const firstloadLabel = cc.find('Canvas/Block - 遮挡/UIPreloading/progress_node/firstload_label');
        //     if (firstloadLabel) firstloadLabel.active = false;
        // }
        MainUtils.loadWebSDK();
        // 引擎设置完成，等待 H5 层发送消息驱动后续流程
        this.tracelog.debug('等待 H5 层指令...');
        const loadTexasBg: DynamicLoadDefinition = {
            AsyncFunc: async () => {
                dlTexasRoomBackground.getBackground(texasGamePersonalSettings.deskType);
                return;
            }
        };
        //显示房间进入loading
        viewManager.showPreloading({
            preloadDefinition: [PreloadDefinitionGame, PreloadDefinitionSound, loadTexasBg],
            complete: () => {
                this.tracelog.debug('ProcedureInit 结束，资源加载完全');
                this._resolveDone(true);
            },
            error: () => {
                this.tracelog.error('ProcedureInit show preloading error');
            }
        });
    }

    async Leave() {
        h5MessageManager.sendToH5('h5Hide', 1);
        await this._waitLoadingCompletePromise;
        super.Leave();
    }

    /**
     * 设置适配
     */
    private setFit(): void {
        ProcedureInit.updateFitMode();
    }

    /**
     * 检测当前是否处于 Telegram 环境且软键盘已弹出。
     *
     * ⚠️ 主信号：H5 层 focusin/focusout 驱动的 window.__TG_KEYBOARD_OPEN__ 标志
     *    （DOM 焦点事件，跟物理键盘状态强绑定，不受机型/屏幕高度/键盘高度影响）
     *
     * 替代了之前的 3 路阈值判断（SDK viewportHeight 差值 + visualViewport + innerHeight/screen.height）：
     * 阈值 0.6 在大屏机型（iPhone 16 Pro，screen.height≈874）上会踩边界失效——键盘弹出后
     * innerHeight/screen.height 可能 ≈0.61~0.65 > 0.6，导致守卫不命中、画面变形。
     *
     * 标志由 H5 层 setupTelegramKeyboardFix 维护：
     *  - focusin（input/textarea 获得焦点）→ true
     *  - focusout（延迟 200ms，input 间切换不触发）→ false
     *
     * 标准浏览器（Safari/Chrome）无 window.Telegram.WebApp，第一步 return false，
     * 不影响现有 Safari/Chrome 软键盘弹出后的适配逻辑。
     */
    private static isTelegramKeyboardOpen(): boolean {
        const tg = (window as any).Telegram?.WebApp;
        if (!tg) return false;
        return (window as any).__TG_KEYBOARD_OPEN__ === true;
    }

    /**
     * 根据当前窗口宽高比重新计算适配模式并直接应用
     *
     * Telegram 键盘守卫：Telegram 中键盘弹出会同时触发 viewportChanged + window.resize，
     * 双重信号让本方法重算适配策略导致画面变形。检测到 Telegram 键盘弹出时直接 return，
     * 让 CC 跟随 iOS Safari 路径（完全不响应，由浏览器整体上移 canvas）。
     * 标准浏览器（Safari/Chrome）无 Telegram SDK，永远不命中守卫，行为保持不变。
     */
    static updateFitMode(): void {
        if (ProcedureInit.isTelegramKeyboardOpen()) return;
        const w = window.innerWidth;
        const h = window.innerHeight;
        const w_h_r = w / h;
        this.tracelog.debug('窗口实际分辨率', w, h);
        const view = cc.view as any;
        view._frameSize.width = w;
        view._frameSize.height = h;
        const canvas = cc.Canvas.instance;
        const designW = canvas.designResolution.width;
        const designH = canvas.designResolution.height;
        if (w_h_r > 0.63) {
            cc.view.setDesignResolutionSize(designW, designH, cc.ResolutionPolicy.FIXED_HEIGHT);
        } else {
            cc.view.setDesignResolutionSize(designW, designH, cc.ResolutionPolicy.FIXED_WIDTH);
        }
        // 触发 Widget 重新对齐：
        // setDesignResolutionSize 只发出 "design-resolution-changed"，
        // 而 CCWidgetManager 监听的是 "canvas-resize"，需要手动补发
        cc.view.emit('canvas-resize');
    }

    /**
     * 引擎设置
     */
    private setCCC() {
        this.tracelog.debug('set frame rate');
        cc.game.setFrameRate(GameConfig.FRAME_RATE); // FPS 设置
        cc.macro.ENABLE_MULTI_TOUCH = GameConfig.ENABLE_MULTI_TOUCH; // 禁止多点触摸
        // 启用引擎内置 resize 监听：键盘弹出时由引擎按新视口重新适配 canvas，
        // 保持设计分辨率比例，整体上移而非变形（与 cocos_release 行为一致）。
        // 自定义键盘防御（固定 canvas 高度 + transform 上移）会破坏 canvas
        // 内部渲染分辨率与 CSS 显示尺寸的同步，导致画面被压扁变形。
        //
        // ⚠️ Telegram 环境下禁用：iOS Telegram 键盘弹出会触发 window.resize，cocos 自己的
        // resize 监听会用 window.innerHeight=476 重新算 canvas 内部状态（_surfaceSize 等），
        // 导致画面变形。CC 层用 _onWindowResize + updateFitMode 守卫手动处理 resize，
        // 不需要 cocos 自己监听。标准浏览器（Safari/Chrome）保持启用，行为不变。
        const isTelegram = !!(window as any).Telegram?.WebApp;
        cc.view.resizeWithBrowserSize(!isTelegram);
    }
}
