//@ts-ignore
// 'use strict'
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

/* tslint:disable */
require('isomorphic-fetch') // fetch for both node and old browsers
/* tslint:enable */
import * as fs from 'fs'
import BN from 'bn.js'
import {Decimal} from 'decimal.js';

const assetPrices = [
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

  // {asset: 'EMB', denomination: 'NRG', price: 0},
  // {asset: 'USDT', denomination: 'NRG', price: 0},
  // {asset: 'DAI', denomination: 'NRG', price: 0},
  // {asset: 'BTC', denomination: 'NRG', price: 0},
  // {asset: 'ETH', denomination: 'NRG', price: 0},
  // {asset: 'NEO', denomination: 'NRG', price: 0},
  // {asset: 'WAV', denomination: 'NRG', price: 0},
  // {asset: 'LSK', denomination: 'NRG', price: 0},
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

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export default async function getPrices() {
  const jsonData: { usdt: number, dai: number, emb: number, nrg: number, btc: number, wav: number, eth: number, neo: number, lsk:number }
    = {usdt: 1, dai: 1, emb: 100, nrg: 0.1, btc:0,wav:0,lsk:0,eth:0,neo:0}

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
    assetPrice.price = new Decimal(Math.round(
      (jsonData[asset.toLowerCase()] / jsonData[denomination.toLowerCase()]) * Math.pow(10, 8),
    )).div(new Decimal(Math.pow(10, 8))).toNumber()
  }

  fs.writeFile('prices.json', JSON.stringify(jsonData, null, 4), (err) => err)
  fs.writeFile('assetPrices.json', JSON.stringify({assetPrices}, null, 4), (err) => err)
  return {assetPrices,jsonData}
}
