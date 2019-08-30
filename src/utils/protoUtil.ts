import BN from 'bn.js'


export const bnToBytes = (value: BN): Uint8Array => {
  return new Uint8Array(value.toBuffer())
}

export const stringToBytes = (value: string, encoding: 'ascii'|'hex'): Uint8Array => {
  return new Uint8Array(Buffer.from(value, encoding))
}

export const bytesToString = (value: Uint8Array): string => {
  return Buffer.from(value).toString('ascii')
}
