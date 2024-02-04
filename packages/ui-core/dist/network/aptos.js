"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromAptosChainId = exports.AptosChainId = void 0;
const lz_sdk_1 = require("@layerzerolabs/lz-sdk");
var AptosChainId;
(function (AptosChainId) {
    AptosChainId[AptosChainId["TESTNET"] = 2] = "TESTNET";
    AptosChainId[AptosChainId["MAINNET"] = 1] = "MAINNET";
})(AptosChainId = exports.AptosChainId || (exports.AptosChainId = {}));
function fromAptosChainId(aptosChainId) {
    aptosChainId = Number(aptosChainId);
    if (aptosChainId === AptosChainId.MAINNET)
        return lz_sdk_1.ChainId.APTOS;
    if (aptosChainId === AptosChainId.TESTNET) {
        return lz_sdk_1.ChainId.APTOS_TESTNET;
    }
    return undefined;
}
exports.fromAptosChainId = fromAptosChainId;
