"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coin = void 0;
const baseCurrency_1 = require("./baseCurrency");
/**
 * Represents an Coin with some metadata.
 */
class Coin extends baseCurrency_1.BaseCurrency {
    constructor(chainId, decimals, symbol, name) {
        super(chainId, decimals, symbol, name);
    }
    /**
     * Returns true if the two Coins are equivalent, i.e. have the same chainId
     * @param other other currency to compare
     */
    equals(other) {
        if (!(other instanceof Coin))
            return false;
        return this.chainId === other.chainId;
    }
}
exports.Coin = Coin;
