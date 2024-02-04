"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAptosAddress = void 0;
function isAptosAddress(address) {
    // example : 0xcd7b679af797fc8fca9cda616d10bd8fec94f4fd7ecb86e8cffe5514bad537f6
    if (typeof address !== 'string')
        return false;
    if (!address.startsWith('0x'))
        return false;
    if (address.length !== 66)
        return false;
    return true;
}
exports.isAptosAddress = isAptosAddress;
