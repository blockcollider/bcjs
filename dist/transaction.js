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
/* tslint:disable */ // FIXME
const Random = require('random-js'); // tslint:disable-line
const secp256k1 = require('secp256k1'); // tslint:disable-line
const bitcoinjs_lib_1 = require("bitcoinjs-lib");
const bn_js_1 = __importDefault(require("bn.js"));
const bcProtobuf = __importStar(require("./protos/bc_pb"));
const coreProtobuf = __importStar(require("./protos/core_pb"));
const templates_1 = require("./script/templates");
const coin_1 = require("./utils/coin");
const protoUtil_1 = require("./utils/protoUtil");
const constants = require('./constants');
const { blake2bl } = require('./utils/crypto');
const BOSON_PER_BYTE = new bn_js_1.default('16600000000000');
exports.fromBuffer = function (txBuffer) {
    return coreProtobuf.Transaction.deserializeBinary(txBuffer);
};
function validateBtcAddress(btcAddress) {
    let decoded;
    try {
        decoded = bitcoinjs_lib_1.address.fromBase58Check(btcAddress);
    }
    catch (e) {
        return new Error(`Invalid BTC (not base58) address ${btcAddress}`);
    }
    // TODO networks constant has to change according to used Bitcoin network
    if (decoded.version === undefined || decoded.version !== bitcoinjs_lib_1.networks.bitcoin.pubKeyHash) {
        return new Error(`Not P2PKH BTC address ${btcAddress}`);
    }
    return false;
}
/*
 * Create NRG transfer transaction
 * @param spendableWalletOutPointObjs:
 * @param fromAddress: string,
 * @param privateKeyHex: string,
 * @param toAddress: string,
 * @param transferAmount: string,
 * @param txFee: string
 */
exports.createMultiNRGTransferTransaction = function (spendableWalletOutPointObjs, fromAddress, privateKeyHex, toAddress, transferAmountNRG, txFeeNRG, addDefaultFee = true) {
    if (toAddress.length !== transferAmountNRG.length) {
        throw new Error('incorrect length of args');
    }
    const transferAmountBN = transferAmountNRG.reduce((all, nrg) => {
        return all.add(coin_1.humanToInternalAsBN(nrg, coin_1.COIN_FRACS.NRG));
    }, new bn_js_1.default(0));
    const txFeeBN = coin_1.humanToInternalAsBN(txFeeNRG, coin_1.COIN_FRACS.NRG);
    const totalAmountBN = transferAmountBN.add(txFeeBN);
    const unitBN = coin_1.humanToInternalAsBN('1', coin_1.COIN_FRACS.NRG);
    if (privateKeyHex.startsWith('0x')) {
        privateKeyHex = privateKeyHex.slice(2);
    }
    const txOutputs = [];
    for (let i = 0; i < toAddress.length; i++) {
        txOutputs.push(protoUtil_1.createTransactionOutput(templates_1.createNRGLockScript(toAddress[i]), unitBN, coin_1.humanToInternalAsBN(transferAmountNRG[i], coin_1.COIN_FRACS.NRG)));
    }
    const nonNRGInputs = [];
    return _compileTransaction(spendableWalletOutPointObjs, txOutputs, nonNRGInputs, totalAmountBN, fromAddress, privateKeyHex, addDefaultFee);
};
/*
 * Create NRG (OL) transfer transaction
 * @param spendableWalletOutPointObjs:
 * @param fromAddress: string,
 * @param privateKeyHex: string,
 * @param toAddress: string,
 * @param transferAmount: string,
 * @param txFee: string
 */
exports.createNRGTransferTransaction = function (spendableWalletOutPointObjs, fromAddress, privateKeyHex, toAddress, transferAmountNRG, txFeeNRG, addDefaultFee = true) {
    const transferAmountBN = coin_1.humanToInternalAsBN(transferAmountNRG, coin_1.COIN_FRACS.NRG);
    const txFeeBN = coin_1.humanToInternalAsBN(txFeeNRG, coin_1.COIN_FRACS.NRG);
    const totalAmountBN = transferAmountBN.add(txFeeBN);
    const unitBN = coin_1.humanToInternalAsBN('1', coin_1.COIN_FRACS.NRG);
    if (privateKeyHex.startsWith('0x')) {
        privateKeyHex = privateKeyHex.slice(2);
    }
    const txOutputs = [
        protoUtil_1.createTransactionOutput(templates_1.createNRGLockScript(toAddress), unitBN, transferAmountBN),
    ];
    const nonNRGInputs = [];
    return _compileTransaction(spendableWalletOutPointObjs, txOutputs, nonNRGInputs, totalAmountBN, fromAddress, privateKeyHex, addDefaultFee);
};
/*
 * Create Feed Transaction
 * @param spendableWalletOutPointObjs:
 * @param olAddress: string,
 * @param olPrivateKeyHex: string,
 * @param feedAddress: string,
 * @param olAmount: string,
 * @param addDefaultFee: string,
 */
