process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import * as core from '../src/protos/core_pb'

import RpcClient from '../src/client';
import Wallet from '../src/wallet';
import {
    GetBalanceRequest
} from '../src/protos/bc_pb';

import {
    createNRGTransferTransaction
} from '../src/tx/transaction';


const address = process.env.BC_RPC_ADDRESS || 'https://localhost:3000'
const scookie = process.env.BC_RPC_SCOOKIE || 'trololo'
const client = new RpcClient(address, scookie);

const wallet = new Wallet(client)

const bcAddress = '0xfdca838dcfcae6a7923700ea3fb90cb577040fd2'
wallet.getBalance(bcAddress).then(balance => {
    console.log(balance);
})

// Tested
async function testTransfer() {
  const spendableOutpointsList = await wallet.getSpendableOutpoints(bcAddress)
  const fromAddress = bcAddress
  const privateKeyHex = '9a603f04c501d1ac830ef1e2b526618fd8855160afa60a96d8e9484b332f9f33'
  const toAddress = '0xf1d1b778a4f76d27480de333c522abe97825ac16'
  const transferAmount = '10'
  const txFeeNRG = '1'
  const tx = createNRGTransferTransaction(
    spendableOutpointsList,
    fromAddress,
    privateKeyHex,
    toAddress,
    transferAmount,
    txFeeNRG
  )
  const res = await client.sendTx(tx)
  console.log(res)
  return true
}
testTransfer().then(() => {})

