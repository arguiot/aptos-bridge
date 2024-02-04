"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceProvider__currency_aptos = void 0;
const ui_core_1 = require("@layerzerolabs/ui-core");
class ResourceProvider__currency_aptos {
    constructor(service) {
        this.service = service;
    }
    supports(resource) {
        if (!(0, ui_core_1.isCurrency)(resource))
            return false;
        return (0, ui_core_1.isAptosChainId)(resource.chainId);
    }
    register(resource) {
        return this.service.registerCoin(resource);
    }
    async isRegistered(resource, address) {
        return this.service.isRegistered(resource, address);
    }
    getType(resource) {
        return `${resource.chainId}:${(0, ui_core_1.isToken)(resource) ? resource.address : '0x'}`;
    }
}
exports.ResourceProvider__currency_aptos = ResourceProvider__currency_aptos;
