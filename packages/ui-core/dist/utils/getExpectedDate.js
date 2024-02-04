"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpectedDate = exports.timeStamp = exports.getEstimatedTransactionTime = exports.getRequiredBlockConfirmations = exports.getBlockTime = exports.BLOCK_CONFIRMATIONS = exports.DEFAULT_BLOCK_CONFIRMATIONS = exports.DEFAULT_BLOCK_TIME_SECONDS = void 0;
const lz_sdk_1 = require("@layerzerolabs/lz-sdk");
exports.DEFAULT_BLOCK_TIME_SECONDS = 15.0;
exports.DEFAULT_BLOCK_CONFIRMATIONS = 1;
exports.BLOCK_CONFIRMATIONS = {
    [lz_sdk_1.ChainId.ETHEREUM]: 15,
    [lz_sdk_1.ChainId.AVALANCHE]: 12,
    [lz_sdk_1.ChainId.BSC]: 20,
    [lz_sdk_1.ChainId.POLYGON]: 512,
    [lz_sdk_1.ChainId.ARBITRUM]: 20,
    [lz_sdk_1.ChainId.OPTIMISM]: 20,
    [lz_sdk_1.ChainId.FANTOM]: 5,
    [lz_sdk_1.ChainId.APTOS]: 260,
};
/**
 *
 * @param chainId
 * @returns seconds
 */
function getBlockTime(chainId) {
    var _a;
    return (_a = lz_sdk_1.AVERAGE_BLOCK_TIME[chainId]) !== null && _a !== void 0 ? _a : exports.DEFAULT_BLOCK_TIME_SECONDS;
}
exports.getBlockTime = getBlockTime;
function getRequiredBlockConfirmations(chainId) {
    var _a;
    return (_a = exports.BLOCK_CONFIRMATIONS[chainId]) !== null && _a !== void 0 ? _a : exports.DEFAULT_BLOCK_CONFIRMATIONS;
}
exports.getRequiredBlockConfirmations = getRequiredBlockConfirmations;
/**
 *
 * @param chainId
 * @returns seconds
 */
function getEstimatedTransactionTime(chainId) {
    const confirmations = getRequiredBlockConfirmations(chainId);
    const blockTime = getBlockTime(chainId);
    const extraDelay = 10; // (mempool delay - depends on GAS)
    return (confirmations + 1) * blockTime + extraDelay;
}
exports.getEstimatedTransactionTime = getEstimatedTransactionTime;
function getExpectedConfirmationDateSameChain(chainId, nowTimestamp = timeStamp()) {
    const delay = getEstimatedTransactionTime(chainId);
    return nowTimestamp + delay;
}
function getExpectedConfirmationDateBetweenChains(srcChainId, dstChainId, nowTimestamp = timeStamp()) {
    // todo: use actual values
    if (srcChainId === lz_sdk_1.ChainId.APTOS || srcChainId === lz_sdk_1.ChainId.APTOS_TESTNET) {
        return nowTimestamp + 2 * 24 * 3600;
    }
    const fromDelay = getBlockTime(srcChainId) * (1 + getRequiredBlockConfirmations(srcChainId));
    const toDelay = 2 * getBlockTime(dstChainId);
    const lambdaDelay = 15.0;
    const extraDelay = 10.0;
    return nowTimestamp + fromDelay + toDelay + lambdaDelay + extraDelay;
}
function timeStamp() {
    return Math.floor(Date.now() / 1000);
}
exports.timeStamp = timeStamp;
/**
 *
 * @param srcChainId
 * @param dstChainId
 * @param nowTimestamp
 * @returns seconds
 */
function getExpectedDate(srcChainId, dstChainId, nowTimestamp = timeStamp()) {
    if (!dstChainId)
        return getExpectedConfirmationDateSameChain(srcChainId, nowTimestamp);
    return getExpectedConfirmationDateBetweenChains(srcChainId, dstChainId, nowTimestamp);
}
exports.getExpectedDate = getExpectedDate;
