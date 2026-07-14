import type { ClientMessageBroadcastMsg } from '@silenthill/agreement-web';
import { Code, Def } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
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
    private _roomData: TexasGameRoomData = null;
    private _targetY = 0;
    private _startY = 0;
    private _loadVersion = 0;
    private _viewportVerticalInset = 0;

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
        this._viewportVerticalInset = this.contentView.height - this.viewport.height;
        this._bindTouchEnd(this.panelClick, this.close);
        this.contentView.on(cc.Node.EventType.TOUCH_START, this._stopTouch, this);
        this.contentView.on(cc.Node.EventType.TOUCH_END, this._stopTouch, this);
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

    private async _loadEmojiItems(): Promise<void> {
        const version = ++this._loadVersion;
        this.scrollContent.removeAllChildren();
        const items = userStore
            .getPropListByType(GameplayChatPropType.CHAT_PROP)
            .map(data => ({ data, config: MagicEmojiConfig.getByPropCode(data.propCode) }))
            .filter(item => !!item.config);
        this._updatePanelHeight(items.length);
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
        } catch (error) {
            cc.warn('[UIEmojiDlg] load emoji failed', error);
        }
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

    private onEmojiClicked = (propData: UserPropData, config: MagicEmojiDefinition): void => {
        this._sendEmojiBroadcast(propData, config);
        this.scheduleOnce(() => this.close(), 0.26);
    };

    private _sendEmojiBroadcast(propData: UserPropData, config: MagicEmojiDefinition): void {
        this._roomData.seatsStateManager.setPendingEmoji({
            type: config.type,
            userID: userStore.userRID
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
