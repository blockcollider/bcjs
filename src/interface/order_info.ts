interface MakerOrderInfo {
    tradeHeight: number;
    depositHeight: number;
    settleHeight: number;
    paysChainId: string;
    wantsChainId: string;
    wantsAddress: string;
    wantsUnit: string;
    paysUnit: string;
    doubleHashedBcAddress: string;
    collateralizedNrg: string;
    nrgUnit: string;
    txHash: string;
    txOutputIndex: number;
    isSettled: boolean;
}

interface TakerOrderInfo {
    sends_address: string;
    wants_address: string;
    double_hashed_bc_address: string;
    is_settled: boolean;
    tx_hash: string;
    tx_output_index: number;
    total_collateral: string;
}