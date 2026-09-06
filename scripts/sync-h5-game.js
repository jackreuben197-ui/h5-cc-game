const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// 目录路径定义 (基于 __dirname，脚本位于 /scripts/)
const rootDir = path.resolve(__dirname, '..');

// H5 源目录：默认指向本地 littlefish H5 壳工程（我们自己的 UI），而不是 outsource 的
// deps/h5-game 子模块。可用环境变量 H5_GAME_DIR 覆盖（支持相对/绝对路径）。
//   例：H5_GAME_DIR=../../Ola_Vamos_H5-LittleFish/h5-game npm run sync:h5-game
const DEFAULT_H5_GAME_DIR = '../../Ola_Vamos_H5-LittleFish/h5-game';
const h5GameDir = path.resolve(__dirname, '..', process.env.H5_GAME_DIR || DEFAULT_H5_GAME_DIR);
const distDir = path.join(h5GameDir, 'dist');
const targetDir = path.join(rootDir, 'build-templates/web-mobile');
const previewAssetsDir = path.join(rootDir, 'preview-templates/assets');
const cocosBuildDir = path.join(rootDir, 'build');
const h5AssetDirs = ['js', 'css', 'images', 'fonts', 'media', 'misc'];

// 默认【不】对 H5 源做 git reset —— 它是我们的活动工作副本（含本地分支改动，如
// VITE_BRIDGE_TARGET / h5-cc-bridge 依赖），reset 会破坏这些改动。
// 需要从远端强制同步时，显式设置 H5_GAME_SYNC_GIT=1（并自行指定分支 H5_GAME_GIT_REF）。
const SYNC_GIT = process.env.H5_GAME_SYNC_GIT === '1';
const GIT_REF = process.env.H5_GAME_GIT_REF || 'origin/master';

/**
 * 封装执行命令的函数
 */
function runCommand(command, cwd = process.cwd()) {
    console.log(`\n> 执行: ${command}`);
    try {
        execSync(command, { cwd, stdio: 'inherit' });
    } catch (error) {
        console.error(`\n[ERROR] 命令执行失败: ${command}`);
        process.exit(1);
    }
}

/**
 * 删除上一批 H5 哈希资源，保留 Cocos 的 resources、preview vendor 等目录。
 */
function cleanH5Assets(assetsDir) {
    if (!fs.existsSync(assetsDir)) return;
    for (const assetDir of h5AssetDirs) {
        fs.rmSync(path.join(assetsDir, assetDir), { recursive: true, force: true });
    }
}

function resolveLocalI18nRuntime() {
    const candidates = [
        path.resolve(rootDir, '../h5-cc-i18n/dist/h5-cc-i18n.min.js'),
        path.resolve(rootDir, 'node_modules/@silenthill/h5-cc-i18n/dist/h5-cc-i18n.min.js'),
    ];
    return candidates.find((file) => fs.existsSync(file));
}

function overrideI18nRuntime() {
    const source = resolveLocalI18nRuntime();
    if (!source) {
        console.warn('\n[WARN] 未找到本地 h5-cc-i18n runtime，保留 h5-game 构建产物中的版本。');
        return;
    }

    const targets = [
        path.join(h5GameDir, 'public/h5-cc-i18n.min.js'),
        path.join(distDir, 'h5-cc-i18n.min.js'),
    ];
    for (const target of targets) {
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.copyFileSync(source, target);
    }
    console.log(`\n[2.5/5] 已用本地 i18n runtime 覆盖 h5-game 产物: ${source}`);
}

// 检查仓库是否存在
if (!fs.existsSync(h5GameDir)) {
    console.error(`[ERROR] H5 源目录不存在: ${h5GameDir}，请检查路径或设置 H5_GAME_DIR。`);
    process.exit(1);
}

console.log('--- 开始自动化构建任务 ---');
console.log('H5 源目录:', h5GameDir);

// [1/5] Git 操作（默认跳过，保护本地工作副本）
if (SYNC_GIT) {
    console.log(`\n[1/5] 从远端同步 H5 源代码 (${GIT_REF})...`);
    runCommand('git fetch --all', h5GameDir);
    runCommand(`git reset --hard ${GIT_REF}`, h5GameDir);
} else {
    console.log('\n[1/5] 跳过 git同步（使用本地工作副本；如需强制同步请设 H5_GAME_SYNC_GIT=1）');
}

// [2/5] Build h5-game
console.log('\n[2/5] 开始构建 h5-game...');
runCommand('pnpm install', h5GameDir);
runCommand('pnpm build', h5GameDir);
overrideI18nRuntime();

// [3/5] 清理旧 H5 资源并复制 dist 文件...
console.log('\n[3/5] 清理旧 H5 资源并复制 dist 文件...');
try {
    cleanH5Assets(path.join(targetDir, 'assets'));
    cleanH5Assets(previewAssetsDir);

    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }
    fs.cpSync(distDir, targetDir, { recursive: true, force: true });
    console.log('旧 H5 哈希资源已清理，当前 dist 复制成功。');
} catch (error) {
    console.error(`[ERROR] 复制文件失败: ${error.message}`);
    process.exit(1);
}

// [4/5] Run sync:template
console.log('\n[4/5] 执行 sync:template...');
runCommand('npm run sync:template');

// [5/5] 删除旧 Cocos 构建，确保下一次打包从空目录开始
console.log('\n[5/5] 清理旧 Cocos build...');
try {
    fs.rmSync(cocosBuildDir, { recursive: true, force: true });
    console.log(`已删除: ${cocosBuildDir}`);
} catch (error) {
    console.error(`[ERROR] 清理 Cocos build 失败: ${error.message}`);
    process.exit(1);
}

console.log('\n--- 全部任务执行完毕 ---');
