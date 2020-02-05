import Neon, { api as NeonAPI, wallet as NeonWallet } from '@cityofzion/neon-js'
import { wallet } from '@cityofzion/neon-core'
require('es6-promise').polyfill() /* tslint:disable-line */
require('isomorphic-fetch') /* tslint:disable-line */

const NEO_ASSET_HASH = 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b'
interface INEOTransfer {
  to: string,
  from: string,
  timestamp: number,
  value: string,
  height: number,
  txHash: string
}
const TRANSFER_GETTERS = [
  async (address: string): Promise<INEOTransfer[]> => {
    let res
    try {
      res = await fetch(`https://api.neoscan.io/api/main_net/v1/get_address_abstracts/${address}/1`)
    } catch (e) {
      throw new Error(e)
    }

    if (res.status !== 200) {
      throw new Error(`Response status code: ${res.status}`)
    }

    const jsonResult: {
      total_pages: number,
      total_entries: number,
      page_size: number,
      page_number: number,
      entries: Array<{
        txid: string,
        time: number,
        block_height: number,
        asset: string,
        amount: string,
        address_to: string,
        address_from: string // NOTE: can be "claim"
      }>
    } = await res.json()

    let transfers: INEOTransfer[] = []

    for (let tx of jsonResult.entries) {
      if (tx.asset === NEO_ASSET_HASH) {
        transfers.push({
          to: tx.address_to,
          from: tx.address_from,
          timestamp: tx.time,
          value: tx.amount,
          height: tx.block_height,
          txHash: tx.txid
        })
      }
    }

    return transfers
  }
]
export const getTransfers = async (address: string): Promise<INEOTransfer[]> => {
  let lastError
  for (const fn of TRANSFER_GETTERS) {
    try {
      const res = await fn(address)
      return res
    } catch (e) {
      lastError = e
      continue
    }
  }

  throw new Error(lastError)
}

export const getBalance = async (address: string): Promise<number> => {
  let res
  try {
    res = await fetch(`https://api.neoscan.io/api/main_net/v1/get_balance/${address}`)
  } catch (e) {
    throw new Error(e)
  }

  if (res.status !== 200) {
    throw new Error(`Response status code: ${res.status}`)
  }

  const jsonResult: {
    balance: Array<{
      unspent: Array<{
        value: number,
        txid: string,
        asset_symbol: string
      }>
      asset_hash: string,
      asset: string,
      amount: number
    }>,
    address: string
  } = await res.json()

  let neoAmount
  for (const assetBalance of jsonResult.balance) {
    if (assetBalance.asset_hash === NEO_ASSET_HASH) {
      neoAmount = assetBalance.amount
      break
    }
  }

  if (neoAmount === undefined) {
    throw new Error(`Could not find NEO asset, got assets: ${jsonResult.balance.map(a => a.asset)} in response`)
  }

  return neoAmount
}
export const payNEO = async (privateKey: string, from: string, to: string, amount: number) => {
  try {
    const config = {
      account: new wallet.Account(privateKey),
      api: new NeonAPI.neoscan.instance('MainNet'),
      intents: NeonAPI.makeIntent({ NEO: amount }, to),
    }

    return await Neon.sendAsset(config)
  } catch (err) {
    return err
  }
}
