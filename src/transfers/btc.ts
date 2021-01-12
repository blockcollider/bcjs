require('isomorphic-fetch') /* tslint:disable-line */
import * as bitcoin from 'bitcoinjs-lib'
import request from 'superagent'

const BITCOIN_DIGITS = 8
const BITCOIN_SAT_MULT = Math.pow(10, BITCOIN_DIGITS)

export const providers = {
  fees: {
    mainnet: {
      earn: feeName => {
        return fetch('https://bitcoinfees.earn.com/api/v1/fees/recommended')
          .then(response => response.json())
          .then(response => {
            return response[feeName + 'Fee']
          })
      },
    },
  },
  pushtx: {
    mainnet: {
      blockchain: hexTrans => {
        return request
          .post('https://blockchain.info/pushtx')
          .send('tx=' + hexTrans)
      },
      blockcypher: hexTrans => {
        return request
          .post('https://api.blockcypher.com/v1/btc/main/txs/push')
          .send('{"tx":"' + hexTrans + '"}')
      },
      blockexplorer: hexTrans => {
        return request
          .post('https://blockexplorer.com/api/tx/send')
          .send('rawtx=' + hexTrans)
      },
    },
  },
  utxo: {
    mainnet: {
      blockchain: addr => {
        return fetch(`https://blockchain.info/unspent?active=${addr}`, {
            mode: 'cors',
          })
          .then(res => res.json())
          .then(res => {
            return res.unspent_outputs.map(e => {
              return {
                confirmations: e.confirmations,
                satoshis: e.value,
                txid: e.tx_hash_big_endian,
                vout: e.tx_output_n,
              }
            })
          })
      },
      blockexplorer: addr => {
        return fetch(
            `https://blockexplorer.com/api/addr/${addr}/utxo?noCache=1`,
            { mode: 'cors' },
          )
          .then(res => res.json())
          .then(res => {
            return res.map(e => {
              return {
                confirmations: e.confirmations,
                satoshis: e.satoshis,
                txid: e.txid,
                vout: e.vout,
              }
            })
          })
      },
    },
  },
}

function getTransactionSize (numInputs, numOutputs) {
  return numInputs * 180 + numOutputs * 34 + 10 + numInputs
}

function getFees (provider, feeName) {
  if (typeof feeName === 'number') {
    return Promise.resolve(feeName)
  } else {
    return provider(feeName)
  }
}

async function sendTransaction (options) {
  // Required
  if (options == null || typeof options !== 'object') {
    throw new Error('Options must be specified and must be an object.')
  }
  if (options.from == null) {
    throw new Error('Must specify from address.')
  }
  if (options.to == null) {
    throw new Error('Must specify to address.')
  }
  if (options.btc == null) {
    throw new Error('Must specify amount of btc to send.')
  }
  if (options.privKeyWIF == null) {
    throw new Error("Must specify the wallet's private key in WIF format.")
  }

  // Optionals
  if (options.network == null) {
    options.network = 'mainnet'
  }
  if (options.fee == null) {
    options.fee = 'fastest'
  }
  if (options.feesProvider == null) {
    options.feesProvider = providers.fees[options.network].earn
  }
  if (options.utxoProvider == null) {
    options.utxoProvider = providers.utxo[options.network].blockchain
  }
  if (options.pushtxProvider == null) {
    options.pushtxProvider = providers.pushtx[options.network].blockchain
  }
  if (options.minConfirmations == null) {
    options.minConfirmations = 0
  }

  const from = options.from
  const to = options.to
  const amount = options.btc
  const amtSatoshi = Math.floor(amount * BITCOIN_SAT_MULT)
  const bitcoinNetwork = bitcoin.networks.bitcoin

  return Promise.all([
    getFees(options.feesProvider, options.fee),
    options.utxoProvider(from),
  ]).then(async res => {
    const feePerByte = res[0]
    const utxos = res[1]
    // Setup inputs from utxos
    const tx = new bitcoin.TransactionBuilder(bitcoinNetwork)
    let ninputs = 0
    let availableSat = 0
    for (const utxo of utxos) {
      if (utxo.confirmations >= options.minConfirmations) {
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
    const fee = getTransactionSize(ninputs, change > 0 ? 2 : 1) * feePerByte
    if (fee > amtSatoshi) {
      throw new Error('BitCoin amount must be larger than the fee. (Ideally it should be MUCH larger)')
    }
    tx.addOutput(to, amtSatoshi)
    if (change > 0) {
      tx.addOutput(from, change - fee)
    }
    const keyPair = bitcoin.ECPair.fromWIF(options.privKeyWIF, bitcoinNetwork)
    for (let i = 0; i < ninputs; i++) {
      try {
        tx.sign(i, keyPair)
      } catch (err) {
        console.log({ err }) // tslint:disable-line:no-console
      }
    }
    const msg = tx.build().toHex()
    const req = await request
      .post('https://api.blockcypher.com/v1/btc/main/txs/push')
      .send('{"tx":"' + msg + '"}')
    if (req.statusText === 'Created') {
      return { msg }
    } else {
      return null
    }
  })
}

export const transferBTC = async (privKeyWIF, from, to, amount) => {
  try {
    const signed = await sendTransaction({
      btc: amount,
      dryrun: false,
      from,
      network: 'mainnet',
      privKeyWIF,
      to,
    })
    const txid = signed ? bitcoin.Transaction.fromHex(signed.msg).getId() : null
    return txid
  } catch (err) {
    console.log({ err }) // tslint:disable-line:no-console
    return err
  }
}
