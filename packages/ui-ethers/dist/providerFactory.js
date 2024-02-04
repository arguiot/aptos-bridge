"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setProviderFactory = exports.getProvider = exports.createFailoverProvider = exports.StaticJsonRpcBatchProviderFactory = exports.JsonRpcBatchProviderFactory = void 0;
const rpcNodes_1 = require("./rpcNodes");
const lodash_1 = require("lodash");
const providers_1 = require("@ethersproject/providers");
const StaticJsonBatchProvider_1 = require("./providers/StaticJsonBatchProvider");
const FailoverProvider_1 = require("./providers/FailoverProvider");
const ui_core_1 = require("@layerzerolabs/ui-core");
const randomize_1 = require("./randomize");
const rpcConstants_1 = require("./constants/rpcConstants");
exports.JsonRpcBatchProviderFactory = (0, lodash_1.memoize)((chainId) => {
    const urls = rpcConstants_1.WHITELISTED_RPCS_FOR_WALLETS[chainId];
    if (!chainId)
        throw new Error(`No RPC_URI for ${chainId}`);
    const evmChainId = (0, ui_core_1.toEvmChainId)(chainId);
    const network = (0, ui_core_1.getNetwork)(chainId);
    const url = (0, lodash_1.sample)(urls);
    if (!url)
        throw new Error(`No RPC URL for ${chainId}`);
    return new providers_1.JsonRpcBatchProvider({ url }, {
        chainId: evmChainId,
        name: network.name,
    });
});
exports.StaticJsonRpcBatchProviderFactory = (0, lodash_1.memoize)((chainId) => {
    const urls = rpcConstants_1.WHITELISTED_RPCS_FOR_WALLETS[chainId];
    if (!chainId)
        throw new Error(`No RPC_URI for ${chainId}`);
    const evmChainId = (0, ui_core_1.toEvmChainId)(chainId);
    const network = (0, ui_core_1.getNetwork)(chainId);
    const url = (0, lodash_1.sample)(urls);
    if (!url)
        throw new Error(`No RPC URL for ${chainId}`);
    return new StaticJsonBatchProvider_1.StaticJsonRpcBatchProvider({ url, timeout: 5000 }, {
        chainId: evmChainId,
        name: network.name,
    });
});
function createFailoverProvider(chainId, options = {}) {
    const network = {
        name: (0, ui_core_1.getNetwork)(chainId).name,
        chainId: (0, ui_core_1.toEvmChainId)(chainId),
    };
    const urls = rpcNodes_1.PUBLIC_RPC_NODES[chainId];
    if (!urls || urls.length === 0) {
        throw new Error(`No PUBLIC_RPC_NODES for ${chainId}`);
    }
    const rpcList = (0, randomize_1.randomizeOrder)(urls);
    const providers = rpcList.map(({ url, timeout = 5000 }) => {
        return new StaticJsonBatchProvider_1.StaticJsonRpcBatchProvider({ url, timeout }, network);
    });
    providers.forEach((provider) => {
        var _a, _b;
        provider.onError((_a = options.onError) !== null && _a !== void 0 ? _a : lodash_1.noop);
        provider.on('debug', (_b = options.onDebug) !== null && _b !== void 0 ? _b : lodash_1.noop);
    });
    const provider = new FailoverProvider_1.FailoverProvider(providers, network);
    return provider;
}
exports.createFailoverProvider = createFailoverProvider;
let providerFactory = (0, lodash_1.memoize)((chainId) => createFailoverProvider(chainId));
const getProvider = (chainId) => {
    console.warn('getProvider is deprecated', 'please inject your provider factory');
    return providerFactory(chainId);
};
exports.getProvider = getProvider;
const setProviderFactory = (factory) => {
    providerFactory = factory;
};
exports.setProviderFactory = setProviderFactory;
