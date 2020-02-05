import { APIClient, transactions } from 'lisk-elements'
const client = APIClient.createMainnetAPIClient()

type MLSKString = string
interface ILSKTransfer {
  to: string,
  from: string,
  timestamp: number,
  value: number,
  height: number,
  txHash: string
}

const TRANSFER_GETTERS = [
  async (address: string): Promise<ILSKTransfer[]> => {
    let res
    try {
      res = await fetch(`https://explorer.lisk.io/api/getTransactions?senderId=${address}`)
    } catch (e) {
      throw new Error(e)
    }

    if (res.status !== 200) {
      throw new Error(`Response status code: ${res.status}`)
    }

    const jsonResult: {
      success: boolean,
      transactions: Array<{ amount: string, recipientId: string, senderId: string, id: string, height: number, timestamp: number }>
    } = await res.json()

    return jsonResult.transactions.map(rawTx => ({
      from: rawTx.senderId,
      to: rawTx.recipientId,
      timestamp: rawTx.timestamp,
      value: parseInt(rawTx.amount, 10),
      height: rawTx.height,
      txHash: rawTx.id
    }))
}

]
export const getTransfers = async (address: string): Promise<ILSKTransfer[]> => {
  let lastError
  for (const fn of TRANSFER_GETTERS) {
    try {
      const res = await fn(address)
      return res
    } catch (e) {
      lastError = e
      continue
    }
  }

  throw new Error(lastError)
}

export const getBalance = async (address: string): Promise<MLSKString> => {
  let res
  try {
    res = await fetch(`https://explorer.lisk.io/api/getAccount?address=${address}`)
  } catch (e) {
    throw new Error(e)
  }

  if (res.status !== 200) {
    throw new Error(`Response status code: ${res.status}`)
  }

  const jsonResult: { balance: string } = await res.json()

  return jsonResult.balance
}

export const payLSK = async (privateKey: string, from: string, to: string, amount: number) => {
  try {
    const transaction = transactions.transfer({
      amount: (amount * Math.pow(10, 8)).toString(),
      passphrase: privateKey,
      recipientId: to,
    })

    return await client.transactions.broadcast(transaction)
  } catch (err) {
    return err
  }
}
