'use strict'
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

/* tslint:disable */
require('isomorphic-fetch') // fetch for both node and old browsers
/* tslint:enable */
import * as fs from 'fs'
import {createMakerOrderTransaction,createMultiNRGTransferTransaction} from '../dist/transaction'
import RpcClient from '../src/client'
import * as bcProtobuf from '../src/protos/bc_pb'
import * as coreProtobuf from '../src/protos/core_pb'
import Wallet from '../src/wallet'
import {parseMakerLockScript} from '../dist/script/templates';
import {toASM} from '../dist/script/bytecode'
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

const address = process.env.BC_RPC_ADDRESS || 'https://localhost:3001'
const scookie = process.env.BC_RPC_SCOOKIE || 'trololo'
const client = new RpcClient(address, scookie)
const wallet = new Wallet(client)
const bcAddress = process.argv[2].toLowerCase()
const privateKeyHex = process.argv[3]
const shiftMaker = 0
const shiftTaker = 0
const depositLength = 20
const settleLength = 30
const additionalTxFee = '0'
const collateralizedNrg = '0.01'
const nrgUnit = '0.01'
const assetPrices = [
  {asset: 'USDT', denomination: 'EMB', price: 0},
  {asset: 'DAI', denomination: 'EMB', price: 0},
  {asset: 'BTC', denomination: 'EMB', price: 0},
  {asset: 'ETH', denomination: 'EMB', price: 0},
  {asset: 'NEO', denomination: 'EMB', price: 0},
  {asset: 'WAV', denomination: 'EMB', price: 0},
  {asset: 'LSK', denomination: 'EMB', price: 0},
  {asset: 'DAI', denomination: 'USDT', price: 0},
  {asset: 'BTC', denomination: 'USDT', price: 0},
  {asset: 'ETH', denomination: 'USDT', price: 0},
  {asset: 'NEO', denomination: 'USDT', price: 0},
  {asset: 'WAV', denomination: 'USDT', price: 0},
  {asset: 'LSK', denomination: 'USDT', price: 0},

  {asset: 'BTC', denomination: 'DAI', price: 0},
  {asset: 'ETH', denomination: 'DAI', price: 0},
  {asset: 'NEO', denomination: 'DAI', price: 0},
  {asset: 'WAV', denomination: 'DAI', price: 0},
  {asset: 'LSK', denomination: 'DAI', price: 0},

  {asset: 'ETH', denomination: 'BTC', price: 0},
  {asset: 'NEO', denomination: 'BTC', price: 0},
  {asset: 'WAV', denomination: 'BTC', price: 0},
  {asset: 'LSK', denomination: 'BTC', price: 0},

  {asset: 'NEO', denomination: 'ETH', price: 0},
  {asset: 'WAV', denomination: 'ETH', price: 0},
  {asset: 'LSK', denomination: 'ETH', price: 0},

  {asset: 'WAV', denomination: 'NEO', price: 0},
  {asset: 'LSK', denomination: 'NEO', price: 0},

  {asset: 'LSK', denomination: 'WAV', price: 0},

  {asset: 'EMB', denomination: 'NRG', price: 0},
  {asset: 'USDT', denomination: 'NRG', price: 0},
  {asset: 'DAI', denomination: 'NRG', price: 0},
  {asset: 'BTC', denomination: 'NRG', price: 0},
  {asset: 'ETH', denomination: 'NRG', price: 0},
  {asset: 'NEO', denomination: 'NRG', price: 0},
  {asset: 'WAV', denomination: 'NRG', price: 0},
  {asset: 'LSK', denomination: 'NRG', price: 0},
]

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

// console.log({bcAddress, privateKeyHex})
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

async function testMaker({
  sendsFromChain, receivesToChain, sendsFromAddress,
  receivesToAddress, sendsUnit, receivesUnit, spendableOutpointsList}) {

  let tx: coreProtobuf.Transaction = new coreProtobuf.Transaction()

  if (sendsFromChain.toLowerCase() === 'nrg') {
    tx = createMakerOrderTransaction(
      spendableOutpointsList, shiftMaker, shiftTaker, depositLength, settleLength,
      sendsFromChain, receivesToChain, sendsFromAddress, receivesToAddress,
      sendsUnit, receivesUnit, bcAddress.toLowerCase(), privateKeyHex,
      sendsUnit, sendsUnit, collateralizedNrg, additionalTxFee,
    )
  } else {
    tx = createMakerOrderTransaction(
      spendableOutpointsList, shiftMaker, shiftTaker, depositLength, settleLength,
      sendsFromChain, receivesToChain, sendsFromAddress, receivesToAddress,
      sendsUnit, receivesUnit, bcAddress.toLowerCase(), privateKeyHex,
      collateralizedNrg, collateralizedNrg, '', additionalTxFee,
    )
  }

  const res = await client.sendTx(tx)
  console.log('sendTx', res)
  return true
}

