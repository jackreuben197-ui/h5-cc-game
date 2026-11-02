const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const ts = require('../node_modules/typescript');
const root = path.resolve(__dirname, '../assets/script');

function fixture() {
  let now = 0;
  let audioID = 0;
  let deferLoads = false;
  const timers = [];
  const loads = [];
  const sounds = new Set();
  const sent = [];
  const warnings = [];
  const nodes = [];
  const modules = new Map();
  const vector = (x = 0, y = 0, z = 0) => ({ x, y, z,
    normalize() { const length = Math.hypot(this.x, this.y) || 1; return vector(this.x / length, this.y / length); },
    signAngle(other) { return Math.atan2(this.x * other.y - this.y * other.x, this.x * other.x + this.y * other.y); }
  });
  const stop = target => { for (const timer of timers) if (timer.target === target) timer.cancelled = true; };
  class Skeleton {
    setCompleteListener(callback) { this.complete = callback; }
    clearTracks() { this.animation = null; }
    setToSetupPose() {}
    setAnimation(_track, name) { this.animation = name; }
  }
  class Node {
    constructor(name) {
      this.name = name;
      this.active = true;
      this.valid = true;
      this.children = [];
      this.position = vector();
      this.height = 100;
      this.components = new Map();
      nodes.push(this);
    }
    set parent(value) {
      if (this._parent) this._parent.children = this._parent.children.filter(node => node !== this);
      this._parent = value;
      if (value) value.children.push(this);
    }
    get parent() { return this._parent; }
    get activeInHierarchy() { return this.valid && this.active && (!this.parent || this.parent.activeInHierarchy); }
    get childrenCount() { return this.children.length; }
    getComponent(type) { return this.components.get(type); }
    addComponent(type) { const component = new type(); this.components.set(type, component); return component; }
    setSiblingIndex() {}
    setPosition(position) { this.position = position; }
    convertToWorldSpaceAR(position) { return position; }
    convertToNodeSpaceAR(position) { return position; }
    stopAllActions() { stop(this); }
    destroy() { this.valid = false; this.parent = null; stop(this); }
  }
  class EventTarget {
    constructor() { this.listeners = new Map(); }
    on(event, callback, target) {
      const listeners = this.listeners.get(event) || [];
      listeners.push({ callback, target });
      this.listeners.set(event, listeners);
    }
    emit(event, ...args) { for (const listener of this.listeners.get(event) || []) listener.callback.apply(listener.target, args); }
  }
  const cc = { Node, Component: class {}, EventTarget,
    _decorator: { ccclass: cls => cls, menu: () => cls => cls, property: () => () => {} },
    Color: class { static fromHEX(color) { return color; } },
    v2: vector, v3: vector, isValid: node => !!node?.valid, find: () => null,
    Tween: { stopAllByTarget: stop },
    resources: { get: () => ({}) },
    audioEngine: { playEffect() { sounds.add(++audioID); return audioID; }, stopEffect(id) { sounds.delete(id); } },
    warn: (...args) => warnings.push(args),
    tween(target) {
      let delay = 0;
      const callbacks = [];
      return {
        delay(duration) { delay += duration; return this; },
        to(duration, props) { delay += duration; callbacks.push({ delay, run: () => Object.assign(target, props) }); return this; },
        call(run) { callbacks.push({ delay, run }); return this; },
        start() { for (const callback of callbacks) timers.push({ target, at: now + callback.delay, run: callback.run }); return this; }
      };
    }
  };
  const user = { userRID: 1, userID: 101, name: 'tester', isPropFree: () => true };
  const moduleDefault = value => ({ __esModule: true, default: value });
  const placeholder = new Proxy(class {}, { get: (target, key) => key === 'prototype' ? target.prototype : key });
  const ignored = new Proxy({ __esModule: true }, { get: (target, key) => key === 'then' ? undefined : target[key] || placeholder });
  const actual = new Set([
    'views/util/ThrowPropManager.ts', 'game/constant/BroadcastCode.ts', 'game/constant/MagicEmojiConfig.ts',
    'core/decorator/DataBind.ts', 'data/room/texas/TexasGameRoomDataSeatsStateManager.ts',
    'data/room/texas/TexasGameRoomDataPlayer.ts',
    'data/room/texas/TexasGameRoomDataMtt.ts', 'views/scene/room/texas/SeatManager.ts',
    'views/scene/room/texas/SeatPlayer.ts', 'views/dialog/emoji/UIEmojiDlg.ts', 'views/dialog/playerinfo/UIPlayerInfo.ts',
    'views/scene/room/texas/events/TexasTableEvent.ts', 'net/messages/texas/SeatedOthers.ts'
  ]);
  let room;
  function load(relative) {
    if (modules.has(relative)) return modules.get(relative).exports;
    const module = { exports: {} };
    modules.set(relative, module);
    const filename = path.join(root, relative);
    const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.CommonJS, experimentalDecorators: true }
    }).outputText;
    function requireStub(request) {
      if (request === '@silenthill/agreement-web') return { Code: { MSG_D_BROADCAST_MSG: 1019 }, Def: {
        ConsumeType: { CT_NONE: 0 }, BroadcastMsgType: { BC_MSG_EMOJI: 1, BC_MSG_THROW: 4 }
      } };
      if (request.endsWith('/LogTrace')) return {
        traceClass: () => cls => cls, traceMethod: () => () => {},
        createLogger: () => ({ debug() {}, info() {}, warn() {}, error() {} })
      };
      if (request.endsWith('/AssetManager')) return { BUNDLE_RESOURCES: 'resources', ...moduleDefault({
        getOrLoad(_bundle, name) {
          if (deferLoads) return new Promise(resolve => loads.push(() => resolve({ name })));
          return Promise.resolve({ name });
        }
      }) };
      if (request.endsWith('/SoundManager')) return moduleDefault({ isOn: true });
      if (request.endsWith('/UserStore')) return { ...moduleDefault(user), UserStore: placeholder };
      if (request.endsWith('/PlayerStoreUtils')) return moduleDefault({ syncSeatPlayer() {} });
      if (request.endsWith('/ProtocolAgency')) return moduleDefault({ Send: message => sent.push(message) });
      if (request.endsWith('/TexasGameRoomDataChat')) return moduleDefault({ formatTimestamp: () => '12:00' });
      if (request.endsWith('/RoomDataManager')) return moduleDefault({ getRoomData: (id, match) => room?.roomID === id && room.matchID === match ? room : null });
      if (!request.startsWith('.')) return ignored;
      const dependency = path.relative(root, path.resolve(path.dirname(filename), request)) + '.ts';
      return actual.has(dependency) ? load(dependency) : ignored;
    }
    vm.runInNewContext(code, { module, exports: module.exports, require: requireStub, cc, sp: { Skeleton }, console, Date }, { filename });
    return module.exports;
  }
  const manager = load('views/util/ThrowPropManager.ts').default;
  const { PropsID } = load('game/constant/BroadcastCode.ts');
  const emoji = load('game/constant/MagicEmojiConfig.ts').default.DEFINITIONS[0];
  const rootNode = new Node('table');
  const effectRoot = new Node('effects');
  effectRoot.parent = rootNode;
  manager.initialize(rootNode, effectRoot);
  const Seats = load('data/room/texas/TexasGameRoomDataSeatsStateManager.ts').default;
  room = { roomID: 10, matchID: 0, mtt: { tableTransferWaiting: false }, chat: { setPendingMessage() {} } };
  room.seatsStateManager = new Seats(room);
  function seat(userID) {
    const model = { userID, seated: true, roomData: room };
    room.seatsStateManager._playerMap.set(userID, model);
    const avatarNode = new Node('avatar'); avatarNode.parent = rootNode;
    const propNode = new Node('prop'); propNode.parent = rootNode; propNode.active = false;
    const emojiNode = new Node('emoji'); emojiNode.parent = rootNode; emojiNode.active = false; emojiNode.addComponent(Skeleton);
    const roomID = room.roomID;
    return { model, avatarNode, propNode, emojiNode,
      isValid: () => model.seated && model.userID === userID && room.roomID === roomID && !room.mtt.tableTransferWaiting
    };
  }
  async function flush() { for (let i = 0; i < 8; i++) await Promise.resolve(); }
  async function play(type, sender, receiver) {
    manager.playProp({ type, userID: sender.model.userID, targetUserID: receiver.model.userID }, sender, receiver);
    await flush();
    assert.deepEqual(warnings, []);
  }
  function advance(duration) {
    const end = now + duration;
    for (;;) {
      timers.sort((a, b) => a.at - b.at);
      const index = timers.findIndex(timer => !timer.cancelled && timer.at <= end);
      if (index < 0) break;
      const timer = timers.splice(index, 1)[0]; now = timer.at; timer.run();
    }
    now = end;
  }
  return { manager, PropsID, emoji, seat, play, flush, advance, sounds, nodes, timers, sent, room, load, cc, Skeleton,
    defer() { deferLoads = true; },
    async resolve() { deferLoads = false; loads.splice(0).forEach(resolve => resolve()); await flush(); }
  };
}

