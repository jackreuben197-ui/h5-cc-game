const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// 目录路径定义 (基于 __dirname，假设文件位于 /scripts/build.js)
const rootDir = path.resolve(__dirname, '..');
const h5GameDir = path.resolve(__dirname, '../deps/h5-game');
const distDir = path.join(h5GameDir, 'dist');
const targetDir = path.join(rootDir, 'build-templates/web-mobile');
const previewAssetsDir = path.join(rootDir, 'preview-templates/assets');
const cocosBuildDir = path.join(rootDir, 'build');
const h5AssetDirs = ['js', 'css', 'images', 'fonts', 'media', 'misc'];

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
    for (const assetDir of h5AssetDirs) {
        fs.rmSync(path.join(assetsDir, assetDir), { recursive: true, force: true });
    }
}

// 检查仓库是否存在
if (!fs.existsSync(h5GameDir)) {
    console.error(`[ERROR] 子模块目录不存在: ${h5GameDir}，请检查路径。`);
    process.exit(1);
}

console.log('--- 开始自动化构建任务 ---');

// [1/5] Git 操作
console.log('\n[1/5] 更新子模块代码...');
runCommand('git fetch --all', h5GameDir);
runCommand('git reset --hard origin/master', h5GameDir);

// [2/5] Build h5-game
console.log('\n[2/5] 开始构建 h5-game...');
runCommand('pnpm install', h5GameDir);
runCommand('pnpm build', h5GameDir);

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
