// H5 -> Cocos：websocket 已连接。
export interface WsOpenPayload {
    url: string;
}

// H5 -> Cocos：websocket 收到消息。
export interface WsMessageTextPayload {
    dataType: 'text';
    text?: string;
}

export interface WsMessageBinaryPayload {
    dataType: 'binary';
    data?: ArrayBuffer | ArrayBufferView | Blob;
}

export type WsMessagePayload = WsMessageTextPayload | WsMessageBinaryPayload;

// H5 -> Cocos：H5/CC 握手完成通知；已有登录态时附带 token。
export interface H5ReadyPayload {
    token?: string;
    safeArea?: SafeArea;
}

export interface SafeArea {
    top: number;
    left: number;
    right: number;
    bottom: number;
    source?: string;
}

// H5 -> Cocos：websocket 错误消息。
export interface WsErrorPayload {
    message: string;
}

// H5 -> Cocos：websocket 已关闭。
export interface WsClosedPayload {
    code?: number;
    reason?: string;
    wasClean?: boolean;
}

// H5 -> Cocos：已安排一次重连尝试（attempt 从 1 开始；delayMs 是本次等待时长）。
export interface WsReconnectingPayload {
    attempt: number;
    delayMs: number;
    // 触发本次重连的来源：close=连接关闭、heartbeat=心跳超时、visibility=切回前台、online=网络恢复、force=Cocos 主动触发。
    reason: 'close' | 'heartbeat' | 'visibility' | 'online' | 'force';
}

// H5 -> Cocos：重连成功（已 onopen 并完成 REGISTER）。
export interface WsReconnectedPayload {
    url: string;
    attempt: number;
    // 从首次失败到本次成功的总耗时（毫秒）。
    durationMs: number;
}

// H5 -> Cocos：放弃重连（命中次数或整体超时）。
export interface WsReconnectFailedPayload {
    reason: 'max-attempts' | 'overall-timeout' | 'auth-invalid';
    attempts: number;
    // 累计耗时（毫秒）。
    durationMs: number;
}

export interface DialogResultPayload {
    dialogRequestId: string;
    action: 'confirm' | 'cancel' | 'close';
}

export interface PanelEventPayload {
    panelRequestId: string;
    event: string;
    payload?: unknown;
}
// 进入普通牌桌时 H5 传递的房间详情字段表（来自后端 API）。
// 这是 Cocos 端读取的"理想形态"，但 H5 端真实数据（RoomRecord 等）可能让某些字段
// 显示为 optional，所以 EnterTablePayload.roomInfo 用宽松的 unknown，CC 拿到后
// 自行断言为 EnterTableRoomInfo 再读字段。
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
    club_random_id?: number;
    tribe_id?: number;
    limit_bring_in?: number;
    anti_cheat_type?: number;
    jackpot_id?: number | string;
}
// 请求进入牌桌时发送给 Cocos 的负载。
// roomInfo 用 unknown 是为了兼容 H5 端 RoomRecord 等结构略宽松的数据源；
// Cocos 拿到后断言为 EnterTableRoomInfo 即可。
export interface EnterTablePayload {
    userName?: string;
    userId?: string;
    token: string;
    websocketPort: number;
    from?: string;
    clubId?: number;
    clubRandomId?: number;
    roomId?: string;
    roomName?: string;
    roomInfo: unknown;
}

// MTT 比赛详情字段表（来自 H5 matchInfo 字段）。CC 端断言后读取。
export interface EnterMttMatchInfo {
    match_id: number;
    type: number;
}

// 请求进入 MTT 牌桌时发送给 Cocos 的负载。
export interface EnterMttPayload {
    userName?: string;
    userId?: string;
    token?: string;
    websocketPort: number;
    from?: string;
    matchId?: number;
    matchName?: string;
    roomId?: number;
    isLookOn?: boolean;
    matchInfo: unknown;
}

// 用户信息（来自服务端 raw user 字段）。
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
// 用户信息变化后的同步负载。
// raw 是 H5 直接透传的 UserInfoData 等业务结构，类型较宽松；
// Cocos 端按 (raw as { user?: SyncUserInfo }).user 断言后读取。
export interface SyncUserPayload {
    uid?: string;
    nickname?: string;
    avatar?: string;
    raw?: unknown;
}
// 俱乐部数据项 — 列出 Cocos ClubCache 通过 getter 读取的字段。
// 完整服务端结构见 h5-game/src/api/models/org.ts → OrgClubData。
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
// H5 转发 club 接口响应（通过 action=syncUserClub 区分）。
// response 是 ApiResponse<ClubInfo[]> 形态，但为兼容 H5 端 ApiResponse<unknown> 等
// 上层泛型实参，这里宽松到 unknown，CC 端按 SyncUserClubResponse 断言后读取。
export interface SyncUserClubResponse {
    code?: number;
    message?: string;
    data?: ClubInfo[];
}

export interface SyncUserClubPayload {
    response?: unknown;
}

// H5 转发 rooms/list 请求与响应（通过 action=syncRoomsList 区分）。
export interface SyncRoomsListPayload {
    request: unknown;
    response: unknown;
}

// H5 当前语言变化同步。
export interface SyncLanguagePayload {
    locale: string;
}

// globalConfig 同步（raw 为 key → 值映射；值可以是数字、字符串或嵌套对象）。
export interface SyncGlobalConfigPayload {
    raw?: Record<string, unknown>;
}

// diamondConfig 同步（key 为 configType 数字，value 由 H5 端转换好的 typeExt -> item map）。
export interface SyncDiamondConfigPayload {
    raw?: Record<number, unknown>;
}

// Cocos 回执通用负载。
export interface CocosAckPayload {
    ok: boolean;
    message: string;
}
// H5 -> Cocos：ccStorageOp 的回包。读操作的命中值放在 value 里；
// 写操作只看 ok（成功为 true，失败时 error 给原因，如 'store_not_allowed'）。
export interface CcStorageResultPayload {
    requestId: string;
    ok: boolean;
    value?: unknown;
    error?: string;
}
// H5 -> Cocos：握手完成后把 cocos 命名空间下的 localStorage 一次性回灌。
// entries 已经把 'dzpk_cc_' 前缀去掉，Cocos 内存镜像直接以原始 key 索引。
export interface CcStorageSnapshotPayload {
    entries: Record<string, string>;
}
// ─── H5 → CC Payload 映射表 ────────────────────────────────────────────────
// 每个 H5 → CC action 字符串映射到 payload 类型，方便 CC 端 on<T>(action, cb)
// 的回调获得精确推导。
export interface H5ToCocosPayloadMap {
    // 握手
    h5Ready: H5ReadyPayload;
    h5Ack: undefined;
    // WebSocket 生命周期
    wsOpen: WsOpenPayload;
    wsMessage: WsMessagePayload;
    wsError: WsErrorPayload;
    wsClosed: WsClosedPayload;
    // 重连
    wsReconnecting: WsReconnectingPayload;
    wsReconnected: WsReconnectedPayload;
    wsReconnectFailed: WsReconnectFailedPayload;
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
