import { GameConfig } from '../../config/GameConfig';
import { traceClass, traceMethod } from '../../core/decorator/LogTrace';
import dlTexasRoomBackground from '../../data/room/texas/load/DLTexasRoomBacground';
import texasGamePersonalSettings from '../../data/room/texas/TexasGamePersonalSettings';
import ccviewData from '../../data/system/CCViewData';
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
        await GameConfig.setNetworkAsync();
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

    @traceMethod({ level: 'debug' })
    static updateFitMode(): void {
        if ((window as any).__H5_KEYBOARD_OPEN__ || (window as any).__H5_KEYBOARD_CLOSING__) return;
        const canvasElement = document.getElementById('GameCanvas');
        const rect = canvasElement?.getBoundingClientRect();
        // 以宿主锁定后的 Canvas CSS 尺寸为准。移动端键盘只改变 visual viewport，
        // 不能再用键盘态 innerHeight 切换适配策略。
        const w = Math.round(rect?.width || canvasElement?.clientWidth || window.innerWidth);
        const h = Math.round(rect?.height || canvasElement?.clientHeight || window.innerHeight);
        if (!w || !h) return;
        const w_h_r = w / h;
        this.tracelog.debug('窗口实际分辨率', w, h);
        const view = cc.view as any;
        if (typeof view.setFrameSize === 'function') {
            view.setFrameSize(w, h);
        } else {
            view._frameSize.width = w;
            view._frameSize.height = h;
        }
        const canvas = cc.Canvas.instance;
        const designW = canvas.designResolution.width;
        const designH = canvas.designResolution.height;
        if (w_h_r > 0.75) {
            cc.view.setDesignResolutionSize(designW, designH, cc.ResolutionPolicy.FIXED_HEIGHT);
        } else {
            cc.view.setDesignResolutionSize(designW, designH, cc.ResolutionPolicy.FIXED_WIDTH);
        }
        cc.view.emit('canvas-resize');
        ccviewData.initData();
    }

    /**
     * 引擎设置
     */
    private setCCC() {
        this.tracelog.debug('set frame rate');
        cc.game.setFrameRate(GameConfig.FRAME_RATE); // FPS 设置
        cc.macro.ENABLE_MULTI_TOUCH = GameConfig.ENABLE_MULTI_TOUCH; // 禁止多点触摸
        // Web 默认按 CSS 像素创建 Canvas，在 Retina/高 DPR 手机上会被浏览器二次放大，
        // 圆形头像和细圆环因此更容易出现锯齿。Cocos Web 会自动将 DPR 上限限制为 2。
        cc.view.enableRetina(true);
        ProcedureInit.guardEngineResizeForKeyboard();
        ProcedureInit.guardEditBoxAutoScroll();
        const isTelegram = !!(window as any).Telegram?.WebApp;
        cc.view.resizeWithBrowserSize(!isTelegram);
    }

    /**
     * 软键盘期间吞掉引擎自身的 resize 适配。
     *
     * iOS Safari 页签内弹出软键盘会压缩 window.innerHeight 并触发 window.resize，
     * 引擎 _resizeEvent（resizeWithBrowserSize 注册的 _resize/_orientationChange
     * 最终都动态查找它）会按键盘态高度重设 cc.game.container 样式并重算适配，
     * 牌桌被压小挤到顶部、下方大面积灰色。standalone（保存到桌面）里键盘是
     * 覆盖式的、innerHeight 不变所以正常——此守卫让浏览器页签获得同样行为。
     * 键盘收起的动画期间也继续吞掉 resize；宿主确认视口恢复后再通过
     * __H5_FORCE_COCOS_REFIT__ 统一恢复，避免收起中间帧再次压扁画布。
     *
     * 宿主 index.html 也装了同一守卫（同一防重标志 __H5_KB_RESIZE_GUARDED__），
     * 先到先包，双保险。
     */
    static guardEngineResizeForKeyboard(): void {
        const view = cc.view as any;
        if (!view || typeof view._resizeEvent !== 'function' || view.__H5_KB_RESIZE_GUARDED__) {
            return;
        }
        const origResizeEvent = view._resizeEvent as (forceOrEvent?: unknown) => void;
        view.__H5_KB_RESIZE_GUARDED__ = true;
        view._resizeEvent = function (this: unknown, forceOrEvent?: unknown) {
            if ((window as any).__H5_KEYBOARD_OPEN__ === true || (window as any).__H5_KEYBOARD_CLOSING__ === true) return;
            const el = document.activeElement;
            if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return;
            return origResizeEvent.call(this, forceOrEvent);
        };
    }

    /**
     * Cocos 2.4.8 Android 的 Web EditBox 会在聚焦 800ms 后执行 smooth scrollIntoView。
     * 全屏游戏没有文档滚动内容，这个滚动只会暴露 GameDiv 外的灰色区域。
     * H5 宿主已通过 __H5_PREPARE_KEYBOARD__ 和容器位移保证输入框可见，因此禁用它。
     */
    static guardEditBoxAutoScroll(): void {
        if (typeof (window as any).__H5_PREPARE_KEYBOARD__ !== 'function') return;
        const implPrototype = (cc.EditBox as any)?._ImplClass?.prototype;
        if (!implPrototype || implPrototype.__H5_KB_SCROLL_GUARDED__) return;
        implPrototype.__H5_KB_SCROLL_GUARDED__ = true;
        implPrototype._adjustWindowScroll = function () {
            (window as any).__H5_PREPARE_KEYBOARD__();
        };
    }
}
