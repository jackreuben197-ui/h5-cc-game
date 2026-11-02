const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const project = path.resolve(__dirname, '..');
const ts = require(path.join(project, 'node_modules/typescript'));
const root = path.join(project, 'assets/script');

// 运行实际配置、入座、数据绑定和头像回调，替换 Cocos/Agora 的设备与网络边界。
function fixture(type) {
  const cache = new Map();
  const errors = [];
  const silent = { info() {}, debug() {}, warn() {}, error(...args) { errors.push(args); } };
  class EventTarget {
    constructor() { this.listeners = new Map(); }
    on(name, callback, target) {
      const list = this.listeners.get(name) || [];
      list.push({ callback, target });
      this.listeners.set(name, list);
    }
    emit(name, ...args) {
      for (const { callback, target } of this.listeners.get(name) || []) callback.apply(target, args);
    }
  }
  const cc = { EventTarget, Component: class {}, _decorator: {
    ccclass: cls => cls, menu: () => cls => cls, property: () => () => {}
  }, Color: class { static fromHEX(color) { return color; } } };
  const placeholder = new Proxy(class {}, { get: (_, key) => key });
  const ignoredModule = new Proxy({ __esModule: true }, { get: (target, key) => key === 'then' ? undefined : target[key] || placeholder });
  let room;
  const uid = 123;
  const client = {
    localTracks: [], remoteUsers: [], on() {},
    async join() {}, async leave() { this.localTracks = []; },
    async subscribe(user, mediaType) {
      assert.equal(mediaType, 'video');
      user.videoTrack = createTrack('video');
      return user.videoTrack;
    },
    async publish(track) {
      assert.equal(track.closed, false, '不能发布已关闭轨道');
      if (!this.localTracks.includes(track)) this.localTracks.push(track);
    },
    async unpublish(tracks) { this.localTracks = this.localTracks.filter(track => !tracks.includes(track)); }
  };
  let trackId = 0;
  function createTrack(kind) {
    return {
      kind, id: ++trackId, closed: false, muted: false,
      close() { this.closed = true; },
      async setMuted(muted) { assert.equal(this.closed, false); this.muted = muted; },
      getMediaStreamTrack() { return { readyState: this.closed ? 'ended' : 'live', kind }; }
    };
  }
  const window = { isSecureContext: true, setInterval: () => 1, clearInterval() {}, AgoraRTC: {
    setLogLevel() {}, createClient: () => client,
    async createMicrophoneAudioTrack() { return createTrack('audio'); },
    async createCameraVideoTrack() { return createTrack('video'); }
  } };
  const moduleDefault = value => ({ __esModule: true, default: value });
  const actualFiles = new Set([
    'game/constant/VideoModel.ts', 'game/constant/Constants.ts', 'game/constant/MicrophoneIconState.ts',
    'core/decorator/DataBind.ts', 'data/room/texas/TexasGameRoomDataPlayerMine.ts',
    'net/agora/AgoraManager.ts', 'views/scene/room/texas/OtherBindings.ts',
    'net/messages/texas/TexasVideoMediaHelper.ts', 'net/messages/texas/Seated.ts',
    'views/scene/room/texas/SeatPlayer.ts',
    'data/room/texas/TexasGameRoomDataPlayer.ts', 'net/messages/texas/SeatedOthers.ts'
  ]);
  function load(relative) {
    if (cache.has(relative)) return cache.get(relative).exports;
    const module = { exports: {} };
    cache.set(relative, module);
    const filename = path.join(root, relative);
    const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.CommonJS, experimentalDecorators: true }
    }).outputText;
    function requireStub(request) {
      if (request.endsWith('/LogTrace')) return {
        traceClass: () => cls => { cls.prototype.tracelog = silent; return cls; },
        traceMethod: () => () => {}, createLogger: () => silent,
        ITraceLog: { getGlobalLevel: () => 'error' }
      };
      if (request.endsWith('/UIViewUtil')) return moduleDefault({ setNodeGray() {} });
      if (request.endsWith('/RoomDataManager')) return moduleDefault({ getRoomData: () => room });
      if (request.endsWith('/UserStore')) return { ...moduleDefault({ userRID: uid, name: 'test' }), UserStore: placeholder };
      if (request.endsWith('/UserStoreUtils')) return moduleDefault({ updateUserWallet() {}, async preparePropList() {} });
      if (request.endsWith('/PlayerStoreUtils')) return moduleDefault({ syncSeatPlayer() {} });
      if (request.endsWith('/UIViewManager')) return moduleDefault({ showToast(...args) { errors.push(args); } });
      if (request.endsWith('/WebRequest')) return { WWW: { Instance: { async CommonAPI() { return { code: 0, data: 'test-token' }; } } } };
      if (!request.startsWith('.')) return ignoredModule;
      const dependency = path.relative(root, path.resolve(path.dirname(filename), request)) + '.ts';
      return actualFiles.has(dependency) ? load(dependency) : ignoredModule;
    }
    vm.runInNewContext(code, { module, exports: module.exports, require: requireStub, cc, window,
      navigator: {}, sp: { Skeleton: class {} }, console, setTimeout, clearTimeout }, { filename });
    return module.exports;
  }
  const { VideoAntiCheatConfig } = load('game/constant/VideoModel.ts');
  const { ButtonState } = load('game/constant/Constants.ts');
  const { MicrophoneIconState } = load('game/constant/MicrophoneIconState.ts');
  const Mine = load('data/room/texas/TexasGameRoomDataPlayerMine.ts').default;
  const OtherBindings = load('views/scene/room/texas/OtherBindings.ts').default;
  const SeatPlayer = load('views/scene/room/texas/SeatPlayer.ts').default;
  const agora = load('net/agora/AgoraManager.ts').default;
  const { Seated } = load('net/messages/texas/Seated.ts');
  const { SeatedOthers } = load('net/messages/texas/SeatedOthers.ts');
  const Player = load('data/room/texas/TexasGameRoomDataPlayer.ts').default;
  function makeRoom(type) {
    const config = new VideoAntiCheatConfig(type, 0, 6, true, true, true, true, false, false, false, 2, 0);
    const player = { keepSeat() {} };
    const renderedTracks = [];
    const remoteRenderedTracks = [];
    let remotePlayer;
    room = { basicInfo: { antiCheatConfig: config, bringInType: -1, jackpotStartAnimEmit() {} },
      roomID: 1, matchID: 0, report: { applySitDown() {} },
      seatsStateManager: {
        getSeatPlayer: seatNo => seatNo === 2 ? remotePlayer : player,
        getSeatPlayerByUserID: userID => [player, remotePlayer].find(seat => seat.userID === userID),
        forEachPlayer(callback) { [player, remotePlayer].filter(seat => seat.userID > 0).forEach(callback); },
        setMySeat() { room.mine.seatNo = 1; return player; } } };
    room.mine = new Mine(room);
    player.mine = room.mine;
    remotePlayer = new Player(2, 0, room);
    const remoteView = new SeatPlayer();
    remoteView._seatPlayer = remotePlayer;
    remoteView.avatarVideoRender = {
      stopOverlay() {},
      switchToOverlay(track) { remoteRenderedTracks.push(track); }
    };
    remotePlayer.on(Player.REMOTE_VIDEO_VISIBLE_CHANGE, remoteView.onRemoteVideoVisibleChanged, remoteView);
    const seatView = new SeatPlayer();
    seatView._seatPlayer = player;
    seatView.avatarVideoRender = {
      stopOverlay() {},
      switchToOverlay(track) { renderedTracks.push(track); }
    };
    room.mine.on(Mine.LOCAL_CAMERA_STATE_CHANGE_DELAY, seatView.onLocalCameraStateChanged, seatView);
    const ui = new OtherBindings();
    ui._roomData = room;
    ui.btnAudio = { node: {}, interactable: false };
    ui.btnAudioIcon = { changeSpriteFrame() {} };
    ui.btnCamera = { node: {}, interactable: false };
    ui.btnCameratIcon = { changeSpriteFrame() {} };
    room.mine.on(Mine.LOCAL_MICROPHONE_BTN_STATE_CHANGE, ui.onLocalMicrophoneEnabledChanged, ui);
    room.mine.on(Mine.LOCAL_MICROPHONE_STATE_CHANGE, ui.onEnableDisableMicrophone, ui);
    room.mine.on(Mine.LOCAL_CAMERA_BTN_STATE_CHANGE, ui.onLocalCameraStateChanged, ui);
    room.mine.on(Mine.LOCAL_CAMERA_STATE_CHANGE, ui.onEnableDisableCamaera, ui);
    return { ui, player, renderedTracks, remotePlayer, remoteRenderedTracks };
  }
  const settle = () => new Promise(resolve => setImmediate(resolve));
  const seatedMessage = { status: 0, recvSeatId: 1, videoMaskId: 0, chips: 100 };
  agora.init('test');
  const view = makeRoom(type);
  return { ...view, room, agora, errors, ButtonState, MicrophoneIconState,
    async sit() { await Seated(seatedMessage, 1, 0); await settle(); },
    async stand() { await room.mine.clearVideoAndAudio(); room.mine.clearData(); },
    async clickMic() { view.ui.onClickLocalMicrophoneBtn(); await settle(); },
    async publishRemoteVideo() {
      client.remoteUsers.push({ uid: 456, hasVideo: true });
      await agora.onUserPublish(456, 'video');
      await settle();
    },
    async seatRemotePlayer() {
      SeatedOthers({ seatId: 2, userRid: 456, videoMaskId: 0, chips: 100 }, 1, 0);
      await settle();
    }
  };
}

