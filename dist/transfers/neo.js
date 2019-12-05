"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const neon_js_1 = __importStar(require("@cityofzion/neon-js"));
function payNEO(privateKey, from, to, amount) {
    try {
        const config = {
            api: new neon_js_1.api.neoscan.instance('MainNet'),
            account: privateKey,
            intents: neon_js_1.api.makeIntent({ NEO: amount }, to)
        };
        neon_js_1.default.sendAsset(config).then(config => {
            return config;
        })
            .catch(config => {
            return config;
        });
    }
    catch (err) {
        return err;
    }
}
exports.payNEO = payNEO;
//# sourceMappingURL=neo.js.map