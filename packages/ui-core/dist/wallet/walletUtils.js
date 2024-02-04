"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWalletExtensionUrl = exports.WALLET_EXTENSION_MAP = exports.isWalletAvailable = exports.getAvailableWallets = void 0;
const walletType_1 = require("./walletType");
function getAvailableWallets() {
    var _a, _b, _c, _d;
    const global = typeof window === 'undefined' ? {} : window;
    const wallet = {
        [walletType_1.WalletType.MetaMask]: !!((_a = global.ethereum) === null || _a === void 0 ? void 0 : _a.isMetaMask) && !((_b = global.ethereum) === null || _b === void 0 ? void 0 : _b.isBrave),
        [walletType_1.WalletType.Brave]: !!((_c = global.ethereum) === null || _c === void 0 ? void 0 : _c.isBrave),
        [walletType_1.WalletType.CoinBase]: !!global.coinbaseWalletExtension,
        [walletType_1.WalletType.Pontem]: !!global.pontem,
        [walletType_1.WalletType.Martian]: !!global.martian,
        [walletType_1.WalletType.Fewcha]: !!((_d = global.fewcha) === null || _d === void 0 ? void 0 : _d.isFewcha),
        [walletType_1.WalletType.Petra]: !!global.petra,
        [walletType_1.WalletType.Core]: !!global.avalanche,
        // Mimic the existing msafe check, see https://github.com/Momentum-Safe/msafe-wallet/blob/main/src/MSafeWallet.ts#L90
        [walletType_1.WalletType.MSafe]: global && global.parent !== global,
    };
    return wallet;
}
exports.getAvailableWallets = getAvailableWallets;
function isWalletAvailable(walletType) {
    if (typeof window === 'undefined')
        return false;
    const availableWallets = getAvailableWallets();
    return availableWallets[walletType] || false;
}
exports.isWalletAvailable = isWalletAvailable;
exports.WALLET_EXTENSION_MAP = {
    [walletType_1.WalletType.CoinBase]: 'https://www.coinbase.com/wallet',
    [walletType_1.WalletType.Fewcha]: 'https://fewcha.app/',
    [walletType_1.WalletType.Martian]: 'https://martianwallet.xyz/',
    [walletType_1.WalletType.MetaMask]: 'https://metamask.io/',
    [walletType_1.WalletType.Pontem]: 'https://pontem.network/',
    [walletType_1.WalletType.Petra]: 'https://petra.app/',
    [walletType_1.WalletType.Brave]: 'https://brave.com/wallet/',
    [walletType_1.WalletType.Core]: 'https://core.app/',
    [walletType_1.WalletType.MSafe]: 'https://app.m-safe.io/apps',
};
function getWalletExtensionUrl(walletType) {
    return exports.WALLET_EXTENSION_MAP[walletType];
}
exports.getWalletExtensionUrl = getWalletExtensionUrl;
