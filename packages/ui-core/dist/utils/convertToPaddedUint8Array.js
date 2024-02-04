"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToPaddedUint8Array = void 0;
function convertToPaddedUint8Array(str, length) {
    const value = str
        .replace(/^0x/i, '')
        .match(/.{1,2}/g)
        .map((byte) => parseInt(byte, 16));
    const result = Uint8Array.from([...new Array(length - value.length).fill(0), ...value]);
    return result;
}
exports.convertToPaddedUint8Array = convertToPaddedUint8Array;
