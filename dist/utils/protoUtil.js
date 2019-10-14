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
const bytecode_1 = require("../script/bytecode");
exports.bnToBytes = (value) => {
    return new Uint8Array(value.toArrayLike(Buffer));
};
exports.bytesToInternalBN = (value) => {
    return coin_1.internalToBN(value, coin_1.COIN_FRACS.BOSON);
};
exports.convertProtoBufSerializedBytesToBuffer = (val) => {
    return (new bn_js_1.default(Buffer.from(val, 'base64'))).toArrayLike(Buffer);
};
exports.createOutPoint = (hash, index, val) => {
    const outPoint = new coreProtobuf.OutPoint();
    outPoint.setHash(hash);
    outPoint.setIndex(index);
    outPoint.setValue(exports.bnToBytes(val));
    return outPoint;
};
exports.createTransactionInput = (outPoint, unlockScript) => {
    const input = new coreProtobuf.TransactionInput();
    input.setOutPoint(outPoint);
    input.setScriptLength(unlockScript.length);
    input.setInputScript(new Uint8Array(bytecode_1.fromASM(unlockScript, 0x01)));
    return input;
};
exports.createTransactionOutput = (outputLockScript, unit, value) => {
    const output = new coreProtobuf.TransactionOutput();
    output.setValue(exports.bnToBytes(value));
    output.setUnit(exports.bnToBytes(unit));
    output.setScriptLength(outputLockScript.length);
    output.setOutputScript(new Uint8Array(bytecode_1.fromASM(outputLockScript, 0x01)));
    return output;
};
//# sourceMappingURL=protoUtil.js.map