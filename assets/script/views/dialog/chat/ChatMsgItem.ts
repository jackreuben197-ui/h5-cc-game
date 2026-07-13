import { TexasChatMessage } from '../../../data/room/texas/TexasGameRoomDataChat';
import AssetManager from '../../loader/AssetManager';
import RemoteSprite from '../../widget/RemoteSprite';

const { ccclass, property, menu } = cc._decorator;

/** 表情静态图所在 resources 目录，对应 assets/resources/rc/other/emoji/ */
const EMOJI_RES_DIR = 'rc/other/emoji/';

/**
 * 魔法表情 Spine 骨骼所在的 Asset Bundle 名，对应 assets/textures/animate（isBundle=true, bundleName=animate）。
 * 与互动扔道具特效统一放在 animate 下管理。cc.resources 只能加载 assets/resources/，
 * 因此非 resources 目录必须配成 bundle，再走 AssetManager.getOrLoad 加载。
 * EMOJI_CONFIG.spine 为相对 bundle 根的路径（如 'Expression_Amazed/amazed'，不含扩展名）。
 */
const EMOJI_SPINE_BUNDLE = 'animate';

/** Spine 相对表情槽中心的额外偏移（骨骼自身原点偏左，正值往右挪）。嫌多/少改这里即可。 */
const EMOJI_SPINE_OFFSET_X = 60;

const EMOJI_SPINE_OFFSET_Y = 0;

interface EmojiConfig {
    /** Spine 骨骼路径（相对 animate bundle 根，不含扩展名） */
    spine?: string;
    /** Spine 播放的动画名，缺省取骨骼里的第一个动画 */
    anim?: string;
    /** 可选静态图名（rc/other/emoji 下，不含扩展名）；配了则作为 Spine 失败时的回退，未配则回退文字占位 */
    img?: string;
}

/**
 * 表情 type（Unity PropsID）→ 展示配置。参考 Unity UIGameplayChatComponent.PropsID / GetPropID。
 * 魔法表情段 710-726（CtEmoji3*100=700 起），对应 animate bundle 里的 Spine。
 * 免费表情段 500-509、魔法弹幕段 700-709 暂无资源，命中不了配置时按“[表情]”文字占位。
 * 展示优先级：Spine 动画（加载成功）>（可选）静态图 > 文字占位。
 */
const EMOJI_CONFIG: Record<number, EmojiConfig> = {
    710: { spine: 'Expression_BlueBoy/blueboy' }, // MAGICSMOKE 抽烟
    711: { spine: 'Expression_PurpleSmoke/pinkrabbit_smoke' }, // MAGICPURPLESMOKE 紫烟
    712: { spine: 'Expression_BlueBoy/blueboy' }, // MAGICGUN 手枪
    713: { spine: 'Expression_BlueBoy/blueboy' }, // MAGICSMILE 微笑
    714: { spine: 'Expression_Shock/panda_excited' }, // MAGICSHOCK 震惊
    715: { spine: 'Expression_BlueBoy/blueboy' }, // MAGICPOOR 穷
    716: { spine: 'Expression_PokePanda/stab' }, // MAGICPOKEPANDA 戳熊猫
    717: { spine: 'Expression_Amazed/amazed' }, // MAGICAMAZED 惊讶
    718: { spine: 'Expression_Octopus/octopoda' }, // MAGICOCTOPUS 章鱼
    719: { spine: 'Expression_Dog/dog' }, // MAGICHAPPYMOUSE 开心鼠
    720: { spine: 'Expression_KnifePanda/panda_knife_apple' }, // MAGICKNIFEMAN 持刀人
    721: { spine: 'Expression_Dog/dog' }, // MAGICSADDOG 伤心狗
    722: { spine: 'Expression_ToothlessPanda/panda_laugh' }, // MAGICTOOTHLESSPANDA 无牙熊猫
    723: { spine: 'Expression_Whistle/whistle' }, // MAGICWHISTLE 口哨
    724: { spine: 'Expression_DogGlasses/dog_glasses' }, // MAGICCOOLDOG 酷狗
    725: { spine: 'Expression_BlueBoy/blueboy' }, // MAGICSCORN 嘲讽
    726: { spine: 'Expression_BlueBoy/blueboy' } // MAGICHAPPY 开心
};

