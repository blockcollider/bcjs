interface IETHTransfer {
    from: string;
    to: string;
    value: number;
    timestamp: number;
    height: number;
    txHash: string;
}
export declare const getETHTransfers: (addr: string) => Promise<IETHTransfer[]>;
export declare const getETHBalance: (addr: string) => Promise<string>;
export declare const getETHFee: () => Promise<void>;
export declare const transferETH: (privateKey: any, from: any, to: any, amount: any) => Promise<unknown>;
export {};
