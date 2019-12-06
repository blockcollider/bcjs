"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lisk = require('lisk-elements');
var cryptography = require('@liskhq/lisk-cryptography');
const client = lisk.APIClient.createMainnetAPIClient();
function payLSK(privateKey, from, to, amount) {
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
}
exports.payLSK = payLSK;
//# sourceMappingURL=lsk.js.map