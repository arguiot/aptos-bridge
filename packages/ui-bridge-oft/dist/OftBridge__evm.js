"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OftBridge__evm = void 0;
const lz_sdk_1 = require("@layerzerolabs/lz-sdk");
const ui_core_1 = require("@layerzerolabs/ui-core");
const ui_erc20_sdk_1 = require("@layerzerolabs/ui-erc20-sdk");
const assert_1 = __importDefault(require("assert"));
const dist_1 = require("../../ui-ethers/dist");
const contracts_1 = require("./evm/contracts");
var PacketType;
(function (PacketType) {
    PacketType[PacketType["PT_SEND"] = 0] = "PT_SEND";
    PacketType[PacketType["PT_SEND_AND_CALL"] = 1] = "PT_SEND_AND_CALL";
})(PacketType || (PacketType = {}));
class OftBridge__evm {
    constructor(providerFactory, config) {
        this.providerFactory = providerFactory;
        this.config = config;
        this.erc20 = new ui_erc20_sdk_1.ERC20__api(providerFactory);
    }
    async isApproved(amount, address) {
        const currency = amount.currency;
        const proxy = this.findProxy(currency);
        if (!proxy)
            return true; // OFTs don't need to be approved
        (0, assert_1.default)((0, ui_core_1.isToken)(currency));
        return this.erc20.forToken(currency).isApproved(amount, address, proxy.address);
    }
    async approve(amount) {
        const proxy = this.findProxy(amount.currency);
        (0, assert_1.default)(proxy, 'No proxy');
        return this.erc20.forToken(amount.currency).approve(amount, proxy.address);
    }
    supports(srcCurrency, dstCurrency) {
        if (!(0, ui_core_1.isEvmChainId)(srcCurrency.chainId))
            return false;
        if (!this.config.tokens.some((token) => token.equals(srcCurrency)))
            return false;
        if (dstCurrency) {
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
    async transfer(input) {
        const contract = this.getContract(input.srcCurrency);
        const adapterParams = this.buildLayerZeroTxParams(input.adapterParams);
        const amountLD = input.amount;
        const minAmountLD = (0, ui_core_1.castCurrencyAmountUnsafe)(
        // at this point cast should be safe
        input.minAmount, input.dstCurrency);
        const value = (0, ui_core_1.toBigNumber)(input.fee.nativeFee);
        const dstAddress = (0, ui_core_1.convertToPaddedUint8Array)(input.dstAddress, 32);
        const callParams = {
            adapterParams,
            refundAddress: input.srcAddress,
            zroPaymentAddress: dist_1.ZERO_ADDRESS,
        };
        const tx = {
            async signAndSubmitTransaction(signer) {
                const response = await contract
                    .connect(signer)
                    .sendFrom(input.srcAddress, input.dstChainId, dstAddress, (0, ui_core_1.toBigNumber)(amountLD), (0, ui_core_1.toBigNumber)(minAmountLD), callParams, { value });
                const result = {
                    txHash: response.hash,
                    async wait() {
                        const receipt = await response.wait();
                        return {
                            txHash: receipt.transactionHash,
                        };
                    },
                };
                return result;
            },
            estimateGas: function (signer) {
                throw new Error('Function not implemented.');
            },
            estimateNative: function (signer) {
                throw new Error('Function not implemented.');
            },
        };
        return tx;
    }
    async getMessageFee(srcChainId, dstChainId, adapterParams) {
        const srcCurrency = this.config.tokens.find((token) => token.chainId === srcChainId);
        (0, assert_1.default)(srcCurrency, 'srcCurrency');
        const native = (0, ui_core_1.getNativeCurrency)(srcChainId);
        const lzParams = this.buildLayerZeroTxParams(adapterParams);
        const dstAddress = dist_1.ONE_ADDRESS;
        const useZro = false;
        const amount = 0;
        const contract = this.getContract(srcCurrency);
        const response = await contract.estimateSendFee(dstChainId, (0, ui_core_1.convertToPaddedUint8Array)(dstAddress, 32), amount, useZro, lzParams);
        const fee = {
            nativeFee: (0, ui_core_1.toCurrencyAmount)(native, response.nativeFee),
            zroFee: (0, ui_core_1.toCurrencyAmount)(native, response.zroFee),
        };
        return fee;
    }
    async getExtraGas(srcChainId, dstChainId) {
        const srcCurrency = this.config.tokens.find((token) => token.chainId === srcChainId);
        (0, assert_1.default)(srcCurrency, 'srcCurrency');
        const contract = this.getContract(srcCurrency);
        const packetType = PacketType.PT_SEND;
        const extraGas = await contract.minDstGasLookup(dstChainId, packetType);
        return (extraGas.toNumber() ||
            // hotfix: extra gas should not be 0
            (dstChainId === lz_sdk_1.ChainId.ARBITRUM
                ? 3000000
                : (0, ui_core_1.isAptosChainId)(dstChainId)
                    ? 10000
                    : // other evm
                        250000));
    }
    async getOutput(inputAmount, dstCurrency) {
        const fee = await this.getBridgeFee(inputAmount, dstCurrency.chainId);
        const outputAmountLD = inputAmount.subtract(fee);
        const outputAmountRD = (0, ui_core_1.castCurrencyAmountUnsafe)(outputAmountLD, dstCurrency);
        return {
            fee,
            amount: outputAmountRD,
        };
    }
    async getBridgeFee(inputAmount, dstChainId) {
        const contract = this.getContract(inputAmount.currency);
        const fee = await contract.quoteOFTFee(dstChainId, (0, ui_core_1.toBigNumber)(inputAmount));
        return (0, ui_core_1.toCurrencyAmount)(inputAmount.currency, fee);
    }
    async getLimit(srcCurrency, dstCurrency) {
        return ui_core_1.CurrencyAmount.fromRawAmount(srcCurrency, ui_core_1.MaxUint256);
    }
    getContract(srcCurrency) {
        (0, assert_1.default)((0, ui_core_1.isToken)(srcCurrency), 'token');
        const proxy = this.findProxy(srcCurrency);
        const provider = this.providerFactory(srcCurrency.chainId);
        const contract = proxy
            ? contracts_1.ProxyOFT__factory.connect(proxy.address, provider)
            : contracts_1.OFT__factory.connect(srcCurrency.address, provider);
        return contract;
    }
    findProxy(token) {
        (0, assert_1.default)((0, ui_core_1.isToken)(token), 'token');
        return this.config.proxy.find((proxy) => proxy.chainId === token.chainId);
    }
    buildLayerZeroTxParams(adapterParams) {
        return adapterParams.serialize();
    }
}
exports.OftBridge__evm = OftBridge__evm;
