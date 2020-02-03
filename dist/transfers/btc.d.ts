interface IBtcTransfer {
    height: number;
    from: string;
    to: string;
    timestamp: number;
    value: number;
    txHash: string;
}
export declare function getTransfers(btcAddress: string): IBtcTransfer;
export declare const transferBTC: (privKeyWIF: any, from: any, to: any, amount: any) => Promise<string | null>;
export {};
