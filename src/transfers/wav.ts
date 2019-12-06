const WavesAPI = require('@waves/waves-api');
const { transfer,broadcast } = require('@waves/waves-transactions')
const Waves = WavesAPI.create(WavesAPI.MAINNET_CONFIG);

export async function payWAV(privateKey, from, to, amount){
  privateKey = Waves.Seed.fromExistingPhrase(privateKey);
  let signed = transfer({
      recipient: to,
      amount: amount * Math.pow(10,8),
      fee: 100000,
  },privateKey.phrase);
  let nodeUrl = 'https://nodes.wavesplatform.com'
  broadcast(signed, nodeUrl).then((resp) => {
    return resp
  });
}
