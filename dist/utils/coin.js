"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bn_js_1 = __importDefault(require("bn.js"));
exports.COIN_FRACS = {
    BOSON: 'boson',
    NRG: 'nrg',
    WEIBETTER: 'weibetter',
};
exports.COIN_DIVISORS = {
    [exports.COIN_FRACS.BOSON]: 0,
    [exports.COIN_FRACS.WEIBETTER]: 1,
    [exports.COIN_FRACS.NRG]: 18,
};
exports.MIN_POSSIBLE_VALUE = new bn_js_1.default(1);
// 9.8 billion NRG in boson
exports.MAX_NRG_VALUE = 9800000000;
exports.MAX_POSSIBLE_VALUE = new bn_js_1.default(exports.MAX_NRG_VALUE).mul(new bn_js_1.default(10).pow(new bn_js_1.default(18)));
function getDivisor(unit) {
    if (unit in exports.COIN_DIVISORS) {
        return exports.COIN_DIVISORS[unit];
    }
    throw new Error('invalid unit');
}
function calcStringMulPowerTen(val, powTen) {
    const parts = val.split('.');
    if (parts.length === 1) {
        return new bn_js_1.default(val).mul(new bn_js_1.default(10).pow(new bn_js_1.default(powTen))).toString(10);
    }
    else if (parts.length === 2) {
        const decimalPart = parts[1];
        if (decimalPart.length >= powTen) {
            const res = parts[0] + parts[1].slice(0, powTen);
            return new bn_js_1.default(res).toString(10);
        }
        else {
            const remainderPow = powTen - decimalPart.length;
            return new bn_js_1.default(parts.join(''))
                .mul(new bn_js_1.default(10).pow(new bn_js_1.default(remainderPow)))
                .toString(10);
        }
    }
    else {
        throw new Error(`Invalid value: ${val}`);
    }
}
// val has to be in int string, no decimal
function calcStringDivPowerTen(valStr, powTen) {
    if (valStr.includes('.')) {
        throw new Error(`val does not support decimal div yet`);
    }
    if (powTen === 0) {
        return valStr;
    }
    // valBN / divisor
    if (valStr.length >= powTen) {
        const intPart = valStr.slice(0, valStr.length - powTen);
        const floatPart = valStr.slice(valStr.length - powTen).replace(/0+$/, '');
        if (floatPart === '') {
            return intPart;
        }
        else {
            if (intPart === '') {
                return '0.' + floatPart;
            }
            else {
                return intPart + '.' + floatPart;
            }
        }
    }
    else {
        return [
            '0',
            ('0'.repeat(powTen - valStr.length) + valStr).replace(/0+$/, ''),
        ]
            .filter(p => p)
            .join('.');
    }
}
exports.humanToBN = (val, unit) => {
    const divisor = getDivisor(unit);
    if (unit === exports.COIN_FRACS.BOSON && val.includes('.')) {
        throw new Error(`Invalid val: ${val}, since boson is the minimum supported unit`);
    }
    const amt = new bn_js_1.default(calcStringMulPowerTen(val, divisor));
    if (amt.lt(exports.MIN_POSSIBLE_VALUE) || amt.gt(exports.MAX_POSSIBLE_VALUE)) {
        throw new Error('Can not represent such value - out of bounds');
    }
    return amt;
};
exports.humanToInternal = (val, unit) => {
    const amt = exports.humanToBN(val, unit);
    return amt.toBuffer();
};
// supports decimal
exports.internalToHuman = (internal, unit) => {
    const divisor = getDivisor(unit);
    const valStr = new bn_js_1.default(internal).toString(10);
    if (divisor === 0) {
        return valStr;
    }
    // valBN / divisor
    if (valStr.length >= divisor) {
        const intPart = valStr.slice(0, valStr.length - divisor);
        const floatPart = valStr.slice(valStr.length - divisor).replace(/0+$/, '');
        if (floatPart === '') {
            return intPart;
        }
        else {
            if (intPart === '') {
                return '0.' + floatPart;
            }
            else {
                return intPart + '.' + floatPart;
            }
        }
    }
    else {
        return [
            '0',
            ('0'.repeat(divisor - valStr.length) + valStr).replace(/0+$/, ''),
        ]
            .filter(p => p)
            .join('.');
    }
};
exports.internalToBN = (internal, unit) => {
    if (unit !== exports.COIN_FRACS.BOSON) {
        throw new Error('internalToBN only supports BOSON');
    }
    return new bn_js_1.default(internal);
};
exports.CurrencyInfo = {
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
};
exports.CurrencyConverter = {
    eth: function (val, from, to) {
        const power = 18;
        if (from === to) {
            return val;
        }
        else if (from === 'eth' && to === 'wei') {
            return calcStringMulPowerTen(val, power); // 1 ETH = 10^8 WEI
        }
        else if (from === 'wei' && to === 'eth') {
            return calcStringDivPowerTen(val, power); // 1 ETH = 10^8 WEI
        }
        throw new Error('invalid unit');
    },
    btc: function (val, from, to) {
        const power = 8;
        if (from === to) {
            return val;
        }
        else if (from === 'btc' && to === 'satoshi') {
            return calcStringMulPowerTen(val, power);
        }
        else if (from === 'satoshi' && to === 'btc') {
            return calcStringDivPowerTen(val, power);
        }
        throw new Error('invalid unit');
    },
    neo: function (val, from, to) {
        if (val.includes('.')) {
            throw new Error('invalid value, NEO is indivisible');
        }
        return val;
    },
    lsk: function (val, from, to) {
        const power = 8;
        if (from === to) {
            return val;
        }
        else if (from === 'lsk' && to === 'mlsk') {
            return calcStringMulPowerTen(val, power);
        }
        else if (from === 'mlsk' && to === 'lsk') {
            return calcStringDivPowerTen(val, power);
        }
        throw new Error('invalid unit');
    },
    wav: function (val, from, to) {
        const power = 8;
        if (from === to) {
            return val;
        }
        else if (from === 'wav' && to === 'mwav') {
            return calcStringMulPowerTen(val, power);
        }
        else if (from === 'mwav' && to === 'wav') {
            return calcStringDivPowerTen(val, power);
        }
        throw new Error('invalid unit');
    },
};
class Currency {
    static toMinimumUnitAsStr(currency, value, from) {
        return exports.CurrencyConverter[currency](value, from, exports.CurrencyInfo[currency].minUnit);
    }
    static toMinimumUnitAsBN(currency, value, from) {
        return new bn_js_1.default(Currency.toMinimumUnitAsStr(currency, value, from));
    }
    static fromMinimumUnitToHuman(currency, value, from) {
        return exports.CurrencyConverter[currency](value, from, exports.CurrencyInfo[currency].humanUnit);
    }
}
exports.Currency = Currency;
//# sourceMappingURL=coin.js.map