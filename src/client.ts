/* tslint:disable:max-line-length */
/* tslint:disable:interface-name */
require('es6-promise').polyfill() /* tslint:disable-line */
require('isomorphic-fetch') /* tslint:disable-line */

import * as bc from './protos/bc_pb'
import * as core from './protos/core_pb'

type BcRpcResponse =
    core.BcBlock.AsObject |
    core.Block.AsObject |
    core.MarkedTransaction.AsObject |
    core.Transaction.AsObject |
    core.WalletData.AsObject |
    bc.GetBalanceResponse.AsObject |
    bc.GetBlake2blResponse.AsObject |
    bc.GetTradeStatusResponse.AsObject |
    bc.GetOutPointStatusResponse.AsObject |
    bc.GetBlocksResponse.AsObject |
    bc.GetMatchedOrdersResponse.AsObject |
    bc.GetRoveredBlocksResponse.AsObject |
    bc.GetSpendableCollateralResponse.AsObject |
    bc.RpcTransactionResponse.AsObject |
    bc.GetUnlockTakerTxParamsResponse.AsObject |
    bc.GetOpenOrdersResponse.AsObject |
    bc.VanityConvertResponse.AsObject

type JsonRpcParams = Array<string | number> | Buffer
type JsonRpcVersion = '2.0'
type JsonRpcReservedMethod = string
type JsonRpcId = number | string | void

enum BcRpcMethod {
    NewTx = 'newTx',
    NewFeedTx = 'newFeedTx',
    GetSpendableOutpoints  = 'getSpendableOutpoints',
    GetBalance  = 'getBalance',
    GetWallet  = 'getWallet',
    GetSpendableCollateral  = 'getSpendableCollateral',

    GetUnlockTakerTxParams = 'getUnlockTakerTxParams',

    PlaceMakerOrder  = 'placeMakerOrder',
    PlaceTakerOrder  = 'placeTakerOrder',
    PlaceTakerOrders  = 'placeTakerOrders',

    CalculateMakerFee = 'calculateMakerFee',
    CalculateTakerFee  = 'calculateTakerFee',

    GetOpenOrders = 'getOpenOrders',
    GetMatchedOrders  = 'getMatchedOrders',
    GetBlake2bl  = 'getBlake2bl',
    GetTxClaimedBy = 'getTxClaimedBy',
    GetTradeStatus  = 'getTradeStatus',
    GetOutpointStatus  = 'getOutpointStatus',
    GetBcAddressViaVanity  = 'getBcAddressViaVanity',

    GetLatestBlock = 'getLatestBlock',
    GetLatestRoveredBlocks = 'getLatestRoveredBlocks',
    GetBlockHeight = 'getBlockHeight',
    GetBlockHash = 'getBlockHash',
    GetRoveredBlockHeight = 'getRoveredBlockHeight',
    GetRoveredBlockHash = 'getRoveredBlockHash',
    GetBlocks = 'getBlocks',
    GetRoveredBlocks = 'getRoveredBlocks',
    GetTx = 'getTx',
    GetMarkedTx = 'getMarkedTx',
    SendTx = 'sendTx',
}

interface JsonRpcRequest<T> {
  jsonrpc: JsonRpcVersion
  id: JsonRpcId
  method: T
  params?: JsonRpcParams
}

interface JsonRpcResponse<T> {
  jsonrpc: JsonRpcVersion
  id: JsonRpcId
}

interface JsonRpcSuccess<T> extends JsonRpcResponse<T> {
    result: T
}

interface JsonRpcFailure<T> extends JsonRpcResponse<T> {
    error: JsonRpcError<T>
}

interface JsonRpcError<T> {
      /** Must be an integer */
      code: number
      message: string
      data?: T
}

function btoa (str: string | Buffer) {
    let buffer

    if (str instanceof Buffer) {
        buffer = str
    } else {
        buffer = Buffer.from(str.toString(), 'binary')
    }

    return buffer.toString('base64')
}

export default class RpcClient {
    private rpcUrl: URL
    private defaultHeaders: { [key: string]: string }

