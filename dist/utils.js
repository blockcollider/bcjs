"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_pb_1 = require("./protos/core_pb");
function objectToStructure(obj) {
    for (const key in obj) {
        console.log(key);
    }
    return new core_pb_1.BcBlock();
}
let obj = { hash: '',
    previousHash: '',
    version: 0,
    schemaVersion: 0,
    height: 0,
    miner: '',
    difficulty: '',
    timestamp: 0,
    merkleRoot: '',
    chainRoot: '',
    distance: '',
    totalDistance: '',
    nonce: '',
    nrgGrant: 0,
    targetHash: '',
    targetHeight: 0,
    targetMiner: '',
    targetSignature: '',
    twn: 0,
    twsList: [],
    emblemWeight: 0,
    emblemChainBlockHash: '',
    emblemChainFingerprintRoot: '',
    emblemChainAddress: '',
    txCount: 0,
    txsList: [],
    txFeeBase: 0,
    txDistanceSumLimit: 0,
    blockchainHeadersCount: 0,
    blockchainHeaders: undefined,
    blockchainFingerprintsRoot: '' };
objectToStructure(obj);
//# sourceMappingURL=utils.js.map