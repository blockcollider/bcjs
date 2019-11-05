'use strict';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import * as coreProtobuf from '../src/protos/core_pb'
import * as bcProtobuf from '../src/protos/bc_pb'
import fetch from 'isomorphic-fetch';
import RpcClient from '../src/client';
import Wallet from '../src/wallet';
import {createMakerOrderTransaction} from '../dist/transaction';

const address = process.env.BC_RPC_ADDRESS || 'https://localhost:3001'
const scookie = process.env.BC_RPC_SCOOKIE || 'trololo'
const client = new RpcClient(address, scookie);
const wallet = new Wallet(client)
const bcAddress = process.argv[2]
const privateKeyHex = process.argv[3]
console.log({bcAddress,privateKeyHex})

const fs = require('fs');

async function testMaker({sendsFromChain,receivesToChain,sendsFromAddress,receivesToAddress,sendsUnit,receivesUnit}) {
  const spendableOutpointsList = await wallet.getSpendableOutpoints(bcAddress)
  // console.log({spendableOutpointsList})
  const shiftMaker = 0
  const shiftTaker = 0
  const depositLength = 100
  const settleLength = 300
  const additionalTxFee = '0'
  const collateralizedNrg = '10';
  const nrgUnit = '1';
  let tx: coreProtobuf.Transaction = new coreProtobuf.Transaction();

  if(sendsFromChain.toLowerCase() == 'nrg') {
    tx = createMakerOrderTransaction(
      spendableOutpointsList,shiftMaker, shiftTaker, depositLength, settleLength,
      sendsFromChain, receivesToChain,sendsFromAddress, receivesToAddress,
      sendsUnit, receivesUnit, bcAddress.toString(), privateKeyHex,
      sendsUnit, nrgUnit,collateralizedNrg, '0'
    )
  }
  //NORMAL ORDER
  else {
    tx = createMakerOrderTransaction(
      spendableOutpointsList,shiftMaker, shiftTaker, depositLength, settleLength,
      sendsFromChain, receivesToChain,sendsFromAddress, receivesToAddress,
      sendsUnit, receivesUnit, bcAddress.toLowerCase(), privateKeyHex,
      collateralizedNrg, nrgUnit,'', additionalTxFee
    )
  }

  console.log(JSON.stringify(tx.toObject(), null, 2))
  const res = await client.sendTx(tx)
  console.log('sendTx', res)
  return true
}

let assetPrices = [
  {asset:'USDT',denomination:'EMB'},
  {asset:'DAI',denomination:'EMB'},
  {asset:'BTC',denomination:'EMB'},
  {asset:'ETH',denomination:'EMB'},
  {asset:'NEO',denomination:'EMB'},
  {asset:'WAV',denomination:'EMB'},
  {asset:'LSK',denomination:'EMB'},
  {asset:'DAI',denomination:'USDT'},
  {asset:'BTC',denomination:'USDT'},
  {asset:'ETH',denomination:'USDT'},
  {asset:'NEO',denomination:'USDT'},
  {asset:'WAV',denomination:'USDT'},
  {asset:'LSK',denomination:'USDT'},

  {asset:'BTC',denomination:'DAI'},
  {asset:'ETH',denomination:'DAI'},
  {asset:'NEO',denomination:'DAI'},
  {asset:'WAV',denomination:'DAI'},
  {asset:'LSK',denomination:'DAI'},

  {asset:'ETH',denomination:'BTC'},
  {asset:'NEO',denomination:'BTC'},
  {asset:'WAV',denomination:'BTC'},
  {asset:'LSK',denomination:'BTC'},

  {asset:'NEO',denomination:'ETH'},
  {asset:'WAV',denomination:'ETH'},
  {asset:'LSK',denomination:'ETH'},

  {asset:'WAV',denomination:'NEO'},
  {asset:'LSK',denomination:'NEO'},

  {asset:'LSK',denomination:'WAV'},

  {asset:'EMB',denomination:'NRG'},
  {asset:'USDT',denomination:'NRG'},
  {asset:'DAI',denomination:'NRG'},
  {asset:'BTC',denomination:'NRG'},
  {asset:'ETH',denomination:'NRG'},
  {asset:'NEO',denomination:'NRG'},
  {asset:'WAV',denomination:'NRG'},
  {asset:'LSK',denomination:'NRG'}
]

