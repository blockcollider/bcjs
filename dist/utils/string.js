"use strict";
/**
 * Copyright (c) 2017-present, BlockCollider developers, All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
function isHexString(val) {
    if (val.startsWith('0x')) {
        val = val.slice(2);
    }
    if (!val) {
        return false;
    }
    const validHexChars = new Set('0123456789abcdefABCDEF'.split(''));
    for (const tryChar of val) {
        if (!validHexChars.has(tryChar)) {
            return false;
        }
    }
    return true;
}
exports.isHexString = isHexString;
function normalizeHexString(hexStr) {
    if (!isHexString(hexStr)) {
        throw new Error(`${hexStr} is not a valid hex string`);
    }
    let result = hexStr.toLowerCase();
    if (!result.startsWith('0x')) {
        result = `0x${result}`;
    }
    return result;
}
exports.normalizeHexString = normalizeHexString;
//# sourceMappingURL=string.js.map