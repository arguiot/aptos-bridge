"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCurrency = void 0;
const assert_1 = __importDefault(require("assert"));
/**
 * A currency is any fungible financial instrument, including all ERC20 tokens
 */
class BaseCurrency {
    /**
     * Constructs an instance of the base class `BaseCurrency`.
     * @param chainId the chain ID on which this currency resides
     * @param decimals decimals of the currency
     * @param symbol symbol of the currency
     * @param name of the currency
     */
    constructor(chainId, decimals, symbol, name) {
        (0, assert_1.default)(Number.isSafeInteger(chainId), 'CHAIN_ID');
        (0, assert_1.default)(decimals >= 0 && decimals < 255 && Number.isInteger(decimals), 'DECIMALS');
        this.chainId = chainId;
        this.decimals = decimals;
        // workaround
        this.symbol = symbol;
        this.name = name;
    }
}
exports.BaseCurrency = BaseCurrency;
