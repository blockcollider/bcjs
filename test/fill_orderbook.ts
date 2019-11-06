'use strict'
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

/* tslint:disable */
require('isomorphic-fetch') // fetch for both node and old browsers
/* tslint:enable */
import * as fs from 'fs'
import {createMakerOrderTransaction} from '../dist/transaction'
import RpcClient from '../src/client'
import * as bcProtobuf from '../src/protos/bc_pb'
import * as coreProtobuf from '../src/protos/core_pb'
import Wallet from '../src/wallet'

const address = process.env.BC_RPC_ADDRESS || 'https://localhost:3001'
const scookie = process.env.BC_RPC_SCOOKIE || 'trololo'
const client = new RpcClient(address, scookie)
const wallet = new Wallet(client)
const bcAddress = process.argv[2]
const privateKeyHex = process.argv[3]
// console.log({bcAddress, privateKeyHex})

async function testMaker({
  sendsFromChain, receivesToChain, sendsFromAddress,
  receivesToAddress, sendsUnit, receivesUnit}) {
  const spendableOutpointsList = await wallet.getSpendableOutpoints(bcAddress)
  // console.log({spendableOutpointsList})
  const shiftMaker = 0
  const shiftTaker = 0
  const depositLength = 100
  const settleLength = 300
  const additionalTxFee = '0'
  const collateralizedNrg = '10'
  const nrgUnit = '1'
  let tx: coreProtobuf.Transaction = new coreProtobuf.Transaction()

  if (sendsFromChain.toLowerCase() === 'nrg') {
    tx = createMakerOrderTransaction(
      spendableOutpointsList, shiftMaker, shiftTaker, depositLength, settleLength,
      sendsFromChain, receivesToChain, sendsFromAddress, receivesToAddress,
      sendsUnit, receivesUnit, bcAddress.toString(), privateKeyHex,
      sendsUnit, nrgUnit, collateralizedNrg, '0',
    )
  } else {
    tx = createMakerOrderTransaction(
      spendableOutpointsList, shiftMaker, shiftTaker, depositLength, settleLength,
      sendsFromChain, receivesToChain, sendsFromAddress, receivesToAddress,
      sendsUnit, receivesUnit, bcAddress.toLowerCase(), privateKeyHex,
      collateralizedNrg, nrgUnit, '', additionalTxFee,
    )
  }

  // console.log(JSON.stringify(tx.toObject(), null, 2))
  const res = await client.sendTx(tx)
  // console.log('sendTx', res)
  return true
}

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

async function getPrices() {
  const jsonData: { usdt: number, dai: number, emb: number, nrg: number, btc?: number, wav?: number }
    = {usdt: 1, dai: 1, emb: 1, nrg: 0.1}

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

async function fillOrderbook() {
  const assetPrices = await getPrices()
  console.log({assetPrices})
  for (let i = 0; i < assetPrices.length; i++) {
    let {asset, denomination, price} = assetPrices[i]
    let increment = Math.random() / 300 * price
    if ((asset == 'BTC' || denomination == 'BTC') && (asset != 'NRG' && denomination != 'NRG')) {
      for (let j = 0; j < 24; j++) {
        const priceAbove = Math.round((price + increment) * Math.pow(10, 8)) / Math.pow(10, 8)
        const priceBelow = Math.round((price - increment) * Math.pow(10, 8)) / Math.pow(10, 8)
        increment = Math.random() / 300 * price + increment

        const sendAmount = Math.floor(Math.random() * Math.floor(10)) + 0.1
        const recAmount = Math.floor(Math.random() * Math.floor(10)) + 0.1

        asset = asset.toLowerCase()
        denomination = denomination.toLowerCase()

        console.log({
          sendsFromChain: asset, receivesToChain: denomination,
          sendsFromAddress: addresses[asset.toLowerCase()], receivesToAddress: addresses[denomination.toLowerCase()],
          sendsUnit: sendAmount, receivesUnit: priceAbove * sendAmount,
        })

        if (denomination !== 'nrg') {
          await testMaker({sendsFromChain: asset, receivesToChain: denomination,
          sendsFromAddress: addresses[asset.toLowerCase()], receivesToAddress: addresses[denomination.toLowerCase()],
          sendsUnit: sendAmount, receivesUnit: priceAbove * sendAmount})
        }

        await testMaker({sendsFromChain: denomination, receivesToChain: asset,
        sendsFromAddress: addresses[denomination.toLowerCase()], receivesToAddress: addresses[asset.toLowerCase()],
        receivesUnit: recAmount, sendsUnit: priceBelow * recAmount})
      }
    }
  }
}

fillOrderbook()

