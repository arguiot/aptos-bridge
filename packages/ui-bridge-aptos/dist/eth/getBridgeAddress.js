"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBridgeAddress = exports.BRIDGE_ADDRESS = void 0;
const lz_sdk_1 = require("@layerzerolabs/lz-sdk");
const assert_1 = __importDefault(require("assert"));
exports.BRIDGE_ADDRESS = {
    [lz_sdk_1.ChainId.ETHEREUM]: '0x50002CdFe7CCb0C41F519c6Eb0653158d11cd907',
    [lz_sdk_1.ChainId.ARBITRUM]: '0x1BAcC2205312534375c8d1801C27D28370656cFf',
    [lz_sdk_1.ChainId.AVALANCHE]: '0xA5972EeE0C9B5bBb89a5B16D1d65f94c9EF25166',
    [lz_sdk_1.ChainId.BSC]: '0x2762409Baa1804D94D8c0bCFF8400B78Bf915D5B',
    [lz_sdk_1.ChainId.OPTIMISM]: '0x86Bb63148d17d445Ed5398ef26Aa05Bf76dD5b59',
    [lz_sdk_1.ChainId.POLYGON]: '0x488863D609F3A673875a914fBeE7508a1DE45eC6',
    [lz_sdk_1.ChainId.GOERLI]: '0x7Cff4181f857B06114643D495648A95b3E0B0B81',
    [lz_sdk_1.ChainId.GOERLI_SANDBOX]: '0x9275FA87c440514E96357c9B0d518Bc9ac041e03',
    [lz_sdk_1.ChainId.FUJI]: '0x2aFD0d8A477AD393D2234253407Fb1cec92749D1',
};
function getBridgeAddress(chainId) {
    const address = exports.BRIDGE_ADDRESS[chainId];
    (0, assert_1.default)(address, `NO BRIDGE_ADDRESS FOR ${chainId}`);
    return address;
}
exports.getBridgeAddress = getBridgeAddress;
