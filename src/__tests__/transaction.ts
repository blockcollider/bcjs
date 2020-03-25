/**
 * Copyright (c) 2017-present, BlockCollider developers, All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import BN from 'bn.js'

import * as corePb from '../protos/core_pb'
import { COIN_FRACS, humanToInternal, internalBNToHuman } from '../utils/coin'

import { calcTxFee } from '../transaction'

describe('transaction module', () => {
  describe('calcTxFee', () => {
    it('calculates 0 for coinbase TX', () => {
      const tx = new corePb.Transaction()

      const value = humanToInternal('2', COIN_FRACS.NRG)
      const unit = humanToInternal('1', COIN_FRACS.NRG)
      const output = new corePb.TransactionOutput()
      output.setValue(value)
      output.setUnit(unit)
      tx.addOutputs(output)

      expect(calcTxFee(tx)).toEqual(new BN(0))
    })

    it('calculates 0 for tx with sum(input.value) == sum(output.value)', () => {
      const tx = new corePb.Transaction()

      const value = humanToInternal('6', COIN_FRACS.NRG)
      const unit = humanToInternal('1', COIN_FRACS.NRG)
      const output = new corePb.TransactionOutput()
      output.setValue(value)
      output.setUnit(unit)
      tx.addOutputs(output)

      const outPoint = new corePb.OutPoint()
      outPoint.setValue(value)
      const input = new corePb.TransactionInput()
      input.setOutPoint(outPoint)
      tx.addInputs(input)

      expect(calcTxFee(tx).toString()).toEqual(new BN(0).toString())
    })

    it('calculates correct fee', () => {
      const tx = new corePb.Transaction()

      const value = humanToInternal('6', COIN_FRACS.NRG)
      const unit = humanToInternal('1', COIN_FRACS.NRG)
      const output = new corePb.TransactionOutput()
      output.setValue(value)
      output.setUnit(unit)
      tx.addOutputs(output)

      const outPoint = new corePb.OutPoint()
      outPoint.setValue(humanToInternal('6.066', COIN_FRACS.NRG))
      const input = new corePb.TransactionInput()
      input.setOutPoint(outPoint)
      tx.addInputs(input)

      expect(internalBNToHuman(calcTxFee(tx), COIN_FRACS.NRG)).toEqual('0.066')
    })
  })
})
