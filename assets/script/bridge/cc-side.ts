// CC 端入口（h5-cc-bridge/cc-side）。
//
// 暴露给 Cocos Creator 项目使用的协议表面：
//   - 所有 action 常量（CC→H5 发的 + H5→CC 收的）
//   - CC→H5 payload 类型（CC 作为 sender 写入 sendToH5 时的类型约束）
//   - H5→CC payload 类型（CC 作为 receiver 解码时的类型约束）
//
// 故意不再导出 envelope 函数（createBridgeMessage / parseBridgeRaw / ...），
// 因为 CC 历史上由 H5MsgMgr.ts 自实现一份 BridgeRawMessage 序列化。
// 如果未来 CC 想统一走共享 envelope，从 './message' 显式 import 即可。
export {
  BRIDGE_ACTION,
  CC_TO_H5_ACTIONS,
  H5_TO_CC_ACTIONS,
  BRIDGE_MSG_TYPE,
  normalizeBridgeMsgType,
} from './actions'

export type { BridgeAction, BridgeMsgType, CcToH5Action, H5ToCcAction } from './actions'

export * from './cocosToH5'
export * from './h5ToCocos'
