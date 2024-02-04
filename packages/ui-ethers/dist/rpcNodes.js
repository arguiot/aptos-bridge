"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOfficialRpcUrls = exports.PUBLIC_RPC_NODES = void 0;
const lz_sdk_1 = require("@layerzerolabs/lz-sdk");
const rpcConstants_1 = require("./constants/rpcConstants");
const MATICVIGIL_ID = '39fe5c21ccf1eff1520ff3a98b17a7a93b444d26';
const ALCHEMY_ID = 'diFpK69enquODcjB8i6pfcJmy4VNaO-D';
const INFURA_ID = '028a19f481ce4d35908214e5134c2131';
exports.PUBLIC_RPC_NODES = {
    [lz_sdk_1.ChainId.ETHEREUM]: [
        {
            url: 'https://eth-mainnet.gateway.pokt.network/v1/5f3453978e354ab992c4da79',
            weight: 1e6,
        },
        { url: 'https://eth-rpc.gateway.pokt.network', weight: 1e6 },
        { url: 'https://ethereum.publicnode.com', weight: 1e6 },
        { url: 'https://eth-mainnet.public.blastapi.io', weight: 1e6 },
        // {url: 'https://nodes.mewapi.io/rpc/eth'},
        // {url: 'https://main-rpc.linkpool.io'},
        // {url: 'https://main-light.eth.linkpool.io'},
        // {url: 'https://rpc.ankr.com/eth'}, // SOMETIMES returns invalid data
        // {url: 'https://rpc.flashbots.net'},
        // {url: 'https://ethereumnodelight.app.runonflux.io', weight: 1e6}, // is down
        // {url: 'https://api.mycryptoapi.com/eth'},
        { url: 'https://cloudflare-eth.com', weight: 1e3 },
        // {url: 'https://mainnet.eth.cloud.ava.do'},
        // {url: 'https://nodes.mewapi.io/rpc/eth'},
        { url: `https://mainnet.infura.io/v3/${INFURA_ID}`, weight: 1 },
        {
            url: `https://eth-mainnet.alchemyapi.io/v2/84tGz8xVIWFkagsaSzNjObh7aSPbxeXD`,
            weight: 1e2,
        },
        {
            url: `https://eth-mainnet.alchemyapi.io/v2/VsPzIezK0AtqsnrWAuV0Gew-MS7H_E5E`,
            weight: 1e2,
        },
    ],
    [lz_sdk_1.ChainId.POLYGON]: [
        { url: 'https://poly-rpc.gateway.pokt.network', weight: 1e6 },
        { url: 'https://matic-mainnet.chainstacklabs.com', weight: 1e6 },
        { url: `https://polygon-mainnet.infura.io/v3/${INFURA_ID}` },
        // {url: 'https://rpc.ankr.com/polygon'}, // MIGHT return invalid data
        { url: 'https://polygon-rpc.com', weight: 1e6 },
        {
            url: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}`,
            weight: 1,
        },
        // {url: 'https://rpc-mainnet.matic.quiknode.pro'},
        // {url: 'https://rpc-mainnet.matic.network'},
        // {url: 'https://matic-mainnet-full-rpc.bwarelabs.com'},
        // {url: 'https://matic-mainnet-archive-rpc.bwarelabs.com'},
        // {url: 'https://rpc-mainnet.maticvigil.com'},
        {
            url: 'https://polygon-mainnet.g.alchemy.com/v2/me6Q04fTd2kTT74BUYAp82d_3KL-ObCw',
            weight: 1e2,
        },
        {
            url: 'https://polygon-mainnet.g.alchemy.com/v2/q3f-QpPeM_g7rL3G21Cr9tFeuYAquyYl',
            weight: 1e2,
        },
    ],
    [lz_sdk_1.ChainId.BSC]: [
        { url: 'https://bscrpc.com' },
        { url: 'https://binance.nodereal.io' },
        // binance.org works on PROD
        { url: 'https://bsc-dataseed.binance.org' },
        { url: 'https://bsc-dataseed1.binance.org' },
        { url: 'https://bsc-dataseed2.binance.org' },
        { url: 'https://bsc-dataseed3.binance.org' },
        { url: 'https://bsc-dataseed4.binance.org' },
        // {url: 'https://bsc-dataseed1.ninicoin.io'},
        // {url: 'https://bsc-dataseed2.ninicoin.io'},
        // {url: 'https://bsc-dataseed3.ninicoin.io'},
        // {url: 'https://bsc-dataseed4.ninicoin.io'},
        // {url: 'https://bsc-dataseed1.defibit.io'},
        // {url: 'https://bsc-dataseed2.defibit.io'},
        // {url: 'https://bsc-dataseed3.defibit.io'},
        // {url: 'https://bsc-dataseed4.defibit.io'},
        // {url: 'https://bsc.mytokenpocket.vip'},
        // {url: 'https://rpc-bsc.bnb48.club'},
        // {url: 'https://rpc.ankr.com/bsc'}, // SOMETIMES returns invalid data
    ],
    [lz_sdk_1.ChainId.AVALANCHE]: [
        // {url: 'https://rpc.ankr.com/avalanche'}, // SOMETIMES returns invalid data
        { url: 'https://api.avax.network/ext/bc/C/rpc', weight: 1e6 },
        {
            url: `https://avalanche--mainnet--rpc.datahub.figment.io/apikey/b1a0d59ba8a5d08049bbfdc174dca1b1/ext/bc/C/rpc`,
            weight: 1e2,
        },
    ],
    [lz_sdk_1.ChainId.FANTOM]: [
        { url: 'https://rpc.ftm.tools', weight: 1e6 },
        // {url: 'https://rpc.ankr.com/fantom'}, // SOMETIMES returns invalid data
        // {url: 'https://rpcapi.fantom.network'}, // does not support batch calls
        // {url: 'https://rpc.fantom.network'}, // does not support batch calls
        { url: 'https://rpc2.fantom.network', weight: 100 },
        { url: 'https://rpc3.fantom.network', weight: 100 },
    ],
    [lz_sdk_1.ChainId.OPTIMISM]: [
        //
        { url: 'https://mainnet.optimism.io', timeout: 8000, weight: 1e6 },
        { url: `https://optimism-mainnet.infura.io/v3/${INFURA_ID}` },
        { url: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}` },
        {
            url: `https://opt-mainnet.g.alchemy.com/v2/3glkhRJRgzHCB2NbDwiQa7G_FTdqn3-T`,
            weight: 1e2,
        },
        {
            url: `https://opt-mainnet.g.alchemy.com/v2/7urLa-8k2RR_UYc0exh-b0qg4xySL5KA`,
            weight: 1e2,
        },
    ],
    [lz_sdk_1.ChainId.ARBITRUM]: [
        // {url: 'https://rpc.ankr.com/arbitrum'}, // not working right now
        { url: 'https://arb1.arbitrum.io/rpc', weight: 1e6 },
        { url: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}`, weight: 1 },
        {
            url: 'https://arb-mainnet.g.alchemy.com/v2/N71NRfHZGk2jbnDkW-GiM6fTe6ysJOmp',
            weight: 1e2,
        },
        {
            url: 'https://arb-mainnet.g.alchemy.com/v2/KhVdIItVH0ttiQvBYYO5NPL-De-gLWoW',
            weight: 1e2,
        },
    ],
    //
    //
    //
    // Testnets
    [lz_sdk_1.ChainId.RINKEBY]: [
        //
        { url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_ID}` },
    ],
    [lz_sdk_1.ChainId.GOERLI]: [
        //
        { url: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161' },
    ],
    [lz_sdk_1.ChainId.BSC_TESTNET]: [
        // {url: 'https://data-seed-prebsc-2-s3.binance.org:8545'},
        { url: 'https://data-seed-prebsc-1-s3.binance.org:8545' },
        { url: 'https://data-seed-prebsc-2-s2.binance.org:8545' },
        { url: 'https://data-seed-prebsc-1-s1.binance.org:8545' },
        { url: 'https://data-seed-prebsc-1-s2.binance.org:8545' },
        { url: 'https://data-seed-prebsc-2-s1.binance.org:8545' },
    ],
    [lz_sdk_1.ChainId.MUMBAI]: [
        { url: 'https://matic-mumbai.chainstacklabs.com' },
        { url: `https://rpc-mumbai.maticvigil.com/v1/${MATICVIGIL_ID}` },
    ],
    [lz_sdk_1.ChainId.FUJI]: [
        { url: 'https://api.avax-test.network/ext/bc/C/rpc' },
        { url: 'https://rpc.ankr.com/avalanche_fuji' },
    ],
    [lz_sdk_1.ChainId.OPTIMISM_KOVAN]: [
        { url: 'https://kovan.optimism.io/' },
        { url: `https://opt-kovan.g.alchemy.com/v2/${ALCHEMY_ID}` },
    ],
    [lz_sdk_1.ChainId.FANTOM_TESTNET]: [
        //
        { url: 'https://rpc.testnet.fantom.network/' },
        { url: 'https://rpc.ankr.com/fantom_testnet' },
        { url: 'https://fantom-testnet.public.blastapi.io' },
    ],
    [lz_sdk_1.ChainId.ARBITRUM_RINKEBY]: [
        { url: 'https://rinkeby.arbitrum.io/rpc' },
        { url: `https://arb-rinkeby.g.alchemy.com/v2/${ALCHEMY_ID}` },
    ],
    [lz_sdk_1.ChainId.HARMONY]: [
        { url: 'https://harmony-mainnet.chainstacklabs.com' },
        { url: 'https://api.harmony.one' },
        { url: 'https://api.s0.t.hmny.io' },
        { url: 'https://a.api.s0.t.hmny.io' },
        { url: 'https://rpc.ankr.com/harmony' },
        { url: 'https://harmony-0-rpc.gateway.pokt.network' },
    ],
    [lz_sdk_1.ChainId.DFK]: [
        //
        { url: 'https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc' },
    ],
    [lz_sdk_1.ChainId.GOERLI]: [
        //
        { url: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161' },
        // {url: 'https://rpc.ankr.com/eth_goerli'},
        // {url: 'https://rpc.goerli.mudit.blog'},
    ],
};
function getOfficialRpcUrls(chainId) {
    const urls = rpcConstants_1.WHITELISTED_RPCS_FOR_WALLETS[chainId];
    if (!urls || urls.length === 0)
        throw new Error(`No OFFICIAL_RPC_URI for ${chainId} ${lz_sdk_1.ChainId[chainId]}`);
    return urls;
}
exports.getOfficialRpcUrls = getOfficialRpcUrls;
function updateSandbox() {
    for (const sandboxKey of Object.keys(lz_sdk_1.ChainId).filter((key) => key.endsWith('_SANDBOX'))) {
        const testnetKey = sandboxKey.replace('_SANDBOX', '');
        const testnetChainId = lz_sdk_1.ChainId[testnetKey];
        const sandboxChainId = lz_sdk_1.ChainId[sandboxKey];
        //@ts-ignore
        exports.PUBLIC_RPC_NODES[sandboxChainId] = exports.PUBLIC_RPC_NODES[testnetChainId];
        //@ts-ignore
        rpcConstants_1.WHITELISTED_RPCS_FOR_WALLETS[sandboxChainId] = rpcConstants_1.WHITELISTED_RPCS_FOR_WALLETS[testnetChainId];
    }
}
function updateDefault() {
    Object.entries(lz_sdk_1.RPCS).forEach(([key, urls]) => {
        const chainId = Number(key);
        if (!exports.PUBLIC_RPC_NODES[chainId]) {
            exports.PUBLIC_RPC_NODES[chainId] = urls.map((url) => ({ url }));
        }
    });
}
updateSandbox();
updateDefault();
