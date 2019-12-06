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
const lisk = require('lisk-elements');
var cryptography = require('@liskhq/lisk-cryptography');
const client = lisk.APIClient.createMainnetAPIClient();
function payLSK(privateKey, from, to, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const transaction = lisk.transaction.transfer({
                amount: (amount * Math.pow(10, 8)).toString(),
                recipientId: to,
                passphrase: privateKey,
            });
            client.transactions.broadcast(transaction).then((info) => {
                return transaction;
            }).catch((err) => {
                return err;
            });
        }
        catch (err) {
            return err;
        }
        ;
    });
}
exports.payLSK = payLSK;
//# sourceMappingURL=lsk.js.map