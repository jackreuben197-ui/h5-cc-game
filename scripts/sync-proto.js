const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const repoDir = path.resolve(__dirname, '../deps/agreement-web');
const holdemSrc = path.join(repoDir, 'holdem/pb');
const cowboySrc = path.join(repoDir, 'cowboy/pb');
const holdemDst = path.resolve(__dirname, '../assets/script/protobuf/holdem');

function copyFiles(src, dst) {
    if (!fs.existsSync(src)) return console.warn(`[WARN] 源目录不存在: ${src}`);
    if (!fs.existsSync(dst)) fs.mkdirSync(dst, { recursive: true });
    
    fs.readdirSync(src).forEach(file => {
        if (file.endsWith('.js') || file.endsWith('.ts')) {
            fs.copyFileSync(path.join(src, file), path.join(dst, file));
        }
    });
    console.log(`[SUCCESS] 已同步: ${dst}`);
}

try {
    // 1. 更新协议仓库
    console.log(`\n>>> 更新协议仓库: agreement-web`);
    execSync('git fetch origin && git reset --hard origin/master', { cwd: repoDir, stdio: 'inherit' });

    // 2. 拷贝
    copyFiles(holdemSrc, holdemDst);
    
    console.log('\n[SUCCESS] 协议同步完成！');
} catch (e) {
    console.error('[ERROR] 协议同步失败:', e.message);
    process.exit(1);
}