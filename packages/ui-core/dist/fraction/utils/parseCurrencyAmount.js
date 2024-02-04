"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryParseCurrencyAmount = exports.parseCurrencyAmount = void 0;
const ethers_1 = require("ethers");
const currencyAmount_1 = require("../currencyAmount");
function parseCurrencyAmount(currency, value) {
    const typedValueParsed = ethers_1.utils.parseUnits(value, currency.decimals);
    return currencyAmount_1.CurrencyAmount.fromRawAmount(currency, typedValueParsed.toHexString());
}
exports.parseCurrencyAmount = parseCurrencyAmount;
function tryParseCurrencyAmount(currency, value) {
    if (currency === undefined || value === undefined)
        return undefined;
    try {
        return parseCurrencyAmount(currency, value);
    }
    catch (_a) {
        //
    }
    return undefined;
}
exports.tryParseCurrencyAmount = tryParseCurrencyAmount;
