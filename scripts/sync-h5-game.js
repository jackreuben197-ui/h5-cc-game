const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// 目录路径定义 (基于 __dirname，假设文件位于 /scripts/build.js)
const h5GameDir = path.resolve(__dirname, '../deps/h5-game');
const distDir = path.join(h5GameDir, 'dist');
const targetDir = path.resolve(__dirname, '../build-templates/web-mobile');

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

// 检查仓库是否存在
if (!fs.existsSync(h5GameDir)) {
    console.error(`[ERROR] 子模块目录不存在: ${h5GameDir}，请检查路径。`);
    process.exit(1);
}

console.log('--- 开始自动化构建任务 ---');

// [1/4] Git 操作
console.log('\n[1/4] 更新子模块代码...');
runCommand('git fetch --all', h5GameDir);
runCommand('git reset --hard origin/main', h5GameDir);

// [2/4] Build h5-game
console.log('\n[2/4] 开始构建 h5-game...');
runCommand('pnpm install', h5GameDir);
runCommand('pnpm build', h5GameDir);

// [3/4] Copy dist
console.log('\n[3/4] 复制 dist 文件...');
try {
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }
    fs.cpSync(distDir, targetDir, { recursive: true, force: true });
    console.log('复制成功。');
} catch (error) {
    console.error(`[ERROR] 复制文件失败: ${error.message}`);
    process.exit(1);
}

// [4/4] Run sync:template
console.log('\n[4/4] 执行 sync:template...');
runCommand('npm run sync:template');

console.log('\n--- 全部任务执行完毕 ---');