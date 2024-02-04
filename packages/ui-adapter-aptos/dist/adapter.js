"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAptosAdapter = void 0;
const aptos_wallet_adapter_1 = require("@manahippo/aptos-wallet-adapter");
const ui_core_1 = require("@layerzerolabs/ui-core");
const ui_mobx_1 = require("@layerzerolabs/ui-mobx");
const assert_1 = __importDefault(require("assert"));
function createAptosAdapter(walletsByType) {
    const wallets = Object.values(walletsByType);
    (0, assert_1.default)(wallets.length, `No wallet`);
    function getWallet(walletType) {
        if (walletType) {
            const wallet = walletsByType[walletType];
            (0, assert_1.default)(wallet, `No wallet ${walletType}`);
            return wallet;
        }
        const wallet = wallets[0];
        return wallet;
    }
    const adapter = {
        async connect(walletType) {
            const wallet = getWallet(walletType);
            await wallet.connect();
            saveLastWallet(walletType);
            (0, assert_1.default)(wallet.publicAccount.address, 'No account');
            const signer = {
                signAndSubmitTransaction(payload, options) {
                    //@ts-ignore
                    return wallet.signAndSubmitTransaction(payload, options);
                },
            };
            function updateStore() {
                const { address, publicKey } = wallet.publicAccount;
                if (!address) {
                    ui_mobx_1.walletStore.useAptosWallet(undefined);
                }
                else {
                    ui_mobx_1.walletStore.useAptosWallet({
                        account: address.toString(),
                        publicKey: publicKey.toString(),
                        type: walletType,
                        aptosChainId: getAptosChainId(wallet.network),
                        signer,
                    });
                }
            }
            wallet.on('accountChange', updateStore);
            wallet.on('networkChange', updateStore);
            wallet.once('disconnect', () => {
                ui_mobx_1.walletStore.useAptosWallet(undefined);
                wallet.off('accountChange', updateStore);
                wallet.off('networkChange', updateStore);
            });
            updateStore();
            // Listen on the adapter's network/account changes
            wallet.onAccountChange();
            wallet.onNetworkChange();
        },
        async disconnect() {
            const wallet = getWallet();
            await wallet.disconnect();
            ui_mobx_1.walletStore.useAptosWallet(undefined);
            saveLastWallet(null);
        },
        async eagerConnect() {
            const lastWallet = getLastWallet();
            if (lastWallet) {
                const wallet = getWallet(lastWallet);
                // try 3 times (1.5s)
                let attempt = 0;
                while (attempt++ < 3) {
                    if (wallet.readyState === aptos_wallet_adapter_1.WalletReadyState.Installed) {
                        try {
                            await adapter.connect(lastWallet);
                            // success
                            return void 0;
                        }
                        catch (e) {
                            if (!(e instanceof aptos_wallet_adapter_1.WalletNotReadyError))
                                throw e;
                        }
                    }
                    await sleep(500);
                }
            }
        },
    };
    return adapter;
}
exports.createAptosAdapter = createAptosAdapter;
const sleep = (timeMs) => new Promise((resolve) => setTimeout(resolve, timeMs));
const lastWalletKey = 'aptos:wallet';
function getLastWallet() {
    if (typeof window === 'undefined')
        return null;
    return window.localStorage.getItem(lastWalletKey);
}
function saveLastWallet(walletType) {
    if (typeof window === 'undefined')
        return;
    if (walletType) {
        window.localStorage.setItem(lastWalletKey, walletType);
    }
    else {
        window.localStorage.removeItem(lastWalletKey);
    }
}
function getAptosChainId(network) {
    var _a, _b;
    if (network.chainId) {
        const aptosChainId = Number(network.chainId);
        if (ui_core_1.AptosChainId[aptosChainId])
            return aptosChainId;
    }
    else if (((_a = network.name) === null || _a === void 0 ? void 0 : _a.toUpperCase()) === 'TESTNET') {
        return ui_core_1.AptosChainId.TESTNET;
    }
    else if (((_b = network.name) === null || _b === void 0 ? void 0 : _b.toUpperCase()) === 'MAINNET') {
        return ui_core_1.AptosChainId.MAINNET;
    }
    return undefined;
}
