import type { ClientMessageBroadcastMsg } from '@silenthill/agreement-web';
import { Code, Def } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataChat from '../../../data/room/texas/TexasGameRoomDataChat';
import userStore, { UserPropData, UserStore } from '../../../data/user/UserStore';
import UserStoreUtils from '../../../data/user/UserStoreUtils';
import { BroadcastCode } from '../../../game/constant/BroadcastCode';
import { GameplayChatPropType } from '../../../game/constant/GameplayChatPropType';
import MagicEmojiConfig, { MagicEmojiDefinition } from '../../../game/constant/MagicEmojiConfig';
import ProtocolAgency from '../../../net/websocket/ProtocolAgency';
import UIComponentBaseDialog from '../../base/UIComponentDialogBase';
import AssetManager, { BUNDLE_RESOURCES } from '../../loader/AssetManager';
import UIEmojiItem from './UIEmojiItem';

const { ccclass, menu, property } = cc._decorator;

export interface UIEmojiDlgParam {
    roomID: number;
    matchID: number;
}

interface EmojiItemData {
    data: UserPropData;
    config: MagicEmojiDefinition;
}

interface EmojiCategoryData {
    id: number;
    icon: string;
    items: EmojiItemData[];
}

interface EmojiCategoryView {
    node: cc.Node;
    icon: cc.Sprite;
    selectSign: cc.Node;
}

@ccclass
@menu('CrazyPoker/Texas/Dialog/UIEmojiDlg')
export default class UIEmojiDlg extends UIComponentBaseDialog<UIEmojiDlgParam> {
    private static readonly CATEGORY_X_POSITIONS = [-367.632, -180.504, 3.312, 187.128, 370.944];
    private static readonly CATEGORY_SELECTED_ICON_SIZE = 115.92;
    private static readonly CATEGORY_ICON_SIZE = 109.296;
    @property({ type: cc.Node, displayName: '关闭触摸遮罩' })
    private panelClick: cc.Node = null;
    @property({ type: cc.Node, displayName: '表情面板' })
    private contentView: cc.Node = null;
    @property({ type: cc.Node, displayName: '表情滚动内容节点' })
    private scrollContent: cc.Node = null;
    @property({ type: cc.Node, displayName: '表情滚动视口' })
    private viewport: cc.Node = null;
    @property({ type: cc.ScrollView, displayName: '表情滚动视图' })
    private scrollView: cc.ScrollView = null;
    @property({ type: cc.Prefab, displayName: '表情条目预制体' })
    private itemPrefab: cc.Prefab = null;
    @property({ type: cc.Node, displayName: '分类分割线定位节点' })
    private categoryDivider: cc.Node = null;
    @property({ type: cc.Node, displayName: '分类模板节点' })
    private categoryTemplate: cc.Node = null;
    @property({ type: cc.Sprite, displayName: '分类模板图标' })
    private categoryIcon: cc.Sprite = null;
    @property({ type: cc.Node, displayName: '分类模板选中标识' })
    private categorySelectSign: cc.Node = null;
    private _roomData: TexasGameRoomData = null;
    private _targetY = 0;
    private _startY = 0;
    private _loadVersion = 0;
    private _selectedCategoryID: number = null;
    private _categoryData: EmojiCategoryData[] = [];
    private _categoryViews: EmojiCategoryView[] = [];

    public initialize(param: UIEmojiDlgParam): void {
        this._roomData = roomDataManager.getRoomData<TexasGameRoomData>(param.roomID, param.matchID);
        this._applyLayout();
        userStore.targetOff(this);
        userStore.on(UserStore.PROP_LIST_CHANGE, this._loadEmojiItems, this);
        this._loadEmojiItems();
        this._playShowAnimation();
    }

    protected onLoad(): void {
        this._targetY = this.contentView.y;
        this._startY = -cc.winSize.height + 100;
        this._drawCategoryDivider();
        this._bindTouchEnd(this.panelClick, this.close);
        this.contentView.on(cc.Node.EventType.TOUCH_START, this._stopTouch, this);
        this.contentView.on(cc.Node.EventType.TOUCH_END, this._stopTouch, this);
    }

