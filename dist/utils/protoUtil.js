"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const bn_js_1 = __importDefault(require("bn.js"));
const coreProtobuf = __importStar(require("./../protos/core_pb"));
const coin_1 = require("./coin");
exports.bnToBytes = (value) => {
    return new Uint8Array(value.toBuffer());
};
exports.bytesToInternalBN = (value) => {
    return coin_1.internalToBN(value, coin_1.COIN_FRACS.BOSON);
};
exports.stringToBytes = (value, encoding) => {
    return new Uint8Array(Buffer.from(value, encoding));
};
exports.bytesToString = (value) => {
    return Buffer.from(value).toString('ascii');
};
exports.convertProtoBufSerializedBytesToNumStr = (val) => {
    return (new bn_js_1.default(Buffer.from(val, 'base64'))).toString(10);
};
exports.createOutPoint = (hash, index, val) => {
    const outPoint = new coreProtobuf.OutPoint();
    outPoint.setHash(hash);
    outPoint.setIndex(index);
    outPoint.setValue(new Uint8Array(val.toBuffer()));
    return outPoint;
};
exports.createTransactionInput = (outPoint, unlockScript) => {
    const input = new coreProtobuf.TransactionInput();
    input.setOutPoint(outPoint);
    input.setScriptLength(unlockScript.length);
    input.setInputScript(exports.stringToBytes(unlockScript, 'ascii'));
    return input;
};
exports.createTransactionOutput = (outputLockScript, unit, value) => {
    const output = new coreProtobuf.TransactionOutput();
    output.setValue(exports.bnToBytes(value));
    output.setUnit(exports.bnToBytes(unit));
    output.setScriptLength(outputLockScript.length);
    output.setOutputScript(exports.stringToBytes(outputLockScript, 'ascii'));
    return output;
};
//# sourceMappingURL=protoUtil.js.map