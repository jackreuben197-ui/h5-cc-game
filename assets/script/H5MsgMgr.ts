/**
 * H5MsgMgr.ts
 *
 * H5 层（Vue/Vite）与 Cocos Creator 层之间的消息桥接管理器。
 * 负责接收 H5 发来的消息并分发，以及向 H5 层发送消息。
 *
 * 握手机制：
 *   1. CC 加载完成 → 设置 window.__CC_READY__ = true
 *   2. H5 加载完成 → 发送 h5Ready 消息到 CC
 *   3. CC 收到 h5Ready → 回复 ccAck → 握手完成
 *   4. 超时未收到 → 强制放行
 *
 * msgtype 约定：
 *   CC → H5:
 *     msgtype=0 或 undefined → H5 转发（网络消息）
 *     msgtype=1              → H5 层自行处理
 *   H5 → CC:
 *     msgtype=1              → H5 层发来的指令
 *     msgtype=0 或 undefined → H5 转发的网络数据
 *
 * 使用方式：
 *   H5MsgMgr.Instance.init();                       // 初始化消息监听
 *   H5MsgMgr.Instance.startHandshake();              // 启动握手
 *   H5MsgMgr.sendToH5(action, msgtype, payload);     // 向 H5 发消息（泛型，payload 类型自动推导）
 *   H5MsgMgr.Instance.on('xxx', fn);                 // 注册消息监听
 */
import { traceClass } from './core/decorator/LogTrace';
import PacketHead from './net/websocket/PacketHead';

/** 握手超时时间（毫秒） */
const HANDSHAKE_TIMEOUT = 10000;
// ─── CC → H5 Payload 类型定义 ──────────────────────────────────────────────
// 与 h5-game/src/bridge/protocol/cocosToH5.ts 保持同步，如需新增 action，两端同步更新。
/** Cocos → H5：连接 websocket 请求。*/
export interface WsConnectPayload {
    /** 优先使用完整 URL。*/
    url?: string;
    /** 或者传端口，H5 根据模板拼接（如 wss://host{0}）。*/
    port?: number;
    /** 当前房间/比赛 ID（随连接请求一并下发，供 H5 日志参考）。*/
    roomId?: number;
    matchId?: number;
}

/** Cocos → H5：关闭 websocket 请求。*/
export interface WsClosePayload {
    code?: number;
    reason?: string;
}

/** Cocos → H5：全局 toast 提示。*/
export interface CocosToastPayload {
    /** success: 成功提示；danger: 失败/风险提示。*/
    type: 'success' | 'danger';
    message: string;
    /** 可选显示时长（毫秒）。*/
    duration?: number;
}

/** Cocos → H5：显示通用业务弹窗。*/
export interface CocosDialogPayload {
    title?: string;
    message: string;
    showCancelButton?: boolean;
    showConfirmButton?: boolean;
    cancelButtonText?: string;
    confirmButtonText?: string;
    /** 点击遮罩是否允许关闭，默认 false。*/
    closeOnClickOverlay?: boolean;
    /** 是否在展示前确保 H5 可见，默认 false。*/
    ensureVisible?: boolean;
}

/** Cocos → H5：显示面板。*/
export interface CocosPanelPayload {
    panelType: string;
    title?: string;
    /** 自定义面板渲染参数，交由对应 panelType 的组件解释。*/
    props?: Record<string, unknown>;
    /** 点击遮罩是否允许关闭，默认 true。*/
    closeOnClickOverlay?: boolean;
    ensureVisible?: boolean;
    showH5Bg?: boolean;
}

/** Cocos → H5：关闭面板。*/
export interface ClosePanelPayload {
    requestId?: string;
    panelType?: string;
}

/** Cocos → H5：控制 H5 根节点显隐。*/
export interface H5VisibilityPayload {
    /** 可选附加原因，仅用于日志。*/
    reason?: string;
}

/** Cocos → H5：路由跳转控制（与 h5-game 的 H5NavigatePayload 对齐）。*/
export interface H5NavigatePayload {
    /** 二选一：path 或 name 至少传一个。*/
    path?: string;
    name?: string;
    /** 路由参数（按 Vue Router 规范透传）。*/
    params?: Record<string, unknown>;
    query?: Record<string, unknown>;
    hash?: string;
    /** true: replace；false/undefined: push。*/
    replace?: boolean;
    /** 可选：跳转前先显示 H5 层。*/
    ensureVisible?: boolean;
}

