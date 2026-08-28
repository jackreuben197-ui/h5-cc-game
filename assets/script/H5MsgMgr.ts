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
import ccviewData from './data/system/CCViewData';
import userStore from './data/user/UserStore';
import UserStoreUtils from './data/user/UserStoreUtils';

/** 握手超时时间（毫秒） */
const HANDSHAKE_TIMEOUT = 10000;
// ─── Bridge 协议类型 ──────────────────────────────────────────────────────
// 单一来源：@silenthill/h5-cc-bridge npm 包的 cc-side 入口（纯类型，TS 编译后被擦除，运行时不依赖该模块）。
// 包通过 tsconfig.paths 解析到 node_modules/@silenthill/h5-cc-bridge/dist/cc-side.d.ts。
// 不要在这里重新声明协议字段；要改协议先去 @silenthill/h5-cc-bridge 仓库发版，CC 端 `npm install` 即取最新类型。
// 注意：CC 端绝对不能引入 bridge 的 runtime 值（如 BRIDGE_ACTION.X 常量、createBridgeMessage 等函数），
// 否则那条 import 不会被擦除，Cocos 运行时会找不到该模块。
import type {
    H5NavigatePayload,
    H5ReadyPayload,
    H5ToCocosPayloadMap as SharedH5ToCocosPayloadMap,
    SafeArea,
    CocosToH5PayloadMap as SharedCocosToH5PayloadMap
} from '@silenthill/h5-cc-bridge/cc-side';

// CC 侧 sendToH5 接受原始 Uint8Array/ArrayBuffer，内部包装为 binary envelope；
// 共享 map 的 wsSend 是包装后的 envelope 形态（H5 接收端视角），本地覆盖一下。
export interface CocosToH5PayloadMap extends Omit<SharedCocosToH5PayloadMap, 'wsSend'> {
    wsSend: Uint8Array | ArrayBuffer;
}

export interface SyncCurrentClubPayload {
    clubId?: number;
}

export interface H5ToCocosPayloadMap extends SharedH5ToCocosPayloadMap {
    syncCurrentClub: SyncCurrentClubPayload;
}

// 把协议层 payload 类型透传出去，老调用点 `import { H5NavigatePayload } from './H5MsgMgr'` 不需要改。
export type {
    CcIndexedDBOpPayload,
    CcLocalStorageOpPayload,
    CcStorageOpPayload,
    CcStorageResultPayload,
    CcStorageSnapshotPayload,
    ClosePanelPayload,
    ClubInfo,
    CocosDialogPayload,
    CocosPanelPayload,
    CocosToastPayload,
    DialogResultPayload,
    EnterMttMatchInfo,
    EnterMttPayload,
    EnterTablePayload,
    EnterTableRoomInfo,
    H5NavigatePayload,
    H5ReadyPayload,
    H5VisibilityPayload,
    PanelEventPayload,
    SafeArea,
    SetHeartbeatModePayload,
    SyncDiamondConfigPayload,
    SyncGlobalConfigPayload,
    SyncLanguagePayload,
    SyncRoomsListPayload,
    SyncUserClubPayload,
    SyncUserClubResponse,
    SyncUserInfo,
    SyncUserPayload,
    WsClosedPayload,
    WsClosePayload,
    WsConnectPayload,
    WsErrorPayload,
    WsMessageBinaryPayload,
    WsMessagePayload,
    WsMessageTextPayload,
    WsOpenPayload,
    WsReconnectedPayload,
    WsReconnectFailedPayload,
    WsReconnectingPayload
} from '@silenthill/h5-cc-bridge/cc-side';

/**
 * @deprecated 请使用 H5NavigatePayload
 * 保留此别名以兼容存量 ProcedureReturn / LeaveNotification 引用。
 */
export type H5RouteData = H5NavigatePayload;
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
    /** H5 握手时上报的安全区信息，供全局读取。*/
    static safeArea: SafeArea = { top: 0, left: 0, right: 0, bottom: 0, source: '' };
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

    public get safeArea(): SafeArea {
        return H5MsgMgr.safeArea;
    }
    // ─── 初始化 ──────────────────────────────────────
    /**
     * 初始化 H5 Bridge 消息监听。
     * 注册 window.CocosBridge（bridge.js 直接调用），
     * 兼容 window.postMessage 和 cocos:// scheme。
     */
    init(): void {
        const self = this;
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
        this.on('h5Ready', (payload: H5ReadyPayload) => {
            this.tracelog.debug('收到 h5Ready，回复 ccAck', payload);
            if (payload?.safeArea) {
                H5MsgMgr.safeArea = payload.safeArea;
                ccviewData.setSaveareaTop(payload.safeArea.top);
            }
            if (payload.token) {
                userStore.token = payload.token;
                UserStoreUtils.updateUserInfoBasic();
            }
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
     * @returns 本次消息的 requestId，供 H5 面板事件精确回传。
     */
    public sendToH5<T extends keyof CocosToH5PayloadMap>(action: T, msgtype: number = 0, payload?: CocosToH5PayloadMap[T]): string {
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
            return msg.requestId;
        }
        // 握手未完成 → 业务消息进队列
        if (!H5MsgMgr.Instance._handshakeDone) {
            H5MsgMgr.Instance._pendingMessages.push(msg);
            this.tracelog.debug('握手未完成，消息进队列:', action);
            // 排队消息仍返回原始 requestId，面板事件不会因延迟发送而失配。
            return msg.requestId;
        }
        // 正常发送
        H5MsgMgr._post(msg);
        if (msgtype === 0) {
            this.tracelog.debug('发送 H5 层转发消息:', action);
        }
        return msg.requestId;
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
