import Neon, { api as NeonAPI, wallet as NeonWallet } from '@cityofzion/neon-js'

export const payNEO = async (privateKey, from, to, amount) => {
  try {
    const account = new NeonWallet.Account(privateKey)
    const config = {
      account: account,
      api: new NeonAPI.neoscan.instance('MainNet'),
      intents: NeonAPI.makeIntent({ NEO: amount }, to),
    }

    return await Neon.sendAsset(config)
  } catch (err) {
    return err
  }
}