/**
 * @deprecated 请使用 H5NavigatePayload
 * 保留此别名以兼容存量 ProcedureReturn / LeaveNotification 引用。
 */
export type H5RouteData = H5NavigatePayload;
// ─── CC → H5 Payload 映射表 ────────────────────────────────────────────────
// sendToH5<T>(action, msgtype, payload) 通过 T 自动推导 payload 的精确类型。
// 如需新增 action，同步更新：h5-game/src/bridge/protocol/cocosToH5.ts → CocosToH5PayloadMap
export interface CocosToH5PayloadMap {
    // 握手（无 payload）
    ccReady: undefined;
    ccAck: undefined;
    // WebSocket 代理（wsSend 走 msgtype=0；其余走 msgtype=1）
    wsConnect: WsConnectPayload;
    /**
     * 传入 Uint8Array 或 ArrayBuffer，sendToH5 内部自动包装为
     * { dataType:'binary', data: Uint8Array } 后发送给 H5。
     */
    wsSend: Uint8Array | ArrayBuffer;
    wsClose: WsClosePayload;
    // UI 控制
    showToast: CocosToastPayload;
    showDialog: CocosDialogPayload;
    showPanel: CocosPanelPayload;
    closePanel: ClosePanelPayload;
    // H5 显隐
    h5Hide: H5VisibilityPayload | undefined;
    h5Show: H5VisibilityPayload | undefined;
    // 路由跳转
    h5Navigate: H5NavigatePayload;
}
// ─── H5 → CC Payload 类型定义 ──────────────────────────────────────────────
// 与 h5-game/src/bridge/protocol/h5ToCocos.ts 保持同步，如需新增 action，两端同步更新。
/** H5 → CC：websocket 已连接。*/
export interface WsOpenPayload {
    url: string;
}

/** H5 → CC：websocket 收到二进制数据。*/
export interface WsMessageBinaryPayload {
    dataType: 'binary';
    /** structured clone 传递，到 CC 层时为 ArrayBuffer 或 Uint8Array。*/
    data?: ArrayBuffer | Uint8Array;
}

/** H5 → CC：websocket 收到文本数据。*/
export interface WsMessageTextPayload {
    dataType: 'text';
    text?: string;
}

export type WsMessagePayload = WsMessageBinaryPayload | WsMessageTextPayload;

/** H5 → CC：websocket 发生错误。*/
export interface WsErrorPayload {
    message: string;
}

/** H5 → CC：websocket 已关闭。*/
export interface WsClosedPayload {
    code?: number;
    reason?: string;
    wasClean?: boolean;
}

/** H5 → CC：对话框操作结果。*/
export interface DialogResultPayload {
    dialogRequestId: string;
    action: 'confirm' | 'cancel' | 'close';
}

/** H5 → CC：面板内部事件。*/
export interface PanelEventPayload {
    panelRequestId: string;
    event: string;
    payload?: unknown;
}

/** 进入普通牌桌的房间详情（来自 H5 roomInfo 字段，对应后端 API 结构）。*/
export interface EnterTableRoomInfo {
    rid: number;
    name?: string;
    room_type: number;
    game_type: number;
    poker_type: number;
    limit_bet_type?: number;
    seat_count: number;
    service_id?: string | number;
    straddle_on?: number;
    insurance_on?: number;
    muck_on?: number;
    origin_type?: number;
    share_table?: number;
    gold_type?: number;
    club_id?: number;
    tribe_id?: number;
    limit_bring_in?: number;
    anti_cheat_type?: number;
    jackpot_id?: number | string;
}

/** H5 → CC：进入普通牌桌。*/
export interface EnterTablePayload {
    token: string;
    websocketPort: number;
    from?: string;
    roomId?: string;
    roomName?: string;
    roomInfo: EnterTableRoomInfo;
}

/** MTT 比赛详情（来自 H5 matchInfo 字段）。*/
export interface EnterMttMatchInfo {
    match_id: number;
    type: number;
}

/** H5 → CC：进入 MTT 牌桌。*/
export interface EnterMttPayload {
    token?: string;
    websocketPort: number;
    from?: string;
    matchId?: number;
    matchName?: string;
    roomId?: number;
    isLookOn?: boolean;
    matchInfo: EnterMttMatchInfo;
}

/** 用户信息（来自服务端 raw user 字段）。*/
export interface SyncUserInfo {
    un_id: number | string;
    p_u_id?: number | string;
    phone?: string;
    sex?: number;
    nickname?: string;
    avatar?: string;
    ut?: number;
    club_id?: number;
}

