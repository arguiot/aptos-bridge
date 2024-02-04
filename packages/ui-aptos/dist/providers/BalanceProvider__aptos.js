"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceProvider__aptos = void 0;
const ui_core_1 = require("@layerzerolabs/ui-core");
const assert_1 = __importDefault(require("assert"));
const isAptosAddress_1 = require("../utils/isAptosAddress");
const errors_1 = require("../utils/errors");
class BalanceProvider__aptos {
    constructor(resourceProvider) {
        this.resourceProvider = resourceProvider;
    }
    supports(token) {
        return (0, ui_core_1.isAptosChainId)(token.chainId);
    }
    async getBalance(currency, address) {
        (0, assert_1.default)((0, isAptosAddress_1.isAptosAddress)(address));
        (0, assert_1.default)((0, ui_core_1.isAptosChainId)(currency.chainId));
        (0, assert_1.default)((0, ui_core_1.isToken)(currency));
        const resourceType = `0x1::coin::CoinStore<${currency.address}>`;
        try {
            const resources = await this.resourceProvider.getAccountResources(address);
            const resource = resources.find((r) => r.type === resourceType);
            if (resource === undefined) {
                return ui_core_1.CurrencyAmount.fromRawAmount(currency, 0);
            }
            const balance = resource.data['coin']['value'];
            (0, assert_1.default)(isFinite(balance), 'Balance is not a number');
            return ui_core_1.CurrencyAmount.fromRawAmount(currency, balance);
        }
        catch (e) {
            if ((0, errors_1.isErrorOfAccountNotFound)(e)) {
                return ui_core_1.CurrencyAmount.fromRawAmount(currency, 0);
            }
            throw e;
        }
    }
}
exports.BalanceProvider__aptos = BalanceProvider__aptos;