for (const leaving of ['sender', 'receiver']) {
  test(`连续点击后 ${leaving} 离座，当前互动和队列立即取消，其他玩家继续播放`, async () => {
    const f = fixture();
    const sender = f.seat(1), receiver = f.seat(2), other = f.seat(3), target = f.seat(4);
    for (let i = 0; i < 8; i++) await f.play(f.PropsID.PROPSTOMATO, sender, receiver);
    await f.play(f.PropsID.PROPSTOMATO, other, target);
    assert.equal(f.manager._propQueue.length, 7);
    f.advance(0.5);
    const seat = leaving === 'sender' ? sender : receiver;
    seat.model.seated = false;
    f.manager.stopSeat(seat.emojiNode);
    assert.equal(sender.propNode.active, false);
    assert.equal(other.propNode.active, true);
    assert.equal(f.manager._propQueue.length, 0);
    assert.equal(f.manager._activePropTasks.size, 1);
    f.advance(30);
    assert.equal(f.manager._activePropTasks.size, 0);
    assert.equal(f.sounds.size, 0);
    assert.equal(sender.propNode.active, false);
  });
}

test('全部互动表情在各观看身份下离座都会清理节点、全屏效果、音效及后续片段', async () => {
  const names = ['PROPSTOMATO', 'PROPSFLOWER', 'PROPSKISS', 'PROPSGOOD', 'PROPSCHEERS', 'PROPSTOUCH',
    'PROPSSHARK', 'PROPSCHICKEN', 'PROPSBOXING', 'PROPSMONEY', 'PROPSFISH', 'PROPSBASEBALL'];
  for (const name of names) for (const ids of [[1, 2], [2, 1], [2, 3]]) {
    const f = fixture();
    const sender = f.seat(ids[0]), receiver = f.seat(ids[1]);
    await f.play(f.PropsID[name], sender, receiver);
    assert.equal(f.manager._activePropTasks.size, 1, `${name}/${ids}`);
    const task = [...f.manager._activePropTasks][0];
    const effectNodes = [...task.nodes];
    const completions = effectNodes.map(node => node.getComponent(f.Skeleton)?.complete).filter(Boolean);
    receiver.model.seated = false;
    f.manager.stopSeat(receiver.emojiNode);
    completions.forEach(complete => complete());
    f.advance(30);
    assert.equal(task.nodes.size, 0, `${name}/${ids}`);
    assert.ok(effectNodes.every(node => !node.valid || !node.active), `${name}/${ids}`);
    assert.equal(f.manager._activePropTasks.size, 0);
    assert.equal(f.sounds.size, 0);
  }
});

