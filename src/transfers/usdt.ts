import { submitTransaction, USDT, web3 } from './web3'

export const transferUSDT = async (privateKey, from, to, amount, gasLimit = 40000) => {
  return new Promise((resolve, reject) => {
    try {
      const data = USDT.methods
        .transfer(
          to,
          web3.utils.toHex(Math.floor(Math.pow(10, 6) * parseFloat(amount))),
        )
        .encodeABI()

      submitTransaction({ to: USDT.options.address, from, value: web3.utils.toHex(0), data, privateKey, gasLimit },
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
