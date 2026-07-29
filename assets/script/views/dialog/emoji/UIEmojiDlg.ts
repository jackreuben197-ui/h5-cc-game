import type { ClientMessageBroadcastMsg } from '@silenthill/agreement-web';
import { Code, Def } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import userStore from '../../../data/user/UserStore';
import { BroadcastCode, pickerEmojiTypeFromIndex } from '../../../game/constant/BroadcastCode';
import ProtocolAgency from '../../../net/websocket/ProtocolAgency';
import UIComponentBaseDialog from '../../base/UIComponentDialogBase';
import UIEmojiItem from './UIEmojiItem';

const { ccclass, menu, property } = cc._decorator;

export interface UIEmojiDlgParam {
    roomID: number;
    matchID: number;
}

/**
 * 表情面板（与 pokerqueen 对齐）：底部 5 个分类标签，每类 10 个表情（em16-65）。
 * 选择器用静态 png，点击后广播 type = 500 + (序号-1)，动画+语音在座位头像上播放。
 * 素材：图标 emoji/em16-65、标签 emoji/emtab1-5、下划线 emoji/emunderline，
 *      动画 emoji_spine/em{idx}/skeleton，语音 emoji_audio/em{idx}。
 */
@ccclass
@menu('CrazyPoker/Texas/Dialog/UIEmojiDlg')
export default class UIEmojiDlg extends UIComponentBaseDialog<UIEmojiDlgParam> {
    @property({ type: cc.Node, displayName: '关闭触摸遮罩' })
    private panelClick: cc.Node = null;
    @property({ type: cc.Node, displayName: '表情面板' })
    private contentView: cc.Node = null;
    @property({ type: cc.Node, displayName: '表情滚动内容节点' })
    private scrollContent: cc.Node = null;
    @property({ type: cc.Node, displayName: '表情滚动视口' })
    private viewport: cc.Node = null;
    @property({ type: cc.Prefab, displayName: '表情条目预制体' })
    private itemPrefab: cc.Prefab = null;

