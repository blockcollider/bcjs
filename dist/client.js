"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
var BcRpcMethod;
(function (BcRpcMethod) {
    BcRpcMethod["GetLatestBlocks"] = "getLatestBlock";
    BcRpcMethod["Help"] = "help";
    BcRpcMethod["Stats"] = "stats";
    BcRpcMethod["NewTx"] = "newTx";
    BcRpcMethod["GetBalance"] = "getBalance";
    BcRpcMethod["GetSpendableCollateral"] = "getSpendableCollateral";
    BcRpcMethod["UnlockCollateral"] = "unlockCollateral";
    BcRpcMethod["PlaceMakerOrder"] = "placeMakerOrder";
    BcRpcMethod["PlaceTakerOrder"] = "placeTakerOrder";
    BcRpcMethod["PlaceTakerOrders"] = "placeTakerOrders";
    BcRpcMethod["CalculateMakerFee"] = "calculateMakerFee";
    BcRpcMethod["CalculateTakerFee"] = "calculateTakerFee";
    BcRpcMethod["GetOpenOrders"] = "getOpenOrders";
    BcRpcMethod["GetMatchedOrders"] = "getMatchedOrders";
    BcRpcMethod["GetBlake2bl"] = "getBlake2bl";
    BcRpcMethod["GetBcAddressViaVanity"] = "getBcAddressViaVanity";
})(BcRpcMethod || (BcRpcMethod = {}));
function btoa(str) {
    var buffer;
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
            this.defaultHeaders = { 'Content-Type': 'application/json', authorization: 'Basic ' + btoa(`:${authToken}`) };
        }
        else {
            if (this.rpcUrl.protocol === 'https:') {
                throw new Error('You have to provide an authToken with https:// scheme');
            }
            this.defaultHeaders = { 'Content-Type': 'application/json' };
        }
        if (this.rpcUrl.port === '') {
            this.rpcUrl = new URL(`${this.rpcUrl.origin}:3000`);
        }
    }
    makeJsonRpcRequest(method, rpcParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = Math.abs(Math.random() * 1e6 | 0);
            const rpcBody = {
                id,
                jsonrpc: '2.0',
                method,
                params: rpcParams
            };
            let res;
            try {
                res = yield node_fetch_1.default(`${this.rpcUrl.origin}/rpc`, {
                    method: 'post',
                    body: JSON.stringify(rpcBody),
                    headers: this.defaultHeaders
                });
            }
            catch (e) {
                return {
                    code: -1,
                    message: e.toString()
                };
            }
            if (res.status !== 200) {
                return {
                    code: res.status,
                    message: res.statusText
                };
            }
            let jsonResult = yield res.json();
            if ("code" in jsonResult) {
                return jsonResult;
            }
            if (jsonResult.id !== id) {
                return {
                    message: `Ids didn't match - sent ${id}, got ${jsonResult.id}`,
                    code: -32603,
                };
            }
            return jsonResult.result;
        });
    }
    getBlake2Bl(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.makeJsonRpcRequest(BcRpcMethod.GetBlake2bl, request.toArray());
            return result;
        });
    }
    createMakerOrder(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.makeJsonRpcRequest(BcRpcMethod.PlaceMakerOrder, request.toArray());
            return result;
        });
    }
    getBalance(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.makeJsonRpcRequest(BcRpcMethod.GetBalance, request.toArray());
            return result;
        });
    }
}
exports.default = RpcClient;
//# sourceMappingURL=client.js.map