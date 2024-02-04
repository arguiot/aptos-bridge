"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DstConfigProvider__aptos = void 0;
const ui_core_1 = require("@layerzerolabs/ui-core");
class DstConfigProvider__aptos {
    constructor(aptosSdk, LZ_EXECUTOR_ACCOUNT) {
        this.aptosSdk = aptosSdk;
        this.LZ_EXECUTOR_ACCOUNT = LZ_EXECUTOR_ACCOUNT;
    }
    async dstPriceLookup(srcChainId, dstChainId) {
        const native = (0, ui_core_1.getNativeCurrency)(dstChainId);
        const res = await this.aptosSdk.LayerzeroModule.Executor.getFee(this.LZ_EXECUTOR_ACCOUNT, dstChainId);
        return {
            dstGasPriceInWei: ui_core_1.CurrencyAmount.fromRawAmount(native, res.gasPrice),
            dstPriceRatio: new ui_core_1.Fraction(res.priceRatio),
        };
    }
    async dstConfigLookup(srcChainId, dstChainId) {
        const native = (0, ui_core_1.getNativeCurrency)(dstChainId);
        const res = await this.aptosSdk.LayerzeroModule.Executor.getFee(this.LZ_EXECUTOR_ACCOUNT, dstChainId);
        return {
            dstNativeAmtCap: ui_core_1.CurrencyAmount.fromRawAmount(native, res.airdropAmtCap),
            baseGas: new ui_core_1.Fraction(1, 1),
            gasPerByte: new ui_core_1.Fraction(1, 1),
        };
    }
    isApplicable(srcChainId) {
        return (0, ui_core_1.isAptosChainId)(srcChainId);
    }
}
exports.DstConfigProvider__aptos = DstConfigProvider__aptos;
