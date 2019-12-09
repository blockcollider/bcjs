process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import * as core from '../src/protos/core_pb'
import * as bcProtobuf from '../src/protos/bc_pb'

import RpcClient from '../src/client';
import Wallet from '../src/wallet';
import {createTakerOrderTransaction} from '../src/transaction';
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

async function testTaker(makerOpenOrder: bcProtobuf.MakerOrderInfo.AsObject) {
  let spendableOutpointsList = await wallet.getSpendableOutpoints(bcAddress)

  console.log({length:spendableOutpointsList.length})
  while(spendableOutpointsList.length == 0) {
    await timeout(1000)
    spendableOutpointsList = await wallet.getSpendableOutpoints(bcAddress)
    console.log({spendableOutpointsList})
  }

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

async function takeOrderbook(){
  let orders = await getOpenOrders();
  for(let i = 0; i < orders.length; i++){
    await testTaker(orders[i])
    // await timeout(2000)
  }
}

takeOrderbook()
