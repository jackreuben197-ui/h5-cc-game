import soundManager from '../../core/SoundManager';
import { DiamondGiftBroadcastData, EmojiBroadcastData, ThrowPropBroadcastData } from '../../data/room/texas/TexasGameRoomDataSeatsStateManager';
import userStore from '../../data/user/UserStore';
import { PropsID, getMagicEmojiTypeBase } from '../../game/constant/BroadcastCode';
import AssetManager, { BUNDLE_RESOURCES } from '../loader/AssetManager';

type PropRole = 'sender' | 'receiver' | 'bystander';

type RoleValue<T> = T | Partial<Record<PropRole, T>>;

interface PropClipConfig {
    spine: string;
    anim: string;
    soundName?: RoleValue<string | string[]>;
    loop?: boolean;
}

interface PropAnimConfig {
    clips: Record<string, PropClipConfig>;
    fullscreen?: RoleValue<boolean>;
    duration: RoleValue<number>;
}

export interface ThrowPropSeatNodes {
    avatarNode: cc.Node;
    propNode: cc.Node;
    emojiNode: cc.Node;
}

interface ThrowPropTask {
    data: ThrowPropBroadcastData;
    senderData: ThrowPropSeatNodes;
    targetData: ThrowPropSeatNodes;
    type: PropsID;
    config: PropAnimConfig;
    role: PropRole;
    fullscreen: boolean;
    duration: number;
}

