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
const waves_api_1 = __importDefault(require("@waves/waves-api"));
const waves_transactions_1 = require("@waves/waves-transactions");
const Waves = waves_api_1.default.create(waves_api_1.default.MAINNET_CONFIG);
exports.payWAV = (privateKey, from, to, amount) => __awaiter(this, void 0, void 0, function* () {
    privateKey = Waves.Seed.fromExistingPhrase(privateKey);
    const signed = waves_transactions_1.transfer({
        amount: amount * Math.pow(10, 8),
        fee: 100000,
        recipient: to,
    }, privateKey.phrase);
    const nodeUrl = 'https://nodes.wavesplatform.com';
    return yield waves_transactions_1.broadcast(signed, nodeUrl);
});
//# sourceMappingURL=wav.js.map