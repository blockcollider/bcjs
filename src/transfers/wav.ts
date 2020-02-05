require('es6-promise').polyfill() /* tslint:disable-line */
require('isomorphic-fetch') /* tslint:disable-line */
import { broadcast, transfer, TSeedTypes } from '@waves/waves-transactions'

const MWAV_MULT = Math.pow(10, 18)
interface IWAVTransfer {
  to: string,
  from: string,
  timestamp: number,
  value: number,
  height: number,
  txHash: string
}

interface ITransferTransaction {
  type: number;
  recipient: string;
  sender: string;
  timestamp: number;
  amount: number;
  height: number;
  id: string;
}

const TRANSFER_GETTERS = [
  async (address: string, limit: number = 100): Promise<IWAVTransfer[]> => {
    let url = `https://nodes.wavesnodes.com/transactions/address/${address}/limit/${limit}`
    let res
    try {
      res = await fetch(url)
    } catch (e) {
      throw new Error(e)
    }

    if (res.status !== 200) {
      throw new Error(`Response status code: ${res.status}`)
    }

    const [transactions]: Array<Array<{
      senderPublicKey: string;
      amount?: number;
      fee: number;
      type: number;
      version: number;
      attachment?: string;
      sender: string;
      feeAssetId: string;
      proofs: string[];
      assetId: string;
      recipient?: string;
      feeAsset: string;
      id: string;
      timestamp: number;
      height: number;
      call?: { function: string, args: { type: string, value: string }[] };
      dApp?: string;
      payment?: { amount: number, assetId: string }[];
    }>> = await res.json()

    // TODO pagination
    // if (transactions.length === limit) {
    //   // do request again with ?after=<transactions[transactions.length-1].id>
    // }

    const transferTransactions: ITransferTransaction[] = transactions.filter(tx => tx.type === 4) as ITransferTransaction[]

    return transferTransactions.map(rawTx => ({
      from: rawTx.sender,
      to: rawTx.recipient,
      timestamp: rawTx.timestamp / 1000,
      value: rawTx.amount / MWAV_MULT,
      height: rawTx.height,
      txHash: rawTx.id
    }))
}

]
export const getTransfers = async (address: string, limit: number = 100): Promise<IWAVTransfer[]> => {
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

export const getBalance = async (address: string): Promise<number> => {
  let res
  try {
    res = await fetch(`https://nodes.wavesnodes.com/addresses/balance://nodes.wavesnodes.com/addresses/balance/${address}/0`)
  } catch (e) {
    throw new Error(e)
  }

  if (res.status !== 200) {
    throw new Error(`Response status code: ${res.status}`)
  }

  const jsonResult: {
    address: string;
    confirmations: number;
    balance: number;
  } = await res.json()

  return jsonResult.balance
}

export const payWAV = async (privateKey: TSeedTypes, from, to, amount) => {
  const signed = transfer(
    {
      amount: amount * Math.pow(10, 8),
      fee: 100000,
      recipient: to,
    },
    privateKey,
  )
  const nodeUrl = 'https://nodes.wavesplatform.com'
  return await broadcast(signed, nodeUrl)
}