test('互动和 emoji 加载期间离座后原玩家重新坐下，旧加载结果仍失效', async () => {
  const f = fixture(), sender = f.seat(1), receiver = f.seat(2);
  f.defer();
  await f.play(f.PropsID.PROPSTOMATO, sender, receiver);
  const pendingEmoji = f.manager.playEmoji({ type: f.emoji.type, userID: 1 }, sender);
  f.manager.stopSeat(sender.emojiNode);
  await f.resolve();
  await pendingEmoji;
  assert.equal(f.manager._activePropTasks.size, 0);
  assert.equal(sender.emojiNode.active, false);
  await f.play(f.PropsID.PROPSTOMATO, sender, receiver);
  await f.manager.playEmoji({ type: f.emoji.type, userID: 1 }, sender);
  assert.equal(f.manager._activePropTasks.size, 1);
  assert.equal(sender.emojiNode.active, true);
});

test('换桌复用同一节点时，旧队列和加载回调不会影响新桌表情', async () => {
  const f = fixture(), sender = f.seat(1), receiver = f.seat(2);
  await f.play(f.PropsID.PROPSTOMATO, sender, receiver);
  await f.play(f.PropsID.PROPSTOMATO, sender, receiver);
  await f.manager.playEmoji({ type: f.emoji.type, userID: 1 }, sender);
  f.defer();
  await f.play(f.PropsID.PROPSBOXING, sender, receiver);
  const oldEmoji = f.manager.playEmoji({ type: f.emoji.type, userID: 1 }, sender);
  f.manager.reset();
  f.manager.initialize(f.manager._root, f.manager._fullscreenRoot);
  assert.equal(f.manager._propQueue.length, 0);
  assert.equal(sender.emojiNode.active, false);
  await f.resolve();
  await oldEmoji;
  assert.equal(f.manager._activePropTasks.size, 0);
  await f.manager.playEmoji({ type: f.emoji.type, userID: 1 }, sender);
  await f.play(f.PropsID.PROPSTOMATO, sender, receiver);
  f.advance(30);
  assert.equal(f.manager._activePropTasks.size, 0);
  assert.equal(sender.emojiNode.active, true, '旧桌回调不能关闭新桌 emoji');
});

