import { TSeedTypes } from '@waves/waves-transactions';
export declare const payWAV: (privateKey: TSeedTypes, from: any, to: any, amount: any) => Promise<import("@waves/waves-transactions").ITransferTransaction<string | number> & import("@waves/waves-transactions").WithId>;
