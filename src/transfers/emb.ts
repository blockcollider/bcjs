import { EMB, submitTransaction, web3 } from './web3'

export const transferEMB = async (privateKey, from, to, amount, gasLimit = 32000) => {
  return new Promise((resolve, reject) => {
    try {
      const data = EMB.methods
        .transfer(
          to,
          web3.utils.toHex(Math.floor(Math.pow(10, 8) * parseFloat(amount))),
        )
        .encodeABI()
      submitTransaction({ to: EMB.options.address, from, value: web3.utils.toHex(0), data, privateKey, gasLimit },
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
