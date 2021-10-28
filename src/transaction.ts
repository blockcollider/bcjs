/* tslint:disable */ // FIXME
const Random = require('random-js') // tslint:disable-line
const secp256k1 = require('secp256k1') // tslint:disable-line

import { address, networks } from 'bitcoinjs-lib'
import BN from 'bn.js'
import {Decimal} from 'decimal.js';

import RpcClient from './client'
import * as bcProtobuf from './protos/bc_pb'
import * as coreProtobuf from './protos/core_pb'
import {
  createMakerLockScript,
  createFeedLockScript,
  createNRGLockScript,
  createSignedNRGUnlockInputs,
  createTakerCallbackLockScript,
  createTakerLockScript,
  createTakerUnlockScript,
} from './script/templates'
import {
  COIN_FRACS,
  Currency,
  CurrencyInfo,
  humanToInternalAsBN,
  internalBNToHuman,
  internalToBN,
} from './utils/coin'

import {
  bytesToInternalBN,
  convertProtoBufSerializedBytesToBuffer,
  createOutPoint,
  createTransactionInput,
  getOutputByteLength,
  getOutPointByteLength,
  getInputByteLength,
  createTransactionOutput,
} from './utils/protoUtil'

const constants = require('./constants')
const { blake2bl } = require('./utils/crypto')

type SpendableWalletOutPointObj = coreProtobuf.WalletOutPoint.AsObject

// const BOSON_PER_BYTE = new BN('16600000000000')
const BOSON_PER_BYTE = new Decimal(16600000000000);
const unitBN = humanToInternalAsBN('1', COIN_FRACS.NRG)


