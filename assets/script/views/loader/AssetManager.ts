import { traceClass } from '../../core/decorator/LogTrace';
import AssetLoader, { AssetCollectionType } from './AssetLoader';

export const BUNDLE_RESOURCES: string = 'resources';

export const BUNDLE_TEXAS: string = 'texas';

export type PreloadDefinition = {
    bundle: string;
    dir: string;
    collection: boolean;
};

export type DynamicLoadDefinition = {
    AsyncFunc: () => Promise<void>;
};

export type PreloadParams = {
    preloadDefinition: (PreloadDefinition | DynamicLoadDefinition)[];
    complete?: () => void;
    stopProgress?: boolean;
    error?: (err: Error) => void;
};

export const PreloadDefinitionGame: PreloadDefinition = {
    bundle: BUNDLE_RESOURCES,
    dir: 'rc',
    collection: true
};

export const PreloadDefinitionSound: PreloadDefinition = {
    bundle: BUNDLE_RESOURCES,
    dir: 'sound',
    collection: true
};
// AssetCollectionType 加载素材的时候会把一些spriteframe, sound打包到一个prefab里，然后用于快速索引
// 应该每一个Prefab对应一个enum索引,这样保证不会重复
export type AssetTypeMapping = {
    [AssetCollectionType.SpriteFrameCard0]: cc.SpriteFrame;
    [AssetCollectionType.SpriteFrameCard1]: cc.SpriteFrame;
    [AssetCollectionType.SpriteFrameCard2]: cc.SpriteFrame;
    [AssetCollectionType.SpriteFrameTableSmall]: cc.SpriteFrame;
    [AssetCollectionType.AudioSourceSound]: cc.AudioClip;
    [AssetCollectionType.Common]: cc.Component; // 或者是你的其他通用基类
};

type AssetCtor<T extends cc.Asset> = {
    prototype: T;
} & typeof cc.Asset;

@traceClass()
export default class AssetManager {
    private static _map: Map<string, cc.SpriteFrame | cc.AudioClip> = new Map();
    private static _bundleLoading: Map<string, Promise<cc.AssetManager.Bundle>> = new Map();

    public static _debugAllKeys() {
        AssetManager._map.forEach((v, k) => {
            AssetManager.tracelog.debug('assset Loaed:', k);
        });
    }

    public static async getOrLoad<T extends cc.Asset>(bundleName: string, assetPath: string, te: AssetCtor<T>): Promise<T> {
        let bundle = bundleName == BUNDLE_RESOURCES || bundleName == null ? cc.resources : cc.assetManager.getBundle(bundleName);
        if (!bundle) {
            bundle = await AssetManager._getOrLoadBundle(bundleName);
        }
        const asset = bundle.get<T>(assetPath, te);
        if (asset) {
            return asset;
        }
        return new Promise((resovle, reject) => {
            bundle.load(assetPath, te, (err: Error, asset: T) => {
                if (err) {
                    AssetManager.tracelog.error('bundle path load error:', bundleName, assetPath);
                    reject(err);
                    return;
                }
                resovle(asset);
            });
        });
    }

    private static _getOrLoadBundle(bundleName: string): Promise<cc.AssetManager.Bundle> {
        const loadedBundle = cc.assetManager.getBundle(bundleName);
        if (loadedBundle) return Promise.resolve(loadedBundle);
        const currentLoading = AssetManager._bundleLoading.get(bundleName);
        if (currentLoading) return currentLoading;
        const bundleLoading = new Promise<cc.AssetManager.Bundle>((resolve, reject) => {
            cc.assetManager.loadBundle(bundleName, (error: Error, bundle: cc.AssetManager.Bundle) => {
                if (error) {
                    AssetManager.tracelog.error('bundle load error:', bundleName);
                    reject(error);
                    return;
                }
                resolve(bundle);
            });
        });
        AssetManager._bundleLoading.set(bundleName, bundleLoading);
        bundleLoading.then(
            () => AssetManager._bundleLoading.delete(bundleName),
            () => AssetManager._bundleLoading.delete(bundleName)
        );
        return bundleLoading;
    }

    public static assetForeach(assets: cc.Asset[], bundleName: string) {
        assets.forEach(item => {
            if (item instanceof cc.Prefab) {
                if (!item.data) return;
                const comps = (item.data as any)._components as any[];
                if (comps && comps.filter(v => v == null).length > 0) {
                    AssetManager.tracelog.error(item.data.name, 'has null components');
                    return;
                }
                let ac = item.data.getComponent(AssetLoader);
                if (ac) {
                    item.data.children.forEach(item => {
                        let sprite = item.getComponent(cc.Sprite);
                        if (sprite) {
                            const key = `${ac.collection}|${item.name}`;
                            AssetManager._map.set(key, sprite.spriteFrame);
                        }
                        let sound = item.getComponent(cc.AudioSource);
                        if (sound) {
                            const key = `${ac.collection}|${item.name}`;
                            AssetManager._map.set(key, sound.clip);
                        }
                    });
                }
            }
        });
    }

    public static mustGetLoaded<T extends cc.Asset>(bundleName: string, assetPath: string, te: AssetCtor<T>): T {
        const bundle = bundleName == BUNDLE_RESOURCES || bundleName == null ? cc.resources : cc.assetManager.getBundle(bundleName);
        if (!bundle) {
            throw new Error(`[AssetManager] Bundle not loaded: ${bundleName}`);
        }
        const asset = bundle.get<T>(assetPath, te);
        if (!asset) {
            throw new Error(`[AssetManager] Asset not loaded: ${bundleName}/${assetPath}`);
        }
        return asset;
    }

    public static getAsset<T extends AssetCollectionType>(collection: T, name: string): AssetTypeMapping[T] {
        const key = `${collection}|${name}`;
        if (AssetManager._map.has(key)) {
            return AssetManager._map.get(key) as AssetTypeMapping[T];
        }
        throw new Error(`[AssetManager] Asset not found for key: ${key}. Did you forget to preload it?`);
    }
}
