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
const lisk_elements_1 = require("lisk-elements");
const client = lisk_elements_1.APIClient.createMainnetAPIClient();
const TRANSFER_GETTERS = [
    (address) => __awaiter(this, void 0, void 0, function* () {
        let res;
        try {
            res = yield fetch(`https://explorer.lisk.io/api/getTransactions?senderId=${address}`);
        }
        catch (e) {
            throw new Error(e);
        }
        if (res.status !== 200) {
            throw new Error(`Response status code: ${res.status}`);
        }
        const jsonResult = yield res.json();
        return jsonResult.transactions.map(rawTx => ({
            from: rawTx.senderId,
            to: rawTx.recipientId,
            timestamp: rawTx.timestamp,
            value: parseInt(rawTx.amount, 10),
            height: rawTx.height,
            txHash: rawTx.id
        }));
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
        res = yield fetch(`https://explorer.lisk.io/api/getAccount?address=${address}`);
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
exports.payLSK = (privateKey, from, to, amount) => __awaiter(this, void 0, void 0, function* () {
    try {
        const transaction = lisk_elements_1.transactions.transfer({
            amount: (amount * Math.pow(10, 8)).toString(),
            passphrase: privateKey,
            recipientId: to,
        });
        return yield client.transactions.broadcast(transaction);
    }
    catch (err) {
        return err;
    }
});
//# sourceMappingURL=lsk.js.map