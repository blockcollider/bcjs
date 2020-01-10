'use strict'
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

/* tslint:disable */
require('isomorphic-fetch') // fetch for both node and old browsers
/* tslint:enable */

import RpcClient from '../src/client'
import { createNRGTransferTransaction } from '../src/transaction'
import Wallet from '../src/wallet'

const address = process.env.BC_RPC_ADDRESS || 'https://165.22.69.238:3000'
const scookie = process.env.BC_RPC_SCOOKIE || 'testCookie123'
const client = new RpcClient(address, scookie)
const wallet = new Wallet(client)

const command = process.argv[2]
const bcAddress = process.argv[3].toLowerCase()
const toAddress = process.argv[4].toLowerCase()
const privateKeyHex = process.argv[5]

const notMatchingPk = '3f3e3bf54a604710b0492a1ecbf43ae48d2b4fd8feb5ce619a0835389261aa5b'

async function run (command: string) {
  switch (command) {
    case 'getO':
      const outpoints = await wallet.getSpendableOutpoints(bcAddress)
      console.log(outpoints[outpoints.length - 1])
      break

    case 'tryspend':
      // you have to replace this one with the one got from branch above
      const outPoint = { outpoint:
           { value: '',
                  hash:
                   '',
                  index: 0 },
          callbackScript: '',
          originalScript: '',
          blockHeight: 123 }
      const tx = createNRGTransferTransaction([outPoint], bcAddress, privateKeyHex, toAddress, '1.1', '0')
      console.log(tx.toObject())
      const res = await client.sendTx(tx)
      console.log('sendTx', res)
      break

    default:
      throw new Error(`Unknown command ${command}`)
  }
}

(async function () {
  await run(command)
})()
