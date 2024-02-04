"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bpToFraction = void 0;
const fraction_1 = require("../fraction");
function bpToFraction(bp, decimals = 4) {
    return new fraction_1.Fraction(bp.toNumber(), 10 ** decimals);
}
exports.bpToFraction = bpToFraction;
