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
exports.MIN_POSSIBLE_VALUE = new bn_js_1.default(0);
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
    const parts = val.toString().split('.');
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
        throw new Error('val does not support decimal div yet');
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
exports.humanToInternalAsBN = (val, unit) => {
    if (Number.isNaN(Number(val))) {
        throw new Error(val + ' is not number');
    }
    if (val.toString().startsWith('-')) {
        throw new Error(val + ' must be positive');
    }
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
    const amt = exports.humanToInternalAsBN(val, unit);
    return amt.toBuffer();
};
/* convert internal value from BN to human format with unit */
exports.internalBNToHuman = (val, unit) => {
    return exports.internalToHuman(val.toBuffer(), unit);
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
/* tslint:disable:object-literal-sort-keys */
exports.CurrencyInfo = {
    nrg: {
        NRG: 'nrg',
        BOSON: 'boson',
        minUnit: 'boson',
        humanUnit: 'nrg',
    },
    emb: {
        EMB: 'emb',
        DIA: 'dia',
        minUnit: 'dia',
        humanUnit: 'emb',
    },
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
    usdt: {
        USDT: 'usdt',
        minUsdt: 'ausdt',
        minUnit: 'ausdt',
        humanUnit: 'usdt',
    },
    dai: {
        DAI: 'dai',
        minDai: 'adai',
        minUnit: 'adai',
        humanUnit: 'dai',
    },
    xaut: {
        XAUT: 'xaut',
        minDai: 'axaut',
        minUnit: 'axaut',
        humanUnit: 'xaut',
    },
};
/* tslint:enable:object-literal-sort-keys */
exports.CurrencyConverter = {
    nrg(val, from, to) {
        const power = 18;
        if (from === to) {
            return val;
        }
        else if (from === 'nrg' && to === 'boson') {
            return calcStringMulPowerTen(val, power); // 1 NRG = 10^18 BOSON
        }
        else if (from === 'boson' && to === 'nrg') {
            return calcStringDivPowerTen(val, power); // 1 NRG = 10^18 BOSON
        }
        throw new Error('invalid unit');
    },
    emb(val, from, to) {
        const power = 8;
        if (from === to) {
            return val;
        }
        else if (from === 'emb' && to === 'dia') {
            return calcStringMulPowerTen(val, power); // 1 ETH = 10^18 WEI
        }
        else if (from === 'dia' && to === 'emb') {
            return calcStringDivPowerTen(val, power); // 1 ETH = 10^18 WEI
        }
        throw new Error('invalid unit');
    },
    eth(val, from, to) {
        const power = 18;
        if (from === to) {
            return val;
        }
        else if (from === 'eth' && to === 'wei') {
            return calcStringMulPowerTen(val, power); // 1 ETH = 10^18 WEI
        }
        else if (from === 'wei' && to === 'eth') {
            return calcStringDivPowerTen(val, power); // 1 ETH = 10^18 WEI
        }
        throw new Error('invalid unit');
    },
    btc(val, from, to) {
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
    neo(val, from, to) {
        if (val.toString().includes('.')) {
            throw new Error('invalid value, NEO is indivisible');
        }
        return val;
    },
    lsk(val, from, to) {
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
    wav(val, from, to) {
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
    usdt(val, from, to) {
        const power = 6;
        if (from === to) {
            return val;
        }
        else if (from === 'usdt' && to === 'ausdt') {
            return calcStringMulPowerTen(val, power); // 1 DAI = 10^18 aDAI
        }
        else if (from === 'ausdt' && to === 'usdt') {
            return calcStringDivPowerTen(val, power); // 1 DAI = 10^18 aDAI
        }
        throw new Error('invalid unit');
    },
    // adai = our name for further undivisible DAI (= atomic dai)
    dai(val, from, to) {
        const power = 18;
        if (from === to) {
            return val;
        }
        else if (from === 'dai' && to === 'adai') {
            return calcStringMulPowerTen(val, power); // 1 DAI = 10^18 aDAI
        }
        else if (from === 'adai' && to === 'dai') {
            return calcStringDivPowerTen(val, power); // 1 DAI = 10^18 aDAI
        }
        throw new Error('invalid unit');
    },
    // axaut = our name for further undivisible XAUt (= atomic XAUt)
    xaut(val, from, to) {
        const power = 6;
        if (from === to) {
            return val;
        }
        else if (from === 'xaut' && to === 'axaut') {
            return calcStringMulPowerTen(val, power); // 1 XAUt = 10^6 aXAUt
        }
        else if (from === 'axaut' && to === 'xaut') {
            return calcStringDivPowerTen(val, power); // 1 XAUt = 10^6 aXAUt
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