const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// 目录路径定义 (基于 __dirname，假设文件位于 /scripts/build.js)
const rootDir = path.resolve(__dirname, '..');
const useLocalH5Game = process.argv.includes('--local');
const h5GameDir = useLocalH5Game
    ? path.resolve(rootDir, '../h5-game')
    : path.resolve(rootDir, 'deps/h5-game');
const distDir = path.join(h5GameDir, 'dist');
const targetDir = path.join(rootDir, 'build-templates/web-mobile');
const previewAssetsDir = path.join(rootDir, 'preview-templates/assets');
const cocosBuildDir = path.join(rootDir, 'build');
const h5AssetDirs = ['js', 'css', 'images', 'fonts', 'media', 'misc'];
const packageManager = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8')).packageManager;

if (!/^pnpm@\d+\.\d+\.\d+$/.test(packageManager)) {
    console.error(`[ERROR] package.json 中缺少有效的 pnpm packageManager: ${packageManager || '(未配置)'}`);
    process.exit(1);
}

const pnpmCommand = `corepack ${packageManager}`;

/**
 * 封装执行命令的函数
 */
function runCommand(command, cwd = process.cwd(), env = {}) {
    console.log(`\n> 执行: ${command}`);
    try {
        execSync(command, { cwd, stdio: 'inherit', env: { ...process.env, ...env } });
    } catch (error) {
        console.error(`\n[ERROR] 命令执行失败: ${command}`);
        process.exit(1);
    }
}

/**
 * 删除上一批 H5 哈希资源，保留 Cocos 的 resources、preview vendor 等目录。
 */
function cleanH5Assets(assetsDir) {
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
    const sourceType = useLocalH5Game ? '同级本地 h5-game' : 'h5-game 子模块';
    console.error(`[ERROR] ${sourceType}目录不存在: ${h5GameDir}，请检查路径。`);
    process.exit(1);
}

console.log(`--- 开始自动化构建任务（${useLocalH5Game ? '本地模式' : '远程模式'}）---`);
console.log(`H5 源目录: ${h5GameDir}`);

// [1/5] Git 操作
if (useLocalH5Game) {
    console.log('\n[1/5] 使用同级本地 h5-game，跳过 Git 更新，保留未提交改动。');
} else {
    console.log('\n[1/5] 更新子模块代码...');
    runCommand('git fetch --all', h5GameDir);
    runCommand('git reset --hard origin/master', h5GameDir);
}

// [2/5] Build h5-game
console.log('\n[2/5] 开始构建 h5-game...');
if (useLocalH5Game) {
    console.log('本地模式跳过 pnpm install，直接使用当前本地依赖。');
} else {
    runCommand(`${pnpmCommand} install`, h5GameDir, { CI: 'true' });
}
runCommand(`${pnpmCommand} build`, h5GameDir, { VITE_BRIDGE_TARGET: 'h5-cc-game' });
overrideI18nRuntime();

// [3/5] 清理旧 H5 资源并复制当前 dist
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
runCommand('npm run sync:template', rootDir);

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
