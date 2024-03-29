import * as coreProtobuf from '@overline/proto/proto/core_pb'
import BN from 'bn.js'

import { fromASM } from '../script/bytecode'
import { COIN_FRACS, humanToInternalAsBN, internalToBN } from './coin'

function asmToV1Protobuf (asm: string): Uint8Array {
  return new Uint8Array(fromASM(asm, 0x01))
}

export const bnToBytes = (value: BN): Uint8Array => {
  return new Uint8Array(value.toArrayLike(Buffer))
}

export const bytesToInternalBN = (value: Uint8Array): BN => {
  return internalToBN(value, COIN_FRACS.BOSON)
}

export const convertProtoBufSerializedBytesToBuffer = (val: string): Buffer => {
  return (new BN(Buffer.from(val, 'base64'))).toArrayLike(Buffer)
}

export const createOutPoint = (hash: string, index: number, val: BN): coreProtobuf.OutPoint => {
  const outPoint = new coreProtobuf.OutPoint()
  outPoint.setHash(hash)
  outPoint.setIndex(index)
  outPoint.setValue(bnToBytes(val))
  return outPoint
}

export const getOutputByteLength = (output: coreProtobuf.TransactionOutput): BN => {
  return new BN(output.getScriptLength()) // script
    .add(new BN(output.getValue().length)) // value
    .add(new BN(output.getUnit().length)) // unit
    .add(new BN(4)) // scriptLength
}

export const getOutPointByteLength = (outPoint: coreProtobuf.OutPoint | undefined): BN => {
  if (outPoint) {
    return new BN(outPoint.getValue().length) // value
      .add(new BN(8)) // index
      .add(new BN(128)) // hash
  } else { return new BN(0) }
}

export const getInputByteLength = (input: coreProtobuf.TransactionInput): BN => {
  return new BN(input.getScriptLength()) // script
    .add(new BN(4)) // scriptLength
    .add(getOutPointByteLength(input.getOutPoint()))
}

export const getTransactionSize = (tx: coreProtobuf.Transaction): BN => {
  let size = new BN(0)
  for (const input of tx.getInputsList()) {
    size = size.add(getInputByteLength(input))
  }
  for (const output of tx.getOutputsList()) {
    size = size.add(getOutputByteLength(output))
  }
  return size
}

export const createTransactionInput = (outPoint: coreProtobuf.OutPoint, unlockScript: string):
  coreProtobuf.TransactionInput => {
    const input = new coreProtobuf.TransactionInput()
    input.setOutPoint(outPoint)
    const byteCode = asmToV1Protobuf(unlockScript)
    input.setScriptLength(byteCode.length)
    input.setInputScript(byteCode)
    return input
  }

export const createTransactionOutput = (outputLockScript: string, unit: BN, value: BN):
  coreProtobuf.TransactionOutput => {
    const output = new coreProtobuf.TransactionOutput()
    output.setValue(bnToBytes(value))
    output.setUnit(bnToBytes(unit))
    const byteCode = asmToV1Protobuf(outputLockScript)
    output.setScriptLength(byteCode.length)
    output.setOutputScript(byteCode)
    return output
  }