/** H5 → CC：同步用户信息。*/
export interface SyncUserPayload {
    uid?: string;
    nickname?: string;
    avatar?: string;
    raw?: {
        user?: SyncUserInfo;
    };
}

/**
 * 俱乐部数据项 — 仅列出 ClubCache 实际通过 getter 读取的字段。
 * 完整服务端结构见 h5-game/src/api/models/org.ts → OrgClubData。
 */
export interface ClubInfo {
    club_id: number;
    club_name: string;
    logo?: string;
    random_id?: number;
    upper_limit?: number;
    club_members?: number;
    area_id?: string;
    club_type?: number;
    create_time?: string;
    is_official?: number;
    club_status?: number;
    desc?: string;
    contact_info?: unknown;
    member_type?: number;
    more_contact?: string;
    level?: number;
    search_switch?: number;
    auto_audit_switch?: number;
    show_contact_switch?: number;
    club_creator_random_id?: number;
    club_creator_avatar?: string;
    club_creator_nickname?: string;
    tribe_name?: string;
    tribe_id?: number;
    tribe_logo?: string;
    tribe_random_id?: number;
    user_level?: number;
    players?: number;
    tables?: number;
    show_notice_switch?: number;
    gold_to_usdt_rate?: number;
    usdt_to_gold_rate?: number;
    digital_wallet_switch?: number;
    digital_wallet_erc?: string;
    digital_wallet_trc?: string;
}

/** H5 → CC：同步俱乐部列表（response 对齐服务端 /user/club/list 响应结构）。*/
export interface SyncUserClubPayload {
    response?: {
        code?: number;
        message?: string;
        data?: ClubInfo[];
    };
}

/** H5 → CC：同步房间列表。*/
export interface SyncRoomsListPayload {
    request?: unknown;
    response?: unknown;
}

/** H5 → CC：同步当前语言。*/
export interface SyncLanguagePayload {
    locale: string;
}

/**
 * H5 → CC：同步全局配置。
 * raw 为 key → 值映射；值可以是数字、字符串或复杂对象（如 anti_cheat_video_config 为 JSON 字符串）。
 * Cocos 侧按需判断类型后读取（如 typeof val === 'string' ? JSON.parse(val) : val）。
 */
export interface SyncGlobalConfigPayload {
    raw?: Record<string, unknown>;
}

/** H5 → CC：同步钻石配置（key 为 configType 数字）。*/
export interface SyncDiamondConfigPayload {
    raw?: Record<number, unknown>;
}
// ─── H5 → CC Payload 映射表 ────────────────────────────────────────────────
// on<T>(action, callback) 通过 T 自动推导回调 payload 的精确类型。
// 如需新增 action，同步更新：h5-game/src/bridge/protocol/h5ToCocos.ts
export interface H5ToCocosPayloadMap {
    // 握手
    h5Ready: undefined;
    h5Ack: undefined;
    // WebSocket 生命周期（H5 代理后上报）
    wsOpen: WsOpenPayload;
    wsMessage: WsMessagePayload;
    wsError: WsErrorPayload;
    wsClosed: WsClosedPayload;
    // UI 回调
    dialogResult: DialogResultPayload;
    panelEvent: PanelEventPayload;
    // 进桌
    enterTable: EnterTablePayload;
    enterMtt: EnterMttPayload;
    exitTable: unknown;
    // 数据同步
    syncUser: SyncUserPayload;
    syncUserClub: SyncUserClubPayload;
    syncRoomsList: SyncRoomsListPayload;
    syncLanguage: SyncLanguagePayload;
    syncGlobalConfig: SyncGlobalConfigPayload;
    syncDiamondConfig: SyncDiamondConfigPayload;
}
// ─── 内部类型 ───────────────────────────────────────────────────────────────
/** wsSend 包装后的二进制信封（仅在 _post 路径内使用）。*/
interface WsSendBinaryEnvelope {
    dataType: 'binary';
    data: Uint8Array;
}

/**
 * 实际写入 BridgeRawMessage.payload 的类型：
 * wsSend 时为包装后的二进制信封，其余 action 直接透传原始 payload。
 */
type OutgoingPayload = WsSendBinaryEnvelope | Exclude<CocosToH5PayloadMap[keyof CocosToH5PayloadMap], Uint8Array | ArrayBuffer>;

/** CC 向 H5 发送的消息信封结构。*/
interface BridgeRawMessage {
    action: string;
    msgtype: number;
    payload: OutgoingPayload;
    source: 'cc';
    requestId: string;
    timestamp: number;
}

