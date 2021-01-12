import BN from 'bn.js'
import secp256k1 = require('secp256k1')

import * as bcProtobuf from '../protos/bc_pb'
import * as coreProtobuf from '../protos/core_pb'

import { intToBuffer, toBuffer } from '../utils/buffer'
import * as Coin from '../utils/coin'
import { blake2bl, blake2blTwice } from '../utils/crypto'
import { createTransactionInput } from '../utils/protoUtil'
import { normalizeHexString } from '../utils/string'
import { toASM } from './bytecode'

export enum ScriptType {
    NRG_TRANSFER = 'nrg_transfer',
    MAKER_OUTPUT = 'maker_output',
    TAKER_INPUT = 'taker_input',
    TAKER_OUTPUT = 'taker_output',
    TAKER_CALLBACK = 'taker_callback',
    NRG_UNLOCK = 'nrg_unlock',
}

/*
 * @param spendableOutPoint: an outpoint that is to be spent in the tx
 * @param txOutputs: transaction outputs in the transaction that is spending the spendableOutPoint
 * @return a hash signature of spendableOutPoint and txOutputs
 */
function createOutPointOutputsHash (
  spendableOutPoint: coreProtobuf.OutPoint,
  txOutputs: coreProtobuf.TransactionOutput[],
): string {
  const outputsData = txOutputs.map(output => {
    const obj = output.toObject()
    return [
      obj.value,
      obj.unit,
      obj.scriptLength,
      obj.outputScript,
    ].join('')
  }).join('')

  const parts = [
    Coin.internalToHuman(Buffer.from(spendableOutPoint.getValue() as Uint8Array), Coin.COIN_FRACS.NRG),
    spendableOutPoint.getHash(),
    spendableOutPoint.getIndex(),
    outputsData,
  ]

  const hash = blake2bl(parts.join(''))
  return hash
}

// sign data ANY with private key Buffer
// return 65B long signature with recovery number as the last byte
function signData (data: string|Buffer, privateKey: Buffer): Buffer | never {
  data = toBuffer(data)
  const dataHash = blake2bl(data)
  const sig = secp256k1.sign(Buffer.from(dataHash, 'hex'), privateKey)

  if (sig.signature.length !== 64) {
    throw Error(`Signature should always be 64B long, l: ${sig.signature.length}`)
  }
  const signatureWithRecovery = Buffer.concat([
    sig.signature,
    intToBuffer(sig.recovery),
  ])

  return signatureWithRecovery
}

/*
 * @param spendableOutPoint: an outpoint that is to be spent in the tx
 * @param tx: transaction is spending the spendableOutPoint
 * @return a signature of the tx input
 */
export function createUnlockSig (
  spendableOutPoint: coreProtobuf.OutPoint,
  tx: coreProtobuf.Transaction, privateKey: Buffer,
): Buffer | never {
  const dataToSign = generateDataToSignForSig(spendableOutPoint, tx.getOutputsList())
  const sig = signData(dataToSign, privateKey)

  return sig
}

function generateDataToSignForSig (
  spendableOutPoint: coreProtobuf.OutPoint,
  txOutputs: coreProtobuf.TransactionOutput[],
): string {
  return createOutPointOutputsHash(spendableOutPoint, txOutputs)
}

/*
 * Sign transaction inputs of a tx, the signature requires transaction outputs to be set tx before calling this
 * @param bcAddress: BlockCollider address
 * @param bcPrivateKeyHex: BlockCollider private key in hex
 * @param txTemplate: transaction that is spending the spentOutPoints
 * @param spentOutPoints: outPoints to be spent in the txTemplate
 * @return a list of signed transaction inputs
 */
