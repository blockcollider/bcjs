"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bn_js_1 = __importDefault(require("bn.js"));
const ethereumjs_tx_1 = require("ethereumjs-tx");
const web3_1 = __importDefault(require("web3"));
const id_1 = require("./id");
// 22000 * 20000 (price)
const options = { gasLimit: 62000, gasPrice: '20000' };
exports.mainnetUrl = 'https://mainnet.infura.io/v3/ca4c368803c347699a5d989cd367c0a6';
exports.web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(exports.mainnetUrl));
exports.EMB_ADDRESS = '0xbfCdE98b92722f9BC33a5AB081397CD2D5409748';
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
    const web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(url));
    return new Promise((resolve, reject) => {
        web3.eth.getTransactionCount(from, 'pending', (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(web3.utils.toHex(result));
        });
    });
};
const getGasPrice = () => {
    const url = `https://mainnet.infura.io/v3/${id_1.ids[Math.floor(Math.random() * id_1.ids.length)]}`;
    const web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(url));
    return new Promise((resolve, reject) => {
        web3.eth.getGasPrice((error, result) => {
            if (error) {
                reject(error);
            }
            resolve(new bn_js_1.default(result).mul(new bn_js_1.default('10')).toString());
        });
    });
};
const sendRawTransaction = (tx, done) => {
    const url = `https://mainnet.infura.io/v3/${id_1.ids[Math.floor(Math.random() * id_1.ids.length)]}`;
    const web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(url));
    web3.eth.sendSignedTransaction(tx)
        .on('transactionHash', () => done(null, tx))
        .on('error', err => done(err));
};
const signTransaction = ({ gasLimit, from, to, value, data, privateKey }, done) => {
    if (!gasLimit) {
        gasLimit = 62000;
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
    let submit = (err, tx, serializedTx) => {
        sendRawTransaction(serializedTx, (err, receipt) => {
            if (!err)
                done(null, tx.hash(true).toString('hex'));
            else {
                // console.log({tries,issue:'send'})
                if (tries < 20) {
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
    let sign = () => {
        signTransaction(args, (err, tx, serializedTx) => {
            if (!err) {
                submit(err, tx, serializedTx);
            }
            else {
                // console.log({tries,issue:'sign'})
                if (tries < 20) {
                    tries++;
                    sign();
                }
            }
        });
    };
    sign();
};
//# sourceMappingURL=web3.js.map