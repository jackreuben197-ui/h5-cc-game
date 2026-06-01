/**
 * 声网 Token 本地测试服务
 * 仅用于开发测试，生产环境请将此逻辑部署到正式后端
 *
 * 启动方式：node scripts/agora-token-server.js
 * 默认端口：3333
 */

const http = require('http');
const url = require('url');
const { RtcTokenBuilder, RtcRole } = require('agora-token');

// ============ 配置（与 AgoraManager.ts 保持一致）============
const APP_ID = 'da91afd18fa84618bee90c5468b06a5f';
const APP_CERTIFICATE = '569bd27e2ef74ff4b2904910b359cf9d';
// ==========================================================

const PORT = 3333;
const TOKEN_EXPIRE_SECONDS = 3600; // Token 有效期 1 小时

const server = http.createServer((req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

    const parsed = url.parse(req.url, true);

    // GET /token?channel=xxx&uid=0
    if (parsed.pathname === '/token' && req.method === 'GET') {
        const channel = parsed.query.channel || 'test';
        const uid = parseInt(parsed.query.uid) || 0;
        const role = parsed.query.role === 'audience' ? RtcRole.SUBSCRIBER : RtcRole.PUBLISHER;

        try {
            const token = RtcTokenBuilder.buildTokenWithUid(
                APP_ID, APP_CERTIFICATE, channel, uid, role, TOKEN_EXPIRE_SECONDS
            );
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ token, channel, uid, expireIn: TOKEN_EXPIRE_SECONDS }));
            console.log(`[TokenServer] 生成Token: channel=${channel}, uid=${uid}`);
        } catch (e) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: e.message }));
            console.error('[TokenServer] 生成Token失败:', e.message);
        }
        return;
    }

    // GET /health
    if (parsed.pathname === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', appId: APP_ID }));
        return;
    }

    res.writeHead(404);
    res.end('Not Found');
});

server.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`  声网 Token 本地测试服务已启动`);
    console.log(`  地址: http://localhost:${PORT}`);
    console.log(`  用法: http://localhost:${PORT}/token?channel=xxx&uid=0`);
    console.log(`========================================`);
});
