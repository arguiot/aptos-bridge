"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScanLink = exports.getTransactionLink = exports.getAddressLink = exports.getBlockLink = exports.isChainOnStage = exports.getChainStage = exports.isNativeCurrency = exports.getChainKey = exports.getNativeCurrency = exports.tryGetNetwork = exports.getNetwork = exports.isEvmAddress = exports.NETWORKS = void 0;
const lz_sdk_1 = require("@layerzerolabs/lz-sdk");
const utils_1 = require("ethers/lib/utils");
Object.defineProperty(exports, "isEvmAddress", { enumerable: true, get: function () { return utils_1.isAddress; } });
const currency_1 = require("../currency");
const chainType_1 = require("./chainType");
const getBlockExplorer_1 = require("./getBlockExplorer");
const toULNv2_1 = require("./toULNv2");
function addSandboxNetworks(networks) {
    const result = networks.slice();
    for (const network of networks) {
        const networkSymbol = lz_sdk_1.ChainId[network.chainId];
        //@ts-ignore
        const chainId = lz_sdk_1.ChainId[networkSymbol + '_SANDBOX'];
        if (chainId) {
            const sandbox = Object.assign(Object.assign({}, network), { chainId });
            result.push(sandbox);
        }
    }
    return result;
}
exports.NETWORKS = addSandboxNetworks([
    {
        chainId: lz_sdk_1.ChainId.ETHEREUM,
        name: 'Ethereum',
        symbol: 'Ethereum',
        nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    },
    {
        chainId: lz_sdk_1.ChainId.RINKEBY,
        name: 'Rinkeby Testnet',
        symbol: 'Rinkeby',
        nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    },
    {
        chainId: lz_sdk_1.ChainId.GOERLI,
        name: 'Goerli',
        symbol: 'goerli',
        nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    },
    {
        name: 'BNB Chain',
        chainId: lz_sdk_1.ChainId.BSC,
        symbol: 'BNB',
        nativeCurrency: { symbol: 'BNB', name: 'BNB', decimals: 18 },
    },
    {
        chainId: lz_sdk_1.ChainId.BSC_TESTNET,
        name: 'Binance Test Chain',
        symbol: 'BNB',
        nativeCurrency: { symbol: 'BNB', name: 'BNB', decimals: 18 },
    },
    {
        chainId: lz_sdk_1.ChainId.POLYGON,
        name: 'Polygon',
        symbol: 'Matic',
        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    },
    {
        chainId: lz_sdk_1.ChainId.MUMBAI,
        name: 'Mumbai',
        symbol: 'Matic',
        nativeCurrency: { symbol: 'MATIC', name: 'MATIC', decimals: 18 },
    },
    {
        chainId: lz_sdk_1.ChainId.AVALANCHE,
        name: 'Avalanche',
        symbol: 'Avalanche',
        nativeCurrency: { name: 'Avalanche Token', symbol: 'AVAX', decimals: 18 },
    },
    {
        chainId: lz_sdk_1.ChainId.FUJI,
        name: 'Fuji',
        symbol: 'Avalanche',
        nativeCurrency: { name: 'Avalanche Token', symbol: 'AVAX', decimals: 18 },
    },
    {
        chainId: lz_sdk_1.ChainId.FANTOM,
        name: 'Fantom',
        symbol: 'Fantom',
        nativeCurrency: { name: 'Fantom', symbol: 'FTM', decimals: 18 },
    },
    {
        chainId: lz_sdk_1.ChainId.FANTOM_TESTNET,
        name: 'Fantom Testnet',
        symbol: 'Fantom',
        nativeCurrency: { name: 'Fantom', symbol: 'FTM', decimals: 18 },
    },
    {
        chainId: lz_sdk_1.ChainId.ARBITRUM,
        name: 'Arbitrum',
        symbol: 'Arbitrum',
        nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    },
    {
        chainId: lz_sdk_1.ChainId.ARBITRUM_GOERLI,
        name: 'Arbitrum Goerli',
        symbol: 'Arbitrum',
        nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    },
    {
        chainId: lz_sdk_1.ChainId.ARBITRUM_RINKEBY,
        name: 'Arbitrum Rinkeby',
        symbol: 'Arbitrum',
        nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    },
    {
        chainId: lz_sdk_1.ChainId.OPTIMISM,
        name: 'Optimism',
        symbol: 'Optimism',
        nativeCurrency: { symbol: 'ETH', name: 'ETH', decimals: 18 },
    },
    {
        chainId: lz_sdk_1.ChainId.OPTIMISM_KOVAN,
        name: 'Optimism Kovan',
        symbol: 'Optimism',
        nativeCurrency: { symbol: 'ETH', name: 'ETH', decimals: 18 },
    },
    {
        chainId: lz_sdk_1.ChainId.OPTIMISM_GOERLI,
        name: 'Optimism Goerli',
        symbol: 'Optimism',
        nativeCurrency: { symbol: 'ETH', name: 'ETH', decimals: 18 },
    },
    {
        chainId: lz_sdk_1.ChainId.SWIMMER,
        name: 'Swimmer',
        symbol: 'swimmer',
        nativeCurrency: { symbol: 'TUS', name: 'TUS', decimals: 18 },
    },
    {
        chainId: lz_sdk_1.ChainId.DFK,
        name: 'DFK',
        symbol: 'dfk',
        nativeCurrency: { symbol: 'JEWEL', name: 'JEWEL', decimals: 18 },
    },
    {
        chainId: lz_sdk_1.ChainId.HARMONY,
        name: 'Harmony',
        symbol: 'harmony',
        nativeCurrency: { symbol: 'ONE', name: 'ONE', decimals: 18 },
    },
    {
        chainId: lz_sdk_1.ChainId.APTOS,
        name: 'Aptos',
        symbol: 'APTOS',
        nativeCurrency: {
            symbol: 'APT',
            name: 'AptosCoin',
            decimals: 8,
            address: '0x1::aptos_coin::AptosCoin',
        },
    },
    {
        chainId: lz_sdk_1.ChainId.APTOS_TESTNET,
        name: 'Aptos Testnet',
        symbol: 'APTOS',
        nativeCurrency: {
            symbol: 'APT',
            name: 'AptosCoin',
            decimals: 8,
            address: '0x1::aptos_coin::AptosCoin',
        },
    },
    {
        chainId: lz_sdk_1.ChainId.MOONBEAM,
        name: 'MOONBEAM',
        symbol: 'moonbeam',
        nativeCurrency: { symbol: 'MOVR', name: 'MOVR', decimals: 18 },
    },
]).map((_a) => {
    var { nativeCurrency } = _a, network = __rest(_a, ["nativeCurrency"]);
    return (Object.assign(Object.assign({}, network), { nativeCurrency: hasAddress(nativeCurrency)
            ? new currency_1.Token(network.chainId, nativeCurrency.address, nativeCurrency.decimals, nativeCurrency.symbol, nativeCurrency.name)
            : new currency_1.Coin(network.chainId, nativeCurrency.decimals, nativeCurrency.symbol, nativeCurrency.name) }));
});
function hasAddress(currency) {
    //@ts-ignore
    return !!currency.address;
}
function getNetwork(chainId) {
    const network = tryGetNetwork(chainId);
    if (!network)
        throw Error(`No NETWORK for ${chainId}`);
    return network;
}
exports.getNetwork = getNetwork;
function tryGetNetwork(chainId) {
    if (chainId === undefined)
        return undefined;
    chainId = (0, toULNv2_1.toULNv2)(chainId);
    return exports.NETWORKS.find((i) => i.chainId === chainId);
}
exports.tryGetNetwork = tryGetNetwork;
function getNativeCurrency(chainId) {
    return getNetwork(chainId).nativeCurrency;
}
exports.getNativeCurrency = getNativeCurrency;
function getChainKey(chainId) {
    const key = lz_sdk_1.CHAIN_KEY[chainId];
    if (!key)
        throw new Error(`No CHAIN_KEY for ${chainId}`);
    return key;
}
exports.getChainKey = getChainKey;
function isNativeCurrency(currency) {
    const native = getNativeCurrency(currency.chainId);
    return native.equals(currency);
}
exports.isNativeCurrency = isNativeCurrency;
function getChainStage(chainId) {
    // naive - but supports both ULNv1 and ULNv2
    return chainId < 10000
        ? lz_sdk_1.ChainStage.MAINNET
        : chainId < 20000
            ? lz_sdk_1.ChainStage.TESTNET
            : lz_sdk_1.ChainStage.TESTNET_SANDBOX;
}
exports.getChainStage = getChainStage;
function isChainOnStage(chainId, chainStage) {
    return getChainStage(chainId) === chainStage;
}
exports.isChainOnStage = isChainOnStage;
function getBlockExplorerUrl(chainId) {
    var _a, _b;
    return (_b = (_a = (0, getBlockExplorer_1.tryGetBlockExplorer)(chainId)) === null || _a === void 0 ? void 0 : _a.url) !== null && _b !== void 0 ? _b : '';
}
function getBlockLink(chainId, blockOrHash) {
    return getBlockExplorerUrl(chainId) + `/block/${blockOrHash}`;
}
exports.getBlockLink = getBlockLink;
function getAddressLink(chainId, address) {
    return getBlockExplorerUrl(chainId) + `/address/${address}`;
}
exports.getAddressLink = getAddressLink;
function getTransactionLink(chainId, hash) {
    const explorer = getBlockExplorerUrl(chainId);
    if ((0, chainType_1.isChainType)(chainId, chainType_1.ChainType.APTOS)) {
        const queryString = chainId === lz_sdk_1.ChainId.APTOS_TESTNET || chainId === lz_sdk_1.ChainId.APTOS_TESTNET_SANDBOX
            ? '?network=Testnet'
            : '';
        return explorer + '/txn/' + hash + queryString;
    }
    return explorer + '/tx/' + hash;
}
exports.getTransactionLink = getTransactionLink;
function getScanLink(chainId, hash) {
    const chainStage = getChainStage(chainId);
    if (chainStage === lz_sdk_1.ChainStage.MAINNET) {
        return `https://layerzeroscan.com/tx/${hash}`;
    }
    if (chainStage === lz_sdk_1.ChainStage.TESTNET) {
        return `https://testnet.layerzeroscan.com/tx/${hash}`;
    }
    return `https://sandbox.layerzeroscan.com/tx/${hash}`;
}
exports.getScanLink = getScanLink;
