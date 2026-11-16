const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const ts = require('typescript');

function transpile(relPath) {
    const fullPath = path.resolve(__dirname, relPath);
    return ts.transpileModule(fs.readFileSync(fullPath, 'utf8'), {
        compilerOptions: { target: ts.ScriptTarget.ES2018, module: ts.ModuleKind.CommonJS, esModuleInterop: true }
    }).outputText;
}

test('HistoryPricing retrieves Alliance Coin prices and falls back to store when needed', async () => {
    const diamondModelCode = transpile('../assets/script/data/trade/DiamondModel.ts');
    const privateStoreCode = transpile('../assets/script/data/trade/PrivateUcChargeStore.ts');
    const diamondConfigTypeCode = transpile('../assets/script/game/constant/DiamondConfigType.ts');
    const historyPricingCode = transpile('../assets/script/views/dialog/history/HistoryPricing.ts');

    const sandbox = {
        cc: { EventTarget: EventEmitter },
        console
    };
    const context = vm.createContext(sandbox);

    // Load DiamondModel
    sandbox.diamondModule = { exports: {} };
    vm.runInContext(
        `(function(module, exports) { ${diamondModelCode} })(diamondModule, diamondModule.exports);`,
        context
    );
    const diamondModel = sandbox.diamondModule.exports.default || sandbox.diamondModule.exports;

    // Load PrivateUcChargeStore
    sandbox.storeModule = { exports: {} };
    vm.runInContext(
        `(function(module, exports) { ${privateStoreCode} })(storeModule, storeModule.exports);`,
        context
    );
    const privateUcChargeStore = sandbox.storeModule.exports.default || sandbox.storeModule.exports;
    const PrivateUcFee = sandbox.storeModule.exports.PrivateUcFee;

    // Load DiamondConfigType
    sandbox.typeModule = { exports: {} };
    vm.runInContext(
        `(function(module, exports) { ${diamondConfigTypeCode} })(typeModule, typeModule.exports);`,
        context
    );
    const { DiamondConfigType, resolvePrivateUcDiamondConfigType } = sandbox.typeModule.exports;

    // Setup globalConfigStore mock
    const globalConfigStore = {
        isChannelDiamondFreeMode: true,
        viewPublicCards: { viewType: 1, freeCount: 0 }
    };

    // Setup TexasTableEvent mock
    const TexasTableEvent = {
        ReqReplayPeekTimes: async () => 0
    };
    TexasTableEvent.default = TexasTableEvent;

    // Load HistoryPricing
    sandbox.pricingModule = { exports: {} };
    sandbox.mockRequire = function(req) {
        if (req.includes('TexasGameRoomData')) return { default: {} };
        if (req.includes('GlobalConfigStore')) return { default: globalConfigStore, __esModule: true };
        if (req.includes('DiamondModel')) return { default: diamondModel, __esModule: true };
        if (req.includes('PrivateUcChargeStore')) return { default: privateUcChargeStore, PrivateUcFee, __esModule: true };
        if (req.includes('DiamondConfigType')) return { DiamondConfigType, resolvePrivateUcDiamondConfigType, __esModule: true };
        if (req.includes('TexasTableEvent')) return { default: TexasTableEvent, __esModule: true };
        throw new Error('Unknown require: ' + req);
    };
    vm.runInContext(
        `(function(module, exports, require) { ${historyPricingCode} })(pricingModule, pricingModule.exports, mockRequire);`,
        context
    );
    const HistoryPricing = sandbox.pricingModule.exports.default || sandbox.pricingModule.exports;

    const mockRoomData = {
        mine: { seatNo: 1 },
        basicInfo: {
            sbante: { sb: 10 }
        }
    };

    // Case 1: diamondModel has UC configuration for peek (type 30, ext 12) and viewPub (type 8, ext 1000)
    diamondModel.setFromH5Sync(30, {
        12: {
            id: 1, config_type: 30, status: 1, type_ext: 12,
            setting: [{ sb: 10, price: 5, discount_price: 5, discount: 1 }],
            start_time: 0, end_time: 0
        }
    });
    diamondModel.setFromH5Sync(8, {
        1000: {
            id: 2, config_type: 8, status: 1, type_ext: 1000,
            setting: [{ sb: 10, price: 2, discount_price: 2, discount: 1 }],
            start_time: 0, end_time: 0
        }
    });

    const peekPrice = await HistoryPricing.getPeekPrice(mockRoomData);
    assert.equal(peekPrice, 5, 'Peek price should match diamondModel config 30 setting');

    const viewPubPrice = await HistoryPricing.getViewPubPrice(mockRoomData, 1);
    assert.equal(viewPubPrice, 2, 'ViewPub price should match diamondModel config 8 setting');

    // Case 2: Round clamped for invalid/all cards dealt
    const viewPubPriceClamped = await HistoryPricing.getViewPubPrice(mockRoomData, 0);
    assert.equal(viewPubPriceClamped, 2, 'Round 0 should clamp to 1');

    // Case 3: diamondModel missing -> fallback to privateUcChargeStore
    diamondModel.setFromH5Sync(30, {});
    diamondModel.setFromH5Sync(8, {});
    privateUcChargeStore.setFromH5Sync({
        items: [
            { feeType: PrivateUcFee.ViewAllPlayers, price: 9 },
            { feeType: PrivateUcFee.ViewPublicCards, price: 6 }
        ]
    });

    const fallbackPeekPrice = await HistoryPricing.getPeekPrice(mockRoomData);
    assert.equal(fallbackPeekPrice, 9, 'Peek price should fall back to privateUcChargeStore.ViewAllPlayers');

    const fallbackViewPubPrice = await HistoryPricing.getViewPubPrice(mockRoomData, 1);
    assert.equal(fallbackViewPubPrice, 6, 'ViewPub price should fall back to privateUcChargeStore.ViewPublicCards');
});