test('语音桌上桌默认关麦，支持连续开关，重新入座仍默认关闭', async () => {
  const f = fixture(2);
  await f.sit();
  assert.equal(f.ui.btnAudio.interactable, true);
  assert.equal(f.room.mine.localMicrophoneBtnState, f.ButtonState.OFF);
  assert.equal(f.room.mine.localMicrophoneEnabled, false);
  assert.equal(f.agora.localAudioTrack, null, '默认关麦时不发布音频');
  for (let i = 0; i < 3; i++) {
    await f.clickMic();
    assert.equal(f.room.mine.localMicrophoneEnabled, true);
    assert.equal(f.agora.localAudioTrack.muted, false);
    assert.equal(f.player.micIconState, f.MicrophoneIconState.HIDDEN);
    await f.clickMic();
    assert.equal(f.room.mine.localMicrophoneEnabled, false);
    assert.equal(f.agora.localAudioTrack.muted, true);
    assert.equal(f.player.micIconState, f.MicrophoneIconState.MUTED);
  }
  await f.clickMic();
  await f.stand();
  await f.sit();
  assert.equal(f.room.mine.localMicrophoneBtnState, f.ButtonState.OFF);
  assert.equal(f.room.mine.localMicrophoneEnabled, false);
  assert.equal(f.agora.localAudioTrack, null);
  assert.deepEqual(f.errors, []);
});

