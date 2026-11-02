const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// 执行实际离桌处理、观战生命周期和退桌流程，只替换网络、场景和设备边界。
function fixture() {
    const root = path.resolve(__dirname, '../assets/script');
    const cache = new Map();
    const sent = [];
    const packets = [];
    const procedures = [];
    const pending = [];
    const listeners = new Map();
    const toasts = [];
    const toastCallbacks = [];
    const reasons = { LR_NOCHIP: 1, LR_ACTIVE: 2, LR_GAME_END: 3, LR_FORCE: 4, LR_EXCHANGE: 5,
        LR_AUTO_EXCEED_MAX_TIMES: 6, LR_OFFLINE: 7 };
    const codes = { MSG_D_ENTER_ROOM: 1002, MSG_D_LEAVE: 1010 };
    const silent = { debug() {}, info() {}, warn() {}, error() {} };
    const moduleDefault = value => ({ __esModule: true, default: value });
    let lifecycle;
    let returnProcedure;
    let roomManager;
    let reenterCount = 0;
    const mine = { seatNo: 3, operator: {}, player: null,
        clearData() { this.seatNo = 0; this.operator = null; this.player = null; },
        async clearVideoAndAudio() {} };
    const player = { seated: true, cards: [1, 2],
        setSeated(value) { this.seated = value; }, clearData() { this.cards = []; } };
    mine.player = player;
    const room = { roomID: 123, matchID: 456, closed: false, mine,
        basicInfo: { isMtt: true, roomName: 'test', roomType: 1, clubID: 10 },
        seatsStateManager: { getSeatPlayer: () => player, clearExpressions() {} } };
    class EventTarget {
        constructor() { this.listeners = new Map(); }
        on(name, callback, target) {
            this.listeners.set(name, [...(this.listeners.get(name) || []), { callback, target }]);
        }
        emit(name, ...args) {
            for (const { callback, target } of this.listeners.get(name) || []) callback.apply(target, args);
        }
        targetOff(target) {
            for (const [name, callbacks] of this.listeners) this.listeners.set(name, callbacks.filter(item => item.target !== target));
        }
    }
    const cc = { EventTarget, Component: class {}, _decorator: { ccclass: cls => cls, menu: () => cls => cls } };
    const reconnect = { cleared: [],
        clearContext(roomID, matchID) { this.cleared.push([roomID, matchID]); }, clearAllContext() {} };
    const manager = { currProcedure: { id: 1, param: { roomID: room.roomID, matchID: room.matchID } },
        async StartProcedure(id, param) { procedures.push({ id, param }); returnProcedure.lateEnter(param); } };
    const bridge = { on(name, listener) { listeners.set(name, listener); },
        sendToH5(action, type, payload) {
            const id = `request-${sent.length + 1}`;
            sent.push({ action, payload, id });
            return id;
        } };
    const protocol = { Send(packet) { packets.push(packet); },
        waitForMessage(code, matcher) {
            return new Promise((resolve, reject) => pending.push({ code, matcher, resolve, reject }));
        } };
    const view = { showToast(text, _config, callback) { toasts.push(text); if (callback) toastCallbacks.push(callback); },
        hideCurrentScene() {}, showPreloadingLayer() {},
        hidePrompting() {} };
    function load(relative) {
        if (cache.has(relative)) return cache.get(relative).exports;
        const module = { exports: {} };
        cache.set(relative, module);
        const filename = path.join(root, relative);
        const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
            compilerOptions: { target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.CommonJS, experimentalDecorators: true }
        }).outputText;
        function requireStub(request) {
            if (request === '@silenthill/agreement-web') return { Code: codes, Def: {
                LeaveReason: reasons, WantSeatType: { WST_NO: 0 }, AddOnMode: { ADDON_NONE: 0 }
            } };
            if (request.endsWith('/LogTrace')) return { createLogger: () => silent,
                traceClass: () => cls => { cls.prototype.tracelog = silent; cls.tracelog = silent; return cls; } };
            if (request.endsWith('/RoomDataManager')) return moduleDefault(roomManager);
            if (request.endsWith('/H5MsgMgr')) return moduleDefault(bridge);
            if (request.endsWith('/ProtocolAgency')) return moduleDefault(protocol);
            if (request.endsWith('/ProcedureManager')) return moduleDefault(manager);
            if (request.endsWith('/ProcedureDefine')) return moduleDefault({ Return: 2, EnterRoom: 1 });
            if (request.endsWith('/ProcedureBase')) return moduleDefault(class {});
            if (request.endsWith('/RoomReconnectManager')) return moduleDefault(reconnect);
            if (request.endsWith('/UIViewManager')) return moduleDefault(view);
            if (request.endsWith('/SoundManager')) return moduleDefault({ volumeOnOff() {} });
            if (request.endsWith('/AgoraManager')) return moduleDefault({ clear() {} });
            if (request.endsWith('/TexasVideoMediaHelper')) return moduleDefault({ clearAllMediaStates() {} });
            if (request.endsWith('/CPErrorCode')) return { CPErrorCode: { ServerErrorDescription: code => `error:${code}` } };
            if (request.endsWith('/i18nMgr')) return { i18nMgr: { Get: key => key } };
            if (request.endsWith('/Constants')) return { MTT_MATCH_ENTRY_ROOM_ID: 0 };
            if (request.endsWith('/MttRoomLifecycle')) return moduleDefault(lifecycle);
            if (request.endsWith('/DataBind')) return load('core/decorator/DataBind.ts');
            if (request.endsWith('/TexasGameRoomDataMtt')) return load('data/room/texas/TexasGameRoomDataMtt.ts');
            return {};
        }
        vm.runInNewContext(code, { module, exports: module.exports, require: requireStub, cc, console, setTimeout, clearTimeout }, { filename });
        return module.exports;
    }
    roomManager = load('data/room/RoomDataManager.ts').default;
    roomManager.setRoomData(123, 456, room);
    const MttData = load('data/room/texas/TexasGameRoomDataMtt.ts').default;
    room.mtt = new MttData(room);
    Object.assign(room.mtt, { blindLevel: 2, maxRebuyBlindLevel: 5, rebuyTimes: 3, rebuyCost: 100 });
    lifecycle = load('game/MttRoomLifecycle.ts').default;
    lifecycle.reenter = () => { reenterCount++; };
    const StateView = load('views/scene/room/texas/MttTableStateView.ts').default;
    const stateView = new StateView();
    stateView._roomData = room;
    stateView._render = () => {};
    load('core/decorator/DataBind.ts').autoBindEvents(stateView, { mtt: room.mtt });
    returnProcedure = new (load('game/procedure/ProcedureReturn.ts').default)();
    const { LeaveNotification } = load('net/messages/texas/LeaveNotification.ts');
    const { NotificationRoomReady } = load('net/messages/other/NotificationRoomReady.ts');
    const panel = () => sent.filter(message => message.action === 'showPanel').at(-1);
    return { room, mine, player, roomManager, stateView, lifecycle, procedures, packets, sent, pending, toasts, reasons, codes, reconnect, load,
        panel, get reenterCount() { return reenterCount; },
        finishToast() { assert.ok(toastCallbacks.length > 0); toastCallbacks.shift()(); },
        leave(reason, extra = {}) { LeaveNotification({ reason, storeChips: 0, rebuyTimes: 1, accountChips: 100, ...extra }, 123, 456); },
        event(event) { listeners.get('panelEvent')({ panelRequestId: panel().id, event }); },
        ready() { NotificationRoomReady({ room: { roomId: 789, matchId: 456 } }, 123, 456); },
        async respond(status = 0) {
            const request = pending.find(request => request.code === codes.MSG_D_ENTER_ROOM && !request.settled);
            if (!request) return;
            request.settled = true;
            request.resolve({ body: { status }, roomID: 123, matchID: 456 });
            await new Promise(resolve => setImmediate(resolve));
        }
    };
}

