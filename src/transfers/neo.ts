import Neon, { wallet as NeonWallet, api as NeonAPI} from "@cityofzion/neon-js";

export async function payNEO(privateKey, from, to, amount){
  try {
    const config = {
      api: new NeonAPI.neoscan.instance('MainNet'),
      account: privateKey,
      intents: NeonAPI.makeIntent({NEO:amount},to)
    };
    Neon.sendAsset(config).then(config => {
			return config
    })
    .catch(config => {
      return config
    });
  }
  catch(err){
		return err
  }
}
