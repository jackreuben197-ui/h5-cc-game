/**
 * MainUtils — 从 Main.ts 拆出的辅助功能
 *
 * 包含：SDK 动态加载、遮挡层刷新、H5 消息桥接、
 *       enterTable 数据校验与 GameCache 写入
 */
import { GameConfig } from './config/GameConfig';
import { createLogger } from './core/decorator/LogTrace';
import userStore from './data/user/UserStore';
import ProcedureDefine from './game/procedure/ProcedureDefine';
import ProcedureManager from './game/procedure/ProcedureManager';
import roomReconnectManager from './game/RoomReconnectManager';
import h5MessageManager, { EnterMttMatchInfo, EnterTableRoomInfo, SyncUserClubResponse, SyncUserInfo } from './H5MsgMgr';
import agoraManager from './net/agora/AgoraManager';
import ProtocolAgency from './net/websocket/ProtocolAgency';

const _ploger = createLogger('[MainUtils]');
// ==================== SDK 动态加载 ====================
/**
 * 动态加载 Web 层第三方 SDK
 * 预览和构建通用，不依赖 HTML 模板
 */
export function loadWebSDK(): void {
    if (!GameConfig.enableAgora) {
        _ploger.info('[WebSDK] 声网已禁用（enableAgora=false），跳过加载');
        return;
    }
    const sdkList = [{ name: 'AgoraRTC', src: 'https://download.agora.io/sdk/release/AgoraRTC_N-4.24.5.js' }];
    sdkList.forEach(sdk => {
        if ((window as unknown as Record<string, unknown>)[sdk.name]) {
            _ploger.info(`[WebSDK] ${sdk.name} 已存在，跳过加载`);
            return;
        }
        const script = document.createElement('script');
        script.src = sdk.src;
        script.charset = 'utf-8';
        script.onload = () => {
            _ploger.info(`[WebSDK] ${sdk.name} 声网sdk加载完成`);
            if (sdk.name === 'AgoraRTC') {
                agoraManager.ensureReadySDK(GameConfig.agoraKey, 3000);
            }
        };
        script.onerror = () => {
            _ploger.error(`[WebSDK] ${sdk.name} 声网sdk加载失败: ${sdk.src}`);
        };
        document.head.appendChild(script);
    });
}
// ==================== UI 辅助 ====================
/** 刷新左右遮挡层宽度，使其覆盖屏幕外区域 */
export function refreshDiss(dissNode: cc.Node): void {
    let l_mask = dissNode.getChildByName('l_mask');
    let r_mask = dissNode.getChildByName('r_mask');
    l_mask.width = cc.view.getVisibleSize().width;
    r_mask.width = cc.view.getVisibleSize().width;
}
// ==================== H5 桥接：enterTable ====================
/** enterTable 必需字段定义 */
const ENTER_TABLE_REQUIRED: { key: string; label: string; type: string }[] = [
    { key: 'nUserId', label: '用户ID', type: 'number' },
    { key: 'nick', label: '昵称', type: 'string' },
    { key: 'headPic', label: '头像', type: 'string' },
    { key: 'sex', label: '性别', type: 'number' },
    { key: 'gold', label: '金豆余额', type: 'number' },
    { key: 'game_enter_type', label: '进入类型', type: 'number' },
    { key: 'isLookOn', label: '是否观战', type: 'boolean' },
    { key: 'room_type', label: '房间类型', type: 'number' },
    { key: 'room_id', label: '房间号', type: 'number' },
    { key: 'roomName', label: '房间名称', type: 'string' },
    { key: 'game_type', label: '游戏类型', type: 'number' },
    { key: 'poker_type', label: '牌类型', type: 'number' },
    { key: 'bet_type', label: '下注类型', type: 'number' },
    { key: 'seat_count', label: '座位数', type: 'number' },
    { key: 'match_id', label: 'MTT比赛ID', type: 'number' },
    { key: 'service_id', label: '服务器ID', type: 'string' },
    { key: 'carry_small', label: '最小带入', type: 'number' }
];

/**
 * 校验 enterTable 数据完整性
 * 返回缺失/类型不匹配的字段列表
 */