test('收到 LR_NOCHIP 后直接发送原桌观战 Enter，不发送或等待主动 Leave', async () => {
    const f = fixture();
    f.leave(f.reasons.LR_NOCHIP);
    assert.equal(f.packets.length, 1);
    assert.equal(f.packets[0].code, f.codes.MSG_D_ENTER_ROOM);
    assert.equal(f.pending.length, 1);
    assert.equal(f.pending[0].code, f.codes.MSG_D_ENTER_ROOM);
    assert.equal(f.panel().payload.props.watchingPending, true);
    assert.equal(f.procedures.length, 0);
    const request = f.packets[0];
    assert.equal(request.code, f.codes.MSG_D_ENTER_ROOM);
    assert.equal(request.roomID, 123);
    assert.equal(request.matchID, 456);
    assert.equal(request.body.room.roomId, 123);
    assert.equal(request.body.room.matchId, 456);
    assert.equal(request.body.observer, true);
    assert.equal(request.body.wantSeat, 0);
    assert.equal(f.pending[0].matcher({}, 123, 456), true);
    assert.equal(f.pending[0].matcher({}, 789, 456), false);
    assert.equal(f.pending[0].matcher({ status: 0, myInfo: { seatId: 3 } }, 123, 456), false);
    assert.equal(f.mine.seatNo, 0);
    assert.equal(f.mine.operator, null);
    assert.equal(f.player.seated, false);
    assert.equal(f.player.cards.length, 0);
    assert.equal(f.panel().payload.ensureVisible, false);
    assert.equal(f.panel().payload.showH5Bg, false);
    assert.equal(f.panel().payload.closeOnClickOverlay, false);
    assert.equal(f.panel().payload.props.canContinueWatching, false);
    f.event('continueWatching');
    assert.equal(f.procedures.length, 0);
    await f.respond();
    assert.equal(f.panel().payload.props.canContinueWatching, true);
    f.event('continueWatching');
    assert.equal(f.procedures.length, 0);
    assert.equal(f.sent.at(-1).action, 'h5Hide');
    assert.equal(f.room.mtt.eliminatedObserver, true);
    f.ready();
    assert.equal(f.toasts.at(-1), 'UIMTT_ObservedRoomDissolved');
    assert.equal(f.procedures.length, 0);
    f.finishToast();
    assert.equal(f.procedures.at(-1).param.routeData.name, 'mtt-list');
    assert.equal(f.packets.filter(packet => packet.code === f.codes.MSG_D_ENTER_ROOM).length, 1);
});

