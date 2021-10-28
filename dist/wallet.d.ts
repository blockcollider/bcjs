import RpcClient from './client';
import * as bc from '@overline/proto/proto/bc_pb';
import * as core from '@overline/proto/proto/core_pb';
export default class Wallet {
    private rpcClient;
    constructor(rpcClient: RpcClient);
    getBalance(address: string): Promise<bc.GetBalanceResponse.AsObject | Error>;
    getSpendableOutpoints(address: string, from: number, to: number): Promise<core.WalletOutPoint.AsObject[]>;
}
