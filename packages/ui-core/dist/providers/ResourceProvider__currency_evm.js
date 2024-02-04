"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceProvider__currency_evm = void 0;
const currency_1 = require("../currency");
const network_1 = require("../network");
class ResourceProvider__currency_evm {
    supports(resource) {
        if (!(0, currency_1.isCurrency)(resource))
            return false;
        return (0, network_1.isEvmChainId)(resource.chainId);
    }
    register(resource) {
        throw new Error('Method not supported.');
    }
    async isRegistered(resource, address) {
        return true;
    }
    getType(resource) {
        return `${resource.chainId}:${resource.symbol}:${(0, currency_1.isToken)(resource) ? resource.address : '0x'}`;
    }
}
exports.ResourceProvider__currency_evm = ResourceProvider__currency_evm;
