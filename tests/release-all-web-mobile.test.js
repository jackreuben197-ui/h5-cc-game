const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { test } = require('node:test');

const source = path.resolve(__dirname, '../scripts/release-all-web-mobile.sh');

function fixture(t) {
  // 带空格的路径也必须能够正确传入 Cocos 和发布脚本。
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'cocos release test ')));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const project = path.join(root, 'h5-cc-game');
  const bin = path.join(root, 'bin');
  for (const dir of ['scripts', 'settings', 'local']) {
    fs.mkdirSync(path.join(project, dir), { recursive: true });
  }
  fs.mkdirSync(bin);
  const script = path.join(project, 'scripts/release-all-web-mobile.sh');
  fs.copyFileSync(source, script);
  fs.writeFileSync(path.join(project, 'project.json'), JSON.stringify({ version: '2.4.15' }));
  fs.writeFileSync(path.join(project, 'settings/builder.json'), JSON.stringify({
    title: 'test-game', startScene: 'test-scene', md5Cache: false,
  }));
  fs.writeFileSync(path.join(project, 'local/builder.json'), JSON.stringify({
    debug: true, platform: 'android', buildPath: '/wrong-output',
    previewWidth: '1280', buildScriptsOnly: true,
  }));
  const events = path.join(root, 'events');
  const snapshot = path.join(root, 'config.json');
  const creator = path.join(bin, 'CocosCreator');
  const writeCommand = (file, content) => fs.writeFileSync(file, content, { mode: 0o755 });
  writeCommand(path.join(bin, 'corepack'), '#!/usr/bin/env bash\nexit 0\n');
  writeCommand(path.join(bin, 'npm'), `#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
require('node:assert/strict').deepEqual(process.argv.slice(2), ['run', 'sync:h5-game']);
fs.appendFileSync(process.env.EVENTS_FILE, 'sync:' + process.cwd() + '\\n');
if (process.env.SYNC_STATUS) process.exit(Number(process.env.SYNC_STATUS));
fs.rmSync(path.join(process.cwd(), 'build'), { recursive: true, force: true });
`);
  writeCommand(creator, `#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const [flag, project, build, options] = process.argv.slice(2);
assert.equal(flag, '--path');
assert.equal(build, '--build');
assert.equal(process.cwd(), project);
const configPath = options.slice('configPath='.length);
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
fs.writeFileSync(process.env.CONFIG_SNAPSHOT, JSON.stringify({ config, configPath }));
fs.appendFileSync(process.env.EVENTS_FILE, 'build:' + project + '\\n');
const status = Number(process.env.MOCK_COCOS_STATUS || 0);
if (status !== 0 && status !== 80) process.exit(status);
if (process.env.MISSING_ARTIFACTS !== '1') {
  for (const file of ['index.html', 'src/settings.hash.js', 'main.hash.js', 'cocos2d-js-min.hash.js']) {
    const dest = path.join(config.buildPath, 'web-mobile', file);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, 'built');
  }
}
process.exit(status);
`);
  fs.writeFileSync(path.join(root, 'release-web-mobile2.sh'), `#!/usr/bin/env bash
printf 'release:%s\\n' "$PWD" >> "$EVENTS_FILE"
if [[ -n "$RELEASE_STATUS" ]]; then exit "$RELEASE_STATUS"; fi
`);
  function run(args = [], extraEnv = {}) {
    return spawnSync('bash', [script, ...args], {
      cwd: os.tmpdir(), encoding: 'utf8',
      env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, COCOS_CREATOR: creator,
        EVENTS_FILE: events, CONFIG_SNAPSHOT: snapshot, ...extraEnv },
      timeout: 15000,
    });
  }
  const readEvents = () => fs.existsSync(events) ? fs.readFileSync(events, 'utf8').trim().split('\n') : [];
  const lock = path.join(project, 'local/release-web-mobile/running.lock');
  return { root, project, run, readEvents, snapshot, lock };
}

test('同步、构建、发布按顺序执行，配置正确且临时文件被清理', (t) => {
  const f = fixture(t);
  const result = f.run();
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.deepEqual(f.readEvents(), [`sync:${f.project}`, `build:${f.project}`, `release:${f.root}`]);
  const { config, configPath } = JSON.parse(fs.readFileSync(f.snapshot, 'utf8'));
  assert.equal(config.title, 'test-game');
  assert.equal(config.startScene, 'test-scene');
  assert.equal(config.previewWidth, '1280');
  assert.equal(config.platform, 'web-mobile');
  assert.equal(config.buildPath, path.join(f.project, 'build'));
  assert.equal(config.debug, false);
  assert.equal(config.md5Cache, true);
  assert.equal(config.sourceMaps, false);
  assert.equal(config.embedWebDebugger, false);
  assert.equal(config.buildScriptsOnly, false);
  assert.equal(fs.existsSync(configPath), false);
  assert.equal(fs.existsSync(f.lock), false);
});

test('--dry-run 不执行命令，也不创建日志目录', (t) => {
  const f = fixture(t);
  const result = f.run(['--dry-run']);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(f.readEvents(), []);
  assert.equal(fs.existsSync(path.join(f.project, 'local/release-web-mobile')), false);
});

test('--build-only 只同步和构建', (t) => {
  const f = fixture(t);
  assert.equal(f.run(['--build-only']).status, 0);
  assert.deepEqual(f.readEvents(), [`sync:${f.project}`, `build:${f.project}`]);
});

for (const [name, env, status, steps] of [
  ['同步失败', { SYNC_STATUS: '7' }, 7, 1],
  ['Cocos 构建失败', { MOCK_COCOS_STATUS: '9' }, 9, 2],
  ['Cocos 返回成功但缺少产物', { MISSING_ARTIFACTS: '1' }, 1, 2],
  ['发布失败', { RELEASE_STATUS: '6' }, 6, 3],
]) {
  test(`${name}时停止后续步骤并清理锁`, (t) => {
    const f = fixture(t);
    const result = f.run([], env);
    assert.equal(result.status, status, result.stdout + result.stderr);
    assert.equal(f.readEvents().length, steps);
    assert.equal(fs.existsSync(f.lock), false);
  });
}

test('兼容 Cocos 成功退出码 80', (t) => {
  const f = fixture(t);
  assert.equal(f.run([], { MOCK_COCOS_STATUS: '80' }).status, 0);
  assert.equal(f.readEvents().length, 3);
});

test('已有运行锁时不会开始同步', (t) => {
  const f = fixture(t);
  fs.mkdirSync(f.lock, { recursive: true });
  assert.equal(f.run().status, 1);
  assert.deepEqual(f.readEvents(), []);
});