export function createSignedNRGUnlockInputs (
  bcAddress: string, bcPrivateKeyHex: string,
  txTemplate: coreProtobuf.Transaction, spentOutPoints: coreProtobuf.OutPoint[],
): coreProtobuf.TransactionInput[] {
  const txOutputs = txTemplate.getOutputsList()
  if (!txOutputs) {
    throw new Error('outputs has to be set to txTemplate before signing the inputs')
  }

  return spentOutPoints.map(outPoint => {
    const signature = createUnlockSig(outPoint, txTemplate, Buffer.from(bcPrivateKeyHex, 'hex'))
    const pubKey = secp256k1.publicKeyCreate(Buffer.from(bcPrivateKeyHex, 'hex'), true)

    const inputUnlockScript = [
      signature.toString('hex'),
      blake2bl(bcAddress),
    ].map(normalizeHexString).join(' ')

    return createTransactionInput(outPoint, inputUnlockScript)
  })
}

export function createNRGLockScript (address: string, addressDoubleHashed: boolean = false): string {
  address = address.toLowerCase()
  if (!addressDoubleHashed) {
    address = blake2bl(blake2bl(address) + address)
  }
  const script = [
    'OP_BLAKE2BLPRIV',
    normalizeHexString(address),
    'OP_EQUALVERIFY',
    'OP_CHECKSIGNOPUBKEYVERIFY',
  ]
  return script.join(' ')
}

export function parseNRGLockScript (script: Uint8Array): {
  doubleHashedBcAddress: string,
} {
  const scriptStr = toASM(Buffer.from(script), 0x01)

  const doubleHashedBcAddress = scriptStr.split(' ')[1]
  return {
    doubleHashedBcAddress,
  }
}

export function createMakerLockScript (
  shiftMaker: number, shiftTaker: number, depositLength: number, settleLength: number,
  sendsFromChain: string, receivesToChain: string,
  sendsFromAddress: string, receivesToAddress: string,
  sendsUnit: string, receivesUnit: string, fixedUnitFee: string,
  bcAddress: string, addressDoubleHashed: boolean = false,
): string {
  bcAddress = bcAddress.toLowerCase()
  if (!addressDoubleHashed) {
    bcAddress = blake2bl(blake2bl(bcAddress) + bcAddress)
  }
  const unlockMonadScript =
    ['OP_BLAKE2BLPRIV', normalizeHexString(bcAddress), 'OP_EQUALVERIFY', 'OP_CHECKSIGNOPUBKEYVERIFY']
  const depsetArgs = [shiftMaker, shiftTaker, depositLength, settleLength]
  const makerCollArgs = [sendsFromChain, receivesToChain, sendsFromAddress, receivesToAddress, sendsUnit, receivesUnit]

  const script = fixedUnitFee === '' ?
    [
      ['OP_MONOID'], depsetArgs, ['OP_DEPSET'], // 6
      // depset failure - return
      ['OP_0', 'OP_IFEQ', 'OP_RETURN', 'OP_ENDIFEQ'], // 4

      // before deposit period ends - taker can take order
      ['OP_2', 'OP_IFEQ', 'OP_TAKERPAIR', '2', '0', 'OP_MINUNITVALUE', 'OP_RETURN_RESULT', 'OP_ENDIFEQ'], // 8

      // between deposit and settlement - return
      ['OP_3', 'OP_IFEQ', 'OP_RETURN', 'OP_ENDIFEQ'], // 4

      // after settlement period - calculate who sent their asset
      ['OP_DROP'], makerCollArgs, ['OP_MAKERCOLL'], // 8

      // maker succeeded, taker failed - maker can spend
      ['OP_3', 'OP_IFEQ', 'OP_MONAD'], unlockMonadScript, ['OP_ENDMONAD', 'OP_RETURN_RESULT', 'OP_ENDIFEQ'], // 10

      // taker & maker succeeded -  both can spend
      ['OP_2', 'OP_IFEQ', '1', 'OP_MONADSPLIT', 'OP_MONAD'], unlockMonadScript, ['OP_ENDMONAD', 'OP_ENDIFEQ'], // 11

      // taker & maker failed - both can spend
      ['OP_5', 'OP_IFEQ', '1', 'OP_MONADSPLIT', 'OP_MONAD'], unlockMonadScript, ['OP_ENDMONAD', 'OP_ENDIFEQ'], // 11
    ] : // 62
    [
      ['OP_MONOID'], depsetArgs, ['OP_DEPSET'], // 6
      // depset failure - return
      ['OP_0', 'OP_IFEQ', 'OP_RETURN', 'OP_ENDIFEQ'], // 4

      // before deposit period ends - taker can take order and has to pay maker the fixed unit fee
      ['OP_2', 'OP_IFEQ', 'OP_TAKERPAIR', '1', fixedUnitFee, 'OP_MINUNITVALUE', 'OP_MONAD'],
      unlockMonadScript,
      ['OP_ENDMONAD', 'OP_RETURN_RESULT', 'OP_ENDIFEQ'], // 14

      // between deposit and settlement - return
      ['OP_3', 'OP_IFEQ', 'OP_RETURN', 'OP_ENDIFEQ'], // 4

      // after settlement period - calculate who sent their asset
      ['OP_DROP'], makerCollArgs, ['OP_MAKERCOLL'], // 8

      // maker succeed, taker failed - maker can spend
      ['OP_3', 'OP_IFEQ', 'OP_MONAD'], unlockMonadScript, ['OP_ENDMONAD', 'OP_RETURN_RESULT', 'OP_ENDIFEQ'], // 10

      // taker & maker fail - maker can spend
      ['OP_5', 'OP_IFEQ', 'OP_MONAD'], unlockMonadScript, ['OP_ENDMONAD', 'OP_RETURN_RESULT', 'OP_ENDIFEQ'], // 10
    ] // 56
  return script.map(part => part.join(' ')).join(' ')
}

