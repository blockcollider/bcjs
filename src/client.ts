require('es6-promise').polyfill();
require('isomorphic-fetch');

import * as core from './protos/core_pb';
import * as bc from './protos/bc_pb';

type BcRpcResponse =
    core.BcBlock.AsObject |
    core.Block.AsObject |
    core.MarkedTransaction.AsObject |
    core.Transaction.AsObject |
    core.WalletData.AsObject |
    bc.FeeResponse.AsObject |
    bc.GetBalanceResponse.AsObject |
    bc.GetBlake2blResponse.AsObject |
    bc.GetBlocksResponse.AsObject |
    bc.GetMatchedOrdersResponse.AsObject |
    bc.GetRoveredBlocksResponse.AsObject |
    bc.GetSpendableCollateralResponse.AsObject |
    bc.RpcTransactionResponse.AsObject |
    bc.GetUnlockTakerTxParamsResponse.AsObject |
    bc.GetOpenOrdersResponse.AsObject |
    bc.VanityConvertResponse.AsObject

type JsonRpcParams = Array<string | number> | Buffer
type JsonRpcVersion = "2.0";
type JsonRpcReservedMethod = string;
type JsonRpcId = number | string | void;

enum BcRpcMethod {
    // Help  = "help",
    // Stats  = "stats",
    NewTx  = "newTx",

    GetBalance  = "getBalance",
    GetWallet  = "getWallet",
    GetSpendableCollateral  = "getSpendableCollateral",

    UnlockCollateral  = "unlockCollateral",
    GetUnlockTakerTxParams = "getUnlockTakerTxParams",

    PlaceMakerOrder  = "placeMakerOrder",
    PlaceTakerOrder  = "placeTakerOrder",
    PlaceTakerOrders  = "placeTakerOrders",

    CalculateMakerFee = "calculateMakerFee",
    CalculateTakerFee  = "calculateTakerFee",

    GetOpenOrders = "getOpenOrders",
    GetMatchedOrders  = "getMatchedOrders",
    GetBlake2bl  = "getBlake2bl",
    GetBcAddressViaVanity  = "getBcAddressViaVanity",

    GetLatestBlock = "getLatestBlock",
    GetLatestRoveredBlocks = "getLatestRoveredBlocks",
    GetBlockHeight = "getBlockHeight",
    GetBlockHash = "getBlockHash",
    GetRoveredBlockHeight = "getRoveredBlockHeight",
    GetRoveredBlockHash = "getRoveredBlockHash",
    GetBlocks = "getBlocks",
    GetRoveredBlocks = "getRoveredBlocks",
    GetTx = "getTx",
    GetMarkedTx = "getMarkedTx",
    SendTx = 'sendTx'

}

interface JsonRpcRequest<T> {
  jsonrpc: JsonRpcVersion;
  id: JsonRpcId;
  method: T;
  params?: JsonRpcParams;
}

interface JsonRpcResponse<T> {
  jsonrpc: JsonRpcVersion;
  id: JsonRpcId;
}

interface JsonRpcSuccess<T> extends JsonRpcResponse<T> {
    result: T;
}

interface JsonRpcFailure<T> extends JsonRpcResponse<T> {
    error: JsonRpcError<T>;
}

interface JsonRpcError<T> {
      /** Must be an integer */
      code: number;
      message: string;
      data?: T;
}

function btoa(str: string | Buffer) {
    var buffer;

    if (str instanceof Buffer) {
        buffer = str;
    } else {
        buffer = Buffer.from(str.toString(), 'binary');
    }

    return buffer.toString('base64');
}

export default class RpcClient {
    private rpcUrl: URL
    private defaultHeaders: { [key: string]: string }

    constructor(nodeUrl: string, authToken?: string) {
        this.rpcUrl = new URL(nodeUrl);
        if (authToken) {
            this.defaultHeaders = { 'Content-Type': 'application/json', authorization: 'Basic ' + btoa(`:${authToken}`) }
        } else {
            if (this.rpcUrl.protocol === 'https:') {
                throw new Error('You have to provide an authToken with https:// scheme')
            }
            this.defaultHeaders = { 'Content-Type': 'application/json' }
        }

        if (this.rpcUrl.port === '') {
            this.rpcUrl = new URL(`${this.rpcUrl.origin}:3000`)
        }
    }

    private async makeJsonRpcRequest(method: BcRpcMethod, rpcParams: JsonRpcParams|Buffer): Promise<BcRpcResponse|JsonRpcError<BcRpcResponse>> {
        const id = Math.abs(Math.random() * 1e6 | 0)
        const rpcBody: JsonRpcRequest<BcRpcMethod> = {
            id,
            jsonrpc: '2.0',
            method,
            params: rpcParams
        }

        let res
        try {
            res = await fetch(`${this.rpcUrl.origin}/rpc`, {
                method: 'post',
                body: JSON.stringify(rpcBody),
                headers: this.defaultHeaders
            })
        } catch (e) {
            return {
                code: -1,
                message: e.toString()
            }
        }

        if (res.status !== 200) {
            return {
                code: res.status,
                message: res.statusText
            }
        }

        let jsonResult: JsonRpcResponse<BcRpcResponse> = await res.json()

        if ("code" in jsonResult) {
            return jsonResult
        }

        if (jsonResult.id !== id) {
            return {
                message: `Ids didn't match - sent ${id}, got ${jsonResult.id}`,
                code: -32603,
            }
        }

        return (jsonResult as JsonRpcSuccess<BcRpcResponse>).result
    }

