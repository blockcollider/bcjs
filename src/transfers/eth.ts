import { submitTransaction, web3 } from './web3'

export const transferETH = async (privateKey, from, to, amount) => {
  const value = web3.utils.toHex(web3.utils.toWei(amount.toString(), 'ether'))
  return new Promise((resolve, reject) => {
    submitTransaction({ from, to, value, data: '0x0', privateKey }, (err, hash) => {
      if (err) {
        reject(err)
      } else {
        resolve(hash)
      }
    })
  })
}
