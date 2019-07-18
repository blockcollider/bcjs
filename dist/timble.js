"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { blake2bl } = require('./utils');
class TimbleScript {
    constructor() {
        // Global Variables
        this.NRG_TRANSFER = 'nrg_transfer';
        this.MAKER_OUTPUT = 'maker_output';
        this.TAKER_INPUT = 'taker_input';
        this.TAKER_OUTPUT = 'taker_output';
        this.TAKER_CALLBACK = 'taker_callback';
    }
    bufferToString(scriptBuffer) {
        return Buffer.from(scriptBuffer).toString('ascii');
    }
    stringToBuffer(scriptString) {
        return new Uint8Array(Buffer.from(scriptString, 'ascii'));
    }
    createNRGTransfer(address) {
        address = address.toLowerCase();
        const script = [
            'OP_BLAKE2BL',
            blake2bl(blake2bl(address)),
            'OP_EQUALVERIFY',
            'OP_CHECKSIGVERIFY'
        ];
        return script.join(' ');
    }
    createMakerOutput(shiftLength, depositLength, settleLength, paysFromChainId, wantsToChainId, makerWantsAddress, makerWantsUnit, makerPaysUnit, makerBCAddress) {
        makerBCAddress = makerBCAddress.toLowerCase();
        let doubleHashedBcAddress = blake2bl(blake2bl(makerBCAddress));
        makerWantsAddress = makerWantsAddress.toLowerCase();
        const script = [
            ['OP_MONOID', shiftLength, depositLength, settleLength, 'OP_DEPSET'],
            ['OP_0', 'OP_IFEQ',
                'OP_RETURN', 'OP_ENDIFEQ'],
            ['OP_2', 'OP_IFEQ',
                'OP_TAKERPAIR', '2', 'OP_MINUNITVALUE', 'OP_RETURN_RESULT', 'OP_ENDIFEQ'],
            ['OP_3', 'OP_IFEQ',
                'OP_RETURN', 'OP_ENDIFEQ'],
            ['OP_DROP', paysFromChainId, wantsToChainId, makerWantsAddress, makerWantsUnit, makerPaysUnit, 'OP_MAKERCOLL'],
            ['OP_3', 'OP_IFEQ',
                'OP_BLAKE2BL', doubleHashedBcAddress, 'OP_EQUALVERIFY', 'OP_CHECKSIGVERIFY', 'OP_RETURN_RESULT', 'OP_ENDIFEQ'],
            ['OP_2', 'OP_IFEQ',
                '1', 'OP_MONADSPLIT', 'OP_MONAD', 'OP_BLAKE2BL', doubleHashedBcAddress, 'OP_EQUALVERIFY', 'OP_CHECKSIGVERIFY', 'OP_ENDMONAD', 'OP_ENDIFEQ']
        ];
        return script.map(part => part.join(' ')).join(' ');
    }
    createTakerInput(takerWantsAddress, takerSendsAddress) {
        return [takerWantsAddress, takerSendsAddress].join(' ');
    }
    createTakerOutput(makerTxHash, makerTxOutputIndex, takerBCAddress) {
        takerBCAddress = takerBCAddress.toLowerCase();
        const doubleHashedBcAddress = blake2bl(blake2bl(takerBCAddress));
        const script = [
            [makerTxHash, makerTxOutputIndex, 'OP_CALLBACK'],
            ['4', 'OP_IFEQ', 'OP_BLAKE2BL', doubleHashedBcAddress, 'OP_EQUALVERIFY', 'OP_CHECKSIGVERIFY', 'OP_ENDIFEQ'],
            ['OP_DROP', 'OP_MONAD', 'OP_BLAKE2BL', doubleHashedBcAddress, 'OP_EQUALVERIFY', 'OP_CHECKSIGVERIFY', 'OP_ENDMONAD']
        ];
        return script.map(part => part.join(' ')).join(' ');
    }
    createTakerCallbackOutputForMaker(makerTxHash, makerTxOutputIndex) {
        return [makerTxHash, makerTxOutputIndex, 'OP_CALLBACK'].join(' ');
    }
    getScriptType(script) {
        if (typeof script != 'string')
            script = this.bufferToString(script);
        if (script.startsWith('OP_MONOID')) {
            return this.MAKER_OUTPUT;
        }
        else if (script.endsWith('OP_CALLBACK')) {
            return this.TAKER_CALLBACK;
        }
        else if (script.indexOf('OP_MONAD') > -1 && script.indexOf('OP_CALLBACK') > -1) {
            return this.TAKER_OUTPUT;
        }
        else if (script.startsWith('OP_BLAKE2BL')) {
            return this.NRG_TRANSFER;
        }
        else
            return this.TAKER_INPUT;
    }
    parseTakerOutput(script) {
        if (typeof script != 'string')
            script = this.bufferToString(script);
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
    parseNRGTransfer(script) {
        if (typeof script != 'string')
            script = this.bufferToString(script);
        const doubleHashedBcAddress = script.split(' ')[1];
        return {
            doubleHashedBcAddress
        };
    }
    parseTakerInput(script) {
        if (typeof script != 'string')
            script = this.bufferToString(script);
        const [takerWantsAddress, takerSendsAddress] = script.split(' ');
        return {
            takerWantsAddress,
            takerSendsAddress
        };
    }
    parseTakerCallback(script) {
        if (typeof script != 'string')
            script = this.bufferToString(script);
        const [makerTxHash, makerTxOutputIndex, OP_Callback] = script.split(' ');
        return {
            makerTxHash,
            makerTxOutputIndex
        };
    }
    parseMakerOutput(script) {
        if (typeof script != 'string')
            script = this.bufferToString(script);
        const [shiftStartsAt, depositEndsAt, settleEndsAt] = script.split(' OP_DEPSET ')[0].split(' ').slice(1);
        const tradeInfo = script.split(' OP_MAKERCOLL ')[0].split(' ');
        const [paysChainId, wantsChainId, wantsAddress, wantsUnit, paysUnit] = tradeInfo.slice(tradeInfo.length - 5);
        const doubleHashedBcAddress = script.split(' OP_IFEQ OP_BLAKE2BL ')[1].split(' ')[0];
        return {
            shiftStartsAt: parseInt(shiftStartsAt, 10),
            depositEndsAt: parseInt(depositEndsAt, 10),
            settleEndsAt: parseInt(settleEndsAt, 10),
            paysChainId: paysChainId,
            wantsChainId: wantsChainId,
            wantsAddress: wantsAddress,
            wantsUnit: wantsUnit,
            paysUnit: paysUnit,
            doubleHashedBcAddress: doubleHashedBcAddress
        };
    }
}
exports.default = TimbleScript;
//# sourceMappingURL=timble.js.map