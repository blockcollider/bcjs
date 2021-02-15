/**
 * Copyright (c) 2017-present, BlockCollider developers, All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TransactionOutput } from '../../protos/core_pb'
import { fromASM, toASM } from '../bytecode'

/* tslint:disable:max-line-length */
const asm1 = 'OP_MONOID 2 3 100 100 OP_DEPSET OP_0 OP_IFEQ OP_RETURN OP_ENDIFEQ OP_2 OP_IFEQ OP_TAKERPAIR OP_2 OP_0 OP_MINUNITVALUE OP_RETURN_RESULT OP_ENDIFEQ OP_3 OP_IFEQ OP_RETURN OP_ENDIFEQ OP_DROP eth dai 0x7efbb13383757ca1f581dd5e20cb2e9f24448608 0x7efbb13383757ca1f581dd5e20cb2e9f24448608 0.1 10 OP_MAKERCOLL OP_3 OP_IFEQ OP_BLAKE2BL 0x3266bbec0ac0899e8a42a264465e0d04a576e57192382f63b74434c2a65277c2 OP_EQUALVERIFY OP_CHECKSIGVERIFY OP_RETURN_RESULT OP_ENDIFEQ OP_2 OP_IFEQ 1 OP_MONADSPLIT OP_MONAD OP_BLAKE2BL 0x3266bbec0ac0899e8a42a264465e0d04a576e57192382f63b74434c2a65277c2 OP_EQUALVERIFY OP_CHECKSIGVERIFY OP_ENDMONAD OP_ENDIFEQ'
const asm2 = '0x721439679277836f4dd2bc0044d0ba57febe960db3a27dcd439cb36d13c37f15 0 OP_CALLBACK 4 OP_IFEQ OP_BLAKE2BL 0xce1dac37eee16fe55f9f2fe47d4462068801341854e18d3f542712d56d712362 OP_EQUALVERIFY OP_CHECKSIGVERIFY OP_ENDIFEQ OP_DROP OP_MONAD OP_BLAKE2BL 0xce1dac37eee16fe55f9f2fe47d4462068801341854e18d3f542712d56d712362 OP_EQUALVERIFY OP_CHECKSIGVERIFY OP_ENDMONAD'
const asm3 = 'OP_BLAKE2BL 0xce1dac37eee16fe55f9f2fe47d4462068801341854e18d3f542712d56d712362 OP_EQUALVERIFY OP_CHECKSIGVERIFY'
const asm4 = '0x1c68ea6c3fdbca3a25cb09d927f35d78a9fce2d665152fdf7d9eaef1c803431a138783e2394102e6e79708681e09bfe91adf9637c775a38f4227be719746260101 0x0310b246a658340fb447920f0f759e3eb88eec733d3757bcfa65b1bc71ce045096 0xd41e9c23e519907c61a43051d895bc3d136c747ea81edf5347c7025ca61d9ef5'
const asm5 = 'OP_MONOID 0 0 500 1000 OP_DEPSET OP_0 OP_IFEQ OP_RETURN OP_ENDIFEQ OP_2 OP_IFEQ OP_TAKERPAIR 2 0 OP_MINUNITVALUE OP_RETURN_RESULT OP_ENDIFEQ OP_3 OP_IFEQ OP_RETURN OP_ENDIFEQ OP_DROP eth btc 0x9ffd56813f9ec2c0c5c37a7ddce20ee4840cc73c 1PW4yCbV3BEn4C7C8hyUhVDRgo2qEoo3ys 5000000000000000000 12500000 OP_MAKERCOLL OP_3 OP_IFEQ OP_MONAD OP_BLAKE2BL 0xc72d0cb74ba65b3cdaec173fe7f24f9d30b7cdf29a21dfafdc069886bf703671 OP_EQUALVERIFY OP_CHECKSIGVERIFY OP_ENDMONAD OP_RETURN_RESULT OP_ENDIFEQ OP_2 OP_IFEQ 1 OP_MONADSPLIT OP_MONAD OP_BLAKE2BL 0xc72d0cb74ba65b3cdaec173fe7f24f9d30b7cdf29a21dfafdc069886bf703671 OP_EQUALVERIFY OP_CHECKSIGVERIFY OP_ENDMONAD OP_ENDIFEQ OP_5 OP_IFEQ 1 OP_MONADSPLIT OP_MONAD OP_BLAKE2BL 0xc72d0cb74ba65b3cdaec173fe7f24f9d30b7cdf29a21dfafdc069886bf703671 OP_EQUALVERIFY OP_CHECKSIGVERIFY OP_ENDMONAD OP_ENDIFEQ'