/** H5 发来的消息信封结构（字段均为可选，由 _onMessage* 解析时校验）。*/
interface IncomingEnvelope {
    action?: string;
    source?: string;
    msgtype?: number;
    payload?: unknown;
}

/** H5 → CC 监听器回调签名。payload 具体类型由业务层自行断言。*/
export type H5MessageCallback = (payload: unknown, msgtype?: number) => void;

// ─── Window 全局扩展 ──────────────────────────────────────────────────────────
declare global {
    interface Window {
        /** bridge.js 注入的直连通道，H5 通过它向 CC 传递消息。*/
        CocosBridge?: {
            postMessage: (data: IncomingEnvelope | string) => void;
        };
        /** CC 就绪标志，H5 读取后决定是否发送 h5Ready。*/
        __CC_READY__?: boolean;
    }
}
// ─── 工具函数 ─────────────────────────────────────────────────────────────────
/** 判断 payload 是否为 H5 发来的 text 包装格式。*/
function isTextEnvelope(value: unknown): value is { dataType: 'text'; text: string } {
    if (!value || typeof value !== 'object') return false;
    const v = value as Record<string, unknown>;
    return v['dataType'] === 'text' && typeof v['text'] === 'string';
}

/** 判断 OutgoingPayload 是否为二进制信封，用于决定 postMessage 传递方式。*/
function isBinaryEnvelope(payload: OutgoingPayload): payload is WsSendBinaryEnvelope {
    return typeof payload === 'object' && payload !== null && (payload as { dataType?: string })['dataType'] === 'binary';
}

// ─── H5MsgMgr ────────────────────────────────────────────────────────────────
@traceClass()
class H5MsgMgr {
    private static _instance: H5MsgMgr = null;
    static get Instance(): H5MsgMgr {
        if (!H5MsgMgr._instance) {
            H5MsgMgr._instance = new H5MsgMgr();
        }
        return H5MsgMgr._instance;
    }
    /** 消息监听器表: action → callback(payload, msgtype) */
    private _listeners: Record<string, H5MessageCallback> = {};
    /** 握手是否完成 */
    private _handshakeDone: boolean = false;
    /** 握手前缓存的消息队列 */
    private _pendingMessages: BridgeRawMessage[] = [];
    /** 握手超时定时器 */
    private _handshakeTimer: number = null;

    private constructor() {}
    // ─── 初始化 ──────────────────────────────────────
    /**
     * 初始化 H5 Bridge 消息监听。
     * 注册 window.CocosBridge（bridge.js 直接调用），
     * 兼容 window.postMessage 和 cocos:// scheme。
     */
    init(): void {
        const self = this;
        this.tracelog.debug('PackHead Init(encode/decode)');
        // 方式1：bridge.js 检测到 window.CocosBridge 后直接调用。
        // H5 现在直接传 JSON 对象，兼容旧版字符串。
        window.CocosBridge = {
            postMessage: (data: IncomingEnvelope | string) => {
                if (typeof data === 'string') {
                    self._onMessage(data);
                } else {
                    self._onMessageObj(data);
                }
            }
        };
        this.tracelog.debug;
        this.tracelog.debug('window.CocosBridge 已注册');
        // 方式2：监听 window.postMessage
        window.addEventListener('message', (e: MessageEvent<unknown>) => {
            const data: unknown = e.data;
            if (!data) return;
            // H5 直接 postMessage 对象（structured clone，可能含二进制 payload）
            if (typeof data === 'object' && data !== null && (data as IncomingEnvelope).source === 'h5') {
                self._onMessageObj(data as IncomingEnvelope);
                return;
            }
            // 兼容旧版 JSON 字符串
            if (typeof data === 'string' && data.includes('action')) {
                self._onMessage(data);
            }
        });
        this.tracelog.debug('消息监听已初始化');
    }
    // ─── 握手机制 ──────────────────────────────────────
    /**
     * 启动握手流程：
     * 1. 设置 window.__CC_READY__ = true
     * 2. 注册 h5Ready 监听 → 收到后回复 ccAck → 握手完成
     * 3. 超时未收到 → 强制放行
     */
    startHandshake(): void {
        // H5 主动发来 h5Ready → CC 回复 ccAck
        this.on('h5Ready', () => {
            this.tracelog.debug('收到 h5Ready，回复 ccAck');
            this.sendToH5('ccAck', 1);
            this._completeHandshake();
        });
        // H5 收到 ccReady 后回复的 h5Ack
        this.on('h5Ack', () => {
            this.tracelog.debug('收到 h5Ack');
            this._completeHandshake();
        });
        // 设置 CC 就绪标志
        window.__CC_READY__ = true;
        this.tracelog.debug('__CC_READY__ 已设置');
        // 如果握手尚未完成，发送 ccReady 通知 H5
        // （sendToH5 可能同步触发 H5 回调完成握手，所以 log 放在发送前）
        if (!this._handshakeDone) {
            this.tracelog.debug('发送 ccReady，等待 H5 回复 h5Ack 或 h5Ready');
            this.sendToH5('ccReady', 1);
        } else {
            this.tracelog.debug('握手已通过 h5Ready 完成，跳过发送 ccReady');
        }
        // 握手已完成则无需超时
        if (this._handshakeDone) return;
        // 超时保护
        this._handshakeTimer = window.setTimeout(() => {
            if (!this._handshakeDone) {
                this.tracelog.warn('握手超时，强制放行');
                this._completeHandshake();
            }
        }, HANDSHAKE_TIMEOUT);
    }

