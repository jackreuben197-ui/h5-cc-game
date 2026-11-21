const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');
const path = require('node:path');
const ts = require('typescript');

function table() {
    const base = path.join(__dirname, '../assets/script');
    const requests = [];
    const bridge = { ready: true, Send(packet) {
        if (!this.ready) return false;
        requests.push(packet);
        return true;
    } };
    const roomData = { roomID: 1, matchID: 0, basicInfo: { handNum: 24 }, potInfo: { allPot: 33 } };
    const mine = { roomData };
    const player = { mine, roomData, roundBet: 0, chip: 100 };
    const noop = () => {};
    const decorator = () => noop;
    const cc = {
        _decorator: { ccclass: c => c, property: decorator, menu: decorator },
        Component: class {}, Node: { EventType: { TOUCH_START: 'touchstart' } },
        tween: () => ({ to() { return this; }, start: noop })
    };
    const modules = {
        'agreement-web': { Def: { Action: { RAISE: 3, CALL: 2, ALLIN: 5 } }, Code: { MSG_D_ACTION: 1006, MSG_D_SYNC_ENTER: 1025 } },
        LogTrace: { traceClass: decorator, createLogger: () => ({ debug: noop }) },
        DataBind: { bindEvent: decorator, autoBindEvents: noop, unBindEventsAll: noop },
        TexasGamePersonalSettings: { TexasGamePersonalSettings: { SHOW_BB: 'showBB' } },
        ProtocolAgency: { default: bridge },
        CPErrorCode: { CPErrorCode: { ServerErrorDescription: noop } },
        UIViewManager: { default: { showToast: noop } },
        RoomDataManager: { default: { getRoomData: () => roomData } }
    };
    function load(file) {
        const source = fs.readFileSync(path.join(base, file + '.ts'), 'utf8');
        const code = ts.transpileModule(source, { compilerOptions: {
            target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, experimentalDecorators: true, esModuleInterop: false
        } }).outputText;
        const exports = {};
        vm.runInNewContext(code, { cc, exports, require: key => modules[key.split('/').pop()] || {} });
        return exports;
    }
    const { OperatorMine, updateOperatorAfterAddTime } = load('data/room/texas/model/Operator');
    const root = 'views/scene/room/texas/';
    modules.TexasTableEvent = load(root + 'events/TexasTableEvent');
    const { caculatePotsBet } = load(root + 'widget/BetButtonContainer');
    const Button = load(root + 'widget/BetButton').default;
    const button = new Button();
    const listeners = {};
    button.realButton = { node: { on: (key, fn, target) => { listeners[key] = fn.bind(target); } } };
    button.onLoad();
    const startTurn = () => {
        mine.operator = new OperatorMine();
        mine.operator.actionLimitList = [{ action: 3 }];
    };
    const bind = () => {
        const [bet] = caculatePotsBet([{ name: '1/3', percent: 1/3 }], 0, 1, 100, player);
        button.initData(bet.label, bet.amount, roomData.basicInfo, bet.cb);
        return bet.cb;
    };
    roomData.mine = mine;
    startTurn();
    const reject = () => load('net/messages/texas/Action').Action({ status: 1 }, 1, 0);
    return { requests, bridge, mine, roomData, bind, startTurn, reject, updateOperatorAfterAddTime,
        press: listeners.touchstart, release: listeners.click, disable: () => button.onDisable() };
}

test('a press cannot use the next hand’s rebound 1/3 pot amount', () => {
    const t = table();
    const old = t.bind();
    t.press();
    t.roomData.basicInfo.handNum++;
    t.roomData.potInfo.allPot = 12;
    t.startTurn();
    t.bind();
    t.release();
    old();
    assert.equal(t.requests.length, 0);
    t.press();
    t.disable();
    t.release();
    assert.equal(t.requests.length, 0);
    t.press();
    t.release();
    assert.equal(t.requests[0].body.amount, 4);
});

test('one turn submits once across refresh and added time, independent of animation', () => {
    const t = table();
    t.bind();
    t.press();
    t.release();
    assert.equal(t.requests[0].body.amount, 11);
    t.bind();
    t.press();
    t.release();
    t.mine.operator = t.updateOperatorAfterAddTime(t.mine.operator, { times: 1, duration: 10, deadline: 0 });
    t.bind();
    t.press();
    t.release();
    assert.equal(t.requests.length, 1);
});

test('failed local dispatch permits a click; rejection requests only the authoritative snapshot', () => {
    const t = table();
    t.bind();
    t.bridge.ready = false;
    t.press();
    t.release();
    t.bridge.ready = true;
    t.press();
    t.release();
    t.reject();
    t.press();
    t.release();
    assert.deepEqual(t.requests.map(packet => packet.code), [1006, 1025]);
    t.startTurn(); // fresh operator supplied by the snapshot
    t.bind();
    t.press();
    t.release();
    assert.deepEqual(t.requests.map(packet => packet.code), [1006, 1025, 1006]);
});