    // ===== 分类配置：标签顺序 Mushroom → Shinchan → Teddy → Frog → Dog =====
    private static readonly CATEGORIES: { name: string; icon: string; indices: number[] }[] = [
        { name: 'MushroomHead', icon: 'emtab2', indices: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35] },
        { name: 'Shinchan', icon: 'emtab3', indices: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45] },
        { name: 'Teddy', icon: 'emtab1', indices: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25] },
        { name: 'Frog', icon: 'emtab4', indices: [46, 47, 48, 49, 50, 51, 52, 53, 54, 55] },
        { name: 'Dog', icon: 'emtab5', indices: [56, 57, 58, 59, 60, 61, 62, 63, 64, 65] }
    ];
    private static readonly EMOJI_COST = 10;
    private static readonly TAB_Y = -255;
    private static readonly TAB_ICON_SIZE = 96;
    private static readonly TAB_UNDERLINE_Y = -60;
    private static readonly GRID_PADDING_BOTTOM = 180;

    private _roomData: TexasGameRoomData = null;
    private _targetY = 0;
    private _startY = 0;
    private _viewportVerticalInset = 0;
    private _tabBar: cc.Node = null;
    private _tabUnderline: cc.Node = null;
    private _curCategory = 0;
    private _loadVersion = 0;
    /** 记住上次选中的分类标签，重新打开面板时回到该标签(面板关闭会销毁实例，故用静态字段跨实例保留) */
    private static _lastCategory = 0;

    public initialize(param: UIEmojiDlgParam): void {
        this._roomData = roomDataManager.getRoomData<TexasGameRoomData>(param.roomID, param.matchID);
        this._applyLayout();
        const layout = this.scrollContent.getComponent(cc.Layout);
        if (layout) layout.paddingBottom = UIEmojiDlg.GRID_PADDING_BOTTOM;
        this._updatePanelHeight(UIEmojiDlg.CATEGORIES[0].indices.length);
        this._buildCategoryTabs();
        // 回到上次选中的分类标签，而不是每次都重置到第一个
        const startCategory = Math.min(Math.max(UIEmojiDlg._lastCategory, 0), UIEmojiDlg.CATEGORIES.length - 1);
        this._selectCategory(startCategory);
        this._playShowAnimation();
    }

    protected onLoad(): void {
        this._targetY = this.contentView.y;
        this._startY = -cc.winSize.height + 100;
        this._viewportVerticalInset = this.contentView.height - this.viewport.height;
        this._bindTouchEnd(this.panelClick, this.close);
        this.contentView.on(cc.Node.EventType.TOUCH_START, this._stopTouch, this);
        this.contentView.on(cc.Node.EventType.TOUCH_END, this._stopTouch, this);
    }

    protected onDestroy(): void {
        this.node.targetOff(this);
        this.panelClick.targetOff(this);
        this.contentView.targetOff(this);
        this.unscheduleAllCallbacks();
    }

    private _applyLayout(): void {
        this.node.setPosition(0, 0);
        this.node.setContentSize(1242, 2688);
        this.panelClick.setPosition(0, 0);
        this.panelClick.setContentSize(1242, 2688);
    }

    private _playShowAnimation(): void {
        this.contentView.stopAllActions();
        this.contentView.y = this._startY;
        this.contentView.opacity = 0;
        cc.tween(this.contentView).to(0.4, { y: this._targetY, opacity: 255 }, { easing: 'sineOut' }).start();
    }

    // ===== 底部分类标签栏 =====
    private _buildCategoryTabs(): void {
        if (this._tabBar || !this.contentView) return;
        const cats = UIEmojiDlg.CATEGORIES;
        const bar = new cc.Node('CategoryTabs');
        bar.setParent(this.contentView);
        bar.setPosition(0, UIEmojiDlg.TAB_Y);
        this._tabBar = bar;
        const size = UIEmojiDlg.TAB_ICON_SIZE;
        const totalW = 900;
        const step = totalW / cats.length;
        cats.forEach((cat, i) => {
            const tab = new cc.Node('tab' + i);
            tab.setParent(bar);
            tab.setPosition(-totalW / 2 + step * (i + 0.5), 0);
            tab.setContentSize(size, size);
            const sp = tab.addComponent(cc.Sprite);
            sp.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            cc.resources.load(`emoji/${cat.icon}`, cc.SpriteFrame, (err, sf: cc.SpriteFrame) => {
                if (!err && sf && cc.isValid(tab)) {
                    sp.spriteFrame = sf;
                    tab.setContentSize(size, size);
                }
            });
            tab.on(
                cc.Node.EventType.TOUCH_END,
                (e: cc.Event.EventTouch) => {
                    e.stopPropagation();
                    this._selectCategory(i);
                },
                this
            );
        });
        const underline = new cc.Node('underline');
        underline.setParent(bar);
        underline.setContentSize(74, 6);
        underline.y = UIEmojiDlg.TAB_UNDERLINE_Y;
        const usp = underline.addComponent(cc.Sprite);
        usp.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        cc.resources.load('emoji/emunderline', cc.SpriteFrame, (err, sf: cc.SpriteFrame) => {
            if (!err && sf && cc.isValid(underline)) {
                usp.spriteFrame = sf;
                underline.setContentSize(74, 6);
            }
        });
        this._tabUnderline = underline;
    }

    private _selectCategory(index: number): void {
        if (!this._tabBar || !this.scrollContent) return;
        this._curCategory = index;
        UIEmojiDlg._lastCategory = index;
        this._tabBar.children.forEach(tab => {
            const idx = parseInt(tab.name.replace('tab', ''));
            if (isNaN(idx)) return;
            const selected = idx === index;
            tab.scale = selected ? 1.3 : 1.05;
            tab.opacity = selected ? 255 : 210;
            if (selected && this._tabUnderline) this._tabUnderline.x = tab.x;
        });
        const version = ++this._loadVersion;
        this.scrollContent.removeAllChildren();
        const cats = UIEmojiDlg.CATEGORIES;
        const indices = cats[index] ? cats[index].indices : [];
        for (const i of indices) this._loadAndAddEmoji(i, version);
    }

    private _loadAndAddEmoji(index: number, version: number): void {
        cc.resources.load(`emoji/em${index}`, cc.SpriteFrame, (err, spriteFrame: cc.SpriteFrame) => {
            if (err || !spriteFrame) return;
            if (!cc.isValid(this.node) || this._loadVersion !== version) return;
            const itemNode = cc.instantiate(this.itemPrefab);
            itemNode.parent = this.scrollContent;
            // 异步加载完成顺序不定，按序号插入正确位置，保证网格顺序
            (itemNode as any).emojiIndex = index;
            let siblingIdx = 0;
            for (const child of this.scrollContent.children) {
                if (child !== itemNode && ((child as any).emojiIndex || 0) < index) siblingIdx++;
            }
            itemNode.setSiblingIndex(siblingIdx);
            const item = itemNode.getComponent(UIEmojiItem);
            if (item) {
                item.initializeStatic({
                    spriteFrame,
                    showDiamond: true,
                    diamond: UIEmojiDlg.EMOJI_COST,
                    onClick: () => this._onEmojiClicked(index)
                });
            }
        });
    }

    private _updatePanelHeight(itemCount: number): void {
        const layout = this.scrollContent.getComponent(cc.Layout);
        const itemNode = this.itemPrefab.data as cc.Node;
        const availableWidth = this.scrollContent.width - layout.paddingLeft - layout.paddingRight;
        const columnCount = Math.max(1, Math.floor((availableWidth + layout.spacingX) / (itemNode.width + layout.spacingX)));
        const rowCount = Math.max(1, Math.ceil(itemCount / columnCount));
        const contentHeight = layout.paddingTop + layout.paddingBottom + rowCount * itemNode.height + (rowCount - 1) * layout.spacingY;
        this.scrollContent.height = contentHeight;
        this.contentView.height = contentHeight + this._viewportVerticalInset;
        this.contentView.getComponent(cc.Widget).updateAlignment();
        this.viewport.getComponent(cc.Widget).updateAlignment();
        this._targetY = this.contentView.y;
    }

    private _onEmojiClicked(index: number): void {
        this._sendEmojiBroadcast(pickerEmojiTypeFromIndex(index));
        this.scheduleOnce(() => this.close(), 0.26);
    }

    private _sendEmojiBroadcast(type: number): void {
        this._roomData.seatsStateManager.setPendingEmoji({ type, userID: userStore.userRID });
        const msgType = Def.BroadcastMsgType.BC_MSG_EMOJI;
        const inner = JSON.stringify({
            name: userStore.name,
            type,
            user_id: userStore.userRID,
            target_user_id: 0,
            message: '',
            msgType,
            time: Date.now(),
            sex: userStore.sex,
            headUrl: userStore.avatar
        });
        const body: ClientMessageBroadcastMsg.AsObject = {
            room: {
                roomId: this._roomData.roomID,
                matchId: this._roomData.matchID
            },
            consume: Def.ConsumeType.CT_NONE,
            message: '',
            extra: this._stringToBytes(JSON.stringify({ code: BroadcastCode.BroadcastMsg, data: inner })),
            msgType
        };
        ProtocolAgency.Send({
            code: Code.MSG_D_BROADCAST_MSG,
            roomID: this._roomData.roomID,
            matchID: this._roomData.matchID,
            body
        });
    }

    private _bindTouchEnd(node: cc.Node, handler: () => void): void {
        node.on(cc.Node.EventType.TOUCH_END, handler, this);
    }

    private _stopTouch(event: cc.Event.EventTouch): void {
        event.stopPropagation();
    }

    private _stringToBytes(str: string): Uint8Array {
        const encoded = unescape(encodeURIComponent(str));
        const bytes = new Uint8Array(encoded.length);
        for (let i = 0; i < encoded.length; i++) bytes[i] = encoded.charCodeAt(i);
        return bytes;
    }
}
