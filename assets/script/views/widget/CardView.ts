import GameplayUtil from '../../game/util/GameplayUtil';
import { AssetCollectionType } from '../loader/AssetLoader';
import AsssetManager from '../loader/AssetManager';

const { ccclass, property, menu, executeInEditMode } = cc._decorator;
// const PokerMap: Record<number, { res: number; show: string }> = {
//     //桃
//     2: { res: 1, show: '♠2' },
//     3: { res: 2, show: '♠3' },
//     4: { res: 3, show: '♠4' },
//     5: { res: 4, show: '♠5' },
//     6: { res: 5, show: '♠6' },
//     7: { res: 6, show: '♠7' },
//     8: { res: 7, show: '♠8' },
//     9: { res: 8, show: '♠9' },
//     10: { res: 9, show: '♠10' },
//     11: { res: 10, show: '♠J' },
//     12: { res: 11, show: '♠Q' },
//     13: { res: 12, show: '♠K' },
//     14: { res: 0, show: '♠A' },
//     //心
//     17: { res: 14, show: '♥2' },
//     18: { res: 15, show: '♥3' },
//     19: { res: 16, show: '♥4' },
//     20: { res: 17, show: '♥5' },
//     21: { res: 18, show: '♥6' },
//     22: { res: 19, show: '♥7' },
//     23: { res: 20, show: '♥8' },
//     24: { res: 21, show: '♥9' },
//     25: { res: 22, show: '♥10' },
//     26: { res: 23, show: '♥J' },
//     27: { res: 24, show: '♥Q' },
//     28: { res: 25, show: '♥K' },
//     29: { res: 13, show: '♥A' },
//     //梅
//     32: { res: 27, show: '♣2' },
//     33: { res: 28, show: '♣3' },
//     34: { res: 29, show: '♣4' },
//     35: { res: 30, show: '♣5' },
//     36: { res: 31, show: '♣6' },
//     37: { res: 32, show: '♣7' },
//     38: { res: 33, show: '♣8' },
//     39: { res: 34, show: '♣9' },
//     40: { res: 35, show: '♣10' },
//     41: { res: 36, show: '♣J' },
//     42: { res: 37, show: '♣Q' },
//     43: { res: 38, show: '♣K' },
//     44: { res: 26, show: '♣A' },
//     //方块
//     47: { res: 40, show: '♢2' },
//     48: { res: 41, show: '♢3' },
//     49: { res: 42, show: '♢4' },
//     50: { res: 43, show: '♢5' },
//     51: { res: 44, show: '♢6' },
//     52: { res: 45, show: '♢7' },
//     53: { res: 46, show: '♢8' },
//     54: { res: 47, show: '♢9' },
//     55: { res: 48, show: '♢10' },
//     56: { res: 49, show: '♢J' },
//     57: { res: 50, show: '♢Q' },
//     58: { res: 51, show: '♢K' },
//     59: { res: 39, show: '♢A' }
// };
@ccclass
@menu('Widget/CardView')
export default class CardView extends cc.Component {
    private cardSprite: cc.Sprite = null;
    @property(cc.Node)
    private highLightSprite: cc.Node = null;
    // 将原本的属性改为私有变量，作为存取器的内部数据载体
    private _cardNum: number = 10;
    public get cardNum(): number {
        return this._cardNum;
    }
    public set cardNum(value: number) {
        if (this._cardNum == value) {
            return;
        }
        this._cardNum = value;
        // 属性面板发生数值修改时，立即执行外观刷新以实现预览
        this.refreshCardView();
    }
    // 用于临时存一下卡牌,后面用来动画用
    public storeCardNum: number;
    private _bgSf: cc.SpriteFrame = null;

    /**
     * Cocos 生命周期：节点加载时调用
     */
    protected onLoad(): void {
        // 初始化时根据当前的 cardNum 刷新一次外观
        let node = this.getComponent(cc.Sprite);
        if (!node) console.error('[CardView]', 'no ccSprite on this node');
        this.cardSprite = node;
        this._bgSf = AsssetManager.getAsset(AssetCollectionType.SpriteFrameCard, GameplayUtil.CardNoToLocalResource(0));
        this.refreshCardView();
    }

    public highlight(b: boolean) {
        if (this.highLightSprite) {
            this.highLightSprite.active = b;
        }
    }

    /**
     * 内部公共刷新方法，兼顾运行态与编辑态
     */
    private refreshCardView(): void {
        let sf = this._bgSf;
        if (this._cardNum != 0) {
            sf = AsssetManager.getAsset(AssetCollectionType.SpriteFrameCard, GameplayUtil.CardNoToLocalResource(this._cardNum));
        }
        if (sf) {
            if (this.cardSprite) {
                this.cardSprite.spriteFrame = sf;
            }
        } else {
            // 过滤非运行状态，只有在游戏实际运行且节点有效时才抛出资源缺失错误，避免卡死编辑器
            if (cc.isValid(this.node)) {
                console.error(`[CardView] 未能成功获取到 cardNum 为 ${this._cardNum} 的 SpriteFrame 指针`);
            }
        }
    }

    /**
     * 外部异步翻牌动画入口
     * @param targetCardNum 最终需要翻转到的目标牌面ID
     * @param duration 动画总时长，单位秒
     * @param onComplete 动画结束后的可选回调函数
     */
    public animateFlipToFront(targetCardNum: number, duration: number = 0.4, onComplete?: () => void): void {
        if (!this.cardSprite) {
            console.error('[CardView] 找不到绑定的 cardSprite 组件，无法执行动画');
            return;
        }
        const halfDuration = duration / 2;
        // 前置状态重置：确保卡牌初始为背面且缩放、角度均恢复默认值
        this.cardNum = 0;
        this.node.scaleX = 1;
        this.node.angle = 0;
        // 使用 cc.tween 链式构造 2D 空间翻转动效
        cc.tween(this.node)
            // 第一阶段：卡牌水平压扁至侧面（scaleX由1变为0）
            .to(
                halfDuration,
                {
                    scaleX: 0,
                    scaleY: 1.05,
                    angle: -5
                },
                { easing: 'cubicIn' }
            )
            // 中间判定点：此时卡牌刚好在侧面且完全不可见，立即替换内部数据和纹理引用
            .call(() => {
                this.cardNum = targetCardNum;
            })
            // 第二阶段：卡牌从侧面重新展开至正面（scaleX由0恢复到1）
            .to(
                halfDuration,
                {
                    scaleX: 1,
                    scaleY: 1,
                    angle: 0
                },
                { easing: 'cubicOut' }
            )
            // 第三阶段：轻微的物理回弹动效以增强视觉立体感
            .to(0.05, { scaleX: 1.03, scaleY: 0.97 }, { easing: 'sineOut' })
            .to(0.05, { scaleX: 1, scaleY: 1 }, { easing: 'sineIn' })
            // 结束回调
            .call(() => {
                if (onComplete) {
                    onComplete();
                }
            })
            .start();
    }
}