class ThrowPropManager {
    private static readonly PROP_Z_INDEX = 9999;
    private static readonly CONFIGS: Partial<Record<PropsID, PropAnimConfig>> = {
        [PropsID.PROPSTOMATO]: {
            duration: 4.5,
            clips: {
                hit: { spine: 'rc/other/effect/expressionTomato/skeleton', anim: '1', soundName: 'sound/PropOp/sfx_tomato_mus' }
            }
        },
        [PropsID.PROPSFLOWER]: {
            duration: 4.5,
            clips: {
                hit: { spine: 'rc/other/effect/expressionFlower/skeleton', anim: 'animation', soundName: 'sound/PropOp/sfx_rose_mus' }
            }
        },
        [PropsID.PROPSKISS]: {
            duration: 4.5,
            clips: {
                hit: { spine: 'rc/other/effect/expressionKiss/kiss', anim: '1', soundName: 'sound/PropOp/sfx_kiss_mus' }
            }
        },
        [PropsID.PROPSGOOD]: {
            duration: 4.5,
            clips: {
                hit: { spine: 'rc/other/effect/expressionGood/skeleton', anim: 'animation', soundName: 'sound/PropOp/sfx_like_mus' }
            }
        },
        [PropsID.PROPSCHEERS]: {
            fullscreen: { sender: true, receiver: true, bystander: false },
            duration: 5,
            clips: {
                screen: { spine: 'rc/other/effect/expressionBeerScreen/cheers_1', anim: '1', soundName: 'sound/PropOp/sfx_beer_screen' },
                seatScreen: { spine: 'rc/other/effect/expressionBeer/cheers_2', anim: '3' },
                seat: { spine: 'rc/other/effect/expressionBeer/cheers_2', anim: '2', soundName: 'sound/PropOp/sfx_cheers_mus' }
            }
        },
        [PropsID.PROPSTOUCH]: {
            duration: 3.5,
            clips: {
                hit: { spine: 'rc/other/effect/expressionTouch/touch', anim: 'animation', soundName: 'sound/PropOp/sfx_touch_mus', loop: true }
            }
        },
        [PropsID.PROPSSHARK]: {
            duration: 4,
            clips: {
                sender: { spine: 'rc/other/effect/expressionShark/shark', anim: 'shark_set', soundName: 'sound/PropOp/sfx_shark_mus' },
                receiver: { spine: 'rc/other/effect/expressionShark/shark', anim: 'shark_receive' }
            }
        },
        [PropsID.PROPSCHICKEN]: {
            duration: 4,
            clips: {
                hand: { spine: 'rc/other/effect/expressionChicken/chicken_spine', anim: 'chicken_set', soundName: 'sound/PropOp/sfx_zhuaji_mus' },
                receiver: { spine: 'rc/other/effect/expressionChicken/chicken_spine', anim: 'chicken_receive' }
            }
        },
        [PropsID.PROPSBOXING]: {
            fullscreen: { sender: true, receiver: true, bystander: false },
            duration: { sender: 6, receiver: 6, bystander: 4 },
            clips: {
                senderScreen: { spine: 'rc/other/effect/expressionBoxScreen/box_full', anim: 'box_full_1', soundName: 'sound/PropOp/sfx_boxing_sender1' },
                senderHit: { spine: 'rc/other/effect/expressionBox/box_local', anim: 'box_local_1', soundName: 'sound/PropOp/sfx_boxing_sender2' },
                receiverPunch: { spine: 'rc/other/effect/expressionBox/box_local', anim: 'box_local_2', soundName: 'sound/PropOp/sfx_boxing_beaten1' },
                receiverScreen: { spine: 'rc/other/effect/expressionBoxScreen/box_full', anim: 'box_full_2', soundName: 'sound/PropOp/sfx_boxing_beaten2' }
            }
        },
        [PropsID.PROPSMONEY]: {
            duration: 4,
            clips: {
                receiver: {
                    spine: 'rc/other/effect/expressionMoney/attachments',
                    anim: 'attachments_1_receive',
                    soundName: {
                        sender: 'sound/PropOp/sfx_money',
                        receiver: 'sound/PropOp/sfx_touch_mus',
                        bystander: 'sound/PropOp/sfx_money'
                    }
                }
            }
        },
        [PropsID.PROPSFISH]: {
            fullscreen: true,
            duration: 6,
            clips: {
                senderScreen: { spine: 'rc/other/effect/expressionFishScreenSender/sy2', anim: 'sy2', soundName: 'sound/PropOp/sfx_fish2' },
                receiverScreen: { spine: 'rc/other/effect/expressionFishScreenReceiver/sy', anim: 'sy', soundName: 'sound/PropOp/sfx_fish' },
                fishSwim: { spine: 'rc/other/effect/expressionFish/sy3', anim: 'sy3_1', soundName: 'sound/PropOp/sfx_fish', loop: true },
                fishExit: { spine: 'rc/other/effect/expressionFish/sy3', anim: 'sy3_2' },
                splash: { spine: 'rc/other/effect/expressionFish/sy3', anim: 'bl' },
                waveSender: { spine: 'rc/other/effect/expressionFishWave/hl', anim: 'hl1' },
                waveReceiver: { spine: 'rc/other/effect/expressionFishWave/hl', anim: 'hl2' },
                waveOther: { spine: 'rc/other/effect/expressionFishWave/hl', anim: 'hl3' }
            }
        },
        [PropsID.PROPSBASEBALL]: {
            duration: { sender: 8, receiver: 8, bystander: 10 },
            clips: {
                senderStart: { spine: 'rc/other/effect/expressionBaseballSender/skeleton', anim: '1', soundName: 'sound/PropOp/sfx_baseball' },
                senderFly: { spine: 'rc/other/effect/expressionBaseballSender/skeleton', anim: '2' },
                senderHit: { spine: 'rc/other/effect/expressionBaseballSender/skeleton', anim: '3' },
                receiverStart: { spine: 'rc/other/effect/expressionBaseballReceiver/ballfolder1', anim: '1', soundName: 'sound/PropOp/sfx_baseball' },
                receiverFly: { spine: 'rc/other/effect/expressionBaseballReceiver/ballfolder1', anim: '2' },
                receiverHit: { spine: 'rc/other/effect/expressionBaseballReceiver/ballfolder1', anim: '3' },
                otherStart: { spine: 'rc/other/effect/expressionBaseballOther/skeleton', anim: '1', soundName: 'sound/PropOp/sfx_baseball' },
                otherFly: { spine: 'rc/other/effect/expressionBaseballOther/skeleton', anim: '2' },
                otherHit: { spine: 'rc/other/effect/expressionBaseballOther/skeleton', anim: '3' },
                otherExit: { spine: 'rc/other/effect/expressionBaseballOther/skeleton', anim: '4' }
            }
        }
    };
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
        this._bringNodeToTop(this._fullscreenRoot);
    }

    public playProp(data: ThrowPropBroadcastData, senderData: ThrowPropSeatNodes, targetData: ThrowPropSeatNodes): void {
        const config = ThrowPropManager.CONFIGS[data.type];
        if (!config || !this._root || !cc.isValid(this._root)) return;
        if (!senderData || !targetData) return;
        const role = this._getRole(data.userID, data.targetUserID);
        const task: ThrowPropTask = {
            data,
            senderData,
            targetData,
            type: data.type,
            config,
            role,
            fullscreen: this._getRoleValue(config.fullscreen, role, false),
            duration: this._getRoleValue(config.duration, role, 4)
        };
        this._propQueue.push(task);
        this._tryPlayQueuedProps();
    }

    private _playPropNow(task: ThrowPropTask): void {
        switch (task.type) {
            case PropsID.PROPSTOMATO:
                this._playTomato(task);
                break;
            case PropsID.PROPSFLOWER:
                this._playFlower(task);
                break;
            case PropsID.PROPSKISS:
                this._playKiss(task);
                break;
            case PropsID.PROPSGOOD:
                this._playGood(task);
                break;
            case PropsID.PROPSCHEERS:
                this._playBeer(task);
                break;
            case PropsID.PROPSTOUCH:
                this._playTouch(task);
                break;
            case PropsID.PROPSSHARK:
                this._playShark(task);
                break;
            case PropsID.PROPSCHICKEN:
                this._playChicken(task);
                break;
            case PropsID.PROPSBOXING:
                this._playBoxing(task);
                break;
            case PropsID.PROPSMONEY:
                this._playMoney(task);
                break;
            case PropsID.PROPSFISH:
                this._playFish(task);
                break;
            case PropsID.PROPSBASEBALL:
                this._playBaseball(task);
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

    public async playEmoji(data: EmojiBroadcastData, senderData: ThrowPropSeatNodes): Promise<void> {
        const index = data.type - this._getEmojiTypeBase() + 1;
        if (index < 1 || index > 15 || !this._root || !cc.isValid(this._root)) return;
        const avatarNode = senderData?.avatarNode;
        const emojiNode = senderData?.emojiNode;
        if (!avatarNode || !emojiNode) return;
        let spriteFrame: cc.SpriteFrame = null;
        try {
            spriteFrame = await AssetManager.getOrLoad(BUNDLE_RESOURCES, `rc/other/emoji/em${index}`, cc.SpriteFrame);
        } catch (error) {
            cc.warn('[ThrowPropManager] load emoji failed', index, error);
            return;
        }
        if (!this._isRootValid() || !cc.isValid(avatarNode) || !cc.isValid(emojiNode)) return;
        const sprite = emojiNode.getComponent(cc.Sprite);
        sprite.spriteFrame = spriteFrame;
        this._bringNodeToTop(emojiNode);
        emojiNode.stopAllActions();
        emojiNode.active = true;
        emojiNode.opacity = 0;
        emojiNode.scale = 0.5;
        const startPos = this._convertNodePosToNodeParent(emojiNode, avatarNode, cc.v3(0, avatarNode.height / 4, 0));
        emojiNode.setPosition(startPos);
        cc.tween(emojiNode)
            .to(0.18, { opacity: 255, scale: 1.2 }, { easing: 'backOut' })
            .to(0.12, { scale: 1 })
            .delay(1.2)
            .to(0.25, { opacity: 0, y: emojiNode.y + 30 })
            .call(() => {
                if (cc.isValid(emojiNode)) emojiNode.active = false;
            })
            .start();
    }

    private _getEmojiTypeBase(): number {
        return getMagicEmojiTypeBase();
    }

    private _playTomato(task: ThrowPropTask): void {
        this._playFlyToTargetClip(task, 'hit');
    }

    private _playFlower(task: ThrowPropTask): void {
        this._playFlyToTargetClip(task, 'hit');
    }

    private _playKiss(task: ThrowPropTask): void {
        this._playFlyToTargetClip(task, 'hit', true);
    }

    private _playGood(task: ThrowPropTask): void {
        this._playFlyToTargetClip(task, 'hit');
    }

    private _playTouch(task: ThrowPropTask): void {
        const clip = this._getClip(task.config, 'hit');
        const skeletonData = this._getSkeleton(clip.spine);
        if (!this._isRootValid()) return;
        const node = this._createSpineNode(skeletonData, '', false, this._getLocalPos(task.senderData.avatarNode), task.senderData.propNode);
        const skeleton = node.getComponent(sp.Skeleton);
        const endPos = this._getLocalPos(task.targetData.avatarNode);
        cc.tween(node)
            .to(0.5, this._toTweenPosForNode(node, endPos), { easing: 'quadInOut' })
            .call(() => {
                if (!cc.isValid(node)) return;
                this._setSkeletonClip(skeleton, clip);
                this._playClipSound(clip, task.role);
                this._destroyAfterDelay(node, 3);
            })
            .start();
    }

    private _playShark(task: ThrowPropTask): void {
        const senderPos = this._getLocalPos(task.senderData.avatarNode);
        const targetPos = this._getLocalPos(task.targetData.avatarNode);
        if (!this._isRootValid()) return;
        const senderClip = this._getClip(task.config, 'sender');
        const receiverClip = this._getClip(task.config, 'receiver');
        const senderEffect = this._createClipNode(senderClip, senderPos, task.senderData.propNode);
        const targetEffect = this._createClipNode(receiverClip, targetPos, task.targetData.propNode);
        this._destroyAfterComplete(senderEffect, 4);
        this._destroyAfterComplete(targetEffect, 4);
        this._playClipSound(senderClip, task.role);
    }

    private _playChicken(task: ThrowPropTask): void {
        const senderPos = this._getLocalPos(task.senderData.avatarNode);
        const targetPos = this._getLocalPos(task.targetData.avatarNode);
        if (!this._isRootValid()) return;
        const handClip = this._getClip(task.config, 'hand');
        const receiverClip = this._getClip(task.config, 'receiver');
        const handNode = this._createClipNode(handClip, senderPos, task.senderData.propNode);
        this._destroyAfterComplete(handNode, 4);
        cc.tween(handNode).to(0.5, this._toTweenPosForNode(handNode, targetPos), { easing: 'quadInOut' }).start();
        const targetEffect = this._createClipNode(receiverClip, targetPos, task.targetData.propNode);
        this._destroyAfterComplete(targetEffect, 4);
        this._playClipSound(handClip, task.role);
    }

    private _playMoney(task: ThrowPropTask): void {
        const targetPos = this._getLocalPos(task.targetData.avatarNode);
        if (!this._isRootValid()) return;
        const clip = this._getClip(task.config, 'receiver');
        const node = this._createClipNode(clip, targetPos, task.targetData.propNode);
        this._destroyAfterComplete(node, 4);
        this._playClipSound(clip, task.role);
    }

    private _playBeer(task: ThrowPropTask): void {
        const senderPos = this._getLocalPos(task.senderData.avatarNode);
        const targetPos = this._getLocalPos(task.targetData.avatarNode);
        if (!this._isRootValid()) return;
        if (task.role === 'sender' || task.role === 'receiver') {
            const screenClip = this._getClip(task.config, 'screen');
            const seatClip = this._getClip(task.config, 'seatScreen');
            this._playClipSound(screenClip, task.role);
            this._destroyAfterComplete(this._createClipNode(screenClip, this._getScreenCenter()), 5);
            this._destroyAfterComplete(this._createClipNode(seatClip, senderPos), 5);
            this._destroyAfterComplete(this._createClipNode(seatClip, targetPos), 5);
            return;
        }
        const seatClip = this._getClip(task.config, 'seat');
        this._playClipSound(seatClip, task.role);
        this._destroyAfterComplete(this._createClipNode(seatClip, senderPos, task.senderData.propNode), 5);
        this._destroyAfterComplete(this._createClipNode(seatClip, targetPos, task.targetData.propNode), 5);
    }

    private _playBoxing(task: ThrowPropTask): void {
        const senderPos = this._getLocalPos(task.senderData.avatarNode);
        const targetPos = this._getLocalPos(task.targetData.avatarNode);
        const screenCenter = this._getScreenCenter();
        if (!this._isRootValid()) return;
        if (task.role === 'sender') {
            const screenClip = this._getClip(task.config, 'senderScreen');
            const hitClip = this._getClip(task.config, 'senderHit');
            this._playClipSound(screenClip, task.role);
            this._chainSpine(this._createClipNode(screenClip, screenCenter), () => {
                this._playClipSound(hitClip, task.role);
                this._destroyAfterComplete(this._createClipNode(hitClip, targetPos), 4);
            });
            return;
        }
        if (task.role === 'receiver') {
            const punchClip = this._getClip(task.config, 'receiverPunch');
            const screenClip = this._getClip(task.config, 'receiverScreen');
            this._playClipSound(punchClip, task.role);
            this._chainSpine(this._createClipNode(punchClip, senderPos), () => {
                this._playClipSound(screenClip, task.role);
                this._destroyAfterComplete(this._createClipNode(screenClip, screenCenter), 5);
            });
            return;
        }
        const punchClip = this._getClip(task.config, 'receiverPunch');
        const hitClip = this._getClip(task.config, 'senderHit');
        this._playClipSound(punchClip, task.role);
        this._chainSpine(this._createClipNode(punchClip, senderPos, task.senderData.propNode), () => {
            this._playClipSound(hitClip, task.role);
            this._destroyAfterComplete(this._createClipNode(hitClip, targetPos, task.targetData.propNode), 4);
        });
    }

    private _playFish(task: ThrowPropTask): void {
        const senderPos = this._getLocalPos(task.senderData.avatarNode);
        const targetPos = this._getLocalPos(task.targetData.avatarNode);
        const center = this._getScreenCenter();
        if (!this._isRootValid()) return;
        if (task.role === 'sender') {
            const screenClip = this._getClip(task.config, 'senderScreen');
            this._playClipSound(screenClip, task.role);
            this._destroyAfterComplete(this._createClipNode(screenClip, center), 6);
            this._destroyAfterComplete(this._createClipNode(this._getClip(task.config, 'waveSender'), center), 6);
            return;
        }
        if (task.role === 'receiver') {
            const screenClip = this._getClip(task.config, 'receiverScreen');
            this._playClipSound(screenClip, task.role);
            this._destroyAfterComplete(this._createClipNode(screenClip, center), 6);
            this._destroyAfterComplete(this._createClipNode(this._getClip(task.config, 'waveReceiver'), center), 6);
            return;
        }
        const swimClip = this._getClip(task.config, 'fishSwim');
        const exitClip = this._getClip(task.config, 'fishExit');
        const splashClip = this._getClip(task.config, 'splash');
        this._playClipSound(swimClip, task.role);
        const fishNode = this._createClipNode(swimClip, senderPos);
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
                this._setSkeletonClip(skeleton, exitClip);
                fishNode.angle = (cc.v2(0, 1).signAngle(exitDir) * 180) / Math.PI;
                fishNode.scaleX = exitDir.x > 0 ? -Math.abs(fishNode.scaleX || 1) : Math.abs(fishNode.scaleX || 1);
                this._destroyAfterComplete(this._createClipNode(splashClip, targetPos), 4);
            })
            .delay(0.3)
            .to(1, this._toTweenPosForNode(fishNode, exitPos), { easing: 'sineInOut' })
            .call(() => {
                this._releaseSpineNode(fishNode);
            })
            .start();
        this._destroyAfterComplete(this._createClipNode(this._getClip(task.config, 'waveOther'), center), 6);
    }

    private _playBaseball(task: ThrowPropTask): void {
        const senderPos = this._getLocalPos(task.senderData.avatarNode);
        const targetPos = this._getLocalPos(task.targetData.avatarNode);
        if (!this._isRootValid()) return;
        if (task.role === 'sender') {
            this._playBaseballSequence(
                [this._getClip(task.config, 'senderStart'), this._getClip(task.config, 'senderFly'), this._getClip(task.config, 'senderHit')],
                senderPos,
                targetPos,
                false,
                task.senderData.propNode,
                task.role
            );
        } else if (task.role === 'receiver') {
            this._playBaseballSequence(
                [this._getClip(task.config, 'receiverStart'), this._getClip(task.config, 'receiverFly'), this._getClip(task.config, 'receiverHit')],
                senderPos,
                targetPos,
                false,
                task.senderData.propNode,
                task.role
            );
        } else {
            this._playBaseballSequence(
                [
                    this._getClip(task.config, 'otherStart'),
                    this._getClip(task.config, 'otherFly'),
                    this._getClip(task.config, 'otherHit'),
                    this._getClip(task.config, 'otherExit')
                ],
                senderPos,
                targetPos,
                true,
                task.senderData.propNode,
                task.role
            );
        }
    }

    private _playBaseballSequence(
        clips: PropClipConfig[],
        startPos: cc.Vec3,
        targetPos: cc.Vec3,
        exitAfterHit: boolean,
        propNode: cc.Node,
        role: PropRole
    ): void {
        const [startClip, flyClip, hitClip, exitClip] = clips;
        this._playClipSound(startClip, role);
        const node = this._createClipNode(startClip, startPos, propNode);
        const skeleton = node.getComponent(sp.Skeleton);
        skeleton.setCompleteListener(() => {
            if (!cc.isValid(node)) return;
            skeleton.setCompleteListener(() => {});
            this._setSkeletonClip(skeleton, flyClip);
            cc.tween(node).to(0.333, this._toTweenPosForNode(node, targetPos), { easing: 'quadInOut' }).start();
            cc.tween(node)
                .delay(0.333)
                .call(() => {
                    if (!cc.isValid(node)) return;
                    this._setSkeletonClip(skeleton, hitClip);
                    if (!exitAfterHit) {
                        this._destroyAfterComplete(node, 5);
                        return;
                    }
                    skeleton.setCompleteListener(() => {
                        if (!cc.isValid(node)) return;
                        this._setSkeletonClip(skeleton, exitClip);
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

    private _playFlyToTargetClip(task: ThrowPropTask, clipName: string, playSoundOnStart: boolean = false): void {
        const clip = this._getClip(task.config, clipName);
        if (playSoundOnStart) this._playClipSound(clip, task.role);
        const skeletonData = this._getSkeleton(clip.spine);
        if (!this._isRootValid()) return;
        const node = this._createSpineNode(skeletonData, '', false, this._getLocalPos(task.senderData.avatarNode), task.senderData.propNode);
        const skeleton = node.getComponent(sp.Skeleton);
        const endPos = this._getLocalPos(task.targetData.avatarNode);
        cc.tween(node)
            .to(0.5, this._toTweenPosForNode(node, endPos), { easing: 'quadInOut' })
            .call(() => {
                if (!cc.isValid(node)) return;
                this._setSkeletonClip(skeleton, clip);
                this._destroyAfterComplete(node, 4);
                this._playClipSoundDelay(clip, task.role, 1);
            })
            .start();
    }

    private _getClip(config: PropAnimConfig, name: string): PropClipConfig {
        return config.clips[name];
    }

    private _createClipNode(clip: PropClipConfig, localPos: cc.Vec3, propNode?: cc.Node): cc.Node {
        return this._createSpineNode(this._getSkeleton(clip.spine), clip.anim, !!clip.loop, localPos, propNode);
    }

    private _setSkeletonClip(skeleton: sp.Skeleton, clip: PropClipConfig): void {
        skeleton.setAnimation(0, clip.anim, !!clip.loop);
    }

    private _getSkeleton(path: string): sp.SkeletonData {
        return AssetManager.mustGetLoaded(BUNDLE_RESOURCES, path, sp.SkeletonData);
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
        this._preparePropNode(node);
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

    private _preparePropNode(node: cc.Node): void {
        const parent = this._fullscreenRoot || this._root;
        if (node.parent !== parent) node.parent = parent;
        this._bringNodeToTop(parent);
        this._bringNodeToTop(node);
    }

    private _bringNodeToTop(node: cc.Node): void {
        if (!node || !cc.isValid(node)) return;
        node.zIndex = ThrowPropManager.PROP_Z_INDEX;
        if (node.parent) node.setSiblingIndex(node.parent.childrenCount - 1);
    }

    private _spawnDiamondSpine(prefab: cc.Prefab, localPos: cc.Vec3): void {
        const node = cc.instantiate(prefab);
        node.parent = this._root;
        this._bringNodeToTop(node);
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
        this._bringNodeToTop(node);
        node.setPosition(this._root.convertToNodeSpaceAR(worldPos));
        cc.tween(node)
            .by(0.6, { y: 60 })
            .to(0.4, { opacity: 0 })
            .call(() => {
                if (cc.isValid(node)) node.destroy();
            })
            .start();
    }

    private _playClipSoundDelay(clip: PropClipConfig, role: PropRole, delay: number): void {
        const soundName = this._getRoleValue(clip.soundName, role, null);
        if (!soundName || !this._isRootValid()) return;
        cc.tween(this._root)
            .delay(delay)
            .call(() => this._playSoundName(soundName))
            .start();
    }

    private _playClipSound(clip: PropClipConfig, role: PropRole): void {
        this._playSoundName(this._getRoleValue(clip.soundName, role, null));
    }

    private _playSoundName(soundName: string | string[] | null): void {
        if (!soundName) return;
        if (Array.isArray(soundName)) {
            soundName.forEach(name => this._playSound(name));
            return;
        }
        this._playSound(soundName);
    }

    private _playSound(name: string): void {
        if (!name || !soundManager.isOn) return;
        const clip = AssetManager.mustGetLoaded(BUNDLE_RESOURCES, name, cc.AudioClip);
        cc.audioEngine.playEffect(clip, false);
    }

    private _getRoleValue<T>(value: RoleValue<T> | undefined, role: PropRole, defaultValue: T): T {
        if (value === undefined) return defaultValue;
        if (typeof value !== 'object' || Array.isArray(value)) return value as T;
        return (value as Partial<Record<PropRole, T>>)[role] ?? defaultValue;
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

    private _convertNodePosToNodeParent(node: cc.Node, sourceNode: cc.Node, sourceLocalPos: cc.Vec3): cc.Vec3 {
        if (!node?.parent || !sourceNode) return cc.v3();
        const worldPos = sourceNode.convertToWorldSpaceAR(sourceLocalPos);
        return node.parent.convertToNodeSpaceAR(worldPos);
    }

    private _isRootValid(): boolean {
        return !!this._root && cc.isValid(this._root);
    }
}

const throwPropManager = new ThrowPropManager();

export default throwPropManager;
