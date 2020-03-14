'use strict'
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import BN from 'bn.js'
import {createMultiNRGTransferTransaction} from '../dist/transaction'
import RpcClient from '../src/client'
import * as bcProtobuf from '../src/protos/bc_pb'
import * as coreProtobuf from '../src/protos/core_pb'
import Wallet from '../src/wallet'

import {
  COIN_FRACS,
  Currency,
  CurrencyInfo,
  humanToInternalAsBN,
  internalBNToHuman,
  internalToBN,
} from '../src/utils/coin'

import {
  convertProtoBufSerializedBytesToBuffer,
} from '../src/utils/protoUtil'

let address = process.env.BC_RPC_ADDRESS || 'http://18.217.62.36:3001'
address = process.env.BC_RPC_ADDRESS || 'http://localhost:3001'
address = 'http://3.134.115.138:3001'
// address = 'http://18.217.62.36:3001'

const scookie = process.env.BC_RPC_SCOOKIE || 'trololo'
const client = new RpcClient(address, scookie)
const wallet = new Wallet(client)
const bcAddress = process.argv[2].toLowerCase()
const privateKeyHex = process.argv[3]
const amount = 0.01
const split = 1
const fee = false
const feeExtra = fee ? 1.5 : 1

function timeout (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

let i = 0
async function sendMany (spendableOutpointsList) {
  // amount = Math.random()
  const toAddress: string[] = Array(split).fill(bcAddress.toLowerCase())
  const transferAmount: string[] = Array(split).fill(amount.toString())
  const tx: coreProtobuf.Transaction = createMultiNRGTransferTransaction(spendableOutpointsList, bcAddress, privateKeyHex, toAddress, transferAmount, '0', fee)
  const res = client.sendTx(tx)
  i++
  console.log(`Tx Hash: ${tx.getHash()}, num: ${i}`)
}

async function keepSending () {
  let spendableOutpointsList = await wallet.getSpendableOutpoints(bcAddress)
  while (true) {
    const newOutPoints = await getOutPoints(spendableOutpointsList, amount * split * feeExtra)
    spendableOutpointsList = newOutPoints.spendableOutpointsList
    await sendMany(newOutPoints.newList)
    await timeout(90)
  }
}

keepSending()

async function getOutPoints (spendableOutpointsList, amount) {
  // amount = 0.001
  const totalAmountBN = new BN((amount * Math.pow(10, 18)).toString())
  let sumBN = new BN('0')

  const spendableOutpoints: any[] = []

  let i = 0
  for (const walletOutPoint of spendableOutpointsList) {
    const outPointObj: coreProtobuf.OutPoint.AsObject | undefined = walletOutPoint.outpoint
    if (!outPointObj) {
      continue
    }
    const currentBN = internalToBN(convertProtoBufSerializedBytesToBuffer(outPointObj.value as string), COIN_FRACS.BOSON)

    sumBN = sumBN.add(currentBN)
    spendableOutpoints.push(walletOutPoint)
    i++
    if (sumBN.gte(totalAmountBN) ) {
      break
    }
  }
  if (!sumBN.gte(totalAmountBN)) {
    console.log('waiting')
    await timeout(1000)
    spendableOutpointsList = await wallet.getSpendableOutpoints(bcAddress)
    return await getOutPoints(spendableOutpointsList, amount)
  } else {
    return {spendableOutpointsList: spendableOutpointsList.slice(i), newList: spendableOutpoints}
  }
}
