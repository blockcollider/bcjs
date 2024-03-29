/// <reference types="node" />
import * as coreProtobuf from '@overline/proto/proto/core_pb';
export declare enum ScriptType {
    NRG_TRANSFER = "nrg_transfer",
    MAKER_OUTPUT = "maker_output",
    TAKER_INPUT = "taker_input",
    TAKER_OUTPUT = "taker_output",
    TAKER_CALLBACK = "taker_callback",
    FEED_CREATE = "feed_create",
    FEED_UPDATE = "feed_update",
    NRG_UNLOCK = "nrg_unlock"
}
export declare function createUnlockSig(spendableOutPoint: coreProtobuf.OutPoint, tx: coreProtobuf.Transaction, privateKey: Buffer): Buffer | never;
export declare function createSignedNRGUnlockInputs(bcAddress: string, bcPrivateKeyHex: string, txTemplate: coreProtobuf.Transaction, spentOutPoints: coreProtobuf.OutPoint[]): coreProtobuf.TransactionInput[];
export declare function createNRGLockScript(address: string, addressDoubleHashed?: boolean): string;
export declare function parseNRGLockScript(script: Uint8Array): {
    doubleHashedBcAddress: string;
};
export declare function createMakerLockScript(shiftMaker: number, shiftTaker: number, depositLength: number, settleLength: number, sendsFromChain: string, receivesToChain: string, sendsFromAddress: string, receivesToAddress: string, sendsUnit: string, receivesUnit: string, fixedUnitFee: string, bcAddress: string, addressDoubleHashed?: boolean): string;
export declare function parseMakerLockScript(script: Uint8Array): {
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
    fixedUnitFee: string;
    base: number;
};
export declare function createTakerUnlockScript(sendsFromAddress: string, receivesToAddress: string): string;
export declare function createUpdateFeedUnlockScript(sendsFromAddress: string, receivesToAddress: string): string;
export declare function parseUpdateFeedLockScript(script: Uint8Array): {
    feedTxHash: string;
    feedTxOutputIndex: string | number;
    dataType: string;
    dataLength: string;
    data: string;
    doubleHashedOlAddress: string;
};
export declare function parseCreateFeedLockScript(script: Uint8Array): {
    dataType: string;
    dataLength: string;
    data: string;
    doubleHashedOlAddress: string;
};
export declare function parseTakerUnlockScript(script: Uint8Array): {
    sendsFromAddress: string;
    receivesToAddress: string;
};
export declare function createFeedLockScript(olAddress: string, dataType: number, dataLength: number, // may be different if IPFS download
data: string, // has to be hex encoded
addressDoubleHashed?: boolean): string;
export declare function createUpdateFeedLockScript(feedTxHash: string, feedTxOutputIndex: string | number, feedUpdaterAddress: string, dataType: number, dataLength: number, data: string, // has to be hex encoded
addressDoubleHashed?: boolean): string;
export declare function createTakerLockScript(makerTxHash: string, makerTxOutputIndex: string | number, takerBCAddress: string, addressDoubleHashed?: boolean): string;
export declare function parseTakerLockScript(script: Uint8Array): {
    makerTxHash: string;
    makerTxOutputIndex: number;
    doubleHashedBcAddress: string;
};
export declare function createTakerCallbackLockScript(makerTxHash: string, makerTxOutputIndex: number): string;
export declare function createUpdateFeedCallbackLockScript(makerTxHash: string, makerTxOutputIndex: number): string;
export declare function parseTakerCallbackLockScript(script: Uint8Array): {
    makerTxHash: string;
    makerTxOutputIndex: string;
};
export declare function getScriptType(script: Uint8Array): ScriptType;