// 1G34qSE1kaU9D4XHknTG9fM8T5tHwULpxE
const binary = Buffer.from([
  // preamble v1 (0b, B, C, 1)
  0x00, 0x2a, 0x2b, 0x01,
  // OP_MONOID
  0x01,
  // 2 - ascii encoded
  0x94, 0x01, 0x32,
  // 3 - ascii encoded
  0x94, 0x01, 0x33,
  // 100 - ascii encoded
  0x94, 0x03, 0x31, 0x30, 0x30,
  // 100 - ascii encoded
  0x94, 0x03, 0x31, 0x30, 0x30,
  // OP_DEPSET OP_0 OP_IFEQ OP_RETURN OP_ENDIFEQ OP_2 OP_IFEQ
  0x05, 0x06, 0x0f, 0x16, 0x10, 0x0a, 0x0f,
  // OP_TAKERPAIR OP_2 OP_0 OP_MINUNITVALUE OP_RETURN_RESULT OP_ENDIFEQ OP_3 OP_IFEQ OP_RETURN
  0x47, 0x0a, 0x06, 0x3d, 0x15, 0x10, 0x0b, 0x0f, 0x16,
  // OP_ENDIFEQ OP_DROP eth dai
  0x10, 0x24, 0x7f, 0x83,
  // 0x7efbb13383757ca1f581dd5e20cb2e9f24448608
  0x02, 0x14, 0x7e, 0xfb, 0xb1, 0x33, 0x83, 0x75, 0x7c, 0xa1, 0xf5, 0x81, 0xdd, 0x5e, 0x20, 0xcb, 0x2e, 0x9f, 0x24, 0x44, 0x86, 0x08,
  // 0x7efbb13383757ca1f581dd5e20cb2e9f24448608
  0x02, 0x14, 0x7e, 0xfb, 0xb1, 0x33, 0x83, 0x75, 0x7c, 0xa1, 0xf5, 0x81, 0xdd, 0x5e, 0x20, 0xcb, 0x2e, 0x9f, 0x24, 0x44, 0x86, 0x08,
  // 0.1 - ascii encoded
  0x94, 0x03, 0x30, 0x2e, 0x31,
  // 10 - ascii encoded
  0x94, 0x02, 0x31, 0x30,
  // OP_MAKERCOLL OP_3 OP_IFEQ OP_BLAKE2BL
  0x73, 0x0b, 0x0f, 0x59,
  // 0x3266bbec0ac0899e8a42a264465e0d04a576e57192382f63b74434c2a65277c2
  0x02, 0x20, 0x32, 0x66, 0xbb, 0xec, 0x0a, 0xc0, 0x89, 0x9e, 0x8a, 0x42, 0xa2, 0x64, 0x46, 0x5e, 0x0d, 0x04, 0xa5, 0x76, 0xe5, 0x71, 0x92, 0x38, 0x2f, 0x63, 0xb7, 0x44, 0x34, 0xc2, 0xa6, 0x52, 0x77, 0xc2,
  // OP_EQUALVERIFY OP_CHECKSIGVERIFY OP_RETURN_RESULT OP_ENDIFEQ OP_2 OP_IFEQ
  0x18, 0x19, 0x15, 0x10, 0x0a, 0x0f,
  // 1 - ascii encoded
  0x94, 0x01, 0x31,
  // OP_MONADSPLIT OP_MONAD OP_BLAKE2BL
  0x79, 0x77, 0x59,
  // 0x3266bbec0ac0899e8a42a264465e0d04a576e57192382f63b74434c2a65277c2
  0x02, 0x20, 0x32, 0x66, 0xbb, 0xec, 0x0a, 0xc0, 0x89, 0x9e, 0x8a, 0x42, 0xa2, 0x64, 0x46, 0x5e, 0x0d, 0x04, 0xa5, 0x76, 0xe5, 0x71, 0x92, 0x38, 0x2f, 0x63, 0xb7, 0x44, 0x34, 0xc2, 0xa6, 0x52, 0x77, 0xc2,
  // OP_EQUALVERIFY OP_CHECKSIGVERIFY OP_ENDMONAD OP_ENDIFEQ
  0x18, 0x19, 0x78, 0x10,
])
/* tslint:enable:max-line-length */