export function parseMakerLockScript (script: Uint8Array): {
    shiftMaker: number,
    shiftTaker: number,
    deposit: number,
    settlement: number,
    sendsFromChain: string,
    receivesToChain: string,
    sendsFromAddress: string,
    receivesToAddress: string,
    sendsUnit: string,
    receivesUnit: string,
    doubleHashedBcAddress: string,
    fixedUnitFee: string,
    base: number,
} {
  const scriptStr = toASM(Buffer.from(script), 0x01)

  const [shiftMaker, shiftTaker, deposit, settlement] = scriptStr.split(' OP_DEPSET ')[0].split(' ').slice(1)
  const [sendsFromChain, receivesToChain, sendsFromAddress, receivesToAddress, sendsUnit, receivesUnit] =
    scriptStr.split(' OP_MAKERCOLL ')[0].split(' OP_DROP ')[1].split(' ')

  const [fixedUnitFee, base] = scriptStr.split(' OP_MINUNITVALUE')[0].split(' ').reverse().slice(0, 2)
  const baseNum = isNaN(parseInt(base, 10)) ? 0 : parseInt(base, 10)

  const splitBy = scriptStr.includes('OP_MONADSPLIT') ?
    ' OP_5 OP_IFEQ 1 OP_MONADSPLIT OP_MONAD OP_BLAKE2BLPRIV ' :
    ' OP_5 OP_IFEQ OP_MONAD OP_BLAKE2BLPRIV '
  const doubleHashedBcAddress = scriptStr.split(splitBy)[1].split(' ')[0]

  /* tslint:disable:object-literal-sort-keys */
  return {
    base: baseNum,
    fixedUnitFee,
    doubleHashedBcAddress,
    receivesToAddress,
    receivesToChain,
    receivesUnit,
    sendsFromAddress,
    sendsFromChain,
    sendsUnit,
    deposit: parseInt(deposit, 10),
    settlement: parseInt(settlement, 10),
    shiftMaker: parseInt(shiftMaker, 10),
    shiftTaker: parseInt(shiftTaker, 10),
  }
  /* tslint:enable:object-literal-sort-keys */
}

export function createTakerUnlockScript (sendsFromAddress: string, receivesToAddress: string): string {
  return [sendsFromAddress, receivesToAddress].join(' ')
}

