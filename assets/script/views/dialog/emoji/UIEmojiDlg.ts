import type { ClientMessageBroadcastMsg } from '@silenthill/agreement-web';
import { Code, Def } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import userStore from '../../../data/user/UserStore';
import { BroadcastCode } from '../../../game/constant/BroadcastCode';
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
    @property({ type: cc.Prefab, displayName: '表情条目预制体' })
    private itemPrefab: cc.Prefab = null;
    private static readonly EMOJI_COUNT = 15;
    private static readonly FIRST_BATCH_COUNT = 10;
    private _roomData: TexasGameRoomData = null;
    private _targetY = 0;
    private _startY = 0;
    private _loadedOnce = false;

    public initialize(param: UIEmojiDlgParam): void {
        this._roomData = roomDataManager.getRoomData<TexasGameRoomData>(param.roomID, param.matchID);
        this._applyLayout();
        this._playShowAnimation();
        this._loadEmojiItems();
    }

    protected onLoad(): void {
        this._targetY = this.contentView.y;
        this._startY = -cc.winSize.height + 100;
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

    private _loadEmojiItems(): void {
        this.scrollContent.removeAllChildren();
        if (!this._loadedOnce) {
            this._loadedOnce = true;
            for (let i = 1; i <= UIEmojiDlg.FIRST_BATCH_COUNT; i++) this._loadAndAddEmoji(i);
            for (let i = UIEmojiDlg.FIRST_BATCH_COUNT + 1; i <= UIEmojiDlg.EMOJI_COUNT; i++) {
                const index = i;
                this.scheduleOnce(() => this._loadAndAddEmoji(index), (i - UIEmojiDlg.FIRST_BATCH_COUNT) * 0.1);
            }
            return;
        }
        for (let i = 1; i <= UIEmojiDlg.EMOJI_COUNT; i++) this._loadAndAddEmoji(i);
    }

    private async _loadAndAddEmoji(index: number): Promise<void> {
        try {
            const spriteFrame = await AssetManager.getOrLoad(BUNDLE_RESOURCES, `rc/other/emoji/em${index}`, cc.SpriteFrame);
            if (!cc.isValid(this.node) || !this.node.activeInHierarchy) return;
            const itemNode = cc.instantiate(this.itemPrefab);
            itemNode.parent = this.scrollContent;
            const item = itemNode.getComponent(UIEmojiItem);
            item.initialize({
                spriteFrame,
                showDiamond: index < 11,
                index,
                onClick: this.onEmojiClicked
            });
        } catch (error) {
            cc.warn('[UIEmojiDlg] load emoji failed', index, error);
        }
    }

    private onEmojiClicked = (index: number): void => {
        this._sendEmojiBroadcast(index);
        this.scheduleOnce(() => this.close(), 0.26);
    };

    private _sendEmojiBroadcast(emojiIndex: number): void {
        const emojiType = this._getEmojiTypeBase() + emojiIndex - 1;
        this._roomData.seatsStateManager.setPendingEmoji({
            type: emojiType,
            userID: userStore.userRID
        });
        const msgType = Def.BroadcastMsgType.BC_MSG_EMOJI;
        const inner = JSON.stringify({
            name: userStore.name,
            type: emojiType,
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

    private _getEmojiTypeBase(): number {
        return Def.ConsumeType.CT_EMOJI_1 * 100;
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
