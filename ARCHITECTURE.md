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
   - 7.4 [资源加载管线：AssetManager + 预加载体系](#74-资源加载管线assetmanager--预加载体系)
8. [H5 桥接层：H5MsgMgr](#8-h5-桥接层h5msgmgr)
9. [进房 / 离房流程](#9-进房--离房流程)
   - 9.4 [Agora 音视频链路](#94-agora-音视频链路)
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
│    ├─ setting           : TexasGamePersonalSettings（全局单例） │
│    ├─ potInfo           : TexasGameRoomDataPotInfo              │
│    ├─ publicCards       : TexasGameRoomDataPublicCards          │
│    ├─ roundState        : TexasGameRoomDataRoundState           │
│    ├─ seatsStateManager : TexasGameRoomDataSeatsStateManager    │
│    │     └─ TexasGameRoomDataPlayer × N (cc.EventTarget)        │
│    ├─ mine              : TexasGameRoomDataPlayerMine           │
│    └─ report            : TexasGameRoomDataReport               │
│  · 全局：userStore / tradeStore / texasGamePersonalSettings      │
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
    public readonly setting           = texasGamePersonalSettings;
    public readonly potInfo           = new TexasGameRoomDataPotInfo();
    public readonly publicCards       = new TexasGameRoomDataPublicCards();
    public readonly roundState        = new TexasGameRoomDataRoundState();
    public readonly seatsStateManager = new TexasGameRoomDataSeatsStateManager(this);
    public readonly mine              = new TexasGameRoomDataPlayerMine(this);
    public readonly report            = new TexasGameRoomDataReport(this);
}
```

几个关键子对象：
- **`setting`** — 指向全局单例 `texasGamePersonalSettings`，保存跨牌桌共享的个人设置（如 `showBB`、桌布、牌面、声音、快捷下注）。视图层订阅它实现"显示模式切换"，与服务端数据完全解耦。
- **`mine`** — 当前玩家的全局状态（钱包、藏钱、保险、坐下后绑定到对应 `TexasGameRoomDataPlayer.mine`）。独立于座位列表，避免坐下/站起反复重建。
- **`report`** — 牌桌战绩面板数据，聚合 `Roomers`、`Winner`、`PlayerJackpotSummary` 以及本地坐下/站起/筹码变动产生的统计。

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
            ├─ code 4001-4999 → GuandanMessageHandler
            ├─ code 3001-3999 → MahjongMessageHandler
            ├─ code 2001-2999 → CowboyMessageHandler
            ├─ code 1201-1399 → FantasyMessageHandler
            ├─ code 1001-1199 → TexasMessageHandler.handle()
            │       └─ switch(code) → EnterRoom / Seated / StartInfo / ActionAll / …
            └─ code < 1000    → OtherMessageHandler
```

> 注意：代码中按 code 从大到小 `if-else` 链判断，第一个匹配即返回。

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

`Seat.ts` 已更名为 **`SeatPlayer.ts`**。同一组件可同时订阅多个数据源 —— `player`（座位玩家）、`setting`（全局个人设置 `texasGamePersonalSettings`）、`mine`（坐下后的本人数据）：

```typescript
public initData(seatPlayer: TexasGameRoomDataPlayer, potNode: cc.Node, dealNode: cc.Node) {
    this._seatPlayer = seatPlayer;
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
    autoBindEvents(this, { player: this._seatPlayer, setting: texasGamePersonalSettings });
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
    this.chips.string = this._seatPlayer.roomData.basicInfo.showNumberWithShowBB(chip);
}

@bindEvent(TexasGamePersonalSettings.SHOW_BB, { dataSource: 'setting', initPriority: 99 })
private onUpdateShowBB() {
    const basicInfo = this._seatPlayer.roomData.basicInfo;
    this.chips.string = basicInfo.showNumberWithShowBB(this._seatPlayer.chip);
    this.roundBetLabel.string = basicInfo.showNumberWithShowBB(this._seatPlayer.roundBet);
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
    MushroomIntroduction:    { UIType: UIGuideDialog,              Bundle, Path: 'rc/dialog/mushroomandcriticalhit/UIGuideDialog' },
    CriticalHitIntroduction: { UIType: UIGuideDialog,              Bundle, Path: 'rc/dialog/mushroomandcriticalhit/UIGuideDialog' },
    SquidIntroduction:       { UIType: UIDialogSquid,              Bundle, Path: 'rc/dialog/squid/UIDialogSquid' },
    SquidOver:               { UIType: UISquidEnd,                 Bundle, Path: 'rc/dialog/squidover/UISquidOver' },
    ConfirmOrNotice:         { UIType: UIConfirmDialog,            Bundle, Path: 'rc/dialog/confirm/UIConfirmDialog' },
    TexasTableSetting:       { UIType: UIGameplayTableSetting,     Bundle, Path: 'rc/dialog/settings/UIGameplayTableSetting' },
    TexasTableSecurity:      { UIType: UIGameplaySecuritySetting,  Bundle, Path: 'rc/dialog/security/UIGameplaySecuritySetting' },
    BuyInsurance:            { UIType: UIInsuranceNewPanel,        Bundle, Path: 'rc/dialog/insurance/UIInsuranceNewPanel' },
    BringIn:                 { UIType: UIBringIn,                  Bundle, Path: 'rc/dialog/bringin/UIBringIn' },
    BringOut:                { UIType: UIBringOut,                 Bundle, Path: 'rc/dialog/bringin/UIBringIn' },
    RechargeDiamond:         { UIType: UIRechargeDiamond,          Bundle, Path: 'rc/dialog/rechargediamond/UIRechargeDiamond' },
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

### 7.4 资源加载管线：AssetManager + 预加载体系

`views/loader/AssetManager.ts` 是 Prefab 之外所有零散资源（贴图 / 音效 / Spine）的统一入口。核心是**三个语义不同的访问 API**，调用方按"资源何时进内存"选用，不能混用：

| API | 同步/异步 | 语义 | 资源未加载时 |
|-----|----------|------|--------------|
| `getOrLoad(bundle, path, type)` | async | 按需动态加载（bundle 未加载会先 `loadBundle`） | 走 `bundle.load` 拉取 |
| `mustGetLoaded(bundle, path, type)` | sync | **断言**该资源已在预加载阶段进入内存 | `throw`（属于编程错误，说明预加载清单漏配） |
| `getAsset(collection, name)` | sync | 从 `AssetCollectionType` 集合索引取 | `throw` |

`mustGetLoaded` 服务于**同步渲染路径**：`@bindEvent` 回调里刷 UI 不能 `await`（例如 `SeatPlayer.onVideoMaskChanged` 取 `rc/other/videomask/vm{maskId}` 窗花贴图）。这类资源必须放进 `rc/` 预加载目录；如果想"顺手动态加载"，应改用 `getOrLoad` 并接受异步时序。

#### 7.4.1 启动预加载：PreloadDefinition / DynamicLoadDefinition

`ProcedureInit.lateEnter()` 通过 `viewManager.showPreloading(params)` 触发首屏预加载，实际执行者是 `UIPreloadingComponent.onShow`。清单项有两种形态：

```typescript
// 目录全量预载（带进度条）
export const PreloadDefinitionGame:  PreloadDefinition = { bundle: BUNDLE_RESOURCES, dir: 'rc',    collection: true };
export const PreloadDefinitionSound: PreloadDefinition = { bundle: BUNDLE_RESOURCES, dir: 'sound', collection: true };

// 任意异步任务（无进度，并行执行）
const loadTexasBg: DynamicLoadDefinition = {
    AsyncFunc: async () => { dlTexasRoomBackground.getBackground(texasGamePersonalSettings.deskType); }
};

viewManager.showPreloading({
    preloadDefinition: [PreloadDefinitionGame, PreloadDefinitionSound, loadTexasBg],
    complete: () => this._resolveDone(true),
});
```

`UIPreloadingComponent.onShow` 的调度策略：**`DynamicLoadDefinition` 立即全部触发（并行轨道）；`PreloadDefinition` 逐个 `loadDir` 串行排队（进度条按份数均分）**；两条轨道 `Promise.all` 汇合后才回调 `complete`。`ProcedureInit.Leave()` 会 `await` 这个完成信号，保证进入后续流程时 `rc/`、`sound/` 已全量在内存。

#### 7.4.2 AssetCollectionType 集合索引

`collection: true` 的目录加载完成后，`AssetManager.assetForeach()` 扫描其中的 Prefab：凡挂了 `AssetLoader` 组件（`views/loader/AssetLoader.ts`，只有一个 `collection` 枚举属性）的 Prefab，其**子节点上的 `cc.Sprite.spriteFrame` / `cc.AudioSource.clip` 会以 `` `${collection}|${子节点名}` `` 为 key 存入静态 Map**。

这套机制把"一批同类资源"（两套牌面、桌面小图标、全部音效）在编辑器里组织成一个 collection Prefab，运行时用 `getAsset(AssetCollectionType.Xxx, name)` 同步索引，避免逐张 load 也避免手工维护路径表。`AssetTypeMapping` 泛型映射让每个 collection 的返回类型自动收窄（`AudioSourceSound → cc.AudioClip`）。

当前消费方：`SoundManager`（音效 clip）、`CardView` / `PokerCardTypeItem`（牌面 SpriteFrame）、保险/战绩等面板的桌面小图标。

#### 7.4.3 resources bundle 目录约定

| 目录 | 加载策略 | 内容 |
|------|---------|------|
| `rc/` | 启动预加载（`PreloadDefinitionGame`） | UI Prefab、常驻贴图（含 `rc/other/videomask/` 窗花）——`mustGetLoaded` 只允许指向这里 |
| `sound/` | 启动预加载（`PreloadDefinitionSound`） | 音效 collection Prefab |
| `dynamic/` | 不预加载，按需 `getOrLoad` | 大体积可选资源，如桌布 `dynamic/table/desk*` 及其 Spine 动画 |

桌布是"按需 + 预热"结合的例子：`DLTexasRoomBackground.getBackground(deskType)` 用 `getOrLoad` 动态拉取 `dynamic/table/desk{n}`（可带 Spine `animationPath`）；同时 `ProcedureInit` 把**当前设置的桌布**作为 `DynamicLoadDefinition` 混入启动预加载并行预热，进桌时通常已就绪，切换桌布才产生真实的动态加载等待。

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

### 8.6 其他外部 npm 依赖

除 `@silenthill/h5-cc-bridge` 外，项目还有两个从老项目提取的运行时 npm 包依赖，以及一个只用于类型提示的 Agora SDK 包：

| 包名 | 用途 | 运行时约束 |
|------|------|-----------|
| `@silenthill/agreement-web` | 协议 Code 枚举 + protobuf 类型定义 | 运行时可 import，包已构建为 UMD/CJS 可用格式 |
| `@silenthill/h5-cc-i18n` | 多语言运行时 + 翻译资源 | 运行时可 import |
| `agora-rtc-sdk-ng` | Agora Web SDK 类型定义 | 只允许 `import type`，运行时不从 `node_modules` 加载 |

```jsonc
// package.json
"dependencies": {
    "@silenthill/agreement-web": "github:kingofake/agreement-web#master",
    "@silenthill/h5-cc-bridge":  "github:soolary/h5-cc-bridge#main",
    "@silenthill/h5-cc-i18n":    "github:guysoup027/h5-cc-i18n#main"
},
"devDependencies": {
    "agora-rtc-sdk-ng": "4.24.5"
}
```

**`@silenthill/agreement-web`**：消息层通过 `import { Code } from '@silenthill/agreement-web'` 引用协议码枚举，`TexasMessageHandler.ts` 的 `switch(code)` 用的就是这里的 `Code.MSG_D_ENTER_ROOM` 等常量。`Code` 是运行时值，可通过 Cocos 的 `require` 解析（`agreement-web` 已构建为 UMD/CJS 可用格式）。

**`@silenthill/h5-cc-i18n`**：提供 `i18n` 翻译函数和语言资源，`i18n/i18nMgr.ts` 内部调用。

**`agora-rtc-sdk-ng`**：只作为 TypeScript 类型来源。Cocos Creator 运行时不能直接解析 `node_modules` 里的 Agora SDK，因此实际 SDK 仍由 `MainUtils.loadWebSDK()` 注入 `https://download.agora.io/sdk/release/AgoraRTC_N-4.24.5.js`，`AgoraManager.init()` 通过 `window.AgoraRTC` 创建 client。`assets/custom.d.ts` 使用 `import type AgoraRTC from 'agora-rtc-sdk-ng'` 给 `Window.AgoraRTC` 做全局类型增强，业务代码不要写运行时 `import AgoraRTC from 'agora-rtc-sdk-ng'`。

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

### 9.4 Agora 音视频链路

Agora 只服务视频/语音防作弊房间。`GameConfig.agoraKey` 非空时 `enableAgora` 为 true，`ProcedureInit.lateEnter()` 会调用 `MainUtils.loadWebSDK()` 动态插入 Agora Web SDK 脚本；脚本加载完成后执行 `agoraManager.init(GameConfig.agoraKey)`。如果 `agoraKey` 为空，SDK 加载和初始化都会跳过。

运行时链路：

```
ProcedureInit.lateEnter()
    └─ MainUtils.loadWebSDK()
          ├─ 注入 AgoraRTC_N-4.24.5.js
          └─ onload → agoraManager.init(GameConfig.agoraKey)
                    ├─ window.AgoraRTC.createClient({ mode:'rtc', codec:'vp8' })
                    └─ 注册 user-published / user-unpublished / user-left / connection-state-change 等事件

TexasGameplayEntrance.requestEnterAsync()
    └─ antiCheatType 为 VIDEO/AUDIO 时写入 roomData.basicInfo.antiCheatConfig

EnterRoom.ts / Seated.ts
    ├─ getSeatedSetting()
    ├─ enableCamera() / enableMicrophone()
    └─ TexasVideoMediaHelper.joinAgoraVideoChannelIfNeed(roomID, matchID)
          ├─ 旧频道未退出时先 disableCamera / disableMicrophone / clearCallbacks / leave
          ├─ 绑定 Agora 回调到当前 roomID + matchID
          ├─ channelName = rtc_d_{tableCategory}-{matchID}-{roomID}
          ├─ fetchToken() → WebMiscAgoraToken
          ├─ client.join(appId, channelName, token, userRID)
          └─ startVolumeMonitor()
```

**模式配置：VideoAntiCheatConfig**（`game/constant/VideoModel.ts`）。入口层把服务端防作弊配置解析成 `VideoAntiCheatConfig` 写入 `roomData.basicInfo.antiCheatConfig`，它是音视频所有初始状态的唯一来源：

| `VideoModel` | 语义 | 坐下时的默认行为（`getSeatedSetting()`） |
|--------------|------|------------------------------------------|
| `FULL_TIME` (1) / `FORCE` (4) | 全时长 / MTT 强制 | 摄像头+麦克风强制开启且不可关，节能（窗花）按服务端配置 |
| `RANDOM` (2) | 随机验证 | 默认全关，由 `AntiCheatRoomVideo` 消息触发临时开启（`randomVideoActive`） |
| `SEQUENCE` (3) | 麦序 | 默认全关，轮到操作时由 `ActionAll.ts` 开/关（`isOrderMode` 判定） |
| `HUMAN` (6) / `EFFECT` (5) | 真人 / 特效 | 开关初值与可操作性全部来自服务端逐项配置（micSeat/videoSeat/powerSaving…） |

`antiCheatType` 区分实时语音（2，只开麦）与实时视频（3）；`getSeatedSetting()` 的返回值由 `EnterRoom.ts` / `Seated.ts` 消费，落到 §9.4.1 表中的 `localCameraBtnState` / `localMicrophoneBtnState` / `maskBtnState` 等初值——之后的一切状态变化都走那张表的数据链，模式配置本身不再被 UI 直接读取。

`AgoraManager` 是 SDK 适配层：负责 client 生命周期、token 获取与续期、join/leave、本地音视频 track 创建与发布、远端音视频 subscribe/unsubscribe、SDK 事件转发、音量轮询和 SDK 内置重连状态处理。当前保留既有方法名 `publishVidio()`，只作为文档记录，不在这里做 API 清理。

`TexasVideoMediaHelper` 是德州房间和 Agora 之间的数据落点。SDK 回调不直接控制节点，只更新 `RoomData`：

- `user-published(video)`：如果本地远端视频开关为 ON，订阅远端视频并设置对应座位 `remoteVideoVisible = true`；节能/窗花开启时设置 `realShowMaskID`。
- `user-published(audio)`：订阅远端音频并 `track.play()`，按本地远端麦克风开关设置音量和 `micIconState`。
- `user-unpublished(video)` / `user-left`：清掉 `remoteVideoVisible`、`realShowMaskID`、`micIconState`。
- `onActiveSpeaker`：写入 `roomData.seatsStateManager.speakingUID`。

#### 9.4.1 视频/语音状态变量

音视频不是单一开关，而是“按钮状态 → 期望状态 → Agora 操作 → 渲染状态”的数据链。不同变量控制不同层，不能混用：

| 数据字段 | 所属对象 | 主要写入方 | 主要消费方 | 控制内容 |
|----------|----------|------------|------------|----------|
| `localCameraBtnState` | `TexasGameRoomDataPlayerMine` | `EnterRoom.ts` / `Seated.ts` 初始化，`OtherBindings.onClickLocalCameraBtn()` 点击切换 | `OtherBindings.onLocalCameraStateChanged()` | 本地摄像头按钮是否可点、图标 ON/OFF/DISABLE；同时派生 `localCameraEnabled` 和 `maskBtnState` |
| `localCameraEnabled` | `TexasGameRoomDataPlayerMine` | `localCameraBtnState` 变化、强制视频配置、麦序结束 `ActionAll.ts` | `OtherBindings.onEnableDisableCamaera()` | 本地摄像头的期望状态；调用 `agoraManager.localVideoTrack.setMuted()` 或 `agoraManager.publishVidio()` |
| `localCameraEnabledDelayed` | `TexasGameRoomDataPlayerMine` | `OtherBindings.onEnableDisableCamaera()` 在 Agora mute/publish 前后更新 | `SeatPlayer.onLocalCameraStateChanged()` | 本地头像视频的真实渲染开关；true 才从 `localVideoTrack` 取 track 渲染，false 立即 `stopOverlay()` |
| `localMicrophoneBtnState` | `TexasGameRoomDataPlayerMine` | `EnterRoom.ts` / `Seated.ts` 初始化，`OtherBindings.onClickLocalMicrophoneBtn()` 点击切换 | `OtherBindings.onLocalMicrophoneEnabledChanged()` | 本地麦克风按钮是否可点、图标 ON/OFF/DISABLE；派生 `localMicrophoneEnabled` |
| `localMicrophoneEnabled` | `TexasGameRoomDataPlayerMine` | `localMicrophoneBtnState` 变化、强制语音配置、麦序结束 `ActionAll.ts` | `OtherBindings.onEnableDisableMicrophone()` | 本地麦克风的期望状态；调用 `setMuted()` 或 `publishAudio()`，并更新本人座位 `micIconState` |
| `remoteCameraEnabled` | `TexasGameRoomDataPlayerMine` | `EnterRoom.ts` / `Seated.ts` 初始化，远端视频开关按钮 | `OtherBindings.onRemoteCameraChanged()`、`TexasVideoMediaHelper.onUserPublish(video)` | 远端视频总开关；ON 时订阅远端 video 并写 `remoteVideoVisible`，OFF 时先隐藏头像视频和 mask 再 unsubscribe，HIDDEN 时隐藏 UI 控件 |
| `remoteMicrophoneEnabled` | `TexasGameRoomDataPlayerMine` | `EnterRoom.ts` / `Seated.ts` 初始化，远端语音开关按钮 | `OtherBindings.onRemoteMicrophoneChanged()`、`TexasVideoMediaHelper.onUserPublish(audio)` | 远端语音总开关；ON 时订阅/播放并设音量 100，OFF 时音量设 0 并显示静音图标，HIDDEN 时隐藏 UI 控件 |
| `videoMaskId` | `TexasGameRoomDataPlayer` | `EnterRoom.ts` / `Seated.ts` / `SeatedOthers.ts` / `VideoMaskChange.ts` / 本地窗花按钮 | `realShowMaskID` 的计算逻辑 | 用户选择的窗花编号；不是渲染开关，变化本身不会直接刷新 UI |
| `realShowMaskID` | `TexasGameRoomDataPlayer` | 视频开关、远端发布/隐藏、坐下广播、窗花变更 | `SeatPlayer.onVideoMaskChanged()` | 当前真正显示的窗花编号；大于 0 时 `switchToMask()`，等于 0 时 `stopMask()` |
| `remoteVideoVisible` | `TexasGameRoomDataPlayer` | `TexasVideoMediaHelper`、`OtherBindings.onRemoteCameraChanged()`、离开/站起清理 | `SeatPlayer.onRemoteVideoVisibleChanged()` | 远端头像视频 overlay 的渲染开关；true 渲染远端 track，false `stopOverlay()` |
| `micIconState` | `TexasGameRoomDataPlayer` | 本地/远端麦克风开关、远端 publish/unpublish/left | `SeatPlayer.onMicrophoneIconStateChanged()` | 座位麦克风图标显示状态 |
| `maskBtnState` | `TexasGameRoomDataPlayerMine` | 视频桌初始化、本地摄像头按钮变化 | `OtherBindings.onMaskBtnState()` | 只控制窗花/节能按钮 UI 是否可点和图标，不直接控制窗花显示 |
| `randomVideoActive` / `randomVideoEndTime` | `TexasGameRoomDataPlayerMine` | `AntiCheatRoomVideo.ts` 随机验证消息、清理流程 | 随机验证 UI/提示 | 随机视频验证状态，与头像视频渲染不是同一个开关 |

本地摄像头开启/关闭的完整链路：

```
点击摄像头按钮
    └─ localCameraBtnState = ON/OFF
          └─ OtherBindings.onLocalCameraStateChanged()
                ├─ 刷新摄像头按钮图标/灰态
                ├─ 按 canSwitchPowerSaving 设置本人 realShowMaskID 或清 0
                ├─ 设置 maskBtnState
                └─ localCameraEnabled = true/false
                      └─ OtherBindings.onEnableDisableCamaera()
                            ├─ 已有 localVideoTrack → setMuted(!enable)
                            ├─ 没有 track 且开启 → publishVidio()
                            └─ localCameraEnabledDelayed = enable
                                  └─ SeatPlayer.onLocalCameraStateChanged()
                                        ├─ true  → localVideoTrack.getMediaStreamTrack() → switchToOverlay()
                                        └─ false → stopOverlay()
```

这里 `localCameraEnabledDelayed` 是本地视频 render gate：关闭时先把它置 false，让头像视频立即停止，再静音 Agora track；开启时先让 Agora track 恢复/发布成功，再置 true 触发渲染。这样 UI 不会抢在 track 可用前去取 `getMediaStreamTrack()`。

远端视频开启/关闭的完整链路：

```
点击远端视频按钮
    └─ remoteCameraEnabled = ON/OFF
          └─ OtherBindings.onRemoteCameraChanged()
                ├─ ON  → 遍历 remoteUsers，必要时 subscribe video
                │        ├─ player.remoteVideoVisible = true
                │        └─ 可节能时 player.realShowMaskID = videoMaskId || 1
                └─ OFF → player.remoteVideoVisible = false
                         player.realShowMaskID = 0
                         subscribeOrUnsubscribeRemoteVideo(false, user)

远端新发布视频
    └─ Agora user-published(video)
          └─ TexasVideoMediaHelper
                ├─ remoteCameraEnabled == ON 才 subscribe video
                ├─ seat.remoteVideoVisible = true
                └─ 可节能时 seat.realShowMaskID = videoMaskId || 1
```

所以 `remoteCameraEnabled` 管的是“是否订阅/显示所有远端视频”，`remoteVideoVisible` 管的是“某个座位现在是否渲染头像视频”。`SeatPlayer` 不直接看 `remoteCameraEnabled`，它只看自己绑定的 `player.remoteVideoVisible`。

mask 和视频的关系：

- `videoMaskId` 是选择值，来自服务端座位数据、`VideoMaskChange` 广播或本地窗花按钮；`videoMaskId > 4` 会归一为 1。
- `realShowMaskID` 是显示值。只有当视频处于可显示场景且节能/窗花逻辑允许时，才把 `realShowMaskID` 设置为 `videoMaskId || 1`；视频关闭、远端隐藏、远端取消发布时统一清 0。
- `VideoMaskChange.ts` 只更新 `videoMaskId`；如果该玩家当前 `realShowMaskID > 0`，才同步更新 `realShowMaskID` 触发 UI 切换。也就是说，未显示 mask 时换窗花不会突然把 mask 打开。
- `SeatPlayer.onVideoMaskChanged()` 只响应 `realShowMaskID`。大于 0 时用 `AssetManager.mustGetLoaded` 从 `rc/other/videomask/vm{maskId}` 同步取已预加载的 `SpriteFrame` 并 `switchToMask()`（同步渲染路径不能 await，见 §7.4），小于等于 0 时 `stopMask()`。
- `maskBtnState` 不是 mask 渲染开关，它只控制操作区窗花按钮的可用状态和图标；真正是否显示窗花只看座位上的 `realShowMaskID`。
- mask 是 `AgoraVideoRender` 内的独立 sprite 覆盖层，`stopMask()` 不会停止 Agora track；头像视频 overlay 的启停仍由 `localCameraEnabledDelayed` 或 `remoteVideoVisible` 控制。

清理/结束路径也要走数据：

- `TexasVideoMediaHelper.clearAllMediaStates()` 在离桌/被动离开时禁用本地摄像头、麦克风、远端音视频开关，清随机视频状态，并重置所有座位的 `remoteVideoVisible` / `micIconState`。
- `SeatPlayer.onDisable()` 和座位 `SEATED_CHANGE=false` 时会 `stopMask()`、`stopOverlay()` 并隐藏麦克风图标，避免节点复用时残留上一位玩家的视频或窗花。
- `AgoraManager.leave()` 会停止远端音视频 track、关闭本地 track、停止音量监控；`joinAgoraVideoChannelIfNeed()` 在重新入会前也会先清旧频道、旧回调和旧 track。

#### 9.4.2 AgoraVideoRender 渲染链路

项目没有使用 Agora 的 DOM 容器直接播放视频，而是把 Agora track 转成 `MediaStreamTrack` 后渲染进 Cocos 头像节点：

```
本地视频：
TexasGameRoomDataPlayerMine.localCameraEnabledDelayed
    └─ SeatPlayer.onLocalCameraStateChanged()
          ├─ agoraManager.localVideoTrack.getMediaStreamTrack()
          ├─ avatarVideoRender.mirror = true
          ├─ avatarVideoRender.targetFps = 15
          └─ avatarVideoRender.switchToOverlay(track)

远端视频：
TexasGameRoomDataPlayer.remoteVideoVisible
    └─ SeatPlayer.onRemoteVideoVisibleChanged()
          ├─ agoraManager.getRemoteVideoTrack(userID).getMediaStreamTrack()
          ├─ avatarVideoRender.mirror = false
          ├─ avatarVideoRender.targetFps = 15
          └─ avatarVideoRender.switchToOverlay(track)
```

`AgoraVideoRender.switchToOverlay(track)` 的内部步骤：

1. 用递增的 `switchToken` 取消旧渲染，避免异步 `play()` 回来后覆盖新 track。
2. 创建 `MediaStream([track])`，绑定到隐藏的 `HTMLVideoElement`，设置 `playsinline`、`autoplay`、`muted`。
3. 等待 `video.play()` 和 metadata 就绪，读取视频尺寸，创建 `cc.Texture2D` 和 `cc.SpriteFrame`。
4. `videoSprite.spriteFrame = spriteFrame`，显示头像视频层，并按 `mirror` 设置 `scaleX`。
5. `update(dt)` 按 `targetFps` 节流，循环 `texture.initWithElement(video)` + `handleLoadedTexture()`，再标记 sprite 顶点脏；连续渲染异常达到阈值后自动 `stopOverlay()`。

停止或切换视频时，`stopOverlay()` 会递增 `switchToken`、暂停 video、断开 `srcObject`、清空 `videoSprite.spriteFrame`，并销毁当前 `Texture2D` / `SpriteFrame`；组件销毁时还会移除隐藏的 video element。这个清理顺序很重要，否则旧 track 或旧纹理容易残留在头像区域。

窗花/节能是独立覆盖层：`TexasGameRoomDataPlayer.realShowMaskID` 变化触发 `SeatPlayer.onVideoMaskChanged()`，从 `rc/other/videomask/vm{maskId}` 取 `SpriteFrame` 后调用 `avatarVideoRender.switchToMask()`。`stopMask()` 只隐藏窗花 sprite，不影响 Agora track 和头像视频 overlay。

#### 9.4.3 手动验证要点

当前没有自动化音视频测试，验证以浏览器权限和双客户端实测为主：

- 初始化：确认 `[WebSDK]`、`Client 初始化完成`、安全上下文和媒体设备日志正常。
- 入会：视频/语音防作弊房间坐下后确认 `加入频道成功`，token 获取和续期无报错。
- 本地发布：切换摄像头/麦克风按钮，观察 `localCameraEnabledDelayed`、`localMicrophoneEnabled`、本地头像视频和麦克风图标。
- 远端订阅：双客户端测试 `远端用户发布` / `远端用户取消发布` / `远端用户离开`，确认 `remoteVideoVisible`、`micIconState` 和头像视频同步变化。
- 渲染：确认 `AgoraVideoRender` 开始渲染、头像视频更新、窗花覆盖可切换，本地镜像、远端不镜像。
- 清理：站起、离桌、断线重连后确认视频 overlay、窗花、音量监控和 Agora 回调不会残留。

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
├── config/
│   └── GameConfig.ts                    # 构建类型、端点、分辨率、FPS 等
├── core/
│   ├── SoundManager.ts                  # 音效管理
│   ├── decorator/
│   │   ├── DataBind.ts                  # 响应式框架：@observable/@pureEvent/@bindEvent/@bindData/autoBindEvents/unBindEvents(All)
│   │   └── LogTrace.ts                  # @traceClass / @traceMethod / createLogger
│   └── poker/
│       ├── PoerkCard.ts                 # 扑克牌数据结构
│       └── PokerUtil.ts                 # 牌型判断工具
├── data/
│   ├── BridgeStorage.ts                         # H5/CC 持久化桥接
│   ├── LocalStorage.ts / StorageKey.ts
│   ├── room/
│   │   ├── RoomData.ts                  # 基类（roomID/matchID）
│   │   ├── RoomDataManager.ts           # 房间数据仓库 + 离开锁
│   │   ├── RoomDataGenericConstraints.ts# 玩法→玩家类型映射（BringIn 泛型使用）
│   │   ├── mahjong/                     # 麻将数据层
│   │   │   ├── MahjongGameRoomData.ts
│   │   │   └── MahjongGameRoomDataBasic.ts
│   │   └── texas/
│   │       ├── TexasGameRoomData.ts             # 聚合根
│   │       ├── TexasGameRoomDataBasic.ts        # 房间基础信息 + 玩法开关（含原 TexasGameplayData）
│   │       ├── TexasGamePersonalSettings.ts     # 全局个人设置（showBB/桌布/牌面/声音/快捷下注）
│   │       ├── TexasGameRoomDataPotInfo.ts      # 底池
│   │       ├── TexasGameRoomDataPublicCards.ts   # 公共牌
│   │       ├── TexasGameRoomDataReport.ts       # 战绩面板数据
│   │       ├── TexasGameRoomDataRoundState.ts   # 回合状态
│   │       ├── TexasGameRoomDataSeatsStateManager.ts # 座位管理（seatsCount/重排/button）
│   │       ├── TexasGameRoomDataPlayer.ts       # 单座位数据
│   │       ├── TexasGameRoomDataPlayerMine.ts   # 本人全局状态
│   │       ├── load/DLTexasRoomBacground.ts     # 德州桌布动态加载（getOrLoad + 启动预热，§7.4.3）
│   │       └── model/Operator.ts                # 操作倒计时模型
│   ├── trade/
│   │   └── DiamondModel.ts / TradeStore.ts / TradeStoreUtils.ts # 商城/钻石配置/USDT 支付
│   └── user/
│       └── UserStore.ts / UserStoreUtils.ts     # 用户基础信息 + 钱包/信用列表
├── game/
│   ├── constant/                                # 游戏常量枚举（30+ 文件）
│   │   ├── AnimateDisplayType.ts                #   动画类型枚举
│   │   ├── AutoOpertaionType.ts                 #   自动操作类型
│   │   ├── BringInMode.ts                       #   带入模式（CURRENCY / DIAMOND / CREDIT）
│   │   ├── Constants.ts                         #   通用常量
│   │   ├── Mushroom.ts / Squid.ts               #   蘑菇/鱿鱼玩法配置
│   │   ├── LogicTypeConf.ts                     #   GameType 枚举（HOLDEM / MAHJONG / …）
│   │   ├── TexasGameStatus.ts                   #   德州游戏状态
│   │   └── …（AntiCheatType / CurrencyType / MatchType / TableType / VideoModel 等）
│   ├── entrance/
│   │   ├── AGameplayEntrance.ts                 # 入口基类
│   │   ├── AGamelayEntranceProvider.ts          # 入口工厂
│   │   ├── TexasGameplayEntrance.ts             # 德州入口
│   │   └── MttTexasGameplayEntrance.ts          # MTT 入口
│   ├── procedure/
│   │   ├── ProcedureBase.ts                     # 流程基类
│   │   ├── ProcedureManager.ts                  # 流程管理器（集中调度）
│   │   ├── ProcedureDefine.ts                   # 流程枚举（Idle/Init/EnterRoom/Return）
│   │   ├── ProcedureInit.ts                     # 初始化流程
│   │   ├── ProcedureIdle.ts                     # 空闲流程
│   │   ├── ProcedureEnterRoom.ts                # 进房流程
│   │   └── ProcedureReturn.ts                   # 离桌回 H5（h5Navigate / h5Show）
│   ├── RoomReconnectManager.ts                  # H5 WS 重连后请求 SyncEnter
│   └── util/GameplayUtil.ts
├── net/
│   ├── agora/
│   │   └── AgoraManager.ts                      # Agora 音视频管理
│   ├── messages/
│   │   ├── MessageHandler.ts                    # 按 code 范围分发到各游戏类型
│   │   ├── texas/                               # 德州消息（65 个文件）
│   │   │   ├── TexasMessageHandler.ts           #   switch + leaving 锁防护
│   │   │   ├── EnterRoom.ts                     #   进房（异步，负责场景切换）
│   │   │   ├── SyncEnter.ts / SyncHand.ts       #   断线重连/手牌同步快照
│   │   │   ├── Seated.ts / SeatedOthers.ts      #   坐下
│   │   │   ├── Standup.ts / StandupActive.ts    #   站起
│   │   │   ├── Leave.ts / LeaveNotification.ts  #   离桌
│   │   │   ├── ActionAll.ts / Action.ts         #   操作
│   │   │   ├── ChipsChange.ts / StoreChips.ts   #   筹码
│   │   │   ├── PublicCards.ts / Showcards.ts     #   牌
│   │   │   ├── HandClear.ts / StartInfo.ts      #   手牌起止
│   │   │   ├── KeepSeat.ts / KeepSeatActive.ts  #   留座
│   │   │   ├── BuyInsurance.ts / BuyInsuranceActive.ts / InsuranceOutsCards.ts / InsuranceTrigged.ts
│   │   │   ├── Winner.ts / Showdown.ts / SidePots.ts
│   │   │   ├── ForceVideo.ts / VideoMaskChange.ts / TexasVideoMediaHelper.ts
│   │   │   └── …（每条服务端消息一个文件，共 65 个）
│   │   ├── fantasy/                             # 幻想扑克消息（35 个文件）
│   │   │   └── FantasyMessageHandler.ts + FT*.ts
│   │   ├── cowboy/                              # 牛仔消息（23 个文件）
│   │   │   └── CowboyMessageHandler.ts + CB*.ts
│   │   ├── mahjong/                             # 麻将消息（47 个文件）
│   │   │   └── MahjongMessageHandler.ts + MJ*.ts
│   │   ├── guandan/                             # 掼蛋消息（41 个文件）
│   │   │   └── GuandanMessageHandler.ts + GD*.ts
│   │   └── other/                               # 跨游戏全局消息（64 个文件）
│   │       └── OtherMessageHandler.ts + Register / Heartbeat / RoomChangeNotify / …
│   ├── websocket/
│   │   ├── ProtocolAgency.ts                    # WS 网关（通过 H5MsgMgr 代理收发）
│   │   ├── OpCodeHelper.ts                      # OpCode 辅助
│   │   ├── PacketHead.ts                        # 报文头结构
│   │   ├── ServerErrorCode.ts                   # 服务端错误码
│   │   ├── CodeMessageTexasGC.ts                # 德州 code 映射
│   │   ├── CodeMessageFantasyGC.ts              # 幻想 code 映射
│   │   ├── CodeMessageCowboyGC.ts               # 牛仔 code 映射
│   │   ├── CodeMessageMahjongGC.ts              # 麻将 code 映射
│   │   ├── CodeMessageGuandanGC.ts              # 掼蛋 code 映射
│   │   └── CodeMessageOtherGC.ts                # 全局 code 映射
│   └── https/
│       ├── HttpClient.ts / HttpRequest.ts / HttpLink.ts / HttpErrorCode.ts
│       ├── WebHelper.ts / WebRequest.ts / WebRequestBase.ts / WebApiCacheCenter.ts
│       ├── HotUpdateConfigCache.ts
│       ├── data/                                # HTTP 协议模型
│       │   ├── room/   (HttpRoomBringInByIDProtocol / HttpRoomBringOutProtocol / HttpRoomUserMuteProtocol)
│       │   ├── user/   (HttpUserInfoProtocol / HttpUserWalletProtocol / HttpUserSetVideoMaskProtocol)
│       │   ├── usdt/   (HttpUSDT*Protocol × 6 + USDTTraderType)
│       │   └── other/  (WebResponseDataBase)
│       └── web_request/                         # 各功能 HTTP 请求类（25 个）
│           └── WebRequestUser / WebRequestRoom / WebRequestPay / WebRequestOrder / …
├── views/
│   ├── UIViewManager.ts                         # 场景/对话框/Toast/Preloading 总管
│   ├── UIPrefabDefinition.ts                    # 所有 Prefab 注册表
│   ├── base/
│   │   ├── UIComponentBase.ts                   # 组件基类
│   │   └── UIComponentDialogBase.ts             # 对话框基类
│   ├── loader/
│   │   ├── AssetManager.ts                      # 资源统一入口：getOrLoad/mustGetLoaded/getAsset + 预加载清单（§7.4）
│   │   └── AssetLoader.ts                       # collection Prefab 标记组件（AssetCollectionType）
│   ├── animate/
│   │   └── SpriteAnimationHelper.ts             # 帧动画辅助
│   ├── util/
│   │   ├── UIViewUtil.ts                        # 坐标转换等
│   │   └── ThrowPropManager.ts                  # 丢道具管理
│   ├── widget/                                  # 通用 UI 组件
│   │   ├── CardView.ts / RemoteSprite.ts / SwitchNode.ts / ToastNode.ts
│   │   ├── ShiningPathTimer.ts / CountDownLabel.ts / StepSlider.ts
│   │   ├── ToggleButton.ts / DisplayNode.ts / Mask.ts / CustomButton.ts
│   │   ├── SpriteSwitcher.ts
│   │   ├── AgoraVideoRender.ts                  # 头像视频渲染组件
│   │   └── …
│   ├── dialog/
│   │   ├── bringin/
│   │   │   ├── UIBringIn.ts                     # 带入对话框（泛型多玩法）
│   │   │   ├── UIClubSelect.ts                  # 俱乐部选择
│   │   │   ├── provider/BringInProvider.ts      # 抽象 Provider
│   │   │   ├── provider/BringInProviderTexas.ts # 德州实现
│   │   │   └── usdtdiamond/USDTDiamond.ts / USDTPaytype.ts
│   │   ├── bringout/UIBringInOut.ts             # 带出对话框
│   │   ├── confirm/UIConfirmDialog.ts
│   │   ├── insurance/UIInsuranceNewPanel.ts     # 保险购买面板
│   │   ├── mushroomandcriticalhit/UIGuideDialog.ts  # 蘑菇/暴击介绍
│   │   ├── personalsettings/UIPersonalSettings.ts / DeskTypeItem.ts / PokerCardTypeItem.ts
│   │   ├── report/UITexasReport.ts / UITexasReportPlayerInfo.ts
│   │   ├── squid/UIDialogSquid.ts               # 鱿鱼介绍
│   │   ├── squidover/UISquidEnd.ts / UISquidEndItem.ts  # 鱿鱼结算
│   │   ├── security/UIGameplaySecuritySetting.ts
│   │   ├── texassettings/UIGameplayTableSetting.ts
│   │   └── rechargediamond/UIRechargeDiamond.ts
│   └── scene/
│       ├── UIPreloadingComponent.ts             # 预加载执行器（串行 loadDir + 并行 AsyncFunc，§7.4.1）
│       ├── UIPromptComponent.ts                 # 网络提示
│       └── room/texas/
│           ├── UIRoomTexas.ts                   # 牌桌场景根
│           ├── UITexasMenu.ts                   # 侧边菜单（带入/站起/规则/showBB…）
│           ├── SeatManager.ts                   # 座位容器（订阅 SEATS_CHANGE/BUTTON_CHANGE）
│           ├── SeatPlayer.ts                    # 单座位（旧名 Seat.ts）
│           ├── SeatAction.ts                    # 操作浮窗（fold/call/raise 标签）
│           ├── Operation.ts                     # 玩家操作面板（自治组件，详见 §5.5）
│           ├── OtherBindings.ts                 # 牌桌杂项绑定（音视频/窗花/远端开关等）
│           ├── InsuranceOperation.ts            # 保险操作面板
│           ├── MorePlayTypeInfo.ts              # 多玩法信息展示
│           ├── PublicCardsInfo.ts / PotsInfo.ts / RoomInfo.ts
│           ├── events/TexasTableEvent.ts        # 牌桌业务入口（Sitdown/Standup/BringIn/LeaveRoom）
│           ├── operations/AutoOperation.ts      # 自动操作面板（Operation 的子自治组件）
│           └── widget/BetButton.ts / BetButtonContainer.ts  # 下注按钮组件
├── i18n/
│   ├── i18nMgr.ts / CPErrorCode.ts             # 国际化管理 + 错误码
│   ├── i18nComponent.ts / i18nLabel.ts / i18nSprite.ts  # 运行时多语言组件
├── helper/
│   ├── StringHelper.ts / TimeHelper.ts
│   ├── PublicHelper.ts / WebImageHelper.ts
├── tools/
│   ├── CCTools.ts                               # Cocos 工具（查询参数、屏幕方向）
│   └── TelegramUtils.ts                         # Telegram 集成
├── H5MsgMgr.ts                                  # H5↔Cocos 桥接（握手 + WS 代理 + UI 控制），import type 自 @silenthill/h5-cc-bridge/cc-side（详见 §8.5）
├── Main.ts / MainUtils.ts
├── SkeletonExt.js                               # Spine 动画扩展
└── webp_support.js                              # WebP 格式支持
```

> **协议代码来源**：老项目 `pokerqueen` 中的本地 `protobuf/` 目录（400+ 生成文件）已被提取为 npm 包 `@silenthill/agreement-web`。消息层通过 `import { Code } from '@silenthill/agreement-web'` 引用协议 Code 枚举和 protobuf 类型，本仓库不再保留 pb 生成文件。

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
