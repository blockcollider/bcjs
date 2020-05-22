const Random = require('random-js')
const secp256k1 = require('secp256k1')

import BN from 'bn.js'
import { address, networks } from 'bitcoinjs-lib'

import * as bcProtobuf from './protos/bc_pb'
import * as coreProtobuf from './protos/core_pb'
import {
  createNRGLockScript,
  createMakerLockScript,
  createTakerUnlockScript,
  createTakerLockScript,
  createTakerCallbackLockScript,
  createSignedNRGUnlockInputs
}  from './script/templates'
import RpcClient from './client'
import {
  humanToInternalAsBN,
  COIN_FRACS,
  internalToBN,
  internalBNToHuman,
  Currency,
  CurrencyInfo
} from './utils/coin'
import {
  bytesToInternalBN,
  createOutPoint,
  createTransactionInput,
  createTransactionOutput,
  convertProtoBufSerializedBytesToBuffer
} from './utils/protoUtil'

const constants = require('./constants')
const { blake2bl } = require('./utils/crypto')

type SpendableWalletOutPointObj = coreProtobuf.WalletOutPoint.AsObject

const BOSON_PER_BYTE = new BN('16600000000000')

export const fromBuffer = function(txBuffer: Buffer|Uint8Array): coreProtobuf.Transaction {
  return coreProtobuf.Transaction.deserializeBinary(txBuffer)
}

function validateBtcAddress (btcAddress: string) {
  let decoded
  try {
    decoded = address.fromBase58Check(btcAddress)
  } catch (e) {
    return new Error(`Invalid BTC (not base58) address ${btcAddress}`)
  }

  // TODO networks constant has to change according to used Bitcoin network
  if (decoded.version === undefined || decoded.version !== networks.bitcoin.pubKeyHash) {
    return new Error(`Not P2PKH BTC address ${btcAddress}`)
  }

  return false
}
/*
 * Create NRG transfer transaction
 * @param spendableWalletOutPointObjs:
 * @param fromAddress: string,
 * @param privateKeyHex: string,
 * @param toAddress: string,
 * @param transferAmount: string,
 * @param txFee: string
 */
export const createMultiNRGTransferTransaction = function(
  spendableWalletOutPointObjs: SpendableWalletOutPointObj[],
  fromAddress: string,
  privateKeyHex: string,
  toAddress: Array<string>,
  transferAmountNRG: Array<string>,
  txFeeNRG: string,
  addDefaultFee: boolean = true
): coreProtobuf.Transaction {
  if(toAddress.length != transferAmountNRG.length) throw new Error('incorrect length of args');

  const transferAmountBN = transferAmountNRG.reduce((all,nrg)=>{
    return all.add(humanToInternalAsBN(nrg, COIN_FRACS.NRG))
  },new BN(0))

  const txFeeBN = humanToInternalAsBN(txFeeNRG, COIN_FRACS.NRG)
  const totalAmountBN = transferAmountBN.add(txFeeBN)
  const unitBN = humanToInternalAsBN('1', COIN_FRACS.NRG)
  if (privateKeyHex.startsWith('0x')) {
    privateKeyHex = privateKeyHex.slice(2)
  }
  let txOutputs: coreProtobuf.TransactionOutput[] = [];
  for(let i = 0; i < toAddress.length; i++){
    txOutputs.push(createTransactionOutput(createNRGLockScript(toAddress[i]), unitBN, humanToInternalAsBN(transferAmountNRG[i], COIN_FRACS.NRG)))
  }

  const nonNRGInputs: coreProtobuf.TransactionInput[] = []

  return _compileTransaction(
    spendableWalletOutPointObjs, txOutputs, nonNRGInputs, totalAmountBN, fromAddress, privateKeyHex, addDefaultFee
  )
}

/*
 * Create NRG transfer transaction
 * @param spendableWalletOutPointObjs:
 * @param fromAddress: string,
 * @param privateKeyHex: string,
 * @param toAddress: string,
 * @param transferAmount: string,
 * @param txFee: string
 */
