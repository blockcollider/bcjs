"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBuffer = require('to-buffer'); // tslint:disable-line
exports.leftPadBuffer = (maybeBuffer, length) => {
    const zeros = Buffer.allocUnsafe(length).fill(0);
    const buf = exports.toBuffer(maybeBuffer, 'hex');
    if (buf.length < length) {
        buf.copy(zeros, length - buf.length);
        return zeros;
    }
    return buf.slice(-length);
};
exports.intToBuffer = (n) => {
    let hex = n.toString(16);
    if (hex.length % 2) {
        hex = `0${hex}`;
    }
    return Buffer.from(hex, 'hex');
};
exports.bufferToInt = (buf) => {
    return parseInt(buf.toString('hex'), 16);
};
//# sourceMappingURL=buffer.js.map