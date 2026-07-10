import { traceClass } from '../core/decorator/LogTrace';
import UIComponentBase from '../views/base/UIComponentBase';
import UIComponentDialogBase from '../views/base/UIComponentDialogBase';
import AssetManager, { PreloadParams } from './loader/AssetManager';
import { UIPrefabComponent, UIPrefabComponentType, UIPrefabDialog, UIPrefabDialogType, UIPrefabScene, UIPrefabSceneType } from './UIPrefabDefinition';
import Mask from './widget/Mask';
import ToastNode from './widget/ToastNode';

const uniquemaskID = 'ithinktisinotshouldbedupilcatednodename';

export interface IToastConfig {
    /** 容器起始位置 */
    contentStartPosition?: number;
    /** 渐入的偏移距离*/
    fadeInOffSetDis?: number;
    /** 节点间隔距离*/
    spaceDis?: number;
    /** 缓冲出现时间(解决文本自适应有异步时间差)*/
    bufferDuration?: number;
    /** 渐入时间*/
    fadeInDuration?: number;
    /** 停留时间*/
    stayDuration?: number;
    /** 消失时间*/
    fadeOutDuration?: number;
}

@traceClass()
class ToastManager {
    private _toastLayer: cc.Node = null!;
    private _toastPrefab: cc.Prefab;

    constructor(parantLayer: cc.Node, toastPrefab: cc.Prefab) {
        this._toastPrefab = toastPrefab;
        this._toastLayer = new cc.Node('sequenceContent');
        this._toastLayer.parent = parantLayer;
        this._fadeDuration =
            this._toastConfig.bufferDuration + this._toastConfig.fadeInDuration + this._toastConfig.stayDuration + this._toastConfig.fadeOutDuration;
        this._resetToastPosition();
    }

    private _toastConfig: IToastConfig = {
        //容器起始位置
        contentStartPosition: 350,
        //渐入的偏移距离
        fadeInOffSetDis: 100,
        //节点间隔距离
        spaceDis: 20,
        //缓冲出现时间(解决文本自适应有异步时间差)
        bufferDuration: 0.1,
        //渐入时间
        fadeInDuration: 0.2,
        //停留时间
        stayDuration: 2,
        //消失时间
        fadeOutDuration: 0.3
    };
    private _toastPool: cc.Node[] = [];
    private _sequenceToasts: ToastNode[] = [];
    private _prevToast: ToastNode = null!;
    private _fadeDuration: number;

    private _resetToastPosition() {
        this._toastLayer.y = this._toastConfig.contentStartPosition;
    }

    // showToast 显示提示
    public showToast(content: string, customConfig?: IToastConfig, cb?: () => void) {
        //防止重复提示
        // if (content == this.prevContent) return;
        // this.prevContent = content;
        let toast: cc.Node = this._getToast();
        if (toast) {
            let toastNode = toast.getComponent(ToastNode);
            toast.active = true;
            toast.parent = this._toastLayer;
            toast.opacity = 0;
            //toast_script.setLabel(i18nMgr._getLabel(content));
            let config = this._toastConfig;
            if (customConfig)
                config = {
                    ...this._toastConfig,
                    ...customConfig
                };
            toastNode.setLabel(content);
            if (this._sequenceToasts.length == 0) {
                this._resetToastPosition();
                toastNode.posY = 0;
                toast.y = toastNode.posY - config.fadeInOffSetDis;
                cc.tween(toast)
                    .to(config.bufferDuration, { opacity: 255 })
                    .to(config.fadeInDuration, { y: toastNode.posY })
                    .delay(config.stayDuration)
                    .to(config.fadeOutDuration, { opacity: 0 })
                    .call(async () => {
                        this._fadeComplete();
                        await this._sequenceMove(config);
                        if (cb) cb();
                    })
                    .start();
            } else {
                let step: number = config.spaceDis + (this._prevToast.node.height + toast.height) / 2;
                // this.tracelog.debug('showToast. step', step, this._prevToast.node.height);
                toastNode.posY = this._prevToast.posY - step;
                toastNode.markFadeOriTime = new Date().getTime();
                toast.y = toastNode.posY - config.fadeInOffSetDis;
                cc.tween(toast)
                    .to(config.bufferDuration, { opacity: 255 })
                    .to(config.fadeInDuration, { y: toastNode.posY })
                    .delay(config.stayDuration)
                    .to(config.fadeOutDuration, { opacity: 0 })
                    .call(() => {
                        if (cb) cb();
                    })
                    .start();
            }
            this._prevToast = toastNode;
            this._sequenceToasts.push(toastNode);
        }
    }

    //渐入渐出完成
    private _fadeComplete() {
        let toast = this._sequenceToasts.shift();
        toast.reset();
        toast.node.parent = null;
        this._toastPool.push(toast.node);
        //判断所有完成
        if (this._sequenceToasts.length == 0) {
            this._prevToast = null;
            this._toastLayer.stopAllActions();
        }
    }

    private async _sequenceMove(config: IToastConfig) {
        while (this._sequenceToasts.length) {
            await this._moveStep(config);
            this._fadeComplete();
        }
    }

