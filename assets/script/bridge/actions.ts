// Bridge 动作定义（H5 <-> Cocos）。
// 按方向拆成两组常量，便于两端各自只关心自己一侧；BRIDGE_ACTION 合并两组保留对外兼容。

// Cocos -> H5：从 CC 侧主动下发的动作。
export const CC_TO_H5_ACTIONS = {
  // CC 就绪握手动作。
  CC_READY: 'ccReady',
  CC_ACK: 'ccAck',
  // 要求 H5 建立 / 发送 / 关闭 websocket。
  WS_CONNECT: 'wsConnect',
  WS_SEND: 'wsSend',
  WS_CLOSE: 'wsClose',
  // 发起一次 indexedDB 或 localStorage 读/写。
  CC_STORAGE_OP: 'ccStorageOp',
  // UI 控制。
  SHOW_TOAST: 'showToast',
  SHOW_DIALOG: 'showDialog',
  SHOW_PANEL: 'showPanel',
  CLOSE_PANEL: 'closePanel',
  // H5 显隐 / 路由跳转。
  H5_HIDE: 'h5Hide',
  H5_SHOW: 'h5Show',
  H5_NAVIGATE: 'h5Navigate',
  // 心跳频率切换。
  SET_HEARTBEAT_MODE: 'setHeartbeatMode',
} as const

// H5 -> Cocos：从 H5 侧主动下发的动作。
export const H5_TO_CC_ACTIONS = {
  // H5 就绪握手动作。
  H5_READY: 'h5Ready',
  H5_ACK: 'h5Ack',
  // 同步 websocket 生命周期与消息。
  WS_OPEN: 'wsOpen',
  WS_MESSAGE: 'wsMessage',
  WS_ERROR: 'wsError',
  WS_CLOSED: 'wsClosed',
  // 重连流程通知（对齐 Unity NetworkDetectionComponent）。
  WS_RECONNECTING: 'wsReconnecting',
  WS_RECONNECTED: 'wsReconnected',
  WS_RECONNECT_FAILED: 'wsReconnectFailed',
  // UI 回执。
  PANEL_EVENT: 'panelEvent',
  DIALOG_RESULT: 'dialogResult',
  // 业务数据同步。
  SYNC_USER: 'syncUser',
  SYNC_USER_CLUB: 'syncUserClub',
  SYNC_ROOMS_LIST: 'syncRoomsList',
  SYNC_LANGUAGE: 'syncLanguage',
  SYNC_GLOBAL_CONFIG: 'syncGlobalConfig',
  SYNC_DIAMOND_CONFIG: 'syncDiamondConfig',
  // 进桌 / 进赛。
  ENTER_TABLE: 'enterTable',
  ENTER_MTT: 'enterMtt',
  // ccStorageOp 的回包 / 全量回灌。
  CC_STORAGE_RESULT: 'ccStorageResult',
  CC_STORAGE_SNAPSHOT: 'ccStorageSnapshot',
} as const

// 合并视图：原有调用点 `BRIDGE_ACTION.XXX` 全部保留兼容。
export const BRIDGE_ACTION = {
  ...CC_TO_H5_ACTIONS,
  ...H5_TO_CC_ACTIONS,
} as const

export type CcToH5Action = (typeof CC_TO_H5_ACTIONS)[keyof typeof CC_TO_H5_ACTIONS]
export type H5ToCcAction = (typeof H5_TO_CC_ACTIONS)[keyof typeof H5_TO_CC_ACTIONS]
export type BridgeAction = (typeof BRIDGE_ACTION)[keyof typeof BRIDGE_ACTION]

export const BRIDGE_MSG_TYPE = {
  // 0：网络透传链路（默认值，兼容旧协议未带 msgtype 的场景）。
  FORWARD: 0,
  // 1：H5 业务层处理链路（例如 toast、ready 握手等）。
  H5: 1,
} as const

export type BridgeMsgType = (typeof BRIDGE_MSG_TYPE)[keyof typeof BRIDGE_MSG_TYPE]

export function normalizeBridgeMsgType(raw: unknown): BridgeMsgType {
  return Number(raw) === BRIDGE_MSG_TYPE.H5 ? BRIDGE_MSG_TYPE.H5 : BRIDGE_MSG_TYPE.FORWARD
}
