"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const validateAndParseAddress_1 = require("./utils/validateAndParseAddress");
const baseCurrency_1 = require("./baseCurrency");
/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
class Token extends baseCurrency_1.BaseCurrency {
    constructor(chainId, address, decimals, symbol, name) {
        super(chainId, decimals, symbol, name);
        this.address = (0, validateAndParseAddress_1.validateAndParseAddress)(address, chainId);
    }
    /**
     * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
     * @param other other token to compare
     */
    equals(other) {
        if (!(other instanceof Token))
            return false;
        return this.chainId === other.chainId && this.address === other.address;
    }
}
exports.Token = Token;
