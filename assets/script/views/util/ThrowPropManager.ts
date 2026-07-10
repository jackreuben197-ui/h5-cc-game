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
}

class ThrowPropManager {
    private static readonly SOUND_PREFIX = 'sound/PropOp/';
    private static readonly SOUND_MAP: Record<number, string> = {
        0: 'sfx_tomato_mus', // 番茄
        1: 'sfx_rose_mus', // 花环
        2: 'sfx_kiss_mus', // 亲吻
        3: 'sfx_like_mus', // 大拇指
        4: 'sfx_cheers_mus', // 干杯-旁观者
        5: 'sfx_touch_mus', // 摸头
        6: 'sfx_shark_mus', // 鲨鱼
        7: 'sfx_zhuaji_mus', // 抓鸡
        11: 'sfx_baseball' // 棒球
    };
    private static readonly CONFIGS: PropAnimConfig[] = [
        { pattern: 'A', spines: ['rc/other/effect/expressionTomato/skeleton'], anims: ['1'] },
        { pattern: 'A', spines: ['rc/other/effect/expressionFlower/skeleton'], anims: ['animation'] },
        { pattern: 'A', spines: ['rc/other/effect/expressionKiss/kiss'], anims: ['1'] },
        { pattern: 'A', spines: ['rc/other/effect/expressionGood/skeleton'], anims: ['animation'] },
        { pattern: 'D', spines: ['rc/other/effect/expressionBeer/cheers_2', 'rc/other/effect/expressionBeerScreen/cheers_1'], anims: [] },
        { pattern: 'B', spines: ['rc/other/effect/expressionTouch/touch'], anims: ['animation'] },
        { pattern: 'C', spines: ['rc/other/effect/expressionShark/shark'], anims: ['shark_set', 'shark_receive'] },
        { pattern: 'C', spines: ['rc/other/effect/expressionChicken/chicken_spine'], anims: ['chicken_set', 'chicken_receive'] },
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
            anims: []
        }
    ];
    private _root: cc.Node = null;
    private _seatNodes: Map<number, cc.Node> = new Map();

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
        const offset = data.type - this._getThrowPropTypeBase();
        const config = ThrowPropManager.CONFIGS[offset];
        if (!config || !this._root || !cc.isValid(this._root)) return;
        const senderNode = this._seatNodes.get(data.userID);
        const targetNode = this._seatNodes.get(data.targetUserID);
        if (!senderNode || !targetNode) return;
        switch (config.pattern) {
            case 'A':
                this._playPatternA(offset, config, senderNode, targetNode);
                break;
            case 'B':
                this._playPatternB(offset, config, senderNode, targetNode);
                break;
            case 'C':
                this._playPatternC(offset, config, senderNode, targetNode, data);
                break;
            case 'D':
                this._playPatternD(offset, senderNode, targetNode, data);
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
        cc.resources.load('effect/diamondFly', cc.Prefab, (err, flyPrefab: cc.Prefab) => {
            if (err || !flyPrefab || !cc.isValid(this._root)) return;
            cc.resources.load('effect/DiamondIcon', cc.Prefab, (errIcon, iconPrefab: cc.Prefab) => {
                if (errIcon || !iconPrefab || !cc.isValid(this._root)) return;
                cc.resources.load('effect/diamondSpine', cc.Prefab, (errSpine, spinePrefab: cc.Prefab) => {
                    if (errSpine || !spinePrefab || !cc.isValid(this._root)) return;
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
                });
            });
        });
    }

    public async playEmoji(data: EmojiBroadcastData): Promise<void> {
        const index = data.type - this._getEmojiTypeBase() + 1;
        if (index < 1 || index > 15 || !this._root || !cc.isValid(this._root)) return;
        const seatNode = this._seatNodes.get(data.userID);
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

    private _playPatternA(offset: number, config: PropAnimConfig, senderNode: cc.Node, targetNode: cc.Node): void {
        const soundName = ThrowPropManager.SOUND_MAP[offset];
        if (offset === 2) this._playSound(soundName);
        const skeletonData = this._getSkeleton(config.spines[0]);
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

    private _playPatternB(offset: number, config: PropAnimConfig, senderNode: cc.Node, targetNode: cc.Node): void {
        const soundName = ThrowPropManager.SOUND_MAP[offset];
        const skeletonData = this._getSkeleton(config.spines[0]);
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

    private _playPatternC(offset: number, config: PropAnimConfig, senderNode: cc.Node, targetNode: cc.Node, data: ThrowPropBroadcastData): void {
        const targetPos = this._getLocalPos(targetNode);
        const soundName = ThrowPropManager.SOUND_MAP[offset];
        const allData = this._getSkeletons(config.spines);
        if (!this._isRootValid()) return;
        if (config.anims.length === 1) {
            const node = this._createSpineNode(allData[0], config.anims[0], false, targetPos);
            this._destroyAfterComplete(node, 4);
            if (offset === 9) {
                this._playSound(this._getRole(data.userID, data.targetUserID) === 'receiver' ? 'sfx_touch_mus' : 'sfx_money');
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

    private _playPatternD(offset: number, senderNode: cc.Node, targetNode: cc.Node, data: ThrowPropBroadcastData): void {
        const role = this._getRole(data.userID, data.targetUserID);
        if (offset === 4) this._playBeer(senderNode, targetNode, role);
        if (offset === 8) this._playBoxing(senderNode, targetNode, role);
        if (offset === 10) this._playFish(senderNode, targetNode, role);
        if (offset === 11) this._playBaseball(senderNode, targetNode, role);
    }

    private _playBeer(senderNode: cc.Node, targetNode: cc.Node, role: PropRole): void {
        const [beerData, screenData] = this._getSkeletons(['rc/other/effect/expressionBeer/cheers_2', 'rc/other/effect/expressionBeerScreen/cheers_1']);
        if (!this._isRootValid()) return;
        const senderPos = this._getLocalPos(senderNode);
        const targetPos = this._getLocalPos(targetNode);
        if (role === 'sender' || role === 'receiver') {
            this._playSound('sfx_beer_screen');
            this._destroyAfterComplete(this._createSpineNode(screenData, '1', false, this._getScreenCenter()), 5);
            this._destroyAfterComplete(this._createSpineNode(beerData, '3', false, senderPos), 5);
            this._destroyAfterComplete(this._createSpineNode(beerData, '3', false, targetPos), 5);
            return;
        }
        this._playSound(ThrowPropManager.SOUND_MAP[4]);
        this._destroyAfterComplete(this._createSpineNode(beerData, '2', false, senderPos), 5);
        this._destroyAfterComplete(this._createSpineNode(beerData, '2', false, targetPos), 5);
    }

    private _playBoxing(senderNode: cc.Node, targetNode: cc.Node, role: PropRole): void {
        const [boxData, screenData] = this._getSkeletons(['rc/other/effect/expressionBox/box_local', 'rc/other/effect/expressionBoxScreen/box_full']);
        if (!this._isRootValid()) return;
        const senderPos = this._getLocalPos(senderNode);
        const targetPos = this._getLocalPos(targetNode);
        const screenCenter = this._getScreenCenter();
        if (role === 'sender') {
            this._playSound('sfx_boxing_sender1');
            this._chainSpine(this._createSpineNode(screenData, 'box_full_1', false, screenCenter), () => {
                this._playSound('sfx_boxing_sender2');
                this._destroyAfterComplete(this._createSpineNode(boxData, 'box_local_1', false, targetPos), 4);
            });
            return;
        }
        if (role === 'receiver') {
            this._playSound('sfx_boxing_beaten1');
            this._chainSpine(this._createSpineNode(boxData, 'box_local_2', false, senderPos), () => {
                this._playSound('sfx_boxing_beaten2');
                this._destroyAfterComplete(this._createSpineNode(screenData, 'box_full_2', false, screenCenter), 5);
            });
            return;
        }
        this._playSound('sfx_boxing_beaten1');
        this._chainSpine(this._createSpineNode(boxData, 'box_local_2', false, senderPos), () => {
            this._playSound('sfx_boxing_sender2');
            this._destroyAfterComplete(this._createSpineNode(boxData, 'box_local_1', false, targetPos), 4);
        });
    }

    private _playFish(senderNode: cc.Node, targetNode: cc.Node, role: PropRole): void {
        const paths = [
            'rc/other/effect/expressionFish/sy3',
            'rc/other/effect/expressionFishScreenSender/sy2',
            'rc/other/effect/expressionFishScreenReceiver/sy',
            'rc/other/effect/expressionFishWave/hl'
        ];
        const [fishData, senderScreenData, receiverScreenData, waveData] = this._getSkeletons(paths);
        if (!this._isRootValid()) return;
        const senderPos = this._getLocalPos(senderNode);
        const targetPos = this._getLocalPos(targetNode);
        const center = this._getScreenCenter();
        if (role === 'sender') {
            this._playSound('sfx_fish2');
            this._destroyAfterComplete(this._createSpineNode(senderScreenData, 'sy2', false, center), 6);
            this._destroyAfterComplete(this._createSpineNode(waveData, 'hl1', false, center), 6);
            return;
        }
        if (role === 'receiver') {
            this._playSound('sfx_fish');
            this._destroyAfterComplete(this._createSpineNode(receiverScreenData, 'sy', false, center), 6);
            this._destroyAfterComplete(this._createSpineNode(waveData, 'hl2', false, center), 6);
            return;
        }
        this._playSound('sfx_fish');
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

    private _playBaseball(senderNode: cc.Node, targetNode: cc.Node, role: PropRole): void {
        const paths = [
            'rc/other/effect/expressionBaseballSender/skeleton',
            'rc/other/effect/expressionBaseballReceiver/ballfolder1',
            'rc/other/effect/expressionBaseballOther/skeleton'
        ];
        this._playSound(ThrowPropManager.SOUND_MAP[11]);
        const [senderData, receiverData, otherData] = this._getSkeletons(paths);
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

    private _getSkeleton(path: string): sp.SkeletonData {
        return AssetManager.mustGetLoaded(BUNDLE_RESOURCES, path, sp.SkeletonData);
    }

    private _getSkeletons(paths: string[]): sp.SkeletonData[] {
        return paths.map(path => this._getSkeleton(path));
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
        cc.resources.load(ThrowPropManager.SOUND_PREFIX + name, cc.AudioClip, (err, clip: cc.AudioClip) => {
            if (!err && clip) cc.audioEngine.playEffect(clip, false);
        });
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
