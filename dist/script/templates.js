"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const secp256k1 = require("secp256k1");
const buffer_1 = require("../utils/buffer");
const Coin = __importStar(require("../utils/coin"));
const crypto_1 = require("../utils/crypto");
const protoUtil_1 = require("../utils/protoUtil");
const string_1 = require("../utils/string");
const bytecode_1 = require("./bytecode");
var ScriptType;
(function (ScriptType) {
    ScriptType["NRG_TRANSFER"] = "nrg_transfer";
    ScriptType["MAKER_OUTPUT"] = "maker_output";
    ScriptType["TAKER_INPUT"] = "taker_input";
    ScriptType["TAKER_OUTPUT"] = "taker_output";
    ScriptType["TAKER_CALLBACK"] = "taker_callback";
    ScriptType["FEED_CREATE"] = "feed_create";
    ScriptType["FEED_UPDATE"] = "feed_update";
    ScriptType["NRG_UNLOCK"] = "nrg_unlock";
})(ScriptType = exports.ScriptType || (exports.ScriptType = {}));
/*
 * @param spendableOutPoint: an outpoint that is to be spent in the tx
 * @param txOutputs: transaction outputs in the transaction that is spending the spendableOutPoint
 * @return a hash signature of spendableOutPoint and txOutputs
 */
