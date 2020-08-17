//@ts-ignore
'use strict'
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

/* tslint:disable */
/* tslint:enable */

import {createMakerOrderTransaction,createMultiNRGTransferTransaction} from '../dist/transaction'
import RpcClient from '../src/client'
import * as bcProtobuf from '../src/protos/bc_pb'
import * as coreProtobuf from '../src/protos/core_pb'
import Wallet from '../src/wallet'
import {parseMakerLockScript} from '../dist/script/templates';
import {toASM} from '../dist/script/bytecode'
import BN from 'bn.js'
import {Decimal} from 'decimal.js';
import getPrices from './get_prices';

Decimal.set({toExpPos:20})
Decimal.set({toExpNeg:-8})

import {
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


const address = process.env.BC_RPC_ADDRESS || 'http://167.99.153.11:3000'
let hostname = 'http://167.99.153.11';
let port = 3000
const scookie = process.env.BC_RPC_SCOOKIE || 'trololo'
const client = new RpcClient(address, scookie)
const wallet = new Wallet(client)
const bcAddress = process.argv[2].toLowerCase()
const privateKeyHex = process.argv[3]
let orderAmount = process.argv[4]
if(orderAmount == undefined) orderAmount = `2`;
const shiftMaker = 1
const shiftTaker = 1
const depositLength = 1000;
const settleLength = 1200;
const additionalTxFee = '0'
const collateralizedNrg = (parseInt(orderAmount) * 10).toString();
const nrgUnit = '1'

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

async function testMaker({sendsFromChain, receivesToChain, sendsFromAddress, receivesToAddress, sendsUnit, receivesUnit, spendableOutpointsList}) {
  let tx: coreProtobuf.Transaction = new coreProtobuf.Transaction()
  let collateral = collateralizedNrg;
  let baseFee = '';

  if (sendsFromChain.toLowerCase() === 'nrg') {
    collateral = sendsUnit;
    baseFee = '0.1';
  }
  console.log({
      sendsFromChain, receivesToChain, sendsFromAddress, receivesToAddress,
      sendsUnit, receivesUnit, bcAddress, privateKeyHex,
      collateral, baseFee, additionalTxFee,
  })
  tx = createMakerOrderTransaction( spendableOutpointsList, shiftMaker, shiftTaker, depositLength, settleLength,
    sendsFromChain, receivesToChain, sendsFromAddress, receivesToAddress,
    sendsUnit, receivesUnit, bcAddress.toLowerCase(), privateKeyHex,
    collateral, collateral, baseFee, additionalTxFee,
  )

  const res = await client.sendTx(tx)
  console.log('sent Tx - ', res)
  await timeout(100)
  return true
}

async function fillOrderbook() {
  const {assetPrices,jsonData} = await getPrices()

  let spendableOutpointsList = await wallet.getSpendableOutpoints(bcAddress,0,1000)

  for (let i = 0; i < assetPrices.length; i++) {
    let {asset, denomination, price} = assetPrices[i]
    for (let j = 0; j < 20; j++) {
      let increment = new Decimal(Math.random() / 1000).mul(new Decimal(price)).toNumber()

      let {sendUnit1,recUnit1,sendUnit2,recUnit2} = getSpecs(price,increment,asset,denomination,jsonData)

      if(denomination.toLowerCase() != 'nrg'){
        let newOutPoints = await getOutPoints(spendableOutpointsList,collateralizedNrg)
        spendableOutpointsList = newOutPoints.spendableOutpointsList

        await testMaker({sendsFromChain:asset,receivesToChain:denomination,
        sendsFromAddress:addresses[asset.toLowerCase()],receivesToAddress:addresses[denomination.toLowerCase()],
        sendsUnit:sendUnit1,receivesUnit:recUnit1,spendableOutpointsList:newOutPoints.newList});
      }

      let amount:any = collateralizedNrg

      if(denomination.toLowerCase() == 'nrg'){
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

function getSpecs(price, increment, asset, denomination,prices){

  const priceAbove = (price + increment)
  const priceBelow = (price - increment)
  // console.log({prices,asset})
  let sendAmount = new Decimal(orderAmount).div(new Decimal(prices[asset.toLowerCase()])).mul(new Decimal(Math.random()/10000+1)).toString();
  let recAmount =  new Decimal(orderAmount).div(new Decimal(prices[denomination.toLowerCase()])).mul(new Decimal(Math.random()/10000+1)).toString();

  let sendUnit1 = sendAmount;
  let recUnit1 = new Decimal(priceAbove).mul(new Decimal(sendAmount)).toString();

  let recUnit2 = new Decimal(recAmount).div(new Decimal(priceBelow)).toString();
  let sendUnit2 = recAmount;

  if(asset.toLowerCase() == 'neo'){
    sendUnit1 = '1';
    recUnit1 = new Decimal(priceAbove).mul(new Decimal(sendUnit1)).toString();

    recUnit2 = '1';
    sendUnit2 = new Decimal(priceBelow).mul(new Decimal(recUnit2)).toString();
  }

  if(denomination.toLowerCase() == 'neo'){
    sendUnit2 = '1';
    recUnit2 = new Decimal(sendUnit2).div(new Decimal(priceBelow)).toString();

    recUnit1 = '1'
    sendUnit1 = new Decimal(recUnit1).div(new Decimal(priceAbove)).toString();
  }

  if(sendUnit1.split('.').length == 2){
    let first = sendUnit1.split('.')[0];
    let second = sendUnit1.split('.')[1].substring(0,8);
    sendUnit1 = first +  '.' + second;
  }

  if(sendUnit2.split('.').length == 2){
    let first = sendUnit2.split('.')[0];
    let second = sendUnit2.split('.')[1].substring(0,8);
    sendUnit2 = first +  '.' + second;
  }
  if(recUnit1.split('.').length == 2){
    let first = recUnit1.split('.')[0];
    let second = recUnit1.split('.')[1].substring(0,8);
    recUnit1 = first +  '.' + second;
  }
  if(recUnit2.split('.').length == 2){
    let first = recUnit2.split('.')[0];
    let second = recUnit2.split('.')[1].substring(0,8);
    recUnit2 = first +  '.' + second;
  }

  return {sendUnit1,recUnit1,sendUnit2,recUnit2}
}

async function getOutPoints(spendableOutpointsList,amount) {

  let totalAmountBN = new BN(new Decimal(amount).mul(new Decimal(Math.pow(10,17))).toString()).mul(new BN('11'))
  let sumBN = new BN('0')

  spendableOutpointsList = spendableOutpointsList.sort((a,b)=>{
    return internalToBN(convertProtoBufSerializedBytesToBuffer(a.outpoint.value), COIN_FRACS.BOSON).gt(
      internalToBN(convertProtoBufSerializedBytesToBuffer(b.outpoint.value), COIN_FRACS.BOSON)
    ) ? -1 : 1
  })

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
    spendableOutpointsList = await wallet.getSpendableOutpoints(bcAddress,0,1000)
    console.log("waiting")
    return await getOutPoints(spendableOutpointsList,amount)
  }
  else {
    return {spendableOutpointsList:spendableOutpointsList.slice(i),newList:spendableOutpoints}
  }
}

fillOrderbook()