export const createNRGTransferTransaction = function(
  spendableWalletOutPointObjs: SpendableWalletOutPointObj[],
  fromAddress: string,
  privateKeyHex: string,
  toAddress: string,
  transferAmountNRG: string,
  txFeeNRG: string,
  addDefaultFee: boolean = true
): coreProtobuf.Transaction {
  const transferAmountBN = humanToInternalAsBN(transferAmountNRG, COIN_FRACS.NRG)
  const txFeeBN = humanToInternalAsBN(txFeeNRG, COIN_FRACS.NRG)
  const totalAmountBN = transferAmountBN.add(txFeeBN)
  const unitBN = humanToInternalAsBN('1', COIN_FRACS.NRG)
  if (privateKeyHex.startsWith('0x')) {
    privateKeyHex = privateKeyHex.slice(2)
  }

  const txOutputs = [
    createTransactionOutput(createNRGLockScript(toAddress), unitBN, transferAmountBN)
  ]
  const nonNRGInputs: coreProtobuf.TransactionInput[] = []

  return _compileTransaction(
    spendableWalletOutPointObjs, txOutputs, nonNRGInputs, totalAmountBN, fromAddress, privateKeyHex, addDefaultFee
  )
}

export const createMakerOrderTransaction = function(
  spendableWalletOutPointObjs: SpendableWalletOutPointObj[],
  shiftMaker: number, shiftTaker: number, depositLength: number, settleLength: number,
  sendsFromChain: string, receivesToChain: string,
  sendsFromAddress: string, receivesToAddress: string,
  sendsUnit: string, receivesUnit: string,
  bcAddress: string, bcPrivateKeyHex: string,
  collateralizedNrg: string, nrgUnit:string, fixedUnitFee:string, additionalTxFee: string,
  addDefaultFee: boolean = true
) {
  if (bcPrivateKeyHex.startsWith('0x')) {
    bcPrivateKeyHex = bcPrivateKeyHex.slice(2)
  }
  sendsFromChain = sendsFromChain.toLowerCase()
  receivesToChain = receivesToChain.toLowerCase()

  let err
  if (sendsFromChain === 'btc') {
    err = validateBtcAddress(sendsFromAddress)
  }

  if (receivesToChain === 'btc') {
    err = validateBtcAddress(receivesToAddress)
  }

  if (err) {
    throw err
  }

  let totalFeeBN = calculateCrossChainTradeFee(collateralizedNrg, additionalTxFee,'maker')
  const totalAmountBN = totalFeeBN.add(humanToInternalAsBN(collateralizedNrg, COIN_FRACS.NRG))

  const indivisibleSendsUnit = Currency.toMinimumUnitAsStr(
    sendsFromChain, sendsUnit, CurrencyInfo[sendsFromChain].humanUnit
  )

  const indivisibleReceivesUnit = Currency.toMinimumUnitAsStr(
    receivesToChain, receivesUnit, CurrencyInfo[receivesToChain].humanUnit
  )

  if(fixedUnitFee != '') fixedUnitFee = Currency.toMinimumUnitAsStr(
    'nrg', fixedUnitFee, 'nrg'
  )

  const outputLockScript = createMakerLockScript(
    shiftMaker, shiftTaker, depositLength, settleLength,
    sendsFromChain, receivesToChain,
    sendsFromAddress, receivesToAddress,
    indivisibleSendsUnit, indivisibleReceivesUnit,fixedUnitFee,
    bcAddress
  )

  const txOutputs = [
    createTransactionOutput(
      outputLockScript,
      humanToInternalAsBN(nrgUnit, COIN_FRACS.NRG),
      humanToInternalAsBN(collateralizedNrg, COIN_FRACS.NRG)
    )
  ]

  const nonNRGInputs: coreProtobuf.TransactionInput[] = []

  return _compileTransaction(
    spendableWalletOutPointObjs, txOutputs, nonNRGInputs, totalAmountBN, bcAddress, bcPrivateKeyHex, addDefaultFee
  )
}