test('有存储筹码时仍走重新带入，重复淘汰通知不会再次发起观战', async () => {
    const stored = fixture();
    stored.leave(stored.reasons.LR_NOCHIP, { storeChips: 100 });
    assert.equal(stored.reenterCount, 1);
    assert.equal(stored.packets.length, 0);
    assert.equal(stored.panel(), undefined);
    const f = fixture();
    f.leave(f.reasons.LR_NOCHIP);
    f.leave(f.reasons.LR_NOCHIP);
    await f.respond();
    assert.equal(f.packets.length, 1);
});

for (const event of ['returnLobby', 'rebuy']) {
    test(`${event} 统一清理观战订阅，再跳转对应页面；晚到回包不会重开弹窗`, async () => {
        const f = fixture();
        f.leave(f.reasons.LR_NOCHIP);
        const panelCount = f.sent.filter(message => message.action === 'showPanel').length;
        f.event(event);
        const route = f.procedures.at(-1).param.routeData;
        assert.equal(route.name, event === 'rebuy' ? 'mtt-detail' : 'lobby');
        if (event === 'rebuy') assert.equal(route.query.id, '456');
        assert.equal(f.packets.at(-1).code, f.codes.MSG_D_LEAVE);
        assert.equal(f.sent.some(message => message.action === 'closePanel'), true);
        await f.respond();
        assert.equal(f.sent.filter(message => message.action === 'showPanel').length, panelCount);
        assert.equal(f.packets.filter(packet => packet.code === f.codes.MSG_D_ENTER_ROOM).length, 1,
            '玩家已离开时，晚到的观战回包不能再次发起 Enter');
        const { EnterRoom } = f.load('net/messages/texas/EnterRoom.ts');
        await EnterRoom({ status: 99 }, 123, 456);
        assert.equal(f.toasts.length, 0, '旧观战失败回包不能影响当前页面');
        const { Leave } = f.load('net/messages/texas/Leave.ts');
        Leave({ status: 0 }, 123, 456);
        assert.equal(f.procedures.length, 1, '晚到的退出观战回包不能再次切换流程');
    });
}

