/**
 * sync-bridge.js
 *
 * 把 h5-cc-bridge 仓库的 cc-side 源码同步到 assets/script/bridge/，
 * 让 Cocos Creator 2.4 自己的 TS 编译器原生编译（绕开 node_modules 解析）。
 *
 * 触发：手动 `npm run sync:bridge`；或在 commit:prepare 流程里串一下。
 *
 * 行为：
 *   1. 首次：git clone --depth 1 -b <ref> 仓库到 deps/h5-cc-bridge/
 *   2. 已存在：git fetch origin <ref> + git reset --hard origin/<ref>
 *   3. 复制 deps/h5-cc-bridge/src/{actions,cocosToH5,h5ToCocos,cc-side}.ts → assets/script/bridge/
 *      故意跳过 message.ts / h5-side.ts / index.ts：CC 端不消费 envelope 运行时，
 *      `import from './bridge/cc-side'` 即可拿到所有需要的 action 常量与 payload 类型。
 *   4. 写 assets/script/bridge/.SYNCED_FROM 记录 commit SHA + 时间
 *
 * 本地开发跟 #main；上线发布把 BRIDGE_REF 改成 tag (v0.1.0) 或 commit SHA。
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const REPO_URL = process.env.BRIDGE_REPO_URL || 'git@github.com:soolary/h5-cc-bridge.git';
const BRIDGE_REF = process.env.BRIDGE_REF || 'main';

const depsDir = path.resolve(__dirname, '../deps/h5-cc-bridge');
const srcDir = path.join(depsDir, 'src');
const targetDir = path.resolve(__dirname, '../assets/script/bridge');
const stampFile = path.join(targetDir, '.SYNCED_FROM');

// CC 端需要的源码白名单。cc-side.ts 是聚合入口；
// 其余三个是它 re-export 依赖的纯类型 / 常量文件。
const CC_SIDE_FILES = ['actions.ts', 'cocosToH5.ts', 'h5ToCocos.ts', 'cc-side.ts'];

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
    console.log('\n[1/4] 更新 h5-cc-bridge 到', BRIDGE_REF, '...');
    if (!fs.existsSync(path.join(depsDir, '.git'))) {
        // 首次同步：deps/h5-cc-bridge 还没克隆，按 ref 拉一份浅克隆。
        console.log(`(首次同步) git clone ${REPO_URL} → ${path.relative(process.cwd(), depsDir)}`);
        fs.mkdirSync(path.dirname(depsDir), { recursive: true });
        run(`git clone --depth 1 -b ${BRIDGE_REF} ${REPO_URL} ${depsDir}`);
        return;
    }
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

    console.log('[3/4] 复制 cc-side 白名单 → assets/script/bridge/');
    for (const file of CC_SIDE_FILES) {
        const sourceFile = path.join(srcDir, file);
        if (!fs.existsSync(sourceFile)) {
            console.error(`[ERROR] ${sourceFile} 不存在，仓库结构异常（可能 bridge 还没合并 cc-side 入口）`);
            process.exit(1);
        }
        fs.copyFileSync(sourceFile, path.join(targetDir, file));
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
