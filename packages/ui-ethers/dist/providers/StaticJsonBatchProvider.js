"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticJsonRpcBatchProvider = void 0;
const providers_1 = require("@ethersproject/providers");
class StaticJsonRpcBatchProvider extends providers_1.JsonRpcBatchProvider {
    async detectNetwork() {
        let network = this.network;
        if (network == null) {
            // After this call completes, network is defined
            network = await super._ready();
        }
        return network;
    }
    send(method, params) {
        const response = super.send(method, params);
        response.catch((error) => {
            var _a;
            (_a = this._onError) === null || _a === void 0 ? void 0 : _a.call(this, error, this);
        });
        return response;
    }
    onError(handler) {
        this._onError = handler;
    }
}
exports.StaticJsonRpcBatchProvider = StaticJsonRpcBatchProvider;
