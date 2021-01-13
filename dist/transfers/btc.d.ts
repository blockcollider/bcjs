export declare const providers: {
    fees: {
        mainnet: {
            earn: (feeName: any) => Promise<any>;
        };
    };
    pushtx: {
        mainnet: {
            blockchain: (hexTrans: any) => Promise<Response>;
            blockcypher: (hexTrans: any) => Promise<Response>;
            blockexplorer: (hexTrans: any) => Promise<Response>;
        };
    };
    utxo: {
        mainnet: {
            blockchain: (addr: any) => Promise<any>;
            blockexplorer: (addr: any) => Promise<any>;
        };
    };
};
export declare const transferBTC: (privKeyWIF: any, from: any, to: any, amount: any) => Promise<any>;
