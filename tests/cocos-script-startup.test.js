const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const ts = require('typescript');

const filename = path.resolve(__dirname, '../assets/script/data/trade/DiamondModel.ts');
const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS }
}).outputText;
const config = {
    id: 1, config_type: 2, status: 1, type_ext: 1010,
    setting: [{ sb: 15, price: 30, discount_price: 0, discount: 1 }],
    start_time: 0, end_time: 0
};

function fixture() {
    const module = { exports: {} };
    const requests = [];
    let imports = 0;
    const http = {
        response: { data: { data: [config] } },
        error: null,
        CommonAPI(request) {
            requests.push(request);
            return http.error ? Promise.reject(http.error) : Promise.resolve(http.response);
        }
    };
    const WebGetDiamondConfig = { API: '/config/diamond' };
    function requireDependency(request) {
        assert.equal(request, '../../net/https/WebRequest');
        imports++;
        // WebRequest 会经 HttpClient/UIViewManager 加载引用这些静态事件的 UI。
        assert.equal(module.exports.DiamondModel?.CONFIG_CHANGED, 'DIAMOND_CONFIG_CHANGED',
            'HTTP/UI dependencies must load after DiamondModel has finished exporting');
        return { WebGetDiamondConfig, WWW: { Instance: http } };
    }
    vm.runInNewContext(code, {
        module, exports: module.exports, require: requireDependency,
        cc: { EventTarget: EventEmitter }
    }, { filename });
    return { ...module.exports, requests, http, WebGetDiamondConfig, get imports() { return imports; } };
}

test('加载钻石数据模型和应用 H5 配置时不初始化 HTTP/UI 依赖', async () => {
    const f = fixture();
    const model = f.default;
    const changed = [];
    model.on(f.DiamondModel.CONFIG_CHANGED, type => changed.push(type));
    model.setFromH5Sync(config.config_type, { [config.type_ext]: config });
    await model.reqDiamondConfig(config.config_type);

    assert.equal(f.imports, 0);
    assert.equal(f.requests.length, 0);
    assert.equal(model.getPrice(config.config_type, config.type_ext, 15), 30);
    assert.deepEqual(changed, [config.config_type]);
});

test('未缓存的钻石配置在模型初始化后请求，并保留缓存和变更事件', async () => {
    const f = fixture();
    const model = f.default;
    const changed = [];
    model.on(f.DiamondModel.CONFIG_CHANGED, type => changed.push(type));
    await model.reqDiamondConfig(config.config_type);
    await model.reqDiamondConfig(config.config_type);

    assert.equal(f.imports, 1);
    assert.equal(f.requests.length, 1);
    assert.equal(f.requests[0].web_class, f.WebGetDiamondConfig);
    assert.equal(f.requests[0].body.config_type, config.config_type);
    assert.equal(model.getDiamondConfig(config.type_ext, config.config_type), config);
    assert.deepEqual(changed, [config.config_type]);
});

test('HTTP 依赖加载期间收到 H5 配置后直接使用缓存', async () => {
    const f = fixture();
    const model = f.default;
    const pending = model.reqDiamondConfig(config.config_type);
    model.setFromH5Sync(config.config_type, { [config.type_ext]: config });
    await pending;

    assert.equal(f.requests.length, 0);
    assert.equal(model.getDiamondConfig(config.type_ext, config.config_type), config);
});

test('钻石配置请求失败向调用方抛出错误，后续调用可以重试', async () => {
    const f = fixture();
    const model = f.default;
    const failure = new Error('request failed');
    f.http.error = failure;
    await assert.rejects(model.reqDiamondConfig(config.config_type), error => error === failure);
    assert.equal(model.getDiamondConfig(config.type_ext, config.config_type), null);

    f.http.error = null;
    await model.reqDiamondConfig(config.config_type);
    assert.equal(f.requests.length, 2);
    assert.equal(model.getDiamondConfig(config.type_ext, config.config_type), config);
});

function agoraFixture() {
    const agoraFilename = path.resolve(__dirname, '../assets/script/net/agora/AgoraManager.ts');
    const agoraCode = ts.transpileModule(fs.readFileSync(agoraFilename, 'utf8'), {
        compilerOptions: { target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS, experimentalDecorators: true }
    }).outputText;
    const module = { exports: {} };
    const requests = [];
    let imports = 0;
    const http = {
        error: null,
        async CommonAPI(request) {
            requests.push(request);
            if (http.error) throw http.error;
            return { data: 'agora-test-token' };
        }
    };
    const WebMiscAgoraToken = { API: '/misc/agora/token' };
    const silent = { info() {}, debug() {}, warn() {}, error() {} };
    function requireDependency(request) {
        if (request.endsWith('/LogTrace')) return {
            traceClass: () => cls => { cls.prototype.tracelog = silent; return cls; }
        };
        assert.equal(request, '../https/WebRequest');
        imports++;
        assert.ok(module.exports.default, 'HTTP/UI dependencies must load after AgoraManager has finished exporting');
        return { WebMiscAgoraToken, WWW: { Instance: http } };
    }
    vm.runInNewContext(agoraCode, {
        module, exports: module.exports, require: requireDependency
    }, { filename: agoraFilename });
    return { manager: module.exports.default, requests, http, WebMiscAgoraToken,
        get imports() { return imports; } };
}

test('加载 Agora 管理器时不初始化 HTTP/UI 依赖，获取 Token 时才发请求', async () => {
    const f = agoraFixture();
    assert.equal(f.imports, 0);
    assert.equal(await f.manager.fetchToken('room-123', 456), 'agora-test-token');
    assert.equal(f.imports, 1);
    assert.equal(f.requests.length, 1);
    assert.equal(f.requests[0].web_class, f.WebMiscAgoraToken);
    assert.equal(f.requests[0].body.channel_name, 'room-123');
    assert.equal(f.requests[0].body.uid, 456);
    assert.equal(f.requests[0].body.role, 1);
});

test('Agora Token 请求失败返回空值，后续请求可以重试', async () => {
    const f = agoraFixture();
    f.http.error = new Error('token unavailable');
    assert.equal(await f.manager.fetchToken('room-123', 456), null);
    f.http.error = null;
    assert.equal(await f.manager.fetchToken('room-123', 456), 'agora-test-token');
    assert.equal(f.requests.length, 2);
});
