'use strict'
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import {createMultiNRGTransferTransaction} from '../dist/transaction'
import RpcClient from '../src/client'
import * as bcProtobuf from '../src/protos/bc_pb'
import * as coreProtobuf from '../src/protos/core_pb'
import Wallet from '../src/wallet'
import BN from 'bn.js'

import {
  humanToInternalAsBN,
  COIN_FRACS,
  internalToBN,
  internalBNToHuman,
  Currency,
  CurrencyInfo
} from '../src/utils/coin'

import {
  convertProtoBufSerializedBytesToBuffer
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
let amount = 0.001

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
let i = 0;
async function sendMany(spendableOutpointsList){
  // amount = Math.random()
  let toAddress : Array<string> = Array(1).fill(bcAddress.toLowerCase())
  let transferAmount : Array<string> = Array(1).fill(amount.toString())
  let tx: coreProtobuf.Transaction = createMultiNRGTransferTransaction(spendableOutpointsList,bcAddress,privateKeyHex,toAddress,transferAmount,'0',false)
  const res = await client.sendTx(tx)
  i++;
  console.log(`Tx Hash: ${tx.getHash()}, num: ${i}`)
}

async function keepSending(){
  let spendableOutpointsList = await wallet.getSpendableOutpoints(bcAddress)
  while(true){
    let newOutPoints = await getOutPoints(spendableOutpointsList,amount)
    spendableOutpointsList = newOutPoints.spendableOutpointsList
    await sendMany(newOutPoints.newList)
  }
}

keepSending()


async function getOutPoints(spendableOutpointsList,amount) {
  // amount = amount < 0.01 ? 0.01 : amount
  let totalAmountBN = new BN((amount*Math.pow(10,18)).toString())
  let sumBN = new BN('0')

  let spendableOutpoints: Array<any> = []

  let i = 0;
  for (let walletOutPoint of spendableOutpointsList) {
    const outPointObj: coreProtobuf.OutPoint.AsObject | undefined = walletOutPoint.outpoint
    if (!outPointObj) {
      continue
    }
    const currentBN = internalToBN(convertProtoBufSerializedBytesToBuffer(outPointObj.value as string), COIN_FRACS.BOSON)

    sumBN = sumBN.add(currentBN)
    spendableOutpoints.push(walletOutPoint)
    i++;
    if (sumBN.gte(totalAmountBN) ) {
      break
    }
  }
  if(!sumBN.gte(totalAmountBN)){
    console.log("waiting")
    await timeout(1000)
    spendableOutpointsList = await wallet.getSpendableOutpoints(bcAddress)
    return await getOutPoints(spendableOutpointsList,amount)
  }
  else {
    return {spendableOutpointsList:spendableOutpointsList.slice(i),newList:spendableOutpoints}
  }
}
