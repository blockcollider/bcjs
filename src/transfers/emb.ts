import { EMB, submitTransaction, web3 } from './web3'

function padToBytes7 (n) {
    while (n.length < 14) {
        n = '0' + n
    }
    return n
}

export const transferEMB = async (privateKey, from, to, amount, gasLimit = 72000) => {
  gasLimit = 60000
  return new Promise((resolve, reject) => {
    try {
      const arg = `${to}${padToBytes7(Math.round(amount * Math.pow(10, 8)).toString(16))}`
      const data = EMB.methods.multiTransfer([arg]).encodeABI()

      submitTransaction({
       data,
       from,
       gas: 62000,
       gasLimit,
       privateKey,
       to: EMB.options.address,
       value: web3.utils.toHex(0),
      }, (err, hash) => {
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
