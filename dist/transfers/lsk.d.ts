interface ILSKTransfer {
    to: string;
    from: string;
    timestamp: number;
    value: number;
    height: number;
    txHash: string;
}
export declare const getTransfers: (address: string) => Promise<ILSKTransfer[]>;
export declare const getBalance: (address: string) => Promise<string>;
export declare const payLSK: (privateKey: string, from: string, to: string, amount: number) => Promise<any>;
export {};
