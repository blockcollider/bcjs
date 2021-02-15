/**
 * Copyright (c) 2017-present, BlockCollider developers, All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { equals } from 'ramda'
import { bufferToInt, intToBuffer } from '../utils/buffer'

export const OPS: Map<number, string> = new Map([
  [0x01, 'OP_MONOID'],
  [0x02, 'OP_PUSHDATA1'],
  [0x03, 'OP_PUSHDATA2'],
  [0x04, 'OP_PUSHDATA4'],
  [0x05, 'OP_DEPSET'],
  [0x06, 'OP_0'],
  [0x07, 'OP_FALSE'],
  [0x08, 'OP_1NEGATE'],
  [0x09, 'OP_1'],
  [0x0a, 'OP_2'],
  [0x0b, 'OP_3'],
  [0x0c, 'OP_TRUE'],
  [0x0d, 'OP_NOP'],
  [0x0e, 'OP_IF'],
  [0x0f, 'OP_IFEQ'],
  [0x10, 'OP_ENDIFEQ'],
  [0x11, 'OP_NOTIF'],
  [0x12, 'OP_ELSE'],
  [0x13, 'OP_ENDIF'],
  [0x14, 'OP_VERIFY'],
  [0x15, 'OP_RETURN_RESULT'],
  [0x16, 'OP_RETURN'],
  [0x17, 'OP_EQ'],
  [0x18, 'OP_EQUALVERIFY'],
  [0x19, 'OP_CHECKSIGVERIFY'],
  [0x1a, 'OP_CHECKSIGNOPUBKEYVERIFY'],
  [0x1b, 'OP_CHECKMULTISIGVERIFY'],
  [0x1c, 'OP_ENVOUTPOINTUNIT'],
  [0x1d, 'OP_ENVOUTPOINTVALUE'],
  [0x1e, 'OP_ENVOUTPOINTHASH'],
  [0x1f, 'OP_ENVOUTPOINTNONCE'],
  [0x20, 'OP_ENVOUTPOINTVCLYSPUL'],
  [0x21, 'OP_ENVOUTPOINTLOCKTIME'],
  [0x22, 'OP_IFDUP'],
  [0x23, 'OP_DEPTH'],
  [0x24, 'OP_DROP'],
  [0x25, 'OP_DUP'],
  [0x26, 'OP_NIP'],
  [0x27, 'OP_OVER'],
  [0x28, 'OP_PICK'],
  [0x29, 'OP_ROLL'],
  [0x2a, 'OP_ROT'],
  [0x2b, 'OP_ROT'],
  [0x2c, 'OP_SWAP'],
  [0x2d, 'OP_TUCK'],
  [0x2e, 'OP_2DROP'],
  [0x2f, 'OP_2DUP'],
  [0x30, 'OP_3DUP'],
  [0x31, 'OP_2OVER'],
  [0x32, 'OP_2ROT'],
  [0x33, 'OP_2SWAP'],
  [0x34, 'OP_INVERT'],
  [0x35, 'OP_AND'],
  [0x36, 'OP_OR'],
  [0x37, 'OP_XOR'],
  [0x37, 'OP_EQUAL'],
  [0x38, 'OP_GATE'], // alias to OP_IFEQ
  [0x39, 'OP_1ADD'],
  [0x3a, 'OP_1SUB'],
  [0x3b, 'OP_2MUL'],
  [0x3c, 'OP_2DIV'],
  [0x3d, 'OP_MINUNITVALUE'],
  [0x3e, 'OP_NEGATE'],
  [0x3f, 'OP_ABS'],
  [0x40, 'OP_NOT'],
  [0x41, 'OP_0NOTEQUAL'],
  [0x42, 'OP_ADD'],
  [0x43, 'OP_SUB'],
  [0x44, 'OP_MUL'],
  [0x45, 'OP_DIV'],
  [0x46, 'OP_MOD'],
  [0x47, 'OP_TAKERPAIR'],
  [0x48, 'OP_LSHIFT'],
  [0x49, 'OP_RSHIFT'],
  [0x4a, 'OP_BOOLAND'],
  [0x4b, 'OP_BOOLOR'],
  [0x4c, 'OP_NUMEQUAL'],
  [0x4d, 'OP_NUMNOTEQUAL'],
  [0x4e, 'OP_LESSTHAN'],
  [0x4f, 'OP_GREATERTHAN'],
  [0x50, 'OP_LESSTHANOREQUAL'],
  [0x51, 'OP_GREATERTHANOREQUAL'],
  [0x51, 'OP_MIN'],
  [0x52, 'OP_MAX'],
  [0x53, 'OP_WITHIN'],
  [0x54, 'OP_RIPEMD160'],
  [0x55, 'OP_SHA1'],
  [0x56, 'OP_SHA256'],
  [0x57, 'OP_HASH160'],
  [0x58, 'OP_HASH256'],
  [0x59, 'OP_BLAKE2BL'],
  [0x5a, 'OP_BLAKE2BLS'],
  [0x5b, 'OP_BLAKE2BLC'],
  [0x5c, 'OP_DATATOHASH'],
  [0x5d, 'OP_NONCELOCKBL'],
  [0x5e, 'OP_MYLX'],
  [0x5f, 'OP_ORDTYPE'],
  [0x60, 'OP_CHECKSIG'],
  [0x61, 'OP_CHECKSIGNOPUBKEY'],
  [0x62, 'OP_CHECKMULTISIG'],
  [0x63, 'OP_INITBCI'],
  [0x64, 'OP_ENDBCI'],
  [0x65, 'OP_STATBCI'],
  [0x66, 'OP_HTTPSTATUS'],
  [0x67, 'OP_HTTPSELECT'],
  [0x68, 'TODO: EMPTY_FIX_BELOW'],
  [0x69, 'OP_RATEMARKET'],
  [0x70, 'OP_ENDRATEMARKET'],
  [0x71, 'OP_CALLBACK'],
  [0x72, 'OP_PROMISE'],
  [0x73, 'OP_MAKERCOLL'],
  [0x74, 'OP_SCHNACK'],
  [0x75, 'OP_MARK'],
  [0x76, 'OP_MONID'],
  [0x77, 'OP_MONAD'],
  [0x78, 'OP_ENDMONAD'],
  [0x79, 'OP_MONADSPLIT'],
  [0x7a, 'OP_X'],
  [0x7b, 'OP_Q'],
  [0x7c, 'OP_EMERGENCY'],
  [0x7d, 'OP_FIX'], // alias to OP_X
  [0x7e, 'btc'],
  [0x7f, 'eth'],
  [0x80, 'lsk'],
  [0x81, 'neo'],
  [0x82, 'wav'],
  [0x83, 'dai'],
  [0x84, 'nrg'],
  [0x85, 'emb'],
  [0x86, 'OP_4'],
  [0x87, 'OP_5'],
  [0x88, 'OP_6'],
  [0x89, 'OP_7'],
  [0x8a, 'OP_8'],
  [0x8b, 'OP_9'],
  [0x8c, 'OP_10'],
  [0x8d, 'OP_11'],
  [0x8e, 'OP_12'],
  [0x8f, 'OP_13'],
  [0x90, 'OP_14'],
  [0x91, 'OP_15'],
  [0x92, 'OP_16'],
  [0x93, 'CHAIN_NAME_LOOKUP'], // lookup to chain table
  [0x94, 'OP_PUSHSTR'],
  [0x95, 'OP_BLAKE2BLPRIV'],
])

export const REVERSE_OPS: Map<string, number> = new Map([...OPS].map(([byte, name]) => [name, byte]))

const CHAIN_TABLE: Map<number, string> = new Map([
  [0x01, 'usdt'],
  [0x02, 'xaut'],
  [0x03, 'mph'],
  [0x04, 'keep'],
  [0x05, 'sand'],
  [0x06, 'ramp'],
  [0x07, 'stake'],
  [0x08, 'yfdai'],
  [0x09, 'cvp'],
  [0x0a, 'omg'],
  [0x0b, 'bao'],
  [0x0c, 'comp'],
  [0x0d, 'apy'],
  [0x0e, 'onx'],
  [0x0f, 'ren'],
  [0x10, 'fink'],
  [0x11, 'ankreth'],
  [0x12, 'perp'],
  [0x13, 'orn'],
  [0x14, 'grt'],
  [0x15, 'combo'],
  [0x16, 'farm'],
  [0x17, 'pickle'],
  [0x18, 'pbtc35a'],
  [0x19, 'rook'],
  [0x1a, 'yfi'],
  [0x1b, 'snx'],
  [0x1c, 'tru'],
  [0x1d, 'xor'],
  [0x1e, 'crv'],
  [0x1f, 'cc10'],
  [0x20, 'cel'],
  [0x21, 'ddim'],
  [0x22, 'lrc'],
  [0x23, 'mir'],
  [0x24, 'tru'],
  [0x25, 'pols'],
  [0x26, 'exrd'],
  [0x27, 'duck'],
  [0x28, 'fxs'],
  [0x29, 'sdt'],
  [0x2a, 'alpha'],
  [0x2b, 'renbtc'],
  [0x2c, 'lon'],
  [0x2d, 'ampl'],
  [0x2e, 'bac'],
  [0x2f, 'mkr'],
  [0x30, 'aave'],
  [0x31, 'bond'],
  [0x32, 'hez'],
  [0x33, 'dpi'],
  [0x34, 'core'],
  [0x35, 'link'],
  [0x36, 'ust'],
  [0x37, 'frax'],
  [0x38, 'wise'],
  [0x39, 'uni'],
  [0x3a, 'wbtc'],
])
const REVERSE_CHAIN_TABLE: Map<string, number> = new Map([...CHAIN_TABLE].map(([byte, name]) => [name, byte]))

const DATA_OPS = [
  'OP_PUSHDATA1',
  'OP_PUSHDATA2',
  'OP_PUSHDATA4',
  'OP_PUSHSTR',
]

const NULL_BYTE = 0x00
const BC_BYTES = [0x2a, 0x2b]

export const BYTECODE_VERSIONS: Map<number, Buffer> = new Map([
  [0x1, Buffer.from([NULL_BYTE, ...BC_BYTES, 0x01])],
])

export function fromASM (asm: string, version: number): Buffer {
  const byteCodeVersion = BYTECODE_VERSIONS.get(version)
  if (!byteCodeVersion) {
    throw new Error(`Unable to encode version ${version}, known versions: ${BYTECODE_VERSIONS.keys()}`)
  }

  const chunks = asm.split(' ')
  const byteBuffers = chunks.map(chunk => {
    chunk = chunk.trim()
    // proper OP_CODE
    if (REVERSE_OPS.has(chunk)) {
      return Buffer.from([REVERSE_OPS.get(chunk)])
    }

    if (REVERSE_CHAIN_TABLE.has(chunk)) {
      const LOOKUP_OP = REVERSE_OPS.get('CHAIN_NAME_LOOKUP') as number
      const chainNameByte = REVERSE_CHAIN_TABLE.get(chunk) as number
      return Buffer.from([LOOKUP_OP, chainNameByte])
    }

    let pushOp
    let encoded
    if (chunk.startsWith('0x')) {
      if (chunk.length / 2 <= 0xff) {
        pushOp = REVERSE_OPS.get('OP_PUSHDATA1')
      } else if (chunk.length / 2 <= 0xffff) {
        pushOp = REVERSE_OPS.get('OP_PUSHDATA2')
      } else if (chunk.length / 2 <= 0xffffffff) {
        pushOp = REVERSE_OPS.get('OP_PUSHDATA4')
      } else {
        throw new Error(`Cannot compile chunk ${chunk}`)
      }

      encoded = Buffer.from(chunk.slice(2), 'hex')
    } else {
      // encode as ascii
      // TODO encoded ascii length has to be <= 0xff (1b width for length assumed in OP_PUSHSTR)
      pushOp = REVERSE_OPS.get('OP_PUSHSTR')
      encoded = Buffer.from(chunk, 'ascii')
    }

    return Buffer.concat([
      Buffer.from([pushOp]),
      intToBuffer(encoded.length),
      encoded,
    ])
  })

  return Buffer.concat([
    byteCodeVersion,
    ...byteBuffers,
  ])
}

export function toASM (bytecode: Buffer, version: number): string {
  const bytecodeVersion = BYTECODE_VERSIONS.get(version)
  if (!bytecodeVersion) {
    throw new Error(`Unknown bytecode version: ${version}`)
  }

  const encodedVersion = bytecode.slice(0, bytecodeVersion.length)
  if (!equals(encodedVersion, bytecodeVersion)) {
    throw new Error(`Expected version: ${version} (bytes: ${bytecodeVersion}), got encoded version: ${encodedVersion}`)
  }
  bytecode = bytecode.slice(bytecodeVersion.length)

  const result: string[] = []
  let consume
  while (bytecode.length !== 0) {
    consume = 0
    if (OPS.has(bytecode[0])) {
      const op = OPS.get(bytecode[0]) as string
      consume += 1

      if (DATA_OPS.includes(op)) {
        if (op === 'OP_PUSHSTR') {
          const length = bufferToInt(Buffer.from([bytecode[1]]))
          // consume 1b lenght + length of data
          consume += 1 + length
          result.push(bytecode.slice(2, 2 + length).toString('ascii'))
        } else if (op === 'OP_PUSHDATA1') {
          const length = bufferToInt(Buffer.from([bytecode[1]]))
          // consume 1b lenght + length of data
          consume += 1 + length
          result.push('0x' + bytecode.slice(2, 2 + length).toString('hex'))
        } else if (op === 'OP_PUSHDATA2') {
          const length = bufferToInt(bytecode.slice(1, 3))
          // consume 1b lenght + length of data
          consume += 2 + length
          result.push('0x' + bytecode.slice(3, 3 + length).toString('hex'))
        } else if (op === 'OP_PUSHDATA4') {
          const length = bufferToInt(bytecode.slice(1, 5))
          // consume 1b lenght + length of data
          consume += 4 + length
          result.push('0x' + bytecode.slice(5, 5 + length).toString('hex'))
        } else {
          throw new Error(`unknown data op: ${String(op)}`)
        }
      } else if (op === 'CHAIN_NAME_LOOKUP') {
        consume += 1
        const chainByte = bufferToInt(bytecode.slice(1, 2))
        if (!CHAIN_TABLE.has(chainByte)) {
          throw new Error(`Cannot lookup chain name: byte: ${chainByte}`)
        }

        const chainName = CHAIN_TABLE.get(chainByte) as string
        result.push(chainName)
      } else {
        result.push(op)
      }

      bytecode = bytecode.slice(consume)
    } else {
      throw new Error(`bytecode[0]: ${bytecode[0]} is not a known OP code`)
    }
  }

  return result.join(' ')
}
