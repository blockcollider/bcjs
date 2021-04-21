import { APIClient, transactions } from '@liskhq/lisk-client'
const client = APIClient.createMainnetAPIClient()

// based on https://lisk.io/documentation/lisk-sdk/protocol/mainnet.html
const MAINNET_NETWORK_IDENTIFIER = '9ee11e9df416b18bf69dbd1a920442e08c6ca319e69926bc843a561782ca17ee'

export const payLSK = async (privateKey, from, to, amount) => {
  try {
    const transaction = transactions.transfer({
      amount: (amount * Math.pow(10, 8)).toString(),
      networkIdentifier: MAINNET_NETWORK_IDENTIFIER,
      passphrase: privateKey,
      recipientId: to,
    })

    return await client.transactions.broadcast(transaction)
  } catch (err) {
    return err
  }
}
