"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCurrency = exports.isCoin = exports.assertToken = exports.isToken = void 0;
const coin_1 = require("../coin");
const token_1 = require("../token");
function isToken(value) {
    return value instanceof token_1.Token;
}
exports.isToken = isToken;
function assertToken(value, errorMessage) {
    if (!isToken(value)) {
        throw new Error(errorMessage !== null && errorMessage !== void 0 ? errorMessage : `Not a token (${value.symbol})`);
    }
}
exports.assertToken = assertToken;
function isCoin(value) {
    return value instanceof coin_1.Coin;
}
exports.isCoin = isCoin;
function isCurrency(value) {
    return value instanceof token_1.Token || value instanceof coin_1.Coin;
}
exports.isCurrency = isCurrency;
