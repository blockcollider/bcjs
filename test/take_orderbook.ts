process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import * as coreProtobuf from '../src/protos/core_pb'
import * as bcProtobuf from '../src/protos/bc_pb'

import RpcClient from '../src/client';
import Wallet from '../src/wallet';
import {createTakerOrderTransaction} from '../src/transaction';
import {createMakerOrderTransaction,createMultiNRGTransferTransaction} from '../dist/transaction'
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
  bytesToInternalBN,
  createOutPoint,
  createTransactionInput,
  createTransactionOutput,
  convertProtoBufSerializedBytesToBuffer
} from '../src/utils/protoUtil'

import {
    GetBalanceRequest
} from '../src/protos/bc_pb';

const address = process.env.BC_RPC_ADDRESS || 'https://localhost:3001'
const scookie = process.env.BC_RPC_SCOOKIE || 'trololo'
const client = new RpcClient(address, scookie);
const wallet = new Wallet(client)
const bcAddress = process.argv[2].toLowerCase()
const privateKeyHex = process.argv[3]

const addresses = {
  btc: '1PhDYLfZMfVP3LALNLhVgx5dhYbSbtJk62',
  dai: '0xd96690dae10BEC38e368E30714e228d240c1cbB2',
  emb: '0xd96690dae10BEC38e368E30714e228d240c1cbB2',
  eth: '0xd96690dae10BEC38e368E30714e228d240c1cbB2',
  lsk: '3106091506985389775L',
  neo: 'AYkZtwR7MwxYwivRmpy75JPg9gffTaKaJf',
  nrg: '0xd96690dae10BEC38e368E30714e228d240c1cbB2',
  usdt: '0xd96690dae10BEC38e368E30714e228d240c1cbB2',
  wav: '3P3epiCSAiyyEfytX5GSygm8j4kAK8yADGP',
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendMany(){
  let spendableOutpointsList = await wallet.getSpendableOutpoints(bcAddress)
  let toAddress : Array<string> = Array(50).fill(bcAddress)
  let transferAmount : Array<string> = Array(50).fill('1.1')

  let tx: coreProtobuf.Transaction = createMultiNRGTransferTransaction(spendableOutpointsList,bcAddress,privateKeyHex,toAddress,transferAmount,'0')

  const res = await client.sendTx(tx)

  console.log('sendTx', res)
}

async function testTaker(makerOpenOrder: bcProtobuf.MakerOrderInfo.AsObject, spendableOutpointsList) {

  const sendsFromAddress = addresses[makerOpenOrder.receivesToChain] // eth
  const receivesToAddress = addresses[makerOpenOrder.sendsFromChain] // btc
  const collateralizedNrg = makerOpenOrder.collateralizedNrg
  const additionalTxFee = '0'


  const tx = createTakerOrderTransaction(
    spendableOutpointsList,
    sendsFromAddress, receivesToAddress,
    makerOpenOrder,
    bcAddress, privateKeyHex,
    collateralizedNrg, additionalTxFee
  )
  const res:any = await client.sendTx(tx)
  // if(res.txHash == ''){
    console.log({makerOpenOrder})
  // }
  console.log('send taker', res)
  return true
}

async function getOpenOrders() {
  console.log('Getting orders')
  const req = new GetBalanceRequest()

  const res = await client.getOpenOrders(req)
  return res.ordersList
}


async function getOutPoints(spendableOutpointsList,amount) {
  amount = amount < 1 ? 1 : Math.ceil(amount)
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
    await timeout(1000)
    spendableOutpointsList = await wallet.getSpendableOutpoints(bcAddress)
    console.log("waiting")
    return await getOutPoints(spendableOutpointsList,amount)
  }
  else {
    return {spendableOutpointsList:spendableOutpointsList.slice(i),newList:spendableOutpoints}
  }
}

async function takeOrderbook(){
  await sendMany()
  await sendMany()
  await sendMany()
  await sendMany()
  await sendMany()
  await sendMany()
  let orders = await getOpenOrders();
  let spendableOutpointsList = await wallet.getSpendableOutpoints(bcAddress)

  for(let i = 0; i < orders.length; i++){

    let newOutPoints = await getOutPoints(spendableOutpointsList,orders[i].collateralizedNrg)
    spendableOutpointsList = newOutPoints.spendableOutpointsList

    await testTaker(orders[i],newOutPoints.newList)
    // await timeout(2000)
  }
}

takeOrderbook()
