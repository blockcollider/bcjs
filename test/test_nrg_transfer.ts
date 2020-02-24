process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
import { inspect } from 'util'
import * as core from '../src/protos/core_pb'

import RpcClient from '../src/client'
import Wallet from '../src/wallet'

import {
    createNRGTransferTransaction,
} from '../src/transaction'

if (process.argv.length < 6) {
  process.stderr.write('Usage: test_nrg_transfer.ts fromAddress fromAddressPrivateKeyHex toAddress amount [txFee]\n')
  process.exit(1)
}

const address = process.env.BC_RPC_ADDRESS || 'https://localhost:3001'
const scookie = process.env.BC_RPC_SCOOKIE || 'trololo'
const client = new RpcClient(address, scookie)

const wallet = new Wallet(client)
const out = (msg: any) => {
  process.stdout.write(`${inspect(msg)}\n`)
}

const [fromAddress, privateKeyHex, toAddress, transferAmount, txFeeArg] = process.argv.slice(2)

wallet.getBalance(fromAddress).then(balance => {
    out(balance)
})

// Tested
async function testTransfer () {
  const spendableOutpointsList = await wallet.getSpendableOutpoints(fromAddress)
  out({spendableOutpointsList})
  const txFeeNRG = txFeeArg ? txFeeArg : '1'
  const tx = createNRGTransferTransaction(
    spendableOutpointsList,
    fromAddress,
    privateKeyHex,
    toAddress,
    transferAmount,
    txFeeNRG,
    true,
  )
  const res = await client.sendTx(tx)
  return res
}
testTransfer().then(res => {
  out(res)
})
