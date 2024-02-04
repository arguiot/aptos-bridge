"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryParseFraction = exports.parseFraction = void 0;
const ethers_1 = require("ethers");
const fraction_1 = require("../fraction");
function parseFraction(value, decimals) {
    const parsed = ethers_1.utils.parseUnits(value, decimals);
    const denominator = 10 ** decimals;
    return new fraction_1.Fraction(parsed.toHexString(), denominator);
}
exports.parseFraction = parseFraction;
function tryParseFraction(value, decimals = 4) {
    if (value === undefined)
        return undefined;
    try {
        return parseFraction(value, decimals);
    }
    catch (_a) {
        //
    }
    return undefined;
}
exports.tryParseFraction = tryParseFraction;
