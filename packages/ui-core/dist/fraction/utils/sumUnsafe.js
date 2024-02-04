"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sumFiat = exports.sumUnsafe = void 0;
const parseCurrencyAmount_1 = require("./parseCurrencyAmount");
function sumUnsafe(amounts, asCurrency) {
    if (!amounts || amounts.length === 0 || amounts.some((i) => !i)) {
        return undefined;
    }
    asCurrency = asCurrency !== null && asCurrency !== void 0 ? asCurrency : amounts[0].currency;
    let sum = 0;
    for (let amount of amounts) {
        const float = parseFloat(amount.toExact());
        sum += float;
    }
    if (!Number.isFinite(sum))
        return undefined;
    return (0, parseCurrencyAmount_1.tryParseCurrencyAmount)(asCurrency, sum.toFixed(asCurrency.decimals));
}
exports.sumUnsafe = sumUnsafe;
function sumFiat(amounts) {
    if (!amounts || amounts.length === 0)
        return undefined;
    let sum = 0;
    const currency = amounts[0].currency;
    for (let amount of amounts) {
        if (!amount)
            return undefined;
        if (currency !== amount.currency)
            return undefined;
        sum += amount.value;
    }
    if (!Number.isFinite(sum))
        return undefined;
    return {
        currency,
        value: sum,
    };
}
exports.sumFiat = sumFiat;
