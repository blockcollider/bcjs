/// <reference types="node" />
import BN from 'bn.js';
import * as bcProtobuf from '@overline/proto/proto/bc_pb';
import * as coreProtobuf from '@overline/proto/proto/core_pb';
export declare const fromBuffer: (txBuffer: Uint8Array | Buffer) => coreProtobuf.Transaction;
export declare const createMultiNRGTransferTransaction: (spendableWalletOutPointObjs: coreProtobuf.WalletOutPoint.AsObject[], fromAddress: string, privateKeyHex: string, toAddress: string[], transferAmountNRG: string[], txFeeNRG: string, addDefaultFee: boolean | undefined, byteFeeMultiplier: string) => Promise<coreProtobuf.Transaction | BN>;
export declare const createNRGTransferTransaction: (spendableWalletOutPointObjs: coreProtobuf.WalletOutPoint.AsObject[], fromAddress: string, privateKeyHex: string, toAddress: string, transferAmountNRG: string, txFeeNRG: string, addDefaultFee: boolean | undefined, byteFeeMultiplier: string) => Promise<coreProtobuf.Transaction | BN>;
export declare const createFeedTransaction: (spendableWalletOutPointObjs: coreProtobuf.WalletOutPoint.AsObject[], olAddress: string, olPrivateKeyHex: string, dataType: string, dataLength: string, data: string, olAmount: string, olUnit: string, addDefaultFee: boolean | undefined, byteFeeMultiplier: string) => Promise<coreProtobuf.Transaction | BN>;
export declare const createMakerOrderTransaction: (spendableWalletOutPointObjs: coreProtobuf.WalletOutPoint.AsObject[], shiftMaker: number, shiftTaker: number, depositLength: number, settleLength: number, sendsFromChain: string, receivesToChain: string, sendsFromAddress: string, receivesToAddress: string, sendsUnit: string, receivesUnit: string, bcAddress: string, bcPrivateKeyHex: string, collateralizedNrg: string, nrgUnit: string, fixedUnitFee: string, additionalTxFee: string, addDefaultFee: boolean | undefined, byteFeeMultiplier: string) => Promise<coreProtobuf.Transaction | BN>;
export declare const createUpdateFeedTransaction: (spendableWalletOutPointObjs: coreProtobuf.WalletOutPoint.AsObject[], sendsFromAddress: string, receivesToAddress: string, dataType: number, dataLength: number, data: string, feedInfo: {
    doubleHashedBcAddress: string;
    base: number;
    fixedUnitFee: string;
    nrgUnit: string;
    collateralizedNrg: string;
    txHash: string;
    txOutputIndex: number;
}, bcAddress: string, bcPrivateKeyHex: string, collateralizedNrg: string, addDefaultFee: boolean | undefined, byteFeeMultiplier: string) => Promise<coreProtobuf.Transaction | BN>;
export declare const createTakerOrderTransaction: (spendableWalletOutPointObjs: coreProtobuf.WalletOutPoint.AsObject[], sendsFromAddress: string, receivesToAddress: string, makerOpenOrder: {
    doubleHashedBcAddress: string;
    base: number;
    fixedUnitFee: string;
    nrgUnit: string;
    collateralizedNrg: string;
    txHash: string;
    txOutputIndex: number;
}, bcAddress: string, bcPrivateKeyHex: string, collateralizedNrg: string, additionalTxFee: string, addDefaultFee: boolean | undefined, byteFeeMultiplier: string) => Promise<coreProtobuf.Transaction | BN>;
export declare const createUnlockTakerTx: (txHash: string, txOutputIndex: number, bcAddress: string, privateKeyHex: string, unlockTakerTxParams: bcProtobuf.GetUnlockTakerTxParamsResponse.AsObject) => Promise<coreProtobuf.Transaction | BN | null>;
export declare const calculateCrossChainTradeFee: (collateralizedNRG: string, additionalTxFee: string, side: "maker" | "taker") => BN;
export declare const inputsMinusOuputs: (outPoints: (coreProtobuf.OutPoint | undefined)[], outputs: coreProtobuf.TransactionOutput[]) => BN;
export declare const calcTxFee: (tx: coreProtobuf.Transaction) => BN;
