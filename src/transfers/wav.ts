import { broadcast, transfer, TSeedTypes } from '@waves/waves-transactions'

export const payWAV = async (privateKey: TSeedTypes, from, to, amount) => {
  const signed = transfer(
    {
      amount: amount * Math.pow(10, 8),
      fee: 100000,
      recipient: to,
    },
    privateKey,
  )
  const nodeUrl = 'https://nodes.wavesplatform.com'
  return await broadcast(signed, nodeUrl)
}
