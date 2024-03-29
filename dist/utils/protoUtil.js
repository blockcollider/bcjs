"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const coreProtobuf = __importStar(require("@overline/proto/proto/core_pb"));
const bn_js_1 = __importDefault(require("bn.js"));
const bytecode_1 = require("../script/bytecode");
const coin_1 = require("./coin");
function asmToV1Protobuf(asm) {
    return new Uint8Array(bytecode_1.fromASM(asm, 0x01));
}
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
exports.getOutputByteLength = (output) => {
    return new bn_js_1.default(output.getScriptLength()) // script
        .add(new bn_js_1.default(output.getValue().length)) // value
        .add(new bn_js_1.default(output.getUnit().length)) // unit
        .add(new bn_js_1.default(4)); // scriptLength
};
exports.getOutPointByteLength = (outPoint) => {
    if (outPoint) {
        return new bn_js_1.default(outPoint.getValue().length) // value
            .add(new bn_js_1.default(8)) // index
            .add(new bn_js_1.default(128)); // hash
    }
    else {
        return new bn_js_1.default(0);
    }
};
exports.getInputByteLength = (input) => {
    return new bn_js_1.default(input.getScriptLength()) // script
        .add(new bn_js_1.default(4)) // scriptLength
        .add(exports.getOutPointByteLength(input.getOutPoint()));
};
exports.getTransactionSize = (tx) => {
    let size = new bn_js_1.default(0);
    for (const input of tx.getInputsList()) {
        size = size.add(exports.getInputByteLength(input));
    }
    for (const output of tx.getOutputsList()) {
        size = size.add(exports.getOutputByteLength(output));
    }
    return size;
};
exports.createTransactionInput = (outPoint, unlockScript) => {
    const input = new coreProtobuf.TransactionInput();
    input.setOutPoint(outPoint);
    const byteCode = asmToV1Protobuf(unlockScript);
    input.setScriptLength(byteCode.length);
    input.setInputScript(byteCode);
    return input;
};
exports.createTransactionOutput = (outputLockScript, unit, value) => {
    const output = new coreProtobuf.TransactionOutput();
    output.setValue(exports.bnToBytes(value));
    output.setUnit(exports.bnToBytes(unit));
    const byteCode = asmToV1Protobuf(outputLockScript);
    output.setScriptLength(byteCode.length);
    output.setOutputScript(byteCode);
    return output;
};
//# sourceMappingURL=protoUtil.js.map