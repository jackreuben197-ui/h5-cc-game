import { autoBindEvents, bindEvent, unBindEventsAll } from '../../../core/decorator/DataBind';
import { traceClass } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataChat, { TexasChatMessage } from '../../../data/room/texas/TexasGameRoomDataChat';
import HttpRequest from '../../../net/https/HttpRequest';
import { WebChatRoomMessageSync, WebConfigGlobalConfig } from '../../../net/https/WebRequest';
import UIComponentBaseDialog from '../../base/UIComponentDialogBase';
import TexasTableEvent from '../../scene/room/texas/events/TexasTableEvent';
import ChatMsgItem from './ChatMsgItem';

const { ccclass, property, menu } = cc._decorator;

export type UIChatDlgParam = {
    roomID: number;
    matchID: number;
};

/** 快捷语多语言记录（对齐 pokerqueen PublicCacheReader.MultiLanguageTemplateRecord） */
interface QuickMessageRecord {
    cn_name?: string;
    us_name?: string;
    br_name?: string;
    ar_name?: string;
    multi_language?: QuickMessageRecord;
    [key: string]: unknown;
}

/** 当前快捷语显示的语言（与 pokerqueen 保持一致：中文，取不到回退 us_name） */
const QUICK_MESSAGE_LANG_FIELD = 'cn_name';

type ChatMode = 'chatOnly' | 'danmuAndChat';

/**
 * 牌桌聊天对话框（对应 pokerqueen UIChatDlg）。
 *
 * 与 pokerqueen 的差异：
 *  - 消息缓存/实时推送走 roomData.chat（TexasGameRoomDataChat），本组件只 @bindEvent 订阅。
 *  - 快捷语从 HTTP 全局配置 WebConfigGlobalConfig 的 game_quick_message_config 字段读取。
 */