test('观战被拒绝或超时仍可读结算并返回大厅，不允许继续看静止牌桌', async () => {
    for (const timeout of [false, true]) {
        const f = fixture();
        f.leave(f.reasons.LR_NOCHIP);
        if (timeout) {
            f.pending[0].reject(new Error('timeout'));
            await new Promise(resolve => setImmediate(resolve));
        } else {
            const { EnterRoom } = f.load('net/messages/texas/EnterRoom.ts');
            await EnterRoom({ status: 99 }, 123, 456);
            assert.equal(f.procedures.length, 0, '普通进房失败逻辑不能提前退出桌内结算');
            await f.respond(99);
        }
        assert.equal(f.room.closed, true);
        assert.equal(f.panel().payload.props.canContinueWatching, false);
        assert.equal(f.panel().payload.props.watchingPending, false);
        assert.equal(f.procedures.length, 0);
        assert.equal(f.toasts.length, 1);
        f.event('returnLobby');
        assert.equal(f.procedures.at(-1).param.routeData.name, 'lobby');
    }
});

test('普通主动离桌的 1010 回包仍返回 H5，不触发淘汰观战流程', () => {
    const f = fixture();
    f.load('net/messages/texas/Leave.ts').Leave({ status: 0 }, 123, 456);
    assert.equal(f.packets.length, 0);
    assert.equal(f.pending.length, 0);
    assert.equal(f.panel(), undefined);
    assert.equal(f.procedures.length, 1);
});

test('成功观战后退出，清理观战的 Leave 回包不重复返回大厅', async () => {
    const f = fixture();
    f.leave(f.reasons.LR_NOCHIP);
    await f.respond();
    f.event('rebuy');
    assert.equal(f.packets.at(-1).code, f.codes.MSG_D_LEAVE);
    f.load('net/messages/texas/Leave.ts').Leave({ status: 0 }, 123, 456);
    assert.equal(f.procedures.length, 1);
    assert.equal(f.procedures[0].param.routeData.name, 'mtt-detail');
});

test('数据事件首次绑定不回放退桌或解散动作', () => {
    const f = fixture();
    assert.equal(f.procedures.length, 0);
    assert.equal(f.toasts.length, 0);
    assert.equal(f.sent.length, 0);
    assert.equal(f.room.closed, false);
});

test('同一房间 ID 重新进桌后，旧观战 Leave 应答仍被数据仓库消费', async () => {
    const f = fixture();
    f.leave(f.reasons.LR_NOCHIP);
    await f.respond();
    f.event('rebuy');
    const newRoom = { ...f.room, mtt: { observer: false, eliminatedObserver: false } };
    f.roomManager.setRoomData(123, 456, newRoom);
    f.load('net/messages/texas/Leave.ts').Leave({ status: 0 }, 123, 456);
    assert.equal(f.procedures.length, 1);
    assert.equal(f.roomManager.getRoomData(123, 456), newRoom);
});

test('静默离桌应答按请求次数消费，且不随 RoomData 清理丢失', () => {
    const f = fixture();
    f.roomManager.markSilentLeave(123, 456);
    f.roomManager.markSilentLeave(123, 456);
    f.roomManager.clearAllRoomData();
    assert.equal(f.roomManager.consumeSilentLeave(123, 456), true);
    assert.equal(f.roomManager.consumeSilentLeave(123, 456), true);
    assert.equal(f.roomManager.consumeSilentLeave(123, 456), false);
});

test('观战重连耗尽后返回大厅，不通过比赛入口重新分桌', async () => {
    const f = fixture();
    f.leave(f.reasons.LR_NOCHIP);
    await f.respond();
    f.event('continueWatching');
    const reconnect = f.load('game/RoomReconnectManager.ts').default;
    reconnect._contexts = [{ roomID: 123, matchID: 456, failedCount: 2 }];
    reconnect._onReconnectTimeout(123, 456);
    assert.equal(f.procedures.at(-1).param.routeData.name, 'lobby');
});

test('等待观战回包时拆桌，关闭结算后提示，并阻止晚到回包重开观战', async () => {
    const f = fixture();
    f.leave(f.reasons.LR_NOCHIP);
    const panelCount = f.sent.filter(message => message.action === 'showPanel').length;
    f.leave(f.reasons.LR_EXCHANGE);
    await f.respond();
    assert.equal(f.room.closed, true);
    assert.equal(f.sent.some(message => message.action === 'closePanel'), true);
    assert.equal(f.sent.filter(message => message.action === 'showPanel').length, panelCount);
    assert.equal(f.toasts.at(-1), 'UIMTT_ObservedRoomDissolved');
    assert.equal(f.procedures.length, 0);
    f.finishToast();
    assert.equal(f.procedures.at(-1).param.routeData.name, 'mtt-list');
    assert.equal(f.room.mtt.tableTransferWaiting, false);
});