test('视频桌重新入座时发布新轨道，并将有效视频轨道交给头像渲染器', async () => {
  const f = fixture(3);
  await f.sit();
  const firstTrack = f.agora.localVideoTrack;
  assert.ok(firstTrack);
  assert.equal(f.renderedTracks.length, 1);
  assert.equal(f.renderedTracks[0].readyState, 'live');
  await f.stand();
  assert.equal(firstTrack.closed, true);
  assert.equal(f.room.mine.localCameraEnabled, false);
  assert.equal(f.room.mine.localCameraEnabledDelayed, false);
  await f.sit();
  assert.ok(f.agora.localVideoTrack);
  assert.notEqual(f.agora.localVideoTrack, firstTrack);
  assert.equal(f.renderedTracks.length, 2);
  assert.equal(f.renderedTracks[1].readyState, 'live');
  assert.equal(f.room.mine.localCameraEnabledDelayed, true);
  assert.deepEqual(f.errors, []);
});

test('已有旧频道时，入座创建的新轨道不会被旧频道清理关闭', async () => {
  const f = fixture(3);
  await f.agora.join('old-channel', 123);
  await f.agora.enableCamera();
  await f.agora.publishVideo();
  const oldTrack = f.agora.localVideoTrack;
  await f.agora.enableMicrophone();
  await f.agora.publishAudio();
  await f.sit();
  assert.equal(oldTrack.closed, true);
  assert.ok(f.agora.localVideoTrack);
  assert.notEqual(f.agora.localVideoTrack, oldTrack);
  assert.equal(f.agora.localVideoTrack.closed, false);
  assert.equal(f.agora.localAudioTrack.closed, false);
  assert.equal(f.renderedTracks.length, 1);
  assert.equal(f.renderedTracks[0].readyState, 'live');
  assert.deepEqual(f.errors, []);
});

for (const publishFirst of [false, true]) {
  test(`远端视频${publishFirst ? '先发布后入座' : '先入座后发布'}均显示到对应座位`, async () => {
    const f = fixture(3);
    await f.sit();
    if (publishFirst) {
      await f.publishRemoteVideo();
      await f.seatRemotePlayer();
    } else {
      await f.seatRemotePlayer();
      await f.publishRemoteVideo();
    }
    assert.equal(f.remotePlayer.remoteVideoVisible, true);
    assert.equal(f.remoteRenderedTracks.length, 1);
    assert.equal(f.remoteRenderedTracks[0].readyState, 'live');
    assert.deepEqual(f.errors, []);
  });
}
