import { DiamondGiftBroadcastData, ThrowPropBroadcastData } from '../../data/room/texas/TexasGameRoomDataSeatsStateManager';
import userStore from '../../data/user/UserStore';
import AssetManager, { BUNDLE_RESOURCES } from '../loader/AssetManager';

type PropPattern = 'A' | 'B' | 'C' | 'D';

type PropRole = 'sender' | 'receiver' | 'bystander';

interface PropAnimConfig {
    pattern: PropPattern;
    spines: string[];
    anims: string[];
    soundName?: string;
}

class ThrowPropManager {
    private static readonly PROP_TYPE_BASE = 600;
    private static readonly CONFIGS: PropAnimConfig[] = [
        { pattern: 'A', spines: ['dynamic/prop/spine/expressionTomato/skeleton'], anims: ['1'], soundName: 'dynamic/prop/sound/sfx_tomato_mus' },
        { pattern: 'A', spines: ['dynamic/prop/spine/expressionFlower/skeleton'], anims: ['animation'], soundName: 'dynamic/prop/sound/sfx_rose_mus' },
        { pattern: 'A', spines: ['dynamic/prop/spine/expressionKiss/kiss'], anims: ['1'], soundName: 'dynamic/prop/sound/sfx_kiss_mus' },
        { pattern: 'A', spines: ['dynamic/prop/spine/expressionGood/skeleton'], anims: ['animation'], soundName: 'dynamic/prop/sound/sfx_like_mus' },
        {
            pattern: 'D',
            spines: ['dynamic/prop/spine/expressionBeer/cheers_2', 'dynamic/prop/spine/expressionBeerScreen/cheers_1'],
            anims: [],
            soundName: 'dynamic/prop/sound/sfx_cheers_mus'
        },
        { pattern: 'B', spines: ['dynamic/prop/spine/expressionTouch/touch'], anims: ['animation'], soundName: 'dynamic/prop/sound/sfx_touch_mus' },
        {
            pattern: 'C',
            spines: ['dynamic/prop/spine/expressionShark/shark'],
            anims: ['shark_set', 'shark_receive'],
            soundName: 'dynamic/prop/sound/sfx_shark_mus'
        },
        {
            pattern: 'C',
            spines: ['dynamic/prop/spine/expressionChicken/chicken_spine'],
            anims: ['chicken_set', 'chicken_receive'],
            soundName: 'dynamic/prop/sound/sfx_zhuaji_mus'
        },
        { pattern: 'D', spines: ['dynamic/prop/spine/expressionBox/box_local', 'dynamic/prop/spine/expressionBoxScreen/box_full'], anims: [] },
        { pattern: 'C', spines: ['dynamic/prop/spine/expressionMoney/attachments'], anims: ['attachments_1_receive'] },
        {
            pattern: 'D',
            spines: [
                'dynamic/prop/spine/expressionFish/sy3',
                'dynamic/prop/spine/expressionFishScreenSender/sy2',
                'dynamic/prop/spine/expressionFishScreenReceiver/sy',
                'dynamic/prop/spine/expressionFishWave/hl'
            ],
            anims: []
        },
        {
            pattern: 'D',
            spines: [
                'dynamic/prop/spine/expressionBaseballSender/skeleton',
                'dynamic/prop/spine/expressionBaseballReceiver/ballfolder1',
                'dynamic/prop/spine/expressionBaseballOther/skeleton'
            ],
            anims: [],
            soundName: 'dynamic/prop/sound/sfx_baseball'
        }
    ];
    private static readonly EXTRA_SOUND_NAMES = [
        'dynamic/prop/sound/sfx_beer_screen',
        'dynamic/prop/sound/sfx_boxing_sender1',
        'dynamic/prop/sound/sfx_boxing_sender2',
        'dynamic/prop/sound/sfx_boxing_beaten1',
        'dynamic/prop/sound/sfx_boxing_beaten2',
        'dynamic/prop/sound/sfx_fish',
        'dynamic/prop/sound/sfx_fish2',
        'dynamic/prop/sound/sfx_money'
    ];
    private _root: cc.Node = null;
    private _seatNodes: Map<number, cc.Node> = new Map();
    private _propAssetsLoading: Promise<void> = null;

