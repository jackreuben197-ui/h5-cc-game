import { bindData, observable, pureEvent } from '../../../core/decorator/DataBind';
import { traceClass } from '../../../core/decorator/LogTrace';
import TexasGameRoomData from './TexasGameRoomData';

/** 单条聊天记录（对应 pokerqueen ChatManager.ChatMsgData）。 */
export interface TexasChatMessage {
    name: string;
    content: string;
    headUrl: string;
    sex: number;
    /** 已格式化的 HH:mm 展示时间 */
    time: string;
    /**
     * 表情消息的原始 type（Unity PropsID：500-509 免费表情 / 700-726 魔法表情）。
     * 有值则为表情消息（msgType=1），undefined 为文字消息。
     */
    emojiType?: number;
}

export interface TexasDanmuMessage {
    name: string;
    content: string;
}

/**
 * 牌桌聊天数据（对应 pokerqueen ChatManager 的缓存职责）。
 *
 * 数据来源：
 *  - 实时：GetMsg(1121) 消息层解析他人聊天后 addMessage
 *  - 本人：视图层发送后写 pendingMessage，BroadcastMsg(1019) status=0 确认后 confirmPendingMessage
 *  - 历史：UIChatDlg 通过 WebChatRoomMessageSync 拉取后 mergeHistory
 */
@bindData()
@traceClass()
export default class TexasGameRoomDataChat extends cc.EventTarget {
    public static readonly MESSAGE_ADDED = 'MESSAGE_ADDED';
    public static readonly MESSAGES_RESET = 'MESSAGES_RESET';
    public static readonly DANMU_ADDED = 'DANMU_ADDED';
    public static readonly NEW_MESSAGE_ALERT_CHANGED = 'NEW_MESSAGE_ALERT_CHANGED';
    public readonly roomData: TexasGameRoomData;
    private _messages: TexasChatMessage[] = [];
    /** 本人发送后等待服务端 1019 确认的消息 */
    private _pendingMessage: TexasChatMessage | null = null;
    private _chatDialogOpen: boolean = false;
    /** 俱乐部开场白缓存（服务端后续同步可能不再返回） */
    public prologue: string | null = null;
    @observable(TexasGameRoomDataChat.NEW_MESSAGE_ALERT_CHANGED)
    public hasNewMessageAlert: boolean = false;

    constructor(roomData: TexasGameRoomData) {
        super();
        this.roomData = roomData;
    }

    /** 当前时间的 HH:mm 展示串 */
    public static formatNowTime(): string {
        return TexasGameRoomDataChat.formatTimestamp(Date.now());
    }

    /** 时间戳（秒或毫秒）或已格式化字符串 → HH:mm */
    public static formatTimestamp(time: number | string): string {
        if (typeof time === 'string') return time;
        if (typeof time === 'number' && time > 0) {
            const ms = time > 1e12 ? time : time * 1000;
            const d = new Date(ms);
            return `${d.getHours()}`.padStart(2, '0') + ':' + `${d.getMinutes()}`.padStart(2, '0');
        }
        return '';
    }

    public get messages(): ReadonlyArray<TexasChatMessage> {
        return this._messages;
    }

    public setPendingMessage(msg: TexasChatMessage): void {
        this._pendingMessage = msg;
    }

    public setChatDialogOpen(open: boolean): void {
        this._chatDialogOpen = open;
        if (open) {
            this.hideNewMessageAlert();
        }
    }

    public hideNewMessageAlert(): void {
        this.hasNewMessageAlert = false;
    }

    /** BroadcastMsg(1019) 确认结果；status=0 时把 pending 消息落进记录 */
    public confirmPendingMessage(status: number): void {
        const pending = this._pendingMessage;
        this._pendingMessage = null;
        if (status !== 0 || !pending) return;
        this.addMessage(pending);
    }

    @pureEvent(TexasGameRoomDataChat.MESSAGE_ADDED)
    public addMessage(msg: TexasChatMessage, showAlert: boolean = false): void {
        this._messages.push(msg);
        if (showAlert && !this._chatDialogOpen) {
            this.hasNewMessageAlert = true;
        }
    }

    @pureEvent(TexasGameRoomDataChat.DANMU_ADDED)
    public addDanmu(msg: TexasDanmuMessage): void {}

    /** HTTP 历史消息合并：去重 + 按时间排序，整体重置通知 */
    @pureEvent(TexasGameRoomDataChat.MESSAGES_RESET)
    public mergeHistory(history: TexasChatMessage[], prologue: string | null): void {
        if (prologue !== null) {
            this.prologue = prologue;
        }
        for (const msg of history) {
            const dup = this._messages.some(m => m.name === msg.name && m.content === msg.content && m.time === msg.time);
            if (!dup) {
                this._messages.push(msg);
            }
        }
        this._messages.sort((a, b) => (a.time < b.time ? -1 : a.time > b.time ? 1 : 0));
    }
}
