import RpcClient from './client'

import * as core from './protos/core_pb';
import * as bc from './protos/bc_pb';

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
    bc.FeeResponse.AsObject |
    bc.GetMatchedOrdersResponse.AsObject |
    bc.GetBlake2blResponse.AsObject |
    bc.VanityConvertResponse.AsObject

export default class Wallet {
    public address: string
    private rpcClient: RpcClient

    constructor(address: string, authToken?: string) {
        this.address = address.toLowerCase()
        // TODO: PING, need a proper way to pass in the url
        this.rpcClient = new RpcClient('todo', authToken)
    }

    public async getBalance(): Promise<bc.GetBalanceResponse.AsObject|Error> {
        const req = new bc.GetBalanceRequest()
        req.setAddress(this.address)
        return await this.rpcClient.getBalance(req)
    }

    public async getSpendableOutpoints(): Promise<Array<core.WalletOutPoint.AsObject>> {
        const req = new bc.GetBalanceRequest()
        req.setAddress(this.address)

        let a = await this.rpcClient.getWallet(req)
        return a.spendableOutpointsList
    }

}
