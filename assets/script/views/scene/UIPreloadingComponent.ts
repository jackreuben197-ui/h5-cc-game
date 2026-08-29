import { autoBindEvents, bindEvent, unBindEventsAll } from '../../core/decorator/DataBind';
import { traceClass } from '../../core/decorator/LogTrace';
import ccviewData, { CCViewData } from '../../data/system/CCViewData';
import AssetManager, { BUNDLE_RESOURCES, DynamicLoadDefinition, PreloadDefinition, PreloadParams } from '../loader/AssetManager';

const { ccclass, property, menu } = cc._decorator;

function isDynamicLoad(item: PreloadDefinition | DynamicLoadDefinition): item is DynamicLoadDefinition {
    return (item as DynamicLoadDefinition).AsyncFunc !== undefined;
}

@ccclass
@traceClass()
@menu('Scene/UIPreloadingComponent')
export default class UIPreloadingComponent extends cc.Component {
    /**
     * 节点|组件 定义
     */
    @property(cc.ProgressBar)
    progress_bar: cc.ProgressBar = null;
    @property(cc.Label)
    progress_label: cc.Label = null;
    @property(cc.Label)
    progress_desc: cc.Label = null;
    @property({ type: cc.Sprite, displayName: '背景 Sprite' })
    bg_sprite: cc.Sprite = null;
    @property({ type: cc.SpriteFrame, displayName: '竖屏背景' })
    bg_portrait: cc.SpriteFrame = null;
    @property({ type: cc.SpriteFrame, displayName: '宽屏(PC)背景' })
    bg_wide: cc.SpriteFrame = null;
    //上一次进度
    private prevPercent: number = 0;
    private asset_count: number = 0;

    protected onEnable(): void {
        autoBindEvents(this, { ccviewData: ccviewData });
    }

    protected onDisable(): void {
        unBindEventsAll(this);
    }

    @bindEvent(CCViewData.FRAME_SIZE_UPDATE, { dataSource: 'ccviewData', initPriority: 20 })
    private onFrameSizeUpdate(): void {
        this.fitBackground();
    }

    private fitBackground(): void {
        const sprite = this.bg_sprite;
        if (!sprite) return;
        const sf = ccviewData.isWideLayout ? this.bg_wide : this.bg_portrait;
        if (!sf) return;
        sprite.spriteFrame = sf;
        const node = sprite.node;
        const texW = sf.getOriginalSize().width;
        const texH = sf.getOriginalSize().height;
        const vs = cc.view.getVisibleSize();
        const targetW = vs.width || 1242;
        const targetH = vs.height || 2688;
        if (!texW || !texH || !targetW || !targetH) return;
        const widget = node.getComponent(cc.Widget);
        if (Math.abs(texW / texH - targetW / targetH) < 0.01) {
            if (widget) widget.enabled = true;
            node.setScale(1, 1);
            return;
        }
        if (widget) widget.enabled = false;
        node.setContentSize(texW, texH);
        const scale = Math.max(targetW / texW, targetH / texH);
        node.setScale(scale, scale);
    }

    setProgress(progress: number) {
        this.progress_bar.progress = progress;
        this.setLabel(`loading...${(progress * 100) ^ 0}%`);
        this.prevPercent = progress;
    }

    setLabel(content: string) {
        this.progress_label.string = content;
    }

    setDesc(content: string) {
        this.progress_desc.string = content;
    }

    async onShow(param: PreloadParams) {
        this.setProgress(0);
        const parts = param.preloadDefinition.length;
        let part = Math.round(10000 / parts) / 10000;
        try {
            const parallelTasks: Promise<void>[] = [];
            const sequentialDefinitions: { def: PreloadDefinition; index: number }[] = [];
            for (let i = 0; i < parts; i++) {
                const definition = param.preloadDefinition[i];
                if (isDynamicLoad(definition)) {
                    // 发现异步函数，立刻触发执行（开始并行），并收集它的 Promise
                    parallelTasks.push(definition.AsyncFunc());
                } else {
                    // 发现普通资源，先存起来，等下统一走串行流程
                    sequentialDefinitions.push({ def: definition, index: i });
                }
            }
            const runSequentialQueue = async () => {
                for (const item of sequentialDefinitions) {
                    // 在这个独立的轨道里，普通资源一个接一个地 await 乖乖排队
                    await this.loadResources(item.def, param.stopProgress, item.index * part, part);
                }
            };
            await Promise.all([...parallelTasks, runSequentialQueue()]);
            param.complete?.();
        } catch (e) {
            param.error?.(e instanceof Error ? e : new Error(String(e)));
        }
    }

    private loadResources(def: PreloadDefinition, stopProgress: boolean, pastProgress: number, totalPercent: number): Promise<void> {
        return new Promise((resovle, reject) => {
            if (def.bundle == BUNDLE_RESOURCES) {
                cc.resources.loadDir(
                    def.dir,
                    (finish: number, total: number, item: cc.AssetManager.RequestItem) => {
                        if (stopProgress) return;
                        let percent = totalPercent * (finish / total) + pastProgress;
                        this.asset_count = total;
                        //纠错，保证当前进度不会小于上次进度
                        percent = Math.max(percent, this.prevPercent);
                        this.setProgress(percent);
                        //this.tracelog.info("=====>", BUNDLE_RESOURCES, item.url);
                    },
                    (error: Error, assets: cc.Asset[]) => {
                        if (error) {
                            this.tracelog.warn(`资源加载失败:${def.bundle}/${def.dir}`);
                            reject(error as Error);
                            return;
                        }
                        this.tracelog.info(`资源加载完成:${def.bundle}/${def.dir}`, assets.length);
                        if (def.collection) {
                            AssetManager.assetForeach(assets, def.bundle);
                        }
                        resovle();
                    }
                );
                return;
            }
            cc.assetManager.loadBundle(def.bundle, (err: Error, bundle: cc.AssetManager.Bundle) => {
                if (err) {
                    cc.log('load bundle error:', def.bundle);
                    if (err) {
                        this.tracelog.warn(`资源加载失败:${def.bundle}/${def.dir}`);
                        reject(err);
                        return;
                    }
                    return;
                }
                bundle.loadDir(
                    def.dir,
                    (finish: number, total: number, item: cc.AssetManager.RequestItem) => {
                        if (stopProgress) return;
                        let percent = totalPercent * (finish / total) + pastProgress;
                        //纠错，保证当前进度不会小于上次进度
                        percent = Math.max(percent, this.prevPercent);
                        this.setProgress(percent);
                        // this.tracelog.info("=====>", def.bundle, item.url);
                    },
                    (error: Error, assets: cc.Asset[]) => {
                        if (error) {
                            this.tracelog.warn(`资源加载失败:${def.bundle}/${def.dir}`);
                            reject(error);
                            return;
                        }
                        this.setProgress(1);
                        this.tracelog.info(`资源加载完成:${def.bundle}/${def.dir}`, assets.length);
                        if (def.collection) {
                            AssetManager.assetForeach(assets, def.bundle);
                        }
                        resovle();
                    }
                );
            });
        });
    }
}
