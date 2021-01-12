import BN from 'bn.js'
import * as coreProtobuf from './../protos/core_pb'

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