    public initialize(root: cc.Node): void {
        this._root = root;
    }

    public registerSeat(userID: number, avatarNode: cc.Node): void {
        if (!userID || !avatarNode) return;
        this._seatNodes.set(userID, avatarNode);
    }

    public clearSeatNodes(): void {
        this._seatNodes.clear();
    }

    public playProp(data: ThrowPropBroadcastData): void {
        this._playProp(data).catch(error => cc.warn('[ThrowPropManager] play prop failed', error));
    }

    public preloadPropAssets(): void {
        this._ensurePropAssetsLoaded().catch(error => cc.warn('[ThrowPropManager] preload prop assets failed', error));
    }

    private async _playProp(data: ThrowPropBroadcastData): Promise<void> {
        const offset = data.type - ThrowPropManager.PROP_TYPE_BASE;
        const config = ThrowPropManager.CONFIGS[offset];
        if (!config || !this._root || !cc.isValid(this._root)) return;
        const senderNode = this._seatNodes.get(data.userID);
        const targetNode = this._seatNodes.get(data.targetUserID);
        if (!senderNode || !targetNode) return;
        switch (config.pattern) {
            case 'A':
                await this._playPatternA(offset, config, senderNode, targetNode);
                break;
            case 'B':
                await this._playPatternB(config, senderNode, targetNode);
                break;
            case 'C':
                await this._playPatternC(offset, config, senderNode, targetNode, data);
                break;
            case 'D':
                await this._playPatternD(offset, senderNode, targetNode, data);
                break;
        }
    }

    public playDiamondGift(data: DiamondGiftBroadcastData): void {
        if (!this._root || !cc.isValid(this._root) || !data.amount) return;
        const senderNode = this._seatNodes.get(data.senderID);
        const receiverNode = this._seatNodes.get(data.receiverID);
        if (!senderNode || !receiverNode) return;
        const senderWorld = this._getWorldPos(senderNode);
        const receiverWorld = this._getWorldPos(receiverNode);
        this._getDiamondPrefabs()
            .then(([flyPrefab, iconPrefab, spinePrefab]) => {
                if (!cc.isValid(this._root)) return;
                this._spawnDiamondFly(flyPrefab, senderWorld, `-${data.amount}`);
                const icon = cc.instantiate(iconPrefab);
                icon.parent = this._root;
                icon.zIndex = 9999;
                icon.setPosition(this._root.convertToNodeSpaceAR(senderWorld));
                cc.tween(icon)
                    .to(0.9, this._toTweenPos(this._root.convertToNodeSpaceAR(receiverWorld)), { easing: 'quadInOut' })
                    .call(() => {
                        if (!cc.isValid(this._root)) return;
                        this._spawnDiamondSpine(spinePrefab, this._root.convertToNodeSpaceAR(receiverWorld));
                        this._spawnDiamondFly(flyPrefab, receiverWorld, `+${data.amount}`);
                        if (cc.isValid(icon)) icon.destroy();
                    })
                    .start();
            })
            .catch(error => cc.warn('[ThrowPropManager] load diamond prefabs failed', error));
    }

    // A 类：先从发送者头像飞到目标头像，命中后在目标位置播放一次性 Spine 动画。
    private async _playPatternA(offset: number, config: PropAnimConfig, senderNode: cc.Node, targetNode: cc.Node): Promise<void> {
        const soundName = config.soundName;
        if (offset === 2) this._playSound(soundName);
        const skeletonData = await this._getSkeleton(config.spines[0]);
        if (!this._isRootValid()) return;
        const node = this._createSpineNode(skeletonData, '', false, this._getLocalPos(senderNode));
        const skeleton = node.getComponent(sp.Skeleton);
        const endPos = this._getLocalPos(targetNode);
        cc.tween(node)
            .to(0.5, this._toTweenPos(endPos), { easing: 'quadInOut' })
            .call(() => {
                if (!cc.isValid(node)) return;
                skeleton.setAnimation(0, config.anims[0], false);
                this._destroyAfterComplete(node, 4);
                if (soundName) this._playSoundDelay(soundName, 1);
            })
            .start();
    }