export const createTakerOrderTransaction = function(
  spendableWalletOutPointObjs: SpendableWalletOutPointObj[],
  sendsFromAddress: string, receivesToAddress: string,
  makerOpenOrder: {doubleHashedBcAddress:string,base:number, fixedUnitFee: string, nrgUnit: string, collateralizedNrg: string, txHash: string, txOutputIndex: number },
  bcAddress: string, bcPrivateKeyHex: string,
  collateralizedNrg: string, additionalTxFee: string,
  addDefaultFee: boolean = true
) {
  if (bcPrivateKeyHex.startsWith('0x')) {
    bcPrivateKeyHex = bcPrivateKeyHex.slice(2)
  }
  let fixedUnitFee = makerOpenOrder.fixedUnitFee
  let base = makerOpenOrder.base

  // if op min unit fixedFee set this amount only equals fixed fee
  let spendingNRG = (fixedUnitFee !== '0')
    ? humanToInternalAsBN(fixedUnitFee, COIN_FRACS.NRG)
    : humanToInternalAsBN(collateralizedNrg, COIN_FRACS.NRG)

  const totalFeeBN = calculateCrossChainTradeFee(collateralizedNrg, additionalTxFee, 'taker')
  const totalAmountBN = totalFeeBN.add(spendingNRG)

  const makerUnitBN = humanToInternalAsBN(makerOpenOrder.nrgUnit, COIN_FRACS.NRG)
  const makerCollateralBN = humanToInternalAsBN(makerOpenOrder.collateralizedNrg, COIN_FRACS.NRG)

  let takerCollateralBN = humanToInternalAsBN(collateralizedNrg, COIN_FRACS.NRG)
  // modify taker collateral to be = makercollateralBN if it is above
  if (makerCollateralBN.lt(takerCollateralBN)) {
    takerCollateralBN = new BN(makerCollateralBN.toString())
  }

  const makerTxHash = makerOpenOrder.txHash
  const makerTxOutputIndex = makerOpenOrder.txOutputIndex

  // takers input
  const takerInputUnlockScript = createTakerUnlockScript(sendsFromAddress, receivesToAddress)
  const makerTxOutpoint = createOutPoint(makerTxHash, makerTxOutputIndex, makerCollateralBN)
  const nonNRGInputs = [
    createTransactionInput(makerTxOutpoint, takerInputUnlockScript)
  ]

  // takers output
  const outputLockScript = createTakerLockScript(makerTxHash, makerTxOutputIndex, bcAddress)
  const txOutputs = [
    createTransactionOutput(outputLockScript, makerUnitBN, takerCollateralBN.mul(new BN(base.toString())))
  ]

  if (fixedUnitFee && fixedUnitFee !== '0') {
    const makerFeeScript = ['OP_BLAKE2BLPRIV',makerOpenOrder.doubleHashedBcAddress,'OP_EQUALVERIFY','OP_CHECKSIGNOPUBKEYVERIFY'].join(' ')
    txOutputs.push(createTransactionOutput(
      makerFeeScript,
      makerUnitBN,
      humanToInternalAsBN(fixedUnitFee, COIN_FRACS.NRG)
    ))
  }

  // partial order
  if (makerCollateralBN.gt(takerCollateralBN)) {
    const outputLockScriptCb = createTakerCallbackLockScript(makerTxHash, makerTxOutputIndex)
    txOutputs.push(createTransactionOutput(outputLockScriptCb, makerUnitBN, makerCollateralBN.sub(takerCollateralBN)))
  }

  return _compileTransaction(
    spendableWalletOutPointObjs, txOutputs, nonNRGInputs, totalAmountBN, bcAddress, bcPrivateKeyHex, addDefaultFee
  )
}

