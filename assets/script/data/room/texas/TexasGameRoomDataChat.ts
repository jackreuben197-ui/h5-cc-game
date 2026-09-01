import { bindData, observable, pureEvent } from '../../../core/decorator/DataBind';
import { traceClass } from '../../../core/decorator/LogTrace';
import TexasGameRoomData from './TexasGameRoomData';

/** 单条聊天记录（对应 pokerqueen ChatManager.ChatMsgData）。 */
export interface TexasChatMessage {
    id?: number;
    userID?: number;
    name: string;
    content: string;
    headUrl: string;
    sex: number;
    timestamp: number;
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
 */
@bindData()
@traceClass()
export default class TexasGameRoomDataChat extends cc.EventTarget {
    public static readonly MESSAGE_ADDED = 'MESSAGE_ADDED';
    public static readonly HISTORY_PAGE_MERGED = 'HISTORY_PAGE_MERGED';
    public static readonly HISTORY_RESET = 'HISTORY_RESET';
    public static readonly DANMU_ADDED = 'DANMU_ADDED';
    public static readonly NEW_MESSAGE_ALERT_CHANGED = 'NEW_MESSAGE_ALERT_CHANGED';
    public readonly roomData: TexasGameRoomData;
    private _messages: TexasChatMessage[] = [];
    /** 本人发送后等待服务端 1019 确认的消息 */
    private _pendingMessage: TexasChatMessage | null = null;
    private _chatDialogOpen: boolean = false;
    private _historyInitialized: boolean = false;
    private _historyLoading: boolean = false;
    private _hasMoreHistory: boolean = true;
    private _oldestHistoryID: number | null = null;
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

    public static normalizeTimestamp(time: number | string): number {
        if (typeof time === 'number' && Number.isFinite(time) && time > 0) {
            return time > 1e12 ? time : time * 1000;
        }
        if (typeof time === 'string' && time.length > 0) {
            const numeric = Number(time);
            if (Number.isFinite(numeric) && numeric > 0) {
                return numeric > 1e12 ? numeric : numeric * 1000;
            }
            const parsed = Date.parse(time);
            return Number.isFinite(parsed) ? parsed : 0;
        }
        return 0;
    }

    /** 时间戳（秒或毫秒）或已格式化字符串 → HH:mm */
    public static formatTimestamp(time: number | string): string {
        const ms = TexasGameRoomDataChat.normalizeTimestamp(time);
        if (ms > 0) {
            const d = new Date(ms);
            return `${d.getHours()}`.padStart(2, '0') + ':' + `${d.getMinutes()}`.padStart(2, '0');
        }
        return typeof time === 'string' ? time : '';
    }

    public get messages(): ReadonlyArray<TexasChatMessage> {
        return this._messages;
    }
    public get historyInitialized(): boolean {
        return this._historyInitialized;
    }
    public get historyLoading(): boolean {
        return this._historyLoading;
    }
    public get hasMoreHistory(): boolean {
        return this._hasMoreHistory;
    }
    public get oldestHistoryID(): number | null {
        return this._oldestHistoryID;
    }

    public beginHistoryLoad(loadOlder: boolean): boolean {
        if (this._historyLoading) return false;
        if (loadOlder) {
            if (!this._historyInitialized || !this._hasMoreHistory || this._oldestHistoryID === null) return false;
        } else if (this._historyInitialized) {
            return false;
        }
        this._historyLoading = true;
        return true;
    }

    public failHistoryLoad(): void {
        this._historyLoading = false;
    }

    public resetHistory(): void {
        this._messages.length = 0;
        this._pendingMessage = null;
        this._historyInitialized = false;
        this._historyLoading = false;
        this._hasMoreHistory = true;
        this._oldestHistoryID = null;
        this.prologue = null;
        this.hasNewMessageAlert = false;
        this._notifyHistoryReset();
    }

    @pureEvent(TexasGameRoomDataChat.HISTORY_RESET)
    private _notifyHistoryReset(): void {}

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

    public addMessage(msg: TexasChatMessage, showAlert: boolean = false): void {
        if (this._messages.some(current => this._isSameMessage(current, msg))) return;
        this._messages.push(msg);
        if (showAlert && !this._chatDialogOpen) {
            this.hasNewMessageAlert = true;
        }
        this._notifyMessageAdded(msg);
    }

    @pureEvent(TexasGameRoomDataChat.MESSAGE_ADDED)
    private _notifyMessageAdded(msg: TexasChatMessage): void {}

    @pureEvent(TexasGameRoomDataChat.DANMU_ADDED)
    public addDanmu(msg: TexasDanmuMessage): void {}

    public mergeHistoryPage(history: TexasChatMessage[], prologue: string | null, pageOldestID: number | null, hasMore: boolean, initial: boolean): void {
        const previousOldestID = this._oldestHistoryID;
        if (prologue !== null) {
            this.prologue = prologue;
        }
        const added: TexasChatMessage[] = [];
        for (const msg of history) {
            if (!this._messages.some(current => this._isSameMessage(current, msg))) {
                this._messages.push(msg);
                added.push(msg);
            }
        }
        this._messages.sort(TexasGameRoomDataChat._compareMessage);
        added.sort(TexasGameRoomDataChat._compareMessage);
        this._historyLoading = false;
        this._historyInitialized = true;
        if (pageOldestID !== null) {
            this._oldestHistoryID = previousOldestID === null ? pageOldestID : Math.min(previousOldestID, pageOldestID);
        }
        const cursorAdvanced = initial || (pageOldestID !== null && (previousOldestID === null || pageOldestID < previousOldestID));
        this._hasMoreHistory = hasMore && pageOldestID !== null && cursorAdvanced;
        this._notifyHistoryPageMerged(added, initial);
    }

    @pureEvent(TexasGameRoomDataChat.HISTORY_PAGE_MERGED)
    private _notifyHistoryPageMerged(added: TexasChatMessage[], initial: boolean): void {}

    private _isSameMessage(a: TexasChatMessage, b: TexasChatMessage): boolean {
        if (a.id !== undefined && b.id !== undefined) {
            return a.id === b.id;
        }
        if (a.timestamp <= 0 || b.timestamp <= 0 || a.timestamp !== b.timestamp) return false;
        return a.userID === b.userID && a.content === b.content && a.emojiType === b.emojiType;
    }

    private static _compareMessage(a: TexasChatMessage, b: TexasChatMessage): number {
        if (a.timestamp !== b.timestamp) return a.timestamp - b.timestamp;
        if (a.id !== undefined && b.id !== undefined) return a.id - b.id;
        return 0;
    }
}
