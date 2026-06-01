import { traceClass } from '../../core/decorator/LogTrace';
import AssetManager, { BUNDLE_RESOURCES, PreloadDefinition, PreloadParams } from '../loader/AssetManager';

const { ccclass, property, menu } = cc._decorator;

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
    //上一次进度
    private prevPercent: number = 0;
    private asset_count: number = 0;

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
            for (let i = 0; i < parts; i++) {
                const definition = param.preloadDefinition[i];
                await this.loadResources(definition, param.stopProgress, i * part, part);
            }
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
