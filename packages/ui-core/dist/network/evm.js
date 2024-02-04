"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromEvmChainId = exports.isSupportedEvmChainId = exports.toEvmChainId = void 0;
const lz_sdk_1 = require("@layerzerolabs/lz-sdk");
const chainType_1 = require("./chainType");
const networks_1 = require("./networks");
function toEvmChainId(chainId) {
    const key = lz_sdk_1.ChainId[chainId];
    const evmChainId = lz_sdk_1.ChainListId[key];
    if (!evmChainId)
        throw Error(`No ChainListId for ${key}, ${chainId}`);
    return evmChainId;
}
exports.toEvmChainId = toEvmChainId;
function isSupportedEvmChainId(evmChainId) {
    return evmChainId in lz_sdk_1.ChainListId;
}
exports.isSupportedEvmChainId = isSupportedEvmChainId;
// if not sandbox then testnet
function fromEvmChainId(evmChainId, sandbox = false) {
    evmChainId = Number(evmChainId);
    const matches = [];
    //@ts-ignore
    for (const key in lz_sdk_1.ChainListId) {
        //@ts-ignore
        const nativeChainId = lz_sdk_1.ChainListId[key];
        if (nativeChainId !== evmChainId)
            continue;
        //@ts-ignore
        const chainId = lz_sdk_1.ChainId[key];
        if (!isFinite(chainId))
            continue;
        if (!(0, chainType_1.isEvmChainId)(chainId))
            continue;
        matches.push(chainId);
    }
    if (sandbox) {
        const chainId = matches.find((i) => (0, networks_1.isChainOnStage)(i, lz_sdk_1.ChainStage.TESTNET_SANDBOX));
        if (chainId)
            return chainId;
    }
    const chainId = matches[0];
    if (chainId)
        return chainId;
    throw new Error(`No ChainId for ${evmChainId}`);
}
exports.fromEvmChainId = fromEvmChainId;