exports.createFeedTransaction = function (spendableWalletOutPointObjs, olAddress, olPrivateKeyHex, feedAddress, olAmount, olUnit, addDefaultFee = true) {
    if (olPrivateKeyHex.startsWith('0x')) {
        olPrivateKeyHex = olPrivateKeyHex.slice(2);
    }
    const totalAmountBN = coin_1.humanToInternalAsBN(olAmount, coin_1.COIN_FRACS.NRG);
    const outputLockScript = templates_1.createFeedLockScript(olAddress, feedAddress);
    const txOutputs = [
        protoUtil_1.createTransactionOutput(outputLockScript, coin_1.humanToInternalAsBN(olUnit, coin_1.COIN_FRACS.NRG), coin_1.humanToInternalAsBN(olAmount, coin_1.COIN_FRACS.NRG))
    ];
    const nonOverlineInputs = [];
    return _compileTransaction(spendableWalletOutPointObjs, txOutputs, nonOverlineInputs, totalAmountBN, olAddress, olPrivateKeyHex, addDefaultFee);
};
exports.createMakerOrderTransaction = function (spendableWalletOutPointObjs, shiftMaker, shiftTaker, depositLength, settleLength, sendsFromChain, receivesToChain, sendsFromAddress, receivesToAddress, sendsUnit, receivesUnit, bcAddress, bcPrivateKeyHex, collateralizedNrg, nrgUnit, fixedUnitFee, additionalTxFee, addDefaultFee = true) {
    if (bcPrivateKeyHex.startsWith('0x')) {
        bcPrivateKeyHex = bcPrivateKeyHex.slice(2);
    }
    sendsFromChain = sendsFromChain.toLowerCase();
    receivesToChain = receivesToChain.toLowerCase();
    let err;
    if (sendsFromChain === 'btc') {
        err = validateBtcAddress(sendsFromAddress);
    }
    if (receivesToChain === 'btc') {
        err = validateBtcAddress(receivesToAddress);
    }
    if (err) {
        throw err;
    }
    const totalFeeBN = exports.calculateCrossChainTradeFee(collateralizedNrg, additionalTxFee, 'maker');
    const totalAmountBN = totalFeeBN.add(coin_1.humanToInternalAsBN(collateralizedNrg, coin_1.COIN_FRACS.NRG));
    const indivisibleSendsUnit = coin_1.Currency.toMinimumUnitAsStr(sendsFromChain, sendsUnit, coin_1.CurrencyInfo[sendsFromChain].humanUnit);
    const indivisibleReceivesUnit = coin_1.Currency.toMinimumUnitAsStr(receivesToChain, receivesUnit, coin_1.CurrencyInfo[receivesToChain].humanUnit);
    if (fixedUnitFee != '') {
        fixedUnitFee = coin_1.Currency.toMinimumUnitAsStr('nrg', fixedUnitFee, 'nrg');
    }
    const outputLockScript = templates_1.createMakerLockScript(shiftMaker, shiftTaker, depositLength, settleLength, sendsFromChain, receivesToChain, sendsFromAddress, receivesToAddress, indivisibleSendsUnit, indivisibleReceivesUnit, fixedUnitFee, bcAddress);
    const txOutputs = [
        protoUtil_1.createTransactionOutput(outputLockScript, coin_1.humanToInternalAsBN(nrgUnit, coin_1.COIN_FRACS.NRG), coin_1.humanToInternalAsBN(collateralizedNrg, coin_1.COIN_FRACS.NRG)),
    ];
    const nonNRGInputs = [];
    return _compileTransaction(spendableWalletOutPointObjs, txOutputs, nonNRGInputs, totalAmountBN, bcAddress, bcPrivateKeyHex, addDefaultFee);
};
/*
 * Create Overline message based on OL Transaction
 * @param spendableWalletOutPointObjs:
 * @param fromAddress: string,
 * @param privateKeyHex: string,
 * @param toAddress: string,
 * @param transferAmount: string,
 * @param txFee: string
 */
