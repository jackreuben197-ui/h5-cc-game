import { autoBindEvents, bindEvent, unBindEventsAll } from '../../core/decorator/DataBind';
import texasGamePersonalSettings, { TexasGamePersonalSettings } from '../../data/room/texas/TexasGamePersonalSettings';
import GameplayUtil from '../../game/util/GameplayUtil';
import { PokerCardType } from '../loader/AssetLoader';
import AssetManager from '../loader/AssetManager';

const { ccclass, property, menu, executeInEditMode } = cc._decorator;

@ccclass
@menu('Widget/CardView')
export default class CardView extends cc.Component {
    @property(cc.Sprite)
    private cardSprite: cc.Sprite = null;
    @property(cc.Node)
    private highLightSprite: cc.Node = null;
    @property(cc.Node)
    private grayLayer: cc.Node = null;
    @property(cc.Material)
    private cardBackMaterial: cc.Material = null;
    private _defaultMaterial: cc.Material = null;
    // 将原本的属性改为私有变量，作为存取器的内部数据载体
    private _cardNum: number = 0;
    public get cardNum(): number {
        return this._cardNum;
    }
    public set cardNum(value: number) {
        if (this._cardNum == value) {
            // Prefab 中是占位牌面；首次收到 0 时也要真正切到牌背资源和专用材质。
            this.refreshCardView(texasGamePersonalSettings.pokerCardType);
            return;
        }
        this._cardNum = value;
        // 属性面板发生数值修改时，立即执行外观刷新以实现预览
        this.refreshCardView(texasGamePersonalSettings.pokerCardType);
    }
    // 用于临时存一下卡牌,后面用来动画用
    public storeCardNum: number;
    public delayHighlight: boolean;

    /**
     * Cocos 生命周期：节点加载时调用
     */
    protected onLoad(): void {
        if (this.cardSprite) {
            this._defaultMaterial = this.cardSprite.getMaterial(0) || cc.Material.getBuiltinMaterial('2d-sprite');
        }
    }

    protected onEnable(): void {
        autoBindEvents(this, { setting: texasGamePersonalSettings });
    }

    protected onDisable(): void {
        unBindEventsAll(this);
    }

    public highlight(b: boolean) {
        if (this.highLightSprite) {
            this.highLightSprite.active = b;
        }
    }

    private _offset: cc.Vec2 = new cc.Vec2(0, 0);

    public popUp(offset: cc.Vec2) {
        this._offset = offset;
        cc.tween(this.cardSprite.node)
            .to(0.3, {
                x: this.cardSprite.node.position.x + offset.x,
                y: this.cardSprite.node.position.y + offset.y
            })
            .start();
    }

    public gray(b: boolean) {
        if (this.grayLayer) {
            this.grayLayer.active = b;
        }
    }

    public reset() {
        this.highlight(false);
        if (this._offset.x != 0 && this._offset.y != 0) {
            this.cardSprite.node.setPosition(this.cardSprite.node.x - this._offset.x, this.cardSprite.node.y - this._offset.y);
            this._offset.x = 0;
            this._offset.y = 0;
        }
        this.gray(false);
    }

    /**
     * 内部公共刷新方法，兼顾运行态与编辑态
     */
    @bindEvent(TexasGamePersonalSettings.POKER_CARD_TYPE_CHANGE, 'setting')
    private refreshCardView(te: PokerCardType): void {
        let sf = AssetManager.getAsset(te, GameplayUtil.CardNoToLocalResource(this._cardNum));
        if (sf) {
            if (this.cardSprite) {
                this.cardSprite.spriteFrame = sf;
                this.refreshMaterial();
            }
        } else {
            // 过滤非运行状态，只有在游戏实际运行且节点有效时才抛出资源缺失错误，避免卡死编辑器
            if (cc.isValid(this.node)) {
                console.error(`[CardView] 未能成功获取到 cardNum 为 ${this._cardNum} 的 SpriteFrame 指针`);
            }
        }
    }

    private refreshMaterial(): void {
        if (!this.cardSprite) return;
        const material =
            this._cardNum == 0 && this.cardBackMaterial ? this.cardBackMaterial : this._defaultMaterial || cc.Material.getBuiltinMaterial('2d-sprite');
        this.cardSprite.setMaterial(0, material);
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
