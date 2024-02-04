"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setIconTheme = exports.getWalletIcon = exports.getNetworkIcon = exports.getCurrencyIcon = exports.IconTheme = void 0;
const network_1 = require("./network");
var IconTheme;
(function (IconTheme) {
    IconTheme["LZ_DARK"] = "lz-dark";
    IconTheme["LZ_LIGHT"] = "lz-light";
    IconTheme["STG_LIGHT"] = "stargate-light";
})(IconTheme = exports.IconTheme || (exports.IconTheme = {}));
let defaultTheme = IconTheme.LZ_DARK;
const baseUrl = 'https://icons-ckg.pages.dev';
function getCurrencyIcon(symbol, theme = getCurrencyIcon.defaultTheme) {
    return [baseUrl, theme, 'tokens', symbol.toLowerCase() + '.svg'].join('/');
}
exports.getCurrencyIcon = getCurrencyIcon;
function getNetworkIcon(chainIdOrSymbol, theme = getNetworkIcon.defaultTheme) {
    const symbol = typeof chainIdOrSymbol === 'string' ? chainIdOrSymbol : (0, network_1.getNetwork)(chainIdOrSymbol).symbol;
    return [baseUrl, theme, 'networks', symbol.toLowerCase() + '.svg'].join('/');
}
exports.getNetworkIcon = getNetworkIcon;
function getWalletIcon(walletType, theme = getWalletIcon.defaultTheme) {
    return [baseUrl, theme, 'wallets', walletType.toLowerCase() + '.svg'].join('/');
}
exports.getWalletIcon = getWalletIcon;
getCurrencyIcon.defaultTheme = defaultTheme;
getNetworkIcon.defaultTheme = defaultTheme;
getWalletIcon.defaultTheme = defaultTheme;
function setIconTheme(theme) {
    getCurrencyIcon.defaultTheme = theme;
    getNetworkIcon.defaultTheme = theme;
    getWalletIcon.defaultTheme = theme;
}
exports.setIconTheme = setIconTheme;
