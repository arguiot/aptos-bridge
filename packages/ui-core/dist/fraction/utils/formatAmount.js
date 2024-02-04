"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatFiatAmount = exports.formatCurrencyAmount = exports.formatAmount = void 0;
const currencyAmount_1 = require("../currencyAmount");
function formatAmount(amount) {
    if (amount instanceof currencyAmount_1.CurrencyAmount) {
        return formatCurrencyAmount(amount);
    }
}
exports.formatAmount = formatAmount;
formatAmount.nice = (amount) => {
    if (amount instanceof currencyAmount_1.CurrencyAmount) {
        return formatCurrencyAmount.nice(amount);
    }
};
function formatCurrencyAmount(value) {
    return value.toExact();
}
exports.formatCurrencyAmount = formatCurrencyAmount;
formatCurrencyAmount.short = (value, dp = 1) => {
    if (!value)
        return '-';
    const formatted = formatCurrencyAmount(value);
    try {
        const number = parseFloat(formatted);
        if (number > 1e6) {
            const m = number / 1e6;
            return (m.toLocaleString('en-US', {
                maximumFractionDigits: dp,
                minimumFractionDigits: 1,
            }) + 'M');
        }
        return number.toLocaleString('en-US', {
            maximumFractionDigits: dp,
            minimumFractionDigits: 1,
        });
    }
    catch (_a) {
        const [whole, rest = '0'] = formatted.split('.');
        return whole + '.' + rest.substr(0, dp);
    }
};
const niceFormat = { groupSeparator: ',' };
formatCurrencyAmount.nice = (value, dp = 2) => {
    if (!value)
        return '-';
    // todo: workaround for serialization of tokens
    if (!value.toFixed)
        return '-';
    return value.toFixed(dp, niceFormat);
};
function formatFiatAmount(amount) {
    return amount.value.toLocaleString('en-US', {
        currency: amount.currency,
        style: 'currency',
    });
}
exports.formatFiatAmount = formatFiatAmount;
formatFiatAmount.nice = (amount) => {
    if (!amount)
        return '-';
    return formatFiatAmount(amount);
};
formatFiatAmount.short = (value, currency = 'USD') => {
    if (value >= 1e6) {
        const m = value / 1e6;
        return (m.toLocaleString('en-US', {
            currency,
            style: 'currency',
            maximumFractionDigits: 1,
        }) + 'M');
    }
    return value.toLocaleString('en-US', {
        currency,
        style: 'currency',
    });
};
