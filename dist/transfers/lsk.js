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
const lisk_elements_1 = __importDefault(require("lisk-elements"));
const client = lisk_elements_1.default.APIClient.createMainnetAPIClient();
exports.payLSK = (privateKey, from, to, amount) => __awaiter(this, void 0, void 0, function* () {
    try {
        const transaction = lisk_elements_1.default.transaction.transfer({
            amount: (amount * Math.pow(10, 8)).toString(),
            passphrase: privateKey,
            recipientId: to,
        });
        return yield client.transactions.broadcast(transaction);
    }
    catch (err) {
        return err;
    }
});
//# sourceMappingURL=lsk.js.map