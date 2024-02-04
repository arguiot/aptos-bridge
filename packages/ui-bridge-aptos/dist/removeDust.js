"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeDust = void 0;
const ui_core_1 = require("@layerzerolabs/ui-core");
function removeDust(amount) {
    const sd = 6;
    const ld = amount.currency.decimals;
    const diff = ld - sd;
    if (diff > 0) {
        return ui_core_1.CurrencyAmount.fromRawAmount(amount.currency, amount.divide(10 ** diff).quotient).multiply(10 ** diff);
    }
    return amount;
}
exports.removeDust = removeDust;
