"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require('es6-promise').polyfill(); /* tslint:disable-line */
require('isomorphic-fetch'); /* tslint:disable-line */
const waves_transactions_1 = require("@waves/waves-transactions");
const MWAV_MULT = Math.pow(10, 8);
const TRANSFER_GETTERS = [
    (address, limit = 100) => __awaiter(this, void 0, void 0, function* () {
        let url = `https://nodes.wavesnodes.com/transactions/address/${address}/limit/${limit}`;
        let res;
        try {
            res = yield fetch(url);
        }
        catch (e) {
            throw new Error(e);
        }
        if (res.status !== 200) {
            throw new Error(`Response status code: ${res.status}`);
        }
        const [transactions] = yield res.json();
        // TODO pagination
        // if (transactions.length === limit) {
        //   // do request again with ?after=<transactions[transactions.length-1].id>
        // }
        const transferTransactions = transactions.filter(tx => tx.type === 4);
        return transferTransactions.map(rawTx => ({
            from: rawTx.sender,
            to: rawTx.recipient,
            timestamp: rawTx.timestamp / 1000 | 0,
            value: rawTx.amount / MWAV_MULT,
            height: rawTx.height,
            txHash: rawTx.id
        }));
    })
];
exports.getTransfers = (address, limit = 100) => __awaiter(this, void 0, void 0, function* () {
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
        res = yield fetch(`https://nodes.wavesnodes.com/addresses/balance://nodes.wavesnodes.com/addresses/balance/${address}/0`);
    }
    catch (e) {
        throw new Error(e);
    }
    if (res.status !== 200) {
        throw new Error(`Response status code: ${res.status}`);
    }
    const jsonResult = yield res.json();
    return jsonResult.balance;
});
exports.payWAV = (privateKey, from, to, amount) => __awaiter(this, void 0, void 0, function* () {
    const signed = waves_transactions_1.transfer({
        amount: amount * Math.pow(10, 8),
        fee: 100000,
        recipient: to,
    }, privateKey);
    const nodeUrl = 'https://nodes.wavesplatform.com';
    return yield waves_transactions_1.broadcast(signed, nodeUrl);
});
//# sourceMappingURL=wav.js.map