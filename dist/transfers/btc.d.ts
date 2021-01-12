export declare const providers: {
    fees: {
        mainnet: {
            earn: (feeName: any) => Promise<any>;
        };
    };
    utxo: {
        mainnet: {
            blockexplorer: (addr: any) => Promise<any>;
            blockchain: (addr: any) => Promise<any>;
        };
    };
    pushtx: {
        mainnet: {
            blockchain: (hexTrans: any) => any;
            blockcypher: (hexTrans: any) => any;
            blockexplorer: (hexTrans: any) => any;
        };
    };
};
export declare const transferBTC: (privKeyWIF: any, from: any, to: any, amount: any) => Promise<any>;
