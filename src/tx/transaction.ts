const Random = require('random-js')
const secp256k1 = require('secp256k1')

import BN from 'bn.js'
import * as bcProtobuf from './../protos/bc_pb'
import * as coreProtobuf from './../protos/core_pb'
import { humanToInternalAsBN, COIN_FRACS, internalToBN, internalBNToHuman, Currency, CurrencyInfo } from './../utils/coin'

const constants = require('./../constants')
const protoUtil = require('./../utils/protoUtil')
const { TimbleScript } = require('./../timble')
const { blake2bl } = require('./../utils/crypto');

type SpendableWalletOutPointObj = coreProtobuf.WalletOutPoint.AsObject

export default class Transaction {

  public inputs: coreProtobuf.TransactionInput.AsObject[]
  public outputs: coreProtobuf.TransactionOutput.AsObject[]
  public hash: string
  public nonce: string
  public lockTime: number

  constructor(data?: Buffer) {
    // TODO: will add fromBuffer method
    this.inputs = []
    this.outputs = []
    this.hash = ''
    this.nonce = ''
    this.lockTime = 0
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
  createNRGTransferTransaction (
    spendableWalletOutPointObjs: SpendableWalletOutPointObj[],
    fromAddress: string,
    privateKeyHex: string,
    toAddress: string,
    transferAmountNRG: string,
    txFeeNRG: string
  ): coreProtobuf.Transaction {
    const transferAmountBN = humanToInternalAsBN(transferAmountNRG, COIN_FRACS.NRG)
    const txFeeBN = humanToInternalAsBN(txFeeNRG, COIN_FRACS.NRG)
    const totalAmountBN = transferAmountBN.add(txFeeBN)
    const unitBN = new BN(1)

    const txOutputs = [
      protoUtil.createTransactionOutput(TimbleScript.createNRGLockScript(toAddress), unitBN, transferAmountBN)
    ]
    const nonNRGInputs: coreProtobuf.TransactionInput[] = []

    return this._compileTransaction(
      spendableWalletOutPointObjs, txOutputs, nonNRGInputs, totalAmountBN, fromAddress, privateKeyHex
    )
  }

  createMakerOrderTransaction(
    spendableWalletOutPointObjs: SpendableWalletOutPointObj[],
    shiftMaker: string, shiftTaker: string, deposit: string, settlement: string,
    sendsFromChain: string, receivesToChain: string,
    sendsFromAddress: string, receivesToAddress: string,
    sendsUnit: string, receivesUnit: string,
    bcAddress: string, bcPrivateKeyHex: string,
    collateralizedNrg: string, nrgUnit:string, additionalTxFee: string
  ) {
    let totalFeeBN = this._calculateCrossChainTradeFee(collateralizedNrg, additionalTxFee,'maker')
    const totalAmountBN = totalFeeBN.add(humanToInternalAsBN(collateralizedNrg, COIN_FRACS.NRG))

    const indivisibleSendsUnit = Currency.toMinimumUnitAsStr(
      sendsFromChain, sendsUnit, CurrencyInfo[sendsFromChain].humanUnit
    )
    const indivisibleReceivesUnit = Currency.toMinimumUnitAsStr(
      receivesToChain, receivesUnit, CurrencyInfo[receivesToChain].humanUnit
    )
    const outputLockScript = TimbleScript.createMakerLockScript(
      shiftMaker,shiftTaker, deposit, settlement,
      sendsFromChain, receivesToChain,
      sendsFromAddress, receivesToAddress,
      indivisibleSendsUnit, indivisibleReceivesUnit,
      bcAddress
    )
    const txOutputs = [
      protoUtil.createTransactionOutput(
        outputLockScript,
        humanToInternalAsBN(nrgUnit, COIN_FRACS.NRG),
        humanToInternalAsBN(collateralizedNrg, COIN_FRACS.NRG)
      )
    ]

    const nonNRGInputs: coreProtobuf.TransactionInput[] = []

    return this._compileTransaction(
      spendableWalletOutPointObjs, txOutputs, nonNRGInputs, totalAmountBN, bcAddress, bcPrivateKeyHex
    )
  }

  createTakerOrderTransaction(
    spendableWalletOutPointObjs: SpendableWalletOutPointObj[],
    sendsFromAddress: string, receivesToAddress: string,
    makerOpenOrder: coreProtobuf.OpenOrder.AsObject,
    bcAddress: string, bcPrivateKeyHex: string,
    collateralizedNrg: string, additionalTxFee: string
  ) {
    const makerOutPoint = makerOpenOrder.outpoint

    if (!makerOutPoint) {
      throw new Error('OutPoint is missing in makerOpenOrder')
    }

    let totalFeeBN = this._calculateCrossChainTradeFee(collateralizedNrg, additionalTxFee, 'taker')
    const totalAmountBN = totalFeeBN.add(humanToInternalAsBN(collateralizedNrg, COIN_FRACS.NRG))

    const makerUnitBN = protoUtil.bytesToInternalBN(makerOpenOrder.unit)
    const makerCollateralBN = protoUtil.bytesToInternalBN(makerOpenOrder.originalValue)

    let takerCollateralBN = humanToInternalAsBN(collateralizedNrg, COIN_FRACS.NRG)
    // modify taker collateral to be = makercollateralBN if it is above
    if (makerCollateralBN.lt(takerCollateralBN)) {
      takerCollateralBN = new BN(makerCollateralBN.toString())
    }

    const makerTxHash = makerOutPoint.hash
    const makerTxOutputIndex = makerOutPoint.index

    // takers input
    const takerInputUnlockScript = TimbleScript.createTakerInputScript(sendsFromAddress, receivesToAddress)
    const makerTxOutpoint = protoUtil.createOutPoint(makerTxHash, makerTxOutputIndex, makerCollateralBN)
    const nonNRGInputs = [
      protoUtil.createTransactionInput(makerTxOutpoint, takerInputUnlockScript)
    ]

    // takers output
    const outputLockScript = TimbleScript.createTakerLockScript(makerTxHash, makerTxOutputIndex, bcAddress)
    const txOutputs = [
      protoUtil.createTransactionOutput(outputLockScript, makerUnitBN, takerCollateralBN.mul(new BN(2)))
    ]

    // partial order
    if (makerCollateralBN.gt(takerCollateralBN)) {
      const outputLockScriptCb = TimbleScript.createTakerCallbackLockScript(makerTxHash, makerTxOutputIndex)
      txOutputs.push(protoUtil.createTransactionOutput(outputLockScriptCb, makerUnitBN, makerCollateralBN.sub(takerCollateralBN)))
    }

    return this._compileTransaction(
      spendableWalletOutPointObjs, txOutputs, nonNRGInputs, totalAmountBN, bcAddress, bcPrivateKeyHex
    )

  }

  _calculateCrossChainTradeFee(collateralizedNRG: string, additionalTxFee: string, side: 'maker'|'taker'): BN {
    const collateralizedBN = humanToInternalAsBN(collateralizedNRG, COIN_FRACS.NRG)

    const txFeeBN = (side === 'maker') ? humanToInternalAsBN('0.002', COIN_FRACS.NRG) : collateralizedBN.div(new BN(1000))

    return txFeeBN.add(humanToInternalAsBN(additionalTxFee, COIN_FRACS.NRG))
  }

  _calculateSpentAndLeftoverOutPoints(spendableWalletOutPointObjs: SpendableWalletOutPointObj[], totalAmountBN: BN): {
    spentOutPoints: coreProtobuf.OutPoint[], leftoverOutPoint: coreProtobuf.OutPoint | null
  } {
    let sumBN = new BN(0)
    const spentOutPoints = []
    let leftoverOutPoint = null
    for (let walletOutPoint of spendableWalletOutPointObjs) {
      const outPointObj: coreProtobuf.OutPoint.AsObject | undefined = walletOutPoint.outpoint
      if (!outPointObj) {
        continue
      }

      const currentBN = internalToBN(protoUtil.convertProtoBufSerializedBytesToNumStr(outPointObj.value), COIN_FRACS.BOSON)

      const outPoint = protoUtil.createOutPoint(outPointObj.hash, outPointObj.index, currentBN)

      sumBN = sumBN.add(currentBN)
      spentOutPoints.push(outPoint)
      if (sumBN.gt(totalAmountBN)) {
        leftoverOutPoint = protoUtil.createOutPoint(outPointObj.hash, outPointObj.index, sumBN.sub(totalAmountBN))
        break
      } else if(sumBN.eq(totalAmountBN)) {
        break
      }
    }

    if (sumBN.lt(totalAmountBN)) {
      throw new Error(`Not enough balance, balance: ${internalBNToHuman(sumBN, COIN_FRACS.NRG)}, required: ${internalBNToHuman(totalAmountBN, COIN_FRACS.NRG)}`)
    }

    return { spentOutPoints: spentOutPoints, leftoverOutPoint: leftoverOutPoint }
  }

  _createTxWithOutputsAssigned(outputs: coreProtobuf.TransactionOutput[]): coreProtobuf.Transaction {
    const tx = new coreProtobuf.Transaction()

    tx.setVersion(constants.txVersion)
    tx.setNonce(`${Math.abs(Random.engines.nativeMath())}`)
    tx.setOutputsList(outputs)
    tx.setNoutCount(outputs.length)
    // TODO: PING, get the latestBlock
    // tx.setLockTime(latestBlock.getHeight() + 1)

    return tx
  }

  _compileTransaction(
    spendableWalletOutPointObjs: SpendableWalletOutPointObj[],
    txOutputs: coreProtobuf.TransactionOutput[],
    nonNRGinputs: coreProtobuf.TransactionInput[],
    totalAmountBN: BN,
    bcAddress: string,
    bcPrivateKeyHex: string
  ): coreProtobuf.Transaction {
    const unitBN = new BN(1)
    // outputs
    const { spentOutPoints, leftoverOutPoint } = this._calculateSpentAndLeftoverOutPoints(spendableWalletOutPointObjs, totalAmountBN)
    let finalOutputs = txOutputs
    if (leftoverOutPoint) {
      const leftoverOutput = protoUtil.createTransactionOutput (
        TimbleScript.createNRGLockScript(bcAddress), unitBN, protoUtil.bytesToInternalBN(leftoverOutPoint.getValue())
      )
      finalOutputs = txOutputs.concat([leftoverOutput])
    }
    // txTemplate with output
    const txTemplate = this._createTxWithOutputsAssigned(finalOutputs)
    // nrg inputs
    const nrgUnlockInputs = TimbleScript.createSignedNRGUnlockInputs(bcAddress, bcPrivateKeyHex, txTemplate, spentOutPoints)
    const finalInputs = nonNRGinputs.concat(nrgUnlockInputs)

    txTemplate.setInputsList(finalInputs)
    txTemplate.setNinCount(finalInputs.length)
    txTemplate.setHash(this._generateTxHash(txTemplate))

    return txTemplate
  }

  _generateTxHash(tx: coreProtobuf.Transaction): string {
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
}
