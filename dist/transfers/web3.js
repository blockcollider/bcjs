"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bn_js_1 = __importDefault(require("bn.js"));
const ethereumjs_tx_1 = require("ethereumjs-tx");
const web3_1 = __importDefault(require("web3"));
const options = { gasLimit: 2000000000000, gasPrice: '20000' };
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
    return new Promise((resolve, reject) => {
        exports.web3.eth.getTransactionCount(from, 'pending', (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(exports.web3.utils.toHex(result));
        });
    });
};
const getGasPrice = () => {
    return new Promise((resolve, reject) => {
        exports.web3.eth.getGasPrice((error, result) => {
            if (error) {
                reject(error);
            }
            resolve(new bn_js_1.default(result).mul(new bn_js_1.default('10')).toString());
        });
    });
};
const sendRawTransaction = (tx, done) => {
    exports.web3.eth.sendSignedTransaction(tx)
        .on('transactionHash', () => done(null, tx))
        .on('error', err => done(err));
};
const signTransaction = ({ from, to, value, data, privateKey }, done) => {
    Promise.all([getNonce(from), getGasPrice()]).then(values => {
        return ({
            data,
            gasLimit: exports.web3.utils.toHex(53000),
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
    signTransaction(args, (err, tx, serializedTx) => {
        if (!err) {
            sendRawTransaction(serializedTx, (errInner, receipt) => {
                if (!errInner) {
                    done(null, tx.hash(true).toString('hex'));
                }
                else {
                    done(errInner);
                }
            });
        }
        else {
            done(err);
        }
    });
};
//# sourceMappingURL=web3.js.map