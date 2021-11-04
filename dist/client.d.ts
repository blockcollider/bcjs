import * as bc from '@overline/proto/proto/bc_pb';
import * as core from '@overline/proto/proto/core_pb';
declare type BcRpcResponse = core.BcBlock.AsObject | core.Block.AsObject | core.MarkedTransaction.AsObject | core.Transaction.AsObject | core.WalletData.AsObject | bc.GetBalanceResponse.AsObject | bc.GetBlake2blResponse.AsObject | bc.GetTradeStatusResponse.AsObject | bc.GetOutPointStatusResponse.AsObject | bc.GetBlocksResponse.AsObject | bc.GetMatchedOrdersResponse.AsObject | bc.GetRoveredBlocksResponse.AsObject | bc.GetSpendableCollateralResponse.AsObject | bc.RpcTransactionResponse.AsObject | bc.GetUnlockTakerTxParamsResponse.AsObject | bc.GetOpenOrdersResponse.AsObject | bc.VanityConvertResponse.AsObject | bc.GetByteFeeResponse.AsObject | bc.GetUtxoLengthResponse.AsObject;
interface JsonRpcError<T> {
    /** Must be an integer */
    code: number;
    message: string;
    data?: T;
}
export default class RpcClient {
    private rpcUrl;
    private defaultHeaders;
    constructor(nodeUrl: string, authToken?: string);
    getRoveredBlockHash(request: bc.GetRoveredBlockHashRequest): Promise<core.Block.AsObject | Error>;
    getRoveredBlockHeight(request: bc.GetRoveredBlockHeightRequest): Promise<core.Block.AsObject | Error>;
    getRoveredBlocks(request: bc.GetRoveredBlocksRequest): Promise<bc.GetRoveredBlocksResponse.AsObject | Error>;
    getLatestRoveredBlock(): Promise<bc.GetRoveredBlocksResponse.AsObject | Error>;
    getBlockHash(request: bc.GetBlockHashRequest): Promise<core.BcBlock.AsObject | Error>;
    getBlockHeight(request: bc.GetBlockHeightRequest): Promise<core.BcBlock.AsObject | Error>;
    getBlocks(request: bc.GetBlocksRequest): Promise<bc.GetBlocksResponse.AsObject | Error>;
    getLatestBlock(): Promise<core.BcBlock.AsObject | JsonRpcError<BcRpcResponse>>;
    getTx(request: bc.GetTxRequest): Promise<core.Transaction.AsObject | Error>;
    getMarkedTx(request: bc.GetMarkedTxRequest): Promise<core.MarkedTransaction.AsObject | Error>;
    newTx(request: bc.RpcTransaction): Promise<bc.RpcTransactionResponse.AsObject | Error>;
    newFeedTx(request: bc.RpcFeedTransactionRequest): Promise<bc.RpcTransactionResponse.AsObject | Error>;
    getBalance(request: bc.GetBalanceRequest): Promise<bc.GetBalanceResponse.AsObject | Error>;
    getWallet(request: bc.GetBalanceRequest): Promise<core.WalletData.AsObject>;
    getSpendableOutpoints(request: bc.GetBalanceRequest): Promise<core.WalletData.AsObject>;
    getSpendableCollateral(request: bc.GetSpendableCollateralRequest): Promise<bc.GetSpendableCollateralResponse.AsObject | Error>;
    getUnlockTakerTxParams(request: bc.GetUnlockTakerTxParamsRequest): Promise<bc.GetUnlockTakerTxParamsResponse.AsObject>;
    getUnlockableOrders(bcAddress: string): Promise<bc.MakerOrderInfo.AsObject[]>;
    getUnmatchedOrders(request: bc.GetBalanceRequest): Promise<bc.GetOpenOrdersResponse.AsObject>;
    /**
     * Return all active open orders, which excludes expired open orders
     */
    getActiveOpenOrders(request: bc.GetSpendableCollateralRequest): Promise<bc.GetOpenOrdersResponse.AsObject | JsonRpcError<BcRpcResponse>>;
    getByteFeeMultiplier(request: core.Null): Promise<bc.GetByteFeeResponse.AsObject>;
    /**
     * Return all open orders, which includes expired open orders
     */
    getOpenOrders(request: bc.GetSpendableCollateralRequest): Promise<bc.GetOpenOrdersResponse.AsObject>;
    sendTx(request: core.Transaction): Promise<bc.RpcTransactionResponse.AsObject | Error>;
    getMatchedOrders(request: bc.GetSpendableCollateralRequest): Promise<bc.GetMatchedOrdersResponse.AsObject>;
    getBlake2Bl(request: bc.GetBlake2blRequest): Promise<bc.GetBlake2blResponse.AsObject | Error>;
    getTxClaimedBy(request: bc.GetOutPointRequest): Promise<core.Transaction.AsObject | Error>;
    getTradeStatus(request: bc.GetOutPointRequest): Promise<bc.GetTradeStatusResponse.AsObject | Error>;
    getOutpointStatus(request: bc.GetOutPointRequest): Promise<bc.GetOutPointStatusResponse.AsObject | Error>;
    getBcAddressViaVanity(request: bc.VanityConvertRequest): Promise<bc.VanityConvertResponse.AsObject | Error>;
    private makeJsonRpcRequest;
}
export {};
