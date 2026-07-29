import soundManager from '../../core/SoundManager';
import { DiamondGiftBroadcastData, EmojiBroadcastData, ThrowPropBroadcastData } from '../../data/room/texas/TexasGameRoomDataSeatsStateManager';
import userStore from '../../data/user/UserStore';
import { PropsID, pickerEmojiIndexFromType, PICKER_EMOJI_MIN_INDEX, PICKER_EMOJI_MAX_INDEX } from '../../game/constant/BroadcastCode';
import MagicEmojiConfig from '../../game/constant/MagicEmojiConfig';
import AssetManager, { BUNDLE_RESOURCES } from '../loader/AssetManager';
import { sampleLiveBounds, getAnimDuration } from './SpineBoundsUtil';

/** 图鉴表情动画归一化目标尺寸(较大边像素) */
const PICKER_EMOJI_TARGET_SIZE = 220;
/** 测量包围盒前的临时缩放，避免首帧巨大 */
const PICKER_EMOJI_TEMP_SCALE = 0.3;
/** 图鉴表情循环播放的停留时长(秒)，之后淡出——保证短动画也稳定可见 */
const PICKER_EMOJI_HOLD = 5.0;
/** 图鉴表情语音加强层音量（满音量：主层+加强层都满，最大响度） */
const PICKER_EMOJI_SOUND_BOOST = 1.0;

type PropRole = 'sender' | 'receiver' | 'bystander';

type RoleValue<T> = T | Partial<Record<PropRole, T>>;

interface PropClipConfig {
    spine: string;
    anim: string;
    soundName?: RoleValue<string | string[]>;
    loop?: boolean;
    /** 模式A分段：飞行过程中播放的飞行段动画；播完自然衔接命中段(anim) */
    flyAnim?: string;
    /** 模式A分段：飞行段固定时长(秒)；不填则用飞行动画真实时长 */
    flyDur?: number;
    /** 命中动画自带位移(如开枪/摸头)：不搬动节点，直接在目标处静止播放一次 */
    atTarget?: boolean;
}