    constructor (nodeUrl: string, authToken?: string) {
        this.rpcUrl = new URL(nodeUrl)
        if (authToken) {
            this.defaultHeaders = { 'Content-Type': 'application/json', 'authorization': 'Basic ' + btoa(`:${authToken}`) }
        } else {
            if (this.rpcUrl.protocol === 'https:') {
                throw new Error('You have to provide an authToken with https:// scheme')
            }
            this.defaultHeaders = { 'Content-Type': 'application/json' }
        }
    }

    public async getRoveredBlockHash (request: bc.GetRoveredBlockHashRequest): Promise<core.Block.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetRoveredBlockHash, request.toArray())
        return result as core.Block.AsObject
    }

    public async getRoveredBlockHeight (request: bc.GetRoveredBlockHeightRequest): Promise<core.Block.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetRoveredBlockHeight, request.toArray())
        return result as core.Block.AsObject
    }

    public async getRoveredBlocks (request: bc.GetRoveredBlocksRequest): Promise<bc.GetRoveredBlocksResponse.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetRoveredBlocks, request.toArray())
        return result as bc.GetRoveredBlocksResponse.AsObject
    }

    public async getLatestRoveredBlock (): Promise<bc.GetRoveredBlocksResponse.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetLatestRoveredBlocks, [])
        return result as bc.GetRoveredBlocksResponse.AsObject
    }

    public async getBlockHash (request: bc.GetBlockHashRequest): Promise<core.BcBlock.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetBlockHash, request.toArray())
        return result as core.BcBlock.AsObject
    }

    public async getBlockHeight (request: bc.GetBlockHeightRequest): Promise<core.BcBlock.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetBlockHeight, request.toArray())
        return result as core.BcBlock.AsObject
    }

    public async getBlocks (request: bc.GetBlocksRequest): Promise<bc.GetBlocksResponse.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetBlocks, request.toArray())
        return result as bc.GetBlocksResponse.AsObject
    }

    public async getLatestBlock (): Promise<core.BcBlock.AsObject | JsonRpcError<BcRpcResponse>> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetLatestBlock, [])
        return result as core.BcBlock.AsObject
    }

    public async getTx (request: bc.GetTxRequest): Promise<core.Transaction.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetTx, request.toArray())
        return result as core.Transaction.AsObject
    }

    public async getMarkedTx (request: bc.GetMarkedTxRequest): Promise<core.MarkedTransaction.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetMarkedTx, request.toArray())
        return result as core.MarkedTransaction.AsObject
    }

    public async newTx (request: bc.RpcTransaction): Promise<bc.RpcTransactionResponse.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.NewTx, request.toArray())
        return result as bc.RpcTransactionResponse.AsObject
    }

    public async newFeedTx (request: bc.RpcFeedTransaction): Promise<bc.RpcTransactionResponse.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.NewFeedTx, request.toArray())
        return result as bc.RpcTransactionResponse.AsObject
    }

    public async getBalance (request: bc.GetBalanceRequest): Promise<bc.GetBalanceResponse.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetBalance, request.toArray())
        return result as bc.GetBalanceResponse.AsObject
    }

    public async getWallet (request: bc.GetBalanceRequest): Promise<core.WalletData.AsObject> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetWallet, request.toArray())
        return result as core.WalletData.AsObject
    }

    public async getSpendableOutpoints (request: bc.GetBalanceRequest): Promise<core.WalletData.AsObject> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetSpendableOutpoints, request.toArray())
        return result as core.WalletData.AsObject
    }

    public async getSpendableCollateral (request: bc.GetSpendableCollateralRequest): Promise<bc.GetSpendableCollateralResponse.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetSpendableCollateral, request.toArray())
        return result as bc.GetSpendableCollateralResponse.AsObject
    }

    public async getUnlockTakerTxParams (request: bc.GetUnlockTakerTxParamsRequest): Promise<bc.GetUnlockTakerTxParamsResponse.AsObject> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetUnlockTakerTxParams, request.toArray())
        return result as bc.GetUnlockTakerTxParamsResponse.AsObject
    }

    /**
     * Return all active open orders, which excludes expired open orders
     */
    public async getActiveOpenOrders (
        request: core.Null,
    ): Promise<bc.GetOpenOrdersResponse.AsObject | JsonRpcError<BcRpcResponse>> {
        const result: BcRpcResponse | JsonRpcError<BcRpcResponse> = await this.makeJsonRpcRequest(
            BcRpcMethod.GetOpenOrders,
            request.toArray(),
        )

        if ('code' in result) {
            return result as JsonRpcError<BcRpcResponse>
        }

        const latestBcBlock: core.BcBlock.AsObject | JsonRpcError<BcRpcResponse> = await this.getLatestBlock()
        if ('code' in latestBcBlock) {
            return result as bc.GetOpenOrdersResponse.AsObject
        }
        const latestBcBlockHeight = latestBcBlock.height

        const openOrderRes: bc.GetOpenOrdersResponse.AsObject = result as bc.GetOpenOrdersResponse.AsObject

        const ordersList: bc.MakerOrderInfo.AsObject[] = openOrderRes.ordersList
        const activeOpenOrders: bc.MakerOrderInfo.AsObject[] = []
        for (const order of ordersList) {
            if (order.tradeHeight + order.deposit > latestBcBlockHeight) {
                activeOpenOrders.push(order)
            }
        }

        openOrderRes.ordersList = activeOpenOrders

        return openOrderRes
    }

    /**
     * Return all open orders, which includes expired open orders
     */
    public async getOpenOrders (request: core.Null): Promise<bc.GetOpenOrdersResponse.AsObject> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetOpenOrders, request.toArray())
        return result as bc.GetOpenOrdersResponse.AsObject
    }

    public async sendTx (request: core.Transaction): Promise<bc.RpcTransactionResponse.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.SendTx, Buffer.from(request.serializeBinary()))
        return result as bc.RpcTransactionResponse.AsObject
    }

    public async getMatchedOrders (request: bc.GetBalanceRequest): Promise<bc.GetMatchedOrdersResponse.AsObject> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetMatchedOrders, Buffer.from(request.serializeBinary()))
        return result as bc.GetMatchedOrdersResponse.AsObject
    }

    public async getBlake2Bl (request: bc.GetBlake2blRequest): Promise<bc.GetBlake2blResponse.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetBlake2bl, request.toArray())
        return result as bc.GetBlake2blResponse.AsObject
    }

    public async getTxClaimedBy (request: bc.GetOutPointRequest): Promise<core.Transaction.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetTxClaimedBy, request.toArray())
        return result as core.Transaction.AsObject
    }

    public async getTradeStatus (request: bc.GetOutPointRequest): Promise<bc.GetTradeStatusResponse.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetTradeStatus, request.toArray())
        return result as bc.GetTradeStatusResponse.AsObject
    }

    public async getOutpointStatus (request: bc.GetOutPointRequest): Promise<bc.GetOutPointStatusResponse.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetOutpointStatus, request.toArray())
        return result as bc.GetOutPointStatusResponse.AsObject
    }

    public async getBcAddressViaVanity (request: bc.VanityConvertRequest): Promise<bc.VanityConvertResponse.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetBcAddressViaVanity, request.toArray())
        return result as bc.VanityConvertResponse.AsObject
    }

    private async makeJsonRpcRequest (method: BcRpcMethod, rpcParams: JsonRpcParams|Buffer): Promise<BcRpcResponse|JsonRpcError<BcRpcResponse>> {
        const id = Math.abs(Math.random() * 1e6 | 0) /* tslint:disable-line */ // this bitwise operation is intentional
        const rpcBody: JsonRpcRequest<BcRpcMethod> = {
            id,
            jsonrpc: '2.0',
            method,
            params: rpcParams,
        }

        let res
        try {
            res = await fetch(`${this.rpcUrl.origin}/rpc`, {
                body: JSON.stringify(rpcBody),
                headers: this.defaultHeaders,
                method: 'post',
            })
        } catch (e) {
            return {
                code: -1,
                message: e.toString(),
            }
        }

        if (res.status !== 200) {
            return {
                code: res.status,
                message: res.statusText,
            }
        }

        const jsonResult: JsonRpcResponse<BcRpcResponse> = await res.json()

        if ('code' in jsonResult) {
            return jsonResult
        }

        if (jsonResult.id !== id) {
            return {
                code: -32603,
                message: `Ids didn't match - sent ${id}, got ${jsonResult.id}`,
            }
        }

        return (jsonResult as JsonRpcSuccess<BcRpcResponse>).result
    }
}
