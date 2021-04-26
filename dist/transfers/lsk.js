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
Object.defineProperty(exports, "__esModule", { value: true });
const lisk_client_1 = require("@liskhq/lisk-client");
const client = lisk_client_1.APIClient.createMainnetAPIClient();
exports.payLSK = (privateKey, from, to, amount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = lisk_client_1.transactions.transfer({
            amount: (amount * Math.pow(10, 8)).toString(),
            passphrase: privateKey,
            recipientId: to,
        });
        yield client.transactions.broadcast(transaction);
    }
    catch (err) {
        return err;
    }
});
//# sourceMappingURL=lsk.js.map