/// <reference types="node" />
import BN from 'bn.js';
import RpcClient from './client';
import * as coreProtobuf from './protos/core_pb';
export declare const fromBuffer: (txBuffer: Uint8Array | Buffer) => coreProtobuf.Transaction;
export declare const createMultiNRGTransferTransaction: (spendableWalletOutPointObjs: coreProtobuf.WalletOutPoint.AsObject[], fromAddress: string, privateKeyHex: string, toAddress: string[], transferAmountNRG: string[], txFeeNRG: string, addDefaultFee?: boolean) => coreProtobuf.Transaction;
export declare const createNRGTransferTransaction: (spendableWalletOutPointObjs: coreProtobuf.WalletOutPoint.AsObject[], fromAddress: string, privateKeyHex: string, toAddress: string, transferAmountNRG: string, txFeeNRG: string, addDefaultFee?: boolean) => coreProtobuf.Transaction;
export declare const createMakerOrderTransaction: (spendableWalletOutPointObjs: coreProtobuf.WalletOutPoint.AsObject[], shiftMaker: number, shiftTaker: number, depositLength: number, settleLength: number, sendsFromChain: string, receivesToChain: string, sendsFromAddress: string, receivesToAddress: string, sendsUnit: string, receivesUnit: string, bcAddress: string, bcPrivateKeyHex: string, collateralizedNrg: string, nrgUnit: string, fixedUnitFee: string, additionalTxFee: string, addDefaultFee?: boolean) => coreProtobuf.Transaction;
export declare const createOverlineChannelMessage: (spendableWalletOutPointObjs: coreProtobuf.WalletOutPoint.AsObject[], fromAddress: string, privateKeyHex: string, toAddress: string, transferAmountNRG: string, txFeeNRG: string, addDefaultFee?: boolean) => coreProtobuf.Transaction;
export declare const createTakerOrderTransaction: (spendableWalletOutPointObjs: coreProtobuf.WalletOutPoint.AsObject[], sendsFromAddress: string, receivesToAddress: string, makerOpenOrder: {
    doubleHashedBcAddress: string;
    base: number;
    fixedUnitFee: string;
    nrgUnit: string;
    collateralizedNrg: string;
    txHash: string;
    txOutputIndex: number;
}, bcAddress: string, bcPrivateKeyHex: string, collateralizedNrg: string, additionalTxFee: string, addDefaultFee?: boolean) => coreProtobuf.Transaction;
export declare const createUnlockTakerTx: (txHash: string, txOutputIndex: number, bcAddress: string, privateKeyHex: string, bcClient: RpcClient) => Promise<coreProtobuf.Transaction | null>;
export declare const calculateCrossChainTradeFee: (collateralizedNRG: string, additionalTxFee: string, side: "maker" | "taker") => BN;
export declare const calcTxFee: (tx: coreProtobuf.Transaction) => BN;
