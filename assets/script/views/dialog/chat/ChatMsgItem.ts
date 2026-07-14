import { TexasChatMessage } from '../../../data/room/texas/TexasGameRoomDataChat';
import MagicEmojiConfig, { MagicEmojiDefinition } from '../../../game/constant/MagicEmojiConfig';
import RemoteSprite from '../../widget/RemoteSprite';

const { ccclass, property, menu } = cc._decorator;

/**
 * 魔法表情映射复用主分支的权威配置 MagicEmojiConfig（座位表情 / 发送面板同源）。
 * spine 路径已是 resources 下的完整路径（rc/other/effect/expressionXxx/xxx），直接 cc.resources.load 即可；
 * 这些骨骼在 rc/ 下会被预加载，聊天记录里命中缓存即时显示。
 * 免费表情段 500-509、魔法弹幕段 700-709 无配置时按“[表情]”文字占位。
 */

/** Spine 相对表情槽中心的额外偏移（骨骼自身原点偏左，正值往右挪）。嫌多/少改这里即可。 */
const EMOJI_SPINE_OFFSET_X = 60;

const EMOJI_SPINE_OFFSET_Y = 0;

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
        const def = msg.emojiType !== undefined ? MagicEmojiConfig.getByType(msg.emojiType) : null;
        if (def) {
            // 表情消息：隐藏气泡背景和文字，只展示表情 Spine 动画
            this.chatBg.active = false;
            this.chatContentLabel.node.active = false;
            this._showEmoji(msg.emojiType, def);
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

    /** 展示表情：加载并循环播放 Spine 动画（走 MagicEmojiConfig 的 rc 路径 + 指定动画名） */
    private _showEmoji(emojiType: number, def: MagicEmojiDefinition): void {
        this.chatEmojiNode.active = true;
        this._loadingEmojiType = emojiType;
        this._playSpine(emojiType, def);
    }

    /** Spine 缺失/加载失败时回退“[表情]”文字占位 */
    private _fallbackEmoji(emojiType: number): void {
        if (this._loadingEmojiType !== emojiType || !cc.isValid(this.chatEmojiNode)) return;
        this._clearEmojiSpine();
        this.chatEmojiNode.active = false;
        this._renderText('[表情]');
    }

    /** 从 resources 加载并循环播放 Spine 动画；资源缺失/加载失败时回退文字占位 */
    private _playSpine(emojiType: number, def: MagicEmojiDefinition): void {
        cc.resources.load(def.spine, sp.SkeletonData, (err: Error, skeletonData: sp.SkeletonData) => {
            if (this._loadingEmojiType !== emojiType || !cc.isValid(this.chatEmojiNode)) return;
            if (err || !skeletonData) {
                this._fallbackEmoji(emojiType);
                return;
            }
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
            skeleton.setAnimation(0, def.animation, true);
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
