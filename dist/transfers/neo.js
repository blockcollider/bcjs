"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const neon_js_1 = __importStar(require("@cityofzion/neon-js"));
exports.payNEO = (privateKey, from, to, amount) => __awaiter(this, void 0, void 0, function* () {
    try {
        const account = new neon_js_1.wallet.Account(privateKey);
        const config = {
            account,
            api: new neon_js_1.api.neoscan.instance('MainNet'),
            intents: neon_js_1.api.makeIntent({ NEO: amount }, to),
        };
        return yield neon_js_1.default.sendAsset(config);
    }
    catch (err) {
        return err;
    }
});
//# sourceMappingURL=neo.js.map