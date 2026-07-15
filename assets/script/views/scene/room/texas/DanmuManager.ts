import AssetManager, { BUNDLE_RESOURCES } from '../../../loader/AssetManager';

const MAX_TRACKS = 8;

const TRACK_OFFSET_Y = 150;

const TOP_OFFSET_RATIO = 0.2;

const SPEED_MIN = 140;

const SPEED_MAX = 200;

const DANMU_ZINDEX = 9999;

const PREFAB_PATH = 'rc/scene/room/texas/widget/DanmuPanel';

const LAYER_NAME = 'DanmuLayer';

class DanmuManager {
    private _prefab: cc.Prefab = null;
    private _prefabLoading: Promise<cc.Prefab> = null;
    private _tracks: cc.Node[] = new Array<cc.Node>(MAX_TRACKS).fill(null);
    private _queue: string[] = [];
    private _layerNode: cc.Node = null;

    public playDanmu(text: string, root: cc.Node): void {
        if (!text || !root || !root.isValid) return;
        this._ensureLayer(root);
        this._queue.push(text);
        this._trySchedule();
    }

    public clearAll(): void {
        for (let i = 0; i < MAX_TRACKS; i++) {
            const node = this._tracks[i];
            if (node && node.isValid) {
                cc.Tween.stopAllByTarget(node);
            }
            this._tracks[i] = null;
        }
        this._queue.length = 0;
        // 层挂在全局 dialogLayer 上，退桌时连层一起销毁，避免空节点常驻；重进时 _ensureLayer 会重建
        if (this._layerNode && this._layerNode.isValid) {
            this._layerNode.destroy();
        }
        this._layerNode = null;
    }

    private _trySchedule(): void {
        while (this._queue.length > 0) {
            const trackIdx = this._findFreeTrack();
            if (trackIdx < 0) return;
            const text = this._queue.shift();
            if (!this._prefab || !this._prefab.isValid) {
                this._queue.unshift(text);
                this._ensurePrefab()
                    .then(() => this._trySchedule())
                    .catch(() => {
                        if (this._queue.length > 0) this._queue.shift();
                        this._trySchedule();
                    });
                return;
            }
            this._spawn(text, trackIdx);
        }
    }

    private _findFreeTrack(): number {
        for (let i = 0; i < MAX_TRACKS; i++) {
            const node = this._tracks[i];
            if (!node || !node.isValid) {
                this._tracks[i] = null;
                return i;
            }
        }
        return -1;
    }

    private _ensurePrefab(): Promise<cc.Prefab> {
        if (this._prefab && this._prefab.isValid) return Promise.resolve(this._prefab);
        if (!this._prefabLoading) {
            this._prefabLoading = AssetManager.getOrLoad(BUNDLE_RESOURCES, PREFAB_PATH, cc.Prefab);
        }
        return this._prefabLoading.then(
            prefab => {
                this._prefab = prefab;
                return prefab;
            },
            err => {
                // 失败后清掉缓存的 rejected promise，下条弹幕才有机会重试加载
                this._prefabLoading = null;
                throw err;
            }
        );
    }

    private _ensureLayer(root: cc.Node): cc.Node {
        if (this._layerNode && this._layerNode.isValid && this._layerNode.parent === root) {
            this._syncLayerSize(root);
            return this._layerNode;
        }
        let layer = root.getChildByName(LAYER_NAME);
        if (!layer) {
            layer = new cc.Node(LAYER_NAME);
            layer.parent = root;
        }
        this._layerNode = layer;
        this._syncLayerSize(root);
        return layer;
    }

    private _syncLayerSize(root: cc.Node): void {
        const layer = this._layerNode;
        if (!layer || !layer.isValid) return;
        layer.zIndex = DANMU_ZINDEX;
        layer.setAnchorPoint(root.anchorX, root.anchorY);
        layer.setContentSize(root.getContentSize());
        layer.setPosition(0, 0);
    }

    private _spawn(text: string, trackIdx: number): void {
        const layer = this._layerNode;
        if (!layer || !layer.isValid || !this._prefab) return;
        const node = cc.instantiate(this._prefab);
        node.name = `DanmuItem_${trackIdx}`;
        node.parent = layer;
        node.zIndex = DANMU_ZINDEX;
        const label = node.getChildByName('DanmuLabel')?.getComponent(cc.Label);
        if (label) {
            label.string = text;
            // Label 渲染尺寸和根节点 CONTAINER Layout 都在帧末才更新，
            // 起终点依赖真实宽度，这里强制同步刷新后再测量
            (label as any)._forceUpdateRenderData();
        }
        const layout = node.getComponent(cc.Layout);
        if (layout) layout.updateLayout();
        const nodeWidth = node.width || 0;
        const buffer = 50;
        const localStartX = layer.width * (1 - layer.anchorX) + nodeWidth + buffer;
        const localEndX = -layer.width * layer.anchorX - nodeWidth - buffer;
        const localTopY = layer.height * (1 - layer.anchorY);
        const localY = localTopY - layer.height * TOP_OFFSET_RATIO - trackIdx * TRACK_OFFSET_Y;
        node.x = localStartX;
        node.y = localY;
        this._tracks[trackIdx] = node;
        const distance = Math.abs(localStartX - localEndX);
        const speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN);
        const duration = distance / speed;
        cc.tween(node)
            .to(duration, { x: localEndX })
            .call(() => {
                if (cc.isValid(node)) node.destroy();
                if (this._tracks[trackIdx] === node) this._tracks[trackIdx] = null;
                this._trySchedule();
            })
            .start();
    }
}

export default new DanmuManager();
