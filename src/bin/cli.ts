import RpcClient from '../client'
import Wallet from '../wallet'

import {
  createMakerOrderTransaction,
  createNRGTransferTransaction,
  createTakerOrderTransaction,
  createUnlockTakerTx,
} from '../transaction'

import { Command } from 'commander'
const command = new Command()
command
  .version('0.1.0')

/*
 * create
 *   maker
 *   taker
 *   transfer
 * get
 *   open_orders
 *   order_books
 *   order_status
 *   account_balance
 *
 */

async function onCreateMakerTx (
  bcRpcAddress: string, bcRpcScookie: string,
  shiftMaker: number, shiftTaker: number, depositLength: number, settleLength: number,
  sendsFromChain: string, receivesToChain: string,
  sendsFromAddress: string, receivesToAddress: string,
  sendsUnit: string, receivesUnit: string,
  bcAddress: string, bcPrivateKeyHex: string,
  collateralizedNrg: string, nrgUnit: string, additionalTxFee: string,
) {
  const fixedUnitFee = '0'
  const client = new RpcClient(bcRpcAddress, bcRpcScookie)
  const wallet = new Wallet(client)

  const spendableOutpointsList = await wallet.getSpendableOutpoints(bcAddress)

  const tx = createMakerOrderTransaction(
    spendableOutpointsList,
    shiftMaker, shiftTaker, depositLength, settleLength,
    sendsFromChain, receivesToChain,
    sendsFromAddress, receivesToAddress,
    sendsUnit, receivesUnit,
    bcAddress, bcPrivateKeyHex,
    collateralizedNrg, nrgUnit, fixedUnitFee, additionalTxFee,
  )
  const res = await client.sendTx(tx)
  return res
}

command.command('create-maker')
const makerOrderParams = [
  { option: '--shiftMaker <shiftMaker>', description: 'shiftMaker' },
  { option: '--shiftTaker <shiftTaker>', description: 'shiftTaker' },
  { option: '--address <address>', description: 'BlockCollider address' },
  // TODO: add more
]
makerOrderParams.forEach(opt => {
  command.requiredOption(opt.option, opt.description)
})
command.action(cmdObj => {
    console.log('remove ', cmdObj.affas, cmdObj.address)
})

command
  .requiredOption('--bcRpcAddress <bcRpcAddress>', 'BlockCollider Rpc Address, e.x.: https://localhost:3000')
  .requiredOption('--bcRpcScookie <bcRpcScookie>', 'BlockCollider Rpc Scookie')

command.parse(process.argv)

