import { DAI, submitTransaction, web3 } from './web3'

export const transferDAI = async (privateKey, from, to, amount) => {
  return new Promise((resolve, reject) => {
    try {
      const data = DAI.methods
        .transfer(
          to,
          web3.utils.toHex(Math.floor(Math.pow(10, 18) * parseFloat(amount))),
        )
        .encodeABI()

      submitTransaction(
          { to: DAI.options.address, from, value: web3.utils.toHex(0), data, privateKey }, (err, hash) => {
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