test('emoji 播放中离座立即停止，空座不能重新播放', async () => {
  const f = fixture(), sender = f.seat(1);
  await f.manager.playEmoji({ type: f.emoji.type, userID: 1 }, sender);
  assert.equal(sender.emojiNode.active, true);
  assert.equal(f.sounds.size, 1);
  sender.model.seated = false;
  f.manager.stopSeat(sender.emojiNode);
  assert.equal(sender.emojiNode.active, false);
  assert.equal(sender.emojiNode.getComponent(f.Skeleton).animation, null);
  assert.equal(f.sounds.size, 0);
  await f.manager.playEmoji({ type: f.emoji.type, userID: 1 }, sender);
  assert.equal(sender.emojiNode.active, false);
});

test('玩家离座后复用互动节点，旧的动画完成回调不能关闭新动画', async () => {
  const f = fixture(), sender = f.seat(1), receiver = f.seat(2);
  await f.play(f.PropsID.PROPSSHARK, sender, receiver);
  const oldComplete = receiver.propNode.getComponent(f.Skeleton).complete;
  f.manager.stopSeat(receiver.emojiNode);
  await f.play(f.PropsID.PROPSSHARK, sender, receiver);
  oldComplete();
  assert.equal(receiver.propNode.active, true);
  assert.equal(f.manager._activePropTasks.size, 1);
});

test('换桌后复用 emoji 节点，旧桌完成回调不能关闭新桌动画', async () => {
  const f = fixture(), sender = f.seat(1);
  await f.manager.playEmoji({ type: f.emoji.type, userID: 1 }, sender);
  const oldComplete = sender.emojiNode.getComponent(f.Skeleton).complete;
  f.manager.reset();
  await f.manager.playEmoji({ type: f.emoji.type, userID: 1 }, sender);
  oldComplete();
  assert.equal(sender.emojiNode.active, true);
  assert.equal(f.sounds.size, 1);
});