    /**
     *  每步运动
     */
    private async _moveStep(config: IToastConfig) {
        return new Promise((reslove, reject) => {
            let toast_script = this._sequenceToasts[0];
            let toast = toast_script.node;
            let target = config.contentStartPosition - toast_script.posY;
            cc.tween(this._toastLayer)
                .to(0.2, { y: target })
                .call(() => {
                    //判断时长，超过变化时长就算完成,否在需要补充停留时间
                    let disTime = (new Date().getTime() - toast_script.markFadeOriTime) / 1000;
                    let passTime = this._fadeDuration - disTime;
                    if (passTime <= 0) {
                        reslove(0);
                    } else {
                        cc.tween(toast)
                            .delay(passTime)
                            .call(() => {
                                reslove(0);
                            })
                            .start();
                    }
                })
                .start();
        });
    }

    private _getToast() {
        if (this._toastPool.length) return this._toastPool.shift();
        return cc.instantiate(this._toastPrefab);
    }
}

@traceClass()
class UIViewManager {
    private constructor() {}

    private static _instance: UIViewManager = null;
    public static get instance(): UIViewManager {
        if (!this._instance) {
            this._instance = new UIViewManager();
        }
        return this._instance;
    }
    //场景
    private _sceneLayer: cc.Node = null;
    private _curretScene: UIPrefabSceneType;
    private _scenesPool: Map<UIPrefabSceneType, UIComponentBase> = new Map();
    //对话框
    private _dialogLayer: cc.Node = null;
    private _displayedDialogs: UIPrefabDialogType[] = [];
    private _curretDialog: UIPrefabDialogType = null!;
    private _dialogsPool: Map<UIPrefabDialogType, UIComponentDialogBase> = new Map();
    //缓存
    private _caceLayer: cc.Node = null;
    //遮罩
    private _maskPrefab: cc.Prefab = null;
    //提示层
    private _toastManayer: ToastManager;
    //预加载界面
    private _preload: cc.Node;
    //Laoding界面（网络层）
    private _prompt: cc.Node;

    public init(param: {
        dialogLayer: cc.Node;
        cacheLayer: cc.Node;
        sceneLayer: cc.Node;
        toastLayer: cc.Node;
        toastPrefab: cc.Prefab;
        maskPrefab: cc.Prefab;
        preload: cc.Node;
        prompt: cc.Node;
    }) {
        this._caceLayer = param.cacheLayer;
        this._dialogLayer = param.dialogLayer;
        this._sceneLayer = param.sceneLayer;
        this._maskPrefab = param.maskPrefab;
        this._preload = param.preload;
        this._prompt = param.prompt;
        this._toastManayer = new ToastManager(param.toastLayer, param.toastPrefab);
    }

    public get dialogLayer(): cc.Node {
        return this._dialogLayer;
    }

    // switchScene 切换场景
    public async switchScene<K extends UIPrefabSceneType>(
        key: K,
        param: InstanceType<(typeof UIPrefabScene)[K]['UIType']> extends UIComponentBase<infer P> ? P : any
    ) {
        try {
            let ui = this._scenesPool.get(key) as UIComponentBase<any>;
            if (!ui) {
                const uiprefab = UIPrefabScene[key];
                const asset = await AssetManager.getOrLoad(uiprefab.Bundle, uiprefab.Path, cc.Prefab);
                const uiNode = cc.instantiate(asset);
                ui = uiNode.getComponent(uiprefab.UIType as any);
                if (!ui) {
                    this.tracelog.error('switchScene', uiprefab.Name, '缺少脚本');
                    return;
                }
            }
            ui.node.active = true;
            ui.node.parent = this._sceneLayer;
            ui.initialize(param);
            this._scenesPool.set(key, ui);
            // 老场景缓存
            if (this._curretScene) {
                const s = this._scenesPool.get(this._curretScene);
                if (s) {
                    s.node.active = false;
                    s.node.stopAllActions();
                    s.node.parent = this._caceLayer;
                    this._curretScene = key;
                }
            }
            ui.scheduleOnce(() => {
                this._hidePreloading();
            }, 0);
        } catch (e) {
            this.tracelog.error('switchScene', e);
        }
    }

