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

    static updateFitMode(): void {
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
        cc.view.emit('canvas-resize');
    }

    /**
     * 引擎设置
     */
    private setCCC() {
        this.tracelog.debug('set frame rate');
        cc.game.setFrameRate(GameConfig.FRAME_RATE); // FPS 设置
        cc.macro.ENABLE_MULTI_TOUCH = GameConfig.ENABLE_MULTI_TOUCH; // 禁止多点触摸
        const isTelegram = !!(window as any).Telegram?.WebApp;
        cc.view.resizeWithBrowserSize(!isTelegram);
    }
}
