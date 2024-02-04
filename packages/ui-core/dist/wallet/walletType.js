"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WALLETS_APTOS = exports.WALLETS_EVM = exports.WalletType = void 0;
var WalletType;
(function (WalletType) {
    WalletType["Pontem"] = "Pontem";
    WalletType["Petra"] = "Petra";
    WalletType["Brave"] = "Brave";
    WalletType["Martian"] = "Martian";
    WalletType["Fewcha"] = "Fewcha";
    WalletType["MetaMask"] = "MetaMask";
    WalletType["CoinBase"] = "CoinBase";
    WalletType["Core"] = "Core";
    WalletType["MSafe"] = "MSafe";
})(WalletType = exports.WalletType || (exports.WalletType = {}));
exports.WALLETS_EVM = [
    WalletType.MetaMask,
    WalletType.Core,
    WalletType.Brave,
    WalletType.CoinBase,
];
exports.WALLETS_APTOS = [
    WalletType.Pontem,
    WalletType.Fewcha,
    WalletType.Martian,
    WalletType.Petra,
    WalletType.MSafe,
];