    public async getRoveredBlockHash(request: bc.GetRoveredBlockHashRequest): Promise<core.Block.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetRoveredBlockHash, request.toArray())
        return result as core.Block.AsObject
    }

    public async getRoveredBlockHeight(request: bc.GetRoveredBlockHeightRequest): Promise<core.Block.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetRoveredBlockHeight, request.toArray())
        return result as core.Block.AsObject
    }

    public async getRoveredBlocks(request: bc.GetRoveredBlocksRequest): Promise<bc.GetRoveredBlocksResponse.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetRoveredBlocks, request.toArray())
        return result as bc.GetRoveredBlocksResponse.AsObject
    }

    public async getLatestRoveredBlock(): Promise<bc.GetRoveredBlocksResponse.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetLatestRoveredBlocks, [])
        return result as bc.GetRoveredBlocksResponse.AsObject
    }

    public async getBlockHash(request: bc.GetBlockHashRequest): Promise<core.BcBlock.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetBlockHash, request.toArray())
        return result as core.BcBlock.AsObject
    }

    public async getBlockHeight(request: bc.GetBlockHeightRequest): Promise<core.BcBlock.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetBlockHeight, request.toArray())
        return result as core.BcBlock.AsObject
    }

    public async getBlocks(request: bc.GetBlocksRequest): Promise<bc.GetBlocksResponse.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetBlocks, request.toArray())
        return result as bc.GetBlocksResponse.AsObject
    }

    public async getLatestBlock(): Promise<core.BcBlock.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetLatestBlock, [])
        return result as core.BcBlock.AsObject
    }

    public async getTx(request: bc.GetTxRequest): Promise<core.Transaction.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetTx, request.toArray())
        return result as core.Transaction.AsObject
    }

    public async getMarkedTx(request: bc.GetMarkedTxRequest): Promise<core.MarkedTransaction.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetMarkedTx, request.toArray())
        return result as core.MarkedTransaction.AsObject
    }

    public async newTx(request: bc.RpcTransaction): Promise<bc.RpcTransactionResponse.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.NewTx, request.toArray())
        return result as bc.RpcTransactionResponse.AsObject
    }

    public async getBalance(request: bc.GetBalanceRequest): Promise<bc.GetBalanceResponse.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetBalance, request.toArray())
        return result as bc.GetBalanceResponse.AsObject
    }

    public async getWallet(request: bc.GetBalanceRequest): Promise<core.WalletData.AsObject> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetWallet, request.toArray())
        return result as core.WalletData.AsObject
    }

    public async getSpendableCollateral(request: bc.GetSpendableCollateralRequest): Promise<bc.GetSpendableCollateralResponse.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetSpendableCollateral, request.toArray())
        return result as bc.GetSpendableCollateralResponse.AsObject
    }

    public async unlockCollateral(request: bc.UnlockCollateralRequest): Promise<bc.RpcTransactionResponse.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.UnlockCollateral, request.toArray())
        return result as bc.RpcTransactionResponse.AsObject
    }

    public async getUnlockTakerTxParams(request: bc.GetUnlockTakerTxParamsRequest): Promise<bc.GetUnlockTakerTxParamsResponse.AsObject> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetUnlockTakerTxParams, request.toArray())
        return result as bc.GetUnlockTakerTxParamsResponse.AsObject
    }

    public async createMakerOrder(request: bc.PlaceMakerOrderRequest): Promise<bc.RpcTransactionResponse.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.PlaceMakerOrder, request.toArray())
        return result as bc.RpcTransactionResponse.AsObject
    }

    public async createTakeOrder(request: bc.PlaceTakerOrderRequest): Promise<bc.RpcTransactionResponse.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.PlaceTakerOrder, request.toArray())
        return result as bc.RpcTransactionResponse.AsObject
    }

    public async createTakerOrders(request: bc.PlaceTakerOrdersRequest): Promise<bc.RpcTransactionResponse.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.PlaceTakerOrders, request.toArray())
        return result as bc.RpcTransactionResponse.AsObject
    }

    public async calculateMakerFee(request: bc.CalculateMakerFeeRequest): Promise<bc.FeeResponse.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.CalculateMakerFee, request.toArray())
        return result as bc.FeeResponse.AsObject
    }

    public async calculateTakerFee(request: bc.CalculateTakerFeeRequest): Promise<bc.FeeResponse.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.CalculateTakerFee, request.toArray())
        return result as bc.FeeResponse.AsObject
    }

    public async getOpenOrders(): Promise<bc.GetOpenOrdersResponse.AsObject> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetOpenOrders, [])
        return result as bc.GetOpenOrdersResponse.AsObject
    }

    public async sendTx(request: core.Transaction): Promise<bc.RpcTransactionResponse.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.SendTx, Buffer.from(request.serializeBinary()))
        return result as bc.RpcTransactionResponse.AsObject
    }

    public async getMatchedOrders(request: bc.GetMatchedOrdersRequest): Promise<bc.GetMatchedOrdersResponse.AsObject> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetMatchedOrders, Buffer.from(request.serializeBinary()))
        return result as bc.GetMatchedOrdersResponse.AsObject
    }

    public async getBlake2Bl(request: bc.GetBlake2blRequest): Promise<bc.GetBlake2blResponse.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetBlake2bl, request.toArray())
        return result as bc.GetBlake2blResponse.AsObject
    }

    public async getBcAddressViaVanity(request: bc.VanityConvertRequest): Promise<bc.VanityConvertResponse.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetBcAddressViaVanity, request.toArray())
        return result as bc.VanityConvertResponse.AsObject
    }
}
