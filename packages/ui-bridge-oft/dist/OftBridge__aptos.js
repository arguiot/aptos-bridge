"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OftBridge__aptos = void 0;
const ui_core_1 = require("@layerzerolabs/ui-core");
const oft_1 = require("@layerzerolabs/lz-aptos/dist/modules/apps/oft");
const assert_1 = __importDefault(require("assert"));
class OftBridge__aptos {
    constructor(aptosSdk, oftModule, aptosClient, config, aptosManagedCoinRegisterService) {
        this.aptosSdk = aptosSdk;
        this.oftModule = oftModule;
        this.aptosClient = aptosClient;
        this.config = config;
        this.aptosManagedCoinRegisterService = aptosManagedCoinRegisterService;
    }
    async isApproved(amount, address) {
        return true;
    }
    approve(amount) {
        throw new Error('Method not supported.');
    }
    supports(srcCurrency, dstCurrency) {
        if (!(0, ui_core_1.isAptosChainId)(srcCurrency.chainId))
            return false;
        if (!this.config.tokens.some((token) => token.equals(srcCurrency)))
            return false;
        if (dstCurrency) {
            if (!this.config.tokens.some((token) => token.equals(dstCurrency)))
                return false;
        }
        return true;
    }
    isRegistered(currency, address) {
        return this.aptosManagedCoinRegisterService.isRegistered(currency, address);
    }
    async claim(currency) {
        (0, assert_1.default)((0, ui_core_1.isToken)(currency));
        const payload = this.oftModule.payloadOfClaimCoin(currency.address);
        const { aptosClient } = this;
        const tx = {
            async signAndSubmitTransaction(signer) {
                const response = await signer.signAndSubmitTransaction(payload);
                return {
                    txHash: response.hash,
                    async wait() {
                        const result = await aptosClient.waitForTransactionWithResult(response.hash, {
                            checkSuccess: true,
                        });
                        return {
                            txHash: result.hash,
                        };
                    },
                };
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
    async getUnclaimed(currency, address) {
        (0, assert_1.default)((0, ui_core_1.isToken)(currency));
        const balance = await this.oftModule.getClaimableCoin(currency.address, address);
        return (0, ui_core_1.toCurrencyAmount)(currency, balance);
    }
    register(currency) {
        return this.aptosManagedCoinRegisterService.registerCoin(currency);
    }
    async transfer(input) {
        const { aptosClient } = this;
        const token = input.amount.currency;
        (0, assert_1.default)((0, ui_core_1.isToken)(token));
        const oftType = this.getOftType(token);
        const dstAddress = (0, ui_core_1.convertToPaddedUint8Array)(input.dstAddress, 32);
        const msglibParams = new Uint8Array(0);
        // min amount expressed in DST currency
        const minAmountSrc = (0, ui_core_1.castCurrencyAmountUnsafe)(input.minAmount, input.srcCurrency);
        const payload = this.oftModule.sendCoinPayload(oftType, input.dstChainId, dstAddress, (0, ui_core_1.toBigInt)(input.amount), (0, ui_core_1.toBigInt)(minAmountSrc), (0, ui_core_1.toBigInt)(input.fee.nativeFee), (0, ui_core_1.toBigInt)(input.fee.zroFee), this.buildAdapterParamsStruct(input.adapterParams), msglibParams);
        const tx = {
            async signAndSubmitTransaction(signer) {
                const response = await signer.signAndSubmitTransaction(payload);
                return {
                    txHash: response.hash,
                    async wait() {
                        const receipt = await aptosClient.waitForTransactionWithResult(response.hash, {
                            checkSuccess: true,
                        });
                        return {
                            txHash: receipt.hash,
                        };
                    },
                };
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
        (0, assert_1.default)(srcChainId, 'srcChainId');
        (0, assert_1.default)(dstChainId, 'dstChainId');
        (0, assert_1.default)(srcCurrency, 'srcCurrency');
        const native = (0, ui_core_1.getNativeCurrency)(srcChainId);
        const oftDeployedAddress = getOftDeployedAddress(srcCurrency); //  this.oftModule.getTypeAddress(srcToken.address)
        const amount = await this.aptosSdk.LayerzeroModule.Endpoint.quoteFee(oftDeployedAddress, dstChainId, this.buildAdapterParamsStruct(adapterParams), this.oftModule.SEND_PAYLOAD_LENGTH);
        const fee = {
            zroFee: ui_core_1.CurrencyAmount.fromRawAmount(native, 0),
            nativeFee: ui_core_1.CurrencyAmount.fromRawAmount(native, amount),
        };
        return fee;
    }
    async getExtraGas(srcChainId, dstChainId) {
        const srcCurrency = this.config.tokens.find((token) => token.chainId === srcChainId);
        (0, assert_1.default)(srcCurrency, 'srcCurrency');
        const oftType = this.getOftType(srcCurrency);
        const extraGas = await this.oftModule.getMinDstGas(oftType, dstChainId, BigInt(oft_1.PacketType.SEND));
        return Number(extraGas);
    }
    async getOutput(inputAmount, dstCurrency) {
        const feeLD = await this.getBridgeFee(inputAmount, dstCurrency.chainId);
        const outputAmountLD = inputAmount.subtract(feeLD);
        const outputAmountRD = (0, ui_core_1.castCurrencyAmountUnsafe)(
        // at this point cast should be safe
        outputAmountLD, dstCurrency);
        return {
            fee: feeLD,
            amount: outputAmountRD,
        };
    }
    async getLimit(srcCurrency, dstCurrency) {
        return ui_core_1.CurrencyAmount.fromRawAmount(srcCurrency, ui_core_1.MaxUint256);
    }
    async getBridgeFee(inputAmount, dstChainId) {
        const oftType = this.getOftType(inputAmount.currency);
        const feeBP = await this.oftModule.getFee(oftType, dstChainId);
        return inputAmount.multiply(feeBP).divide(10000);
    }
    getOftType(token) {
        (0, assert_1.default)((0, ui_core_1.isToken)(token), 'token');
        return token.address;
    }
    buildAdapterParamsStruct(adapterParams) {
        var _a;
        if ((_a = adapterParams.dstNativeAmount) === null || _a === void 0 ? void 0 : _a.greaterThan(0)) {
            (0, assert_1.default)(adapterParams.dstNativeAddress, 'dstNativeAddress');
            // const dstNativeAddress = HexString.ensure(adapterParams.dstNativeAddress).toUint8Array();
            return this.aptosSdk.LayerzeroModule.Executor.buildAirdropAdapterParams(adapterParams.extraGas, (0, ui_core_1.toBigInt)(adapterParams.dstNativeAmount), adapterParams.dstNativeAddress);
        }
        else {
            return this.aptosSdk.LayerzeroModule.Executor.buildDefaultAdapterParams(adapterParams.extraGas);
        }
    }
}
exports.OftBridge__aptos = OftBridge__aptos;
function getOftDeployedAddress(token) {
    (0, assert_1.default)((0, ui_core_1.isToken)(token));
    (0, assert_1.default)((0, ui_core_1.isAptosChainId)(token.chainId));
    // todo: test address in form "address::module::type"
    const [address] = token.address.split('::');
    return address;
}