    // B 类：同样先飞到目标头像，但命中后播放循环动画，按固定时间销毁。
    private async _playPatternB(config: PropAnimConfig, senderNode: cc.Node, targetNode: cc.Node): Promise<void> {
        const soundName = config.soundName;
        const skeletonData = await this._getSkeleton(config.spines[0]);
        if (!this._isRootValid()) return;
        const node = this._createSpineNode(skeletonData, '', false, this._getLocalPos(senderNode));
        const skeleton = node.getComponent(sp.Skeleton);
        const endPos = this._getLocalPos(targetNode);
        cc.tween(node)
            .to(0.5, this._toTweenPos(endPos), { easing: 'quadInOut' })
            .call(() => {
                if (!cc.isValid(node)) return;
                skeleton.setAnimation(0, config.anims[0], true);
                this._playSound(soundName);
                this._destroyAfterDelay(node, 3);
            })
            .start();
    }

    // C 类：不使用通用命中动画，而是在发送者/目标位置分别播放配置好的局部效果。
    private async _playPatternC(offset: number, config: PropAnimConfig, senderNode: cc.Node, targetNode: cc.Node, data: ThrowPropBroadcastData): Promise<void> {
        const targetPos = this._getLocalPos(targetNode);
        const soundName = config.soundName;
        const allData = await this._getSkeletons(config.spines);
        if (!this._isRootValid()) return;
        if (config.anims.length === 1) {
            const node = this._createSpineNode(allData[0], config.anims[0], false, targetPos);
            this._destroyAfterComplete(node, 4);
            if (offset === 9) {
                this._playSound(
                    this._getRole(data.userID, data.targetUserID) === 'receiver' ? 'dynamic/prop/sound/sfx_touch_mus' : 'dynamic/prop/sound/sfx_money'
                );
            } else {
                this._playSound(soundName);
            }
            return;
        }
        const senderPos = this._getLocalPos(senderNode);
        if (offset === 7) {
            const handNode = this._createSpineNode(allData[0], config.anims[0], false, senderPos);
            this._destroyAfterComplete(handNode, 4);
            cc.tween(handNode).to(0.5, this._toTweenPos(targetPos), { easing: 'quadInOut' }).start();
            const targetEffect = this._createSpineNode(allData[0], config.anims[1], false, targetPos);
            this._destroyAfterComplete(targetEffect, 4);
        } else {
            const senderEffect = this._createSpineNode(allData[0], config.anims[0], false, senderPos);
            const targetEffect = this._createSpineNode(allData[0], config.anims[1], false, targetPos);
            this._destroyAfterComplete(senderEffect, 4);
            this._destroyAfterComplete(targetEffect, 4);
        }
        this._playSound(soundName);
    }

    // D 类：道具表现依赖当前客户端身份，需要按发送者、接收者、旁观者分支播放专用序列。
    private async _playPatternD(offset: number, senderNode: cc.Node, targetNode: cc.Node, data: ThrowPropBroadcastData): Promise<void> {
        const config = ThrowPropManager.CONFIGS[offset];
        const role = this._getRole(data.userID, data.targetUserID);
        if (offset === 4) await this._playBeer(senderNode, targetNode, role, config);
        if (offset === 8) await this._playBoxing(senderNode, targetNode, role, config);
        if (offset === 10) await this._playFish(senderNode, targetNode, role, config);
        if (offset === 11) await this._playBaseball(senderNode, targetNode, role, config);
    }

    private async _playBeer(senderNode: cc.Node, targetNode: cc.Node, role: PropRole, config: PropAnimConfig): Promise<void> {
        const [beerData, screenData] = await this._getSkeletons(config.spines);
        if (!this._isRootValid()) return;
        const senderPos = this._getLocalPos(senderNode);
        const targetPos = this._getLocalPos(targetNode);
        if (role === 'sender' || role === 'receiver') {
            this._playSound('dynamic/prop/sound/sfx_beer_screen');
            this._destroyAfterComplete(this._createSpineNode(screenData, '1', false, this._getScreenCenter()), 5);
            this._destroyAfterComplete(this._createSpineNode(beerData, '3', false, senderPos), 5);
            this._destroyAfterComplete(this._createSpineNode(beerData, '3', false, targetPos), 5);
            return;
        }
        this._playSound(config.soundName);
        this._destroyAfterComplete(this._createSpineNode(beerData, '2', false, senderPos), 5);
        this._destroyAfterComplete(this._createSpineNode(beerData, '2', false, targetPos), 5);
    }

