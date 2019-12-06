import lisk from 'lisk-elements'
const client = lisk.APIClient.createMainnetAPIClient()

export const payLSK = async (privateKey, from, to, amount) => {
  try {
    const transaction = lisk.transaction.transfer({
      amount: (amount * Math.pow(10, 8)).toString(),
      passphrase: privateKey,
      recipientId: to,
    })

    return await client.transactions.broadcast(transaction)
  } catch (err) {
    return err
  }
}

