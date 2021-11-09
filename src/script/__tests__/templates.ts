/**
 * Copyright (c) 2017-present, Overline developers, All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { RpcFeedTransactionRequest } from '@overline/proto/proto/bc_pb'
import { fromASM, toASM } from '../bytecode'
import {
  createFeedLockScript,
  createUpdateFeedLockScript,
  getScriptType,
  parseCreateFeedLockScript,
  parseUpdateFeedLockScript,
  ScriptType,
} from '../templates'

describe('templates', () => {
  describe('createFeedLockScript', () => {
    it('creates correct feed lock script', () => {
      const data = 'test data message'
      const feedLockScript = createFeedLockScript(
        '0x7fceF3462A9A64B5f4f082ae6633fD60986E3718', // olAddress
        0, // data type
        42, // data length
        Buffer.from(data, 'ascii').toString('hex'), // function has to receive hex encoded data
      )
      // test for human readable format
      expect(feedLockScript)
        .toBe('OP_X 0x06 0x00 0x00 0x00 0x2a 0x746573742064617461206d657373616765 OP_BLAKE2BLPRIV,0x959b9f402dfebbb5107fd4b4967d14e9815af7e5b778e2ad1965597dc21f3f60,OP_EQUALVERIFY,OP_CHECKSIGNOPUBKEYVERIFY') /* tslint:disable-line */

      // test that it transforms from bytecode into a same format
      const bytecode = fromASM(feedLockScript, 0x01)
      expect(toASM(bytecode, 0x01)).toBe(feedLockScript)
      expect(getScriptType(bytecode)).toBe(ScriptType.FEED_CREATE)
    })
  })

  describe('createUpdateFeedLockScript', () => {
    it('creates correct feed update lock script', () => {
      const data = 'test data message'
      const feedUpdateLockScript = createUpdateFeedLockScript(
        '42254158394a833fb1e767d22d43ca5cf063d2eb02de2f9613bb63cf381fe661',
        0,
        '0x7fceF3462A9A64B5f4f082ae6633fD60986E3718', // feedUpdaterAddress
        3, // data type
        257, // data length
        Buffer.from(data, 'ascii').toString('hex'), // function has to receive hex encoded data
      )
      // test for human readable format
      expect(feedUpdateLockScript)
        .toBe('OP_X 0x06 0x42254158394a833fb1e767d22d43ca5cf063d2eb02de2f9613bb63cf381fe661 0x00 0x03 0x0101 0x746573742064617461206d657373616765 OP_BLAKE2BLPRIV 0x959b9f402dfebbb5107fd4b4967d14e9815af7e5b778e2ad1965597dc21f3f60 OP_EQUALVERIFY OP_CHECKSIGNOPUBKEYVERIFY') /* tslint:disable-line */

      // test that it transforms from bytecode into a same format
      const bytecode = fromASM(feedUpdateLockScript, 0x01)
      expect(toASM(bytecode, 0x01)).toBe(feedUpdateLockScript)
      expect(getScriptType(bytecode)).toBe(ScriptType.FEED_UPDATE)
    })
  })

  describe('parseUpdateFeedLockScript', () => {
    it('parses valid script correctly', () => {
      const scriptAsm = 'OP_X 0x06 0x42254158394a833fb1e767d22d43ca5cf063d2eb02de2f9613bb63cf381fe661 0x00 0x03 0x0101 0x746573742064617461206d657373616765 OP_BLAKE2BLPRIV 0x959b9f402dfebbb5107fd4b4967d14e9815af7e5b778e2ad1965597dc21f3f60 OP_EQUALVERIFY OP_CHECKSIGNOPUBKEYVERIFY' /* tslint:disable-line */
      const parsed = parseUpdateFeedLockScript(fromASM(scriptAsm, 0x01))
      expect(parsed).toEqual({
       data: '0x746573742064617461206d657373616765',
       dataLength: '0x0101',
       dataType: '0x03',
       doubleHashedOlAddress: '0x959b9f402dfebbb5107fd4b4967d14e9815af7e5b778e2ad1965597dc21f3f60',
       feedTxHash: '0x42254158394a833fb1e767d22d43ca5cf063d2eb02de2f9613bb63cf381fe661',
       feedTxOutputIndex: '0x00',
     })
    })
  })

  describe('parseCreateFeedLockScript', () => {
    it('parses valid script correctly', () => {
      const scriptAsm = 'OP_X 0x06 0x00 0x00 0x00 0x2a 0x746573742064617461206d657373616765 OP_BLAKE2BLPRIV,0x959b9f402dfebbb5107fd4b4967d14e9815af7e5b778e2ad1965597dc21f3f60,OP_EQUALVERIFY,OP_CHECKSIGNOPUBKEYVERIFY' /* tslint:disable-line */
      const parsed = parseCreateFeedLockScript(fromASM(scriptAsm, 0x01))
      expect(parsed).toEqual({
       data: '0x746573742064617461206d657373616765',
       dataLength: '0x2a',
       dataType: '0x00',
       doubleHashedOlAddress: '0x959b9f402dfebbb5107fd4b4967d14e9815af7e5b778e2ad1965597dc21f3f60,OP_EQUALVERIFY,OP_CHECKSIGNOPUBKEYVERIFY', /* tslint:disable-line */
     })
    })
  })
})
