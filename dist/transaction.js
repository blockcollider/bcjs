"use strict";
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
const Random = require('random-js');
const secp256k1 = require('secp256k1');
const bn_js_1 = __importDefault(require("bn.js"));
const bitcoinjs_lib_1 = require("bitcoinjs-lib");
const coreProtobuf = __importStar(require("./protos/core_pb"));
const timble_1 = __importDefault(require("./timble"));
const coin_1 = require("./utils/coin");
const constants = require('./../constants');
const protoUtil = require('./../utils/protoUtil');
const { blake2bl } = require('./../utils/crypto');
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
exports.createNRGTransferTransaction = function (spendableWalletOutPointObjs, fromAddress, privateKeyHex, toAddress, transferAmountNRG, txFeeNRG) {
    const transferAmountBN = coin_1.humanToInternalAsBN(transferAmountNRG, coin_1.COIN_FRACS.NRG);
    const txFeeBN = coin_1.humanToInternalAsBN(txFeeNRG, coin_1.COIN_FRACS.NRG);
    const totalAmountBN = transferAmountBN.add(txFeeBN);
    const unitBN = coin_1.humanToInternalAsBN('1', coin_1.COIN_FRACS.NRG);
    if (privateKeyHex.startsWith('0x')) {
        privateKeyHex = privateKeyHex.slice(2);
    }
    const txOutputs = [
        protoUtil.createTransactionOutput(timble_1.default.createNRGLockScript(toAddress), unitBN, transferAmountBN)
    ];
    const nonNRGInputs = [];
    return _compileTransaction(spendableWalletOutPointObjs, txOutputs, nonNRGInputs, totalAmountBN, fromAddress, privateKeyHex);
};
exports.createMakerOrderTransaction = function (spendableWalletOutPointObjs, shiftMaker, shiftTaker, depositLength, settleLength, sendsFromChain, receivesToChain, sendsFromAddress, receivesToAddress, sendsUnit, receivesUnit, bcAddress, bcPrivateKeyHex, collateralizedNrg, nrgUnit, additionalTxFee) {
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
    let totalFeeBN = _calculateCrossChainTradeFee(collateralizedNrg, additionalTxFee, 'maker');
    const totalAmountBN = totalFeeBN.add(coin_1.humanToInternalAsBN(collateralizedNrg, coin_1.COIN_FRACS.NRG));
    const indivisibleSendsUnit = coin_1.Currency.toMinimumUnitAsStr(sendsFromChain, sendsUnit, coin_1.CurrencyInfo[sendsFromChain].humanUnit);
    const indivisibleReceivesUnit = coin_1.Currency.toMinimumUnitAsStr(receivesToChain, receivesUnit, coin_1.CurrencyInfo[receivesToChain].humanUnit);
    const outputLockScript = timble_1.default.createMakerLockScript(shiftMaker, shiftTaker, depositLength, settleLength, sendsFromChain, receivesToChain, sendsFromAddress, receivesToAddress, indivisibleSendsUnit, indivisibleReceivesUnit, bcAddress);
    const txOutputs = [
        protoUtil.createTransactionOutput(outputLockScript, coin_1.humanToInternalAsBN(nrgUnit, coin_1.COIN_FRACS.NRG), coin_1.humanToInternalAsBN(collateralizedNrg, coin_1.COIN_FRACS.NRG))
    ];
    const nonNRGInputs = [];
    return _compileTransaction(spendableWalletOutPointObjs, txOutputs, nonNRGInputs, totalAmountBN, bcAddress, bcPrivateKeyHex);
};
exports.createTakerOrderTransaction = function (spendableWalletOutPointObjs, sendsFromAddress, receivesToAddress, makerOpenOrder, bcAddress, bcPrivateKeyHex, collateralizedNrg, additionalTxFee) {
    if (bcPrivateKeyHex.startsWith('0x')) {
        bcPrivateKeyHex = bcPrivateKeyHex.slice(2);
    }
    const totalFeeBN = _calculateCrossChainTradeFee(collateralizedNrg, additionalTxFee, 'taker');
    const totalAmountBN = totalFeeBN.add(coin_1.humanToInternalAsBN(collateralizedNrg, coin_1.COIN_FRACS.NRG));
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
    const takerInputUnlockScript = timble_1.default.createTakerUnlockScript(sendsFromAddress, receivesToAddress);
    const makerTxOutpoint = protoUtil.createOutPoint(makerTxHash, makerTxOutputIndex, makerCollateralBN);
    const nonNRGInputs = [
        protoUtil.createTransactionInput(makerTxOutpoint, takerInputUnlockScript)
    ];
    // takers output
    const outputLockScript = timble_1.default.createTakerLockScript(makerTxHash, makerTxOutputIndex, bcAddress);
    const txOutputs = [
        protoUtil.createTransactionOutput(outputLockScript, makerUnitBN, takerCollateralBN.mul(new bn_js_1.default(2)))
    ];
    // partial order
    if (makerCollateralBN.gt(takerCollateralBN)) {
        const outputLockScriptCb = timble_1.default.createTakerCallbackLockScript(makerTxHash, makerTxOutputIndex);
        txOutputs.push(protoUtil.createTransactionOutput(outputLockScriptCb, makerUnitBN, makerCollateralBN.sub(takerCollateralBN)));
    }
    return _compileTransaction(spendableWalletOutPointObjs, txOutputs, nonNRGInputs, totalAmountBN, bcAddress, bcPrivateKeyHex);
};
exports.createUnlockTakerTx = function (txHash, txOutputIndex, takerTxToUnlock, unlockScripts, bcAddress, privateKeyHex) {
    if (unlockScripts.length > 1) {
        if (privateKeyHex.startsWith('0x')) {
            privateKeyHex = privateKeyHex.slice(2);
        }
        const toUnlockTakerTxOutput = takerTxToUnlock.getOutputsList()[txOutputIndex];
        const unlockBOSON = coin_1.internalToBN(toUnlockTakerTxOutput.getValue(), coin_1.COIN_FRACS.BOSON);
        const unitBN = coin_1.humanToInternalAsBN('1', coin_1.COIN_FRACS.NRG);
        let outputs = [];
        if (outputs.length === 2) { // both settled
            outputs = unlockScripts.map(unlockScript => protoUtil.createTransactionOutput(unlockScript, unitBN, unlockBOSON.div(new bn_js_1.default(2))));
        }
        else { // one party settled
            outputs = [protoUtil.createTransactionOutput(unlockScripts[0], unitBN, unlockBOSON)];
        }
        const tx = _createTxWithOutputsAssigned(outputs);
        const outpoint = protoUtil.createOutPoint(txHash, txOutputIndex, unlockBOSON);
        const inputs = timble_1.default.createSignedNRGUnlockInputs(bcAddress, privateKeyHex, tx, [outpoint]);
        tx.setInputsList(inputs);
        tx.setNinCount(inputs.length);
        tx.setHash(_generateTxHash(tx));
        return tx;
    }
    else {
        return null;
    }
};
const _calculateCrossChainTradeFee = function (collateralizedNRG, additionalTxFee, side) {
    const collateralizedBN = coin_1.humanToInternalAsBN(collateralizedNRG, coin_1.COIN_FRACS.NRG);
    const txFeeBN = (side === 'maker') ? coin_1.humanToInternalAsBN('0.002', coin_1.COIN_FRACS.NRG) : collateralizedBN.div(new bn_js_1.default(1000));
    if (additionalTxFee != '0') {
        return txFeeBN.add(coin_1.humanToInternalAsBN(additionalTxFee, coin_1.COIN_FRACS.NRG));
    }
    else {
        return txFeeBN;
    }
};
const _calculateSpentAndLeftoverOutPoints = function (spendableWalletOutPointObjs, totalAmountBN) {
    let sumBN = new bn_js_1.default(0);
    const spentOutPoints = [];
    let leftoverOutPoint = null;
    for (let walletOutPoint of spendableWalletOutPointObjs) {
        const outPointObj = walletOutPoint.outpoint;
        if (!outPointObj) {
            continue;
        }
        const currentBN = coin_1.internalToBN(protoUtil.convertProtoBufSerializedBytesToNumStr(outPointObj.value), coin_1.COIN_FRACS.BOSON);
        const outPoint = protoUtil.createOutPoint(outPointObj.hash, outPointObj.index, currentBN);
        sumBN = sumBN.add(currentBN);
        spentOutPoints.push(outPoint);
        if (sumBN.gt(totalAmountBN)) {
            leftoverOutPoint = protoUtil.createOutPoint(outPointObj.hash, outPointObj.index, sumBN.sub(totalAmountBN));
            break;
        }
        else if (sumBN.eq(totalAmountBN)) {
            break;
        }
    }
    if (sumBN.lt(totalAmountBN)) {
        throw new Error(`Not enough balance, balance: ${coin_1.internalBNToHuman(sumBN, coin_1.COIN_FRACS.NRG)}, required: ${coin_1.internalBNToHuman(totalAmountBN, coin_1.COIN_FRACS.NRG)}`);
    }
    return { spentOutPoints: spentOutPoints, leftoverOutPoint: leftoverOutPoint };
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
const _compileTransaction = function (spendableWalletOutPointObjs, txOutputs, nonNRGinputs, totalAmountBN, bcAddress, bcPrivateKeyHex) {
    const unitBN = coin_1.humanToInternalAsBN('1', coin_1.COIN_FRACS.NRG);
    // outputs
    const { spentOutPoints, leftoverOutPoint } = _calculateSpentAndLeftoverOutPoints(spendableWalletOutPointObjs, totalAmountBN);
    let finalOutputs = txOutputs;
    if (leftoverOutPoint) {
        const leftoverOutput = protoUtil.createTransactionOutput(timble_1.default.createNRGLockScript(bcAddress), unitBN, protoUtil.bytesToInternalBN(leftoverOutPoint.getValue()));
        finalOutputs = txOutputs.concat([leftoverOutput]);
    }
    // txTemplate with output
    const txTemplate = _createTxWithOutputsAssigned(finalOutputs);
    // nrg inputs
    const nrgUnlockInputs = timble_1.default.createSignedNRGUnlockInputs(bcAddress, bcPrivateKeyHex, txTemplate, spentOutPoints);
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
            input.inputScript
        ].join('');
    }).join('');
    const outputs = obj.outputsList.map(output => {
        return [
            output.value,
            output.unit,
            output.scriptLength,
            output.outputScript
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
        outputs
    ];
    const prehash = blake2bl(parts.join(''));
    const hash = blake2bl(prehash);
    return hash;
};
//# sourceMappingURL=transaction.js.map