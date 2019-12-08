import WavesAPI from '@waves/waves-api'
import { broadcast, transfer } from '@waves/waves-transactions'

const Waves = WavesAPI.create(WavesAPI.MAINNET_CONFIG)

export const payWAV = async (privateKey, from, to, amount) => {
  privateKey = Waves.Seed.fromExistingPhrase(privateKey)
  const signed = transfer(
    {
      amount: amount * Math.pow(10, 8),
      fee: 100000,
      recipient: to,
    },
    privateKey.phrase,
  )
  const nodeUrl = 'https://nodes.wavesplatform.com'
  return await broadcast(signed, nodeUrl)
}
