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
exports.transferUSDT = (privateKey, from, to, amount, gasLimit = 72000) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        try {
            const data = web3_1.USDT.methods
                .transfer(to, web3_1.web3.utils.toHex(Math.floor(Math.pow(10, 6) * parseFloat(amount))))
                .encodeABI();
            web3_1.submitTransaction({ to: web3_1.USDT.options.address, from, value: web3_1.web3.utils.toHex(0), data, privateKey, gasLimit }, (err, hash) => {
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
//# sourceMappingURL=usdt.js.map