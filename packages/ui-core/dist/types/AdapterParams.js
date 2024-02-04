"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdapterParams = void 0;
const assert_1 = __importDefault(require("assert"));
const ethers_1 = require("ethers");
const toBigNumber_1 = require("../fraction/utils/toBigNumber");
class AdapterParams {
    constructor(version, extraGas = 200000, dstNativeAmount, dstNativeAddress) {
        this.version = version;
        this.extraGas = extraGas;
        this.dstNativeAmount = dstNativeAmount;
        this.dstNativeAddress = dstNativeAddress;
    }
    static forV1(extraGas) {
        return new AdapterParams(1, extraGas);
    }
    static forV2(input) {
        (0, assert_1.default)(input.dstNativeAmount);
        (0, assert_1.default)(input.dstNativeAddress);
        return new AdapterParams(2, input.extraGas, input.dstNativeAmount, input.dstNativeAddress);
    }
    create(input) {
        var _a;
        if ((_a = input.dstNativeAmount) === null || _a === void 0 ? void 0 : _a.greaterThan(1)) {
            return AdapterParams.forV1(input.extraGas);
        }
        else {
            (0, assert_1.default)(input.dstNativeAddress);
            (0, assert_1.default)(input.dstNativeAmount);
            //@ts-ignore
            return AdapterParams.forV2(input);
        }
    }
    serialize() {
        if (this.version === 1) {
            return ethers_1.utils.solidityPack(['uint16', 'uint256'], [1, this.extraGas]);
        }
        else {
            return ethers_1.utils.solidityPack(['uint16', 'uint', 'uint', 'address'], [2, this.extraGas, (0, toBigNumber_1.toBigNumber)(this.dstNativeAmount), this.dstNativeAddress]);
        }
    }
}
exports.AdapterParams = AdapterParams;