    /** 标记握手完成，清理定时器，flush 消息队列 */
    private _completeHandshake(): void {
        if (this._handshakeDone) return;
        this._handshakeDone = true;
        this.tracelog.debug('握手完成');
        // 清理定时器
        if (this._handshakeTimer) {
            clearTimeout(this._handshakeTimer);
            this._handshakeTimer = null;
        }
        // 发送握手前缓存的消息
        this._flushPendingMessages();
    }

    /** 逐条发送缓存的消息 */
    private _flushPendingMessages(): void {
        const msgs = this._pendingMessages.splice(0);
        if (msgs.length === 0) return;
        this.tracelog.debug(`发送 ${msgs.length} 条缓存消息`);
        for (const msg of msgs) {
            H5MsgMgr._post(msg);
        }
    }

    /** 握手是否已完成 */
    get handshakeDone(): boolean {
        return this._handshakeDone;
    }
    // ─── 接收消息 ─────────────────────────────────────
    /**
     * 处理从 H5 层收到的原始 JSON 字符串。
     * 消息格式: { action, payload, msgtype, requestId, timestamp }
     */
    private _onMessage(rawData: string): void {
        try {
            let jsonStr = rawData;
            // 兼容 cocos:// scheme 包裹
            if (jsonStr.startsWith('cocos://')) {
                const match = jsonStr.match(/data=([^&]+)/);
                if (match) jsonStr = decodeURIComponent(match[1]);
            }
            const parsed: unknown = JSON.parse(jsonStr);
            if (!parsed || typeof parsed !== 'object') return;
            const msg = parsed as IncomingEnvelope;
            if (!msg.action) return;
            // 忽略自己发出的回声（postMessage 同 window 自己也会收到）
            if (msg.source === 'cc') return;
            const msgtype = msg.msgtype;
            this.tracelog.debug('收到消息:', msg.action, 'msgtype:', msgtype, 'msgContent:' + rawData);
            // 分发给注册的监听器
            const fn = this._listeners[msg.action];
            if (fn) {
                fn(msg.payload, msgtype);
            } else {
                this.tracelog.debug('未处理的消息:', msg.action, 'msgtype:', msgtype);
            }
        } catch (e) {
            this.tracelog.warn('消息解析失败:', rawData, e);
        }
    }

