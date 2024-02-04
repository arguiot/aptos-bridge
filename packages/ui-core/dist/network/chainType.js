"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAptosChainId = exports.isEvmChainId = exports.getChainType = exports.isChainType = exports.ChainType = void 0;
const lz_sdk_1 = require("@layerzerolabs/lz-sdk");
var ChainType;
(function (ChainType) {
    ChainType["EVM"] = "EVM";
    ChainType["APTOS"] = "APTOS";
    ChainType["SOLANA"] = "SOLANA";
})(ChainType = exports.ChainType || (exports.ChainType = {}));
// don't list EVM - its easier to maintain non-evm list
const APTOS = [lz_sdk_1.ChainId.APTOS, lz_sdk_1.ChainId.APTOS_TESTNET, lz_sdk_1.ChainId.APTOS_TESTNET_SANDBOX];
const SOLANA = [];
function isChainType(chainId, chainType) {
    if (chainType === ChainType.APTOS)
        return APTOS.includes(chainId);
    if (chainType === ChainType.SOLANA)
        return SOLANA.includes(chainId);
    // only EVM
    if (SOLANA.includes(chainId))
        return false;
    if (APTOS.includes(chainId))
        return false;
    return true;
}
exports.isChainType = isChainType;
function getChainType(chainId) {
    if (isChainType(chainId, ChainType.APTOS))
        return ChainType.APTOS;
    if (isChainType(chainId, ChainType.SOLANA))
        return ChainType.SOLANA;
    return ChainType.EVM;
}
exports.getChainType = getChainType;
function isEvmChainId(chainId) {
    return isChainType(chainId, ChainType.EVM);
}
exports.isEvmChainId = isEvmChainId;
function isAptosChainId(chainId) {
    return isChainType(chainId, ChainType.APTOS);
}
exports.isAptosChainId = isAptosChainId;
