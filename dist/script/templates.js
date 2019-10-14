"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const secp256k1 = require('secp256k1');
const { blake2blTwice, blake2bl } = require('./utils/crypto');
const Coin = require('./utils/coin');
const { toBuffer, intToBuffer } = require('./utils/buffer');
const protoUtil = require('./utils/protoUtil');
var ScriptType;
(function (ScriptType) {
    ScriptType["NRG_TRANSFER"] = "nrg_transfer";
    ScriptType["MAKER_OUTPUT"] = "maker_output";
    ScriptType["TAKER_INPUT"] = "taker_input";
    ScriptType["TAKER_OUTPUT"] = "taker_output";
    ScriptType["TAKER_CALLBACK"] = "taker_callback";
})(ScriptType || (ScriptType = {}));
/*
 * @param spendableOutPoint: an outpoint that is to be spent in the tx
 * @param txOutputs: transaction outputs in the transaction that is spending the spendableOutPoint
 * @return a hash signature of spendableOutPoint and txOutputs
 */
function createOutPointOutputsHash(spendableOutPoint, txOutputs) {
    const outputsData = txOutputs.map(output => {
        var obj = output.toObject();
        return [
            obj.value,
            obj.unit,
            obj.scriptLength,
            obj.outputScript
        ].join('');
    }).join('');
    const parts = [
        Coin.internalToHuman(spendableOutPoint.getValue(), Coin.COIN_FRACS.NRG),
        spendableOutPoint.getHash(),
        spendableOutPoint.getIndex(),
        outputsData
    ];
    const hash = blake2bl(parts.join(''));
    return hash;
}
// sign data ANY with private key Buffer
// return 65B long signature with recovery number as the last byte
function signData(data, privateKey) {
    data = toBuffer(data);
    const dataHash = blake2bl(data);
    const sig = secp256k1.sign(Buffer.from(dataHash, 'hex'), privateKey);
    if (sig.signature.length !== 64) {
        throw Error(`Signature should always be 64B long, l: ${sig.signature.length}`);
    }
    const signatureWithRecovery = Buffer.concat([
        sig.signature,
        intToBuffer(sig.recovery)
    ]);
    return signatureWithRecovery;
}
/*
 * @param spendableOutPoint: an outpoint that is to be spent in the tx
 * @param tx: transaction is spending the spendableOutPoint
 * @return a signature of the tx input
 */
function createUnlockSig(spendableOutPoint, tx, privateKey) {
    const dataToSign = generateDataToSignForSig(spendableOutPoint, tx.getOutputsList());
    const sig = signData(dataToSign, privateKey);
    return sig;
}
function generateDataToSignForSig(spendableOutPoint, txOutputs) {
    return createOutPointOutputsHash(spendableOutPoint, txOutputs);
}
/*
 * Sign transaction inputs of a tx, the signature requires transaction outputs to be set tx before calling this
 * @param bcAddress: BlockCollider address
 * @param bcPrivateKeyHex: BlockCollider private key in hex
 * @param txTemplate: transaction that is spending the spentOutPoints
 * @param spentOutPoints: outPoints to be spent in the txTemplate
 * @return a list of signed transaction inputs
 */
