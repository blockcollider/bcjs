import RpcClient from './client';
import * as core from './protos/core_pb';
import * as bc from './protos/bc_pb';
export default class Wallet {
    private rpcClient;
    constructor(rpcClient: RpcClient);
    getBalance(address: string): Promise<bc.GetBalanceResponse.AsObject | Error>;
    getSpendableOutpoints(address: string): Promise<Array<core.WalletOutPoint.AsObject>>;
}
