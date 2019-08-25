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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("./client"));
const bc = __importStar(require("./protos/bc_pb"));
class Wallet {
    constructor(address, authToken) {
        this.address = address.toLowerCase();
        // TODO: PING, need a proper way to pass in the url
        this.rpcClient = new client_1.default('todo', authToken);
    }
    getBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            const req = new bc.GetBalanceRequest();
            req.setAddress(this.address);
            return yield this.rpcClient.getBalance(req);
        });
    }
    getSpendableOutpoints() {
        return __awaiter(this, void 0, void 0, function* () {
            const req = new bc.GetBalanceRequest();
            req.setAddress(this.address);
            let a = yield this.rpcClient.getWallet(req);
            return a.spendableOutpointsList;
        });
    }
}
exports.default = Wallet;
//# sourceMappingURL=wallet.js.map