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
var bitcoin = require('bitcoinjs-lib');
var request = require('superagent');
var axios = require('axios');
var BITCOIN_DIGITS = 8;
var BITCOIN_SAT_MULT = Math.pow(10, BITCOIN_DIGITS);
var providers = {
    fees: {
        mainnet: {
            earn: function (feeName) {
                return request
                    .get('https://bitcoinfees.earn.com/api/v1/fees/recommended')
                    .send()
                    .then(function (res) {
                    return res.body[feeName + 'Fee'];
                });
            },
        },
    },
    utxo: {
        mainnet: {
            blockexplorer: function (addr) {
                return axios
                    .get('https://blockexplorer.com/api/addr/' + addr + '/utxo?noCache=1', { params: { cors: true } })
                    .then(function (res) {
                    return res.body.map(function (e) {
                        return {
                            txid: e.txid,
                            vout: e.vout,
                            satoshis: e.satoshis,
                            confirmations: e.confirmations,
                        };
                    });
                });
            },
            blockchain: function (addr) {
                return axios
                    .get('https://blockchain.info/unspent?active=' + addr, {
                    params: { cors: true },
                })
                    .then(function (res) {
                    return res.data.unspent_outputs.map(function (e) {
                        return {
                            txid: e.tx_hash_big_endian,
                            vout: e.tx_output_n,
                            satoshis: e.value,
                            confirmations: e.confirmations,
                        };
                    });
                });
            },
        },
    },
    pushtx: {
        mainnet: {
            blockexplorer: function (hexTrans) {
                return request
                    .post('https://blockexplorer.com/api/tx/send')
                    .send('rawtx=' + hexTrans);
            },
            blockchain: function (hexTrans) {
                return request
                    .post('https://blockchain.info/pushtx')
                    .send('tx=' + hexTrans);
            },
            blockcypher: function (hexTrans) {
                return request
                    .post('https://api.blockcypher.com/v1/btc/main/txs/push')
                    .send('{"tx":"' + hexTrans + '"}');
            },
        },
    },
};
function getTransactionSize(numInputs, numOutputs) {
    return numInputs * 180 + numOutputs * 34 + 10 + numInputs;
}
function getFees(provider, feeName) {
    if (typeof feeName === 'number') {
        return Promise.resolve(feeName);
    }
    else {
        return provider(feeName);
    }
}
function sendTransaction(options) {
    return __awaiter(this, void 0, void 0, function* () {
        //Required
        if (options == null || typeof options !== 'object')
            throw 'Options must be specified and must be an object.';
        if (options.from == null)
            throw 'Must specify from address.';
        if (options.to == null)
            throw 'Must specify to address.';
        if (options.btc == null)
            throw 'Must specify amount of btc to send.';
        if (options.privKeyWIF == null)
            throw "Must specify the wallet's private key in WIF format.";
        //Optionals
        if (options.network == null)
            options.network = 'mainnet';
        if (options.fee == null)
            options.fee = 'fastest';
        if (options.feesProvider == null)
            options.feesProvider = providers.fees[options.network].earn;
        if (options.utxoProvider == null)
            options.utxoProvider = providers.utxo[options.network].blockchain;
        if (options.pushtxProvider == null)
            options.pushtxProvider = providers.pushtx[options.network].blockchain;
        if (options.minConfirmations == null)
            options.minConfirmations = 0;
        var from = options.from;
        var to = options.to;
        var amount = options.btc;
        var amtSatoshi = Math.floor(amount * BITCOIN_SAT_MULT);
        var bitcoinNetwork = bitcoin.networks.bitcoin;
        return Promise.all([
            getFees(options.feesProvider, options.fee),
            options.utxoProvider(from),
        ]).then(function (res) {
            return __awaiter(this, void 0, void 0, function* () {
                var feePerByte = res[0];
                var utxos = res[1];
                //Setup inputs from utxos
                var tx = new bitcoin.TransactionBuilder(bitcoinNetwork);
                var ninputs = 0;
                var availableSat = 0;
                for (var i = 0; i < utxos.length; i++) {
                    var utxo = utxos[i];
                    if (utxo.confirmations >= options.minConfirmations) {
                        tx.addInput(utxo.txid, utxo.vout);
                        availableSat += utxo.satoshis;
                        ninputs++;
                        if (availableSat > amtSatoshi)
                            break;
                    }
                }
                if (availableSat < amtSatoshi)
                    throw 'You do not have enough in your wallet to send that much.';
                var change = availableSat - amtSatoshi;
                var fee = getTransactionSize(ninputs, change > 0 ? 2 : 1) * feePerByte;
                if (fee > amtSatoshi)
                    throw 'BitCoin amount must be larger than the fee. (Ideally it should be MUCH larger)';
                tx.addOutput(to, amtSatoshi);
                if (change > 0)
                    tx.addOutput(from, change - fee);
                var keyPair = bitcoin.ECPair.fromWIF(options.privKeyWIF, bitcoinNetwork);
                for (var i = 0; i < ninputs; i++) {
                    try {
                        tx.sign(i, keyPair);
                    }
                    catch (err) {
                        console.log({ err });
                    }
                }
                var msg = tx.build().toHex();
                let req = yield request
                    .post('https://api.blockcypher.com/v1/btc/main/txs/push')
                    .send('{"tx":"' + msg + '"}');
                if (req.statusText == 'Created')
                    return { msg };
                else
                    return null;
            });
        });
    });
}
exports.transferBTC = function (privKeyWIF, from, to, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let signed = yield sendTransaction({
                from,
                to,
                privKeyWIF,
                btc: amount,
                dryrun: false,
                network: 'mainnet',
            });
            var txid = signed ? bitcoin.Transaction.fromHex(signed).getId() : null;
            return txid;
        }
        catch (err) {
            console.log({ err });
            return err;
        }
    });
};
//# sourceMappingURL=btc.js.map