function createSignedNRGUnlockInputs(bcAddress, bcPrivateKeyHex, txTemplate, spentOutPoints) {
    const txOutputs = txTemplate.getOutputsList();
    if (!txOutputs) {
        throw new Error("outputs has to be set to txTemplate before signing the inputs");
    }
    return spentOutPoints.map((outPoint) => {
        const signature = createUnlockSig(outPoint, txTemplate, Buffer.from(bcPrivateKeyHex, 'hex'));
        const pubKey = secp256k1.publicKeyCreate(Buffer.from(bcPrivateKeyHex, 'hex'), true);
        const inputUnlockScript = [
            signature.toString('hex'),
            pubKey.toString('hex'),
            blake2bl(bcAddress)
        ].join(' ');
        return protoUtil.createTransactionInput(outPoint, inputUnlockScript);
    });
}
exports.createSignedNRGUnlockInputs = createSignedNRGUnlockInputs;
function createNRGLockScript(address) {
    address = address.toLowerCase();
    const script = [
        'OP_BLAKE2BL',
        blake2blTwice(address),
        'OP_EQUALVERIFY',
        'OP_CHECKSIGVERIFY'
    ];
    return script.join(' ');
}
exports.createNRGLockScript = createNRGLockScript;
function parseNRGLockScript(script) {
    const scriptStr = typeof script != 'string' ? protoUtil.bytesToString(script) : script;
    const doubleHashedBcAddress = scriptStr.split(' ')[1];
    return {
        doubleHashedBcAddress
    };
}
exports.parseNRGLockScript = parseNRGLockScript;
function createMakerLockScript(shiftMaker, shiftTaker, depositLength, settleLength, sendsFromChain, receivesToChain, sendsFromAddress, receivesToAddress, sendsUnit, receivesUnit, fixedUnitFee, bcAddress) {
    bcAddress = bcAddress.toLowerCase();
    let doubleHashedBcAddress = blake2blTwice(bcAddress);
    const script = fixedUnitFee === '' ?
        [
            ['OP_MONOID', shiftMaker, shiftTaker, depositLength, settleLength, 'OP_DEPSET'],
            ['OP_0', 'OP_IFEQ',
                'OP_RETURN', 'OP_ENDIFEQ'],
            ['OP_2', 'OP_IFEQ',
                'OP_TAKERPAIR', '2', '0', 'OP_MINUNITVALUE', 'OP_RETURN_RESULT', 'OP_ENDIFEQ'],
            ['OP_3', 'OP_IFEQ',
                'OP_RETURN', 'OP_ENDIFEQ'],
            ['OP_DROP', sendsFromChain, receivesToChain, sendsFromAddress, receivesToAddress, sendsUnit, receivesUnit, 'OP_MAKERCOLL'],
            // maker succeed, taker failed - maker can spend
            ['OP_3', 'OP_IFEQ',
                'OP_MONAD', 'OP_BLAKE2BL', doubleHashedBcAddress, 'OP_EQUALVERIFY', 'OP_CHECKSIGVERIFY', 'OP_ENDMONAD', 'OP_ENDIFEQ'],
            // taker & maker pass -  both can spend
            ['OP_2', 'OP_IFEQ',
                '1', 'OP_MONADSPLIT', 'OP_MONAD', 'OP_BLAKE2BL', doubleHashedBcAddress, 'OP_EQUALVERIFY', 'OP_CHECKSIGVERIFY', 'OP_ENDMONAD', 'OP_ENDIFEQ'],
            // taker & maker fail - both can spend
            ['OP_5', 'OP_IFEQ',
                '1', 'OP_MONADSPLIT', 'OP_MONAD', 'OP_BLAKE2BL', doubleHashedBcAddress, 'OP_EQUALVERIFY', 'OP_CHECKSIGVERIFY', 'OP_ENDMONAD', 'OP_ENDIFEQ']
        ] :
        [
            ['OP_MONOID', shiftMaker, shiftTaker, depositLength, settleLength, 'OP_DEPSET'],
            ['OP_0', 'OP_IFEQ',
                'OP_RETURN', 'OP_ENDIFEQ'],
            ['OP_2', 'OP_IFEQ',
                'OP_TAKERPAIR', '1', fixedUnitFee, 'OP_MINUNITVALUE', 'OP_MONAD', 'OP_BLAKE2BL', doubleHashedBcAddress, 'OP_EQUALVERIFY', 'OP_CHECKSIGVERIFY',
                'OP_ENDMONAD', 'OP_RETURN_RESULT', 'OP_ENDIFEQ'],
            // maker succeed, taker failed - maker can spend
            ['OP_3', 'OP_IFEQ',
                'OP_MONAD', 'OP_BLAKE2BL', doubleHashedBcAddress, 'OP_EQUALVERIFY', 'OP_CHECKSIGVERIFY', 'OP_ENDMONAD', 'OP_ENDIFEQ'],
            // taker & maker fail - maker can spend
            ['OP_5', 'OP_IFEQ',
                'OP_MONAD', 'OP_BLAKE2BL', doubleHashedBcAddress, 'OP_EQUALVERIFY', 'OP_CHECKSIGVERIFY', 'OP_ENDMONAD', 'OP_ENDIFEQ']
        ];
    console.log({ script });
    return script.map(part => part.join(' ')).join(' ');
}
exports.createMakerLockScript = createMakerLockScript;
function parseMakerLockScript(script) {
    const scriptStr = typeof script != 'string' ? protoUtil.bytesToString(script) : script;
    const [shiftMaker, shiftTaker, deposit, settlement] = scriptStr.split(' OP_DEPSET ')[0].split(' ').slice(1);
    const tradeInfo = scriptStr.split(' OP_MAKERCOLL ')[0].split(' ');
    const [sendsFromChain, receivesToChain, sendsFromAddress, receivesToAddress, sendsUnit, receivesUnit] = tradeInfo.slice(tradeInfo.length - 5);
    let [fixedUnitFee, base] = scriptStr.split(' OP_MINUNITVALUE')[0].split(' ').reverse().slice(0, 2);
    const fixedUnitFeeNum = isNaN(parseInt(fixedUnitFee, 10)) ? 0 : parseInt(fixedUnitFee, 10);
    const baseNum = isNaN(parseInt(base, 10)) ? 0 : parseInt(base, 10);
    const doubleHashedBcAddress = scriptStr.split(' OP_5 OP_IFEQ 1 OP_MONADSPLIT OP_MONAD OP_BLAKE2BL ')[1].split(' ')[0];
    return {
        shiftMaker: parseInt(shiftMaker, 10),
        shiftTaker: parseInt(shiftTaker, 10),
        deposit: parseInt(deposit, 10),
        settlement: parseInt(settlement, 10),
        sendsFromChain: sendsFromChain,
        receivesToChain: receivesToChain,
        sendsFromAddress: sendsFromAddress,
        receivesToAddress: receivesToAddress,
        sendsUnit: sendsUnit,
        receivesUnit: receivesUnit,
        doubleHashedBcAddress: doubleHashedBcAddress,
        fixedUnitFee: fixedUnitFeeNum,
        base: baseNum
    };
}
exports.parseMakerLockScript = parseMakerLockScript;
function createTakerUnlockScript(takerWantsAddress, takerSendsAddress) {
    return [takerWantsAddress, takerSendsAddress].join(' ');
}
exports.createTakerUnlockScript = createTakerUnlockScript;
function parseTakerUnlockScript(script) {
    const scriptStr = typeof script != 'string' ? protoUtil.bytesToString(script) : script;
    const [takerWantsAddress, takerSendsAddress] = scriptStr.split(' ');
    return {
        takerWantsAddress,
        takerSendsAddress
    };
}
exports.parseTakerUnlockScript = parseTakerUnlockScript;
function createTakerLockScript(makerTxHash, makerTxOutputIndex, takerBCAddress) {
    takerBCAddress = takerBCAddress.toLowerCase();
    const doubleHashedBcAddress = blake2blTwice(takerBCAddress);
    const script = [
        [makerTxHash, makerTxOutputIndex, 'OP_CALLBACK'],
        // 4: taker succeed, maker failed, taker can spend the outpoint
        ['4', 'OP_IFEQ', 'OP_MONAD', 'OP_BLAKE2BL', doubleHashedBcAddress, 'OP_EQUALVERIFY', 'OP_CHECKSIGVERIFY', 'OP_ENDMONAD', 'OP_ENDIFEQ'],
        // this.OP_0() // both failed,
        ['OP_DROP', 'OP_MONAD', 'OP_BLAKE2BL', doubleHashedBcAddress, 'OP_EQUALVERIFY', 'OP_CHECKSIGVERIFY', 'OP_ENDMONAD']
    ];
    return script.map(part => part.join(' ')).join(' ');
}
exports.createTakerLockScript = createTakerLockScript;
function parseTakerLockScript(script) {
    const scriptStr = typeof script != 'string' ? protoUtil.bytesToString(script) : script;
    if (scriptStr.indexOf('OP_CALLBACK') === -1) {
        throw new Error('Invalid taker outpout script');
    }
    const [makerTxHash, makerTxOutputIndex] = scriptStr.split(' OP_CALLBACK')[0].split(' ');
    const doubleHashedBcAddress = scriptStr.split(' OP_BLAKE2BL ')[1].split(' ')[0];
    return {
        makerTxHash: makerTxHash,
        makerTxOutputIndex: parseInt(makerTxOutputIndex, 10),
        doubleHashedBcAddress: doubleHashedBcAddress
    };
}
exports.parseTakerLockScript = parseTakerLockScript;
function createTakerCallbackLockScript(makerTxHash, makerTxOutputIndex) {
    return [makerTxHash, makerTxOutputIndex, 'OP_CALLBACK'].join(' ');
}
exports.createTakerCallbackLockScript = createTakerCallbackLockScript;
function parseTakerCallbackLockScript(script) {
    const scriptStr = typeof script != 'string' ? protoUtil.bytesToString(script) : script;
    const [makerTxHash, makerTxOutputIndex, OP_Callback] = scriptStr.split(' ');
    return {
        makerTxHash,
        makerTxOutputIndex
    };
}
exports.parseTakerCallbackLockScript = parseTakerCallbackLockScript;
function getScriptType(script) {
    const scriptStr = typeof script != 'string' ? protoUtil.bytesToString(script) : script;
    if (scriptStr.startsWith('OP_MONOID')) {
        return ScriptType.MAKER_OUTPUT;
    }
    else if (scriptStr.endsWith('OP_CALLBACK')) {
        return ScriptType.TAKER_CALLBACK;
    }
    else if (scriptStr.indexOf('OP_MONAD') > -1 && scriptStr.indexOf('OP_CALLBACK') > -1) {
        return ScriptType.TAKER_OUTPUT;
    }
    else if (scriptStr.startsWith('OP_BLAKE2BL')) {
        return ScriptType.NRG_TRANSFER;
    }
    else
        return ScriptType.TAKER_INPUT;
}
exports.getScriptType = getScriptType;
//# sourceMappingURL=templates.js.map