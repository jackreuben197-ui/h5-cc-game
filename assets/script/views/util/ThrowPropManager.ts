import soundManager from '../../core/SoundManager';
import { Def } from '@silenthill/agreement-web';
import { DiamondGiftBroadcastData, EmojiBroadcastData, ThrowPropBroadcastData } from '../../data/room/texas/TexasGameRoomDataSeatsStateManager';
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

export interface ThrowPropSeatNodes {
    avatarNode: cc.Node;
    propNode: cc.Node;
}

interface ThrowPropTask {
    data: ThrowPropBroadcastData;
    senderData: ThrowPropSeatNodes;
    targetData: ThrowPropSeatNodes;
    offset: number;
    config: PropAnimConfig;
    role: PropRole;
    fullscreen: boolean;
    duration: number;
}

class ThrowPropManager {
    private static readonly PROP_TYPE_BASE = 600;
    private static readonly CONFIGS: PropAnimConfig[] = [
        { pattern: 'A', spines: ['rc/other/effect/expressionTomato/skeleton'], anims: ['1'], soundName: 'sound/PropOp/sfx_tomato_mus' },
        { pattern: 'A', spines: ['rc/other/effect/expressionFlower/skeleton'], anims: ['animation'], soundName: 'sound/PropOp/sfx_rose_mus' },
        { pattern: 'A', spines: ['rc/other/effect/expressionKiss/kiss'], anims: ['1'], soundName: 'sound/PropOp/sfx_kiss_mus' },
        { pattern: 'A', spines: ['rc/other/effect/expressionGood/skeleton'], anims: ['animation'], soundName: 'sound/PropOp/sfx_like_mus' },
        {
            pattern: 'D',
            spines: ['rc/other/effect/expressionBeer/cheers_2', 'rc/other/effect/expressionBeerScreen/cheers_1'],
            anims: [],
            soundName: 'sound/PropOp/sfx_cheers_mus'
        },
        { pattern: 'B', spines: ['rc/other/effect/expressionTouch/touch'], anims: ['animation'], soundName: 'sound/PropOp/sfx_touch_mus' },
        { pattern: 'C', spines: ['rc/other/effect/expressionShark/shark'], anims: ['shark_set', 'shark_receive'], soundName: 'sound/PropOp/sfx_shark_mus' },
        {
            pattern: 'C',
            spines: ['rc/other/effect/expressionChicken/chicken_spine'],
            anims: ['chicken_set', 'chicken_receive'],
            soundName: 'sound/PropOp/sfx_zhuaji_mus'
        },
        { pattern: 'D', spines: ['rc/other/effect/expressionBox/box_local', 'rc/other/effect/expressionBoxScreen/box_full'], anims: [] },
        { pattern: 'C', spines: ['rc/other/effect/expressionMoney/attachments'], anims: ['attachments_1_receive'] },
        {
            pattern: 'D',
            spines: [
                'rc/other/effect/expressionFish/sy3',
                'rc/other/effect/expressionFishScreenSender/sy2',
                'rc/other/effect/expressionFishScreenReceiver/sy',
                'rc/other/effect/expressionFishWave/hl'
            ],
            anims: []
        },
        {
            pattern: 'D',
            spines: [
                'rc/other/effect/expressionBaseballSender/skeleton',
                'rc/other/effect/expressionBaseballReceiver/ballfolder1',
                'rc/other/effect/expressionBaseballOther/skeleton'
            ],
            anims: [],
            soundName: 'sound/PropOp/sfx_baseball'
        }
    ];
    private _root: cc.Node = null;
    private _fullscreenRoot: cc.Node = null;
    private _seatPropSkeletonData: Map<cc.Node, sp.SkeletonData> = new Map();
    private _propQueue: ThrowPropTask[] = [];
    private _playingPropUsers: Set<number> = new Set();
    private _playingFullscreenProp: boolean = false;

    public initialize(root: cc.Node, fullscreenRoot: cc.Node): void {
        if (this._root !== root) {
            this._seatPropSkeletonData.clear();
            this._propQueue.length = 0;
            this._playingPropUsers.clear();
            this._playingFullscreenProp = false;
        }
        this._root = root;
        this._fullscreenRoot = fullscreenRoot;
    }

