"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AptosBridge__evm = void 0;
const ui_core_1 = require("@layerzerolabs/ui-core");
const ui_core_2 = require("@layerzerolabs/ui-core");
const ui_erc20_sdk_1 = require("@layerzerolabs/ui-erc20-sdk");
const ui_ethers_1 = require("@layerzerolabs/ui-ethers");
const assert_1 = __importDefault(require("assert"));
const contracts_1 = require("./eth/contracts");
const getBridgeAddress_1 = require("./eth/getBridgeAddress");
const removeDust_1 = require("./removeDust");
class AptosBridge__evm {
    constructor(providerFactory, config) {
        this.providerFactory = providerFactory;
        this.config = config;
        this.erc20 = new ui_erc20_sdk_1.ERC20__api(providerFactory);
    }
    async isApproved(amount, address) {
        const currency = amount.currency;
        if ((0, ui_core_1.isNativeCurrency)(currency))
            return true;
        (0, assert_1.default)((0, ui_core_1.isToken)(currency));
        const spender = this.getBridgeAddress(currency.chainId);
        return this.erc20.forToken(currency).isApproved(amount, address, spender);
    }
    approve(amount) {
        const currency = amount.currency;
        (0, assert_1.default)((0, ui_core_1.isToken)(currency));
        const spender = this.getBridgeAddress(currency.chainId);
        return this.erc20.forToken(currency).approve(amount, spender);
    }
    supports(srcCurrency, dstCurrency) {
        if (!(0, ui_core_1.isEvmChainId)(srcCurrency.chainId))
            return false;
        if (!this.config.tokens.some((token) => token.equals(srcCurrency)))
            return false;
        if (dstCurrency) {
            if (!(0, ui_core_1.isAptosChainId)(dstCurrency.chainId))
                return false;
            if (!this.config.tokens.some((token) => token.equals(dstCurrency)))
                return false;
        }
        return true;
    }
    async isRegistered(currency, address) {
        return true;
    }
    async getUnclaimed(currency, address) {
        return ui_core_1.CurrencyAmount.fromRawAmount(currency, 0);
    }
    claim(currency) {
        throw new Error('Method not supported.');
    }
    register(currency) {
        throw new Error('Method not supported.');
    }
    transfer(input) {
        if ((0, ui_core_1.isToken)(input.srcCurrency))
            return this.transferToken(input);
        return this.transferEth(input);
    }
    async getMessageFee(srcChainId, dstChainId, adapterParams) {
        const callParams = { refundAddress: ui_ethers_1.ONE_ADDRESS, zroPaymentAddress: ui_ethers_1.ZERO_ADDRESS };
        const contract = this.getBridgeContract(srcChainId);
        const native = (0, ui_core_1.getNativeCurrency)(srcChainId);
        const { nativeFee, zroFee } = await contract.quoteForSend(callParams, adapterParams.serialize());
        return {
            nativeFee: ui_core_1.CurrencyAmount.fromRawAmount(native, nativeFee.toHexString()),
            zroFee: ui_core_1.CurrencyAmount.fromRawAmount(native, zroFee.toHexString()),
        };
    }
    async getOutput(inputAmountLD, dstCurrency) {
        const outputAmountRD = (0, ui_core_1.castCurrencyAmountUnsafe)(
        // cast should be safe
        (0, removeDust_1.removeDust)(inputAmountLD), dstCurrency);
        return {
            amount: outputAmountRD,
            fee: inputAmountLD.multiply(0),
        };
    }
    async getLimit(srcCurrency, dstCurrency) {
        return ui_core_1.CurrencyAmount.fromRawAmount(srcCurrency, ui_core_2.MaxUint256);
    }
    getBridgeContract(srcChainId) {
        const provider = this.providerFactory(srcChainId);
        const address = this.getBridgeAddress(srcChainId);
        const contract = contracts_1.ITokenBridge__factory.connect(address, provider);
        return contract;
    }
    getBridgeAddress(srcChainId) {
        return (0, getBridgeAddress_1.getBridgeAddress)(srcChainId);
    }
    async getExtraGas(srcChainId, dstChainId) {
        return 10000;
    }
    async transferToken(input) {
        (0, assert_1.default)((0, ui_core_1.isToken)(input.srcCurrency), 'TOKEN');
        // typescript doesn't understand isToken assertion in nested scope
        const srcCurrency = input.srcCurrency;
        const amountLD = (0, ui_core_1.toBigNumber)(input.amount);
        const callParams = {
            refundAddress: input.srcAddress,
            zroPaymentAddress: ui_ethers_1.ZERO_ADDRESS,
        };
        const adapterParams = input.adapterParams.serialize();
        const value = (0, ui_core_1.toBigNumber)(input.fee.nativeFee);
        const contract = this.getBridgeContract(input.srcChainId);
        const tx = {
            async signAndSubmitTransaction(signer) {
                const txResult = await contract
                    .connect(signer)
                    .sendToAptos(srcCurrency.address, input.dstAddress, amountLD, callParams, adapterParams, {
                    value,
                });
                const result = {
                    txHash: txResult.hash,
                    wait: async () => {
                        const txReceipt = await txResult.wait();
                        return { txHash: txReceipt.transactionHash };
                    },
                };
                return result;
            },
            estimateGas(signer) {
                throw new Error('Method not implemented.');
            },
            estimateNative: function (signer) {
                throw new Error('Function not implemented.');
            },
        };
        return tx;
    }
    async transferEth(input) {
        (0, assert_1.default)((0, ui_core_1.isCoin)(input.srcCurrency));
        const amountLD = (0, ui_core_1.toBigNumber)(input.amount);
        const callParams = {
            refundAddress: input.srcAddress,
            zroPaymentAddress: ui_ethers_1.ZERO_ADDRESS,
        };
        const adapterParams = input.adapterParams.serialize();
        const value = (0, ui_core_1.toBigNumber)(input.fee.nativeFee.add(input.amount));
        const contract = this.getBridgeContract(input.srcChainId);
        const tx = {
            async signAndSubmitTransaction(signer) {
                const txResult = await contract
                    .connect(signer)
                    .sendETHToAptos(input.dstAddress, amountLD, callParams, adapterParams, { value });
                const result = {
                    txHash: txResult.hash,
                    wait: async () => {
                        const txReceipt = await txResult.wait();
                        return { txHash: txReceipt.transactionHash };
                    },
                };
                return result;
            },
            estimateGas(signer) {
                throw new Error('Method not implemented.');
            },
            estimateNative: function (signer) {
                throw new Error('Function not implemented.');
            },
        };
        return tx;
    }
}
exports.AptosBridge__evm = AptosBridge__evm;
