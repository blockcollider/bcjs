/// <reference types="node" />
import BN from 'bn.js';
import * as coreProtobuf from './../protos/core_pb';
export declare const bnToBytes: (value: BN) => Uint8Array;
export declare const bytesToInternalBN: (value: Uint8Array) => BN;
export declare const stringToBytes: (value: string, encoding: "ascii" | "hex") => Uint8Array;
export declare const bytesToString: (value: Uint8Array) => string;
export declare const convertProtoBufSerializedBytesToBuffer: (val: string) => Buffer;
export declare const createOutPoint: (hash: string, index: number, val: BN) => coreProtobuf.OutPoint;
export declare const createTransactionInput: (outPoint: coreProtobuf.OutPoint, unlockScript: string) => coreProtobuf.TransactionInput;
export declare const createTransactionOutput: (outputLockScript: string, unit: BN, value: BN) => coreProtobuf.TransactionOutput;