    private async _playBoxing(senderNode: cc.Node, targetNode: cc.Node, role: PropRole, config: PropAnimConfig): Promise<void> {
        const [boxData, screenData] = await this._getSkeletons(config.spines);
        if (!this._isRootValid()) return;
        const senderPos = this._getLocalPos(senderNode);
        const targetPos = this._getLocalPos(targetNode);
        const screenCenter = this._getScreenCenter();
        if (role === 'sender') {
            this._playSound('dynamic/prop/sound/sfx_boxing_sender1');
            this._chainSpine(this._createSpineNode(screenData, 'box_full_1', false, screenCenter), () => {
                this._playSound('dynamic/prop/sound/sfx_boxing_sender2');
                this._destroyAfterComplete(this._createSpineNode(boxData, 'box_local_1', false, targetPos), 4);
            });
            return;
        }
        if (role === 'receiver') {
            this._playSound('dynamic/prop/sound/sfx_boxing_beaten1');
            this._chainSpine(this._createSpineNode(boxData, 'box_local_2', false, senderPos), () => {
                this._playSound('dynamic/prop/sound/sfx_boxing_beaten2');
                this._destroyAfterComplete(this._createSpineNode(screenData, 'box_full_2', false, screenCenter), 5);
            });
            return;
        }
        this._playSound('dynamic/prop/sound/sfx_boxing_beaten1');
        this._chainSpine(this._createSpineNode(boxData, 'box_local_2', false, senderPos), () => {
            this._playSound('dynamic/prop/sound/sfx_boxing_sender2');
            this._destroyAfterComplete(this._createSpineNode(boxData, 'box_local_1', false, targetPos), 4);
        });
    }

    private async _playFish(senderNode: cc.Node, targetNode: cc.Node, role: PropRole, config: PropAnimConfig): Promise<void> {
        const [fishData, senderScreenData, receiverScreenData, waveData] = await this._getSkeletons(config.spines);
        if (!this._isRootValid()) return;
        const senderPos = this._getLocalPos(senderNode);
        const targetPos = this._getLocalPos(targetNode);
        const center = this._getScreenCenter();
        if (role === 'sender') {
            this._playSound('dynamic/prop/sound/sfx_fish2');
            this._destroyAfterComplete(this._createSpineNode(senderScreenData, 'sy2', false, center), 6);
            this._destroyAfterComplete(this._createSpineNode(waveData, 'hl1', false, center), 6);
            return;
        }
        if (role === 'receiver') {
            this._playSound('dynamic/prop/sound/sfx_fish');
            this._destroyAfterComplete(this._createSpineNode(receiverScreenData, 'sy', false, center), 6);
            this._destroyAfterComplete(this._createSpineNode(waveData, 'hl2', false, center), 6);
            return;
        }
        this._playSound('dynamic/prop/sound/sfx_fish');
        const fishNode = this._createSpineNode(fishData, 'sy3_1', true, senderPos);
        const skeleton = fishNode.getComponent(sp.Skeleton);
        const dir = cc.v2(targetPos.x - senderPos.x, targetPos.y - senderPos.y);
        fishNode.angle = (-cc.v2(0, 1).signAngle(dir) * 180) / Math.PI;
        fishNode.scaleX = dir.x > 0 ? -Math.abs(fishNode.scaleX || 1) : Math.abs(fishNode.scaleX || 1);
        cc.tween(fishNode)
            .to(2, this._toTweenPos(targetPos), { easing: 'sineInOut' })
            .call(() => {
                if (!cc.isValid(fishNode)) return;
                skeleton.setAnimation(0, 'sy3_2', false);
                this._destroyAfterComplete(this._createSpineNode(fishData, 'bl', false, targetPos), 4);
            })
            .delay(1)
            .call(() => {
                if (cc.isValid(fishNode)) fishNode.destroy();
            })
            .start();
        this._destroyAfterComplete(this._createSpineNode(waveData, 'hl3', false, center), 6);
    }

