import RpcClient from './client'

import * as bc from './protos/bc_pb'
import * as core from './protos/core_pb'

type BcRpcResponse =
    core.Block.AsObject |
    core.BcBlock.AsObject |
    bc.GetRoveredBlocksResponse.AsObject |
    bc.GetBlocksResponse.AsObject |
    core.Transaction.AsObject |
    core.MarkedTransaction.AsObject |
    bc.RpcTransactionResponse.AsObject |
    bc.GetBalanceResponse.AsObject |
    bc.GetSpendableCollateralResponse.AsObject |
    bc.GetMatchedOrdersResponse.AsObject |
    bc.GetBlake2blResponse.AsObject |
    bc.VanityConvertResponse.AsObject

export default class Wallet {
    private rpcClient: RpcClient

    constructor (rpcClient: RpcClient) {
        this.rpcClient = rpcClient
    }

    public async getBalance (address: string): Promise<bc.GetBalanceResponse.AsObject|Error> {
        const req = new bc.GetBalanceRequest()
        req.setAddress(address)
        return await this.rpcClient.getBalance(req)
    }

    public async getSpendableOutpoints (
      address: string,
      from: number,
      to: number,
    ): Promise<core.WalletOutPoint.AsObject[]> {
        const req = new bc.GetSpendableCollateralRequest()
        req.setAddress(address)
        req.setFrom(from)
        req.setTo(to)
        const response = await this.rpcClient.getSpendableOutpoints(req)
        return response.spendableOutpointsList
    }

}