export const createUnlockTakerTx = async function(
  txHash: string, txOutputIndex: number,
  bcAddress: string, privateKeyHex: string,
  bcClient: RpcClient
): Promise<coreProtobuf.Transaction | null> {
  const req = new bcProtobuf.GetUnlockTakerTxParamsRequest()
  req.setTxHash(txHash)
  req.setTxOutputIndex(txOutputIndex)
  const unlockTakerTxParams = await bcClient.getUnlockTakerTxParams(req)
  const unlockScripts = unlockTakerTxParams.unlockScriptsList

  if (unlockScripts.length > 0) {
    if (privateKeyHex.startsWith('0x')) {
      privateKeyHex = privateKeyHex.slice(2)
    }
    const unlockBOSON = internalToBN(convertProtoBufSerializedBytesToBuffer(unlockTakerTxParams.valueInTx as string),
                                     COIN_FRACS.BOSON)
    const unitBN = humanToInternalAsBN('1', COIN_FRACS.NRG)

    let outputs: coreProtobuf.TransactionOutput[] = []
    if (unlockScripts.length === 2) { // both settled
      outputs = unlockScripts.map(unlockScript => createTransactionOutput(unlockScript, unitBN, unlockBOSON.div(new BN(2))))
    } else { // one party settled
      outputs = [createTransactionOutput(unlockScripts[0], unitBN, unlockBOSON)]
    }

    const tx = _createTxWithOutputsAssigned(outputs)

    const outpoint = createOutPoint(txHash, txOutputIndex, unlockBOSON)
    const inputs = createSignedNRGUnlockInputs(bcAddress, privateKeyHex, tx, [outpoint])

    tx.setInputsList(inputs)
    tx.setNinCount(inputs.length)
    tx.setHash(_generateTxHash(tx))

    return tx
  } else {
    return null
  }
}

export const calculateCrossChainTradeFee = function(collateralizedNRG: string, additionalTxFee: string, side: 'maker'|'taker'): BN {
  return new BN(0)

  // const collateralizedBN = humanToInternalAsBN(collateralizedNRG, COIN_FRACS.NRG)
  //
  // const txFeeBN = (side === 'maker') ? humanToInternalAsBN('0.002', COIN_FRACS.NRG) : collateralizedBN.div(new BN(1000))
  //
  // if (additionalTxFee != '0') {
  //   return txFeeBN.add(humanToInternalAsBN(additionalTxFee, COIN_FRACS.NRG))
  // } else {
  //   return txFeeBN
  // }
}

export const calcTxFee = (tx: coreProtobuf.Transaction): BN => {
  const inputs = tx.getInputsList()
  // if there are no inputs (this is a coinbase tx)
  if (inputs.length === 0) {
    return new BN(0)
  }

  const totalValueIn = inputs.reduce((valueIn, input) => {
    const outPoint = input.getOutPoint()
    if (outPoint === undefined) {
        return valueIn
    }
    return valueIn.add(internalToBN(Buffer.from(outPoint.getValue() as Uint8Array), COIN_FRACS.BOSON))
  }, new BN(0))

  const outputs = tx.getOutputsList()
  const totalValueOut = outputs.reduce((valueOut, output) => {
    return valueOut.add(internalToBN(Buffer.from(output.getValue() as Uint8Array), COIN_FRACS.BOSON))
  }, new BN(0))

  if(totalValueIn.lt(totalValueOut)){
    throw new Error('Collective input value cannot be less than collective output value')
  }
  return totalValueIn.sub(totalValueOut)
}

const _calculateSpentAndLeftoverOutPoints = function(spendableWalletOutPointObjs: SpendableWalletOutPointObj[], totalAmountBN: BN): {
  spentOutPoints: coreProtobuf.OutPoint[], leftoverOutPoint: coreProtobuf.OutPoint | null
} {
  let sumBN = new BN(0)
  const spentOutPoints:coreProtobuf.OutPoint[] = []
  let leftoverOutPoint:coreProtobuf.OutPoint = new coreProtobuf.OutPoint()
  for (let walletOutPoint of spendableWalletOutPointObjs) {
    const outPointObj: coreProtobuf.OutPoint.AsObject | undefined = walletOutPoint.outpoint
    if (!outPointObj) {
      continue
    }

    const currentBN = internalToBN(convertProtoBufSerializedBytesToBuffer(outPointObj.value as string), COIN_FRACS.BOSON)

    const outPoint = createOutPoint(outPointObj.hash, outPointObj.index, currentBN)

    sumBN = sumBN.add(currentBN)
    spentOutPoints.push(outPoint)
    if (sumBN.gt(totalAmountBN)) {
      leftoverOutPoint = createOutPoint(outPointObj.hash, outPointObj.index, sumBN.sub(totalAmountBN))
      break
    } else if(sumBN.eq(totalAmountBN)) {
      break
    }
  }

  if (sumBN.lt(totalAmountBN)) {
    throw new Error(`Not enough balance`)
  }

  return { spentOutPoints: spentOutPoints, leftoverOutPoint: leftoverOutPoint }
}

