/// <reference types="node" />
import * as coreProtobuf from './protos/core_pb';
export default class TimbleScript {
    static NRG_TRANSFER: string;
    static MAKER_OUTPUT: string;
    static TAKER_INPUT: string;
    static TAKER_OUTPUT: string;
    static TAKER_CALLBACK: string;
    static createOutPointOutputsHash(spendableOutPoint: coreProtobuf.OutPoint, txOutputs: coreProtobuf.TransactionOutput[]): string;
    static signData(data: string | Buffer, privateKey: Buffer): Buffer | never;
    static createUnlockSig(spendableOutPoint: coreProtobuf.OutPoint, tx: coreProtobuf.Transaction, privateKey: Buffer): Buffer | never;
    static generateDataToSignForSig: (spendableOutPoint: coreProtobuf.OutPoint, txOutputs: coreProtobuf.TransactionOutput[]) => string;
    static createSignedNRGUnlockInputs(bcAddress: string, bcPrivateKeyHex: string, txTemplate: coreProtobuf.Transaction, spentOutPoints: coreProtobuf.OutPoint[]): Array<coreProtobuf.TransactionInput>;
    static createNRGLockScript(address: string): string;
    static parseNRGLockScript(script: string | Uint8Array): {
        doubleHashedBcAddress: string;
    };
    static createMakerLockScript(shiftMaker: number, shiftTaker: number, depositLength: number, settleLength: number, sendsFromChain: string, receivesToChain: string, sendsFromAddress: string, receivesToAddress: string, sendsUnit: string, receivesUnit: string, fixedUnitFee: string, bcAddress: string): string;
    static parseMakerLockScript(script: string | Uint8Array): {
        shiftMaker: number;
        shiftTaker: number;
        deposit: number;
        settlement: number;
        sendsFromChain: string;
        receivesToChain: string;
        sendsFromAddress: string;
        receivesToAddress: string;
        sendsUnit: string;
        receivesUnit: string;
        doubleHashedBcAddress: string;
        fixedUnitFee: number;
        base: number;
    };
    static createTakerUnlockScript(takerWantsAddress: string, takerSendsAddress: string): string;
    static parseTakerUnlockScript(script: string | Uint8Array): {
        takerWantsAddress: string;
        takerSendsAddress: string;
    };
    static createTakerLockScript(makerTxHash: string, makerTxOutputIndex: string | number, takerBCAddress: string): string;
    static parseTakerLockScript(script: string | Uint8Array): {
        makerTxHash: string;
        makerTxOutputIndex: number;
        doubleHashedBcAddress: string;
    };
    static createTakerCallbackLockScript(makerTxHash: string, makerTxOutputIndex: number): string;
    static parseTakerCallbackLockScript(script: string | Uint8Array): {
        makerTxHash: string;
        makerTxOutputIndex: string;
    };
    static getScriptType(script: Uint8Array | string): string;
}