describe('bytecode', () => {
  it('is able to transform from asm to bytecode and back', () => {
    const version = 0x01
    expect(fromASM(asm1, version)).toEqual(binary)
    expect(toASM(binary, version)).toEqual(asm1)

    /* tslint:disable:no-console */
    console.log(asm1, fromASM(asm1, version).length, asm1.length)
    expect(toASM(fromASM(asm1, version), version)).toEqual(asm1)

    console.log(asm2, fromASM(asm2, version).length, asm2.length)
    expect(toASM(fromASM(asm2, version), version)).toEqual(asm2)

    console.log(asm3, fromASM(asm3, version).length, asm3.length)
    expect(toASM(fromASM(asm3, version), version)).toEqual(asm3)

    console.log(asm4, fromASM(asm4, version).length, asm4.length)
    expect(toASM(fromASM(asm4, version), version)).toEqual(asm4)

    expect(toASM(fromASM(asm5, version), version)).toEqual(asm5)
    const bytes: number[] = Array.from(fromASM(asm2, version))
    console.log(bytes.map(b => `0x${b.toString(16)}`).join(' '))
    /* tslint:enable:no-console */
  })

  it('works with protocol buffers', () => {
    const to = new TransactionOutput()
    to.setOutputScript(new Uint8Array(fromASM(asm1, 0x01)))
    expect(toASM(Buffer.from(to.getOutputScript() as Uint8Array), 0x01)).toEqual(asm1)
  })

  it('can de/encode chain name using lookup table', () => {
    const version = 0x01
    // should be translated to simple 'usdt' as asm
    const bytecode = Buffer.from([
      0x00, 0x2a, 0x2b, 0x01, // preamble with 0x01 version
      0x0d, // OP_NOP
      0x93, 0x01, // usdt
      0x7e, // btc
      0x85, // emb
    ])

    expect(toASM(bytecode, version)).toEqual('OP_NOP usdt btc emb')

    expect(fromASM('OP_NOP usdt btc emb', version)).toEqual(bytecode)
  })

  it('can de/encode chain name using lookup table - newly added', () => {
    const version = 0x01
    // should be translated to simple 'usdt' as asm
    const bytecode = Buffer.from([
      0x00, 0x2a, 0x2b, 0x01, // preamble with 0x01 version
      0x0d, // OP_NOP
      0x93, 0x2b, // renbtc
      0x7e, // btc
      0x85, // emb
    ])

    expect(toASM(bytecode, version)).toEqual('OP_NOP renbtc btc emb')

    expect(fromASM('OP_NOP renbtc btc emb', version)).toEqual(bytecode)
  })

  it('encodes OP_BLAKE2BLPRIV', () => {
    const bytecode = Buffer.from([
      0x00, 0x2a, 0x2b, 0x01, // preamble with 0x01 version
      0x95, // OP_BLAKE2BLPRIV
    ])
    expect(fromASM('OP_BLAKE2BLPRIV', 0x01)).toEqual(bytecode)
  })
})
