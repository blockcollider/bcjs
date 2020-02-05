import { TSeedTypes } from '@waves/waves-transactions';
interface IWAVTransfer {
    to: string;
    from: string;
    timestamp: number;
    value: number;
    height: number;
    txHash: string;
}
export declare const getTransfers: (address: string, limit?: number) => Promise<IWAVTransfer[]>;
export declare const getBalance: (address: string) => Promise<number>;
export declare const payWAV: (privateKey: TSeedTypes, from: any, to: any, amount: any) => Promise<import("@waves/waves-transactions").ITransferTransaction<string | number> & import("@waves/waves-transactions").WithId>;
export {};