    private async _playBaseball(senderNode: cc.Node, targetNode: cc.Node, role: PropRole, config: PropAnimConfig): Promise<void> {
        this._playSound(config.soundName);
        const [senderData, receiverData, otherData] = await this._getSkeletons(config.spines);
        if (!this._isRootValid()) return;
        const senderPos = this._getLocalPos(senderNode);
        const targetPos = this._getLocalPos(targetNode);
        if (role === 'sender') {
            this._playBaseballSequence(senderData, senderPos, targetPos, false);
        } else if (role === 'receiver') {
            this._playBaseballSequence(receiverData, senderPos, targetPos, false);
        } else {
            this._playBaseballSequence(otherData, senderPos, targetPos, true);
        }
    }

    private _playBaseballSequence(skeletonData: sp.SkeletonData, startPos: cc.Vec3, targetPos: cc.Vec3, exitAfterHit: boolean): void {
        const node = this._createSpineNode(skeletonData, '1', false, startPos);
        const skeleton = node.getComponent(sp.Skeleton);
        skeleton.setCompleteListener(() => {
            if (!cc.isValid(node)) return;
            skeleton.setCompleteListener(() => {});
            skeleton.setAnimation(0, '2', false);
            cc.tween(node).to(0.333, this._toTweenPos(targetPos), { easing: 'quadInOut' }).start();
            cc.tween(node)
                .delay(0.333)
                .call(() => {
                    if (!cc.isValid(node)) return;
                    skeleton.setAnimation(0, '3', false);
                    if (!exitAfterHit) {
                        this._destroyAfterComplete(node, 5);
                        return;
                    }
                    skeleton.setCompleteListener(() => {
                        if (!cc.isValid(node)) return;
                        skeleton.setAnimation(0, '4', false);
                        const dir = cc.v2(targetPos.x - startPos.x, targetPos.y - startPos.y).normalize();
                        const exitPos = cc.v3(targetPos.x + dir.x * 2000, targetPos.y + dir.y * 2000, 0);
                        cc.tween(node)
                            .to(1, this._toTweenPos(exitPos), { easing: 'quadIn' })
                            .call(() => {
                                if (cc.isValid(node)) node.destroy();
                            })
                            .start();
                    });
                })
                .start();
        });
        this._destroyAfterDelay(node, exitAfterHit ? 10 : 8);
    }

    private _ensurePropAssetsLoaded(): Promise<void> {
        if (!this._propAssetsLoading) {
            this._propAssetsLoading = this._loadPropAssets().catch(error => {
                this._propAssetsLoading = null;
                throw error;
            });
        }
        return this._propAssetsLoading;
    }

    private async _loadPropAssets(): Promise<void> {
        const spinePaths = new Set<string>();
        const soundPaths = new Set<string>();
        ThrowPropManager.CONFIGS.forEach(config => {
            config.spines.forEach(path => spinePaths.add(path));
            if (config.soundName) soundPaths.add(config.soundName);
        });
        ThrowPropManager.EXTRA_SOUND_NAMES.forEach(path => soundPaths.add(path));
        await Promise.all([
            ...Array.from(spinePaths).map(path => AssetManager.getOrLoad(BUNDLE_RESOURCES, path, sp.SkeletonData)),
            ...Array.from(soundPaths).map(path => AssetManager.getOrLoad(BUNDLE_RESOURCES, path, cc.AudioClip))
        ]);
    }

    private _getSkeleton(path: string): Promise<sp.SkeletonData> {
        return AssetManager.getOrLoad(BUNDLE_RESOURCES, path, sp.SkeletonData);
    }

    private _getSkeletons(paths: string[]): Promise<sp.SkeletonData[]> {
        return Promise.all(paths.map(path => this._getSkeleton(path)));
    }

    private _getDiamondPrefabs(): Promise<cc.Prefab[]> {
        return Promise.all([
            AssetManager.getOrLoad(BUNDLE_RESOURCES, 'effect/diamondFly', cc.Prefab),
            AssetManager.getOrLoad(BUNDLE_RESOURCES, 'effect/DiamondIcon', cc.Prefab),
            AssetManager.getOrLoad(BUNDLE_RESOURCES, 'effect/diamondSpine', cc.Prefab)
        ]);
    }

