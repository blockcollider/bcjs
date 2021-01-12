const isNode =
  typeof process !== 'undefined' &&
  process.versions != null &&
  process.versions.node != null

const toBuffer: (buf: Buffer|string) => Buffer = require('to-buffer') // tslint:disable-line

class Blaker {
  public static blake2b (input: string | Buffer): string {
    if (isNode) {
      const avon = require('avon')
      return avon.sumBuffer(toBuffer(input), avon.ALGORITHMS.B).toString('hex')
    } else {
      const blake = require('blakejs')
      return blake.blake2bHex(input)
    }
  }
}

/**
 * Calculates blake2b hash
 *
 * @param input - string to be hashed
 * @returns {String} hash
 */
export const blake2b = (input: string | Buffer): string => {
  return Blaker.blake2b(input)
}

/**
 * Calculates blake2bl hash
 *
 * @param input - string to be hashed
 * @returns {String} hash
 */
export const blake2bl = (input: string | Buffer): string => {
  return blake2b(input).slice(64, 128)
}

/**
 * Calculates blake2bl hash twice
 *
 * @param input - string to be hashed
 * @returns {String} hash
 */
export const blake2blTwice = (input: string | Buffer): string => {
  return blake2bl(blake2bl(input))
}

/**
 * Calculates blake2bls hash
 *
 * @param input - string to be hashed
 * @returns {String} hash
 */
export const blake2bls = (input: string | Buffer): string => {
  return blake2b(input).slice(88, 128)
}

/**
 * Calculates blake2blc hash
 *
 * @param input - compressed address blake
 * @returns {String} hash
 */
export const blake2blc = (input: string | Buffer): string => {
  const preimage = blake2bl(input)
  const compressed = blake2bls(preimage)
  return compressed
}
