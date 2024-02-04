"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAndParseAddress = void 0;
const utils_1 = require("ethers/lib/utils");
const chainType_1 = require("../../network/chainType");
function validateAndParseAddress(address, chainId) {
    if ((0, chainType_1.isEvmChainId)(chainId)) {
        return (0, utils_1.getAddress)(address);
    }
    return address;
}
exports.validateAndParseAddress = validateAndParseAddress;
