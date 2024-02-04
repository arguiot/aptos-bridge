"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DstConfigProvider__evm = void 0;
const lz_sdk_1 = require("@layerzerolabs/lz-sdk");
const ui_core_1 = require("@layerzerolabs/ui-core");
const contracts_1 = require("../evm/contracts");
class DstConfigProvider__evm {
    constructor(providerFactory) {
        this.providerFactory = providerFactory;
    }
    async dstPriceLookup(srcChainId, dstChainId) {
        const native = (0, ui_core_1.getNativeCurrency)(dstChainId);
        const relayer = this.getRelayer(srcChainId);
        const { dstPriceRatio, dstGasPriceInWei } = await relayer.dstPriceLookup((0, ui_core_1.toULNv2)(dstChainId));
        const price = {
            dstGasPriceInWei: (0, ui_core_1.toCurrencyAmount)(native, dstGasPriceInWei),
            dstPriceRatio: new ui_core_1.Fraction(dstPriceRatio.toHexString(), 1),
        };
        return price;
    }
    async dstConfigLookup(srcChainId, dstChainId, outboundProofType = (0, ui_core_1.isEvmChainId)(dstChainId) ? 1 : 2) {
        const relayer = this.getRelayer(srcChainId);
        const native = (0, ui_core_1.getNativeCurrency)(dstChainId);
        const { dstNativeAmtCap, baseGas, gasPerByte } = await relayer.dstConfigLookup((0, ui_core_1.toULNv2)(dstChainId), outboundProofType);
        const config = {
            dstNativeAmtCap: (0, ui_core_1.toCurrencyAmount)(native, dstNativeAmtCap),
            baseGas: new ui_core_1.Fraction(baseGas.toHexString(), 1),
            gasPerByte: new ui_core_1.Fraction(gasPerByte.toHexString(), 1),
        };
        return config;
    }
    getRelayer(srcChainId) {
        const relayer = contracts_1.Relayer__factory.connect(getRelayerAddress(srcChainId), this.providerFactory(srcChainId));
        return relayer;
    }
    isApplicable(srcChainId) {
        return (0, ui_core_1.isEvmChainId)(srcChainId);
    }
}
exports.DstConfigProvider__evm = DstConfigProvider__evm;
function getRelayerAddress(chainId) {
    const chainKey = (0, ui_core_1.getChainKey)(chainId);
    const address = lz_sdk_1.LZ_RELAYER_V2[chainKey];
    if (!address)
        throw new Error(`No LZ_RELAYER_V2 for ${chainId}`);
    return address;
}