function createOutPointOutputsHash(spendableOutPoint, txOutputs) {
    const outputsData = txOutputs.map(output => {
        const obj = output.toObject();
        return [
            obj.value,
            obj.unit,
            obj.scriptLength,
            obj.outputScript,
        ].join('');
    }).join('');
    const parts = [
        Coin.internalToHuman(Buffer.from(spendableOutPoint.getValue()), Coin.COIN_FRACS.NRG),
        spendableOutPoint.getHash(),
        spendableOutPoint.getIndex(),
        outputsData,
    ];
    const hash = crypto_1.blake2bl(parts.join(''));
    return hash;
}
// sign data ANY with private key Buffer
// return 65B long signature with recovery number as the last byte
function signData(data, privateKey) {
    data = buffer_1.toBuffer(data);
    const dataHash = crypto_1.blake2bl(data);
    const sig = secp256k1.sign(Buffer.from(dataHash, 'hex'), privateKey);
    if (sig.signature.length !== 64) {
        throw Error(`Signature should always be 64B long, l: ${sig.signature.length}`);
    }
    const signatureWithRecovery = Buffer.concat([
        sig.signature,
        buffer_1.intToBuffer(sig.recovery),
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
exports.createUnlockSig = createUnlockSig;
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
        throw new Error('outputs has to be set to txTemplate before signing the inputs');
    }
    return spentOutPoints.map(outPoint => {
        const signature = createUnlockSig(outPoint, txTemplate, Buffer.from(bcPrivateKeyHex, 'hex'));
        const pubKey = secp256k1.publicKeyCreate(Buffer.from(bcPrivateKeyHex, 'hex'), true);
        const inputUnlockScript = [
            signature.toString('hex'),
            crypto_1.blake2bl(bcAddress),
        ].map(string_1.normalizeHexString).join(' ');
        return protoUtil_1.createTransactionInput(outPoint, inputUnlockScript);
    });
}
exports.createSignedNRGUnlockInputs = createSignedNRGUnlockInputs;
function createNRGLockScript(address, addressDoubleHashed = false) {
    address = address.toLowerCase();
    if (!addressDoubleHashed) {
        address = crypto_1.blake2bl(crypto_1.blake2bl(address) + address);
    }
    const script = [
        'OP_BLAKE2BLPRIV',
        string_1.normalizeHexString(address),
        'OP_EQUALVERIFY',
        'OP_CHECKSIGNOPUBKEYVERIFY',
    ];
    return script.join(' ');
}
exports.createNRGLockScript = createNRGLockScript;
function parseNRGLockScript(script) {
    const scriptStr = bytecode_1.toASM(Buffer.from(script), 0x01);
    const doubleHashedBcAddress = scriptStr.split(' ')[1];
    return {
        doubleHashedBcAddress,
    };
}
exports.parseNRGLockScript = parseNRGLockScript;
function createFeedLockScript(olAddress, feedAddress, addressDoubleHashed = false) {
    olAddress = olAddress.toLowerCase();
    if (!addressDoubleHashed) {
        olAddress = crypto_1.blake2bl(crypto_1.blake2bl(olAddress) + olAddress);
    }
    const opXType = '6'; // local government
    const opXInitScript = ['OP_X', string_1.normalizeHexString(opXType), string_1.normalizeHexString(feedAddress)];
    const unlockMonadScript = ['OP_BLAKE2BLPRIV', string_1.normalizeHexString(olAddress), 'OP_EQUALVERIFY', 'OP_CHECKSIGNOPUBKEYVERIFY'];
    const script = ['OP_MONOID', opXInitScript, 'OP_MONAD', unlockMonadScript, 'OP_ENDMONAD'];
    return script.join(' ');
}
exports.createFeedLockScript = createFeedLockScript;
function createMakerLockScript(shiftMaker, shiftTaker, depositLength, settleLength, sendsFromChain, receivesToChain, sendsFromAddress, receivesToAddress, sendsUnit, receivesUnit, fixedUnitFee, bcAddress, addressDoubleHashed = false) {
    bcAddress = bcAddress.toLowerCase();
    if (!addressDoubleHashed) {
        bcAddress = crypto_1.blake2bl(crypto_1.blake2bl(bcAddress) + bcAddress);
    }
    const unlockMonadScript = ['OP_BLAKE2BLPRIV', string_1.normalizeHexString(bcAddress), 'OP_EQUALVERIFY', 'OP_CHECKSIGNOPUBKEYVERIFY'];
    const depsetArgs = [shiftMaker, shiftTaker, depositLength, settleLength];
    const makerCollArgs = [sendsFromChain, receivesToChain, sendsFromAddress, receivesToAddress, sendsUnit, receivesUnit];
    const script = sendsFromChain !== 'nrg' ?
        [
            ['OP_MONOID'], depsetArgs, ['OP_DEPSET'],
            // depset failure - return
            ['OP_0', 'OP_IFEQ', 'OP_RETURN', 'OP_ENDIFEQ'],
            // before deposit period ends - taker can take order
            ['OP_2', 'OP_IFEQ', 'OP_TAKERPAIR', '2', '0', 'OP_MINUNITVALUE', 'OP_RETURN_RESULT', 'OP_ENDIFEQ'],
            // between deposit and settlement - return
            ['OP_3', 'OP_IFEQ', 'OP_RETURN', 'OP_ENDIFEQ'],
            // after settlement period - calculate who sent their asset
            ['OP_DROP'], makerCollArgs, ['OP_MAKERCOLL'],
            // maker succeeded, taker failed - maker can spend
            ['OP_3', 'OP_IFEQ', 'OP_MONAD'], unlockMonadScript, ['OP_ENDMONAD', 'OP_RETURN_RESULT', 'OP_ENDIFEQ'],
            // taker & maker succeeded -  both can spend
            ['OP_2', 'OP_IFEQ', '1', 'OP_MONADSPLIT', 'OP_MONAD'], unlockMonadScript, ['OP_ENDMONAD', 'OP_ENDIFEQ'],
            // taker & maker failed - both can spend
            ['OP_5', 'OP_IFEQ', '1', 'OP_MONADSPLIT', 'OP_MONAD'], unlockMonadScript, ['OP_ENDMONAD', 'OP_ENDIFEQ'],
        ] : // 62
        [
            ['OP_MONOID'], depsetArgs, ['OP_DEPSET'],
            // depset failure - return
            ['OP_0', 'OP_IFEQ', 'OP_RETURN', 'OP_ENDIFEQ'],
            // before deposit period ends - taker can take order and has to pay maker the fixed unit fee
            ['OP_2', 'OP_IFEQ', 'OP_TAKERPAIR', '1', fixedUnitFee, 'OP_MINUNITVALUE', 'OP_MONAD'],
            unlockMonadScript,
            ['OP_ENDMONAD', 'OP_RETURN_RESULT', 'OP_ENDIFEQ'],
            // between deposit and settlement - return
            ['OP_3', 'OP_IFEQ', 'OP_RETURN', 'OP_ENDIFEQ'],
            // after settlement period - calculate who sent their asset
            ['OP_DROP'], makerCollArgs, ['OP_MAKERCOLL'],
            // maker succeed, taker failed - maker can spend
            ['OP_3', 'OP_IFEQ', 'OP_MONAD'], unlockMonadScript, ['OP_ENDMONAD', 'OP_RETURN_RESULT', 'OP_ENDIFEQ'],
            // taker & maker fail - maker can spend
            ['OP_5', 'OP_IFEQ', 'OP_MONAD'], unlockMonadScript, ['OP_ENDMONAD', 'OP_RETURN_RESULT', 'OP_ENDIFEQ'],
        ]; // 56
    return script.map(part => part.join(' ')).join(' ');
}
exports.createMakerLockScript = createMakerLockScript;
function parseMakerLockScript(script) {
    const scriptStr = bytecode_1.toASM(Buffer.from(script), 0x01);
    const [shiftMaker, shiftTaker, deposit, settlement] = scriptStr.split(' OP_DEPSET ')[0].split(' ').slice(1);
    const [sendsFromChain, receivesToChain, sendsFromAddress, receivesToAddress, sendsUnit, receivesUnit] = scriptStr.split(' OP_MAKERCOLL ')[0].split(' OP_DROP ')[1].split(' ');
    const [fixedUnitFee, base] = scriptStr.split(' OP_MINUNITVALUE')[0].split(' ').reverse().slice(0, 2);
    const baseNum = isNaN(parseInt(base, 10)) ? 0 : parseInt(base, 10);
    const splitBy = scriptStr.includes('OP_MONADSPLIT') ?
        ' OP_5 OP_IFEQ 1 OP_MONADSPLIT OP_MONAD OP_BLAKE2BLPRIV ' :
        ' OP_5 OP_IFEQ OP_MONAD OP_BLAKE2BLPRIV ';
    const doubleHashedBcAddress = scriptStr.split(splitBy)[1].split(' ')[0];
    /* tslint:disable:object-literal-sort-keys */
    return {
        base: baseNum,
        fixedUnitFee,
        doubleHashedBcAddress,
        receivesToAddress,
        receivesToChain,
        receivesUnit,
        sendsFromAddress,
        sendsFromChain,
        sendsUnit,
        deposit: parseInt(deposit, 10),
        settlement: parseInt(settlement, 10),
        shiftMaker: parseInt(shiftMaker, 10),
        shiftTaker: parseInt(shiftTaker, 10),
    };
    /* tslint:enable:object-literal-sort-keys */
}
exports.parseMakerLockScript = parseMakerLockScript;
function createTakerUnlockScript(sendsFromAddress, receivesToAddress) {
    return [sendsFromAddress, receivesToAddress].join(' ');
}
exports.createTakerUnlockScript = createTakerUnlockScript;
function parseTakerUnlockScript(script) {
    const scriptStr = bytecode_1.toASM(Buffer.from(script), 0x01);
    const [sendsFromAddress, receivesToAddress] = scriptStr.split(' ');
    return {
        receivesToAddress,
        sendsFromAddress,
    };
}
exports.parseTakerUnlockScript = parseTakerUnlockScript;
function createTakerLockScript(makerTxHash, makerTxOutputIndex, takerBCAddress, addressDoubleHashed = false) {
    takerBCAddress = takerBCAddress.toLowerCase();
    if (!addressDoubleHashed) {
        takerBCAddress = crypto_1.blake2bl(crypto_1.blake2bl(takerBCAddress) + takerBCAddress);
    }
    const script = [
        [makerTxHash, makerTxOutputIndex, 'OP_CALLBACK'],
        // 4: taker succeed, maker failed, taker can spend the outpoint
        ['4', 'OP_IFEQ', 'OP_MONAD', 'OP_BLAKE2BLPRIV',
            string_1.normalizeHexString(takerBCAddress),
            'OP_EQUALVERIFY', 'OP_CHECKSIGNOPUBKEYVERIFY', 'OP_ENDMONAD', 'OP_ENDIFEQ'],
        // this.OP_0() // both failed,
        ['OP_DROP', 'OP_MONAD', 'OP_BLAKE2BLPRIV',
            string_1.normalizeHexString(takerBCAddress),
            'OP_EQUALVERIFY', 'OP_CHECKSIGNOPUBKEYVERIFY', 'OP_ENDMONAD'],
    ];
    return script.map(part => part.join(' ')).join(' ');
}
exports.createTakerLockScript = createTakerLockScript;
function parseTakerLockScript(script) {
    const scriptStr = bytecode_1.toASM(Buffer.from(script), 0x01);
    if (scriptStr.indexOf('OP_CALLBACK') === -1) {
        throw new Error('Invalid taker outpout script');
    }
    const [makerTxHash, makerTxOutputIndex] = scriptStr.split(' OP_CALLBACK')[0].split(' ');
    const doubleHashedBcAddress = scriptStr.split(' OP_BLAKE2BLPRIV ')[1].split(' ')[0];
    return {
        doubleHashedBcAddress,
        makerTxHash,
        makerTxOutputIndex: parseInt(makerTxOutputIndex, 10),
    };
}
exports.parseTakerLockScript = parseTakerLockScript;
function createTakerCallbackLockScript(makerTxHash, makerTxOutputIndex) {
    return [makerTxHash, makerTxOutputIndex, 'OP_CALLBACK'].join(' ');
}
exports.createTakerCallbackLockScript = createTakerCallbackLockScript;
function parseTakerCallbackLockScript(script) {
    const scriptStr = bytecode_1.toASM(Buffer.from(script), 0x01);
    const [makerTxHash, makerTxOutputIndex, opCallback] = scriptStr.split(' ');
    return {
        makerTxHash,
        makerTxOutputIndex,
    };
}
exports.parseTakerCallbackLockScript = parseTakerCallbackLockScript;
function getScriptType(script) {
    const scriptStr = bytecode_1.toASM(Buffer.from(script), 0x01);
    if (scriptStr.startsWith('OP_MONOID') && scriptStr.indexOf('OP_X') < 0) {
        return ScriptType.MAKER_OUTPUT; // IS_MAKER_ORDER
    }
    else if (scriptStr.startsWith('OP_MONOID') &&
        scriptStr.indexOf('OP_X') > -1 && scriptStr.indexOf('OP_CALLBACK') < 0) {
        return ScriptType.FEED_CREATE; // IS_FEED_CREATE
    }
    else if (scriptStr.endsWith('OP_CALLBACK')) {
        return ScriptType.TAKER_CALLBACK; // IS_MAKER_CALLBACK_ORDER
    }
    else if (scriptStr.indexOf('OP_MONAD') > -1 &&
        scriptStr.indexOf('OP_CALLBACK') > -1 && scriptStr.indexOf('OP_IFEQ') > -1) {
        return ScriptType.TAKER_OUTPUT; // IS_TAKER_ORDER
    }
    else if (scriptStr.indexOf('OP_CALLBACK') > -1 && scriptStr.indexOf('OP_MONAD') > -1) {
        return ScriptType.FEED_UPDATE; // IS_FEED_UPDATE
    }
    else if (scriptStr.startsWith('OP_BLAKE2BLPRIV')) {
        return ScriptType.NRG_TRANSFER; // IS_NRG_TRANSFER
    }
    else if (scriptStr.split(' ').length === 2) {
        return ScriptType.TAKER_INPUT;
    }
    else {
        return ScriptType.NRG_UNLOCK;
    }
}
exports.getScriptType = getScriptType;
//# sourceMappingURL=templates.js.map