test('真实离座生命周期由视图停止动画，数据层清理待确认请求', async () => {
  const f = fixture(), sender = f.seat(1), receiver = f.seat(2);
  await f.play(f.PropsID.PROPSSHARK, sender, receiver);
  await f.manager.playEmoji({ type: f.emoji.type, userID: 2 }, receiver);
  const seats = f.room.seatsStateManager;
  seats.setPendingEmoji({ userID: 2, type: f.emoji.type });
  seats.setPendingThrowProp({ userID: 1, targetUserID: 2, type: f.PropsID.PROPSSHARK });
  const SeatPlayer = f.load('views/scene/room/texas/SeatPlayer.ts').default;
  const view = Object.create(SeatPlayer.prototype);
  Object.assign(view, { _seatPlayer: receiver.model, _emojiNode: receiver.emojiNode,
    userSeat: { active: true }, emptySeat: { node: {} }, insuranceCountdownBubble: { node: {} },
    avatarVideoRender: { stopMask() {}, stopOverlay() {} },
    _stopWinnerPresentation() {}, _refreshNicknameVisibility() {}, onUpdateCards() {}, setMicrophoneIconState() {}
  });
  receiver.model.seated = false;
  view.onUpdateSeated(false, null);
  assert.equal(f.manager._activePropTasks.size, 0);
  assert.equal(receiver.emojiNode.active, false);
  assert.ok(seats._pendingThrowPropData);
  assert.ok(seats._pendingEmojiData);
  const Player = f.load('data/room/texas/TexasGameRoomDataPlayer.ts').default;
  receiver.model.muteEvents = receiver.model.unmuteEvents = () => {};
  Player.prototype.clearData.call(receiver.model);
  assert.equal(seats._pendingThrowPropData, null);
  assert.equal(seats._pendingEmojiData, null);
});

test('真实座位快照检查玩家身份、入座状态和换桌后 roomID', () => {
  const f = fixture(), sender = f.seat(1);
  const SeatManager = f.load('views/scene/room/texas/SeatManager.ts').default;
  const view = Object.create(SeatManager.prototype);
  view.node = f.manager._root;
  view._seatManager = f.room.seatsStateManager;
  view._seatNodesMap = new Map([[1, { node: view.node, avatarNode: sender.avatarNode, throwPropNode: sender.propNode, emojiNode: sender.emojiNode }]]);
  const snapshot = view._getThrowPropSeatNodes(1);
  assert.equal(snapshot.isValid(), true);
  sender.model.seated = false;
  assert.equal(snapshot.isValid(), false);
  assert.equal(view._getThrowPropSeatNodes(1), null);
  sender.model.seated = true;
  sender.model.userID = 2;
  assert.equal(snapshot.isValid(), false);
  sender.model.userID = 1;
  f.room.roomID = 11;
  assert.equal(snapshot.isValid(), false);
  assert.equal(view._getThrowPropSeatNodes(1).isValid(), true);
});

test('换人消息由消息层清理旧玩家待确认表情，不依赖视图订阅', () => {
  const f = fixture(), sender = f.seat(1), receiver = f.seat(2);
  const seats = f.room.seatsStateManager;
  seats.setPendingThrowProp({ userID: 1, targetUserID: 2, type: f.PropsID.PROPSTOMATO });
  seats.setPendingEmoji({ userID: 2, type: f.emoji.type });
  receiver.model.setSeated = seated => { receiver.model.seated = seated; };
  receiver.model.handClear = () => {};
  f.room.mine = { seatNo: 1, remoteCameraEnabled: 0 };
  f.room.basicInfo = {};
  f.room.report = { applySitDown() {} };
  const { SeatedOthers } = f.load('net/messages/texas/SeatedOthers.ts');
  SeatedOthers({ seatId: 2, userRid: 3 }, 10, 0);
  assert.equal(receiver.model.userID, 3);
  assert.equal(receiver.model.seated, true);
  assert.equal(seats._pendingThrowPropData, null);
  assert.equal(seats._pendingEmojiData, null);
  assert.equal(sender.model.seated, true);
});

