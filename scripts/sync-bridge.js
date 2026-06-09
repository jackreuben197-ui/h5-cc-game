/**
 * sync-bridge.js
 *
 * 把 h5-cc-bridge 仓库的 src/ TypeScript 协议源码同步到 assets/script/bridge/，
 * 让 Cocos Creator 2.4 自己的 TS 编译器原生编译（绕开 node_modules 解析）。
 *
 * 触发：手动 `npm run sync:bridge`；或在 commit:prepare 流程里串一下。
 *
 * 行为：
 *   1. 首次：git clone --depth 1 -b <ref> 仓库到 deps/h5-cc-bridge/
 *   2. 已存在：git fetch origin <ref> + git reset --hard origin/<ref>
 *   3. 复制 deps/h5-cc-bridge/src/* → assets/script/bridge/
 *   4. 写 assets/script/bridge/.SYNCED_FROM 记录 commit SHA + 时间
 *
 * 本地开发跟 #main；上线发布把 BRIDGE_REF 改成 tag (v0.1.0) 或 commit SHA。
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const REPO_URL = 'https://github.com/soolary/h5-cc-bridge.git';
const BRIDGE_REF = process.env.BRIDGE_REF || 'main';

const depsDir = path.resolve(__dirname, '../deps/h5-cc-bridge');
const srcDir = path.join(depsDir, 'src');
const targetDir = path.resolve(__dirname, '../assets/script/bridge');
const stampFile = path.join(targetDir, '.SYNCED_FROM');

function run(command, cwd = process.cwd()) {
    console.log(`> ${command}` + (cwd !== process.cwd() ? `  (cwd=${path.relative(process.cwd(), cwd)})` : ''));
    try {
        execSync(command, { cwd, stdio: 'inherit' });
    } catch (error) {
        console.error(`[ERROR] 命令失败: ${command}`);
        process.exit(1);
    }
}

function captureRun(command, cwd) {
    return execSync(command, { cwd, encoding: 'utf8' }).trim();
}

function ensureRepo() {
    if (!fs.existsSync(depsDir)) {
        console.log('\n[1/4] 首次克隆 h5-cc-bridge ...');
        const parent = path.dirname(depsDir);
        fs.mkdirSync(parent, { recursive: true });
        run(`git clone --depth 1 -b ${BRIDGE_REF} ${REPO_URL} ${path.basename(depsDir)}`, parent);
        return;
    }

    console.log('\n[1/4] 更新 h5-cc-bridge 到', BRIDGE_REF, '...');
    run('git fetch --all --tags', depsDir);
    run(`git reset --hard origin/${BRIDGE_REF}`, depsDir);
}

function copyBridgeSrc() {
    if (!fs.existsSync(srcDir)) {
        console.error(`[ERROR] ${srcDir} 不存在，仓库结构异常`);
        process.exit(1);
    }
    console.log('\n[2/4] 清空 assets/script/bridge/ ...');
    if (fs.existsSync(targetDir)) {
        fs.rmSync(targetDir, { recursive: true, force: true });
    }
    fs.mkdirSync(targetDir, { recursive: true });

    console.log('[3/4] 复制 src/*.ts → assets/script/bridge/');
    const entries = fs.readdirSync(srcDir, { withFileTypes: true });
    for (const entry of entries) {
        if (!entry.isFile() || !entry.name.endsWith('.ts')) continue;
        fs.copyFileSync(path.join(srcDir, entry.name), path.join(targetDir, entry.name));
    }
}

function writeStamp() {
    console.log('\n[4/4] 写入 .SYNCED_FROM ...');
    const sha = captureRun('git rev-parse HEAD', depsDir);
    const ref = captureRun('git symbolic-ref --short -q HEAD 2>/dev/null || git describe --tags --always', depsDir);
    const content = [
        `repo: ${REPO_URL}`,
        `ref: ${ref || BRIDGE_REF}`,
        `commit: ${sha}`,
        `syncedAt: ${new Date().toISOString()}`,
        '',
        '# 不要手动编辑 bridge/ 下任何文件，所有改动到 h5-cc-bridge 仓库后跑 npm run sync:bridge。',
        ''
    ].join('\n');
    fs.writeFileSync(stampFile, content, 'utf8');
}

console.log('--- sync:bridge 开始 ---');
ensureRepo();
copyBridgeSrc();
writeStamp();
console.log('\n--- sync:bridge 完成 ---');
