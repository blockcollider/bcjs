import { APIClient, transactions } from '@liskhq/lisk-client'
const client = APIClient.createMainnetAPIClient()

export const payLSK = async (privateKey, from, to, amount) => {
  try {
    const transaction: any = transactions.transfer({
      amount: (amount * Math.pow(10, 8)).toString(),
      passphrase: privateKey,
      recipientId: to,
    })

    await client.transactions.broadcast(transaction)
  } catch (err) {
    return err
  }
}