@ccclass
@menu('Dialog/Chat/ChatMsgItem')
export default class ChatMsgItem extends cc.Component {
    @property({ type: cc.Label, displayName: '聊天内容 chatContent' })
    private chatContentLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: '用户名 userName' })
    private userNameLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: '时间 time' })
    private timeLabel: cc.Label = null;
    @property({ type: cc.Node, displayName: '性别图标-男 male' })
    private maleNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '性别图标-女 female' })
    private femaleNode: cc.Node = null;
    @property({ type: cc.Sprite, displayName: '头像 Round' })
    private avatarSprite: cc.Sprite = null;
    @property({ type: cc.Node, displayName: '表情图片节点 chatEmojiNode' })
    private chatEmojiNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '气泡背景 chatBg' })
    private chatBg: cc.Node = null;
    @property({ displayName: '气泡最大宽度（超出换行）' })
    private bubbleMaxWidth: number = 400;
    @property({ displayName: '气泡横向内边距' })
    private bubblePaddingX: number = 24;
    @property({ displayName: '气泡纵向内边距' })
    private bubblePaddingY: number = 14;
    private _loadingEmojiType: number = 0;
    /** 当前挂在 chatEmojiNode 下的 Spine 子节点（列表复用时需清理） */
    private _emojiSpineNode: cc.Node = null;

    public initData(msg: TexasChatMessage): void {
        this.userNameLabel.string = msg.name;
        this.timeLabel.string = msg.time;
        this.maleNode.active = msg.sex === 1;
        this.femaleNode.active = msg.sex === 2;
        if (msg.headUrl) {
            let remote = this.avatarSprite.getComponent(RemoteSprite);
            if (!remote) {
                remote = this.avatarSprite.addComponent(RemoteSprite);
            }
            remote.url = msg.headUrl;
        }
        // 列表复用：先清掉上一条消息可能残留的 Spine 节点
        this._clearEmojiSpine();
        const cfg = msg.emojiType !== undefined ? EMOJI_CONFIG[msg.emojiType] : undefined;
        if (cfg) {
            // 表情消息：隐藏气泡背景和文字，只展示表情（Spine 动画优先，缺资源回退静态图）
            this.chatBg.active = false;
            this.chatContentLabel.node.active = false;
            this._showEmoji(msg.emojiType, cfg);
        } else if (msg.emojiType !== undefined) {
            // 表情消息但暂无对应资源（如免费表情 500-509、魔法弹幕 700-709）：气泡内文字占位
            console.warn(`[ChatMsgItem] 表情 type=${msg.emojiType} 无资源，显示占位`);
            this.chatEmojiNode.active = false;
            this._renderText('[表情]');
        } else {
            // 文字消息：显示气泡+文字，隐藏表情图片
            this.chatEmojiNode.active = false;
            this._renderText(msg.content);
        }
    }

    /**
     * 渲染文字气泡：短文本按实际宽度收缩背景，超过 bubbleMaxWidth 才固定宽度换行。
     * 依赖编辑器设置：chatContent 不挂拉伸 Widget，chatBg Sprite Type=SLICED、Size Mode=CUSTOM。
     */
    private _renderText(content: string): void {
        this.chatBg.active = true;
        const label = this.chatContentLabel;
        label.node.active = true;
        label.string = content;
        // 先 NONE 让节点宽度跟随文本，量出真实宽度
        label.overflow = cc.Label.Overflow.NONE;
        (label as any)._forceUpdateRenderData();
        if (label.node.width > this.bubbleMaxWidth) {
            // 超出上限：固定宽度自动换行，高度自适应
            label.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
            label.node.width = this.bubbleMaxWidth;
            (label as any)._forceUpdateRenderData();
        }
        // 背景包住文字 + 内边距
        this.chatBg.width = label.node.width + this.bubblePaddingX * 2;
        this.chatBg.height = label.node.height + this.bubblePaddingY * 2;
    }

    /**
     * 展示表情：优先播放 Spine 动画（配置了 spine 且加载成功），
     * 否则回退（可选静态图 > 文字占位）。
     */
    private _showEmoji(emojiType: number, cfg: EmojiConfig): void {
        this.chatEmojiNode.active = true;
        this._loadingEmojiType = emojiType;
        if (cfg.spine) {
            this._playSpine(emojiType, cfg);
        } else {
            this._fallbackEmoji(emojiType, cfg);
        }
    }

    /** Spine 缺失/失败时的回退：配了静态图用图，否则退回“[表情]”文字占位 */
    private _fallbackEmoji(emojiType: number, cfg: EmojiConfig): void {
        if (this._loadingEmojiType !== emojiType || !cc.isValid(this.chatEmojiNode)) return;
        if (cfg.img) {
            this._loadImage(emojiType, cfg.img);
        } else {
            this._clearEmojiSpine();
            this.chatEmojiNode.active = false;
            this._renderText('[表情]');
        }
    }

    /** 加载静态图并显示到 chatEmojiNode 的 Sprite 上 */
    private _loadImage(emojiType: number, resName: string): void {
        cc.resources.load(EMOJI_RES_DIR + resName, cc.SpriteFrame, (err: Error, sf: cc.SpriteFrame) => {
            if (err || !sf || !cc.isValid(this.chatEmojiNode)) return;
            if (this._loadingEmojiType !== emojiType) return;
            const sprite = this.chatEmojiNode.getComponent(cc.Sprite);
            if (sprite) sprite.spriteFrame = sf;
        });
    }

    /** 从 animate bundle 加载并循环播放 Spine 动画；资源缺失/加载失败时回退 */
    private _playSpine(emojiType: number, cfg: EmojiConfig): void {
        AssetManager.getOrLoad(EMOJI_SPINE_BUNDLE, cfg.spine, sp.SkeletonData)
            .then((skeletonData: sp.SkeletonData) => {
                if (this._loadingEmojiType !== emojiType || !cc.isValid(this.chatEmojiNode)) return;
                if (!skeletonData) {
                    this._fallbackEmoji(emojiType, cfg);
                    return;
                }
                // 有骨骼资源：清掉静态图，挂一个 Spine 子节点循环播放
                const sprite = this.chatEmojiNode.getComponent(cc.Sprite);
                if (sprite) sprite.spriteFrame = null;
                this._clearEmojiSpine();
                const node = new cc.Node('EmojiSpine');
                const skeleton = node.addComponent(sp.Skeleton);
                skeleton.skeletonData = skeletonData;
                skeleton.premultipliedAlpha = false;
                node.parent = this.chatEmojiNode;
                // 子节点本地(0,0)在父锚点处；chatEmojiNode 锚点非居中(0,0.5)，
                // 需按父节点尺寸/锚点偏移到几何中心，避免 Spine 贴到左边缘压住头像。
                const parent = this.chatEmojiNode;
                node.setPosition((0.5 - parent.anchorX) * parent.width + EMOJI_SPINE_OFFSET_X, (0.5 - parent.anchorY) * parent.height + EMOJI_SPINE_OFFSET_Y);
                this._emojiSpineNode = node;
                let animName = cfg.anim;
                if (!animName) {
                    // 未指定动画名：取骨骼里的第一个动画
                    const runtime = (skeletonData as any).getRuntimeData ? (skeletonData as any).getRuntimeData(true) : null;
                    animName = runtime && runtime.animations && runtime.animations.length ? runtime.animations[0].name : 'animation';
                }
                skeleton.setAnimation(0, animName, true);
            })
            .catch(() => {
                // Spine 资源缺失/加载失败：回退（可选静态图 > 文字占位）
                this._fallbackEmoji(emojiType, cfg);
            });
    }

    /** 清理当前挂在 chatEmojiNode 下的 Spine 子节点 */
    private _clearEmojiSpine(): void {
        if (this._emojiSpineNode && cc.isValid(this._emojiSpineNode)) {
            this._emojiSpineNode.destroy();
        }
        this._emojiSpineNode = null;
    }

    /**
     * 当帧强制结算真实高度。
     * Label 尺寸与 CONTAINER Layout 默认帧末才更新，插入后立刻滚动会拿到 prefab 设计高度导致滚过头。
     */
    public forceLayout(): void {
        (this.chatContentLabel as any)._forceUpdateRenderData();
        (this.userNameLabel as any)._forceUpdateRenderData();
        (this.timeLabel as any)._forceUpdateRenderData();
        const layouts = this.getComponentsInChildren(cc.Layout);
        // getComponentsInChildren 是先根序，反向遍历保证子层先结算、根节点高度当帧可用
        for (let i = layouts.length - 1; i >= 0; i--) {
            layouts[i].updateLayout();
        }
    }
}