exports.createOverlineChannelMessage = function (spendableWalletOutPointObjs, fromAddress, privateKeyHex, toAddress, transferAmountNRG, txFeeNRG, addDefaultFee = true) {
    const transferAmountBN = coin_1.humanToInternalAsBN(transferAmountNRG, coin_1.COIN_FRACS.NRG);
    const txFeeBN = coin_1.humanToInternalAsBN(txFeeNRG, coin_1.COIN_FRACS.NRG);
    const totalAmountBN = transferAmountBN.add(txFeeBN);
    const unitBN = coin_1.humanToInternalAsBN('1', coin_1.COIN_FRACS.NRG);
    if (privateKeyHex.startsWith('0x')) {
        privateKeyHex = privateKeyHex.slice(2);
    }
    const txOutputs = [
        protoUtil_1.createTransactionOutput(templates_1.createNRGLockScript(toAddress), unitBN, transferAmountBN),
    ];
    const nonNRGInputs = [];
    return _compileTransaction(spendableWalletOutPointObjs, txOutputs, nonNRGInputs, totalAmountBN, fromAddress, privateKeyHex, addDefaultFee);
};
exports.createTakerOrderTransaction = function (spendableWalletOutPointObjs, sendsFromAddress, receivesToAddress, makerOpenOrder, bcAddress, bcPrivateKeyHex, collateralizedNrg, additionalTxFee, addDefaultFee = true) {
    if (bcPrivateKeyHex.startsWith('0x')) {
        bcPrivateKeyHex = bcPrivateKeyHex.slice(2);
    }
    const fixedUnitFee = makerOpenOrder.fixedUnitFee;
    const base = makerOpenOrder.base;
    // if op min unit fixedFee set this amount only equals fixed fee
    const spendingNRG = (base === 1)
        ? coin_1.humanToInternalAsBN(fixedUnitFee, coin_1.COIN_FRACS.NRG)
        : coin_1.humanToInternalAsBN(collateralizedNrg, coin_1.COIN_FRACS.NRG);
    const totalFeeBN = exports.calculateCrossChainTradeFee(collateralizedNrg, additionalTxFee, 'taker');
    const totalAmountBN = totalFeeBN.add(spendingNRG);
    const makerUnitBN = coin_1.humanToInternalAsBN(makerOpenOrder.nrgUnit, coin_1.COIN_FRACS.NRG);
    const makerCollateralBN = coin_1.humanToInternalAsBN(makerOpenOrder.collateralizedNrg, coin_1.COIN_FRACS.NRG);
    let takerCollateralBN = coin_1.humanToInternalAsBN(collateralizedNrg, coin_1.COIN_FRACS.NRG);
    // modify taker collateral to be = makercollateralBN if it is above
    if (makerCollateralBN.lt(takerCollateralBN)) {
        takerCollateralBN = new bn_js_1.default(makerCollateralBN.toString());
    }
    const makerTxHash = makerOpenOrder.txHash;
    const makerTxOutputIndex = makerOpenOrder.txOutputIndex;
    // takers input
    const takerInputUnlockScript = templates_1.createTakerUnlockScript(sendsFromAddress, receivesToAddress);
    const makerTxOutpoint = protoUtil_1.createOutPoint(makerTxHash, makerTxOutputIndex, makerCollateralBN);
    const nonNRGInputs = [
        protoUtil_1.createTransactionInput(makerTxOutpoint, takerInputUnlockScript),
    ];
    // takers output
    const outputLockScript = templates_1.createTakerLockScript(makerTxHash, makerTxOutputIndex, bcAddress);
    const txOutputs = [
        protoUtil_1.createTransactionOutput(outputLockScript, makerUnitBN, takerCollateralBN.mul(new bn_js_1.default(base.toString()))),
    ];
    if (fixedUnitFee && fixedUnitFee !== '0') {
        const makerFeeScript = ['OP_BLAKE2BLPRIV', makerOpenOrder.doubleHashedBcAddress, 'OP_EQUALVERIFY', 'OP_CHECKSIGNOPUBKEYVERIFY'].join(' ');
        txOutputs.push(protoUtil_1.createTransactionOutput(makerFeeScript, makerUnitBN, coin_1.humanToInternalAsBN(fixedUnitFee, coin_1.COIN_FRACS.NRG)));
    }
    // partial order
    if (makerCollateralBN.gt(takerCollateralBN)) {
        const outputLockScriptCb = templates_1.createTakerCallbackLockScript(makerTxHash, makerTxOutputIndex);
        txOutputs.push(protoUtil_1.createTransactionOutput(outputLockScriptCb, makerUnitBN, makerCollateralBN.sub(takerCollateralBN)));
    }
    return _compileTransaction(spendableWalletOutPointObjs, txOutputs, nonNRGInputs, totalAmountBN, bcAddress, bcPrivateKeyHex, addDefaultFee);
};
exports.createUnlockTakerTx = function (txHash, txOutputIndex, bcAddress, privateKeyHex, bcClient) {
    return __awaiter(this, void 0, void 0, function* () {
        const req = new bcProtobuf.GetUnlockTakerTxParamsRequest();
        req.setTxHash(txHash);
        req.setTxOutputIndex(txOutputIndex);
        const unlockTakerTxParams = yield bcClient.getUnlockTakerTxParams(req);
        const unlockScripts = unlockTakerTxParams.unlockScriptsList;
        if (unlockScripts.length > 0) {
            if (privateKeyHex.startsWith('0x')) {
                privateKeyHex = privateKeyHex.slice(2);
            }
            const unlockBOSON = coin_1.internalToBN(protoUtil_1.convertProtoBufSerializedBytesToBuffer(unlockTakerTxParams.valueInTx), coin_1.COIN_FRACS.BOSON);
            const unitBN = coin_1.humanToInternalAsBN('1', coin_1.COIN_FRACS.NRG);
            let outputs = [];
            if (unlockScripts.length === 2) { // both settled
                outputs = unlockScripts.map(unlockScript => protoUtil_1.createTransactionOutput(unlockScript, unitBN, unlockBOSON.div(new bn_js_1.default(2))));
            }
            else { // one party settled
                outputs = [protoUtil_1.createTransactionOutput(unlockScripts[0], unitBN, unlockBOSON)];
            }
            const tx = _createTxWithOutputsAssigned(outputs);
            const outpoint = protoUtil_1.createOutPoint(txHash, txOutputIndex, unlockBOSON);
            const inputs = templates_1.createSignedNRGUnlockInputs(bcAddress, privateKeyHex, tx, [outpoint]);
            tx.setInputsList(inputs);
            tx.setNinCount(inputs.length);
            tx.setHash(_generateTxHash(tx));
            return tx;
        }
        else {
            return null;
        }
    });
};
exports.calculateCrossChainTradeFee = function (collateralizedNRG, additionalTxFee, side) {
    return new bn_js_1.default(0);
    // const collateralizedBN = humanToInternalAsBN(collateralizedNRG, COIN_FRACS.NRG)
    //
    // const txFeeBN = (side === 'maker') ? humanToInternalAsBN('0.002', COIN_FRACS.NRG) : collateralizedBN.div(new BN(1000))
    //
    // if (additionalTxFee != '0') {
    //   return txFeeBN.add(humanToInternalAsBN(additionalTxFee, COIN_FRACS.NRG))
    // } else {
    //   return txFeeBN
    // }
};
exports.calcTxFee = (tx) => {
    const inputs = tx.getInputsList();
    // if there are no inputs (this is a coinbase tx)
    if (inputs.length === 0) {
        return new bn_js_1.default(0);
    }
    const totalValueIn = inputs.reduce((valueIn, input) => {
        const outPoint = input.getOutPoint();
        if (outPoint === undefined) {
            return valueIn;
        }
        return valueIn.add(coin_1.internalToBN(Buffer.from(outPoint.getValue()), coin_1.COIN_FRACS.BOSON));
    }, new bn_js_1.default(0));
    const outputs = tx.getOutputsList();
    const totalValueOut = outputs.reduce((valueOut, output) => {
        return valueOut.add(coin_1.internalToBN(Buffer.from(output.getValue()), coin_1.COIN_FRACS.BOSON));
    }, new bn_js_1.default(0));
    if (totalValueIn.lt(totalValueOut)) {
        throw new Error('Collective input value cannot be less than collective output value');
    }
    return totalValueIn.sub(totalValueOut);
};
const _calculateSpentAndLeftoverOutPoints = function (spendableWalletOutPointObjs, totalAmountBN) {
    let sumBN = new bn_js_1.default(0);
    const spentOutPoints = [];
    let leftoverOutPoint = new coreProtobuf.OutPoint();
    for (const walletOutPoint of spendableWalletOutPointObjs) {
        const outPointObj = walletOutPoint.outpoint;
        if (!outPointObj) {
            continue;
        }
        const currentBN = coin_1.internalToBN(protoUtil_1.convertProtoBufSerializedBytesToBuffer(outPointObj.value), coin_1.COIN_FRACS.BOSON);
        const outPoint = protoUtil_1.createOutPoint(outPointObj.hash, outPointObj.index, currentBN);
        sumBN = sumBN.add(currentBN);
        spentOutPoints.push(outPoint);
        if (sumBN.gt(totalAmountBN)) {
            leftoverOutPoint = protoUtil_1.createOutPoint(outPointObj.hash, outPointObj.index, sumBN.sub(totalAmountBN));
            break;
        }
        else if (sumBN.eq(totalAmountBN)) {
            break;
        }
    }
    if (sumBN.lt(totalAmountBN)) {
        throw new Error('Not enough balance');
    }
    return { spentOutPoints, leftoverOutPoint };
};
const _createTxWithOutputsAssigned = function (outputs) {
    const tx = new coreProtobuf.Transaction();
    tx.setVersion(constants.txVersion);
    tx.setNonce(`${Math.abs(Random.engines.nativeMath())}`);
    tx.setOutputsList(outputs);
    tx.setNoutCount(outputs.length);
    tx.setLockTime(0);
    return tx;
};
const _compileTransaction = function (spendableWalletOutPointObjs, txOutputs, nonNRGinputs, totalAmountBN, bcAddress, bcPrivateKeyHex, addDefaultFee = true) {
    const unitBN = coin_1.humanToInternalAsBN('1', coin_1.COIN_FRACS.NRG);
    let totalAmountWithFeesBN = totalAmountBN;
    if (addDefaultFee) {
        for (const output of txOutputs) {
            const defaultTxFee = BOSON_PER_BYTE.mul(new bn_js_1.default(output.getScriptLength()));
            totalAmountWithFeesBN = totalAmountWithFeesBN.add(defaultTxFee);
        }
    }
    // outputs
    const { spentOutPoints, leftoverOutPoint } = _calculateSpentAndLeftoverOutPoints(spendableWalletOutPointObjs, totalAmountWithFeesBN);
    let finalOutputs = txOutputs;
    if (leftoverOutPoint && protoUtil_1.bytesToInternalBN(leftoverOutPoint.getValue()).gt(new bn_js_1.default(0))) {
        const leftoverOutput = protoUtil_1.createTransactionOutput(templates_1.createNRGLockScript(bcAddress), unitBN, protoUtil_1.bytesToInternalBN(leftoverOutPoint.getValue()));
        finalOutputs = txOutputs.concat([leftoverOutput]);
    }
    // txTemplate with output
    const txTemplate = _createTxWithOutputsAssigned(finalOutputs);
    // nrg inputs
    const nrgUnlockInputs = templates_1.createSignedNRGUnlockInputs(bcAddress, bcPrivateKeyHex, txTemplate, spentOutPoints);
    const finalInputs = nonNRGinputs.concat(nrgUnlockInputs);
    txTemplate.setInputsList(finalInputs);
    txTemplate.setNinCount(finalInputs.length);
    txTemplate.setHash(_generateTxHash(txTemplate));
    return txTemplate;
};
const _generateTxHash = function (tx) {
    const obj = tx.toObject();
    const inputs = obj.inputsList.map(input => {
        const outPoint = input.outPoint;
        if (!outPoint) {
            throw new Error('Invalid tx, the outPoint should not be undefined');
        }
        return [
            outPoint.value,
            outPoint.hash,
            outPoint.index,
            input.scriptLength,
            input.inputScript,
        ].join('');
    }).join('');
    const outputs = obj.outputsList.map(output => {
        return [
            output.value,
            output.unit,
            output.scriptLength,
            output.outputScript,
        ].join('');
    }).join('');
    const parts = [
        obj.version,
        obj.nonce,
        obj.overline,
        obj.ninCount,
        obj.noutCount,
        obj.lockTime,
        inputs,
        outputs,
    ];
    const prehash = blake2bl(parts.join(''));
    const hash = blake2bl(prehash);
    return hash;
};
//# sourceMappingURL=transaction.js.map