export const fromBuffer = function (txBuffer: Buffer|Uint8Array): coreProtobuf.Transaction {
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
export const createMultiNRGTransferTransaction = async function (
  spendableWalletOutPointObjs: SpendableWalletOutPointObj[],
  fromAddress: string,
  privateKeyHex: string,
  toAddress: string[],
  transferAmountNRG: string[],
  txFeeNRG: string,
  addDefaultFee: boolean = true, byteFeeMultiplier: string,
): Promise<coreProtobuf.Transaction|BN> {
  if (toAddress.length !== transferAmountNRG.length) { throw new Error('incorrect length of args') }

  const transferAmountBN = transferAmountNRG.reduce((all, nrg) => {
    return all.add(humanToInternalAsBN(nrg, COIN_FRACS.NRG))
  }, new BN(0))

  const txFeeBN = humanToInternalAsBN(txFeeNRG, COIN_FRACS.NRG)
  const totalAmountBN = transferAmountBN.add(txFeeBN)
  if (privateKeyHex.startsWith('0x')) {
    privateKeyHex = privateKeyHex.slice(2)
  }
  const txOutputs: coreProtobuf.TransactionOutput[] = []
  for (let i = 0; i < toAddress.length; i++) {
    txOutputs.push(createTransactionOutput(
      createNRGLockScript(toAddress[i]), unitBN, humanToInternalAsBN(transferAmountNRG[i], COIN_FRACS.NRG),
    ))
  }

  const nonNRGInputs: coreProtobuf.TransactionInput[] = []

  return await _compileTransaction(
    spendableWalletOutPointObjs, txOutputs, nonNRGInputs, totalAmountBN, fromAddress, privateKeyHex, addDefaultFee, byteFeeMultiplier
  )
}


/*
 * Create NRG (OL) transfer transaction
 * @param spendableWalletOutPointObjs:
 * @param fromAddress: string,
 * @param privateKeyHex: string,
 * @param toAddress: string,
 * @param transferAmount: string,
 * @param txFee: string
 */
export const createNRGTransferTransaction = async function (
  spendableWalletOutPointObjs: SpendableWalletOutPointObj[],
  fromAddress: string,
  privateKeyHex: string,
  toAddress: string,
  transferAmountNRG: string,
  txFeeNRG: string,
  addDefaultFee: boolean = true, byteFeeMultiplier: string
): Promise<coreProtobuf.Transaction|BN>{
  const transferAmountBN = humanToInternalAsBN(transferAmountNRG, COIN_FRACS.NRG)
  const txFeeBN = humanToInternalAsBN(txFeeNRG, COIN_FRACS.NRG)
  const totalAmountBN = transferAmountBN.add(txFeeBN)
  if (privateKeyHex.startsWith('0x')) {
    privateKeyHex = privateKeyHex.slice(2)
  }

  const txOutputs = [
    createTransactionOutput(createNRGLockScript(toAddress), unitBN, transferAmountBN),
  ]
  const nonNRGInputs: coreProtobuf.TransactionInput[] = []

  return await _compileTransaction(
    spendableWalletOutPointObjs, txOutputs, nonNRGInputs, totalAmountBN, fromAddress, privateKeyHex, addDefaultFee, byteFeeMultiplier
  )
}

/*
 * Create Feed Transaction
 * @param spendableWalletOutPointObjs:
 * @param olAddress: string,
 * @param olPrivateKeyHex: string,
 * @param feedAddress: string,
 * @param olAmount: string,
 * @param addDefaultFee: string,
 */
export const createFeedTransaction = async function (
  spendableWalletOutPointObjs: SpendableWalletOutPointObj[],
  olAddress: string,
  olPrivateKeyHex: string,
  feedAddress: string,
  olAmount: string,
  olUnit: string,
  addDefaultFee: boolean = true, byteFeeMultiplier: string,
) {
  if (olPrivateKeyHex.startsWith('0x')) {
    olPrivateKeyHex = olPrivateKeyHex.slice(2)
  }

  const totalAmountBN = humanToInternalAsBN(olAmount, COIN_FRACS.NRG)
  const outputLockScript = createFeedLockScript(olAddress, feedAddress)

  const txOutputs = [
    createTransactionOutput(
      outputLockScript,
      humanToInternalAsBN(olUnit, COIN_FRACS.NRG),
      humanToInternalAsBN(olAmount, COIN_FRACS.NRG),
    )
  ]

  const nonOverlineInputs: coreProtobuf.TransactionInput[] = []

  return await _compileTransaction(
    spendableWalletOutPointObjs, txOutputs, nonOverlineInputs, totalAmountBN, olAddress, olPrivateKeyHex, addDefaultFee, byteFeeMultiplier
  )
}

export const createMakerOrderTransaction = async function (
  spendableWalletOutPointObjs: SpendableWalletOutPointObj[],
  shiftMaker: number, shiftTaker: number, depositLength: number, settleLength: number,
  sendsFromChain: string, receivesToChain: string,
  sendsFromAddress: string, receivesToAddress: string,
  sendsUnit: string, receivesUnit: string,
  bcAddress: string, bcPrivateKeyHex: string,
  collateralizedNrg: string, nrgUnit: string, fixedUnitFee: string, additionalTxFee: string,
  addDefaultFee: boolean = true, byteFeeMultiplier: string,
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

  const totalFeeBN = calculateCrossChainTradeFee(collateralizedNrg, additionalTxFee, 'maker')
  const totalAmountBN = totalFeeBN.add(humanToInternalAsBN(collateralizedNrg, COIN_FRACS.NRG))

  const indivisibleSendsUnit = Currency.toMinimumUnitAsStr(
    sendsFromChain, sendsUnit, CurrencyInfo[sendsFromChain].humanUnit,
  )

  const indivisibleReceivesUnit = Currency.toMinimumUnitAsStr(
    receivesToChain, receivesUnit, CurrencyInfo[receivesToChain].humanUnit,
  )

  if (fixedUnitFee != '') { fixedUnitFee = Currency.toMinimumUnitAsStr(
    'nrg', fixedUnitFee, 'nrg',
  )
  }

  const outputLockScript = createMakerLockScript(
    shiftMaker, shiftTaker, depositLength, settleLength,
    sendsFromChain, receivesToChain,
    sendsFromAddress, receivesToAddress,
    indivisibleSendsUnit, indivisibleReceivesUnit, fixedUnitFee,
    bcAddress,
  )

  const txOutputs = [
    createTransactionOutput(
      outputLockScript,
      humanToInternalAsBN(nrgUnit, COIN_FRACS.NRG),
      humanToInternalAsBN(collateralizedNrg, COIN_FRACS.NRG),
    ),
  ]

  const nonNRGInputs: coreProtobuf.TransactionInput[] = []

  return await _compileTransaction(
    spendableWalletOutPointObjs, txOutputs, nonNRGInputs, totalAmountBN, bcAddress, bcPrivateKeyHex, addDefaultFee, byteFeeMultiplier
  )
}

/*
 * Create Overline Feed update for messages and comments 
 * @param spendableWalletOutPointObjs:
 * @param fromAddress: string,
 * @param privateKeyHex: string,
 * @param toAddress: string,
 * @param transferAmount: string,
 * @param txFee: string
 */
export const createUpdateFeedTransaction = async function (
  spendableWalletOutPointObjs: SpendableWalletOutPointObj[],
  sendsFromAddress: string, 
  receivesToAddress: string,
  channelInfo: {
    doubleHashedBcAddress: string, 
    base: number, 
    fixedUnitFee: string, 
    nrgUnit: string, 
    collateralizedNrg: string, // not necessary here  
    txHash: string, 
    txOutputIndex: number 
  },
  bcAddress: string, 
  bcPrivateKeyHex: string,
  collateralizedNrg: string, 
  additionalTxFee: string,
  addDefaultFee: boolean = true, 
  byteFeeMultiplier: string
) {
  if (bcPrivateKeyHex.startsWith('0x')) {
    bcPrivateKeyHex = bcPrivateKeyHex.slice(2)
  }

  /*
   * This is the create update feed used for messaging and running wireless cross chain transactions 
   */ 
  const fixedUnitFee = channelInfo.fixedUnitFee
  const base = channelInfo.base

  /*
  PROTOBUF FOR UPDATE FEED TX

     message RpcUpdateFeedTransaction {
         string owner_addr = 1;
         string feed_addr = 2;
         string sender_addr = 3;
         string data = 4;
         string data_length = 5;
         string amount = 6;
         string tx_fee = 7;
         string tx_panel = 8;
         string tx_part = 9;
         string tx_nonce = 10;
         string minimum_distance = 11;
         string private_key_hex = 12;
     }
   */

  // if op min unit fixedFee set this amount only equals fixed fee
  const spendingNRG = (base === 1)
    ? humanToInternalAsBN(fixedUnitFee, COIN_FRACS.NRG)
    : humanToInternalAsBN(collateralizedNrg, COIN_FRACS.NRG)

  // this is always 0
  const totalFeeBN = calculateCrossChainTradeFee(collateralizedNrg, additionalTxFee, 'taker')

  const totalAmountBN = totalFeeBN.add(spendingNRG)
  const makerUnitBN = humanToInternalAsBN(channelInfo.nrgUnit, COIN_FRACS.NRG)

  // it may cost to update a feed for a comment
  const makerCollateralBN = humanToInternalAsBN(channelInfo.collateralizedNrg, COIN_FRACS.NRG)

  let takerCollateralBN = humanToInternalAsBN(collateralizedNrg, COIN_FRACS.NRG)

  // modify taker collateral to be = makercollateralBN if it is above
  if (makerCollateralBN.lt(takerCollateralBN)) {
    takerCollateralBN = new BN(makerCollateralBN.toString())
  }

  const makerTxHash = channelInfo.txHash
  const makerTxOutputIndex = channelInfo.txOutputIndex

  // takers input
  const takerInputUnlockScript = createTakerUnlockScript(sendsFromAddress, receivesToAddress)
  const makerTxOutpoint = createOutPoint(makerTxHash, makerTxOutputIndex, makerCollateralBN)
  const nonNRGInputs = [
    createTransactionInput(makerTxOutpoint, takerInputUnlockScript),
  ]

  // takers output
  const outputLockScript = createTakerLockScript(makerTxHash, makerTxOutputIndex, bcAddress)
  const txOutputs = [
    createTransactionOutput(outputLockScript, makerUnitBN, takerCollateralBN.mul(new BN(base.toString()))),
  ]

  if (fixedUnitFee && fixedUnitFee !== '0') {
    const makerFeeScript = ['OP_BLAKE2BLPRIV', channelInfo.doubleHashedBcAddress, 'OP_EQUALVERIFY', 'OP_CHECKSIGNOPUBKEYVERIFY'].join(' ')
    txOutputs.push(createTransactionOutput(
      makerFeeScript,
      makerUnitBN,
      humanToInternalAsBN(fixedUnitFee, COIN_FRACS.NRG),
    ))
  }

  // partial order
  if (makerCollateralBN.gt(takerCollateralBN)) {
    const outputLockScriptCb = createTakerCallbackLockScript(makerTxHash, makerTxOutputIndex)
    txOutputs.push(createTransactionOutput(outputLockScriptCb, makerUnitBN, makerCollateralBN.sub(takerCollateralBN)))
  }

  return await _compileTransaction(
    spendableWalletOutPointObjs, txOutputs, nonNRGInputs, totalAmountBN, bcAddress, bcPrivateKeyHex, addDefaultFee, byteFeeMultiplier
  )
}

export const createTakerOrderTransaction = async function (
  spendableWalletOutPointObjs: SpendableWalletOutPointObj[],
  sendsFromAddress: string, receivesToAddress: string,
  makerOpenOrder: {doubleHashedBcAddress: string, base: number, fixedUnitFee: string, nrgUnit: string, collateralizedNrg: string, txHash: string, txOutputIndex: number },
  bcAddress: string, bcPrivateKeyHex: string,
  collateralizedNrg: string, additionalTxFee: string,
  addDefaultFee: boolean = true, byteFeeMultiplier: string,
) {
  if (bcPrivateKeyHex.startsWith('0x')) {
    bcPrivateKeyHex = bcPrivateKeyHex.slice(2)
  }
  const fixedUnitFee = makerOpenOrder.fixedUnitFee
  const base = makerOpenOrder.base

  // if op min unit fixedFee set this amount only equals fixed fee
  const spendingNRG = (base === 1)
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
    createTransactionInput(makerTxOutpoint, takerInputUnlockScript),
  ]

  // takers output
  const outputLockScript = createTakerLockScript(makerTxHash, makerTxOutputIndex, bcAddress)
  const txOutputs = [
    createTransactionOutput(outputLockScript, makerUnitBN, takerCollateralBN.mul(new BN(base.toString()))),
  ]

  if (fixedUnitFee && fixedUnitFee !== '0') {
    const makerFeeScript = ['OP_BLAKE2BLPRIV', makerOpenOrder.doubleHashedBcAddress, 'OP_EQUALVERIFY', 'OP_CHECKSIGNOPUBKEYVERIFY'].join(' ')
    txOutputs.push(createTransactionOutput(
      makerFeeScript,
      makerUnitBN,
      humanToInternalAsBN(fixedUnitFee, COIN_FRACS.NRG),
    ))
  }

  // partial order
  if (makerCollateralBN.gt(takerCollateralBN)) {
    const outputLockScriptCb = createTakerCallbackLockScript(makerTxHash, makerTxOutputIndex)
    txOutputs.push(createTransactionOutput(outputLockScriptCb, makerUnitBN, makerCollateralBN.sub(takerCollateralBN)))
  }

  return await _compileTransaction(
    spendableWalletOutPointObjs, txOutputs, nonNRGInputs, totalAmountBN, bcAddress, bcPrivateKeyHex, addDefaultFee, byteFeeMultiplier
  )
}