export function parseTakerUnlockScript (script: Uint8Array): {
  sendsFromAddress: string,
  receivesToAddress: string,
} {
  const scriptStr = toASM(Buffer.from(script), 0x01)
  const [sendsFromAddress, receivesToAddress] = scriptStr.split(' ')

  return {
    receivesToAddress,
    sendsFromAddress,
  }
}

export function createTakerLockScript (
  makerTxHash: string, makerTxOutputIndex: string|number, takerBCAddress: string, addressDoubleHashed: boolean = false,
): string {
  takerBCAddress = takerBCAddress.toLowerCase()
  if (!addressDoubleHashed) {
    takerBCAddress = blake2bl(blake2bl(takerBCAddress) + takerBCAddress)
  }
  const script = [
    [makerTxHash, makerTxOutputIndex, 'OP_CALLBACK'],
    // 4: taker succeed, maker failed, taker can spend the outpoint
    ['4', 'OP_IFEQ', 'OP_MONAD', 'OP_BLAKE2BLPRIV',
      normalizeHexString(takerBCAddress),
      'OP_EQUALVERIFY', 'OP_CHECKSIGNOPUBKEYVERIFY', 'OP_ENDMONAD', 'OP_ENDIFEQ'],
    // this.OP_0() // both failed,
    ['OP_DROP', 'OP_MONAD', 'OP_BLAKE2BLPRIV',
      normalizeHexString(takerBCAddress),
      'OP_EQUALVERIFY', 'OP_CHECKSIGNOPUBKEYVERIFY', 'OP_ENDMONAD'],
  ]
  return script.map(part => part.join(' ')).join(' ')
}

export function parseTakerLockScript (script: Uint8Array): {
  makerTxHash: string,
    makerTxOutputIndex: number,
    doubleHashedBcAddress: string,
} {
  const scriptStr = toASM(Buffer.from(script), 0x01)

  if (scriptStr.indexOf('OP_CALLBACK') === -1) {
    throw new Error('Invalid taker outpout script')
  }
  const [makerTxHash, makerTxOutputIndex] = scriptStr.split(' OP_CALLBACK')[0].split(' ')
  const doubleHashedBcAddress = scriptStr.split(' OP_BLAKE2BLPRIV ')[1].split(' ')[0]

  return {
    doubleHashedBcAddress,
    makerTxHash,
    makerTxOutputIndex: parseInt(makerTxOutputIndex, 10),
  }
}

export function createTakerCallbackLockScript (makerTxHash: string, makerTxOutputIndex: number): string {
  return [makerTxHash, makerTxOutputIndex, 'OP_CALLBACK'].join(' ')
}

export function parseTakerCallbackLockScript (script: Uint8Array): {
  makerTxHash: string,
    makerTxOutputIndex: string,
} {
  const scriptStr = toASM(Buffer.from(script), 0x01)

  const [makerTxHash, makerTxOutputIndex, opCallback] = scriptStr.split(' ')
  return {
    makerTxHash,
    makerTxOutputIndex,
  }
}

export function getScriptType (script: Uint8Array): ScriptType {
  const scriptStr = toASM(Buffer.from(script), 0x01)

  if (scriptStr.startsWith('OP_MONOID')) {
    return ScriptType.MAKER_OUTPUT // IS_MAKER_ORDER
  } else if (scriptStr.endsWith('OP_CALLBACK')) {
    return ScriptType.TAKER_CALLBACK // IS_MAKER_CALLBACK_ORDER
  } else if (scriptStr.indexOf('OP_MONAD') > -1 && scriptStr.indexOf('OP_CALLBACK') > -1) {
    return ScriptType.TAKER_OUTPUT // IS_TAKER_ORDER
  } else if (scriptStr.startsWith('OP_BLAKE2BLPRIV')) {
    return ScriptType.NRG_TRANSFER // IS_NRG_TRANSFER
  } else if (scriptStr.split(' ').length === 2) {
    return ScriptType.TAKER_INPUT
  } else {
    return ScriptType.NRG_UNLOCK
  }
}
