"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryGetBlockExplorer = exports.getBlockExplorer = exports.BLOCK_EXPLORERS = void 0;
const lz_sdk_1 = require("@layerzerolabs/lz-sdk");
const toULNv2_1 = require("./toULNv2");
exports.BLOCK_EXPLORERS = addSandboxBlockExplorers([
    { chainId: lz_sdk_1.ChainId.ETHEREUM, url: 'https://etherscan.com', name: 'block explorer' },
    { chainId: lz_sdk_1.ChainId.GOERLI, url: 'https://goerli.etherscan.io', name: 'block explorer' },
    { chainId: lz_sdk_1.ChainId.RINKEBY, url: 'https://rinkeby.etherscan.io', name: 'block explorer' },
    { chainId: lz_sdk_1.ChainId.FANTOM, url: 'https://ftmscan.com', name: 'block explorer' },
    { chainId: lz_sdk_1.ChainId.FANTOM_TESTNET, url: 'https://testnet.ftmscan.com', name: 'block explorer' },
    {
        chainId: lz_sdk_1.ChainId.FANTOM_TESTNET_SANDBOX,
        url: 'https://testnet.ftmscan.com',
        name: 'block explorer',
    },
    { chainId: lz_sdk_1.ChainId.ARBITRUM, url: 'https://arbiscan.io', name: 'block explorer' },
    {
        chainId: lz_sdk_1.ChainId.ARBITRUM_GOERLI,
        url: 'https://goerli.arbiscan.io',
        name: 'block explorer',
    },
    {
        chainId: lz_sdk_1.ChainId.ARBITRUM_RINKEBY,
        url: 'https://rinkeby-explorer.arbitrum.io',
        name: 'block explorer',
    },
    {
        chainId: lz_sdk_1.ChainId.POLYGON,
        url: 'https://explorer-mainnet.maticvigil.com',
        name: 'block explorer',
    },
    { chainId: lz_sdk_1.ChainId.MUMBAI, url: 'https://mumbai.polygonscan.com', name: 'block explorer' },
    { chainId: lz_sdk_1.ChainId.MUMBAI_SANDBOX, url: 'https://mumbai.polygonscan.com', name: 'block explorer' },
    { chainId: lz_sdk_1.ChainId.BSC, url: 'https://bscscan.com', name: 'block explorer' },
    { chainId: lz_sdk_1.ChainId.BSC_TESTNET, url: 'https://testnet.bscscan.com', name: 'block explorer' },
    { chainId: lz_sdk_1.ChainId.AVALANCHE, url: 'https://cchain.explorer.avax.network', name: 'block explorer' },
    { chainId: lz_sdk_1.ChainId.FUJI, url: 'https://testnet.snowtrace.io', name: 'block explorer' },
    { chainId: lz_sdk_1.ChainId.OPTIMISM, url: 'https://optimistic.etherscan.io', name: 'block explorer' },
    {
        chainId: lz_sdk_1.ChainId.OPTIMISM_KOVAN,
        url: 'https://kovan-optimistic.etherscan.io',
        name: 'block explorer',
    },
    {
        chainId: lz_sdk_1.ChainId.OPTIMISM_GOERLI,
        url: 'https://goerli-optimism.etherscan.io/',
        name: 'block explorer',
    },
    {
        chainId: lz_sdk_1.ChainId.HARMONY,
        url: 'https://explorer.harmony.one',
        name: 'block explorer',
    },
    {
        chainId: lz_sdk_1.ChainId.DFK,
        url: 'https://subnets.avax.network/defi-kingdoms',
        name: 'block explorer',
    },
    {
        chainId: lz_sdk_1.ChainId.SWIMMER,
        url: 'https://explorer.swimmer.network',
        name: 'block explorer',
    },
    {
        chainId: lz_sdk_1.ChainId.DEXALOT_TESTNET,
        url: 'https://subnets-test.avax.network/dexalot',
        name: 'block explorer',
    },
    {
        chainId: lz_sdk_1.ChainId.MOONBEAM,
        url: 'https://moonscan.io',
        name: 'block explorer',
    },
    {
        chainId: lz_sdk_1.ChainId.GOERLI,
        url: 'https://goerli.etherscan.io',
        name: 'block explorer',
    },
    {
        chainId: lz_sdk_1.ChainId.APTOS,
        url: 'https://explorer.aptoslabs.com',
        name: 'block explorer',
    },
    {
        chainId: lz_sdk_1.ChainId.APTOS_TESTNET,
        url: 'https://explorer.aptoslabs.com',
        name: 'block explorer',
    },
]);
function getBlockExplorer(chainId) {
    const explorer = tryGetBlockExplorer(chainId);
    if (!explorer)
        throw new Error(`No BLOCK_EXPLORERS for ChainId ${chainId}`);
    return explorer;
}
exports.getBlockExplorer = getBlockExplorer;
function tryGetBlockExplorer(chainId) {
    chainId = (0, toULNv2_1.toULNv2)(chainId);
    const explorer = exports.BLOCK_EXPLORERS.find((i) => i.chainId === chainId);
    return explorer;
}
exports.tryGetBlockExplorer = tryGetBlockExplorer;
function addSandboxBlockExplorers(explorers) {
    const result = explorers.slice();
    for (const explorer of explorers) {
        const networkSymbol = lz_sdk_1.ChainId[explorer.chainId];
        //@ts-ignore
        const chainId = lz_sdk_1.ChainId[networkSymbol + '_SANDBOX'];
        if (chainId) {
            const sandbox = Object.assign(Object.assign({}, explorer), { chainId });
            result.push(sandbox);
        }
    }
    return result;
}
