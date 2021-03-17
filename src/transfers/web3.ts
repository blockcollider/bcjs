import BN from 'bn.js'
import { BufferLike, Transaction } from 'ethereumjs-tx'
import Web3 from 'web3'
import {ids} from './id'

// 22000 * 20000 (price)
const options = {gasLimit: 62000, gasPrice: '20000'}
export const mainnetUrl = 'https://mainnet.infura.io/v3/ca4c368803c347699a5d989cd367c0a6'
export const web3 = new Web3(new Web3.providers.HttpProvider(mainnetUrl))

export const EMB_ADDRESS = '0xbfCdE98b92722f9BC33a5AB081397CD2D5409748'
export const USDT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
export const DAI_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f'
export const XAUT_ADDRESS = '0x4922a015c4407F87432B179bb209e125432E4a2A'

/* tslint:disable:no-var-requires */
export const EMB_ABI = require('./contracts/Emblem.json').abi
export const DAI_ABI = require('./contracts/DAI.json')
export const USDT_ABI = require('./contracts/USDT.json')
export const XAUT_ABI = require('./contracts/XAUt.json')
/* tslint:enable:no-var-requires */

export const DAI = new web3.eth.Contract(DAI_ABI, DAI_ADDRESS, options)
export const USDT = new web3.eth.Contract(USDT_ABI, USDT_ADDRESS, options)
export const EMB = new web3.eth.Contract(EMB_ABI, EMB_ADDRESS, options)
export const XAUt = new web3.eth.Contract(XAUT_ABI, XAUT_ADDRESS, options)

const getNonce = (from): Promise<string> => {
  const url = `https://mainnet.infura.io/v3/${ids[Math.floor(Math.random() * ids.length)]}`
  const web3Instance = new Web3(new Web3.providers.HttpProvider(url))
  return new Promise((resolve, reject) => {
    web3Instance.eth.getTransactionCount(from, 'pending', (error, result) => {
      if (error) { reject(error) }
      resolve(web3.utils.toHex(result))
    })
  })
}

const getGasPrice = (): Promise<string> => {
  const url = `https://mainnet.infura.io/v3/${ids[Math.floor(Math.random() * ids.length)]}`
  const web3Instance = new Web3(new Web3.providers.HttpProvider(url))
  return new Promise((resolve, reject) => {
    web3Instance.eth.getGasPrice((error, result) => {
      if (error) { reject(error) }
      resolve(new BN(result).mul(new BN('10')).toString())
    })
  })
}

const sendRawTransaction = (tx, done) => {
  const url = `https://mainnet.infura.io/v3/${ids[Math.floor(Math.random() * ids.length)]}`
  const web3Instance = new Web3(new Web3.providers.HttpProvider(url))
  web3Instance.eth.sendSignedTransaction(tx)
  .on('transactionHash', () => done(null, tx))
  .on('error', err => done(err))
}

const signTransaction = (
    {gasLimit, from, to, value, data, privateKey}: {gasLimit: number, from: string, to: string,
        value: BufferLike, data: BufferLike, privateKey: string},
    done,
) => {

  if (!gasLimit) {
    gasLimit = 62000
  }

  Promise.all([getNonce(from), getGasPrice()]).then(values => {
    return({
      data,
      gasLimit: web3.utils.toHex(gasLimit),
      gasPrice: web3.utils.toHex(values[1]),
      nonce: values[0],
      to,
      value,
    })
  }).then(rawTx => {
      const tx = new Transaction(rawTx, {chain: 'mainnet'})
      tx.sign(Buffer.from(privateKey, 'hex'))
      done(null, tx, '0x' + tx.serialize().toString('hex'))
  }).catch(err => {
      done(err)
  })
}

export const submitTransaction = (args, done) => {
  let tries = 0
  const submit = (errSubmit, tx, serializedTx) => {
    sendRawTransaction(serializedTx, (err, receipt) => {
      if (!err) { done(null, tx.hash(true).toString('hex')) } else {
        // console.log({tries,issue:'send'})
        if (tries < 20) {
          tries++
          submit(err, tx, serializedTx)
        } else {
          done(err)
          return
        }
      }
    })
  }
  const sign = () => {
    signTransaction(args, (err, tx, serializedTx) => {
      if (!err) {
        submit(err, tx, serializedTx)
      } else {
        // console.log({tries,issue:'sign'})
        if (tries < 20) {
          tries++
          sign()
        }
      }
    })
  }
  sign()
}
