"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const neon_js_1 = __importStar(require("@cityofzion/neon-js"));
const neon_core_1 = require("@cityofzion/neon-core");
require('es6-promise').polyfill(); /* tslint:disable-line */
require('isomorphic-fetch'); /* tslint:disable-line */
const NEO_ASSET_HASH = 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b';
const TRANSFER_GETTERS = [
    (address) => __awaiter(this, void 0, void 0, function* () {
        let res;
        try {
            res = yield fetch(`https://api.neoscan.io/api/main_net/v1/get_address_abstracts/${address}/1`);
        }
        catch (e) {
            throw new Error(e);
        }
        if (res.status !== 200) {
            throw new Error(`Response status code: ${res.status}`);
        }
        const jsonResult = yield res.json();
        let transfers = [];
        for (let tx of jsonResult.entries) {
            if (tx.asset === NEO_ASSET_HASH) {
                transfers.push({
                    to: tx.address_to,
                    from: tx.address_from,
                    timestamp: tx.time,
                    value: tx.amount,
                    height: tx.block_height,
                    txHash: tx.txid
                });
            }
        }
        return transfers;
    })
];
exports.getTransfers = (address) => __awaiter(this, void 0, void 0, function* () {
    let lastError;
    for (const fn of TRANSFER_GETTERS) {
        try {
            const res = yield fn(address);
            return res;
        }
        catch (e) {
            lastError = e;
            continue;
        }
    }
    throw new Error(lastError);
});
exports.getBalance = (address) => __awaiter(this, void 0, void 0, function* () {
    let res;
    try {
        res = yield fetch(`https://api.neoscan.io/api/main_net/v1/get_balance/${address}`);
    }
    catch (e) {
        throw new Error(e);
    }
    if (res.status !== 200) {
        throw new Error(`Response status code: ${res.status}`);
    }
    const jsonResult = yield res.json();
    let neoAmount;
    for (const assetBalance of jsonResult.balance) {
        if (assetBalance.asset_hash === NEO_ASSET_HASH) {
            neoAmount = assetBalance.amount;
            break;
        }
    }
    if (neoAmount === undefined) {
        throw new Error(`Could not find NEO asset, got assets: ${jsonResult.balance.map(a => a.asset)} in response`);
    }
    return neoAmount;
});
exports.payNEO = (privateKey, from, to, amount) => __awaiter(this, void 0, void 0, function* () {
    try {
        const config = {
            account: new neon_core_1.wallet.Account(privateKey),
            api: new neon_js_1.api.neoscan.instance('MainNet'),
            intents: neon_js_1.api.makeIntent({ NEO: amount }, to),
        };
        return yield neon_js_1.default.sendAsset(config);
    }
    catch (err) {
        return err;
    }
});
//# sourceMappingURL=neo.js.map