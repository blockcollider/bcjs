/**
 * Copyright (c) 2017-present, BlockCollider developers, All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export function isHexString (val: string): boolean {
  if (val.startsWith('0x')) {
    val = val.slice(2)
  }
  if (!val) {
    return false
  }
  const validHexChars = new Set('0123456789abcdefABCDEF'.split(''))
  for (const tryChar of val) {
    if (!validHexChars.has(tryChar)) {
      return false
    }
  }
  return true
}

export function normalizeHexString (hexStr: string): string {
  if (!isHexString(hexStr)) {
    throw new Error(`${hexStr} is not a valid hex string`)
  }

  let result = hexStr.toLowerCase()

  if (!result.startsWith('0x')) {
    result = `0x${result}`
  }

  return result
}
