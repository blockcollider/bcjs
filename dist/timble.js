"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const secp256k1 = require('secp256k1');
const coreProtobuf = __importStar(require("./protos/core_pb"));
const { blake2blTwice, blake2bl } = require('./utils/crypto');
const Coin = require('./utils/coin');
const { toBuffer, intToBuffer } = require('./utils/buffer');
class TimbleScript {
    static bufferToString(scriptBuffer) {
        return Buffer.from(scriptBuffer).toString('ascii');
    }
    static stringToBuffer(scriptString) {
        return new Uint8Array(Buffer.from(scriptString, 'ascii'));
    }
    /*
     * @param spendableOutPoint: an outpoint that is to be spent in the tx
     * @param txOutputs: transaction outputs in the transaction that is spending the spendableOutPoint
     * @return a hash signature of spendableOutPoint and txOutputs
     */
    static createOutPointOutputsHash(spendableOutPoint, txOutputs) {
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
    static signData(data, privateKey) {
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
    static createTxInputSig(spendableOutPoint, tx, privateKey) {
        const dataToSign = TimbleScript.generateDataToSignForSig(spendableOutPoint, tx.getOutputsList());
        const sig = TimbleScript.signData(dataToSign, privateKey);
        return sig;
    }
    /*
     * Sign transaction inputs of a tx, the signature requires transaction outputs to be set tx before calling this
     * @param bcAddress: BlockCollider address
     * @param bcPrivateKeyHex: BlockCollider private key in hex
     * @param txTemplate: transaction that is spending the spentOutPoints
     * @param spentOutPoints: outPoints to be spent in the txTemplate
     * @return a list of signed transaction inputs
     */
    static createSignedNRGInputs(bcAddress, bcPrivateKeyHex, txTemplate, spentOutPoints) {
        return spentOutPoints.map((outPoint) => {
            const signature = TimbleScript.createTxInputSig(outPoint, txTemplate, Buffer.from(bcPrivateKeyHex, 'hex'));
            const pubKey = secp256k1.staticKeyCreate(Buffer.from(bcPrivateKeyHex, 'hex'), true);
            const input = new coreProtobuf.TransactionInput();
            input.setOutPoint(outPoint);
            const inputUnlockScript = [
                signature.toString('hex'),
                pubKey.toString('hex'),
                blake2bl(bcAddress)
            ].join(' ');
            input.setScriptLength(inputUnlockScript.length);
            input.setInputScript(new Uint8Array(Buffer.from(inputUnlockScript, 'ascii')));
            return input;
        });
    }
    static createNRGLockScript(address) {
        address = address.toLowerCase();
        const script = [
            'OP_BLAKE2BL',
            blake2blTwice(address),
            'OP_EQUALVERIFY',
            'OP_CHECKSIGVERIFY'
        ];
        return script.join(' ');
    }
    static parseNRGLockScript(script) {
        if (typeof script != 'string')
            script = TimbleScript.bufferToString(script);
        const doubleHashedBcAddress = script.split(' ')[1];
        return {
            doubleHashedBcAddress
        };
    }
    static createMakerLockScript(shiftMaker, shiftTaker, depositLength, settleLength, sendsFromChain, receivesToChain, sendsFromAddress, receivesToAddress, sendsUnit, receivesUnit, bcAddress) {
        bcAddress = bcAddress.toLowerCase();
        let doubleHashedBcAddress = blake2blTwice(bcAddress);
        const script = [
            ['OP_MONOID', shiftMaker, shiftTaker, depositLength, settleLength, 'OP_DEPSET'],
            ['OP_0', 'OP_IFEQ',
                'OP_RETURN', 'OP_ENDIFEQ'],
            ['OP_2', 'OP_IFEQ',
                'OP_TAKERPAIR', '2', 'OP_MINUNITVALUE', 'OP_RETURN_RESULT', 'OP_ENDIFEQ'],
            ['OP_3', 'OP_IFEQ',
                'OP_RETURN', 'OP_ENDIFEQ'],
            ['OP_DROP', sendsFromChain, receivesToChain, sendsFromAddress, receivesToAddress, sendsUnit, receivesUnit, 'OP_MAKERCOLL'],
            ['OP_3', 'OP_IFEQ',
                'OP_BLAKE2BL', doubleHashedBcAddress, 'OP_EQUALVERIFY', 'OP_CHECKSIGVERIFY', 'OP_RETURN_RESULT', 'OP_ENDIFEQ'],
            ['OP_2', 'OP_IFEQ',
                '1', 'OP_MONADSPLIT', 'OP_MONAD', 'OP_BLAKE2BL', doubleHashedBcAddress, 'OP_EQUALVERIFY', 'OP_CHECKSIGVERIFY', 'OP_ENDMONAD', 'OP_ENDIFEQ']
        ];
        return script.map(part => part.join(' ')).join(' ');
    }
    static parseMakerLockScript(script) {
        if (typeof script != 'string')
            script = TimbleScript.bufferToString(script);
        const [shiftMaker, shiftTaker, deposit, settlement] = script.split(' OP_DEPSET ')[0].split(' ').slice(1);
        const tradeInfo = script.split(' OP_MAKERCOLL ')[0].split(' ');
        const [sendsFromChain, receivesToChain, sendsFromAddress, receivesToAddress, sendsUnit, receivesUnit] = tradeInfo.slice(tradeInfo.length - 5);
        const doubleHashedBcAddress = script.split(' OP_IFEQ OP_BLAKE2BL ')[1].split(' ')[0];
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
            doubleHashedBcAddress: doubleHashedBcAddress
        };
    }
    static createTakerUnlockScript(takerWantsAddress, takerSendsAddress) {
        return [takerWantsAddress, takerSendsAddress].join(' ');
    }
    static parseTakerUnlockScript(script) {
        if (typeof script != 'string')
            script = TimbleScript.bufferToString(script);
        const [takerWantsAddress, takerSendsAddress] = script.split(' ');
        return {
            takerWantsAddress,
            takerSendsAddress
        };
    }
    static createTakerLockScript(makerTxHash, makerTxOutputIndex, takerBCAddress) {
        takerBCAddress = takerBCAddress.toLowerCase();
        const doubleHashedBcAddress = blake2blTwice(takerBCAddress);
        const script = [
            [makerTxHash, makerTxOutputIndex, 'OP_CALLBACK'],
            ['4', 'OP_IFEQ', 'OP_BLAKE2BL', doubleHashedBcAddress, 'OP_EQUALVERIFY', 'OP_CHECKSIGVERIFY', 'OP_ENDIFEQ'],
            ['OP_DROP', 'OP_MONAD', 'OP_BLAKE2BL', doubleHashedBcAddress, 'OP_EQUALVERIFY', 'OP_CHECKSIGVERIFY', 'OP_ENDMONAD']
        ];
        return script.map(part => part.join(' ')).join(' ');
    }
    static parseTakerLockScript(script) {
        if (typeof script != 'string')
            script = TimbleScript.bufferToString(script);
        if (script.indexOf('OP_CALLBACK') === -1) {
            throw new Error('Invalid taker outpout script');
        }
        const [makerTxHash, makerTxOutputIndex] = script.split(' OP_CALLBACK')[0].split(' ');
        const doubleHashedBcAddress = script.split(' OP_BLAKE2BL ')[1].split(' ')[0];
        return {
            makerTxHash: makerTxHash,
            makerTxOutputIndex: parseInt(makerTxOutputIndex, 10),
            doubleHashedBcAddress: doubleHashedBcAddress
        };
    }
    static createTakerCallbackLockScript(makerTxHash, makerTxOutputIndex) {
        return [makerTxHash, makerTxOutputIndex, 'OP_CALLBACK'].join(' ');
    }
    static parseTakerCallbackLockScript(script) {
        if (typeof script != 'string')
            script = TimbleScript.bufferToString(script);
        const [makerTxHash, makerTxOutputIndex, OP_Callback] = script.split(' ');
        return {
            makerTxHash,
            makerTxOutputIndex
        };
    }
    static getScriptType(script) {
        if (typeof script != 'string')
            script = TimbleScript.bufferToString(script);
        if (script.startsWith('OP_MONOID')) {
            return TimbleScript.MAKER_OUTPUT;
        }
        else if (script.endsWith('OP_CALLBACK')) {
            return TimbleScript.TAKER_CALLBACK;
        }
        else if (script.indexOf('OP_MONAD') > -1 && script.indexOf('OP_CALLBACK') > -1) {
            return TimbleScript.TAKER_OUTPUT;
        }
        else if (script.startsWith('OP_BLAKE2BL')) {
            return TimbleScript.NRG_TRANSFER;
        }
        else
            return TimbleScript.TAKER_INPUT;
    }
}
// Global Variables
TimbleScript.NRG_TRANSFER = 'nrg_transfer';
TimbleScript.MAKER_OUTPUT = 'maker_output';
TimbleScript.TAKER_INPUT = 'taker_input';
TimbleScript.TAKER_OUTPUT = 'taker_output';
TimbleScript.TAKER_CALLBACK = 'taker_callback';
TimbleScript.generateDataToSignForSig = (spendableOutPoint, txOutputs) => {
    return TimbleScript.createOutPointOutputsHash(spendableOutPoint, txOutputs);
};
exports.default = TimbleScript;
//# sourceMappingURL=timble.js.map