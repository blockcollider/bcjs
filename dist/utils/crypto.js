"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const avon = require('avon');
const toBuffer = require('to-buffer');
/**
 * Calculates blake2b hash
 *
 * @param input - string to be hashed
 * @returns {String} hash
 */
exports.blake2b = (input) => {
    return avon.sumBuffer(toBuffer(input), avon.ALGORITHMS.B).toString('hex');
};
/**
 * Calculates blake2bl hash
 *
 * @param input - string to be hashed
 * @returns {String} hash
 */
exports.blake2bl = (input) => {
    return exports.blake2b(input).slice(64, 128);
};
/**
 * Calculates blake2bl hash twice
 *
 * @param input - string to be hashed
 * @returns {String} hash
 */
exports.blake2blTwice = (input) => {
    return exports.blake2bl(exports.blake2bl(input));
};
/**
 * Calculates blake2bls hash
 *
 * @param input - string to be hashed
 * @returns {String} hash
 */
exports.blake2bls = (input) => {
    return exports.blake2b(input).slice(88, 128);
};
/**
 * Calculates blake2blc hash
 *
 * @param input - compressed address blake
 * @returns {String} hash
 */
exports.blake2blc = (input) => {
    const preimage = exports.blake2bl(input);
    const compressed = exports.blake2bls(preimage);
    return compressed;
};
//# sourceMappingURL=crypto.js.map