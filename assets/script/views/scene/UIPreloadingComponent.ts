import { autoBindEvents, bindEvent, unBindEventsAll } from '../../core/decorator/DataBind';
import { traceClass } from '../../core/decorator/LogTrace';
import ccviewData, { CCViewData } from '../../data/system/CCViewData';
import AssetManager, { BUNDLE_RESOURCES, DynamicLoadDefinition, PreloadDefinition, PreloadParams } from '../loader/AssetManager';

const { ccclass, property, menu } = cc._decorator;

function isDynamicLoad(item: PreloadDefinition | DynamicLoadDefinition): item is DynamicLoadDefinition {
    return (item as DynamicLoadDefinition).AsyncFunc !== undefined;
}

const TEXT_BOTTOM_PORTRAIT = 1404;
const TEXT_BOTTOM_WIDE = 960;
const BAR_WIDTH_PORTRAIT = 900;
const BAR_WIDTH_WIDE = 1400;
const MIN_PROGRESS_DURATION = 2;

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
    @property({ type: cc.Node, displayName: '进度区域' })
    progress_node: cc.Node = null;
    @property({ type: cc.Node, displayName: '进度条底' })
    progress_track: cc.Node = null;
    //上一次进度
    private prevPercent: number = 0;
    private shownPercent: number = 0;
    private resolveShownComplete: (() => void) | null = null;
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
        const wide = ccviewData.isWideLayout;
        const sf = wide ? this.bg_wide : this.bg_portrait;
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
        const scale = Math.max(targetW / texW, targetH / texH);
        if (Math.abs(texW / texH - targetW / targetH) < 0.01) {
            if (widget) widget.enabled = true;
            node.setScale(1, 1);
        } else {
            if (widget) widget.enabled = false;
            node.setContentSize(texW, texH);
            node.setScale(scale, scale);
        }
        const textBottom = wide ? TEXT_BOTTOM_WIDE : TEXT_BOTTOM_PORTRAIT;
        this.layoutProgress(wide, (texH / 2 - textBottom) * scale);
    }

    private layoutProgress(wide: boolean, anchorY: number): void {
        if (!this.progress_node) return;
        this.progress_node.y = anchorY;
        const width = wide ? BAR_WIDTH_WIDE : BAR_WIDTH_PORTRAIT;
        const half = width / 2;
        if (this.progress_bar) {
            this.progress_bar.node.width = width;
            this.progress_bar.node.x = -half;
            this.progress_bar.totalLength = width;
        }
        if (this.progress_track) {
            this.progress_track.width = width;
            this.progress_track.x = half;
        }
        if (this.progress_desc) this.progress_desc.node.x = -half;
        if (this.progress_label) this.progress_label.node.x = half;
    }

    setProgress(progress: number) {
        this.prevPercent = Math.min(Math.max(progress, this.prevPercent), 1);
    }

    private resetProgress(): void {
        this.prevPercent = 0;
        this.shownPercent = 0;
        this.renderProgress(0);
    }

    private renderProgress(progress: number): void {
        this.progress_bar.progress = progress;
        this.setLabel(`${(progress * 100) ^ 0}%`);
    }

    private waitShownComplete(): Promise<void> {
        if (this.shownPercent >= 1) return Promise.resolve();
        return new Promise(resolve => (this.resolveShownComplete = resolve));
    }

    protected update(dt: number): void {
        if (this.shownPercent >= this.prevPercent) return;
        this.shownPercent = Math.min(this.prevPercent, this.shownPercent + dt / MIN_PROGRESS_DURATION);
        this.renderProgress(this.shownPercent);
        if (this.shownPercent >= 1 && this.resolveShownComplete) {
            const resolve = this.resolveShownComplete;
            this.resolveShownComplete = null;
            resolve();
        }
    }

    setLabel(content: string) {
        this.progress_label.string = content;
    }

    setDesc(content: string) {
        this.progress_desc.string = content;
    }

    async onShow(param: PreloadParams) {
        this.resetProgress();
        const definitions = param.preloadDefinition;
        const fractions: number[] = definitions.map(() => 0);
        const report = (index: number, fraction: number) => {
            if (param.stopProgress) return;
            fractions[index] = Math.max(fractions[index], Math.min(fraction, 1));
            const percent = fractions.reduce((sum, f) => sum + f, 0) / fractions.length;
            this.setProgress(percent);
        };
        try {
            const parallelTasks: Promise<void>[] = [];
            const sequentialDefinitions: { def: PreloadDefinition; index: number }[] = [];
            for (let i = 0; i < definitions.length; i++) {
                const definition = definitions[i];
                if (isDynamicLoad(definition)) {
                    // 发现异步函数，立刻触发执行（开始并行），并收集它的 Promise
                    parallelTasks.push(definition.AsyncFunc().then(() => report(i, 1)));
                } else {
                    // 发现普通资源，先存起来，等下统一走串行流程
                    sequentialDefinitions.push({ def: definition, index: i });
                }
            }
            const runSequentialQueue = async () => {
                for (const item of sequentialDefinitions) {
                    // 在这个独立的轨道里，普通资源一个接一个地 await 乖乖排队
                    await this.loadResources(item.def, fraction => report(item.index, fraction));
                }
            };
            await Promise.all([...parallelTasks, runSequentialQueue()]);
            if (!param.stopProgress) {
                this.setProgress(1);
                await this.waitShownComplete();
            }
            param.complete?.();
        } catch (e) {
            param.error?.(e instanceof Error ? e : new Error(String(e)));
        }
    }

    private loadResources(def: PreloadDefinition, onProgress: (fraction: number) => void): Promise<void> {
        return new Promise((resolve, reject) => {
            const onComplete = (error: Error, assets: cc.Asset[]) => {
                if (error) {
                    this.tracelog.warn(`资源加载失败:${def.bundle}/${def.dir}`);
                    reject(error);
                    return;
                }
                onProgress(1);
                this.tracelog.info(`资源加载完成:${def.bundle}/${def.dir}`, assets.length);
                if (def.collection) {
                    AssetManager.assetForeach(assets, def.bundle);
                }
                resolve();
            };
            const onLoading = (finish: number, total: number) => {
                this.asset_count = total;
                onProgress(total > 0 ? finish / total : 0);
            };
            if (def.bundle == BUNDLE_RESOURCES) {
                cc.resources.loadDir(def.dir, onLoading, onComplete);
                return;
            }
            cc.assetManager.loadBundle(def.bundle, (err: Error, bundle: cc.AssetManager.Bundle) => {
                if (err) {
                    this.tracelog.warn(`资源加载失败:${def.bundle}/${def.dir}`);
                    reject(err);
                    return;
                }
                bundle.loadDir(def.dir, onLoading, onComplete);
            });
        });
    }
}
