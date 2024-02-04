"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceProvider__evm = void 0;
const ui_core_1 = require("@layerzerolabs/ui-core");
const assert_1 = __importDefault(require("assert"));
const contracts_1 = require("./contracts");
class BalanceProvider__evm {
    constructor(providerFactory) {
        this.providerFactory = providerFactory;
    }
    supports(token) {
        if (!(0, ui_core_1.isEvmChainId)(token.chainId))
            return false;
        return true;
    }
    getBalance(token, address) {
        if ((0, ui_core_1.isCoin)(token))
            return this.getNativeBalance(token, address);
        if ((0, ui_core_1.isToken)(token))
            return this.getErc20Balance(token, address);
        throw new Error('Invalid token');
    }
    async getNativeBalance(token, address) {
        (0, assert_1.default)((0, ui_core_1.isEvmAddress)(address), 'Non EVM address');
        (0, assert_1.default)((0, ui_core_1.isCoin)(token));
        const balance = await this.providerFactory(token.chainId).getBalance(address);
        return (0, ui_core_1.toCurrencyAmount)(token, balance);
    }
    async getErc20Balance(token, address) {
        (0, assert_1.default)((0, ui_core_1.isEvmAddress)(address), 'Non EVM address');
        (0, assert_1.default)((0, ui_core_1.isToken)(token));
        const erc20 = contracts_1.ERC20__factory.connect(token.address, this.providerFactory(token.chainId));
        const balance = await erc20.balanceOf(address);
        return (0, ui_core_1.toCurrencyAmount)(token, balance);
    }
}
exports.BalanceProvider__evm = BalanceProvider__evm;
