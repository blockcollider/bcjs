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
const WavesAPI = require('@waves/waves-api');
const { transfer, broadcast } = require('@waves/waves-transactions');
const Waves = WavesAPI.create(WavesAPI.MAINNET_CONFIG);
function payWAV(privateKey, from, to, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        privateKey = Waves.Seed.fromExistingPhrase(privateKey);
        let signed = transfer({
            recipient: to,
            amount: amount * Math.pow(10, 8),
            fee: 100000,
        }, privateKey.phrase);
        let nodeUrl = 'https://nodes.wavesplatform.com';
        broadcast(signed, nodeUrl).then((resp) => {
            return resp;
        });
    });
}
exports.payWAV = payWAV;
//# sourceMappingURL=wav.js.map