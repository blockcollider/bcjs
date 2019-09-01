import BN from 'bn.js'
import * as coreProtobuf from './../protos/core_pb'

import { humanToInternalAsBN, COIN_FRACS, internalToBN } from './coin'

export const bnToBytes = (value: BN): Uint8Array => {
  return new Uint8Array(value.toBuffer())
}

export const bytesToInternalBN = (value: Uint8Array): BN => {
  return internalToBN(value, COIN_FRACS.BOSON)
}

export const stringToBytes = (value: string, encoding: 'ascii'|'hex'): Uint8Array => {
  return new Uint8Array(Buffer.from(value, encoding))
}

export const bytesToString = (value: Uint8Array): string => {
  return Buffer.from(value).toString('ascii')
}

export const convertProtoBufSerializedBytesToNumStr = (val: string): string => {
  return (new BN(Buffer.from(val, 'base64'))).toString(10)
}

export const createOutPoint = (hash: string, index: number, val: BN): coreProtobuf.OutPoint => {
  const outPoint = new coreProtobuf.OutPoint()
  outPoint.setHash(hash)
  outPoint.setIndex(index)
  outPoint.setValue(new Uint8Array(val.toBuffer()))
  return outPoint
}

export const createTransactionInput = (outPoint: coreProtobuf.OutPoint, unlockScript: string): coreProtobuf.TransactionInput => {
  const input = new coreProtobuf.TransactionInput()
  input.setOutPoint(outPoint)
  input.setScriptLength(unlockScript.length)
  input.setInputScript(stringToBytes(unlockScript, 'ascii'))
  return input
}

export const createTransactionOutput = (outputLockScript: string, unit: BN, value: BN): coreProtobuf.TransactionOutput => {
  const output = new coreProtobuf.TransactionOutput()
  output.setValue(bnToBytes(value))
  output.setUnit(bnToBytes(unit))
  output.setScriptLength(outputLockScript.length)
  output.setOutputScript(stringToBytes(outputLockScript, 'ascii'))
  return output
}