    // openDialog 打开对话框
    public async openDialog<K extends UIPrefabDialogType>(
        key: K,
        param: InstanceType<(typeof UIPrefabDialog)[K]['UIType']> extends UIComponentDialogBase<infer P> ? P : any,
        masked: boolean = true,
        directShow: boolean = true
    ) {
        try {
            if (this._curretDialog == key) {
                this.tracelog.warn('dupicate open dialog', key);
            }
            let ui = this._dialogsPool.get(key) as UIComponentDialogBase<any>;
            if (!ui) {
                this.tracelog.debug('no instance create new one', key);
                const uiprefab = UIPrefabDialog[key];
                const asset = await AssetManager.getOrLoad(uiprefab.Bundle, uiprefab.Path, cc.Prefab);
                const uiNode = cc.instantiate(asset);
                ui = uiNode.getComponent(UIComponentDialogBase);
                if (!ui) {
                    this.tracelog.error('openDialog', uiprefab.Name, '缺少脚本');
                    return;
                }
                //添加
                const maskLayer = cc.instantiate(this._maskPrefab);
                uiNode.insertChild(maskLayer, 0);
                maskLayer.name = uniquemaskID;
                let maskNode = maskLayer.getComponent(Mask);
                // UIComponentBaseDialog使用该方法关闭窗口
                ui.setCloseDialogFunction(() => {
                    this.closeDialog(key);
                });
                if (maskNode) {
                    // mask层和ui本身的close方法对齐, 可以被dialog子类重写
                    maskNode.closeCallback = () => {
                        ui.close();
                    };
                }
            }
            ui.node.active = directShow;
            ui.node.parent = this._dialogLayer;
            const maskdoe = ui.getComponentInChildren(uniquemaskID);
            if (maskdoe) {
                maskdoe.node.active = masked;
            }
            ui.initialize(param);
            this._displayedDialogs.push(key);
            this._curretDialog = key;
            this._dialogsPool.set(key, ui);
        } catch (e) {
            this.tracelog.error('openDialog', e);
        }
    }

    // closeDialog 关闭对话框
    public closeDialog(key: UIPrefabDialogType, param?: any) {
        for (let i = this._displayedDialogs.length - 1; i >= 0; i--) {
            let uikey = this._displayedDialogs[i];
            if (uikey == key) {
                const ui = this._dialogsPool.get(uikey);
                ui.node.parent = this._caceLayer;
                ui.node.active = false;
                this._displayedDialogs.splice(i, 1);
                if (this._displayedDialogs.length > 0) {
                    this._curretDialog = this._displayedDialogs[this._displayedDialogs.length - 1];
                } else {
                    this._curretDialog = null;
                }
                this.tracelog.debug('closeDialog. dialogs left', this._displayedDialogs.length);
                break;
            }
        }
    }

    // showToast 显示提示
    public showToast(content: string, customConfig?: IToastConfig, cb?: () => void) {
        this._toastManayer.showToast(content, customConfig, cb);
    }

    // showPreloading 加载资源进度条
    public showPreloading(param: PreloadParams) {
        let preload;
        preload = this._preload.children[0].getComponent(UIPrefabComponent.Preloading.UIType);
        this._preload.active = true;
        preload.onShow(param);
    }

    // 把加载最终结果页显示一下
    public showPreloadingLayer() {
        this._preload.children[0].active = true;
    }

    // hidePreloading 隐藏进度条
    public hidePreloading() {
        this._hidePreloading();
    }

    private _hidePreloading() {
        this._preload.children[0].active = false;
    }

    /** showPrompting 显示网络请求 */
    public showPrompting() {
        let prompt;
        prompt = this._prompt.children[0].getComponent(UIPrefabComponent.Prompt.UIType);
        this._prompt.active = true;
        prompt.initialize();
    }

    /* hidePrompting 隐藏网络请求*/
    public hidePrompting() {
        this._prompt.children[0].active = false;
    }

    /**
     * 传入配置表的 Key，count 不传默认返回包含 1 个元素的数组
     */
    public async instantiate<K extends UIPrefabComponentType>(key: K, count?: number): Promise<InstanceType<(typeof UIPrefabComponent)[K]['UIType']>[]>;

    /**
     * 直接传入 cc.Prefab 和组件类，count 不传默认返回包含 1 个元素的数组
     */
    public async instantiate<P extends cc.Component>(prefab: cc.Prefab, componentClass: { new (): P }, count?: number): Promise<P[]>;

    // ==================== 3. 统一的底层核心实现 ====================
    public async instantiate(firstParam: any, secondParam?: any, thirdParam?: any): Promise<any[]> {
        try {
            let asset: cc.Prefab | null = null;
            let targetComponentClass: any = null;
            let count = 1; // 默认生产 1 个
            // 动态分支判定
            if (typeof firstParam === 'string') {
                // ---- 通道 A：配置表 ----
                const uiprefab = UIPrefabComponent[firstParam as UIPrefabComponentType];
                asset = await AssetManager.getOrLoad(uiprefab.Bundle, uiprefab.Path, cc.Prefab);
                targetComponentClass = uiprefab.UIType;
                count = typeof secondParam === 'number' ? secondParam : 1; // 此时第二个参数是 count
            } else {
                // ---- 通道 B：原生传入 ----
                asset = firstParam;
                targetComponentClass = secondParam;
                count = typeof thirdParam === 'number' ? thirdParam : 1; // 此时第三个参数是 count
            }
            if (!asset || !targetComponentClass) {
                throw new Error(`[UIViewManager] instantiate Missing asset or component class.`);
            }
            const results: any[] = [];
            for (let i = 0; i < count; i++) {
                const uiNode = cc.instantiate(asset);
                const ui = uiNode.getComponent(targetComponentClass);
                if (!ui) {
                    throw new Error(`[UIViewManager] Component not found on instantiated node at index ${i}.`);
                }
                results.push(ui);
            }
            return results;
        } catch (e) {
            this.tracelog.error('instantiate', e);
            throw e;
        }
    }
}

const viewManager = UIViewManager.instance;

export default viewManager;
