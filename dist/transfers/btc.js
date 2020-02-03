"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bitcoinjs_lib_1 = __importDefault(require("bitcoinjs-lib"));
require('es6-promise').polyfill(); /* tslint:disable-line */
require('isomorphic-fetch'); /* tslint:disable-line */
const BITCOIN_DIGITS = 8;
const BITCOIN_SAT_MULT = Math.pow(10, BITCOIN_DIGITS);
const FEE_GETTERS = [
    function (feeName) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            try {
                res = yield fetch('https://bitcoinfees.earn.com/api/v1/fees/recommended');
            }
            catch (e) {
                throw new Error(e);
            }
            if (res.status !== 200) {
                throw new Error(`Response status code: ${res.status}`);
            }
            const jsonResult = yield res.json();
            return jsonResult[`${feeName}Fee`];
        });
    },
];
const UTXO_GETTERS = [
    function (addr) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            try {
                res = yield fetch(`https://blockexplorer.com/api/addr/${addr}/utxo?noCache=1`, {
                    mode: 'cors',
                    credentials: 'same-origin',
                });
            }
            catch (e) {
                throw new Error(e);
            }
            if (res.status !== 200) {
                throw new Error(`Response status code: ${res.status}`);
            }
            const jsonResult = yield res.json();
            return jsonResult.data.map(({ confirmations, amount, txid, vout }) => ({
                confirmations,
                satoshis: amount * BITCOIN_SAT_MULT,
                txid,
                vout,
            }));
        });
    },
    function (addr) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            try {
                res = yield fetch(`https://blockchain.info/unspent?active=${addr}`, {
                    mode: 'cors',
                    credentials: 'same-origin',
                });
            }
            catch (e) {
                throw new Error(e);
            }
            if (res.status !== 200) {
                throw new Error(`Response status code: ${res.status}`);
            }
            const jsonResult = yield res.json();
            return jsonResult.data.unspent_outputs.map(({ confirmations, value, tx_hash_big_endian, tx_output_n }) => ({
                confirmations,
                satoshis: value,
                txid: tx_hash_big_endian,
                vout: tx_output_n,
            }));
        });
    },
];
const PUSHTX_FNS = [
    function (txHex) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch('https://api.blockcypher.com/v1/btc/main/txs/push', {
                body: JSON.stringify({ tx: txHex }),
                headers: { 'Content-Type': 'application/json' },
                method: 'post',
            });
            if (res.status - 200 > 100) {
                throw new Error(`Not successful satus code: ${res.status}, error: ${res.statusText}`);
            }
            return true;
        });
    },
    function (txHex) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch('https://blockchain.info/pushtx', {
                body: `tx=${encodeURIComponent(txHex)}`,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                method: 'post',
            });
            if (res.status - 200 > 100) {
                throw new Error(`Not successful satus code: ${res.status}, error: ${res.statusText}`);
            }
            return true;
        });
    },
    function (txHex) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch('https://blockexplorer.com/api/tx/send', {
                body: `rawtx=${encodeURIComponent(txHex)}`,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                method: 'post',
            });
            if (res.status - 200 > 100) {
                throw new Error(`Not successful satus code: ${res.status}, error: ${res.statusText}`);
            }
            return true;
        });
    },
];
function getTransactionSize(numInputs, numOutputs) {
    return numInputs * 180 + numOutputs * 34 + 10 + numInputs;
}
function getFees(feeName) {
    return __awaiter(this, void 0, void 0, function* () {
        let lastError;
        for (const fn of FEE_GETTERS) {
            try {
                const res = yield fn(feeName);
                return res;
            }
            catch (e) {
                lastError = e;
                continue;
            }
        }
        throw new Error(lastError);
    });
}
function getUtxos(address) {
    return __awaiter(this, void 0, void 0, function* () {
        let lastError;
        for (const fn of UTXO_GETTERS) {
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
}
function pushTx(txHex) {
    return __awaiter(this, void 0, void 0, function* () {
        let lastError;
        for (const fn of PUSHTX_FNS) {
            try {
                const res = yield fn(txHex);
                return res;
            }
            catch (e) {
                lastError = e;
                continue;
            }
        }
        throw new Error(lastError);
    });
}
function sendTransaction(options) {
    return __awaiter(this, void 0, void 0, function* () {
        // Required
        if (!options || typeof options !== 'object') {
            throw new Error('Options must be specified and must be an object.');
        }
        if (!options.from) {
            throw new Error('Must specify from address.');
        }
        if (!options.to) {
            throw new Error('Must specify to address.');
        }
        if (!options.btc) {
            throw new Error('Must specify amount of btc to send.');
        }
        if (!options.privKeyWIF) {
            throw new Error("Must specify the wallet's private key in WIF format.");
        }
        // Optionals
        if (!options.fee) {
            options.fee = 'fastest';
        }
        if (!options.minConfirmations) {
            options.minConfirmations = 0;
        }
        const { from, to, btc, fee, minConfirmations, privKeyWIF } = options;
        const amtSatoshi = Math.floor(btc * BITCOIN_SAT_MULT);
        const bitcoinNetwork = bitcoinjs_lib_1.default.networks.bitcoin;
        const feePerByte = yield getFees(fee);
        const utxos = yield getUtxos(from);
        // Setup inputs from utxos
        const tx = new bitcoinjs_lib_1.default.TransactionBuilder(bitcoinNetwork);
        let ninputs = 0;
        let availableSat = 0;
        for (const utxo of utxos) {
            if (utxo.confirmations >= minConfirmations) {
                tx.addInput(utxo.txid, utxo.vout);
                availableSat += utxo.satoshis;
                ninputs++;
                if (availableSat > amtSatoshi) {
                    break;
                }
            }
        }
        if (availableSat < amtSatoshi) {
            throw new Error('You do not have enough in your wallet to send that much.');
        }
        const change = availableSat - amtSatoshi;
        const calculatedFee = getTransactionSize(ninputs, change > 0 ? 2 : 1) * feePerByte;
        if (calculatedFee > amtSatoshi) {
            throw new Error('BitCoin amount must be larger than the fee. (Ideally it should be MUCH larger)');
        }
        tx.addOutput(to, amtSatoshi);
        if (change > 0) {
            tx.addOutput(from, change - calculatedFee);
        }
        const keyPair = bitcoinjs_lib_1.default.ECPair.fromWIF(privKeyWIF, bitcoinNetwork);
        for (let i = 0; i < ninputs; i++) {
            try {
                tx.sign(i, keyPair); // FIXME test if should not be ninputs[i]
            }
            catch (err) {
                console.log(err);
            }
        }
        const txHex = tx.build().toHex();
        const response = yield pushTx(txHex);
        if (response === true) { // Created
            return { msg: txHex };
        }
        else {
            return null;
        }
    });
}
function getTransfers(btcAddress) {
    return {
        height: 1,
        from: 'a',
        to: 'b',
        timestamp: 12345567888,
        value: 1,
        txHash: 'c',
    };
}
exports.getTransfers = getTransfers;
exports.transferBTC = (privKeyWIF, from, to, amount) => __awaiter(this, void 0, void 0, function* () {
    try {
        const signed = yield sendTransaction({
            from,
            to,
            privKeyWIF,
            btc: amount,
            dryrun: false,
            network: 'mainnet',
        });
        const txid = signed ? bitcoinjs_lib_1.default.Transaction.fromHex(signed.msg).getId() : null;
        return txid;
    }
    catch (err) {
        console.log(err);
        throw new Error(err);
    }
});
//# sourceMappingURL=btc.js.map