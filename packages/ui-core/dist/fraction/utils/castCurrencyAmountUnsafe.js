"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.castCurrencyAmountUnsafe = void 0;
const currencyAmount_1 = require("../currencyAmount");
function castCurrencyAmountUnsafe(input, dstCurrency) {
    const srcCurrency = input.currency;
    if (srcCurrency.decimals === dstCurrency.decimals) {
        return currencyAmount_1.CurrencyAmount.fromRawAmount(dstCurrency, input.quotient);
    }
    return currencyAmount_1.CurrencyAmount.fromRawAmount(dstCurrency, input.quotient)
        .multiply(10 ** dstCurrency.decimals)
        .divide(10 ** srcCurrency.decimals);
}
exports.castCurrencyAmountUnsafe = castCurrencyAmountUnsafe;
