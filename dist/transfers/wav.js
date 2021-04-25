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
const waves_transactions_1 = require("@waves/waves-transactions");
exports.payWAV = (privateKey, from, to, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const signed = waves_transactions_1.transfer({
        amount: amount * Math.pow(10, 8),
        fee: 100000,
        recipient: to,
    }, privateKey);
    const nodeUrl = 'https://nodes.wavesplatform.com';
    return yield waves_transactions_1.broadcast(signed, nodeUrl);
});
//# sourceMappingURL=wav.js.map