/// <reference types="node" />
import BN from 'bn.js';
interface ICurrencyConverterInterface {
    [key: string]: (val: string, from: string, to: string) => string | never;
}
interface ICurrencyInterface {
    [key: string]: string;
}
interface ICurrencyInfoInterface {
    [key: string]: ICurrencyInterface;
}
export declare const COIN_FRACS: {
    BOSON: string;
    NRG: string;
    WEIBETTER: string;
};
export declare const COIN_DIVISORS: {
    [x: string]: number;
};
export declare const MIN_POSSIBLE_VALUE: BN;
export declare const MAX_NRG_VALUE = 9800000000;
export declare const MAX_POSSIBLE_VALUE: BN;
export declare const humanToInternalAsBN: (val: string, unit: string) => BN;
export declare const humanToInternal: (val: string, unit: string) => Buffer;
export declare const internalBNToHuman: (val: BN, unit: string) => string;
export declare const internalToHuman: (internal: Buffer, unit: string) => string;
export declare const internalToBN: (internal: Uint8Array | Buffer, unit: string) => BN;
export declare const CurrencyInfo: ICurrencyInfoInterface;
export declare const CurrencyConverter: ICurrencyConverterInterface;
export declare class Currency {
    static toMinimumUnitAsStr(currency: string, value: string, from: string): string | never;
    static toMinimumUnitAsBN(currency: string, value: string, from: string): BN | never;
    static fromMinimumUnitToHuman(currency: string, value: string, from: string): string | never;
}
export {};
