interface INEOTransfer {
    to: string;
    from: string;
    timestamp: number;
    value: string;
    height: number;
    txHash: string;
}
export declare const getTransfers: (address: string) => Promise<INEOTransfer[]>;
export declare const getBalance: (address: string) => Promise<number>;
export declare const payNEO: (privateKey: string, from: string, to: string, amount: number) => Promise<any>;
export {};
