process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import * as core from '../src/protos/core_pb'
import * as bcProtobuf from '../src/protos/bc_pb'

import RpcClient from '../src/client';
import Wallet from '../src/wallet';
import {
  GetBalanceRequest
} from '../src/protos/bc_pb';

import {
  createMakerOrderTransaction,
  createNRGTransferTransaction,
  createTakerOrderTransaction
} from '../src/transaction';


const address = process.env.BC_RPC_ADDRESS || 'https://localhost:3000'
const scookie = process.env.BC_RPC_SCOOKIE || 'trololo'
const client = new RpcClient(address, scookie);

const wallet = new Wallet(client)

const bcAddress = '0xfdca838dcfcae6a7923700ea3fb90cb577040fd2'
const privateKeyHex = '9a603f04c501d1ac830ef1e2b526618fd8855160afa60a96d8e9484b332f9f33'
const toAddress = '0xf1d1b778a4f76d27480de333c522abe97825ac16'
const toAddressPrivateKeyHex = 'f9b99a468d6f8b6bd1925ac20207aeb1a1824b10c5f04f3b6d817b476b33f270'

async function testTransfer() {
  const spendableOutpointsList = await wallet.getSpendableOutpoints(bcAddress)
  const fromAddress = bcAddress
  const transferAmount = '30'
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


async function testMaker() {
  const spendableOutpointsList = await wallet.getSpendableOutpoints(bcAddress)

  const shiftMaker = 2
  const shiftTaker = 3
  const depositLength = 300000
  const settleLength = 2000000
  const sendsFromChain = 'btc'
  const receivesToChain = 'eth'

  const sendsFromAddress = '1FhrZLNKJbfCZDpCZAEGAZFpTYunESa1wK'
  const receivesToAddress = '0xc2be9e536EeE410a720C6440CBAc293f4358451c'

  const sendsUnit = '1.3'
  const receivesUnit = '30.5'
  const collateralizedNrg = '30'
  const nrgUnit = '3'
  const additionalTxFee = '0'

  const tx = createMakerOrderTransaction(
    spendableOutpointsList,
    shiftMaker, shiftTaker, depositLength, settleLength,
    sendsFromChain, receivesToChain,
    sendsFromAddress, receivesToAddress,
    sendsUnit, receivesUnit,
    bcAddress, privateKeyHex,
    collateralizedNrg, nrgUnit, additionalTxFee
  )
  console.log(JSON.stringify(tx.toObject(), null, 2))
  const res = await client.sendTx(tx)
  console.log('sendTx', res)
  return true
}

async function testTaker(makerOpenOrder: bcProtobuf.MakerOrderInfo.AsObject) {
  const spendableOutpointsList = await wallet.getSpendableOutpoints(toAddress)
  console.log(spendableOutpointsList)

  const sendsFromAddress = '0xb0C76e8aC849afa840f3DDFd41205787d0828e77' // eth
  const receivesToAddress = '1FhrZLNKJbfCZDpCZAEGAZFpTYunESa1wK' // btc
  const collateralizedNrg = '10'
  const additionalTxFee = '0'

  const tx = createTakerOrderTransaction(
    spendableOutpointsList,
    sendsFromAddress, receivesToAddress,
    makerOpenOrder,
    toAddress, toAddressPrivateKeyHex,
    collateralizedNrg, additionalTxFee
  )
  console.log(JSON.stringify(tx.toObject(), null, 2))
  const res = await client.sendTx(tx)
  console.log('send taker', res)
  return true
}

async function getOpenOrders() {
  console.log('Getting orders')
  const res = await client.getOpenOrders()
  for(let order of res.ordersList) {
    console.log(JSON.stringify(order, null, 2))
  }
  return res.ordersList
}
/* getOpenOrders().then(() => {}) */

wallet.getBalance(bcAddress).then(balance => {
  console.log(balance);
  /* testTransfer().then(() => {}) */
  getOpenOrders().then((orders) => {
    /* testTaker(orders[0]).then(() => {}) */
  })

  /* testMaker().then(() => { */
  /*   setInterval(() => { */
  /*     getOpenOrders().then((orders) => { */
  /*     }) */
  /*   }, 5000) */
  /* }) */
})