@ccclass
@menu('Dialog/Chat/UIChatDlg')
@traceClass()
export default class UIChatDlg extends UIComponentBaseDialog<UIChatDlgParam> {
    @property({ type: cc.Node, displayName: '背景遮罩(点击关闭) $panel_click' })
    private panelClickNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '对话框面板 ChatDlg' })
    private dlgNode: cc.Node = null;
    @property({ type: cc.Label, displayName: '标题(房名+房号) dlgTitle' })
    private dlgTitleLabel: cc.Label = null;
    @property({ type: cc.Node, displayName: '关闭按钮 closeBtn' })
    private closeBtn: cc.Node = null;
    @property({ type: cc.ScrollView, displayName: '聊天列表 ChatList' })
    private chatListScroll: cc.ScrollView = null;
    @property({ type: cc.EditBox, displayName: '输入框 chatEditBox' })
    private chatEditBox: cc.EditBox = null;
    @property({ type: cc.Node, displayName: '发送按钮 sendMsg' })
    private sendBtn: cc.Node = null;
    @property({ type: cc.Node, displayName: '开场白节点 welcomeNode' })
    private welcomeNode: cc.Node = null;
    @property({ type: cc.Label, displayName: '开场白文案 welcome' })
    private welcomeLabel: cc.Label = null;
    @property({ type: cc.Node, displayName: '快捷语按钮 chatTemplateBtn' })
    private chatTemplateBtn: cc.Node = null;
    @property({ type: cc.Node, displayName: '快捷语面板 chatTemplate' })
    private chatTemplateNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '快捷语单条模板 chatItem' })
    private chatItemTemplate: cc.Node = null;
    @property({ type: cc.Prefab, displayName: '聊天条目 Prefab ChatMsgItem' })
    private chatMsgItemPrefab: cc.Prefab = null;
    @property({ type: cc.Node, displayName: '只发聊天 chatOnly' })
    private chatOnlyNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '同时发送弹幕 danmuAndChat' })
    private danmuAndChatNode: cc.Node = null;
    private _roomData: TexasGameRoomData = null;
    private _chat: TexasGameRoomDataChat = null;
    /** ChatList Widget 原始 top（开场白显示时的位置），隐藏开场白时改为 welcomeNode 的 top 以回收空间 */
    private _chatListOriginTop: number = 0;
    private _chatTemplatePanelActive: boolean = false;
    private _chatTemplateLoaded: boolean = false;
    private _chatMode: ChatMode = 'chatOnly';
    private _checkedFrame: cc.SpriteFrame = null;
    private _uncheckedFrame: cc.SpriteFrame = null;

    protected onLoad(): void {
        this.panelClickNode.on(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
        this.closeBtn.on(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
        this.sendBtn.on(cc.Node.EventType.TOUCH_END, this.onClickSendMsg, this);
        this.chatTemplateBtn.on(cc.Node.EventType.TOUCH_END, this.onClickToggleChatTemplate, this);
        this.chatOnlyNode.on(cc.Node.EventType.TOUCH_END, () => this.onClickChatMode('chatOnly'), this);
        this.danmuAndChatNode.on(cc.Node.EventType.TOUCH_END, () => this.onClickChatMode('danmuAndChat'), this);
        // 阻止面板区域触摸冒泡，防止误触背景关闭
        this.dlgNode.on(cc.Node.EventType.TOUCH_START, (e: cc.Event.EventTouch) => e.stopPropagation());
        this.dlgNode.on(cc.Node.EventType.TOUCH_END, (e: cc.Event.EventTouch) => e.stopPropagation());
        this.chatEditBox.node.on('text-submit', this.onClickSendMsg, this);
        // 修复 WebH5 构建后原生 <input> 被 H5 层 #app(z-index:10) 遮挡导致输入不可见
        this.chatEditBox.node.on('editing-did-began', (editbox: cc.EditBox) => {
            const prepareKeyboard = (window as any).__H5_PREPARE_KEYBOARD__;
            if (typeof prepareKeyboard === 'function') prepareKeyboard();
            if (cc.sys.isBrowser && (editbox as any)._impl && (editbox as any)._impl._elem) {
                const elem = (editbox as any)._impl._elem as HTMLElement;
                elem.style.zIndex = '20';
                elem.style.paddingLeft = '40px';
                elem.style.boxSizing = 'border-box';
            }
        });
        const checkedSprite = this.chatOnlyNode.getChildByName('checkSpr').getComponent(cc.Sprite);
        const uncheckedSprite = this.danmuAndChatNode.getChildByName('checkSpr').getComponent(cc.Sprite);
        this._checkedFrame = checkedSprite.spriteFrame;
        this._uncheckedFrame = uncheckedSprite.spriteFrame;
        const chatListWidget = this.chatListScroll.node.getComponent(cc.Widget);
        if (chatListWidget) {
            this._chatListOriginTop = chatListWidget.top;
        }
        // 单条模板移出容器（保留组件），避免被 cc.Layout 算进布局占位
        this.chatItemTemplate.removeFromParent(false);
        this.chatItemTemplate.active = false;
        this.chatTemplateNode.active = false;
    }

    public initialize(param: UIChatDlgParam): void {
        this._roomData = roomDataManager.getRoomData<TexasGameRoomData>(param.roomID, param.matchID);
        if (!this._roomData) {
            this.close();
            return;
        }
        // 对话框实例被 UIViewManager 缓存复用：换房间时 onEnable 已把旧房间 chat 置为打开，
        // 换绑前必须释放，否则旧房间的红点永远不会再亮
        if (this._chat && this._chat !== this._roomData.chat) {
            this._chat.setChatDialogOpen(false);
        }
        this._chat = this._roomData.chat;
        this._chat.setChatDialogOpen(true);
        this.dlgTitleLabel.string = `${this._roomData.basicInfo.roomName || ''}\n#${this._roomData.roomID}`;
        this.chatEditBox.string = '';
        this._chatTemplatePanelActive = false;
        this._chatMode = 'chatOnly';
        this.chatTemplateNode.active = false;
        this._updateChatModeUI();
        this._bindEventsAndRefresh();
        this._renderAllMessages();
        this._refreshWelcome();
        this._fetchHistoryAndPrologue();
        this._loadQuickMessages();
    }

    protected onEnable(): void {
        if (this._chat) {
            this._chat.setChatDialogOpen(true);
        }
        this._bindEventsAndRefresh();
    }

    protected onDisable(): void {
        if (this._chat) {
            this._chat.setChatDialogOpen(false);
        }
        unBindEventsAll(this);
        this._chatTemplatePanelActive = false;
        if (this.chatTemplateNode) {
            this.chatTemplateNode.active = false;
        }
    }

    private _bindEventsAndRefresh(): void {
        if (!this._chat) return;
        autoBindEvents(this, { chat: this._chat });
    }
    // ============================================================
    // @bindEvent —— 数据驱动刷新
    // ============================================================
    @bindEvent(TexasGameRoomDataChat.MESSAGE_ADDED, { dataSource: 'chat', initIgnore: true })
    private onMessageAdded(msg: TexasChatMessage): void {
        this._appendItem(msg, true);
        this._scrollToBottom();
    }

    @bindEvent(TexasGameRoomDataChat.MESSAGES_RESET, { dataSource: 'chat', initIgnore: true })
    private onMessagesReset(): void {
        this._renderAllMessages();
        this._refreshWelcome();
    }
    // ============================================================
    // 渲染
    // ============================================================
    private _renderAllMessages(): void {
        const content = this.chatListScroll.content;
        content.removeAllChildren();
        for (const msg of this._chat.messages) {
            this._appendItem(msg, false);
        }
        this._scrollToBottom(false);
    }

    private _appendItem(msg: TexasChatMessage, fadeIn: boolean): void {
        const item = cc.instantiate(this.chatMsgItemPrefab);
        item.parent = this.chatListScroll.content;
        const itemComp = item.getComponent(ChatMsgItem);
        itemComp.initData(msg);
        itemComp.forceLayout();
        if (fadeIn) {
            item.opacity = 0;
            cc.tween(item).to(0.4, { opacity: 255 }).start();
        }
    }

    /** 条目已 forceLayout，content 当帧结算后立即滚动，目标位置基于真实高度不会滚过头 */
    private _scrollToBottom(animated: boolean = true): void {
        const contentLayout = this.chatListScroll.content.getComponent(cc.Layout);
        if (contentLayout) contentLayout.updateLayout();
        this.chatListScroll.stopAutoScroll();
        this.chatListScroll.scrollToBottom(animated ? 0.1 : 0);
    }

    /** 根据 chat.prologue 显示/隐藏开场白，并通过 ChatList Widget.top 回收/让出开场白区域 */
    private _refreshWelcome(): void {
        const prologue = this._chat ? this._chat.prologue : null;
        this.welcomeLabel.string = prologue || '';
        this.welcomeNode.active = !!prologue;
        const chatListWidget = this.chatListScroll.node.getComponent(cc.Widget);
        const welcomeWidget = this.welcomeNode.getComponent(cc.Widget);
        if (!chatListWidget || !welcomeWidget) return;
        chatListWidget.top = prologue ? this._chatListOriginTop : welcomeWidget.top;
        chatListWidget.updateAlignment();
        // Widget 只在 load/窗口变化时自动对齐，运行时改 top 需手动级联刷新子节点（view/scrollBar）
        for (const child of this.chatListScroll.node.children) {
            const w = child.getComponent(cc.Widget);
            if (w) w.updateAlignment();
        }
    }
    // ============================================================
    // 发送
    // ============================================================
    private onClickSendMsg(): void {
        const text = this.chatEditBox.string.trim();
        if (!text || !this._roomData) return;
        TexasTableEvent.SendChatMessage(this._roomData, text, this._chatMode === 'danmuAndChat');
        this.chatEditBox.string = '';
    }
    // ============================================================
    // 历史消息 + 开场白（HTTP）
    // ============================================================
    private _fetchHistoryAndPrologue(): void {
        const roomID = this._roomData.roomID;
        HttpRequest.Send({
            request: WebChatRoomMessageSync,
            body: WebChatRoomMessageSync.Request({
                room_id: roomID,
                block_user_random_ids: [],
                is_cowboy: 0,
                msg_types: [0, 1, 3]
            }),
            juhua: false,
            onSuccess: () => {
                if (!cc.isValid(this.node) || !this._roomData || this._roomData.roomID !== roomID) return;
                const chatDataArr = WebChatRoomMessageSync.Response?.data?.data;
                if (!chatDataArr || !Array.isArray(chatDataArr) || chatDataArr.length === 0) {
                    this._refreshWelcome();
                    return;
                }
                const history: TexasChatMessage[] = [];
                let prologue: string | null = null;
                for (const chatData of chatDataArr) {
                    if (!chatData || !chatData.extra) continue;
                    try {
                        const extraObj = JSON.parse(chatData.extra);
                        // 表情/文字都可能走 code=1000（Unity 端表情历史即 code=1000 + msgType=1）
                        if (extraObj.code !== 1000 && extraObj.code !== 10001) continue;
                        const msgData = typeof extraObj.data === 'string' ? JSON.parse(extraObj.data) : extraObj.data;
                        // msgType：1=表情（type 为 PropsID），2=文字，3=语音（跳过）
                        if (msgData.msgType === 1 && typeof msgData.type === 'number') {
                            history.push({
                                name: msgData.name || '',
                                content: '',
                                headUrl: msgData.headUrl || '',
                                sex: msgData.sex || 0,
                                time: TexasGameRoomDataChat.formatTimestamp(msgData.time),
                                emojiType: msgData.type
                            });
                            continue;
                        }
                        if (msgData.msgType === 3) continue;
                        if (prologue === null && msgData.is_prologue === true) {
                            prologue = msgData.message || '';
                            continue;
                        }
                        if (!msgData.message) continue;
                        history.push({
                            name: msgData.name || '',
                            content: msgData.message || '',
                            headUrl: msgData.headUrl || '',
                            sex: msgData.sex || 0,
                            time: TexasGameRoomDataChat.formatTimestamp(msgData.time)
                        });
                    } catch (e) {
                        this.tracelog.warn('parse chat extra failed:', e);
                    }
                }
                console.log('[Chat][History] 解析完成，有效消息', history, '开场白', prologue);
                this._chat.mergeHistory(history, prologue);
                this._refreshWelcome();
            },
            onFailure: () => {
                if (!cc.isValid(this.node)) return;
                this._refreshWelcome();
            }
        });
    }
    // ============================================================
    // 快捷语（HTTP 全局配置 game_quick_message_config）
    // ============================================================
    private _loadQuickMessages(): void {
        this._chatTemplateLoaded = false;
        HttpRequest.Send({
            request: WebConfigGlobalConfig,
            body: {},
            juhua: false,
            onSuccess: () => {
                if (!cc.isValid(this.node)) return;
                const cfg: any = WebConfigGlobalConfig.Response?.data;
                const messages = this._parseQuickMessages(cfg?.game_quick_message_config);
                if (messages.length === 0) return;
                this._setChatTemplates(messages);
                this._chatTemplateLoaded = true;
            }
        });
    }

    /** 兼容多种下发格式：JSON 字符串 / string[] / 多语言记录数组 / { data|list: [...] } */
    private _parseQuickMessages(raw: unknown): string[] {
        if (raw == null) return [];
        let data: unknown = raw;
        if (typeof raw === 'string') {
            const trimmed = raw.trim();
            if (trimmed.length === 0) return [];
            try {
                data = JSON.parse(trimmed);
            } catch {
                return [trimmed];
            }
        }
        if (Array.isArray(data)) {
            if (data.length > 0 && data.every(it => typeof it === 'string')) {
                return (data as string[]).filter(s => s.length > 0);
            }
            const result: string[] = [];
            for (const rec of data as QuickMessageRecord[]) {
                const text = this._pickLocalizedText(rec);
                if (text) result.push(text);
            }
            return result;
        }
        if (typeof data === 'object') {
            const inner = (data as Record<string, unknown>).data ?? (data as Record<string, unknown>).list;
            if (Array.isArray(inner)) {
                return this._parseQuickMessages(inner);
            }
        }
        return [];
    }

    private _pickLocalizedText(record: QuickMessageRecord | null | undefined): string {
        if (!record) return '';
        const source = record.multi_language && typeof record.multi_language === 'object' ? record.multi_language : record;
        const raw = source[QUICK_MESSAGE_LANG_FIELD];
        if (typeof raw === 'string' && raw.trim().length > 0) return raw;
        return typeof source.us_name === 'string' ? source.us_name : '';
    }

    private _setChatTemplates(messages: string[]): void {
        this.chatTemplateNode.removeAllChildren();
        for (const text of messages) {
            const item = cc.instantiate(this.chatItemTemplate);
            item.active = true;
            const label = item.getChildByName('chatContent')?.getComponent(cc.Label);
            if (label) label.string = text;
            item.on(cc.Node.EventType.TOUCH_END, () => this.onClickChatTemplate(text), this);
            this.chatTemplateNode.addChild(item);
        }
    }

    private onClickToggleChatTemplate(): void {
        if (!this._chatTemplateLoaded) return;
        this._chatTemplatePanelActive = !this._chatTemplatePanelActive;
        this.chatTemplateNode.active = this._chatTemplatePanelActive;
    }

    private onClickChatMode(mode: ChatMode): void {
        this._chatMode = mode;
        this._updateChatModeUI();
    }

    private _updateChatModeUI(): void {
        this._setCheckFrame(this.chatOnlyNode, this._chatMode === 'chatOnly');
        this._setCheckFrame(this.danmuAndChatNode, this._chatMode === 'danmuAndChat');
    }

    private _setCheckFrame(node: cc.Node, checked: boolean): void {
        const checkSpr = node.getChildByName('checkSpr').getComponent(cc.Sprite);
        checkSpr.spriteFrame = checked ? this._checkedFrame : this._uncheckedFrame;
    }

    /** 点击快捷语：填入输入框（不直接发送，留给用户确认/修改），并收起面板 */
    private onClickChatTemplate(text: string): void {
        this.chatEditBox.string = text;
        this._chatTemplatePanelActive = false;
        this.chatTemplateNode.active = false;
    }

    private onClickClose(): void {
        this.close();
    }
}