async function getPrices() {
  const jsonData: { usdt: number, dai: number, emb: number, nrg: number, btc: number, wav: number, eth: number, neo: number, lsk:number }
    = {usdt: 1, dai: 1, emb: 100, nrg: 10, btc:0,wav:0,lsk:0,eth:0,neo:0}

  let response = await fetch('https://api.cryptowat.ch/markets/binance/btcusdt/price')
  let json = await response.json()
  jsonData.btc = json.result.price

  const assets = ['eth', 'neo', 'waves', 'lsk']
  for (const asset of assets) {
    response = await fetch('https://api.cryptowat.ch/markets/binance/' + asset + 'btc/price')
    json = await response.json()
    if (asset === 'waves') {
      jsonData.wav = jsonData.btc * json.result.price
    } else {
      jsonData[asset] = jsonData.btc * json.result.price
    }
  }

  for (const assetPrice of assetPrices) {
    const {asset, denomination} = assetPrice
    assetPrice.price = Math.round(
      (jsonData[asset.toLowerCase()] / jsonData[denomination.toLowerCase()]) * Math.pow(10, 8),
    ) / Math.pow(10, 8)
  }

  fs.writeFile('prices.json', JSON.stringify(jsonData, null, 4), (err) => err)
  fs.writeFile('assetPrices.json', JSON.stringify({assetPrices}, null, 4), (err) => err)
  return assetPrices
}

async function fillOrderbook() {
  const assetPrices = await getPrices()
  await sendMany()
  await sendMany()
  await sendMany()
  await sendMany()
  await sendMany()
  await sendMany()

  let spendableOutpointsList = await wallet.getSpendableOutpoints(bcAddress)
  for (let i = 0; i < assetPrices.length; i++) {
    let {asset, denomination, price} = assetPrices[i]
    for (let j = 0; j < 17; j++) {
      let increment = Math.random() / 300 * price
      let {sendUnit1,recUnit1,sendUnit2,recUnit2} = getSpecs(price,increment,asset,denomination)

      if(denomination.toLowerCase() != 'nrg'){
        let newOutPoints = await getOutPoints(spendableOutpointsList,collateralizedNrg)
        spendableOutpointsList = newOutPoints.spendableOutpointsList

        await testMaker({sendsFromChain:asset,receivesToChain:denomination,
        sendsFromAddress:addresses[asset.toLowerCase()],receivesToAddress:addresses[denomination.toLowerCase()],
        sendsUnit:sendUnit1,receivesUnit:recUnit1,spendableOutpointsList:newOutPoints.newList});
      }
      let amount:any = collateralizedNrg

      if(denomination.toLowerCase() == 'nrg'){
        while(sendUnit2 > 12){
          sendUnit2 = sendUnit2 / 10;
          recUnit2 = recUnit2 / 10;
        }
        amount = sendUnit2
      }

      let newOutPoints = await getOutPoints(spendableOutpointsList,amount)
      spendableOutpointsList = newOutPoints.spendableOutpointsList

      await testMaker({sendsFromChain:denomination,receivesToChain:asset,
      sendsFromAddress:addresses[denomination.toLowerCase()],receivesToAddress:addresses[asset.toLowerCase()],
      receivesUnit:recUnit2,sendsUnit:sendUnit2,spendableOutpointsList:newOutPoints.newList});
    }
  }
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


function getSpecs(price, increment,asset,denomination){

  const priceAbove = Math.round((price + increment) * Math.pow(10, 8)) / Math.pow(10, 8)
  const priceBelow = Math.round((price - increment) * Math.pow(10, 8)) / Math.pow(10, 8)
  increment = Math.random()/300*price + increment;

  let sendAmount = Math.floor(Math.random() * Math.floor(10))+0.1;
  let recAmount = Math.floor(Math.random() * Math.floor(10))+0.1;

  let sendUnit1 = sendAmount;
  let recUnit1 = priceAbove*sendAmount;

  let sendUnit2 = priceBelow*recAmount;
  let recUnit2 = recAmount;

  if(asset.toLowerCase() == 'neo'){
    sendUnit1 = Math.round(sendUnit1)+1;
    recUnit1 = priceAbove*sendUnit1;

    recUnit2 = Math.round(recUnit2)+1;
    sendUnit2 = priceBelow*recUnit2
  }

  if(denomination.toLowerCase() == 'neo'){
    sendUnit2 = Math.round(sendUnit2)+1;
    recUnit2 = sendUnit2/priceBelow;

    recUnit1 = Math.round(recUnit1)+1;
    sendUnit1 = recUnit1 / priceAbove;
  }
  return {sendUnit1,recUnit1,sendUnit2,recUnit2}
}

fillOrderbook()
