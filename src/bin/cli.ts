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
  { option: '--depositLength <depositLength>', description: 'depositLength' },
  { option: '--settleLength <settleLength>', description: 'settleLength' },
  { option: '--sendsFromChain <sendsFromChain>', description: 'sendsFromChain' },
  { option: '--receivesToChain <receivesToChain>', description: 'receivesToChain' },
  { option: '--sendsFromAddress <sendsFromAddress>', description: 'sendsFromAddress' },
  { option: '--receivesToAddress <receivesToAddress>', description: 'receivesToAddress' },
  { option: '--sendsUnit <sendsUnit>', description: 'sendsUnit' },
  { option: '--receivesUnit <receivesUnit>', description: 'receivesUnit' },
  { option: '--bcAddress <bcAddress>', description: 'bcAddress' },
  { option: '--bcPrivateKeyHex <bcPrivateKeyHex>', description: 'bcPrivateKeyHex' },
  { option: '--collateralizedNrg <collateralizedNrg>', description: 'collateralizedNrg' },
  { option: '--nrgUnit <nrgUnit>', description: 'nrgUnit' },
  { option: '--additionalTxFee <additionalTxFee>', description: 'additionalTxFee' },
]
makerOrderParams.forEach(opt => {
  command.requiredOption(opt.option, opt.description)
})
command.action(async cmdObj => {
  const {
    bcRpcAddress, bcRpcScookie,
    sendsFromChain, receivesToChain,
    sendsFromAddress, receivesToAddress,
    sendsUnit, receivesUnit,
    bcAddress, bcPrivateKeyHex,
    collateralizedNrg, nrgUnit, additionalTxFee,
  } = cmdObj

  let {
    shiftMaker, shiftTaker, depositLength, settleLength,
  } = cmdObj
  shiftMaker = parseInt(shiftMaker, 10)
  shiftTaker = parseInt(shiftTaker, 10)
  depositLength = parseInt(depositLength, 10)
  settleLength = parseInt(settleLength, 10)

  const res = await onCreateMakerTx (
    bcRpcAddress, bcRpcScookie,
    shiftMaker, shiftTaker, depositLength, settleLength,
    sendsFromChain, receivesToChain,
    sendsFromAddress, receivesToAddress,
    sendsUnit, receivesUnit,
    bcAddress, bcPrivateKeyHex,
    collateralizedNrg, nrgUnit, additionalTxFee,
  )
  console.log(JSON.stringify(res))
})

command
  .requiredOption('--bcRpcAddress <bcRpcAddress>', 'BlockCollider Rpc Address, e.x.: https://localhost:3000')
  .requiredOption('--bcRpcScookie <bcRpcScookie>', 'BlockCollider Rpc Scookie')

command.parse(process.argv)
