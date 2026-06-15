# 牌桌重构架构文档

> 适用项目：`h5-cc-game`（`pokerqueen` 的重构版本）
> 核心目标：将原本高度耦合、命令式驱动的牌桌代码，改造为**数据驱动 + 响应式**的架构，使消息处理、数据存储、视图渲染、H5 桥接四层完全解耦。

---

## 目录

1. [整体分层结构](#1-整体分层结构)
2. [数据层：RoomData / Store 体系](#2-数据层roomdata--store-体系)
3. [DataBind 响应式框架](#3-databind-响应式框架)
4. [消息层:服务端消息的处理链路](#4-消息层服务端消息的处理链路)
5. [视图层：autoBindEvents + 多数据源模式](#5-视图层autobindevents--多数据源模式)
   - 5.5 [自治组件模式：Operation 面板的演进](#55-自治组件模式operation-面板的演进)
6. [AnimateDisplayType：让同一数据触发不同动画](#6-animatedisplaytype让同一数据触发不同动画)
7. [UI 资源管线：UIViewManager + UIPrefabDefinition](#7-ui-资源管线uiviewmanager--uiprefabdefinition)
8. [H5 桥接层：H5MsgMgr](#8-h5-桥接层h5msgmgr)
9. [进房 / 离房流程](#9-进房--离房流程)
10. [三层协作示例：ChipsChange](#10-三层协作示例chipschange)
11. [目录结构速查](#11-目录结构速查)
12. [添加新功能的标准步骤](#12-添加新功能的标准步骤)
13. [重构演进对比](#13-重构演进对比)

---

## 1. 整体分层结构

```
┌────────────────────────────────────────────────────────────────┐
│  入口层  game/entrance/TexasGameplayEntrance                    │
│  · 请求房间信息(MSG_R_ROOMS) → 反作弊/鉴权校验                  │
│  · new TexasGameRoomData 并注册到 roomDataManager               │
│  · 写入静态房间配置（玩法、保险、鱿鱼、蘑菇…）                  │
│  · 首次进桌发 MSG_D_ENTER_ROOM；断线重连由                      │
│    RoomReconnectManager 改发 MSG_D_SYNC_ENTER（见 §9.3）        │
└──────────────────────────┬─────────────────────────────────────┘
                           │ WS 回调
┌──────────────────────────▼─────────────────────────────────────┐
│  消息层  net/messages/texas/                                    │
│  · TexasMessageHandler 按 code 分发到独立函数                   │
│  · 每个消息函数是纯函数：读取 data → 写入 RoomData              │
│  · 不含任何 UI 代码；不持有 cc.Node 引用                        │
│  · 内置"房间不存在"防护，自动发 Leave 防僵尸                    │
└──────────────────────────┬─────────────────────────────────────┘
                           │ emit（@observable / @pureEvent 自动触发）
┌──────────────────────────▼─────────────────────────────────────┐
│  数据层  data/                                                  │
│  · TexasGameRoomData（聚合根）                                  │
│    ├─ basicInfo         : TexasGameRoomDataBasic                │
│    ├─ setting           : TexasGameRoomDataSetting              │
│    ├─ potInfo           : TexasGameRoomDataPotInfo              │
│    ├─ publicCards       : TexasGameRoomDataPublicCards          │
│    ├─ roundState        : TexasGameRoomDataRoundState           │
│    ├─ seatsStateManager : TexasGameRoomDataSeatsStateManager    │
│    │     └─ TexasGameRoomDataPlayer × N (cc.EventTarget)        │
│    └─ mine              : TexasGameRoomDataPlayerMine           │
│  · 全局：userStore / tradeStore（用户/交易数据，同样响应式）    │
│  · 字段用 @observable 装饰，赋值即 emit；@pureEvent 用于纯通知  │
└──────────────────────────┬─────────────────────────────────────┘
                           │ on/off 事件订阅（@bindEvent + autoBindEvents）
┌──────────────────────────▼─────────────────────────────────────┐
│  视图层  views/                                                 │
│  · views/scene/room/texas/   场景内组件（UIRoomTexas / Seat…）  │
│  · views/dialog/             对话框（BringIn / Settings / …）   │
│  · views/UIViewManager       场景/对话框/Toast/Preloading 总管  │
│  · 每个组件 @bindEvent 声明订阅，autoBindEvents 注册 + 首屏回放 │
└──────────────────────────┬─────────────────────────────────────┘
                           │ postMessage（msgtype=0/1）
┌──────────────────────────▼─────────────────────────────────────┐
│  H5 桥接层  H5MsgMgr.ts                                         │
│  · 与 h5-game(Vue3) 互通：握手、WebSocket 代理、UI 控制         │
│  · sendToH5<T>(action, ...) 泛型 payload；ccReady/h5Ready 握手  │
│  · 牌桌内通信走 H5 反代 WS（h5-game/wsProxy 转发 binary）       │
└────────────────────────────────────────────────────────────────┘
```

**核心原则**：消息层只写数据，视图层只读数据，数据层事件是它们之间唯一的通信方式；H5 桥接层只在边界处与外部 Vue 应用通信。

---

## 2. 数据层：RoomData / Store 体系

### 2.1 RoomDataManager — 房间数据仓库

`data/room/RoomDataManager.ts`，直接 `new` 出实例作为默认导出（模块级单例）。

以 `"roomID-matchID"` 为 key 管理房间实例。在入口层 `requestEnterAsync` 中创建，离开房间后清理。

| 方法 | 用途 |
|------|------|
| `setRoomData(roomID, matchID, data)` | 注册房间数据 |
| `getRoomData<T>(roomID, matchID)` | 获取（泛型自动转换） |
| `existRoomData(roomID, matchID)` | 消息层防护判断 |
| `deleteRoomData(roomID, matchID)` | 离开时清理 |
| `startInternalLeaveLock / isInternalLeaving / clearInternalLeave` | 主动离开期间的"静默"锁，防止僵尸消息再次触发数据修改或重复发送 Leave |

### 2.2 TexasGameRoomData — 聚合根

`data/room/texas/TexasGameRoomData.ts`，继承自 `data/room/RoomData`（持有 `roomID` / `matchID`）。

```typescript
export default class TexasGameRoomData extends RoomData {
    public closed: boolean;
    public readonly basicInfo         = new TexasGameRoomDataBasic(this);
    public readonly setting           = new TexasGameRoomDataSetting(this);
    public readonly potInfo           = new TexasGameRoomDataPotInfo();
    public readonly publicCards       = new TexasGameRoomDataPublicCards();
    public readonly roundState        = new TexasGameRoomDataRoundState();
    public readonly seatsStateManager = new TexasGameRoomDataSeatsStateManager(this);
    public readonly mine              = new TexasGameRoomDataPlayerMine(this);
}
```

新增的两个子对象：
- **`setting`** — 视图相关的本地设置（如 `showBB` 是否用大盲展示数字）。视图层订阅它实现"显示模式切换"，与服务端数据完全解耦。
- **`mine`** — 当前玩家的全局状态（钱包、藏钱、保险、坐下后绑定到对应 `TexasGameRoomDataPlayer.mine`）。独立于座位列表，避免坐下/站起反复重建。

### 2.3 数据对象的响应式声明

所有可观察字段用 `@observable` 装饰，**一行代替旧的三件套**（事件名常量 + 私有字段 + 手写 getter/setter + 手写 emit）。事件名以静态常量声明在类上，跨层使用时方便引用：

```typescript
@bindData()
@traceClass()
class TexasGameRoomDataPlayer extends cc.EventTarget {
    public static readonly CHIPS_CHANGE      = 'CHIPS_CHANGE';
    public static readonly ROUND_BET_CHANGE  = 'ROUND_BET_CHANGE';
    public static readonly SHOW_CARDS_CHANGE = 'SHOW_CARDS_CHANGE';
    public static readonly SEATED_CHANGE     = 'SEATED_CHANGE';
    public static readonly KEEPSEAT_CHANGE   = 'KEEPSEAT_CHANGE';

    // 普通响应式字段（带泛型 emit 透传参数）
    @observable(TexasGameRoomDataPlayer.CHIPS_CHANGE)
    public chip: number = 0;

    // initParams：首屏对齐时把额外参数也送进回调（这里把 mine 一并送出）
    @observable(TexasGameRoomDataPlayer.SEATED_CHANGE, {
        initParams() { return [this.mine]; }
    })
    public seated: boolean = false;

    // 数组无序比对模式
    @observable({ eventName: 'SHOW_CARDS_CHANGE', compareType: 'arrayAsSet' })
    public cards: number[] = [];

    // 纯通知方法：方法体只改私有状态，框架自动 emit
    @pureEvent(TexasGameRoomDataPlayer.KEEPSEAT_CHANGE, {
        initParams() {
            return [this._keepSeatDeadline > 0, this._keepSeatDeadline, this._keepSeatReason];
        }
    })
    public keepSeat(b: boolean, deadline: number, reason: Def.KeepSeatReasonMap[keyof Def.KeepSeatReasonMap]) {
        this._keepSeatDeadline = deadline;
        this._keepSeatReason = reason;
    }
}
```

`@observable` 自动完成：
- 创建私有存储 `_chip`，注入 getter/setter
- 内置脏值检查（`normal` / `arrayAsSet`），可被 `shouldEmit` / `forceEmit` 覆盖
- 值真正变化时 `this.emit(eventName, newValue, ...extraArgs)`
- 在原型链账本 `EVENT_MAP_KEY` 中登记事件名 → 私有键名映射，供 `autoBindEvents` 首屏回放使用
- 生成强类型 `setXxx(value, ...extraArgs)` 方法，额外参数（通常是 AnimateDisplayType）透传给 emit

### 2.4 TexasGameRoomDataPlayer — 玩家座位数据

每个座位对应一个实例，由 `seatsStateManager.seatsCount` setter 在房间初始化时统一创建（不再随坐下/站起销毁）。

| 事件名 | 声明方式 | 触发时机 |
|--------|---------|---------|
| `SEATED_CHANGE` | `@observable`（initParams 透传 `mine`） | 该座位坐下/站起，替代旧的 `EMPTY_SEAT` |
| `NICKNAME_CHANGE` | `@observable` | 玩家名字变化 |
| `AVATAR_CHANGE` | `@observable` | 头像变化 |
| `CHIPS_CHANGE` | `@observable` | 筹码变化 |
| `ROUND_BET_CHANGE` | `@observable`（带 `AnimateDisplayTypeRoundBet`） | 本轮下注变化 |
| `SHOW_CARDS_CHANGE` | `@observable`（带 `AnimateDisplayTypeCards`，可选 order） | 手牌变化 |
| `ACTION_CHANGE` | `@observable`（带 `AnimateDisplayTypeAction`） | 操作行为变化（fold/call/raise…） |
| `SEAT_POSITION_CHANGE` | `@observable`（带 `AnimateDisplayTypePosition`） | 座位视觉位置变化（重排后） |
| `PREPARE_OPERATION` | `@observable` | 轮到该玩家操作（携带 `Operator` 对象） |
| `CANPLAYSTATUS_CHANGE` | `@observable` | 可玩状态变化（鱿鱼/补盲等） |
| `KEEPSEAT_CHANGE` | `@pureEvent`（initParams 回调） | 留座倒计时启动/结束 |
| `ALLIN_WIN_PERCENT` | `@observable` | All-in 胜率 |
| `WINNER` | `@pureEvent` | 该座位获胜动画 |

旧版的 `EMPTY_SEAT` 已废弃 —— 改用 `SEATED_CHANGE` 的 `false` 分支表达空座，并通过 `seated=true/false` 控制座位 UI 显隐。

`IObservableBindings<Class, Bindings>` 接口会根据 `@observable` 字段 + 绑定泛型映射生成带强类型约束的 `setXxx` 方法集，使消息层调用时有完整 TS 提示和参数校验。

### 2.5 全局 Store

不属于房间生命周期的全局数据也走同一套响应式机制：

- **`data/user/UserStore.ts`** — 用户基础信息（昵称、头像、钻石、forbid、钱包列表 `wallets`、信用列表 `credits`、俱乐部列表 `clubsData`）。通过 `UserStoreUtils.updateUserInfoBasic()` 等工具方法刷新。
- **`data/trade/TradeStore.ts`** — 商城（USDT 充值价格表 / 支付方式列表）。

它们都是模块级单例（`new` 即导出），UI 组件用同样的 `autoBindEvents` + `@bindEvent` 订阅。

---

## 3. DataBind 响应式框架

`core/decorator/DataBind.ts` 是整个响应式体系的基础设施，提供四个装饰器、两个绑定工具函数和两个解绑工具函数。

### 3.1 @bindData() — 类装饰器

向数据源类注入 `muteEvents()` / `unmuteEvents()` 批量静音阀门。所有使用 `@observable` 的数据类都必须加此装饰器。

### 3.2 @observable() — 属性装饰器

```typescript
// 形式 1：直接传事件名
@observable('CHIPS_CHANGE')
public chip: number = 0;

// 形式 2：配置对象
@observable({
    eventName: 'VIP_SCORE_CHANGE',
    shouldEmit: (oldVal, newVal) => newVal - oldVal > 10000, // 自定义脏检查
    compareType: 'arrayAsSet',                               // 数组无序比对
    forceEmit: false,                                        // 是否跳过脏检查
    initParams: function () { return [this.mine]; }          // 首屏回放时追加参数
})
public vipScore: number = 0;
```

### 3.3 @pureEvent() — 方法装饰器

用于"执行完业务逻辑后统一发出通知"的方法。框架在方法返回后 emit 指定事件：

```typescript
@pureEvent('WINNER')
public claimWin() { /* 方法体随意，框架自动 emit('WINNER', ...args) */ }

@pureEvent('KEEPSEAT_CHANGE', {
    shouldEmit: function() { return this.chip > 0; },
    initParams() {
        return [this._keepSeatDeadline > 0, this._keepSeatDeadline, this._keepSeatReason];
    }
})
public keepSeat(b: boolean, deadline: number, reason: number) { ... }
```

`initParams` 是首屏对齐时的关键 —— 因为 `@pureEvent` 没有对应的物理属性，框架默认无法构造首屏参数；通过 `initParams`（数组或函数）就能告诉 `autoBindEvents`："首屏回放时请用这些参数调一次回调"。

### 3.4 muteEvents / unmuteEvents — 批量更新防抖

在批量修改多个响应式字段时用静音阀门包裹，避免每次赋值都触发 emit，最后由 `@pureEvent` 或显式 setter 统一发出一次通知：

```typescript
public fillWalletInfo(wallet: HttpRoomBringOutProtocol.Wallet[]) {
    this.muteEvents();
    this.clubsData = clubsData;   // 静音，不发 CLUBS_INFO_CHANGE
    this.unmuteEvents();
    this.wallets = walletsData;   // 这一行才真正触发 CLUBS_WALLET_CHANGE
}
```

### 3.5 @bindEvent() — UI 组件订阅声明装饰器

```typescript
// 简单：单事件 + 数据源 tag
@bindEvent('CHIPS_CHANGE', 'player')
private onUpdateChip(chip: number) { ... }

// 带默认参数：首屏回放时把这个值追加到 callback 参数末尾
@bindEvent('SHOW_CARDS_CHANGE', 'player', AnimateDisplayTypeCards.Static)
private onUpdateCards(cards: number[], animType: AnimateDisplayTypeCards) { ... }

// 配置对象：可指定首屏优先级、首屏跳过
@bindEvent('SEATS_CHANGE', { dataSource: 'seats', initPriority: 10 })
private onUpdateSeats(count: number) { ... }      // 先于其它绑定首屏回放

@bindEvent('WINNER', { dataSource: 'player', initIgnore: true })
private onWin() { ... }                            // 注册监听，但首屏不回放

// 同一方法叠加监听多个事件（任一变化都触发同一回调）
@bindEvent('TABLE_BET_INFO_CHANGE', 'basic')
@bindEvent('TABLE_HANDINFO_CHANGE', 'basic')
private onUpdateText() { ... }
```

### 3.6 autoBindEvents() — 一键完成订阅 + 首屏回放

```typescript
public onEnable() {
    if (!this._seatPlayer) return;
    autoBindEvents(this, {
        player:  this._seatPlayer,
        setting: this._setting,           // 多数据源同时绑定
        // mine 在 SEATED_CHANGE=true 时再二次调用绑定
    });
}
```

`autoBindEvents` 做三件事：
1. **重绑保护**：内部用 `BOUND_SOURCES_MAP_KEY` 账本记录每个 tag 上一次绑定的数据源；本次若同 tag 切到新源，先 `targetOff(component)` 解掉旧的，避免泄漏与重复触发。
2. **注册监听**：根据 `@bindEvent` 声明在 `dataSource.on(eventName, callback, component)` 上挂回调；按 `initPriority` 降序处理，保证"先建节点再设属性"这类依赖正确。
3. **首屏回放**：从原型链账本（`EVENT_MAP_KEY`）取每个事件对应的当前值（`@observable` 取私有键；`@pureEvent` 取 `initParams` 或空数组），加上 `@bindEvent` 的 `defaultArgs`，立刻同步调用一次回调 —— 完美应对"场景切换前数据已经写好"的进房场景。可通过第三参数 `shouldInitSync` 过滤哪些事件需要首屏同步。

### 3.7 解绑：unBindEvents / unBindEventsAll

```typescript
public onDisable() {
    unBindEventsAll(this);                  // 拔掉所有数据源上的监听
}

// 或者只解某些 tag（如 SEATED_CHANGE=false 时只拔 mine）
if (mine) unBindEvents(this, 'mine');
```

旧文档里的 `dataSource.targetOff(this)` 写法已不推荐 —— 它不会清理 `autoBindEvents` 内部账本，下次 `autoBindEvents` 重绑时无法识别历史绑定。**统一改用 `unBindEvents` / `unBindEventsAll`**。

---

## 4. 消息层:服务端消息的处理链路

### 4.1 分发链路

```
ProtocolAgency（WS 网络层）
    └─ MessageHandler.handle(code, data, roomID, matchID)
            ├─ code 1001-1199 → TexasMessageHandler.handle()
            │       └─ switch(code) → EnterRoom / Seated / StartInfo / ActionAll / …
            ├─ code 1201-1399 → FantasyMessageHandler
            ├─ code 2001-2999 → CowboyMessageHandler
            └─ code < 1000    → OtherMessageHandler
```

`net/messages/texas/TexasMessageHandler.ts` 第一道防护：除 `MSG_D_ENTER_ROOM` / `MSG_D_LEAVE` / `MSG_S_LEAVE_NOTIFICATION` 外，先做两层检查：

```typescript
// 1) 已经主动 leave 中 → 忽略所有后续消息（防止僵尸数据回滚）
if (roomDataManager.isInternalLeaving(roomID, matchID)) return;

// 2) 房间数据不存在 → 主动发 Leave 协议告知服务端，并打开 leaving 锁
if (!roomDataManager.existRoomData(roomID, matchID)) {
    ProtocolAgency.Send({ code: Code.MSG_D_LEAVE, ... });
    roomDataManager.startInternalLeaveLock(roomID, matchID);
    return;
}
```

这两道闸门完全替代了旧版"仅做 existRoomData 判断"的简单防护，**彻底消除断线/切桌期间残留消息引发的 UI 错乱**。

### 4.2 消息函数的标准写法

每条消息对应 `net/messages/texas/` 下一个独立文件，导出**具名函数**（注意：是 `export function Xxx`，不再是 `export default`）：

```typescript
// ActionAll 1108
export function ActionAll(data: ServerMessageActionAll.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    const seatPlayer = roomData.seatsStateManager.getSeatPlayer(data.operatorSeatId);
    seatPlayer.setAction(data.action, AnimateDisplayTypeAction.Done);
    seatPlayer.chip = data.leftChips;
    seatPlayer.setRoundBet(seatPlayer.roundBet + data.amount, AnimateDisplayTypeRoundBet.PutNear);
    roomData.potInfo.allPot += data.amount;
    // ...
}
```

消息函数**不能**操作 UI、不能持有 `cc.Node` 引用、不能直接打开对话框（对话框由 `TexasTableEvent` 等业务事件层负责）。

### 4.3 EnterRoom 与 MTT 兼容

`EnterRoom`（code 1002）有两点特殊处理：

1. **MTT roomID 迁移**：MTT 入场时入口层只知道 `matchID`，先以 `(roomID=0, matchID)` 注册数据；服务端返回真正的 roomID 后，`EnterRoom` 把数据 key 平移：
   ```typescript
   if (!roomData && matchID > 0) {
       roomData = roomDataManager.getRoomData(0, matchID);
       roomData.roomID = roomID;
       roomDataManager.deleteRoomData(0, matchID);
       roomDataManager.setRoomData(roomID, matchID, roomData);
   }
   ```
2. **场景切换走 viewManager**：把服务端快照全部以 `AnimateDisplayType.Static` 写入数据对象后，调用
   ```typescript
   await viewManager.switchScene('TexasRoom', { roomID, matchID });
   ```
   切换到牌桌场景。组件 `onEnable` 触发时数据已就绪，`autoBindEvents` 自动首屏回放。

---

## 5. 视图层：autoBindEvents + 多数据源模式

### 5.1 模式结构（以 `SeatPlayer.ts` 为例）

`Seat.ts` 已更名为 **`SeatPlayer.ts`**。同一组件可同时订阅多个数据源 —— `player`（座位玩家）、`setting`（显示设置）、`mine`（坐下后的本人数据）：

```typescript
public initData(seatPlayer: TexasGameRoomDataPlayer, potNode: cc.Node, dealNode: cc.Node) {
    this._seatPlayer = seatPlayer;
    this._setting    = seatPlayer.roomData.setting;
    this._potNode    = potNode;
    this._dealNode   = dealNode;
    if (this.node.activeInHierarchy) this._bindEventsAndRefresh();
}

protected onEnable() {
    if (!this._seatPlayer) return;
    this._bindEventsAndRefresh();
}

protected onDisable() {
    unBindEventsAll(this);     // 一键拔掉所有数据源监听
}

private _bindEventsAndRefresh() {
    autoBindEvents(this, { player: this._seatPlayer, setting: this._setting });
}

// 一旦坐下，再追加绑定 mine（站起则只解 mine 这一个 tag）
@bindEvent(TexasGameRoomDataPlayer.SEATED_CHANGE, { dataSource: 'player', initPriority: 10 })
private onUpdateSeated(b: boolean, mine: TexasGameRoomDataPlayer) {
    this.userSeat.active = b;
    this.emptySeat.node.active = !b;
    if (b && mine) {
        autoBindEvents(this, { mine });        // 增量绑定
        return;
    }
    if (mine) unBindEvents(this, 'mine');      // 站起时单独解绑
}

@bindEvent(TexasGameRoomDataPlayer.CHIPS_CHANGE, 'player')
private onUpdateChip(chip: number) {
    this.chips.string = this._setting.showNumberWithShowBB(chip);  // setting 与 player 联动
}

@bindEvent(TexasGameRoomDataSetting.SHOW_BB, { dataSource: 'setting', initPriority: 99 })
private onUpdateShowBB() {
    this.chips.string = this._setting.showNumberWithShowBB(this._seatPlayer.chip);
    this.roundBetLabel.string = this._setting.showNumberWithShowBB(this._seatPlayer.roundBet);
}
```

### 5.2 多数据源的核心好处

| 场景 | 解决方式 |
|------|----------|
| **服务端筹码变了** | 写 `seatPlayer.chip`，回调里读 `setting.showBB` 决定显示成 1500 还是 7.5BB |
| **用户切换显示单位** | 写 `setting.showBB = !showBB`，回调直接调 `setting.showNumberWithShowBB(player.chip / roundBet)` 整体刷新 |
| **坐下/站起** | 在 `SEATED_CHANGE` 回调里 `autoBindEvents({ mine })` / `unBindEvents('mine')`，**只挂/解一个 tag，其它绑定原样保留** |

`autoBindEvents` 的"重绑保护"让二次调用是安全的；想关掉某个 tag 也不会牵连别的。

### 5.3 组件层级与数据传递

```
UIRoomTexas.initialize({ roomID, matchID })
    ├─ roomInfo.initData(roomID, matchID)
    ├─ potsInfo.initData(roomID, matchID)             → 绑 pot + setting
    ├─ publicCardsInfo.initData(roomID, matchID)
    ├─ seatManager.initData(roomID, matchID)
    │       └─ 取 roomData.seatsStateManager
    │          autoBindEvents({ seats })
    │          onUpdateSeats(count)  // 首屏回放：实例化 N 个 seatPrefab
    │               └─ seat.initData(seatData, potNode, dealNode)
    │                       └─ autoBindEvents({ player, setting })
    │                               + 立即回放所有当前状态
    └─ sideMenuNode.initData(roomID, matchID)         → UITexasMenu（牌桌侧边栏）
```

### 5.4 牌桌业务事件入口：TexasTableEvent

`views/scene/room/texas/events/TexasTableEvent.ts`（旧名 `SeatEvent.ts`）集中实现"点 UI → 发协议"的业务流程：

| 静态方法 | 触发点 | 责任 |
|----------|--------|------|
| `Sitdown(mine, seatNo)` | 点击空座 | 拉钱包/带出信息 → 决定走 BringIn 对话框 / 直接 MSG_D_SEATED |
| `BringIn(mine)` | 侧菜单"带入" | 拉钱包 → 打开 BringIn 对话框 |
| `Standup(mine)` | 侧菜单"站起" | 鱿鱼模式特殊确认 → MSG_D_STANDUP_ACTIVE |
| `LeaveRoom(mine)` | 侧菜单"离开"或后端关闭 | MTT/普通分支处理，未握手时直接走 `ProcedureReturn` |
| `DoAction(mine, action, amount)` | 操作面板/AutoOp | 发 `MSG_D_ACTION` |
| `CommitBuyInsurance(mine, buyList, confirm)` | 保险面板 | 发 `MSG_D_BUY_INSURANCE_ACTIVE` |

视图组件只调用 `TexasTableEvent.Xxx(...)`，不直接发协议，**消息发送细节集中在一处**。

### 5.5 自治组件模式：Operation 面板的演进

> 这一节记录 `Operation.ts`（玩家操作面板）从"上层命令式驱动"到"完全数据驱动自治"的演进，是当前视图层的推荐模式。

#### 5.5.1 演进路径

| 阶段 | 提交 | UIRoomTexas 的角色 | Operation 的角色 |
|------|------|---------------------|---------------------|
| 初版 | `5219e60` WIP | 持有 `Operation`，外部调 `initData(mine, param)` | 被动接受参数，无数据订阅 |
| 中间 | `6aef477` / `8eba243` | 自己 `@bindEvent('PREPARE_OPERATION_MINE')`，按 `opType` 分发，调 `_opPannel.startOperation(oper, mine)` | 提供命令式 API `startOperation(...)`，由外部触发刷新 |
| 当前 | `0cf6b13` *"autoop is merge to operation"* | **只调一次 `_opPannel.initData(mine)`，之后完全不管** | **自己订阅 `mine` 上的 `PREPARE_OPERATION_MINE`，自己按 `opType` 决定显隐和刷新** |

最终态下，`UIRoomTexas.initialize` 退化成"把 `mine` 引用透传给每个自治组件"：

```typescript
initialize(param: UIRoomTexasEnterParam) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(param.roomID, param.matchID);
    this._mine = roomData.mine;
    this.roomInfo.initData(param.roomID, param.matchID);
    this.potsInfo.initData(param.roomID, param.matchID);
    this.seatManager.initData(param.roomID, param.matchID);
    this.publicCardsInfo.initData(param.roomID, param.matchID);
    this._sideMenuTexasMenu.initData(param.roomID, param.matchID);
    this._opPannel.initData(this._mine);   // 一次性把数据交出去，后续 UIRoomTexas 完全不参与
}
```

#### 5.5.2 自治组件的标准协议

`Operation.ts` 的最终形态展示了一个**完全自治视图组件**长什么样：

```typescript
@ccclass
@menu('Scene/Room/Texas/Operation')
export default class Operation extends cc.Component {
    @property({ type: cc.Node, displayName: '真正根节点,保证根节点永远不会Disable' })
    rootNode: cc.Node = null;                    // ① 显隐切换在 rootNode，组件自己永远活着
    @property({ type: cc.Node, displayName: '自动操作面板' })
    private autoOpPannelNode: cc.Node = null!;
    private _autoOpPanel: AutoOperation = null;
    private _seatPlayer: TexasGameRoomDataPlayerMine = null;

    protected onLoad() {
        this._autoOpPanel = this.autoOpPannelNode.children[0].getComponent(AutoOperation);
        this.regiterTouchEvents();
    }

    public initData(mine: TexasGameRoomDataPlayerMine) {   // ② 外部唯一入口：交付数据引用
        this._seatPlayer = mine;
        this._autoOpPanel.initData(mine);                  //   级联交付给子自治组件
        this._bindEventsAndRefresh();
    }

    protected onEnable()  { this._bindEventsAndRefresh(); }     // ③ 自管生命周期
    protected onDisable() { unBindEventsAll(this); }

    private _bindEventsAndRefresh() {
        if (!this._seatPlayer) return;
        autoBindEvents(this, { mine: this._seatPlayer, setting: this._seatPlayer.roomData.setting });
    }

    @bindEvent(TexasGameRoomDataPlayerMine.PREPARE_OPERATION_MINE, 'mine')
    private onPrepareActionMine(oper: OperatorMine) {     // ④ 自己监听 operator 决定显隐
        if (!oper || oper.opType != OpertionType.NORMAL) {
            this.rootNode.active = false;                  //   非 NORMAL：藏可视根节点（但脚本仍订阅着）
            return;
        }
        // 选了自动操作则直接发协议，不展示 UI
        if (this._seatPlayer.autoOperationType != AutoOperationTypeTexas.NO) {
            // ...TexasTableEvent.DoAction(...)
            return;
        }
        this.rootNode.active = true;
        this.opTimer.startTimer({ ... });
        this._refreshUI(oper.roundBetEqual);
    }
}
```

#### 5.5.3 关键设计点

| # | 模式 | 为什么 |
|---|------|--------|
| ① | **脚本挂在永远不会被 disable 的节点上；显隐切 `rootNode`** | `node.active = false` 会触发 `onDisable → unBindEventsAll`，监听就掉了；下次数据变化时**收不到事件**。把可视部分放到一个子节点 `rootNode` 上，脚本本体永远活着，监听始终在线 |
| ② | **外部只调一次 `initData(数据引用)`** | 父组件不需要懂"什么时候应该刷新"、"什么时候应该隐藏"——这些都由组件自己读数据判断。父组件的职责退化为"数据引用的递送员" |
| ③ | **`onEnable` 重绑 / `onDisable` 全解** | 即便父节点把整棵子树临时 disable（场景缓存等），重新激活时 `autoBindEvents` 的重绑保护账本会自动复位 |
| ④ | **状态变化的判断在组件内部** | `@bindEvent` 收到 `OperatorMine`，组件内部 `switch(opType)` 决定显示/隐藏/触发自动操作；外面没有任何 `if (xxx) opPanel.show()` 这种命令式调用 |

#### 5.5.4 级联自治：AutoOperation 是 Operation 的子自治组件

`AutoOperation`（自动操作面板）同样自治：
- `Operation.initData(mine)` 内部调 `this._autoOpPanel.initData(mine)`，把同一个数据引用传下去；
- `AutoOperation` 自己订阅 `VALID_AUTO_OPERATIONS_CHANGE` / `AUTO_OPERATION_TYPE_CHANGE`；
- `AutoOperation` 上的勾选反向写回 `mine.autoOperationType`，再通过 `@observable` emit 给监听方（包括 `Operation` 自己用于"轮到我时是否走自动操作"）。

**数据流闭环全程不经过 UIRoomTexas**：

```
服务端 OperatorMine → mine.operator
                         │ @observable emit PREPARE_OPERATION_MINE
                ┌────────┴────────┐
                ▼                 ▼
        Operation.onPrepare    （未来其它对 mine 感兴趣的组件）

用户点 AutoCheck → mine.autoOperationType = AUTO_CHECK
                                │ @observable emit
                                ▼
                  AutoOperation.onUpdateAutoOperationChange（自己刷自己 UI）
                  Operation.onPrepareActionMine 下次触发时读这个字段决定是否走自动
```

#### 5.5.5 这套模式什么时候用、什么时候不用

| 场景 | 用自治模式？ | 替代 |
|------|-------------|------|
| **场景内常驻视图组件**（座位、底池、操作面板、公共牌…） | ✅ 默认都用 | — |
| **按需弹出的 Dialog**（带入、保险、确认框…） | ❌ 不适用 | Dialog 没被打开时实例不存在，无法预订阅。仍需要一个外层 dispatcher（如 `UIRoomTexas` 监听 `PREPARE_OPERATION_MINE` 在 `opType=2` 时 `viewManager.openDialog('Insurance')`） |
| **跨房间的全局组件**（Toast、Preloading） | ❌ 不适用 | 直接 `viewManager.showXxx` |

> 注：保险面板 `UIInsuranceNewPanel` 本身在打开后是"半自治"的——它内部用 `@bindEvent` 订阅 `mine.PREPARE_OPERATION_MINE`，`opType!==2` 时自己 `close()`。但**何时打开**还是由 `UIRoomTexas` 监听同一个事件触发 `openDialog`。这就是 dialog 类组件的混合模式。

---

## 6. AnimateDisplayType：让同一数据触发不同动画

`game/constant/AnimateDisplayType.ts`。

| 枚举 | 值 | 语义 |
|------|----|------|
| `AnimateDisplayTypeCards.Static` | 0 | 进房回放，直接显示 |
| `AnimateDisplayTypeCards.Deal` | 1 | 新手牌，从发牌点飞入 |
| `AnimateDisplayTypeCards.ShowCards` | 2 | 摊牌，翻转动画 |
| `AnimateDisplayTypeRoundBet.Static` | 0 | 直接刷数字 |
| `AnimateDisplayTypeRoundBet.PutNear` | 1 | 筹码从座位飞向池区 |
| `AnimateDisplayTypeButton.Static` | 0 | 庄家按钮直接到位 |
| `AnimateDisplayTypeButton.Next` | 1 | 庄家按钮从上一个座位滑过来 |
| `AnimateDisplayTypeAction.Static` | 0 | 进房回放，直接设置 |
| `AnimateDisplayTypeAction.Done` | 1 | 玩家操作完成（弃牌动画等） |
| `AnimateDisplayTypePosition.Static` | 0 | 重排后直接到位 |
| `AnimateDisplayTypePosition.ToTarget` | 1 | 坐下时淡入+弹簧 |
| `AnimateDisplayTypePublicCards.Static / Deal` | 0/1 | 公共牌直接显示 / 发牌动画 |
| `AnimateDisplayTypeWin.Static / Play` | 0/1 | 获胜动画 |
| `AnimateDisplayTypePlayType.Staic / Start / End` | 0/1/2 | 玩法切换（鱿鱼/暴击/蘑菇 开关动画） |

**关键设计**：消息层决定"是什么"（数据），同时通过 AnimateDisplayType 声明"怎么展示"（意图），视图层负责执行。消息层不需要了解任何动画实现细节。

`@observable` 自动生成的 `setXxx(value, ...extraArgs)` 把 animType 透传给 emit；视图层用 `@bindEvent(eventName, source, AnimateDisplayType.Xxx)` 的第三参数提供首屏默认值。

---

## 7. UI 资源管线：UIViewManager + UIPrefabDefinition

### 7.1 UIPrefabDefinition — UI 资源注册表

`views/UIPrefabDefinition.ts` 把所有可加载的 UI 集中在三个常量表中：

```typescript
export const UIPrefabDialog = {
    ConfirmOrNotice:     { UIType: UIConfirmDialog,           Bundle, Path: 'rc/dialog/confirm/UIConfirmDialog' },
    TexasTableSetting:   { UIType: UIGameplayTableSetting,    Bundle, Path: 'rc/dialog/settings/UIGameplayTableSetting' },
    TexasTableSecurity:  { UIType: UIGameplaySecuritySetting, Bundle, Path: 'rc/dialog/security/UIGameplaySecuritySetting' },
    BringIn:             { UIType: UIBringIn,                 Bundle, Path: 'rc/dialog/bringin/UIBringIn' },
    BringOut:            { UIType: UIBringOut,                Bundle, Path: 'rc/dialog/bringin/UIBringIn' },
    RechargeDiamond:     { UIType: UIRechargeDiamond,         Bundle, Path: 'rc/dialog/rechargediamond/UIRechargeDiamond' },
} as const;

export const UIPrefabScene = {
    TexasRoom: { UIType: UIRoomTexas, Bundle, Path: 'rc/scene/room/texas/UIRoomTexas' }
} as const;

export const UIPrefabComponent = {
    Preloading: { UIType: UIPreloadingComponent, ... },
    Prompt:     { UIType: UIPromptComponent,     ... }
} as const;
```

类型自动推导（`UIPrefabDialogType = keyof typeof UIPrefabDialog`）使 `openDialog('BringIn', ...)` 时 IDE 能补全且 `param` 类型自动收窄。

### 7.2 UIViewManager — 场景/对话框/Toast 统一调度

`views/UIViewManager.ts` 是单例，主入口能力：

| 方法 | 用途 |
|------|------|
| `switchScene(key, param)` | 切换场景（带 prefab 加载/缓存池） |
| `openDialog(key, param, masked?, directShow?)` | 打开对话框（自动注入 mask 与关闭回调） |
| `closeDialog(key)` | 关闭某个对话框 |
| `showToast(content, config?, cb?)` | 队列式 Toast |
| `showPreloading(params)` / `hidePreloading()` | 资源加载进度 |

进房流程中 `EnterRoom.ts` 用的是 `viewManager.switchScene('TexasRoom', { roomID, matchID })`，业务事件如带入对话框由 `viewManager.openDialog('BringIn', ...)` 触发。

### 7.3 BringIn 对话框：泛型化的带入流程

`UIBringIn` 通过 `RoomPlayerGC`（`data/room/RoomDataGenericConstraints.ts`）约束不同玩法的玩家类型：

```typescript
export interface RoomPlayerGC {
    [GameType.HOLDEM]:  TexasGameRoomDataPlayerMine;
    [GameType.MAHJONG]: MahjongGameRoomDataBasic;
}

export type UIBringInParam = { [K in keyof RoomPlayerGC]: UIBringInParamBase<K>; }[keyof RoomPlayerGC];
```

`BringInProvider` 抽象类把"德州/麻将"等差异封装，`BringInProviderTexas` 提供德州的 min/max/默认值计算。`CommitFn` 回调由 `TexasTableEvent._commitBringInCallback` 构造，最终发送 `MSG_D_SEATED` 或 `MSG_D_BRING_IN`。

---

## 8. H5 桥接层：H5MsgMgr

`H5MsgMgr.ts`（单例，模块默认导出 `h5MessageManager`）。**牌桌内的所有 WebSocket 流量都由 H5 层代理转发** —— Cocos 不直连 WS，而是把二进制数据交给 H5。

### 8.1 握手时序

```
1. CC 完成初始化 → window.__CC_READY__ = true → sendToH5('ccReady', 1)
2. H5 收到 ccReady（或自检 __CC_READY__）→ postMessage h5Ready
3. CC 收到 h5Ready → 取出 token 写入 userStore → sendToH5('ccAck', 1) → 握手完成
4. 10s 超时保护：未握手则强制放行
5. 握手前发的业务消息进 _pendingMessages 队列，握手完成后统一 flush
```

### 8.2 消息信封

| 字段 | 含义 |
|------|------|
| `action` | 业务字符串（`wsConnect` / `enterTable` / `showToast` …） |
| `msgtype` | `0` 走 H5 转发（WebSocket binary）；`1` 由 H5/CC 业务层自处理 |
| `source` | `'cc'` / `'h5'` 用于忽略自我回声 |
| `payload` | 业务数据；二进制用 `{dataType:'binary', data: Uint8Array}` 包装 |
| `requestId` / `timestamp` | 追踪 |

`CocosToH5PayloadMap` / `H5ToCocosPayloadMap` 两张映射表让 `sendToH5<'wsConnect'>(...)` / `on<'enterTable'>(cb)` 都有完整的 TS 类型推导，**新增 action 时必须同步 h5-game 的 protocol 类型表**。

### 8.3 主要 action

CC → H5：
- WS 代理：`wsConnect` / `wsSend`(自动包装为 binary 信封) / `wsClose`
- UI 控制：`showToast` / `showDialog` / `showPanel` / `closePanel`
- 显隐与路由：`h5Hide` / `h5Show` / `h5Navigate`
- 心跳模式：`setHeartbeatMode`（牌桌内 1s/次，牌桌外 5s/次，对齐 HeartbeatComponent）

H5 → CC：
- WS 生命周期：`wsOpen` / `wsMessage`（含 binary/text 双形态）/ `wsClosed` / `wsError`
- 重连流程：`wsReconnecting` / `wsReconnected` / `wsReconnectFailed`
- 进桌：`enterTable`（普通牌桌） / `enterMtt`（MTT） / `exitTable`
- 数据同步：`syncUser` / `syncUserClub` / `syncRoomsList` / `syncLanguage` / `syncGlobalConfig` / `syncDiamondConfig`

### 8.4 与游戏的协同

- `LeaveNotification`（服务端通知离开）会构造 `H5NavigatePayload`（带 path/query），通过 `ProcedureReturn` → `sendToH5('h5Navigate', 1, ...)` 跳到 H5 的对应页面（例如 `path: '/tableGameEnd'`）。
- `ProcedureReturn.lateEnter` 处理"回到 H5"：有 routeData 走 `h5Navigate`，否则单纯 `h5Show`。
- `UITexasMenu.click_rule_tips / click_insurance` 把规则/保险面板交给 H5（`sendToH5('showPanel', 1, ...)`），Cocos 不再实现这些纯展示界面。

### 8.5 协议来源：npm 包 @silenthill/h5-cc-bridge

所有 payload 类型、`BRIDGE_ACTION` 常量定义都不在 `H5MsgMgr.ts` 内联，而是直接 import 自 [@silenthill/h5-cc-bridge](https://github.com/soolary/h5-cc-bridge) npm 包的 `cc-side` 入口，与 h5-game 共用一份"协议合同"，避免双端字段漂移。

```
@silenthill/h5-cc-bridge npm 包（git 依赖）
   ├─ dist/cc-side.{js,d.ts}    ← action 常量 + 双向 payload 类型（无 envelope 运行时）
   ├─ dist/h5-side.{js,d.ts}    ← cc-side 全套 + envelope 函数（h5-game 用）
   └─ cc-side/package.json      ← 子目录代理：main → ../dist/cc-side.js，types → ../dist/cc-side.d.ts
                    │
                    │ npm install
                    ▼
node_modules/@silenthill/h5-cc-bridge/cc-side/package.json
                    │
                    │ 经典 node 解析：发现 cc-side/ 目录 → 读其 package.json → main/types
                    ▼
H5MsgMgr.ts ──import type──▶ '@silenthill/h5-cc-bridge/cc-side'
                    │
                    │ TS 编译：import type 整条擦除
                    ▼
编译产物里没有任何 require('@silenthill/h5-cc-bridge') 引用
                    │
                    ▼
Cocos 运行时不去解析 node_modules，零负担
```

#### 为什么 CC 端可以走纯 npm 依赖（不像 i18n / agreement-web 那样要 UMD 注入）

CC 端从 bridge 只拿**类型**（`H5NavigatePayload`、`CocosToH5PayloadMap` 等 interface），所有 action 字符串都是手写字面量（`'wsConnect'`、`'showPanel'`），而不是 `BRIDGE_ACTION.WS_CONNECT`。TS 在编译时把 type-only 的 import 整条擦掉——编译后的 JS 里压根没有 `require('@silenthill/h5-cc-bridge/cc-side')`，运行时根本不去 node_modules 找，所以 Cocos 引擎"不解析 node_modules"这条限制不会触发。

#### 硬性约束

**CC 端绝对不能 import bridge 的 runtime 值**（`BRIDGE_ACTION.X` 常量、`createBridgeMessage` 等函数）。一旦碰了，那条 import 不会被擦除，Cocos 运行时找不到 `@silenthill/h5-cc-bridge` 模块就崩溃。落地三条戒律：

1. 所有 action 用字符串字面量：`this.sendToH5('wsConnect', 1, payload)`，不要 `BRIDGE_ACTION.WS_CONNECT`。
2. 所有 import 加 `import type` 关键字（明确告诉 TS 这是类型）。
3. 不要 import `'@silenthill/h5-cc-bridge/h5-side'` 或 `'@silenthill/h5-cc-bridge/envelope'`，CC 端只用 `'@silenthill/h5-cc-bridge/cc-side'`。

如果哪天需要在 CC 端共享 envelope 序列化逻辑，需要切换到"UMD 注入 + window 全局"那套（参考 holdem-pb / h5-cc-i18n 的接入方式）。

#### 配置（仅两件，零 tsconfig 改动）

```jsonc
// package.json（唯一需要配置的地方）
"dependencies": {
  "@silenthill/h5-cc-bridge": "git+ssh://git@github.com:soolary/h5-cc-bridge.git#main"
}
```

```ts
// H5MsgMgr.ts（唯一的协议入口）
import type {
  CocosToH5PayloadMap as SharedCocosToH5PayloadMap,
  H5ToCocosPayloadMap,
  H5NavigatePayload,
} from '@silenthill/h5-cc-bridge/cc-side';
```

`tsconfig.json` 不用加 `paths` / `baseUrl`——bridge 包自己在仓库根目录提供 `cc-side/` / `h5-side/` / `envelope/` 三个**子目录代理 `package.json`**，每个把 `main`/`types` 指回 `../dist/...`，任何 moduleResolution（包括 Cocos Creator 默认的经典 node）都能直接找到 `.d.ts`。

升级 bridge 版本就是改 `package.json` 里的 `#main` 改成 tag / commit SHA，然后 `npm install`——不再需要 sync 脚本。

#### 类型差异处理（`wsSend`）

共享 `CocosToH5PayloadMap.wsSend` 是 H5 接收端视角的 binary envelope。CC 端 `sendToH5` 接受的是原始 `Uint8Array | ArrayBuffer`（内部 `_post` 时自动包装为 envelope），所以 `H5MsgMgr.ts` 本地 `extends Omit<SharedCocosToH5PayloadMap, 'wsSend'>` 覆盖了这一个字段。其他 action 一律走共享类型。

#### h5-game 那边的对应

h5-game 也走 npm git 依赖，但 import 自 `@silenthill/h5-cc-bridge/h5-side` 入口（含 envelope 运行时函数）+ Vite alias `@bridge-protocol` 一层封装，详见 `h5-game/src/bridge/README.md §0`。两端的协议来源最终都是 @silenthill/h5-cc-bridge 仓库的 `dist/`。

---

## 9. 进房 / 离房流程

### 9.1 完整进房链路

```
H5 触发 enterTable
    │
    ▼
ProcedureEnterTexas → new TexasGameplayEntrance(roomType, matchId, roomId)
    │
    ▼
TexasGameplayEntrance.messageLayerEnterAsync()
    ├─ requestRoomInfoAsync()  // MSG_R_ROOMS：拿 _roomInfo
    ├─ checkCanEnterAsync()    // 鉴权 / 视频 / 关闭状态
    └─ requestEnterAsync(true)
            ├─ new TexasGameRoomData(roomId, matchId)
            ├─ 将 _roomInfo 字段全量写入 roomData.basicInfo
            ├─ roomData.seatsStateManager.seatsCount = _roomInfo.seatCount
            │     // setter 内创建 N 个 TexasGameRoomDataPlayer
            ├─ roomDataManager.setRoomData(roomId, matchId, roomData)
            └─ ProtocolAgency.Send(MSG_D_ENTER_ROOM)

服务端返回 MSG_D_ENTER_ROOM (code 1002)
    │
    ▼
EnterRoom(data, roomID, matchID)
    ├─ MTT roomID 迁移（如果用 0 注册过）
    ├─ viewManager.hidePreloading()
    ├─ 写入 basicInfo / potInfo / publicCards / seatsStateManager（全部 Static）
    ├─ 遍历 playersList → 写每个 seatData（chip/cards/action/mushroom/squid…）
    ├─ 处理 myInfo：setMySeat → seated=true → seatNo 落到 mine.seatNo
    ├─ 处理 operatorList → 区分本人(OperatorMine) / 其他人(Operator)
    └─ viewManager.switchScene('TexasRoom', { roomID, matchID })
            └─ UIRoomTexas.initialize → 各子组件 initData → autoBindEvents 自动回放
```

### 9.2 离房链路

主动离开：
```
UITexasMenu.click_leave / Seat 上的"离开"按钮
    └─ TexasTableEvent.LeaveRoom(mine)
            ├─ closed / MTT → 直接 ProcedureManager.StartProcedure(Return)
            ├─ 握手未完成 → 同上
            └─ 否则 → ProtocolAgency.Send(MSG_D_LEAVE)
                  └─ 服务端响应 MSG_D_LEAVE → Leave.ts → StartProcedure(Return)
```

被动离开（游戏结束 / 服务端踢出）：
```
MSG_S_LEAVE_NOTIFICATION → LeaveNotification.ts
    ├─ clearInternalLeave()
    ├─ 按 reason 构造 routeData（如 path:'/tableGameEnd' + 房间信息 query）
    └─ ProcedureManager.StartProcedure(Return, { routeData })
            └─ ProcedureReturn.lateEnter
                  ├─ roomReconnectManager.clearCurrentContext()  // 主动/被动离桌都收口在此
                  ├─ viewManager.showPreloadingLayer()
                  └─ sendToH5('h5Navigate', 1, routeData)  // 通知 H5 跳到结算页
```

### 9.3 断线重连链路

重连的核心理念：**不重新进桌，只拉房间最新快照**。Cocos 自己不连 WS，H5 负责检测断线和重连 WS，CC 仅在 WS 恢复后请求一次房间同步。整条链路三个关键设计：

1. **协议复用，但走 SyncEnter (1025) 而非 EnterRoom (1002)** —— 服务端把这次当成"刷新已在桌玩家的快照"而不是"重新入桌"，避免触发坐下等副作用。
2. **守卫 procedure** —— `RoomReconnectManager` 只有当 `ProcedureManager.currProcedure?.id === ProcedureDefine.EnterRoom` 时才会响应 H5 推送的重连事件；不在桌就一切跳过。
3. **消息层零感知**：`SyncEnter.ts` handler 只调用共享的 `applyRoomSnapshot()` 写数据。重连完成的信号通过 `roomData.basicInfo` 的 `SNAPSHOT_APPLIED` 事件传递给 `RoomReconnectManager`，handler 本身不持有任何 reconnect 状态机引用。

```
H5: WebSocket close
    │
    │ wsReconnecting ───────────────────────────────────────────────▶
    │                  RoomReconnectManager.markReconnecting()
    │                    ├─ Procedure 不在 EnterRoom → 直接 return
    │                    └─ 否则 _reconnecting=true + showPrompting()
    │
H5: WS 重连成功
    │ wsReconnected ────────────────────────────────────────────────▶
    │                  RoomReconnectManager.requestReconnect()
    │                    ├─ Procedure 守卫
    │                    ├─ context / roomData 守卫（拿不到 → hidePrompting）
    │                    ├─ basicInfo.once(SNAPSHOT_APPLIED, consume) ← 订阅完成事件
    │                    └─ ProtocolAgency.Send(MSG_D_SYNC_ENTER, { room })
    │
服务端返回 MSG_D_SYNC_ENTER (1025)
    │
    ▼
SyncEnter.ts (纯写数据)
    └─ applyRoomSnapshot(roomData, data)
            ├─ 就地覆盖 basicInfo / handInfo / playersList / myInfo / operatorList
            │     （每个 @observable setter 自动 emit，对应字段 UI 差量刷新）
            └─ basicInfo.emit('SNAPSHOT_APPLIED')
                    │
                    ▼
            RoomReconnectManager._consumeReconnectFlag()
                    └─ _reconnecting=false + hidePrompting()
```

**和首次进桌的差异**：

| 步骤 | 首次进桌 (EnterRoom 1002) | 断线重连 (SyncEnter 1025) |
|------|---------------------------|---------------------------|
| 入口 | `TexasGameplayEntrance.requestEnterAsync` | `RoomReconnectManager.requestReconnect` |
| roomData 创建 | `new TexasGameRoomData(...)` | 复用已有实例 |
| MTT roomID 迁移 | `EnterRoom.ts:24-31` 做 (0,m)→(r,m) 搬家 | 已是真 roomID，不会触发 |
| 数据写入 | `applyRoomSnapshot()` | `applyRoomSnapshot()`（同一个 helper） |
| UI 同步方式 | `viewManager.switchScene('TexasRoom')` → 组件 `autoBindEvents` **首屏回放** | 场景已存在，依赖 `@observable` setter **逐字段 emit** 差量刷新 |
| 完成信号 | `await switchScene` 完成 | `basicInfo.emit('SNAPSHOT_APPLIED')` |

**失败/清理路径**：

- H5 退出 WS 重连退避 → `wsReconnectFailed` → `failReconnect(reason)` → 拔掉 `once` 订阅 + `hidePrompting()`
- 玩家主动离桌 / 被服务端踢出 → 都收口到 `ProcedureReturn.lateEnter` → `clearCurrentContext()`，context 清空、`once` 订阅也一并拔掉
- 切场景之后若再收到延迟到的 1025 包，`SyncEnter.ts` 会因 `getRoomData` 取不到而 early return（受 §4.1 离桌锁保护），不会污染已切走的场景

**关键设计动机**：`RoomReconnectManager` 通过 `SNAPSHOT_APPLIED` 事件订阅来感知"sync 完成"，而不是让 `SyncEnter.ts` 直接调它的方法。这样 `SyncEnter` handler 保持"消息函数 = 纯数据写入"的契约（§4.2），将来若服务端引入"每 N 手主动 sync"或"切桌回前台 sync"等场景（参见 Unity 端 `_isEnableRtsEnterRoomMsg` 设计），同一个 handler 不需要任何改动。

---

## 10. 三层协作示例：ChipsChange

以筹码变化（code 1107）为例，三者之间**唯一的耦合点是事件名字符串 `'CHIPS_CHANGE'`**：

```
服务端推送 code=1107
        │
        ▼
TexasMessageHandler → ChipsChange(data, roomID, matchID)
        │  const seatPlayer = roomData.seatsStateManager.getSeatPlayer(data.seatId)
        │  seatPlayer.chip = data.chip
        ▼
@observable setter 脏检查通过 → emit('CHIPS_CHANGE', 1500)
        │
        ▼
SeatPlayer.onUpdateChip(1500)
        │  this.chips.string = this._setting.showNumberWithShowBB(1500)
        ▼
UI 刷新完成（按 setting.showBB 决定是 "1,500" 还是 "7.5BB"）
```

消息层不引用 SeatPlayer，SeatPlayer 不引用 ChipsChange，数据层不知道两者的存在。**改动显示格式（BB/数字）也不会影响消息层**，因为 `setting` 是独立数据源。

---

## 11. 目录结构速查

```
h5-cc-game/assets/script/
├── core/
│   └── decorator/
│       ├── DataBind.ts                  # 响应式框架：@observable/@pureEvent/@bindEvent/@bindData/autoBindEvents/unBindEvents(All)
│       └── LogTrace.ts                  # @traceClass / @traceMethod / createLogger
├── data/
│   ├── LocalStorage.ts / StorageKey.ts
│   ├── room/
│   │   ├── RoomData.ts                  # 基类（roomID/matchID）
│   │   ├── RoomDataManager.ts           # 房间数据仓库 + 离开锁
│   │   ├── RoomDataGenericConstraints.ts# 玩法→玩家类型映射（BringIn 泛型使用）
│   │   ├── mahjong/                     # 麻将
│   │   └── texas/
│   │       ├── TexasGameRoomData.ts             # 聚合根
│   │       ├── TexasGameRoomDataBasic.ts        # 房间基础信息 + 玩法开关
│   │       ├── TexasGameRoomDataSetting.ts      # 视图设置（showBB）
│   │       ├── TexasGameRoomDataPotInfo.ts      # 底池
│   │       ├── TexasGameRoomDataPublicCards.ts  # 公共牌
│   │       ├── TexasGameRoomDataRoundState.ts   # 回合状态
│   │       ├── TexasGameRoomDataSeatsStateManager.ts # 座位管理（seatsCount/重排/button）
│   │       ├── TexasGameRoomDataPlayer.ts       # 单座位数据
│   │       ├── TexasGameRoomDataPlayerMine.ts   # 本人全局状态
│   │       └── model/Operator.ts                # 操作倒计时模型
│   ├── trade/
│   │   ├── TradeStore.ts / TradeStoreUtils.ts   # 商城（USDT 价格/支付方式）
│   └── user/
│       ├── UserStore.ts / UserStoreUtils.ts     # 用户基础信息 + 钱包/信用列表
├── game/
│   ├── constant/AnimateDisplayType.ts           # 动画类型枚举
│   ├── constant/BringInChipsType.ts             # 带入类型 + BringInMode
│   ├── entrance/
│   │   ├── AGameplayEntrance.ts                 # 入口基类
│   │   ├── AGamelayEntranceProvider.ts          # 入口工厂
│   │   ├── TexasGameplayEntrance.ts             # 德州入口
│   │   └── MttTexasGameplayEntrance.ts          # MTT 入口
│   ├── procedure/
│   │   ├── ProcedureBase.ts / ProcedureManager.ts / ProcedureDefine.ts
│   │   └── ProcedureReturn.ts                   # 离桌回 H5（h5Navigate / h5Show）
│   └── util/GameplayUtil.ts
├── net/
│   ├── messages/
│   │   ├── MessageHandler.ts                    # 按 code 范围分发到各游戏类型
│   │   └── texas/
│   │       ├── TexasMessageHandler.ts           # 德州消息 switch + leaving 锁防护
│   │       ├── EnterRoom.ts                     # 进房（异步，负责场景切换）
│   │       ├── Seated.ts / SeatedOthers.ts      # 坐下
│   │       ├── Standup.ts / StandupActive.ts    # 站起
│   │       ├── Leave.ts / LeaveNotification.ts  # 离桌
│   │       ├── ActionAll.ts / Action.ts         # 操作
│   │       ├── ChipsChange.ts / StoreChips.ts   # 筹码
│   │       ├── PublicCards.ts / Showcards.ts    # 牌
│   │       ├── HandClear.ts / StartInfo.ts      # 手牌起止
│   │       ├── KeepSeat.ts / KeepSeatActive.ts  # 留座
│   │       └── …（每条服务端消息一个文件）
│   ├── websocket/
│   │   ├── ProtocolAgency.ts                    # WS 网关（通过 H5MsgMgr 代理收发）
│   │   └── CodeMessage*GC.ts                    # 各玩法 code 映射
│   └── https/                                   # WWW.Instance.CommonAPI 体系
├── views/
│   ├── UIViewManager.ts                         # 场景/对话框/Toast/Preloading 总管
│   ├── UIPrefabDefinition.ts                    # 所有 Prefab 注册表
│   ├── base/UIComponentBase.ts / UIComponentDialogBase.ts
│   ├── loader/AssetManager.ts
│   ├── util/UIViewUtil.ts                       # 坐标转换等
│   ├── widget/                                  # CardView / RemoteSprite / SwitchNode / ToastNode / ShiningPathTimer …
│   ├── dialog/
│   │   ├── bringin/
│   │   │   ├── UIBringIn.ts                     # 带入对话框（泛型多玩法）
│   │   │   ├── provider/BringInProvider.ts      # 抽象 Provider
│   │   │   ├── provider/BringInProviderTexas.ts # 德州实现
│   │   │   └── usdtdiamond/USDTDiamond.ts ...
│   │   ├── confirm/UIConfirmDialog.ts
│   │   ├── security/UIGameplaySecuritySetting.ts
│   │   ├── texassettings/UIGameplayTableSetting.ts
│   │   └── rechargediamond/UIRechargeDiamond.ts
│   └── scene/room/texas/
│       ├── UIRoomTexas.ts                       # 牌桌场景根
│       ├── UITexasMenu.ts                       # 侧边菜单（带入/站起/规则/showBB…）
│       ├── SeatManager.ts                       # 座位容器（订阅 SEATS_CHANGE/BUTTON_CHANGE）
│       ├── SeatPlayer.ts                        # 单座位（旧名 Seat.ts）
│       ├── SeatAction.ts                        # 操作浮窗（fold/call/raise 标签）
│       ├── PublicCardsInfo.ts / PotsInfo.ts / RoomInfo.ts
│       └── events/TexasTableEvent.ts            # 牌桌业务入口（Sitdown/Standup/BringIn/LeaveRoom）
├── i18n/i18nMgr.ts / CPErrorCode.ts
├── helper/StringHelper.ts / TimeHelper.ts
├── H5MsgMgr.ts                                  # H5↔Cocos 桥接（握手 + WS 代理 + UI 控制），import type 自 @silenthill/h5-cc-bridge/cc-side（详见 §8.5）
├── Main.ts / MainUtils.ts
└── protobuf/                                    # pb 自动生成
```

---

## 12. 添加新功能的标准步骤

### 场景 A：服务端新增一个"玩家余额刷新"广播消息

**Step 1：数据层** — 复用已有字段（`chip` 已是 `@observable('CHIPS_CHANGE')`）。

**Step 2：消息层** — 新建 `net/messages/texas/ChipsRefresh.ts`：
```typescript
export function ChipsRefresh(data: ..., roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    const seatPlayer = roomData.seatsStateManager.getSeatPlayer(data.seatId);
    seatPlayer.chip = data.chip;   // @observable 自动 emit
}
```

**Step 3：消息路由** — 在 `TexasMessageHandler.ts` 顶部 `import { ChipsRefresh }`，并在 `switch` 中加一个 `case`。

**Step 4：视图层** — 无需改动，`SeatPlayer.onUpdateChip` 通过 `@bindEvent('CHIPS_CHANGE', 'player')` 已订阅，会自动刷新（且经 `setting.showNumberWithShowBB` 转格式）。

### 场景 B：新增带动画的全新状态

**Step 1：数据层** — 在 `TexasGameRoomDataPlayer.ts` 添加：
```typescript
public static readonly NEW_STATE_CHANGE = 'NEW_STATE_CHANGE';

@observable(TexasGameRoomDataPlayer.NEW_STATE_CHANGE)
public newState: number = 0;
```
如果想让首屏带额外参数（如 mine、isSelf）：
```typescript
@observable(TexasGameRoomDataPlayer.NEW_STATE_CHANGE, {
    initParams() { return [this.mine]; }
})
```

**Step 2：动画枚举** — 在 `AnimateDisplayType.ts`：
```typescript
export enum AnimateDisplayTypeNew { Static = 0, Animated = 1 }
```
并把它添加到 `PlayerAnimBindings` 泛型：
```typescript
type PlayerAnimBindings = {
    newState: [AnimateDisplayTypeNew];   // ← 新增
    // ... 其他已有的
};
```
框架自动生成 `setNewState(value: number, animType: AnimateDisplayTypeNew)` 强类型方法。

**Step 3：消息层** — 调用 setter：
```typescript
seatPlayer.setNewState(data.value, AnimateDisplayTypeNew.Animated);
```

**Step 4：视图层** — 在 `SeatPlayer.ts`：
```typescript
@bindEvent(TexasGameRoomDataPlayer.NEW_STATE_CHANGE, 'player', AnimateDisplayTypeNew.Static)
private onNewStateChange(value: number, animType: AnimateDisplayTypeNew) {
    if (animType === AnimateDisplayTypeNew.Animated) { /* 播放动画 */ }
    else { /* 直接刷新 */ }
}
```

### 场景 C：新增一个对话框

1. 在 `views/dialog/xxx/UIXxx.ts` 实现 `UIComponentBaseDialog<Param>` 子类。
2. 在 `views/UIPrefabDefinition.ts` 的 `UIPrefabDialog` 表里加一项（含 `UIType` / `Path`）。
3. 业务代码里调 `viewManager.openDialog('Xxx', param)` —— IDE 会根据 `UIPrefabDialogType` 自动校验 key 与 param 类型。

### 场景 D：与 H5 新增一种数据/控制消息

协议层已经抽到独立仓库 [@silenthill/h5-cc-bridge](https://github.com/soolary/h5-cc-bridge)，h5-game 和 h5-cc-game 共用同一份类型。新增 action 不要直接改 `H5MsgMgr.ts`。

1. 去 `@silenthill/h5-cc-bridge` 仓库 `src/actions.ts` 把动作加进 `CC_TO_H5_ACTIONS` 或 `H5_TO_CC_ACTIONS`；payload 类型加进 `src/cocosToH5.ts` 或 `src/h5ToCocos.ts`，并补进对应的 `CocosToH5PayloadMap` / `H5ToCocosPayloadMap`。
2. `cd @silenthill/h5-cc-bridge && npm run build && git commit && git push` 推到 main（或者打 tag 上线）。
3. 本仓库和 h5-game 都 `npm install`（pnpm 用户：`pnpm install`）拉到最新 git ref 的包就能拿到同样的类型。如果 ref 已经写死成 tag/SHA，把 `package.json` 里的 `#<ref>` 换成新版本再 install。
4. CC → H5：`h5MessageManager.sendToH5<'xxx'>('xxx', 1, payload)`——action 用**字符串字面量**，不要用 `BRIDGE_ACTION.XXX`（详见 §8.5 硬性约束）。
5. H5 → CC：`h5MessageManager.on<'xxx'>('xxx', payload => { ... })`。

---

## 13. 重构演进对比

| 维度 | 原始版本（pokerqueen） | 当前版本（h5-cc-game） |
|------|------------------------|------------------------|
| 消息处理 | 消息处理器直接操作 UI 节点 | 纯函数，只写数据，不碰 UI |
| 数据来源 | 分散在 GameCache、UITexas、各 handler 中 | 统一在 `TexasGameRoomData` 子对象 + 全局 `userStore`/`tradeStore` |
| 可观察字段声明 | 手写三件套：常量 + 私有字段 + getter/setter + emit | `@observable('EVT')` 一行 |
| 带参 setter | 手写独立方法 + 手写 emit | 框架自动生成强类型 `setXxx(value, ...args)` |
| 纯通知事件 | 手写 `emit` | `@pureEvent` 装饰器自动 emit，可声明 `initParams` |
| 批量更新 | 无 | `muteEvents/unmuteEvents` 静音阀门 |
| 脏值检查 | 手写 `if old == new return` | 框架内置 `normal` / `arrayAsSet`，可自定义 `shouldEmit` |
| UI 事件注册 | 手写 `_bindEventsAndRefresh`（逐一 on + 逐一回调） | `@bindEvent` 声明 + `autoBindEvents` 一键完成 + 首屏回放 |
| 多数据源协同 | 难（不同状态分散在多个 manager） | 同一组件 `autoBindEvents({ player, setting, mine, ... })`，自动重绑保护 |
| 解绑 | 手写 `targetOff` | `unBindEvents(...keys)` / `unBindEventsAll(component)` |
| 进房 | 需要特殊处理 | 切场景 → `autoBindEvents` 首屏回放当前数据 |
| 断线重连 | 需要特殊处理 | 不切场景；`SyncEnter` 写入 `roomData`，`@observable` setter 逐字段 emit，UI 差量刷新（§9.3） |
| 动画触发 | 硬编码在消息处理逻辑内 | AnimateDisplayType 枚举解耦，消息层声明意图，视图层执行 |
| 离开房间 | 直接处理，僵尸消息易导致 UI 错乱 | `RoomDataManager.startInternalLeaveLock` + 消息层闸门 |
| 对话框/场景管理 | 散落各处 | `UIViewManager` + `UIPrefabDefinition` 注册表 |
| 业务点击事件 | 散落在各 Seat / Menu 内 | 统一收到 `TexasTableEvent`（旧 `SeatEvent`）的静态方法 |
| H5↔Cocos | 通过裸 `window.postMessage` 拼接字符串 | `H5MsgMgr` 带握手、缓冲队列、泛型类型映射、二进制信封 |
| 组件复用 | 难（依赖大量全局状态） | 易（只需传入数据对象引用） |
| 视图组件刷新 | 父组件命令式 `panel.startXxx(...)` / `panel.show()` | 数据驱动自治（见 5.5）：父组件 `initData(数据引用)` 一次后就退场，组件自己 `@bindEvent` 决定显隐与刷新 |
