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
const web3_1 = require("./web3");
require('es6-promise').polyfill(); /* tslint:disable-line */
require('isomorphic-fetch'); /* tslint:disable-line */
const ETH_WEI_MULT = Math.pow(10, 18);
const TRANSFER_GETTERS = [
    // NOTE: cannot use blockcypher api here because value is a sum of amount and fee
    (address) => __awaiter(this, void 0, void 0, function* () {
        let res;
        try {
            res = yield fetch(`https://blockscout.com/eth/mainnet/api?module=account&action=txlist&address=${address}`);
        }
        catch (e) {
            throw new Error(e);
        }
        if (res.status !== 200) {
            throw new Error(`Response status code: ${res.status}`);
        }
        const jsonResult = yield res.json();
        return jsonResult.result.map(rawTx => ({
            from: rawTx.from,
            to: rawTx.to,
            value: parseInt(rawTx.value, 10),
            timestamp: parseInt(rawTx.timestamp),
            height: parseInt(rawTx.blockNumber, 10),
            txHash: rawTx.hash
        }));
    }),
];
const BALANCE_GETTERS = [
    (address) => __awaiter(this, void 0, void 0, function* () {
        let res;
        try {
            res = yield fetch(`https://blockscout.com/eth/mainnet/api?module=account&action=eth_get_balance&address=${address}`);
        }
        catch (e) {
            throw new Error(e);
        }
        if (res.status !== 200) {
            throw new Error(`Response status code: ${res.status}`);
        }
        const jsonResult = yield res.json();
        return web3_1.web3.utils.toBN(jsonResult.result).toString();
    }),
];
exports.getETHTransfers = (addr) => __awaiter(this, void 0, void 0, function* () {
    let lastError;
    for (const fn of TRANSFER_GETTERS) {
        try {
            const res = yield fn(addr);
            return res;
        }
        catch (e) {
            lastError = e;
            continue;
        }
    }
    throw new Error(lastError);
});
exports.getETHBalance = (addr) => __awaiter(this, void 0, void 0, function* () {
    let lastError;
    for (const fn of BALANCE_GETTERS) {
        try {
            const res = yield fn(addr);
            return res;
        }
        catch (e) {
            lastError = e;
            continue;
        }
    }
    throw new Error(lastError);
});
// transfers/fees
exports.getETHFee = () => __awaiter(this, void 0, void 0, function* () {
});
exports.transferETH = (privateKey, from, to, amount) => __awaiter(this, void 0, void 0, function* () {
    const value = web3_1.web3.utils.toHex(web3_1.web3.utils.toWei(amount.toString(), 'ether'));
    return new Promise((resolve, reject) => {
        web3_1.submitTransaction({ from, to, value, data: '0x0', privateKey }, (err, hash) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(hash);
            }
        });
    });
});
//# sourceMappingURL=eth.js.map