export const createUnlockTakerTx = async function (
  txHash: string, txOutputIndex: number,
  bcAddress: string, privateKeyHex: string,
  unlockTakerTxParams: bcProtobuf.GetUnlockTakerTxParamsResponse.AsObject
): Promise<coreProtobuf.Transaction | null |BN> {

  const unlockScripts = unlockTakerTxParams.unlockScriptsList

  if (unlockScripts.length > 0) {
    if (privateKeyHex.startsWith('0x')) {
      privateKeyHex = privateKeyHex.slice(2)
    }
    const unlockBOSON = internalToBN(convertProtoBufSerializedBytesToBuffer(unlockTakerTxParams.valueInTx as string),
                                     COIN_FRACS.BOSON)
    const outpoint = createOutPoint(txHash, txOutputIndex, unlockBOSON)

    let outputs: coreProtobuf.TransactionOutput[] = []
    if (unlockScripts.length === 2) { // both settled
      outputs = unlockScripts.map(unlockScript => createTransactionOutput(unlockScript, unitBN, unlockBOSON.div(new BN(2))))

    } else { // one party settled
      outputs = [createTransactionOutput(unlockScripts[0], unitBN, unlockBOSON)]
    }

    const tx = _createTxWithOutputsAssigned(outputs)

    const inputs = createSignedNRGUnlockInputs(bcAddress, privateKeyHex, tx, [outpoint])

    tx.setInputsList(inputs)
    tx.setNinCount(inputs.length)
    tx.setHash(_generateTxHash(tx))

    return tx
  } else {
    return null
  }
}

