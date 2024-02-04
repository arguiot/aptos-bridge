"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBigInt = exports.toBigNumber = void 0;
const ethers_1 = require("ethers");
function toBigNumber(amount) {
    return ethers_1.BigNumber.from(amount.quotient.toString());
}
exports.toBigNumber = toBigNumber;
function toBigInt(amount) {
    return BigInt(amount.quotient.toString());
}
exports.toBigInt = toBigInt;