    public playProp(data: ThrowPropBroadcastData, senderData: ThrowPropSeatNodes, targetData: ThrowPropSeatNodes): void {
        const offset = data.type - this._getThrowPropTypeBase();
        const config = ThrowPropManager.CONFIGS[offset];
        if (!config || !this._root || !cc.isValid(this._root)) return;
        if (!senderData || !targetData) return;
        const role = this._getRole(data.userID, data.targetUserID);
        const task: ThrowPropTask = {
            data,
            senderData,
            targetData,
            offset,
            config,
            role,
            fullscreen: this._isFullscreenProp(offset, role),
            duration: this._getPropDuration(offset, role)
        };
        this._propQueue.push(task);
        this._tryPlayQueuedProps();
    }

    private _playPropNow(task: ThrowPropTask): void {
        switch (task.config.pattern) {
            case 'A':
                this._playPatternA(task.offset, task.config, task.senderData, task.targetData);
                break;
            case 'B':
                this._playPatternB(task.config, task.senderData, task.targetData);
                break;
            case 'C':
                this._playPatternC(task.offset, task.config, task.senderData, task.targetData, task.data);
                break;
            case 'D':
                this._playPatternD(task.offset, task.senderData, task.targetData, task.data);
                break;
        }
    }

    public playDiamondGift(data: DiamondGiftBroadcastData, senderData: ThrowPropSeatNodes, receiverData: ThrowPropSeatNodes): void {
        if (!this._root || !cc.isValid(this._root) || !data.amount) return;
        if (!senderData || !receiverData) return;
        const senderNode = senderData.avatarNode;
        const receiverNode = receiverData.avatarNode;
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

    private _tryPlayQueuedProps(): void {
        let started = false;
        do {
            started = false;
            for (let i = 0; i < this._propQueue.length; i++) {
                const task = this._propQueue[i];
                if (!this._canPlayPropTask(task)) continue;
                this._propQueue.splice(i, 1);
                this._markPropTaskPlaying(task);
                this._playPropNow(task);
                this._schedulePropTaskFinish(task);
                started = true;
                break;
            }
        } while (started);
    }

    private _canPlayPropTask(task: ThrowPropTask): boolean {
        if (task.fullscreen) return !this._playingFullscreenProp;
        return !this._playingPropUsers.has(task.data.userID) && !this._playingPropUsers.has(task.data.targetUserID);
    }

    private _markPropTaskPlaying(task: ThrowPropTask): void {
        if (task.fullscreen) {
            this._playingFullscreenProp = true;
            return;
        }
        this._playingPropUsers.add(task.data.userID);
        this._playingPropUsers.add(task.data.targetUserID);
    }

    private _schedulePropTaskFinish(task: ThrowPropTask): void {
        cc.tween(this._root)
            .delay(task.duration)
            .call(() => {
                if (task.fullscreen) {
                    this._playingFullscreenProp = false;
                } else {
                    this._playingPropUsers.delete(task.data.userID);
                    this._playingPropUsers.delete(task.data.targetUserID);
                }
                this._tryPlayQueuedProps();
            })
            .start();
    }

    private _isFullscreenProp(offset: number, role: PropRole): boolean {
        if (offset === 10) return true;
        if (offset === 4 || offset === 8) return role === 'sender' || role === 'receiver';
        return false;
    }

    private _getPropDuration(offset: number, role: PropRole): number {
        if (offset >= 0 && offset <= 3) return 4.5;
        if (offset === 5) return 3.5;
        if (offset === 4) return 5;
        if (offset === 8) return role === 'sender' || role === 'receiver' ? 6 : 4;
        if (offset === 10) return 6;
        if (offset === 11) return role === 'bystander' ? 10 : 8;
        return 4;
    }

    public async playEmoji(data: EmojiBroadcastData, senderData: ThrowPropSeatNodes): Promise<void> {
        const index = data.type - this._getEmojiTypeBase() + 1;
        if (index < 1 || index > 15 || !this._root || !cc.isValid(this._root)) return;
        const seatNode = senderData.propNode;
        if (!seatNode) return;
        let spriteFrame: cc.SpriteFrame = null;
        try {
            spriteFrame = await AssetManager.getOrLoad(BUNDLE_RESOURCES, `rc/other/emoji/em${index}`, cc.SpriteFrame);
        } catch (error) {
            cc.warn('[ThrowPropManager] load emoji failed', index, error);
            return;
        }
        if (!this._isRootValid() || !cc.isValid(seatNode)) return;
        const emojiNode = new cc.Node('EmojiAnim');
        const sprite = emojiNode.addComponent(cc.Sprite);
        sprite.spriteFrame = spriteFrame;
        emojiNode.setContentSize(70, 70);
        emojiNode.opacity = 0;
        emojiNode.scale = 0.5;
        emojiNode.parent = this._root;
        emojiNode.zIndex = 9999;
        const startPos = this._getLocalPos(seatNode);
        emojiNode.setPosition(startPos.x, startPos.y + seatNode.height / 4);
        cc.tween(emojiNode)
            .to(0.18, { opacity: 255, scale: 1.2 }, { easing: 'backOut' })
            .to(0.12, { scale: 1 })
            .delay(1.2)
            .to(0.25, { opacity: 0, y: emojiNode.y + 30 })
            .call(() => {
                if (cc.isValid(emojiNode)) emojiNode.destroy();
            })
            .start();
    }

    private _getEmojiTypeBase(): number {
        return Def.ConsumeType.CT_EMOJI_1 * 100;
    }

    private _getThrowPropTypeBase(): number {
        return Def.ConsumeType.CT_EMOJI_2 * 100;
    }

    // A 类：先从发送者头像飞到目标头像，命中后在目标位置播放一次性 Spine 动画。
    private _playPatternA(offset: number, config: PropAnimConfig, senderData: ThrowPropSeatNodes, targetData: ThrowPropSeatNodes): void {
        const soundName = config.soundName;
        if (offset === 2) this._playSound(soundName);
        const skeletonData = this._getSkeleton(config.spines[0]);
        if (!this._isRootValid()) return;
        const node = this._createSpineNode(skeletonData, '', false, this._getLocalPos(senderData.avatarNode), senderData.propNode);
        const skeleton = node.getComponent(sp.Skeleton);
        const endPos = this._getLocalPos(targetData.avatarNode);
        cc.tween(node)
            .to(0.5, this._toTweenPosForNode(node, endPos), { easing: 'quadInOut' })
            .call(() => {
                if (!cc.isValid(node)) return;
                skeleton.setAnimation(0, config.anims[0], false);
                this._destroyAfterComplete(node, 4);
                if (soundName) this._playSoundDelay(soundName, 1);
            })
            .start();
    }

    // B 类：同样先飞到目标头像，但命中后播放循环动画，按固定时间销毁。
    private _playPatternB(config: PropAnimConfig, senderData: ThrowPropSeatNodes, targetData: ThrowPropSeatNodes): void {
        const soundName = config.soundName;
        const skeletonData = this._getSkeleton(config.spines[0]);
        if (!this._isRootValid()) return;
        const node = this._createSpineNode(skeletonData, '', false, this._getLocalPos(senderData.avatarNode), senderData.propNode);
        const skeleton = node.getComponent(sp.Skeleton);
        const endPos = this._getLocalPos(targetData.avatarNode);
        cc.tween(node)
            .to(0.5, this._toTweenPosForNode(node, endPos), { easing: 'quadInOut' })
            .call(() => {
                if (!cc.isValid(node)) return;
                skeleton.setAnimation(0, config.anims[0], true);
                this._playSound(soundName);
                this._destroyAfterDelay(node, 3);
            })
            .start();
    }

    // C 类：不使用通用命中动画，而是在发送者/目标位置分别播放配置好的局部效果。
    private _playPatternC(
        offset: number,
        config: PropAnimConfig,
        senderData: ThrowPropSeatNodes,
        targetData: ThrowPropSeatNodes,
        data: ThrowPropBroadcastData
    ): void {
        const targetPos = this._getLocalPos(targetData.avatarNode);
        const soundName = config.soundName;
        const allData = this._getSkeletons(config.spines);
        if (!this._isRootValid()) return;
        if (config.anims.length === 1) {
            const node = this._createSpineNode(allData[0], config.anims[0], false, targetPos, targetData.propNode);
            this._destroyAfterComplete(node, 4);
            if (offset === 9) {
                this._playSound(this._getRole(data.userID, data.targetUserID) === 'receiver' ? 'sound/PropOp/sfx_touch_mus' : 'sound/PropOp/sfx_money');
            } else {
                this._playSound(soundName);
            }
            return;
        }
        const senderPos = this._getLocalPos(senderData.avatarNode);
        if (offset === 7) {
            const handNode = this._createSpineNode(allData[0], config.anims[0], false, senderPos, senderData.propNode);
            this._destroyAfterComplete(handNode, 4);
            cc.tween(handNode).to(0.5, this._toTweenPosForNode(handNode, targetPos), { easing: 'quadInOut' }).start();
            const targetEffect = this._createSpineNode(allData[0], config.anims[1], false, targetPos, targetData.propNode);
            this._destroyAfterComplete(targetEffect, 4);
        } else {
            const senderEffect = this._createSpineNode(allData[0], config.anims[0], false, senderPos, senderData.propNode);
            const targetEffect = this._createSpineNode(allData[0], config.anims[1], false, targetPos, targetData.propNode);
            this._destroyAfterComplete(senderEffect, 4);
            this._destroyAfterComplete(targetEffect, 4);
        }
        this._playSound(soundName);
    }

    // D 类：道具表现依赖当前客户端身份，需要按发送者、接收者、旁观者分支播放专用序列。
    private _playPatternD(offset: number, senderData: ThrowPropSeatNodes, targetData: ThrowPropSeatNodes, data: ThrowPropBroadcastData): void {
        const config = ThrowPropManager.CONFIGS[offset];
        const role = this._getRole(data.userID, data.targetUserID);
        if (offset === 4) this._playBeer(senderData, targetData, role, config);
        if (offset === 8) this._playBoxing(senderData, targetData, role, config);
        if (offset === 10) this._playFish(senderData, targetData, role, config);
        if (offset === 11) this._playBaseball(senderData, targetData, role, config);
    }

    private _playBeer(senderData: ThrowPropSeatNodes, targetData: ThrowPropSeatNodes, role: PropRole, config: PropAnimConfig): void {
        const [beerData, screenData] = this._getSkeletons(config.spines);
        if (!this._isRootValid()) return;
        const senderPos = this._getLocalPos(senderData.avatarNode);
        const targetPos = this._getLocalPos(targetData.avatarNode);
        if (role === 'sender' || role === 'receiver') {
            this._playSound('sound/PropOp/sfx_beer_screen');
            this._destroyAfterComplete(this._createSpineNode(screenData, '1', false, this._getScreenCenter()), 5);
            this._destroyAfterComplete(this._createSpineNode(beerData, '3', false, senderPos), 5);
            this._destroyAfterComplete(this._createSpineNode(beerData, '3', false, targetPos), 5);
            return;
        }
        this._playSound(config.soundName);
        this._destroyAfterComplete(this._createSpineNode(beerData, '2', false, senderPos, senderData.propNode), 5);
        this._destroyAfterComplete(this._createSpineNode(beerData, '2', false, targetPos, targetData.propNode), 5);
    }

    private _playBoxing(senderData: ThrowPropSeatNodes, targetData: ThrowPropSeatNodes, role: PropRole, config: PropAnimConfig): void {
        const [boxData, screenData] = this._getSkeletons(config.spines);
        if (!this._isRootValid()) return;
        const senderPos = this._getLocalPos(senderData.avatarNode);
        const targetPos = this._getLocalPos(targetData.avatarNode);
        const screenCenter = this._getScreenCenter();
        if (role === 'sender') {
            this._playSound('sound/PropOp/sfx_boxing_sender1');
            this._chainSpine(this._createSpineNode(screenData, 'box_full_1', false, screenCenter), () => {
                this._playSound('sound/PropOp/sfx_boxing_sender2');
                this._destroyAfterComplete(this._createSpineNode(boxData, 'box_local_1', false, targetPos), 4);
            });
            return;
        }
        if (role === 'receiver') {
            this._playSound('sound/PropOp/sfx_boxing_beaten1');
            this._chainSpine(this._createSpineNode(boxData, 'box_local_2', false, senderPos), () => {
                this._playSound('sound/PropOp/sfx_boxing_beaten2');
                this._destroyAfterComplete(this._createSpineNode(screenData, 'box_full_2', false, screenCenter), 5);
            });
            return;
        }
        this._playSound('sound/PropOp/sfx_boxing_beaten1');
        this._chainSpine(this._createSpineNode(boxData, 'box_local_2', false, senderPos, senderData.propNode), () => {
            this._playSound('sound/PropOp/sfx_boxing_sender2');
            this._destroyAfterComplete(this._createSpineNode(boxData, 'box_local_1', false, targetPos, targetData.propNode), 4);
        });
    }

    private _playFish(senderData: ThrowPropSeatNodes, targetData: ThrowPropSeatNodes, role: PropRole, config: PropAnimConfig): void {
        const [fishData, senderScreenData, receiverScreenData, waveData] = this._getSkeletons(config.spines);
        if (!this._isRootValid()) return;
        const senderPos = this._getLocalPos(senderData.avatarNode);
        const targetPos = this._getLocalPos(targetData.avatarNode);
        const center = this._getScreenCenter();
        if (role === 'sender') {
            this._playSound('sound/PropOp/sfx_fish2');
            this._destroyAfterComplete(this._createSpineNode(senderScreenData, 'sy2', false, center), 6);
            this._destroyAfterComplete(this._createSpineNode(waveData, 'hl1', false, center), 6);
            return;
        }
        if (role === 'receiver') {
            this._playSound('sound/PropOp/sfx_fish');
            this._destroyAfterComplete(this._createSpineNode(receiverScreenData, 'sy', false, center), 6);
            this._destroyAfterComplete(this._createSpineNode(waveData, 'hl2', false, center), 6);
            return;
        }
        this._playSound('sound/PropOp/sfx_fish');
        const fishNode = this._createSpineNode(fishData, 'sy3_1', true, senderPos);
        const skeleton = fishNode.getComponent(sp.Skeleton);
        const dir = cc.v2(targetPos.x - senderPos.x, targetPos.y - senderPos.y).normalize();
        const exitDir = cc.v2(dir.y, -dir.x).normalize();
        const exitPos = cc.v3(targetPos.x + exitDir.x * 100, targetPos.y + exitDir.y * 100, 0);
        fishNode.angle = (cc.v2(0, 1).signAngle(dir) * 180) / Math.PI;
        fishNode.scaleX = dir.x > 0 ? -Math.abs(fishNode.scaleX || 1) : Math.abs(fishNode.scaleX || 1);
        cc.tween(fishNode)
            .to(2, this._toTweenPosForNode(fishNode, targetPos), { easing: 'sineInOut' })
            .call(() => {
                if (!cc.isValid(fishNode)) return;
                skeleton.setAnimation(0, 'sy3_2', false);
                fishNode.angle = (cc.v2(0, 1).signAngle(exitDir) * 180) / Math.PI;
                fishNode.scaleX = exitDir.x > 0 ? -Math.abs(fishNode.scaleX || 1) : Math.abs(fishNode.scaleX || 1);
                this._destroyAfterComplete(this._createSpineNode(fishData, 'bl', false, targetPos), 4);
            })
            .delay(0.3)
            .to(1, this._toTweenPosForNode(fishNode, exitPos), { easing: 'sineInOut' })
            .call(() => {
                this._releaseSpineNode(fishNode);
            })
            .start();
        this._destroyAfterComplete(this._createSpineNode(waveData, 'hl3', false, center), 6);
    }

    private _playBaseball(senderSeatData: ThrowPropSeatNodes, targetSeatData: ThrowPropSeatNodes, role: PropRole, config: PropAnimConfig): void {
        this._playSound(config.soundName);
        const [senderSkeletonData, receiverSkeletonData, otherSkeletonData] = this._getSkeletons(config.spines);
        if (!this._isRootValid()) return;
        const senderPos = this._getLocalPos(senderSeatData.avatarNode);
        const targetPos = this._getLocalPos(targetSeatData.avatarNode);
        if (role === 'sender') {
            this._playBaseballSequence(senderSkeletonData, senderPos, targetPos, false, senderSeatData.propNode);
        } else if (role === 'receiver') {
            this._playBaseballSequence(receiverSkeletonData, senderPos, targetPos, false, senderSeatData.propNode);
        } else {
            this._playBaseballSequence(otherSkeletonData, senderPos, targetPos, true, senderSeatData.propNode);
        }
    }

    private _playBaseballSequence(skeletonData: sp.SkeletonData, startPos: cc.Vec3, targetPos: cc.Vec3, exitAfterHit: boolean, propNode: cc.Node): void {
        const node = this._createSpineNode(skeletonData, '1', false, startPos, propNode);
        const skeleton = node.getComponent(sp.Skeleton);
        skeleton.setCompleteListener(() => {
            if (!cc.isValid(node)) return;
            skeleton.setCompleteListener(() => {});
            skeleton.setAnimation(0, '2', false);
            cc.tween(node).to(0.333, this._toTweenPosForNode(node, targetPos), { easing: 'quadInOut' }).start();
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
                            .to(1, this._toTweenPosForNode(node, exitPos), { easing: 'quadIn' })
                            .call(() => {
                                this._releaseSpineNode(node);
                            })
                            .start();
                    });
                })
                .start();
        });
        this._destroyAfterDelay(node, exitAfterHit ? 10 : 8);
    }

    private _getSkeleton(path: string): sp.SkeletonData {
        return AssetManager.mustGetLoaded(BUNDLE_RESOURCES, path, sp.SkeletonData);
    }

    private _getSkeletons(paths: string[]): sp.SkeletonData[] {
        return paths.map(path => this._getSkeleton(path));
    }

    private _getDiamondPrefabs(): Promise<cc.Prefab[]> {
        return Promise.all([
            AssetManager.getOrLoad(BUNDLE_RESOURCES, 'effect/diamondFly', cc.Prefab),
            AssetManager.getOrLoad(BUNDLE_RESOURCES, 'effect/DiamondIcon', cc.Prefab),
            AssetManager.getOrLoad(BUNDLE_RESOURCES, 'effect/diamondSpine', cc.Prefab)
        ]);
    }

    private _createSpineNode(skeletonData: sp.SkeletonData, animName: string, loop: boolean, localPos: cc.Vec3, propNode?: cc.Node): cc.Node {
        const node = propNode || new cc.Node('PropSpine');
        const skeleton = node.getComponent(sp.Skeleton) || node.addComponent(sp.Skeleton);
        if (!propNode) {
            node.parent = this._fullscreenRoot || this._root;
            node.zIndex = 9999;
        }
        node.stopAllActions();
        node.active = true;
        node.opacity = 255;
        node.angle = 0;
        node.scaleX = Math.abs(node.scaleX || 1);
        node.scaleY = Math.abs(node.scaleY || 1);
        this._setRootLocalPosition(node, localPos);
        skeleton.setCompleteListener(() => {});
        const currentSkeletonData = propNode ? this._seatPropSkeletonData.get(node) : null;
        if (!propNode || currentSkeletonData !== skeletonData) {
            skeleton.skeletonData = skeletonData;
            if (propNode) this._seatPropSkeletonData.set(node, skeletonData);
        }
        if (animName) skeleton.setAnimation(0, animName, loop);
        else this._resetSkeleton(skeleton);
        return node;
    }

    private _chainSpine(node: cc.Node, next: () => void): void {
        const skeleton = node.getComponent(sp.Skeleton);
        skeleton.setCompleteListener(() => {
            if (!cc.isValid(node)) return;
            this._releaseSpineNode(node);
            next();
        });
        this._destroyAfterDelay(node, 6);
    }

    private _destroyAfterComplete(node: cc.Node, fallbackDelay: number): void {
        if (!node) return;
        const skeleton = node.getComponent(sp.Skeleton);
        if (skeleton) {
            skeleton.setCompleteListener(() => {
                this._releaseSpineNode(node);
            });
        }
        this._destroyAfterDelay(node, fallbackDelay);
    }

    private _destroyAfterDelay(node: cc.Node, delay: number): void {
        if (!node) return;
        cc.tween(node)
            .delay(delay)
            .call(() => {
                this._releaseSpineNode(node);
            })
            .start();
    }

    private _releaseSpineNode(node: cc.Node): void {
        if (!node || !cc.isValid(node)) return;
        node.stopAllActions();
        const skeleton = node.getComponent(sp.Skeleton);
        if (skeleton) {
            skeleton.setCompleteListener(() => {});
        }
        if (!this._seatPropSkeletonData.has(node)) {
            node.destroy();
            return;
        }
        node.active = false;
    }

    private _resetSkeleton(skeleton: sp.Skeleton): void {
        skeleton.clearTracks();
        skeleton.setToSetupPose();
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
        if (!name || !soundManager.isOn) return;
        const clip = AssetManager.mustGetLoaded(BUNDLE_RESOURCES, name, cc.AudioClip);
        cc.audioEngine.playEffect(clip, false);
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

    private _toTweenPosForNode(node: cc.Node, rootLocalPos: cc.Vec3): { x: number; y: number } {
        const pos = this._convertRootLocalPosToNodeParent(node, rootLocalPos);
        return { x: pos.x, y: pos.y };
    }

    private _setRootLocalPosition(node: cc.Node, rootLocalPos: cc.Vec3): void {
        node.setPosition(this._convertRootLocalPosToNodeParent(node, rootLocalPos));
    }

    private _convertRootLocalPosToNodeParent(node: cc.Node, rootLocalPos: cc.Vec3): cc.Vec3 {
        if (!this._root || !node?.parent || node.parent === this._root) return rootLocalPos;
        const worldPos = this._root.convertToWorldSpaceAR(rootLocalPos);
        return node.parent.convertToNodeSpaceAR(worldPos);
    }

    private _isRootValid(): boolean {
        return !!this._root && cc.isValid(this._root);
    }
}

const throwPropManager = new ThrowPropManager();

export default throwPropManager;
