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
const web3_1 = require("./web3");
exports.transferUSDT = function (privateKey, from, to, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let data = web3_1.USDT.methods.transfer(to, web3_1.web3.utils.toHex(Math.floor(Math.pow(10, 6) * (parseFloat(amount))))).encodeABI();
            web3_1.submitTransaction({ to: web3_1.USDT._address, from, value: web3_1.web3.utils.toHex(0), data, privateKey }, (err, hash) => {
                if (hash)
                    return hash;
                else
                    return err;
            });
        }
        catch (err) {
            return err;
        }
    });
};
//# sourceMappingURL=usdt.js.map