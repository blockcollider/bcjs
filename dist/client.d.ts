import * as bc from './protos/bc_pb';
import * as core from './protos/core_pb';
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
    getLatestBlock(): Promise<core.BcBlock.AsObject | Error>;
    getTx(request: bc.GetTxRequest): Promise<core.Transaction.AsObject | Error>;
    getMarkedTx(request: bc.GetMarkedTxRequest): Promise<core.MarkedTransaction.AsObject | Error>;
    newTx(request: bc.RpcTransaction): Promise<bc.RpcTransactionResponse.AsObject | Error>;
    getBalance(request: bc.GetBalanceRequest): Promise<bc.GetBalanceResponse.AsObject | Error>;
    getWallet(request: bc.GetBalanceRequest): Promise<core.WalletData.AsObject>;
    getSpendableOutpoints(request: bc.GetBalanceRequest): Promise<core.WalletData.AsObject>;
    getSpendableCollateral(request: bc.GetSpendableCollateralRequest): Promise<bc.GetSpendableCollateralResponse.AsObject | Error>;
    getUnlockTakerTxParams(request: bc.GetUnlockTakerTxParamsRequest): Promise<bc.GetUnlockTakerTxParamsResponse.AsObject>;
    getOpenOrders(): Promise<bc.GetOpenOrdersResponse.AsObject>;
    sendTx(request: core.Transaction): Promise<bc.RpcTransactionResponse.AsObject | Error>;
    getMatchedOrders(request: bc.GetMatchedOrdersRequest): Promise<bc.GetMatchedOrdersResponse.AsObject>;
    getBlake2Bl(request: bc.GetBlake2blRequest): Promise<bc.GetBlake2blResponse.AsObject | Error>;
    getBcAddressViaVanity(request: bc.VanityConvertRequest): Promise<bc.VanityConvertResponse.AsObject | Error>;
    private makeJsonRpcRequest;
}
