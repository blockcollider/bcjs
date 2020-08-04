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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const bitcoin = __importStar(require("bitcoinjs-lib"));
const superagent_1 = __importDefault(require("superagent"));
const BITCOIN_DIGITS = 8;
const BITCOIN_SAT_MULT = Math.pow(10, BITCOIN_DIGITS);
const providers = {
    fees: {
        mainnet: {
            earn: feeName => {
                return superagent_1.default
                    .get('https://bitcoinfees.earn.com/api/v1/fees/recommended')
                    .send()
                    .then(res => {
                    return res.body[feeName + 'Fee'];
                });
            },
        },
    },
    utxo: {
        mainnet: {
            blockexplorer: addr => {
                return axios_1.default
                    .get('https://blockexplorer.com/api/addr/' + addr + '/utxo?noCache=1', { params: { cors: true } })
                    .then(res => {
                    return res.data.map(e => {
                        return {
                            confirmations: e.confirmations,
                            satoshis: e.satoshis,
                            txid: e.txid,
                            vout: e.vout,
                        };
                    });
                });
            },
            blockchain: addr => {
                return axios_1.default
                    .get('https://blockchain.info/unspent?active=' + addr, {
                    params: { cors: true },
                })
                    .then(res => {
                    return res.data.unspent_outputs.map(e => {
                        return {
                            confirmations: e.confirmations,
                            satoshis: e.value,
                            txid: e.tx_hash_big_endian,
                            vout: e.tx_output_n,
                        };
                    });
                });
            },
        },
    },
    pushtx: {
        mainnet: {
            blockchain: hexTrans => {
                return superagent_1.default
                    .post('https://blockchain.info/pushtx')
                    .send('tx=' + hexTrans);
            },
            blockcypher: hexTrans => {
                return superagent_1.default
                    .post('https://api.blockcypher.com/v1/btc/main/txs/push')
                    .send('{"tx":"' + hexTrans + '"}');
            },
            blockexplorer: hexTrans => {
                return superagent_1.default
                    .post('https://blockexplorer.com/api/tx/send')
                    .send('rawtx=' + hexTrans);
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
        // Required
        if (options == null || typeof options !== 'object') {
            throw new Error('Options must be specified and must be an object.');
        }
        if (options.from == null) {
            throw new Error('Must specify from address.');
        }
        if (options.to == null) {
            throw new Error('Must specify to address.');
        }
        if (options.btc == null) {
            throw new Error('Must specify amount of btc to send.');
        }
        if (options.privKeyWIF == null) {
            throw new Error("Must specify the wallet's private key in WIF format.");
        }
        // Optionals
        if (options.network == null) {
            options.network = 'mainnet';
        }
        if (options.fee == null) {
            options.fee = 'fastest';
        }
        if (options.feesProvider == null) {
            options.feesProvider = providers.fees[options.network].earn;
        }
        if (options.utxoProvider == null) {
            options.utxoProvider = providers.utxo[options.network].blockchain;
        }
        if (options.pushtxProvider == null) {
            options.pushtxProvider = providers.pushtx[options.network].blockchain;
        }
        if (options.minConfirmations == null) {
            options.minConfirmations = 0;
        }
        const from = options.from;
        const to = options.to;
        const amount = options.btc;
        const amtSatoshi = Math.floor(amount * BITCOIN_SAT_MULT);
        const bitcoinNetwork = bitcoin.networks.bitcoin;
        return Promise.all([
            getFees(options.feesProvider, options.fee),
            options.utxoProvider(from),
        ]).then((res) => __awaiter(this, void 0, void 0, function* () {
            const feePerByte = res[0];
            const utxos = res[1];
            // Setup inputs from utxos
            const tx = new bitcoin.TransactionBuilder(bitcoinNetwork);
            let ninputs = 0;
            let availableSat = 0;
            for (const utxo of utxos) {
                if (utxo.confirmations >= options.minConfirmations) {
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
            const fee = getTransactionSize(ninputs, change > 0 ? 2 : 1) * feePerByte;
            if (fee > amtSatoshi) {
                throw new Error('BitCoin amount must be larger than the fee. (Ideally it should be MUCH larger)');
            }
            tx.addOutput(to, amtSatoshi);
            if (change > 0) {
                tx.addOutput(from, change - fee);
            }
            const keyPair = bitcoin.ECPair.fromWIF(options.privKeyWIF, bitcoinNetwork);
            for (let i = 0; i < ninputs; i++) {
                try {
                    tx.sign(i, keyPair);
                }
                catch (err) {
                    console.log({ err });
                }
            }
            const msg = tx.build().toHex();
            const req = yield superagent_1.default
                .post('https://api.blockcypher.com/v1/btc/main/txs/push')
                .send('{"tx":"' + msg + '"}');
            if (req.statusText === 'Created') {
                return { msg };
            }
            else {
                return null;
            }
        }));
    });
}
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
        const txid = signed ? bitcoin.Transaction.fromHex(signed.msg).getId() : null;
        return txid;
    }
    catch (err) {
        console.log({ err });
        return err;
    }
});
//# sourceMappingURL=btc.js.map