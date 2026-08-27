import { traceClass } from '../../../../core/decorator/LogTrace';
import AssetManager, { BUNDLE_RESOURCES } from '../../../../views/loader/AssetManager';
import ccviewData from '../../../system/CCViewData';

const { ccclass, property } = cc._decorator;

export interface DLItem {
    bundle: string;
    path: string;
}

export interface BackgroundData {
    SpriteFrame: cc.SpriteFrame;
}

const defaultDynamicLoadingPrefx = 'dynamic/';

const mobileTableFolder = 'table/';

const wideTableFolder = 'table_pc/';

@traceClass()
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
            path: 'table/desk8'
        },
        10: {
            bundle: BUNDLE_RESOURCES,
            path: 'table/desk9'
        },
        11: {
            bundle: BUNDLE_RESOURCES,
            path: 'table/desk10'
        },
        12: {
            bundle: BUNDLE_RESOURCES,
            path: 'table/desk11'
        },
        13: {
            bundle: BUNDLE_RESOURCES,
            path: 'table/desk12'
        },
        14: {
            bundle: BUNDLE_RESOURCES,
            path: 'table/desk13'
        },
        15: {
            bundle: BUNDLE_RESOURCES,
            path: 'table/desk14'
        },
        16: {
            bundle: BUNDLE_RESOURCES,
            path: 'table/desk15'
        }
    };

    public async getBackground(deskType: number, wide: boolean = ccviewData.isWideLayout): Promise<BackgroundData> {
        const data = DLTexasRoomBackground.BACKGROUNDS[deskType];
        if (data == null) {
            console.error('null', deskType);
        }
        const ap = await this._loadSpriteFrame(data, wide);
        return {
            SpriteFrame: ap
        };
    }

    private async _loadSpriteFrame(data: DLItem, wide: boolean): Promise<cc.SpriteFrame> {
        if (wide) {
            const widePath = defaultDynamicLoadingPrefx + data.path.replace(mobileTableFolder, wideTableFolder);
            try {
                return (await AssetManager.getOrLoad(data.bundle, widePath, cc.SpriteFrame)) as cc.SpriteFrame;
            } catch (e) {
                this.tracelog.warn('wide desk texture missing, fallback:', widePath);
            }
        }
        const ap = await AssetManager.getOrLoad(data.bundle, defaultDynamicLoadingPrefx + data.path, cc.SpriteFrame);
        return ap as cc.SpriteFrame;
    }
}

const dlTexasRoomBackground = new DLTexasRoomBackground();

export default dlTexasRoomBackground;
