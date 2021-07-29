"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:max-line-length */
/* tslint:disable:interface-name */
require('es6-promise').polyfill(); /* tslint:disable-line */
require('isomorphic-fetch'); /* tslint:disable-line */
const bc = __importStar(require("./protos/bc_pb"));
var BcRpcMethod;
(function (BcRpcMethod) {
    BcRpcMethod["NewTx"] = "newTx";
    BcRpcMethod["NewFeedTx"] = "newFeedTx";
    BcRpcMethod["GetSpendableOutpoints"] = "getSpendableOutpoints";
    BcRpcMethod["GetBalance"] = "getBalance";
    BcRpcMethod["GetWallet"] = "getWallet";
    BcRpcMethod["GetSpendableCollateral"] = "getSpendableCollateral";
    BcRpcMethod["GetUnlockTakerTxParams"] = "getUnlockTakerTxParams";
    BcRpcMethod["GetUnmatchedOrder"] = "getUnmatchedOrders";
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
    BcRpcMethod["GetByteFeeMultiplier"] = "getByteFeeMultiplier";
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
    BcRpcMethod["GetUTXOLength"] = "getUTXOLength";
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
    getUnlockableOrders(bcAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenDictionary = {
                btc: 'btc',
                dai: 'eth',
                emb: 'eth',
                eth: 'eth',
                lsk: 'lsk',
                neo: 'neo',
                nrg: 'bc',
                usdt: 'eth',
                wav: 'wav',
                xaut: 'eth',
            };
            function getChild(block, child) {
                if (child.toLowerCase() === 'nrg') {
                    return block.height;
                }
                else {
                    if (block.blockchainHeaders) {
                        const childChain = tokenDictionary[child];
                        const subChains = block.blockchainHeaders[`${childChain}List`];
                        return subChains[subChains.length - 1].height;
                    }
                    else {
                        throw new Error('Invalid Block');
                    }
                }
            }
            const self = this;
            function canUnlock(latestBlock, tradeHeight, settlement, shiftMaker, shiftTaker, sendsFromChain, receivesToChain) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const bcLeft = tradeHeight + settlement - latestBlock.height;
                        if (bcLeft > 0) {
                            return false;
                        }
                        else {
                            const getBlockHeightReq = new bc.GetBlockHeightRequest();
                            getBlockHeightReq.setHeight(tradeHeight + settlement);
                            let data = yield self.getBlockHeight(getBlockHeightReq);
                            data = data;
                            if (data && data.hash) {
                                const settleBlock = data;
                                const lastestChildMaker = getChild(latestBlock, sendsFromChain);
                                const lastestChildTaker = getChild(latestBlock, receivesToChain);
                                const settleChildMaker = getChild(settleBlock, sendsFromChain);
                                const settleChildTaker = getChild(settleBlock, receivesToChain);
                                const takerLeft = settleChildTaker + shiftTaker + 1 - lastestChildTaker;
                                const makerLeft = settleChildMaker + shiftMaker + 1 - lastestChildMaker;
                                return takerLeft <= 0 && makerLeft <= 0;
                            }
                            else {
                                return false;
                            }
                        }
                    }
                    catch (err) {
                        return false;
                    }
                });
            }
            const req = new bc.GetSpendableCollateralRequest();
            req.setAddress(bcAddress);
            const latestBcBlockResult = yield this.getLatestBlock();
            const latestBcBlock = latestBcBlockResult;
            const unlockableOrders = [];
            const matchedOrdersResult = yield this.getMatchedOrders(req);
            const matchedOrders = matchedOrdersResult.ordersList;
            for (const o of matchedOrders) {
                if (o.maker) {
                    const unlockable = yield canUnlock(latestBcBlock, o.maker.tradeHeight, o.maker.settlement, o.maker.shiftMaker, o.maker.shiftTaker, o.maker.sendsFromChain, o.maker.receivesToChain);
                    if (unlockable) {
                        unlockableOrders.push(o.maker);
                    }
                }
            }
            const openOrdersResult = yield this.getOpenOrders(req);
            const openOrders = openOrdersResult.ordersList;
            for (const o of openOrders) {
                const unlockable = yield canUnlock(latestBcBlock, o.tradeHeight, o.settlement, o.shiftMaker, o.shiftTaker, o.sendsFromChain, o.receivesToChain);
                if (unlockable) {
                    unlockableOrders.push(o);
                }
            }
            return unlockableOrders;
        });
    }
    getUnmatchedOrders(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.makeJsonRpcRequest(BcRpcMethod.GetUnmatchedOrder, request.toArray());
            return res;
        });
    }
    /**
     * Return all active open orders, which excludes expired open orders
     */
    getActiveOpenOrders(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const openOrdersResult = yield this.getOpenOrders(request);
            if ('code' in openOrdersResult) {
                return openOrdersResult;
            }
            const latestBcBlock = yield this.getLatestBlock();
            if ('code' in latestBcBlock) {
                return openOrdersResult;
            }
            const latestBcBlockHeight = latestBcBlock.height;
            const openOrderRes = openOrdersResult;
            const ordersList = openOrderRes.ordersList;
            const activeOpenOrders = [];
            for (const order of ordersList) {
                if (order.tradeHeight + order.deposit > latestBcBlockHeight) {
                    activeOpenOrders.push(order);
                }
            }
            openOrderRes.ordersList = activeOpenOrders;
            return openOrderRes;
        });
    }
    getByteFeeMultiplier(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.makeJsonRpcRequest(BcRpcMethod.GetByteFeeMultiplier, request.toArray());
            return result;
        });
    }
    /**
     * Return all open orders, which includes expired open orders
     */
    getOpenOrders(request) {
        return __awaiter(this, void 0, void 0, function* () {
            let bcAddress = '';
            if (request && request.getAddress) {
                bcAddress = request.getAddress();
            }
            let data = yield this.makeJsonRpcRequest(BcRpcMethod.GetUTXOLength, ['maker_output', null]);
            const makerUtxoLengthResult = data;
            data = yield this.makeJsonRpcRequest(BcRpcMethod.GetUTXOLength, ['taker_callback', null]);
            const takerUtxoLengthResult = data;
            const sum = makerUtxoLengthResult.length + takerUtxoLengthResult.length;
            let ordersList = [];
            if (sum > 0) {
                const final = sum;
                let from = 0;
                let to = 1000;
                let search = true;
                while (search) {
                    const req = new bc.GetSpendableCollateralRequest();
                    req.setAddress(bcAddress);
                    req.setFrom(from);
                    req.setTo(to);
                    const result = yield this.makeJsonRpcRequest(BcRpcMethod.GetOpenOrders, req.toArray());
                    const newOrders = result;
                    ordersList = ordersList.concat(newOrders.ordersList);
                    if (to === final) {
                        search = false;
                    }
                    from = to + 1;
                    to = to + 1000 > final ? final : to + 1000;
                }
            }
            const openOrdersRes = { ordersList };
            return openOrdersRes;
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
            let url = `${this.rpcUrl}`;
            try {
                url = this.rpcUrl.origin ? `${this.rpcUrl.origin}` : `${this.rpcUrl}`;
            }
            catch (err) { /* tslint:disable:no-empty */
            }
            url = url.endsWith('/') ? `${url}rpc` : `${url}/rpc`;
            let res;
            try {
                res = yield fetch(`${url}`, {
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