"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderRpcErrorCode = exports.addEthereumChain = exports.switchEthereumChain = exports.selectAccounts = exports.requestAccounts = void 0;
const ui_core_1 = require("@layerzerolabs/ui-core");
const rpcNodes_1 = require("./rpcNodes");
function requestAccounts(provider) {
    const args = { method: 'eth_requestAccounts' };
    return provider.send(args.method, []);
}
exports.requestAccounts = requestAccounts;
function selectAccounts(provider) {
    const args = { method: 'eth_selectAccounts' };
    return provider.send(args.method, []);
}
exports.selectAccounts = selectAccounts;
function switchEthereumChain(chainId, provider) {
    const args = {
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: toHexEvmChainId(chainId) }],
    };
    return provider.send(args.method, args.params);
}
exports.switchEthereumChain = switchEthereumChain;
function addEthereumChain(chainId, provider) {
    const network = (0, ui_core_1.getNetwork)(chainId);
    const rpcUrls = (0, rpcNodes_1.getOfficialRpcUrls)(network.chainId);
    const addChainParams = {
        chainId: toHexEvmChainId(chainId),
        chainName: network.name,
        nativeCurrency: {
            name: network.nativeCurrency.name,
            symbol: network.nativeCurrency.symbol,
            decimals: network.nativeCurrency.decimals,
        },
        rpcUrls,
    };
    const args = {
        method: 'wallet_addEthereumChain',
        params: [addChainParams],
    };
    return provider.send(args.method, args.params);
}
exports.addEthereumChain = addEthereumChain;
function toHexEvmChainId(chainId) {
    return '0x' + (0, ui_core_1.toEvmChainId)(chainId).toString(16);
}
var ProviderRpcErrorCode;
(function (ProviderRpcErrorCode) {
    ProviderRpcErrorCode[ProviderRpcErrorCode["ACCOUNT_ACCESS_REJECTED"] = 4001] = "ACCOUNT_ACCESS_REJECTED";
    ProviderRpcErrorCode[ProviderRpcErrorCode["ACCOUNT_ACCESS_ALREADY_REQUESTED"] = -32002] = "ACCOUNT_ACCESS_ALREADY_REQUESTED";
    ProviderRpcErrorCode[ProviderRpcErrorCode["UNAUTHORIZED"] = 4100] = "UNAUTHORIZED";
    ProviderRpcErrorCode[ProviderRpcErrorCode["INVALID_PARAMS"] = -32602] = "INVALID_PARAMS";
    ProviderRpcErrorCode[ProviderRpcErrorCode["UNSUPPORTED_METHOD"] = 4200] = "UNSUPPORTED_METHOD";
    ProviderRpcErrorCode[ProviderRpcErrorCode["DISCONNECTED"] = 4900] = "DISCONNECTED";
    ProviderRpcErrorCode[ProviderRpcErrorCode["CHAIN_DISCONNECTED"] = 4901] = "CHAIN_DISCONNECTED";
    ProviderRpcErrorCode[ProviderRpcErrorCode["CHAIN_NOT_ADDED"] = 4902] = "CHAIN_NOT_ADDED";
    ProviderRpcErrorCode[ProviderRpcErrorCode["DOES_NOT_EXIST"] = -32601] = "DOES_NOT_EXIST";
})(ProviderRpcErrorCode = exports.ProviderRpcErrorCode || (exports.ProviderRpcErrorCode = {}));
