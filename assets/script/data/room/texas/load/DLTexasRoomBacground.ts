import AssetManager, { BUNDLE_RESOURCES } from '../../../../views/loader/AssetManager';

const { ccclass, property } = cc._decorator;

export interface DLItem {
    bundle: string;
    path: string;
    animationPath?: string;
}

export interface BackgroundData {
    SpriteFrame: cc.SpriteFrame;
    Animation?: sp.SkeletonData;
}

const defaultDynamicLoadingPrefx = 'dynamic/';

export class DLTexasRoomBackground {
    public static readonly BACKGROUNDS: Record<number, DLItem> = {
        1: {
            bundle: BUNDLE_RESOURCES,
            path: 'table/desk0'
        },
        2: {
            bundle: BUNDLE_RESOURCES,
            path: 'table/desk1'
        },
        3: {
            bundle: BUNDLE_RESOURCES,
            path: 'table/desk2'
        },
        4: {
            bundle: BUNDLE_RESOURCES,
            path: 'table/desk3'
        },
        5: {
            bundle: BUNDLE_RESOURCES,
            path: 'table/desk4'
        },
        6: {
            bundle: BUNDLE_RESOURCES,
            path: 'table/desk5'
        },
        7: {
            bundle: BUNDLE_RESOURCES,
            path: 'table/desk6'
        },
        8: {
            bundle: BUNDLE_RESOURCES,
            path: 'table/desk7'
        },
        9: {
            bundle: BUNDLE_RESOURCES,
            path: 'table/desk8',
            animationPath: 'table/anim/desk8/33background'
        },
        10: {
            bundle: BUNDLE_RESOURCES,
            path: 'table/desk9',
            animationPath: 'table/anim/desk9/44paizuo'
        },
        11: {
            bundle: BUNDLE_RESOURCES,
            path: 'table/desk10',
            animationPath: 'table/anim/desk10/skeleton'
        },
        12: {
            bundle: BUNDLE_RESOURCES,
            path: 'table/desk11',
            animationPath: 'table/anim/desk11/77Background'
        },
        13: {
            bundle: BUNDLE_RESOURCES,
            path: 'table/desk12',
            animationPath: 'table/anim/desk12/nature_japan88'
        },
        14: {
            bundle: BUNDLE_RESOURCES,
            path: 'table/desk13',
            animationPath: 'table/anim/desk13/backgroud99'
        }
    };

    public async getBackground(deskType: number): Promise<BackgroundData> {
        const data = DLTexasRoomBackground.BACKGROUNDS[deskType];
        if (data == null) {
            console.error('null', deskType);
        }
        const promises: Promise<unknown>[] = [];
        promises.push(AssetManager.getOrLoad(data.bundle, defaultDynamicLoadingPrefx + data.path, cc.SpriteFrame));
        if (data.animationPath) {
            promises.push(AssetManager.getOrLoad(data.bundle, defaultDynamicLoadingPrefx + data.animationPath, sp.SkeletonData));
            const [ap, sp2] = await Promise.all(promises);
            return {
                SpriteFrame: ap as cc.SpriteFrame,
                Animation: sp2 as sp.SkeletonData
            };
        }
        const [ap] = await Promise.all(promises);
        return {
            SpriteFrame: ap as cc.SpriteFrame
        };
    }
}

const dlTexasRoomBackground = new DLTexasRoomBackground();

export default dlTexasRoomBackground;