    /**
     * 处理从 H5 层收到的对象消息（structured clone 传递，可能含二进制 payload）。
     * 消息格式: { source: 'h5', action, msgtype, payload }
     *   payload 可能是:
     *     - { dataType: 'binary', data: ArrayBuffer } — 二进制（如 wsMessage）
     *     - { dataType: 'text', text: string }         — 文本 JSON
     *     - 普通对象                                    — 直接使用
     */
    private _onMessageObj(msg: IncomingEnvelope): void {
        try {
            if (!msg.action) return;
            const msgtype = msg.msgtype;
            let payload: unknown = msg.payload;
            // text 类型：解析 JSON 字符串为对象
            if (isTextEnvelope(payload)) {
                try {
                    payload = JSON.parse(payload.text) as unknown;
                } catch {
                    // 解析失败则保留原始文本
                }
            }
            // binary 类型：payload.data 就是 ArrayBuffer，直接传递给监听器
            // （dataType === 'binary' 时不做任何转换，监听器自行处理 .data）
            this.tracelog.debug('收到消息(obj):', msg.action, 'msgtype:', msgtype);
            const fn = this._listeners[msg.action];
            if (fn) {
                fn(payload, msgtype);
            } else {
                this.tracelog.debug('未处理的消息:', msg.action, 'msgtype:', msgtype);
            }
        } catch (e) {
            this.tracelog.warn('消息对象处理失败:', e);
        }
    }
    // ─── 发送消息 ─────────────────────────────────────
    /**
     * 向 H5 层发送消息（泛型版本，payload 类型由 action 自动推导）
     *
     * @param action  消息类型（keyof CocosToH5PayloadMap，IDE 可补全）
     * @param msgtype 0=转发/网络消息（默认），1=H5 层自行处理
     * @param payload 数据（类型由 action 决定）
     *
     * 特殊处理：
     * - wsSend 传入 Uint8Array / ArrayBuffer → 自动包装为 { dataType:'binary', data: Uint8Array }
     * - ccAck / ccReady 等握手消息不受队列限制，直接发送
     * - 握手完成前的业务消息进队列，握手完成后统一发送
     */
    public sendToH5<T extends keyof CocosToH5PayloadMap>(action: T, msgtype: number = 0, payload?: CocosToH5PayloadMap[T]): void {
        // 二进制 payload 包装为 WsSendBinaryEnvelope，其余直接透传。
        // rawPayload 用 unknown 接收，再通过 instanceof 收窄，避免使用 any。
        const rawPayload: unknown = payload;
        let finalPayload: OutgoingPayload;
        if (rawPayload instanceof Uint8Array) {
            finalPayload = { dataType: 'binary', data: rawPayload };
        } else if (rawPayload instanceof ArrayBuffer) {
            finalPayload = { dataType: 'binary', data: new Uint8Array(rawPayload) };
        } else {
            // rawPayload 已排除 Uint8Array / ArrayBuffer，
            // 剩余类型均为 CocosToH5PayloadMap 中的可序列化 payload，
            // 与 OutgoingPayload 的非二进制分支完全对应。
            finalPayload = rawPayload as OutgoingPayload;
        }
        const msg: BridgeRawMessage = {
            action,
            msgtype,
            payload: finalPayload,
            source: 'cc',
            requestId: `cocos_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
            timestamp: Date.now()
        };
        // 握手消息（ccReady / ccAck）立即发送，不走队列
        if (action === 'ccReady' || action === 'ccAck') {
            H5MsgMgr._post(msg);
            return;
        }
        // 握手未完成 → 业务消息进队列
        if (!H5MsgMgr.Instance._handshakeDone) {
            H5MsgMgr.Instance._pendingMessages.push(msg);
            this.tracelog.debug('握手未完成，消息进队列:', action);
            return;
        }
        // 正常发送
        H5MsgMgr._post(msg);
        if (msgtype === 0) {
            this.tracelog.debug('发送 H5 层转发消息:', action);
        }
    }

    /**
     * 通过 postMessage 发送消息到 H5 层。
     *
     * - 普通消息（非二进制）：JSON.stringify → H5 监听器的 string 分支
     * - 二进制消息（payload.dataType='binary'）：
     *   直接传对象，利用 structured clone 让 Uint8Array 原样到达 H5
     */
    private static _post(msg: BridgeRawMessage): void {
        setTimeout(() => {
            if (isBinaryEnvelope(msg.payload)) {
                window.postMessage(msg, '*');
            } else {
                window.postMessage(JSON.stringify(msg), '*');
            }
        }, 0);
    }
    // ─── 监听器注册 ───────────────────────────────────
    /**
     * 注册 H5 消息监听（泛型重载）。
     *
     * 已知 action：payload 类型由 H5ToCocosPayloadMap 自动推导，回调参数有完整类型提示。
     * 未知 action：payload 为 unknown，业务层自行断言。
     *
     * @param action   消息类型（'enterTable' / 'wsMessage' 等，IDE 可补全）
     * @param callback 收到消息时的回调，第二个参数为 msgtype
     */
    on<T extends keyof H5ToCocosPayloadMap>(action: T, callback: (payload: H5ToCocosPayloadMap[T], msgtype?: number) => void): void;

    on(action: string, callback: H5MessageCallback): void;

    on(action: string, callback: H5MessageCallback): void {
        this._listeners[action] = callback;
    }

    /**
     * 移除 H5 消息监听
     */
    off(action: string): void {
        delete this._listeners[action];
    }
}

const h5MessageManager = H5MsgMgr.Instance;

export default h5MessageManager;
