"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:max-line-length */
/* tslint:disable:interface-name */
require('es6-promise').polyfill(); /* tslint:disable-line */
require('isomorphic-fetch'); /* tslint:disable-line */
var BcRpcMethod;
(function (BcRpcMethod) {
    BcRpcMethod["NewTx"] = "newTx";
    BcRpcMethod["NewFeedTx"] = "newFeedTx";
    BcRpcMethod["GetSpendableOutpoints"] = "getSpendableOutpoints";
    BcRpcMethod["GetBalance"] = "getBalance";
    BcRpcMethod["GetWallet"] = "getWallet";
    BcRpcMethod["GetSpendableCollateral"] = "getSpendableCollateral";
    BcRpcMethod["GetUnlockTakerTxParams"] = "getUnlockTakerTxParams";
    BcRpcMethod["PlaceMakerOrder"] = "placeMakerOrder";
    BcRpcMethod["PlaceTakerOrder"] = "placeTakerOrder";
    BcRpcMethod["PlaceTakerOrders"] = "placeTakerOrders";
    BcRpcMethod["CalculateMakerFee"] = "calculateMakerFee";
    BcRpcMethod["CalculateTakerFee"] = "calculateTakerFee";
    BcRpcMethod["GetOpenOrders"] = "getOpenOrders";
    BcRpcMethod["GetMatchedOrders"] = "getMatchedOrders";
    BcRpcMethod["GetBlake2bl"] = "getBlake2bl";
    BcRpcMethod["GetTxClaimedBy"] = "getTxClaimedBy";
    BcRpcMethod["GetTradeStatus"] = "getTradeStatus";
    BcRpcMethod["GetOutpointStatus"] = "getOutpointStatus";
    BcRpcMethod["GetBcAddressViaVanity"] = "getBcAddressViaVanity";
    BcRpcMethod["GetLatestBlock"] = "getLatestBlock";
    BcRpcMethod["GetLatestRoveredBlocks"] = "getLatestRoveredBlocks";
    BcRpcMethod["GetBlockHeight"] = "getBlockHeight";
    BcRpcMethod["GetBlockHash"] = "getBlockHash";
    BcRpcMethod["GetRoveredBlockHeight"] = "getRoveredBlockHeight";
    BcRpcMethod["GetRoveredBlockHash"] = "getRoveredBlockHash";
    BcRpcMethod["GetBlocks"] = "getBlocks";
    BcRpcMethod["GetRoveredBlocks"] = "getRoveredBlocks";
    BcRpcMethod["GetTx"] = "getTx";
    BcRpcMethod["GetMarkedTx"] = "getMarkedTx";
    BcRpcMethod["SendTx"] = "sendTx";
})(BcRpcMethod || (BcRpcMethod = {}));
function btoa(str) {
    let buffer;
    if (str instanceof Buffer) {
        buffer = str;
    }
    else {
        buffer = Buffer.from(str.toString(), 'binary');
    }
    return buffer.toString('base64');
}
class RpcClient {
    constructor(nodeUrl, authToken) {
        this.rpcUrl = new URL(nodeUrl);
        if (authToken) {
            this.defaultHeaders = { 'Content-Type': 'application/json', 'authorization': 'Basic ' + btoa(`:${authToken}`) };
        }
        else {
            if (this.rpcUrl.protocol === 'https:') {
                throw new Error('You have to provide an authToken with https:// scheme');
            }
            this.defaultHeaders = { 'Content-Type': 'application/json' };
        }
    }
    getRoveredBlockHash(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.makeJsonRpcRequest(BcRpcMethod.GetRoveredBlockHash, request.toArray());
            return result;
        });
    }
    getRoveredBlockHeight(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.makeJsonRpcRequest(BcRpcMethod.GetRoveredBlockHeight, request.toArray());
            return result;
        });
    }
    getRoveredBlocks(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.makeJsonRpcRequest(BcRpcMethod.GetRoveredBlocks, request.toArray());
            return result;
        });
    }
    getLatestRoveredBlock() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.makeJsonRpcRequest(BcRpcMethod.GetLatestRoveredBlocks, []);
            return result;
        });
    }
    getBlockHash(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.makeJsonRpcRequest(BcRpcMethod.GetBlockHash, request.toArray());
            return result;
        });
    }
    getBlockHeight(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.makeJsonRpcRequest(BcRpcMethod.GetBlockHeight, request.toArray());
            return result;
        });
    }
    getBlocks(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.makeJsonRpcRequest(BcRpcMethod.GetBlocks, request.toArray());
            return result;
        });
    }
    getLatestBlock() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.makeJsonRpcRequest(BcRpcMethod.GetLatestBlock, []);
            return result;
        });
    }
    getTx(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.makeJsonRpcRequest(BcRpcMethod.GetTx, request.toArray());
            return result;
        });
    }
    getMarkedTx(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.makeJsonRpcRequest(BcRpcMethod.GetMarkedTx, request.toArray());
            return result;
        });
    }
    newTx(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.makeJsonRpcRequest(BcRpcMethod.NewTx, request.toArray());
            return result;
        });
    }
    newFeedTx(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.makeJsonRpcRequest(BcRpcMethod.NewFeedTx, request.toArray());
            return result;
        });
    }
    getBalance(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.makeJsonRpcRequest(BcRpcMethod.GetBalance, request.toArray());
            return result;
        });
    }
    getWallet(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.makeJsonRpcRequest(BcRpcMethod.GetWallet, request.toArray());
            return result;
        });
    }
    getSpendableOutpoints(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.makeJsonRpcRequest(BcRpcMethod.GetSpendableOutpoints, request.toArray());
            return result;
        });
    }
    getSpendableCollateral(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.makeJsonRpcRequest(BcRpcMethod.GetSpendableCollateral, request.toArray());
            return result;
        });
    }
    getUnlockTakerTxParams(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.makeJsonRpcRequest(BcRpcMethod.GetUnlockTakerTxParams, request.toArray());
            return result;
        });
    }
    getOpenOrders(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.makeJsonRpcRequest(BcRpcMethod.GetOpenOrders, request.toArray());
            return result;
        });
    }
    sendTx(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.makeJsonRpcRequest(BcRpcMethod.SendTx, Buffer.from(request.serializeBinary()));
            return result;
        });
    }
    getMatchedOrders(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.makeJsonRpcRequest(BcRpcMethod.GetMatchedOrders, Buffer.from(request.serializeBinary()));
            return result;
        });
    }
    getBlake2Bl(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.makeJsonRpcRequest(BcRpcMethod.GetBlake2bl, request.toArray());
            return result;
        });
    }
    getTxClaimedBy(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.makeJsonRpcRequest(BcRpcMethod.GetTxClaimedBy, request.toArray());
            return result;
        });
    }
    getTradeStatus(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.makeJsonRpcRequest(BcRpcMethod.GetTradeStatus, request.toArray());
            return result;
        });
    }
    getOutpointStatus(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.makeJsonRpcRequest(BcRpcMethod.GetOutpointStatus, request.toArray());
            return result;
        });
    }
    getBcAddressViaVanity(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.makeJsonRpcRequest(BcRpcMethod.GetBcAddressViaVanity, request.toArray());
            return result;
        });
    }
    makeJsonRpcRequest(method, rpcParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Math.abs(Math.random() * 1e6 | 0); /* tslint:disable-line */ // this bitwise operation is intentional
            const rpcBody = {
                id,
                jsonrpc: '2.0',
                method,
                params: rpcParams,
            };
            let res;
            try {
                res = yield fetch(`${this.rpcUrl.origin}/rpc`, {
                    body: JSON.stringify(rpcBody),
                    headers: this.defaultHeaders,
                    method: 'post',
                });
            }
            catch (e) {
                return {
                    code: -1,
                    message: e.toString(),
                };
            }
            if (res.status !== 200) {
                return {
                    code: res.status,
                    message: res.statusText,
                };
            }
            const jsonResult = yield res.json();
            if ('code' in jsonResult) {
                return jsonResult;
            }
            if (jsonResult.id !== id) {
                return {
                    code: -32603,
                    message: `Ids didn't match - sent ${id}, got ${jsonResult.id}`,
                };
            }
            return jsonResult.result;
        });
    }
}
exports.default = RpcClient;
//# sourceMappingURL=client.js.map