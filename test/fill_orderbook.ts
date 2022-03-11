//@ts-ignore
'use strict'
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

/* tslint:disable */
/* tslint:enable */

import {createMakerOrderTransaction,createMultiNRGTransferTransaction} from '../dist/transaction'
import RpcClient from '../dist/client'
import * as bcProtobuf from '@overline/proto/proto/bc_pb'
import * as coreProtobuf from '@overline/proto/proto/core_pb'
import Wallet from '../dist/wallet'
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


const address = process.env.BC_RPC_ADDRESS || 'http://localhost:3000'
let hostname = 'http://localhost';
hostname= 'http://localhost';
let port = 3000
const scookie = process.env.BC_RPC_SCOOKIE || 'scookie'
const client = new RpcClient(hostname, scookie,{})
const wallet = new Wallet(client)
const bcAddress = process.argv[2].toLowerCase()
const privateKeyHex = process.argv[3]
let orderAmount = process.argv[4]
if(orderAmount == undefined) orderAmount = `2`;
const shiftMaker = 1
const shiftTaker = 1
const depositLength = 10000;
const settleLength = 10200;
const additionalTxFee = '0'
const collateralizedNrg = (parseInt(orderAmount) * 10).toString();

const addresses = {
  btc: '',
  dai: '',
  emb: '',
  eth: '',
  lsk: '',
  neo: '',
  nrg: '',
  usdt: '',
  wav: '',
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendMany(){
  let spendableOutpointsList = await wallet.getSpendableOutpoints(bcAddress,0,1000)
  spendableOutpointsList.sort((a,b)=>{
    let val:string = a.outpoint && a.outpoint.value && a.outpoint.value as string ? a.outpoint.value as string : '';
    let val2:string = b.outpoint && b.outpoint.value ? b.outpoint.value as string: '';

    return internalToBN(convertProtoBufSerializedBytesToBuffer(val), COIN_FRACS.BOSON).gt(
      internalToBN(convertProtoBufSerializedBytesToBuffer(val2), COIN_FRACS.BOSON)
    ) ? -1 : 1
  })

  let toAddress : Array<string> = Array(100).fill(bcAddress)
  let transferAmount : Array<string> = Array(100).fill('200')
  let tx: coreProtobuf.Transaction|BN = await createMultiNRGTransferTransaction(spendableOutpointsList,bcAddress,privateKeyHex,toAddress,transferAmount,'0',true,'1')
  if(tx instanceof BN){

  }
  else {
    const res = await client.sendTx(tx)
    console.log('sendTx', res)
  }
}
//
async function testMaker({sendsFromChain, receivesToChain, sendsFromAddress, receivesToAddress, sendsUnit, receivesUnit, spendableOutpointsList}) {
  let tx: coreProtobuf.Transaction = new coreProtobuf.Transaction()
  let collateral = collateralizedNrg;
  let baseFee = '';
  let unit = '';

  if (sendsFromChain.toLowerCase() === 'nrg') {
    sendsUnit = Math.round(parseFloat(sendsUnit)).toString();
    collateral = sendsUnit;
    baseFee = '0.1';
  }

  receivesUnit = Math.round(parseFloat(receivesUnit)*10000)/10000;

  if(receivesToChain == 'NEO' || sendsFromChain === 'NEO') unit = collateral;
  else unit = (Math.round(parseFloat(collateral))/10).toString();
  if(receivesToChain === "NEO") receivesUnit = Math.ceil(receivesUnit);
  if(sendsFromChain === "NEO") sendsUnit = Math.ceil(sendsUnit);

  console.log({
    sendsFromChain, receivesToChain, sendsFromAddress, receivesToAddress,
    sendsUnit, receivesUnit, collateral, unit
  })

  tx = await createMakerOrderTransaction( spendableOutpointsList, 0, shiftTaker, depositLength, settleLength,
    sendsFromChain, receivesToChain, sendsFromAddress, receivesToAddress,
    sendsUnit, receivesUnit, bcAddress.toLowerCase(), privateKeyHex,
    collateral, unit, baseFee, additionalTxFee, true, '1'
  ) as coreProtobuf.Transaction

  const res = await client.sendTx(tx)
  console.log(res);
  await timeout(300)
  return true
}

async function fillOrderbook() {
  // for(let i = 0; i < 3; i++){
  //   await sendMany()
  //   await timeout(10000)
  // }
  const {assetPrices,jsonData} = await getPrices()

  let spendableOutpointsList = await wallet.getSpendableOutpoints(bcAddress,0,1000)
  for (let i = 0; i < assetPrices.length; i++) {
    let {asset, denomination, price} = assetPrices[i]
    for (let j = 0; j < 20; j++) {
      let increment = new Decimal(Math.random() / 1000).mul(new Decimal(price)).toNumber()

      let {sendUnit1,recUnit1,sendUnit2,recUnit2} = getSpecs(price,increment,asset,denomination,jsonData)
      console.log({length:spendableOutpointsList.length});
      if(denomination != 'NRG'){
        let newOutPoints = await getOutPoints(spendableOutpointsList,collateralizedNrg)
        spendableOutpointsList = newOutPoints.spendableOutpointsList

        testMaker({sendsFromChain:asset,receivesToChain:denomination,
        sendsFromAddress:addresses[asset.toLowerCase()],receivesToAddress:addresses[denomination.toLowerCase()],
        sendsUnit:sendUnit1,receivesUnit:recUnit1,spendableOutpointsList:newOutPoints.newList});
      }

      let amount:any = collateralizedNrg

      if(denomination == 'NRG'){
        while(parseFloat(sendUnit2)>200) {
          recUnit2 = String(parseFloat(recUnit2)/10);
          sendUnit2 = String(parseFloat(sendUnit2)/10);
        }
        amount = sendUnit2
      }

      let newOutPoints = await getOutPoints(spendableOutpointsList,amount)
      spendableOutpointsList = newOutPoints.spendableOutpointsList

      testMaker({sendsFromChain:denomination,receivesToChain:asset,
      sendsFromAddress:addresses[denomination.toLowerCase()],receivesToAddress:addresses[asset.toLowerCase()],
      receivesUnit:recUnit2,sendsUnit:sendUnit2,spendableOutpointsList:newOutPoints.newList});
      await timeout(500);
    }
  }
}

function getSpecs(price, increment, asset, denomination,prices){

  const priceAbove = (price + increment)
  const priceBelow = (price - increment)

  let sendAmount = new Decimal(Math.ceil(Math.random()*1000)).div(new Decimal(prices[asset.toLowerCase()])).mul(new Decimal(Math.random()/10000+1)).toString();
  let recAmount =  new Decimal(Math.ceil(Math.random()*1000)).div(new Decimal(prices[denomination.toLowerCase()])).mul(new Decimal(Math.random()/10000+1)).toString();

  let sendUnit1 = sendAmount;
  let recUnit1 = new Decimal(priceAbove).mul(new Decimal(sendAmount)).toString();

  let recUnit2 = new Decimal(recAmount).div(new Decimal(priceBelow)).toString();
  let sendUnit2 = recAmount;

  if(asset.toLowerCase() == 'neo'){
    sendUnit1 = Math.ceil(Math.random()*100).toString();
    recUnit1 = new Decimal(priceAbove).mul(new Decimal(sendUnit1)).toString();

    recUnit2 = Math.ceil(Math.random()*100).toString();
    sendUnit2 = new Decimal(priceBelow).mul(new Decimal(recUnit2)).toString();
  }

  if(denomination.toLowerCase() == 'neo'){
    sendUnit2 = Math.ceil(Math.random()*100).toString();
    recUnit2 = new Decimal(sendUnit2).div(new Decimal(priceBelow)).toString();

    recUnit1 = Math.ceil(Math.random()*100).toString();
    sendUnit1 = new Decimal(recUnit1).div(new Decimal(priceAbove)).toString();
  }

  if(sendUnit1.split('.').length == 2){
    let first = sendUnit1.split('.')[0];
    let second = sendUnit1.split('.')[1].substring(0,5);
    sendUnit1 = first +  '.' + second;
  }

  if(sendUnit2.split('.').length == 2){
    let first = sendUnit2.split('.')[0];
    let second = sendUnit2.split('.')[1].substring(0,5);
    sendUnit2 = first +  '.' + second;
  }
  if(recUnit1.split('.').length == 2){
    let first = recUnit1.split('.')[0];
    let second = recUnit1.split('.')[1].substring(0,5);
    recUnit1 = first +  '.' + second;
  }
  if(recUnit2.split('.').length == 2){
    let first = recUnit2.split('.')[0];
    let second = recUnit2.split('.')[1].substring(0,5);
    recUnit2 = first +  '.' + second;
  }

  return {sendUnit1,recUnit1,sendUnit2,recUnit2}
}

async function getOutPoints(spendableOutpointsList,amount) {
  let totalAmountBN = new BN(new Decimal(amount).mul(new Decimal(Math.pow(10,17))).toString()).mul(new BN('11'))
  let sumBN = new BN('0')

  // spendableOutpointsList = spendableOutpointsList.sort((a,b)=>{
  //   return internalToBN(convertProtoBufSerializedBytesToBuffer(a.outpoint.value), COIN_FRACS.BOSON).gt(
  //     internalToBN(convertProtoBufSerializedBytesToBuffer(b.outpoint.value), COIN_FRACS.BOSON)
  //   ) ? -1 : 1
  // })

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
    let spendableOutpointsList2 = await wallet.getSpendableOutpoints(bcAddress,1001,2000)
    let spendableOutpointsList3 = await wallet.getSpendableOutpoints(bcAddress,2001,3000)
    spendableOutpointsList = spendableOutpointsList.concat(spendableOutpointsList2).concat(spendableOutpointsList3);

    console.log("waiting");
    return await getOutPoints(spendableOutpointsList,amount)
  }
  else {
    return {spendableOutpointsList:spendableOutpointsList.slice(i),newList:spendableOutpoints}
  }
}

fillOrderbook()