    private _createSpineNode(skeletonData: sp.SkeletonData, animName: string, loop: boolean, localPos: cc.Vec3): cc.Node {
        const node = new cc.Node('PropSpine');
        const skeleton = node.addComponent(sp.Skeleton);
        skeleton.skeletonData = skeletonData;
        node.parent = this._root;
        node.zIndex = 9999;
        node.setPosition(localPos);
        if (animName) skeleton.setAnimation(0, animName, loop);
        return node;
    }

    private _chainSpine(node: cc.Node, next: () => void): void {
        const skeleton = node.getComponent(sp.Skeleton);
        skeleton.setCompleteListener(() => {
            if (!cc.isValid(node)) return;
            node.destroy();
            next();
        });
        this._destroyAfterDelay(node, 6);
    }

    private _destroyAfterComplete(node: cc.Node, fallbackDelay: number): void {
        if (!node) return;
        const skeleton = node.getComponent(sp.Skeleton);
        if (skeleton) {
            skeleton.setCompleteListener(() => {
                if (cc.isValid(node)) node.destroy();
            });
        }
        this._destroyAfterDelay(node, fallbackDelay);
    }

    private _destroyAfterDelay(node: cc.Node, delay: number): void {
        if (!node) return;
        cc.tween(node)
            .delay(delay)
            .call(() => {
                if (cc.isValid(node)) node.destroy();
            })
            .start();
    }

    private _spawnDiamondSpine(prefab: cc.Prefab, localPos: cc.Vec3): void {
        const node = cc.instantiate(prefab);
        node.parent = this._root;
        node.zIndex = 9999;
        node.setPosition(localPos);
        this._destroyAfterComplete(node, 2);
    }

    private _spawnDiamondFly(prefab: cc.Prefab, worldPos: cc.Vec3, text: string): void {
        const node = cc.instantiate(prefab);
        const numLabel = node.getChildByName('diamondNum');
        const label = numLabel?.getComponent(cc.Label);
        if (label) label.string = text;
        if (text.charAt(0) === '+' && numLabel) numLabel.color = cc.color(0, 255, 100, 255);
        node.parent = this._root;
        node.zIndex = 9999;
        node.setPosition(this._root.convertToNodeSpaceAR(worldPos));
        cc.tween(node)
            .by(0.6, { y: 60 })
            .to(0.4, { opacity: 0 })
            .call(() => {
                if (cc.isValid(node)) node.destroy();
            })
            .start();
    }

    private _playSoundDelay(name: string, delay: number): void {
        if (!this._isRootValid()) return;
        cc.tween(this._root)
            .delay(delay)
            .call(() => this._playSound(name))
            .start();
    }

    private _playSound(name: string): void {
        if (!name) return;
        AssetManager.getOrLoad(BUNDLE_RESOURCES, name, cc.AudioClip)
            .then(clip => cc.audioEngine.playEffect(clip, false))
            .catch(error => cc.warn('[ThrowPropManager] play sound failed', name, error));
    }

    private _getRole(senderID: number, targetID: number): PropRole {
        const myID = userStore.userRID || userStore.userID;
        if (myID === senderID) return 'sender';
        if (myID === targetID) return 'receiver';
        return 'bystander';
    }

    private _getWorldPos(node: cc.Node): cc.Vec3 {
        return node.parent.convertToWorldSpaceAR(node.position);
    }

    private _getLocalPos(node: cc.Node): cc.Vec3 {
        if (!this._root || !node?.parent) return cc.v3();
        return this._root.convertToNodeSpaceAR(this._getWorldPos(node));
    }

    private _getScreenCenter(): cc.Vec3 {
        if (!this._root) return cc.v3();
        const canvas = cc.find('Canvas');
        if (!canvas) return cc.v3();
        const worldPos = canvas.convertToWorldSpaceAR(cc.v2(0, 0));
        return this._root.convertToNodeSpaceAR(cc.v3(worldPos.x, worldPos.y, 0));
    }

    private _toTweenPos(pos: cc.Vec3): { x: number; y: number } {
        return { x: pos.x, y: pos.y };
    }

    private _isRootValid(): boolean {
        return !!this._root && cc.isValid(this._root);
    }
}

const throwPropManager = new ThrowPropManager();

export default throwPropManager;
