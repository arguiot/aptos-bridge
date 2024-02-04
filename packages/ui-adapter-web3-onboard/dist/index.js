var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useEffect } from 'react';
import { walletStore } from '@layerzerolabs/ui-mobx';
import { getNetwork, getNetworkIcon, NETWORKS, isEvmChainId, toEvmChainId, getBlockExplorer, WalletType, } from '@layerzerolabs/ui-core';
import { getOfficialRpcUrls } from '@layerzerolabs/ui-ethers';
import { ethers } from 'ethers';
export function createWeb3OnboardChains(chains = NETWORKS) {
    return chains
        .map((i) => (typeof i === 'number' ? getNetwork(i) : i))
        .filter((network) => isEvmChainId(network.chainId))
        .map((network) => ({
        id: '0x' + toEvmChainId(network.chainId).toString(16),
        label: network.name,
        token: network.nativeCurrency.symbol,
        rpcUrl: getOfficialRpcUrls(network.chainId)[0],
        blockExplorerUrl: getBlockExplorer(network.chainId).url,
        icon: getNetworkIcon(network.chainId),
    }));
}
export function tryConnectWallet(web3Onboard) {
    if (typeof window === 'undefined')
        return;
    const previouslyConnectedWallets = JSON.parse(window.localStorage.getItem('connectedWallets'));
    if (previouslyConnectedWallets === null || previouslyConnectedWallets === void 0 ? void 0 : previouslyConnectedWallets.length) {
        // no await
        web3Onboard.connectWallet({
            autoSelect: { label: previouslyConnectedWallets[0], disableModals: true },
        });
    }
    const { unsubscribe } = web3Onboard.state.select('wallets').subscribe((wallets) => {
        const connectedWallets = wallets.map(({ label }) => label);
        window.localStorage.setItem('connectedWallets', JSON.stringify(connectedWallets));
    });
    return () => {
        try {
            unsubscribe();
        }
        catch (_a) {
            //
        }
    };
}
export function initWeb3Onboard(web3Onboard) {
    const { unsubscribe } = web3Onboard.state.select('wallets').subscribe(([activeWallet]) => {
        const evmChainId = activeWallet === null || activeWallet === void 0 ? void 0 : activeWallet.chains[0].id;
        if (!activeWallet) {
            walletStore.useEvmWallet(undefined);
        }
        else {
            const signer = new ethers.providers.Web3Provider(activeWallet.provider).getSigner();
            walletStore.useEvmWallet({
                type: getWalletType(activeWallet.label),
                evmChainId: Number(evmChainId),
                account: activeWallet === null || activeWallet === void 0 ? void 0 : activeWallet.accounts[0].address,
                signer: signer,
                // name: activeWallet.label,
            });
        }
    });
    return () => {
        try {
            unsubscribe();
        }
        catch (_a) {
            //
        }
    };
}
export function createWeb3OnboardAdapter(web3Onboard) {
    function Provider({ children }) {
        useEffect(() => tryConnectWallet(web3Onboard), []);
        useEffect(() => initWeb3Onboard(web3Onboard), []);
        return children;
    }
    const adapter = {
        switchChain(chainId) {
            return __awaiter(this, void 0, void 0, function* () {
                yield web3Onboard.setChain({ chainId: '0x' + toEvmChainId(chainId).toString(16) });
                yield waitFor(() => { var _a; return ((_a = walletStore.activeWallet) === null || _a === void 0 ? void 0 : _a.chainId) === chainId; });
            });
        },
        disconnect() {
            return __awaiter(this, void 0, void 0, function* () {
                yield web3Onboard.disconnectWallet({ label: web3Onboard.state.get().wallets[0].label });
            });
        },
        connect(walletType) {
            return __awaiter(this, void 0, void 0, function* () {
                const options = walletType
                    ? { autoSelect: { label: getWalletLabel(walletType), disableModals: true } }
                    : undefined;
                const wallets = yield web3Onboard.connectWallet(options);
                if (!wallets.length) {
                    return Promise.reject();
                }
            });
        },
    };
    return { Provider: Provider, adapter };
}
function waitFor(fn, timeout = 1000) {
    return new Promise((resolve, reject) => {
        const id = setInterval(() => {
            if (fn()) {
                clear();
                resolve();
            }
        }, 100);
        const clear = () => clearInterval(id);
        setTimeout(() => {
            clear();
            reject();
        }, timeout);
    });
}
const WalletTypeMap = {
    Core: WalletType.Core,
    MetaMask: WalletType.MetaMask,
    'Coinbase Wallet': WalletType.CoinBase,
};
function getWalletLabel(walletType) {
    var _a;
    const label = (_a = Object.entries(WalletTypeMap).find(([label, type]) => type === walletType)) === null || _a === void 0 ? void 0 : _a[0];
    if (label)
        return label;
    throw new Error(`No wallet label for ${walletType}`);
}
function getWalletType(label) {
    const walletType = WalletTypeMap[label];
    if (walletType)
        return walletType;
    throw new Error(`No wallet type for ${label}`);
}