export const calculateCrossChainTradeFee = function (collateralizedNRG: string, additionalTxFee: string, side: 'maker'|'taker'): BN {
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

export const inputsMinusOuputs = function(outPoints: (coreProtobuf.OutPoint|undefined)[], outputs: coreProtobuf.TransactionOutput[]):BN {
  const totalValueIn = outPoints.reduce((valueIn, outPoint) => {
    if (outPoint === undefined) {
        return valueIn
    }
    return valueIn.add(internalToBN(Buffer.from(outPoint.getValue() as Uint8Array), COIN_FRACS.BOSON))
  }, new BN(0))

  const totalValueOut = outputs.reduce((valueOut, output) => {
    return valueOut.add(internalToBN(Buffer.from(output.getValue() as Uint8Array), COIN_FRACS.BOSON))
  }, new BN(0))

  if (totalValueIn.lt(totalValueOut)) {
    throw new Error('Collective input value cannot be less than collective output value')
  }
  return totalValueIn.sub(totalValueOut)
}

export const calcTxFee = (tx: coreProtobuf.Transaction): BN => {
  const inputs = tx.getInputsList()
  // if there are no inputs (this is a coinbase tx)
  if (inputs.length === 0) {
    return new BN(0)
  }

  return inputsMinusOuputs(
    tx.getInputsList().map((o)=>o.getOutPoint()),
    tx.getOutputsList()
  )
}

const _calculateSpentAndLeftoverOutput = function (spendableWalletOutPointObjs: SpendableWalletOutPointObj[], totalAmountBN: BN, feePerByte: BN, bcAddress: string): {
  spentOutPoints: coreProtobuf.OutPoint[], leftoverOutput: coreProtobuf.TransactionOutput,
} {
  let sumBN = new BN(0)
  const spentOutPoints: coreProtobuf.OutPoint[] = []
  let leftoverOutput: coreProtobuf.TransactionOutput = new coreProtobuf.TransactionOutput()
  for (const walletOutPoint of spendableWalletOutPointObjs) {
    const outPointObj: coreProtobuf.OutPoint.AsObject | undefined = walletOutPoint.outpoint
    if (!outPointObj) {
      continue
    }

    const currentBN = internalToBN(convertProtoBufSerializedBytesToBuffer(outPointObj.value as string), COIN_FRACS.BOSON)
    const outPoint = createOutPoint(outPointObj.hash, outPointObj.index, currentBN)

    //update totalAmountBN based on the new outpoint being spent
    let inputFee = (getOutPointByteLength(outPoint).add(new BN(105)).add(new BN(4))).mul(feePerByte)
    totalAmountBN = totalAmountBN.add(inputFee);

    sumBN = sumBN.add(currentBN)
    spentOutPoints.push(outPoint)
    if (sumBN.gt(totalAmountBN)) {
      //calculate the extra output byte fee that will be created due
      let leftover = createTransactionOutput(createNRGLockScript(bcAddress), unitBN, sumBN.sub(totalAmountBN))
      let leftoverFee = getOutputByteLength(leftover).mul(feePerByte);
      if(!sumBN.lt(totalAmountBN.add(leftoverFee))){
        totalAmountBN = totalAmountBN.add(leftoverFee);
        leftoverOutput = createTransactionOutput(createNRGLockScript(bcAddress), unitBN, sumBN.sub(totalAmountBN))
      }
      break;
    } else if (sumBN.eq(totalAmountBN)) {
      break
    }
  }

  if (sumBN.lt(totalAmountBN)) {
    throw new Error('Not enough balance')
  }

  return { spentOutPoints, leftoverOutput }
}

const _createTxWithOutputsAssigned = function (outputs: coreProtobuf.TransactionOutput[]): coreProtobuf.Transaction {
  const tx = new coreProtobuf.Transaction()

  tx.setVersion(constants.txVersion)
  tx.setNonce(`${Math.abs(Random.engines.nativeMath())}`)
  tx.setOutputsList(outputs)
  tx.setNoutCount(outputs.length)
  tx.setLockTime(0)

  return tx
}

const _compileTransaction = async function (
  spendableWalletOutPointObjs: SpendableWalletOutPointObj[],
  txOutputs: coreProtobuf.TransactionOutput[],
  nonNRGinputs: coreProtobuf.TransactionInput[],
  totalAmountBN: BN,
  bcAddress: string,
  bcPrivateKeyHex: string,
  addDefaultFee: boolean = true, byteFeeMultiplier: string,
): Promise<coreProtobuf.Transaction | BN> {

  const {spentOutPoints,finalOutputs} = await calculateOutputsAndOutpoints(
    spendableWalletOutPointObjs, txOutputs, nonNRGinputs,totalAmountBN,
    bcAddress, addDefaultFee, byteFeeMultiplier
  )

  //if privateKey is empty, return the tx fee
  if(bcPrivateKeyHex === ''){
    return inputsMinusOuputs(spentOutPoints,finalOutputs)
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

const calculateOutputsAndOutpoints = async function (
  spendableWalletOutPointObjs: SpendableWalletOutPointObj[],
  txOutputs: coreProtobuf.TransactionOutput[],
  nonNRGinputs: coreProtobuf.TransactionInput[],
  totalAmountBN: BN,
  bcAddress: string,
  addDefaultFee: boolean = true, byteFeeMultiplier: string
) : Promise<{finalOutputs:coreProtobuf.TransactionOutput[],spentOutPoints:coreProtobuf.OutPoint[]}> {

  let feePerByte = new BN(BOSON_PER_BYTE.toString());
  try {
    feePerByte = new BN(BOSON_PER_BYTE.mul(new Decimal(byteFeeMultiplier)).mul(new Decimal(1)).round().toString());
  }
  catch(err){

  }

  let totalAmountWithFeesBN = totalAmountBN
  if (addDefaultFee) {

    //for each output calculate the number of bytes and multiply by the byte fee
    for (const output of txOutputs) {
      const defaultFee = feePerByte.mul(getOutputByteLength(output));
      totalAmountWithFeesBN = totalAmountWithFeesBN.add(defaultFee);
    }

    //for each input calculate the number of bytes of multiple by the byte fee
    for (const input of nonNRGinputs) {
      const defaultFee = feePerByte.mul(getInputByteLength(input));
      totalAmountWithFeesBN = totalAmountWithFeesBN.add(defaultFee);
    }
  }

  const { spentOutPoints, leftoverOutput } = _calculateSpentAndLeftoverOutput(spendableWalletOutPointObjs, totalAmountWithFeesBN, feePerByte, bcAddress)
  let finalOutputs = txOutputs

  if (new BN(leftoverOutput.getValue()).gt(new BN(0))) {
    finalOutputs = txOutputs.concat([leftoverOutput])
  }
  return {spentOutPoints,finalOutputs}
}

const _generateTxHash = function (tx: coreProtobuf.Transaction): string {
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
      input.inputScript,
    ].join('')
  }).join('')

  const outputs = obj.outputsList.map(output => {
    return [
      output.value,
      output.unit,
      output.scriptLength,
      output.outputScript,
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
    outputs,
  ]

  const prehash = blake2bl(parts.join(''))
  const hash = blake2bl(prehash)
  return hash
}
