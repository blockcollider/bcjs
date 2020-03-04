
import BN from 'bn.js'
import {
  compareByOutPointValueDesc,
  _calculateSpentAndLeftoverOutPoints,
} from '../transaction'
import {
  bytesToInternalBN,
  convertProtoBufSerializedBytesToBuffer,
} from '../utils/protoUtil'
import {
  humanToInternalAsBN,
  COIN_FRACS,
  internalToBN,
  internalBNToHuman,
  Currency,
  CurrencyInfo
} from '../utils/coin'

describe('transaction', () => {
  describe('_calculateSpentAndLeftoverOutPoints', () => {
    it('Minimize using outpoints', () => {
      const spendableWalletOutPointObjs = [
        {
          blockHeight: 12,
          callbackScript: '',
          originalScript: '',
          outpoint: {
            hash: 'xx',
            index: 0,
            value: (new BN(4)).toBuffer().toString('base64'),
          },
        },
        {
          blockHeight: 12,
          callbackScript: '',
          originalScript: '',
          outpoint: {
            hash: 'xx',
            index: 0,
            value: (new BN(2)).toBuffer().toString('base64'),
          },
        },
        {
          blockHeight: 12,
          callbackScript: '',
          originalScript: '',
          outpoint: {
            hash: 'xx',
            index: 0,
            value: (new BN(13)).toBuffer().toString('base64'),
          },
        },
        {
          blockHeight: 123,
          callbackScript: '',
          originalScript: '',
          outpoint: {
            hash: 'xx',
            index: 0,
            value: (new BN(23)).toBuffer().toString('base64'),
          },
        },
      ]
      const { spentOutPoints, leftoverOutPoint } = _calculateSpentAndLeftoverOutPoints(
        spendableWalletOutPointObjs, new BN(16),
      )
      expect(leftoverOutPoint).not.toBe(null)

      if (leftoverOutPoint) {
        const leftOverValueBN = bytesToInternalBN(leftoverOutPoint.getValue() as Uint8Array)
        expect(leftOverValueBN.eq(new BN(3))).toBe(true)
      }
      expect(spentOutPoints.length).toBe(3)
    })
  })
  describe('compareByOutPointValueDesc', () => {
    it('Sort the spendableWalletOutPointObjs desc', () => {
      const spendableWalletOutPointObjs = [
        {
          blockHeight: 12,
          callbackScript: '',
          originalScript: '',
          outpoint: {
            hash: '',
            index: 0,
            value: (new BN(123)).toBuffer().toString('base64'),
          },
        },
        {
          blockHeight: 123,
          callbackScript: '',
          originalScript: '',
          outpoint: {
            hash: '',
            index: 0,
            value: (new BN(223)).toBuffer().toString('base64'),
          },
        },
      ]
      const spendableWalletOutPointObjsDesc = spendableWalletOutPointObjs.sort(compareByOutPointValueDesc)

      const firstItem = spendableWalletOutPointObjsDesc[0].outpoint.value
      const secondItem = spendableWalletOutPointObjsDesc[1].outpoint.value

      const firstItemBN = internalToBN(
        convertProtoBufSerializedBytesToBuffer(firstItem),
        COIN_FRACS.BOSON,
      )
      const secondItemBN = internalToBN(
        convertProtoBufSerializedBytesToBuffer(secondItem),
        COIN_FRACS.BOSON,
      )
      expect(firstItemBN.gt(secondItemBN)).toBe(true)
    })
  })
})
