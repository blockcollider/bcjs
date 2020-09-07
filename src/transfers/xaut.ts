import { submitTransaction, web3, XAUt } from './web3'

export const transferXAUt = async (privateKey, from, to, amount) => {
  return new Promise((resolve, reject) => {
    try {
      const data = XAUt.methods
        .transfer(
          to,
          web3.utils.toHex(Math.floor(Math.pow(10, 6) * parseFloat(amount))),
        )
        .encodeABI()

      submitTransaction({ to: XAUt.options.address, from, value: web3.utils.toHex(0), data, privateKey },
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
