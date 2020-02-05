import bitcoin from 'bitcoinjs-lib'
require('es6-promise').polyfill() /* tslint:disable-line */
require('isomorphic-fetch') /* tslint:disable-line */

const BITCOIN_DIGITS = 8
const BITCOIN_SAT_MULT = Math.pow(10, BITCOIN_DIGITS)

type HexString = string

interface IBtcTransfer {
  height: number,
  from: string,
  to: string,
  timestamp: number,
  value: number,
  txHash: string
}

type FeeName = 'fastest'|'halfHour'|'hour'

const FEE_GETTERS = [
  async function (feeName: FeeName): Promise<number> {
    let res
    try {
      res = await fetch('https://bitcoinfees.earn.com/api/v1/fees/recommended')
    } catch (e) {
      throw new Error(e)
    }

    if (res.status !== 200) {
      throw new Error(`Response status code: ${res.status}`)
    }

    const jsonResult: { fastestFee: number, halfHourFee: number, hourFee: number }  = await res.json()

    return jsonResult[`${feeName}Fee`]
  },
]

const UTXO_GETTERS = [
  async function (addr: string): Promise<Array<{ confirmations: number, satoshis: number, txid: string, vout: number }>> {
    let res
    try {
      res = await fetch(`https://blockexplorer.com/api/addr/${addr}/utxo?noCache=1`, {
        mode: 'cors',
        credentials: 'same-origin',
      })
    } catch (e) {
      throw new Error(e)
    }

    if (res.status !== 200) {
      throw new Error(`Response status code: ${res.status}`)
    }

    const jsonResult = await res.json()

    return jsonResult.data.map(({ confirmations, amount, txid, vout }) => ({
      confirmations,
      satoshis: amount * BITCOIN_SAT_MULT,
      txid,
      vout,
    }))
  },
  async function (addr) {
    let res
    try {
      res = await fetch(`https://blockchain.info/unspent?active=${addr}`, {
        mode: 'cors',
        credentials: 'same-origin',
      })
    } catch (e) {
      throw new Error(e)
    }

    if (res.status !== 200) {
      throw new Error(`Response status code: ${res.status}`)
    }

    const jsonResult = await res.json()

    return jsonResult.data.unspent_outputs.map(({ confirmations, value, tx_hash_big_endian, tx_output_n }) => ({
      confirmations,
      satoshis: value,
      txid: tx_hash_big_endian,
      vout: tx_output_n,
    }))
  },
]

