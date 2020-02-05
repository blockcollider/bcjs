import BN from 'bn.js'
import { submitTransaction, web3 } from './web3'

const ETH_WEI_MULT = Math.pow(10, 18)

type WEIString = string
interface IETHTransfer {
  from: string,
  to: string,
  value: number,
  timestamp: number,
  height: number,
  txHash: string
}

const TRANSFER_GETTERS = [
  // NOTE: cannot use blockcypher api here because value is a sum of amount and fee
  async (address: string): Promise<IETHTransfer[]> => {
    let res
    try {
      res = await fetch(`https://blockscout.com/eth/mainnet/api?module=account&action=txlist&address=${address}`)
    } catch (e) {
      throw new Error(e)
    }

    if (res.status !== 200) {
      throw new Error(`Response status code: ${res.status}`)
    }

    const jsonResult: {
      status: string,
      result: Array<{
        value: string,
        from: string,
        to: string,
        blockNumber: string,
        hash: string,
        timestamp: string
      }>
    }  = await res.json()

    return jsonResult.result.map(rawTx => ({
      from: rawTx.from,
      to: rawTx.to,
      value: parseInt(rawTx.value, 10),
      timestamp: parseInt(rawTx.timestamp),
      height: parseInt(rawTx.blockNumber, 10),
      txHash: rawTx.hash
    }))

  },
]

const BALANCE_GETTERS = [
  async (address: string): Promise<WEIString> => {
    let res
    try {
      res = await fetch(`https://blockscout.com/eth/mainnet/api?module=account&action=eth_get_balance&address=${address}`)
    } catch (e) {
      throw new Error(e)
    }

    if (res.status !== 200) {
      throw new Error(`Response status code: ${res.status}`)
    }

    const jsonResult: {
      jsonrpc: string,
      result: string,
      id: string
    }  = await res.json()

    return web3.utils.toBN(jsonResult.result).toString()
  },
  // NOTE: cannot use blockcypher api - handles balances as numbers and loses precision
]

export const getETHTransfers = async (addr: string): Promise<IETHTransfer[]> => {
  let lastError
  for (const fn of TRANSFER_GETTERS) {
    try {
      const res = await fn(addr)
      return res
    } catch (e) {
      lastError = e
      continue
    }
  }

  throw new Error(lastError)
}

export const getETHBalance = async (addr: string): Promise<WEIString> => {
  let lastError
  for (const fn of BALANCE_GETTERS) {
    try {
      const res = await fn(addr)
      return res
    } catch (e) {
      lastError = e
      continue
    }
  }

  throw new Error(lastError)
}
// transfers/fees
export const getETHFee = async () => {
}

export const transferETH = async (privateKey, from, to, amount) => {
  const value = web3.utils.toHex(web3.utils.toWei(amount.toString(), 'ether'))
  return new Promise((resolve, reject) => {
    submitTransaction({ from, to, value, data: '0x0', privateKey }, (err, hash) => {
      if (err) {
        reject(err)
      } else {
        resolve(hash)
      }
    })
  })
}
