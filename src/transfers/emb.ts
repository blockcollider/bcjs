import { EMB, submitTransaction, web3 } from './web3'

function padToBytes7(n) {
    while (n.length < 14) {
        n = "0" + n;
    }
    return n;
}

export const transferEMB = async (privateKey, from, to, amount, gasLimit = 60000) => {
  gasLimit = 60000
  return new Promise((resolve, reject) => {
    try {
      let arg = `${to}${padToBytes7(Math.round(amount*Math.pow(10,8)).toString(16))}`;
      let data = EMB.methods.multiTransfer([arg]).encodeABI()

      submitTransaction({gas:62000, to: EMB.options.address, from, value: web3.utils.toHex(0), data, privateKey, gasLimit },
          (err, hash) => {
        if (err) {
          reject(err)
        } else {
          resolve(hash)
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}
