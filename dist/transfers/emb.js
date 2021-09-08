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
const web3_1 = require("./web3");
function padToBytes7(n) {
    while (n.length < 14) {
        n = '0' + n;
    }
    return n;
}
exports.transferEMB = (privateKey, from, to, amount, gasLimit = 60000) => __awaiter(void 0, void 0, void 0, function* () {
    gasLimit = 60000;
    return new Promise((resolve, reject) => {
        try {
            const arg = `${to}${padToBytes7(Math.round(amount * Math.pow(10, 8)).toString(16))}`;
            const data = web3_1.EMB.methods.multiTransfer([arg]).encodeABI();
            web3_1.submitTransaction({
                data,
                from,
                gas: 62000,
                gasLimit,
                privateKey,
                to: web3_1.EMB.options.address,
                value: web3_1.web3.utils.toHex(0),
            }, (err, hash) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(hash);
                }
            });
        }
        catch (err) {
            reject(err);
        }
    });
});
//# sourceMappingURL=emb.js.map