test('MTT 开始换桌会清理播放及待确认表情，迟到确认不再播放', async () => {
  const f = fixture(), sender = f.seat(1), receiver = f.seat(2);
  await f.play(f.PropsID.PROPSCHEERS, sender, receiver);
  const seats = f.room.seatsStateManager;
  let confirmed = 0;
  seats.on(seats.constructor.CLEAR_EXPRESSIONS, () => f.manager.reset());
  seats.on(seats.constructor.EMOJI, () => confirmed++);
  seats.on(seats.constructor.THROW_PROP, () => confirmed++);
  seats.setPendingEmoji({ userID: 1, type: f.emoji.type });
  seats.setPendingThrowProp({ userID: 1, targetUserID: 2, type: f.PropsID.PROPSCHEERS });
  const Mtt = f.load('data/room/texas/TexasGameRoomDataMtt.ts').default;
  const mtt = Object.create(Mtt.prototype);
  mtt._roomData = f.room; mtt._change = () => {};
  mtt.setTableTransferWaiting(true);
  seats.confirmPendingEmoji(0); seats.confirmPendingThrowProp(0);
  assert.equal(confirmed, 0);
  assert.equal(f.manager._activePropTasks.size, 0);
  assert.equal(f.sounds.size, 0);
});

test('发送前检查座位和牌桌，目标离座、本人离座、换桌后的旧面板均不再发送', () => {
  const f = fixture(), sender = f.seat(1), receiver = f.seat(2);
  const EmojiDlg = f.load('views/dialog/emoji/UIEmojiDlg.ts').default;
  const PlayerInfo = f.load('views/dialog/playerinfo/UIPlayerInfo.ts').default;
  const emojiDlg = Object.create(EmojiDlg.prototype);
  emojiDlg._roomData = f.room; emojiDlg._roomID = 10;
  const playerDlg = Object.create(PlayerInfo.prototype);
  playerDlg._roomData = f.room; playerDlg._param = { roomID: 10, matchID: 0 }; playerDlg._requestRID = 2;
  const prop = { priceID: 0, propAmount: 0 };
  playerDlg._propListData = new Map([[f.PropsID.PROPSTOMATO, prop]]);
  playerDlg._playClickScale = () => {};
  const clickProp = () => playerDlg._clickProp({ type: f.PropsID.PROPSTOMATO }, null);
  const clickEmoji = () => emojiDlg._sendEmojiBroadcast(prop, f.emoji);
  clickProp(); clickEmoji();
  assert.equal(f.sent.length, 2);
  assert.equal(f.sent[0].body.msgType, 4);
  assert.equal(f.sent[1].body.msgType, 1);
  for (const [index, message] of f.sent.entries()) {
    assert.equal(message.code, 1019);
    assert.equal(message.body.consume, 0);
    const envelope = JSON.parse(Buffer.from(message.body.extra).toString('utf8'));
    const data = JSON.parse(envelope.data);
    assert.equal(envelope.code, 1000);
    assert.equal(data.user_id, 1);
    assert.equal(data.target_user_id, index === 0 ? 2 : 0);
    assert.equal(data.type, index === 0 ? f.PropsID.PROPSTOMATO : f.emoji.type);
  }
  receiver.model.seated = false; clickProp();
  sender.model.seated = false; clickEmoji();
  receiver.model.seated = sender.model.seated = true;
  f.room.mtt.tableTransferWaiting = true; clickProp(); clickEmoji();
  f.room.mtt.tableTransferWaiting = false;
  f.room.roomID = 11; clickProp(); clickEmoji();
  assert.equal(f.sent.length, 2);
});
