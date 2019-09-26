/// <reference types="node" />
/**
 * Calculates blake2b hash
 *
 * @param input - string to be hashed
 * @returns {String} hash
 */
export declare const blake2b: (input: string | Buffer) => string;
/**
 * Calculates blake2bl hash
 *
 * @param input - string to be hashed
 * @returns {String} hash
 */
export declare const blake2bl: (input: string | Buffer) => string;
/**
 * Calculates blake2bl hash twice
 *
 * @param input - string to be hashed
 * @returns {String} hash
 */
export declare const blake2blTwice: (input: string | Buffer) => string;
/**
 * Calculates blake2bls hash
 *
 * @param input - string to be hashed
 * @returns {String} hash
 */
export declare const blake2bls: (input: string | Buffer) => string;
/**
 * Calculates blake2blc hash
 *
 * @param input - compressed address blake
 * @returns {String} hash
 */
export declare const blake2blc: (input: string | Buffer) => string;