/** 座位特效缩放，对齐 pokerqueen AVATAR_ANIM_SCALE */
const PROP_ANIM_SCALE = 0.7;

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
                hit: { spine: 'rc/other/effect/expressionTomato/skeleton', anim: 'dirt_splash', flyAnim: 'dirt_flying', soundName: 'sound/PropOp/sfx_tomato_mus' }
            }
        },
        [PropsID.PROPSFLOWER]: {
            duration: 4.5,
            clips: {
                hit: { spine: 'rc/other/effect/expressionFlower/skeleton', anim: 'hand_wave', soundName: 'sound/PropOp/sfx_rose_mus' }
            }
        },
        [PropsID.PROPSKISS]: {
            duration: 4.5,
            clips: {
                hit: { spine: 'rc/other/effect/expressionKiss/kiss', anim: 'lip_kissing', soundName: 'sound/PropOp/sfx_kiss_mus' }
            }
        },
        [PropsID.PROPSGOOD]: {
            duration: 4.5,
            clips: {
                hit: { spine: 'rc/other/effect/expressionGood/skeleton', anim: 'thumbs_up', flyAnim: 'fist_flying', soundName: 'sound/PropOp/sfx_like_mus' }
            }
        },
        // 干杯(604)→pokerqueen新beer：单骨骼 beer_cheers，在双方座位头顶各播一次(不再有全屏)
        [PropsID.PROPSCHEERS]: {
            duration: 4.5,
            clips: {
                hit: { spine: 'rc/other/effect/expressionBeer/cheers_2', anim: 'beer_cheers', soundName: 'sound/PropOp/sfx_cheers_mus' }
            }
        },
        [PropsID.PROPSTOUCH]: {
            duration: 3.5,
            clips: {
                hit: { spine: 'rc/other/effect/expressionTouch/touch', anim: 'hand_patting', atTarget: true, soundName: 'sound/PropOp/sfx_touch_mus' }
            }
        },
        [PropsID.PROPSSHARK]: {
            duration: 4,
            clips: {
                hit: { spine: 'rc/other/effect/expressionShark/shark', anim: 'babyshark' },
                eaten: { spine: 'rc/other/effect/expressionShark/shark', anim: 'shark_eaten' }
            }
        },
        [PropsID.PROPSCHICKEN]: {
            duration: 4,
            clips: {
                hand: { spine: 'rc/other/effect/expressionChicken/chicken_spine', anim: 'hand_flying', soundName: 'sound/PropOp/sfx_zhuaji_mus' },
                receiver: { spine: 'rc/other/effect/expressionChicken/chicken_spine', anim: 'hen_struggling' }
            }
        },
        // 拳击(608)→pokerqueen新gun：子弹/火球从发送者朝目标飞去(bullets-fireballs)
        [PropsID.PROPSBOXING]: {
            duration: 4,
            clips: {
                hit: { spine: 'rc/other/effect/expressionBox/box_local', anim: 'bullets-fireballs', soundName: 'sound/PropOp/sfx_boxing_sender1' }
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
        // 棒球(611)→pokerqueen新bomb blast：炸弹从发送者飞向目标(飞行由补间完成)，在目标处 blast 爆炸
        [PropsID.PROPSBASEBALL]: {
            duration: 4,
            clips: {
                hit: { spine: 'rc/other/effect/expressionBaseballSender/skeleton', anim: 'blast', flyAnim: 'bomb_flying', soundName: 'sound/PropOp/sfx_baseball' }
            }
        }
    };
    private _root: cc.Node = null;
    private _fullscreenRoot: cc.Node = null;
    private _seatPropSkeletonData: Map<cc.Node, sp.SkeletonData> = new Map();
    private _propQueue: ThrowPropTask[] = [];
    private _playingPropUsers: Set<number> = new Set();
    private _playingFullscreenProp: boolean = false;
    private _emojiPlayTokens: Map<cc.Node, number> = new Map();
    /** 图鉴表情骨骼常驻缓存(index→SkeletonData)，已 addRef 保留，避免每次播放重新加载导致延迟 */
    private _pickerSpineCache: Map<number, sp.SkeletonData> = new Map();
    /** 正在加载中的表情骨骼(index→Promise)，用于去重：预热与播放同时请求同一个只加载一次 */
    private _pickerSpineLoading: Map<number, Promise<sp.SkeletonData>> = new Map();
    private _pickerPreloadStarted = false;

    public initialize(root: cc.Node, fullscreenRoot: cc.Node): void {
        if (this._root !== root) {
            this._seatPropSkeletonData.clear();
            this._propQueue.length = 0;
            this._playingPropUsers.clear();
            this._playingFullscreenProp = false;
            this._emojiPlayTokens.clear();
        }
        this._root = root;
        this._fullscreenRoot = fullscreenRoot;
        this._bringNodeToTop(this._fullscreenRoot);
        // 后台预加载全部图鉴表情骨骼，消除首次播放/收到时的加载延迟(表情骨骼是全局资源，跨房间复用，只需预热一次)
        this._preloadPickerEmojis();
    }

    /** 后台预加载 em16-65 全部图鉴表情骨骼并常驻缓存(fire-and-forget，只执行一次) */
    private _preloadPickerEmojis(): void {
        if (this._pickerPreloadStarted) return;
        this._pickerPreloadStarted = true;
        for (let i = PICKER_EMOJI_MIN_INDEX; i <= PICKER_EMOJI_MAX_INDEX; i++) {
            this._loadPickerSpine(i).catch(() => {});
        }
    }

    /** 加载并常驻缓存图鉴表情骨骼；命中缓存/在途请求直接复用，避免重复加载与重复 addRef */
    private _loadPickerSpine(index: number): Promise<sp.SkeletonData> {
        const cached = this._pickerSpineCache.get(index);
        if (cached) return Promise.resolve(cached);
        const inflight = this._pickerSpineLoading.get(index);
        if (inflight) return inflight;
        const p = AssetManager.getOrLoad(BUNDLE_RESOURCES, `emoji_spine/em${index}/skeleton`, sp.SkeletonData)
            .then(data => {
                // 只在首次缓存时 addRef 一次，保留引用防止被引擎释放后又要重新加载
                if (data && !this._pickerSpineCache.has(index)) {
                    try {
                        data.addRef();
                    } catch (e) {}
                    this._pickerSpineCache.set(index, data);
                }
                this._pickerSpineLoading.delete(index);
                return data;
            })
            .catch(err => {
                this._pickerSpineLoading.delete(index);
                throw err;
            });
        this._pickerSpineLoading.set(index, p);
        return p;
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
        // 图鉴表情(em16-65)：从 emoji_spine / emoji_audio 加载并播放
        const pickerIndex = pickerEmojiIndexFromType(data.type);
        if (pickerIndex >= 0) {
            await this._playPickerEmoji(pickerIndex, senderData);
            return;
        }
        const config = MagicEmojiConfig.getByType(data.type);
        if (!config || !senderData || !this._root || !cc.isValid(this._root)) return;
        const avatarNode = senderData.avatarNode;
        const emojiNode = senderData.emojiNode;
        const token = (this._emojiPlayTokens.get(emojiNode) || 0) + 1;
        this._emojiPlayTokens.set(emojiNode, token);
        let skeletonData: sp.SkeletonData = null;
        try {
            skeletonData = await AssetManager.getOrLoad(BUNDLE_RESOURCES, config.spine, sp.SkeletonData);
        } catch (error) {
            cc.warn('[ThrowPropManager] load emoji failed', config.propCode, error);
            return;
        }
        if (!this._isRootValid() || !cc.isValid(avatarNode) || !cc.isValid(emojiNode) || this._emojiPlayTokens.get(emojiNode) !== token) return;
        const skeleton = emojiNode.getComponent(sp.Skeleton);
        skeleton.setCompleteListener(() => {});
        skeleton.skeletonData = skeletonData;
        this._resetSkeleton(skeleton);
        skeleton.setCompleteListener(() => {
            if (!cc.isValid(emojiNode) || this._emojiPlayTokens.get(emojiNode) !== token) return;
            skeleton.setCompleteListener(() => {});
            emojiNode.active = false;
        });
        this._bringNodeToTop(emojiNode);
        emojiNode.active = true;
        const startPos = this._convertNodePosToNodeParent(emojiNode, avatarNode, cc.v3(0, avatarNode.height / 4, 0));
        emojiNode.setPosition(startPos);
        skeleton.setAnimation(0, config.animation, false);
        this._playSound(config.sound);
    }

    /** 播放图鉴表情(em16-65)：spine 动画放在发送者头像上，同时播放对应语音 */
    private async _playPickerEmoji(index: number, senderData: ThrowPropSeatNodes): Promise<void> {
        if (!senderData || !this._root || !cc.isValid(this._root)) return;
        const avatarNode = senderData.avatarNode;
        const emojiNode = senderData.emojiNode;
        const token = (this._emojiPlayTokens.get(emojiNode) || 0) + 1;
        this._emojiPlayTokens.set(emojiNode, token);
        let skeletonData: sp.SkeletonData = null;
        try {
            skeletonData = await this._loadPickerSpine(index);
        } catch (error) {
            cc.warn('[ThrowPropManager] load picker emoji spine failed', index, error);
            return;
        }
        if (!this._isRootValid() || !cc.isValid(avatarNode) || !cc.isValid(emojiNode) || this._emojiPlayTokens.get(emojiNode) !== token) return;
        // 运行时取第一个动画名（各表情动画名不统一，如 animation / walk 等）
        let animName = 'animation';
        try {
            const rt: any = (skeletonData as any).getRuntimeData ? (skeletonData as any).getRuntimeData() : null;
            if (rt && rt.animations && rt.animations.length) animName = rt.animations[0].name;
        } catch (e) {}
        const skeleton = emojiNode.getComponent(sp.Skeleton);
        skeleton.setCompleteListener(() => {});
        skeleton.skeletonData = skeletonData;
        this._resetSkeleton(skeleton);
        this._bringNodeToTop(emojiNode);
        emojiNode.stopAllActions();
        emojiNode.active = true;
        emojiNode.opacity = 255;
        // 头像上方作为居中锚点；先给个临时小缩放避免首帧巨大
        const anchor = this._convertNodePosToNodeParent(emojiNode, avatarNode, cc.v3(0, avatarNode.height / 4, 0));
        emojiNode.setScale(PICKER_EMOJI_TEMP_SCALE);
        emojiNode.setPosition(anchor);
        // 循环播放动画
        skeleton.setAnimation(0, animName, true);
        // 各表情 spine 导出尺寸差异极大：延迟一帧量包围盒，归一化到目标尺寸并按包围盒居中
        const animDuration = getAnimDuration(skeleton, animName);
        skeleton.scheduleOnce(() => {
            if (!cc.isValid(emojiNode) || this._emojiPlayTokens.get(emojiNode) !== token) return;
            const b = sampleLiveBounds(skeleton, animDuration);
            if (b.max > 0) {
                const scale = PICKER_EMOJI_TARGET_SIZE / b.max;
                emojiNode.setScale(scale);
                emojiNode.setPosition(anchor.x - (b.offX + b.szX / 2) * scale, anchor.y - (b.offY + b.szY / 2) * scale);
            } else {
                // 量不到包围盒：改用骨骼导出尺寸归一化，保证可见（避免停在临时缩放上不显示）
                let dmax = 0;
                try {
                    const rt: any = (skeletonData as any).getRuntimeData ? (skeletonData as any).getRuntimeData() : null;
                    if (rt) dmax = Math.max(rt.width || 0, rt.height || 0);
                } catch (e) {}
                emojiNode.setScale(dmax > 0 ? PICKER_EMOJI_TARGET_SIZE / dmax : PICKER_EMOJI_TEMP_SCALE);
                emojiNode.setPosition(anchor);
            }
        }, 0);

        // 播放语音并获取音效时长，使动画播放时长与音效精确对齐
        const audioDuration = await this._playEmojiVoice(index);
        if (this._emojiPlayTokens.get(emojiNode) !== token) return;

        // 如果存在音效，则以音效时长为准；否则使用动画单帧/单次时长或默认时长
        const holdDuration = audioDuration > 0 ? audioDuration : (animDuration > 0 ? animDuration : 1.5);

        cc.tween(emojiNode)
            .delay(holdDuration)
            .to(0.3, { opacity: 0 }, { easing: 'sineIn' })
            .call(() => {
                if (this._emojiPlayTokens.get(emojiNode) !== token) return;
                emojiNode.active = false;
                emojiNode.opacity = 255;
            })
            .start();
    }

    /** 播放图鉴表情语音(emoji_audio/em{idx})：文件扩展名混合，按路径解析；无文件则静默。
     *  返回音效时长(秒)，以便动画与音效对齐 */
    private async _playEmojiVoice(index: number): Promise<number> {
        if (!soundManager.isOn) return 0;
        try {
            const clip = await AssetManager.getOrLoad(BUNDLE_RESOURCES, `emoji_audio/em${index}`, cc.AudioClip);
            if (!clip || !soundManager.isOn) return 0;
            const id1 = cc.audioEngine.playEffect(clip, false);
            try {
                cc.audioEngine.setVolume(id1, 1.0);
            } catch (e) {}
            const id2 = cc.audioEngine.playEffect(clip, false);
            try {
                cc.audioEngine.setVolume(id2, PICKER_EMOJI_SOUND_BOOST);
            } catch (e) {}
            return clip.duration || 0;
        } catch (e) {
            return 0;
        }
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
        // 摸头：动画自带摸头动作，直接在目标头顶静止播放一次(atTarget)
        this._playFlyToTargetClip(task, 'hit');
    }

    // 鲨鱼(对齐 pokerqueen)：同一骨骼单轨顺序播放 babyshark(出水) → shark_eaten(咬人)，都在目标处
    private _playShark(task: ThrowPropTask): void {
        const targetPos = this._getLocalPos(task.targetData.avatarNode);
        if (!this._isRootValid()) return;
        const clip = this._getClip(task.config, 'hit');
        const eaten = this._getClip(task.config, 'eaten');
        const node = this._spawnPropSpine(this._getSkeleton(clip.spine), clip.anim, false, targetPos);
        const skeleton = node.getComponent(sp.Skeleton);
        skeleton.addAnimation(0, eaten.anim, false, 0);
        this._destroyAfterDelay(node, 4);
        // 鲨鱼按需静音，不播放音效(对齐 pokerqueen)
    }

    // 抓鸡(对齐 pokerqueen)：伸手 hand_flying 从发送者飞到目标(真实飞行时长)，衔接 hen_struggling
    private _playChicken(task: ThrowPropTask): void {
        const senderPos = this._getLocalPos(task.senderData.avatarNode);
        const targetPos = this._getLocalPos(task.targetData.avatarNode);
        if (!this._isRootValid()) return;
        const handClip = this._getClip(task.config, 'hand');
        const henClip = this._getClip(task.config, 'receiver');
        const handNode = this._spawnPropSpine(this._getSkeleton(handClip.spine), '', false, senderPos);
        const handSkeleton = handNode.getComponent(sp.Skeleton);
        const flyEntry = handSkeleton.setAnimation(0, handClip.anim, false);
        let flyDur = Math.max(0.3, Math.min(this._getEntryDuration(flyEntry, 0.5), 2.0));
        cc.tween(handNode).to(flyDur, this._toTweenPosForNode(handNode, targetPos), { easing: 'quadInOut' }).start();
        let henPlayed = false;
        const playHen = () => {
            if (henPlayed) return;
            henPlayed = true;
            if (cc.isValid(handNode)) this._releaseSpineNode(handNode);
            const henNode = this._spawnPropSpine(this._getSkeleton(henClip.spine), henClip.anim, false, targetPos);
            this._destroyAfterComplete(henNode, 4);
            this._playClipSound(handClip, task.role);
        };
        handSkeleton.setCompleteListener(() => {
            handSkeleton.setCompleteListener(() => {});
            playHen();
        });
        cc.tween(this._root).delay(flyDur + 0.1).call(() => playHen()).start();
    }

    private _playMoney(task: ThrowPropTask): void {
        const targetPos = this._getLocalPos(task.targetData.avatarNode);
        if (!this._isRootValid()) return;
        const clip = this._getClip(task.config, 'receiver');
        const node = this._createClipNode(clip, targetPos, task.targetData.propNode);
        this._destroyAfterComplete(node, 4);
        this._playClipSound(clip, task.role);
    }

    // pokerqueen新beer=模式A：从发送者飞向目标，到达后播 beer_cheers
    private _playBeer(task: ThrowPropTask): void {
        this._playFlyToTargetClip(task, 'hit', true);
    }

    // 枪(608, 对齐 pokerqueen playGun)：3个独立实例组合——①枪停发送者头像并对准目标
    // ②火球旋转对准+按距离缩放，从枪口飞向目标 ③0.7s后目标头像处爆出枪火
    private _playBoxing(task: ThrowPropTask): void {
        if (!this._isRootValid()) return;
        const clip = this._getClip(task.config, 'hit');
        const data = this._getSkeleton(clip.spine);
        const senderPos = this._getLocalPos(task.senderData.avatarNode);
        const targetPos = this._getLocalPos(task.targetData.avatarNode);
        const dx = targetPos.x - senderPos.x;
        const dy = targetPos.y - senderPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        // 原生枪口/子弹朝 +Y。node.angle 逆时针为正，令局部+Y对准目标 = atan2(-dx, dy)
        const aimAngle = (Math.atan2(-dx, dy) * 180) / Math.PI;
        const aimX = dist > 0 ? dx / dist : 0;
        const aimY = dist > 0 ? dy / dist : 1;
        const spawn = (anim: string, pos: cc.Vec3, angle: number, scale: number, life: number) => {
            const node = this._createSpineNode(data, anim, false, pos);
            node.angle = angle;
            node.setScale(scale);
            this._destroyAfterComplete(node, life);
            return node;
        };
        // ① 枪：停在发送者头像、对准目标(原生尺寸)
        spawn('gun', senderPos, aimAngle, 1, 4);
        // ② 火球：缩放+前移，使其从枪口出发飞到目标
        const MUZZLE = 86;
        const FB_START = -240;
        const FB_SPAN = 740;
        let fbScale = dist > 0 ? (dist - MUZZLE) / FB_SPAN : 0.7;
        fbScale = Math.max(0.5, Math.min(1.8, fbScale));
        const fbOffset = MUZZLE - FB_START * fbScale;
        const fbPos = cc.v3(senderPos.x + aimX * fbOffset, senderPos.y + aimY * fbOffset, senderPos.z);
        spawn('bullets-fireballs', fbPos, aimAngle, fbScale, 4);
        // ③ 命中：子弹飞到后在目标头像处爆出枪火
        cc.tween(this._root)
            .delay(0.7)
            .call(() => {
                if (!this._isRootValid()) return;
                spawn('bullet_shots', targetPos, 0, 1, 4);
            })
            .start();
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

    // pokerqueen新bomb blast(611)：炸弹从发送者飞向目标(飞行由补间完成)，在目标处 blast 爆炸
    private _playBaseball(task: ThrowPropTask): void {
        this._playFlyToTargetClip(task, 'hit', true);
    }

    // 模式A(对齐 pokerqueen playPatternA)：从发送者飞向目标；有 flyAnim 则飞行段播飞行动画、
    // 播完自然衔接命中段；atTarget 则命中动画自带位移，直接目标处播放一次。
    private _playFlyToTargetClip(task: ThrowPropTask, clipName: string, _playSoundOnStart: boolean = false): void {
        const clip = this._getClip(task.config, clipName);
        const skeletonData = this._getSkeleton(clip.spine);
        if (!this._isRootValid()) return;
        const startPos = this._getLocalPos(task.senderData.avatarNode);
        const endPos = this._getLocalPos(task.targetData.avatarNode);
        const impactAnim = clip.anim;

        // 命中动画自带运动：直接在目标处静止播放
        if (clip.atTarget) {
            const node = this._spawnPropSpine(skeletonData, impactAnim, !!clip.loop, endPos);
            this._destroyAfterComplete(node, 4);
            this._playClipSound(clip, task.role);
            return;
        }

        const node = this._spawnPropSpine(skeletonData, '', false, startPos);
        const skeleton = node.getComponent(sp.Skeleton);
        let arrived = false;
        const onArrive = () => {
            if (arrived || !cc.isValid(node)) return;
            arrived = true;
            this._setRootLocalPosition(node, endPos);
            if (impactAnim) {
                skeleton.setAnimation(0, impactAnim, !!clip.loop);
                this._destroyAfterComplete(node, 4);
            } else {
                this._destroyAfterDelay(node, 0.5);
            }
            this._playClipSound(clip, task.role);
        };

        if (clip.flyAnim) {
            const entry = skeleton.setAnimation(0, clip.flyAnim, false);
            let flyDur = clip.flyDur != null ? clip.flyDur : this._getEntryDuration(entry, 0.5);
            flyDur = Math.max(0.3, Math.min(flyDur, 2.0));
            cc.tween(node).to(flyDur, this._toTweenPosForNode(node, endPos), { easing: 'quadInOut' }).start();
            skeleton.setCompleteListener(() => {
                skeleton.setCompleteListener(() => {});
                onArrive();
            });
            cc.tween(this._root).delay(flyDur + 0.1).call(() => onArrive()).start();
        } else {
            cc.tween(node)
                .to(0.5, this._toTweenPosForNode(node, endPos), { easing: 'quadInOut' })
                .call(() => onArrive())
                .start();
        }
    }

    /** 创建一个带 pokerqueen 座位缩放(0.7)的独立 Spine 节点 */
    private _spawnPropSpine(skeletonData: sp.SkeletonData, anim: string, loop: boolean, rootLocalPos: cc.Vec3): cc.Node {
        const node = this._createSpineNode(skeletonData, anim, loop, rootLocalPos);
        node.setScale(PROP_ANIM_SCALE);
        return node;
    }

    /** 安全读取 Spine TrackEntry 动画真实时长(秒)，失败返回 fallback */
    private _getEntryDuration(entry: sp.spine.TrackEntry, fallback: number): number {
        try {
            const anim = entry && (entry as any).animation;
            if (anim && typeof anim.duration === 'number' && anim.duration > 0) return anim.duration;
        } catch (e) {}
        return fallback;
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
