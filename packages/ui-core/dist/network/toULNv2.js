"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toULNv2 = void 0;
const EXCEPTIONS = new Set([20008]);
function toULNv2(chainId) {
    if (EXCEPTIONS.has(chainId))
        return chainId;
    if (chainId < 100)
        return chainId + 100;
    if (chainId < 10000)
        return chainId;
    if (chainId < 10100)
        return chainId + 100;
    if (chainId < 20000)
        return chainId;
    if (chainId < 20100)
        return chainId + 100;
    return chainId;
}
exports.toULNv2 = toULNv2;