const PUSHTX_FNS = [
  async function (txHex: HexString) {
    const res = await fetch('https://api.blockcypher.com/v1/btc/main/txs/push', {
      body: JSON.stringify({ tx: txHex }),
      headers: { 'Content-Type': 'application/json' },
      method: 'post',
    })

    if (res.status - 200 > 100) {
      throw new Error(`Not successful satus code: ${res.status}, error: ${res.statusText}`)
    }

    return true
  },
  async function (txHex: HexString) {
    const res = await fetch('https://blockchain.info/pushtx', {
      body: `tx=${encodeURIComponent(txHex)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'post',
    })

    if (res.status - 200 > 100) {
      throw new Error(`Not successful satus code: ${res.status}, error: ${res.statusText}`)
    }

    return true
  },
  async function (txHex: HexString) {
    const res = await fetch('https://blockexplorer.com/api/tx/send', {
      body: `rawtx=${encodeURIComponent(txHex)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'post',
    })

    if (res.status - 200 > 100) {
      throw new Error(`Not successful satus code: ${res.status}, error: ${res.statusText}`)
    }

    return true
  },
]

const BALANCE_GETTERS = [
  async (address: string): Promise<number> =>  {
    let res
    try {
      res = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance`)
    } catch (e) {
      throw new Error(e)
    }

    if (res.status !== 200) {
      throw new Error(`Response status code: ${res.status}`)
    }

    const jsonResult = await res.json()

    return jsonResult.final_balance
  }
]

function getTransactionSize (numInputs, numOutputs) {
  return numInputs * 180 + numOutputs * 34 + 10 + numInputs
}

async function getFees (feeName: FeeName): Promise<number> {
  let lastError
  for (const fn of FEE_GETTERS) {
    try {
      const res = await fn(feeName)
      return res
    } catch (e) {
      lastError = e
      continue
    }
  }

  throw new Error(lastError)
}

async function getUtxos (address: HexString) {
  let lastError
  for (const fn of UTXO_GETTERS) {
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

async function pushTx (txHex: HexString) {
  let lastError
  for (const fn of PUSHTX_FNS) {
    try {
      const res = await fn(txHex)
      return res
    } catch (e) {
      lastError = e
      continue
    }
  }

  throw new Error(lastError)
}

async function getBalance (address: string) {
  let lastError
  for (const fn of BALANCE_GETTERS) {
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

async function sendTransaction (options: { from: string, to: string, btc: number, privKeyWIF: string, fee?: FeeName, minConfirmations?: number, dryrun?: boolean, network?: 'mainnet'|'testnet' }) {
  // Required
  if (!options || typeof options !== 'object') {
    throw new Error('Options must be specified and must be an object.')
  }
  if (!options.from) {
    throw new Error('Must specify from address.')
  }
  if (!options.to) {
    throw new Error('Must specify to address.')
  }
  if (!options.btc) {
    throw new Error('Must specify amount of btc to send.')
  }
  if (!options.privKeyWIF) {
    throw new Error("Must specify the wallet's private key in WIF format.")
  }

  // Optionals
  if (!options.fee) {
    options.fee = 'fastest'
  }
  if (!options.minConfirmations) {
    options.minConfirmations = 0
  }

  const { from, to, btc, fee, minConfirmations, privKeyWIF } = options
  const amtSatoshi = Math.floor(btc * BITCOIN_SAT_MULT)
  const bitcoinNetwork = bitcoin.networks.bitcoin

  const feePerByte = await getFees(fee)
  const utxos = await getUtxos(from)

  // Setup inputs from utxos
  const tx = new bitcoin.TransactionBuilder(bitcoinNetwork)
  let ninputs = 0
  let availableSat = 0
  for (const utxo of utxos) {
    if (utxo.confirmations >= minConfirmations) {
      tx.addInput(utxo.txid, utxo.vout)
      availableSat += utxo.satoshis
      ninputs++
      if (availableSat > amtSatoshi) {
        break
      }
    }
  }
  if (availableSat < amtSatoshi) {
    throw new Error('You do not have enough in your wallet to send that much.')
  }

  const change = availableSat - amtSatoshi
  const calculatedFee = getTransactionSize(ninputs, change > 0 ? 2 : 1) * feePerByte
  if (calculatedFee > amtSatoshi) {
    throw new Error('BitCoin amount must be larger than the fee. (Ideally it should be MUCH larger)')
  }
  tx.addOutput(to, amtSatoshi)
  if (change > 0) {
    tx.addOutput(from, change - calculatedFee)
  }
  const keyPair = bitcoin.ECPair.fromWIF(privKeyWIF, bitcoinNetwork)
  for (let i = 0; i < ninputs; i++) {
    try {
      tx.sign(i, keyPair) // FIXME test if should not be ninputs[i]
    } catch (err) {
      console.log(err)
    }
  }
  const txHex = tx.build().toHex()
  const response = await pushTx(txHex)
  if (response === true) { // Created
    return { msg: txHex }
  } else {
    return null
  }
}

export function getTransfers (btcAddress: string): IBtcTransfer {
  return {
    height: 1,
    from: 'a',
    to: 'b',
    timestamp: 12345567888,
    value: 1,
    txHash: 'c',
  }
}

export const transferBTC = async (privKeyWIF, from, to, amount) => {
  try {
    const signed = await sendTransaction({
      from,
      to,
      privKeyWIF,
      btc: amount,
      dryrun: false,
      network: 'mainnet',
    })
    const txid = signed ? bitcoin.Transaction.fromHex(signed.msg).getId() : null
    return txid
  } catch (err) {
    console.log(err)
    throw new Error(err)
  }
}
