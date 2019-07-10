import fetch from 'node-fetch';

import {
    PlaceMakerOrderRequest,
    GetBalanceRequest,
    GetBalanceResponse,
    GetBlake2blRequest,
    GetBlake2blResponse,
    RpcTransactionResponse
} from './protos/bc_pb';

type BcRpcResponse =
    GetBalanceResponse.AsObject |
    RpcTransactionResponse.AsObject |
    GetBlake2blResponse.AsObject

type JsonRpcParams = Array<string | number>
type JsonRpcVersion = "2.0";
type JsonRpcReservedMethod = string;
type JsonRpcId = number | string | void;

enum BcRpcMethod {
    GetLatestBlocks = "getLatestBlock",
    Help  = "help",
    Stats  = "stats",
    NewTx  = "newTx",

    GetBalance  = "getBalance",
    GetSpendableCollateral  = "getSpendableCollateral",

    UnlockCollateral  = "unlockCollateral",

    PlaceMakerOrder  = "placeMakerOrder",
    PlaceTakerOrder  = "placeTakerOrder",
    PlaceTakerOrders  = "placeTakerOrders",

    CalculateMakerFee = "calculateMakerFee",
    CalculateTakerFee  = "calculateTakerFee",

    GetOpenOrders = "getOpenOrders",
    GetMatchedOrders  = "getMatchedOrders",
    GetBlake2bl  = "getBlake2bl",
    GetBcAddressViaVanity  = "getBcAddressViaVanity",
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

    private async makeJsonRpcRequest(method: BcRpcMethod, rpcParams: JsonRpcParams): Promise<BcRpcResponse|JsonRpcError<BcRpcResponse>> {
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

    public async getBlake2Bl(request: GetBlake2blRequest): Promise<GetBlake2blResponse.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetBlake2bl, request.toArray())
        return result as GetBlake2blResponse.AsObject
    }

    public async createMakerOrder(request: PlaceMakerOrderRequest): Promise<RpcTransactionResponse.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.PlaceMakerOrder, request.toArray())
        return result as RpcTransactionResponse.AsObject
    }

    public async getBalance(request: GetBalanceRequest): Promise<GetBalanceResponse.AsObject|Error> {
        const result = await this.makeJsonRpcRequest(BcRpcMethod.GetBalance, request.toArray())
        return result as GetBalanceResponse.AsObject
    }
}

