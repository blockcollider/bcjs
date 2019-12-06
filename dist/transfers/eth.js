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
exports.transferETH = function (privateKey, from, to, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let value = web3_1.web3.utils.toHex(web3_1.web3.utils.toWei(amount.toString(), 'ether'));
            web3_1.submitTransaction({ from, to, value, data: '0x0', privateKey }, (err, hash) => {
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
//# sourceMappingURL=eth.js.map