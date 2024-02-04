"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCurrencyAmount = void 0;
const ethers_1 = require("ethers");
const currencyAmount_1 = require("../currencyAmount");
function toCurrencyAmount(token, value) {
    if (ethers_1.BigNumber.isBigNumber(value))
        value = value.toHexString();
    return currencyAmount_1.CurrencyAmount.fromRawAmount(token, value);
}
exports.toCurrencyAmount = toCurrencyAmount;
