"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultAirdropProvider__evm__erc20_approve_transfer = void 0;
const ui_core_1 = require("@layerzerolabs/ui-core");
const ui_ethers_1 = require("@layerzerolabs/ui-ethers");
const assert_1 = __importDefault(require("assert"));
class DefaultAirdropProvider__evm__erc20_approve_transfer {
    constructor(providerFactory) {
        this.providerFactory = providerFactory;
        this.estimateApproveTransferGasAmount = async (dstChainId) => {
            (0, assert_1.default)((0, ui_core_1.isEvmChainId)(dstChainId));
            const erc20_approve = ui_ethers_1.ERC20_APPROVE[dstChainId];
            const erc20_transfer = ui_ethers_1.ERC20_TRANSFER[dstChainId];
            const native = (0, ui_core_1.getNativeCurrency)(dstChainId);
            const zero = ui_core_1.CurrencyAmount.fromRawAmount(native, 0);
            if (!erc20_approve)
                return zero;
            if (!erc20_transfer)
                return zero;
            const sum = erc20_approve + erc20_transfer;
            const provider = this.providerFactory(dstChainId);
            const gasPrice = await provider.getGasPrice();
            const wei = gasPrice.mul(sum);
            // adjust by 30%
            return ui_core_1.CurrencyAmount.fromRawAmount(native, wei.mul(130).div(100).toHexString());
        };
    }
    supports(dstChainId) {
        return (0, ui_core_1.isEvmChainId)(dstChainId);
    }
    estimateDefaultAirdrop(dstChainId) {
        return this.estimateApproveTransferGasAmount(dstChainId);
    }
}
exports.DefaultAirdropProvider__evm__erc20_approve_transfer = DefaultAirdropProvider__evm__erc20_approve_transfer;