export function validateEnterTableData(payload: unknown): { key: string; label: string; type: string; actual: string }[] {
    if (!payload || typeof payload !== 'object') {
        return ENTER_TABLE_REQUIRED.map(f => ({ ...f, actual: 'undefined' }));
    }
    const obj = payload as Record<string, unknown>;
    const missing: { key: string; label: string; type: string; actual: string }[] = [];
    for (const field of ENTER_TABLE_REQUIRED) {
        const val = obj[field.key];
        if (val === undefined || val === null) {
            missing.push({ ...field, actual: 'undefined' });
        } else if (field.type === 'number' && typeof val !== 'number') {
            missing.push({ ...field, actual: typeof val });
        } else if (field.type === 'string' && typeof val !== 'string') {
            missing.push({ ...field, actual: typeof val });
        } else if (field.type === 'boolean' && typeof val !== 'boolean') {
            missing.push({ ...field, actual: typeof val });
        }
    }
    return missing;
}

/** 旧版平铺格式 enterTable 数据（兼容存量接口，字段直接平铺在 payload 上）。*/
interface FlatEnterTableData {
    nUserId: number;
    nick: string;
    headPic: string;
    sex: number;
    gold: number;
    room_type: number;
    room_id: number;
    roomName: string;
    game_type: number;
    poker_type: number;
    bet_type: number;
    seat_count: number;
    match_id: number;
    service_id: string;
    carry_small: number;
    straddle?: number;
    insurance?: number;
    muck_switch?: number;
    club_id?: number;
    origin_type?: number;
    gold_type?: number;
}
// ==================== H5 消息监听注册 ====================
/** 注册 H5 桥接消息（enterTable / exitTable / syncUser） */
export async function registerH5Listeners(): Promise<void> {
    // H5 桥接模式下，提前完成数据层初始化（含 i18n），避免跳过大厅导致懒初始化未执行
    // await initH5BridgeDependencies();
    // initH5BridgeDependencies();
    h5MessageManager.on('enterTable', async payload => {
        _ploger.info('[H5Bridge] 收到 enterTable:', payload);
        // bridge 协议 roomInfo 为 unknown（兼容 H5 端较宽松的 RoomRecord），
        // 这里断言为 EnterTableRoomInfo 后读字段；运行时数据由 H5 保证字段齐全。
        const { token, websocketPort, roomId } = payload;
        const roomData = payload.roomInfo as EnterTableRoomInfo;
        // === 1. H5 消息基本字段校验 ===
        const missing: string[] = [];
        if (!token) missing.push('token');
        if (!websocketPort) missing.push('websocketPort');
        if (!roomId) missing.push('roomId');
        if (missing.length > 0) {
            _ploger.error('[H5Bridge] enterTable 缺少必要字段:', missing.join(', '));
            return;
        }
        // === 2. 从缓存查找房间详情（syncRoomsList 缓存的数据） ===
        // const roomIdNum = Number(roomId);
        // const cachedRooms = GC.data.lobby.roomList.getList(false);
        // const cachedClubRooms = GC.data.lobby.roomList.getList(true);
        // const targetItem = [...cachedRooms, ...cachedClubRooms].find(r => r.rid === roomIdNum);
        // if (!targetItem) {
        //     _ploger.error('[H5Bridge] enterTable 未在缓存房间列表中找到房间:', roomId, '请确认 syncRoomsList 已送达');
        //     return;
        // }
        // 原始房间数据 TRoomListItem
        // const roomData = (targetItem as any)._data;
        // === 3. 进入牌桌所需数据完整性校验 ===
        const requiredForEnter: { key: string; val: unknown }[] = [
            { key: 'room_type', val: roomData.room_type },
            { key: 'game_type', val: roomData.game_type },
            { key: 'poker_type', val: roomData.poker_type },
            { key: 'seat_count', val: roomData.seat_count },
            { key: 'rid', val: roomData.rid }
        ];
        const incomplete = requiredForEnter.filter(f => f.val === undefined || f.val === null);
        if (incomplete.length > 0) {
            _ploger.error('[H5Bridge] enterTable 房间缓存数据不完整，缺少:', incomplete.map(f => f.key).join(', '));
            return;
        }
        // === 4. 设置 Token（WS 由 H5 层代理，CC 层不直接连接） ===
        userStore.token = token;
        //LoginSession.Token = token;
        // === 5. 填充 GameCache（从缓存房间数据） ===
        // const gc = GameCache.Instance;
        // gc.room_id = roomData.rid;
        // gc.roomName = roomData.name;
        // gc.room_type = roomData.room_type;
        // gc.game_type = roomData.game_type;
        // gc.poker_type = roomData.poker_type;
        // gc.bet_type = roomData.limit_bet_type;
        // gc.seat_count = roomData.seat_count;
        // gc.serviceId = roomData.service_id != null ? String(roomData.service_id) : null;
        // gc.straddle = roomData.straddle_on || 0;
        // gc.insurance = (roomData.insurance_on || 0) > 0;
        // gc.muck_switch = roomData.muck_on || 0;
        // gc.origin_type = roomData.origin_type || 0;
        // gc.share_table = roomData.share_table || 0;
        // gc.gold_type = roomData.gold_type || 0;
        // gc.ClubID = roomData.club_id || 0;
        // gc.TribeId = roomData.tribe_id || 0;
        // gc.match_id = 0;
        // gc.carry_small = roomData.limit_bring_in || 0;
        // gc.anti_cheat_type = roomData.anti_cheat_type || 0;
        // gc.enter_param = { game_enter_type: 0, isLookOn: false };
        // const jackpotId = Number(roomData.jackpot_id || 0);
        // gc.jackPot_id = jackpotId;
        // === 6. 启动进入牌桌流程 ===
        // → ProtocolAgency.Send(ClientMessageEnterRoom) → WebSocket 发送
        await ProcedureManager.StartProcedure(ProcedureDefine.EnterRoom, {
            roomID: roomData.rid,
            matchID: 0,
            roomType: roomData.room_type
        });
        _ploger.info('[H5Bridge] enterTable 已启动进桌流程, room_id:', roomData.rid, 'room:', roomData.name);
    });
    registerTexasMtt();
    h5MessageManager.on('exitTable', payload => {
        _ploger.info('[H5Bridge] 离开牌桌:', payload);
        // 重连 context 由 ProcedureReturn 离桌时统一清理，覆盖主动离桌和被踢两条路径
        // TODO: 调用离开牌桌的逻辑
    });
    h5MessageManager.on('syncUser', payload => {
        _ploger.info('[H5Bridge] 同步用户信息:', payload);
        // bridge 协议里 raw 是 unknown（兼容 H5 端 ApiResponse 等宽松实参），
        // 这里断言为 { user?: SyncUserInfo } 后再访问。
        const raw = payload?.raw as { user?: SyncUserInfo } | undefined;
        const userInfo = raw?.user;
        if (!userInfo) {
            _ploger.error('[H5Bridge] syncUser 数据异常：缺少 payload.raw.user');
            return;
        }
        // 仅写入本地缓存，不触发 UI 事件和网络请求
        // const gc = GameCache.Instance;
        // gc.nUserId = Number(userInfo.un_id);
        // gc.userId = Number(userInfo.p_u_id ?? 0);
        // gc.strPhone = userInfo.phone;
        // gc.sex = userInfo.sex;
        // gc.nick = userInfo.nickname;
        // gc.headPic = userInfo.avatar;
        // gc.userType = userInfo.ut;
        // gc.isHadClub = userInfo.club_id > 0;
        // 直接写入 UserInfoModel 内部数据，绕过 setter（不触发 myGoldChange 事件）
        _ploger.info('[H5Bridge] syncUser 缓存完成, user_id:', userInfo.un_id, 'nickname:', userInfo.nickname);
        // 预加载声音和游戏资源（提前加载，避免 enterTable 时再加载影响进桌速度）
    });
    h5MessageManager.on('syncLanguage', payload => {
        const locale = payload?.locale;
        if (!locale) {
            _ploger.warn('[H5Bridge] syncLanguage 缺少 locale 字段');
            return;
        }
        _ploger.info('[H5Bridge] syncLanguage:', locale, '忽略，CC 层固定简体中文');
    });
    h5MessageManager.on('syncUserClub', payload => {
        _ploger.info('[H5Bridge] 同步俱乐部信息:', payload);
        // bridge 协议 response 为 unknown，断言为 SyncUserClubResponse 后再读 data。
        const response = payload?.response as SyncUserClubResponse | undefined;
        const clubList = response?.data;
        if (!clubList) {
            _ploger.error('[H5Bridge] syncUserClub 数据异常：缺少 payload.response.data');
            return;
        }
        // // 仅写入本地缓存，不触发 UI 事件和网络请求
        // ClubCache._allCubData = clubList;
        // // 设置当前俱乐部（第一个），仅写 _msg 和 isHadClub，无事件广播
        // if (clubList.length > 0) {
        //     ClubCache.setClubData(clubList[0]);
        // }
        _ploger.info('[H5Bridge] syncUserClub 缓存完成, 共', clubList.length, '个俱乐部');
    });
    h5MessageManager.on('syncGlobalConfig', payload => {
        const config = payload?.raw;
        if (!config || typeof config !== 'object') {
            _ploger.warn('[H5Bridge] syncGlobalConfig 数据异常：缺少 payload.raw');
            return;
        }
        //GameCache.Instance._globalConfig = config;
    });
    // 仅预填 Cocos 侧实际用到的 config_type：2(加时) 8(延迟看牌) 30(历史偷看)。
    // payload.raw 已是 H5 转换好的 map：{ [configType]: { [typeExt]: item } }。
    // DiamondModel.setFromH5Sync 会跳过已有缓存，后续按需拉取时命中缓存不再发请求。
    const DIAMOND_PRELOAD_TYPES = [2, 8, 30];
    h5MessageManager.on('syncDiamondConfig', payload => {
        const map = payload?.raw;
        if (!map || typeof map !== 'object') {
            _ploger.warn('[H5Bridge] syncDiamondConfig 数据异常：缺少 payload.raw');
            return;
        }
        for (const configType of DIAMOND_PRELOAD_TYPES) {
            const typeMap = map[configType];
            if (typeMap && typeof typeMap === 'object') {
                // DiamondModel.Instance.setFromH5Sync(configType, typeMap as Record<number, unknown>);
            }
        }
        _ploger.info('[H5Bridge] syncDiamondConfig 预填完成');
    });
    // h5MessageManager.on('syncRoomsList', (payload) => {
    //     _ploger.info('[H5Bridge] 同步房间列表:', payload);
    //     const records = payload?.response?.data?.records;
    //     if (!records || !Array.isArray(records)) {
    //         _ploger.error('[H5Bridge] syncRoomsList 数据异常：缺少 payload.response.data.records');
    //         return;
    //     }
    //     // 仅写入本地缓存，不触发 UI 事件和网络请求
    //     const roomListModel = GC.data.lobby.roomList;
    //     const list = records.map(r => new LobbyRoomListItem(r));
    //     // 直接替换内部列表（不是追加）
    //     (roomListModel as any)._list = list;
    //     (roomListModel as any)._offset = list.length;
    //     (roomListModel as any)._reqEnd = true;
    //     (roomListModel as any)._reqing = false;
    //     _ploger.info('[H5Bridge] syncRoomsList 缓存完成, 共', records.length, '个房间');
    // });
    // 监听服务器推送的房间变更通知（code 140），实时更新缓存
    // GC.notify.register(
    //     ProtocolCode.Protocol_Holdem_RoomChangeNotify,
    //     (rec: { room?: any; changeType: number; roomChange?: any }) => {
    //         if (!rec || !rec.room) return;
    //         const roomListModel = GC.data.lobby.roomList;
    //         const list = (roomListModel as any)._list as LobbyRoomListItem[];
    //         if (!list) return;
    //         const rid = rec.room.rid;
    //         const existIndex = list.findIndex((r) => r.rid === rid);
    //         if (rec.changeType === 1) {
    //             // 新增房间
    //             if (existIndex === -1) {
    //                 list.push(new LobbyRoomListItem(rec.room));
    //                 _ploger.info('[H5Bridge] RoomChangeNotify 新增房间:', rid);
    //             }
    //         } else if (rec.changeType === 2) {
    //             // 更新房间
    //             if (rec.room.status === 5) {
    //                 // 房间已结束，从缓存中移除
    //                 if (existIndex !== -1) {
    //                     list.splice(existIndex, 1);
    //                     _ploger.info('[H5Bridge] RoomChangeNotify 房间已结束，移除:', rid);
    //                 }
    //             } else if (existIndex !== -1) {
    //                 list[existIndex] = new LobbyRoomListItem(rec.room);
    //                 _ploger.info('[H5Bridge] RoomChangeNotify 更新房间:', rid);
    //             } else {
    //                 // 缓存中不存在，按新增处理
    //                 list.push(new LobbyRoomListItem(rec.room));
    //                 _ploger.info('[H5Bridge] RoomChangeNotify 更新时缓存未命中，已补入:', rid);
    //             }
    //         }
    //     },
    //     null,
    // );
    /**
     * 进入德州MTT
     */
    function registerTexasMtt(): void {
        h5MessageManager.on('enterMtt', async payload => {
            _ploger.info('[H5Bridge] enterMtt:', payload);
            // matchInfo 在 bridge 中是 unknown，CC 侧按 EnterMttMatchInfo 断言。
            const matchInfo = payload?.matchInfo as EnterMttMatchInfo | undefined;
            if (!matchInfo) {
                _ploger.error('[H5Bridge] enterMtt 数据异常：缺少 payload.matchInfo');
                return;
            }
            //const enterPram = { game_enter_type: GameEnterType.MTT, isLookOn: false };
            if (payload.token) {
                userStore.token = payload.token;
            }
            // === 5. 填充 GameCache ===
            // GameCache.Instance.match_id = matchInfo.match_id;
            // GameCache.Instance.room_id = 0;
            // GameCache.Instance.room_type = matchInfo.type;
            // GameCache.Instance.enter_param = enterPram;
            // GameCache.Instance.serviceId = String(payload.websocketPort);
            // === 6. 启动进入牌桌流程，同时后台加载资源 ===
            await ProcedureManager.StartProcedure(ProcedureDefine.EnterRoom, {
                roomID: 0,
                matchID: matchInfo.match_id,
                roomType: matchInfo.type,
                observer: false
            });
            _ploger.info('[H5Bridge] enterMtt 缓存完成, matchId', ',开始进入mtt');
        });
    }
    // ─── 网络消息转发 ─────────────────────────────────
    /**
     * wsMessage: H5 层将服务器返回的二进制数据转发给 CC
     * payload 格式: { dataType: 'binary', data: ArrayBuffer }
     * structured clone 传递，data 已经是 ArrayBuffer，无需 base64 解码
     */
    h5MessageManager.on('wsMessage', payload => {
        if (payload.dataType !== 'binary' || !payload.data) {
            _ploger.warn('[H5Bridge] wsMessage 数据格式异常:', payload);
            return;
        }
        // payload 已收窄为 WsMessageBinaryPayload，data 为 ArrayBuffer | Uint8Array
        try {
            let buffer: ArrayBuffer;
            if (payload.data instanceof ArrayBuffer) {
                buffer = payload.data;
            } else if (payload.data instanceof Uint8Array) {
                // Uint8Array.buffer 是 ArrayBufferLike（含 SharedArrayBuffer），
                // 在 Cocos 环境中实际总是 ArrayBuffer，安全断言。
                buffer = payload.data.buffer as ArrayBuffer;
            } else {
                _ploger.warn('[H5Bridge] wsMessage data 类型异常:', typeof payload.data);
                return;
            }
            ProtocolAgency.Receive(buffer);
        } catch (e) {
            _ploger.error('[H5Bridge] wsMessage 处理失败:', e);
        }
    });
    /**
     * wsClosed: H5 层的 WebSocket 连接断开
     * H5 桥接模式下：通知 H5 重连，而非 CC 自己连 WebSocket
     */
    h5MessageManager.on('wsClosed', payload => {
        _ploger.warn('[H5Bridge] wsClosed:', payload);
        // 通知 H5 层重新连接 WebSocket
        // H5MsgMgr.sendToH5('wsConnect', 1, {
        //     port: Number(GameCache.Instance.serviceId),
        //     roomId: GameCache.Instance.room_id,
        //     matchId: GameCache.Instance.match_id
        // });
    });
    /**
     * wsError: H5 层的 WebSocket 发生错误
     */
    h5MessageManager.on('wsError', payload => {
        _ploger.warn('[H5Bridge] wsError:', payload);
    });
    h5MessageManager.on('wsReconnecting', payload => {
        _ploger.warn('[H5Bridge] wsReconnecting:', payload);
        roomReconnectManager.markReconnecting();
    });
    h5MessageManager.on('wsReconnected', payload => {
        _ploger.info('[H5Bridge] wsReconnected:', payload);
        roomReconnectManager.requestReconnect();
    });
    h5MessageManager.on('wsReconnectFailed', payload => {
        _ploger.error('[H5Bridge] wsReconnectFailed:', payload);
        roomReconnectManager.failReconnect(String(payload?.reason || 'unknown'));
        if (payload?.reason === 'auth-invalid') return;
        h5MessageManager.sendToH5('h5Navigate', 1, {
            name: 'guest-home',
            replace: true,
            ensureVisible: true,
            openLoginModal: true
        });
    });
}
