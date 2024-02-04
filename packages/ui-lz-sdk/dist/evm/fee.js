"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LzApi__evm = exports.buildLayerZeroTxParams = exports.LayerZeroTxType = void 0;
const ui_core_1 = require("@layerzerolabs/ui-core");
const ethers_1 = require("ethers");
const factories_1 = require("./contracts/factories");
const endpoint_1 = require("./endpoint");
var LayerZeroTxType;
(function (LayerZeroTxType) {
    LayerZeroTxType[LayerZeroTxType["AIRDROP"] = 2] = "AIRDROP";
})(LayerZeroTxType = exports.LayerZeroTxType || (exports.LayerZeroTxType = {}));
function buildLayerZeroTxParams(txType, extraGas, dstNativeAmt, dstNativeAddress) {
    dstNativeAmt = ethers_1.BigNumber.from(dstNativeAmt);
    if (dstNativeAmt.isZero()) {
        return ethers_1.utils.solidityPack(['uint16', 'uint256'], [1, extraGas]);
    }
    else {
        return ethers_1.utils.solidityPack(['uint16', 'uint', 'uint', 'address'], [2, extraGas, dstNativeAmt, dstNativeAddress]);
    }
}
exports.buildLayerZeroTxParams = buildLayerZeroTxParams;
class LzApi__evm {
    constructor(providerFactory) {
        this.providerFactory = providerFactory;
    }
    async estimateFees(srcChainId, dstChainId, userApplication, payload, payInZRO, adapterParam) {
        const native = (0, ui_core_1.getNativeCurrency)(srcChainId);
        const provider = this.providerFactory(srcChainId);
        const contract = factories_1.Endpoint__factory.connect((0, endpoint_1.getEndpointAddress)(srcChainId), provider);
        const { nativeFee, zroFee } = await contract.estimateFees(dstChainId, userApplication, payload, payInZRO, adapterParam);
        const fee = {
            nativeFee: (0, ui_core_1.toCurrencyAmount)(native, nativeFee),
            zroFee: (0, ui_core_1.toCurrencyAmount)(native, zroFee),
        };
        return fee;
    }
}
exports.LzApi__evm = LzApi__evm;