for (const reason of ['LR_GAME_END', 'LR_EXCHANGE']) {
    test(`观战收到 ${reason} 只提示一次，提示结束后返回 MTT 列表`, async () => {
        const f = fixture();
        f.leave(f.reasons.LR_NOCHIP);
        await f.respond();
        f.event('continueWatching');
        f.leave(f.reasons[reason]);
        f.ready();
        f.leave(f.reasons[reason]);
        assert.equal(f.room.closed, true);
        assert.deepEqual(f.toasts, ['UIMTT_ObservedRoomDissolved']);
        assert.equal(f.procedures.length, 0, '玩家应先看到提示，再返回列表');
        f.finishToast();
        const route = f.procedures.at(-1).param.routeData;
        assert.equal(route.name, 'mtt-list');
        assert.equal(route.ensureVisible, true);
        assert.equal(f.packets.filter(packet => packet.code === f.codes.MSG_D_ENTER_ROOM).length, 1);
        assert.equal(f.packets.filter(packet => packet.code === f.codes.MSG_D_LEAVE).length, 0,
            '服务端已解散房间，不再请求主动离桌');
    });
}

test('直接进入的观众遇到解散同样提示并返回列表', () => {
    const f = fixture();
    f.room.mtt.observer = true;
    f.leave(f.reasons.LR_GAME_END);
    assert.equal(f.toasts[0], 'UIMTT_ObservedRoomDissolved');
    assert.equal(f.procedures.length, 0);
    f.finishToast();
    assert.equal(f.procedures.at(-1).param.routeData.name, 'mtt-list');
});

test('解散提示期间已离开牌桌，旧提示回调不会覆盖新的导航', async () => {
    const f = fixture();
    f.leave(f.reasons.LR_NOCHIP);
    await f.respond();
    f.event('continueWatching');
    f.leave(f.reasons.LR_GAME_END);
    f.lifecycle.openRegistration(f.room);
    assert.equal(f.procedures.at(-1).param.routeData.name, 'mtt-detail');
    f.finishToast();
    assert.equal(f.procedures.length, 1);
    assert.equal(f.procedures.at(-1).param.routeData.name, 'mtt-detail');
});

test('淘汰前在途的参赛快照不能恢复座位，观战同步失败保留结算', async () => {
    const f = fixture();
    f.leave(f.reasons.LR_NOCHIP);
    const { EnterRoom } = f.load('net/messages/texas/EnterRoom.ts');
    const { SyncEnter } = f.load('net/messages/texas/SyncEnter.ts');
    await EnterRoom({ status: 0, myInfo: { seatId: 3 } }, 123, 456);
    SyncEnter({ status: 0, myInfo: { seatId: 3 } }, 123, 456);
    assert.equal(f.mine.seatNo, 0);
    await f.respond();
    SyncEnter({ status: 99 }, 123, 456);
    assert.equal(f.room.closed, true);
    assert.equal(f.panel().payload.props.canContinueWatching, false);
    assert.equal(f.procedures.length, 0);
});

test('比赛结束保留桌内结算，不再以观众身份进入已结束比赛', () => {
    const f = fixture();
    f.leave(f.reasons.LR_GAME_END);
    assert.equal(f.room.closed, true);
    assert.equal(f.packets.length, 0);
    assert.equal(f.panel().payload.props.canContinueWatching, false);
    assert.equal(f.procedures.length, 0);
});

test('观战时点击坐下直接打开本场比赛详情，不请求普通桌带入', async () => {
    const f = fixture();
    f.room.mtt.observer = true;
    const TableEvent = f.load('views/scene/room/texas/events/TexasTableEvent.ts').default;
    await TableEvent.Sitdown({ roomData: f.room }, 2);
    assert.equal(f.procedures.at(-1).param.routeData.name, 'mtt-detail');
    assert.equal(f.procedures.at(-1).param.routeData.query.id, '456');
    assert.equal(f.packets.length, 0);
});