async function getPrices(){
  let jsonData = {'usdt':1,'dai':1,'emb':1,'nrg':0.1};

  let response = await fetch(`https://api.cryptowat.ch/markets/binance/btcusdt/price`)
  let json = await response.json()
  jsonData[`btc`] = json.result.price

  let assets = ['eth','neo','waves','lsk']
  for(let i = 0; i < assets.length; i ++){
    response = await fetch(`https://api.cryptowat.ch/markets/binance/`+assets[i]+`btc/price`)
    json = await response.json()
    if(assets[i] == 'waves') jsonData['wav'] = jsonData['btc']*json.result.price
    else jsonData[assets[i]] = jsonData['btc']*json.result.price
  }

  for(let j = 0; j < assetPrices.length; j++){
    let {asset,denomination} = assetPrices[j];
    assetPrices[j]['price'] = Math.round((jsonData[asset.toLowerCase()]/jsonData[denomination.toLowerCase()])*Math.pow(10,8))/Math.pow(10,8)
  }

  fs.writeFile("prices.json", JSON.stringify(jsonData, null, 4), function(err) {});
  fs.writeFile("assetPrices.json", JSON.stringify({assetPrices}, null, 4),function(err) {});
}

let addresses={
  'nrg':'0xd96690dae10BEC38e368E30714e228d240c1cbB2',
  'emb':'0xd96690dae10BEC38e368E30714e228d240c1cbB2',
  'usdt':'0xd96690dae10BEC38e368E30714e228d240c1cbB2',
  'dai':'0xd96690dae10BEC38e368E30714e228d240c1cbB2',
  'btc':'1PhDYLfZMfVP3LALNLhVgx5dhYbSbtJk62',
  'eth':'0xd96690dae10BEC38e368E30714e228d240c1cbB2',
  'neo':'AYkZtwR7MwxYwivRmpy75JPg9gffTaKaJf',
  'wav':'3P3epiCSAiyyEfytX5GSygm8j4kAK8yADGP',
  'lsk':'3106091506985389775L'
}

async function fillOrderbook(){
  await getPrices()
  let {assetPrices} = require('./assetPrices.json')
  for(let i = 0; i < assetPrices.length;i++){
    let {asset,denomination,price} = assetPrices[i];
    let increment = Math.random()/300*price;
    if((asset == 'BTC' || denomination == 'BTC') && (asset != 'NRG' && denomination != 'NRG')){
      for(let j = 0; j < 24; j++){
        let priceAbove = Math.round((price + increment)*Math.pow(10,8))/Math.pow(10,8);
        let priceBelow = Math.round((price - increment)*Math.pow(10,8))/Math.pow(10,8);
        increment = Math.random()/300*price + increment;

        let sendAmount = Math.floor(Math.random() * Math.floor(10))+0.1;
        let recAmount = Math.floor(Math.random() * Math.floor(10))+0.1;

        asset = asset.toLowerCase();
        denomination = denomination.toLowerCase();

        console.log({
          sendsFromChain:asset,receivesToChain:denomination,
          sendsFromAddress:addresses[asset.toLowerCase()],receivesToAddress:addresses[denomination.toLowerCase()],
          sendsUnit:sendAmount,receivesUnit:priceAbove*sendAmount
        })

        if(denomination != 'nrg'){
          await testMaker({sendsFromChain:asset,receivesToChain:denomination,
          sendsFromAddress:addresses[asset.toLowerCase()],receivesToAddress:addresses[denomination.toLowerCase()],
          sendsUnit:sendAmount,receivesUnit:priceAbove*sendAmount});
        }

        await testMaker({sendsFromChain:denomination,receivesToChain:asset,
        sendsFromAddress:addresses[denomination.toLowerCase()],receivesToAddress:addresses[asset.toLowerCase()],
        receivesUnit:recAmount,sendsUnit:priceBelow*recAmount});
      }
    }
  }
}

fillOrderbook()