const _createTxWithOutputsAssigned = function(outputs: coreProtobuf.TransactionOutput[]): coreProtobuf.Transaction {
  const tx = new coreProtobuf.Transaction()

  tx.setVersion(constants.txVersion)
  tx.setNonce(`${Math.abs(Random.engines.nativeMath())}`)
  tx.setOutputsList(outputs)
  tx.setNoutCount(outputs.length)
  tx.setLockTime(0)

  return tx
}

const _compileTransaction = function(
  spendableWalletOutPointObjs: SpendableWalletOutPointObj[],
  txOutputs: coreProtobuf.TransactionOutput[],
  nonNRGinputs: coreProtobuf.TransactionInput[],
  totalAmountBN: BN,
  bcAddress: string,
  bcPrivateKeyHex: string,
  addDefaultFee: boolean = true
): coreProtobuf.Transaction {
  const unitBN = humanToInternalAsBN('1', COIN_FRACS.NRG)

  let totalAmountWithFeesBN = totalAmountBN
  if (addDefaultFee) {
    for (const output of txOutputs) {
      const defaultTxFee = BOSON_PER_BYTE.mul(new BN(output.getScriptLength()))
      totalAmountWithFeesBN = totalAmountWithFeesBN.add(defaultTxFee)
    }
  }
  // outputs
  const { spentOutPoints, leftoverOutPoint } = _calculateSpentAndLeftoverOutPoints(spendableWalletOutPointObjs, totalAmountWithFeesBN)
  let finalOutputs = txOutputs
  if (leftoverOutPoint && bytesToInternalBN(leftoverOutPoint.getValue() as Uint8Array).gt(new BN(0))) {
    const leftoverOutput = createTransactionOutput (
      createNRGLockScript(bcAddress), unitBN, bytesToInternalBN(leftoverOutPoint.getValue() as Uint8Array)
    )
    finalOutputs = txOutputs.concat([leftoverOutput])
  }

  // txTemplate with output
  const txTemplate = _createTxWithOutputsAssigned(finalOutputs)
  // nrg inputs
  const nrgUnlockInputs = createSignedNRGUnlockInputs(bcAddress, bcPrivateKeyHex, txTemplate, spentOutPoints)
  const finalInputs = nonNRGinputs.concat(nrgUnlockInputs)

  txTemplate.setInputsList(finalInputs)
  txTemplate.setNinCount(finalInputs.length)
  txTemplate.setHash(_generateTxHash(txTemplate))

  return txTemplate
}

const _generateTxHash = function(tx: coreProtobuf.Transaction): string {
  const obj = tx.toObject()
  const inputs = obj.inputsList.map(input => {
    const outPoint = input.outPoint
    if (!outPoint) {
      throw new Error('Invalid tx, the outPoint should not be undefined')
    }
    return [
      outPoint.value,
      outPoint.hash,
      outPoint.index,
      input.scriptLength,
      input.inputScript
    ].join('')
  }).join('')

  const outputs = obj.outputsList.map(output => {
    return [
      output.value,
      output.unit,
      output.scriptLength,
      output.outputScript
    ].join('')
  }).join('')

  const parts = [
    obj.version,
    obj.nonce,
    obj.overline,
    obj.ninCount,
    obj.noutCount,
    obj.lockTime,
    inputs,
    outputs
  ]

  const prehash = blake2bl(parts.join(''))
  const hash = blake2bl(prehash)
  return hash
}
