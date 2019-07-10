import RpcClient from '../src/client';
import {
    GetBalanceRequest
} from '../src/protos/bc_pb';

const address = process.env.BC_RPC_ADDRESS || 'https://localhost:3000'
const scookie = process.env.BC_RPC_SCOOKIE

const client = new RpcClient(address, scookie);
const req = new GetBalanceRequest();
req.setAddress('<your address>');
client.getBalance(req).then(balance => {
    console.log(balance);
})
