import BN from 'bn.js'

interface CurrencyConverterInterface {
  [key:string]: (val: string, from: string, to: string) => string | never
}

interface CurrencyInterface {
  [key:string]: string
}

interface CurrencyInfoInterface {
  [key:string]: CurrencyInterface
}

export const COIN_FRACS = {
  BOSON: 'boson',
  NRG: 'nrg',
  WEIBETTER: 'weibetter',
}

export const COIN_DIVISORS = {
  [COIN_FRACS.BOSON]: 0,
  [COIN_FRACS.WEIBETTER]: 1,
  [COIN_FRACS.NRG]: 18,
}

export const MIN_POSSIBLE_VALUE = new BN(1)

// 9.8 billion NRG in boson
export const MAX_NRG_VALUE = 9800000000
export const MAX_POSSIBLE_VALUE = new BN(MAX_NRG_VALUE).mul(
  new BN(10).pow(new BN(18)),
)

function getDivisor(unit: string): number {
  if (unit in COIN_DIVISORS) {
    return COIN_DIVISORS[unit]
  }
  throw new Error('invalid unit')
}

function calcStringMulPowerTen(val: string, powTen: number): string {
  const parts = val.split('.')
  if (parts.length === 1) {
    return new BN(val).mul(new BN(10).pow(new BN(powTen))).toString(10)
  } else if (parts.length === 2) {
    const decimalPart = parts[1]
    if (decimalPart.length >= powTen) {
      const res = parts[0] + parts[1].slice(0, powTen)
      return new BN(res).toString(10)
    } else {
      const remainderPow = powTen - decimalPart.length
      return new BN(parts.join(''))
        .mul(new BN(10).pow(new BN(remainderPow)))
        .toString(10)
    }
  } else {
    throw new Error(`Invalid value: ${val}`)
  }
}

// val has to be in int string, no decimal
function calcStringDivPowerTen(valStr: string, powTen: number): string {
  if (valStr.includes('.')) {
    throw new Error(`val does not support decimal div yet`)
  }
  if (powTen === 0) {
    return valStr
  }

  // valBN / divisor
  if (valStr.length >= powTen) {
    const intPart = valStr.slice(0, valStr.length - powTen)

    const floatPart = valStr.slice(valStr.length - powTen).replace(/0+$/, '')
    if (floatPart === '') {
      return intPart
    } else {
      if (intPart === '') {
        return '0.' + floatPart
      } else {
        return intPart + '.' + floatPart
      }
    }
  } else {
    return [
      '0',
      ('0'.repeat(powTen - valStr.length) + valStr).replace(/0+$/, ''),
    ]
      .filter(p => p)
      .join('.')
  }
}

export const humanToBN = (val: string, unit: string): BN => {
  const divisor = getDivisor(unit)
  if (unit === COIN_FRACS.BOSON && val.includes('.')) {
    throw new Error(
      `Invalid val: ${val}, since boson is the minimum supported unit`,
    )
  }
  const amt = new BN(calcStringMulPowerTen(val, divisor))
  if (amt.lt(MIN_POSSIBLE_VALUE) || amt.gt(MAX_POSSIBLE_VALUE)) {
    throw new Error('Can not represent such value - out of bounds')
  }

  return amt
}

export const humanToInternal = (val: string, unit: string): Buffer => {
  const amt = humanToBN(val, unit)
  return amt.toBuffer()
}

// supports decimal
export const internalToHuman = (internal: Buffer, unit: string): string => {
  const divisor = getDivisor(unit)
  const valStr = new BN(internal).toString(10)

  if (divisor === 0) {
    return valStr
  }

  // valBN / divisor
  if (valStr.length >= divisor) {
    const intPart = valStr.slice(0, valStr.length - divisor)

    const floatPart = valStr.slice(valStr.length - divisor).replace(/0+$/, '')
    if (floatPart === '') {
      return intPart
    } else {
      if (intPart === '') {
        return '0.' + floatPart
      } else {
        return intPart + '.' + floatPart
      }
    }
  } else {
    return [
      '0',
      ('0'.repeat(divisor - valStr.length) + valStr).replace(/0+$/, ''),
    ]
      .filter(p => p)
      .join('.')
  }
}

export const internalToBN = (internal: Buffer, unit: string): BN => {
  if (unit !== COIN_FRACS.BOSON) {
    throw new Error('internalToBN only supports BOSON')
  }
  return new BN(internal)
}

export const CurrencyInfo: CurrencyInfoInterface = {
  eth: {
    ETH: 'eth',
    WEI: 'wei',
    minUnit: 'wei',
    humanUnit: 'eth',
  },
  btc: {
    BTC: 'btc',
    SATOSHI: 'satoshi',
    minUnit: 'satoshi',
    humanUnit: 'btc',
  },
  neo: {
    NEO: 'neo',
    minUnit: 'neo',
    humanUnit: 'neo',
  },
  lsk: {
    LSK: 'lsk',
    minLsk: 'mwav',
    minUnit: 'mlsk',
    humanUnit: 'lsk',
  },
  wav: {
    WAV: 'wav',
    minWav: 'mwav',
    minUnit: 'mwav',
    humanUnit: 'wav',
  },
}

export const CurrencyConverter: CurrencyConverterInterface = {
  eth: function(val: string, from: string, to: string): string | never {
    const power = 18
    if (from === to) {
      return val
    } else if (from === 'eth' && to === 'wei') {
      return calcStringMulPowerTen(val, power) // 1 ETH = 10^8 WEI
    } else if (from === 'wei' && to === 'eth') {
      return calcStringDivPowerTen(val, power) // 1 ETH = 10^8 WEI
    }
    throw new Error('invalid unit')
  },
  btc: function(val: string, from: string, to: string): string | never {
    const power = 8
    if (from === to) {
      return val
    } else if (from === 'btc' && to === 'satoshi') {
      return calcStringMulPowerTen(val, power)
    } else if (from === 'satoshi' && to === 'btc') {
      return calcStringDivPowerTen(val, power)
    }
    throw new Error('invalid unit')
  },
  neo: function(val: string, from: string, to: string): string | never {
    if (val.includes('.')) {
      throw new Error('invalid value, NEO is indivisible')
    }
    return val
  },
  lsk: function(val: string, from: string, to: string): string | never {
    const power = 8
    if (from === to) {
      return val
    } else if (from === 'lsk' && to === 'mlsk') {
      return calcStringMulPowerTen(val, power)
    } else if (from === 'mlsk' && to === 'lsk') {
      return calcStringDivPowerTen(val, power)
    }
    throw new Error('invalid unit')
  },
  wav: function(val: string, from: string, to: string): string | never {
    const power = 8
    if (from === to) {
      return val
    } else if (from === 'wav' && to === 'mwav') {
      return calcStringMulPowerTen(val, power)
    } else if (from === 'mwav' && to === 'wav') {
      return calcStringDivPowerTen(val, power)
    }
    throw new Error('invalid unit')
  },
}

export class Currency {

  static toMinimumUnitAsStr(
    currency: string,
    value: string,
    from: string,
  ): string | never {
    return CurrencyConverter[currency](
      value,
      from,
      CurrencyInfo[currency].minUnit,
    )
  }

  static toMinimumUnitAsBN(currency: string, value: string, from: string): BN | never {
    return new BN(Currency.toMinimumUnitAsStr(currency, value, from))
  }

  static fromMinimumUnitToHuman(
    currency: string,
    value: string,
    from: string,
  ): string | never {
    return CurrencyConverter[currency](
      value,
      from,
      CurrencyInfo[currency].humanUnit,
    )
  }
}
