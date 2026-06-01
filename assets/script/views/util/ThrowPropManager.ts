// import TexasGame from '../../../../game/texas/TexasGame';
// import Seat from '../../../../game/seat/Seat';
// import { GameCache } from '../../../../game/GameCache';
// const LN = '[ThrowProp]';
// /** 道具类型基址: CT_EMOJI_2(6) * 100 = 600 */
// const PROP_TYPE_BASE = 600;
// /** 道具配置 */
// interface PropAnimConfig {
//     pattern: 'A' | 'B' | 'C' | 'D';
//     /** spine 资源路径（不含 assets/resources/ 和扩展名） */
//     spines: string[];
//     /** 各spine对应的默认动画state名（模式A/B/C用） */
//     anims: string[];
// }
// /**
//  * 扔道具动画管理器
//  * 负责接收服务端广播后，在牌桌场景中播放对应的 Spine 动画
//  */
//     private game: TexasGame;
//     private skeletonCache: Map<string, sp.SkeletonData> = new Map();
//     /** 音效文件路径前缀 */
//     private static readonly SOUND_PREFIX = 'sound/PropOp/';
//     /** 道具偏移量→音效文件名映射 (不含扩展名) */
//     private static readonly SOUND_MAP: Record<number, string> = {
//         0: 'sfx_tomato_mus', // 番茄
//         1: 'sfx_rose_mus', // 花环
//         2: 'sfx_kiss_mus', // 亲吻
//         3: 'sfx_like_mus', // 大拇指
//         4: 'sfx_cheers_mus', // 干杯-旁观者
//         5: 'sfx_touch_mus', // 摸头
//         6: 'sfx_shark_mus', // 鲨鱼
//         7: 'sfx_zhuaji_mus', // 抓鸡
//         11: 'sfx_baseball' // 棒球
//     };
//     /** 12个道具的动画配置，索引0=type600(番茄) ... 索引11=type611(棒球) */
//     private static readonly CONFIGS: PropAnimConfig[] = [
//         // 0: 番茄 (600) — 模式A
//         { pattern: 'A', spines: ['spine/Expression_Tomato/skeleton'], anims: ['1'] },
//         // 1: 花环 (601) — 模式A
//         { pattern: 'A', spines: ['spine/Expression_Flower/skeleton'], anims: ['animation'] },
//         // 2: 亲吻 (602) — 模式A
//         { pattern: 'A', spines: ['spine/Expression_Kiss/kiss'], anims: ['1'] },
//         // 3: 大拇指 (603) — 模式A
//         { pattern: 'A', spines: ['spine/Expression_Good/skeleton'], anims: ['animation'] },
//         // 4: 干杯 (604) — 模式D
//         { pattern: 'D', spines: ['spine/Expression_Beer/cheers_2', 'spine/Expression_Beer_Screen/cheers_1'], anims: [] },
//         // 5: 摸头 (605) — 模式B
//         { pattern: 'B', spines: ['spine/Expression_Touch/touch'], anims: ['animation'] },
//         // 6: 鲨鱼 (606) — 模式C
//         { pattern: 'C', spines: ['spine/Expression_Shark/shark'], anims: ['shark_set', 'shark_receive'] },
//         // 7: 抓鸡 (607) — 模式C (伸手飞行 + 抓鸡)
//         { pattern: 'C', spines: ['spine/Expression_Chicken/chicken_spine'], anims: ['chicken_set', 'chicken_receive'] },
//         // 8: 拳击 (608) — 模式D
//         { pattern: 'D', spines: ['spine/Expression_Box/box_local', 'spine/Expression_Box_Screen/box_full'], anims: [] },
//         // 9: 撒钱 (609) — 模式C (简化，无伸手)
//         { pattern: 'C', spines: ['spine/Expression_Money/attachments'], anims: ['attachments_1_receive'] },
//         // 10: 鱼头 (610) — 模式D
//         {
//             pattern: 'D',
//             spines: [
//                 'spine/Expression_Fish/sy3',
//                 'spine/Expression_Fish_Screen_Sender/sy2',
//                 'spine/Expression_Fish_Screen_Receiver/sy',
//                 'spine/Expression_Fish_Wave/hl'
//             ],
//             anims: []
//         },
//         // 11: 棒球 (611) — 模式D
//         {
//             pattern: 'D',
//             spines: ['spine/Expression_BaseBall_Sender/skeleton', 'spine/Expression_BaseBall_Receiver/ballfolder1', 'spine/Expression_BaseBall_Other/skeleton'],
//             anims: []
//         }
//     ];
//     constructor(game: TexasGame) {
//         this.game = game;
//     }
//     // ─── 公开接口 ───
//     /** 处理收到的扔道具广播 */
//     handlePropMessage(broadcastMsg: { type: number; user_id: number; target_user_id: number }): void {
//         console.log(LN, 'handlePropMessage 收到:', JSON.stringify(broadcastMsg));
//         const offset = broadcastMsg.type - PROP_TYPE_BASE;
//         if (offset < 0 || offset >= 12) return;
//         const senderSeat = this.game.GetSeatByUserId(broadcastMsg.user_id);
//         const targetSeat = this.game.GetSeatByUserId(broadcastMsg.target_user_id);
//         console.log(LN, 'senderSeat=', !!senderSeat, 'targetSeat=', !!targetSeat, 'target_user_id=', broadcastMsg.target_user_id);
//         if (!senderSeat || !targetSeat) return;
//         const config = ThrowPropManager.CONFIGS[offset];
//         console.log(LN, '播放道具动画 type=', broadcastMsg.type, 'pattern=', config.pattern);
//         switch (config.pattern) {
//             case 'A':
//                 this.playPatternA(offset, config, senderSeat, targetSeat);
//                 break;
//             case 'B':
//                 this.playPatternB(offset, config, senderSeat, targetSeat);
//                 break;
//             case 'C':
//                 this.playPatternC(offset, config, senderSeat, targetSeat);
//                 break;
//             case 'D':
//                 this.playPatternD(offset, senderSeat, targetSeat);
//                 break;
//         }
//     }
//     /** 清理所有缓存的骨骼数据和活跃节点 */
//     cleanup(): void {
//         this.skeletonCache.clear();
//     }
//     // ─── 骨骼加载 & 节点工厂 ───
//     /** 带缓存的骨骼数据加载 */
//     private loadSkeleton(path: string): Promise<sp.SkeletonData> {
//         if (this.skeletonCache.has(path)) {
//             console.log(LN, '骨骼命中缓存:', path);
//             return Promise.resolve(this.skeletonCache.get(path));
//         }
//         console.log(LN, '开始加载骨骼:', path);
//         return new Promise<sp.SkeletonData>((resolve, reject) => {
//             cc.resources.load(path, sp.SkeletonData, (err, skeletonData: sp.SkeletonData) => {
//                 if (err) {
//                     console.error(LN, '加载骨骼失败:', path, err.message);
//                     reject(err);
//                     return;
//                 }
//                 console.log(LN, '加载骨骼成功:', path, 'data=', !!skeletonData);
//                 this.skeletonCache.set(path, skeletonData);
//                 resolve(skeletonData);
//             });
//         });
//     }
//     /** 批量加载多个骨骼 */
//     private loadSkeletons(paths: string[]): Promise<sp.SkeletonData[]> {
//         console.log(LN, '批量加载骨骼:', JSON.stringify(paths));
//         return Promise.all(paths.map(p => this.loadSkeleton(p)));
//     }
//     /** 获取动画根节点（seats_content） */
//     private getAnimRoot(): cc.Node {
//         return this.game.uirc ? this.game.uirc.seats_content : null;
//     }
//     /** 获取屏幕中心在 animRoot 中的本地坐标（全屏动画用） */
//     private getScreenCenter(): cc.Vec3 {
//         const root = this.getAnimRoot();
//         if (!root) return cc.Vec3.ZERO;
//         const canvas = cc.find('Canvas');
//         if (canvas) {
//             const worldCenter = canvas.convertToWorldSpaceAR(cc.Vec2.ZERO);
//             return root.convertToNodeSpaceAR(new cc.Vec3(worldCenter.x, worldCenter.y, 0));
//         }
//         return cc.Vec3.ZERO;
//     }
//     /** 获取座位头像在 animRoot 中的本地坐标 */
//     private getHeadLocalPos(seat: Seat): cc.Vec3 {
//         const headNode = seat.uirc ? seat.uirc.Frame_Head : null;
//         if (!headNode) return cc.Vec3.ZERO;
//         const worldPos = headNode.parent.convertToWorldSpaceAR(headNode.position);
//         const root = this.getAnimRoot();
//         return root ? root.convertToNodeSpaceAR(worldPos) : cc.Vec3.ZERO;
//     }
//     /** 创建一个 Spine 动画节点并添加到父节点 */
//     private createSpineNode(skeletonData: sp.SkeletonData, animName: string, loop: boolean, parentNode: cc.Node, localPos: cc.Vec3): cc.Node {
//         const node = new cc.Node('PropSpine');
//         const skeleton = node.addComponent(sp.Skeleton);
//         skeleton.skeletonData = skeletonData;
//         node.parent = parentNode;
//         node.setPosition(localPos);
//         // 设置完 parent 后再播放动画
//         skeleton.setAnimation(0, animName, loop);
//         return node;
//     }
//     /** 动画播放完毕后自动销毁节点 + 兜底超时 */
//     private destroyAfterComplete(node: cc.Node, fallbackDelay: number = 5): void {
//         if (!node) return;
//         const skeleton = node.getComponent(sp.Skeleton);
//         if (skeleton) {
//             skeleton.setCompleteListener(() => {
//                 if (cc.isValid(node)) node.destroy();
//             });
//         }
//         // 兜底：超时后强制销毁
//         cc.tween(node)
//             .delay(fallbackDelay)
//             .call(() => {
//                 if (cc.isValid(node)) node.destroy();
//             })
//             .start();
//     }
//     /** 播放道具音效 */
//     private playSound(name: string): void {
//         if (!name) return;
//         const path = ThrowPropManager.SOUND_PREFIX + name;
//         cc.resources.load(path, cc.AudioClip, (err, clip: cc.AudioClip) => {
//             if (!err && clip) {
//                 cc.audioEngine.playEffect(clip, false);
//             }
//         });
//     }
//     /** 仅延迟销毁（不监听动画完成） */
//     private destroyAfterDelay(node: cc.Node, delay: number): void {
//         if (!node) return;
//         cc.tween(node)
//             .delay(delay)
//             .call(() => {
//                 if (cc.isValid(node)) node.destroy();
//             })
//             .start();
//     }
//     /** 判断当前玩家角色 */
//     private getRole(senderId: number, targetId: number): 'sender' | 'receiver' | 'bystander' {
//         const gc = GameCache.Instance;
//         const myId = gc.nUserId || gc.userId;
//         if (myId === senderId) return 'sender';
//         if (myId === targetId) return 'receiver';
//         return 'bystander';
//     }
//     // ─── 模式A: 通用飞行（番茄/花环/亲吻/大拇指） ───
//     private playPatternA(offset: number, config: PropAnimConfig, senderSeat: Seat, targetSeat: Seat): void {
//         const root = this.getAnimRoot();
//         if (!root) return;
//         const soundName = ThrowPropManager.SOUND_MAP[offset];
//         // 亲吻：飞行开始时立即播放一次声音
//         if (offset === 2) {
//             this.playSound(soundName);
//         }
//         this.loadSkeleton(config.spines[0])
//             .then(skeletonData => {
//                 if (!cc.isValid(root)) return;
//                 const startPos = this.getHeadLocalPos(senderSeat);
//                 const endPos = this.getHeadLocalPos(targetSeat);
//                 const animName = config.anims[0];
//                 // 加载后先不播动画，等飞到目标再播
//                 const node = new cc.Node('PropSpine');
//                 const skeleton = node.addComponent(sp.Skeleton);
//                 skeleton.skeletonData = skeletonData;
//                 node.parent = root;
//                 node.setPosition(startPos);
//                 // 飞向目标
//                 cc.tween(node)
//                     .to(0.5, { x: endPos.x, y: endPos.y }, { easing: 'quadInOut' })
//                     .call(() => {
//                         if (!cc.isValid(node)) return;
//                         // 到达后播放命中动画
//                         skeleton.setAnimation(0, animName, false);
//                         this.destroyAfterComplete(node, 4);
//                         // 到达目标后延迟1秒播放音效（绑定在root上，防止node提前销毁导致tween被取消）
//                         if (soundName) {
//                             cc.tween(root)
//                                 .delay(1.0)
//                                 .call(() => {
//                                     this.playSound(soundName);
//                                 })
//                                 .start();
//                         }
//                     })
//                     .start();
//             })
//             .catch(err => {
//                 console.error(LN, 'playPatternA 骨骼加载失败:', config.spines[0], err);
//             });
//     }
//     // ─── 模式B: 飞行+循环（摸头） ───
//     private playPatternB(offset: number, config: PropAnimConfig, senderSeat: Seat, targetSeat: Seat): void {
//         const root = this.getAnimRoot();
//         if (!root) return;
//         const soundName = ThrowPropManager.SOUND_MAP[offset];
//         this.loadSkeleton(config.spines[0])
//             .then(skeletonData => {
//                 if (!cc.isValid(root)) return;
//                 const startPos = this.getHeadLocalPos(senderSeat);
//                 const endPos = this.getHeadLocalPos(targetSeat);
//                 const animName = config.anims[0];
//                 const node = new cc.Node('PropSpine');
//                 const skeleton = node.addComponent(sp.Skeleton);
//                 skeleton.skeletonData = skeletonData;
//                 node.parent = root;
//                 node.setPosition(startPos);
//                 cc.tween(node)
//                     .to(0.5, { x: endPos.x, y: endPos.y }, { easing: 'quadInOut' })
//                     .call(() => {
//                         if (!cc.isValid(node)) return;
//                         skeleton.setAnimation(0, animName, true);
//                         // 到达后播放音效
//                         this.playSound(soundName);
//                         // 循环播放3秒后销毁
//                         this.destroyAfterDelay(node, 3);
//                     })
//                     .start();
//             })
//             .catch(() => {});
//     }
//     // ─── 模式C: 简化双部件（鲨鱼/抓鸡/撒钱） ───
//     private playPatternC(offset: number, config: PropAnimConfig, senderSeat: Seat, targetSeat: Seat): void {
//         const root = this.getAnimRoot();
//         if (!root) return;
//         const targetPos = this.getHeadLocalPos(targetSeat);
//         const soundName = ThrowPropManager.SOUND_MAP[offset];
//         this.loadSkeletons(config.spines)
//             .then(allData => {
//                 if (!cc.isValid(root)) return;
//                 if (config.anims.length === 1) {
//                     // 抓鸡(7)/撒钱(9)：只在目标位置播放主效果
//                     const node = this.createSpineNode(allData[0], config.anims[0], false, root, targetPos);
//                     this.destroyAfterComplete(node, 4);
//                     // 撒钱：接收者播摸头声，其他人播放撒钱声
//                     if (offset === 9) {
//                         const role = this.getRole(senderSeat.Player ? senderSeat.Player.userID : 0, targetSeat.Player ? targetSeat.Player.userID : 0);
//                         if (role === 'receiver') {
//                             this.playSound('sfx_touch_mus');
//                         } else {
//                             this.playSound('sfx_money');
//                         }
//                     } else {
//                         // 抓鸡：播放抓鸡声
//                         this.playSound(soundName);
//                     }
//                 } else if (config.anims.length >= 2) {
//                     // 抓鸡(7)：伸手从发送者飞到目标 + 目标位置播抓鸡；鲨鱼(6)：发送者游泳 + 目标被吃
//                     const senderPos = this.getHeadLocalPos(senderSeat);
//                     if (offset === 7) {
//                         // 1. 伸手飞行 (chicken_set) — 动画播放与飞行同时进行
//                         const handNode = new cc.Node('PropSpine');
//                         const handSkeleton = handNode.addComponent(sp.Skeleton);
//                         handSkeleton.skeletonData = allData[0];
//                         handNode.parent = root;
//                         handNode.setPosition(senderPos);
//                         handSkeleton.setAnimation(0, config.anims[0], false);
//                         this.destroyAfterComplete(handNode, 4);
//                         // 飞向目标 (0.5秒，与Unity一致)
//                         cc.tween(handNode).to(0.5, { x: targetPos.x, y: targetPos.y }, { easing: 'quadInOut' }).start();
//                         // 2. 目标位置抓鸡动画 (chicken_receive)
//                         const targetNode = this.createSpineNode(allData[0], config.anims[1], false, root, targetPos);
//                         this.destroyAfterComplete(targetNode, 4);
//                         this.playSound(soundName);
//                     } else {
//                         // 鲨鱼(6)：发送者位置播游泳，目标位置播吃（无飞行）
//                         const senderNode = this.createSpineNode(allData[0], config.anims[0], false, root, senderPos);
//                         this.destroyAfterComplete(senderNode, 4);
//                         // 目标：被吃动画，动画开始时播放音效（对应Unity spine "sfx"事件）
//                         const targetNode = this.createSpineNode(allData[0], config.anims[1], false, root, targetPos);
//                         this.destroyAfterComplete(targetNode, 4);
//                         this.playSound(soundName);
//                     }
//                 }
//             })
//             .catch(() => {});
//     }
//     // ─── 模式D: 角色分镜（干杯/拳击/鱼头/棒球） ───
//     private playPatternD(propOffset: number, senderSeat: Seat, targetSeat: Seat): void {
//         const root = this.getAnimRoot();
//         console.log(LN, 'playPatternD root=', !!root, 'propOffset=', propOffset);
//         if (!root) return;
//         const role = this.getRole(senderSeat.Player ? senderSeat.Player.userID : 0, targetSeat.Player ? targetSeat.Player.userID : 0);
//         switch (propOffset) {
//             case 4:
//                 this.playBeer(root, senderSeat, targetSeat, role);
//                 break;
//             case 8:
//                 this.playBoxing(root, senderSeat, targetSeat, role);
//                 break;
//             case 10:
//                 this.playFish(root, senderSeat, targetSeat, role);
//                 break;
//             case 11:
//                 this.playBaseball(root, senderSeat, targetSeat, role);
//                 break;
//         }
//     }
//     // ─── 干杯 (604) ───
//     private playBeer(root: cc.Node, senderSeat: Seat, targetSeat: Seat, role: string): void {
//         // spine[0]=Expression_Beer/cheers_2, spine[1]=Expression_Beer_Screen/cheers_1
//         this.loadSkeletons(['spine/Expression_Beer/cheers_2', 'spine/Expression_Beer_Screen/cheers_1'])
//             .then(([beerData, screenData]) => {
//                 if (!cc.isValid(root)) return;
//                 if (role === 'sender' || role === 'receiver') {
//                     // 发送者/接收者：全屏干杯音效
//                     this.playSound('sfx_beer_screen');
//                     // 全屏干杯动画
//                     const screenCenter = this.getScreenCenter();
//                     const screenNode = this.createSpineNode(screenData, '1', false, root, screenCenter);
//                     this.destroyAfterComplete(screenNode, 5);
//                     // 座位干杯动画：发送者/接收者视角两个座位都播 "3"(BEER_SELF)
//                     const senderPos = this.getHeadLocalPos(senderSeat);
//                     const targetPos = this.getHeadLocalPos(targetSeat);
//                     const senderAnim = this.createSpineNode(beerData, '3', false, root, senderPos);
//                     const targetAnim = this.createSpineNode(beerData, '3', false, root, targetPos);
//                     this.destroyAfterComplete(senderAnim, 5);
//                     this.destroyAfterComplete(targetAnim, 5);
//                 } else {
//                     // 旁观者：只在两个座位播 "2"(BEER_OTHER)，播cheers_mus
//                     this.playSound(ThrowPropManager.SOUND_MAP[4]);
//                     const senderPos = this.getHeadLocalPos(senderSeat);
//                     const targetPos = this.getHeadLocalPos(targetSeat);
//                     const s1 = this.createSpineNode(beerData, '2', false, root, senderPos);
//                     const s2 = this.createSpineNode(beerData, '2', false, root, targetPos);
//                     this.destroyAfterComplete(s1, 5);
//                     this.destroyAfterComplete(s2, 5);
//                 }
//             })
//             .catch(() => {});
//     }
//     // ─── 拳击 (608) ───
//     private playBoxing(root: cc.Node, senderSeat: Seat, targetSeat: Seat, role: string): void {
//         // spine[0]=Expression_Box/box_local, spine[1]=Expression_Box_Screen/box_full
//         this.loadSkeletons(['spine/Expression_Box/box_local', 'spine/Expression_Box_Screen/box_full'])
//             .then(([boxData, screenData]) => {
//                 if (!cc.isValid(root)) return;
//                 const senderPos = this.getHeadLocalPos(senderSeat);
//                 const targetPos = this.getHeadLocalPos(targetSeat);
//                 const screenCenter = this.getScreenCenter();
//                 if (role === 'sender') {
//                     // 发送者：全屏蓄势 → 座位被打
//                     this.playSound('sfx_boxing_sender1'); // 全屏蓄势声（对应Unity SFX_BOX_SCREEN_READY）
//                     const screenNode = this.createSpineNode(screenData, 'box_full_1', false, root, screenCenter);
//                     const skeleton = screenNode.getComponent(sp.Skeleton);
//                     skeleton.setCompleteListener(() => {
//                         if (!cc.isValid(screenNode)) return;
//                         screenNode.destroy();
//                         // 全屏播完后 → 目标座位被打
//                         this.playSound('sfx_boxing_sender2'); // 目标被打声（对应Unity SFX_BOX_SEAT_TARGET）
//                         const hitNode = this.createSpineNode(boxData, 'box_local_1', false, root, targetPos);
//                         this.destroyAfterComplete(hitNode, 4);
//                     });
//                     this.destroyAfterDelay(screenNode, 6);
//                 } else if (role === 'receiver') {
//                     // 接收者：发送者座位摩拳擦掌 → 全屏被打
//                     this.playSound('sfx_boxing_beaten1'); // 摩拳擦掌声（对应Unity SFX_BOX_SEAT_READY）
//                     const readyNode = this.createSpineNode(boxData, 'box_local_2', false, root, senderPos);
//                     const skeleton = readyNode.getComponent(sp.Skeleton);
//                     skeleton.setCompleteListener(() => {
//                         if (!cc.isValid(readyNode)) return;
//                         readyNode.destroy();
//                         // 蓄势完成 → 全屏被打
//                         this.playSound('sfx_boxing_beaten2'); // 全屏被打声（对应Unity SFX_BOX_SCREEN_TARGET）
//                         const hitNode = this.createSpineNode(screenData, 'box_full_2', false, root, screenCenter);
//                         this.destroyAfterComplete(hitNode, 5);
//                     });
//                     this.destroyAfterDelay(readyNode, 4);
//                 } else {
//                     // 旁观者：发送者蓄势 → 目标被打
//                     this.playSound('sfx_boxing_beaten1'); // 蓄势声（对应Unity SFX_BOX_SEAT_READY）
//                     const readyNode = this.createSpineNode(boxData, 'box_local_2', false, root, senderPos);
//                     const skeleton = readyNode.getComponent(sp.Skeleton);
//                     skeleton.setCompleteListener(() => {
//                         if (!cc.isValid(readyNode)) return;
//                         readyNode.destroy();
//                         this.playSound('sfx_boxing_sender2'); // 被打声（对应Unity SFX_BOX_SEAT_TARGET）
//                         const hitNode = this.createSpineNode(boxData, 'box_local_1', false, root, targetPos);
//                         this.destroyAfterComplete(hitNode, 4);
//                     });
//                     this.destroyAfterDelay(readyNode, 4);
//                 }
//             })
//             .catch(() => {});
//     }
//     // ─── 鱼头 (610) ───
//     private playFish(root: cc.Node, senderSeat: Seat, targetSeat: Seat, role: string): void {
//         // spine[0]=Fish/sy3, [1]=Fish_Screen_Sender/sy2, [2]=Fish_Screen_Receiver/sy, [3]=Fish_Wave/hl
//         const paths = [
//             'spine/Expression_Fish/sy3',
//             'spine/Expression_Fish_Screen_Sender/sy2',
//             'spine/Expression_Fish_Screen_Receiver/sy',
//             'spine/Expression_Fish_Wave/hl'
//         ];
//         this.loadSkeletons(paths)
//             .then(([fishData, senderScreenData, receiverScreenData, waveData]) => {
//                 if (!cc.isValid(root)) return;
//                 const senderPos = this.getHeadLocalPos(senderSeat);
//                 const targetPos = this.getHeadLocalPos(targetSeat);
//                 const screenCenter = this.getScreenCenter();
//                 if (role === 'sender') {
//                     // 发送者：全屏发送者动画 + 海浪
//                     this.playSound('sfx_fish2'); // 发送者视角鱼头声
//                     const screenNode = this.createSpineNode(senderScreenData, 'sy2', false, root, screenCenter);
//                     this.destroyAfterComplete(screenNode, 6);
//                     const waveNode = this.createSpineNode(waveData, 'hl1', false, root, screenCenter);
//                     this.destroyAfterComplete(waveNode, 6);
//                 } else if (role === 'receiver') {
//                     // 接收者：全屏接收者动画 + 海浪
//                     this.playSound('sfx_fish'); // 接收者视角鱼头声
//                     const screenNode = this.createSpineNode(receiverScreenData, 'sy', false, root, screenCenter);
//                     this.destroyAfterComplete(screenNode, 6);
//                     const waveNode = this.createSpineNode(waveData, 'hl2', false, root, screenCenter);
//                     this.destroyAfterComplete(waveNode, 6);
//                 } else {
//                     // 旁观者：鱼从发送者飞到目标 + 海浪
//                     this.playSound('sfx_fish'); // 旁观者视角鱼头声
//                     const fishNode = new cc.Node('PropSpine');
//                     const skeleton = fishNode.addComponent(sp.Skeleton);
//                     skeleton.skeletonData = fishData;
//                     fishNode.parent = root;
//                     fishNode.setPosition(senderPos);
//                     // 计算方向用于旋转和镜像
//                     const moveDir = cc.v2(targetPos.x - senderPos.x, targetPos.y - senderPos.y);
//                     const angle = cc.v2(0, 1).signAngle(moveDir);
//                     fishNode.angle = (-angle * 180) / Math.PI;
//                     const factor = moveDir.x > 0 ? -1 : 1;
//                     fishNode.scaleX = factor * Math.abs(fishNode.scaleX || 1);
//                     // 播放游泳动画
//                     skeleton.setAnimation(0, 'sy3_1', true);
//                     // 移动到目标位置后播放第二段动画 + 气泡
//                     cc.tween(fishNode)
//                         .to(2.0, { x: targetPos.x, y: targetPos.y }, { easing: 'sineInOut' })
//                         .call(() => {
//                             if (!cc.isValid(fishNode)) return;
//                             // 移动完成后播放第二段
//                             skeleton.setAnimation(0, 'sy3_2', false);
//                             // 气泡效果
//                             const bubbleNode = this.createSpineNode(fishData, 'bl', false, root, targetPos);
//                             this.destroyAfterComplete(bubbleNode, 4);
//                         })
//                         .delay(1.0)
//                         .call(() => {
//                             if (cc.isValid(fishNode)) fishNode.destroy();
//                         })
//                         .start();
//                     // 海浪
//                     const waveNode = this.createSpineNode(waveData, 'hl3', false, root, screenCenter);
//                     this.destroyAfterComplete(waveNode, 6);
//                 }
//             })
//             .catch(() => {});
//     }
//     // ─── 棒球 (611) ───
//     private playBaseball(root: cc.Node, senderSeat: Seat, targetSeat: Seat, role: string): void {
//         // spine[0]=BaseBall_Sender/skeleton, [1]=BaseBall_Receiver/ballfolder1, [2]=BaseBall_Other/skeleton
//         const paths = [
//             'spine/Expression_BaseBall_Sender/skeleton',
//             'spine/Expression_BaseBall_Receiver/ballfolder1',
//             'spine/Expression_BaseBall_Other/skeleton'
//         ];
//         // 开始即播放棒球音效
//         this.playSound(ThrowPropManager.SOUND_MAP[11]);
//         this.loadSkeletons(paths)
//             .then(([senderData, receiverData, otherData]) => {
//                 if (!cc.isValid(root)) return;
//                 const senderPos = this.getHeadLocalPos(senderSeat);
//                 const targetPos = this.getHeadLocalPos(targetSeat);
//                 if (role === 'sender') {
//                     this.playBaseballSequence(senderData, root, senderPos, targetPos, ['1', '2', '3'], 0.333);
//                 } else if (role === 'receiver') {
//                     this.playBaseballSequence(receiverData, root, senderPos, targetPos, ['1', '2', '3'], 0.333);
//                 } else {
//                     // 旁观者：4段动画，第4段球飞出屏幕
//                     this.playBaseballBystander(otherData, root, senderPos, targetPos);
//                 }
//             })
//             .catch(() => {});
//     }
//     /** 棒球动画序列播放（1→2移动→3击中） */
//     private playBaseballSequence(
//         skeletonData: sp.SkeletonData,
//         root: cc.Node,
//         startPos: cc.Vec3,
//         targetPos: cc.Vec3,
//         animNames: string[],
//         moveDuration: number
//     ): void {
//         const node = new cc.Node('PropSpine');
//         const skeleton = node.addComponent(sp.Skeleton);
//         skeleton.skeletonData = skeletonData;
//         node.parent = root;
//         node.setPosition(startPos);
//         // 阶段1: ready
//         skeleton.setAnimation(0, animNames[0], false);
//         skeleton.setCompleteListener(() => {
//             if (!cc.isValid(node)) return;
//             // 阶段2: move + 位移
//             skeleton.setCompleteListener(() => {});
//             skeleton.setAnimation(0, animNames[1], false);
//             cc.tween(node).to(moveDuration, { x: targetPos.x, y: targetPos.y }, { easing: 'quadInOut' }).start();
//             // 阶段2完成后播放阶段3
//             // 用延时来触发（动画2的时长约等于移动时长）
//             cc.tween(node)
//                 .delay(moveDuration)
//                 .call(() => {
//                     if (!cc.isValid(node)) return;
//                     skeleton.setAnimation(0, animNames[2], false);
//                     this.destroyAfterComplete(node, 5);
//                 })
//                 .start();
//         });
//         this.destroyAfterDelay(node, 8);
//     }
//     /** 棒球旁观者：1→2移动→3击中→4飞出屏幕 */
//     private playBaseballBystander(skeletonData: sp.SkeletonData, root: cc.Node, senderPos: cc.Vec3, targetPos: cc.Vec3): void {
//         const node = new cc.Node('PropSpine');
//         const skeleton = node.addComponent(sp.Skeleton);
//         skeleton.skeletonData = skeletonData;
//         node.parent = root;
//         node.setPosition(senderPos);
//         // 阶段1: ready
//         skeleton.setAnimation(0, '1', false);
//         skeleton.setCompleteListener(() => {
//             if (!cc.isValid(node)) return;
//             // 阶段2: move
//             skeleton.setCompleteListener(() => {});
//             skeleton.setAnimation(0, '2', false);
//             cc.tween(node).to(0.333, { x: targetPos.x, y: targetPos.y }, { easing: 'quadInOut' }).start();
//             cc.tween(node)
//                 .delay(0.333)
//                 .call(() => {
//                     if (!cc.isValid(node)) return;
//                     // 阶段3: attack
//                     skeleton.setAnimation(0, '3', false);
//                     skeleton.setCompleteListener(() => {
//                         if (!cc.isValid(node)) return;
//                         // 阶段4: exit — 球沿方向飞出屏幕
//                         skeleton.setAnimation(0, '4', false);
//                         const moveDir = cc.v2(targetPos.x - senderPos.x, targetPos.y - senderPos.y).normalize();
//                         const exitPos = cc.v3(targetPos.x + moveDir.x * 2000, targetPos.y + moveDir.y * 2000, 0);
//                         cc.tween(node)
//                             .to(1.0, { x: exitPos.x, y: exitPos.y }, { easing: 'quadIn' })
//                             .call(() => {
//                                 if (cc.isValid(node)) node.destroy();
//                             })
//                             .start();
//                     });
//                 })
//                 .start();
//         });
//         this.destroyAfterDelay(node, 10);
//     }
//     // ─── 钻石赠送动画 ───
//     /** 播放钻石赠送飞行动画（由服务端广播触发，所有玩家都调用） */
//     playDiamondAnimation(senderId: number, receiverId: number, amount: number): void {
//         const root = this.getAnimRoot();
//         if (!root) return;
//         const senderSeat = this.game.GetSeatByUserId(senderId);
//         const receiverSeat = this.game.GetSeatByUserId(receiverId);
//         if (!senderSeat || !receiverSeat) return;
//         if (!senderSeat.uirc?.Frame_Head || !receiverSeat.uirc?.Frame_Head) return;
//         const senderWorldPos = senderSeat.uirc.Frame_Head.parent.convertToWorldSpaceAR(senderSeat.uirc.Frame_Head.position);
//         const receiverWorldPos = receiverSeat.uirc.Frame_Head.parent.convertToWorldSpaceAR(receiverSeat.uirc.Frame_Head.position);
//         cc.resources.load('effect/diamondFly', cc.Prefab, (err, flyPrefab: cc.Prefab) => {
//             if (err) {
//                 console.warn(LN, 'diamondFly load failed:', err.message);
//                 return;
//             }
//             cc.resources.load('effect/DiamondIcon', cc.Prefab, (err2, iconPrefab: cc.Prefab) => {
//                 if (err2) {
//                     console.warn(LN, 'DiamondIcon load failed:', err2.message);
//                     return;
//                 }
//                 cc.resources.load('effect/diamondSpine', cc.Prefab, (err3, spinePrefab: cc.Prefab) => {
//                     if (err3) {
//                         console.warn(LN, 'diamondSpine load failed:', err3.message);
//                         return;
//                     }
//                     if (!cc.isValid(root)) return;
//                     // 1) 赠送方：立即播放 -amount 飞行动画
//                     this.spawnDiamondFlyNode(flyPrefab, root, senderWorldPos, `-${amount}`);
//                     // 2) 钻石图标从赠送方头像飞到接收方头像（900ms）
//                     const icon = cc.instantiate(iconPrefab);
//                     icon.parent = root;
//                     const startLocal = root.convertToNodeSpaceAR(senderWorldPos);
//                     const endLocal = root.convertToNodeSpaceAR(receiverWorldPos);
//                     icon.setPosition(startLocal);
//                     cc.tween(icon)
//                         .to(0.9, { position: endLocal }, { easing: 'quadInOut' })
//                         .call(() => {
//                             if (!cc.isValid(root)) return;
//                             // 3) 先播放 spine 特效
//                             const receiverLocal = root.convertToNodeSpaceAR(receiverWorldPos);
//                             this.playDiamondSpineEffect(spinePrefab, root, receiverLocal);
//                             // 4) 再播放 +amount 飞行动画
//                             this.spawnDiamondFlyNode(flyPrefab, root, receiverWorldPos, `+${amount}`);
//                             if (cc.isValid(icon)) icon.destroy();
//                         })
//                         .start();
//                 });
//             });
//         });
//     }
//     private playDiamondSpineEffect(prefab: cc.Prefab, parentNode: cc.Node, localPos: cc.Vec3): void {
//         const node = cc.instantiate(prefab);
//         if (!node) return;
//         node.parent = parentNode;
//         node.setPosition(localPos);
//         const skeleton = node.getComponent(sp.Skeleton);
//         if (skeleton) {
//             skeleton.setCompleteListener(() => {
//                 if (cc.isValid(node)) node.destroy();
//             });
//         } else {
//             cc.tween(node)
//                 .delay(2)
//                 .call(() => {
//                     if (cc.isValid(node)) node.destroy();
//                 })
//                 .start();
//         }
//     }
//     private spawnDiamondFlyNode(prefab: cc.Prefab, parentNode: cc.Node, worldPos: cc.Vec3, text: string): void {
//         const node = cc.instantiate(prefab);
//         if (!node) return;
//         const numLabel = node.getChildByName('diamondNum');
//         if (numLabel) {
//             const label = numLabel.getComponent(cc.Label);
//             if (label) label.string = text;
//         }
//         if (text.startsWith('+') && numLabel) {
//             numLabel.color = cc.color(0, 255, 100, 255);
//         }
//         node.parent = parentNode;
//         const localPos = parentNode.convertToNodeSpaceAR(worldPos);
//         node.setPosition(localPos);
//         cc.tween(node)
//             .by(0.6, { y: 60 })
//             .to(0.4, { opacity: 0 })
//             .call(() => {
//                 if (cc.isValid(node)) node.destroy();
//             })
//             .start();
//     }
// }
// export default class ThrowPropManager {
