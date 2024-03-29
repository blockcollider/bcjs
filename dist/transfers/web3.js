"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethereumjs_tx_1 = require("ethereumjs-tx");
const web3_1 = __importDefault(require("web3"));
const id_1 = require("./id");
// 22000 * 20000 (price)
const options = { gasLimit: 62000, gasPrice: '20000' };
exports.mainnetUrl = 'https://mainnet.infura.io/v3/ca4c368803c347699a5d989cd367c0a6';
exports.web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(exports.mainnetUrl));
exports.EMB_ADDRESS = '0xdb0acc14396d108b3c5574483acb817855c9dc8d';
exports.USDT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
exports.DAI_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f';
exports.XAUT_ADDRESS = '0x4922a015c4407F87432B179bb209e125432E4a2A';
/* tslint:disable:no-var-requires */
exports.EMB_ABI = require('./contracts/Emblem.json').abi;
exports.DAI_ABI = require('./contracts/DAI.json');
exports.USDT_ABI = require('./contracts/USDT.json');
exports.XAUT_ABI = require('./contracts/XAUt.json');
/* tslint:enable:no-var-requires */
exports.DAI = new exports.web3.eth.Contract(exports.DAI_ABI, exports.DAI_ADDRESS, options);
exports.USDT = new exports.web3.eth.Contract(exports.USDT_ABI, exports.USDT_ADDRESS, options);
exports.EMB = new exports.web3.eth.Contract(exports.EMB_ABI, exports.EMB_ADDRESS, options);
exports.XAUt = new exports.web3.eth.Contract(exports.XAUT_ABI, exports.XAUT_ADDRESS, options);
const getNonce = (from) => {
    const url = `https://mainnet.infura.io/v3/${id_1.ids[Math.floor(Math.random() * id_1.ids.length)]}`;
    const web3Instance = new web3_1.default(new web3_1.default.providers.HttpProvider(url));
    return new Promise((resolve, reject) => {
        web3Instance.eth.getTransactionCount(from, 'pending', (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(exports.web3.utils.toHex(result));
        });
    });
};
const getGasPrice = () => {
    const url = `https://mainnet.infura.io/v3/${id_1.ids[Math.floor(Math.random() * id_1.ids.length)]}`;
    const web3Instance = new web3_1.default(new web3_1.default.providers.HttpProvider(url));
    return new Promise((resolve, reject) => {
        web3Instance.eth.getGasPrice((error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        });
    });
};
const sendRawTransaction = (tx, done) => {
    const url = `https://mainnet.infura.io/v3/${id_1.ids[Math.floor(Math.random() * id_1.ids.length)]}`;
    const web3Instance = new web3_1.default(new web3_1.default.providers.HttpProvider(url));
    web3Instance.eth.sendSignedTransaction(tx)
        .on('transactionHash', () => done(null, tx))
        .on('error', err => done(err));
};
const signTransaction = ({ gasLimit, from, to, value, data, privateKey }, done) => {
    if (!gasLimit) {
        gasLimit = 72000;
    }
    Promise.all([getNonce(from), getGasPrice()]).then(values => {
        return ({
            data,
            gasLimit: exports.web3.utils.toHex(gasLimit),
            gasPrice: exports.web3.utils.toHex(values[1]),
            nonce: values[0],
            to,
            value,
        });
    }).then(rawTx => {
        const tx = new ethereumjs_tx_1.Transaction(rawTx, { chain: 'mainnet' });
        tx.sign(Buffer.from(privateKey, 'hex'));
        done(null, tx, '0x' + tx.serialize().toString('hex'));
    }).catch(err => {
        done(err);
    });
};
exports.submitTransaction = (args, done) => {
    let tries = 0;
    const submit = (errSubmit, tx, serializedTx) => {
        sendRawTransaction(serializedTx, (err, receipt) => {
            if (!err) {
                done(null, tx.hash(true).toString('hex'));
            }
            else {
                if (tries < 400) {
                    tries++;
                    submit(err, tx, serializedTx);
                }
                else {
                    done(err);
                    return;
                }
            }
        });
    };
    const sign = () => {
        signTransaction(args, (err, tx, serializedTx) => {
            if (!err) {
                submit(err, tx, serializedTx);
            }
            else {
                if (tries < 400) {
                    tries++;
                    sign();
                }
            }
        });
    };
    sign();
};
//# sourceMappingURL=web3.js.map