    protected override onFrameResize(
        visibleSizeWidth: number,
        visibleSizeHeight: number,
        frameSizeWidth: number,
        frameSizeHeight: number,
        suggestScale: number,
        saveAreaTop: number
    ): void {
        const maxHeight = 2290;
        if (visibleSizeHeight < maxHeight) {
            const scale = visibleSizeHeight / maxHeight;
            this.node.setScale(scale, scale);
        }
    }

    protected onDestroy(): void {
        this.node.targetOff(this);
        this.panelClick.targetOff(this);
        this.contentView.targetOff(this);
        userStore.targetOff(this);
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

    private _drawCategoryDivider(): void {
        const dividerNode = new cc.Node('categoryDividerGraphics');
        dividerNode.parent = this.categoryDivider.parent;
        dividerNode.setPosition(this.categoryDivider.position);
        dividerNode.setContentSize(this.categoryDivider.getContentSize());
        const graphics = dividerNode.addComponent(cc.Graphics);
        graphics.fillColor = new cc.Color(this.categoryDivider.color.r, this.categoryDivider.color.g, this.categoryDivider.color.b, this.categoryDivider.opacity);
        graphics.rect(-this.categoryDivider.width / 2, -1, this.categoryDivider.width, 2);
        graphics.fill();
        this.categoryDivider.active = false;
    }

    private async _loadEmojiItems(): Promise<void> {
        const items = userStore
            .getPropListByType(GameplayChatPropType.CHAT_PROP)
            .map(data => ({ data, config: MagicEmojiConfig.getByPropCode(data.propCode) }))
            .filter(item => !!item.config) as EmojiItemData[];
        this._categoryData = this._groupEmojiItems(items);
        if (!this._categoryData.some(category => category.id === this._selectedCategoryID)) {
            this._selectedCategoryID = this._categoryData.length > 0 ? this._categoryData[0].id : null;
        }
        this._renderCategories();
        await this._loadSelectedCategoryItems();
    }

    private _groupEmojiItems(items: EmojiItemData[]): EmojiCategoryData[] {
        const categories: EmojiCategoryData[] = [];
        items.forEach(item => {
            let category = categories.find(data => data.id === item.data.propTypeCategory);
            if (!category) {
                category = {
                    id: item.data.propTypeCategory,
                    icon: item.data.propTypeCategoryIcon,
                    items: []
                };
                categories.push(category);
            }
            if (category.items.length < 10) category.items.push(item);
        });
        return categories.sort((left, right) => left.id - right.id).slice(0, 5);
    }

    private _renderCategories(): void {
        this._categoryViews.forEach((view, index) => {
            view.node.targetOff(this);
            if (index > 0) view.node.destroy();
        });
        this._categoryViews = [];
        this.categoryTemplate.active = this._categoryData.length > 0;
        this._categoryData.forEach((category, index) => {
            const view = this._createCategoryView(index);
            this._updateCategoryView(view, category.id === this._selectedCategoryID);
            view.node.on(cc.Node.EventType.TOUCH_END, () => this.onCategoryClicked(category.id), this);
            this._loadCategoryIcon(view.icon, category.icon);
            this._categoryViews.push(view);
        });
    }

    private _updateCategoryView(view: EmojiCategoryView, selected: boolean): void {
        view.selectSign.active = selected;
        const iconSize = selected ? UIEmojiDlg.CATEGORY_SELECTED_ICON_SIZE : UIEmojiDlg.CATEGORY_ICON_SIZE;
        view.icon.node.setContentSize(iconSize, iconSize);
    }

    private _createCategoryView(index: number): EmojiCategoryView {
        if (index === 0) {
            return {
                node: this.categoryTemplate,
                icon: this.categoryIcon,
                selectSign: this.categorySelectSign
            };
        }
        const node = cc.instantiate(this.categoryTemplate);
        node.name = `cate${index + 1}`;
        node.parent = this.categoryTemplate.parent;
        node.x = UIEmojiDlg.CATEGORY_X_POSITIONS[index];
        const iconNode = node.children[this.categoryIcon.node.getSiblingIndex()];
        const selectSign = node.children[this.categorySelectSign.getSiblingIndex()];
        return {
            node,
            icon: iconNode.getComponent(cc.Sprite),
            selectSign
        };
    }

    private _loadCategoryIcon(sprite: cc.Sprite, url: string): void {
        sprite.spriteFrame = null;
        if (!url) return;
        const node = sprite.node;
        (node as any)._emojiCategoryIconURL = url;
        cc.assetManager.loadRemote(url, { ext: '.png' }, (error, texture: cc.Texture2D) => {
            if (error || !texture || !cc.isValid(node) || (node as any)._emojiCategoryIconURL !== url) return;
            texture.packable = false;
            sprite.spriteFrame = new cc.SpriteFrame(texture);
        });
    }

    private async _loadSelectedCategoryItems(): Promise<void> {
        const version = ++this._loadVersion;
        const category = this._categoryData.find(data => data.id === this._selectedCategoryID);
        const items = category ? category.items : [];
        this.scrollContent.removeAllChildren();
        this._updateContentHeight(items.length);
        try {
            const skeletonPaths = items.map(item => item.config.spine).filter((path, index, list) => list.indexOf(path) === index);
            const loadedSkeletonData = await Promise.all(skeletonPaths.map(path => AssetManager.getOrLoad(BUNDLE_RESOURCES, path, sp.SkeletonData)));
            if (!cc.isValid(this.node) || !this.node.activeInHierarchy || this._loadVersion !== version) return;
            items.forEach(itemData => {
                const itemNode = cc.instantiate(this.itemPrefab);
                itemNode.parent = this.scrollContent;
                const item = itemNode.getComponent(UIEmojiItem);
                const isFree = userStore.isPropFree(itemData.data);
                item.initialize({
                    skeletonData: loadedSkeletonData[skeletonPaths.indexOf(itemData.config.spine)],
                    animation: itemData.config.animation,
                    showDiamond: !isFree,
                    diamond: itemData.data.payPrice,
                    onClick: () => this.onEmojiClicked(itemData.data, itemData.config)
                });
            });
            this.scrollView.scrollToTop(0);
        } catch (error) {
            cc.warn('[UIEmojiDlg] load emoji failed', error);
        }
    }

    private _updateContentHeight(itemCount: number): void {
        const layout = this.scrollContent.getComponent(cc.Layout);
        const itemNode = this.itemPrefab.data as cc.Node;
        const availableWidth = this.scrollContent.width - layout.paddingLeft - layout.paddingRight;
        const columnCount = Math.max(1, Math.floor((availableWidth + layout.spacingX) / (itemNode.width + layout.spacingX)));
        const rowCount = Math.max(1, Math.ceil(itemCount / columnCount));
        const contentHeight = layout.paddingTop + layout.paddingBottom + rowCount * itemNode.height + (rowCount - 1) * layout.spacingY;
        this.scrollContent.height = contentHeight;
        layout.updateLayout();
    }

    private onCategoryClicked(categoryID: number): void {
        if (this._selectedCategoryID === categoryID) return;
        this._selectedCategoryID = categoryID;
        this._categoryViews.forEach((view, index) => {
            this._updateCategoryView(view, this._categoryData[index].id === categoryID);
        });
        this._loadSelectedCategoryItems();
    }

    private onEmojiClicked = (propData: UserPropData, config: MagicEmojiDefinition): void => {
        this._sendEmojiBroadcast(propData, config);
        this.scheduleOnce(() => this.close(), 0.26);
    };

    private _sendEmojiBroadcast(propData: UserPropData, config: MagicEmojiDefinition): void {
        this._roomData.seatsStateManager.setPendingEmoji({
            type: config.type,
            userID: userStore.userRID
        });
        // 发送者不会收到自己的 1121 推送，先记录待确认表情，1019 成功后再写入聊天室。
        this._roomData.chat.setPendingMessage({
            name: userStore.name || '',
            content: '',
            headUrl: userStore.avatar || '',
            sex: userStore.sex || 0,
            time: TexasGameRoomDataChat.formatNowTime(),
            emojiType: config.type
        });
        const msgType = Def.BroadcastMsgType.BC_MSG_EMOJI;
        const inner = JSON.stringify({
            name: userStore.name,
            type: config.type,
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
            consume: userStore.isPropFree(propData) ? Def.ConsumeType.CT_NONE : (propData.priceID as Def.ConsumeTypeMap[keyof Def.ConsumeTypeMap]),
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
        if (propData.propAmount > 0) {
            UserStoreUtils.consumeUserProp(propData.gamePropID).catch(error => cc.warn('[UIEmojiDlg] consume user prop failed', error));
        }
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
